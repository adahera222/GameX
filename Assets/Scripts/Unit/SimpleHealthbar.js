#pragma strict

var healthBar : GameObject;
var healthbarWidth = 20;
var color : Color = Color.green;
private var myHB : GameObject;
private var attributes : Attributes;
private var hidden = false;

function Start () {
	attributes = gameObject.GetComponent(Attributes);
	myHB = Instantiate(healthBar, transform.position, transform.rotation);
	SetColor(color);
}

function Update () {
	if (!hidden){
		myHB.transform.position = Camera.main.WorldToViewportPoint(transform.position);
		myHB.transform.localScale = Vector3.zero;
		
		var percent : float = attributes.hitpoints/attributes.maxHitpoints;
		if (percent < 0){
			percent = 0;
		}else if (percent > 1){
			percent = 1;
		}
		var width = healthbarWidth * percent;
		if (myHB.transform.position.z >= 0){
			myHB.guiTexture.pixelInset = Rect(10, 10, width, 5);
		}else{
			myHB.guiTexture.pixelInset = Rect(10, 10, 0, 5);
		}
	}else{
		myHB.guiTexture.pixelInset = Rect(10, 10, 0, 5);
	}
}

function SetColor(c : Color){
	color = c;
	if (myHB){
		myHB.guiTexture.color = c;
	}
}

function Hide(){
	hidden = true;
}

function Show(){
	hidden = false;
}

function OnDeath(){
	Destroy(this);
}

@script RequireComponent(Attributes)