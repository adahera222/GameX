#pragma strict
#pragma downcast


public static var reached : Hashtable = new Hashtable();

private var speed = 1.0;
private var animRatio = 0.1;
private var move = false;
private var moveTo : Vector3;
private var attributes : Attributes;
private var lastWPPos : Vector3[] = new Vector3[40];
private var lastWPRot : Quaternion[] = new Quaternion[40];
private var wp = 0;
private var disabledTurningTill : float = 0.0;


function Start () {
	attributes = gameObject.GetComponent(Attributes);
	speed = attributes.moveSpeed;
	animRatio = attributes.animRatio;
}

function Update () {
		Move();
}

function Move(){
	if (move){

		var lookat = moveTo;
		lookat.y = transform.position.y;
		lookat -= transform.position;

		//nur leicht zum Ziel drehen, wenn es nicht ausgeschaltet ist
		if (Time.time >= disabledTurningTill){
			transform.rotation = Quaternion.Slerp(transform.rotation, Quaternion.LookRotation(lookat), 0.1);
		}

		var dir = transform.forward;
		var maxExtend = Mathf.Max(gameObject.collider.bounds.extents.x, gameObject.collider.bounds.extents.z);
		var range : float;

		//Wenn das Drehen ausgeschaltet ist, die Reichweite senken um kleinere Löcher evtl. zu treffen
		if (Time.time >= disabledTurningTill){
			range = Mathf.Min(maxExtend*3, Vector3.Distance(transform.position, moveTo));
		}else{
			range = Mathf.Min(maxExtend*2, Vector3.Distance(transform.position, moveTo));
		}


		//Falls man nah genug am Ziel ist anhalten
		var countReached : int = reached[moveTo];

		if ((moveTo - transform.position).sqrMagnitude < Mathf.Pow((gameObject.collider.bounds.extents.y/2.0+maxExtend*countReached), (9/10.0)) ){
			if(reached.Contains(moveTo)) {
				var v : int;
				v = reached[moveTo];
				reached[moveTo] = v+1;
			}

			var animation : Animation = GetComponent(Animation);
			animation.Play("Idle", PlayMode.StopAll);
			move = false;
			//return;
		}

		var left = -transform.right * maxExtend;
		var moveOk = false;

		var dist1 = 0;
		var dist2 = 0;
		var maxDist = 0;
		var bestI = 0;

		if (Physics.Raycast(transform.position, dir, range) ||
			Physics.Raycast(transform.position + left, dir, range) ||
			Physics.Raycast(transform.position - left, dir, range)){
			//etwas ist im Weg
			for (var i = 1; i<=180; i++){
				dist1 = TestWay(dir, i, range, left).distance;
				if (dist1 < 0){
					transform.Rotate(0, i, 0);
					dir = transform.forward;
					moveOk = true;
					break;
				}else {
				dist2 = TestWay(dir, -i, range, left).distance;
					if (dist2 < 0){
						transform.Rotate(0, -i, 0);
						dir = transform.forward;
						moveOk = true;
						break;
					} else { // in door
						if(maxDist < Mathf.Max(dist1, dist2)) {

							maxDist = Mathf.Max(dist1, dist2);

							if(dist1 > dist2)
								bestI = i;
							else
								bestI = -i;
						}
					}
				}
			}

		}else{
			//nichts ist im Weg
			moveOk = true;
		}

		if(!moveOk) {
				transform.Rotate(0, bestI, 0);
				dir = transform.TransformDirection(Vector3.forward);
				moveOk = true;
		}

		Debug.DrawRay(transform.position, dir*range, Color.blue);
		Debug.DrawRay(transform.position + left, dir*range, Color.blue);
		Debug.DrawRay(transform.position - left, dir*range, Color.blue);
		dir.y = 0;
		//bewegen
		transform.position += dir*speed*Time.deltaTime;
		transform.position += Vector3(0, GetYOffset(), 0);


		//Waypoint setzen, falls man außerhalb des letzen ist.
	 	if (!gameObject.collider.bounds.Contains(lastWPPos[wp])){
	 		wp = (wp+1)%lastWPPos.length;
	 		lastWPPos[wp] = transform.position;
	 		lastWPRot[wp] = transform.rotation;
	 	}

	 	//alle Waypoints testen
	 	for (var x = 0; x < lastWPPos.length; x++){
	 		//Wenn sie nicht der aktuelle sind oder gleich wie der aktuelle
	 		//Und wir ihn aktuell berühren
	 		if (x != wp && lastWPPos[x] != lastWPPos[wp] &&
	 			gameObject.collider.bounds.Contains(lastWPPos[x])){

 				//Das "zum Ziel drehen" für 1,5 Sekunden ausschalten
 				//Die Zeit muss eigentlich abhängig von der Umgebung variable sein
 				//evtl. kann man das auch abhängig davon machen, welchen Waypoint man
 				//berührt hat?
 				disabledTurningTill = Time.time + 1.5;
 				//Die Rotation von dem Waypoint annehmen
 				transform.rotation = lastWPRot[x];

 				//Alle Waypoints auf die aktuelle Position setzen (sonst gibts lustiges hin und her gezitter!)
 				for (var y = 0; y < lastWPPos.length; y++){
					lastWPPos[y] = transform.position;
					lastWPRot[y] = transform.rotation;

	 			}
	 		}
	 	}

	}
}

