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
		pos.y += needToPlace.GetComponent(Attributes).spawnHeight;
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
}



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

			var mB : Building = selected[0].GetComponent(Building);

			GUILayout.BeginArea (Rect(mm.minimapTexture.width+40, Screen.height-50, 480, 40));
			GUILayout.BeginHorizontal();

			if(mB != null) {
				for(var i = 0; i<mB.objectsCanCreate.Length; i++) {
					var gO : GameObject = mB.objectsCanCreate[i];
					var unitAttributes : Attributes = gO.GetComponent(Attributes);
					GUILayout.BeginVertical();
					//---Textur für den Balken zeichnen
					var rect : Rect = GUILayoutUtility.GetRect(10,5,GUILayout.ExpandWidth(true));
					var tex = new Texture2D(100, 1);
					var cols = tex.GetPixels();
					for (var x = 0; x<cols.Length; x++){
						cols[x] = Color.clear;
					}
					if (mB.objectsCooldownPercent[i] != 0){
						for (x = 0; x<100-mB.objectsCooldownPercent[i]; x++){
							cols[x] = Color.red;
						}
					}
					tex.SetPixels(cols);
					tex.Apply();
					
					//Balken zeichnen
					GUI.DrawTexture(rect, tex);
					
					
					var text = unitAttributes.unitName;
					if (mB.objectsQueue[i] > 0){
						text += " ("+mB.objectsQueue[i]+")";
					}
					if(GUILayout.Button(text)) {
						mB.Build(i);
					}
					GUILayout.EndVertical();
				}
			}

			GUILayout.EndHorizontal();
			GUILayout.EndArea();
		}
		else {
			GUILayout.BeginArea (Rect(mm.minimapTexture.width+40, Screen.height-65, 480, 60));
			GUILayout.BeginHorizontal();
				var ai : SimpleAI;

				if(GUILayout.Button("Attack&Move", actionBar.moveAttackButton)) 
					for(var unit : GameObject in selected)
						if(unit != null) {
							ai = unit.GetComponent(SimpleAI);
							if (ai != null)
								ai.type = AIType.moveAgressive;
						}
				if(GUILayout.Button("aggressive", actionBar.aggressiveButton)) 
					for(var unit : GameObject in selected)
						if(unit != null) {
							ai = unit.GetComponent(SimpleAI);
							if (ai != null)
								ai.type = AIType.aggressive;
						}
				if(GUILayout.Button("defensive", actionBar.defensiveButton)) 
					for(var unit : GameObject in selected)
						if(unit != null) {
							ai = unit.GetComponent(SimpleAI);
							if (ai != null)
								ai.type = AIType.defensive;
						}
				if(GUILayout.Button("passive", actionBar.passiveButton)) 
					for(var unit : GameObject in selected)
						if(unit != null) {
							ai = unit.GetComponent(SimpleAI);
							if (ai != null)
								ai.type = AIType.passive;
						}
							
			GUILayout.EndHorizontal();
			GUILayout.EndArea();
		}
	}
}