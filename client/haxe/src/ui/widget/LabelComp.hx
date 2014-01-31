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

using m3.helper.OSetHelper;
using StringTools;

typedef LabelCompOptions  = { 
	>FilterableCompOptions,
	var labelIid: String;
	@:optional var parentIid:String;
}

typedef LabelCompWidgetDef = {
	var options: LabelCompOptions;
	@:optional var label:Label;
	var _create: Void->Void;
	var _registerListeners: Void->Void;
	@:optional var _super: Void->Void;
	var _onupdate: Label->EventType->Void;
	var destroy: Void->Void;
	var getLabel:Void->Label;
}

class LabelCompHelper {
	public static function getLabel(l: LabelComp): Label {
		return l.labelComp("getLabel");
	}
	public static function parentIid(l: LabelComp): String {
		return l.labelComp("option", "parentIid");
	}
}

@:native("$")
extern class LabelComp extends FilterableComponent {

	@:overload(function<T>(cmd : String):T{})
	@:overload(function<T>(cmd:String, opt:String):T{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function labelComp(opts: LabelCompOptions): LabelComp;

	private static function __init__(): Void {
		var defineWidget: Void->LabelCompWidgetDef = function(): LabelCompWidgetDef {
			return {
		        options: {
		            labelIid: null,
		            isDragByHelper: true,
		            containment: false,
		            dndEnabled: true,
		            classes: null,
		            dropTargetClass: "labelDT",
		            dragstop: null,
		            		// function(dragstopEvt: JQEvent, dragstopUi: UIDraggable): Void {
				              //   		if(!tags.intersects(clone)) {
				              //   			clone.remove();
				              //   		}
				              //   	})
		            cloneFcn: function(filterableComp: FilterableComponent, ?isDragByHelper: Bool = false, ?containment: Dynamic = false, ?dragstop: JQEvent->UIDraggable->Void): LabelComp {
		            			var labelComp: LabelComp = cast(filterableComp, LabelComp);
				            	if(labelComp.hasClass("clone")) return labelComp;
				            	var clone: LabelComp = new LabelComp("<div class='clone'></div>");
				            	clone.labelComp({
			                        labelIid: labelComp.labelComp("option", "labelIid"),
			                        isDragByHelper: isDragByHelper,
			                        containment: containment,
			                        dragstop: dragstop,
			                        classes: labelComp.labelComp("option", "classes"),
			                        cloneFcn: labelComp.labelComp("option", "cloneFcn"),
			                        dropTargetClass: labelComp.labelComp("option", "dropTargetClass")
			                    });
				            	return clone;
		            		}
		        },

		        getLabel: function():Label {
		        	var self: LabelCompWidgetDef = Widgets.getSelf();
		        	return self.label;
		        },

		        _registerListeners: function():Void {
		        	var self: LabelCompWidgetDef = Widgets.getSelf();
		        	var fs = new FilteredSet<Label>(AppContext.LABELS, function(label:Label):Bool {
		        		return label.iid == self.options.labelIid;
		        	});
					fs.listen(self._onupdate);
		        },
		        
		        _create: function(): Void {
		        	var self: LabelCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
					if(!selfElement.is("div")) {
		        		throw new Exception("Root of LabelComp must be a div element");
		        	}

		        	self.label = AppContext.LABELS.getElement(self.options.labelIid);
		        	if (self.label == null) {
		        		self.label = new Label("...");
		        		self.label.iid = self.options.labelIid;
		        		AppContext.MASTER_LABELS.add(self.label);
		        	}

		        	selfElement.addClass("label labelComp ").attr("id", self.label.name.htmlEscape() + "_" + UidGenerator.create(8));
		        	
		            var labelTail: JQ = new JQ("<div class='labelTail'></div>");
		            labelTail.css("border-right-color", self.label.data.color);
		            selfElement.append(labelTail);
		            var labelBox: JQ = new JQ("<div class='labelBox shadowRight'></div>");
		            labelBox.css("background", self.label.data.color);
		            var labelBody: JQ = new JQ("<div class='labelBody'></div>");
		            var labelText: JQ = new JQ("<div>" + self.label.name + "</div>");
		            labelBody.append(labelText);
		            labelBox.append(labelBody);
		            selfElement.append(labelBox).append("<div class='clear'></div>");

		            selfElement.addClass("filterable");
		        	
		        	self._registerListeners();

		            if(self.options.dndEnabled) {
			            selfElement.data(
			            	"clone", self.options.cloneFcn
		            	);
		            	selfElement.data("dropTargetClass", self.options.dropTargetClass);
		            	selfElement.data("getNode", function(): Node {
			            		var node: LabelNode = new LabelNode();
			            		node.type = "LABEL";
			            		node.content = self.label;
			            		return node;
			            	});

			            var helper: Dynamic = "clone";
			            if(!self.options.isDragByHelper) {
			            	helper = "original";
			            } else if (self.options.helperFcn != null && Reflect.isFunction(self.options.helperFcn)) {
			            	helper = self.options.helperFcn;
			            }

		            	selfElement.on("dragstop", function(dragstopEvt: JQEvent, dragstopUi: UIDraggable): Void {
		            				AppContext.LOGGER.debug("dragstop on label | " + self.label.name);
			                		if(self.options.dragstop != null) {
			                			self.options.dragstop(dragstopEvt, dragstopUi);
			                		}
			                	});

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
					      			type: "LABEL",
					      			dragstop: self.options.dragstop
				      			});
				      			filterCombiner.filterCombination("addFilterable", JQ.cur);

				      			var clone: JQ = _ui.draggable.data("clone")(_ui.draggable,false,"window");

				                clone.addClass("filterTrashable " + _ui.draggable.data("dropTargetClass"));

				      			filterCombiner.filterCombination("addFilterable", clone);

				      			filterCombiner.filterCombination("position");
					      	},
					      	tolerance: "pointer"
				    	});
					}
		        },

		        _onupdate: function(label:Label, t:EventType): Void {
		        	var self: LabelCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

					if (t.isUpdate()) {
						self.label = label;
			        	selfElement.find(".labelBody").text(label.name);
			       		selfElement.find(".labelTail").css("border-right-color", label.data.color);
			            selfElement.find(".labelBox").css("background", label.data.color);
			        } else if (t.isDelete()) {
			        	// Delete is being performed by the LabelTreeBranch
			        }
	        	},
		        
		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.labelComp", defineWidget());
	}	
}