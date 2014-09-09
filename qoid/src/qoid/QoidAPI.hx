package qoid;

import haxe.ds.StringMap;
import m3.comm.*;
import m3.comm.ChannelRequest;
import m3.jq.JQ;
import m3.log.Logga;
import m3.event.EventManager;
import m3.exception.Exception;
import m3.serialization.Serialization;
import qoid.Synchronizer;


typedef ChannelId = String;
typedef AliasIid  = String;

class AuthenticationResponse {
    public var channelId:String;
    public var connectionIid:String;
}

@:expose
class QoidAPI {
	public static function main() {
    }

    private static function __init__() {
        channels = new Array<String>();
        activeChannel = null;
        longPolls = new StringMap<LongPollingRequest>();
    }

    @:isVar public static var activeChannel(get,set): ChannelId;
    public static function set_activeChannel(c:ChannelId):ChannelId {
        activeChannel = c;
        return activeChannel;
    }
    public static function get_activeChannel():ChannelId {
        return activeChannel;
    }

    @:isVar public static var activeAlias(get,set): AliasIid;
    public static function set_activeAlias(a:AliasIid):AliasIid {
        activeAlias = a;
        return activeAlias;
    }
    public static function get_activeAlias():AliasIid {
        return activeAlias;
    }

    private static var channels:Array<ChannelId>;
    public static function addChannel(c:ChannelId):Void {
        channels.push(c);
    }
    public static function removeChannel(c:ChannelId):Bool {
        return channels.remove(c);
    }

    private static var longPolls:StringMap<LongPollingRequest>;

    // Message Paths
    private static var AGENT_CREATE = "/api/v1/agent/create";
    private static var LOGIN = "/api/v1/login";
    private static var LOGOUT = "/api/v1/logout";
    private static var SPAWN = "/api/v1/session/spawn";

    private static var ALIAS_CREATE = "/api/v1/alias/create";
    private static var ALIAS_UPDATE = "/api/v1/alias/update";
    private static var ALIAS_DELETE = "/api/v1/alias/delete";
    private static var ALIAS_LOGIN_CREATE = "/api/v1/alias/login/create";
    private static var ALIAS_LOGIN_UPDATE = "/api/v1/alias/login/update";
    private static var ALIAS_LOGIN_DELETE = "/api/v1/alias/login/delete";
    private static var ALIAS_PROFILE_UPDATE = "/api/v1/alias/profile/update";

    private static var CONNECTION_DELETE = "/api/v1/connection/delete";

    private static var CONTENT_CREATE = "/api/v1/content/create";
    private static var CONTENT_UPDATE = "/api/v1/content/update";
    private static var CONTENT_DELETE = "/api/v1/content/delete";
    private static var CONTENT_LABEL_ADD    = "/api/v1/content/label/add";
    private static var CONTENT_LABEL_REMOVE = "/api/v1/content/label/remove";

    private static var LABEL_CREATE = "/api/v1/label/create";
    private static var LABEL_UPDATE = "/api/v1/label/update";
    private static var LABEL_DELETE = "/api/v1/label/remove";
    private static var LABEL_MOVE   = "/api/v1/label/move";
    private static var LABEL_COPY   = "/api/v1/label/copy";
    private static var LABEL_ACCESS_GRANT  = "/api/v1/label/access/grant";
    private static var LABEL_ACCESS_REVOKE = "/api/v1/label/access/revoke";
    private static var LABEL_ACCESS_UPDATE = "/api/v1/label/access/update";

    private static var NOTIFICATION_CREATE  = "/api/v1/notification/create";
    private static var NOTIFICATION_CONSUME = "/api/v1/notification/consume";
    private static var NOTIFICATION_DELETE  = "/api/v1/notification/delete";

    private static var INTRODUCTION_INITIATE = "/api/v1/introduction/initiate";
    private static var INTRODUCTION_ACCEPT   = "/api/v1/introduction/accept";

