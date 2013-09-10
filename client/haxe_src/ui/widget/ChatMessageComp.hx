package ui.widget;

import m3.jq.JQ;
import m3.widget.Widgets;
import ui.model.ModelObj;
import m3.observable.OSet;
import ui.widget.LabelComp;
import m3.exception.Exception;

enum ChatOrientation {
	chatRight;
	chatLeft;
}

typedef ChatMessageCompOptions = {
	var message: MessageContent;
	var orientation: ChatOrientation;
}

typedef ChatMessageCompWidgetDef = {
	var options: ChatMessageCompOptions;
	var _create: Void->Void;
	var destroy: Void->Void;
}

@:native("$")
extern class ChatMessageComp extends JQ {

	@:overload(function(cmd : String):Bool{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function chatMessageComp(opts: ChatMessageCompOptions): ChatMessageComp;

	private static function __init__(): Void {
		var defineWidget: Void->ChatMessageCompWidgetDef = function(): ChatMessageCompWidgetDef {
			return {
		        options: {
		            message: null,
		            orientation: null
		        },

		        _create: function(): Void {
		        	var self: ChatMessageCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of ChatMessageComp must be a div element");
		        	}

		        	selfElement.addClass("chatMessageComp ui-helper-clearfix " + self.options.orientation + Widgets.getWidgetClasses());
		        	new JQ("<div>" + self.options.message.text + "</div>").appendTo(selfElement);
		        },
		        
		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.chatMessageComp", defineWidget());
	}
}