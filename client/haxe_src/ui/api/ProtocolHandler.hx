package ui.api;

import m3.jq.JQ;

import ui.exception.InitializeSessionException;
import m3.exception.Exception;
import m3.serialization.Serialization.JsonException;
import m3.log.Logga;
import m3.util.UidGenerator;

import ui.model.ModelObj;
import ui.model.Node;
import ui.model.Filter;
import ui.model.EM;
import ui.widget.DialogManager;
import m3.observable.OSet;

import ui.api.Requester;
import ui.api.ProtocolMessage;
import ui.helper.PrologHelper;

using m3.helper.ArrayHelper;
using m3.helper.OSetHelper;
using m3.helper.StringHelper;
using Lambda;

class ProtocolHandler {

	private var filterIsRunning: Bool = false;
	private var listeningChannel: Requester;
	private var processHash: Map<MsgType,Dynamic->Void>;

	public function new() {
		EM.addListener(EMEvent.FILTER_RUN, new EMListener(function(filter: Filter): Void {
				// TODO:  The server does not support StopEvalRequest
				/*
				if(filterIsRunning) {
					AgentUi.LOGGER.debug("stopEval successfully submitted");
					try {
						var stopEval: StopEvalRequest = new StopEvalRequest();
						var stopData: PayloadWithSessionURI = new PayloadWithSessionURI();
						stopEval.contentImpl = stopData;
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
				*/
            		this.filter(filter);
				/* } */
				filterIsRunning = true;
            })
        );

        EM.addListener(EMEvent.EndOfContent, new EMListener(function(nextPageURI: String): Void {
                filterIsRunning = false;
            })
        );

        EM.addListener(EMEvent.NextContent, new EMListener(function(nextPageURI: String): Void {
                this.nextPage(nextPageURI);
            })
        );

        EM.addListener(EMEvent.LoadAlias, new EMListener(function(alias: Alias): Void {
                this.getAliasInfo(alias);
            })
        );

        EM.addListener(EMEvent.AliasCreate, new EMListener(function(alias: Alias): Void {
                addAlias(alias);
            })
        );

        EM.addListener(EMEvent.USER_LOGIN, new EMListener(function(login: Login): Void {
            	getUser(login);
            })
        );

        EM.addListener(EMEvent.USER_CREATE, new EMListener(function(user: NewUser): Void {
                createUser(user);
            })
        );

        EM.addListener(EMEvent.USER_UPDATE, new EMListener(function(user: User): Void {
                updateUser(user);
            })
        );

        EM.addListener(EMEvent.USER_VALIDATE, new EMListener(function(token: String): Void {
                validateUser(token);
            })
        );

        EM.addListener(EMEvent.NewContentCreated, new EMListener(function(content: Content): Void {
        		post(content);
    		})
        );

        EM.addListener(EMEvent.CreateLabel, new EMListener(function(label: Label): Void {
        		createLabel(label);
    		})
        );

        EM.addListener(EMEvent.INTRODUCTION_REQUEST, new EMListener(function(msg:BeginIntroductionRequest):Void{
        	// TODO:  send the message to the server
        	EM.change(EMEvent.INTRODUCTION_RESPONSE);
        }));

        processHash = new Map<MsgType,Dynamic->Void>();
        processHash.set(MsgType.evalResponse, function(data: Dynamic){
        		var evalResponse: EvalResponse = AgentUi.SERIALIZER.fromJsonX(data, EvalResponse);
        		EM.change(EMEvent.MoreContent, evalResponse.contentImpl.pageOfPosts); 
        	});
        processHash.set(MsgType.evalComplete, function(data: Dynamic){
        		AgentUi.LOGGER.debug("evalComplete was received from the server");
        		var evalComplete: EvalComplete = AgentUi.SERIALIZER.fromJsonX(data, EvalComplete);
        		EM.change(EMEvent.EndOfContent, evalComplete.contentImpl.pageOfPosts); 
        	});
        processHash.set(MsgType.sessionPong, function(data: Dynamic){
        		//nothing to do with this message
        	});
        processHash.set(MsgType.updateUserResponse, function(data: Dynamic){
        		AgentUi.LOGGER.debug("updateUserResponse was received from the server");
        	});
        processHash.set(MsgType.addAliasLabelsResponse, function(data: Dynamic){
        		AgentUi.LOGGER.debug("addAliasLabelsResponse was received from the server");
        	});
        

        processHash.set(MsgType.addAgentAliasesResponse, function(data: Dynamic){
        		AgentUi.LOGGER.debug("addAgentAliasesResponse was received from the server");
        	});
        processHash.set(MsgType.addAgentAliasesError, function(data: Dynamic){
        		AgentUi.LOGGER.error("addAgentAliasesError was received from the server");
        	});
        processHash.set(MsgType.removeAgentAliasesResponse, function(data: Dynamic){
        		AgentUi.LOGGER.debug("removeAgentAliasesResponse was received from the server");
        	});
        processHash.set(MsgType.removeAgentAliasesError, function(data: Dynamic){
        		AgentUi.LOGGER.error("removeAgentAliasesError was received from the server");
        	});
        processHash.set(MsgType.setDefaultAliasRequest, function(data: Dynamic){
        		AgentUi.LOGGER.debug("setDefaultAliasRequest was received from the server");
        	});
        processHash.set(MsgType.setDefaultAliasError, function(data: Dynamic){
        		AgentUi.LOGGER.error("setDefaultAliasError was received from the server");
        	});

        processHash.set(MsgType.getAliasConnectionsResponse, function(data: Dynamic){
        		AgentUi.LOGGER.debug("getAliasConnectionsResponse was received from the server");
        		var resp: GetAliasConnectionsResponse = AgentUi.SERIALIZER.fromJsonX(data, GetAliasConnectionsResponse);
        		AgentUi.USER.currentAlias.connectionSet.clear();
        		AgentUi.USER.currentAlias.connectionSet.addAll(resp.contentImpl.cnxns);
        	});
        processHash.set(MsgType.getAliasConnectionsError, function(data: Dynamic){
        		AgentUi.LOGGER.error("getAliasConnectionsError was received from the server");
        	});
        processHash.set(MsgType.getAliasLabelsResponse, function(data: Dynamic){
        		AgentUi.LOGGER.debug("getAliasLabelsResponse was received from the server");
        		var resp: GetAliasLabelsResponse = AgentUi.SERIALIZER.fromJsonX(data, GetAliasLabelsResponse);
        		AgentUi.USER.currentAlias.labelSet.clear();
        		AgentUi.USER.currentAlias.labelSet.addAll(resp.contentImpl.labels.map(function(str: String): Label {
        				return new Label( str );
        			}));
        	});
        processHash.set(MsgType.getAliasLabelsError, function(data: Dynamic){
        		AgentUi.LOGGER.error("getAliasLabelsError was received from the server");
        	});
	}

