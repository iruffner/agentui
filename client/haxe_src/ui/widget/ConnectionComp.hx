package ui.widget;

import js.JQuery;
import ui.jq.JQ;
import ui.jq.JQDroppable;
import ui.jq.JQDraggable;
import ui.model.ModelObj;
import ui.observable.OSet.ObservableSet;

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

extern class ConnectionComp extends JQ {
	@:overload(function(cmd : String):Bool{})
	@:overload(function(cmd:String, opt:String):Dynamic{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function connectionComp(opts: ConnectionCompOptions): ConnectionComp;

	private static function __init__(): Void {
		untyped ConnectionComp = window.jQuery;
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
		        		throw new ui.exception.Exception("Root of ConnectionComp must be a div element");
		        	}

		        	selfElement.addClass(Widgets.getWidgetClasses() + " connection filterable odd container boxsizingBorder");
		        	self._avatar = new ConnectionAvatar("<div class='avatar'></div>").connectionAvatar({
		        		connection: self.options.connection,
		        		isDragByHelper: true,
		        		containment: false
	        		});
		            selfElement.append(self._avatar);
		            selfElement.append("<div class='name'>" + self.options.connection.fname + " " + self.options.connection.lname + "</div>");
		        },

		        update: function(): Void {
		        	var self: ConnectionCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

		        	selfElement.children("img").attr("src", self.options.connection.imgSrc);
		            selfElement.children("div").text(self.options.connection.fname + " " + self.options.connection.lname);

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