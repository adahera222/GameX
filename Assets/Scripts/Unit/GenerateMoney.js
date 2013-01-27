#pragma strict
#pragma downcast
var amount = 1;
var time = 2;
private var lTime : int;
private var money : Money;

function Start ()
{
	lTime=Time.time;
	if (gameObject.tag == "Player"){
		money = GameObject.Find("PlayerScripts").GetComponent(Money);
	} else if(gameObject.tag == "Enemy") {
		money = GameObject.Find("EnemyScripts").GetComponent(Money);
	}
}

function Update ()
{
	if(lTime+time <= Time.time) {
		lTime += time;
		if (money != null){
			money.Add(amount);
		}else{
			Start();
		}
	}
}