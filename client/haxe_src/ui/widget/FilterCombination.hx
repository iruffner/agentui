package ui.widget;

import js.JQuery;
import ui.jq.JQ;
import ui.jq.JQDroppable;
import ui.jq.JQDraggable;
import ui.model.ModelObj;
import ui.observable.OSet;
import ui.widget.LabelComp;

using ui.helper.ArrayHelper;

typedef FilterCombinationOptions = {
	@:optional var position: {left: Int, top: Int};
	@:optional var event: JqEvent;
}

typedef FilterCombinationWidgetDef = {
	@:optional var options: FilterCombinationOptions;
	var _create: Void->Void;
	var destroy: Void->Void;
	var addFilterable: JQ->Void;
	var removeFilterable: JQ->Void;
	var position: Void->Void;
	var _filterables: Array<JQ>;
}

extern class FilterCombination extends JQ {

	@:overload(function(cmd : String):Bool{})
	@:overload(function(cmd : String, arg: Dynamic):Void{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function filterCombination(?opts: FilterCombinationOptions): FilterCombination;

	private static function __init__(): Void {
		untyped FilterCombination = window.jQuery;
		var defineWidget: Void->FilterCombinationWidgetDef = function(): FilterCombinationWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: FilterCombinationWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new ui.exception.Exception("Root of FilterCombination must be a div element");
		        	}

		        	selfElement.addClass("connectionDT labelDT nohelper dropCombiner filterCombination" + Widgets.getWidgetClasses());

		        	selfElement.position({
		        		my: "bottom right",
		        		at: "left top",
		        		of: self.options.event,
		        		collision: "flipfit",
		        		within: "#filter"
	        		});

		      //   	cast(selfElement, JQDraggable).draggable({
			    	// 	containment: "parent", 
			    	// 	distance: 10,
			    	// 	// grid: [5,5],
			    	// 	scroll: false
				    // });

					cast(selfElement, JQDroppable).droppable({
			    		accept: function(d) {
			    			return d.is(".filterable");
			    		},
						activeClass: "ui-state-hover",
				      	hoverClass: "ui-state-active",
				      	drop: function( event: JqEvent, _ui: UIDroppable ) {
			                //fire off a filterable
				      		// App.LOGGER.debug("droppable drop");	
				        	// $( this ).addClass( "ui-state-highlight" );
				      	}
				    });
		        },

		        _filterables: new Array<JQ>(),

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

		        addFilterable: function(filterable: JQ): Void {
		        	var self: FilterCombinationWidgetDef = Widgets.getSelf();
		        	self._filterables.push(filterable);
	        	},

	        	removeFilterable: function(filterable: JQ): Void {
	        		var self: FilterCombinationWidgetDef = Widgets.getSelf();
	        		var selfElement: JQ = Widgets.getSelfElement();
	        		var index: Int = self._filterables.indexOfComplex(filterable.attr("id"), function(jq: JQ): String { return jq.attr("id"); });
		        	self._filterables.splice(index, 1);
		        	if(self._filterables.length == 1) {
		        		var position: {top: Int, left: Int} = self._filterables[0].position();
		        		self._filterables[0].appendTo(selfElement.parent());
	        			self._filterables[0].css({
	        					"position": "absolute"
	        					// , "left": position.left
	        					// , "top": position.top
	        				})
		                    .position({
		                    	my: "center center",
		                    	at: "center+50 center+50",
		                    	of: selfElement,
		                    	collision: "fit",
		                    	within: "#filter"
                    		})
		                	;
		                self._filterables = null;
		        		self.destroy();
		        		selfElement.remove();
		        	}
	        	},
		        
		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.filterCombination", defineWidget());
	}
}