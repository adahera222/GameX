#pragma strict
static var lineTex : Texture2D;

//Zeichnet die Box rect mit Farbe color auf den Bildschirm.
static function DrawBox(rect : Rect, color : Color, width : int){
	if (!lineTex) {
    	lineTex = Texture2D(1, 1);
    	lineTex.SetPixel(0, 0, Color.white);
    	lineTex.Apply();
    }
	
	var savedColor = GUI.color;
    GUI.color = color;
	
	//oben
	var line = Rect(rect.x, rect.y, rect.width, width);
	GUI.DrawTexture(line, lineTex);
	//unten
	line = Rect(rect.x, rect.y + rect.height-width, rect.width, width);
	GUI.DrawTexture(line, lineTex);
	//links
	line = Rect(rect.x, rect.y, width, rect.height);
	GUI.DrawTexture(line, lineTex);
	//rechts
	line = Rect(rect.x + rect.width, rect.y, width, rect.height);
	GUI.DrawTexture(line, lineTex);
	
	
	GUI.color = savedColor;
}