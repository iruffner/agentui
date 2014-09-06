package agentui.widget;

import m3.jq.JQ;
import m3.widget.Widgets;
import agentui.model.ModelObj;
import agentui.model.EM;
import m3.observable.OSet;
import m3.exception.Exception;

import agentui.widget.LabelComp;
using agentui.widget.LabelComp;
using agentui.widget.LabelsList;
using m3.helper.OSetHelper;

typedef LabelTreeBranchOptions = {
	var parentIid: String;
	var labelIid: String;
	var labelPath:Array<String>;
}

typedef LabelTreeBranchWidgetDef = {
	var options: LabelTreeBranchOptions;
	@:optional var children: OSet<LabelChild>;
	var _create: Void->Void;
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
		        	parentIid: null,
		        	labelIid: null,
		        	labelPath: []
		        },
		        
		        _create: function(): Void {
		        	var self: LabelTreeBranchWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
					if(!selfElement.is("div")) {
		        		throw new Exception("Root of LabelTreeBranch must be a div element");
		        	}

		        	selfElement.addClass("labelTreeBranch ");

		        	var expander: JQ = new JQ("<div class='labelTreeExpander' style='visibility:hidden;'><b>+</b></div>");
		        	selfElement.append(expander);
		        	
		        	var label: LabelComp = new LabelComp("<div></div>").labelComp({
		        			parentIid: self.options.parentIid,
		        			labelIid: self.options.labelIid,
		        			labelPath: self.options.labelPath,
		        			isDragByHelper: true,
		        			containment: false,
		        			dragstop: null
		        		});

		            selfElement.append(label);

		            selfElement.hover(
		            	function(): Void {
		            		if (self.children.hasValues()) {
		            			expander.css("visibility", "visible");
		            		}
		            	}, 
		            	function(): Void {
		            		expander.css("visibility", "hidden");
		            	}
	            	);

		            // Create the children
		            if (AppContext.GROUPED_LABELCHILDREN.delegate().get(self.options.labelIid) == null) {
	        			AppContext.GROUPED_LABELCHILDREN.addEmptyGroup(self.options.labelIid);
    				}

		            self.children = AppContext.GROUPED_LABELCHILDREN.delegate().get(self.options.labelIid);

		            var labelChildren: LabelTree = new LabelTree("<div class='labelChildren' style='display: none;'></div>");
		            labelChildren.labelTree({
		            	parentIid: self.options.labelIid,
		            	labelPath: self.options.labelPath
	            	});

		            // Listen to changes to the model.  If 
		            self.children.listen(function(lc:LabelChild, evt:EventType):Void {
		            	if (evt.isAdd()) {
		            		var ll = new LabelsList("#labelsList");
		            		var sel = ll.labelsList("getSelected");
		            		if (sel != null && sel.labelComp("getLabel").iid == lc.parentIid) {
		            			if (self.children.hasValues()) {
		            				labelChildren.show();
		            				labelChildren.addClass("labelTreeFullWidth");
	            				}
		            		}
		            	}
		            });

		            selfElement.append(labelChildren);
	            	label.add(expander).click(function(evt: JQEvent): Void {
	            			if(self.children.hasValues()) {
	            				labelChildren.toggle();
	            				labelChildren.toggleClass("labelTreeFullWidth");
            				} else {
            					labelChildren.hide();
            				}
            				if (labelChildren.css('display') == 'none') {
            					expander.html("<b>+</b>");
            				} else {
            					expander.html("<b>-</b>");
            				}
	            			EM.change(EMEvent.FitWindow);
	            		}
            		);
		        },
		        
		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.labelTreeBranch", defineWidget());
	}	
}