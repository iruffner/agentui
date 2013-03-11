package ui.api;

import ui.model.ModelObj;
import ui.model.Filter;

class ProtocolMessage<T> implements haxe.rtti.Infos {
	public var msgType(default, null): MsgType;
	public var contents: T;

	public function toJson(): {msgType: String, contents: Dynamic} {
		// return AgentUi.SERIALIZER.toJsonString(this);
		return {
			msgType: Std.string(this.msgType),
			contents: _getContents()
		}
	}


	private function _getContents(): Dynamic {
		return AgentUi.SERIALIZER.toJson(contents);
	}

	private function _setContents(json: Dynamic): T {
		return AgentUi.SERIALIZER.toJson(contents);
	}

}

class Payload implements haxe.rtti.Infos {
	public function new() {}
}

/** 
	Initialize Session Request/Response 
**/
class InitializeSessionRequest extends ProtocolMessage<InitializeSessionRequestData> {
	public function new() {
		this.msgType = MsgType.initializeSessionRequest;
	}
}

class InitializeSessionRequestData extends Payload {
	public var agentURI: String;
}

class InitializeSessionResponse extends ProtocolMessage<InitializeSessionResponseData> {
	public function new() {
		this.msgType = MsgType.initializeSessionResponse;
	}
}

class InitializeSessionResponseData extends Payload {
	public var sessionURI: String;
	public var listOfAliases: List<Alias>;
	public var defaultAlias: Alias;
	public var listOfLabels: List<Label>;
	public var listOfCnxns: List<Connection>;
	public var lastActiveFilter: Filter;
}

class InitializeSessionError extends ProtocolMessage<InitializeSessionErrorData> {
	public function new() {
		this.msgType = MsgType.initializeSessionError;
	}
}

class InitializeSessionErrorData extends Payload {
	public var agentURI: String;
	public var reason: String;
}

/** 
	Close Session Request/Response 
**/
class CloseSessionRequest extends ProtocolMessage<CloseSessionData> {
	public function new() {
		this.msgType = MsgType.closeSessionRequest;
	}
}

class CloseSessionResponse extends ProtocolMessage<CloseSessionData> {
	public function new() {
		this.msgType = MsgType.closeSessionResponse;
	}
}

class CloseSessionData extends Payload {
	public var sessionURI: String;
}

/** 
	Evaluate Request/Response 
**/
class EvalRequest extends ProtocolMessage<EvalRequestData> {
	public function new() {
		this.msgType = MsgType.evalRequest;
	}
}

class EvalRequestData extends Payload {
	public var sessionURI: String;
	public var expression: Dynamic;
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

class EvalResponseData extends Payload {
	public var sessionURI: String;
	public var pageOfPosts: Array<Content>;
}

class EvalError extends ProtocolMessage<EvalErrorData> {
	public function new() {
		this.msgType = MsgType.evalError;
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
		this.msgType = MsgType.stopEvalRequest;
	}
}

class StopEvalResponse extends ProtocolMessage<StopMsgData> {
	public function new() {
		this.msgType = MsgType.stopEvalResponse;
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