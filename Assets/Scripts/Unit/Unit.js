#pragma strict
#pragma downcast

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
}
function OnDeselection(obj : GameObject) {
	ui.visible = false;
	projector.enabled = false;
}

function OnDrawGizmos(){
	if (attributes != null){
		Gizmos.color = Color.blue;
		Gizmos.DrawWireSphere(transform.position, attributes.sightRange);
	}
}

function OnDeath(){
	OnDeselection(null);
	tag = "Untagged";
	Destroy(this);
}


@script RequireComponent(Attributes)