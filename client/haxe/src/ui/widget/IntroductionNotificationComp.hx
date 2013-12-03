package ui.widget;

import js.html.Element;

import m3.exception.Exception;
import m3.jq.JQ;
import m3.jq.JQDraggable;
import m3.jq.JQDroppable;
import m3.jq.JQTooltip;
import m3.observable.OSet;
import m3.util.JqueryUtil;
import m3.widget.Widgets;

import ui.api.ProtocolMessage;
import ui.model.ModelObj;
import ui.model.Node;
import ui.model.Filter;
import ui.model.EM;
import ui.widget.LabelComp;

using ui.widget.LiveBuildToggle;
using ui.widget.ConnectionAvatar;
using m3.helper.OSetHelper;

typedef IntroductionNotificationCompOptions = {
	var notification: IntroductionNotification;
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

		        	var data = self.options.notification.contentImpl;

		        	var conn: Connection = data.connection;
		        	var connFromAlias: Connection = AppContext.USER.currentAlias.connectionSet.getElement(conn.uid);
		        	if(connFromAlias != null) conn.profile = connFromAlias.profile;

		        	self.listenerUid = EM.addListener(EMEvent.INTRODUCTION_CONFIRMATION_RESPONSE, new EMListener(function(e:Dynamic) {
		        		JqueryUtil.alert("Your response has been received.", "Introduction", function() {
		        			EM.change(EMEvent.DELETE_NOTIFICATION, self.options.notification);
		        			self.destroy();
		        			selfElement.remove();
		        		});
		        	}));

		        	var intro_table = new JQ("<table id='intro-table'><tr><td></td><td></td><td></td></tr></table>").appendTo(selfElement);

		        	var avatar = new ConnectionAvatar("<div class='avatar introduction-avatar'></div>").connectionAvatar({
		        		connection: data.connection,
		        		dndEnabled: false,
		        		isDragByHelper: true,
		        		containment: false
	        		}).appendTo(intro_table.find("td:nth-child(1)"));

	        		var invitationConfirmation = function(accepted:Bool) {
	        			var confirmation = new IntroductionConfirmation( accepted, data.introSessionId, data.correlationId);
	        			EM.change(EMEvent.INTRODUCTION_CONFIRMATION, confirmation);
	        		}

		        	var invitationText = new JQ("<div class='invitationText'></div>").appendTo(intro_table.find("td:nth-child(2)"));
		        	var title = new JQ("<div class='intro-title'>Introduction Request</div>").appendTo(invitationText);
		        	var from  =	new JQ("<div class='content-timestamp'><b>From:</b> " + data.connection.profile.name + "</div>").appendTo(invitationText);
		        	var date  =	new JQ("<div class='content-timestamp'><b>Date:</b> " + Date.now() + "</div>").appendTo(invitationText);
		        	var message = new JQ("<div class='invitation-message'>" + data.message + "</div>").appendTo(invitationText);
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

					intro_table.find("td:nth-child(3)").append("<div>" + data.profile.name + "</div><div><img class='intro-profile-img container' src='" + data.profile.imgSrc + "'/></div>");
		        },

		        destroy: function() {
		        	var self: IntroductionNotificationCompWidgetDef = Widgets.getSelf();
		        	EM.removeListener(EMEvent.INTRODUCTION_CONFIRMATION_RESPONSE, self.listenerUid);
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.introductionNotificationComp", defineWidget());
	}
}