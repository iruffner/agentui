package qoid.widget;

import m3.jq.JQ;
import m3.jq.JQDialog;
import m3.widget.Widgets;
import qoid.model.ModelObj;
import qoid.model.EM;
import m3.exception.Exception;
using m3.helper.StringHelper;

typedef VerificationRequestDialogOptions = {
	@:optional var content:Content<Dynamic>;
}

typedef VerificationRequestDialogWidgetDef = {
	@:optional var options: VerificationRequestDialogOptions;
	@:optional var connectionIids: Array<String>;

	var initialized: Bool;

	var _buildDialog: Void->Void;
	var _sendRequest: Void->Void;
	var open: Void->Void;
	var _appendConnectionAvatar: Connection->JQ->Void;

	var _create: Void->Void;
	var destroy: Void->Void;
}

@:native("$")
extern class VerificationRequestDialog extends JQ {

	@:overload(function<T>(cmd : String):T{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function verificationRequestDialog(opts: VerificationRequestDialogOptions): VerificationRequestDialog;

	private static function __init__(): Void {
		var defineWidget: Void->VerificationRequestDialogWidgetDef = function(): VerificationRequestDialogWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: VerificationRequestDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQDialog = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of VerificationRequestDialog must be a div element");
		        	}

		        	selfElement.addClass("verificationRequestDialog").hide();

		        	selfElement.append("<div>Message:</div>");
		        	selfElement.append("<textarea id='vr_message'></textarea>");
		        },

		        _appendConnectionAvatar: function(connection:Connection, parent:JQ): Void {
		        	var avatar = new ConnectionAvatar("<div class='avatar'></div>").connectionAvatar({
		        		connectionIid: connection.iid,
		        		dndEnabled: false,
		        		isDragByHelper: true,
		        		containment: false
	        		}).appendTo(parent).css("display", "inline");

		        	parent.append("<div class='labelDiv' style='display:inline'>" + connection.data.name + "</div>");
		        },

		        initialized: false,

		        _sendRequest: function(): Void {
		        	var self: VerificationRequestDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQDialog = Widgets.getSelfElement();

					var vr = new VerificationRequest(self.options.content.iid, 
						self.connectionIids, new JQ("#vr_message").val());

					EM.listenOnce(EMEvent.VerificationRequest_RESPONSE, function(n:{}):Void{
						selfElement.dialog("close");
					});

					EM.change(EMEvent.VerificationRequest, vr);
	        	},

		        _buildDialog: function(): Void {
		        	var self: VerificationRequestDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQDialog = Widgets.getSelfElement();

					self.connectionIids = new Array<String>();
					for (conn in AppContext.MASTER_CONNECTIONS) {
						self.connectionIids.push(conn.iid);
					}
		        	if (self.initialized) {return;}

		        	self.initialized = true;

		        	var dlgOptions: JQDialogOptions = {
		        		autoOpen: false,
		        		title: "Verification Request",
		        		height: 400,
		        		width: 600,
		        		buttons: {
		        			"Send": function() {
		        				self._sendRequest();
		        			},
		        			"Cancel": function() {
		        				JQDialog.cur.dialog("close");
		        			}
		        		},
		        		close: function(evt: JQEvent, ui: UIJQDialog): Void {
		        			selfElement.find(".placeholder").removeClass("ui-state-error");
		        		}
		        	};
		        	selfElement.dialog(dlgOptions);
		        },

	        	open: function(): Void {
		        	var self: VerificationRequestDialogWidgetDef = Widgets.getSelf();
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
		JQ.widget( "ui.verificationRequestDialog", defineWidget());
	}
}