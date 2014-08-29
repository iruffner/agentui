package m3.jq;

import js.html.DOMWindow;
import js.html.Document;
import js.html.Element;

typedef JQEvent = {> js.JQuery.JqEvent,
	@:optional var originalEvent: Dynamic;
}

typedef JQXHR = {
	@:optional var status:Int;
	@:optional var statusCode:Int;
	@:optional var message: String;
	@:optional var name: String;
	@:optional var stack: String;
	@:optional var responseText: String;
	@:optional var responseXML: String;

	@:overload(function(fcn:Dynamic->Void):JQXHR{})
	@:optional var done: (Dynamic->String->JQXHR->Void)->JQXHR;
	
	@:overload(function(fcn:Dynamic->Void):JQXHR{})
	@:optional var fail: JQXHR->String->Dynamic->JQXHR;
	
	@:optional var error: (Dynamic->Void)->JQXHR;//deprecated
	@:optional var setRequestHeader: String->String->Void;
	@:optional var getResponseHeader: String->String;
}

typedef AjaxOptions = {
	@:optional var url:String;
	@:optional var async:Bool;
	@:optional var type:String; //"GET", "POST", etc..
	@:optional var beforeSend: JQXHR->Dynamic->Void;
	/**
		function(data:Dynamic, textStatus:String, jqXHR:JQXHR)
	**/
	@:optional var success:Dynamic->Dynamic->JQXHR->Void;
	/**
		function(jqXHR:JQXHR, textStatus:String, errorThrown:String)
	**/
	@:optional var error:JQXHR->String->String->Void;
	/**
		function(jqXHR:JQXHR, textStatus:String)
	**/
	@:optional var complete:JQXHR->String->Void;
	@:optional var dataType:String;
	@:optional var cache:Bool;
	@:optional var contentType:Dynamic;
	@:optional var crossDomain:Bool;
	@:optional var data:Dynamic;
	@:optional var isLocal:Bool;
	@:optional var jsonp:Dynamic;
	@:optional var processData:Bool;
	@:optional var timeout:Dynamic;
	@:optional var headers: Dynamic;
}

