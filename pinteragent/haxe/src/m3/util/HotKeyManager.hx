package m3.util;

import m3.jq.JQ;
import m3.util.Tuple;

using m3.helper.ArrayHelper;

typedef HotKey = {
	var keyCode: Int;
	@:optional var altKey: Bool;
	@:optional var ctrlKey: Bool;
	@:optional var shiftKey: Bool;
}

class HotKeyManager {
	private static var _instance: HotKeyManager;
	public static var get(get,null): HotKeyManager;

	static var HOT_KEY_ACTIONS: Array<JQEvent->Void>;
	static var HOT_KEYS: Array<Tuple<HotKey,Void->Void>>;

	private function new() {
        HOT_KEY_ACTIONS = new Array<JQEvent->Void>();
        HOT_KEYS = new Array<Tuple<HotKey,Void->Void>>();

		new JQ("body").keyup(function(evt: JQEvent) {
            if(HOT_KEY_ACTIONS.hasValues()) {
                for(action in HOT_KEY_ACTIONS) {
                    action(evt);
                }
            }
            if(HOT_KEYS.hasValues()) {
	            for(tuple_ in HOT_KEYS) {
	            	if(evt.keyCode == tuple_.left.keyCode &&
	            		evt.altKey == tuple_.left.altKey &&
	            		evt.ctrlKey == tuple_.left.ctrlKey &&
	            		evt.shiftKey == tuple_.left.shiftKey) {
	            		tuple_.right();
	            	}
	            }
            }
        });
	}

	static function get_get(): HotKeyManager {
		if(_instance == null)
			_instance = new HotKeyManager();
		return _instance;
	}



	public function addHotKeyFcn(fcn: JQEvent->Void) {
		HOT_KEY_ACTIONS.push(fcn);
	}

	public function addHotKey(hotKey: HotKey, fcn: Void->Void) {
		hotKey = JQ.extend({ keyCode: null, altKey: false, ctrlKey: false, shiftKey: false}, hotKey);
		HOT_KEYS.push(new Tuple(hotKey, fcn));
	}

}