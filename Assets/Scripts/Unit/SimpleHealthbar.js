#pragma strict

var healthBar : GameObject;
var healthbarWidth = 20;
private var myHB : GameObject;
private var attributes : Attributes;

function Start () {
	attributes = gameObject.GetComponent(Attributes);
	myHB = Instantiate(healthBar, transform.position, transform.rotation);
	
}

function Update () {
	myHB.transform.position = Camera.main.WorldToViewportPoint(transform.position);
	myHB.transform.localScale = Vector3.zero;
	
	var percent : float = attributes.hitpoints/attributes.maxHitpoints;
	if (percent < 0){
		percent = 0;
	}else if (percent > 1){
		percent = 1;
	}
	var width = healthbarWidth * percent;
	myHB.guiTexture.pixelInset = Rect(10, 10, width, 5);
}

@script RequireComponent(Attributes)