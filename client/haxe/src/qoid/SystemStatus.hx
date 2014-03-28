package qoid;

import m3.jq.JQ;

/**
 * Class defined to hold and show the status of the system
 */
class SystemStatus {
	private static var CONNECTED = "svg/notification-network-ethernet-connected.svg";
	private static var DISCONNECTED = "svg/notification-network-ethernet-disconnected.svg";

    private static var _instance:SystemStatus = null;

    public static function instance(): SystemStatus {
        if (_instance == null) {
            _instance = new SystemStatus();
        }
        return _instance;
    }

    private var lastPong:Date;
    private var timer:haxe.Timer;

    private function new() {
    	lastPong = Date.now();
    	timer = new haxe.Timer(7000);
    	timer.run = this.onTimer;
    }

    private function onTimer():Void {
    	var src = "svg/notification-network-ethernet-connected.svg";
    	if ((Date.now().getTime() - lastPong.getTime()) > 7000) {
        	src = "svg/notification-network-ethernet-disconnected.svg";
    	}
		new JQ("#disconnected-indicator").attr("src", src);
    }

    public function onMessage() {
        lastPong = Date.now();
        new JQ("#disconnected-indicator").attr("src", "svg/notification-network-ethernet-connected.svg");
    }
}
