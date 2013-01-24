#pragma strict

private var selected : GameObject[];

function Start () {

}

function Update () {
	selected = GameObject.Find("GlobalScripts").GetComponent(MouseControl).selected;
	var ai : SimpleAI;

	if(Input.GetKeyDown(KeyCode.Q)){
		for(var unit : GameObject in selected)
			if(unit != null) {
				ai = unit.GetComponent(SimpleAI);
				if (ai != null)
					ai.type = AIType.moveAgressive;
			}
	}
	else if(Input.GetKeyDown(KeyCode.E)){
		for(var unit : GameObject in selected)
			if(unit != null) {
				ai = unit.GetComponent(SimpleAI);
				if (ai != null)
					ai.type = AIType.aggressive;
			}
	}
	else if(Input.GetKeyDown(KeyCode.R)){
		for(var unit : GameObject in selected)
			if(unit != null) {
				ai = unit.GetComponent(SimpleAI);
				if (ai != null)
					ai.type = AIType.defensive;
			}
	}
	else if(Input.GetKeyDown(KeyCode.G)){
		for(var unit : GameObject in selected)
			if(unit != null) {
				ai = unit.GetComponent(SimpleAI);
				if (ai != null)
					ai.type = AIType.passive;
			}
	}
	else if(Input.GetKeyDown(KeyCode.C)){
		// circle formation
		GameObject.Find("GlobalScripts").GetComponent(MouseControl).formation = 'circle';
	}
	else if(Input.GetKeyDown(KeyCode.V)){
		// square formation
		GameObject.Find("GlobalScripts").GetComponent(MouseControl).formation = 'square';
	}
	else if(Input.GetKeyDown(KeyCode.N)){
		// reset formation
		GameObject.Find("GlobalScripts").GetComponent(MouseControl).formation = '';
	}
}