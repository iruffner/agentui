package agentui.model;

import m3.event.EventManager;

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

class EMEvent {
	public static inline var FILTER_RUN = "FILTER_RUN";
	public static inline var FILTER_CHANGE = "FILTER_CHANGE";
	public static inline var OnFilteredContent: String = "onFilteredContent";
	public static inline var AppendFilteredContent = "AppendFilteredContent";

	public static inline var EditContentClosed = "EditContentClosed";

	public static inline var CreateAgent = "CreateAgent";

	public static inline var FitWindow = "FitWindow";
	public static inline var UserLogout = "UserLogout";

	public static inline var UpdateAlias = "UpdateAlias";
	public static inline var DeleteAlias = "DeleteAlias";

	public static inline var CreateContent = "CreateContent";
	public static inline var DeleteContent = "DeleteContent";
	public static inline var UpdateContent = "UpdateContent";

	public static inline var CreateLabel = "CreateLabel";
	public static inline var UpdateLabel = "UpdateLabel";
	public static inline var MoveLabel = "MoveLabel";
	public static inline var CopyLabel = "CopyLabel";
	public static inline var DeleteLabel = "DeleteLabel";

	public static inline var GrantAccess = "GrantAccess";
	public static inline var AccessGranted = "AccessGranted";
	public static inline var RevokeAccess = "RevokeAccess";

	public static inline var DeleteConnection = "DeleteConnection";

	public static inline var INTRODUCTION_RESPONSE = "INTRODUCTION_RESPONSE";
	public static inline var RespondToIntroduction = "RespondToIntroduction";

	public static inline var OnConsumeNotification = "onConsumeNotification";
	public static inline var OnAcceptIntroduction  = "onAcceptIntroduction";

	public static inline var TargetChange = "TargetChange";

	public static inline var VerificationRequest = "VerificationRequest";
	public static inline var VerificationRequest_RESPONSE = "VerificationRequest_RESPONSE";

	public static inline var RespondToVerification = "RespondToVerification";
	public static inline var RespondToVerification_RESPONSE = "RespondToVerification_RESPONSE";

	public static inline var RejectVerificationRequest = "RejectVerificationRequest";
	public static inline var RejectVerificationRequest_RESPONSE = "RejectVerificationRequest_RESPONSE";
	
	public static inline var AcceptVerification = "AcceptVerification";
	public static inline var AcceptVerification_RESPONSE = "AcceptVerification_RESPONSE";

	public static inline var RejectVerification = "RejectVerification";
	public static inline var RejectVerification_RESPONSE = "RejectVerification_RESPONSE";

	public static inline var BACKUP  = "BACKUP";
	public static inline var RESTORE = "RESTORE";
	public static inline var RESTORES_REQUEST  = "RESTORES_REQUEST";
	public static inline var AVAILABLE_BACKUPS = "AVAILABLE_BACKUPS";
}