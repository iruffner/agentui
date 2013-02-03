package ui.widget;

import ui.jq.JQ;
import ui.model.ModelObj;
import ui.observable.OSet.ObservableSet;

typedef LabelCompOptions = {
	var label: Label;
	@:optional var children: ObservableSet<Label>;
	@:optional var classes: String;
}

typedef LabelCompWidgetDef = {
	var options: LabelCompOptions;
	var _create: Void->Void;
	var update: Void->Void;
	var destroy: Void->Void;
}

extern class LabelComp extends JQ {
	@:overload(function(cmd : String):Bool{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function labelComp(opts: LabelCompOptions): LabelComp;

	private static function __init__(): Void {
		untyped LabelComp = window.jQuery;
		var defineWidget: Void->LabelCompWidgetDef = function(): LabelCompWidgetDef {
			return {
		        options: {
		            label: null,
		            classes: null
		        },
		        
		        _create: function(): Void {
		        	var self: LabelCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
					if(!selfElement.is("div")) {
		        		throw new ui.exception.Exception("Root of LabelComp must be a div element");
		        	}

		        	selfElement.addClass("labelWrapper");
		        	
		        	var label: JQ = new JQ("<div class='label filterable'></div>");
		            label.append("<div class='labelTail'></div>");
		            var labelBox: JQ = new JQ("<div class='labelBox'></div>");
		            var labelBody: JQ = new JQ("<div class='labelBody'></div>");
		            labelBox.append(labelBody);
		            label.append(labelBox).append("<div class='clear'></div>");

		            var labelChildren: LabelTree = new LabelTree("<div class='labelChildren'></div>");
		            labelChildren.labelTree();

		            cast(label, JQDraggable).draggable({ 
			    		// containment: "#connections", 
			    		revert: function(dropTarget: Dynamic) {
			    			return (dropTarget == null || !cast(dropTarget, JQ).is(".labelDT"));
			    		},
			    		// helper: "clone",
			    		distance: 10,
			    		// grid: [5,5],
			    		scroll: false, 
			    		stop: function(event, ui) {
			    			App.LOGGER.debug("draggable stop");
			    		}
			    	});
		            cast(selfElement, JQDroppable).droppable({
			    		accept: function(d) {
			    			return d.is(".connection") || d.is(".label");
			    		},
						activeClass: "ui-state-hover",
				      	hoverClass: "ui-state-active",
				      	drop: function( event, ui ) {
				      		
				        	
				      	}
			    	});
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