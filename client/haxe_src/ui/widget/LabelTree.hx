package ui.widget;

import ui.jq.JQ;
import ui.model.ModelObj;
import ui.observable.OSet;

typedef LabelTreeOptions = {
	var labels: ObservableSet<Label>;
	@:optional var itemsClass: String;
}

typedef LabelTreeWidgetDef = {
	var options: LabelTreeOptions;
	@:optional var labels: MappedSet<Label, LabelComp>;
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

					cast(selfElement, JQDroppable).droppable({
			    		accept: function(d: JQ) {
			    			return d.is(".label");
			    		},
						activeClass: "ui-state-hover",
				      	hoverClass: "ui-state-active",
				      	drop: function( event, ui ) {
				      		App.LOGGER.debug("droppable drop");	
				        	// $( this ).addClass( "ui-state-highlight" );
				      	}
				    });

					var spacer: JQ = selfElement.children("#sideLeftSpacer");
		        	self.labels = new MappedSet<Label, LabelComp>(self.options.labels, function(label: Label): LabelComp {
		        			return new LabelComp("<div></div>").labelComp({label: label});
		        		});
		        	self.labels.listen(function(labelComp: LabelComp, evt: EventType): Void {
		            		if(evt.isAdd()) {
		            			spacer.before(labelComp);
		            		} else if (evt.isUpdate()) {
		            			labelComp.labelComp("update");
		            		} else if (evt.isDelete()) {
		            			labelComp.remove();
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