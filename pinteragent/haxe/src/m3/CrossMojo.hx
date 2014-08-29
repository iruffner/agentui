package m3;

import m3.jq.JQ;

class CrossMojo {

	public static function jq(selector:Dynamic, ?arg2:JQ):JQ {
		var v:JQ;
		if(arg2 == null) {
			v = untyped __js__('$(selector)');
		} else {
			v = untyped __js__('$(selector, arg2)');
		}
		return v;
	}

	public static inline function windowConsole():Dynamic {
		return untyped __js__('window.console');
	}

	public static inline function confirm():String->Bool {
		return untyped __js__('confirm');
	}

	public static function pushState(data:Dynamic, title:String, url:String):Void {
		untyped __js__("History.pushState(data, title, url)");
	}

	public static function prettyPrintString(json: String): String {
		return untyped  __js__('JSON.stringify(JSON.parse(json), undefined, 2)');
	}

	public static function prettyPrint(json: Dynamic): String {
		return untyped  __js__('JSON.stringify(json, undefined, 2)');
	}

}