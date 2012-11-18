#pragma strict
#pragma downcast

enum UnitType { Building, Human }

var unitName = "Noname";
var unitType : UnitType;

private var actionBar : ActionBar;
private var statsBar : UnitStatsBar;
private var drawActionBar = false;
private var sObj : GameObject;


function Start () {
	actionBar = GameObject.Find("GlobalScripts").GetComponent("ActionBar");
	statsBar = GameObject.Find("GlobalScripts").GetComponent("UnitStatsBar");
}

function Update () {

}

function OnGUI() {
	if(drawActionBar) {
		var mm : MiniMap = GameObject.Find("MinimapCamera").GetComponent("MiniMap");
		GUI.Box(Rect(mm.minimapTexture.width, Screen.height-actionBar.style.fixedHeight, 0, 0), unitName, actionBar.style);
		
		// show unit stats
		if(unitType == UnitType.Human) {
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
		} else if(unitType == UnitType.Building) {
			var mB : MainBuilding = gameObject.GetComponent("MainBuilding");
			if(mB != null) {
				for(var gO : GameObject in mB.objectsCanCreate) {
					var unit : Unit = gO.GetComponent("Unit");
					if(GUI.Button(Rect(mm.minimapTexture.width+40, Screen.height-50, 80, 40), unit.unitName)) {
						Instantiate (gO, Vector3(2, 1, 1), Quaternion.identity);
					}
				}
			}
		}
	}
}

function OnSelection(obj : GameObject) {
	drawActionBar = true;
	sObj = obj;
}
function OnDeselection(obj : GameObject) {
	drawActionBar = false;
	sObj = null;
}