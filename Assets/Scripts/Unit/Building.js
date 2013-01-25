#pragma strict
#pragma downcast


var objectsCanCreate : GameObject[];
var objectsCooldownPercent : int[];
var objectsQueue: int[];
var mustPlace : boolean;
var spawn : GameObject;

private var needToPlace : boolean = false;
private var tempPlaced : GameObject;
private var tempIndex : int;
private var firstClick : boolean = true;

private var money : Money;

function Start ()
{
	objectsCooldownPercent = new int[objectsCanCreate.Length];
	objectsQueue = new int[objectsCanCreate.Length];
	InvokeRepeating("CheckQueue", 0, 0.1);
}

function Update ()
{
	if(needToPlace) {
		var pos : Vector3 = getCurrentPoint();
		pos.y += tempPlaced.GetComponent(Attributes).spawnHeight;
		tempPlaced.transform.position = pos;
		
		if (Input.GetButtonUp("Select")){
			if (!firstClick)
				PlaceBuilding(tempIndex);
			firstClick = false;
		}
		if (Input.GetButtonUp("Action")){
			needToPlace = false;
			Destroy(tempPlaced);
		}
	}
}

function CheckQueue(){
	for (var i = 0; i < objectsQueue.Length; i++){
		if (objectsQueue[i] > 0){
			objectsQueue[i]--;
			Build(i);
		}
	}
}

function Build(index : int){
	if (money == null){
		if (gameObject.tag == "Player"){
			money = GameObject.Find("PlayerScripts").GetComponent(Money);
		}else{
			money = GameObject.Find("EnemyScripts").GetComponent(Money);
		}
	}
	if (objectsCooldownPercent[index] == 0){
		var go = objectsCanCreate[index];
		var pos = spawn.transform.position;
		pos.y = go.GetComponent(Attributes).spawnHeight;
		var unitAttributes : Attributes = go.GetComponent(Attributes);
		if (mustPlace){
			needToPlace = true;
			tempPlaced = Instantiate(go, pos, go.transform.rotation);
			var health = tempPlaced.GetComponent(SimpleHealthbar);
			if (health){
				health.Hide();
			}
			tempIndex = index;
			firstClick = true;
		}else{
			if(money.Pay(unitAttributes.cost)){
				var builtTime = Time.time + unitAttributes.buildtime;
				for (var time = Time.time; time < builtTime; time = Time.time){
					var diff = builtTime - time;
					var factor = 1 - diff/unitAttributes.buildtime;
					objectsCooldownPercent[index] = 100* factor;
					yield;
				}
				objectsCooldownPercent[index] = 0;
				var unit : GameObject = Instantiate (go, pos, go.transform.rotation);
				updateMinimapIconAndTag(unit);
				
				if (gameObject.tag == "Enemy"){
					unit.AddComponent(Wandering);
				}
			}else{
				objectsQueue[index]++;
			}
		}
	}else if (!mustPlace){
		objectsQueue[index]++;
	}
}

//Für KI
function Build(index : int, pos : Vector3){
	if (money == null){
		if (gameObject.tag == "Player"){
			money = GameObject.Find("PlayerScripts").GetComponent(Money);
		}else{
			money = GameObject.Find("EnemyScripts").GetComponent(Money);
		}
	}

	if (objectsCooldownPercent[index] == 0){
		var go = objectsCanCreate[index];
		var unitAttributes : Attributes = go.GetComponent(Attributes);
	
		tempPlaced = Instantiate(go, pos, go.transform.rotation);
		var health = tempPlaced.GetComponent(SimpleHealthbar);
		if (health){
			health.Hide();
		}
		pos.y = tempPlaced.GetComponent(Attributes).spawnHeight;
		tempPlaced.transform.position = pos;
		tempPlaced.AddComponent(EnemyBehavior);
		PlaceBuilding(index);
	}
}

function PlaceBuilding(index : int){
	var unitAttributes : Attributes = tempPlaced.GetComponent(Attributes);
	
	if(money.Pay(unitAttributes.cost)){
		needToPlace = false;
		
		var building = tempPlaced;
		
		updateMinimapIconAndTag(building);
		building.tag = "Untagged";
		
		var pos = building.transform.position;
		var startpos = pos;
		startpos.y = -2*building.collider.bounds.extents.y;
		building.transform.position = startpos;
		var builtTime = Time.time + unitAttributes.buildtime;
		
		Destroy(Instantiate(GameObject.Find("GlobalScripts").GetComponent(GlobalPrefabs).buildSmoke, pos, Quaternion.identity), unitAttributes.buildtime);
		
		for (var time = Time.time; time < builtTime; time = Time.time){
			var diff = builtTime - time;
			var factor = 1 - diff/unitAttributes.buildtime;
			objectsCooldownPercent[index] = 100* factor;
			building.transform.position = Vector3.Lerp(startpos, pos, factor);
			yield;
		}
		objectsCooldownPercent[index] = 0;
		building.transform.position = pos;
		building.tag = gameObject.tag;
		var health = building.GetComponent(SimpleHealthbar);
		if (health){
			health.Show();
		}
	}
}



function updateMinimapIconAndTag (go : GameObject){
	//Minimap Icon
	var minimapIcon : Transform = go.transform.Find("minimapIcon");
	var parentIcon : Transform = transform.Find("minimapIcon");
	minimapIcon.renderer.material = parentIcon.renderer.material;
	
	//Tag
	go.tag = gameObject.tag;
	
	//Healthbarfarbe
	var healthbar : SimpleHealthbar = go.GetComponent(SimpleHealthbar);
	if (healthbar != null){
		var myHealthColor = GetComponent(SimpleHealthbar).color;
		healthbar.SetColor(myHealthColor);
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

function OnDeath(){
	Destroy(gameObject);
}