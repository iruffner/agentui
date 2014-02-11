package ui;

import haxe.ds.StringMap;

import m3.jq.JQ;
import m3.log.Logga;
import m3.log.LogLevel;
import m3.observable.OSet;
import m3.serialization.Serialization;

import ui.api.ProtocolMessage;
import ui.model.EM;
import ui.model.ModelObj;

using m3.helper.ArrayHelper;
using m3.helper.OSetHelper;

class AppContext {
	public static var DEMO: Bool = false;
    public static var SUBMIT_CHANNEL:String;
    public static var MODEL_CHANNEL:String;
    public static var NOTIFICATION_CHANNEL:String;

    public static var LOGGER: Logga;
    public static var AGENT: Agent;
    public static var UBER_LABEL: Label;
    public static var MASTER_ALIASES:ObservableSet<Alias>;
    public static var ALIASES:OSet<Alias>;
    public static var TARGET: Connection;
    public static var SERIALIZER: Serializer;

    public static var NOTIFICATIONS:OSet<Notification<Dynamic>>;
    public static var MASTER_NOTIFICATIONS: ObservableSet<Notification<Dynamic>>;

    public static var INTRODUCTIONS: ObservableSet<Introduction>;

    public static var CONNECTIONS:OSet<Connection>;
    public static var MASTER_CONNECTIONS: ObservableSet<Connection>;

    public static var CONTENT: OSet<Content<Dynamic>>;
    public static var MASTER_CONTENT: ObservableSet<Content<Dynamic>>;
    public static var GROUPED_CONTENT: GroupedSet<Content<Dynamic>>;

    public static var LABELS:OSet<Label>;
    public static var MASTER_LABELS:ObservableSet<Label>;
    
    public static var LABELCHILDREN:OSet<LabelChild>;
    public static var MASTER_LABELCHILDREN:ObservableSet<LabelChild>;
    public static var GROUPED_LABELCHILDREN: GroupedSet<LabelChild>;

    public static var LABELEDCONTENT:OSet<LabeledContent>;
    public static var MASTER_LABELEDCONTENT:ObservableSet<LabeledContent>;
    public static var GROUPED_LABELEDCONTENT: GroupedSet<LabeledContent>;

    public static var currentAlias: Alias;

    public static function init() {
        AGENT = null;
        
    	LOGGER = new Logga(LogLevel.DEBUG);

        INTRODUCTIONS = new ObservableSet<Introduction>(ModelObjWithIid.identifier);

        MASTER_NOTIFICATIONS = new ObservableSet<Notification<Dynamic>>(ModelObjWithIid.identifier);
        NOTIFICATIONS = new FilteredSet<Notification<Dynamic>>(MASTER_NOTIFICATIONS, function(a:Notification<Dynamic>):Bool {
            return !a.deleted && !a.consumed;
        });

        MASTER_ALIASES = new ObservableSet<Alias>(ModelObjWithIid.identifier);
        ALIASES = new FilteredSet<Alias>(MASTER_ALIASES, function(a:Alias):Bool {
            return !a.deleted;
        });

        MASTER_CONTENT = new ObservableSet<Content<Dynamic>>(ModelObjWithIid.identifier);
        CONTENT = new FilteredSet<Content<Dynamic>>(MASTER_CONTENT, function(c:Content<Dynamic>):Bool {
            return !c.deleted;
        });
        GROUPED_CONTENT = new GroupedSet<Content<Dynamic>>(CONTENT, function(c:Content<Dynamic>):String{
            return c.aliasIid;
        });

        MASTER_LABELS = new ObservableSet<Label>(Label.identifier);
        LABELS = new FilteredSet<Label>(MASTER_LABELS, function(c:Label):Bool {
            return !c.deleted;
        });

        MASTER_CONNECTIONS = new ObservableSet<Connection>(Connection.identifier);
        CONNECTIONS = new FilteredSet<Connection>(MASTER_CONNECTIONS, function(c:Connection):Bool {
            return !c.deleted;
        });

        MASTER_LABELCHILDREN = new ObservableSet<LabelChild>(LabelChild.identifier);
        LABELCHILDREN = new FilteredSet<LabelChild>(MASTER_LABELCHILDREN, function(c:LabelChild):Bool {
            return !c.deleted;
        });
        GROUPED_LABELCHILDREN = new GroupedSet<LabelChild>(LABELCHILDREN, function(lc:LabelChild):String {
            return lc.parentIid;
        });

        MASTER_LABELEDCONTENT = new ObservableSet<LabeledContent>(LabeledContent.identifier);
        LABELEDCONTENT = new FilteredSet<LabeledContent>(MASTER_LABELEDCONTENT, function(c:LabeledContent):Bool {
            return !c.deleted;
        });
        GROUPED_LABELEDCONTENT = new GroupedSet<LabeledContent>(LABELEDCONTENT, function(lc:LabeledContent):String {
            return lc.contentIid;
        });
        
		SERIALIZER = new Serializer();
        SERIALIZER.addHandler(Content, new ContentHandler());

    	registerGlobalListeners();
    }

