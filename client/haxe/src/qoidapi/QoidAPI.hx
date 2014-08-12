package qoidapi;

@:expose
class QoidAPI {
	public static function main() {
    }

    // AGENT
    public static function createAgent(name:String, password:String):Void {
    	// /api/v1/agent/create
    }

    // SESSION
    public static function login(authenticationId:String, password:String):Void {
    	// /api/v1/login
    }

    public static function logout():Void {
    	// /api/v1/logout
    }

    public static function spawnSession():Void {
    	// /api/v1/session/spawn
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