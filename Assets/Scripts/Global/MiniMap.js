#pragma strict

var minimapTexture : Texture;

function Start () {

}

function Update () {
	camera.pixelRect = Rect(10, 10, 200, 200); 
}

function OnGUI () {
    if(!minimapTexture){
        Debug.LogError("Assign a Texture in the inspector.");
        return;
    }
	GUI.DrawTexture(new Rect(0, Screen.height - minimapTexture.height, minimapTexture.width, minimapTexture.height), minimapTexture);
}