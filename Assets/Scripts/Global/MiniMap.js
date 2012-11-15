#pragma strict

var minimapText : Texture;

function Start () {

}

function Update () {
	camera.pixelRect = Rect(0, 0, 200, 200); 
}

function OnGUI () {
	GUI.DrawTexture(new Rect(0, Screen.height - minimapText.height, minimapText.width, minimapText.height), minimapText);
}