package ui.widget;

import js.html.Element;

import m3.jq.JQ;
import m3.jq.JQDroppable;
import ui.model.EM;
import ui.model.ContentSource;
import ui.model.ModelObj;
import m3.observable.OSet;
import ui.widget.LabelComp;
import m3.exception.Exception;
import m3.widget.Widgets;
import m3.helper.StringHelper;

using ui.widget.ContentComp;

typedef ContentFeedOptions = {
}

typedef ContentFeedWidgetDef = {
	@:optional var options: ContentFeedOptions;
	@:optional var contentSource:ContentSource;
	var _create: Void->Void;
	var destroy: Void->Void;
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

		        	selfElement.addClass("container " + Widgets.getWidgetClasses()).css("padding", "10px");
		        	selfElement.append("<div id='middleContainerSpacer' class='spacer'></div>");

		        	var mapListener = function(content: Content<Dynamic>, jq: JQ, evt: EventType): Void {
            			var contentComp = new ContentComp(jq);
	            		if(evt.isAdd()) {
	            			var contentComps = new JQ(".contentComp");
	            			if (contentComps.length == 0) {
		            			new JQ("#postInput").after(contentComp);
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
	            	var widgetCreator = function(content:Content<Dynamic>):JQ {
	            		return new ContentComp("<div></div>").contentComp({
	        				content: content
	        			});
	            	}
	            	self.contentSource = new ContentSource(mapListener, beforeSetContent, widgetCreator);
		        },
		        
		        destroy: function() {
		        	var self: ContentFeedWidgetDef = Widgets.getSelf();
		        	self.contentSource.cleanup();
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.contentFeed", defineWidget());
	}
}