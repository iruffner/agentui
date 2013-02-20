package ui.api;

import ui.model.ModelObj;
import ui.model.Filter;

class ProtocolMessage<T> {
	public var msgType: MsgType;
	public var content: T;
	public function toJson(): Dynamic {
		return {};
	}
}

class Payload {

}

class InitializeSessionRequest extends ProtocolMessage<InitializeSessionRequestData> {
	public function new() {
		this.msgType = MsgType.initializeSessionRequest;
	}
}

class InitializeSessionRequestData extends Payload {
	public var userCredentials: Dynamic;
	public var agentIdentifier: Dynamic;
}

class InitializeSessionResponse extends ProtocolMessage<InitializeSessionResponseData> {
	public function new() {
		this.msgType = MsgType.initializeSessionResponse;
	}
}

class InitializeSessionResponseData extends Payload {
	public var aliases: List<Alias>;
	public var defaultAlias: Alias;
	public var labels: List<Label>;
	public var connections: List<Connection>;
	public var lastActiveFilter: Filter;
	public var sessionIdentifier: Dynamic;
	public var userToken: Dynamic;
}

class CloseSessionRequest extends ProtocolMessage<CloseSessionRequestData> {
	public function new() {
		this.msgType = MsgType.closeSessionRequest;
	}
}

class CloseSessionRequestData {
	public var sessionIdentifier: Dynamic;
	public var userToken: Dynamic;
	public var reason: Reason;
}

class CloseSessionResponse extends ProtocolMessage<CloseSessionResponseData> {
	public function new() {
		this.msgType = MsgType.closeSessionResponse;
	}
}

class CloseSessionResponseData {
	public var sessionIdentifier: Dynamic;
	public var userToken: Dynamic;
}

class EvalRequest extends ProtocolMessage<EvalRequestData> {
	public function new() {
		this.msgType = MsgType.evalRequest;
	}
}

class EvalRequestData {
	public var expression: Dynamic;
	public var subsessionIdentifier: Dynamic;
	public var sessionIdentifier: Dynamic;
	public var userToken: Dynamic;
}

class EvalResponse extends ProtocolMessage<EvalResponseData> {
	public function new() {
		this.msgType = MsgType.evalResponse;
	}
}

class EvalComplete extends ProtocolMessage<EvalResponseData> {
	public function new() {
		this.msgType = MsgType.evalComplete;
	}
}

class EvalResponseData {
	public var posts: Array<Content>;
	public var subsessionIdentifier: Dynamic;
	public var sessionIdentifier: Dynamic;
	public var userToken: Dynamic;
}

class EvalError extends ProtocolMessage<EvalErrorData> {
	public function new() {
		this.msgType = MsgType.evalError;
	}
}

class EvalErrorData {
	public var errorMsg: String;
	public var subsessionIdentifier: Dynamic;
	public var sessionIdentifier: Dynamic;
	public var userToken: Dynamic;
}

class StopEvalRequest extends ProtocolMessage<StopMsgData> {
	public function new() {
		this.msgType = MsgType.stopEvalRequest;
	}
}

class StopEvalResponse extends ProtocolMessage<StopMsgData> {
	public function new() {
		this.msgType = MsgType.stopEvalResponse;
	}
}

class StopMsgData {
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