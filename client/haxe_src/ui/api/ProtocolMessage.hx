package ui.api;

import ui.model.ModelObj;
import ui.model.Filter;
import m3.exception.Exception;

interface HasContent<T> {
	function getContent(): T;
}

@:rtti
class ProtocolMessage<T>  {
	@:isVar public var content(get,set): Dynamic;
	@:transient var contentImpl: T;
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
		content = AgentUi.SERIALIZER.toJson(this.contentImpl);
	}

	private function get_content(): T {
		return contentImpl;
	}

	private function set_content(t: T): T {
		contentImpl = t;
		return t;
	}
}

@:rtti
class Payload {
	public function new() {}
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

		class UpdateUserRequestData extends UserRequestData {
			public var sessionId: String;
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
			public var listOfAliases: Array<Alias>;
			public var defaultAlias: Alias;
			public var listOfLabels: Array<Label>;
			public var listOfCnxns: Array<Connection>;
			public var lastActiveFilter: String;
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
class SessionPingRequest extends ProtocolMessage<SessionPingRequestData> {
	public function new() {
		super(MsgType.sessionPing, SessionPingRequestData);
	}
}

		class SessionPingRequestData extends Payload {
			public var sessionURI: String;
		}

class SessionPongResponse extends ProtocolMessage<SessionPongResponseData> {
	public function new() {
		super(MsgType.sessionPong, SessionPongResponseData);
	}
}

		class SessionPongResponseData extends Payload {
			public var sessionURI: String;
		}

/** 
	Close Session Request/Response 
**/
class CloseSessionRequest extends ProtocolMessage<CloseSessionData> {
	public function new() {
		super(MsgType.closeSessionRequest, CloseSessionData);
	}
}

class CloseSessionResponse extends ProtocolMessage<CloseSessionData> {
	public function new() {
		super(MsgType.closeSessionResponse, CloseSessionData);
	}
}

		class CloseSessionData extends Payload {
			public var sessionURI: String;
		}

/** 
	Evaluate Request/Response 
**/
class EvalSubscribeRequest extends ProtocolMessage<EvalRequestData> {
	public function new() {
		super(MsgType.evalSubscribeRequest, EvalRequestData);
	}
}

		class EvalRequestData extends Payload {
			public var sessionURI: String;
			public var expression: Dynamic;
		}

class EvalNextPageRequest extends ProtocolMessage<EvalNextPageRequestData> {
	public function new() {
		super(MsgType.evalSubscribeRequest, EvalNextPageRequestData);
	}
}

		class EvalNextPageRequestData extends Payload {
			public var sessionURI: String;
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

		class EvalResponseData extends Payload {
			public var sessionURI: String;
			public var pageOfPosts: Array<Content>;
		}

class EvalError extends ProtocolMessage<EvalErrorData> {
	public function new() {
		super(MsgType.evalError, EvalErrorData);
	}
}

		class EvalErrorData extends Payload {
			public var sessionURI: String;
			public var errorMsg: String;
		}

/** 
	Stop Evaluation Request/Response 
**/
class StopEvalRequest extends ProtocolMessage<StopMsgData> {
	public function new() {
		super(MsgType.stopEvalRequest, StopMsgData);
	}
}

class StopEvalResponse extends ProtocolMessage<StopMsgData> {
	public function new() {
		super(MsgType.stopEvalResponse, StopMsgData);
	}
}

		class StopMsgData extends Payload {
			public var sessionURI: String;
		}

class TempAddAliasLabel extends ProtocolMessage<TempAddAliasLabelData> {
	public function new() {
		super(MsgType.evalSubscribeRequest, TempAddAliasLabelData);
	}
}

		class TempAddAliasLabelData extends Payload {
			public var sessionURI: String;
			public var expression: InsertContent;
		}

// class AddAliasLabel extends ProtocolMessage<AddAliasLabel> {
// 	public function new() {
// 		this.msgType = MsgType.addAliasLabel;
// 	}
// }

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
	createUserError;
	insertContent;
	// addAliasLabel;
}

enum Reason {

}