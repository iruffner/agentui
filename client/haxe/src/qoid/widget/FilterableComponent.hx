package ui.widget;

import m3.jq.JQ;
import m3.jq.JQDraggable;

typedef FilterableCompOptions = {
	@:optional var dndEnabled: Bool;
	@:optional var isDragByHelper: Bool;
	@:optional var containment: Dynamic;
	@:optional var classes: String;
	@:optional var cloneFcn: FilterableComponent->Bool->Dynamic->(JQEvent->UIDraggable->Void)->FilterableComponent;
	@:optional var dropTargetClass: String;
	@:optional var helperFcn: Void->JQ;
	@:optional var dragstop: JQEvent->UIDraggable->Void;
}

@:native("$")
extern class FilterableComponent extends JQ {
	
}