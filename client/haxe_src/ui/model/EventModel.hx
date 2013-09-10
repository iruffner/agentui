package ui.model;

import m3.util.UidGenerator;

using m3.helper.ArrayHelper;

class EventModel {
	private static var hash: Map<String,Array<EventListener>>;

	private static function __init__(): Void {
		hash = new Map<String,Array<EventListener>>();
	}

	public static function addListener<T>(id: ModelEvents, listener: EventListener) {
		var arr: Array<EventListener> = hash.get(Std.string(id));
		if(arr == null) {
			arr = new Array<EventListener>();
			hash.set(Std.string(id), arr);
		}
		arr.push(listener);
	}

	public static function change<T>(id: ModelEvents, ?t: T): Void {
		ui.AgentUi.LOGGER.debug("EVENTMODEL: Change to " + id);
		var arr: Array<EventListener> = hash.get(Std.string(id));
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