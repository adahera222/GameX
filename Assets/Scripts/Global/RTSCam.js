#pragma strict

var speed = 1;
var border = 30;
var angle = 40;
var maxAngle = 90;
var minAngle = 10;
var cam : Camera;

function Start () {
	cam.transform.eulerAngles.x = angle;
}

function Update () {
	//left
	if (Input.mousePosition.x <= border || Input.GetAxis("ScrollHorizontal") < 0){
		cam.transform.position.x = cam.transform.position.x - Time.deltaTime*speed;
	}
	//right
	if (Input.mousePosition.x >= Screen.width - border || Input.GetAxis("ScrollHorizontal") > 0){
		cam.transform.position.x = cam.transform.position.x + Time.deltaTime*speed;
	}
	//down
	if (Input.mousePosition.y <= border || Input.GetAxis("ScrollVertical") < 0){
		cam.transform.position.z = cam.transform.position.z - Time.deltaTime*speed;
	}
	//up
	if (Input.mousePosition.y >= Screen.height - border || Input.GetAxis("ScrollVertical") > 0){
		cam.transform.position.z = cam.transform.position.z + Time.deltaTime*speed;
	}
	
	//Zoom
	if (Input.GetAxis("Mouse ScrollWheel") != 0){
		Zoom(Input.GetAxis("Mouse ScrollWheel"));
	}
}


function Zoom(speed : float){
	//TODO: min/max Distanz vom Boden
	cam.transform.position.y -= speed;
	var newAngle = cam.transform.eulerAngles.x - 10*speed;
	newAngle = Mathf.Min(Mathf.Max(newAngle, minAngle), maxAngle);
	cam.transform.eulerAngles.x = newAngle;
}