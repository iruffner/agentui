package m3.jqm;

import m3.jq.JQ;
import m3.jqm.JQMobile;

import m3.log.Logga;

using m3.helper.ArrayHelper;


class JQMobileLoader {
	static var activeCalls: Array<String>;


	public static function showLoader(name: String): Void {
		if(activeCalls == null) activeCalls = new Array();
		if(name == null) {
            Logga.DEFAULT.error("Cannot show loading gif if name is undefined");
            return;
        }
        activeCalls.push(name);
        Logga.DEFAULT.debug("Show (" + name + ") | Open calls " + activeCalls.join(","));
        if(activeCalls.length == 1) {
            JQMobile.showLoader();
        }
	}

	public static function hideLoader(name: String): Void {
		if(activeCalls == null) activeCalls = new Array();
		if(name == null) {
            Logga.DEFAULT.error("Cannot hide loading gif if name is undefined");
            return;
        }
        activeCalls.splice(activeCalls.indexOf(name), 1);
        Logga.DEFAULT.debug("Hide (" + name + ") | Open calls " + activeCalls.join(","));
        if(activeCalls.length == 0) {
            JQMobile.hideLoader();
        }
	}
}