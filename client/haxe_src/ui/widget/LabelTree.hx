package ui.widget;

import ui.jq.JQ;
import ui.model.ModelObj;
import ui.observable.OSet;
import ui.widget.LabelComp;

typedef LabelTreeOptions = {
	var labels: OSet<Label>;
	@:optional var itemsClass: String;
}

typedef LabelTreeWidgetDef = {
	var options: LabelTreeOptions;
	@:optional var labels: MappedSet<Label, LabelTreeBranch>;
	var _create: Void->Void;
	var destroy: Void->Void;
}

extern class LabelTree extends JQ {
	@:overload(function(cmd : String):Bool{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function labelTree(opts: LabelTreeOptions): LabelTree;

	private static function __init__(): Void {
		untyped LabelTree = window.jQuery;
		var defineWidget: Void->LabelTreeWidgetDef = function(): LabelTreeWidgetDef {
			return {
		        options: {
		            labels: null,
		            itemsClass: null
		        },

		        _create: function(): Void {
		        	var self: LabelTreeWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new ui.exception.Exception("Root of LabelTree must be a div element");
		        	}

		        	selfElement.addClass("labelTree " + Widgets.getWidgetClasses());

		        	self.labels = new MappedSet<Label, LabelTreeBranch>(self.options.labels, function(label: Label): LabelTreeBranch {
		        			return new LabelTreeBranch("<div></div>").labelTreeBranch({
		        				label: label,
	        					children:  new FilteredSet<Label>(AgentUi.USER.currentAlias.labels, function(child: Label): Bool{
		        						return child.parentUid == label.uid;
		        					})
		        			});
		        		});
		        	self.labels.listen(function(labelTreeBranch: LabelTreeBranch, evt: EventType): Void {
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