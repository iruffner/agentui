package ui.widget;

import js.html.Element;

import m3.exception.Exception;
import m3.jq.JQ;
import m3.jq.JQDraggable;
import m3.jq.JQDroppable;
import m3.jq.JQTooltip;
import m3.observable.OSet;
import m3.util.JqueryUtil;
import m3.widget.Widgets;

import ui.api.ProtocolMessage;
import ui.model.ModelObj;
import ui.model.Node;
import ui.model.Filter;
import ui.model.EM;
import ui.widget.LabelComp;

using ui.widget.LiveBuildToggle;
using ui.widget.ConnectionAvatar;
using m3.helper.OSetHelper;

typedef FilterCompOptions = {
}

typedef FilterCompWidgetDef = {
	@:optional var options: FilterCompOptions;
	var _create: Void->Void;
	var destroy: Void->Void;
	var fireFilter: Void->Void;
}

class FilterCompHelper {
	public static function fireFilter(f: FilterComp): Void {
		f.filterComp("fireFilter");
	}
}

@:native("$")
extern class FilterComp extends JQ {

	@:overload(function<T>(cmd : String):T{})
	@:overload(function<T>(cmd:String, opt:String, newVal:Dynamic):T{})
	function filterComp(?opts: FilterCompOptions): FilterComp;

	private static function __init__(): Void {
		var defineWidget: Void->FilterCompWidgetDef = function(): FilterCompWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: FilterCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of FilterComp must be a div element");
		        	}

		        	selfElement.addClass("connectionDT labelDT dropCombiner " + Widgets.getWidgetClasses());

		        	var toggle: AndOrToggle = new AndOrToggle("<div class='rootToggle andOrToggle'></div>").andOrToggle();
		        	selfElement.append(toggle);

		        	var liveToggle: LiveBuildToggle = new LiveBuildToggle("<div class='liveBuildToggle'></div>").liveBuildToggle();
		        	selfElement.append(liveToggle);

					cast(selfElement, JQDroppable).droppable({
			    		accept: function(d) {
			    			return d.is(".filterable");
			    		},
						activeClass: "ui-state-hover",
				      	hoverClass: "ui-state-active",
				      	drop: function( event: JQEvent, _ui: UIDroppable ) {

			                var dragstop = function(dragstopEvt: JQEvent, dragstopUi: UIDraggable): Void {
			                	if (!selfElement.intersects(dragstopUi.helper)) {
			                		dragstopUi.helper.remove();
			                		JqueryUtil.deleteEffects(dragstopEvt);
			                		self.fireFilter();
			                	}
			                };

			                if (JQ.cur.children(".connectionAvatar").length == 0) {
				                if (_ui.draggable.hasClass("connectionAvatar")) {
				                	var connection = cast(_ui.draggable, ConnectionAvatar).getConnection();
				                	var set: OSet<IntroductionNotification> = AppContext.INTRODUCTIONS.getElement(Connection.identifier(connection));
				                	if (set.hasValues()) {
				                		var iter = set.iterator();
				                		var introComp = new IntroductionNotificationComp("<div></div>").introductionNotificationComp({
				  		        				notification: iter.next()
				 		        			});

				                		introComp.insertAfter(new JQ("#filter"));
				                		return;
				                	}
				                }
			                }

			                var clone: JQ = _ui.draggable.data("clone")(_ui.draggable, false, false, dragstop);
			                clone.addClass("filterTrashable " + _ui.draggable.data("dropTargetClass"));
			                var cloneOffset: {top: Int, left: Int} = clone.offset();

			                JQ.cur.append(clone);
							clone.css({
			                    "position": "absolute"
			                });

			                if(cloneOffset.top != 0) {
			                	clone.offset(cloneOffset);
		                	} else {
			                	clone.position({
			                    	my: "left top",
			                    	at: "left top",
			                    	of: _ui.helper, //event, // _ui.helper can be smoother, but since we don't always use a helper, sometimes we're trying to position of ourselves
			                    	collision: "flipfit",
			                    	within: "#filter"
	                    		});
			                }

			                // if there is a notification waiting to be displayed on this connection, load it here.
			                // fire off a filterable
			                self.fireFilter();
				      	}
				    });
		        },

		        fireFilter: function(): Void {
		        	var self: FilterCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

					var liveToggle: LiveBuildToggle = cast(selfElement.children(".liveBuildToggle"), LiveBuildToggle);

		        	var root: Node = selfElement.children(".rootToggle").data("getNode")();
		        	root.type = "ROOT";

		        	var filterables: JQ = selfElement.children(".filterable");
		        	filterables.each(function (idx: Int, el: Element): Void {
		        			var filterable: FilterableComponent = new FilterableComponent(el);
		        			var node: Node = filterable.data("getNode")();
		        			root.addNode(node);
		        		});
					
					if(!liveToggle.isLive()) {
						EM.change(EMEvent.FILTER_CHANGE, new Filter(root));
					} else {
		        		EM.change(EMEvent.FILTER_RUN, new Filter(root));
		        	}
	        	},

		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.filterComp", defineWidget());
	}
}