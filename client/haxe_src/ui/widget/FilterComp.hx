package ui.widget;

import js.JQuery;
import ui.jq.JQ;
import ui.jq.JQDroppable;
import ui.model.ModelObj;
import ui.model.Node;
import ui.model.Filter;
import ui.model.EventModel;
import ui.observable.OSet;
import ui.widget.LabelComp;

typedef FilterCompOptions = {
}

typedef FilterCompWidgetDef = {
	@:optional var options: FilterCompOptions;
	var _create: Void->Void;
	var destroy: Void->Void;
	var fireFilter: Void->Void;
}

extern class FilterComp extends JQ {

	@:overload(function(cmd : String):Bool{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function filterComp(?opts: FilterCompOptions): FilterComp;

	private static function __init__(): Void {
		untyped FilterComp = window.jQuery;
		var defineWidget: Void->FilterCompWidgetDef = function(): FilterCompWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: FilterCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new ui.exception.Exception("Root of FilterComp must be a div element");
		        	}

		        	selfElement.addClass("connectionDT labelDT dropCombiner " + Widgets.getWidgetClasses());

		        	var toggle: AndOrToggle = new AndOrToggle("<div class='rootToggle andOrToggle'></div>").andOrToggle();
		        	selfElement.append(toggle);

					cast(selfElement, JQDroppable).droppable({
			    		accept: function(d) {
			    			return d.is(".filterable");
			    		},
						activeClass: "ui-state-hover",
				      	hoverClass: "ui-state-active",
				      	drop: function( event: JqEvent, _ui: UIDroppable ) {
			                //fire off a filterable
			                var clone: JQ = _ui.draggable.data("clone")(_ui.draggable, false, "#filter");
			                var cloneOffset: {top: Int, left: Int} = clone.offset();
			                clone.addClass("filterTrashable " + _ui.draggable.data("dropTargetClass"));
			                var isInFilterCombination: Bool = _ui.draggable.parent(".filterCombination").length > 0;
			                if(isInFilterCombination) {
			                	var filterCombination: FilterCombination = cast(_ui.draggable.parent(), FilterCombination);
			                	JQ.cur.append(clone);
			                	filterCombination.filterCombination("removeFilterable", _ui.draggable);
			                } else {
			                	JQ.cur.append(clone);
			                }
			                clone.css({
			                        "position": "absolute"
			                    });
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

				    cast(trashDiv, JQDroppable).droppable({
				    	accept: function(d) {
			    			return d.is(".filterTrashable");
			    		},
						activeClass: "ui-state-hover",
				      	hoverClass: "ui-state-active",
				      	greedy: true,
				      	drop: function( event: JqEvent, _ui: UIDroppable ) {
			                //fire off a filterable
			                _ui.draggable.remove();
			                shrink();
			                self.fireFilter();
				      	},
				      	tolerance: "pointer",
				      	over: function( event: JqEvent, _ui: UIDroppable) {
				    		grow(300);
				      	},
				      	out: function( event: JqEvent, _ui: UIDroppable) {
				      		shrink();
				      	}
			    	}).tooltip().dblclick(function(event: JqEvent) {
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

		        	var root: Node = selfElement.children(".rootToggle").data("getNode")();//new And();//determine this
		        	root.type = "ROOT";

		        	var filterables: JQ = selfElement.children(".filterable");
		        	filterables.each(function (idx: Int, el: js.Dom.HtmlDom): Void {
		        			var filterable: FilterableComponent = new FilterableComponent(el);
		        			var node: Node = filterable.data("getNode")();
		        			root.addNode(node);
		        		});
		        	EventModel.change("runFilter", new Filter(root));
	        	},

		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.filterComp", defineWidget());
	}
}