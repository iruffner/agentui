package qoid.widget;

import m3.jq.JQ;
import m3.widget.Widgets;
import qoid.model.ModelObj;
import m3.observable.OSet;
import qoid.widget.LabelComp;
import m3.exception.Exception;

using m3.helper.OSetHelper;

typedef LabelTreeOptions = {
	var parentIid:String;
	var labelPath:Array<String>;
	@:optional var itemsClass: String;
}

typedef LabelTreeWidgetDef = {
	var options: LabelTreeOptions;
	@:optional var mappedLabels: MappedSet<LabelChild, LabelTreeBranch>;
	@:optional var onchangeLabelChildren: LabelTreeBranch->EventType->Void;
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
		            itemsClass: null,
		            labelPath: []
		        },

		        _create: function(): Void {
		        	var self: LabelTreeWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of LabelTree must be a div element");
		        	}

		        	selfElement.addClass("labelTree boxsizingBorder " + Widgets.getWidgetClasses());

    				if (AppContext.GROUPED_LABELCHILDREN.delegate().get(self.options.parentIid) == null) {
	        			AppContext.GROUPED_LABELCHILDREN.addEmptyGroup(self.options.parentIid);
    				}

			        self.onchangeLabelChildren = function(labelTreeBranch: LabelTreeBranch, evt: EventType): Void {
	            		if(evt.isAdd()) {
	            			selfElement.append(labelTreeBranch);
	            		} else if (evt.isUpdate()) {
	            			throw new Exception("this should never happen");
	            		} else if (evt.isDelete()) {
	            			labelTreeBranch.remove();
	            		}
	            	};

            		self.mappedLabels = new MappedSet<LabelChild, LabelTreeBranch>(AppContext.GROUPED_LABELCHILDREN.delegate().get(self.options.parentIid), 
		        		function(labelChild: LabelChild): LabelTreeBranch {
		        			var labelPath = self.options.labelPath.copy();
		        			labelPath.push(labelChild.childIid);
		        			return new LabelTreeBranch("<div></div>").labelTreeBranch({
		        				parentIid: self.options.parentIid,
		        				labelIid: labelChild.childIid,
		        				labelPath: labelPath
		        			});
	        		});
		        	self.mappedLabels.visualId = self.options.parentIid + "_map";

		        	self.mappedLabels.listen(self.onchangeLabelChildren);
		        },
		        
		        destroy: function() {
		        	var self: LabelTreeWidgetDef = Widgets.getSelf();
		        	self.mappedLabels.removeListener(self.onchangeLabelChildren);
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.labelTree", defineWidget());
	}
}