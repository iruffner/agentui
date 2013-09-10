package ui.widget;

import m3.jq.JQ;

typedef FilterableCompOptions = {
	@:optional var dndEnabled: Bool;
	@:optional var isDragByHelper: Bool;
	@:optional var containment: Dynamic;
	@:optional var classes: String;
	@:optional var cloneFcn: FilterableComponent->Bool->Dynamic->FilterableComponent;
	@:optional var dropTargetClass: String;
	@:optional var helperFcn: Void->JQ;
}

@:native("$")
extern class FilterableComponent extends JQ {
	
}