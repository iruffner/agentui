package m3.util;

using m3.helper.ArrayHelper;
using m3.helper.StringHelper;
using Lambda;

class BrowserUtil {
	public static var msie(get, null): Bool;
	public static var version(get, null): String;

	static function get_msie(): Bool {
		return ~/MSIE ([0-9]+)\./.match(js.Browser.navigator.userAgent);
	}

	static function get_version(): String {
		var ereg: EReg = ~/MSIE ([0-9]+)\./;
		
		if(ereg.match(js.Browser.navigator.userAgent)) {
			return ereg.matched(1);
		} else {
			return null;
		}
	}
}
