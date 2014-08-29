package pagent.model;

import m3.log.Logga;
import m3.event.EventManager;

enum EMEvent {	
	/* aphoto specific */
	APP_INITIALIZED;

	/* *************** */
	

	FILTER_RUN;
	FILTER_CHANGE;
	LoadFilteredContent;
	AppendFilteredContent;

	EditContentClosed;

	CreateAgent;
	AgentCreated;
	InitialDataLoadComplete;

	// FitWindow;
	UserLogin;
	UserLogout;

	AliasLoaded;
	AliasCreated;
	AliasUpdated;

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
	// AccessGranted;
	RevokeAccess;

	DeleteConnection;

	INTRODUCTION_REQUEST;
	// INTRODUCTION_RESPONSE;
	RespondToIntroduction;
	// RespondToIntroduction_RESPONSE;

	TargetChange;

	VerificationRequest;
	// VerificationRequest_RESPONSE;

	RespondToVerification;
	// RespondToVerification_RESPONSE;

	RejectVerificationRequest;
	// RejectVerificationRequest_RESPONSE;
	
	AcceptVerification;
	// AcceptVerification_RESPONSE;

	BACKUP;
	RESTORE;
	// RESTORES_REQUEST;
	// AVAILABLE_BACKUPS;
}

class EM {
	private static var delegate:EventManager<EMEvent>;

	private static function __init__(): Void {
		delegate = new EventManager<EMEvent>(	);
	}

	public static function addListener<T>(id: EMEvent, func: T->Void, ?listenerName:String): String {
		return delegate.addListener(id, func, listenerName);
	}

	public static function listenOnce<T>(id: EMEvent, func: T->Void, ?listenerName:String): String {
		return delegate.listenOnce(id, func, listenerName);
	}
	
	public static function removeListener<T>(id: EMEvent, listenerUid: String):Void {
		delegate.removeListener(id, listenerUid);
	}

	public static function change<T>(id: EMEvent, ?t: T): Void {
		delegate.change(id, t);
	}
}

class Nothing {}