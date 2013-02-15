#pragma strict
#pragma downcast

var confirm : AudioClip;
var dying: AudioClip;

private var ui : UserInterface;
private var attributes : Attributes;
private var projector : Projector;

function Start () {
	attributes = gameObject.GetComponent(Attributes);
	ui = GameObject.Find("GlobalScripts").GetComponent(UserInterface);
	projector = transform.Find("Ring Projector").GetComponent(Projector);
}

function Update () {

}


function OnSelection(obj : GameObject) {
	ui.visible = true;
	projector.enabled = true;

	// set ignore raycast for other chars
	var mouseControl : MouseControl = GameObject.Find("GlobalScripts").GetComponent(MouseControl);
	if(mouseControl.formation != '') {
		SetLayerRecursively(gameObject, 2);
	}
}
function OnDeselection(obj : GameObject) {
	ui.visible = false;
	projector.enabled = false;

	// set default layer for other chars
	var mouseControl : MouseControl = GameObject.Find("GlobalScripts").GetComponent(MouseControl);
	if(mouseControl.formation != '') {
		SetLayerRecursively(gameObject, 0);
	}
}

function OnDrawGizmos(){
	if (attributes != null){
		Gizmos.color = Color.blue;
		Gizmos.DrawWireSphere(transform.position, attributes.sightRange);
	}
}

function SetLayerRecursively(obj : GameObject, newLayer) {
	if (null == obj || obj.name == 'minimapIcon')
		return;

	obj.layer = newLayer;

	for(var child : Transform in obj.transform) {
		if (null == child)
			continue;

		SetLayerRecursively(child.gameObject, newLayer);
	}
}

function OnDeath(){
	if(dying){
		var pos = transform.position;
		pos.y = GameObject.Find("Main Camera").transform.position.y;
		AudioSource.PlayClipAtPoint(dying, pos);
	}

	OnDeselection(null);
	tag = "Untagged";
	var minimapIcon : Transform = gameObject.transform.Find("minimapIcon");
	if (minimapIcon){
		minimapIcon.renderer.enabled = false;
	}
	collider.enabled = false;
	Destroy(this);
}

function OnMoveTo(goal : Vector3) {
	if(confirm && gameObject.tag == 'Player' && GetComponent(Attack) && GetComponent(Attack).getTarget() == null){
		var pos = transform.position;
		pos.y = GameObject.Find("Main Camera").transform.position.y;
		AudioSource.PlayClipAtPoint(confirm, pos);
	}
}


@script RequireComponent(Attributes)