    private static var QUERY = "/api/v1/query";
    private static var QUERY_CANCEL = "/api/v1/query/cancel";


    @:isVar private static var headers(get,null): StringMap<String>;
    private static function get_headers():StringMap<String> {
        var ret = new StringMap<String>();
        ret.set("Qoid-ChannelId", QoidAPI.activeChannel);
        return ret;
    }

    // AGENT
    public static function createAgent(name:String, password:String):Void {
        var json:Dynamic = {name:name, password:password};
        new JsonRequest(json, AGENT_CREATE, 
            function(data:Dynamic) {
                EventManager.instance.change(QE.onAgentCreated, data);
            },
            function(exc:AjaxException) {
                js.Lib.alert(exc);
            }
        ).start();
    }

    // SESSION
    public static function login(authenticationId:String, password:String):Void {
        var json:Dynamic = {authenticationId:authenticationId, password:password};
        new JsonRequest(json, LOGIN, onLogin, onLoginError).start();
    }

    private static function onLoginError(exc:AjaxException) {
        js.Lib.alert(exc);
    }

    private static function onLogin(data:Dynamic) {
        var auth:AuthenticationResponse = cast(data);

        QoidAPI.addChannel(auth.channelId);
        QoidAPI.activeChannel = auth.channelId;
        QoidAPI.activeAlias = auth.connectionIid;

        // Kick off a long poll and immediately request the model data
        _startPolling(auth.channelId);

        var context = "initialDataLoad";
        var sychoronizer = new qoid.Synchronizer(context, 9, onInitialDataload);
        var requests = [
            new ChannelRequestMessage(QUERY, context + "-alias", createQueryJson("alias")),
            new ChannelRequestMessage(QUERY, context + "-introduction", createQueryJson("introduction")),
            new ChannelRequestMessage(QUERY, context + "-connection", createQueryJson("connection")),
            new ChannelRequestMessage(QUERY, context + "-notification", createQueryJson("notification", "consumed='0'")),
            new ChannelRequestMessage(QUERY, context + "-label", createQueryJson("label")),
            new ChannelRequestMessage(QUERY, context + "-labelAcl", createQueryJson("labelAcl")),
            new ChannelRequestMessage(QUERY, context + "-labeledContent", createQueryJson("labeledContent")),
            new ChannelRequestMessage(QUERY, context + "-labelChild", createQueryJson("labelChild")),
            new ChannelRequestMessage(QUERY, context + "-profile", createQueryJson("profile"))
        ];
        new SubmitRequest(activeChannel, requests, onSuccess, onError).requestHeaders(headers).start();

        EventManager.instance.change(QE.onUserLogin);
    }

    private static function onInitialDataload(data:SynchronizationParms) {
        Qoid.aliases.addAll(data.aliases);
        Qoid.connections.addAll(data.connections);
        Qoid.labels.addAll(data.labels);
        Qoid.labelChildren.addAll(data.labelChildren);
        Qoid.introductions.addAll(data.introductions);
        Qoid.notifications.addAll(data.notifications);
        Qoid.labeledContent.addAll(data.labeledContent);
        Qoid.labelAcls.addAll(data.labelAcls);
        Qoid.profiles.addAll(data.profiles);

        // Update the aliases with their profile
        for (alias_ in Qoid.aliases) {
            for (profile_ in Qoid.profiles) {
                if (profile_.aliasIid == alias_.iid) {
                    alias_.profile = profile_;
                    Qoid.aliases.update(alias_);
                }
            }
        }

        Qoid.onInitialDataLoadComplete(QoidAPI.activeAlias);
        EventManager.instance.change(QE.onInitialDataload);
    }

    private static function _startPolling(channelId:String): Void {
        // TODO:  add the ability to set the timeout value
        var timeout = 10000;
        var ajaxOptions:AjaxOptions = {
            contentType: ""
        };

        var lpr = new LongPollingRequest(channelId, ResponseProcessor.processResponse, null, ajaxOptions, "/api/v1/channel/poll");
        lpr.timeout = timeout;
        lpr.requestHeaders(headers);
        lpr.start();
        QoidAPI.longPolls.set(channelId, lpr);
    }

