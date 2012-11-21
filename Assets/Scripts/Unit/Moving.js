#pragma strict

var speed = 1.0;

private var move = false;
private var moveTo : Vector3;
private var cc : CharacterController;

function Start () {
	cc = gameObject.GetComponent(CharacterController);
}

function Update () {
	if (move){
		var dir = (moveTo - transform.position).normalized;
		var lookat = moveTo;
		lookat.y = transform.position.y;
		transform.LookAt(lookat);
		cc.Move(dir * speed * Time.deltaTime);
		if (dir.Equals(Vector3.down)){
			move = false;
		}
	}
}

function OnMoveTo(goal : Vector3){
	moveTo = goal;
	move = true;
}

@script RequireComponent(CharacterController)