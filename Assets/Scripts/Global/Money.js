#pragma strict

var startMoney = 500;
var maxMoney = 100000;

private var money : int;


function Start () {
	money = startMoney;
}

function Get() {
	return money;
}

/*
* Fügt dem Geld den Wert v hinzu.
* Sorgt dafür, dass maxMoney nicht überstiegen wird.
*/
function Add(v : int){
	money = Mathf.Min(money + v, maxMoney);
}

/*
* Zieht den Wert v vom Geld ab.
* true: wenn das Geld gereicht hat und bezahlt wurde
* false: zu wenig Geld vorhanden, es wurde nicht bezahlt
*/
function Pay(v : int) : boolean{
	money -= v;
	if (money >= 0){
		return true;
	}
	money += v;
	return false;
}