package ui.widget;

import ui.jq.JQ;
import ui.model.ModelObj;
import ui.observable.OSet.ObservableSet;

typedef ConnectionCompOptions = {
	var connection: Connection;
	@:optional var classes: String;
}

typedef ConnectionCompWidgetDef = {
	var options: ConnectionCompOptions;
	var _create: Void->Void;
	var update: Void->Void;
	var destroy: Void->Void;
}

extern class ConnectionComp extends JQ {
	@:overload(function(cmd : String):Bool{})
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

		            selfElement.addClass("connection filterable odd container boxsizingBorder");
		            selfElement.append("<img src='" + self.options.connection.imgSrc + "' class='shadow'/>");
		            selfElement.append("<div>" + self.options.connection.fname + " " + self.options.connection.lname + "</div>");

		            cast(selfElement, JQDraggable).draggable({ 
				    		// containment: "#connections", 
				    		revert: function(dropTarget: Dynamic) {

				    			return (dropTarget == null || !cast(dropTarget, JQ).is(".connectionDT")) && JQ.cur.addClass("ui-drop-reverted") != null;
				    		},
				    		// helper: ,
				    		distance: 10,
				    		// grid: [5,5],
				    		scroll: false, 
				    		stop: function(event, ui) {
				    			var clone = ui.helper.clone();
				    			if(true) {
				    				App.LOGGER.debug("true");

				    			}
				    		}
				    	});
		            cast(selfElement, JQDroppable).droppable({
			    		accept: function(d) {
			    			return d.is(".connection") || d.is(".label");
			    		},
						activeClass: "ui-state-hover",
				      	hoverClass: "ui-state-active",
				      	drop: function( event, ui ) {
				      		
				        	
				      	}
			    	});
		        },

		        update: function(): Void {
		        	var self: ConnectionCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

		        	selfElement.children("img").attr("src", self.options.connection.imgSrc);
		            selfElement.children("div").text(self.options.connection.fname + " " + self.options.connection.lname);
	        	},
		        
		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.connectionComp", defineWidget());
	}	
}