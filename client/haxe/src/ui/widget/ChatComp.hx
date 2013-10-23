package ui.widget;

import m3.jq.JQ;
import m3.widget.Widgets;
import ui.model.ModelObj;
import m3.observable.OSet;
import m3.exception.Exception;

typedef ChatCompOptions = {
	var connection: Connection;
	var messages: OSet<MessageContent>;
}

typedef ChatCompWidgetDef = {
	var options: ChatCompOptions;

	@:optional var chatMessages: MappedSet<MessageContent, ChatMessageComp>;
	
	var _create: Void->Void;
	var destroy: Void->Void;
}

@:native("$")
extern class ChatComp extends JQ {
	@:overload(function(cmd : String):Bool{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function chatComp(opts: ChatCompOptions): ChatComp;

	private static function __init__(): Void {
		var defineWidget: Void->ChatCompWidgetDef = function(): ChatCompWidgetDef {
			return {
		        options: {
		            connection: null,
		            messages: null
		        },

		        _create: function(): Void {
		        	var self: ChatCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of ChatComp must be a div element");
		        	}

		        	selfElement.addClass("chatComp " + Widgets.getWidgetClasses());

		        	var chatMsgs: JQ = new JQ("<div class='chatMsgs'></div>").appendTo(selfElement);
		        	var chatInput: JQ = new JQ("<div class='chatInput'></div>").appendTo(selfElement);
		        	var input: JQ = new JQ("<input class='ui-corner-all ui-widget-content boxsizingBorder' />").appendTo(chatInput);

		        	self.chatMessages = new MappedSet<MessageContent, ChatMessageComp>(self.options.messages, function(msg: MessageContent): ChatMessageComp {
		        			return new ChatMessageComp("<div></div>").chatMessageComp({
		        				message: msg,
	        					orientation: ChatMessageComp.ChatOrientation.chatRight
		        			});
		        		});
		        	self.chatMessages.listen(function(chatMessageComp: ChatMessageComp, evt: EventType): Void {
		            		if(evt.isAdd()) {
		            			chatMsgs.append(chatMessageComp);
		            			chatMsgs.scrollTop(chatMsgs.height());
		            		} else if (evt.isUpdate()) {
		            			chatMessageComp.chatMessageComp("update");
		            		} else if (evt.isDelete()) {
		            			chatMessageComp.remove();
		            		}
		            	});
		        },

		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.chatComp", defineWidget());
	}
}