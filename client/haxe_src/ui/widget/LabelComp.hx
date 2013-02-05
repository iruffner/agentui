package ui.widget;

import ui.jq.JQ;
import ui.model.ModelObj;
import ui.observable.OSet;

typedef LabelCompOptions = {
	var label: Label;
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
	@:overload(function(cmd:String, opt:String):Dynamic{})
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
		            classes: null
		        },
		        
		        _create: function(): Void {
		        	var self: LabelCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
					if(!selfElement.is("div")) {
		        		throw new ui.exception.Exception("Root of LabelComp must be a div element");
		        	}

		        	// selfElement.addClass(Widgets.getWidgetClasses());

		        	selfElement.addClass("label filterable");
		        	
		            var labelTail: JQ = new JQ("<div class='labelTail'></div>");
		            labelTail.css("border-right-color", self.options.label.color);
		            selfElement.append(labelTail);
		            var labelBox: JQ = new JQ("<div class='labelBox'></div>");
		            labelBox.css("background", self.options.label.color);
		            var labelBody: JQ = new JQ("<div class='labelBody'></div>");
		            var labelText: JQ = new JQ("<div>" + self.options.label.text + "</div>");
		            labelBody.append(labelText);
		            labelBox.append(labelBody);
		            selfElement.append(labelBox).append("<div class='clear'></div>");

		            var helper: String = "clone";
		            var containment: Dynamic = false;
		            if(selfElement.parent().is(".nohelper")) {
		            	helper = "original";
		            	// containment = "parent";
		            }

		            cast(selfElement, JQDraggable).draggable({ 
			    		containment: containment, 
			    		revert: function(dropTarget: Dynamic) {
			    			var revert: Bool = false;
			    			if(dropTarget == null || (Std.is(dropTarget, Bool) && dropTarget == false) || !dropTarget.is(".labelDT")) {
			    				revert = true;
			    			} else {
			    				JQ.cur.data("dropTarget", dropTarget);
			    			}
			    			return ;
			    		},
			    		helper: helper,
			    		distance: 10,
			    		// grid: [5,5],
			    		scroll: false, 
			    		stop: function(event: js.JQuery.JqEvent, _ui: Dynamic): Void {
			    			var dropTarget: JQ = JQ.cur.data("dropTarget");
			    			JQ.cur.data("dropTarget", null);
			    			if(dropTarget != null && dropTarget.is("#filter") && !JQ.cur.hasClass("cloned")) {
			    				var clone: LabelComp = new LabelComp("<div></div>");
				                clone.appendTo(dropTarget);
				                clone.labelComp({
				                        label: cast(JQ.cur, LabelComp).labelComp("option", "label"),
				                        classes: cast(JQ.cur, LabelComp).labelComp("option", "classes")
				                    })
				                	.css({
				                        "position": "absolute",
				                        "left": _ui.position.left,
				                        "top": _ui.position.top
				                    })
				                    .addClass("cloned filterTrashable");
			    				// dropTarget.append(clone);
			    			}
			    			App.LOGGER.debug("draggable stop");
			    		}
			    	});
		            cast(selfElement, JQDroppable).droppable({
			    		accept: function(d) {
			    			return JQ.cur.parent().is(".dropCombiner") && (d.is(".connection") || d.is(".label"));
			    		},
						activeClass: "ui-state-hover",
				      	hoverClass: "ui-state-active",
				      	drop: function( event, _ui ) {
				      		var filterCombiner: JQ = new JQ("<div class='ui-state-highlight filterCombo' style='padding: 10px;'></div>");
				      		filterCombiner.appendTo(JQ.cur.parent());
				      		JQ.cur.appendTo(filterCombiner);
				      		App.LOGGER.debug("droppable drop");
				        	
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