#pragma strict

private var speed = 1.0;

private var move = false;
private var moveTo : Vector3;
private var cc : CharacterController;

function Start () {
	cc = gameObject.GetComponent(CharacterController);
	var attr : Attributes = gameObject.GetComponent(Attributes);
	speed = attr.moveSpeed;
}

function Update () {
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

function OnMoveTo(goal : Vector3){
	moveTo = goal;
	move = true;
}

function OnStopMovement(go : GameObject){
	move = false;
}

function isMoving() {
	return move;
}

@script RequireComponent(CharacterController)
@script RequireComponent(Attributes)