package ui.api;

import ui.jq.JQ;

import ui.exception.InitializeSessionException;
import ui.exception.Exception;
import ui.serialization.Serialization.JsonException;
import ui.log.Logga;

import ui.model.ModelObj;
import ui.model.Node;
import ui.model.Filter;
import ui.model.EventModel;
import ui.model.ModelEvents;
import ui.observable.OSet;

import ui.api.Requester;
import ui.api.ProtocolMessage;

using ui.helper.ArrayHelper;
using Lambda;

class ProtocolHandler {

	private var filterIsRunning: Bool = false;
	private var listeningChannel: Requester;
	private var processHash: Hash<Dynamic->Void>;

	public function new() {
		EventModel.addListener(ModelEvents.RunFilter, new EventListener(function(filter: Filter): Void {
				if(filterIsRunning) {
					try {
						var stopEval: StopEvalRequest = new StopEvalRequest();
						var stopData: StopMsgData = new StopMsgData();
						stopData.sessionURI = AgentUi.USER.sessionURI;
						stopEval.content = stopData;
						new StandardRequest(stopEval, function(data: Dynamic, textStatus: String, jqXHR: JQXHR){
							AgentUi.LOGGER.debug("stopEval successfully submitted");
	                		this.filter(filter);
						}).start();
					} catch (err: Dynamic) {
						var exc: Exception = Logga.getExceptionInst(err);
						AgentUi.LOGGER.error("Error executing stop evaluation request", exc);
                		this.filter(filter);
					}
				} else {
            		this.filter(filter);
				}
				filterIsRunning = true;
            })
        );

        EventModel.addListener(ModelEvents.EndOfContent, new EventListener(function(nextPageURI: String): Void {
                filterIsRunning = false;
            })
        );

        EventModel.addListener(ModelEvents.NextContent, new EventListener(function(nextPageURI: String): Void {
                this.nextPage(nextPageURI);
            })
        );

        EventModel.addListener(ModelEvents.LoadAlias, new EventListener(function(uid: String): Void {
                var alias: Alias = this.getAlias(uid);
                EventModel.change(ModelEvents.AliasLoaded, alias);
            })
        );

        EventModel.addListener(ModelEvents.Login, new EventListener(function(login: Login): Void {
                getUser(login);
            })
        );

        EventModel.addListener(ModelEvents.NewContentCreated, new EventListener(function(content: Content): Void {
        		post(content);
    		})
        );

        processHash = new Hash<Dynamic->Void>();
        processHash.set(Std.string(MsgType.evalResponse), function(data: Dynamic){
        		var evalResponse: EvalResponse = AgentUi.SERIALIZER.fromJsonX(data, EvalResponse);
        		//TODO need to make sure this is wired to properly push into the observable set
        		EventModel.change(ModelEvents.MoreContent, evalResponse.content.pageOfPosts); 
        	});
        processHash.set(Std.string(MsgType.evalComplete), function(data: Dynamic){
        		var evalComplete: EvalComplete = AgentUi.SERIALIZER.fromJsonX(data, EvalComplete);
        		//TODO need to make sure this is wired to properly push into the observable set
        		EventModel.change(ModelEvents.EndOfContent, evalComplete.content.pageOfPosts); 
        	});
        processHash.set(Std.string(MsgType.sessionPong), function(data: Dynamic){
        		//nothing to do with this message
        	});
	}

	public function getUser(login: Login): Void {
		if(AgentUi.DEMO) {
			EventModel.change(ModelEvents.User, TestDao.getUser(null));
		} 
		// else {
			var request: InitializeSessionRequest = new InitializeSessionRequest();
			var requestData: InitializeSessionRequestData = new InitializeSessionRequestData();
			request.content = requestData;
			requestData.agentURI = login.getUri();
			try {
				var loginRequest: StandardRequest = new StandardRequest(request, function(data: Dynamic, textStatus: Dynamic, jqXHR: JQXHR){
						if(data.msgType == MsgType.initializeSessionResponse) {
							try {
					        	var response: InitializeSessionResponse = AgentUi.SERIALIZER.fromJsonX(data, InitializeSessionResponse, false);

					        	var user: User = new User();
								user.currentAlias = response.content.defaultAlias;
								user.sessionURI = response.content.sessionURI;
								user.currentAlias.connectionSet = new ObservableSet<Connection>(ModelObj.identifier, response.content.listOfCnxns);
								user.currentAlias.labelSet = new ObservableSet<Label>(ModelObj.identifier, response.content.listOfLabels);
								user.aliasSet = new ObservableSet<Alias>(ModelObj.identifier, response.content.listOfAliases);
								//TODO user.imgSrc
								//TODO user.fname

								//open comm's with server
								_startPolling(user.sessionURI);

								// EventModel.change(ModelEvents.User, user);
								AgentUi.LOGGER.error("Enable firing new user event");
							} catch (e: JsonException) {
								AgentUi.LOGGER.error("Serialization error", e);
							}
				        } else if(data.msgType == MsgType.initializeSessionError) {
				        	var error: InitializeSessionError = AgentUi.SERIALIZER.fromJsonX(data, InitializeSessionError);
				        	throw new InitializeSessionException(error, "Login error");
				        } else {
				        	//something unexpected..
				        	throw new Exception("Unknown login error");
				        }
					});
				loginRequest.start();
				
			} catch (err: InitializeSessionException) {
				js.Lib.alert("Login error");
			} catch (err: Dynamic) {
				js.Lib.alert(err);
			}
		}
	// }

