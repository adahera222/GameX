#pragma strict

private var base : MainBuilding;
private var buildNext : int = 0;

function Start () {
	base = gameObject.GetComponent(MainBuilding);
}

function Update () {
	InvokeRepeating("tryToBuild", 5.0, 1.0);
}

function tryToBuild() {
	if(buildNext < base.objectsCanCreate.Length) {
		var gO : GameObject = base.objectsCanCreate[buildNext];
		var costs = gO.GetComponent(Attributes).cost;
		var money : Money = GameObject.Find("EnemyScripts").GetComponent(Money);

		if(money.Pay(costs)) {

			var pos : Vector3;
			if (!base.mustPlace){
				pos = base.transform.position + base.spawn;
				pos.y = gO.GetComponent(Attributes).spawnHeight;
				Instantiate (gO, pos, gO.transform.rotation);
			}else{
				pos.x -= Random.Range(5, 10);
				pos.z -= Random.Range(5, 10);

				pos += base.transform.position;
				pos.y = gO.GetComponent(Attributes).spawnHeight;

				Instantiate (gO, pos, gO.transform.rotation);
			}

			buildNext++;
		}
	}
}