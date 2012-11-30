#pragma strict

enum AIType { aggressive, defensive, passive };


var type : AIType;


private var Colliders : Collider[];
private var attack : Attack;
private var attributes : Attributes;
private var mouseControl : MouseControl;

function Start () {
	attack = gameObject.GetComponent(Attack);
	attributes = gameObject.GetComponent(Attributes);
	mouseControl = GameObject.Find("GlobalScripts").GetComponent(MouseControl);
}

function Update () {
	// aggressive strategy
	if(type == AIType.aggressive && attack.getTarget() == null && 
		(gameObject.GetComponent(Moving) == null || !gameObject.GetComponent(Moving).isMoving()) ) {
		// find next victim
		Colliders = Physics.OverlapSphere(transform.position, attributes.sightRange, 1);
		for (var c : Collider in Colliders){
			if(c.gameObject.tag != gameObject.tag) {
				gameObject.SendMessage(mouseControl.attackMethode, c.gameObject, SendMessageOptions.DontRequireReceiver);
			}
		}
	}
}

function OnAttacked(attacker: GameObject) {
	var dist = (attacker.transform.position - transform.position).magnitude;
	if(type == AIType.defensive || type == AIType.aggressive) {
		if(attributes.sightRange >= dist)
			gameObject.SendMessage(mouseControl.attackMethode, attacker, SendMessageOptions.DontRequireReceiver);
	}
}