    public static function query(type: String, query: String, historical: Bool, standing: Bool, ?route: Array<String>):Void {

    }

    private static function createQueryJson(type: String, query: String="1=1", historical:Bool=true, standing:Bool=true, ?route: Array<String>):Dynamic {
        var ret:Dynamic = {
            type:type,
            query:query,
            historical:historical,
            standing: standing
        }
        if (route != null) {
            ret.route = route;
        }
        return ret;
    }

    public static function getProfile(connectionIid:String) {
        var json = createQueryJson("profile", true, false, [connectionIid]);
        submitRequest(json, QUERY, "connectionProfile");
    }

    public static function getVerificationContent(connectionIids:Array<String>, iids:Array<String>) {
        var json = createQueryJson("content", "iid in (" + iids.join(",") + ")", true, false);
        submitRequest(json, QUERY, "verificationContent");
    }

    public static function cancelQuery(context:String):Void {
        submitRequest({}, QUERY_CANCEL, context);
    }

    public static function logout():Void {
        new JsonRequest({}, LOGOUT).start();
    }

    public static function spawnSession(aliasIid:String):Void {
        var json:Dynamic = {authenticationId:aliasIid};
        submitRequest(json, SPAWN, "spawnSession");
    }

    // ALIAS
    public static function createAlias(profileName: String, ?profileImage: String, ?data: Dynamic, ?route: Array<String>):Void {
        var json:Dynamic = {
            name: profileName,
            profileName: profileName,
            profileImage: profileImage
        };

        if (route != null) {
            json.route = route;
        }

        if (data != null) {
            json.data = data;
        }
        submitRequest(json, ALIAS_CREATE, "createAlias");
    }

    public static function updateAlias(aliasIid: String, data: Dynamic, ?route: Array<String>):Void {
        var json:Dynamic = {
            aliasIid: aliasIid,
            data: data
        };

        if (route != null) {
            json.route = route;
        }
        submitRequest(json, ALIAS_UPDATE, "updateAlias");
    }

    public static function deleteAlias(aliasIid: String, ?route: Array<String>):Void {
        var json:Dynamic = {
            aliasIid: aliasIid
        };
        if (route != null) {
            json.route = route;
        }

        submitRequest(json, ALIAS_DELETE, "deleteAlias");
    }

    public static function createAliasLogin(aliasIid: String, password: String, ?route: Array<String>):Void {
        var json:Dynamic = {
            aliasIid: aliasIid,
            password: password
        };
        if (route != null) {
            json.route = route;
        }

        submitRequest(json, ALIAS_LOGIN_CREATE, "createAliasLogin");
    }

    public static function updateAliasLogin(aliasIid: String, password: String, ?route: Array<String>):Void {
        var json:Dynamic = {
            aliasIid: aliasIid,
            password: password
        };
        if (route != null) {
            json.route = route;
        }
        submitRequest(json, ALIAS_LOGIN_UPDATE, "updateAliasLogin");
    }

    public static function deleteAliasLogin(aliasIid: String, ?route: Array<String>):Void {
        var json:Dynamic = {
            aliasIid: aliasIid
        };
        if (route != null) {
            json.route = route;
        }

        submitRequest(json, ALIAS_LOGIN_DELETE, "deleteAliasLogin");
    }

    public static function updateAliasProfile(aliasIid: String, ?profileName:String, ?profileImage:String, ?route: Array<String>):Void {
        var json:Dynamic = {
            aliasIid: aliasIid,
            profileName: profileName,
            profileImage: profileImage
        };
        if (route != null) {
            json.route = route;
        }

        submitRequest(json, ALIAS_PROFILE_UPDATE, "updateAliasProfile");
    }

