package ui.widget;

import ui.jq.JQ;

class Widgets {

	public static inline function getSelf<T>(): T {
		return untyped __js__("this");
	}

	public static inline function getSelfElement<T>(): T {
		return untyped __js__("this.element");
	}
	
}