package ui;

import haxe.ds.StringMap;

import m3.jq.JQ;
import m3.log.Logga;
import m3.log.LogLevel;
import m3.observable.OSet;
import m3.serialization.Serialization;

import ui.model.EM;
import ui.model.ModelObj;

using m3.helper.ArrayHelper;
using m3.helper.StringHelper;
using m3.helper.OSetHelper;

class AppContext {
    public static var SUBMIT_CHANNEL:String;

    public static var LOGGER: Logga;
    public static var AGENT: Agent;
    public static var MASTER_ALIASES:ObservableSet<Alias>;
    public static var ALIASES:OSet<Alias>;
    public static var TARGET: Connection;
    public static var SERIALIZER: Serializer;

    public static var NOTIFICATIONS:FilteredSet<Notification<Dynamic>>;
    public static var MASTER_NOTIFICATIONS: ObservableSet<Notification<Dynamic>>;

    public static var INTRODUCTIONS: ObservableSet<Introduction>;

    public static var CONNECTIONS:FilteredSet<Connection>;
    public static var MASTER_CONNECTIONS: ObservableSet<Connection>;
    public static var GROUPED_CONNECTIONS: GroupedSet<Connection>;

    public static var CONTENT: FilteredSet<Content<Dynamic>>;
    public static var MASTER_CONTENT: ObservableSet<Content<Dynamic>>;
    public static var GROUPED_CONTENT: GroupedSet<Content<Dynamic>>;

    public static var LABELS:FilteredSet<Label>;
    public static var MASTER_LABELS:ObservableSet<Label>;
    
    public static var LABELCHILDREN:FilteredSet<LabelChild>;
    public static var MASTER_LABELCHILDREN:ObservableSet<LabelChild>;
    public static var GROUPED_LABELCHILDREN: GroupedSet<LabelChild>;

    public static var LABELEDCONTENT:FilteredSet<LabeledContent>;
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
        MASTER_CONNECTIONS.listen(function(c:Connection, evt:EventType): Void {
            if (evt.isAdd()) {
                AgentUi.PROTOCOL.getProfiles([c.iid]);
            }
        });
        CONNECTIONS = new FilteredSet<Connection>(MASTER_CONNECTIONS, function(c:Connection):Bool {
            return !c.deleted;
        });
        GROUPED_CONNECTIONS = new GroupedSet<Connection>(CONNECTIONS, function(c:Connection):String {
            return c.aliasIid;
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
        SERIALIZER.addHandler(Notification, new NotificationHandler());

    	registerGlobalListeners();
    }

    static function setAgent(agent:Agent) {
        AGENT = agent;

        // Set the current alias
        currentAlias = ALIASES.iterator().next();
        for (alias in ALIASES) {
            if (alias.data.isDefault) {
                currentAlias = alias;
                break;
            }
        }

        EM.change(EMEvent.AliasLoaded, currentAlias);
        EM.change(EMEvent.FitWindow);
    }

    public static function getUberLabelIid() {
        var uberAlias = ALIASES.getElement(AppContext.AGENT.uberAliasIid);
        if (uberAlias == null) {
            return currentAlias.rootLabelIid;
        } else {
            return uberAlias.rootLabelIid;
        }
    }

	static function registerGlobalListeners() {
        new JQ(js.Browser.window).on("unload", function(evt: JQEvent){
            EM.change(EMEvent.UserLogout);
        });

        EM.addListener(EMEvent.AGENT, new EMListener(function(agent: Agent) {
            setAgent(agent);
            }, "AgentUi-AGENT")
        );

        EM.addListener(EMEvent.FitWindow, new EMListener(function(n: Nothing) {
                untyped __js__("fitWindow()");
            }, "FitWindowListener")
        );
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

    public static function connectionFromMetaLabel(metaLabelIid:String):Connection {
        var ret:Connection = null;
        for (connection in CONNECTIONS) {
            if (connection.metaLabelIid == metaLabelIid) {
                ret = connection;
                break;
            }
        }
        return ret;
    }
}