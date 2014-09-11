package pagent.model;

import m3.log.Logga;
import m3.event.EventManager;

class EMEvent {	
	/* pinteragent specific */
	public static inline var APP_INITIALIZED: String = "APP_INITIALIZED";

	public static inline var OnBoardConfig: String = "onBoardConfig";
	public static inline var OnConnectionBoards: String = "onConnectionBoards";
	public static inline var OnConnectionBoardConfigs: String = "onConnectionBoardConfigs";
	/* *************** */
	

	public static inline var FILTER_RUN: String = "FILTER_RUN";
	public static inline var FILTER_CHANGE: String = "FILTER_CHANGE";
	public static inline var OnFilteredContent: String = "onFilteredContent";

	public static inline var EditContentClosed: String = "EditContentClosed";

	public static inline var CreateAgent: String = "CreateAgent";

	public static inline var UserLogout: String = "UserLogout";

	public static inline var CreateAlias: String = "CreateAlias";
	public static inline var UpdateAlias: String = "UpdateAlias";
	public static inline var DeleteAlias: String = "DeleteAlias";

	public static inline var CreateContent: String = "CreateContent";
	public static inline var DeleteContent: String = "DeleteContent";
	public static inline var UpdateContent: String = "UpdateContent";

	public static inline var CreateLabel: String = "CreateLabel";
	public static inline var UpdateLabel: String = "UpdateLabel";
	public static inline var MoveLabel: String = "MoveLabel";
	public static inline var CopyLabel: String = "CopyLabel";
	public static inline var DeleteLabel: String = "DeleteLabel";

	public static inline var GrantAccess: String = "GrantAccess";
	public static inline var AccessGranted: String = "AccessGranted";
	public static inline var RevokeAccess: String = "RevokeAccess";

	public static inline var DeleteConnection: String = "DeleteConnection";

	public static inline var INTRODUCTION_REQUEST: String = "INTRODUCTION_REQUEST";
	// INTRODUCTION_RESPONSE;
	public static inline var RespondToIntroduction: String = "RespondToIntroduction";
	// RespondToIntroduction_RESPONSE;

	public static inline var TargetChange: String = "TargetChange";

	public static inline var VerificationRequest: String = "VerificationRequest";
	// VerificationRequest_RESPONSE;

	public static inline var RespondToVerification: String = "RespondToVerification";
	// RespondToVerification_RESPONSE;

	public static inline var RejectVerificationRequest: String = "RejectVerificationRequest";
	// RejectVerificationRequest_RESPONSE;
	
	public static inline var AcceptVerification: String = "AcceptVerification";
	// AcceptVerification_RESPONSE;

	public static inline var BACKUP: String = "BACKUP";
	public static inline var RESTORE: String = "RESTORE";
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