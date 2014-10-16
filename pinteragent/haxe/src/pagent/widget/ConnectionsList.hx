package pagent.widget;

import m3.jq.JQ;
import m3.observable.OSet;
import m3.widget.Widgets;
import m3.exception.Exception;

import qoid.model.ModelObj;

using m3.helper.StringHelper;

typedef ConnectionsListOptions = {
	var connectionIids: OSet<String>;
}

typedef ConnectionsListWidgetDef = {
	@:optional var options: ConnectionsListOptions;
	var _create: Void->Void;
	var destroy: Void->Void;

	@:optional var map: MappedSet<String, ConnectionComp>;
	@:optional var onchange: ConnectionComp->EventType->Void;
}

@:native("$")
extern class ConnectionsList extends JQ {

	@:overload(function<T>(cmd : String):T{})
	@:overload(function<T>(cmd:String, opt:String):T{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function connectionsList(opts: ConnectionsListOptions): ConnectionsList;

	private static function __init__(): Void {
		var defineWidget: Void->ConnectionsListWidgetDef = function(): ConnectionsListWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: ConnectionsListWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of ConnectionList must be a div element");
		        	}

		        	selfElement.addClass("_connectionsList");

			        self.onchange = function(connAvatar: ConnectionComp, evt: EventType): Void {
	            		if(evt.isAdd()) { //don't show the comments label
            				selfElement.append(connAvatar);
	            		} else if (evt.isUpdate()) {
	            			// we don't care.. the image will be updated by the ConnAvatar
	            		} else if (evt.isDelete()) {
	            			connAvatar.remove();
	            		}
	            	};

	        		self.map = new MappedSet<String, ConnectionComp>(self.options.connectionIids, 
		        		function(cnxnIid: String): ConnectionComp {
		        			return new ConnectionComp("<div class='ui-corner-all ui-state-active'></div>").connectionComp({
		        				connectionIid: cnxnIid
		        			});
	        		});

	        		self.map.visualId = "ConnectionList_map";

		        	self.map.listen(self.onchange);
		        },

		        destroy: function() {
		        	var self: ConnectionsListWidgetDef = Widgets.getSelf();
		        	if(self.map != null && self.onchange != null) 
		        		self.map.removeListener(self.onchange);
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.connectionsList", defineWidget());
	}
}