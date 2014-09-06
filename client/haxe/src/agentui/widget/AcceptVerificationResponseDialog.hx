package agentui.widget;

import js.html.Element;

import m3.exception.Exception;
import m3.jq.JQ;
import m3.jq.JQDialog;
import m3.widget.Widgets;

import agentui.model.ModelObj;
import agentui.model.EM;

using agentui.widget.ConnectionAvatar;
using m3.helper.OSetHelper;

typedef AcceptVerificationResponseDialogOptions = {
	var notification: VerificationResponseNotification;
}

typedef AcceptVerificationResponseDialogWidgetDef = {
	@:optional var options: AcceptVerificationResponseDialogOptions;

	var initialized: Bool;

	var _create: Void->Void;
	var destroy: Void->Void;

	var _buildDialog: Void->Void;
	var open: Void->Void;

	var acceptVerification: Void->Void;
	var rejectVerification: Void->Void;
}

class AcceptVerificationResponseDialogHelper {
}

@:native("$")
extern class AcceptVerificationResponseDialog extends JQ {

	@:overload(function<T>(cmd : String):T{})
	@:overload(function<T>(cmd:String, opt:String, newVal:Dynamic):T{})
	function acceptVerificationResponseDialog(?opts: AcceptVerificationResponseDialogOptions): AcceptVerificationResponseDialog;

	private static function __init__(): Void {
		var defineWidget: Void->AcceptVerificationResponseDialogWidgetDef = function(): AcceptVerificationResponseDialogWidgetDef {
			return {
		        initialized: false,

		        _create: function(): Void {
		        	var self: AcceptVerificationResponseDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of AcceptVerificationResponseDialog must be a div element");
		        	}
		        	selfElement.addClass("acceptVerificationResponseDialog notification-ui container boxsizingBorder");

		        	var conn: Connection = AppContext.CONNECTIONS.getElement(self.options.notification.fromConnectionIid);

		        	var intro_table = new JQ("<table id='intro-table'><tr><td></td><td></td><td></td></tr></table>").appendTo(selfElement);

		        	var avatar = new ConnectionAvatar("<div class='avatar introduction-avatar'></div>").connectionAvatar({
		        		connectionIid: conn.iid,
		        		dndEnabled: false,
		        		isDragByHelper: true,
		        		containment: false
	        		}).appendTo(intro_table.find("td:nth-child(1)"));

		        	var invitationText = new JQ("<div class='invitationText'></div>").appendTo(intro_table.find("td:nth-child(2)"));
		        	var title = new JQ("<div class='intro-title'>Verification Response</div>").appendTo(invitationText);
		        	var from  =	new JQ("<div class='notification-line'><b>From:</b> " + conn.data.name + "</div>").appendTo(invitationText);
		        	var date  =	new JQ("<div class='notification-line'><b>Date:</b> " + Date.now() + "</div>").appendTo(invitationText);
		        	var message = new JQ("<div class='notification-line'><b>Comments:</b> " + self.options.notification.props.verificationContentData.text + "</div>").appendTo(invitationText);
		        },

		        acceptVerification: function():Void {
		        	var self: AcceptVerificationResponseDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

		        	EM.listenOnce(EMEvent.AcceptVerification_RESPONSE, function(e:Dynamic) {
	        			self.destroy();
	        			selfElement.remove();
		        	});

		        	EM.change(EMEvent.AcceptVerification, self.options.notification.iid);
		        },

		        rejectVerification: function():Void {
		        	var self: AcceptVerificationResponseDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	EM.listenOnce(EMEvent.RejectVerification_RESPONSE, function(e:Dynamic) {
	        			self.destroy();
	        			selfElement.remove();
		        	});

		        	EM.change(EMEvent.RejectVerification, self.options.notification.iid);
		        },

		        _buildDialog: function(): Void {
		        	var self: AcceptVerificationResponseDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQDialog = Widgets.getSelfElement();

		        	self.initialized = true;

		        	var dlgOptions: JQDialogOptions = {
		        		autoOpen: false,
		        		title: "Accept Verification Response",
		        		height: 400,
		        		width: 600,
		        		modal: true,
		        		buttons: {
		        			"Accept": function() {
							    self.acceptVerification();
		        			},
		        			"Reject": function() {
							    self.rejectVerification();
		        			}
		        		},
		        		close: function(evt: JQEvent, ui: UIJQDialog): Void {
		        			selfElement.find(".placeholder").removeClass("ui-state-error");
		        		}
		        	};
		        	selfElement.dialog(dlgOptions);
		        },

	        	open: function(): Void {
		        	var self: AcceptVerificationResponseDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQDialog = Widgets.getSelfElement();

		        	if(!self.initialized) {
		        		self._buildDialog();
		        	}
	        		selfElement.dialog("open");
        		},

		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.acceptVerificationResponseDialog", defineWidget());
	}
}