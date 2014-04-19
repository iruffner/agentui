package qoid.widget;

import js.html.Element;

import m3.exception.Exception;
import m3.jq.JQ;
import m3.jq.JQDraggable;
import m3.jq.JQDroppable;
import m3.jq.JQTooltip;
import m3.observable.OSet;
import m3.util.JqueryUtil;
import m3.widget.Widgets;

import qoid.api.CrudMessage;
import qoid.model.ModelObj;
import qoid.model.Node;
import qoid.model.Filter;
import qoid.model.EM;
import qoid.widget.LabelComp;

using qoid.widget.ConnectionAvatar;
using m3.helper.OSetHelper;

typedef VerificationResponseNotificationCompOptions = {
	var notification: VerificationResponseNotification;
}

typedef VerificationResponseNotificationCompWidgetDef = {
	@:optional var options: VerificationResponseNotificationCompOptions;
	var _create: Void->Void;
	var destroy: Void->Void;
	var acceptVerification: Void->Void;
	var rejectVerification: Void->Void;
}

class VerificationResponseNotificationCompHelper {
}

@:native("$")
extern class VerificationResponseNotificationComp extends JQ {

	@:overload(function<T>(cmd : String):T{})
	@:overload(function<T>(cmd:String, opt:String, newVal:Dynamic):T{})
	function verificationResponseNotificationComp(?opts: VerificationResponseNotificationCompOptions): VerificationResponseNotificationComp;

	private static function __init__(): Void {
		var defineWidget: Void->VerificationResponseNotificationCompWidgetDef = function(): VerificationResponseNotificationCompWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: VerificationResponseNotificationCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of VerificationResponseNotificationComp must be a div element");
		        	}
		        	selfElement.addClass("verificationResponseNotificationComp container boxsizingBorder");

		        	var conn: Connection = AppContext.MASTER_CONNECTIONS.getElement(self.options.notification.fromConnectionIid);

		        	var intro_table = new JQ("<table id='intro-table'><tr><td></td><td></td><td></td></tr></table>").appendTo(selfElement);

		        	var avatar = new ConnectionAvatar("<div class='avatar introduction-avatar'></div>").connectionAvatar({
		        		connectionIid: conn.iid,
		        		dndEnabled: false,
		        		isDragByHelper: true,
		        		containment: false
	        		}).appendTo(intro_table.find("td:nth-child(1)"));

		        	var invitationText = new JQ("<div class='invitationText'></div>").appendTo(intro_table.find("td:nth-child(2)"));
		        	var title = new JQ("<div class='intro-title'>Verification Response</div>").appendTo(invitationText);
		        	var from  =	new JQ("<div class='content-timestamp'><b>From:</b> " + conn.data.name + "</div>").appendTo(invitationText);
		        	var date  =	new JQ("<div class='content-timestamp'><b>Date:</b> " + Date.now() + "</div>").appendTo(invitationText);
		        	var message = new JQ("<div class='invitation-message'>" + self.options.notification.props.verificationContentData + "</div>").appendTo(invitationText);
					
					var accept = new JQ("<button>Accept</button>")
							        .appendTo(invitationText)
							        .button()
							        .click(function(evt: JQEvent): Void {
							        	self.acceptVerification();
							        });
					var reject = new JQ("<button>Reject</button>")
							        .appendTo(invitationText)
							        .button()
							        .click(function(evt: JQEvent): Void {
							        	self.rejectVerification();
							        });

		        },

		        acceptVerification: function():Void {
		        	var self: VerificationResponseNotificationCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

		        	var msg = new VerificationResponse(self.options.notification.iid,"The claim is true");
		        	EM.listenOnce(EMEvent.RespondToVerification_RESPONSE, function(e:Dynamic) {
		        		JqueryUtil.alert("Your response has been received.", "Verification", function() {
		        			self.destroy();
		        			selfElement.remove();
		        		});
		        	});

		        	EM.change(EMEvent.RespondToVerification,msg);
		        },

		        rejectVerification: function():Void {
		        	var self: VerificationResponseNotificationCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

					self.destroy();
		        	selfElement.remove();
		        },

		        destroy: function() {
		        	var self: VerificationResponseNotificationCompWidgetDef = Widgets.getSelf();
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.verificationResponseNotificationComp", defineWidget());
	}
}