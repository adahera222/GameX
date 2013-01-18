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
				pos.x -= Random.Range(5, 10);
				pos.z -= Random.Range(5, 10);

				pos += base.transform.position;
				
				base.Build(buildNext, pos);
				//pos.y = gO.GetComponent(Attributes).spawnHeight;

				//created = Instantiate (gO, pos, gO.transform.rotation);
				//created.tag = base.tag;
				//created.AddComponent(EnemyBehavior);
				//updateMinimapIcon(created);
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