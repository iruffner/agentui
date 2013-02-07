package ui.jq;

import js.JQuery;
import ui.jq.JQ.UIPosition;

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
	@:optional var close: JqEvent->{tooltip: JQ}->Void;//null,
	@:optional var open: JqEvent->Dynamic->Void; //null
}

extern class JQTooltip extends JQ {
	function draggable(opts: JQTooltipOps): JQTooltip;

	private static function __init__() : Void untyped {
		JQTooltip = window.jQuery;
	}	
}