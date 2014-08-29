package m3.jq;

import m3.jq.JQ;

typedef JQMenuOps = {
	@:optional var disabled: Bool; 
	@:optional var icons: Dynamic<String>; //{ submenu: "ui-icon-carat-1-e" }
	@:optional var menus: String; //"ul"
	@:optional var position: Dynamic; /*{
		my: "left top+15",
		at: "left bottom",
		collision: "flipfit flip"
	},*/
	
	// callbacks
	@:optional var blur: JQEvent->{item: JQ}->Void;//null
	@:optional var create: JQEvent->Dynamic->Void;//null
	@:optional var focus: JQEvent->{item: JQ}->Void;//null
	@:optional var select: JQEvent->{item: JQ}->Void;//null
}

class JQMenuHelper {
	public static function blur(m: JQMenu): Void {
		m.menu("blur");
	}

	public static function collapseAll(m: JQMenu): Void {
		m.menu("collapseAll");
	}

	public static function refresh(m: JQMenu): Void {
		m.menu("refresh");
	}
}

@:native("$")
extern class JQMenu extends JQ {
	@:overload(function<T>(cmd : String):T{})
	@:overload(function<T>(cmd:String, opt:String):T{})
	function menu(?opts: JQMenuOps): JQTooltip;
}