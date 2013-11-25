package ui.widget;

import m3.jq.JQ;
import m3.widget.Widgets;
import ui.model.Node;
import m3.exception.Exception;

using ui.widget.FilterComp;

typedef LiveBuildToggleOptions = {
}

typedef LiveBuildToggleWidgetDef = {
	@:optional var options: LiveBuildToggleOptions;
	var _create: Void->Void;
	var destroy: Void->Void;
	var isLive: Void->Bool;
	var _fireFilter: Void->Void;
}

class LiveBuildToggleHelper {
	public static function isLive(l: LiveBuildToggle): Bool {
		return cast l.liveBuildToggle("isLive");
	}
}

@:native("$")
extern class LiveBuildToggle extends JQ {
	@:overload(function<T>(cmd : String):T{})
	@:overload(function<T>(cmd : String, arg : Dynamic):T{})
	@:overload(function(cmd : String, opt : String, newVal : Dynamic):JQ{})
	function liveBuildToggle(?opts: LiveBuildToggleOptions): LiveBuildToggle;

	private static function __init__(): Void {
		var defineWidget: Void->LiveBuildToggleWidgetDef = function(): LiveBuildToggleWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: LiveBuildToggleWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of LiveBuildToggle must be a div element");
		        	}

		        	selfElement.addClass("liveBuildToggle");
		        	var build: JQ = new JQ("<div class='ui-widget-content ui-state-active ui-corner-left build'>Build</div>");
		        	var live: JQ = new JQ("<div class='ui-widget-content ui-corner-right live'>Live</div>");
		        	selfElement.append(build).append(live);
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
		        },

		        isLive: function(): Bool {
					var selfElement: JQ = Widgets.getSelfElement();

					return selfElement.children(".live").hasClass("ui-state-active");
	        	},

	        	_fireFilter: function() {
		        	var selfElement: JQ = Widgets.getSelfElement();
		        	var filter: FilterComp = cast(selfElement.closest("#filter"), FilterComp);
	      			filter.fireFilter();
        		},
		        
		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.liveBuildToggle", defineWidget());
	}
}