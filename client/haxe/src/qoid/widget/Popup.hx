package ui.widget;

import m3.jq.JQ;
import m3.widget.Widgets;
import ui.model.ModelObj;
import m3.exception.Exception;

using m3.helper.StringHelper;

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

@:native("$")
extern class Popup extends JQ {

	@:overload(function(cmd : String):Bool{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function popup(opts: PopupOptions): Popup;

	private static function __init__(): Void {
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
		        		throw new Exception("Root of Popup must be a div element");
		        	}

		        	selfElement.addClass("ocontainer shadow popup");
		        	if(!self.options.modal) {
		        		new JQ("body").one("click", function(evt: JQEvent): Void {
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