function GetYOffset() : float{
	var hit : RaycastHit;
    if (Physics.Raycast (transform.position, -Vector3.up, hit)) {
        var distanceToGround = hit.distance;
        return attributes.spawnHeight - distanceToGround;
    }
	return 0.0;
}

function TestWay(dir : Vector3, deg : float, range : float, left : Vector3) : RaycastHit{
	var quat : Quaternion = Quaternion.AngleAxis(deg, Vector3.up);
	var newDir = quat * dir;
	var hitM : RaycastHit;
	var hitL : RaycastHit;
	var hitR : RaycastHit;

	Debug.DrawRay(transform.position, newDir*range, Color.blue);
	Debug.DrawRay(transform.position + left, newDir*range, Color.white);
	Debug.DrawRay(transform.position - left, newDir*range, Color.white);

	if (Physics.Raycast(transform.position, newDir, hitM, range) ||
		Physics.Raycast(transform.position + left, newDir, hitL, range) ||
		Physics.Raycast(transform.position - left, newDir, hitR, range)){

		if(hitM.distance == 0)
			hitM.distance = 99999999;
		if(hitL.distance == 0)
			hitL.distance = 99999999;
		if(hitR.distance == 0)
			hitR.distance = 99999999;



		if(hitM.distance > hitL.distance && hitM.distance > hitR.distance)
			return hitM;
		else if(hitL.distance > hitM.distance && hitL.distance > hitR.distance)
			return hitL;
		else if(hitR.distance > hitM.distance && hitR.distance > hitL.distance)
			return hitR;
		else if(hitR.distance > hitL.distance)
			return hitR;
		else
			return hitL;


	}

	// no hit, yea
	hitM = new RaycastHit();
	hitM.distance = -1;

	return hitM;
}

function OnMoveTo(goal : Vector3){
	moveTo = goal;

	//alle Waypoints auf die aktuelle Position setzen
	for (var i = 0; i < lastWPPos.length; i++){
		lastWPPos[i] = transform.position;
		lastWPRot[i] = transform.rotation;
	}
	//aktuellen Waypoint auf 0 setzen (kann man eigentlich auch lassen, dürfte egal sein)
	wp = 0;
	//zum Ziel gucken
	var lookat = moveTo;
	lookat.y = transform.position.y;
	//transform.LookAt(lookat);

	if(!reached.ContainsKey(moveTo))
		reached.Add(moveTo, 1);
	else
		reached[moveTo] = 1;

	//bewegung starten
	var animation : Animation = GetComponent(Animation);
	animation["walk"].speed = (speed+1)*animRatio;
	animation.Play("walk", PlayMode.StopAll);
	move = true;
}

function OnStopMovement(go : GameObject){
	var animation : Animation = GetComponent(Animation);
	animation.Play("Idle", PlayMode.StopAll);
	move = false;
}

function isMoving() {
	return move;
}

function GetMoveTo() : Vector3{
	return moveTo;
}

function OnDrawGizmos(){
	if (move){
		var maxExtend = Mathf.Max(gameObject.collider.bounds.extents.x, gameObject.collider.bounds.extents.z);
		var countReached : int = reached[moveTo];

		//Ziel als grüne Kugel:
		Gizmos.color = Color.green;
		Gizmos.DrawSphere(moveTo, .2);

		//alle Waypoints als weiße Kugeln. Wenn ein Waypoint berührt wird: rote Kugel
		for (var i = 0; i < lastWPPos.length; i++){
			if (!gameObject.collider.bounds.Contains(lastWPPos[i])){
				Gizmos.color = Color.white;
			}else{
				Gizmos.color = Color.red;
			}
			Gizmos.DrawSphere(lastWPPos[i], .1);
		}

		Gizmos.color = Color.cyan;

		Gizmos.DrawWireSphere(moveTo, Mathf.Pow((gameObject.collider.bounds.extents.y/2.0+maxExtend*countReached), (4.5/10.0)));
	}
}

function OnDeath(){
	var animation : Animation = GetComponent(Animation);
	animation.Stop();
	transform.localRotation.eulerAngles.x = 270;
	transform.position.y -= (attributes.spawnHeight - 0.1);
	if (GetComponent(Wandering))
		Destroy(GetComponent(Wandering));
	Destroy(this);
}

@script RequireComponent(Attributes)