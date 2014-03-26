package ui.model;

import m3.observable.OSet;
import ui.model.EM;
import ui.model.ModelObj;
import ui.model.Filter;

class ContentSourceListener<T> {
	var contentMap: MappedSet<Content<Dynamic>, T>;
	var mapListener: Content<Dynamic>->T->EventType->Void;
	var widgetCreator:Content<Dynamic>->T;
	public var onBeforeSetContent:Void->Void;

	public function new(mapListener:Content<Dynamic>->T->EventType->Void, 
		               onBeforeSetContent:Void->Void,
		               widgetCreator:Content<Dynamic>->T,
		               content:OSet<Content<Dynamic>>) 
	{
		this.mapListener = mapListener;
		this.onBeforeSetContent = onBeforeSetContent;
		this.widgetCreator = widgetCreator;
    	this.contentMap = new MappedSet<Content<Dynamic>, T>(content, function(content: Content<Dynamic>): T {
			return widgetCreator(content);
		});
    	this.contentMap.mapListen(this.mapListener);
	}
}

class ContentSource {
	private static var filteredContent: ObservableSet<Content<Dynamic>>;
	private static var handle:String;
	private static var listeners: Array<ContentSourceListener<Dynamic>>;

	public static function __init__() 
	{
		filteredContent = new ObservableSet<Content<Dynamic>>(ModelObjWithIid.identifier);
		listeners = new Array<ContentSourceListener<Dynamic>>();

    	EM.addListener(EMEvent.AliasLoaded, onAliasLoaded, 
    		                                "ContentSource-AliasLoaded"
    	);

    	EM.addListener(EMEvent.LoadFilteredContent, onLoadFilteredContent, 
    		                                        "ContentSource-LoadFilteredContent"
    	);

    	EM.addListener(EMEvent.AppendFilteredContent, onAppendFilteredContent, 
    		                                        "ContentSource-AppendFilteredContent"
    	);
	}

	public static function addListener<T>(ml: Content<Dynamic>->T->EventType->Void,
								          obsc : Void->Void, wc : Content<Dynamic>->T) {
		var l = new ContentSourceListener<T>(ml, obsc, wc, filteredContent);
		listeners.push(l);
	}

	private static function addContent(results:Array<Dynamic>) {
		for (result in results) {
			var c = AppContext.SERIALIZER.fromJsonX(result, Content);
			filteredContent.addOrUpdate(c);
		}
	}

	private static function onLoadFilteredContent(data:Dynamic): Void {
		if (handle == data.handle) {
			addContent(data.results);
		} else {
			clearQuery();
			handle = data.handle;
			beforeSetContent();
			addContent(data.results);
		}
    }

    public static function clearQuery() {
		if (handle != null) {
			AgentUi.PROTOCOL.deregisterSqueries([handle]);
			filteredContent.clear();
			handle = null;
		}
    }

    private static function onAppendFilteredContent(data:Dynamic) {
		addContent(data.results);
    }

	private static function onAliasLoaded(alias:Alias) {
		clearQuery();
	}

	private static function beforeSetContent() {
		for (l in listeners) {
			l.onBeforeSetContent();
		}
    }
}