#pragma strict
#pragma downcast

var speed = 1.0;
var border = 30.0;
var angle = 40.0;
var maxAngle = 90.0;
var minAngle = 10.0;
var cam : Camera;
var area : GameObject;
private var actualDistance : float;


// Draw Global Stats
function OnGUI() {
	var money : Money = GameObject.Find("PlayerScripts").GetComponent("Money");
	var globalBar : GlobalStats = GameObject.Find("GlobalScripts").GetComponent("GlobalStats");
	var today = System.DateTime.Now;
	
	if(area == null) {
		area = gameObject.Find("Area_All");
	}
	
	GUI.Box(Rect(Screen.width - globalBar.style.fixedWidth - 80, 0, 0, 0), "", globalBar.style);
	GUI.Label(Rect(Screen.width-485, 8, 160, 20), "GELD: "+money.Get(), globalBar.textStyle);
	GUI.Label(Rect(Screen.width-295, 8, 160, 20), "ZEIT: "+today.ToString("HH:mm:ss"), globalBar.textStyle);
}

function Start () {
	actualDistance = cam.transform.position.y - getPoint().y;
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
		move((Vector3.back).normalized);
	}
	//up
	if (Input.mousePosition.y >= Screen.height - border || Input.GetAxis("ScrollVertical") > 0){
		move((Vector3.forward).normalized);
	}
	
	//Zoom
	if (Input.GetAxis("Mouse ScrollWheel") != 0){
		Zoom(Input.GetAxis("Mouse ScrollWheel")*speed);
	}
	
	//Rotate
	if (Input.GetButton("Rotate")){
		Rotate(Input.GetAxis("Mouse X"));
	}
}

function move(direction : Vector3){
	var quat = Quaternion.AngleAxis(cam.transform.eulerAngles.y, Vector3.up);
	var dir = quat * direction  * Time.deltaTime * speed;
	cam.transform.Translate(dir, Space.World);
	//höhe zum Boden halten... ist noch zu überarbeiten.
	cam.transform.position.y = getPoint().y + actualDistance;
	
	
	if (!IsInside(area.collider, getPoint())){
		move(-1*direction);
	}
}

/*
* Rotiert die Kamera auf einer Halbkugel nach oben/unten.
* speed: Die Stärke der Änderung.
*/
function Zoom(speed : float){	
	if (cam.transform.rotation.eulerAngles.x + speed >= minAngle
		&& cam.transform.rotation.eulerAngles.x + speed <= maxAngle){
		cam.transform.RotateAround(getPoint(), cam.transform.right, speed);
		actualDistance = cam.transform.position.y - getPoint().y;
	}
}

/*
* Rotiert die Kamera auf einer Halbkugel nach links/rechts.
*/
function Rotate(speed : float){
	cam.transform.RotateAround(getPoint(), Vector3.up, speed);
}

/*
* Gibt den Punkt auf dem Boden der in der Mitte des Bildschirms ist zurück.
*/
function getPoint() : Vector3{
	var middle = Vector2(Screen.width/2, Screen.height/2);
	var ray = Camera.main.ScreenPointToRay(middle);
	var hit : RaycastHit;
	var layerMask = 1 << 8;
	if(Physics.Raycast(ray, hit, Mathf.Infinity, layerMask)){
		return hit.point;
	}
	return;
};

function OnDrawGizmosSelected() {
	Gizmos.color = Color.yellow;
	Gizmos.DrawSphere(getPoint(), 0.2);
}

function IsInside(collider : Collider, point : Vector3) : boolean{
	var center : Vector3 = collider.bounds.center;
	var direction : Vector3 = center - point;
	var ray : Ray = new Ray(point, direction);
	var hitinfo : RaycastHit;
	
	return !collider.Raycast(ray, hitinfo, direction.magnitude);
}