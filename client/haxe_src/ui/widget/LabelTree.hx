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

		        	selfElement.addClass(Widgets.getWidgetClasses());

					// cast(selfElement, JQDroppable).droppable({
			  //   		accept: function(d: JQ) {
			  //   			return d.is(".label");
			  //   		},
					// 	activeClass: "ui-state-hover",
				 //      	hoverClass: "ui-state-active",
				 //      	drop: function( event, ui ) {
				 //      		App.LOGGER.debug("droppable drop");	
				 //        	// $( this ).addClass( "ui-state-highlight" );
				 //      	}
				 //    });

					// var spacer: JQ = selfElement.children("#sideLeftSpacer");
		        	self.labels = new MappedSet<Label, LabelTreeBranch>(self.options.labels, function(label: Label): LabelTreeBranch {
		        			return new LabelTreeBranch("<div></div>").labelTreeBranch({
		        				label: label,
	        					children: new FilteredSet<Label>(App.LABELS, function(child: Label): Bool{
	        							if(child.parentUid == label.uid) App.LOGGER.debug(label.text + " keep " + child.text);
		        						return child.parentUid == label.uid;
		        					})
		        			});
		        		});
		        	self.labels.listen(function(labelTreeBranch: LabelTreeBranch, evt: EventType): Void {
		            		if(evt.isAdd()) {
		            			App.LOGGER.debug("Add " + evt.name());
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