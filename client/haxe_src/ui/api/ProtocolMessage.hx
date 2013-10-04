package ui.api;

import ui.model.ModelObj;
import ui.model.Filter;
import m3.exception.Exception;

interface HasContent<T> {
	function getContent(): T;
}

@:rtti
class ProtocolMessage<T>  {
	@:isVar var content: Dynamic;
	@:transient public var contentImpl: T;
	@:transient var type: Class<T>;

	public var msgType(default, null): MsgType;

	public function new(msgType: MsgType, type: Class<T>) {
		this.msgType = msgType;
		this.type = type;
	}

	private function readResolve(): Void {
		contentImpl = AgentUi.SERIALIZER.fromJsonX(this.content, this.type);
	}

	private function writeResolve(): Void {
		this.content = AgentUi.SERIALIZER.toJson(this.contentImpl);
	}
}

@:rtti
class Payload {
	public function new() {}
}

class PayloadWithSessionURI extends Payload {
	public var sessionURI: String;
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

class UpdateUserRequest extends ProtocolMessage<UpdateUserRequestData> {
	public function new() {
		super(MsgType.updateUserRequest, UpdateUserRequestData);
	}
}

		class UpdateUserRequestData extends PayloadWithSessionURI {
			public var jsonBlob: Dynamic;
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
			public var listOfLabels: Array<Label>;
			public var listOfCnxns: Array<Connection>;
			public var lastActiveLabel: String;
			public var jsonBlob: UserData;
		}

class InitializeSessionError extends ProtocolMessage<InitializeSessionErrorData> {
	public function new() {
		super(MsgType.initializeSessionError, InitializeSessionErrorData);
	}
}

		class InitializeSessionErrorData extends Payload {
			public var agentURI: String;
			public var reason: String;
		}

/** 
	Ping/pop Request/Response 
**/
class SessionPingRequest extends ProtocolMessage<PayloadWithSessionURI> {
	public function new() {
		super(MsgType.sessionPing, PayloadWithSessionURI);
	}
}

class SessionPongResponse extends ProtocolMessage<PayloadWithSessionURI> {
	public function new() {
		super(MsgType.sessionPong, PayloadWithSessionURI);
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

/** 
	Evaluate Request/Response 
**/
class EvalSubscribeRequest extends ProtocolMessage<EvalRequestData> {
	public function new() {
		super(MsgType.evalSubscribeRequest, EvalRequestData);
	}
}

		class EvalRequestData extends PayloadWithSessionURI {
			public var expression: Dynamic;
		}

class EvalNextPageRequest extends ProtocolMessage<EvalNextPageRequestData> {
	public function new() {
		super(MsgType.evalSubscribeRequest, EvalNextPageRequestData);
	}
}

		class EvalNextPageRequestData extends PayloadWithSessionURI {
			public var nextPage: String;
		}

class EvalResponse extends ProtocolMessage<EvalResponseData> {
	public function new() {
		super(MsgType.evalResponse, EvalResponseData);
	}
}

class EvalComplete extends ProtocolMessage<EvalResponseData> {
	public function new() {
		super(MsgType.evalComplete, EvalResponseData);
	}
}

		class EvalResponseData extends PayloadWithSessionURI {
			public var pageOfPosts: Array<Content>;
		}

class EvalError extends ProtocolMessage<EvalErrorData> {
	public function new() {
		super(MsgType.evalError, EvalErrorData);
	}
}

		class EvalErrorData extends PayloadWithSessionURI {
			public var errorMsg: String;
		}

/** 
	Stop Evaluation Request/Response 
**/
class StopEvalRequest extends ProtocolMessage<PayloadWithSessionURI> {
	public function new() {
		super(MsgType.stopEvalRequest, PayloadWithSessionURI);
	}
}

class StopEvalResponse extends ProtocolMessage<PayloadWithSessionURI> {
	public function new() {
		super(MsgType.stopEvalResponse, PayloadWithSessionURI);
	}
}

class TempAddAliasLabel extends ProtocolMessage<TempAddAliasLabelData> {
	public function new() {
		super(MsgType.evalSubscribeRequest, TempAddAliasLabelData);
	}
}

		class TempAddAliasLabelData extends PayloadWithSessionURI {
			public var expression: InsertContent;
		}

class AddAliasLabelsRequest extends ProtocolMessage<AddAliasLabelsRequestData> {
	public function new() {
		super(MsgType.addAliasLabelsRequest, AddAliasLabelsRequestData);
	}
}

		class AddAliasLabelsRequestData extends PayloadWithSessionURI {
			public var labels: Array<String>;
			public var alias: String;
		}

class AddAliasLabelsResponse extends ProtocolMessage<PayloadWithSessionURI> {
	public function new() {
		super(MsgType.addAliasLabelsResponse, PayloadWithSessionURI);
	}
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
		}

enum MsgType {
	initializeSessionRequest;
	initializeSessionResponse;
	initializeSessionError;
	sessionPing;
	sessionPong;
	closeSessionRequest;
	closeSessionResponse;
	evalSubscribeRequest;
	evalResponse;
	evalComplete;
	evalError;
	stopEvalRequest;
	stopEvalResponse;
	createUserRequest;
	createUserWaiting;
	confirmEmailToken;
	createUserResponse;
	updateUserRequest;
	updateUserResponse;
	createUserError;
	insertContent;
	addAliasLabelsRequest;
	addAliasLabelsResponse;
}

enum Reason {

}