    // CONNECTION
    public static function deleteConnection(connectionIid:String, ?route: Array<String>):Void {
        var json:Dynamic = {
            connectionIid: connectionIid
        };
        if (route != null) {
            json.route = route;
        }

        submitRequest(json, CONNECTION_DELETE, "deleteConnection");
    }

    // CONTENT
    public static function createContent(contentType: String, data: Dynamic, labelIids: Array<String>, ?route: Array<String>):Void {
        var json:Dynamic = {
            contentType: contentType,
            data: data,
            labelIids: labelIids
        };
        if (route != null) {
            json.route = route;
        }

        submitRequest(json, CONTENT_CREATE, "createContent");
    }

    public static function updateContent(contentIid:String, data: Dynamic, ?route: Array<String>):Void {
        var json:Dynamic = {
            contentIid: contentIid,
            data: data
        };
        if (route != null) {
            json.route = route;
        }

        submitRequest(json, CONTENT_UPDATE, "updateContent");
    }

    public static function deleteContent(contentIid:String, ?route: Array<String>):Void {
        var json:Dynamic = {
            contentIid: contentIid
        };
        if (route != null) {
            json.route = route;
        }

        submitRequest(json, CONTENT_DELETE, "deleteContent");
    }


    public static function addContentLabel(contentIid:String, labelIid:String, ?route: Array<String>):Void {
        var json:Dynamic = {
            contentIid: contentIid,
            labelIid: labelIid
        };
        if (route != null) {
            json.route = route;
        }

        submitRequest(json, CONTENT_LABEL_ADD, "addContentLabel");
    }

    public static function removeContentLabel(contentIid:String, labelIid:String, ?route: Array<String>):Void {
        var json:Dynamic = {
            contentIid: contentIid,
            labelIid: labelIid
        };
        if (route != null) {
            json.route = route;
        }

        submitRequest(json, CONTENT_LABEL_REMOVE, "removeContentLabel");
    }

    // LABEL
    public static function createLabel(parentLabelIid: String, name:String, ?data: Dynamic, ?route: Array<String>):Void {
        var json:Dynamic = {
            parentLabelIid: parentLabelIid,
            name: name,
            data: data
        };
        if (route != null) {
            json.route = route;
        }

        submitRequest(json, LABEL_CREATE, "createLabel");
    }

    public static function updateLabel(labelIid:String, ?name:String, ?data: Dynamic, ?route: Array<String>):Void {
        var json:Dynamic = {
            labelIid: labelIid,
            name: name,
            data: data
        };
        if (route != null) {
            json.route = route;
        }

        submitRequest(json, LABEL_UPDATE, "updateLabel");
    }

    public static function moveLabel(labelIid:String, oldParentLabelIid:String, newParentLabelIid: String, ?route: Array<String>):Void {
        var json:Dynamic = {
            labelIid: labelIid,
            oldParentLabelIid: oldParentLabelIid,
            newParentLabelIid: newParentLabelIid
        };
        if (route != null) {
            json.route = route;
        }

        submitRequest(json, LABEL_MOVE, "moveLabel");
    }

    public static function copyLabel(labelIid:String, newParentLabelIid:String, ?route: Array<String>):Void {
        var json:Dynamic = {
            labelIid: labelIid,
            newParentLabelIid: newParentLabelIid
        };
        if (route != null) {
            json.route = route;
        }

        submitRequest(json, LABEL_COPY, "copyLabel");
    }

    public static function deleteLabel(labelIid:String, parentLabelIid:String, ?route: Array<String>):Void {
        var json:Dynamic = {
            labelIid: labelIid,
            parentLabelIid: parentLabelIid
        };
        if (route != null) {
            json.route = route;
        }

        submitRequest(json, LABEL_DELETE, "deleteLabel");
    }