	public function getUser(login: Login): Void {
		if(AgentUi.DEMO) {
			EM.change(EMEvent.USER, TestDao.getUser(null));
			return;
		} 

		var request: InitializeSessionRequest = new InitializeSessionRequest();
		request.contentImpl.agentURI = login.getUri();
		try {
			var loginRequest: StandardRequest = new StandardRequest(
				request, 
				function(data: Dynamic, textStatus: Dynamic, jqXHR: JQXHR){
					if(data.msgType == MsgType.initializeSessionResponse) {
						try {
				        	var response: InitializeSessionResponse = AgentUi.SERIALIZER.fromJsonX(data, InitializeSessionResponse, false);

				        	var user: User = new User();
				        	user.aliasSet = new ObservableSet<Alias>(ModelObj.identifier);
				        	user.aliasSet.visualId = "User Aliases";
				        	for( alias_ in response.contentImpl.listOfAliases) {
				        		var alias: Alias = new Alias();
				        		alias.label = alias_;
				        		alias.uid = UidGenerator.create(12);
				        		user.aliasSet.add(alias);
				        	}
				        	if(!user.aliasSet.hasValues()) {
				        		AgentUi.LOGGER.error("Agent has no Aliases!!");
				        		user.currentAlias = new Alias();
				        		user.currentAlias.label = "default";
				        		user.currentAlias.uid = UidGenerator.create(12);
				        		user.aliasSet.add(user.currentAlias);
				        	}

				        	if(response.contentImpl.defaultAlias.isNotBlank()) {
				        		user.currentAlias = user.aliasSet.getElementComplex( response.contentImpl.defaultAlias , "label" );
				        	} else {
				        		user.currentAlias = user.aliasSet.iterator().next();
				        	}
							
							user.sessionURI = response.contentImpl.sessionURI;
							user.currentAlias.connectionSet = new ObservableSet<Connection>(ModelObj.identifier, response.contentImpl.listOfCnxns);
							user.currentAlias.labelSet = new ObservableSet<Label>(ModelObj.identifier, response.contentImpl.labels);
							user.userData = response.contentImpl.jsonBlob;
							//open comm's with server
							_startPolling(user.sessionURI);

							if(!ui.AgentUi.DEMO) {
								EM.change(EMEvent.USER, user);
							}
						} catch (e: JsonException) {
							AgentUi.LOGGER.error("Serialization error", e);
						}
			        } else if(data.msgType == MsgType.initializeSessionError) {
			        	var error: InitializeSessionError = AgentUi.SERIALIZER.fromJsonX(data, InitializeSessionError);
			        	js.Lib.alert("Login error: " + error.contentImpl.reason);
			        } else {
			        	//something unexpected..
			        	AgentUi.LOGGER.error("Unknown user login error | " + data);
			        	js.Lib.alert("There was an unexpected error attempting to login. Please try again.");
			        }
				});
			loginRequest.start();
			
		} catch (err: Dynamic) {
			js.Lib.alert(err);
		}
	}

