#pragma strict
#pragma downcast


var objectsCanCreate : GameObject[];
var spawn : GameObject;

private var lTime : int;
private var money : Money;

function Start ()
{
	lTime=Time.time;
	money = GameObject.Find("PlayerScripts").GetComponent(Money);
}

function Update ()
{
	if(lTime+2 <= Time.time) {
		lTime = Time.time;
		money.Add(1);
	}
}