package ui.widget;

import js.html.Element;

import m3.jq.JQ;
import m3.jq.JQDroppable;
import m3.jq.JQDraggable;
import m3.widget.Widgets;
import ui.model.ModelObj;
import ui.model.Node;
import m3.observable.OSet;
import m3.exception.Exception;

using m3.helper.ArrayHelper;

typedef FilterCombinationOptions = {
	@:optional var position: {left: Int, top: Int};
	@:optional var event: JQEvent;
	var type: String;
}

typedef FilterCombinationWidgetDef = {
	@:optional var options: FilterCombinationOptions;
	var _create: Void->Void;
	var destroy: Void->Void;
	var addFilterable: FilterableComponent->Void;
	var removeFilterable: FilterableComponent->Void;
	var _add: FilterableComponent->Void;
	var _remove: FilterableComponent->Void;
	var _layout: Void->Void;
	var _fireFilter: Void->Void;
	var position: Void->Void;
	@:optional var _filterables: ObservableSet<FilterableComponent>;
}

@:native("$")
extern class FilterCombination extends FilterableComponent {

	@:overload(function(cmd : String):Bool{})
	@:overload(function(cmd : String, arg: Dynamic):Void{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function filterCombination(opts: FilterCombinationOptions): FilterCombination;

	private static function __init__(): Void {
		var defineWidget: Void->FilterCombinationWidgetDef = function(): FilterCombinationWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: FilterCombinationWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of FilterCombination must be a div element");
		        	}

		        	selfElement.data("getNode", function(): Node {
		            		var root: Node = selfElement.children(".andOrToggle").data("getNode")();
		            		root.type = self.options.type;
		            		var filterables: JQ = selfElement.children(".filterable");
				        	filterables.each(function (idx: Int, el: Element): Void {
				        			var filterable: FilterableComponent = new FilterableComponent(el);
				        			var node: Node = filterable.data("getNode")();
				        			root.addNode(node);
				        		});
		            		return root;
		            	});
					
					self._filterables = new ObservableSet<FilterableComponent>(function (fc: FilterableComponent): String { return cast(fc, JQ).attr("id");});
					self._filterables.listen(function(fc: FilterableComponent, evt: EventType): Void {
		            		if(evt.isAdd()) {
		            			self._add(fc);
		            		} else if (evt.isUpdate()) {
		            			// fc.labelTreeBranch("update");
		            		} else if (evt.isDelete()) {
		            			self._remove(fc);
		            		}
		            	});

		        	//classes
		        	//- connectionTD & labelDT such that this is a valid drop target for connections and labels, respectively
		        	//- filterCombination to give this element its styling for css purposes
		        	//- filterTrashable so this element can be trashed
		        	//- dropCombiner is used to identify what kinds of elements are accepted by connections and labels
		        	//- ui-state-highlight gives the yellow background
		        	//- container rounds the corners and gives a blue border
		        	//- shadow gives a box shadow
		        	//- filterable says this item can be composed into a filter

		        	selfElement.addClass("ui-state-highlight connectionDT labelDT filterable dropCombiner filterCombination filterTrashable container shadow" + Widgets.getWidgetClasses());

		        	selfElement.position({
		        		my: "bottom right",
		        		at: "left top",
		        		of: self.options.event,
		        		collision: "flipfit",
		        		within: "#filter"
	        		});

	        		selfElement.data("clone", function(filterableComp: FilterableComponent, ?isDragByHelper: Bool = false, ?containment: Dynamic = false): FilterCombination {
		            			var fc: FilterCombination = cast(filterableComp, FilterCombination);
				            	return fc;
		            		});

		        	var toggle: AndOrToggle = new AndOrToggle("<div class='andOrToggle'></div>").andOrToggle();

		        	/*var and: JQ = new JQ("<div class='ui-widget-content ui-state-active ui-corner-top any'>Any</div>");
		        	var or: JQ = new JQ("<div class='ui-widget-content ui-corner-bottom all'>All</div>");
		        	toggle.append(and).append(or);
		        	var children: JQ = toggle.children();
		        	children
		        		.hover(
			        		function(evt: JQEvent): Void {
			        			JQ.cur.addClass("ui-state-hover");
		        			},
			        		function(): Void {
			        			JQ.cur.removeClass("ui-state-hover");
			        		}
		        		)
		        		.click(
		        			function(evt: JQEvent): Void {
		        				children.toggleClass("ui-state-active");
		        				self._fireFilter();
		        			}
	        			);*/
	        		selfElement.append(toggle);

		        	cast(selfElement, JQDraggable).draggable({
			    		containment: "parent", 
			    		distance: 10,
			    		// grid: [5,5],
			    		scroll: false
				    });

					cast(selfElement, JQDroppable).droppable({
			    		accept: function(d: JQ) {
			    			return (self.options.type == "LABEL" && d.is(".label")) || (self.options.type == "CONNECTION" && d.is(".connectionAvatar"));
			    		},
						activeClass: "ui-state-hover",
				      	hoverClass: "ui-state-active",
				      	greedy: true,
				      	drop: function( event: JQEvent, _ui: UIDroppable ) {
			                //fire off a filterable
				      		var clone: FilterableComponent = _ui.draggable.data("clone")(_ui.draggable,false,"#filter");
			                clone.addClass("filterTrashable " + _ui.draggable.data("dropTargetClass"))
			      				.appendTo(selfElement)
				      			.css("position", "absolute")
				      			.css({left: "", top: ""});

			      			self.addFilterable(clone);

			      			selfElement.position({
				      				collision: "flipfit",
			        				within: "#filter"
			      				});


				      	},
				      	tolerance: "pointer"
				    });
		        },

		        position: function(): Void {
		        	var self: FilterCombinationWidgetDef = Widgets.getSelf();
		        	var selfElement: JQ = Widgets.getSelfElement();
		        	selfElement.position({
		        		my: "center",
		        		at: "center",
		        		of: self.options.event,
		        		collision: "flipfit",
		        		within: "#filter"
	        		});
	        	},

		        addFilterable: function(filterable: FilterableComponent): Void {
		        	var self: FilterCombinationWidgetDef = Widgets.getSelf();
		        	self._filterables.add(filterable);
		        	//because we should only exist when we have at least 2 filterables
		        	// we don't want to fire a filter when we only have one filterable
		        	// as we should be receiving a second filterable shortly that we
		        	// would want to filter on
		        	if(self._filterables.size() > 1) {
		        		self._fireFilter();
		        	}
	        	},

	        	removeFilterable: function(filterable: FilterableComponent): Void {
		        	var self: FilterCombinationWidgetDef = Widgets.getSelf();
		        	self._filterables.delete(filterable);
	        	},

	        	_add: function(filterable: FilterableComponent): Void {
	        		var self: FilterCombinationWidgetDef = Widgets.getSelf();
		        	var selfElement: JQ = Widgets.getSelfElement();
		        	var jq: JQ = cast(filterable, JQ);
		        	jq
		      			.appendTo(selfElement)
		      			// .css("position", "relative")
		      			.css("position", "absolute")
		      			.css({left: "", top: ""})
		      			;

		        	self._layout();
	        	},

	        	_remove: function(filterable: FilterableComponent): Void {
	        		var self: FilterCombinationWidgetDef = Widgets.getSelf();
	        		var selfElement: JQ = Widgets.getSelfElement();

		        	var iter: Iterator<FilterableComponent> = self._filterables.iterator();
		        	if( iter.hasNext() ) {
		        		var filterable: FilterableComponent = iter.next();
		        		if(iter.hasNext()) {
			        		self._layout();
			        	} else {
			        		//there is only one more filterable left
			        		var jq: JQ = cast(filterable, JQ);
			        		var position: {top: Int, left: Int} = jq.offset();
		        			jq
			        			.appendTo(selfElement.parent())
		        				.offset(position)
			                	;
		        			selfElement.remove();
		        			self.destroy();
			        	}
		        	} else {
		        		self.destroy();
		        		selfElement.remove();
		        	}
	        	},

	        	_layout: function(): Void {
	        		var self: FilterCombinationWidgetDef = Widgets.getSelf();
		        	var selfElement: JQ = Widgets.getSelfElement();

	        		var filterableConns: OSet<FilterableComponent> = new FilteredSet<FilterableComponent>(self._filterables, function(fc: FilterableComponent): Bool { 
                        return fc.hasClass("connectionAvatar");
                    });

                    var filterableLabels: OSet<FilterableComponent> = new FilteredSet<FilterableComponent>(self._filterables, function(fc: FilterableComponent): Bool { 
                        return fc.hasClass("label");
                    });

                    var leftPadding: Int = 30;
                    var topPadding: Int = 6;
                    var typeGap: Int = 10;
                    var rowGap: Int = 50;

                    var iterC: Iterator<FilterableComponent> = filterableConns.iterator();
                    var connCount: Int = 0;
                    var connPairs: Int = 0;
                    while(iterC.hasNext()) {
                    	connCount++;
                    	connPairs = Std.int(connCount / 2) + connCount % 2;
                    	var connAvatar: FilterableComponent = iterC.next();
                    	connAvatar.css({
                    		"left": leftPadding + (35 * (connPairs-1)),
                    		"top": topPadding + (rowGap * (connCount+1) % 2)
                		});
                    }

                    var connectionWidth = 35 * connPairs;

                    var iterL: Iterator<FilterableComponent> = filterableLabels.iterator();
                    var labelCount: Int = 0;
                    var labelPairs: Int = 0;
                    while(iterL.hasNext()) {
                    	labelCount++;
                    	labelPairs = Std.int(labelCount / 2) + labelCount % 2;
                    	var labelComp: FilterableComponent = iterL.next();
                    	labelComp.css({
                    		"left": leftPadding + connectionWidth + typeGap + (135 * (labelPairs-1)),
                    		"top": topPadding + (rowGap * (labelCount+1) % 2)
                		});
                    }

		        	selfElement.css ( {
						"width": (35 * connPairs + 135 * labelPairs) + "px",
						"min-width": (35 * connPairs + 135 * labelPairs) + "px"
	        		});
	        	},

	        	_fireFilter: function() {
		        	var selfElement: JQ = Widgets.getSelfElement();
		        	var filter: FilterComp = cast(selfElement.parent("#filter"), FilterComp);
	      			filter.filterComp("fireFilter");
        		},
		        
		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.filterCombination", defineWidget());
	}
}