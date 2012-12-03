#pragma strict

var oldMoveing = false;

private var speed = 1.0;
private var move = false;
private var moveTo : Vector3;
private var cc : CharacterController;
private var attributes : Attributes;

function Start () {
	cc = gameObject.GetComponent(CharacterController);
	attributes = gameObject.GetComponent(Attributes);
	speed = attributes.moveSpeed;
}

function Update () {
	if (oldMoveing){
		OldMove();
	}else{
		Move();
	}
	
}

function OldMove(){
	if (move){
		var dir = (moveTo - transform.position).normalized;
		var pos = (moveTo - transform.position).sqrMagnitude;
		var lookat = moveTo;
		lookat.y = transform.position.y;
		transform.LookAt(lookat);
		cc.Move(dir * speed * Time.deltaTime);
		//if (dir.Equals(Vector3.down)){
		if(pos < 1.1){
			move = false;
		}
	}
}

function Move(){
	//var hit : RaycastHit;
	if (move){
	
		var lookat = moveTo;
		lookat.y = transform.position.y;
		lookat -= transform.position;
		
		

		transform.rotation = Quaternion.Slerp(transform.rotation, Quaternion.LookRotation(lookat), 0.1);

		var dir = transform.TransformDirection(Vector3.forward);

		var maxExtend = Mathf.Max(gameObject.collider.bounds.extents.x, gameObject.collider.bounds.extents.z);
		
		//Ray-Reichweite festlegen:
		//lange Strahlen: Teilweise gut, auf freier Fläche mit Hinternissen schöne Wege. Findet nicht den Weg in enge, kurvige Gänge zu einem Raum
		//var range = Mathf.Min(attributes.sightRange, Vector3.Distance(transform.position, moveTo));
		
		//kurze Strahlen: Teilweise gut, findet Weg in enge, kurvige Gänge, aber nicht mehr aus Räumen raus. Weicht Hindernissen spät aus.
		var range = Mathf.Min(maxExtend*2, Vector3.Distance(transform.position, moveTo));

		
		if ((moveTo - transform.position).sqrMagnitude < 1.1){
			move = false;
			return;
		}
		
		var left = transform.TransformDirection(Vector3.left) * maxExtend;
		var moveOk = false;

		var dist1 = 0;
		var dist2 = 0;
		var maxDist = 0;
		var bestI = 0;
		
		if (Physics.Raycast(transform.position, dir, range) ||
			Physics.Raycast(transform.position + left, dir, range) || 
			Physics.Raycast(transform.position - left, dir, range)){
			//etwas ist im Weg

			// TODO: optimieren: divide and conquer ;)
			for(var j=0; j<=360; j+=45) {
				for (var i = j; i<=j+60; i += 2*(3/range)){

					dist1 = TestWay(dir, i, range*(1+i/8), left).distance;

					if ( dist1 < 0) {
						transform.Rotate(0, i, 0);
						dir = transform.TransformDirection(Vector3.forward);
						moveOk = true;
						break;
					} else {
						dist2 = TestWay(dir, -i, range*(1+i/8), left).distance;

						if (dist2 < 0){
							transform.Rotate(0, -i, 0);
							dir = transform.TransformDirection(Vector3.forward);
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
				if(moveOk)
					break;
			}
			
			if(!moveOk) {
				transform.Rotate(0, bestI, 0);
				dir = transform.TransformDirection(Vector3.forward);
				moveOk = true;
			}
		}else{
			//nichts ist im Weg
			moveOk = true;
		}
		
		if (moveOk){
			// Debug.DrawRay(transform.position, dir*range, Color.blue);
			// Debug.DrawRay(transform.position + left, dir*range, Color.blue);
			// Debug.DrawRay(transform.position - left, dir*range, Color.blue);

			dir.y -= 1;
			cc.Move(dir * speed * Time.deltaTime);
		}
		
	}
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
	
	if (!oldMoveing){
		var lookat = moveTo;
		lookat.y = transform.position.y;
		transform.LookAt(lookat);
	}
	
	move = true;
}

function OnStopMovement(go : GameObject){
	move = false;
}

function isMoving() {
	return move;
}

function OnDrawGizmos(){
	if (move){
		Gizmos.color = Color.green;
		Gizmos.DrawSphere(moveTo, .5);
	}
}

@script RequireComponent(CharacterController)
@script RequireComponent(Attributes)