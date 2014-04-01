package qoid;

import haxe.ds.StringMap;

import m3.jq.JQ;
import m3.log.Logga;
import m3.log.LogLevel;
import m3.observable.OSet;
import m3.serialization.Serialization;

import qoid.model.EM;
import qoid.model.ModelObj;

using m3.helper.ArrayHelper;
using m3.helper.StringHelper;
using m3.helper.OSetHelper;

class AppContext {
    public static var SUBMIT_CHANNEL:String;
    public static var UBER_ALIAS_ID:String;
    public static var ROOT_LABEL_ID:String;

    public static var LOGGER: Logga;
    public static var MASTER_ALIASES:ObservableSet<Alias>;
    public static var ALIASES:OSet<Alias>;
    public static var TARGET: Connection;
    public static var SERIALIZER: Serializer;

    public static var NOTIFICATIONS:FilteredSet<Notification<Dynamic>>;
    public static var MASTER_NOTIFICATIONS: ObservableSet<Notification<Dynamic>>;

    public static var INTRODUCTIONS: ObservableSet<Introduction>;

    public static var MASTER_CONNECTIONS: ObservableSet<Connection>;
    public static var GROUPED_CONNECTIONS: GroupedSet<Connection>;

    public static var LABELS:FilteredSet<Label>;
    public static var MASTER_LABELS:ObservableSet<Label>;

    public static var MASTER_LABELACLS:ObservableSet<LabelAcl>;
    public static var GROUPED_LABELACLS: GroupedSet<LabelAcl>;
    
    public static var MASTER_LABELCHILDREN:ObservableSet<LabelChild>;
    public static var GROUPED_LABELCHILDREN: GroupedSet<LabelChild>;

    public static var MASTER_LABELEDCONTENT:ObservableSet<LabeledContent>;
    public static var GROUPED_LABELEDCONTENT: GroupedSet<LabeledContent>;

    public static var PROFILES:ObservableSet<Profile>;

    public static var currentAlias: Alias;

    public static function init() {
    	LOGGER = new Logga(LogLevel.DEBUG);

        EM.setLogger(LOGGER);

        INTRODUCTIONS = new ObservableSet<Introduction>(ModelObjWithIid.identifier);

        MASTER_NOTIFICATIONS = new ObservableSet<Notification<Dynamic>>(ModelObjWithIid.identifier);
        NOTIFICATIONS = new FilteredSet<Notification<Dynamic>>(MASTER_NOTIFICATIONS, function(a:Notification<Dynamic>):Bool {
            return !a.deleted && !a.consumed;
        });

        MASTER_ALIASES = new ObservableSet<Alias>(ModelObjWithIid.identifier);
        MASTER_ALIASES.listen(function(a:Alias, evt:EventType):Void {
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

        ALIASES = new FilteredSet<Alias>(MASTER_ALIASES, function(a:Alias):Bool {
            return !a.deleted;
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
        GROUPED_CONNECTIONS = new GroupedSet<Connection>(MASTER_CONNECTIONS, function(c:Connection):String {
            if (c.deleted) {
                return "DELETED";
            }
            return c.aliasIid;
        });

        MASTER_LABELACLS = new ObservableSet<LabelAcl>(LabelAcl.identifier);
        GROUPED_LABELACLS = new GroupedSet<LabelAcl>(MASTER_LABELACLS, function(l:LabelAcl):String {
            if (l.deleted) {
                return "DELETED";
            }
            return l.connectionIid;
        });

        MASTER_LABELCHILDREN = new ObservableSet<LabelChild>(LabelChild.identifier);
        GROUPED_LABELCHILDREN = new GroupedSet<LabelChild>(MASTER_LABELCHILDREN, function(lc:LabelChild):String {
            if (lc.deleted) {
                return "DELETED";
            }
            return lc.parentIid;
        });

        MASTER_LABELEDCONTENT = new ObservableSet<LabeledContent>(LabeledContent.identifier);
        GROUPED_LABELEDCONTENT = new GroupedSet<LabeledContent>(MASTER_LABELEDCONTENT, function(lc:LabeledContent):String {
            if (lc.deleted) {
                return "DELETED";
            }
            return lc.contentIid;
        });
        
        PROFILES = new ObservableSet<Profile>(Profile.identifier);
        PROFILES.listen( function(p:Profile, evt:EventType): Void{
            if (evt.isAddOrUpdate()) {
                var alias = MASTER_ALIASES.getElement(p.aliasIid);
                if (alias != null) {
                    alias.profile = p;
                    MASTER_ALIASES.addOrUpdate(alias);
                }
            }
        });

		SERIALIZER = new Serializer();
        SERIALIZER.addHandler(Content, new ContentHandler());
        SERIALIZER.addHandler(Notification, new NotificationHandler());

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

	static function registerGlobalListeners() {
        new JQ(js.Browser.window).on("unload", function(evt: JQEvent){
            EM.change(EMEvent.UserLogout);
        });

        EM.addListener(EMEvent.InitialDataLoadComplete, function(nada: {}) {
            var uberAlias = ALIASES.getElement(UBER_ALIAS_ID);
            ROOT_LABEL_ID = uberAlias.rootLabelIid;

            currentAlias = ALIASES.getElement(UBER_ALIAS_ID);
            for (alias in ALIASES) {
                if (alias.data.isDefault == true) {
                    currentAlias = alias;
                    break;
                }
            }
            EM.change(EMEvent.AliasLoaded, currentAlias);
            }, "AppContext-InitialDataLoadComplete"
        );

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
            var children: Array<LabelChild> = new FilteredSet(AppContext.MASTER_LABELCHILDREN, function(lc:LabelChild):Bool {
                return lc.parentIid == iid && !lc.deleted;
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
        for (connection in MASTER_CONNECTIONS) {
            if (connection.metaLabelIid == metaLabelIid) {
                ret = connection;
                break;
            }
        }
        return ret;
    }
}