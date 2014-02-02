package ui.api;

import ui.model.ModelObj;
import ui.model.Filter;
import m3.exception.Exception;

import ui.helper.PrologHelper;

using m3.helper.ArrayHelper;
using m3.helper.StringHelper;

interface HasContent<T> {
	function getContent(): T;
}

@:rtti
class ProtocolMessage<T>  {
	public var msgType(default, null): MsgType;
	@:isVar var content: Dynamic;

	@:transient public var contentImpl: T;
	@:transient var type: Class<T>;


	public function new(msgType: MsgType, type: Class<T>) {
		this.msgType = msgType;
		this.type = type;
		this.contentImpl = Type.createInstance(type, []);
	}

	private function readResolve(): Void {
		contentImpl = AppContext.SERIALIZER.fromJsonX(this.content, this.type);
	}

	private function writeResolve(): Void {
		this.content = AppContext.SERIALIZER.toJson(this.contentImpl);
	}
}

@:rtti
class Payload {
	public function new() {}
}

class PayloadWithSessionURI extends Payload {
	public var sessionURI: String;

	public function new() {
		super();
		if (AppContext.AGENT != null) {
			this.sessionURI = AppContext.AGENT.sessionURI;
		}
	}
}

class PayloadWithReason extends Payload {
	public var reason: String;
}

class ErrorPayload extends PayloadWithSessionURI {
	public var reason: String;
}

/** 
	Create User Request/Response 
**/
class CreateUserRequest extends ProtocolMessage<UserRequestData> {
	public function new() {
		super(MsgType.createUserRequest, UserRequestData);
	}
}

		class UserRequestData extends Payload {
			public var email: String;
			public var password: String;
			public var jsonBlob: Dynamic;
		}

class CreateUserError extends ProtocolMessage<PayloadWithReason> {
	public function new() {
		super(MsgType.createUserError, PayloadWithReason);
	}
}


class CreateUserWaiting extends ProtocolMessage<Payload> {
	public function new() {
		super(MsgType.createUserWaiting, Payload);
	}
}

class ConfirmUserToken extends ProtocolMessage<ConfirmUserTokenData> {
	public function new() {
		super(MsgType.confirmEmailToken, ConfirmUserTokenData);
	}
}

		class ConfirmUserTokenData extends Payload {
			public var token: String;
		}
		
class CreateUserResponse extends ProtocolMessage<CreateUserResponseData> {
	public function new() {
		super(MsgType.createUserResponse, CreateUserResponseData);
	}
}

		class CreateUserResponseData extends Payload {
			public var agentURI: String;
		}

/** 
	Initialize Session Request/Response 
**/
class InitializeSessionRequest extends ProtocolMessage<InitializeSessionRequestData> {
	public function new() {
		super(MsgType.initializeSessionRequest, InitializeSessionRequestData);
	}
}

		class InitializeSessionRequestData extends Payload {
			public var agentURI: String;
		}

class InitializeSessionResponse extends ProtocolMessage<InitializeSessionResponseData> {
	public function new() {
		super(MsgType.initializeSessionResponse, InitializeSessionResponseData);
	}
}

		class InitializeSessionResponseData extends Payload {
			public var sessionURI: String;
			public var listOfAliases: Array<String>;
			public var defaultAlias: String;
			public var listOfConnections: Array<Connection>;
			public var lastActiveLabel: String;
			public var jsonBlob: UserData;
			var listOfLabels: Array<String>;
			@:transient public var labels(get,never): Array<Label>;

			function get_labels(): Array<Label> {
				if(listOfLabels.hasValues()) {
					var labels: Array<Label> = [];
					var i: Int;
					for (i in 0...listOfLabels.length) {
						labels = labels.concat(PrologHelper.tagTreeFromString(listOfLabels[i]));
					}
					return labels;
				}
				else return null;
			}
		}

class InitializeSessionError extends ProtocolMessage<PayloadWithReason> {
	public function new() {
		super(MsgType.initializeSessionError, PayloadWithReason);
	}
}

class ConnectionProfileResponse extends ProtocolMessage<ConnectionProfileResponseData> {
	public function new() {
		super(MsgType.connectionProfileResponse, ConnectionProfileResponseData);
	}
}

		class ConnectionProfileResponseData extends PayloadWithSessionURI {
			public var connection: Connection;
			// public var jsonBlob: UserData;
			var jsonBlob: String;

			@:transient public var profile: UserData;

			private function readResolve(): Void {
				if(jsonBlob.isNotBlank()) {
					var p: Dynamic = haxe.Json.parse(jsonBlob);
					profile = AppContext.SERIALIZER.fromJsonX(p, UserData);
				} else {
					profile = new UserData();
				}
			}
		}

/** 
	Close Session Request/Response 
**/
class CloseSessionRequest extends ProtocolMessage<PayloadWithSessionURI> {
	public function new() {
		super(MsgType.closeSessionRequest, PayloadWithSessionURI);
	}
}

class CloseSessionResponse extends ProtocolMessage<PayloadWithSessionURI> {
	public function new() {
		super(MsgType.closeSessionResponse, PayloadWithSessionURI);
	}
}

class FeedExpr extends ProtocolMessage<FeedExprData> {
	public function new() {
		super(MsgType.feedExpr, FeedExprData);
	}
}

		class FeedExprData extends Payload {
			public var cnxns: Array<Connection>;
			public var label: String;
			// public var uid: String; // this is a valid option, but currently have no UI actions that would warrant it
		}

class InsertContent extends ProtocolMessage<InsertContentData> {
	public function new() {
		super(MsgType.insertContent, InsertContentData);
	}
}
		class InsertContentData extends Payload {
			public var cnxns: Array<Connection>;
			public var label: String;
			public var value: String;
			public var uid: String;
		}

