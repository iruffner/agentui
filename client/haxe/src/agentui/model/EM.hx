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
	public static var FILTER_RUN = "FILTER_RUN";
	public static var FILTER_CHANGE = "FILTER_CHANGE";
	public static var LoadFilteredContent = "LoadFilteredContent";
	public static var AppendFilteredContent = "AppendFilteredContent";

	public static var EditContentClosed = "EditContentClosed";

	public static var CreateAgent = "CreateAgent";

	public static var FitWindow = "FitWindow";
	public static var UserLogin = "UserLogin";
	public static var UserLogout = "UserLogout";

	public static var AliasLoaded = "AliasLoaded";
	public static var AliasCreated = "AliasCreated";
	public static var AliasUpdated = "AliasUpdated";

	public static var CreateAlias = "CreateAlias";
	public static var UpdateAlias = "UpdateAlias";
	public static var DeleteAlias = "DeleteAlias";

	public static var CreateContent = "CreateContent";
	public static var DeleteContent = "DeleteContent";
	public static var UpdateContent = "UpdateContent";

	public static var CreateLabel = "CreateLabel";
	public static var UpdateLabel = "UpdateLabel";
	public static var MoveLabel = "MoveLabel";
	public static var CopyLabel = "CopyLabel";
	public static var DeleteLabel = "DeleteLabel";

	public static var GrantAccess = "GrantAccess";
	public static var AccessGranted = "AccessGranted";
	public static var RevokeAccess = "RevokeAccess";

	public static var DeleteConnection = "DeleteConnection";

	public static var INTRODUCTION_REQUEST = "INTRODUCTION_REQUEST";
	public static var INTRODUCTION_RESPONSE = "INTRODUCTION_RESPONSE";
	public static var RespondToIntroduction = "RespondToIntroduction";
	public static var RespondToIntroduction_RESPONSE = "RespondToIntroduction_RESPONSE";

	public static var TargetChange = "TargetChange";

	public static var VerificationRequest = "VerificationRequest";
	public static var VerificationRequest_RESPONSE = "VerificationRequest_RESPONSE";

	public static var RespondToVerification = "RespondToVerification";
	public static var RespondToVerification_RESPONSE = "RespondToVerification_RESPONSE";

	public static var RejectVerificationRequest = "RejectVerificationRequest";
	public static var RejectVerificationRequest_RESPONSE = "RejectVerificationRequest_RESPONSE";
	
	public static var AcceptVerification = "AcceptVerification";
	public static var AcceptVerification_RESPONSE = "AcceptVerification_RESPONSE";

	public static var RejectVerification = "RejectVerification";
	public static var RejectVerification_RESPONSE = "RejectVerification_RESPONSE";

	public static var BACKUP  = "BACKUP";
	public static var RESTORE = "RESTORE";
	public static var RESTORES_REQUEST  = "RESTORES_REQUEST";
	public static var AVAILABLE_BACKUPS = "AVAILABLE_BACKUPS";
}