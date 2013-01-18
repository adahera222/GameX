#pragma strict
#pragma downcast
var amount = 1;
var time = 2;
private var lTime : int;
private var money : Money;

function Start ()
{
	lTime=Time.time;
	money = GameObject.Find("PlayerScripts").GetComponent(Money);
}

function Update ()
{
	if(lTime+time <= Time.time) {
		lTime += time;
		money.Add(amount);
	}
}