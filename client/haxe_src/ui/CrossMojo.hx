package ui;

import ui.jq.JQ;

class CrossMojo {

	public static function jq(selector:Dynamic, ?arg2:js.JQuery):JQ {
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
}