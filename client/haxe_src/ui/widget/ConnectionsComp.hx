package ui.widget;

import ui.jq.JQ;
import ui.model.ModelObj;
import ui.observable.OSet.ObservableSet;

typedef ConnectionsCompOptions = {
	var connections: ObservableSet<Connection>;
	var itemsClass: String;
}

typedef ConnectionsCompWidgetDef = {
	var options: ConnectionsCompOptions;
	var _create: Void->Void;
	var destroy: Void->Void;
}

extern class ConnectionsComp extends JQ {
	function connectionWidget(opts: ConnectionsCompOptions): ConnectionsComp;

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

		            
		        },
		        
		        destroy: function() {
		        	var self: ConnectionsCompWidgetDef = Widgets.getSelf();
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.connectionWidget", defineWidget());
	}	
}