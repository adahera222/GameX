#pragma strict

private var actionBar : ActionBar;
private var statsBar : UnitStatsBar;
private var money : Money;
private var attributes : Attributes;
private var selected : GameObject[];
private var needToPlace : GameObject = null;
private var tempPlaced : GameObject = null;

public  var visible = false;

function Start () {
	actionBar = GameObject.Find("GlobalScripts").GetComponent(ActionBar);
	statsBar = GameObject.Find("GlobalScripts").GetComponent(UnitStatsBar);
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


function getCurrentPoint() : Vector3{
	var ray = Camera.main.ScreenPointToRay(Input.mousePosition);
	var hit : RaycastHit;
	var layerMask = 1 << 8;
	if(Physics.Raycast(ray, hit, Mathf.Infinity, layerMask)){
		return hit.point;
	}
	return;
};



function OnGUI() {
	if(visible) {
		selected = GameObject.Find("GlobalScripts").GetComponent(MouseControl).selected;
		if(selected[selected.Length-1] == null)
			return;

		attributes = selected[selected.Length-1].GetComponent(Attributes);

		var mm : MiniMap = GameObject.Find("MinimapCamera").GetComponent(MiniMap);
		GUI.Box(Rect(mm.minimapTexture.width, Screen.height-actionBar.style.fixedHeight, 0, 0), attributes.unitName, actionBar.style);

		// show unit stats

			GUI.Box(Rect(Screen.width-statsBar.style.fixedWidth, Screen.height-statsBar.style.fixedHeight, 0, 0), "", statsBar.style);

			GUI.BeginGroup(Rect(
				Screen.width-statsBar.style.fixedWidth+statsBar.style.padding.left,
				Screen.height-statsBar.style.fixedHeight+statsBar.style.padding.top,
				statsBar.style.fixedWidth-statsBar.style.padding.right,
				statsBar.style.fixedHeight-statsBar.style.padding.bottom
			));

				GUI.Label(Rect(0,0, 50, 20), "HP:", statsBar.statsStyle); GUI.Label(Rect(80, 0, 80, 20), attributes.hitpoints+"/"+attributes.maxHitpoints, statsBar.statsStyle);
				GUI.Label(Rect(0,30, 80, 20), "Attack:", statsBar.statsStyle); GUI.Label(Rect(80, 30, 80, 20), attributes.attack+"", statsBar.statsStyle);

			GUI.EndGroup();
		if(attributes.unitType == UnitType.Building) {

			// draw building actions

			var mB : MainBuilding = selected[0].GetComponent(MainBuilding);

			GUILayout.BeginArea (Rect(mm.minimapTexture.width+40, Screen.height-50, 480, 40));
			GUILayout.BeginHorizontal();

			if(mB != null) {
				for(var gO : GameObject in mB.objectsCanCreate) {
					var unitAttributes : Attributes = gO.GetComponent(Attributes);
					if(GUILayout.Button(unitAttributes.unitName)) {
						if(money.Pay(unitAttributes.cost)) {
							var pos : Vector3;
							if (!mB.mustPlace){
								pos = selected[0].transform.position + mB.spawn;
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