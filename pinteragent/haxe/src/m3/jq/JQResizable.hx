package m3.jq;

import m3.jq.JQ;
import m3.jq.UIPosition;

typedef UIResizable = {
	element: JQ, 
	helper: JQ, 
	originalElement: JQ, 
	originalPosition: UIPosition, 
	originalSize: UISize, 
	position: UIPosition,
	size: UISize
}

typedef JQResizableOpts = {
	@:optional var alsoResize: Dynamic; //false --> expects Selector/jQuery/Element
	@:optional var animate: Bool; //false
	@:optional var animateDuration: Dynamic; //"slow"
	@:optional var animateEasing: String; //"swing"
	@:optional var aspectRatio: Dynamic;//false  --> expects Bool or Number
	@:optional var autoHide: Bool; //false
	@:optional var cancel: String; //"input,textarea,button,select,option"
	@:optional var containment: Dynamic; //false; --> expects Selector/jQuery/Element
	@:optional var delay: Int; //0
	@:optional var disabled: Bool; // false
	@:optional var distance: Int; //1
	@:optional var ghost: Bool; //false
	@:optional var grid: Array<Int>; //false;
	@:optional var handles: String; //"e,s,se"
	@:optional var helper: Dynamic; //"original"
	@:optional var maxHeight: Int; //null
	@:optional var maxWidth: Int; //null
	@:optional var minHeight: Int; //10
	@:optional var minWidth: Int; //10

	// callbacks
	@:optional var create: JQEvent->UIResizable->Void; //null
	@:optional var resize: JQEvent->UIResizable->Void; //null
	@:optional var start: JQEvent->UIResizable->Void; //null
	@:optional var stop: JQEvent->UIResizable->Void; //null
}

@:native("$")
extern class JQResizable extends JQ {
	@:overload(function<T>(cmd : String):T{})
	@:overload(function<T>(cmd:String, opt:String):T{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function resizable(opts: JQResizableOpts): JQResizable;

	// private static function __init__() : Void untyped {
	// 	JQResizable = window.jQuery;
	// }	
}