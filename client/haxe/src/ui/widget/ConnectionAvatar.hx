package ui.widget;

import m3.util.M;
import m3.jq.JQ;
import m3.jq.JQDroppable;
import m3.jq.JQDraggable;
import m3.jq.JQTooltip;
import m3.widget.Widgets;
import ui.model.ModelObj;
import ui.model.Node;
import m3.observable.OSet.ObservableSet;
import ui.widget.FilterableComponent;
import m3.exception.Exception;

using StringTools;
using m3.helper.StringHelper;

typedef ConnectionAvatarOptions = {
	>FilterableCompOptions,
	var connection: Connection;
}

typedef ConnectionAvatarWidgetDef = {
	var options: ConnectionAvatarOptions;
	var _create: Void->Void;
	@:optional var _super: Void->Void;
	var update: Connection->Void;
	var destroy: Void->Void;
}

class ConnectionAvatarHelper {
	public static function getConnection(c: ConnectionAvatar): Connection {
		return c.connectionAvatar("option", "connection");
	}

	public static function update(c: ConnectionAvatar, connection: Connection): Connection {
		return c.connectionAvatar("update", connection);
	}
}

@:native("$")
extern class ConnectionAvatar extends FilterableComponent {
	
	@:overload(function<T>(cmd : String):T{})
	@:overload(function<T>(cmd:String, opt:Dynamic):T{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function connectionAvatar(opts: ConnectionAvatarOptions): ConnectionAvatar;

	static function __init__(): Void {
		var defineWidget: Void->ConnectionAvatarWidgetDef = function(): ConnectionAvatarWidgetDef {
			return {
		        options: {
		            connection: null,
		            isDragByHelper: true,
		            containment: false,
		            dndEnabled: true,
		            classes: null,
		            dragstop: null,
		            cloneFcn: function(filterableComp: FilterableComponent, ?isDragByHelper: Bool = false, ?containment: Dynamic = false, ?dragstop: JQEvent->UIDraggable->Void): ConnectionAvatar {
			            	var connectionAvatar: ConnectionAvatar = cast(filterableComp, ConnectionAvatar);
			            	if(connectionAvatar.hasClass("clone")) return connectionAvatar;
			            	var clone: ConnectionAvatar = new ConnectionAvatar("<div class='clone'></div>");
			            	clone.connectionAvatar({
			                        connection: connectionAvatar.connectionAvatar("option", "connection"),
			                        isDragByHelper: isDragByHelper,
			                        containment: containment,
			                        dragstop: dragstop,
			                        classes: connectionAvatar.connectionAvatar("option", "classes"),
			                        cloneFcn: connectionAvatar.connectionAvatar("option", "cloneFcn"),
			                        dropTargetClass: connectionAvatar.connectionAvatar("option", "dropTargetClass"),
			                        helperFcn: connectionAvatar.connectionAvatar("option", "helperFcn")
			                    });
			            	return clone;
		            	},
					dropTargetClass: "connectionDT",
					helperFcn: function(): JQ {
			    			var clone: JQ = JQ.cur.clone();
			    			return clone.children("img").addClass("connectionDraggingImg");
	    				}
		        },
		        
		        _create: function(): Void {
		        	var self: ConnectionAvatarWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
					if(!selfElement.is("div")) {
		        		throw new Exception("Root of ConnectionAvatar must be a div element");
		        	}

		        	selfElement.attr("id", "connavatar_" + (self.options.connection.name()).htmlEscape());

		        	selfElement.addClass(Widgets.getWidgetClasses() + " connectionAvatar filterable").attr("title", self.options.connection.name());

		        	var imgSrc: String = "media/default_avatar.jpg";
		        	if(M.getX(self.options.connection.profile.imgSrc, "").isNotBlank() ) {
		        		imgSrc = self.options.connection.profile.imgSrc;
		        	}

		            var img: JQ = new JQ("<img src='" + imgSrc + "' class='shadow'/>");
		            selfElement.append(img);

		            cast(selfElement, JQTooltip).tooltip();

		            if(!self.options.dndEnabled) {
		            	img.mousedown(function(evt: JQEvent) { 
		            		untyped __js__("return false;"); 
	            		});
	            	} else {
						selfElement.addClass("filterable");
			            selfElement.data(
			            	"clone", self.options.cloneFcn
		            	);
		            	selfElement.data("dropTargetClass", self.options.dropTargetClass);
		            	selfElement.data("getNode", function(): Node {
			            		var node: ConnectionNode = new ConnectionNode();
			            		node.type = "CONNECTION";
			            		node.content = self.options.connection;
			            		return node;
			            	});

		            	selfElement.on("dragstop", function(dragstopEvt: JQEvent, dragstopUi: UIDraggable): Void {
		                		if(self.options.dragstop != null) {
		                			self.options.dragstop(dragstopEvt, dragstopUi);
		                		}
		                	});

			            var helper: Dynamic = "clone";
			            if(!self.options.isDragByHelper) {
			            	helper = "original";
			            } else if (self.options.helperFcn != null && Reflect.isFunction(self.options.helperFcn)) {
			            	helper = self.options.helperFcn;
			            }

			            cast(selfElement, JQDraggable).draggable({ 
				    		containment: self.options.containment, 
				    		helper: helper,
				    		distance: 10,
				    		// grid: [5,5],
				    		revertDuration: 200,
				    		scroll: false,
				    		start: function(evt:JQEvent, _ui:UIDraggable):Void {
				    			cast(selfElement, JQDraggable).draggable("option", "revert", false);
				    		}
				    	});

			            cast(selfElement, JQDroppable).droppable({
				    		accept: function(d) {
				    			return !JQ.cur.parent().is(".filterCombination") && JQ.cur.parent().is(".dropCombiner") && d.is(".connectionAvatar");
				    		},
							activeClass: "ui-state-hover",
					      	hoverClass: "ui-state-active",
					      	greedy: true,
					      	drop: function( event: JQEvent, _ui: UIDroppable ) {
					      		var filterCombiner: FilterCombination = new FilterCombination("<div></div>");
					      		filterCombiner.appendTo(JQ.cur.parent());
					      		filterCombiner.filterCombination({
					      			event: event,
					      			type: "CONNECTION",
					      			dragstop: self.options.dragstop
				      			});
				      			filterCombiner.filterCombination("addFilterable", JQ.cur);

				      			var clone: JQ = _ui.draggable.data("clone")(_ui.draggable,false,"#filter");
				                clone.addClass("filterTrashable " + _ui.draggable.data("dropTargetClass"));

				      			filterCombiner.filterCombination("addFilterable", clone);

				      			filterCombiner.filterCombination("position");
					      	},
					      	tolerance: "pointer"
				    	});
					}
		        },

		        update: function(conn: Connection): Void {
		        	var self: ConnectionAvatarWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
					self.options.connection = conn;

					var imgSrc: String = "media/default_avatar.jpg";
		        	if(M.getX(self.options.connection.profile.imgSrc, "").isNotBlank() ) {
		        		imgSrc = self.options.connection.profile.imgSrc;
		        	}

		        	selfElement.children("img").attr("src", imgSrc);
		            selfElement.attr("title", M.getX(self.options.connection.profile.name,""));
	        	},

		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.connectionAvatar", defineWidget());
	}	
}