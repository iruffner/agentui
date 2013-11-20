package ui.api;

import ui.model.ModelObj;
import ui.model.Filter;
import m3.exception.Exception;

import ui.helper.PrologHelper;

using m3.helper.ArrayHelper;

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

	public function new() {
		super();
		if (AgentUi.USER != null) {
			this.sessionURI = AgentUi.USER.sessionURI;
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
			public var agentURI: String;
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
			public var expression: ProtocolMessage<Dynamic>;
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
		super(MsgType.evalSubscribeResponse, EvalResponseData);
	}
}

class EvalComplete extends ProtocolMessage<EvalResponseData> {
	public function new() {
		super(MsgType.evalComplete, EvalResponseData);
	}
}

		class EvalResponseData extends PayloadWithSessionURI {
			public var pageOfPosts: Array<String>;

			@:transient public var content: Array<Content>;

			private function readResolve(): Void {
				if(pageOfPosts.hasValues()) {
					content = new Array<Content>();
					for(p_ in 0...pageOfPosts.length) {
						var post: Dynamic = haxe.Json.parse(pageOfPosts[p_]);
						content.push(ui.AgentUi.SERIALIZER.fromJsonX(post, Content));
					}
				}
			}

		}

class EvalError extends ProtocolMessage<EvalErrorData> {
	public function new() {
		super(MsgType.evalError, EvalErrorData);
	}
}

		class EvalErrorData extends PayloadWithSessionURI {
			public var errorMsg: String;
		}

class FeedExpr extends ProtocolMessage<FeedExprData> {
	public function new() {
		super(MsgType.feedExpr, FeedExprData);
	}
}

		class FeedExprData extends Payload {
			public var cnxns: Array<Connection>;
			public var label: String;
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

/** 
	Aliases 
**/
class BaseAgentAliasRequest extends ProtocolMessage<AgentAliasesRequestData> {
	public function new(msgType: MsgType) {
		super(msgType, AgentAliasesRequestData);
	}
}

		class AgentAliasesRequestData extends PayloadWithSessionURI {
			public var aliases: Array<String>;
		}

class AddAgentAliasesResponse extends ProtocolMessage<PayloadWithSessionURI> {
	public function new() {
		super(MsgType.addAgentAliasesResponse, PayloadWithSessionURI);
	}
}

class AddAgentAliasesError extends ProtocolMessage<ErrorPayload> {
	public function new() {
		super(MsgType.addAgentAliasesError, ErrorPayload);
	}
}

class RemoveAgentAliasesResponse extends ProtocolMessage<PayloadWithSessionURI> {
	public function new() {
		super(MsgType.removeAgentAliasesResponse, PayloadWithSessionURI);
	}
}

class RemoveAgentAliasesError extends ProtocolMessage<ErrorPayload> {
	public function new() {
		super(MsgType.removeAgentAliasesError, ErrorPayload);
	}
}

class SetDefaultAliasResponse extends ProtocolMessage<PayloadWithSessionURI> {
	public function new() {
		super(MsgType.setDefaultAliasResponse, PayloadWithSessionURI);
	}
}

class SetDefaultAliasError extends ProtocolMessage<ErrorPayload> {
	public function new() {
		super(MsgType.setDefaultAliasError, ErrorPayload);
	}
}

class GetAliasConnectionsResponse extends ProtocolMessage<AliasConnectionsRequestData> {
	public function new() {
		super(MsgType.getAliasConnectionsResponse, AliasConnectionsRequestData);
	}
}

		class AliasConnectionsRequestData extends PayloadWithSessionURI {
			public var cnxns: Array<Connection>;
		}

class GetAliasLabelsResponse extends ProtocolMessage<AliasLabelsRequestData> {
	public function new() {
		super(MsgType.getAliasLabelsResponse, AliasLabelsRequestData);
	}
}

		class AliasLabelsRequestData extends PayloadWithSessionURI {
			public var labels: Array<String>;
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

class UpdateAliasLabelsRequest extends ProtocolMessage<UpdateAliasLabelsRequestData> {
	public function new() {
		super(MsgType.updateAliasLabelsRequest, UpdateAliasLabelsRequestData);
	}
}

		class UpdateAliasLabelsRequestData extends PayloadWithSessionURI {
			public var labels: Array<String>;
			public var alias: String;
		}

class UpdateAliasLabelsResponse extends ProtocolMessage<PayloadWithSessionURI> {
	public function new() {
		super(MsgType.updateAliasLabelsResponse, PayloadWithSessionURI);
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

/** 
	Introductions 
**/
class BeginIntroductionRequest extends ProtocolMessage<BeginIntroductionRequestData> {
	public function new(alias:String, from:Connection, to:Connection, fromMessage:String, toMessage:String) {
		super(MsgType.beginIntroductionRequest, BeginIntroductionRequestData);
		this.contentImpl.alias = alias;

		// this.contentImpl.aBiConnection = new BiConnection(to, from);
		// this.contentImpl.aMessage = fromMessage;
		
		// this.contentImpl.bBiConnection = new BiConnection(from, to);
		// this.contentImpl.bMessage = toMessage;
	}
}
	class BeginIntroductionRequestData extends PayloadWithSessionURI {
		public var alias: String;
		public var aConnection: Connection;
		public var bConnection: Connection;

		@:optional public var aMessage: String;
		@:optional public var bMessage: String;
	}

class IntroductionNotification extends ProtocolMessage<IntroductionNotificationData> {
	public function new() {
		super(MsgType.introductionNotification, IntroductionNotificationData);
	}
}
	class IntroductionNotificationData extends PayloadWithSessionURI {
		public var correlationId: String;
		public var connection: Connection;
		public var message: String;
		public var introProfile: UserData;
	}

class IntroductionConfirmation extends ProtocolMessage<IntroductionConfirmationData> {
	public function new() {
		super(MsgType.introductionConfirmation, IntroductionConfirmationData);
	}
}
	class IntroductionConfirmationData extends PayloadWithSessionURI {
		public var correlationId: String;
		public var connection: Connection;
		public var accepted: Bool;
	}

enum MsgType {
	initializeSessionRequest;
	initializeSessionResponse;
	initializeSessionError;
	connectionProfileResponse;
	sessionPing;
	sessionPong;
	closeSessionRequest;
	closeSessionResponse;
	evalSubscribeRequest;
	evalSubscribeResponse;
	evalComplete;
	evalError;
	stopEvalRequest;
	stopEvalResponse;
	createUserRequest;
	createUserError;
	createUserWaiting;
	confirmEmailToken;
	createUserResponse;
	updateUserRequest;
	updateUserResponse;
	insertContent;
	feedExpr;

	addAgentAliasesRequest;
	addAgentAliasesError;
	addAgentAliasesResponse;
	removeAgentAliasesRequest;
	removeAgentAliasesError;
	removeAgentAliasesResponse;
	setDefaultAliasRequest;
	setDefaultAliasError;
	setDefaultAliasResponse;

	getAliasConnectionsRequest;
	getAliasConnectionsResponse;
	getAliasConnectionsError;
	getAliasLabelsRequest;
	getAliasLabelsResponse;
	getAliasLabelsError;

	addAliasLabelsRequest;
	addAliasLabelsResponse;
	updateAliasLabelsRequest;
	updateAliasLabelsResponse;

	beginIntroductionRequest;
	introductionNotification;
	introductionConfirmation;
}

enum Reason {

}
