package ui.widget;

import js.JQuery;
import ui.jq.JQ;
import ui.jq.JQDroppable;
import ui.model.ModelObj;
import ui.observable.OSet;
import ui.widget.LabelComp;

typedef FilterCompOptions = {
}

typedef FilterCompWidgetDef = {
	@:optional var options: FilterCompOptions;
	var _create: Void->Void;
	var destroy: Void->Void;
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

		        	selfElement.addClass("connectionDT labelDT nohelper dropCombiner " + Widgets.getWidgetClasses());

					cast(selfElement, JQDroppable).droppable({
			    		accept: function(d) {
			    			return d.is(".filterable");
			    		},
						activeClass: "ui-state-hover",
				      	hoverClass: "ui-state-active",
				      	drop: function( event: JqEvent, _ui: UIDroppable ) {
			                //fire off a filterable
			                var clone: JQ = _ui.draggable.data("clone")(_ui.draggable, false, "#filter");
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
			                    })
			                    .position({
			                    	my: "left top",
			                    	at: "left top",
			                    	of: event, // _ui.helper can be smoother, but since we don't always use a helper, sometimes we're trying to position of ourselves
			                    	collision: "flipfit",
			                    	within: "#filter"
	                    		})
			                	;
				      	}
				    });

				    cast(selfElement.children("#filterTrash"), JQDroppable).droppable({
				    	accept: function(d) {
			    			return d.is(".filterTrashable");
			    		},
						activeClass: "ui-state-hover",
				      	hoverClass: "ui-state-active",
				      	greedy: true,
				      	drop: function( event: JqEvent, _ui: UIDroppable ) {
			                //fire off a filterable
			                _ui.draggable.remove();
				      	},
				      	tolerance: "pointer"
			    	});
		        },
		        
		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.filterComp", defineWidget());
	}
}