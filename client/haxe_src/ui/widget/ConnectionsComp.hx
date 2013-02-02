package ui.widget;

import ui.jq.JQ;
import ui.model.ModelObj;
import ui.observable.OSet;

typedef ConnectionsCompOptions = {
	var connections: ObservableSet<Connection>;
	@:optional var itemsClass: String;
}

typedef ConnectionsCompWidgetDef = {
	var options: ConnectionsCompOptions;
	@:optional var connections: MappedSet<Connection, ConnectionComp>;
	var _create: Void->Void;
	var destroy: Void->Void;
}

extern class ConnectionsComp extends JQ {
	@:overload(function(cmd : String):Bool{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function connectionsComp(opts: ConnectionsCompOptions): ConnectionsComp;

	private static function __init__(): Void {
		untyped ConnectionsComp = window.jQuery;
		var defineWidget: Void->ConnectionsCompWidgetDef = function(): ConnectionsCompWidgetDef {
			return {
		        options: {
		            connections: null,
		            itemsClass: null
		        },

		        
		        _create: function(): Void {
		        	var self: ConnectionsCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	self.connections = new MappedSet<Connection, ConnectionComp>(self.options.connections, function(conn: Connection): ConnectionComp {
		        			return new ConnectionComp("<div></div>").connectionComp({connection: conn});
		        		});
		        	self.connections.listen(function(connComp: ConnectionComp, evt: EventType): Void {
		            		if(evt.isAdd()) {
		            			selfElement.append(connComp);
		            		} else if (evt.isUpdate()) {
		            			connComp.connectionComp("update");
		            		} else if (evt.isDelete()) {
		            			connComp.remove();
		            		}
		            	});
		        },
		        
		        destroy: function() {
		        	var self: ConnectionsCompWidgetDef = Widgets.getSelf();
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.connectionsComp", defineWidget());
	}	
}