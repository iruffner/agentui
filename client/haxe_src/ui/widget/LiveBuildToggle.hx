package ui.widget;

import ui.jq.JQ;
import js.JQuery;
import ui.model.Node;

typedef LiveBuildToggleOptions = {
}

typedef LiveBuildToggleWidgetDef = {
	@:optional var options: LiveBuildToggleOptions;
	var _create: Void->Void;
	var destroy: Void->Void;
	var isLive: Void->Bool;
	var _fireFilter: Void->Void;
}

extern class LiveBuildToggle extends JQ {
	@:overload(function(cmd : String):Bool{})
	@:overload(function(cmd : String, arg : Dynamic):Void{})
	@:overload(function(cmd : String, opt : String, newVal : Dynamic):JQ{})
	function liveBuildToggle(?opts: LiveBuildToggleOptions): LiveBuildToggle;

	private static function __init__(): Void {
		untyped LiveBuildToggle = window.jQuery;
		var defineWidget: Void->LiveBuildToggleWidgetDef = function(): LiveBuildToggleWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: LiveBuildToggleWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

		        	if(!selfElement.is("div")) {
		        		throw new ui.exception.Exception("Root of LiveBuildToggle must be a div element");
		        	}

		        	selfElement.addClass("liveBuildToggle");
		        	var build: JQ = new JQ("<div class='ui-widget-content ui-state-active ui-corner-left build'>Build</div>");
		        	var live: JQ = new JQ("<div class='ui-widget-content ui-corner-right live'>Live</div>");
		        	selfElement.append(build).append(live);
		        	var children: JQ = selfElement.children();
		        	children
		        		.hover(
			        		function(evt: JqEvent): Void {
			        			JQ.cur.addClass("ui-state-hover");
		        			},
			        		function(evt: JqEvent): Void {
			        			JQ.cur.removeClass("ui-state-hover");
			        		}
		        		)
		        		.click(
		        			function(evt: JqEvent): Void {
		        				children.toggleClass("ui-state-active");
		        				self._fireFilter();
		        			}
	        			);
		        },

		        isLive: function(): Bool {
					var selfElement: JQ = Widgets.getSelfElement();

					return selfElement.children(".live").hasClass("ui-state-active");
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
		JQ.widget( "ui.liveBuildToggle", defineWidget());
	}
}