    public static function grantAccess(labelIid:String, connectionIid:String, maxDoV:Int, ?route: Array<String>):Void {
        var json:Dynamic = {
            labelIid: labelIid,
            connectionIid: connectionIid,
            maxDoV:maxDoV
        };
        if (route != null) {
            json.route = route;
        }

        submitRequest(json, LABEL_ACCESS_GRANT, "grantAccess");
    }

    public static function revokeAccess(labelIid:String, connectionIid:String, ?route: Array<String>):Void {
        var json:Dynamic = {
            labelIid: labelIid,
            connectionIid: connectionIid
        };
        if (route != null) {
            json.route = route;
        }

        submitRequest(json, LABEL_ACCESS_REVOKE, "revokeAccess");
    }

    public static function updateAccess(labelIid:String, connectionIid:String, maxDoV:Int, ?route: Array<String>):Void {
        var json:Dynamic = {
            labelIid: labelIid,
            connectionIid: connectionIid,
            maxDoV:maxDoV
        };
        if (route != null) {
            json.route = route;
        }

        submitRequest(json, LABEL_ACCESS_UPDATE, "updateAccess");
    }

	// Notifications

    public static function createNotification(kind:String, ?data:String, ?route: Array<String>):Void {
        var json:Dynamic = {
            kind: kind,
            data: data
        };
        if (route != null) {
            json.route = route;
        }

        submitRequest(json, NOTIFICATION_CREATE, "createNotification");
    }

    public static function consumeNotification(notificationIid:String, ?route: Array<String>):Void {
        var json:Dynamic = {
            notificationIid: notificationIid
        };
        if (route != null) {
            json.route = route;
        }

        submitRequest(json, NOTIFICATION_CONSUME, "consumeNotification");
    }

    public static function deleteNotification(notificationIid:String, ?route: Array<String>):Void {
        var json:Dynamic = {
            notificationIid: notificationIid
        };
        if (route != null) {
            json.route = route;
        }

        submitRequest(json, NOTIFICATION_DELETE, "deleteNotification");
    }

	// Introduction
    public static function initiateIntroduction(aConnectionIid: String, aMessage: String,
                                                bConnectionIid: String, bMessage: String, 
                                                ?route: Array<String> ):Void {
        var json:Dynamic = {
            aConnectionIid: aConnectionIid,
            aMessage: aMessage,
            bConnectionIid: bConnectionIid,
            bMessage: bMessage
        };
        if (route != null) {
            json.route = route;
        }

        submitRequest(json, INTRODUCTION_INITIATE, "initiateIntroduction");
    }

    public static function acceptIntroduction(notificationIid:String, ?route: Array<String>):Void {
        var json:Dynamic = {
            notificationIid: notificationIid
        };
        if (route != null) {
            json.route = route;
        }

        submitRequest(json, INTRODUCTION_ACCEPT, "acceptIntroduction");
    }

    private static function submitRequest(json:Dynamic, path:String, context:String):Void {
        var msg = new ChannelRequestMessage(path, context, json);
        new SubmitRequest(activeChannel, [msg], onSuccess, onError).requestHeaders(headers).start();
    }

    private static function onSuccess(data:Dynamic):Void {
        if (data.context == "spawnSession") {
            var auth:AuthenticationResponse = cast(data.results[0]);
            QoidAPI.addChannel(auth.channelId);
            QoidAPI.activeChannel = auth.channelId;
            EventManager.instance.change("sessionSpawned", auth);
        }
    }

    private static function onError(ae:AjaxException):Void {
        Logga.DEFAULT.error("QoidAPI Error", ae);
    }
}

class SubmitRequest extends JsonRequest {
    public function new(channel:String, msgs:Array<ChannelRequestMessage>,
                        successFcn: Dynamic->Void, errorFcn:AjaxException->Void) {
        this.baseOpts = {
            dataType: "text" 
        };

        var bundle = new ChannelRequestMessageBundle(channel, msgs);
        var data = Serializer.instance.toJson(bundle);

        super(data, "/api/v1/channel/submit", successFcn, errorFcn);
    }
}