	public function filter(filter: Filter): Void {
		AgentUi.CONTENT.clear();
		
		if(filter.rootNode.hasChildren()) {
			// var string: String = filter.kdbxify();
			// ui.AgentUi.LOGGER.debug("FILTER --> feed(  " + string + "  )");
			// var content: Array<Content> =TestDao.getContent(filter.rootNode);
			// ui.AgentUi.CONTENT.addAll(content);
			var request: EvalSubscribeRequest = new EvalSubscribeRequest();

			var feedExpr: FeedExpr = new FeedExpr();
			request.contentImpl.expression = feedExpr;
			var data: FeedExprData = new FeedExprData();
			feedExpr.contentImpl = data;
			data.cnxns = [AgentUi.USER.getSelfConnection()];
			data.label = filter.labelsProlog();
			try {
				//we don't expect anything back here
				new StandardRequest(request, function(data: Dynamic, textStatus: String, jqXHR: JQXHR){
						AgentUi.LOGGER.debug("filter successfully submitted");
					}).start({dataType: "text"});
			} catch (err: Dynamic) {
				var ex: Exception = Logga.getExceptionInst(err);
				AgentUi.LOGGER.error("Error executing filter request", ex);
			}
		}
	}

	public function nextPage(nextPageURI: String): Void {
		var request: EvalNextPageRequest = new EvalNextPageRequest();
		request.contentImpl.nextPage = nextPageURI;
		try {
			//we don't expect anything back here
			new StandardRequest(request, function(data: Dynamic, textStatus: String, jqXHR: JQXHR){
					AgentUi.LOGGER.debug("next page request successfully submitted");
				}).start();
		} catch (err: Dynamic) {
			var ex: Exception = Logga.getExceptionInst(err);
			AgentUi.LOGGER.error("Error executing next page request", ex);
		}
	}

	public function getAliasInfo(alias: Alias): Void {
		getAliasConnections(alias);
		getAliasLabels(alias);
	}

