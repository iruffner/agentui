package ui.jq;

typedef AjaxOptions = {
	@:optional var url:String;
	@:optional var async:Bool;
	@:optional var type:String;
	/**
		function(data:Dynamic, textStatus:Dynamic, jqXHR:Dynamic)
	**/
	@:optional var success:Dynamic->Dynamic->Dynamic->Void;
	/**
		function(jqXHR:Dynamic, textStatus:Dynamic, errorThrown:Dynamic)
	**/
	@:optional var error:Dynamic->Dynamic->Dynamic->Void;
	/**
		function(arg:Dynamic)
	**/
	@:optional var complete:Dynamic->Void;
	@:optional var dataType:String;
	@:optional var cache:Bool;
	@:optional var data:Dynamic;
}

extern class JQ extends js.JQuery {

	static var ui: Dynamic;
	static var fn: Dynamic;
	static var browser: Dynamic;
	static var noop: Void->Void;

	function exists():Bool;
	function hasAttr(attr:String):Bool;
	
	function destroy():Void;
	function fnDestroy():Void;
	function isVisible():Bool;

	@:overload(function(?duration:Int,?easing:String,?call:Void->Void) : JQ{})
	override function hide( ?duration : Int, ?call : Void -> Void ) : JQ;

	@:overload(function(?duration:Int,?easing:String,?call:Void->Void) : JQ{})
	override function show( ?duration : Int, ?call : Void -> Void ) : JQ;

	@:overload(function(?duration:String, ?call:Void->Void) : JQ{})
	@:overload(function(?duration:Int,?easing:String,?call:Void->Void) : JQ{})
	override function slideToggle( ?duration : Int, ?call : Void -> Void ) : JQ;

	@:overload(function(prop:String,value:Int):JQ{})
	@:overload(function(prop:String,value:String):JQ{})
	@:overload(function(map:{}):JQ{})
	override function css( prop : String ) : String;

	@:overload(function(fcn : Void->Bool):js.JQuery{})
	override function filter( selector : String ) : js.JQuery;

	@:overload(function(selector:js.JQuery):Int{})
	@:overload(function(selector:js.Dom.Window):Int{})
	@:overload(function(selector:js.Dom.HtmlDom):Int{})
	override function index( ?selector : String ) : Int;

	@:overload(function(value:String):js.JQuery{})
	@:overload(function(value:Int):js.JQuery{})
	override function width() : Int;

	function editable(fcn:Dynamic->Array<Dynamic>->Dynamic, options:Dynamic):JQ;
	function accordion(options:Dynamic):JQ;
	function tooltip(?opts:Dynamic):JQ;
	function buttonsetv(i:Int):JQ;
	function button(?opts:Dynamic):JQ;
	@:overload(function(cmd : String, arg1 :Dynamic):Dynamic{})
	function sortable(?opts:Dynamic):JQ.JQSortable;
	// function combobox(?opts:Dynamic):JQ.JQSortable;
	function checkbox(?opts:Dynamic):JQ;

	function helpToolTips(): JQ;
	@:overload(function(arg1:String, arg2:String):JQ{})
	function autocomplete(opts:Dynamic):JQ;
	function showContextMenu(opts:Dynamic, callbak:String->JQ->Dynamic->Void, positioningEvent:js.JQuery.JqEvent):JQ;
	function destroyContextMenu():Void;

	@:overload(function(cmd : String):Bool{})
	@:overload(function(cmd : String, arg1 :Dynamic):Void{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function tabs(?opts:Dynamic):JQ;

	function slider(options: Dynamic): JQ;

	@:overload(function(j:js.JQuery):JQ{})
	@:overload(function(j:js.Dom.Window):JQ{})
	@:overload(function(j:js.Dom.HtmlDom):JQ{})
	override function children( ?selector : String ) : JQ;
	override function siblings( ?selector : String ) : JQ;
	override function next( ?selector : String ) : JQ;
	override function clone( ?withDataAndEvents : Bool ) : JQ;

	@:overload(function(events : String, callb : js.JQuery.JqEvent -> Bool):JQ { } )
	@:overload(function(events : String, callb : Void -> Bool):JQ { } )
	override function bind( events : String, callb : js.JQuery.JqEvent -> Void ) : JQ;
	@:overload(function(callb: Void->Void):js.JQuery { } )
	@:overload(function(callb: js.JQuery.JqEvent->Void):js.JQuery{})
	@:overload(function(callb: Void->Bool):js.JQuery{})
	override function click( ?callb : js.JQuery.JqEvent -> Void ) : JQ;
	override function empty() : JQ;
	@:overload(function(j:js.JQuery):JQ{})
	@:overload(function(j:js.Dom.Window):JQ{})
	@:overload(function(j:js.Dom.HtmlDom):JQ{})
	override function parent( ?selector : String ) : JQ;
	@:overload(function(j:js.JQuery):JQ{})
	@:overload(function(j:js.Dom.Window):JQ{})
	@:overload(function(j:js.Dom.HtmlDom):JQ{})
	override function find( selector : String ) : JQ;
	@:overload(function( onOver : Void -> Void, ?onOut : Void -> Void ) : JQ{})
	override function hover( onOver : js.JQuery.JqEvent -> Void, ?onOut : Void -> Void ) : JQ;
	override function addClass( clazz: String ): JQ;

	@:overload(function( selector: js.JQuery ) : JQ{})
	@:overload(function( selector: js.Dom.HtmlDom ) : JQ{})
	override function appendTo( selector: String ): JQ;

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

	@:overload(function( ?callb : Void -> Void ) : JQ{})
	override function mouseover( ?callb : js.JQuery.JqEvent -> Void ) : JQ;
	@:overload(function( ?callb : Void -> Void ) : JQ{})
	override function mouseout( ?callb : js.JQuery.JqEvent -> Void ) : JQ;
	override function mousedown( ?callb : js.JQuery.JqEvent -> Void ) : JQ;

	@:overload(function( events: String, ?callb: js.JQuery.JqEvent->Dynamic -> Void ) : Void{})
	function on(events: String, ?selector: String, ?callb: js.JQuery.JqEvent->Dynamic -> Void) : Void;

	@:overload(function(name:String,value:String):JQ{})
	@:overload(function(map:{}):JQ{})
	override function attr( name: String ): String;

	@:overload(function(value:String):JQ{})
	@:overload(function(values: Array<String>):JQ{})
	override function val() : String;
	function propAttr( name: String ): Dynamic;
	
	@:overload(function(): Int{})
	function zIndex(zIndex: Int): JQ;

	function menu(opts: Dynamic): JQ;

	function map(fcn: JQ->Int->Dynamic): Void;

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
	}
}

extern class JQSortable extends JQ {
	function disableSelection():Void;

	private static function __init__() : Void untyped {
		JQSortable = window.jQuery;
	}	
}

extern class JDialog extends JQ {
	function dialog(cmd: String): Void;

	private static function __init__() : Void untyped {
		JDialog = window.jQuery;
	}	
}

extern class JQDraggable extends JQ {
	function draggable(opts: Dynamic): JQDraggable;

	private static function __init__() : Void untyped {
		JQDraggable = window.jQuery;
	}	
}

extern class JQDroppable extends JQ {
	function droppable(opts: Dynamic): JQDroppable;

	private static function __init__() : Void untyped {
		JQDroppable = window.jQuery;
	}	
}