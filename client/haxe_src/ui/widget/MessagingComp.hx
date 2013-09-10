package ui.widget;

import m3.jq.JQ;
import m3.jq.JQDroppable;
import m3.jq.JQSortable;
import m3.widget.Widgets;
import ui.model.ModelObj;
import m3.observable.OSet;
import ui.widget.LabelComp;
import m3.exception.Exception;

typedef MessagingCompOptions = {
}

typedef MessagingCompWidgetDef = {
	@:optional var options: MessagingCompOptions;
	@:optional var connectionIdToChat: Map<String,ChatComp>;
	var _create: Void->Void;
	var destroy: Void->Void;
}

@:native("$")
extern class MessagingComp extends JQ {

	@:overload(function(cmd : String):Bool{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function messagingComp(?opts: MessagingCompOptions): MessagingComp;

	private static function __init__(): Void {
		var defineWidget: Void->MessagingCompWidgetDef = function(): MessagingCompWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: MessagingCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of MessagingComp must be a div element");
		        	}

		        	var tabs: JQ = selfElement.tabs({
		                activate: function(evt: JQEvent, ui: {newPanel: JQ}) {
		                    ui.newPanel.find(".chatMsgs").each(function() {
		                        JQ.cur.scrollTop(JQ.cur.height());
		                    });
		                }
		            }).find( ".ui-tabs-nav" );
		            cast(tabs, JQSortable).sortable({
						axis: "x",
						stop: function(evt: JQEvent, ui: UISortable) {
							selfElement.tabs( "refresh" );
						}
				    });

		        	selfElement.addClass("messagingComp icontainer " + Widgets.getWidgetClasses());

		        	var ul: JQ = new JQ("<ul></ul>").appendTo(selfElement);

		        	cast(selfElement, JQDroppable).droppable({
				    		accept: function(d) {
				    			return d.is(".connectionAvatar");
				    		},
							activeClass: "ui-state-hover",
					      	hoverClass: "ui-state-active",
					      	greedy: true,
					      	drop: function( event: JQEvent, _ui: UIDroppable ) {
					      		var connection: Connection = cast(_ui.draggable, ConnectionAvatar).connectionAvatar("option", "connection");
					      		var id: String = "chat-" + connection.uid;
					      		//create and add a new Chat Comp
					      		var li: JQ = 
					      			new JQ("<li><a href='#" + id + "'><img src='" + connection.imgSrc + "'></a></li>").appendTo(ul);

					      		var chatComp: ChatComp = new ChatComp("<div id='" + id + "'></div>").chatComp({
					      				connection: connection,
					      				messages: new ObservableSet<MessageContent>(ModelObj.identifier)
					      			});
					      		chatComp.appendTo(selfElement);
					      		selfElement.tabs("refresh");
					      	},
					      	tolerance: "pointer"
				    	});
		        },
		        
		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.messagingComp", defineWidget());
	}
}