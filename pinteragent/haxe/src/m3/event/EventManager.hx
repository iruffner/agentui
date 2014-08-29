package m3.event;
import haxe.ds.EnumValueMap;
import m3.util.UidGenerator;
import m3.log.Logga;

using m3.helper.ArrayHelper;

class EventManager<U:(EnumValue)> {
	private var hash: EnumValueMap<U, Map<String,EMListener>>;
	private var oneTimers: Array<String>;
	private var logger(get,null): Logga;
	private var _logger: Logga;

	public function new(): Void {
		this.hash = new EnumValueMap<U, Map<String,EMListener>>();
		this.oneTimers = new Array<String>();
	}

	private function get_logger(): Logga {
		if(_logger == null)
			_logger = Logga.DEFAULT;
		return _logger;
	}

	public function addListener<T>(id: U, func: T->Void, ?listenerName:String): String {
		var listener = new EMListener(func, listenerName);
		return addListenerInternal(id, listener);
	}

	private function addListenerInternal<T>(id: U, listener: EMListener): String {
		var map: Map<String, EMListener> = hash.get(id);
		if(map == null) {
			map = new Map<String, EMListener>();
			hash.set(id, map);
		}
		map.set(listener.uid, listener);
		return listener.uid;
	}

	public function listenOnce<T>(id: U, func: T->Void, ?listenerName:String): String {
		var listener = new EMListener(func, listenerName);
		return listenOnceInternal(id, listener);
	}

	private function listenOnceInternal<T>(id: U, listener: EMListener): String {
		var map: Map<String, EMListener> = hash.get(id);
		oneTimers.push(listener.uid);
		return addListenerInternal(id, listener);
	}

	public function removeListener<T>(id: U, listenerUid: String):Void {
		var map: Map<String, EMListener> = hash.get(id);
		if(map != null) {
			map.remove(listenerUid);
		}
	}

	public function change<T>(id: U, ?t: T): Void {
		this.logger.debug("EVENTMODEL: Change to " + id);
		var map: Map<String, EMListener> = hash.get(id);
		if(map == null) {
			this.logger.warn("No listeners for event " + id);
			return;
		}
		var iter: Iterator<EMListener> = map.iterator();
		while(iter.hasNext()) {
			var listener: EMListener = iter.next();
			this.logger.debug("Notifying " + listener.name + " of " + id + " event");
			try {
				listener.change(t);
				if(oneTimers.remove(listener.uid)) {
					map.remove(listener.uid);
				}
			} catch(err: Dynamic) {
				this.logger.error("Error executing " + listener.name + " of " + id + " event", Logga.getExceptionInst(err));
			}
		}
	}
}


class EMListener {
	var fcn: Dynamic;
	@:isVar public var uid(get,null): String;
	@:isVar public var name(get,null): String;

	public function new<T>(fcn: T->Void, ?name: String) {
		this.fcn = fcn;
		this.uid = UidGenerator.create(20);
		this.name = name == null ? uid : name;
	}
	public function change<T>(t: T): Void {
		this.fcn(t);
	}
	function get_uid(): String {
		return this.uid;
	}
	function get_name(): String {
		return this.name;
	}
}
