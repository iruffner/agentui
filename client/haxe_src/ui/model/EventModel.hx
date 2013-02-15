package ui.model;

import ui.util.UidGenerator;

using ui.helper.ArrayHelper;

class EventModel {
	private static var hash: Hash<Array<EventListener>>;

	private static function __init__(): Void {
		hash = new Hash<Array<EventListener>>();
	}

	public static function addListener<T>(id: String, listener: EventListener) {
		var arr: Array<EventListener> = hash.get(id);
		if(arr == null) {
			arr = new Array<EventListener>();
			hash.set(id, arr);
		}
		arr.push(listener);
	}

	public static function change<T>(id: String, t: T): Void {
		ui.AgentUi.LOGGER.debug("EVENTMODEL: Change to " + id);
		var arr: Array<EventListener> = hash.get(id);
		if(arr.hasValues()) {
			for(l_ in 0...arr.length) {
				arr[l_].change(t);
			}
		}
	}
}


class EventListener {
	var fcn: Dynamic;
	var uid: String;

	public function new<T>(fcn: T->Void) {
		this.fcn = fcn;
		uid = UidGenerator.create(10);
	}
	public function change<T>(t: T): Void {
		this.fcn(t);
	}
}