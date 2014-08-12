package qoid.widget;

import m3.jq.JQ;
import m3.jq.JQDroppable;
import m3.jq.JQDraggable;
import m3.widget.Widgets;
import qoid.model.ModelObj;
import qoid.model.Node;
import m3.observable.OSet;
import qoid.widget.FilterableComponent;
import m3.exception.Exception;
import m3.util.UidGenerator;

import qoid.model.EM;
using qoid.widget.AlbumComp;
using m3.helper.OSetHelper;
using StringTools;

typedef AlbumCompOptions  = { 
	@:optional var dndEnabled: Bool;
	@:optional var isDragByHelper: Bool;
	@:optional var containment: Dynamic;
	@:optional var classes: String;
	@:optional var cloneFcn: AlbumComp->Bool->Dynamic->(JQEvent->UIDraggable->Void)->AlbumComp;
	@:optional var dropTargetClass: String;
	@:optional var helperFcn: Void->JQ;
	@:optional var dragstop: JQEvent->UIDraggable->Void;
	var labelIid: String;
	@:optional var parentIid:String;
	@:optional var labelPath:Array<String>;
}

typedef AlbumCompWidgetDef = {
	var options: AlbumCompOptions;
	@:optional var label:Label;
	@:optional var filteredSet:FilteredSet<Label>;
	var _create: Void->Void;
	var _registerListeners: Void->Void;
	@:optional var _super: Void->Void;
	@:optional var _onupdate: Label->EventType->Void;
	var destroy: Void->Void;
	var getLabel:Void->Label;
	var getLabelPathNames: Void->Array<String>;
}

