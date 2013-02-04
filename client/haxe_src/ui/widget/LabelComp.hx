package ui.widget;

import ui.jq.JQ;
import ui.model.ModelObj;
import ui.observable.OSet;

typedef LabelCompOptions = {
	var label: Label;
	var children: OSet<Label>;
	@:optional var classes: String;
}

typedef LabelCompWidgetDef = {
	var options: LabelCompOptions;
	var _create: Void->Void;
	var update: Void->Void;
	var destroy: Void->Void;
}

extern class LabelComp extends JQ {
	public static var COLORS: Array<Array<String>>;

	@:overload(function(cmd : String):Bool{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function labelComp(opts: LabelCompOptions): LabelComp;

	private static function _initColors(): Void {
		COLORS = new Array<Array<String>>();
		var reds = new Array<String>();
		reds.push("#D06C72");
		reds.push("#C23D46");
		reds.push("#932F35");
		colors.push(reds);
		
		var blues = new Array<String>();
		blues.push("#3D88C2");
		blues.push("#9AC1DF");
		blues.push("#3D46C2");
		colors.push(blues);

		var greens = new Array<String>();
		greens.push("#72D06C");
		greens.push("#A5D06C");
		greens.push("#35932F");
		colors.push(greens);

		var browns = new Array<String>();
		browns.push("#935A2F");
		browns.push("#D0976C");
		browns.push("#C2773D");
		colors.push(browns);

		var purples = new Array<String>();
		purples.push("#935A2F");
		purples.push("#CA6CD0");
		purples.push("#5A2F93");
		colors.push(purples);
	}

	private static function __init__(): Void {
		untyped LabelComp = window.jQuery;
		// _initColors();
		var defineWidget: Void->LabelCompWidgetDef = function(): LabelCompWidgetDef {
			return {
		        options: {
		            label: null,
		            children: null,
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
		            var labelTail: JQ = new JQ("<div class='labelTail'></div>");
		            labelTail.css("border-right-color", self.options.label.color);
		            label.append(labelTail);
		            var labelBox: JQ = new JQ("<div class='labelBox'></div>");
		            labelBox.css("background", self.options.label.color);
		            var labelBody: JQ = new JQ("<div class='labelBody'></div>");
		            var labelText: JQ = new JQ("<div>" + self.options.label.text + "</div>");
		            labelBody.append(labelText);
		            labelBox.append(labelBody);
		            label.append(labelBox).append("<div class='clear'></div>");

		            selfElement.append(label);

		            var labelChildren: LabelTree = new LabelTree("<div class='labelChildren'></div>");
		            labelChildren.labelTree({
		            		labels: self.options.children
		            	});

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