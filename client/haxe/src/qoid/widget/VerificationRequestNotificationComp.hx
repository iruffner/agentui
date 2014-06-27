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
using StringTools;
using m3.helper.StringHelper;

typedef VerificationRequestNotificationCompOptions = {
	var notification: VerificationRequestNotification;
}

typedef VerificationRequestNotificationCompWidgetDef = {
	@:optional var options: VerificationRequestNotificationCompOptions;
	var _create: Void->Void;
	var destroy: Void->Void;
	var acceptVerification: Void->Void;
	var rejectVerification: Void->Void;
}

class VerificationRequestNotificationCompHelper {
}

@:native("$")
extern class VerificationRequestNotificationComp extends JQ {

	@:overload(function<T>(cmd : String):T{})
	@:overload(function<T>(cmd:String, opt:String, newVal:Dynamic):T{})
	function verificationRequestNotificationComp(?opts: VerificationRequestNotificationCompOptions): VerificationRequestNotificationComp;

	private static function __init__(): Void {
		var defineWidget: Void->VerificationRequestNotificationCompWidgetDef = function(): VerificationRequestNotificationCompWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: VerificationRequestNotificationCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of VerificationRequestNotificationComp must be a div element");
		        	}
		        	selfElement.addClass("verificationRequestNotificationComp notification-ui container boxsizingBorder");

		        	var conn: Connection = AppContext.CONNECTIONS.getElement(self.options.notification.fromConnectionIid);

		        	var intro_table = new JQ("<table id='intro-table'><tr><td></td><td></td><td></td></tr></table>").appendTo(selfElement);

		        	var avatar = new ConnectionAvatar("<div class='avatar introduction-avatar'></div>").connectionAvatar({
		        		connectionIid: conn.iid,
		        		dndEnabled: false,
		        		isDragByHelper: true,
		        		containment: false
	        		}).appendTo(intro_table.find("td:nth-child(1)"));

		        	var invitationText = new JQ("<div class='invitationText'></div>").appendTo(intro_table.find("td:nth-child(2)"));
		        	var title = new JQ("<div class='intro-title'>Verification Request</div>").appendTo(invitationText);
		        	var from  =	new JQ("<div class='notification-line'><b>From:</b> " + conn.data.name + "</div>").appendTo(invitationText);
		        	var date  =	new JQ("<div class='notification-line'><b>Date:</b> " + Date.now() + "</div>").appendTo(invitationText);
		        	var message = new JQ("<div class='notification-line'><b>Message:</b> " + self.options.notification.props.message + "</div>").appendTo(invitationText);
		        	new JQ("<div class='notification-line' style='margin-top:7px;'><b>Content:</b></div>").appendTo(invitationText);
		        	var content = self.options.notification.props.getContent();

		        	var contentDiv = new JQ("<div class='container content-div'></div>").appendTo(invitationText);
		        	switch(content.contentType) {
		        		case ContentType.AUDIO:
			        		var audio: AudioContent = cast(content, AudioContent);
			        		contentDiv.append(audio.props.title + "<br/>");
			        		var audioControls: JQ = new JQ("<audio controls></audio>");
			        		contentDiv.append(audioControls);
			        		audioControls.append("<source src='" + audio.props.audioSrc + "' type='" + audio.props.audioType + "'>Your browser does not support the audio element.");

		        		case ContentType.IMAGE:
		        			var img: ImageContent = cast(content, ImageContent);
		        			contentDiv.append("<img alt='" + img.props.caption + "' src='" + img.props.imgSrc + "'/>");// + img.caption);

						case ContentType.URL:
							var urlContent: UrlContent = cast(content, UrlContent);
							contentDiv.append("<img src='http://picoshot.com/t.php?picurl=" + urlContent.props.url + "'>");

	        			case ContentType.TEXT:
	        				var textContent: MessageContent = cast(content, MessageContent);
	        				contentDiv.append("<div class='content-text'><pre class='text-content'>" + textContent.props.text + "</pre></div>"); 
	        			
		        		case ContentType.VERIFICATION:
		        			throw new Exception("VerificationContent should not be displayed"); 
		        	}

		        	new JQ("<div class='notification-line'><b>Comments:</b> <input type='text' id='responseText'/></div>").appendTo(invitationText);
					
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
		        	var self: VerificationRequestNotificationCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

					var text:String = new JQ("#responseText").val();
					if (text.isBlank()) {text = "The claim is true";}
		        	var msg = new VerificationResponse(self.options.notification.iid, text);
		        	EM.listenOnce(EMEvent.RespondToVerification_RESPONSE, function(e:Dynamic) {
	        			self.destroy();
	        			selfElement.remove();
		        	});

		        	EM.change(EMEvent.RespondToVerification,msg);
		        },

		        rejectVerification: function():Void {
		        	var self: VerificationRequestNotificationCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

		        	EM.listenOnce(EMEvent.RejectVerificationRequest_RESPONSE, function(e:Dynamic) {
	        			self.destroy();
	        			selfElement.remove();
		        	});

		        	EM.change(EMEvent.RejectVerificationRequest, self.options.notification.iid);
		        },

		        destroy: function() {
		        	var self: VerificationRequestNotificationCompWidgetDef = Widgets.getSelf();
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.verificationRequestNotificationComp", defineWidget());
	}
}