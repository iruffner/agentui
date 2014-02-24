package ui.widget;

import m3.util.M;
import m3.jq.JQ;
import m3.jq.JQDroppable;
import m3.jq.JQDraggable;
import m3.jq.JQTooltip;
import m3.observable.OSet;
import m3.widget.Widgets;
import ui.widget.DialogManager;
import ui.model.ModelObj;
import ui.model.Node;
import m3.observable.OSet.ObservableSet;
import ui.widget.FilterableComponent;
import m3.exception.Exception;

using StringTools;
using m3.helper.OSetHelper;
using m3.helper.StringHelper;
using ui.widget.LabelComp;

typedef ConnectionAvatarOptions = {
	>FilterableCompOptions,
	@:optional var connectionIid: String;
	@:optional var aliasIid: String;
}

typedef ConnectionAvatarWidgetDef = {
	var options: ConnectionAvatarOptions;
	var _create: Void->Void;
	@:optional var _super: Void->Void;
	var destroy: Void->Void;
	var _updateWidgets: Profile->Void;
	var getConnection: Void->Connection;
	var getAlias: Void->Alias;

	@:optional var filteredSetConnection:FilteredSet<Connection>;
	@:optional var _onUpdateConnection: Connection->EventType->Void;
	@:optional var filteredSetAlias:FilteredSet<Alias>;
	@:optional var _onUpdateAlias: Alias->EventType->Void;
}

class ConnectionAvatarHelper {
	public static function getConnection(c: ConnectionAvatar): Connection {
		return c.connectionAvatar("getConnection");
	}

	public static function getAlias(c: ConnectionAvatar): Alias {
		return c.connectionAvatar("getAlias");
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
			                        connectionIid: connectionAvatar.connectionAvatar("option", "connectionIid"),
			                        aliasIid: connectionAvatar.connectionAvatar("option", "aliasIid"),
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

		        getConnection: function():Connection {
		        	var self: ConnectionAvatarWidgetDef = Widgets.getSelf();
		        	return AppContext.CONNECTIONS.getElement(self.options.connectionIid);
		        },
		        
		        getAlias: function():Alias {
		        	var self: ConnectionAvatarWidgetDef = Widgets.getSelf();
		        	return AppContext.ALIASES.getElement(self.options.aliasIid);
		        },

		        _create: function(): Void {
		        	var self: ConnectionAvatarWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
					if(!selfElement.is("div")) {
		        		throw new Exception("Root of ConnectionAvatar must be a div element");
		        	}

		        	var id = "connavatar_" + ((self.options.aliasIid == null) ? self.options.connectionIid : self.options.aliasIid);
		        	selfElement.attr("id", id);
		        	selfElement.addClass(Widgets.getWidgetClasses() + " connectionAvatar filterable");

		            var img: JQ = new JQ("<img src='media/default_avatar.jpg' class='shadow'/>");
		            selfElement.append(img);

		            self._updateWidgets(new Profile());

		        	if (self.options.connectionIid != null) {
		        		self.filteredSetConnection = new FilteredSet<Connection>(AppContext.CONNECTIONS,function(c:Connection):Bool{
		        			return c.iid == self.options.connectionIid;
		        		});
		        		self._onUpdateConnection = function(c:Connection, evt:EventType) {
		        			if (evt.isAddOrUpdate()) {
		        				self._updateWidgets(c.data);
		        			}
		        		}
		        		self.filteredSetConnection.listen(self._onUpdateConnection);
		        	} else if (self.options.aliasIid != null){
		        		self.filteredSetAlias = new FilteredSet<Alias>(AppContext.ALIASES,function(a:Alias):Bool{
		        			return a.iid == self.options.aliasIid;
		        		});
		        		self._onUpdateAlias = function(a:Alias, evt:EventType) {
		        			if (evt.isAddOrUpdate()) {
		        				self._updateWidgets(a.profile);
		        			}
		        		}
		        		self.filteredSetAlias.listen(self._onUpdateAlias);
		        	} else {
		        		throw new Exception("connectionIid or aliasIid must be set");
		        	}

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
		            		if (self.options.connectionIid != null) {
		            			return new ConnectionNode(self.getConnection());
		            		} else {
		            			return null;
		            		}
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
				    			return !JQ.cur.parent().is(".filterCombination") && 
				    					(d.is(".labelComp") ||
 				    			         (JQ.cur.parent().is(".dropCombiner") && d.is(".connectionAvatar")));
				    		},
							activeClass: "ui-state-hover",
					      	hoverClass: "ui-state-active",
					      	greedy: true,
					      	drop: function(event: JQEvent, _ui: UIDroppable ) {
					      		if (_ui.draggable.is(".labelComp")) {
									var labelComp: LabelComp = cast(_ui.draggable, LabelComp);
									var connection = AppContext.CONNECTIONS.getElement(self.options.connectionIid);
									DialogManager.allowAccess(labelComp.labelComp("getLabel"), connection);
					      		} else {
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
					      		}
					      	},
					      	tolerance: "pointer"
				    	});
					}
		        },

		        _updateWidgets: function(profile:Profile): Void {
		        	var self: ConnectionAvatarWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

					var imgSrc: String = "media/default_avatar.jpg";
		        	if(M.getX(profile.imgSrc, "").isNotBlank() ) {
		        		imgSrc = profile.imgSrc;
		        	}

		        	selfElement.children("img").attr("src", imgSrc);
		            selfElement.attr("title", M.getX(profile.name,""));
	        	},

		        destroy: function() {
		        	var self: ConnectionAvatarWidgetDef = Widgets.getSelf();
		        	if (self.filteredSetConnection != null) {
			        	self.filteredSetConnection.removeListener(self._onUpdateConnection);
		        	}
		        	else if (self.filteredSetAlias != null) {
			        	self.filteredSetAlias.removeListener(self._onUpdateAlias);
		        	}

		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.connectionAvatar", defineWidget());
	}	
}