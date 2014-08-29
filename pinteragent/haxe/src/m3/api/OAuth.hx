package m3.api;

import m3.jq.JQ;

@:native("OAuth")
extern class OAuth {
	public static function initialize(publicKey:String, ?options:Dynamic):Void;
	public static function redirect(provider:String, urlCallback:String):Void;
	public static function callback(provider:String):JQXHR;
	public static function popup(provider:String, options:Dynamic, callback:Dynamic->Dynamic->Void):Dynamic;
	public static function create(provider:String, tokens:Dynamic, requestDescription:Dynamic):Dynamic;
	public static function clearCache(provider:String):Void;
	public static function getVersion():String;
}

extern class OAuthResult {
	public var access_token: String;
	public var oauth_token: String;
	public var oauth_token_secret: String;

	public function new(){}

	public function me(): Dynamic;

	@:overload(function(url : String): JQXHR{})
	@:overload(function(url : String, ajaxOptions: AjaxOptions): JQXHR{})
	public function get(opts: AjaxOptions): JQXHR;

	@:overload(function(url : String): JQXHR{})
	@:overload(function(url : String, ajaxOptions: AjaxOptions): JQXHR{})
	public function post(opts: AjaxOptions): JQXHR;

	@:overload(function(url : String): JQXHR{})
	@:overload(function(url : String, ajaxOptions: AjaxOptions): JQXHR{})
	public function put(opts: AjaxOptions): JQXHR;

	@:overload(function(url : String): JQXHR{})
	@:overload(function(url : String, ajaxOptions: AjaxOptions): JQXHR{})
	public function patch(opts: AjaxOptions): JQXHR;

	@:overload(function(url : String): JQXHR{})
	@:overload(function(url : String, ajaxOptions: AjaxOptions): JQXHR{})
	public function del(opts: AjaxOptions): JQXHR;
}
