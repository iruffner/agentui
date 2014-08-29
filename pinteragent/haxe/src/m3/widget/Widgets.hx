package m3.widget;

import m3.jq.JQ;

class Widgets {

	public static inline function getSelf<T>(): T {
		return untyped __js__("this");
	}

	public static inline function getSelfElement<T>(): T {
		return untyped __js__("this.element");
	}

	public static function getWidgetClasses(): String {
		return " ui-widget";
	}
	
}