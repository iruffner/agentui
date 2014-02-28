package ui.model;

import m3.observable.OSet;
import ui.model.EM;
import ui.model.ModelObj;


class ContentSource<T> {
	var filteredContent: ObservableSet<Content<Dynamic>>;
	var contentMap: MappedSet<Content<Dynamic>, T>;
	var mapListener: Content<Dynamic>->T->EventType->Void;
	var widgetCreator:Content<Dynamic>->T;
	var showingFilteredContent:Bool;
	var onBeforeSetContent:OSet<Content<Dynamic>>->Void;

	public function new(mapListener:Content<Dynamic>->T->EventType->Void, 
		               onBeforeSetContent:OSet<Content<Dynamic>>->Void,
		               widgetCreator:Content<Dynamic>->T) 
	{
		this.mapListener = mapListener;
		this.onBeforeSetContent = onBeforeSetContent;
		this.widgetCreator = widgetCreator;
		this.showingFilteredContent = false;

    	EM.addListener(EMEvent.AliasLoaded, new EMListener(this.onAliasLoaded, 
    		                                               "ContentSource-AliasLoaded")
    	);

    	EM.addListener(EMEvent.LoadFilteredContent, new EMListener(onLoadFilteredContent, 
    		                                             "ContentSource-LoadFilteredContent")
    	);

	}

	private function onLoadFilteredContent(content: ObservableSet<Content<Dynamic>>): Void {
		if (this.showingFilteredContent) {
			this.filteredContent.addAll(content.asArray());
    	} else {
    		this.showingFilteredContent = true;
    		this.filteredContent = content;
    		this.setContent(content);
    	}
    }

	private function onAliasLoaded(alias:Alias) {
		this.showingFilteredContent = false;

    	var content:OSet<Content<Dynamic>>;

    	// if we are showing content for the uber alias, get all content
    	if (AppContext.ALIASES.delegate().get(alias.iid).rootLabelIid == AppContext.getUberLabelIid()) {
    		content = AppContext.CONTENT;
    	} else {
        	content = AppContext.GROUPED_CONTENT.delegate().get(alias.iid);
        	if (content == null) {
        		content = AppContext.GROUPED_CONTENT.addEmptyGroup(alias.iid);
        	}
        }
        setContent(content);
	}

	private function setContent(content:OSet<Content<Dynamic>>) {
		this.onBeforeSetContent(content);
		this.cleanup();

    	this.contentMap = new MappedSet<Content<Dynamic>, T>(content, function(content: Content<Dynamic>): T {
			return widgetCreator(content);
		});
    	this.contentMap.mapListen(this.mapListener);
    }

    public function cleanup() {
    	if (this.contentMap != null) {
    		this.contentMap.removeListeners(this.mapListener);
    	}    	
    }
}