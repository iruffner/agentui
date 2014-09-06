package agentui.widget;

import m3.util.M;
import m3.jq.JQ;
import m3.jq.JQDroppable;
import m3.jq.JQDraggable;
import m3.widget.Widgets;
import agentui.model.ModelObj;
import agentui.widget.DialogManager;
import m3.observable.OSet;
import m3.exception.Exception;

using agentui.widget.ConnectionAvatar;
using m3.helper.StringHelper;

typedef ConnectionCompOptions = {
	var connection: Connection;
	@:optional var classes: String;
}

typedef ConnectionCompWidgetDef = {
	var options: ConnectionCompOptions;
	var _create: Void->Void;
	@:optional var _avatar: ConnectionAvatar;
	@:optional var _notifications: JQ;
	@:optional var notifications:FilteredSet<Notification<Dynamic>>;
	var update: Connection->Void;
	var destroy: Void->Void;
	var addNotification: Void->Void;
	var deleteNotification: Void->Void;
	var _updateNotificationCount: Int->Void;

	@:optional var filteredSetConnection:FilteredSet<Connection>;
	@:optional var _onUpdateConnection: Connection->EventType->Void;
}

class ConnectionCompHelper {
	public static function connection(c: ConnectionComp): Connection {
		return c.connectionComp("option", "connection");
	}

	public static function update(c: ConnectionComp, connection: Connection): Connection {
		return c.connectionComp("update", connection);
	}

	public static function addNotification(c: ConnectionComp): Void {
		return c.connectionComp("addNotification");
	}

	public static function deleteNotification(c: ConnectionComp): Void {
		return c.connectionComp("deleteNotification");
	}
}


@:native("$")
extern class ConnectionComp extends JQ {
	@:overload(function<T>(cmd : String):T{})
	@:overload(function<T>(cmd:String, opt:Dynamic):T{})
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

		        	selfElement.dblclick(function(evt: JQEvent) {
		        		var it = self.notifications.iterator();
		        		if (it.hasNext()) {
	                		var notification = it.next();
	                		switch (notification.kind) {
	                			case NotificationKind.IntroductionRequest:
	                				DialogManager.respondToIntroduction(cast(notification, IntroductionRequestNotification));
		 		        		case NotificationKind.VerificationRequest:
		 		        			DialogManager.respondToVerificationRequest(cast(notification, VerificationRequestNotification));
		 		        		case NotificationKind.VerificationResponse:
		 		        			DialogManager.acceptVerificationResponse(cast(notification, VerificationResponseNotification));
	                		}
		        		} 
		        	});

	        		self.filteredSetConnection = new FilteredSet<Connection>(AppContext.CONNECTIONS,function(c:Connection):Bool{
	        			return c.iid == self.options.connection.iid;
	        		});
	        		self._onUpdateConnection = function(c:Connection, evt:EventType) {
	        			if (evt.isDelete()) {
	        				self.destroy();
	        				selfElement.remove();
	        			}
	        		}
	        		self.filteredSetConnection.listen(self._onUpdateConnection);

		        	selfElement.addClass(Widgets.getWidgetClasses() + " connection container boxsizingBorder");
		        	self._avatar = new ConnectionAvatar("<div class='avatar'></div>").connectionAvatar({
		        		connectionIid: self.options.connection.iid,
		        		dndEnabled: true,
		        		isDragByHelper: true,
		        		containment: false
	        		});
	        		self._notifications = new JQ(".notifications", selfElement);
					if(!self._notifications.exists()) {
						self._notifications = new JQ("<div class='notifications'>0</div>");
					}
					self._notifications.appendTo(selfElement);

		            selfElement.append(self._avatar);
		            selfElement.append("<div class='name'>" + self.options.connection.data.name + "</div>");
		            selfElement.append("<div class='clear'></div>");
		        
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

				      		if (!dropper.equals(droppee)) {
				      			var intro:Introduction = null;
				      			// Check to see if there is already an introduction in progress
				      			for (i in AppContext.INTRODUCTIONS) {
				      				if ((i.aConnectionIid == dropper.iid && i.bConnectionIid == droppee.iid) ||
				      					(i.bConnectionIid == dropper.iid && i.aConnectionIid == droppee.iid)) {
				      					intro = i;
				      					break;
				      				}
				      			}
				      			if (intro != null) {
				      				if (intro.bState == IntroductionState.NotResponded || intro.aState == IntroductionState.NotResponded) {
					      				m3.util.JqueryUtil.alert("There is already a pending introduction between these two aliases");
									} else if (intro.bState == IntroductionState.Accepted && intro.aState == IntroductionState.Accepted) {
					      				m3.util.JqueryUtil.alert("These two aliases are already connected");
									}
				      			} else {
					      			agentui.widget.DialogManager.requestIntroduction(dropper, droppee);
					      		}
					      	}
				      	},
				      	tolerance: "pointer"
			    	});

			    	// Set up a listener to notification changes
			    	self.notifications = new FilteredSet<Notification<Dynamic>>(AppContext.NOTIFICATIONS, function(n:Notification<Dynamic>):Bool {
                		return (n.fromConnectionIid == self.options.connection.iid);
                	});
                	self.notifications.listen(function(i:Notification<Dynamic>, evt:EventType):Void{
                		if (evt.isAdd()) {
                			self.addNotification();
                		} else if (evt.isDelete()) {
                			self.deleteNotification();
                		}
                	});
		        },

		        update: function(conn: Connection): Void {
		        	var self: ConnectionCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
					self.options.connection = conn;

		            selfElement.children(".name").text(M.getX(self.options.connection.data.name, ""));
	        	},

	        	_updateNotificationCount: function(delta:Int):Void {
	        		var self: ConnectionCompWidgetDef = Widgets.getSelf();

					var count:Int = Std.parseInt(self._notifications.html()) + delta;
					if (count < 0) { count = 0; }
					self._notifications.html(Std.string(count));

					var visibility = (count == 0) ? "hidden" : "visible";
					self._notifications.css("visibility", visibility);
	        	},

	        	addNotification: function(): Void {
	        		var self: ConnectionCompWidgetDef = Widgets.getSelf();
	        		self._updateNotificationCount(1);
        		},

        		deleteNotification: function(): Void {
	        		var self: ConnectionCompWidgetDef = Widgets.getSelf();
					self._updateNotificationCount(-1);
        		},
		        
		        destroy: function() {
	        		var self: ConnectionCompWidgetDef = Widgets.getSelf();
		            untyped JQ.Widget.prototype.destroy.call(JQ.curNoWrap);
		        	if (self.filteredSetConnection != null) {
			        	self.filteredSetConnection.removeListener(self._onUpdateConnection);
		        	}
		        }
		    };
		}
		JQ.widget( "ui.connectionComp", defineWidget());
	}	
}