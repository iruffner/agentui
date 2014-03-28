package qoid.widget;

import m3.exception.Exception;
import m3.jq.JQ;
import m3.jq.JQDroppable;
import m3.jq.M3Menu;
import m3.observable.OSet;
import m3.util.JqueryUtil;
import m3.widget.Widgets;

import qoid.model.EM;
import qoid.model.ModelObj;
import qoid.widget.DialogManager;

using qoid.widget.ConnectionComp;
using Lambda;

typedef ConnectionsListOptions = {
	@:optional var itemsClass: String;
}

typedef ConnectionsListWidgetDef = {
	@:optional var options: ConnectionsListOptions;
	@:optional var connectionsMap: MappedSet<Connection, ConnectionComp>;
	@:optional var selectedConnectionComp:ConnectionComp;
	@:optional var id:String;
	var _create: Void->Void;
	var _setConnections: OSet<Connection>->Void;
	var destroy: Void->Void;
	var filterConnections: String->Void;
	@:optional var _mapListener: Connection->ConnectionComp->EventType->Void;
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
		        _create: function(): Void {
		        	var self: ConnectionsListWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
					if(!selfElement.is("div")) {
		        		throw new Exception("Root of ConnectionsList must be a div element");
		        	}
		        	selfElement.addClass(Widgets.getWidgetClasses() + " connectionsList");
		        	self.id = selfElement.attr("id");
		        	var spacer = new JQ('<div id="' + self.id + '-spacer" class="sideRightSpacer spacer clear"></div>')
		        		.appendTo(selfElement);

		        	var menu: M3Menu = new M3Menu("<ul id='label-action-menu'></ul>");
		        	menu.appendTo(selfElement);
        			menu.m3menu({
        				classes: "container shadow",
    					menuOptions: [
    						{ 
    							label: "Revoke Access...",
    							icon: "ui-icon-circle-plus",
    							action: function(evt: JQEvent, m: M3Menu): Void {
    								DialogManager.revokeAccess(self.selectedConnectionComp.connection());
    							}
    						},
    						{ 
    							label: "Delete Connection",
    							icon: "ui-icon-circle-minus",
    							action: function(evt: JQEvent, m: M3Menu): Void {
    								if (self.selectedConnectionComp != null) {
    									JqueryUtil.confirm("Delete Connection", "Are you sure you want to delete this connection?", 
   		        							function(){
   		        								EM.change(EMEvent.DeleteConnection, self.selectedConnectionComp.connection());
   		        							}
   		        						);
    								}
    							}
    						}
    					],
    					width: 225
    				}).hide();
		        
					selfElement.bind("contextmenu",function(evt: JQEvent): Dynamic {
	        			menu.show();
	        			menu.position({
	        				my: "left top",
	        				of: evt
	        			});

	        			var target = new JQ(evt.target);

	        			if (!target.hasClass("connection")) {
	        				var parents = target.parents(".connection");
	        				if (parents.length > 0) {
	        					target = new JQ(parents[0]);
	        				} else {
	        					target = null;
	        				}
	        			}

	        			if (target != null) {
	        				self.selectedConnectionComp = new ConnectionComp(target);
	        			} else {
	        				self.selectedConnectionComp = null;
	        			}

						evt.preventDefault();
	        			evt.stopPropagation();
	        			return false;
					});

			        self._mapListener = function(conn: Connection, connComp: ConnectionComp, evt: EventType): Void {
	            		if(evt.isAdd()) {
	            			spacer.before(connComp);
	            		} else if (evt.isUpdate()) {
	            			connComp.update(conn);
	            		} else if (evt.isDelete()) {
	            			connComp.remove();
	            		}
						EM.change(EMEvent.FitWindow);
	            	};

		        	var connections:OSet<Connection> = null;
		        	if (selfElement.attr("id") == "connections-all") {
		        		connections = AppContext.MASTER_CONNECTIONS;
		        	} else {
		        		var aliasIid = selfElement.attr("id").split("-")[1];
		        		connections = AppContext.GROUPED_CONNECTIONS.delegate().get(aliasIid);
	        			if (connections == null) {
	        				connections = AppContext.GROUPED_CONNECTIONS.addEmptyGroup(aliasIid);
	        			}
		        	}
		            self._setConnections(connections);
		        },

		        _setConnections: function(connections: OSet<Connection>): Void {
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
		        		if (term == "" || c.connection().data.name.toLowerCase().indexOf(term) != -1) {
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