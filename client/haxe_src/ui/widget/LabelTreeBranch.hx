package ui.widget;

import ui.jq.JQ;
import ui.model.ModelObj;
import ui.model.EventModel;
import ui.model.ModelEvents;
import ui.observable.OSet;

typedef LabelTreeBranchOptions = {
	var label: Label;
	var children: OSet<Label>;
	@:optional var classes: String;
}

typedef LabelTreeBranchWidgetDef = {
	var options: LabelTreeBranchOptions;
	var _create: Void->Void;
	var update: Void->Void;
	var destroy: Void->Void;
}

extern class LabelTreeBranch extends JQ {

	@:overload(function(cmd : String):Bool{})
	@:overload(function(cmd:String, opt:String):Dynamic{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function labelTreeBranch(opts: LabelTreeBranchOptions): LabelTreeBranch;

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
		untyped LabelTreeBranch = window.jQuery;
		// _initColors();
		var defineWidget: Void->LabelTreeBranchWidgetDef = function(): LabelTreeBranchWidgetDef {
			return {
		        options: {
		            label: null,
		            children: null,
		            classes: null
		        },
		        
		        _create: function(): Void {
		        	var self: LabelTreeBranchWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
					if(!selfElement.is("div")) {
		        		throw new ui.exception.Exception("Root of LabelTreeBranch must be a div element");
		        	}

		        	selfElement.addClass("labelTreeBranch ");

		        	var expander: JQ = new JQ("<div class='labelTreeExpander' style='visibility:hidden;'>+</div>");
		        	selfElement.append(expander);
		        	
		        	var label: LabelComp = new LabelComp("<div></div>").labelComp({
		        			label: self.options.label,
		        			isDragByHelper: true,
		        			containment: false
		        		});

		            selfElement.append(label);

		            selfElement.hover(function(): Void {
		            		if(self.options.children.iterator().hasNext()) {
		            			expander.css("visibility", "visible");
		            		}
		            	}, function(): Void {
		            		expander.css("visibility", "hidden");
		            	}
	            	);


		            if(self.options.children != null) {
			            var labelChildren: LabelTree = new LabelTree("<div class='labelChildren' style='display: none;'></div>");
			            labelChildren.labelTree({
			            		labels: self.options.children
			            	});
			            selfElement.append(labelChildren);
		            	label.add(expander).click(function(evt: js.JQuery.JqEvent): Void {
		            			labelChildren.toggle();
		            			EventModel.change(ModelEvents.FitWindow);
		            		}
	            		);
			        }
		        },

		        update: function(): Void {
		        	var self: LabelTreeBranchWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

		        	selfElement.find(".labelBody").text(self.options.label.text);
	        	},
		        
		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.labelTreeBranch", defineWidget());
	}	
}