	public function filter(filter: Filter): Void {
		filter.rootNode.log();
		AgentUi.CONTENT.clear();
		
		if(filter.rootNode.hasChildren()) {
			var string: String = filter.kdbxify();
			ui.AgentUi.LOGGER.debug("FILTER --> feed(  " + string + "  )");
			var content: Array<Content> =TestDao.getContent(filter.rootNode);
			ui.AgentUi.CONTENT.addAll(content);
			var evalRequest: EvalRequest = new EvalRequest();
			var evalRequestData: EvalRequestData = new EvalRequestData();
			evalRequestData.expression = "feed( " + string + " )";
			evalRequestData.sessionURI = AgentUi.USER.sessionURI;
			evalRequest.content = evalRequestData;
			try {
				//we don't expect anything back here
				new StandardRequest(evalRequest, function(data: Dynamic, textStatus: String, jqXHR: JQXHR){
						AgentUi.LOGGER.debug("filter successfully submitted");
					}).start();
			} catch (err: Dynamic) {
				var ex: Exception = Logga.getExceptionInst(err);
				AgentUi.LOGGER.error("Error executing filter request", ex);
			}
		}
	}

	public function nextPage(nextPageURI: String): Void {
		var nextPageRequest: EvalNextPageRequest = new EvalNextPageRequest();
		var nextPageRequestData: EvalNextPageRequestData = new EvalNextPageRequestData();
		nextPageRequestData.nextPage = nextPageURI;
		nextPageRequestData.sessionURI = AgentUi.USER.sessionURI;//"agent-session://myLovelySession/1234,";
		nextPageRequest.content = nextPageRequestData;
		try {
			//we don't expect anything back here
			new StandardRequest(nextPageRequest, function(data: Dynamic, textStatus: String, jqXHR: JQXHR){
					AgentUi.LOGGER.debug("next page request successfully submitted");
				}).start();
		} catch (err: Dynamic) {
			var ex: Exception = Logga.getExceptionInst(err);
			AgentUi.LOGGER.error("Error executing next page request", ex);
		}
	}

	public function getAlias(uid: String): Alias {
		return TestDao.getAlias(uid);
	}

	private function _startPolling(sessionURI: String): Void {
		var ping: SessionPingRequest = new SessionPingRequest();
		ping.content = new SessionPingRequestData();
		ping.content.sessionURI = sessionURI;

		listeningChannel = new LongPollingRequest(ping, function(data: Dynamic, textStatus: String, jqXHR: JQXHR): Void {
				var processor: Dynamic->Void = processHash.get(data.msgType);
				if(processor == null) {
					AgentUi.LOGGER.info("long poll response was empty");
					// js.Lib.alert("Don't know how to handle " + data.msgType);
					return;
				} else {
					AgentUi.LOGGER.debug("received " + data.msgType);
					processor(data);
				}
			});
		listeningChannel.start();
	}

	public function post(content: Content): Void {
		var evalRequest: EvalRequest = new EvalRequest();
		var data: EvalRequestData = new EvalRequestData();
		evalRequest.content = data;
		data.sessionURI = AgentUi.USER.sessionURI;
		data.expression = content.toInsertExpression();
		try {
			//we don't expect anything back here
			new StandardRequest(evalRequest, function(data: Dynamic, textStatus: String, jqXHR: JQXHR){
					AgentUi.LOGGER.debug("content successfully submitted");
				}).start();
		} catch (err: Dynamic) {
			var ex: Exception = Logga.getExceptionInst(err);
			AgentUi.LOGGER.error("Error executing content post", ex);
		}
	}

}