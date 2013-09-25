package ui.widget;

import m3.jq.JQ;
import m3.widget.Widgets;
import ui.model.ModelObj;
import ui.model.EM;
import m3.observable.OSet;
import m3.exception.Exception;

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

@:native("$")
extern class LabelTreeBranch extends JQ {

	@:overload(function(cmd : String):Bool{})
	@:overload(function(cmd:String, opt:String):Dynamic{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function labelTreeBranch(opts: LabelTreeBranchOptions): LabelTreeBranch;

	private static function __init__(): Void {
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
		        		throw new Exception("Root of LabelTreeBranch must be a div element");
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
		            			EM.change(EMEvent.FitWindow);
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