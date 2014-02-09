package ui.widget;

import js.html.Element;

import m3.jq.JQ;
import m3.jq.JQDroppable;
import ui.model.EM;
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
	@:optional var content: MappedSet<Content<Dynamic>, ContentComp>;
	@:optional var mapListener: Content<Dynamic>->ContentComp->EventType->Void;
	var _create: Void->Void;
	var destroy: Void->Void;
	var _resetContents: String->Void;
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

		        	self.mapListener = function(content: Content<Dynamic>, contentComp: ContentComp, evt: EventType): Void {
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

	            	EM.addListener(EMEvent.AGENT, new EMListener(function(agent: Agent): Void {
	            		self._resetContents(AppContext.currentAlias.iid);
		        		}, "ContentFeed-AGENT")
		        	);

		        	EM.addListener(EMEvent.AliasLoaded, new EMListener(function(alias: Alias): Void {
		        		self._resetContents(alias.iid);
		        		}, "ContentFeed-AliasLoaded")
		        	);
		        },

		        _resetContents: function(aliasIid:String) {
		        	var self: ContentFeedWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if (self.content != null) {
		        		self.content.removeListeners(self.mapListener);
		        	}
		        	selfElement.find(".contentComp").remove();

		        	var content:OSet<Content<Dynamic>>;

		        	// if we are showing content for the uber alias, get all content
		        	if (AppContext.ALIASES.delegate().get(aliasIid).rootLabelIid == AppContext.UBER_LABEL.iid) {
		        		content = AppContext.CONTENT;
		        	} else {
			        	content = AppContext.GROUPED_CONTENT.delegate().get(aliasIid);
			        	if (content == null) {
			        		content = AppContext.GROUPED_CONTENT.addEmptyGroup(aliasIid);
			        	}
			        }
		        	self.content = new MappedSet<Content<Dynamic>, ContentComp>(content, function(content: Content<Dynamic>): ContentComp {
	        			return new ContentComp("<div></div>").contentComp({
	        				content: content
	        			});
	        		});
		        	self.content.mapListen(self.mapListener);
		        },
		        
		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.contentFeed", defineWidget());
	}
}