class AlbumCompHelper {
	public static function getLabel(l: AlbumComp): Label {
		return l.albumComp("getLabel");
	}
	public static function parentIid(l: AlbumComp): String {
		return l.albumComp("option", "parentIid");
	}
}
@:native("$")
extern class AlbumComp extends JQ {

	@:overload(function<T>(cmd : String):T{})
	@:overload(function<T>(cmd:String, opt:String):T{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function albumComp(?opts: AlbumCompOptions): AlbumComp;

	private static function __init__(): Void {
		var defineWidget: Void->AlbumCompWidgetDef = function(): AlbumCompWidgetDef {
			return {
		        options: {
		            labelIid: null,
		            isDragByHelper: true,
		            containment: false,
		            dndEnabled: true,
		            classes: null,
		            dropTargetClass: "labelDT",
		            dragstop: null,
		            cloneFcn: function(albumComp: AlbumComp, ?isDragByHelper: Bool = false, ?containment: Dynamic = false, ?dragstop: JQEvent->UIDraggable->Void): AlbumComp {
		            			// var albumComp: AlbumComp = cast(albumComp, AlbumComp);
				            	if(albumComp.hasClass("clone")) return albumComp;
				            	var clone: AlbumComp = new AlbumComp("<div class='clone'></div>");
				            	clone.albumComp({
			                        labelIid: albumComp.albumComp("option", "labelIid"),
			                        parentIid: albumComp.albumComp("option", "parentIid"),
			                        labelPath: albumComp.albumComp("option", "labelPath"),
			                        isDragByHelper: isDragByHelper,
			                        containment: containment,
			                        dragstop: dragstop,
			                        classes: albumComp.albumComp("option", "classes"),
			                        cloneFcn: albumComp.albumComp("option", "cloneFcn"),
			                        dropTargetClass: albumComp.albumComp("option", "dropTargetClass")
			                    });
				            	return clone;
		            		}
		        },

		        getLabel: function():Label {
		        	var self: AlbumCompWidgetDef = Widgets.getSelf();
		        	return self.label;
		        },

		        getLabelPathNames: function(): Array<String> {
		        	var self: AlbumCompWidgetDef = Widgets.getSelf();
		        	var ret = new Array<String>();
		        	for (iid in self.options.labelPath) {
		        		var label = AppContext.LABELS.getElement(iid);
		        		ret.push(label.name);
		        	}
		        	return ret;
		        },

		        _registerListeners: function():Void {
		        	var self: AlbumCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

			        self._onupdate = function(label:Label, t:EventType): Void {
						if (t.isAddOrUpdate()) {
							self.label = label;
				        	selfElement.find(".labelBody").text(label.name);
				       		selfElement.find(".labelTail").css("border-right-color", label.data.color);
				            selfElement.find(".labelBox").css("background", label.data.color);
				        } else if (t.isDelete()) {
				        	self.destroy();
				        	selfElement.remove();
				        }
		        	};
		        
		        	self.filteredSet = new FilteredSet<Label>(AppContext.LABELS, function(label:Label):Bool {
		        		return label.iid == self.options.labelIid;
		        	});
					self.filteredSet.listen(self._onupdate);
		        },
		        
		        _create: function(): Void {
		        	var self: AlbumCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
					if(!selfElement.is("div")) {
		        		throw new Exception("Root of AlbumComp must be a div element");
		        	}

		        	self.label = AppContext.LABELS.getElement(self.options.labelIid);
		        	if (self.label == null) {
		        		self.label = new Label("-->*<--");
		        		self.label.iid = self.options.labelIid;
		        		AppContext.LABELS.add(self.label);
		        	}

		        	selfElement.addClass("label AlbumComp ").attr("id", self.label.name.htmlEscape() + "_" + UidGenerator.create(8));
		        	
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
			            		return new LabelNode(self.label, self.getLabelPathNames());
			            	});

			            var helper: Dynamic = "clone";
			            if(!self.options.isDragByHelper) {
			            	helper = "original";
			            } else if (self.options.helperFcn != null && Reflect.isFunction(self.options.helperFcn)) {
			            	helper = self.options.helperFcn;
			            }

		            	selfElement.on("dragstop", function(dragstopEvt: JQEvent, _ui: UIDraggable): Void {
            				AppContext.LOGGER.debug("dragstop on label | " + self.label.name);
	                		if (self.options.dragstop != null) {
	                			self.options.dragstop(dragstopEvt, _ui);
	                		}
	                		new JQ(js.Browser.document).off("keydown keyup");
	                		_ui.helper.find("#copyIndicator").remove();
			            });

			            var showOrHideCopyIndicator = function(event:JQEvent, _ui: UIDraggable) {
		            		var ci = _ui.helper.find("#copyIndicator");
		            		if (event.ctrlKey) {
		            			if (ci.length == 0) {
			            			new JQ("<img src='svg/add.svg' id='copyIndicator'/>").appendTo(_ui.helper);
			            		} else {
			            			ci.show();
			            		}
		            		} else {
		            			ci.hide();
		            		}			            	
			            }

			            selfElement.on("dragstart", function(event: JQEvent, _ui: UIDraggable): Void {
			            	new JQ(js.Browser.document).on("keydown keyup", function(event:JQEvent){
			            		showOrHideCopyIndicator(event, _ui);
			            	});
			            });

		            	selfElement.on("drag", function(event: JQEvent, _ui: UIDraggable): Void {
		            		showOrHideCopyIndicator(event, _ui);
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

			            var copyOrMoveLabel = function(event: JQEvent, _ui: UIDroppable) {
			            	var AlbumComp: AlbumComp = cast(_ui.draggable, AlbumComp);
			            	var eld = new EditLabelData(AlbumComp.getLabel(), AlbumComp.parentIid(), self.getLabel().iid);
			            	if (event.ctrlKey) {
			            		EM.change(EMEvent.CopyLabel, eld);
			            	} else {
			            		EM.change(EMEvent.MoveLabel, eld);
			            	}
			            };

			            cast(selfElement, JQDroppable).droppable({
				    		accept: function(d) {
				    			return !JQ.cur.parent().is(".filterCombination") && 
				    			        d.is(".label") && 
				    			        (JQ.cur.parent().is(".dropCombiner") || JQ.cur.parent().is(".labelTreeBranch")); 
				    		},
							activeClass: "ui-state-hover",
					      	hoverClass: "ui-state-active",
					      	greedy: true,
					      	drop: function(event: JQEvent, _ui: UIDroppable) {
					      		if (JQ.cur.parent().is(".labelTreeBranch")) {
					      			copyOrMoveLabel(event, _ui);
					      		} else {
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
					      		}
					      	},
					      	tolerance: "pointer"
				    	});
					}
		        },

		        destroy: function() {
		        	var self: AlbumCompWidgetDef = Widgets.getSelf();
		        	self.filteredSet.removeListener(self._onupdate);
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.albumComp", defineWidget());
	}	
}