package m3.util;

using m3.helper.ArrayHelper;
using m3.helper.StringHelper;
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
	    var hashes = js.Browser.window.location.search.substr(1).split('&');
	    for(i_ in 0...hashes.length) {
	        hash = hashes[i_].split('=');
	        Reflect.setField(vars, hash[0], hash[1]);
	    }
	    return vars;
	}

	public static function getUrlHash(): String {
		return js.Browser.window.location.hash;
	}

	public static function getAndroidVersion(): Float {
		var ua: String = js.Browser.navigator.userAgent;
		var regex: EReg = ~/Android\s([0-9\.]*)/;
	    var match = regex.match(ua);
	    var version: String = match ? regex.matched(1) : null;

	    if(version.isNotBlank()) {
	    	try {
	    		return Std.parseFloat(version);
    		} catch (err: Dynamic) {
    			m3.log.Logga.DEFAULT.error("Error parsing android version | " + version);
    		}
	    }
		return null;
	}
}