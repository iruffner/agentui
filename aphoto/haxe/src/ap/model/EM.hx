package ap.model;

import m3.log.Logga;
import m3.event.EventManager;

class EMEvent {	
	/* aphoto specific */
	public static var APP_INITIALIZED: String = "APP_INITIALIZED";
	public static var ALBUM_CONFIGS: String = "ALBUM_CONFIGS";
	/* *************** */
	

	public static var FILTER_RUN: String = "FILTER_RUN";
	public static var FILTER_CHANGE: String = "FILTER_CHANGE";
	public static var LoadFilteredContent: String = "LoadFilteredContent";
	public static var AppendFilteredContent: String = "AppendFilteredContent";

	public static var EditContentClosed: String = "EditContentClosed";

	public static var CreateAgent: String = "CreateAgent";
	public static var AgentCreated: String = "AgentCreated";
	public static var InitialDataLoadComplete: String = "InitialDataLoadComplete";

	// FitWindow;
	public static var UserLogin: String = "UserLogin";
	public static var UserLogout: String = "UserLogout";

	public static var AliasLoaded: String = "AliasLoaded";
	public static var AliasCreated: String = "AliasCreated";
	public static var AliasUpdated: String = "AliasUpdated";

	public static var CreateAlias: String = "CreateAlias";
	public static var UpdateAlias: String = "UpdateAlias";
	public static var DeleteAlias: String = "DeleteAlias";

	public static var CreateContent: String = "CreateContent";
	public static var DeleteContent: String = "DeleteContent";
	public static var UpdateContent: String = "UpdateContent";

	public static var CreateLabel: String = "CreateLabel";
	public static var UpdateLabel: String = "UpdateLabel";
	public static var MoveLabel: String = "MoveLabel";
	public static var CopyLabel: String = "CopyLabel";
	public static var DeleteLabel: String = "DeleteLabel";

	public static var GrantAccess: String = "GrantAccess";
	// AccessGranted;
	public static var RevokeAccess: String = "RevokeAccess";

	public static var DeleteConnection: String = "DeleteConnection";

	public static var INTRODUCTION_REQUEST: String = "INTRODUCTION_REQUEST";
	// INTRODUCTION_RESPONSE;
	public static var RespondToIntroduction: String = "RespondToIntroduction";
	// RespondToIntroduction_RESPONSE;

	public static var TargetChange: String = "TargetChange";

	public static var VerificationRequest: String = "VerificationRequest";
	// VerificationRequest_RESPONSE;

	public static var RespondToVerification: String = "RespondToVerification";
	// RespondToVerification_RESPONSE;

	public static var RejectVerificationRequest: String = "RejectVerificationRequest";
	// RejectVerificationRequest_RESPONSE;
	
	public static var AcceptVerification: String = "AcceptVerification";
	// AcceptVerification_RESPONSE;

	public static var BACKUP: String = "BACKUP";
	public static var RESTORE: String = "RESTORE";
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