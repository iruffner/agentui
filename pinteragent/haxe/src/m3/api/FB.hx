package m3.api;

import m3.api.FBResponse;

@:native("FB")
extern class FB {
	//CORE METHODS
	@:overload(function(path: String, method: String, cb: FBResponse->Void):Void{})
	@:overload(function(path: String, method: String, params: Dynamic, cb: FBResponse->Void):Void{})
	public static function api(path: String, cb: FBResponse->Void): Void;
	public static function init(opts: FBInitOptions): Void;
	public static function ui(params: Dynamic, cb: Dynamic->Void): Void;

	//AUTH METHODS
	public static function getAuthResponse(): AuthResponse; //Synchronous
	public static function getLoginStatus(cb: FBLoginResponse->Void, force: Bool): Void;
	public static function login(cb: FBLoginResponse->Void, opts: FBLoginOpts): Void;
	public static function logout(cb: FBResponse->Void): Void;
}

@:native("FB.Event")
extern class FBEvent {
	public static function subscribe(name: String, cb: Dynamic->Void): Void;
	public static function unsubscribe(name: String, cb: Dynamic->Void): Void;
}

@:native("FB.XFBML")
extern class XFBML {
	public static function parse(): Void;
}

typedef FBLoginOpts = {
	@:optional var scope: String;
	@:optional var auth_type: String;
	@:optional var auth_nonce: String;
}

typedef FBInitOptions = {
	@:optional var appId: String;//null
	@:optional var cookie: Bool;//false -> true to enable cookie support
	@:optional var logging: Bool;//true -> false to disable logging
	@:optional var status: Bool;//true -> true to fetch status
	@:optional var xfbml: Bool;//false -> true to parse xfbml tags
	@:optional var channelUrl: String;//null -> Specifies the URL of a custom URL channel file
	@:optional var authResponse: Dynamic;//true -> Manually set the object retrievable from getAuthResponse
	@:optional var frictionlessRequests: Bool;//false
	@:optional var hideFlashCallback: Dynamic;//null
	@:optional var useCachedDialogs: Bool;
	@:optional var nativeInterface: Dynamic;
}