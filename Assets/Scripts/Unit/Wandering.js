#pragma strict


var wanderAround = true;
var directionChangeIntervall = 5.0;
var maxDirectionChangeDegree = 90.0;
var area : GameObject;
private var moving : Moving;
private var nextChange : float = 0.0;
private var attributes : Attributes;
private var attack : Attack;

function Start () {
	moving = gameObject.GetComponent(Moving);
	attributes = gameObject.GetComponent(Attributes);
	attack = gameObject.GetComponent(Attack);
}

function Update () {
	if (wanderAround && attack.getTarget() == null && (!moving.isMoving() || Time.time >= nextChange)){
		var dir : Vector3; 
		var rot : Quaternion;
		var moveTo : Vector3;
		var sightRange : float = attributes.sightRange;
		
		do{
			dir = gameObject.transform.forward;
			rot  = Quaternion.AngleAxis(Random.Range(-maxDirectionChangeDegree, maxDirectionChangeDegree), Vector3.up);
			dir = rot * dir * sightRange;
			moveTo = transform.position + dir;
			sightRange -= 0.1;
		}while(!area.collider.bounds.Contains(moveTo));
		
		gameObject.SendMessage(MouseControl.moveMethode, moveTo, SendMessageOptions.DontRequireReceiver);
		
		nextChange = Time.time + directionChangeIntervall;
	}
}



@script RequireComponent(Moving)
@script RequireComponent(Attributes)