	private function _startPolling(sessionURI: String): Void {
		var ping: SessionPingRequest = new SessionPingRequest();
		ping.contentImpl = new PayloadWithSessionURI();
		ping.contentImpl.sessionURI = sessionURI;

		listeningChannel = new LongPollingRequest(ping, function(data: {msgType: String}, textStatus: String, jqXHR: JQXHR): Void {
				var msgType: MsgType = {
					try {
						Type.createEnum(MsgType, data.msgType);
					} catch (err: Dynamic) {
						null;
					}
				}
				var processor: Dynamic->Void = processHash.get(msgType);
				if(processor == null) {
					if(data != null)
						AgentUi.LOGGER.info("no processor for " + data.msgType);
					else 
						AgentUi.LOGGER.info("no data returned on polling channel response");
					// js.Lib.alert("Don't know how to handle " + data.msgType);
					return;
				} else {
					AgentUi.LOGGER.debug("received " + data.msgType);
					processor(data);
				}
			});
		listeningChannel.start();
	}

	public function createUser(newUser: NewUser): Void {
		var request: CreateUserRequest = new CreateUserRequest();
		request.contentImpl.email = newUser.email;
		request.contentImpl.password = newUser.pwd;
		request.contentImpl.jsonBlob = {};
		request.contentImpl.jsonBlob.name = newUser.name;
		try {
			new StandardRequest(request, function(data: Dynamic, textStatus: String, jqXHR: JQXHR){
					if(data.msgType == MsgType.createUserResponse) {
						try {
				        	var response: CreateUserResponse = AgentUi.SERIALIZER.fromJsonX(data, CreateUserResponse, false);

				        	AgentUi.agentURI = response.contentImpl.agentURI;
				        	//TODO put this value into the url
							//DialogManager.showLogin(); -> firing the USER_SIGNUP will close the NewUserDialog, 
							EM.change(EMEvent.USER_SIGNUP);
						} catch (e: JsonException) {
							AgentUi.LOGGER.error("Serialization error", e);
						}
			        // } else if(data.msgType == MsgType.initializeSessionError) {
			        // 	var error: InitializeSessionError = AgentUi.SERIALIZER.fromJsonX(data, InitializeSessionError);
			        // 	throw new InitializeSessionException(error, "Login error");
			    	} else if(data.msgType == MsgType.createUserWaiting) {
						try {
				        	var response: CreateUserWaiting = AgentUi.SERIALIZER.fromJsonX(data, CreateUserWaiting, false);

				        	DialogManager.showSignupConfirmation();
				        	//TODO put this value into the url
							//DialogManager.showLogin(); -> firing the USER_SIGNUP will close the NewUserDialog, 
							EM.change(EMEvent.USER_SIGNUP);
						} catch (e: JsonException) {
							AgentUi.LOGGER.error("Serialization error", e);
						}
					} else if(data.msgType == MsgType.createUserError) {
			        	var error: InitializeSessionError = AgentUi.SERIALIZER.fromJsonX(data, InitializeSessionError);
			        	js.Lib.alert("User creation error: " + error.contentImpl.reason);
			        } else {
			        	//something unexpected..
			        	AgentUi.LOGGER.error("Unknown user creation error | " + data);
			        	js.Lib.alert("There was an unexpected error creating your agent. Please try again.");
			        }
				}).start();
		} catch (err: Dynamic) {
			var ex: Exception = Logga.getExceptionInst(err);
			AgentUi.LOGGER.error("Error executing user creation", ex);
		}
	}

