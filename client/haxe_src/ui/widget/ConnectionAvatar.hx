package ui.widget;

import js.JQuery;
import ui.jq.JQ;
import ui.jq.JQDroppable;
import ui.jq.JQDraggable;
import ui.jq.JQTooltip;
import ui.model.ModelObj;
import ui.model.Node;
import ui.observable.OSet.ObservableSet;
import ui.widget.FilterableComponent;

using StringTools;

typedef ConnectionAvatarOptions = {
	>FilterableCompOptions,
	var connection: Connection;
}

typedef ConnectionAvatarWidgetDef = {
	var options: ConnectionAvatarOptions;
	var _create: Void->Void;
	@:optional var _super: Void->Void;
	var update: Void->Void;
	var destroy: Void->Void;
}

extern class ConnectionAvatar extends FilterableComponent {
	
	@:overload(function(cmd : String):Bool{})
	@:overload(function(cmd:String, opt:String):Dynamic{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function connectionAvatar(opts: ConnectionAvatarOptions): ConnectionAvatar;

	static function __init__(): Void {
		untyped ConnectionAvatar = window.jQuery;
		var defineWidget: Void->ConnectionAvatarWidgetDef = function(): ConnectionAvatarWidgetDef {
			return {
		        options: {
		            connection: null,
		            isDragByHelper: true,
		            containment: false,
		            dndEnabled: true,
		            classes: null,
		            cloneFcn: function(filterableComp: FilterableComponent, ?isDragByHelper: Bool = false, ?containment: Dynamic = false): ConnectionAvatar {
			            	var connectionAvatar: ConnectionAvatar = cast(filterableComp, ConnectionAvatar);
			            	if(connectionAvatar.hasClass("clone")) return connectionAvatar;
			            	var clone: ConnectionAvatar = new ConnectionAvatar("<div class='clone'></div>");
			            	clone.connectionAvatar({
			                        connection: connectionAvatar.connectionAvatar("option", "connection"),
			                        isDragByHelper: isDragByHelper,
			                        containment: containment,
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
		        		throw new ui.exception.Exception("Root of ConnectionAvatar must be a div element");
		        	}

		        	selfElement.attr("id", "connavatar_" + (self.options.connection.lname + self.options.connection.fname).htmlEscape());

		        	selfElement.addClass(Widgets.getWidgetClasses() + " connectionAvatar filterable").attr("title", self.options.connection.fname + " " + self.options.connection.lname);

		            var img: JQ = new JQ("<img src='" + self.options.connection.imgSrc + "' class='shadow'/>");
		            selfElement.append(img);

		            cast(selfElement, JQTooltip).tooltip();

		            if(!self.options.dndEnabled) {
		            	img.mousedown(function(evt: JqEvent) { 
		            		untyped __js__("return false;"); 
	            		});
	            	} else {
						selfElement.addClass("filterable");
			            selfElement.data(
			            	"clone", self.options.cloneFcn
		            	);
		            	selfElement.data("dropTargetClass", self.options.dropTargetClass);
		            	selfElement.data("getNode", function(): Node {
			            		var node: ContentNode = new ContentNode();
			            		node.type = "CONNECTION";
			            		node.contentUid = self.options.connection.uid;
			            		return node;
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
				    		scroll: false
				    	});

			            cast(selfElement, JQDroppable).droppable({
				    		accept: function(d) {
				    			return !JQ.cur.parent().is(".filterCombination") && JQ.cur.parent().is(".dropCombiner") && d.is(".filterable");
				    		},
							activeClass: "ui-state-hover",
					      	hoverClass: "ui-state-active",
					      	greedy: true,
					      	drop: function( event: JqEvent, _ui: UIDroppable ) {
					      		var filterCombiner: FilterCombination = new FilterCombination("<div></div>");
					      		filterCombiner.appendTo(JQ.cur.parent());
					      		filterCombiner.filterCombination({
					      			event: event	
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

		        update: function(): Void {
		        	var self: ConnectionAvatarWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

		        	selfElement.children("img").attr("src", self.options.connection.imgSrc);
		            selfElement.children("div").text(self.options.connection.fname + " " + self.options.connection.lname);
	        	},
		        
		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.connectionAvatar", defineWidget());
	}	
}