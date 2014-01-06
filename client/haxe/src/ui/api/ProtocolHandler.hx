package ui.api;

import m3.jq.JQ;

import ui.exception.InitializeSessionException;
import m3.exception.Exception;
import m3.serialization.Serialization.JsonException;
import m3.log.Logga;
import m3.util.UidGenerator;
import m3.util.JqueryUtil;

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
	private var runningFilter: {filter: String, connections: Array<Connection>} = null;
	private var listeningChannel: Requester;
	private var processHash: Map<MsgType,Dynamic->Void>;

	public function new() {
		EM.addListener(EMEvent.TEST, new EMListener(function(data: Dynamic): Void {
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
						AppContext.LOGGER.info("no processor for " + data.msgType);
					else 
						AppContext.LOGGER.info("no data returned on polling channel response");
					// JqueryUtil.alert("Don't know how to handle " + data.msgType);
					return;
				} else {
					AppContext.LOGGER.debug("received " + data.msgType);
					processor(data);
				}
			})
		);
		EM.addListener(EMEvent.FILTER_RUN, new EMListener(function(filter: Filter): Void {
				if(filterIsRunning) {
					this.stopCurrentFilter(
						function() { 
								this.filter(filter); 
							} 
					);
				} else {
            		this.filter(filter);
				} 
				filterIsRunning = true;
            })
        );

        EM.addListener(EMEvent.PAGE_CLOSE, new EMListener(function(n: Nothing): Void {
				if(filterIsRunning) {
					this.stopCurrentFilter(JQ.noop, false);
				} 
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

        EM.addListener(EMEvent.LOAD_ALIAS, new EMListener(function(alias: Alias): Void {
                this.getAliasInfo(alias);
            })
        );

        EM.addListener(EMEvent.ALIAS_CREATE, new EMListener(function(alias: Alias): Void {
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

        EM.addListener(EMEvent.UPDATE_LABELS, new EMListener(function(n: Nothing): Void {
        		updateLabels();
    		})
        );

        EM.addListener(EMEvent.INTRODUCTION_REQUEST, new EMListener(function(intro: Introduction):Void{
        		beginIntroduction(intro);
        }));

        EM.addListener(EMEvent.INTRODUCTION_CONFIRMATION, new EMListener(function(confirmation: IntroductionConfirmation):Void{
        		confirmIntroduction(confirmation);
        }));

        EM.addListener(EMEvent.TARGET_CHANGE, new EMListener(function(conn:Connection):Void{
        	
        	
        }));

        // EM.addListener(EMEvent.BACKUP, new EMListener(function(nameOfBackup: String): Void{
        // 	backup(nameOfBackup);
        // }));

        // EM.addListener(EMEvent.RESTORE, new EMListener(function(nameOfBackup: String): Void{
        // 	restore(nameOfBackup);
        // }));

        // EM.addListener(EMEvent.RESTORES_REQUEST, new EMListener(function(n: Nothing): Void{
        // 	restores();
        // }));

		EM.addListener(EMEvent.BACKUP, new EMListener(function(n: Nothing): Void{
        	backup();
        }));

        EM.addListener(EMEvent.RESTORE, new EMListener(function(n: Nothing): Void{
        	restore();
        }));

        processHash = new Map<MsgType,Dynamic->Void>();
        processHash.set(MsgType.evalSubscribeResponse, function(data: Dynamic){
        		AppContext.LOGGER.debug("evalResponse was received from the server");
        		AppContext.LOGGER.debug(data);
        		var evalResponse: EvalResponse = AppContext.SERIALIZER.fromJsonX(data, EvalResponse);
        		EM.change(EMEvent.MoreContent, evalResponse.contentImpl.content); 
        	});
        processHash.set(MsgType.evalComplete, function(data: Dynamic){
        		AppContext.LOGGER.debug("evalComplete was received from the server");
        		var evalComplete: EvalComplete = AppContext.SERIALIZER.fromJsonX(data, EvalComplete);
        		EM.change(EMEvent.EndOfContent, evalComplete.contentImpl.content); 
        	});
        processHash.set(MsgType.sessionPong, function(data: Dynamic){
        		//nothing to do with this message
        	});
        processHash.set(MsgType.evalSubscribeCancelResponse, function(data: Dynamic){
        		AppContext.LOGGER.debug("evalSubscribeCancelResponse was received from the server");
        	});
        processHash.set(MsgType.updateUserResponse, function(data: Dynamic){
        		AppContext.LOGGER.debug("updateUserResponse was received from the server");
        	});
        processHash.set(MsgType.addAliasLabelsResponse, function(data: Dynamic){
        		AppContext.LOGGER.debug("addAliasLabelsResponse was received from the server");
        	});
        
        processHash.set(MsgType.addAgentAliasesResponse, function(data: Dynamic){
        		AppContext.LOGGER.debug("addAgentAliasesResponse was received from the server");
        		EM.change(EMEvent.NewAlias);
        	});
        processHash.set(MsgType.addAgentAliasesError, function(data: Dynamic){
        		AppContext.LOGGER.error("addAgentAliasesError was received from the server");
        	});
        processHash.set(MsgType.removeAgentAliasesResponse, function(data: Dynamic){
        		AppContext.LOGGER.debug("removeAgentAliasesResponse was received from the server");
        	});
        processHash.set(MsgType.removeAgentAliasesError, function(data: Dynamic){
        		AppContext.LOGGER.error("removeAgentAliasesError was received from the server");
        	});
        processHash.set(MsgType.setDefaultAliasRequest, function(data: Dynamic){
        		AppContext.LOGGER.debug("setDefaultAliasRequest was received from the server");
        	});
        processHash.set(MsgType.setDefaultAliasError, function(data: Dynamic){
        		AppContext.LOGGER.error("setDefaultAliasError was received from the server");
        	});

        processHash.set(MsgType.getAliasConnectionsResponse, function(data: Dynamic){
        		AppContext.LOGGER.debug("getAliasConnectionsResponse was received from the server");
        		var resp: GetAliasConnectionsResponse = AppContext.SERIALIZER.fromJsonX(data, GetAliasConnectionsResponse);
        		AppContext.USER.currentAlias.connectionSet.clear();
        		AppContext.USER.currentAlias.connectionSet.addAll(resp.contentImpl.connections);
        	});
        processHash.set(MsgType.getAliasConnectionsError, function(data: Dynamic){
        		AppContext.LOGGER.error("getAliasConnectionsError was received from the server");
        	});
        processHash.set(MsgType.getAliasLabelsResponse, function(data: Dynamic){
        		AppContext.LOGGER.debug("getAliasLabelsResponse was received from the server");
        		var resp: GetAliasLabelsResponse = AppContext.SERIALIZER.fromJsonX(data, GetAliasLabelsResponse);
        		AppContext.USER.currentAlias.labelSet.clear();
        		AppContext.USER.currentAlias.labelSet.addAll(resp.contentImpl.aliasLabels);
        	});
        processHash.set(MsgType.getAliasLabelsError, function(data: Dynamic){
        		AppContext.LOGGER.error("getAliasLabelsError was received from the server");
        	});

        processHash.set(MsgType.introductionNotification, function(data: Dynamic){
        		AppContext.LOGGER.debug("introductionNotification was received from the server");
        		var notification: IntroductionNotification = AppContext.SERIALIZER.fromJsonX(data, IntroductionNotification);
        		EM.change(EMEvent.INTRODUCTION_NOTIFICATION, notification);
        	});

        processHash.set(MsgType.beginIntroductionResponse, function(data: Dynamic){
        		AppContext.LOGGER.debug("beginIntroductionResponse was received from the server");
        		EM.change(EMEvent.INTRODUCTION_RESPONSE);
        	});

        processHash.set(MsgType.introductionConfirmationResponse, function(data: Dynamic){
        		AppContext.LOGGER.debug("introductionConfirmationResponse was received from the server");
        		EM.change(EMEvent.INTRODUCTION_CONFIRMATION_RESPONSE);
        	});

        processHash.set(MsgType.connectNotification, function(data: Dynamic){
        		AppContext.LOGGER.debug("connectNotification was received from the server");
        		var notification: ConnectNotification = AppContext.SERIALIZER.fromJsonX(data, ConnectNotification);
        		var conn: Connection = notification.contentImpl.connection;
        		conn.profile = notification.contentImpl.profile;
        		EM.change(EMEvent.NewConnection, conn);
        	});

        processHash.set(MsgType.connectionProfileResponse, function(data: Dynamic){
        		AppContext.LOGGER.debug("connectionProfileResponse was received from the server");
        		var connectionProfileResponse = AppContext.SERIALIZER.fromJsonX(data, ConnectionProfileResponse);
        		var c: Connection = connectionProfileResponse.contentImpl.connection;
        		c.profile = connectionProfileResponse.contentImpl.profile;
        		EM.change(EMEvent.ConnectionUpdate, c);
        	});

        processHash.set(MsgType.restoresResponse, function(data: Dynamic){
        		AppContext.LOGGER.debug("restoresResponse was received from the server");
        		var restoresResponse = AppContext.SERIALIZER.fromJsonX(data, RestoresResponse);
        		EM.change(EMEvent.AVAILABLE_BACKUPS, restoresResponse.contentImpl.backups);
        	});
	}

	public function getUser(login: Login): Void {
		if(AppContext.DEMO) {
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
				        	var response: InitializeSessionResponse = AppContext.SERIALIZER.fromJsonX(data, InitializeSessionResponse, false);

				        	var user: User = new User();
				        	user.aliasSet = new ObservableSet<Alias>(Alias.identifier);
				        	user.aliasSet.visualId = "User Aliases";
				        	for( alias_ in response.contentImpl.listOfAliases) {
				        		var alias: Alias = new Alias();
				        		alias.label = alias_;
				        		user.aliasSet.add(alias);
				        	}
				        	if(!user.aliasSet.hasValues()) {
				        		AppContext.LOGGER.error("Agent has no Aliases!!");
				        		user.currentAlias = new Alias();
				        		user.currentAlias.label = "default";
				        		user.aliasSet.add(user.currentAlias);
				        	}

				        	if(response.contentImpl.defaultAlias.isNotBlank()) {
				        		user.currentAlias = user.aliasSet.getElementComplex( response.contentImpl.defaultAlias , "label" );
				        		user.defaultAlias = user.currentAlias;
				        	} else {
				        		user.currentAlias = user.aliasSet.iterator().next();
				        	}
							
							user.sessionURI = response.contentImpl.sessionURI;
							user.currentAlias.connectionSet.addAll(response.contentImpl.listOfConnections);
							user.currentAlias.labelSet.addAll(response.contentImpl.labels);
							user.userData = response.contentImpl.jsonBlob;
							//open comm's with server
							_startPolling(user.sessionURI);

							if(!AppContext.DEMO) {
								EM.change(EMEvent.USER, user);
								EM.change(EMEvent.FitWindow);
							}
						} catch (e: JsonException) {
							AppContext.LOGGER.error("Serialization error", e);
						}
			        } else if(data.msgType == MsgType.initializeSessionError) {
			        	var error: InitializeSessionError = AppContext.SERIALIZER.fromJsonX(data, InitializeSessionError);
			        	JqueryUtil.alert("Login error: " + error.contentImpl.reason);
			        } else {
			        	//something unexpected..
			        	AppContext.LOGGER.error("Unknown user login error | " + data);
			        	JqueryUtil.alert("There was an unexpected error attempting to login. Please try again.");
			        }
				});
			loginRequest.start();
			
		} catch (err: Dynamic) {
			JqueryUtil.alert(err);
		}
	}

	public function filter(filter: Filter): Void {
		
		if(filter.rootNode.hasChildren()) {
			if (AppContext.DEMO) {
				var runFunc = function():Void {
					var content: Array<Content> = TestDao.getContent(filter.rootNode);
					EM.change(EMEvent.MoreContent, content);
				};
				haxe.Timer.delay(runFunc, 100);
				return;
			}

			var request: EvalSubscribeRequest = new EvalSubscribeRequest();

			var feedExpr: FeedExpr = new FeedExpr();
			request.contentImpl.expression = feedExpr;
			var data: FeedExprData = new FeedExprData();
			feedExpr.contentImpl = data;
			data.cnxns = [AppContext.USER.getSelfConnection()];
			if(filter.connectionNodes.hasValues()) {
				data.cnxns = data.cnxns.concat(filter.connectionNodes.map(
					function(n: Node): Connection {
						var cn: ConnectionNode = cast(n, ConnectionNode);
						return cn.content;
					}
				));				
			}
			data.label = filter.labelsProlog();
			this.runningFilter = {
				connections: data.cnxns,
				filter: data.label
			};
			try {
				//we don't expect anything back here
				new StandardRequest(request, function(data: Dynamic, textStatus: String, jqXHR: JQXHR){
						AppContext.LOGGER.debug("filter successfully submitted");
					}).start({dataType: "text"});
			} catch (err: Dynamic) {
				var ex: Exception = Logga.getExceptionInst(err);
				AppContext.LOGGER.error("Error executing filter request", ex);
			}
		} else {
			stopCurrentFilter(JQ.noop);
		}
	}

	public function stopCurrentFilter(onSuccessOrError: Void->Void, async: Bool = true): Void {
		if(this.runningFilter == null) {
			onSuccessOrError();
			return;
		}
		try {
			var stopEval: EvalSubscribeCancelRequest = new EvalSubscribeCancelRequest();
			stopEval.contentImpl.connections = runningFilter.connections;
			stopEval.contentImpl.filter = runningFilter.filter;
			new StandardRequest(stopEval, function(data: Dynamic, textStatus: String, jqXHR: JQXHR){
				AppContext.LOGGER.debug("evalSubscribeCancelRequest successfully submitted");
        		onSuccessOrError();
			}).start({dataType: "text", async: async});
		} catch (err: Dynamic) {
			var exc: Exception = Logga.getExceptionInst(err);
			AppContext.LOGGER.error("Error executing evalSubscribeCancelRequest", exc);
    		onSuccessOrError();
		}
	}

	public function nextPage(nextPageURI: String): Void {
		var request: EvalNextPageRequest = new EvalNextPageRequest();
		request.contentImpl.nextPage = nextPageURI;
		try {
			//we don't expect anything back here
			new StandardRequest(request, function(data: Dynamic, textStatus: String, jqXHR: JQXHR){
					AppContext.LOGGER.debug("next page request successfully submitted");
				}).start();
		} catch (err: Dynamic) {
			var ex: Exception = Logga.getExceptionInst(err);
			AppContext.LOGGER.error("Error executing next page request", ex);
		}
	}

	public function getAliasInfo(alias: Alias): Void {
		getAliasConnections(alias);
		getAliasLabels(alias);
	}

	private function _startPolling(sessionURI: String): Void {
		var ping: SessionPingRequest = new SessionPingRequest();
		ping.contentImpl.sessionURI = sessionURI;

		listeningChannel = new LongPollingRequest(ping, function(dataArr: Array<{msgType: String, content: Dynamic}>, textStatus: String, jqXHR: JQXHR): Void {
				if(dataArr != null) {
					dataArr.iter(function(data: {msgType: String, content: Dynamic}): Void {
							try {
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
										AppContext.LOGGER.info("no processor for " + data.msgType);
									else 
										AppContext.LOGGER.info("no data returned on polling channel response");
									// JqueryUtil.alert("Don't know how to handle " + data.msgType);
									return;
								} else {
									AppContext.LOGGER.debug("received " + data.msgType);
									processor(data);
								}
							} catch (err: Dynamic) {
								AppContext.LOGGER.error("Error processing msg\n" + data + "\n" + err);
							}
						});
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
				        	var response: CreateUserResponse = AppContext.SERIALIZER.fromJsonX(data, CreateUserResponse, false);

				        	AgentUi.agentURI = response.contentImpl.agentURI;
				        	//TODO put this value into the url
							//DialogManager.showLogin(); -> firing the USER_SIGNUP will close the NewUserDialog, 
							EM.change(EMEvent.USER_SIGNUP);
						} catch (e: JsonException) {
							AppContext.LOGGER.error("Serialization error", e);
						}
			        // } else if(data.msgType == MsgType.initializeSessionError) {
			        // 	var error: InitializeSessionError = AgentUi.SERIALIZER.fromJsonX(data, InitializeSessionError);
			        // 	throw new InitializeSessionException(error, "Login error");
			    	} else if(data.msgType == MsgType.createUserWaiting) {
						try {
				        	var response: CreateUserWaiting = AppContext.SERIALIZER.fromJsonX(data, CreateUserWaiting, false);

				        	DialogManager.showSignupConfirmation();
				        	//TODO put this value into the url
							//DialogManager.showLogin(); -> firing the USER_SIGNUP will close the NewUserDialog, 
							EM.change(EMEvent.USER_SIGNUP);
						} catch (e: JsonException) {
							AppContext.LOGGER.error("Serialization error", e);
						}
					} else if(data.msgType == MsgType.createUserError) {
			        	var error: InitializeSessionError = AppContext.SERIALIZER.fromJsonX(data, InitializeSessionError);
			        	JqueryUtil.alert("User creation error: " + error.contentImpl.reason);
			        } else {
			        	//something unexpected..
			        	AppContext.LOGGER.error("Unknown user creation error | " + data);
			        	JqueryUtil.alert("There was an unexpected error creating your agent. Please try again.");
			        }
				}).start();
		} catch (err: Dynamic) {
			var ex: Exception = Logga.getExceptionInst(err);
			AppContext.LOGGER.error("Error executing user creation", ex);
		}
	}

	public function validateUser(token: String): Void {
		var request: ConfirmUserToken = new ConfirmUserToken();
		request.contentImpl.token = token;
		try {
			new StandardRequest(request, function(data: Dynamic, textStatus: String, jqXHR: JQXHR){
					if(data.msgType == MsgType.createUserResponse) {
						try {
				        	var response: CreateUserResponse = AppContext.SERIALIZER.fromJsonX(data, CreateUserResponse, false);

				        	AgentUi.agentURI = response.contentImpl.agentURI;
				        	//TODO put this value into the url
							//AgentUi.showLogin(); -> firing the USER_VALIDATED will close the SignupConfirmationDialog, 
							EM.change(EMEvent.USER_VALIDATED);
						} catch (e: JsonException) {
							AppContext.LOGGER.error("Serialization error", e);
						}
					} else if(data.msgType == MsgType.createUserError) {
			        	var error: InitializeSessionError = AppContext.SERIALIZER.fromJsonX(data, InitializeSessionError);
			        	JqueryUtil.alert("Email validation error:\n" + error.contentImpl.reason);
			        // } else if(data.msgType == MsgType.initializeSessionError) {
			        // 	var error: InitializeSessionError = AgentUi.SERIALIZER.fromJsonX(data, InitializeSessionError);
			        // 	throw new InitializeSessionException(error, "Login error");
			        } else {
			        	//something unexpected..
			        	AppContext.LOGGER.error("Unknown user creation error | " + data);
			        	JqueryUtil.alert("There was an unexpected error validating your token. Please try again.");
			        }
				}).start();
		} catch (err: Dynamic) {
			var ex: Exception = Logga.getExceptionInst(err);
			AppContext.LOGGER.error("Error executing user creation", ex);
		}
	}

	public function updateUser(user: User): Void {
		var request: UpdateUserRequest = new UpdateUserRequest();
		request.contentImpl.jsonBlob = user.userData;
		try {
			//we don't expect anything back here
			new StandardRequest(request, function(data: Dynamic, textStatus: String, jqXHR: JQXHR){
					AppContext.LOGGER.debug("updateUserRequest successfully submitted");
					EM.change(EMEvent.USER, user);
				}).start({dataType: "text"});
		} catch (err: Dynamic) {
			var ex: Exception = Logga.getExceptionInst(err);
			AppContext.LOGGER.error("Error executing user creation", ex);
		}
	}

	public function post(content: Content): Void {
		var request: EvalSubscribeRequest = new EvalSubscribeRequest();
		request.contentImpl.expression = new InsertContent();//AgentUi.SERIALIZER.toJson(content);
		var insertData: InsertContentData = new InsertContentData();
		request.contentImpl.expression.contentImpl = insertData;
		insertData.label = PrologHelper.labelsToProlog(content.labelSet);
		insertData.value = AppContext.SERIALIZER.toJsonString(content);
		insertData.cnxns = [AppContext.USER.getSelfConnection()];
		if(content.connectionSet.hasValues()) {
			insertData.cnxns = insertData.cnxns.concat(content.connectionSet.asArray());
		}
		insertData.uid = content.uid;

		try {
			//we don't expect anything back here
			new StandardRequest(request, function(data: Dynamic, textStatus: String, jqXHR: JQXHR){
					AppContext.LOGGER.debug("content successfully submitted");
				}).start({dataType: "text"});
		} catch (err: Dynamic) {
			var ex: Exception = Logga.getExceptionInst(err);
			AppContext.LOGGER.error("Error executing content post", ex);
		}
	}

	public function updateLabels(): Void {
		var request: UpdateAliasLabelsRequest = new UpdateAliasLabelsRequest();  // if we are not sending the same msg for add/update/delete.. this will need to be changed
		var labelsArray: Array<String> = PrologHelper.tagTreeAsStrings(AppContext.USER.currentAlias.labelSet);
		request.contentImpl.labels = labelsArray;
		request.contentImpl.alias = AppContext.USER.currentAlias.label;

		try {
			//we don't expect anything back here
			new StandardRequest(request, function(data: Dynamic, textStatus: String, jqXHR: JQXHR){
					AppContext.LOGGER.debug("label successfully submitted");
				}).start({dataType: "text"});
		} catch (err: Dynamic) {
			var ex: Exception = Logga.getExceptionInst(err);
			AppContext.LOGGER.error("Error executing label post", ex);
		}
	}

	public function addAlias(alias: Alias): Void {
		var request: BaseAgentAliasesRequest = new BaseAgentAliasesRequest(MsgType.addAgentAliasesRequest);
		request.contentImpl.aliases = [alias.label];

		try {
			//we don't expect anything back here
			new StandardRequest(request, function(data: Dynamic, textStatus: String, jqXHR: JQXHR){
					AppContext.LOGGER.debug("addAlias successfully submitted");
				}).start({dataType: "text"});
		} catch (err: Dynamic) {
			var ex: Exception = Logga.getExceptionInst(err);
			AppContext.LOGGER.error("Error executing addAlias", ex);
		}
	}

	public function removeAlias(alias: Alias): Void {
		var request: BaseAgentAliasesRequest = new BaseAgentAliasesRequest(MsgType.removeAgentAliasesRequest);
		request.contentImpl.aliases = [alias.label];

		try {
			//we don't expect anything back here
			new StandardRequest(request, function(data: Dynamic, textStatus: String, jqXHR: JQXHR){
					AppContext.LOGGER.debug("removeAlias successfully submitted");
				}).start({dataType: "text"});
		} catch (err: Dynamic) {
			var ex: Exception = Logga.getExceptionInst(err);
			AppContext.LOGGER.error("Error executing removeAlias", ex);
		}
	}

	public function setDefaultAlias(alias: Alias): Void {
		var request: BaseAgentAliasRequest = new BaseAgentAliasRequest(MsgType.setDefaultAliasRequest);
		request.contentImpl.alias = alias.label;

		try {
			//we don't expect anything back here
			new StandardRequest(request, function(data: Dynamic, textStatus: String, jqXHR: JQXHR){
					AppContext.LOGGER.debug("setDefaultAlias successfully submitted");
				}).start({dataType: "text"});
		} catch (err: Dynamic) {
			var ex: Exception = Logga.getExceptionInst(err);
			AppContext.LOGGER.error("Error executing setDefaultAlias", ex);
		}
	}

	public function getAliasConnections(alias: Alias): Void {
		var request: BaseAgentAliasRequest = new BaseAgentAliasRequest(MsgType.getAliasConnectionsRequest);
		request.contentImpl.alias = alias.label;

		try {
			//we don't expect anything back here
			new StandardRequest(request, function(data: Dynamic, textStatus: String, jqXHR: JQXHR){
					AppContext.LOGGER.debug("getAliasConnections successfully submitted");
				}).start({dataType: "text"});
		} catch (err: Dynamic) {
			var ex: Exception = Logga.getExceptionInst(err);
			AppContext.LOGGER.error("Error executing getAliasConnections", ex);
		}
	}

	public function getAliasLabels(alias: Alias): Void {
		var request: BaseAgentAliasRequest = new BaseAgentAliasRequest(MsgType.getAliasLabelsRequest);
		request.contentImpl.alias = alias.label;

		try {
			//we don't expect anything back here
			new StandardRequest(request, function(data: Dynamic, textStatus: String, jqXHR: JQXHR){
					AppContext.LOGGER.debug("getAliasLabels successfully submitted");
				}).start({dataType: "text"});
		} catch (err: Dynamic) {
			var ex: Exception = Logga.getExceptionInst(err);
			AppContext.LOGGER.error("Error executing getAliasLabels", ex);
		}
	}

	public function beginIntroduction(intro: Introduction): Void {
		var request: BeginIntroductionRequest = new BeginIntroductionRequest();
		request.contentImpl.aConnection = intro.aConn;
		request.contentImpl.bConnection = intro.bConn;
		request.contentImpl.aMessage = intro.bMsg;
		request.contentImpl.bMessage = intro.bMsg;
		request.contentImpl.alias = ui.AppContext.USER.currentAlias.label;
		try {
			//we don't expect anything back here
			new StandardRequest(request, function(data: Dynamic, textStatus: String, jqXHR: JQXHR){
					AppContext.LOGGER.debug("beginIntroductionRequest successfully submitted");
				}).start({dataType: "text"});
		} catch (err: Dynamic) {
			var ex: Exception = Logga.getExceptionInst(err);
			AppContext.LOGGER.error("Error executing beginIntroductionRequest", ex);
		}
	}

	public function confirmIntroduction(confirmation: IntroductionConfirmation): Void {
		var request: IntroductionConfirmationRequest = new IntroductionConfirmationRequest();
		request.contentImpl.accepted = confirmation.accepted;
		request.contentImpl.alias = ui.AppContext.USER.currentAlias.label;
		request.contentImpl.introSessionId = confirmation.introSessionId;
		request.contentImpl.correlationId = confirmation.correlationId;
		try {
			//we don't expect anything back here
			new StandardRequest(request, function(data: Dynamic, textStatus: String, jqXHR: JQXHR){
					AppContext.LOGGER.debug("introductionConfirmationRequest successfully submitted");
				}).start({dataType: "text"});
		} catch (err: Dynamic) {
			var ex: Exception = Logga.getExceptionInst(err);
			AppContext.LOGGER.error("Error executing beginIntroductionRequest", ex);
		}
	}

	public function backup(/*backupName: String*/): Void {
		var request: BackupRequest = new BackupRequest();
		// request.contentImpl.nameOfBackup = backupName;
		try {
			//we don't expect anything back here
			new StandardRequest(request, function(data: Dynamic, textStatus: String, jqXHR: JQXHR){
					AppContext.LOGGER.debug("backupRequest successfully submitted");
				}).start({dataType: "text"});
		} catch (err: Dynamic) {
			var ex: Exception = Logga.getExceptionInst(err);
			AppContext.LOGGER.error("Error executing backupRequest", ex);
		}
	}

	public function restore(/*backupName: String*/): Void {
		var request: RestoreRequest = new RestoreRequest();
		// request.contentImpl.nameOfBackup = backupName;
		try {
			//we don't expect anything back here
			new StandardRequest(request, function(data: Dynamic, textStatus: String, jqXHR: JQXHR){
					AppContext.LOGGER.debug("restoreRequest successfully submitted");
				}).start({dataType: "text"});
		} catch (err: Dynamic) {
			var ex: Exception = Logga.getExceptionInst(err);
			AppContext.LOGGER.error("Error executing restoreRequest", ex);
		}
	}

	public function restores(): Void {
		var request: RestoresRequest = new RestoresRequest();
		try {
			//we don't expect anything back here
			new StandardRequest(request, function(data: Dynamic, textStatus: String, jqXHR: JQXHR){
					AppContext.LOGGER.debug("restoresRequest successfully submitted");
				}).start({dataType: "text"});
		} catch (err: Dynamic) {
			var ex: Exception = Logga.getExceptionInst(err);
			AppContext.LOGGER.error("Error executing restoresRequest", ex);
		}
	}
}
