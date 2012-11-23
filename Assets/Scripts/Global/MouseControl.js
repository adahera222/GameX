#pragma strict
#pragma downcast
var selectionMethode = "OnSelection";
var deselectionMethode = "OnDeselection";
var moveMethode = "OnMoveTo";
var attackMethode = "OnAttack";
var boxSelectionMinDistance = 10;
var boxColor = Color.green;
var multipleSelectTag = "Player";
var selected : GameObject[];
private var isDown = false;
private var startPos : Vector2;

function Start () {
	selected = new GameObject[0];
}

function Update () {
	var obj : GameObject;
	if (Input.GetButtonDown("Select")){
		isDown = true;
		startPos = Input.mousePosition;
	}
	if (Input.GetButtonUp("Select")){
		Select();
		isDown = false;
	}
	if (Input.GetButtonUp("Action")){
		Action();
	}
}

function Select(){
	//wenn die Box groß genug ist
	if ((Vector2.Distance(startPos, Input.mousePosition) >= boxSelectionMinDistance)){
		SelectMultiple(startPos, Input.mousePosition);
	}else{
		var obj : GameObject = GetClickedGameObject();
		if (obj != null){
			if (selected.Length > 0){
				for (var go : GameObject in selected){
					go.SendMessage(deselectionMethode, obj, SendMessageOptions.DontRequireReceiver);
				}
				selected = new GameObject[0];
			}
			obj.SendMessage(selectionMethode, obj, SendMessageOptions.DontRequireReceiver);
			selected = [obj];
		}
	}
}

function OnGUI(){
	//Wenn gedrückt ist den grünen Kasten zeichnen:
	if (isDown){
		var end = Event.current.mousePosition;
		//Screen-Koordinaten in GUI Koordinaten umrechnen. (Screen hat (0,0) unten links, GUI hat (0,0) oben Links)
		var start = startPos;
		start.y = Screen.height - start.y;
		if (Vector2.Distance(start, end) >= boxSelectionMinDistance){
			var box : Rect = Rect (Mathf.Min(start.x, end.x), Mathf.Min(start.y, end.y), Mathf.Abs(start.x - end.x), Mathf.Abs(start.y - end.y));
			DrawBox.DrawBox(box, boxColor, 1);
		}
	}
}

/*
* Raycast um herauszufinden welches GameObject angeklickt wurde.
*/
function GetClickedGameObject() : GameObject{
	var ray = Camera.main.ScreenPointToRay(Input.mousePosition);
	var hit : RaycastHit;
	if(Physics.Raycast(ray, hit)){
		return hit.transform.gameObject;
	}
	return null;
};


function SelectMultiple(start : Vector2, end : Vector2){
	var gos : GameObject[];
	gos = GameObject.FindGameObjectsWithTag(multipleSelectTag);
	
	//Box, die gezogen wurde
	var box : Rect;
	box = Rect (Mathf.Min(start.x, end.x), Mathf.Min(start.y, end.y), Mathf.Abs(start.x - end.x), Mathf.Abs(start.y - end.y));
	
	//Alle vorher ausgewählten Einheiten abwählen
	if (selected.Length > 0){
		for (var go : GameObject in selected){
			go.SendMessage(deselectionMethode, go, SendMessageOptions.DontRequireReceiver);
		}
	}
	//Alle Einheiten, die in der Box sind andwählen
	var sel = new Array();
	for (var go in gos){
		//Position des GameObjects in Screen-Koordinaten umwandeln
		var screenCoordinates = Camera.main.WorldToScreenPoint(go.transform.position);
		if (box.Contains(screenCoordinates)){
			sel.Push(go);
			go.SendMessage(selectionMethode, go, SendMessageOptions.DontRequireReceiver);
		}
	}
	selected = sel.ToBuiltin(GameObject);
}

function Action(){
	var obj = GetClickedGameObject();
	if (obj.GetComponent("Unit") != null){
		for (var go : GameObject in selected){
			go.SendMessage(attackMethode, obj, SendMessageOptions.DontRequireReceiver);
		}
	}else{
		var goal : Vector3 = getClickedPoint();
		for (var go : GameObject in selected){
			go.SendMessage(moveMethode, goal, SendMessageOptions.DontRequireReceiver);
		}
	}
}


function getClickedPoint() : Vector3{
	var ray = Camera.main.ScreenPointToRay(Input.mousePosition);
	var hit : RaycastHit;
	var layerMask = 1 << 8;
	if(Physics.Raycast(ray, hit, layerMask)){
		return hit.point;
	}
	return;
};