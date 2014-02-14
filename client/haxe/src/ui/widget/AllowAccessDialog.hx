package ui.widget;

import m3.jq.JQ;
import m3.jq.JQDialog;
import m3.jq.PlaceHolderUtil;
import m3.widget.Widgets;
import ui.model.ModelObj;
import ui.model.EM;
import m3.exception.Exception;

using m3.helper.StringHelper;

typedef AllowAccessDialogOptions = {
}

typedef AllowAccessDialogWidgetDef = {
	@:optional var options: AllowAccessDialogOptions;
	@:optional var _initialized: Bool;
	
	var open: Void->Void;

	var _allowAccess: Void->Void;
	var _create: Void->Void;
	var _buildDialog: Void->Void;
	var destroy: Void->Void;
}

@:native("$")
extern class AllowAccessDialog extends JQ {

	@:overload(function(cmd : String):Bool{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function allowAccessDialog(?opts: AllowAccessDialogOptions): AllowAccessDialog;

	private static function __init__(): Void {
		var defineWidget: Void->AllowAccessDialogWidgetDef = function(): AllowAccessDialogWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: AllowAccessDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQDialog = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of AllowAccessDialog must be a div element");
		        	}
		        	self._initialized = false;
		        	selfElement.addClass("allowAccessDialog").hide();
		        },

		        _buildDialog: function(): Void {
		        	var self: AllowAccessDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQDialog = Widgets.getSelfElement();

		        	self._initialized = true;

		        	var dlgOptions: JQDialogOptions = {
		        		autoOpen: false,
		        		title: "Allow Access",
		        		height: 320,
		        		width: 400,
		        		modal: true,
		        		buttons: {
		        			"Allow": function() {
		        				self._allowAccess();
		        			},
		        			"Cancel": function() {
		        				JQDialog.cur.dialog("close");
		        			}
		        		}
		        	};
		        	selfElement.dialog(dlgOptions);
		        },

		        _allowAccess: function() : Void {

		        },

	        	open: function(): Void {
		        	var self: AllowAccessDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQDialog = Widgets.getSelfElement();

		        	if(!self._initialized) {
		        		self._buildDialog();
		        	}
	        		selfElement.dialog("open");
        		},
		        
		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.allowAccessDialog", defineWidget());
	}
}