package ui.widget;

import m3.exception.Exception;
import m3.jq.JQ;
import m3.jq.JQDroppable;
import m3.observable.OSet;
import m3.widget.Widgets;

import ui.api.ProtocolMessage;
import ui.model.EM;
import ui.model.ModelObj;

using ui.widget.ConnectionComp;
using Lambda;

typedef ConnectionsListOptions = {
	@:optional var itemsClass: String;
}

typedef ConnectionsListWidgetDef = {
	var options: ConnectionsListOptions;
	// var connections: ObservableSet<Connection>;
	@:optional var connectionsMap: MappedSet<Connection, ConnectionComp>;
	var _create: Void->Void;
	var _setConnections: ObservableSet<Connection>->Void;
	var destroy: Void->Void;
	var filterConnections: String->Void;
	var _mapListener: Connection->ConnectionComp->EventType->Void;
}

class ConnectionListHelper {
	public static function filterConnections(c: ConnectionsList, term:String): Void {
		c.connectionsList("filterConnections", term);
	}
}

@:native("$")
extern class ConnectionsList extends JQ {
	@:overload(function<T>(cmd : String):T{})
	@:overload(function<T>(cmd:String, opt:String):T{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function connectionsList(?opts: ConnectionsListOptions): ConnectionsList;

	private static function __init__(): Void {
		var defineWidget: Void->ConnectionsListWidgetDef = function(): ConnectionsListWidgetDef {
			return {
		        options: {
		            itemsClass: null
		        },

		        _create: function(): Void {
		        	var self: ConnectionsListWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
					if(!selfElement.is("div")) {
		        		throw new Exception("Root of ConnectionsList must be a div element");
		        	}

		        	selfElement.addClass(Widgets.getWidgetClasses());

		        	EM.addListener(EMEvent.AliasLoaded, new EMListener(function(alias: Alias) {
			                AppContext.LOGGER.warn("fix me self._setConnections(alias.connectionSet)");
			                // self._setConnections(alias.connectionSet);
			            }, "ConnectionsList-Alias")
			        );

			        EM.addListener(EMEvent.TARGET_CHANGE, new EMListener(function(conn: Connection) {
			        		if(conn != null) {
			        			AppContext.LOGGER.warn("fix me self._setConnections(conn.connectionSet)");
//			                	self._setConnections(conn.connectionSet);
			        		} else { 
			        			AppContext.LOGGER.warn("fix me self._setConnections(alias.connectionSet)");
		                		// self._setConnections(AppContext.alias.connectionSet);
		                	}
			            }, "ConnectionsList-TargetChange")
			        );

			        EM.addListener(EMEvent.INTRODUCTION_NOTIFICATION, new EMListener(function(notification: IntroductionNotification): Void {
			        		var conn: Connection = notification.contentImpl.connection;
			        		self.connectionsMap.iter(
			        				function(cc: ConnectionComp): Void {
			        					if(cc.connection().equals(conn)) {
			        						cc.addNotification();
			        						cc.prependTo(selfElement); // move to the top
			        					}
			        				}
			        			);

			        	}, "ConnectionsList-IntroductionNotification"));

			        EM.addListener(EMEvent.DELETE_NOTIFICATION, new EMListener(function(notification: IntroductionNotification): Void {
			        		var conn: Connection = notification.contentImpl.connection;
			        		self.connectionsMap.iter(
			        				function(cc: ConnectionComp): Void {
			        					if(cc.connection().equals(conn)) {
			        						cc.deleteNotification();
			        					}
			        				}
			        			);

			        	}, "ConnectionsList-DeleteNotification"));
		        },

		        _mapListener: function(conn: Connection, connComp: ConnectionComp, evt: EventType): Void {
            		if(evt.isAdd()) {
			        	var spacer: JQ = new JQ("#sideRightSpacer");
            			spacer.before(connComp);
            		} else if (evt.isUpdate()) {
            			connComp.update(conn);
            		} else if (evt.isDelete()) {
            			connComp.remove();
            		}
					EM.change(EMEvent.FitWindow);
            	},

		        _setConnections: function(connections: ObservableSet<Connection>): Void {
		        	var self: ConnectionsListWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

		        	selfElement.children(".connection").remove();
		        	
		        	if (self.connectionsMap != null) {
		        		self.connectionsMap.removeListeners(self._mapListener);
		        	}
		        	self.connectionsMap = new MappedSet<Connection, ConnectionComp>(connections, function(conn: Connection): ConnectionComp {
		        		return new ConnectionComp("<div></div>").connectionComp({connection: conn});
		        	});
		        	
		        	self.connectionsMap.mapListen(self._mapListener);
		        },
		        
		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        },

		        filterConnections: function(term:String):Void {
		        	term = term.toLowerCase();

		        	var self: ConnectionsListWidgetDef = Widgets.getSelf();

		        	var iter: Iterator<ConnectionComp> = self.connectionsMap.iterator();
		        	while (iter.hasNext()) {
		        		var c:ConnectionComp = iter.next();
		        		if (term == "" || c.connection().name().toLowerCase().indexOf(term) != -1) {
		        			c.show();
		        		} else {
		        			c.hide();
		        		}
		        	}
		        }
		    };
		}
		JQ.widget( "ui.connectionsList", defineWidget());
	}	
}