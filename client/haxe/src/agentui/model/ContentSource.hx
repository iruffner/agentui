package agentui.model;

import agentui.model.EM;
import agentui.model.Filter;
import m3.log.Logga;
import m3.observable.OSet;
import m3.serialization.Serialization;
import m3.util.UidGenerator;
import qoid.Qoid;
import qoid.QE;
import qoid.QoidAPI.RequestContext;
import qoid.ResponseProcessor.Response;
import qoid.model.ModelObj;

using m3.helper.OSetHelper;
using m3.helper.ArrayHelper;

class ContentSourceListener<T> {
	var contentMap: MappedSet<Content<Dynamic>, T>;
	var mapListener: Content<Dynamic>->T->EventType->Void;
	var widgetCreator:Content<Dynamic>->T;
	public var onBeforeSetContent:Void->Void;
	public var id: String;

	public function new(mapListener:Content<Dynamic>->T->EventType->Void, 
		               onBeforeSetContent:Void->Void,
		               widgetCreator:Content<Dynamic>->T,
		               content:OSet<Content<Dynamic>>) {
		this.mapListener = mapListener;
		this.onBeforeSetContent = onBeforeSetContent;
		this.widgetCreator = widgetCreator;
    	this.contentMap = new MappedSet<Content<Dynamic>, T>(content, function(content: Content<Dynamic>): T {
			return widgetCreator(content);
		});
    	this.contentMap.mapListen(this.mapListener);
    	this.id = UidGenerator.create(20);
	}

	public function destroy() {
		this.contentMap.removeListeners(this.mapListener);
 	}
}

class ContentSource {
	private static var filteredContent: ObservableSet<Content<Dynamic>>;
	private static var context: RequestContext;
	private static var listeners: Array<ContentSourceListener<Dynamic>>;

	public static function __init__() {
		filteredContent = new ObservableSet<Content<Dynamic>>(ModelObjWithIid.identifier);
		listeners = new Array<ContentSourceListener<Dynamic>>();

    	EM.addListener(QE.onAliasLoaded, onAliasLoaded, 
    		                                "ContentSource-AliasLoaded"
    	);

    	EM.addListener(EMEvent.OnFilteredContent, onLoadFilteredContent, 
    		                                        "ContentSource-OnFilteredContent"
     	);
	}

	public static function addListener<T>(ml: Content<Dynamic>->T->EventType->Void,
								          obsc : Void->Void, wc : Content<Dynamic>->T): String {
		var l = new ContentSourceListener<T>(ml, obsc, wc, filteredContent);
		listeners.push(l);
		return l.id;
	}

	public static function removeListener<T>(id: String) {
		var i: Int = listeners.indexOfComplex(id, "id");
		if(i > -1) {
			listeners[i].destroy();
			listeners.splice(i, 1);
		}
	}

	private static function addContent(results:Array<Dynamic>, connectionIid:String) {
		var iids = new Array<String>();
		var connectionIids = new Array<String>();

		if(results.hasValues()) {
			for (result in results) {
				var c = Serializer.instance.fromJsonX(result, Content);
				if(c != null) { //occurs when there is an unknown content type
					if (connectionIid != null) {
						// c.aliasIid = null;
						c.connectionIid = connectionIid;
					}
					filteredContent.addOrUpdate(c);

					for (v in c.metaData.verifications) {
						var p = Qoid.profiles.getElementComplex(v.verifierId, "sharedId");
						if (connectionIids.indexOf(p.connectionIid) == -1) {
							connectionIids.push(p.connectionIid);
						}

						iids.push("'" + v.verificationIid + "'");
					}
				}
			}
		}

		qoid.QoidAPI.getVerificationContent(connectionIids, iids);
	}

	private static function onLoadFilteredContent(data: Response): Void {
		if (data.result.standing || (context != null && context.handle == data.context.handle)) {
			addContent(data.result.results, data.result.route[0]);
		} else {
			clearQuery();
			context = {
				if(Std.is(data.context, String)) {
					Serializer.instance.fromJsonX(haxe.Json.parse(cast data.context), RequestContext);
				} else {
					Serializer.instance.fromJsonX(data.context, RequestContext);
				}
			};
			beforeSetContent();
			addContent(data.result.results, data.result.route[0]);
		}
    }

    public static function clearQuery() {
		if (context != null) {
			Logga.DEFAULT.warn("deregisterSqueries");
			qoid.QoidAPI.cancelQuery(new RequestContext(context.context, context.handle));
			filteredContent.clear();
			context = null;
		}
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