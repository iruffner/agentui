package ui.api;

import ui.model.ModelObj;
import ui.model.Filter;
import ui.exception.Exception;

interface HasContents<T> {
	function getContents(): T;
}

class ProtocolMessage<T> implements haxe.rtti.Infos, implements HasContents<T> {
	public var msgType(default, null): MsgType;
	// public var contents: T;

	// public function toJson(): {msgType: String, contents: Dynamic} {
	// 	// return AgentUi.SERIALIZER.toJsonString(this);
	// 	return {
	// 		msgType: Std.string(this.msgType),
	// 		contents: _getContents()
	// 	}
	// }


	// private function _getContents(): Dynamic {
	// 	return AgentUi.SERIALIZER.toJson(contents);
	// }

	// private function _setContents(json: Dynamic): T {
	// 	return AgentUi.SERIALIZER.toJson(contents);
	// }

	public function getContents() {
		return throw new Exception("don't call me");
	}
}

class Payload implements haxe.rtti.Infos {
	public function new() {}
}

/** 
	Initialize Session Request/Response 
**/
class InitializeSessionRequest extends ProtocolMessage<InitializeSessionRequestData> {
	public var contents: InitializeSessionRequestData;

	public function new() {
		this.msgType = MsgType.initializeSessionRequest;
	}

	override public function getContents(): InitializeSessionRequestData {
		return this.contents;
	}
}

class InitializeSessionRequestData extends Payload {
	public var agentURI: String;
}

class InitializeSessionResponse extends ProtocolMessage<InitializeSessionResponseData> {
	public var contents: InitializeSessionResponseData;

	public function new() {
		this.msgType = MsgType.initializeSessionResponse;
	}

	override public function getContents(): InitializeSessionResponseData {
		return this.contents;
	}
}

class InitializeSessionResponseData extends Payload {
	public var sessionURI: String;
	public var listOfAliases: Array<Alias>;
	public var defaultAlias: Alias;
	public var listOfLabels: Array<Label>;
	public var listOfCnxns: Array<Connection>;
	public var lastActiveFilter: Filter;
}

class InitializeSessionError extends ProtocolMessage<InitializeSessionErrorData> {
	public var contents: InitializeSessionErrorData;

	public function new() {
		this.msgType = MsgType.initializeSessionError;
	}

	override public function getContents(): InitializeSessionErrorData {
		return this.contents;
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
	public var contents: SessionPingRequestData;

	public function new() {
		this.msgType = MsgType.sessionPing;
	}

	override public function getContents(): SessionPingRequestData {
		return this.contents;
	}
}

class SessionPingRequestData extends Payload {
	public var sessionURI: String;
}

class SessionPongResponse extends ProtocolMessage<SessionPongResponseData> {
	public var contents: SessionPongResponseData;

	public function new() {
		this.msgType = MsgType.sessionPong;
	}

	override public function getContents(): SessionPongResponseData {
		return this.contents;
	}
}

class SessionPongResponseData extends Payload {
	public var sessionURI: String;
}

/** 
	Close Session Request/Response 
**/
class CloseSessionRequest extends ProtocolMessage<CloseSessionData> {
	public var contents: CloseSessionData;

	public function new() {
		this.msgType = MsgType.closeSessionRequest;
	}

	override public function getContents(): CloseSessionData {
		return this.contents;
	}
}

class CloseSessionResponse extends ProtocolMessage<CloseSessionData> {
	public var contents: CloseSessionData;

	public function new() {
		this.msgType = MsgType.closeSessionResponse;
	}

	override public function getContents(): CloseSessionData {
		return this.contents;
	}
}

class CloseSessionData extends Payload {
	public var sessionURI: String;
}

/** 
	Evaluate Request/Response 
**/
class EvalRequest extends ProtocolMessage<EvalRequestData> {
	public var contents: EvalRequestData;

	public function new() {
		this.msgType = MsgType.evalRequest;
	}

	override public function getContents(): EvalRequestData {
		return this.contents;
	}
}

class EvalRequestData extends Payload {
	public var sessionURI: String;
	public var expression: Dynamic;
}

class EvalResponse extends ProtocolMessage<EvalResponseData> {
	public var contents: EvalResponseData;

	public function new() {
		this.msgType = MsgType.evalResponse;
	}

	override public function getContents(): EvalResponseData {
		return this.contents;
	}
}

class EvalComplete extends ProtocolMessage<EvalResponseData> {
	public var contents: EvalResponseData;

	public function new() {
		this.msgType = MsgType.evalComplete;
	}

	override public function getContents(): EvalResponseData {
		return this.contents;
	}
}

class EvalResponseData extends Payload {
	public var sessionURI: String;
	public var pageOfPosts: Array<Content>;
}

class EvalError extends ProtocolMessage<EvalErrorData> {
	public var contents: EvalErrorData;

	public function new() {
		this.msgType = MsgType.evalError;
	}

	override public function getContents(): EvalErrorData {
		return this.contents;
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
	public var contents: StopMsgData;

	public function new() {
		this.msgType = MsgType.stopEvalRequest;
	}

	override public function getContents(): StopMsgData {
		return this.contents;
	}
}

class StopEvalResponse extends ProtocolMessage<StopMsgData> {
	public var contents: StopMsgData;

	public function new() {
		this.msgType = MsgType.stopEvalResponse;
	}

	override public function getContents(): StopMsgData {
		return this.contents;
	}
}

class StopMsgData extends Payload {
	public var subsessionIdentifier: Dynamic;
	public var sessionIdentifier: Dynamic;
	public var userToken: Dynamic;
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
}

enum Reason {

}