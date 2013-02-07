package ui.jq;

import js.JQuery;
import ui.jq.JQ.UIPosition;

typedef UIDroppable = {
	draggable: JQDraggable,
	helper: JQ, 
	position: UIPosition, 
	offset: UIPosition
}

typedef JQDroppableOpts = {
	@:optional var accept: Dynamic; //"*",
	@:optional var activeClass: String; //false,
	@:optional var addClasses: Bool; //true,
	@:optional var greedy: Bool; //false,
	@:optional var hoverClass: String; //false,
	@:optional var scope: String; //"default",
	@:optional var tolerance: String; //"intersect",

	// callbacks
	@:optional var activate: JqEvent->UIDroppable->Void; //null,
	@:optional var deactivate: JqEvent->UIDroppable->Void; //null,
	@:optional var drop: JqEvent->UIDroppable->Void; //null,
	@:optional var out: JqEvent->UIDroppable->Void; //null,
	@:optional var over: JqEvent->UIDroppable->Void; //null,
}

extern class JQDroppable extends JQ {
	function droppable(opts: JQDroppableOpts): JQDroppable;

	private static function __init__() : Void untyped {
		JQDroppable = window.jQuery;
	}	
}