	public function validateUser(token: String): Void {
		var request: ConfirmUserToken = new ConfirmUserToken();
		request.contentImpl.token = token;
		try {
			new StandardRequest(request, function(data: Dynamic, textStatus: String, jqXHR: JQXHR){
					if(data.msgType == MsgType.createUserResponse) {
						try {
				        	var response: CreateUserResponse = AgentUi.SERIALIZER.fromJsonX(data, CreateUserResponse, false);

				        	AgentUi.agentURI = response.contentImpl.agentURI;
				        	//TODO put this value into the url
							//AgentUi.showLogin(); -> firing the USER_VALIDATED will close the SignupConfirmationDialog, 
							EM.change(EMEvent.USER_VALIDATED);
						} catch (e: JsonException) {
							AgentUi.LOGGER.error("Serialization error", e);
						}
			        // } else if(data.msgType == MsgType.initializeSessionError) {
			        // 	var error: InitializeSessionError = AgentUi.SERIALIZER.fromJsonX(data, InitializeSessionError);
			        // 	throw new InitializeSessionException(error, "Login error");
			        } else {
			        	//something unexpected..
			        	AgentUi.LOGGER.error("Unknown user creation error | " + data);
			        	js.Lib.alert("There was an unexpected error creating your agent. Please try again.");
			        }
				}).start();
		} catch (err: Dynamic) {
			var ex: Exception = Logga.getExceptionInst(err);
			AgentUi.LOGGER.error("Error executing user creation", ex);
		}
	}

	public function updateUser(user: User): Void {
		var request: UpdateUserRequest = new UpdateUserRequest();
		request.contentImpl.jsonBlob = user.userData;
		try {
			//we don't expect anything back here
			new StandardRequest(request, function(data: Dynamic, textStatus: String, jqXHR: JQXHR){
					AgentUi.LOGGER.debug("updateUserRequest successfully submitted");
					EM.change(EMEvent.USER, user);
				}).start({dataType: "text"});
		} catch (err: Dynamic) {
			var ex: Exception = Logga.getExceptionInst(err);
			AgentUi.LOGGER.error("Error executing user creation", ex);
		}
	}

	public function post(content: Content): Void {
		var request: EvalSubscribeRequest = new EvalSubscribeRequest();
		request.contentImpl.expression = new InsertContent();//AgentUi.SERIALIZER.toJson(content);
		var insertData: InsertContentData = new InsertContentData();
		request.contentImpl.expression.contentImpl = insertData;
		insertData.label = PrologHelper.labelsToProlog(content.labelSet);
		insertData.value = AgentUi.SERIALIZER.toJsonString(content);
		insertData.cnxns = [AgentUi.USER.getSelfConnection()];

		try {
			//we don't expect anything back here
			new StandardRequest(request, function(data: Dynamic, textStatus: String, jqXHR: JQXHR){
					AgentUi.LOGGER.debug("content successfully submitted");
				}).start({dataType: "text"});
		} catch (err: Dynamic) {
			var ex: Exception = Logga.getExceptionInst(err);
			AgentUi.LOGGER.error("Error executing content post", ex);
		}
	}

	public function createLabel(label: Label): Void {
		var request: AddAliasLabelsRequest = new AddAliasLabelsRequest();
		// var labelSet: ObservableSet<Label> = new ObservableSet<Label>(ModelObj.identifier);

		// var pLabel: Label = label;
		// while(pLabel != null) {
		// 	labelSet.add(pLabel);
		// 	if(pLabel.parentUid.isNotBlank()) {
		// 		pLabel = AgentUi.USER.currentAlias.labelSet.getElementComplex(pLabel.parentUid);
		// 		if(pLabel != null) {
		// 			var pLabelUid: String = pLabel.uid;
		// 			var siblings: OSet<Label> = AgentUi.USER.currentAlias.labelSet.filter(function(l: Label): Bool {
		// 					return l.parentUid == pLabelUid;
		// 				});
		// 			labelSet.addAll(siblings.array());
		// 		}
		// 	} else {
		// 		pLabel = null;
		// 	}
		// }
		AgentUi.USER.currentAlias.labelSet.add(label);
		var labelsArray: Array<String> = PrologHelper.tagTreeAsStrings(AgentUi.USER.currentAlias.labelSet);
		request.contentImpl.labels = labelsArray;
		request.contentImpl.alias = AgentUi.USER.currentAlias.label;

		try {
			//we don't expect anything back here
			new StandardRequest(request, function(data: Dynamic, textStatus: String, jqXHR: JQXHR){
					AgentUi.LOGGER.debug("label successfully submitted");
					// AgentUi.USER.currentAlias.labelSet.add(label);
				}).start({dataType: "text"});
		} catch (err: Dynamic) {
			var ex: Exception = Logga.getExceptionInst(err);
			AgentUi.LOGGER.error("Error executing label post", ex);
		}
	}

