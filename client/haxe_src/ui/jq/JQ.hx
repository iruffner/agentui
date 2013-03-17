package ui.jq;

typedef JQEvent = {> js.JQuery.JqEvent,
	@:optional var originalEvent: Dynamic;
}

typedef JQXHR = {
	@:optional var code:Int;
	@:optional var message: String;
	@:optional var name: String;
	@:optional var stack: String;
}

typedef AjaxOptions = {
	@:optional var url:String;
	@:optional var async:Bool;
	@:optional var type:String;
	/**
		function(data:Dynamic, textStatus:Dynamic, jqXHR:Dynamic)
	**/
	@:optional var success:Dynamic->Dynamic->JQXHR->Void;
	/**
		function(jqXHR:Dynamic, textStatus:Dynamic, errorThrown:Dynamic)
	**/
	@:optional var error:Dynamic->Dynamic->JQXHR->Void;
	/**
		function(arg:Dynamic)
	**/
	@:optional var complete:Dynamic->Void;
	@:optional var dataType:String;
	@:optional var cache:Bool;
	@:optional var isLocal:Bool;
	@:optional var crossDomain:Bool;
	@:optional var data:Dynamic;
	@:optional var timeout:Dynamic;
}

// typedef PositionOpts = {
// 	@:optional my: String,
// 	@:optional at: String,
// 	@:optional of: Dynamic,
// 	@:optional "using": Dynamic,
// 	@:optional within: Dynamic,
// 	@:optional collision: String
// }

typedef UIPosition = {
	top: Int,
	left: Int
}

