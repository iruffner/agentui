package ui.api;

import ui.model.ModelObj;
import ui.model.Filter;
import ui.exception.Exception;

interface HasContent<T> {
	function getContent(): T;
}

class ProtocolMessage<T> implements haxe.rtti.Infos, implements HasContent<T> {
	public var msgType(default, null): MsgType;

	public function getContent() {
		return throw new Exception("don't call me");
	}
}

class Payload implements haxe.rtti.Infos {
	public function new() {}
}

// /** 
// 	Create User Request/Response 
// **/
// class CreateUserRequest extends ProtocolMessage<CreateUserRequestData> {
// 	public var content: CreateUserRequestData;

// 	public function new() {
// 		this.msgType = MsgType.createAgentRequest;
// 	}

// 	override public function getContent(): CreateUserRequestData {
// 		return this.content;
// 	}
// }

// class CreateUserRequestData extends Payload {
// 	public var expression: Dynamic;
// }

/** 
	Initialize Session Request/Response 
**/
class InitializeSessionRequest extends ProtocolMessage<InitializeSessionRequestData> {
	public var content: InitializeSessionRequestData;

	public function new() {
		this.msgType = MsgType.initializeSessionRequest;
	}

	override public function getContent(): InitializeSessionRequestData {
		return this.content;
	}
}

class InitializeSessionRequestData extends Payload {
	public var agentURI: String;
}

class InitializeSessionResponse extends ProtocolMessage<InitializeSessionResponseData> {
	public var content: InitializeSessionResponseData;

	public function new() {
		this.msgType = MsgType.initializeSessionResponse;
	}

	override public function getContent(): InitializeSessionResponseData {
		return this.content;
	}
}

class InitializeSessionResponseData extends Payload {
	public var sessionURI: String;
	public var listOfAliases: Array<Alias>;
	public var defaultAlias: Alias;
	public var listOfLabels: Array<Label>;
	public var listOfCnxns: Array<Connection>;
	public var lastActiveFilter: String;
}

class InitializeSessionError extends ProtocolMessage<InitializeSessionErrorData> {
	public var content: InitializeSessionErrorData;

	public function new() {
		this.msgType = MsgType.initializeSessionError;
	}

	override public function getContent(): InitializeSessionErrorData {
		return this.content;
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
	public var content: SessionPingRequestData;

	public function new() {
		this.msgType = MsgType.sessionPing;
	}

	override public function getContent(): SessionPingRequestData {
		return this.content;
	}
}

class SessionPingRequestData extends Payload {
	public var sessionURI: String;
}

class SessionPongResponse extends ProtocolMessage<SessionPongResponseData> {
	public var content: SessionPongResponseData;

	public function new() {
		this.msgType = MsgType.sessionPong;
	}

	override public function getContent(): SessionPongResponseData {
		return this.content;
	}
}

class SessionPongResponseData extends Payload {
	public var sessionURI: String;
}

/** 
	Close Session Request/Response 
**/
class CloseSessionRequest extends ProtocolMessage<CloseSessionData> {
	public var content: CloseSessionData;

	public function new() {
		this.msgType = MsgType.closeSessionRequest;
	}

	override public function getContent(): CloseSessionData {
		return this.content;
	}
}

class CloseSessionResponse extends ProtocolMessage<CloseSessionData> {
	public var content: CloseSessionData;

	public function new() {
		this.msgType = MsgType.closeSessionResponse;
	}

	override public function getContent(): CloseSessionData {
		return this.content;
	}
}

class CloseSessionData extends Payload {
	public var sessionURI: String;
}

/** 
	Evaluate Request/Response 
**/
class EvalRequest extends ProtocolMessage<EvalRequestData> {
	public var content: EvalRequestData;

	public function new() {
		this.msgType = MsgType.evalRequest;
	}

	override public function getContent(): EvalRequestData {
		return this.content;
	}
}

class EvalRequestData extends Payload {
	public var sessionURI: String;
	public var expression: Dynamic;
}

class EvalNextPageRequest extends ProtocolMessage<EvalNextPageRequestData> {
	public var content: EvalNextPageRequestData;

	public function new() {
		this.msgType = MsgType.evalRequest;
	}

	override public function getContent(): EvalNextPageRequestData {
		return this.content;
	}
}

class EvalNextPageRequestData extends Payload {
	public var sessionURI: String;
	public var nextPage: String;
}

class EvalResponse extends ProtocolMessage<EvalResponseData> {
	public var content: EvalResponseData;

	public function new() {
		this.msgType = MsgType.evalResponse;
	}

	override public function getContent(): EvalResponseData {
		return this.content;
	}
}

class EvalComplete extends ProtocolMessage<EvalResponseData> {
	public var content: EvalResponseData;

	public function new() {
		this.msgType = MsgType.evalComplete;
	}

	override public function getContent(): EvalResponseData {
		return this.content;
	}
}

class EvalResponseData extends Payload {
	public var sessionURI: String;
	public var pageOfPosts: Array<Content>;
}

class EvalError extends ProtocolMessage<EvalErrorData> {
	public var content: EvalErrorData;

	public function new() {
		this.msgType = MsgType.evalError;
	}

	override public function getContent(): EvalErrorData {
		return this.content;
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
	public var content: StopMsgData;

	public function new() {
		this.msgType = MsgType.stopEvalRequest;
	}

	override public function getContent(): StopMsgData {
		return this.content;
	}
}

class StopEvalResponse extends ProtocolMessage<StopMsgData> {
	public var content: StopMsgData;

	public function new() {
		this.msgType = MsgType.stopEvalResponse;
	}

	override public function getContent(): StopMsgData {
		return this.content;
	}
}

class StopMsgData extends Payload {
	public var sessionURI: String;
}

enum MsgType {
	initializeSessionRequest;
	initializeSessionResponse;
	initializeSessionError;
	sessionPing;
	sessionPong;
	closeSessionRequest;
	closeSessionResponse;
	evalRequest;
	evalResponse;
	evalComplete;
	evalError;
	stopEvalRequest;
	stopEvalResponse;
	createAgentRequest;
}

enum Reason {

}