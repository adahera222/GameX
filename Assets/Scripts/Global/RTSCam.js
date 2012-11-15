#pragma strict

var speed = 1.0;
var border = 30.0;
var angle = 40.0;
var minDistance = 1.0;
var maxDistance = 10.0;
var maxAngle = 90.0;
var minAngle = 10.0;
var cam : Camera;
private var actualDistance : float;

function Start () {
	cam.transform.eulerAngles.x = angle;
	
	var hitInfo : RaycastHit;
	var layerMask = 1 << 8;
	var pos = cam.transform.position;
	Physics.Raycast(Vector3(pos.x, pos.y, pos.z), -Vector3.up, hitInfo, Mathf.Infinity, layerMask);

	actualDistance = Vector2.Distance(pos, hitInfo.point);
	cam.transform.localEulerAngles.x = CalculateAngle();
}

function Update () {
	//left
	if (Input.mousePosition.x <= border || Input.GetAxis("ScrollHorizontal") < 0){
		move(Vector3.left);
	}
	//right
	if (Input.mousePosition.x >= Screen.width - border || Input.GetAxis("ScrollHorizontal") > 0){
		move(Vector3.right);
	}
	//down
	if (Input.mousePosition.y <= border || Input.GetAxis("ScrollVertical") < 0){
		move(Vector3.back);
	}
	//up
	if (Input.mousePosition.y >= Screen.height - border || Input.GetAxis("ScrollVertical") > 0){
		move(Vector3.forward);
	}
	
	//Zoom
	if (Input.GetAxis("Mouse ScrollWheel") != 0){
		Zoom(Input.GetAxis("Mouse ScrollWheel"));
	}
	
	//Rotate
	if (Input.GetButton("ScrollButton")){
		Rotate(Input.GetAxis("Mouse X"));
	}
	
	
	CorrectDistance();
}

function move(direction : Vector3){
	var relative = cam.transform.TransformDirection(direction);
	var dir = cam.transform.InverseTransformDirection(relative)  * Time.deltaTime * speed;
	cam.transform.Translate(dir);
}

/*
* Ändert die Distanz zum Boden und passt den Kamerawinkel entsprechend an.
* speed: Die Stärke der Änderung.
*/
function Zoom(speed : float){	
	var newDistance = actualDistance - speed;
	actualDistance = Mathf.Min(Mathf.Max(newDistance, minDistance), maxDistance);
	cam.transform.localEulerAngles.x = CalculateAngle();
}

/*
* Berechnet den richtigen Kamerawinkel für die aktuelle Distanz zum Boden.
*/
function CalculateAngle() : float{
	var steigung = (maxAngle - minAngle)/(maxDistance - minDistance);
	var nullpunkt = minAngle - minDistance*steigung;
	
	return (actualDistance * steigung + nullpunkt);
}

/*
* Setzt die Kamerahöhe so, dass die Distanz zum Boden der "actualDistance" entspricht.
*/
function CorrectDistance(){
	var hitInfo : RaycastHit;
	var layerMask = 1 << 8;
	var pos = cam.transform.position;
	
	if (Physics.Raycast(cam.transform.position, -Vector3.up, hitInfo, Mathf.Infinity, layerMask)){
		var dist = Vector2.Distance(pos, hitInfo.point);
		var abstand = actualDistance - dist;
		cam.transform.position.y += abstand;
	}else{
		cam.transform.position.y = actualDistance;
	}
}

function Rotate(speed : float){
	cam.transform.localEulerAngles.y += speed;
}