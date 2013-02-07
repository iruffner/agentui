package ui.widget;

import js.JQuery;
import ui.jq.JQ;
import ui.jq.JQDroppable;
import ui.jq.JQDraggable;
import ui.jq.JQTooltip;
import ui.model.ModelObj;
import ui.observable.OSet.ObservableSet;

typedef ConnectionAvatarOptions = {
	var connection: Connection;
	@:optional var dndEnabled: Bool;
	@:optional var isDragByHelper: Bool;
	@:optional var containment: Dynamic;
	@:optional var classes: String;
}

typedef ConnectionAvatarWidgetDef = {
	var options: ConnectionAvatarOptions;
	var _create: Void->Void;
	var update: Void->Void;
	var destroy: Void->Void;
}

extern class ConnectionAvatar extends JQ, implements FilterableComponent {
	@:overload(function(cmd : String):Bool{})
	@:overload(function(cmd:String, opt:String):Dynamic{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function connectionAvatar(opts: ConnectionAvatarOptions): ConnectionAvatar;

	private static function __init__(): Void {
		untyped ConnectionAvatar = window.jQuery;
		var defineWidget: Void->ConnectionAvatarWidgetDef = function(): ConnectionAvatarWidgetDef {
			return {
		        options: {
		            connection: null,
		            isDragByHelper: true,
		            containment: false,
		            dndEnabled: true,
		            classes: null
		        },
		        
		        _create: function(): Void {
		        	var self: ConnectionAvatarWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
					if(!selfElement.is("div")) {
		        		throw new ui.exception.Exception("Root of ConnectionAvatar must be a div element");
		        	}

		        	selfElement.addClass(Widgets.getWidgetClasses() + " connectionAvatar filterable").attr("title", self.options.connection.fname + " " + self.options.connection.lname);

		            var img: JQ = new JQ("<img src='" + self.options.connection.imgSrc + "' class='shadow'/>");
		            selfElement.append(img);

		            cast(selfElement, JQTooltip).tooltip();

		            if(!self.options.dndEnabled) {
		            	img.mousedown(function(evt: JqEvent) { 
		            		untyped __js__("return false;"); 
	            		});
	            	} else {

			            selfElement.data("clone", function(connectionAvatar: ConnectionAvatar, ?isDragByHelper: Bool = false, ?containment: Dynamic = false): ConnectionAvatar {
			            	if(connectionAvatar.hasClass("clone")) return connectionAvatar;
			            	var clone: ConnectionAvatar = new ConnectionAvatar("<div class='clone'></div>");
			            	clone.connectionAvatar({
			                        connection: connectionAvatar.connectionAvatar("option", "connection"),
			                        isDragByHelper: isDragByHelper,
			                        containment: containment,
			                        classes: connectionAvatar.connectionAvatar("option", "classes")
			                    });
			            	return clone;
		            	});
		            	selfElement.data("dropTargetClass", "labelDT");

			            var helper: Dynamic;
			            if(!self.options.isDragByHelper) {
			            	helper = "original";
			            } else {
			            	helper = function(): JQ {
					    			var clone: JQ = JQ.cur.clone();
					    			return clone.children("img").addClass("connectionDraggingImg");
			    			};
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
				    			return JQ.cur.parent().is(".dropCombiner") && d.is(".filterable");
				    		},
							activeClass: "ui-state-hover",
					      	hoverClass: "ui-state-active",
					      	drop: function( event: JqEvent, _ui: UIDroppable ) {
					      		var filterCombiner: FilterCombination = new FilterCombination("<div class='ui-state-highlight filterCombo' style='padding: 10px; position: absolute;'></div>");
					      		filterCombiner.appendTo(JQ.cur.parent());
					      		filterCombiner.filterCombination({
					      			event: event	
				      			});
				      			filterCombiner.filterCombination("addFilterable", JQ.cur);

					      		JQ.cur
					      			.appendTo(filterCombiner)
					      			.css("position", "relative")
					      			.css({left: "", top: ""})
					      			;
				      			var clone: JQ = _ui.draggable.data("clone")(_ui.draggable,false,"#filter");
				                clone.addClass("filterTrashable " + _ui.draggable.data("dropTargetClass"))
				      				.appendTo(filterCombiner)
					      			.css("position", "relative")
					      			.css({left: "", top: ""});

				      			filterCombiner.filterCombination("addFilterable", clone);

				      			filterCombiner.filterCombination("position");
					      	},
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