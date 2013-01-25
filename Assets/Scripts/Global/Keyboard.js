#pragma strict

private var selected : GameObject[];

function Start () {

}

function Update () {
	selected = GameObject.Find("GlobalScripts").GetComponent(MouseControl).selected;
	var ai : SimpleAI;

	if(Input.GetAxis("moveAgressive") > 0){
		for(var unit : GameObject in selected)
			if(unit != null) {
				ai = unit.GetComponent(SimpleAI);
				if (ai != null)
					ai.type = AIType.moveAgressive;
			}
	}
	else if(Input.GetAxis("agressive") > 0){
		for(var unit : GameObject in selected)
			if(unit != null) {
				ai = unit.GetComponent(SimpleAI);
				if (ai != null)
					ai.type = AIType.aggressive;
			}
	}
	else if(Input.GetAxis("defensive") > 0){
		for(var unit : GameObject in selected)
			if(unit != null) {
				ai = unit.GetComponent(SimpleAI);
				if (ai != null)
					ai.type = AIType.defensive;
			}
	}
	else if(Input.GetAxis("passive") > 0){
		for(var unit : GameObject in selected)
			if(unit != null) {
				ai = unit.GetComponent(SimpleAI);
				if (ai != null)
					ai.type = AIType.passive;
			}
	}
	else if(Input.GetAxis("formationCircle") > 0){
		// circle formation
		GameObject.Find("GlobalScripts").GetComponent(MouseControl).formation = 'circle';
	}
	else if(Input.GetAxis("formationSquare") > 0){
		// square formation
		GameObject.Find("GlobalScripts").GetComponent(MouseControl).formation = 'square';
	}
	else if(Input.GetAxis("formationReset") > 0){
		GameObject.Find("GlobalScripts").GetComponent(MouseControl).formation = '';
	}
}