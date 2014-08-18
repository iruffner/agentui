package ap.widget;

import js.html.Element;

import m3.jq.JQ;
import m3.jq.JQDroppable;
import qoid.model.EM;
import ap.model.ContentSource;
import qoid.model.ModelObj;
import m3.observable.OSet;
import ap.widget.LabelComp;
import m3.exception.Exception;
import m3.widget.Widgets;
import m3.helper.StringHelper;

using ap.widget.ContentComp;

typedef ContentFeedOptions = {
}

typedef ContentFeedWidgetDef = {
	@:optional var options: ContentFeedOptions;
	var _create: Void->Void;
	var destroy: Void->Void;

	@:optional var _onDestroy: Void->Void;
}

@:native("$")
extern class ContentFeed extends JQ {

	@:overload(function(cmd : String):Bool{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function contentFeed(?opts: ContentFeedOptions): ContentFeed;

	private static function __init__(): Void {
		var defineWidget: Void->ContentFeedWidgetDef = function(): ContentFeedWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: ContentFeedWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of ContentFeed must be a div element");
		        	}

		        	selfElement.addClass("_contentFeed " + Widgets.getWidgetClasses()).css("padding", "10px");
		        	var div: JQ = new JQ("<div class='wrapper'></div>").appendTo(selfElement);

		        	var mapListener = function(content: Content<Dynamic>, contentComp:ContentComp, evt: EventType): Void {
	            		if(evt.isAdd()) {
	            			var contentComps = new JQ(".contentComp");
	            			if (contentComps.length == 0) {
		            			contentComp.appendTo( div );
	            			} else {
	            				var comps = new JQ(".contentComp");
	            				var inserted = false;
	            				comps.each(function(i: Int, dom: Element):Dynamic{
	            					var cc = new ContentComp(dom);
	            					var cmp = StringHelper.compare(contentComp.content().getTimestamp(), cc.content().getTimestamp());
	            					if (cmp > 0) {
	            						cc.before(contentComp);
	            						inserted = true;
	            						return false;
	            					} else {
	            						return true;
	            					}
	            				});

	            				if (!inserted) {
	            					comps.last().after(contentComp);
	            				}
	            			}
							EM.change(EMEvent.FitWindow);
	            		} else if (evt.isUpdate()) {
	            			contentComp.update(content);
	            		} else if (evt.isDelete()) {
	            			contentComp.remove();
	            		}
	            	};

	            	var beforeSetContent = function() {
			        	selfElement.find(".contentComp").remove();
	            	};
	            	var widgetCreator = function(content:Content<Dynamic>):ContentComp {
	            		return new ContentComp("<div></div>").contentComp({
	        				content: content
	        			});
	            	}
	            	var id: String = ContentSource.addListener(mapListener, beforeSetContent, widgetCreator);
	            	self._onDestroy = function() {
	            		ContentSource.removeListener(id);
	            	}
		        },
		        
		        destroy: function() {
		        	var self: ContentFeedWidgetDef = Widgets.getSelf();
		        	self._onDestroy();
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.contentFeed", defineWidget());
	}
}