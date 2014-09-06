package agentui.widget;

import js.html.Element;

import m3.jq.JQ;
import m3.jq.JQDialog;
import m3.jq.JQDraggable;
import m3.jq.PlaceHolderUtil;
import m3.widget.Widgets;
import agentui.model.ModelObj;
import agentui.model.EM;
import m3.exception.Exception;
import m3.util.JqueryUtil;

using m3.helper.StringHelper;
using m3.helper.OSetHelper;
using m3.jq.JQDialog;

typedef RevokeAccessDialogOptions = {
	connection:Connection
}

typedef RevokeAccessDialogWidgetDef = {
	@:optional var options: RevokeAccessDialogOptions;
	var _buildDialog: Void->Void;
	var open: Void->Void;
	var _create: Void->Void;
	var destroy: Void->Void;
	var _revokeAccess: Void->Void;
}

@:native("$")
extern class RevokeAccessDialog extends JQ {

	@:overload(function<T>(cmd : String):T{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function revokeAccessDialog(opts: RevokeAccessDialogOptions): RevokeAccessDialog;

	private static function __init__(): Void {
		var defineWidget: Void->RevokeAccessDialogWidgetDef = function(): RevokeAccessDialogWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: RevokeAccessDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQDialog = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of RevokeAccessDialog must be a div element");
		        	}
		        	selfElement.addClass("revokeAccessDialog").hide();
		        },

		        _buildDialog: function(): Void {
		        	var self: RevokeAccessDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQDialog = Widgets.getSelfElement();

					var lacls = AppContext.GROUPED_LABELACLS.delegate().get(self.options.connection.iid);
					if (lacls == null) {
						lacls = AppContext.GROUPED_LABELACLS.addEmptyGroup(self.options.connection.iid);
					}

					selfElement.append("<div style='margin-bottom:4px;'>To revoke access, check the label.</div>");

					for (labelAcl in lacls) {
						var laclDiv = new JQ("<div></div>").appendTo(selfElement);
						new JQ('<input type="checkbox" style="position:relative;top:-18px;" id="cb-' + labelAcl.iid + '"/>').appendTo(laclDiv);
		        		new LabelComp("<div></div>").labelComp({
	        				dndEnabled: false,
		        			labelIid: labelAcl.labelIid
		        		}).appendTo(laclDiv);
					}

		        	var dlgOptions: JQDialogOptions = {
		        		autoOpen: false,
		        		title: "Revoke Access",
		        		height: 290,
		        		width: 400,
		        		modal: true,
		        		buttons: {
		        			"Revoke Access": function() {
		        				self._revokeAccess();
		        				JQDialog.cur.dialog("close");
		        			},
		        			"Cancel": function() {
		        				JQDialog.cur.dialog("close");
		        			}
		        		}
		        	};
		        	selfElement.dialog(dlgOptions);
		        },

		        _revokeAccess: function(): Void {
		        	var self: RevokeAccessDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQDialog = Widgets.getSelfElement();

					var se = new Array<LabelAcl>();
					selfElement.find("input[type=checkbox]").each(
						function(indexInArray: Int, ele: Element){
							var cb = new JQ(ele);
							if (cb.prop("checked") == true) {
								var id = cb.attr("id").split("-")[1]; 
								se.push(AppContext.LABELACLS.getElement(id));
							}
						}
					);
					if (se.length > 0) {
						EM.change(EMEvent.RevokeAccess, se);
					}
		        },

	        	open: function(): Void {
		        	var self: RevokeAccessDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQDialog = Widgets.getSelfElement();

					if (selfElement.exists()) {
						selfElement.empty();
						self._create();
					}
		        	self._buildDialog();

	        		selfElement.dialog("open");
		        	selfElement.dialog('widget').attr('id', 'revokeAccessDialog');
        		},
		        
		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.revokeAccessDialog", defineWidget());
	}
}