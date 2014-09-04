package qoid;

import haxe.ds.StringMap;
import m3.comm.*;
import m3.event.EventManager;

typedef ChannelId = String;
typedef AliasIid  = String;

// Events:
// onChangeChannel
// onCreateAgent
// onAddChannel
// onDeleteChannel

/*
enum Foo<T> {
          A;
          B;
          C;
          SUB_TYPE(value:T); // Use with custom values to extend.
     }

And then T can for ex
*/

class AuthenticationResponse {
    public var channelId:String;
    public var aliasIid:String;
}

@:expose
class QoidAPI {
	public static function main() {
    }

    private static function __init__() {
        channels = new Array<String>();
        activeChannel = null;
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

    private static function requestHeaders():StringMap<String> {
        var ret = new StringMap<String>();
        ret.set("Qoid-ChannelId", QoidAPI.activeChannel);
        return ret;
    }

    // AGENT
    public static function createAgent(name:String, password:String):Void {
        var json:Dynamic = {name:name, password:password};
        new JsonRequest(json, AGENT_CREATE, function(data:Dynamic) {
            EventManager.instance.change("agentCreated", data);
        }).start();
    }

    // SESSION
    public static function login(authenticationId:String, password:String):Void {
        var json:Dynamic = {authenticationId:authenticationId, password:password};
        new JsonRequest(json, LOGIN, function(data:Dynamic) {
            var auth:AuthenticationResponse = cast(json);
            QoidAPI.addChannel(auth.channelId);
            QoidAPI.activeChannel = auth.channelId;
            EventManager.instance.change("login", data);
        }).start();
    }

    public static function logout():Void {
        new JsonRequest({}, LOGOUT).start();
    }

    public static function spawnSession(aliasIid:String):Void {
        var json:Dynamic = {authenticationId:aliasIid};
        new JsonRequest(json, SPAWN, function(data:Dynamic) {
            var auth:AuthenticationResponse = cast(json);
            EventManager.instance.change("sessionSpawned", auth);
            QoidAPI.addChannel(auth.channelId);
            QoidAPI.activeChannel = auth.channelId;
        }).requestHeaders().start();
    }

    // ALIAS
    public static function createAlias(route: Array<String>, name: String, profileName: String, ?profileImage: String, ?data: Dynamic):Void {
        var json:Dynamic = {
            route: route,
            name :name,
            profileName: profileName,
            profileImage: profileImage,
            data: data
        };

        new JsonRequest(json, ALIAS_CREATE).requestHeaders().start();
    }

    public static function updateAlias(route: Array<String>, aliasIid: String, data: Dynamic):Void {
        var json:Dynamic = {
            route: route,
            aliasIid: aliasIid,
            data :data
        };

        new JsonRequest(json, ALIAS_UPDATE).requestHeaders().start();
    }

    public static function deleteAlias(route: Array<String>, aliasIid: String):Void {
        var json:Dynamic = {
            route: route,
            aliasIid: aliasIid
        };

        new JsonRequest(json, ALIAS_DELETE).requestHeaders().start();
    }

    public static function createAliasLogin(route: Array<String>, aliasIid: String, password: String):Void {
        var json:Dynamic = {
            route: route,
            aliasIid: aliasIid,
            password: password
        };

        new JsonRequest(json, ALIAS_LOGIN_CREATE).requestHeaders().start();
    }

    public static function updateAliasLogin(route: Array<String>, aliasIid: String, password: String):Void {
        var json:Dynamic = {
            route: route,
            aliasIid: aliasIid,
            password: password
        };

        new JsonRequest(json, ALIAS_LOGIN_UPDATE).requestHeaders().start();
    }

    public static function deleteAliasLogin(route: Array<String>, aliasIid: String):Void {
        var json:Dynamic = {
            route: route,
            aliasIid: aliasIid
        };

        new JsonRequest(json, ALIAS_LOGIN_DELETE).requestHeaders().start();
    }

    public static function updateAliasProfile(route: Array<String>, aliasIid: String, ?profileName:String, ?profileImage:String):Void {
        var json:Dynamic = {
            route: route,
            aliasIid: aliasIid,
            profileName: profileName,
            profileImage: profileImage
        };

        new JsonRequest(json, ALIAS_PROFILE_UPDATE).requestHeaders().start();
    }

    // CONNECTION
    public static function deleteConnection(route: Array<String>, connectionIid:String):Void {
        var json:Dynamic = {
            route: route,
            connectionIid: connectionIid
        };

        new JsonRequest(json, CONNECTION_DELETE).requestHeaders().start();
    }

    // CONTENT
    public static function createContent(route: Array<String>, contentType: String, data: Dynamic, labelIids: Array<String>):Void {
        var json:Dynamic = {
            route: route,
            contentType: contentType,
            data: data,
            labelIids: labelIids
        };

        new JsonRequest(json, CONTENT_CREATE).requestHeaders().start();
    }

    public static function updateContent(route: Array<String>, contentIid:String, data: Dynamic):Void {
        var json:Dynamic = {
            route: route,
            contentIid: contentIid,
            data: data
        };

        new JsonRequest(json, CONTENT_UPDATE).requestHeaders().start();
    }

    public static function deleteContent(route: Array<String>, contentIid:String):Void {
        var json:Dynamic = {
            route: route,
            contentIid: contentIid
        };

        new JsonRequest(json, CONTENT_DELETE).requestHeaders().start();
    }


    public static function addContentLabel(route: Array<String>, contentIid:String, labelIid:String):Void {
        var json:Dynamic = {
            route: route,
            contentIid: contentIid,
            labelIid: labelIid
        };

        new JsonRequest(json, CONTENT_LABEL_ADD).requestHeaders().start();
    }

    public static function removeContentLabel(route: Array<String>, contentIid:String, labelIid:String):Void {
        var json:Dynamic = {
            route: route,
            contentIid: contentIid,
            labelIid: labelIid
        };

        new JsonRequest(json, CONTENT_LABEL_REMOVE).requestHeaders().start();
    }

    // LABEL
    public static function createLabel(route: Array<String>, parentLabelIid: String, name:String, ?data: Dynamic):Void {
        var json:Dynamic = {
            route: route,
            parentLabelIid: parentLabelIid,
            name: name,
            data: data
        };

        new JsonRequest(json, LABEL_CREATE).requestHeaders().start();
    }

    public static function updateLabel(route: Array<String>, labelIid:String, ?name:String, ?data: Dynamic):Void {
        var json:Dynamic = {
            route: route,
            labelIid: labelIid,
            name: name,
            data: data
        };

        new JsonRequest(json, LABEL_UPDATE).requestHeaders().start();
    }

    public static function moveLabel(route: Array<String>, labelIid:String, oldParentLabelIid:String, newParentLabelIid: String):Void {
        var json:Dynamic = {
            route: route,
            labelIid: labelIid,
            oldParentLabelIid: oldParentLabelIid,
            newParentLabelIid: newParentLabelIid
        };

        new JsonRequest(json, LABEL_MOVE).requestHeaders().start();
    }

    public static function copyLabel(route: Array<String>, labelIid:String, newParentLabelIid:String):Void {
        var json:Dynamic = {
            route: route,
            labelIid: labelIid,
            newParentLabelIid: newParentLabelIid
        };

        new JsonRequest(json, LABEL_COPY).requestHeaders().start();
    }

    public static function deleteLabel(route: Array<String>, labelIid:String, parentLabelIid:String):Void {
        var json:Dynamic = {
            route: route,
            labelIid: labelIid,
            parentLabelIid: parentLabelIid
        };

        new JsonRequest(json, LABEL_DELETE).requestHeaders().start();
    }

    public static function grantAccess(route: Array<String>, labelIid:String, connectionIid:String, maxDoV:Int):Void {
        var json:Dynamic = {
            route: route,
            labelIid: labelIid,
            connectionIid: connectionIid,
            maxDoV:maxDoV
        };

        new JsonRequest(json, LABEL_ACCESS_GRANT).requestHeaders().start();
    }

    public static function revokeAccess(route: Array<String>, labelIid:String, connectionIid:String):Void {
        var json:Dynamic = {
            route: route,
            labelIid: labelIid,
            connectionIid: connectionIid
        };

        new JsonRequest(json, LABEL_ACCESS_REVOKE).requestHeaders().start();
    }

    public static function updateAccess(route: Array<String>, labelIid:String, connectionIid:String, maxDoV:Int):Void {
        var json:Dynamic = {
            route: route,
            labelIid: labelIid,
            connectionIid: connectionIid,
            maxDoV:maxDoV
        };

        new JsonRequest(json, LABEL_ACCESS_UPDATE).requestHeaders().start();
    }

	// Notifications

    public static function createNotification(route: Array<String>, kind:String, ?data:String):Void {
        var json:Dynamic = {
            route:route,
            kind: kind,
            data: data
        };

        new JsonRequest(json, NOTIFICATION_CREATE).requestHeaders().start();
    }

    public static function consumeNotification(route: Array<String>, notificationIid:String):Void {
        var json:Dynamic = {
            route:route,
            notificationIid: notificationIid
        };

        new JsonRequest(json, NOTIFICATION_CONSUME).requestHeaders().start();
    }

    public static function deleteNotification(route: Array<String>, notificationIid:String):Void {
        var json:Dynamic = {
            route:route,
            notificationIid: notificationIid
        };

        new JsonRequest(json, NOTIFICATION_DELETE).requestHeaders().start();
    }

	// Introduction
    public static function initiateIntroduction(route: Array<String>, 
                                                aConnectionIid: String, aMessage: String,
                                                bConnectionIid: String, bMessage: String ):Void {
        var json:Dynamic = {
            route:route,
            aConnectionIid: aConnectionIid,
            aMessage: aMessage,
            bConnectionIid: bConnectionIid,
            bMessage: bMessage
        };

        new JsonRequest(json, INTRODUCTION_INITIATE).requestHeaders().start();
    }

    public static function acceptIntroduction(route: Array<String>, notificationIid:String):Void {
        var json:Dynamic = {
            route:route,
            notificationIid: notificationIid
        };

        new JsonRequest(json, INTRODUCTION_ACCEPT).requestHeaders().start();
    }
}