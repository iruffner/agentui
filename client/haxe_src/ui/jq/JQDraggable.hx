package ui.jq;

import ui.jq.JQ;
import ui.jq.JQ.UIPosition;
import ui.model.ModelObj;

typedef UIDraggable = {
	helper: JQ, 
	position: UIPosition, 
	offset: UIPosition
}

typedef JQDraggableOpts = {
	@:optional var addClasses: Bool; //true
	@:optional var appendTo: Dynamic; //"parent"
	@:optional var axis: Bool; //false
	@:optional var cancel: Dynamic; //"input;textarea;button;select;option"
	@:optional var connectToSortable: Dynamic;//false
	@:optional var containment: Dynamic; //false
	@:optional var cursor: String; //"auto";
	@:optional var cursorAt: Dynamic; //false;
	@:optional var delay: Int; //0
	@:optional var disabled: Bool; // false
	@:optional var distance: Int; //1
	@:optional var grid: Array<Int>; //false;
	@:optional var handle: Dynamic; //false;
	@:optional var helper: Dynamic; //"original";
	@:optional var iframeFix: Dynamic; //false;
	@:optional var opacity: Int; //false;
	@:optional var refreshPositions: Bool; // false;
	@:optional var revert: Dynamic; //false;
	@:optional var revertDuration: Int; //500;
	@:optional var scope: String; //"default";
	@:optional var scroll: Bool; //true;
	@:optional var scrollSensitivity: Int; //20;
	@:optional var scrollSpeed: Int; //20;
	@:optional var snap: Dynamic; //false;
	@:optional var snapMode: String; //"both";
	@:optional var snapTolerance: Int; //20;
	@:optional var stack: JQ; //false;
	@:optional var zIndex: Int; //false;

	// callbacks
	@:optional var drag: JQEvent->UIDraggable->Void; //null
	@:optional var start: JQEvent->UIDraggable->Void; //null
	@:optional var stop: JQEvent->UIDraggable->Void; //null
}

extern class JQDraggable extends JQ {
	@:overload(function(cmd : String):Bool{})
	@:overload(function(cmd:String, opt:String):Dynamic{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function draggable(opts: JQDraggableOpts): JQDraggable;

	private static function __init__() : Void untyped {
		JQDraggable = window.jQuery;
	}	
}