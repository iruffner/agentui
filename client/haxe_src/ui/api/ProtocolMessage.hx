package ui.api;

import ui.model.ModelObj;
import ui.model.Filter;

class ProtocolMessage implements haxe.rtti.Infos {
	public var msgType(default, null): MsgType;
	public var contents: Dynamic;
	public function toJsonString(): String {
		return AgentUi.SERIALIZER.toJsonString(this);
	}

	public function getContents<T>(): T {
		//TODO serialize it to the correct type
		return contents;
	}
}

interface Payload implements Dynamic, implements haxe.rtti.Infos {

}

/** 
	Initialize Session Request/Response 
**/
class InitializeSessionRequest extends ProtocolMessage {
	public function new() {
		this.msgType = MsgType.initializeSessionRequest;
	}
}

class InitializeSessionRequestData implements Payload {
	public var userCredentials: Dynamic;
	public var agentIdentifier: Dynamic;
}

class InitializeSessionResponse extends ProtocolMessage {
	public function new() {
		this.msgType = MsgType.initializeSessionResponse;
	}
}

class InitializeSessionResponseData implements Payload {
	public var aliases: List<Alias>;
	public var defaultAlias: Alias;
	public var labels: List<Label>;
	public var connections: List<Connection>;
	public var lastActiveFilter: Filter;
	public var sessionIdentifier: Dynamic;
	public var userToken: Dynamic;
}

/** 
	Close Session Request/Response 
**/
class CloseSessionRequest extends ProtocolMessage {
	public function new() {
		this.msgType = MsgType.closeSessionRequest;
	}
}

class CloseSessionRequestData implements Payload {
	public var sessionIdentifier: Dynamic;
	public var userToken: Dynamic;
	public var reason: Reason;
}

class CloseSessionResponse extends ProtocolMessage {
	public function new() {
		this.msgType = MsgType.closeSessionResponse;
	}
}

class CloseSessionResponseData implements Payload {
	public var sessionIdentifier: Dynamic;
	public var userToken: Dynamic;
}

/** 
	Evaluate Request/Response 
**/
class EvalRequest extends ProtocolMessage {
	public function new() {
		this.msgType = MsgType.evalRequest;
	}
}

class EvalRequestData implements Payload {
	public var expression: Dynamic;
	public var sessionUri: String;

	public function new() {}
}

class EvalResponse extends ProtocolMessage {
	public function new() {
		this.msgType = MsgType.evalResponse;
	}
}

class EvalComplete extends ProtocolMessage {
	public function new() {
		this.msgType = MsgType.evalComplete;
	}
}

class EvalResponseData implements Payload {
	public var posts: Array<Content>;
	public var subsessionIdentifier: Dynamic;
	public var sessionIdentifier: Dynamic;
	public var userToken: Dynamic;
}

class EvalError extends ProtocolMessage {
	public function new() {
		this.msgType = MsgType.evalError;
	}
}

class EvalErrorData implements Payload {
	public var errorMsg: String;
	public var subsessionIdentifier: Dynamic;
	public var sessionIdentifier: Dynamic;
	public var userToken: Dynamic;
}

/** 
	Stop Evaluation Request/Response 
**/
class StopEvalRequest extends ProtocolMessage {
	public function new() {
		this.msgType = MsgType.stopEvalRequest;
	}
}

class StopEvalResponse extends ProtocolMessage {
	public function new() {
		this.msgType = MsgType.stopEvalResponse;
	}
}

class StopMsgData implements Payload {
	public var subsessionIdentifier: Dynamic;
	public var sessionIdentifier: Dynamic;
	public var userToken: Dynamic;
}

enum MsgType {
	initializeSessionRequest;
	initializeSessionResponse;
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