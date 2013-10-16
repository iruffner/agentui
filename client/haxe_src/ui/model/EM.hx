package ui.model;

import m3.util.UidGenerator;

using m3.helper.ArrayHelper;

class EM {
	private static var hash: Map<EMEvent,Map<String,EMListener>>;
	private static var oneTimers: Array<String>;

	private static function __init__(): Void {
		hash = new Map<EMEvent,Map<String,EMListener>>();
		oneTimers = new Array<String>();
	}

	public static function addListener<T>(id: EMEvent, listener: EMListener): String {
		var map: Map<String, EMListener> = hash.get(id);
		if(map == null) {
			map = new Map<String, EMListener>();
			hash.set(id, map);
		}
		map.set(listener.uid, listener);
		return listener.uid;
	}

	public static function listenOnce<T>(id: EMEvent, listener: EMListener): String {
		var map: Map<String, EMListener> = hash.get(id);
		oneTimers.push(listener.uid);
		return addListener(id, listener);
	}

	public static function removeListener<T>(id: EMEvent, listenerUid: String) {
		var map: Map<String, EMListener> = hash.get(id);
		if(map != null) {
			map.remove(listenerUid);
		}
	}

	public static function change<T>(id: EMEvent, ?t: T): Void {
		AgentUi.LOGGER.debug("EVENTMODEL: Change to " + id);
		var map: Map<String, EMListener> = hash.get(id);
		if(map == null) {
			AgentUi.LOGGER.warn("No listeners for event " + id);
			return;
		}
		var iter: Iterator<EMListener> = map.iterator();
		while(iter.hasNext()) {
			var listener: EMListener = iter.next();
			AgentUi.LOGGER.debug("Notifying " + listener.name + " of " + id + " event");
			listener.change(t);
			if(oneTimers.remove(listener.uid)) {
				map.remove(listener.uid);
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

class Nothing {}

enum EMEvent {
	FILTER_RUN; //occurs when filter is in live mode and there is a change to the filter, or the filter is switched to live mode
	FILTER_CHANGE; //occurs when filter is in build mode and there is a change to the filter

	MoreContent;
	NextContent;
	EndOfContent;
	NewContentCreated;

	LoadAlias;
	AliasLoaded;
	AliasConnectionsLoaded;
	AliasLabelsLoaded;
	AliasCreate;

	USER_LOGIN;
	USER_CREATE;
	USER_UPDATE;
	USER_SIGNUP;
	USER_VALIDATE; //occurs when the SignupConfirmationDialog attempts to validate a user
	USER_VALIDATED; //occurs when a user has successfully validated
	USER;

	FitWindow;

	CreateLabel;

	INTRODUCTION_REQUEST;
	INTRODUCTION_RESPONSE;
}