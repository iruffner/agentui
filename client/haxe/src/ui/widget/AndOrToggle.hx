package ui.widget;

import m3.jq.JQ;
import m3.widget.Widgets;
import m3.exception.Exception;
import ui.model.Node;

typedef AndOrToggleOptions = {
}

typedef AndOrToggleWidgetDef = {
	@:optional var options: AndOrToggleOptions;
	var _create: Void->Void;
	var destroy: Void->Void;
	var _fireFilter: Void->Void;
}

@:native("$")
extern class AndOrToggle extends JQ {
	@:overload(function(cmd : String):Bool{})
	@:overload(function(cmd : String, arg: Dynamic):Void{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function andOrToggle(?opts: AndOrToggleOptions): AndOrToggle;

	private static function __init__(): Void {
		var defineWidget: Void->AndOrToggleWidgetDef = function(): AndOrToggleWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: AndOrToggleWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of AndOrToggle must be a div element");
		        	}

		        	

		        	selfElement.addClass("andOrToggle");
		        	var or: JQ = new JQ("<div class='ui-widget-content ui-state-active ui-corner-top any'>Any</div>");
		        	var and: JQ = new JQ("<div class='ui-widget-content ui-corner-bottom all'>All</div>");
		        	selfElement.append(or).append(and);
		        	var children: JQ = selfElement.children();
		        	children
		        		.hover(
			        		function(evt: JQEvent): Void {
			        			JQ.cur.addClass("ui-state-hover");
		        			},
			        		function(evt: JQEvent): Void {
			        			JQ.cur.removeClass("ui-state-hover");
			        		}
		        		)
		        		.click(
		        			function(evt: JQEvent): Void {
		        				children.toggleClass("ui-state-active");
		        				self._fireFilter();
		        			}
	        			);

        			selfElement.data("getNode", function(): Node {
		            		var root: Node;
		            		if(or.hasClass("ui-state-active")) {
		            			root = new Or();
		            		} else {
		            			root = new And();
		            		}
		            		return root;
		            	});
		        },

	        	_fireFilter: function() {
		        	var selfElement: JQ = Widgets.getSelfElement();
		        	var filter: FilterComp = cast(selfElement.closest("#filter"), FilterComp);
	      			filter.filterComp("fireFilter");
        		},
		        
		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.andOrToggle", defineWidget());
	}
}