extern class JQ extends js.JQuery {

	static var ui: Dynamic;
	static var fn: Dynamic;
	static var browser: Dynamic;
	static var noop: Void->Void;

	// attributes
	@:overload(function(clazz: String,?duration: Int):JQ{})
	override function addClass( clazz: String ): JQ;
	@:overload(function(?clazz: String,?duration: Int):JQ{})
	override function removeClass( ?className : String ) : JQ;

	@:overload(function(name:String,value:String):JQ{})
	@:overload(function(map:{}):JQ{})
	override function attr( name: String ): String;

	@:overload(function(prop:String,value:Int):JQ{})
	@:overload(function(prop:String,value:String):JQ{})
	@:overload(function(map:{}):JQ{})
	override function css( prop : String ) : String;
	
	@:overload(function(value:String):JQ{})
	@:overload(function(values: Array<String>):JQ{})
	override function val() : String;


	// Size & Position
	@:overload(function(value:String):JQ{})
	@:overload(function(value:Int):JQ{})
	override function width() : Int;
	
	@:overload(function(value:String):JQ{})
	@:overload(function(value:Int):JQ{})
	override function height() : Int;

	@:overload(function(args: Dynamic): Void{})
	@:overload(function(value: { left : Int, top : Int }):js.JQuery{})
	override function position() : { left : Int, top : Int };


	// current group manipulation
	@:overload(function(j:js.JQuery):JQ{})
	@:overload(function(j:js.Dom.Window):JQ{})
	@:overload(function(j:js.Dom.HtmlDom):JQ{})
	override function children( ?selector : String ) : JQ;
	override function clone( ?withDataAndEvents : Bool ) : JQ;

	@:overload(function(fcn : Void->Bool):JQ{})
	override function filter( selector : String ) : JQ;

	@:overload(function(j:js.JQuery):JQ{})
	@:overload(function(j:js.Dom.Window):JQ{})
	@:overload(function(j:js.Dom.HtmlDom):JQ{})
	override function find( selector : String ) : JQ;

	@:overload(function(selector:js.JQuery):Int{})
	@:overload(function(selector:js.Dom.Window):Int{})
	@:overload(function(selector:js.Dom.HtmlDom):Int{})
	override function index( ?selector : String ) : Int;
	override function next( ?selector : String ) : JQ;

	@:overload(function(j:js.JQuery):JQ{})
	@:overload(function(j:js.Dom.Window):JQ{})
	@:overload(function(j:js.Dom.HtmlDom):JQ{})
	override function parent( ?selector : String ) : JQ;
	override function siblings( ?selector : String ) : JQ;


	// DOM changes
	@:overload(function(value:js.JQuery):JQ{})
	@:overload(function(value:js.Dom.HtmlDom):JQ{})
	override function append( html : String ) : JQ;

	@:overload(function( selector: js.JQuery ) : JQ{})
	@:overload(function( selector: js.Dom.HtmlDom ) : JQ{})
	override function appendTo( selector: String ): JQ;
	override function empty() : JQ;

	@:overload(function(value:js.JQuery):JQ{})
	@:overload(function(value:js.Dom.HtmlDom):JQ{})
	override function insertBefore( html : String ) : JQ;

	@:overload(function(value:js.JQuery):JQ{})
	@:overload(function(value:js.Dom.HtmlDom):JQ{})
	override function insertAfter( html : String ) : JQ;

	@:overload(function(value:js.JQuery):JQ{})
	@:overload(function(value:js.Dom.HtmlDom):JQ{})
	override function prepend( html : String ) : JQ;

	@:overload(function(value:js.JQuery):JQ{})
	@:overload(function(value:js.Dom.HtmlDom):JQ{})
	override function prependTo( html : String ) : JQ;


	// animation
	@:overload(function(?duration:Int,?easing:String,?call:Void->Void) : JQ{})
	override function hide( ?duration : Int, ?call : Void -> Void ) : JQ;

	@:overload(function(?duration:Int,?easing:String,?call:Void->Void) : JQ{})
	override function show( ?duration : Int, ?call : Void -> Void ) : JQ;

	@:overload(function(?duration:String, ?call:Void->Void) : JQ{})
	@:overload(function(?duration:Int,?easing:String,?call:Void->Void) : JQ{})
	override function slideToggle( ?duration : Int, ?call : Void -> Void ) : JQ;

	@:overload(function(effect: String,?duration:Int,?easing:String,?call:Void->Void) : JQ{})
	@:overload(function(?duration:Int,?easing:String,?call:Void->Void) : JQ{})
	override function toggle( ?duration : Int, ?call : Void -> Void ) : JQ;
	

	// Events
	override function blur( ?callb : JQEvent -> Void ) : JQ;
	override function change( ?callb : JQEvent -> Void ) : JQ;

	@:overload(function(callb: Void->Void):JQ { } )
	@:overload(function(callb: JQEvent->Void):JQ{})
	@:overload(function(callb: Void->Bool):JQ{})
	override function click( ?callb : JQEvent -> Void ) : JQ;
	override function dblclick( ?callb : JQEvent -> Void ) : JQ;
	override function error( ?callb : JQEvent -> Void ) : JQ;
	override function focus( ?callb : JQEvent -> Void ) : JQ;
	override function focusin( ?callb : JQEvent -> Void ) : JQ;
	override function focusout( ?callb : JQEvent -> Void ) : JQ;
	
	@:overload(function( onOver : Void -> Void, ?onOut : Void -> Void ) : JQ{})
	override function hover( onOver : JQEvent -> Void, ?onOut : Void -> Void ) : JQ;

	@:overload(function( callb : JQEvent -> Bool ) : JQ {})
	override function keydown( ?callb : JQEvent -> Void ) : JQ;

	@:overload(function( callb : JQEvent -> Bool ) : JQ {})
	override function keypress( ?callb : JQEvent -> Void ) : JQ;

	@:overload(function( callb : JQEvent -> Bool ) : JQ {})
	override function keyup( ?callb : JQEvent -> Void ) : JQ;

	override function mousedown( ?callb : JQEvent -> Void ) : JQ;
	@:overload(function( ?callb : Void -> Void ) : JQ{})
	override function mouseout( ?callb : JQEvent -> Void ) : JQ;
	@:overload(function( ?callb : Void -> Void ) : JQ{})
	override function mouseover( ?callb : JQEvent -> Void ) : JQ;
	
	@:overload(function(events : String, callb : JQEvent -> Bool):JQ { } )
	@:overload(function(events : String, callb : Void -> Bool):JQ { } )
	override function bind( events : String, callb : JQEvent -> Void ) : JQ;

	@:overload(function( events: String, ?callb: JQEvent->Dynamic -> Void ) : Void{})
	function on(events: String, ?selector: String, ?callb: JQEvent->Dynamic -> Void) : Void;


	// Other
	function destroy():Void;
	function fnDestroy():Void;
	function map(fcn: JQ->Int->Dynamic): Void;
	
	
	//my custom jQuery functions
	function exists(): Bool;
	function isVisible():Bool;
	function hasAttr(attrName: String):Bool;

	//my custom widgets
	function buttonsetv(i:Int):JQ;
	function helpToolTips(): JQ;
	
	//jQueryUI
	function accordion(options:Dynamic):JQ;

	@:overload(function(arg1:String, arg2:String):JQ{})
	function autocomplete(opts:Dynamic):JQ;
	function button(?opts:Dynamic):JQ;
	function menu(opts: Dynamic): JQ;
	function slider(options: Dynamic): JQ;

	@:overload(function(cmd : String, arg1 :Dynamic):Dynamic{})
	function sortable(?opts:Dynamic):JQ.JQSortable;

	@:overload(function(cmd : String):Bool{})
	@:overload(function(cmd : String, arg1 :Dynamic):Void{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function tabs(?opts:Dynamic):JQ;
	function tooltip(?opts:Dynamic):JQ;

	@:overload(function(): Int{})
	function zIndex(zIndex: Int): JQ;


	//statically available functions
	public static function isNumeric(val:Dynamic):Bool;
	public static function trim(str:String):String;

	public static function ajax(ajaxOptions:AjaxOptions):Void;
	public static function getJSON(url:String, ?data:Dynamic, ?success:Dynamic->Dynamic->Dynamic->Void):Void;

	@:overload(function(parent: js.JQuery, child: js.JQuery): Bool{})
	@:overload(function(parent: js.Dom.HtmlDom, child: js.JQuery): Bool{})
	public static function contains( parent : js.Dom.HtmlDom, child : js.Dom.HtmlDom ) : Bool;

	@:overload(function(qualifiedName: String, parent: Dynamic, definition: Dynamic):Void{})
	public static function widget(qualifiedName: String, definition: Dynamic): Void;


	/**
		Return the current JQuery element (in a callback), similar to $(this) in JS.
	**/
	static var cur(getCurrent, null) : JQ;
	static var curNoWrap(getCurrent2, null) : js.Dom.HtmlDom;
	private static inline function getCurrent() : JQ {
		return untyped __js__("$(this)");
	}
	private static inline function getCurrent2() : js.Dom.HtmlDom {
		return untyped __js__("this");
	}

	private static function __init__() : Void untyped {
		untyped __js__ ("ui.jq = function() {}");
		JQ = window.jQuery;

		JQ.fn.exists = function(){
		    return JQ.cur.length>0;
		};
		JQ.fn.isVisible = function(){
		    return JQ.cur.css("display") != "none";
		};
		JQ.fn.hasAttr = function(name) {  
		   return JQ.cur.attr(name) != undefined;
		};
	}
}

extern class JQSortable extends JQ {
	function disableSelection():Void;

	private static function __init__() : Void untyped {
		JQSortable = window.jQuery;
	}	
}