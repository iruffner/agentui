package ui.widget;

import js.JQuery;
import ui.jq.JQ;
import ui.jq.JQDroppable;
import ui.jq.JQDraggable;
import ui.model.ModelObj;
import ui.observable.OSet;

using StringTools;

typedef FilterableCompOptions = {
	@:optional var dndEnabled: Bool;
	@:optional var isDragByHelper: Bool;
	@:optional var containment: Dynamic;
	@:optional var classes: String;
	@:optional var cloneFcn: FilterableComp->Bool->Dynamic->FilterableComp;
	@:optional var dropTargetClass: String;
	@:optional var helperFcn: Void->JQ;
}

typedef FilterableCompWidgetDef = {
	var options: FilterableCompOptions;
	var _create: Void->Void;
}

extern class FilterableComp extends JQ {

	@:overload(function(cmd : String):Bool{})
	@:overload(function(cmd:String, opt:String):Dynamic{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function filterableComp(opts: FilterableCompOptions): FilterableComp;

	private static function __init__(): Void {
		untyped FilterableComp = window.jQuery;
		// _initColors();
		var defineWidget: Void->FilterableCompWidgetDef = function(): FilterableCompWidgetDef {
			return {
		        options: {
		            isDragByHelper: true,
		            containment: false,
		            dndEnabled: true,
		            cloneFcn: null,
		            dropTargetClass: null
		        },
		        
		        _create: function(): Void {
		        	var self: FilterableCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
					if(!selfElement.is("div")) {
		        		throw new ui.exception.Exception("Root of FilterableComp must be a div element");
		        	}

		        	selfElement.addClass("filterable");
		        	
		            if(self.options.dndEnabled) {
			            selfElement.data(
			            	"clone", self.options.cloneFcn
		            	);
		            	selfElement.data("dropTargetClass", self.options.dropTargetClass);

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
				    			return JQ.cur.parent().is(".dropCombiner") && d.is(".filterable");
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
					      	tolerance: "pointer"
				    	});
					}
		        }
		    };
		}
		JQ.widget( "ui.filterableComp", defineWidget());
	}	
}