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
	@:optional var content: OSet<Content<Dynamic>>;
	@:optional var filteredContent: ObservableSet<Content<Dynamic>>;
	@:optional var contentMap: MappedSet<Content<Dynamic>, JQ>;
	@:optional var mapListener: Content<Dynamic>->JQ->EventType->Void;
	@:optional var showingFilteredContent:Bool;
	var _create: Void->Void;
	var destroy: Void->Void;
	var _resetContents: String->Void;
	var _setContent: OSet<Content<Dynamic>>->Void;
	var _addToFilteredContent: ObservableSet<Content<Dynamic>>->Void;
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
		        	self.showingFilteredContent = false;

		        	selfElement.addClass("container " + Widgets.getWidgetClasses()).css("padding", "10px");
		        	selfElement.append("<div id='middleContainerSpacer' class='spacer'></div>");

		        	self.mapListener = function(content: Content<Dynamic>, jq: JQ, evt: EventType): Void {
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


		        	EM.addListener(EMEvent.AliasLoaded, new EMListener(function(alias: Alias): Void {
		        		self.showingFilteredContent = false;
		        		self._resetContents(alias.iid);
		        		}, "ContentFeed-AliasLoaded")
		        	);

		        	EM.addListener(EMEvent.LoadFilteredContent, new EMListener(function(content: ObservableSet<Content<Dynamic>>): Void {
						if (self.showingFilteredContent) {
			        		self._addToFilteredContent(content);
			        	} else {
			        		self.showingFilteredContent = true;
			        		self.filteredContent = content;
			        		self._setContent(content);
			        	}
		        		}, "ContentFeed-LoadFilteredContent")
		        	);
		        },

		        _resetContents: function(aliasIid:String) {
		        	var self: ContentFeedWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

		        	var content:OSet<Content<Dynamic>>;

		        	// if we are showing content for the uber alias, get all content
		        	if (AppContext.ALIASES.delegate().get(aliasIid).rootLabelIid == AppContext.getUberLabelIid()) {
		        		content = AppContext.CONTENT;
		        	} else {
			        	content = AppContext.GROUPED_CONTENT.delegate().get(aliasIid);
			        	if (content == null) {
			        		content = AppContext.GROUPED_CONTENT.addEmptyGroup(aliasIid);
			        	}
			        }
			        self._setContent(content);
		        },

		        _addToFilteredContent: function(content:ObservableSet<Content<Dynamic>>) {
		        	var self: ContentFeedWidgetDef = Widgets.getSelf();
		        	self.filteredContent.addAll(content.asArray());
		        },

		        _setContent: function(content:OSet<Content<Dynamic>>) {
		        	var self: ContentFeedWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if (self.contentMap != null) {
		        		self.contentMap.removeListeners(self.mapListener);
		        	}
		        	selfElement.find(".contentComp").remove();

		        	self.content = content;
		        	self.contentMap = new MappedSet<Content<Dynamic>, JQ>(self.content, function(content: Content<Dynamic>): ContentComp {
	        			return new ContentComp("<div></div>").contentComp({
	        				content: content
	        			});
	        		});
		        	self.contentMap.mapListen(self.mapListener);
		        },
		        
		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.contentFeed", defineWidget());
	}
}