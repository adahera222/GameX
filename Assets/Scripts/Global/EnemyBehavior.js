#pragma strict

private var base : Building;
private var buildNext : int = 0;

function Start () {
	base = gameObject.GetComponent(Building);
	var startAfter = gameObject.GetComponent(Attributes).buildtime;
	InvokeRepeating("tryToBuild", startAfter, 1.0);
}

function Update () {
	
}

function tryToBuild() {
	if(buildNext < base.objectsCanCreate.Length) {
		var gO : GameObject = base.objectsCanCreate[buildNext];
		var costs = gO.GetComponent(Attributes).cost;
		var money : Money = GameObject.Find("EnemyScripts").GetComponent(Money);

		if(money.Payable(costs)) {
			var created : GameObject;
			var pos : Vector3;
			if (!base.mustPlace){
				base.Build(buildNext);
			}else{
				var counter = 0;
				do{
					var buildRadius = base.buildRadius;
					pos.x = Random.Range(-1*buildRadius, buildRadius);
					pos.z = Random.Range(-1*buildRadius, buildRadius);

					pos += base.transform.position;
					counter++;			
				}while(!base.Build(buildNext, pos) && counter < 100);

			}

			buildNext++;
			
			if (buildNext == base.objectsCanCreate.Length && !base.mustPlace){
				buildNext = 0;
			}
		}
	}
}

function updateMinimapIcon (go : GameObject){
	var minimapIcon : Transform = go.transform.Find("minimapIcon");
	var parentIcon : Transform = transform.Find("minimapIcon");
	minimapIcon.renderer.material = parentIcon.renderer.material;
}

function OnDeath(){
	Destroy(this);
}

@script RequireComponent(Attributes)