/** 
	Aliases 
**/
class BaseAgentAliasesRequest extends ProtocolMessage<AgentAliasesRequestData> {
	public function new(msgType: MsgType) {
		super(msgType, AgentAliasesRequestData);
	}
}

		class AgentAliasesRequestData extends PayloadWithSessionURI {
			public var aliases: Array<String>;
		}

class BaseAgentAliasRequest extends ProtocolMessage<AgentAliasRequestData> {
	public function new(msgType: MsgType) {
		super(msgType, AgentAliasRequestData);
	}
}

		class AgentAliasRequestData extends PayloadWithSessionURI {
			public var alias: String;
		}

		class AliasLabelsRequestData extends PayloadWithSessionURI {
			var labels: Array<String>;
			@:transient public var aliasLabels(get,never): Array<Label>;

			function get_aliasLabels(): Array<Label> {
				if(labels.hasValues()) {
					var aliasLabels: Array<Label> = [];
					var i: Int;
					for (i in 0...labels.length) {
						aliasLabels = aliasLabels.concat(PrologHelper.tagTreeFromString(labels[i]));
					}
					return aliasLabels;
				}
				else return null;
			}
		}

/** 
	Introductions 
**/
class BeginIntroductionRequest extends ProtocolMessage<BeginIntroductionRequestData> {
	public function new() {
		super(MsgType.beginIntroductionRequest, BeginIntroductionRequestData);
	}
}
	class BeginIntroductionRequestData extends PayloadWithSessionURI {
		public var alias: String;
		public var aConnection: Connection;
		public var bConnection: Connection;

		@:optional public var aMessage: String;
		@:optional public var bMessage: String;
	}

class BeginIntroductionResponse extends ProtocolMessage<PayloadWithSessionURI> {
	public function new() {
		super(MsgType.beginIntroductionResponse, PayloadWithSessionURI);
	}
}

// This blank interface is defined to provide some means of indicting that a message is a notification
interface NotificationMessage {
}

class IntroductionNotification extends ProtocolMessage<IntroductionNotificationData> implements NotificationMessage{
	public function new() {
		super(MsgType.introductionNotification, IntroductionNotificationData);
	}
}
	class IntroductionNotificationData extends Payload {
		public var introSessionId: String;
		public var correlationId: String;
		public var connection: Connection;
		public var message: String;
		var introProfile: String;
		@:transient public var profile: UserData;

		public function new() {
			super();
			this.profile = new UserData();
		}

		private function readResolve(): Void {
			if(introProfile.isNotBlank()) {
				var p: Dynamic = haxe.Json.parse(introProfile);
				profile = AppContext.SERIALIZER.fromJsonX(p, UserData);
			} else {
				profile = new UserData();
			}
		}


	}

class IntroductionConfirmationRequest extends ProtocolMessage<IntroductionConfirmationRequestData> {
	public function new() {
		super(MsgType.introductionConfirmationRequest, IntroductionConfirmationRequestData);
	}
}
	class IntroductionConfirmationRequestData extends PayloadWithSessionURI {
		public var alias: String;
		public var introSessionId: String;
		public var correlationId: String;
		public var accepted: Bool;
	}

class IntroductionConfirmationResponse extends ProtocolMessage<PayloadWithSessionURI> {
	public function new() {
		super(MsgType.introductionConfirmationResponse, PayloadWithSessionURI);
	}
}

class ConnectNotification extends ProtocolMessage<ConnectNotificationData> {
	public function new() {
		super(MsgType.connectNotification, ConnectNotificationData);
	}
}
	class ConnectNotificationData extends Payload {
		public var connection: Connection;
		var introProfile: String;
		@:transient public var profile: UserData;

		private function readResolve(): Void {
			if(introProfile.isNotBlank()) {
				var p: Dynamic = haxe.Json.parse(introProfile);
				profile = AppContext.SERIALIZER.fromJsonX(p, UserData);
			} else {
				profile = new UserData();
			}
		}
	}

/** 
	Backup/Restore 
**/
class BackupRequest extends ProtocolMessage<BackupData> {
	public function new() {
		super(MsgType.backupRequest, BackupData);
	}
}
	class BackupData extends PayloadWithSessionURI {
		// public var nameOfBackup: String;
	}

class RestoreRequest extends ProtocolMessage<BackupData> {
	public function new() {
		super(MsgType.restoreRequest, BackupData);
	}
}

class RestoresRequest extends ProtocolMessage<PayloadWithSessionURI> {
	public function new() {
		super(MsgType.restoresRequest, PayloadWithSessionURI);
	}
}

class RestoresResponse extends ProtocolMessage<RestoresData> {
	public function new() {
		super(MsgType.restoresResponse, RestoresData);
	}
}

	class RestoresData extends Payload {
		public var backups: Array<String>;
	}
	


enum MsgType {
	initializeSessionRequest;
	initializeSessionResponse;
	initializeSessionError;
	connectionProfileResponse;
	closeSessionRequest;
	closeSessionResponse;
	createUserRequest;
	createUserError;
	createUserWaiting;
	confirmEmailToken;
	createUserResponse;
	insertContent;
	feedExpr;

	addAliasLabelsRequest;
	addAliasLabelsResponse;
	updateAliasLabelsRequest;
	updateAliasLabelsResponse;

	beginIntroductionRequest;
	beginIntroductionResponse;
	introductionNotification;
	introductionConfirmationRequest;
	introductionConfirmationResponse;
	connectNotification;

	backupRequest;
	backupResponse;

	restoresRequest;
	restoresResponse;
	restoreRequest;
	restoreResponse;

	crudMessage;
}

enum Reason {

}