extern class Selector<T: (JQ,String,Element)> {

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

typedef UISize = {
	height: Int,
	width: Int
}

typedef Deferred = {
	var resolve: Void->Void;
	var reject: Void->Void;
	var done: (Void->Void)->Void;
	var fail: (Void->Void)->Void;
}

@:native("$.ui.keyCode")
extern class KeyCode {
	public static inline var BACKSPACE: Int = 8;
	public static inline var COMMA: Int = 188;
	public static inline var DELETE: Int = 46;
	public static inline var DOWN: Int = 40;
	public static inline var END: Int = 35;
	public static inline var ENTER: Int = 13;
	public static inline var ESCAPE: Int = 27;
	public static inline var HOME: Int = 36;
	public static inline var LEFT: Int = 37;
	public static inline var PAGE_DOWN: Int = 34;
	public static inline var PAGE_UP: Int = 33;
	public static inline var PERIOD: Int = 190;
	public static inline var RIGHT: Int = 39;
	public static inline var SPACE: Int = 32;
	public static inline var TAB: Int = 9;
	public static inline var UP: Int = 38;
	public static inline var NUMPAD_ENTER: Int = 108;
}

@:native("$")
extern class JQ implements ArrayAccess<Element> {

	var context(default,null) : Element;
	var length(default, null) : Int;

	static var ui(default, null): {keyCode: KeyCode, dialog: Dynamic, contains: Dynamic, autocomplete: Dynamic, menu: Dynamic};
	static var fn(default, null): Dynamic;
	static var noop(default, null): Void->Void;
	static var fx(default, null) : { off : Bool, interval : Int };
	static var browser(default, null) : { webkit : Bool, opera : Bool, msie : Bool, mozilla : Bool, version : String };


	@:overload(function(j:JQ):Void{})
	@:overload(function(j:Document):Void{})
	@:overload(function(j:DOMWindow):Void{})
	@:overload(function(j:Element):Void{})
	@:overload(function(selector:String, content:JQ):Void{})
	@:overload(function(selector:String, content:Element):Void{})
	function new( html : String ) : Void;

	// attributes
	@:overload(function(className: String,?duration: Int):JQ{})
	function addClass( className: String ): JQ;
	@:overload(function(?className: String,?duration: Int):JQ{})
	function removeClass( ?className : String ) : JQ;
	function hasClass( className : String ) : Bool;
	@:overload(function(className: String,?duration: Int):JQ{})
	@:overload(function(className: String,?duration: Int,?easing: String):JQ{})
	function toggleClass( className : String, ?addRemove : Bool ) : JQ;

	@:overload(function(name:String,value:String):JQ{})
	@:overload(function(map:{}):JQ{})
	function attr( name: String ): String;
	function removeAttr( attr : String ) : JQ;

	@:overload(function(name:String,value:Dynamic):JQ{})
	function prop( name : String ) : Dynamic;

	@:overload(function(prop:String,value:Int):JQ{})
	@:overload(function(prop:String,value:String):JQ{})
	@:overload(function(map:{}):JQ{})
	function css( prop : String ) : String;

	@:overload(function(html:String):JQ{})
	@:overload(function(html:JQ):JQ{})
	function html() : String;
	
	@:overload(function(value:String):JQ{})
	@:overload(function(values: Array<String>):JQ{})
	function val() : String;

	@:overload(function(text:String):JQ{})
	function text() : String;

	// Size & Position
	@:overload(function(value:String):JQ{})
	@:overload(function(value:Int):JQ{})
	function width() : Int;
	
	@:overload(function(value:String):JQ{})
	@:overload(function(value:Int):JQ{})
	function height() : Int;

	@:overload(function(value:Int):JQ{})
	function innerWidth() : Int;
	@:overload(function(value:Int):JQ{})
	function innerHeight() : Int;

	function outerWidth( ?includeMargin : Bool ) : Int;
	function outerHeight( ?includeMargin : Bool ) : Int;

	@:overload(function(value:Int):JQ{})
	function scrollLeft() : Int;

	@:overload(function(value:Int):JQ{})
	function scrollTop() : Int;

	@:overload(function(value: { left : Int, top : Int }):JQ{})
	function offset() : { left : Int, top : Int };

	function offsetParent() : JQ;

	@:overload(function(args: Dynamic): Void{})
	@:overload(function(value: { left : Int, top : Int }):JQ{})
	function position() : { left : Int, top : Int };


	// current group manipulation
	@:overload(function(value:JQ):JQ{})
	@:overload(function(value:Element):JQ{})
	@:overload(function(value:Array<Element>):JQ{})
	function add( selector : String, ?context : JQ ) : JQ;
	function andSelf() : JQ;
	
	@:overload(function(j:JQ):JQ{})
	@:overload(function(j:DOMWindow):JQ{})
	@:overload(function(j:Element):JQ{})
	function children( ?selector : String ) : JQ;
	function clone( ?withDataAndEvents : Bool ) : JQ;

	function closest( selector : String, ?context : JQ ) : JQ;
	function contents() : JQ;

	@:overload(function( f : Int -> Element -> Void ):JQ{})
	function each( f : Void -> Void ) : JQ;
	function end() : JQ;
	function eq( index : Int ) : JQ;

	@:overload(function(fcn : Void->Bool):JQ{})
	function filter( selector : String ) : JQ;

	@:overload(function(j:JQ):JQ{})
	@:overload(function(j:DOMWindow):JQ{})
	@:overload(function(j:Element):JQ{})
	function find( selector : String ) : JQ;
	function first() : JQ;

	@:overload(function(selector:JQ):Int{})
	@:overload(function(selector:DOMWindow):Int{})
	@:overload(function(selector:Element):Int{})
	function index( ?selector : String ) : Int;
	function last( ?selector : String ) : JQ;
	function has( selector : String ) : JQ;
	function next( ?selector : String ) : JQ;
	function nextAll( ?selector : String ) : JQ;
	function nextUntil( ?selector : String ) : JQ;

	@:overload(function(j:JQ):JQ{})
	@:overload(function(j:DOMWindow):JQ{})
	@:overload(function(j:Element):JQ{})
	function parent( ?selector : String ) : JQ;
	function parents( ?selector : String ) : JQ;
	function parentsUntil( ?selector : String ) : JQ;
	@:overload(function(value:Element):JQ{})
	function not( selector : String ) : JQ;

	@:overload(function(j:JQ):JQ{})
	@:overload(function(j:DOMWindow):JQ{})
	@:overload(function(j:Element):JQ{})
	function prev( ?selector : String ) : JQ;
	function prevAll( ?selector : String ) : JQ;
	function prevUntil( ?selector : String ) : JQ;
	function pushStack( elements : Array<Element> ) : JQ;

	@:overload(function(j:JQ):JQ{})
	@:overload(function(j:DOMWindow):JQ{})
	@:overload(function(j:Element):JQ{})
	function siblings( ?selector : String ) : JQ;

	function size() : Int;
	function slice( start : Int, ?end : Int ) : JQ;
	function toArray() : Array<Element>;

	// DOM changes
	@:overload(function(value: JQ):JQ{})
	@:overload(function(value: Element):JQ{})
	function before( html : String ) : JQ;

	@:overload(function(value: JQ):JQ{})
	@:overload(function(value: Element):JQ{})
	function after( html : String ) : JQ;

	@:overload(function(value:JQ):JQ{})
	@:overload(function(value:Element):JQ{})
	function append( html : String ) : JQ;

	@:overload(function( selector: JQ ) : JQ{})
	@:overload(function( selector: Element ) : JQ{})
	function appendTo( selector: String ): JQ;
	function detach( ?selector : String ) : JQ;
	function empty() : JQ;

	@:overload(function(value:JQ):JQ{})
	@:overload(function(value:Element):JQ{})
	function insertBefore( html : String ) : JQ;

	@:overload(function(value:JQ):JQ{})
	@:overload(function(value:Element):JQ{})
	function insertAfter( html : String ) : JQ;

	@:overload(function(value:JQ):JQ{})
	@:overload(function(value:Element):JQ{})
	function prepend( html : String ) : JQ;

	@:overload(function(value:JQ):JQ{})
	@:overload(function(value:Element):JQ{})
	function prependTo( html : String ) : JQ;

	function remove( ?selector : String ) : JQ;
	function replaceAll( selector : String ) : JQ;

	@:overload(function(value:JQ):JQ{})
	@:overload(function(value:Element):JQ{})
	function replaceWith( html : String ) : JQ;

	function unwrap() : JQ;

	@:overload(function(value:JQ):JQ{})
	@:overload(function(value:Element):JQ{})
	function wrap( html : String ) : JQ;

	@:overload(function(value:JQ):JQ{})
	@:overload(function(value:Element):JQ{})
	function wrapAll( html : String ) : JQ;

	@:overload(function(value:JQ):JQ{})
	@:overload(function(value:Element):JQ{})
	function wrapInner( html : String ) : JQ;

	// animation
	@:overload(function(properties:{},?duration:Int,?easing:String,?call:Void->Void) : JQ{})
	function animate( properties : { }, ?duration : Int, ?callb : Void -> Void ) : JQ;

	function delay( duration : Int, ?queueName : String ) : JQ;

	@:overload(function(effect:String, ?duration:Int,?easing:String,?call:Void->Void) : JQ{})
	@:overload(function(effect:String, ?opts:Dynamic, ?duration:Int,?call:Void->Void) : JQ{})
	@:overload(function(?duration:Int,?easing:String,?call:Void->Void) : JQ{})
	function hide( ?duration : Int, ?call : Void -> Void ) : JQ;

	@:overload(function(?duration:Int,?easing:String,?call:Void->Void) : JQ{})
	function fadeIn( ?duration : Int, ?call : Void -> Void ) : JQ;

	@:overload(function(?duration:Int,?easing:String,?call:Void->Void) : JQ{})
	function fadeOut( ?duration : Int, ?call : Void -> Void ) : JQ;

	@:overload(function(duration:Int,opacity:Float,?easing:String,?call:Void->Void) : JQ{})
	function fadeTo( duration : Int, opacity : Float, ?call : Void -> Void ) : JQ;

	@:overload(function(?duration:Int,?easing:String,?call:Void->Void) : JQ{})
	function fadeToggle( ?duration : Int, ?call : Void -> Void ) : JQ;

	@:overload(function(effect:String, ?duration:Int,?easing:String,?call:Void->Void) : JQ{})
	@:overload(function(?duration:Int,?easing:String,?call:Void->Void) : JQ{})
	function show( ?duration : Int, ?call : Void -> Void ) : JQ;

	@:overload(function(?duration:Int,?easing:String,?call:Void->Void) : JQ{})
	function slideDown( ?duration : Int, ?call : Void -> Void ) : JQ;

	@:overload(function(?duration:String, ?call:Void->Void) : JQ{})
	@:overload(function(?duration:Int,?easing:String,?call:Void->Void) : JQ{})
	function slideToggle( ?duration : Int, ?call : Void -> Void ) : JQ;

	@:overload(function(?duration:Int,?easing:String,?call:Void->Void) : JQ{})
	function slideUp( ?duration : Int, ?call : Void -> Void ) : JQ;

	function stop( ?clearQueue : Bool, ?jumpToEnd : Bool ) : JQ;

	@:overload(function(effect: String,?duration:Int,?easing:String,?call:Void->Void) : JQ{})
	@:overload(function(?duration:Int,?easing:String,?call:Void->Void) : JQ{})
	function toggle( ?duration : Int, ?call : Void -> Void ) : JQ;
	

	// Events
	function blur( ?callb : JQEvent -> Void ) : JQ;
	function change( ?callb : JQEvent -> Void ) : JQ;

	@:overload(function(callb: Void->Void):JQ { } )
	@:overload(function(callb: JQEvent->Void):JQ{})
	@:overload(function(callb: Void->Bool):JQ{})
	function click( ?callb : JQEvent -> Void ) : JQ;
	function dblclick( ?callb : JQEvent -> Void ) : JQ;
	function error( ?callb : JQEvent -> Void ) : JQ;
	function focus( ?callb : JQEvent -> Void ) : JQ;
	function focusin( ?callb : JQEvent -> Void ) : JQ;
	function focusout( ?callb : JQEvent -> Void ) : JQ;

	@:overload(function( onOver : Void -> Void, ?onOut : Void -> Void ) : JQ{})
	@:overload(function( onInOut:JQEvent->Void ) : JQ{})
	function hover( onIn : JQEvent -> Void, ?onOut : JQEvent -> Void ) : JQ;

	@:overload(function( callb : JQEvent -> Bool ) : JQ {})
	function keydown( ?callb : JQEvent -> Void ) : JQ;

	@:overload(function( callb : JQEvent -> Bool ) : JQ {})
	function keypress( ?callb : JQEvent -> Void ) : JQ;

	@:overload(function( callb : JQEvent -> Bool ) : JQ {})
	function keyup( ?callb : JQEvent -> Void ) : JQ;

	function mousedown( ?callb : JQEvent -> Void ) : JQ;
	function mouseenter( ?callb : JQEvent -> Void ) : JQ;
	function mouseleave( ?callb : JQEvent -> Void ) : JQ;
	@:overload(function( ?callb : Void -> Void ) : JQ{})
	function mouseout( ?callb : JQEvent -> Void ) : JQ;
	@:overload(function( ?callb : Void -> Void ) : JQ{})
	function mouseover( ?callb : JQEvent -> Void ) : JQ;
	@:overload(function( ?callb : Void -> Void ) : JQ{})
	function mousemove( ?callb : JQEvent -> Void ) : JQ;
	function mouseup( ?callb : JQEvent -> Void ) : JQ;

	// AJAX overloads
	@:overload(function( url:String, ?data : {}, ?callb : String -> String -> Void ) : JQ {})
	@:overload(function( url:String, ?data : {}, ?callb : String -> Void ) : JQ {})
	@:overload(function( url:String, ?data : {}, ?callb : Void -> Void ) : JQ {})
	function load( ?callb : JQEvent -> Void ) : JQ;
	function ready( callb : JQEvent -> Void ) : JQ;
	function resize( ?callb : JQEvent -> Void ) : JQ;
	function scroll( ?callb : JQEvent -> Void ) : JQ;
	function select( ?callb : JQEvent -> Void ) : JQ;
	function submit( ?callb : JQEvent -> Void ) : JQ;
	function unload( ?callb : JQEvent -> Void ) : JQ;
	
	@:overload(function(events : String, callb : JQEvent -> Bool):JQ { } )
	@:overload(function(events : String, callb : Void -> Bool):JQ { } )
	function bind( events : String, callb : JQEvent -> Void ) : JQ;

	function delegate( selector : String, events : String, callb : JQEvent -> Void ) : JQ;
	function die( ?events : String, ?callb : JQEvent -> Void ) : JQ;
	function one( events : String, callb : JQEvent -> Void ) : JQ;
	function live( events : String, callb : JQEvent -> Void ) : JQ;
	function trigger( events : String ) : JQ;
	function triggerHandler( events : String ) : JQ;
	function unbind( ?events : String, ?callb : JQEvent -> Void ) : JQ;
	function undelegate( ?selector : String, ?events : String, ?callb : JQEvent -> Void ) : JQ;

	// JQ 1.7+
	@:overload(function( events: String, ?callb: JQEvent->Dynamic -> Void ) : Void{})
	@:overload(function( events: String, ?selector: String, ?callb: JQEvent->Dynamic -> Void) : Void{})
	function on( events : String, callb : JQEvent -> Void ) : JQ;
	function off( events : String, ?callb : JQEvent -> Void ) : JQ;


	// Other
	function destroy():Void;
	function fnDestroy():Void;
	function map(fcn: JQ->Int->Dynamic): Void;
	
	// other tools
	@:overload(function(index:Int):Element{})
	function get() : Array<Element>;

	@:overload(function(j:JQ):Bool{})
	function is( selector : String ) : Bool;

	@:overload(function() : Dynamic {})
	@:overload(function( key : String ) : Dynamic {})
	function data( key : String, value : Dynamic ) : JQ;
	function removeData( ?key : String ) : JQ;
	function serialize() : String;
	function serializeArray() : Array<{ name : String, value : String }>;

	// haXe addition
	@:runtime inline function iterator() : Iterator<JQ> {
		return untyped __define_feature__('m3.jq.JQ.iterator', this["iterator"])();
	}
	
	//my custom JQ functions
	function exists(): Bool;
	function isVisible():Bool;
	function hasAttr(attrName: String):Bool;
	function intersects(el: JQ): Bool;

	//my custom widgets
	function buttonsetv(i:Int, ?cmd: String):JQ;
	function helpToolTips(): JQ;
	
	//JQUI
	@:overload(function<T>(cmd : String):T{})
	@:overload(function<T>(cmd : String, arg: Dynamic):T{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function accordion(options:Dynamic):JQ;

	@:overload(function(arg1:String, arg2:String):JQ{})
	@:overload(function(arg1:String, arg2:String, arg3:String):JQ{})
	function autocomplete(opts:Dynamic):JQ;
	function button(?arg1:Dynamic, ?arg2:Dynamic, ?arg3:Dynamic):Dynamic;
	// function menu(opts: Dynamic): JQ;
	function slider(options: Dynamic): JQ;

	// @:overload(function(cmd : String): Bool{})
	// @:overload(function(cmd: String, opt: String): Dynamic{})
	// @:overload(function(cmd: String, opt: String, newVal: Dynamic): JQ{})
	// function sortable(?opts: {connectWith: String, cancel: String, remove: Dynamic, receive: Dynamic}): JQ.JQSortable;

	@:overload(function(cmd : String):Bool{})
	@:overload(function(cmd : String, arg1 :Dynamic):Void{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function tabs(?opts:Dynamic):JQ;
	// function tooltip(?opts:Dynamic):JQ;

	@:overload(function(): Int{})
	function zIndex(zIndex: Int): JQ;

	@:overload(function(clazzOut: String, clazzIn: String,?duration: Int):JQ{})
	function switchClass( clazzOut: String, clazzIn: String ): JQ;

	@:overload(function(effect: String, options: Dynamic, duration: Int):JQ{})
	function effect( effect: String, duration: Int ): JQ;

	//statically available functions
	public static function isNumeric(val:Dynamic):Bool;
	public static function isArray(val:Dynamic):Bool;
	public static function trim(str:String):String;

	@:overload(function(url : String): JQXHR{})
	@:overload(function(url : String, ajaxOptions: AjaxOptions): JQXHR{})
	public static function ajax(ajaxOptions: AjaxOptions): JQXHR;
	public static function getJSON(url:String, ?data:Dynamic, ?success:Dynamic->Dynamic->Dynamic->Void): JQXHR;
	public static function getScript(url:String, ?success:Dynamic->String->JQXHR->Void): JQXHR;
	// public static function get(url:String, ?data: Dynamic, ?success:Dynamic->String->JQXHR->Void, ?dataType: String): JQXHR;

	@:overload(function(parent: JQ, child: JQ): Bool{})
	@:overload(function(parent: Element, child: JQ): Bool{})
	public static function contains( parent : Element, child : Element ) : Bool;

	@:overload(function(qualifiedName: String, parent: Dynamic, definition: Dynamic):Void{})
	public static function widget(qualifiedName: String, definition: Dynamic): Void;

	@:overload(function<T>(deep: Bool, target: T, object1: T, ?object2: T, ?object3: T, ?object4: T): T{})
	public static function extend<T>(target: T, object1: T, ?object2: T, ?object3: T, ?object4: T): T;

	public static function Deferred(?beforeStart: Deferred->Void): Deferred;

	@:overload(function(d1: Deferred, d2: Deferred, ?d3: Deferred, ?d4: Deferred, ?d5: Deferred): Deferred{})
	public static function when(d1: Deferred): Deferred;

	/**
		Return the current JQ element (in a callback), similar to $(this) in JS.
	**/
	static var cur(get, null) : JQ;
	static var curNoWrap(get, null) : Dynamic;

	private static inline function get_cur() : JQ {
		return untyped __js__("$(this)");
	}
	private static inline function get_curNoWrap() : Element {
		return untyped __js__("this");
	}

	private static function __init__() : Void untyped {
		JQ.fn.exists = function(){
		    return JQ.cur.length>0;
		};
		JQ.fn.isVisible = function(){
		    return JQ.cur.css("display") != "none";
		};
		JQ.fn.hasAttr = function(name) {  
		   return JQ.cur.attr(name) != undefined;
		};
		JQ.fn.intersects = function(el: JQ): Bool {
			var tAxis = JQ.cur.offset();
		    var t_x = [tAxis.left, tAxis.left + JQ.cur.outerWidth()];
		    var t_y = [tAxis.top, tAxis.top + JQ.cur.outerHeight()];

		    var thisPos = el.offset();
	        var i_x = [thisPos.left, thisPos.left + el.outerWidth()];
	        var i_y = [thisPos.top, thisPos.top + el.outerHeight()];

	        var intersects: Bool = false;
	        if ( (t_x[0] < i_x[1] && t_x[1] > i_x[0] &&
	               t_y[0] < i_y[1] && t_y[1] > i_y[0]) ) {
	            intersects = true;
	        }
	        return intersects;
		};
		__feature__('m3.jq.JQ.iterator',
			q.fn.iterator = function() return { pos : 0, j : __this__, hasNext : function() return __this__.pos < __this__.j.length, next : function() return $(__this__.j[__this__.pos++]) }
		);
	}
}