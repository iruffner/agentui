package qoid.model;

import m3.observable.OSet;
import qoid.model.EM;
import qoid.model.ModelObj;
import qoid.model.Filter;

using m3.helper.OSetHelper;

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

	private static function addContent(results:Array<Dynamic>, connectionIid:String) {
		var iids = new Array<String>();
		var connectionIids = new Array<String>();

		for (result in results) {
			var c = AppContext.SERIALIZER.fromJsonX(result, Content);
			if (connectionIid != null) {
				c.aliasIid = null;
				c.connectionIid = connectionIid;
			}
			filteredContent.addOrUpdate(c);

			for (v in c.metaData.verifications) {
				var p = AppContext.PROFILES.getElementComplex(v.verifierId, "sharedId");
				if (connectionIids.indexOf(p.connectionIid) == -1) {
					connectionIids.push(p.connectionIid);
				}

				iids.push("'" + v.verificationIid + "'");
			}
		}

		AgentUi.PROTOCOL.getVerificationContent(connectionIids, iids);
	}

	private static function onLoadFilteredContent(data:Dynamic): Void {
		if (handle == data.handle) {
			addContent(data.results, data.connectionIid);
		} else {
			clearQuery();
			handle = data.handle;
			beforeSetContent();
			addContent(data.results, data.connectionIid);
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
		addContent(data.results, data.connectionIid);
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