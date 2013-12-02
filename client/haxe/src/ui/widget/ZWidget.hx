package ui.widget;

import m3.exception.Exception;
import m3.jq.JQ;
import m3.jq.M3Dialog;
import m3.widget.Widgets;
import ui.model.ModelObj;
import ui.model.EM;
import ui.api.ProtocolMessage;

using m3.helper.StringHelper;

typedef ZWidgetOptions = {
}

typedef ZWidgetDef = {
	@:optional var options: ZWidgetOptions;
	var _create: Void->Void;
	var destroy: Void->Void;
	var open: Void->Void;
	@:optional var container: JQ;

	@:optional var _data: Map<String, String>;
}

@:native("$")
extern class ZWidget extends JQ {

	@:overload(function<T>(cmd : String):T{})
	@:overload(function<T>(cmd:String, opt:String, newVal:Dynamic):T{})
	function zWidget(?opts: ZWidgetOptions): ZWidget;

	private static function __init__(): Void {
		var defineWidget: Void->ZWidgetDef = function(): ZWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: ZWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of ZWidget must be a div element");
		        	}

		        	selfElement.addClass("zwidget");
		        	self.container = new JQ("<div class=''></div>");
		        	selfElement.append(self.container);
		        	
		        	//introductions
		        	// new JQ("<button>Stop Pinging</button>")
        			// 		.button()
        			// 		.click(function(evt: JQEvent): Void {

        			// 			})
        			// 		.appendTo(self.container);

        			new JQ("<button>Introduction Notification</button>")
        					.button()
        					.click(function(evt: JQEvent): Void {
        							var connection: Connection = AppContext.USER.currentAlias.connectionSet.asArray()[2];

					                var notification: IntroductionNotification = new IntroductionNotification();
					                notification.contentImpl = new IntroductionNotificationData();
					                notification.contentImpl.connection = connection;
					                notification.contentImpl.correlationId = "abc123";
					                notification.contentImpl.message = "Hey guys!  Are you ready to get to know each other???";
					                notification.contentImpl.profile.name = "Uncle Leo";
					                notification.contentImpl.profile.imgSrc = "media/test/uncle_leo.jpg";

					                EM.change(EMEvent.TEST, AppContext.SERIALIZER.toJson(notification));
        						})
        					.appendTo(self.container);

        			new JQ("<button>Introduction Confirmation Response</button>")
        					.button()
        					.click(function(evt: JQEvent): Void {
        							var resp: IntroductionConfirmationResponse = new IntroductionConfirmationResponse();

					                EM.change(EMEvent.TEST, AppContext.SERIALIZER.toJson(resp));
        						})
        					.appendTo(self.container);

        			new JQ("<button>Connect Notification</button>")
        					.button()
        					.click(function(evt: JQEvent): Void {
        							var notification: ConnectNotification = new ConnectNotification();
        							notification.contentImpl.profile.name = "Uncle Leo";
					                notification.contentImpl.profile.imgSrc = "media/test/uncle_leo.jpg";
					                notification.contentImpl.connection = new Connection();
					                notification.contentImpl.connection.source = "fakesource";
					                notification.contentImpl.connection.target = "faketarget";
					                notification.contentImpl.connection.label = "fakelabel";

					                EM.change(EMEvent.TEST, AppContext.SERIALIZER.toJson(notification));
        						})
        					.appendTo(self.container);

					cast(selfElement, M3Dialog).m3dialog({
							autoOpen: false
						});
		        	
		        },

		        open: function() {
					var selfElement: M3Dialog = Widgets.getSelfElement();
					selfElement.m3dialog("open");
	        	},

		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.zWidget", defineWidget());
	}
}