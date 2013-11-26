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
		        	selfElement.addClass("introductionNotificationComp container");
		        	var data = self.options.notification.contentImpl;
		        	var avatar = new ConnectionAvatar("<div class='avatar'></div>").connectionAvatar({
		        		connection: data.connection,
		        		dndEnabled: false,
		        		isDragByHelper: true,
		        		containment: false
	        		}).appendTo(selfElement).css("float", "left").css("width", "100px").css("height", "150px");

	        		var invitationConfirmation = function(accepted:Bool) {
	        			var confirmation = new IntroductionConfirmation( accepted, data.introSessionId, data.correlationId);
	        			EM.change(EMEvent.INTRODUCTION_CONFIRMATION, confirmation);
	        			selfElement.remove();
	        		}

		        	var invitationText = new JQ("<div class='invitationText'></div>").appendTo(selfElement);
		        	var title = new JQ("<div class='intro-title'>Introduction Request</div>").appendTo(invitationText);
		        	var date  =	new JQ("<div class='content-timestamp'>From: " + Date.now() + "</div>").appendTo(invitationText);
		        	var date  =	new JQ("<div class='content-timestamp'>" + Date.now() + "</div>").appendTo(invitationText);
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
		        },

		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.introductionNotificationComp", defineWidget());
	}
}