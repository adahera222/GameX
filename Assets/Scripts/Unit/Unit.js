#pragma strict
#pragma downcast

private var ui : UserInterface;
private var attributes : Attributes;

function Start () {
	attributes = gameObject.GetComponent(Attributes);
	ui = GameObject.Find("GlobalScripts").GetComponent(UserInterface);
}

function Update () {

}


function OnSelection(obj : GameObject) {
	ui.visible = true;
}
function OnDeselection(obj : GameObject) {
	ui.visible = false;
}

function OnDrawGizmos(){
	if (attributes != null){
		Gizmos.color = Color.blue;
		Gizmos.DrawWireSphere(transform.position, attributes.sightRange);
	}
}


@script RequireComponent(Attributes)