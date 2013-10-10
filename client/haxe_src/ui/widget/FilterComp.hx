package ui.widget;

import js.html.Element;

import m3.jq.JQ;
import m3.jq.JQDroppable;
import m3.jq.JQTooltip;
import m3.widget.Widgets;
import ui.model.ModelObj;
import ui.model.Node;
import ui.model.Filter;
import ui.model.EM;
import m3.observable.OSet;
import ui.widget.LabelComp;
import m3.exception.Exception;

typedef FilterCompOptions = {
}

typedef FilterCompWidgetDef = {
	@:optional var options: FilterCompOptions;
	var _create: Void->Void;
	var destroy: Void->Void;
	var fireFilter: Void->Void;
}

@:native("$")
extern class FilterComp extends JQ {

	@:overload(function(cmd : String):Bool{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function filterComp(?opts: FilterCompOptions): FilterComp;

	private static function __init__(): Void {
		var defineWidget: Void->FilterCompWidgetDef = function(): FilterCompWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: FilterCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of FilterComp must be a div element");
		        	}

		        	selfElement.addClass("connectionDT labelDT dropCombiner " + Widgets.getWidgetClasses());

		        	var toggle: AndOrToggle = new AndOrToggle("<div class='rootToggle andOrToggle'></div>").andOrToggle();
		        	selfElement.append(toggle);

		        	var liveToggle: LiveBuildToggle = new LiveBuildToggle("<div class='liveBuildToggle'></div>").liveBuildToggle();
		        	selfElement.append(liveToggle);

					cast(selfElement, JQDroppable).droppable({
			    		accept: function(d) {
			    			return d.is(".filterable");
			    		},
						activeClass: "ui-state-hover",
				      	hoverClass: "ui-state-active",
				      	drop: function( event: JQEvent, _ui: UIDroppable ) {
			                //fire off a filterable
			                var clone: JQ = _ui.draggable.data("clone")(_ui.draggable, false, "#filter");
			                clone.addClass("filterTrashable " + _ui.draggable.data("dropTargetClass"));
			                var cloneOffset: {top: Int, left: Int} = clone.offset();

			                JQ.cur.append(clone);
							clone.css({
			                    "position": "absolute"
			                });
			                var isInFilterCombination: Bool = _ui.draggable.parent(".filterCombination").length > 0;
			                if(isInFilterCombination) {
			                	var filterCombination: FilterCombination = cast(_ui.draggable.parent(), FilterCombination);
			                	filterCombination.filterCombination("removeFilterable", _ui.draggable);
			                }

			                if(cloneOffset.top != 0) {
			                	clone.offset(cloneOffset);
		                	} else {
			                	clone.position({
			                    	my: "left top",
			                    	at: "left top",
			                    	of: _ui.helper, //event, // _ui.helper can be smoother, but since we don't always use a helper, sometimes we're trying to position of ourselves
			                    	collision: "flipfit",
			                    	within: "#filter"
	                    		});
			                }
			                self.fireFilter();
				      	}
				    });

					var trashDiv: JQ = selfElement.children("#filterTrash");
					var trashCan: JQ = trashDiv.children("img");

					var grow: Int->Void = function(?duration: Int = 300): Void {
						trashDiv.animate({
			    				width: "100px"
			    			}, duration);
			    		trashCan.animate({
			    				"max-width": "100px",
			    				"margin-top": "35px"
			    			}, duration);
					}

					var shrink: Void->Void = function(): Void {
						trashDiv.animate({
			    				width: "50px"
			    			}, 200);
			    		trashCan.animate({
			    				"max-width": "50px",
			    				"margin-top": "50px"
			    			}, 200);
					}

				    cast(
				    	cast(trashDiv, JQDroppable).droppable({
					    	accept: function(d) {
				    			return d.is(".filterTrashable");
				    		},
							activeClass: "ui-state-hover",
					      	hoverClass: "ui-state-active",
					      	greedy: true,
					      	drop: function( event: JQEvent, _ui: UIDroppable ) {
				                //fire off a filterable
				                _ui.draggable.remove();
				                shrink();
				                self.fireFilter();
					      	},
					      	tolerance: "touch",
					      	over: function( event: JQEvent, _ui: UIDroppable) {
					    		grow(300);
					      	},
					      	out: function( event: JQEvent, _ui: UIDroppable) {
					      		shrink();
					      	}
				    	}),
				    JQTooltip).tooltip().dblclick(function(event: JQEvent) {
			    			grow(150);
		    				var trashables: JQ = selfElement.children(".filterTrashable");
			    			trashables.position({
			    					"my": "center",
			    					"at": "center",
			    					"of": trashCan,
			    					"using": function(pos: {top: Int, left: Int}): Void {
			    						JQ.cur.animate({
			    								left: pos.left,
			    								top: pos.top
			    							}, 500, function(): Void {
			    									// JQ.cur.animate({
			    									// 		width: "10px",
			    									// 		height: "10px"
			    									// 	}, 250, function(): Void {
			    									// 		JQ.cur.remove();
			    									// 	});
			    									JQ.cur.remove();
			    									shrink();
			    								});
			    					}
			    				});
			    			self.fireFilter();
			    		});
		        },

		        fireFilter: function(): Void {
		        	var self: FilterCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

					var liveToggle: LiveBuildToggle = cast(selfElement.children(".liveBuildToggle"), LiveBuildToggle);

		        	var root: Node = selfElement.children(".rootToggle").data("getNode")();//new And();//determine this
		        	root.type = "ROOT";

		        	var filterables: JQ = selfElement.children(".filterable");
		        	filterables.each(function (idx: Int, el: Element): Void {
		        			var filterable: FilterableComponent = new FilterableComponent(el);
		        			var node: Node = filterable.data("getNode")();
		        			root.addNode(node);
		        		});
					
					if(!cast(liveToggle.liveBuildToggle("isLive"), Bool)) {
						EM.change(EMEvent.FILTER_CHANGE, new Filter(root));
					} else {
		        		EM.change(EMEvent.FILTER_RUN, new Filter(root));
		        	}
	        	},

		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.filterComp", defineWidget());
	}
}