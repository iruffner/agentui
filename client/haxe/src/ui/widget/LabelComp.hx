package ui.widget;

import m3.jq.JQ;
import m3.jq.JQDroppable;
import m3.jq.JQDraggable;
import m3.widget.Widgets;
import ui.model.ModelObj;
import ui.model.Node;
import m3.observable.OSet;
import ui.widget.FilterableComponent;
import m3.exception.Exception;
import m3.util.UidGenerator;

using StringTools;

typedef LabelCompOptions  = { 
	>FilterableCompOptions,
	var label: Label;
}

typedef LabelCompWidgetDef = {
	var options: LabelCompOptions;
	var _create: Void->Void;
	@:optional var _super: Void->Void;
	var update: Void->Void;
	var destroy: Void->Void;
}

class LabelCompHelper {
	public static function getLabel(l: LabelComp): Label {
		return l.labelComp("option", "label");
	}
}

@:native("$")
extern class LabelComp extends FilterableComponent {
	public static var COLORS: Array<Array<String>>;

	@:overload(function<T>(cmd : String):T{})
	@:overload(function<T>(cmd:String, opt:String):T{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function labelComp(opts: LabelCompOptions): LabelComp;

	private static function __init__(): Void {
		var defineWidget: Void->LabelCompWidgetDef = function(): LabelCompWidgetDef {
			return {
		        options: {
		            label: null,
		            isDragByHelper: true,
		            containment: false,
		            dndEnabled: true,
		            classes: null,
		            dropTargetClass: "labelDT",
		            cloneFcn: function(filterableComp: FilterableComponent, ?isDragByHelper: Bool = false, ?containment: Dynamic = false): LabelComp {
		            			var labelComp: LabelComp = cast(filterableComp, LabelComp);
				            	if(labelComp.hasClass("clone")) return labelComp;
				            	var clone: LabelComp = new LabelComp("<div class='clone'></div>");
				            	clone.labelComp({
				                        label: labelComp.labelComp("option", "label"),
				                        isDragByHelper: isDragByHelper,
				                        containment: containment,
				                        classes: labelComp.labelComp("option", "classes"),
				                        cloneFcn: labelComp.labelComp("option", "cloneFcn"),
				                        dropTargetClass: labelComp.labelComp("option", "dropTargetClass")
				                    });
				            	return clone;
		            		}
		        },
		        
		        _create: function(): Void {
		        	var self: LabelCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
					if(!selfElement.is("div")) {
		        		throw new Exception("Root of LabelComp must be a div element");
		        	}

		        	// selfElement.addClass(Widgets.getWidgetClasses());

		        	selfElement.addClass("label labelComp ").attr("id", self.options.label.text.htmlEscape() + "_" + UidGenerator.create(8));
		        	
		            var labelTail: JQ = new JQ("<div class='labelTail'></div>");
		            labelTail.css("border-right-color", self.options.label.color);
		            selfElement.append(labelTail);
		            var labelBox: JQ = new JQ("<div class='labelBox shadowRight'></div>");
		            labelBox.css("background", self.options.label.color);
		            var labelBody: JQ = new JQ("<div class='labelBody'></div>");
		            var labelText: JQ = new JQ("<div>" + self.options.label.text + "</div>");
		            labelBody.append(labelText);
		            labelBox.append(labelBody);
		            selfElement.append(labelBox).append("<div class='clear'></div>");

		            selfElement.addClass("filterable");
		        	
		            if(self.options.dndEnabled) {
			            selfElement.data(
			            	"clone", self.options.cloneFcn
		            	);
		            	selfElement.data("dropTargetClass", self.options.dropTargetClass);
		            	selfElement.data("getNode", function(): Node {
			            		var node: LabelNode = new LabelNode();
			            		node.type = "LABEL";
			            		node.content = self.options.label;
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
				    		scroll: false,
				    		revertDuration: 200,
				    		start: function(evt:JQEvent, _ui:UIDraggable):Void {
				    			cast(selfElement, JQDraggable).draggable("option", "revert", false);
				    		}
				    	});

			            cast(selfElement, JQDroppable).droppable({
				    		accept: function(d) {
				    			return !JQ.cur.parent().is(".filterCombination") && JQ.cur.parent().is(".dropCombiner") && d.is(".label");
				    		},
							activeClass: "ui-state-hover",
					      	hoverClass: "ui-state-active",
					      	greedy: true,
					      	drop: function( event: JQEvent, _ui: UIDroppable ) {
					      		var filterCombiner: FilterCombination = new FilterCombination("<div></div>");
					      		filterCombiner.appendTo(JQ.cur.parent());
					      		filterCombiner.filterCombination({
					      			event: event,
					      			type: "LABEL"
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
		        	var self: LabelCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

		        	selfElement.find(".labelBody").text(self.options.label.text);
	        	},
		        
		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.labelComp", defineWidget());
	}	
}