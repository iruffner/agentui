package m3.jq;

import m3.jq.JQ;

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
	@:optional var activate: JQEvent->UIDroppable->Void; //null,
	@:optional var deactivate: JQEvent->UIDroppable->Void; //null,
	@:optional var drop: JQEvent->UIDroppable->Void; //null,
	@:optional var out: JQEvent->UIDroppable->Void; //null,
	@:optional var over: JQEvent->UIDroppable->Void; //null,
}

@:native("$")
extern class JQDroppable extends JQ {
	@:overload(function<T>(cmd : String):T{})
	@:overload(function<T>(cmd:String, opt:String):T{})
	function droppable(opts: JQDroppableOpts): JQDroppable;

	// private static function __init__() : Void untyped {
	// 	JQDroppable = window.jQuery;
	// }	
}