	static function registerGlobalListeners() {
        new JQ(js.Browser.window).on("unload", function(evt: JQEvent){
                EM.change(EMEvent.PAGE_CLOSE);
            });
		var fitWindowListener = new EMListener(function(n: Nothing) {
                untyped __js__("fitWindow()");
            }, "FitWindowListener");

        var fireFitWindow = new EMListener(function(n: Nothing) {
                EM.change(EMEvent.FitWindow);
            }, "FireFitWindowListener");

        var processContent = new EMListener(function(arrOfContent: Array<Content<Dynamic>>): Void {
                if(arrOfContent.hasValues()) {
                    AppContext.MASTER_CONTENT.addAll(arrOfContent);
                }
                EM.change(EMEvent.FitWindow);            
            }, "ContentProcessor");

        EM.addListener(EMEvent.MoreContent, processContent);
        EM.addListener(EMEvent.EndOfContent, processContent);
        EM.addListener(EMEvent.FILTER_RUN, new EMListener(function(n: Nothing): Void {
                AppContext.MASTER_CONTENT.clear();
                EM.change(EMEvent.FitWindow);
            })
        );

        EM.addListener(EMEvent.AGENT, new EMListener(function(agent: Agent) {
                AGENT = agent;
                EM.change(EMEvent.AliasLoaded, AppContext.currentAlias);
            }, "AgentUi-AGENT")
        );

        EM.addListener(EMEvent.USER_LOGIN, fireFitWindow);
        EM.addListener(EMEvent.CreateAgent, fireFitWindow);

        EM.addListener(EMEvent.FitWindow, fitWindowListener);
	}

    public static function getDescendentLabelChildren(iid:String):Array<LabelChild> {
        var lcs = new Array<LabelChild>();

        var getDescendents:String->Array<LabelChild>->Void;
        getDescendents = function(iid:String, lcList:Array<LabelChild>):Void {
            var children: Array<LabelChild> = new FilteredSet(AppContext.LABELCHILDREN, function(lc:LabelChild):Bool {
                return lc.parentIid == iid;
            }).asArray();

            for (i in 0...children.length) {
                lcList.push(children[i]);
                getDescendents(children[i].childIid, lcList);
            }
        };

        getDescendents(iid, lcs);

        return lcs;
    }

    public static function getLabelDescendents(iid:String):ObservableSet<Label> {
        var labelDescendents = new ObservableSet<Label>(Label.identifier);

        var getDescendentIids:String->Array<String>->Void;
        getDescendentIids = function(iid:String, iidList:Array<String>):Void {
            iidList.insert(0, iid);
            var children: Array<LabelChild> = new FilteredSet(AppContext.LABELCHILDREN, function(lc:LabelChild):Bool {
                return lc.parentIid == iid;
            }).asArray();

            for (i in 0...children.length) {
                getDescendentIids(children[i].childIid, iidList);
            }
        };

        var iid_list = new Array<String>();
        getDescendentIids(iid, iid_list);
        for (iid_ in iid_list) {
            var label = LABELS.getElement(iid_);
            if (label == null) {
                AppContext.LOGGER.error("LabelChild references missing label: " + iid_);
            } else if (!label.deleted) {
                labelDescendents.add(label);
            }
        }
        return labelDescendents;
    }
}