package ui.widget;

import ui.jq.JQ;

typedef FilterableCompOptions = {
	@:optional var dndEnabled: Bool;
	@:optional var isDragByHelper: Bool;
	@:optional var containment: Dynamic;
	@:optional var classes: String;
	@:optional var cloneFcn: FilterableComponent->Bool->Dynamic->FilterableComponent;
	@:optional var dropTargetClass: String;
	@:optional var helperFcn: Void->JQ;
}

extern class FilterableComponent extends JQ {
	private static function __init__() : Void untyped {
		FilterableComponent = window.jQuery;
	}
}