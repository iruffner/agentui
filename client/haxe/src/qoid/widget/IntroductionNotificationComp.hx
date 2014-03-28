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

typedef IntroductionNotificationCompOptions = {
	var notification: IntroductionRequestNotification;
}

typedef IntroductionNotificationCompWidgetDef = {
	@:optional var options: IntroductionNotificationCompOptions;
	@:optional var listenerUid: String;
	var _create: Void->Void;
	var destroy: Void->Void;
}

class IntroductionNotificationCompHelper {
}

@:native("$")
extern class IntroductionNotificationComp extends JQ {

	@:overload(function<T>(cmd : String):T{})
	@:overload(function<T>(cmd:String, opt:String, newVal:Dynamic):T{})
	function introductionNotificationComp(?opts: IntroductionNotificationCompOptions): IntroductionNotificationComp;

	private static function __init__(): Void {
		var defineWidget: Void->IntroductionNotificationCompWidgetDef = function(): IntroductionNotificationCompWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: IntroductionNotificationCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of IntroductionNotificationComp must be a div element");
		        	}
		        	selfElement.addClass("introductionNotificationComp container boxsizingBorder");

		        	var conn: Connection = AppContext.MASTER_CONNECTIONS.getElement(self.options.notification.fromConnectionIid);

		        	self.listenerUid = EM.addListener(EMEvent.RespondToIntroduction_RESPONSE, function(e:Dynamic) {
		        		JqueryUtil.alert("Your response has been received.", "Introduction", function() {
		        			self.destroy();
		        			selfElement.remove();
		        		});
		        	});

		        	var intro_table = new JQ("<table id='intro-table'><tr><td></td><td></td><td></td></tr></table>").appendTo(selfElement);

		        	var avatar = new ConnectionAvatar("<div class='avatar introduction-avatar'></div>").connectionAvatar({
		        		connectionIid: conn.iid,
		        		dndEnabled: false,
		        		isDragByHelper: true,
		        		containment: false
	        		}).appendTo(intro_table.find("td:nth-child(1)"));

	        		var invitationConfirmation = function(accepted:Bool) {
	        			var confirmation = new IntroResponseMessage(self.options.notification.iid, accepted);
	        			EM.change(EMEvent.RespondToIntroduction, confirmation);
	        		}

		        	var invitationText = new JQ("<div class='invitationText'></div>").appendTo(intro_table.find("td:nth-child(2)"));
		        	var title = new JQ("<div class='intro-title'>Introduction Request</div>").appendTo(invitationText);
		        	var from  =	new JQ("<div class='content-timestamp'><b>From:</b> " + conn.data.name + "</div>").appendTo(invitationText);
		        	var date  =	new JQ("<div class='content-timestamp'><b>Date:</b> " + Date.now() + "</div>").appendTo(invitationText);
		        	var message = new JQ("<div class='invitation-message'>" + self.options.notification.props.message + "</div>").appendTo(invitationText);
					var accept = new JQ("<button>Accept</button>")
							        .appendTo(invitationText)
							        .button()
							        .click(function(evt: JQEvent): Void {
							        	invitationConfirmation(true);
							        });
					var reject = new JQ("<button>Reject</button>")
							        .appendTo(invitationText)
							        .button()
							        .click(function(evt: JQEvent): Void {
							        	invitationConfirmation(false);
							        });

					intro_table.find("td:nth-child(3)").append(
						"<div>" + self.options.notification.props.profile.name + 
						"</div><div><img class='intro-profile-img container' src='" + self.options.notification.props.profile.imgSrc + "'/></div>");
		        },

		        destroy: function() {
		        	var self: IntroductionNotificationCompWidgetDef = Widgets.getSelf();
		        	EM.removeListener(EMEvent.RespondToIntroduction_RESPONSE, self.listenerUid);
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.introductionNotificationComp", defineWidget());
	}
}