package ui.model;

import m3.log.Logga;
import m3.event.EventManager;

class EM {
	private static var delegate:EventManager<EMEvent>;

	private static function __init__(): Void {
		delegate = new EventManager<EMEvent>(AppContext.LOGGER);
	}

	public static function setLogger(l:Logga) {
		delegate.setLogger(l);
	}

	public static function addListener<T>(id: EMEvent, func: T->Void, ?listenerName:String): String {
		var listener = new EMListener(func, listenerName);
		return delegate.addListener(id, listener);
	}

	public static function listenOnce<T>(id: EMEvent, func: T->Void, ?listenerName:String): String {
		var listener = new EMListener(func, listenerName);
		return delegate.listenOnce(id, listener);
	}
	
	public static function removeListener<T>(id: EMEvent, listenerUid: String):Void {
		delegate.removeListener(id, listenerUid);
	}

	public static function change<T>(id: EMEvent, ?t: T): Void {
		delegate.change(id, t);
	}
}

class Nothing {}

enum EMEvent {
	
	FILTER_RUN;
	FILTER_CHANGE;
	LoadFilteredContent;

	EditContentClosed;

	CreateAgent;
	AgentCreated;
	InitialDataLoadComplete;

	FitWindow;
	UserLogin;
	UserLogout;

	AliasLoaded;

	CreateAlias;
	UpdateAlias;
	DeleteAlias;

	CreateContent;
	DeleteContent;
	UpdateContent;

	CreateLabel;
	UpdateLabel;
	MoveLabel;
	CopyLabel;
	DeleteLabel;

	GrantAccess;
	AccessGranted;
	RevokeAccess;

	DeleteConnection;

	INTRODUCTION_REQUEST;
	INTRODUCTION_RESPONSE;
	RespondToIntroduction;
	RespondToIntroduction_RESPONSE;

	TargetChange;

	BACKUP;
	RESTORE;
	RESTORES_REQUEST;
	AVAILABLE_BACKUPS;
}