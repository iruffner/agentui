package m3.jq;

import m3.jq.JQ;

typedef JQTooltipOps = {
	@:optional var content: Dynamic; /*function() {
			// support: IE<9, Opera in jQuery <1.7
			// .text() can't accept undefined, so coerce to a string
			var title = $( this ).attr( "title" ) || "";
			// Escape title, since we're going from an attribute to raw HTML
			return $( "<a>" ).text( title ).html();
	},*/
	@:optional var hide: Dynamic; //true,
	// Disabled elements have inconsistent behavior across browsers (#8661)
	@:optional var items: Dynamic; //"[title]:not([disabled])",
	@:optional var position: Dynamic; /*{
		my: "left top+15",
		at: "left bottom",
		collision: "flipfit flip"
	},*/
	@:optional var show: Dynamic; //true,
	@:optional var tooltipClass: String; //null,
	@:optional var track: Bool;//false,

	// callbacks
	@:optional var close: JQEvent->{tooltip: JQ}->Void;//null,
	@:optional var open: JQEvent->Dynamic->Void; //null
}

@:native("$")
extern class JQTooltip extends JQ {
	@:overload(function<T>(cmd : String):T{})
	@:overload(function<T>(cmd:String, opt:String):T{})
	function tooltip(?opts: JQTooltipOps): JQTooltip;
}