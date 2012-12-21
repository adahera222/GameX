#pragma strict
#pragma downcast

private var actionBar : ActionBar;
private var statsBar : UnitStatsBar;
private var drawActionBar = false;
private var sObj : GameObject;
private var attributes : Attributes;
private var money : Money;
private var needToPlace : GameObject = null;
private var tempPlaced : GameObject = null;

function Start () {
	actionBar = GameObject.Find("GlobalScripts").GetComponent(ActionBar);
	statsBar = GameObject.Find("GlobalScripts").GetComponent(UnitStatsBar);
	attributes = gameObject.GetComponent(Attributes);
	money = GameObject.Find("PlayerScripts").GetComponent(Money);
}

function Update () {
	if(needToPlace != null) {
		var pos : Vector3 = getCurrentPoint();	
		pos.y += needToPlace.collider.bounds.center.y;
		tempPlaced.transform.position = pos;

		if(Input.GetMouseButtonDown(0)) {
			needToPlace = null;
			tempPlaced = null;
		}
	}
}

function OnGUI() {
	if(drawActionBar) {
		var mm : MiniMap = GameObject.Find("MinimapCamera").GetComponent(MiniMap);
		GUI.Box(Rect(mm.minimapTexture.width, Screen.height-actionBar.style.fixedHeight, 0, 0), attributes.unitName, actionBar.style);
		
		// show unit stats
		if(attributes.unitType == UnitType.Unit) {
			GUI.Box(Rect(Screen.width-statsBar.style.fixedWidth, Screen.height-statsBar.style.fixedHeight, 0, 0), "", statsBar.style);
			
			GUI.BeginGroup(Rect(
				Screen.width-statsBar.style.fixedWidth+statsBar.style.padding.left, 
				Screen.height-statsBar.style.fixedHeight+statsBar.style.padding.top, 
				statsBar.style.fixedWidth-statsBar.style.padding.right, 
				statsBar.style.fixedHeight-statsBar.style.padding.bottom
			));
				
				GUI.Label(Rect(0,0, 50, 20), "TODO:", statsBar.statsStyle); GUI.Label(Rect(80, 0, 40, 20), "20", statsBar.statsStyle);
				GUI.Label(Rect(0,30, 50, 20), "TODO:", statsBar.statsStyle); GUI.Label(Rect(80, 30, 40, 20), "200", statsBar.statsStyle);
				
			GUI.EndGroup();
		} else if(attributes.unitType == UnitType.Building) {

			// draw building actions

			var mB : MainBuilding = gameObject.GetComponent(MainBuilding);

			GUILayout.BeginArea (Rect(mm.minimapTexture.width+40, Screen.height-50, 480, 40));
			GUILayout.BeginHorizontal();

			if(mB != null) {
				for(var gO : GameObject in mB.objectsCanCreate) {
					var unitAttributes : Attributes = gO.GetComponent(Attributes);
					if(GUILayout.Button(unitAttributes.unitName)) {
						if(money.Pay(unitAttributes.cost)) {
							var pos : Vector3;
							if (!mB.mustPlace){
								pos = gameObject.transform.position + mB.spawn;
								pos.y = gO.GetComponent(Attributes).spawnHeight;
								Instantiate (gO, pos, gO.transform.rotation);
							}else{
								pos.y = gO.GetComponent(Attributes).spawnHeight;
								needToPlace = gO;
								tempPlaced = Instantiate (gO, pos, gO.transform.rotation);						
							}
						}
						else {
							// TODO show message that not enaught money
							Debug.Log("TODO: Not enaugh money");
						}
					}
				}
			}

			GUILayout.EndHorizontal();
			GUILayout.EndArea();
		}
	}
}

function getCurrentPoint() : Vector3{
	var ray = Camera.main.ScreenPointToRay(Input.mousePosition);
	var hit : RaycastHit;
	var layerMask = 1 << 8;
	if(Physics.Raycast(ray, hit, Mathf.Infinity, layerMask)){
		return hit.point;
	}
	return;
};

function OnSelection(obj : GameObject) {
	drawActionBar = true;
	sObj = obj;
}
function OnDeselection(obj : GameObject) {
	drawActionBar = false;
	sObj = null;
}

function OnDrawGizmos(){
	if (attributes != null){
		Gizmos.color = Color.blue;
		Gizmos.DrawWireSphere(transform.position, attributes.sightRange);
	}
}


@script RequireComponent(Attributes)