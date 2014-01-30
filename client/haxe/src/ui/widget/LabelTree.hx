package ui.widget;

import m3.jq.JQ;
import m3.widget.Widgets;
import ui.model.ModelObj;
import m3.observable.OSet;
import ui.widget.LabelComp;
import m3.exception.Exception;

using m3.helper.OSetHelper;

typedef LabelTreeOptions = {
	var parentIid:String;
	var labels: OSet<Label>;
	@:optional var itemsClass: String;
}

typedef LabelTreeWidgetDef = {
	var options: LabelTreeOptions;
	@:optional var mappedLabels: MappedSet<Label, LabelTreeBranch>;
	var _create: Void->Void;
	var destroy: Void->Void;
}

@:native("$")
extern class LabelTree extends JQ {
	@:overload(function(cmd : String):Bool{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function labelTree(opts: LabelTreeOptions): LabelTree;

	private static function __init__(): Void {
		var defineWidget: Void->LabelTreeWidgetDef = function(): LabelTreeWidgetDef {
			return {
		        options: {
		        	parentIid:null,
		            labels: null,
		            itemsClass: null
		        },

		        _create: function(): Void {
		        	var self: LabelTreeWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of LabelTree must be a div element");
		        	}

		        	selfElement.addClass("labelTree boxsizingBorder " + Widgets.getWidgetClasses());

		        	self.mappedLabels = new MappedSet<Label, LabelTreeBranch>(self.options.labels, function(label: Label): LabelTreeBranch {
	        			var children:OSet<Label>;
	        			var isPlaceHolder = (label.iid == AppContext.placeHolderLabel.iid);
	        			// if this is a placeholder, add an empty set for the children
	        			if (isPlaceHolder) {
	        				children = new ObservableSet<Label>(Label.identifier);
	        			} else {
			        			// If there are no children for this label, add the placeholder,
			        			// so that any updates to the GROUPED_LABELCHILDREN will be picked up.
		        				if (AppContext.GROUPED_LABELCHILDREN.delegate().get(label.iid) == null) {
		        					ui.AppContext.MASTER_LABELCHILDREN.add(new LabelChild(label.iid, AppContext.placeHolderLabel.iid));
		        				}

		        			var ms = new MappedSet<LabelChild, Label>(
		        				AppContext.GROUPED_LABELCHILDREN.delegate().get(label.iid), 
		        				function(lc: LabelChild): Label {
	        						return AppContext.LABELS.getElement(lc.childIid);
	        					}
        					);
		        			ms.visualId = "filteredLabelTree--" + label.name;
		        			children = ms;
		        		}
		        		
		        		var hidden = isPlaceHolder ? " style='display:none;'" : ""; 
	        			return new LabelTreeBranch("<div" + hidden + "></div>").labelTreeBranch({
	        				parentIid:self.options.parentIid,
	        				label: label,
        					children: children
	        			});
	        		});
		        	self.mappedLabels.visualId = self.options.labels.getVisualId() + "_map";

		        	self.mappedLabels.listen(function(labelTreeBranch: LabelTreeBranch, evt: EventType): Void {
	        			AppContext.LOGGER.debug(self.mappedLabels.visualId + " | LabelTree | " + evt.name() + " | New Branch");
	            		if(evt.isAdd()) {
	            			selfElement.append(labelTreeBranch);
	            		} else if (evt.isUpdate()) {
	            			labelTreeBranch.labelTreeBranch("update");
	            		} else if (evt.isDelete()) {
	            			labelTreeBranch.remove();
	            		}
	            	});
		        },
		        
		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.labelTree", defineWidget());
	}
}