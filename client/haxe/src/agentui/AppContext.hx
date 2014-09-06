package agentui;

import haxe.ds.StringMap;

import m3.jq.JQ;
import m3.log.Logga;
import m3.log.LogLevel;
import m3.observable.OSet;
import m3.serialization.Serialization;

import agentui.model.EM;
import agentui.model.ModelObj;

using m3.helper.ArrayHelper;
using m3.helper.StringHelper;
using m3.helper.OSetHelper;

class AppContext {
    public static var SUBMIT_CHANNEL:String;
    public static var UBER_ALIAS_ID:String;
    public static var ROOT_LABEL_ID:String;

    public static var ALIASES:ObservableSet<Alias>;
    public static var TARGET: Connection;

    public static var NOTIFICATIONS:FilteredSet<Notification<Dynamic>>;
    public static var MASTER_NOTIFICATIONS: ObservableSet<Notification<Dynamic>>;

    public static var INTRODUCTIONS: ObservableSet<Introduction>;

    public static var CONNECTIONS: ObservableSet<Connection>;
    public static var GROUPED_CONNECTIONS: GroupedSet<Connection>;

    public static var LABELS:ObservableSet<Label>;

    public static var LABELACLS:ObservableSet<LabelAcl>;
    public static var GROUPED_LABELACLS: GroupedSet<LabelAcl>;
    
    public static var LABELCHILDREN:ObservableSet<LabelChild>;
    public static var GROUPED_LABELCHILDREN: GroupedSet<LabelChild>;

    public static var LABELEDCONTENT:ObservableSet<LabeledContent>;
    public static var GROUPED_LABELEDCONTENT: GroupedSet<LabeledContent>;

    public static var PROFILES:ObservableSet<Profile>;

    public static var currentAlias: Alias;

    public static var VERIFICATION_CONTENT: ObservableSet<Content<Dynamic>>;

    public static function init() {
        INTRODUCTIONS = new ObservableSet<Introduction>(ModelObjWithIid.identifier);

        MASTER_NOTIFICATIONS = new ObservableSet<Notification<Dynamic>>(ModelObjWithIid.identifier);
        NOTIFICATIONS = new FilteredSet<Notification<Dynamic>>(MASTER_NOTIFICATIONS, function(a:Notification<Dynamic>):Bool {
            return !a.consumed;
        });

        ALIASES = new ObservableSet<Alias>(ModelObjWithIid.identifier);
        ALIASES.listen(function(a:Alias, evt:EventType):Void {
            if (evt.isAddOrUpdate()) {
                var p = PROFILES.getElementComplex(a.iid, "aliasIid");
                if (p != null) {
                    a.profile = p;
                }
                if (evt.isAdd()) {
                    EM.change(EMEvent.AliasCreated, a);
                } else {
                    EM.change(EMEvent.AliasUpdated, a);
                }
            }
        });

        LABELS = new ObservableSet<Label>(Label.identifier);

        CONNECTIONS = new ObservableSet<Connection>(Connection.identifier);
        CONNECTIONS.listen(function(c:Connection, evt:EventType): Void {
            if (evt.isAdd()) {
                AgentUi.PROTOCOL.getProfiles([c.iid]);
            }
        });
        GROUPED_CONNECTIONS = new GroupedSet<Connection>(CONNECTIONS, function(c:Connection):String {
            return c.aliasIid;
        });

        LABELACLS = new ObservableSet<LabelAcl>(LabelAcl.identifier);
        GROUPED_LABELACLS = new GroupedSet<LabelAcl>(LABELACLS, function(l:LabelAcl):String {
            return l.connectionIid;
        });

        LABELCHILDREN = new ObservableSet<LabelChild>(LabelChild.identifier);
        GROUPED_LABELCHILDREN = new GroupedSet<LabelChild>(LABELCHILDREN, function(lc:LabelChild):String {
            return lc.parentIid;
        });

        LABELEDCONTENT = new ObservableSet<LabeledContent>(LabeledContent.identifier);
        GROUPED_LABELEDCONTENT = new GroupedSet<LabeledContent>(LABELEDCONTENT, function(lc:LabeledContent):String {
            return lc.contentIid;
        });
        
        PROFILES = new ObservableSet<Profile>(Profile.identifier);
        PROFILES.listen( function(p:Profile, evt:EventType): Void{
            if (evt.isAddOrUpdate()) {
                var alias = ALIASES.getElement(p.aliasIid);
                if (alias != null) {
                    alias.profile = p;
                    ALIASES.addOrUpdate(alias);
                }
            }
        });

        VERIFICATION_CONTENT = new ObservableSet<Content<Dynamic>>(ModelObjWithIid.identifier);

        Serializer.instance.addHandler(Content, new ContentHandler());
        Serializer.instance.addHandler(Notification, new NotificationHandler());

    	registerGlobalListeners();
    }

    public static function isAliasRootLabel(iid:String):Bool {
        for (alias in ALIASES) {
            if (alias.rootLabelIid == iid) {
                return true;
            }
        }
        return false;
    }

    public static function getUberLabelIid() {
        return ALIASES.getElement(AppContext.UBER_ALIAS_ID).rootLabelIid;
    }

    static function onInitialDataLoadComplete(nada:{}) {
        ROOT_LABEL_ID = ALIASES.getElement(UBER_ALIAS_ID).rootLabelIid;

        // Set the current alias
        currentAlias = ALIASES.getElement(UBER_ALIAS_ID);
        for (alias in ALIASES) {
            if (alias.data.isDefault == true) {
                currentAlias = alias;
                break;
            }
        }

        // Retrieve any verification content
        EM.change(EMEvent.AliasLoaded, currentAlias);
    }

	static function registerGlobalListeners() {
        new JQ(js.Browser.window).on("unload", function(evt: JQEvent){
            EM.change(EMEvent.UserLogout);
        });

        EM.addListener(EMEvent.InitialDataLoadComplete, 
                       onInitialDataLoadComplete,
                       "AppContext-InitialDataLoadComplete");

        EM.addListener(EMEvent.AliasLoaded, function(a:Alias){
            js.Browser.document.title = a.profile.name + " | Qoid-Bennu"; 
        });

        EM.addListener(EMEvent.FitWindow, function(n: {}) {
                untyped __js__("fitWindow()");
            }, "AppContext-FitWindow"
        );
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
                Logga.DEFAULT.error("LabelChild references missing label: " + iid_);
            } else {
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