	public function addAlias(alias: Alias): Void {
		var request: BaseAgentAliasRequest = new BaseAgentAliasRequest(MsgType.addAgentAliasesRequest);
		request.contentImpl.aliases = [alias.label];

		try {
			//we don't expect anything back here
			new StandardRequest(request, function(data: Dynamic, textStatus: String, jqXHR: JQXHR){
					AgentUi.LOGGER.debug("addAlias successfully submitted");
				}).start({dataType: "text"});
		} catch (err: Dynamic) {
			var ex: Exception = Logga.getExceptionInst(err);
			AgentUi.LOGGER.error("Error executing addAlias", ex);
		}
	}

	public function removeAlias(alias: Alias): Void {
		var request: BaseAgentAliasRequest = new BaseAgentAliasRequest(MsgType.removeAgentAliasesRequest);
		request.contentImpl.aliases = [alias.label];

		try {
			//we don't expect anything back here
			new StandardRequest(request, function(data: Dynamic, textStatus: String, jqXHR: JQXHR){
					AgentUi.LOGGER.debug("removeAlias successfully submitted");
				}).start({dataType: "text"});
		} catch (err: Dynamic) {
			var ex: Exception = Logga.getExceptionInst(err);
			AgentUi.LOGGER.error("Error executing removeAlias", ex);
		}
	}

	public function setDefaultAlias(alias: Alias): Void {
		var request: BaseAgentAliasRequest = new BaseAgentAliasRequest(MsgType.setDefaultAliasRequest);
		request.contentImpl.aliases = [alias.label];

		try {
			//we don't expect anything back here
			new StandardRequest(request, function(data: Dynamic, textStatus: String, jqXHR: JQXHR){
					AgentUi.LOGGER.debug("setDefaultAlias successfully submitted");
				}).start({dataType: "text"});
		} catch (err: Dynamic) {
			var ex: Exception = Logga.getExceptionInst(err);
			AgentUi.LOGGER.error("Error executing setDefaultAlias", ex);
		}
	}

	public function getAliasConnections(alias: Alias): Void {
		var request: BaseAgentAliasRequest = new BaseAgentAliasRequest(MsgType.getAliasConnectionsRequest);
		request.contentImpl.aliases = [alias.label];

		try {
			//we don't expect anything back here
			new StandardRequest(request, function(data: Dynamic, textStatus: String, jqXHR: JQXHR){
					AgentUi.LOGGER.debug("getAliasConnections successfully submitted");
				}).start({dataType: "text"});
		} catch (err: Dynamic) {
			var ex: Exception = Logga.getExceptionInst(err);
			AgentUi.LOGGER.error("Error executing getAliasConnections", ex);
		}
	}

	public function getAliasLabels(alias: Alias): Void {
		var request: BaseAgentAliasRequest = new BaseAgentAliasRequest(MsgType.getAliasLabelsRequest);
		request.contentImpl.aliases = [alias.label];

		try {
			//we don't expect anything back here
			new StandardRequest(request, function(data: Dynamic, textStatus: String, jqXHR: JQXHR){
					AgentUi.LOGGER.debug("getAliasLabels successfully submitted");
				}).start({dataType: "text"});
		} catch (err: Dynamic) {
			var ex: Exception = Logga.getExceptionInst(err);
			AgentUi.LOGGER.error("Error executing getAliasLabels", ex);
		}
	}
}
