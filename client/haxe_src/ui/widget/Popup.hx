package ui.widget;

import js.JQuery;
import ui.jq.JQ;
import ui.model.ModelObj;
import ui.model.EventModel;
import ui.model.ModelEvents;

using ui.helper.StringHelper;

typedef PopupOptions = {
	var createFcn: JQ->Void;
	@:optional var modal: Bool;
	var positionalElement: JQ;
	// var action: Void->Void;
}

typedef PopupWidgetDef = {
	var options: PopupOptions;
	var _create: Void->Void;
	var destroy: Void->Void;
}

extern class Popup extends JQ {

	@:overload(function(cmd : String):Bool{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function popup(opts: PopupOptions): Popup;

	private static function __init__(): Void {
		untyped Popup = window.jQuery;
		var defineWidget: Void->PopupWidgetDef = function(): PopupWidgetDef {
			return {
				options: {
					createFcn: null,
					modal: false,
					positionalElement: null
				},
		        _create: function(): Void {
		        	var self: PopupWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new ui.exception.Exception("Root of Popup must be a div element");
		        	}

		        	selfElement.addClass("ocontainer shadow popup");
		        	if(!self.options.modal) {
		        		new JQ("body").click(function(evt: JQEvent): Void {
		        			selfElement.remove();
				            self.destroy();
				        });
		        	}
		        	self.options.createFcn(selfElement);
		        	selfElement.position({
		        			my: "left",
		        			at: "right",
		        			of: self.options.positionalElement
		        		});
		        },

		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.popup", defineWidget());
	}
}