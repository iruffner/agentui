package ui.widget;

import ui.jq.JQ;
import ui.model.ModelObj;
import ui.observable.OSet;

typedef ConnectionsListOptions = {
	var connections: ObservableSet<Connection>;
	@:optional var itemsClass: String;
}

typedef ConnectionsListWidgetDef = {
	var options: ConnectionsListOptions;
	@:optional var connections: MappedSet<Connection, ConnectionComp>;
	var _create: Void->Void;
	var destroy: Void->Void;
}

extern class ConnectionsList extends JQ {
	@:overload(function(cmd : String):Bool{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function connectionsList(opts: ConnectionsListOptions): ConnectionsList;

	private static function __init__(): Void {
		untyped ConnectionsList = window.jQuery;
		var defineWidget: Void->ConnectionsListWidgetDef = function(): ConnectionsListWidgetDef {
			return {
		        options: {
		            connections: null,
		            itemsClass: null
		        },

		        _create: function(): Void {
		        	var self: ConnectionsListWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
					if(!selfElement.is("div")) {
		        		throw new ui.exception.Exception("Root of ConnectionsList must be a div element");
		        	}

					cast(selfElement, JQDroppable).droppable({
			    		accept: function(d) {
			    			return d.is(".connection");
			    		},
						activeClass: "ui-state-hover",
				      	hoverClass: "ui-state-active",
				      	drop: function( event, ui ) {
				      		App.LOGGER.debug("droppable drop");	
				        	// $( this ).addClass( "ui-state-highlight" );
				      	}
				    });

					var spacer: JQ = selfElement.children("#sideRightSpacer");
		        	self.connections = new MappedSet<Connection, ConnectionComp>(self.options.connections, function(conn: Connection): ConnectionComp {
		        			return new ConnectionComp("<div></div>").connectionComp({connection: conn});
		        		});
		        	self.connections.listen(function(connComp: ConnectionComp, evt: EventType): Void {
		            		if(evt.isAdd()) {
		            			spacer.before(connComp);
		            		} else if (evt.isUpdate()) {
		            			connComp.connectionComp("update");
		            		} else if (evt.isDelete()) {
		            			connComp.remove();
		            		}
		            	});
		        },
		        
		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.connectionsList", defineWidget());
	}	
}