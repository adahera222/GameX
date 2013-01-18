#pragma strict

enum AIType { aggressive, defensive, passive, moveAgressive };


var type : AIType;


private var Colliders : Collider[];
private var attack : Attack;
private var attributes : Attributes;
private var mouseControl : MouseControl;
private var moving : Moving;
private var moveTo : Vector3;

function Start () {
	attack = gameObject.GetComponent(Attack);
	attributes = gameObject.GetComponent(Attributes);
	mouseControl = GameObject.Find("GlobalScripts").GetComponent(MouseControl);
	moving = gameObject.GetComponent(Moving);
	//moveTo = gameObject.transform.position;
}

function Update () {
	// aggressive strategy
	if(type == AIType.aggressive && attack.getTarget() == null && 
		(moving == null || !moving.isMoving()) ) {
		// find next victim
		Colliders = Physics.OverlapSphere(transform.position, attributes.sightRange, 1);
		for (var c : Collider in Colliders){
			if(c.gameObject.tag != gameObject.tag && c.gameObject.tag != "Untagged") {
				gameObject.SendMessage(mouseControl.attackMethode, c.gameObject, SendMessageOptions.DontRequireReceiver);
				break;
			}
		}
	}
	
	//Move Agressive
	if(type == AIType.moveAgressive && attack.getTarget() == null) {
		// find next victim
		var noVictim = true;
		Colliders = Physics.OverlapSphere(transform.position, attributes.sightRange, 1);
		for (var c : Collider in Colliders){
			if(c.gameObject.tag != gameObject.tag && c.gameObject.tag != "Untagged") {
				gameObject.SendMessage(mouseControl.attackMethode, c.gameObject, SendMessageOptions.DontRequireReceiver);
				noVictim = false;
				break;
			}
		}
		if (noVictim && moving != null && !moving.isMoving() && moving.GetMoveTo() != moveTo){
			gameObject.SendMessage(mouseControl.moveMethode, moveTo, SendMessageOptions.DontRequireReceiver);
		}
	}
}

function OnAttacked(attacker: GameObject) {
	var dist = (attacker.transform.position - transform.position).magnitude;
	if((type == AIType.defensive || type == AIType.aggressive) &&
		(moving == null || !moving.isMoving()) ) {
		if(attributes.sightRange >= dist)
			gameObject.SendMessage(mouseControl.attackMethode, attacker, SendMessageOptions.DontRequireReceiver);
	}
}

function OnMoveTo(goal : Vector3){
	if (goal != attack.getSentMoveTo()){
		moveTo = goal;
	}
}

function OnDeath(){
	Destroy(this);
}

@script RequireComponent(Attributes)
@script RequireComponent(Attack)