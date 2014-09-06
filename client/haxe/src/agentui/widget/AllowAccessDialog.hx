package qoid.widget;

import m3.jq.JQ;
import m3.jq.JQDialog;
import m3.jq.PlaceHolderUtil;
import m3.widget.Widgets;
import qoid.model.ModelObj;
import qoid.model.EM;
import m3.exception.Exception;

using m3.helper.StringHelper;
using m3.jq.JQDialog;

typedef AllowAccessDialogOptions = {
	label:Label,
	connection:Connection
}

typedef AllowAccessDialogWidgetDef = {
	@:optional var options: AllowAccessDialogOptions;
	
	var _buildDialog: Void->Void;
	var open: Void->Void;

	var _create: Void->Void;
	var destroy: Void->Void;

	var _allowAccess: Void->Void;
}

@:native("$")
extern class AllowAccessDialog extends JQ {

	@:overload(function<T>(cmd : String):T{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function allowAccessDialog(opts: AllowAccessDialogOptions): AllowAccessDialog;

	private static function __init__(): Void {
		var defineWidget: Void->AllowAccessDialogWidgetDef = function(): AllowAccessDialogWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: AllowAccessDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQDialog = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of AllowAccessDialog must be a div element");
		        	}
		        	selfElement.addClass("allowAccessDialog").hide();
		        },

		        _buildDialog: function(): Void {
		        	var self: AllowAccessDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQDialog = Widgets.getSelfElement();

					selfElement.append("<div>Would you like to allow</div>");

	        		new ConnectionAvatar("<div></div>").connectionAvatar({
        				dndEnabled: false,
        				connectionIid: self.options.connection.iid
        			}).appendTo(selfElement);

					selfElement.append("<div>" + self.options.connection.data.name + "</div>");
					selfElement.append("<div>&nbsp;</div>");
					selfElement.append("<div>to access the label:</div>");
					selfElement.append("<div>&nbsp;</div>");

	        		new LabelComp("<div></div>").labelComp({
        				dndEnabled: false,
	        			labelIid: self.options.label.iid
	        		}).appendTo(selfElement);

	        		selfElement.append("<div>&nbsp;&nbsp;?&nbsp;&nbsp;</div>");

		        	var dlgOptions: JQDialogOptions = {
		        		autoOpen: false,
		        		title: "Allow Access",
		        		height: 340,
		        		width: 300,
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
		        	var self: AllowAccessDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQDialog = Widgets.getSelfElement();

		        	EM.listenOnce(EMEvent.AccessGranted, function(n: {}): Void {
             			selfElement.close();
             		});

		        	var parms = {
		        		connectionIid: self.options.connection.iid,
		        		labelIid: self.options.label.iid,
		        	}
		        	EM.change(EMEvent.GrantAccess, parms);
		        },

	        	open: function(): Void {
		        	var self: AllowAccessDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQDialog = Widgets.getSelfElement();

					if (selfElement.exists()) {
						selfElement.empty();
						self._create();
					}
		        	self._buildDialog();

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