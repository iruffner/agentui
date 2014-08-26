package qoid;

import m3.comm.*;

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

    // AGENT
    public static function createAgent(name:String, password:String):Void {
        var json:Dynamic = {name:name, password:password};
        new JsonRequest(json, AGENT_CREATE).start();
    }
    /*
    {
        "authenticationId":"TBD"
    }
    */

    // SESSION
    public static function login(authenticationId:String, password:String):Void {
        var json:Dynamic = {authenticationId:authenticationId, password:password};
        var req = new JsonRequest(json, LOGIN, function(data:Dynamic) {
            var auth:AuthenticationResponse = cast(json);
            QoidAPI.addChannel(auth.channelId);
            QoidAPI.activeChannel = auth.channelId;
        });
        /*
        {
          "channelId":"<channel id>",
          "aliasIid":"<alias iid>"
        }

        403 http response code
        {
            
        }
        */
        req.start();
    }

    public static function logout():Void {
        new JsonRequest({}, LOGOUT).start();
    }

    public static function spawnSession(aliasIid:String):Void {
        var json:Dynamic = {authenticationId:aliasIid};
        var req = new JsonRequest(json, SPAWN, function(data:Dynamic) {
            EventManager.instance.on("sessionSpawned", )
            var auth:AuthenticationResponse = cast(json);
            QoidAPI.addChannel(auth.channelId);
            QoidAPI.activeChannel = auth.channelId;
        });
    }

    // ALIAS
    public static function createAlias(route: Array<String>, name: String, 
    	profileName: String, ?profileImage: String, ?data: Dynamic):Void {
    	// /api/v1/alias/create
    }

    public static function updateAlias(route: Array<String>, aliasIid: String, data: Dynamic):Void {
    	// /api/v1/alias/update
    }

    public static function deleteAlias(route: Array<String>, aliasIid: String):Void {
    	// /api/v1/alias/delete
    }

    public static function createAliasLogin(route: Array<String>, aliasIid: String, password: String):Void {
    	// /api/v1/alias/login/create
    }

    public static function updateAliasLogin(route: Array<String>, aliasIid: String, password: String):Void {
    	// /api/v1/alias/login/update
    }

    public static function deleteAliasLogin(route: Array<String>, aliasIid: String):Void {
    	// /api/v1/alias/login/delete
    }

    public static function updateAliasProfile(route: Array<String>, aliasIid: String, ?profileName:String, ?profileImage:String):Void {
    	// /api/v1/alias/profile/update
    }

    // CONNECTION
    public static function deleteConnection(connectionIid:String):Void {
    	// TBD
    }

    // CONTENT
    public static function createContent(route: Array<String>, contentType: String, data: Dynamic, labelIids: Array<String>):Void {
    	// /api/v1/content/create
    }

    public static function updateContent(connectionIid:String):Void {
    	// TBD
    }

    public static function deleteContent(connectionIid:String):Void {
    	// TBD
    }


    public static function addContentLabel(connectionIid:String):Void {
    	// TBD
    }

    public static function removeContentLabel(connectionIid:String):Void {
    	// TBD
    }

    // LABEL
    public static function createLabel(route: Array<String>, parentLabelIid: String, name:String, data: Dynamic):Void {
    	// /api/v1/label/create
    }

    public static function updateLabel(labelIid:String):Void {
    	// TBD
    }

    public static function moveLabel(labelIid:String):Void {
    	// TBD
    }

    public static function copyLabel(labelIid:String):Void {
    	// TBD
    }

    public static function removeLabel(labelIid:String):Void {
    	// TBD
    }

	// Notification

    public static function consumeNotification():Void {
    	// TBD
    }

	// Introduction
    public static function initiateIntroduction():Void {
    	// TBD
    }

    public static function respondToIntroduction():Void {
    	// TBD
    }

	// Verification
    public static function requestVerification():Void {
    	// TBD
    }

    public static function respondToVerificationRequest():Void {
    	// TBD
    }

    public static function acceptVerification():Void {
    	// TBD
    }

    public static function verify():Void {
    	// TBD
    }
}