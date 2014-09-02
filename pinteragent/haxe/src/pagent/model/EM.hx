package pagent.model;

import m3.log.Logga;
import m3.event.EventManager;

class EMEvent {	
	/* aphoto specific */
	public static var APP_INITIALIZED: String = "";

	/* *************** */
	

	public static var FILTER_RUN;
	public static var FILTER_CHANGE;
	public static var LoadFilteredContent;
	public static var AppendFilteredContent;

	public static var EditContentClosed;

	public static var CreateAgent;
	public static var AgentCreated;
	public static var InitialDataLoadComplete;

	// FitWindow;
	public static var UserLogin;
	public static var UserLogout;

	public static var AliasLoaded;
	public static var AliasCreated;
	public static var AliasUpdated;

	public static var CreateAlias;
	public static var UpdateAlias;
	public static var DeleteAlias;

	public static var CreateContent;
	public static var DeleteContent;
	public static var UpdateContent;

	public static var CreateLabel;
	public static var UpdateLabel;
	public static var MoveLabel;
	public static var CopyLabel;
	public static var DeleteLabel;

	public static var GrantAccess;
	// AccessGranted;
	public static var RevokeAccess;

	public static var DeleteConnection;

	public static var INTRODUCTION_REQUEST;
	// INTRODUCTION_RESPONSE;
	public static var RespondToIntroduction;
	// RespondToIntroduction_RESPONSE;

	public static var TargetChange;

	public static var VerificationRequest;
	// VerificationRequest_RESPONSE;

	public static var RespondToVerification;
	// RespondToVerification_RESPONSE;

	public static var RejectVerificationRequest;
	// RejectVerificationRequest_RESPONSE;
	
	public static var AcceptVerification;
	// AcceptVerification_RESPONSE;

	public static var BACKUP;
	public static var RESTORE;
	// RESTORES_REQUEST;
	// AVAILABLE_BACKUPS;
}

class EM {
	private static var delegate:EventManager;

	private static function __init__(): Void {
		delegate = EventManager.instance;
	}

	public static function addListener<T>(id: String, func: T->Void, ?listenerName:String): String {
		return delegate.addListener(id, func, listenerName);
	}

	public static function listenOnce<T>(id: String, func: T->Void, ?listenerName:String): String {
		return delegate.listenOnce(id, func, listenerName);
	}
	
	public static function removeListener<T>(id: String, listenerUid: String):Void {
		delegate.removeListener(id, listenerUid);
	}

	public static function change<T>(id: String, ?t: T): Void {
		delegate.change(id, t);
	}
}

class Nothing {}