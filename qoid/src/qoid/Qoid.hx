package qoid;

import haxe.ds.StringMap;

import m3.jq.JQ;
import m3.log.Logga;
import m3.log.LogLevel;
import m3.observable.OSet;
import m3.serialization.Serialization;
import m3.event.EventManager;

import qoid.model.ModelObj;

using m3.helper.ArrayHelper;
using m3.helper.StringHelper;
using m3.helper.OSetHelper;

class Qoid {
    public static var aliases:ObservableSet<Alias>;

    public static var notifications:ObservableSet<Notification<Dynamic>>;

    public static var introductions: ObservableSet<Introduction>;

    public static var connections: ObservableSet<Connection>;
    public static var groupedConnections: GroupedSet<Connection>;

    public static var labels:ObservableSet<Label>;

    public static var labelAcls:ObservableSet<LabelAcl>;
    public static var groupedLabelAcls: GroupedSet<LabelAcl>;
    
    public static var labelChildren:ObservableSet<LabelChild>;
    public static var groupedLabelChildren: GroupedSet<LabelChild>;

    public static var labeledContent:ObservableSet<LabeledContent>;
    public static var groupedLabeledContent: GroupedSet<LabeledContent>;

    public static var profiles:ObservableSet<Profile>;

    @:isVar public static var currentAlias(get,set): Alias;
    public static function set_currentAlias(a:Alias):Alias {
        currentAlias = a;
        EventManager.instance.change(QE.onAliasLoaded, currentAlias);
        return currentAlias;
    }

    public static function get_currentAlias():Alias {
        return currentAlias;
    }

    public static var verificationContent: ObservableSet<Content<Dynamic>>;

    private static function __init__(): Void {
        introductions = new ObservableSet<Introduction>(ModelObjWithIid.identifier);

        notifications = new ObservableSet<Notification<Dynamic>>(ModelObjWithIid.identifier);
/*
        notifications.listen(function(n:Notification<Dynamic>, evt:EventType) {
            if (evt.isAddOrUpdate()) {
                if (n.kind == NotificationKind.IntroductionRequest) {
                    var introRequest:IntroductionRequestNotification = cast(n);
                    var p = profiles.getElementComplex(introRequest.props.connectionIid, "connectionIid");
                    if (p != null) {
                        introRequest.props.profile = p;
                    }
                }
            }
        });
*/
        aliases = new ObservableSet<Alias>(ModelObjWithIid.identifier);
        aliases.listen(function(a:Alias, evt:EventType):Void {
            if (evt.isAddOrUpdate()) {
                var p = profiles.getElementComplex(a.iid, "aliasIid");
                if (p != null) {
                    a.profile = p;
                }
                if (evt.isAdd()) {
                    EventManager.instance.change(QE.onAliasCreated, a);
                } else {
                    EventManager.instance.change(QE.onAliasUpdated, a);
                }
            }
        });

        labels = new ObservableSet<Label>(Label.identifier);

        connections = new ObservableSet<Connection>(Connection.identifier);
        connections.listen(function(c:Connection, evt:EventType): Void {
            if (evt.isAdd()) {
                QoidAPI.getProfile([c.iid]);
            }
        });
        groupedConnections = new GroupedSet<Connection>(connections, function(c:Connection):String {
            return c.aliasIid;
        });

        labelAcls = new ObservableSet<LabelAcl>(LabelAcl.identifier);
        groupedLabelAcls = new GroupedSet<LabelAcl>(labelAcls, function(l:LabelAcl):String {
            return l.connectionIid;
        });

        labelChildren = new ObservableSet<LabelChild>(LabelChild.identifier);
        groupedLabelChildren = new GroupedSet<LabelChild>(labelChildren, function(lc:LabelChild):String {
            return lc.parentIid;
        });

        labeledContent = new ObservableSet<LabeledContent>(LabeledContent.identifier);
        groupedLabeledContent = new GroupedSet<LabeledContent>(labeledContent, function(lc:LabeledContent):String {
            return lc.contentIid;
        });
        
        profiles = new ObservableSet<Profile>(Profile.identifier);
        profiles.listen( function(p:Profile, evt:EventType): Void{
            if (evt.isAddOrUpdate()) {
                var alias = aliases.getElement(p.aliasIid);
                if (alias != null) {
                    alias.profile = p;
                    aliases.addOrUpdate(alias);
                }
            }
        });

        verificationContent = new ObservableSet<Content<Dynamic>>(ModelObjWithIid.identifier);

        // Add Handlers to the Serializer instance
        Serializer.instance.addHandler(Content, new ContentHandler());
        Serializer.instance.addHandler(Notification, new NotificationHandler());

        EventManager.instance.on("onConnectionProfile", processProfile);
    }

    public static function onInitialDataLoadComplete(connectionIid:String) {
        var a = aliases.getElementComplex(connectionIid, "connectionIid");

        // Set the current alias
        for (alias in aliases) {
            if (alias.data.isDefault == true) {
                a = alias;
                break;
            }
        }
        currentAlias = a;
    }

    public static function processProfile(rec:{result:Dynamic}) {
        var connectionIid = rec.result.route[0];
        var connection = Qoid.connections.getElement(connectionIid);
        var profile = Serializer.instance.fromJsonX(rec.result.results[0], Profile);
        profile.connectionIid = connectionIid;
        connection.data = profile;
        Qoid.connections.addOrUpdate(connection);
        Qoid.profiles.addOrUpdate(profile);
    }

    public static function getLabelDescendents(iid:String):ObservableSet<Label> {
        var labelDescendents = new ObservableSet<Label>(Label.identifier);

        var getDescendentIids:String->Array<String>->Void;
        getDescendentIids = function(iid:String, iidList:Array<String>):Void {
            iidList.insert(0, iid);
            var children: Array<LabelChild> = new FilteredSet(Qoid.labelChildren, function(lc:LabelChild):Bool {
                return lc.parentIid == iid;
            }).asArray();

            for (i in 0...children.length) {
                getDescendentIids(children[i].childIid, iidList);
            }
        };

        var iid_list = new Array<String>();
        getDescendentIids(iid, iid_list);
        for (iid_ in iid_list) {
            var label = labels.getElement(iid_);
            if (label == null) {
                Logga.DEFAULT.error("LabelChild references missing label: " + iid_);
            } else {
                labelDescendents.add(label);
            }
        }
        return labelDescendents;
    }

    // TODO:  Change name 
    public static function connectionFromMetaLabel(labelIid:String):Connection {
        var ret:Connection = null;
        for (connection in connections) {
            if (connection.labelIid == labelIid) {
                ret = connection;
                break;
            }
        }
        return ret;
    }
}