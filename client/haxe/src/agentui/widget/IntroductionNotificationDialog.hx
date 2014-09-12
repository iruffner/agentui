package agentui.widget;

import m3.jq.JQ;
import m3.jq.JQDialog;
import m3.jq.PlaceHolderUtil;
import m3.observable.OSet.EventType;
import m3.widget.Widgets;
import qoid.model.ModelObj;
import agentui.model.EM;
import agentui.api.CrudMessage;
import m3.exception.Exception;
import qoid.Qoid;

using m3.helper.StringHelper;
using m3.helper.OSetHelper;

typedef IntroductionNotificationDialogOptions = {
	var notification: IntroductionRequestNotification;
}

typedef IntroductionNotificationDialogWidgetDef = {
	@:optional var options: IntroductionNotificationDialogOptions;
	
	var initialized: Bool;

	var _respondToIntroduction: Bool->Void;

	var _buildDialog: Void->Void;
	var open: Void->Void;

	var _create: Void->Void;
	var destroy: Void->Void;
}

@:native("$")
extern class IntroductionNotificationDialog extends JQ {

	@:overload(function(cmd : String):Bool{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function introductionNotificationDialog(?opts: IntroductionNotificationDialogOptions): IntroductionNotificationDialog;

	private static function __init__(): Void {
		var defineWidget: Void->IntroductionNotificationDialogWidgetDef = function(): IntroductionNotificationDialogWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: IntroductionNotificationDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of IntroductionNotificationComp must be a div element");
		        	}
		        	selfElement.addClass("introductionNotificationComp notification-ui container boxsizingBorder");

		        	var conn: Connection = Qoid.connections.getElement(self.options.notification.createdByConnectionIid);

		        	var intro_table = new JQ("<table id='intro-table'><tr><td></td><td></td><td></td></tr></table>").appendTo(selfElement);

		        	var avatar = new ConnectionAvatar("<div class='avatar introduction-avatar'></div>").connectionAvatar({
		        		connectionIid: conn.iid,
		        		dndEnabled: false,
		        		isDragByHelper: true,
		        		containment: false
	        		}).appendTo(intro_table.find("td:nth-child(1)"));

		        	var invitationText = new JQ("<div class='invitationText'></div>").appendTo(intro_table.find("td:nth-child(2)"));
		        	var title = new JQ("<div class='intro-title'>Introduction Request</div>").appendTo(invitationText);
		        	var from  =	new JQ("<div><b>From:</b> " + conn.data.name + "</div>").appendTo(invitationText);
		        	var date  =	new JQ("<div><b>Date:</b> " + Date.now() + "</div>").appendTo(invitationText);
		        	var message = new JQ("<div class='invitation-message'>" + self.options.notification.props.message + "</div>").appendTo(invitationText);

		        	var nameDiv: JQ = new JQ("<div></div>");
		        	var imgDiv: JQ = new JQ("<div></div>");

		        	var listener = function(p: Profile, evt: EventType) {
		        		if(evt.isAddOrUpdate()) {
		        			nameDiv.html(p.name);
		        			var imgSrc: String = "media/default_avatar.jpg";
				        	if(m3.util.M.getX(p.imgSrc, "").isNotBlank() ) {
				        		imgSrc = p.imgSrc;
				        	}
		        			imgDiv.empty().append(new JQ("<img class='intro-profile-img container' src='" + imgSrc + "'/>"));
		        		}
		        	}
		        	Qoid.profiles.listen(listener);
					intro_table.find("td:nth-child(3)").append(nameDiv).append( imgDiv );
		        },

		        initialized: false,

		        _respondToIntroduction: function(accepted:Bool) {
		        	var self: IntroductionNotificationDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQDialog = Widgets.getSelfElement();

					var listener1: String = null;
					var listener2: String = null;
		        	
		        	listener1 = EM.listenOnce(EMEvent.OnConsumeNotification, function(e:Dynamic) {
	        			self.destroy();
	        			selfElement.remove();
	        			EM.removeListener(EMEvent.OnAcceptIntroduction, listener2);
		        	});

		        	listener2 = EM.listenOnce(EMEvent.OnAcceptIntroduction, function(e:Dynamic) {
	        			self.destroy();
	        			selfElement.remove();
	        			EM.removeListener(EMEvent.OnConsumeNotification, listener1);
		        	});

        			var confirmation = new IntroResponseMessage(self.options.notification.iid, accepted);
        			EM.change(EMEvent.RespondToIntroduction, confirmation);
        		},

		        _buildDialog: function(): Void {
		        	var self: IntroductionNotificationDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQDialog = Widgets.getSelfElement();

		        	self.initialized = true;

		        	var dlgOptions: JQDialogOptions = {
		        		autoOpen: false,
		        		title: "Respond To Introduction",
		        		height: 400,
		        		width: 600,
		        		modal: true,
		        		buttons: {
		        			"Accept": function() {
							    self._respondToIntroduction(true);
		        			},
		        			"Reject": function() {
							    self._respondToIntroduction(false);
		        			}
		        		},
		        		close: function(evt: JQEvent, ui: UIJQDialog): Void {
		        			selfElement.find(".placeholder").removeClass("ui-state-error");
		        		}
		        	};
		        	selfElement.dialog(dlgOptions);
		        },

	        	open: function(): Void {
		        	var self: IntroductionNotificationDialogWidgetDef = Widgets.getSelf();
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
		JQ.widget( "ui.introductionNotificationDialog", defineWidget());
	}
}