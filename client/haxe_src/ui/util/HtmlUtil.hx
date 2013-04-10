package ui.util;

using ui.helper.ArrayHelper;
using Lambda;

class HtmlUtil {
	
	public static function readCookie(name:String):Dynamic {
		return js.Cookie.get(name);
	}

	public static function setCookie(name:String, value:Dynamic) {
		js.Cookie.set(name, value);
	}

	public static function getUrlVars(): Dynamic<String> {
		var vars:Dynamic<String> = cast {};
		var hash:Array<String>;
	    var hashes = js.Lib.window.location.search.substr(1).split('&');
	    for(i_ in 0...hashes.length) {
	        hash = hashes[i_].split('=');
	        Reflect.setField(vars, hash[0], hash[1]);
	    }
	    return vars;
	}
}