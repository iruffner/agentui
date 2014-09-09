package agentui.widget;

import js.html.Element;

import m3.exception.Exception;
import m3.jq.JQ;
import m3.jq.JQDialog;
import m3.widget.Widgets;

import agentui.api.CrudMessage;
import qoid.model.ModelObj;
import agentui.model.EM;
import qoid.Qoid;

using StringTools;
using agentui.widget.ConnectionAvatar;
using m3.helper.OSetHelper;
using m3.helper.StringHelper;

typedef RespondToVerificationRequestDialogOptions = {
	var notification: VerificationRequestNotification;
}

typedef RespondToVerificationRequestDialogWidgetDef = {
	@:optional var options: RespondToVerificationRequestDialogOptions;

	var initialized: Bool;

	var _create: Void->Void;
	var destroy: Void->Void;

	var _buildDialog: Void->Void;
	var open: Void->Void;

	var acceptVerification: Void->Void;
	var rejectVerification: Void->Void;
}

class RespondToVerificationRequestDialogHelper {
}

@:native("$")
extern class RespondToVerificationRequestDialog extends JQ {

	@:overload(function<T>(cmd : String):T{})
	@:overload(function<T>(cmd:String, opt:String, newVal:Dynamic):T{})
	function respondToVerificationRequestDialog(?opts: RespondToVerificationRequestDialogOptions): RespondToVerificationRequestDialog;

	private static function __init__(): Void {
		var defineWidget: Void->RespondToVerificationRequestDialogWidgetDef = function(): RespondToVerificationRequestDialogWidgetDef {
			return {
				initialized: false,

		        _create: function(): Void {
		        	var self: RespondToVerificationRequestDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of RespondToVerificationRequestDialog must be a div element");
		        	}
		        	selfElement.addClass("respondToVerificationRequestDialog notification-ui container boxsizingBorder");

		        	var conn: Connection = Qoid.connections.getElement(self.options.notification.createdByConnectionIid);

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
		        		case "AUDIO":
			        		var audio: AudioContent = cast(content, AudioContent);
			        		contentDiv.append(audio.props.title + "<br/>");
			        		var audioControls: JQ = new JQ("<audio controls></audio>");
			        		contentDiv.append(audioControls);
			        		audioControls.append("<source src='" + audio.props.audioSrc + "' type='" + audio.props.audioType + "'>Your browser does not support the audio element.");

		        		case "IMAGE":
		        			var img: ImageContent = cast(content, ImageContent);
		        			contentDiv.append("<img alt='" + img.props.caption + "' src='" + img.props.imgSrc + "'/>");// + img.caption);

						case "URL":
							var urlContent: UrlContent = cast(content, UrlContent);
							contentDiv.append("<img src='http://picoshot.com/t.php?picurl=" + urlContent.props.url + "'>");

	        			case "TEXT":
	        				var textContent: MessageContent = cast(content, MessageContent);
	        				contentDiv.append("<div class='content-text'><pre class='text-content'>" + textContent.props.text + "</pre></div>"); 
	        			
		        		case "VERIFICATION":
		        			throw new Exception("VerificationContent should not be displayed"); 
		        	}

		        	new JQ("<div class='notification-line'><b>Comments:</b> <input type='text' id='responseText'/></div>").appendTo(invitationText);
					
		        },

		        acceptVerification: function():Void {
		        	var self: RespondToVerificationRequestDialogWidgetDef = Widgets.getSelf();
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
		        	var self: RespondToVerificationRequestDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

		        	EM.listenOnce(EMEvent.RejectVerificationRequest_RESPONSE, function(e:Dynamic) {
	        			self.destroy();
	        			selfElement.remove();
		        	});

		        	EM.change(EMEvent.RejectVerificationRequest, self.options.notification.iid);
		        },

		        _buildDialog: function(): Void {
		        	var self: RespondToVerificationRequestDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQDialog = Widgets.getSelfElement();

		        	self.initialized = true;

		        	var dlgOptions: JQDialogOptions = {
		        		autoOpen: false,
		        		title: "Respond To Verification Request",
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
		        	var self: RespondToVerificationRequestDialogWidgetDef = Widgets.getSelf();
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
		JQ.widget( "ui.respondToVerificationRequestDialog", defineWidget());
	}
}