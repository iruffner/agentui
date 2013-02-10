package ui.widget;

import js.JQuery;
import ui.jq.JQ;
import ui.jq.JQDroppable;
import ui.jq.JQDraggable;
import ui.model.ModelObj;
import ui.observable.OSet;
import ui.widget.FilterableComp;

using StringTools;

typedef LabelCompOptions  = { 
	>FilterableCompOptions,
	var label: Label;
}

typedef LabelCompWidgetDef = {
	var options: LabelCompOptions;
	var _create: Void->Void;
	@:optional var _super: Void->Void;
	var update: Void->Void;
	var destroy: Void->Void;
}

extern class LabelComp extends FilterableComp {
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
		            isDragByHelper: true,
		            containment: false,
		            dndEnabled: true,
		            classes: null,
		            dropTargetClass: "labelDT",
		            cloneFcn: function(filterableComp: FilterableComp, ?isDragByHelper: Bool = false, ?containment: Dynamic = false): LabelComp {
		            			var labelComp: LabelComp = cast(filterableComp, LabelComp);
				            	if(labelComp.hasClass("clone")) return labelComp;
				            	var clone: LabelComp = new LabelComp("<div class='clone'></div>");
				            	clone.labelComp({
				                        label: labelComp.labelComp("option", "label"),
				                        isDragByHelper: isDragByHelper,
				                        containment: containment,
				                        classes: labelComp.labelComp("option", "classes"),
				                        cloneFcn: labelComp.labelComp("option", "cloneFcn"),
				                        dropTargetClass: labelComp.labelComp("option", "dropTargetClass")
				                    });
				            	return clone;
		            		}
		        },
		        
		        _create: function(): Void {
		        	var self: LabelCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
					if(!selfElement.is("div")) {
		        		throw new ui.exception.Exception("Root of LabelComp must be a div element");
		        	}

		        	// selfElement.addClass(Widgets.getWidgetClasses());

		        	selfElement.addClass("label").attr("id", self.options.label.text.htmlEscape() + "_" + ui.util.UidGenerator.create(8));
		        	
		            var labelTail: JQ = new JQ("<div class='labelTail'></div>");
		            labelTail.css("border-right-color", self.options.label.color);
		            selfElement.append(labelTail);
		            var labelBox: JQ = new JQ("<div class='labelBox shadowRight'></div>");
		            labelBox.css("background", self.options.label.color);
		            var labelBody: JQ = new JQ("<div class='labelBody'></div>");
		            var labelText: JQ = new JQ("<div>" + self.options.label.text + "</div>");
		            labelBody.append(labelText);
		            labelBox.append(labelBody);
		            selfElement.append(labelBox).append("<div class='clear'></div>");

		            self._super();

		   //          if(self.options.dndEnabled) {
		   //          	//clone function
			  //           selfElement.data(
			  //           	"clone", 
			  //           	function(labelComp: LabelComp, ?isDragByHelper: Bool = false, ?containment: Dynamic = false): LabelComp {
				 //            	if(labelComp.hasClass("clone")) return labelComp;
				 //            	var clone: LabelComp = new LabelComp("<div class='clone'></div>");
				 //            	clone.labelComp({
				 //                        label: labelComp.labelComp("option", "label"),
				 //                        isDragByHelper: isDragByHelper,
				 //                        containment: containment,
				 //                        classes: labelComp.labelComp("option", "classes")
				 //                    });
				 //            	return clone;
		   //          		}
		   //          	);
		   //          	selfElement.data("dropTargetClass", "labelDT");

			  //           var helper: String = "clone";
			  //           if(!self.options.isDragByHelper) {
			  //           	helper = "original";
			  //           }

			  //           cast(selfElement, JQDraggable).draggable({ 
				 //    		containment: self.options.containment, 
				 //    		helper: helper,
				 //    		distance: 10,
				 //    		// grid: [5,5],
				 //    		scroll: false
				 //    	});

			  //           cast(selfElement, JQDroppable).droppable({
				 //    		accept: function(d) {
				 //    			return JQ.cur.parent().is(".dropCombiner") && d.is(".filterable");
				 //    		},
					// 		activeClass: "ui-state-hover",
					//       	hoverClass: "ui-state-active",
					//       	greedy: true,
					//       	drop: function( event: JqEvent, _ui: UIDroppable ) {
					//       		var filterCombiner: FilterCombination = new FilterCombination("<div></div>");
					//       		filterCombiner.appendTo(JQ.cur.parent());
					//       		filterCombiner.filterCombination({
					//       			event: event	
				 //      			});
				 //      			filterCombiner.filterCombination("addFilterable", JQ.cur);

					//       		JQ.cur
					//       			.appendTo(filterCombiner)
					//       			.css("position", "relative")
					//       			.css({left: "", top: ""})
					//       			;
				 //      			var clone: JQ = _ui.draggable.data("clone")(_ui.draggable,false,"#filter");
				 //                clone.addClass("filterTrashable " + _ui.draggable.data("dropTargetClass"))
				 //      				.appendTo(filterCombiner)
					//       			.css("position", "relative")
					//       			.css({left: "", top: ""});

				 //      			filterCombiner.filterCombination("addFilterable", clone);

				 //      			filterCombiner.filterCombination("position");
					//       	},
					//       	tolerance: "pointer"
				 //    	});
					// }
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
		JQ.widget( "ui.labelComp", JQ.ui.filterableComp, defineWidget());
	}	
}