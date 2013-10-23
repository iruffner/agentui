package ui.widget;

import m3.jq.JQ;
import m3.jq.JQDroppable;
import m3.jq.JQDraggable;
import m3.widget.Widgets;
import ui.model.ModelObj;
import m3.observable.OSet.ObservableSet;
import m3.exception.Exception;

using ui.widget.ConnectionAvatar;

typedef ConnectionCompOptions = {
	var connection: Connection;
	@:optional var classes: String;
}

typedef ConnectionCompWidgetDef = {
	var options: ConnectionCompOptions;
	var _create: Void->Void;
	@:optional var _avatar: ConnectionAvatar;
	var update: Void->Void;
	var destroy: Void->Void;
}

class ConnectionCompHelper {
	public static function connection(c: ConnectionComp): Connection {
		return c.connectionComp("option", "connection");
	}
}


@:native("$")
extern class ConnectionComp extends JQ {
	@:overload(function(cmd : String):Bool{})
	@:overload(function(cmd:String, opt:String):Dynamic{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function connectionComp(opts: ConnectionCompOptions): ConnectionComp;

	private static function __init__(): Void {
		var defineWidget: Void->ConnectionCompWidgetDef = function(): ConnectionCompWidgetDef {
			return {
		        options: {
		            connection: null,
		            classes: null
		        },
		        
		        _create: function(): Void {
		        	var self: ConnectionCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
					if(!selfElement.is("div")) {
		        		throw new Exception("Root of ConnectionComp must be a div element");
		        	}

		        	selfElement.addClass(Widgets.getWidgetClasses() + " connection container boxsizingBorder");
		        	self._avatar = new ConnectionAvatar("<div class='avatar'></div>").connectionAvatar({
		        		connection: self.options.connection,
		        		dndEnabled: true,
		        		isDragByHelper: true,
		        		containment: false
	        		});
		            selfElement.append(self._avatar);
		            selfElement.append("<div class='name'>" + self.options.connection.name() + "</div>");
		        
		            cast(selfElement, JQDroppable).droppable({
			    		accept: function(d) {
			    			return d.is(".connectionAvatar");
			    		},
						activeClass: "ui-state-hover",
				      	hoverClass: "ui-state-active",
				      	greedy: true, 	 	
				      	drop: function( event: JQEvent, _ui: UIDroppable ) {
				      		var dropper:Connection = cast(_ui.draggable, ConnectionAvatar).getConnection();
				      		var droppee:Connection = self.options.connection;

				      		if (dropper.uid != droppee.uid) {
					      		ui.widget.DialogManager.requestIntroduction(dropper, droppee);
					      	}
				      	},
				      	tolerance: "pointer"
			    	});

		        },

		        update: function(): Void {
		        	var self: ConnectionCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

		        	selfElement.children("img").attr("src", self.options.connection.imgSrc);
		            selfElement.children("div").text(self.options.connection.name());

		            self._avatar.connectionAvatar("update");
	        	},
		        
		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.connectionComp", defineWidget());
	}	
}