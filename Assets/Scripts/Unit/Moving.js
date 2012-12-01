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
		//ein bisschen in die Richtung des Ziels rotieren
		transform.rotation = Quaternion.Slerp(transform.rotation, Quaternion.LookRotation(lookat), .1);
		
		
		var dir = transform.TransformDirection(Vector3.forward);
		
		var maxExtend = Mathf.Max(gameObject.collider.bounds.extents.x, gameObject.collider.bounds.extents.z);
		
		//Ray-Reichweite festlegen:
		//lange Strahlen: Teilweise gut, auf freier Fläche mit Hinternissen schöne Wege. Findet nicht den Weg in enge, kurvige Gänge zu einem Raum
		//var range = Mathf.Min(attributes.sightRange, Vector3.Distance(transform.position, moveTo));
		
		//kurze Strahlen: Teilweise gut, findet Weg in enge, kurvige Gänge, aber nicht mehr aus Räumen raus. Weicht Hindernissen spät aus.
		var range = Mathf.Min(maxExtend*3, Vector3.Distance(transform.position, moveTo));
		
		if ((moveTo - transform.position).sqrMagnitude < 1.1){
			move = false;
			return;
		}
		
		var left = transform.TransformDirection(Vector3.left) * maxExtend;
		var moveOk = false;
		
		if (Physics.Raycast(transform.position, dir, range) ||
			Physics.Raycast(transform.position + left, dir, range) || 
			Physics.Raycast(transform.position - left, dir, range)){
			//etwas ist im Weg
			
			for (var i = 1; i<=150; i++){
				if (TestWay(dir, i, range, left)){
					transform.Rotate(0, i, 0);
					dir = transform.TransformDirection(Vector3.forward);
					moveOk = true;
					break;
				}else if (TestWay(dir, -i, range, left)){
					transform.Rotate(0, -i, 0);
					dir = transform.TransformDirection(Vector3.forward);
					moveOk = true;
					break;
				}
			}
		}else{
			//nichts ist im Weg
			moveOk = true;
		}
		
		if (moveOk){
			Debug.DrawRay(transform.position, dir*range, Color.blue);
			Debug.DrawRay(transform.position + left, dir*range, Color.blue);
			Debug.DrawRay(transform.position - left, dir*range, Color.blue);
			dir.y -= 1;
			cc.Move(dir * speed * Time.deltaTime);
		}
		
	}
}

function TestWay(dir : Vector3, deg : float, range : float, left : Vector3) : boolean{
	var quat : Quaternion = Quaternion.AngleAxis(deg, Vector3.up);
	var newDir = quat * dir;
	
	
	
	if (Physics.Raycast(transform.position, newDir, range) ||
		Physics.Raycast(transform.position + left, newDir, range) || 
		Physics.Raycast(transform.position - left, newDir, range)){
		return false;
	}
	
	return true;
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