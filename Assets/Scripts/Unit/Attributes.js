#pragma strict
#pragma downcast

enum UnitType { Building, Unit }

enum AttackType {	Explosion = 0, 
					Gewehr = 1,
					Panzerbrecher = 2};

enum DefenseType  {	Gebaeude = 0,
					Schutzweste = 1, 
					Panzerung = 2};

static var damageFactors : float[] = new Array (
//DefTyp: 			Gebäude	Schutzw.	Panzerung
/*Explosion*/		2.0, 	1.0, 		1.5,
/*Gewehr*/			0.2, 	1.0, 		0.3,
/*Panzerbr*/		1.0, 	1.0, 		2.5
).ToBuiltin(float);

static var attacktypes = 3;
static var defensetypes = 3;	 

var spawnHeight : float = 0.0;

var unitName = "Noname";
var unitType : UnitType;
var cost = 0;
var buildtime = 1.0;
var valueOnKill = 0;
var moveSpeed = 1.0;
var sightRange = 1.0;

var hitpoints : float = 1;
var maxHitpoints : float = 1;
var defense = 0;
var defenseType : DefenseType;
var attack = 0;
var attackspeed = 1.0;
var attackRange = 1.0;
var attackType : AttackType;

private var experience = 0;


/*
* Verursacht Schaden.
* True, wenn die Einheit wegen dem Schaden gestorben ist.
*/
function Damage(dmg : int) : boolean{
	hitpoints -= dmg;
	var healthbar = gameObject.GetComponent(SimpleHealthbar);
	if (healthbar != null){
		healthbar.Update();
	}
	
	if (hitpoints <= 0){
		GameObject.Destroy(gameObject);
		return true;
	}
	return (false);
}


function DamageFactor(attacker : AttackType, defender : DefenseType) : float{
	var att : int = attacker;
	var def : int = defender;
	return damageFactors[att * attacktypes + def];
}
