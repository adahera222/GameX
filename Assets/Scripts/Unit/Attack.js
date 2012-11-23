#pragma strict
#pragma downcast
var moveMethode = "OnMoveTo";
var stopMovementMethode = "OnStopMovement";
private var attributes : Attributes;
private var target : GameObject;
private var targetAttributes : Attributes;
private var nextTime : float = 0.0;
private var money : Money;
private var moveable = false;

function Start () {
	attributes = gameObject.GetComponent(Attributes);
	if (gameObject.tag == "Player"){
		money = GameObject.Find("PlayerScripts").GetComponent(Money);
	}
	if (gameObject.GetComponent(Moving) != null){
		moveable = true;
	}
}

function Update () {
	if (target && nextTime <= Time.time){
		var hits : RaycastHit[];
		var dir = target.transform.position - transform.position;
		hits = Physics.RaycastAll(transform.position, dir, attributes.attackRange);
		var hit = false;
		for (var i = 0; i < hits.Length; i++){
			if (hits[i].transform.gameObject == target){
				gameObject.SendMessage(stopMovementMethode, gameObject, SendMessageOptions.DontRequireReceiver);
				//Schaden machen
				var def : float = targetAttributes.defense;
				var damageFactor = attributes.DamageFactor(attributes.attackType, targetAttributes.defenseType);
				var dmg = Mathf.Max(1, damageFactor * attributes.attack * (1-def/(50+def)));
				if (targetAttributes.Damage(dmg)){
					money.Add(targetAttributes.valueOnKill);
				}
				nextTime = Time.time + 1/attributes.attackspeed;
				hit = true;
				break;
			}
		}
		if (!hit && moveable){
			var dist = dir.magnitude;
			var factor = 1 - attributes.attackRange / dist;
			var moveTo : Vector3 = Vector3.Lerp(transform.position, target.transform.position, factor);
			gameObject.SendMessage(moveMethode, moveTo, SendMessageOptions.DontRequireReceiver);
		}
	}
}

function OnAttack(obj : GameObject){
	if (gameObject.tag != obj.tag){
		targetAttributes = obj.GetComponent(Attributes);
		target = obj;
	}else{
		obj = null;
	}
}

function OnDrawGizmosSelected(){
	if (attributes != null){
		Gizmos.color = Color.green;
		Gizmos.DrawWireSphere(transform.position, attributes.attackRange);
	}
}


@script RequireComponent(Attributes)