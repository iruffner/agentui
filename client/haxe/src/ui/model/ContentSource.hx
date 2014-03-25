package ui.model;

import m3.observable.OSet;
import ui.model.EM;
import ui.model.ModelObj;
import ui.model.Filter;


class ContentSource<T> {
	var filteredContent: ObservableSet<Content<Dynamic>>;
	var contentMap: MappedSet<Content<Dynamic>, T>;
	var mapListener: Content<Dynamic>->T->EventType->Void;
	var widgetCreator:Content<Dynamic>->T;
	var onBeforeSetContent:OSet<Content<Dynamic>>->Void;

	var handle:String;

	public function new(mapListener:Content<Dynamic>->T->EventType->Void, 
		               onBeforeSetContent:OSet<Content<Dynamic>>->Void,
		               widgetCreator:Content<Dynamic>->T) 
	{
		this.mapListener = mapListener;
		this.onBeforeSetContent = onBeforeSetContent;
		this.widgetCreator = widgetCreator;
		this.handle = null;

    	EM.addListener(EMEvent.AliasLoaded, this.onAliasLoaded, 
    		                                "ContentSource-AliasLoaded"
    	);

    	EM.addListener(EMEvent.LoadFilteredContent, this.onLoadFilteredContent, 
    		                                        "ContentSource-LoadFilteredContent"
    	);

    	EM.addListener(EMEvent.AppendFilteredContent, this.onAppendFilteredContent, 
    		                                        "ContentSource-AppendFilteredContent"
    	);
	}

	private function addContent(results:Array<Dynamic>) {
		for (result in results) {
			var c = AppContext.SERIALIZER.fromJsonX(result, Content);
			this.filteredContent.addOrUpdate(c);
		}
	}

	private function onLoadFilteredContent(data:Dynamic): Void {
		this.handle = data.handle;
		this.filteredContent = new ObservableSet<Content<Dynamic>>(ModelObjWithIid.identifier);
		this.setContent(this.filteredContent);
		this.addContent(data.results);
    }

    private function onAppendFilteredContent(data:Dynamic) {
		this.addContent(data.results);
    }

	private function onAliasLoaded(alias:Alias) {
		this.handle = null;
        setContent(new ObservableSet<Content<Dynamic>>(ModelObjWithIid.identifier));
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