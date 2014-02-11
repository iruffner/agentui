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
	}
}

class PayloadWithReason extends Payload {
	public var reason: String;
}

class ErrorPayload extends PayloadWithSessionURI {
	public var reason: String;
}

class ConfirmUserToken extends ProtocolMessage<ConfirmUserTokenData> {
	public function new() {
		super(MsgType.confirmEmailToken, ConfirmUserTokenData);
	}
}

		class ConfirmUserTokenData extends Payload {
			public var token: String;
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
	closeSessionRequest;
	closeSessionResponse;
	confirmEmailToken;
	feedExpr;

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
