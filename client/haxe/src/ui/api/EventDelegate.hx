package ui.api;

import m3.jq.JQ;

import ui.api.ProtocolHandler;
import ui.api.ProtocolMessage;
import ui.model.ModelObj;
import ui.model.EM;
import ui.model.Filter;

class EventDelegate {
	
	private var protocolHandler:ProtocolHandler;
	public var processHash: Map<MsgType,Dynamic->Void>;
	private var filterIsRunning: Bool = false;

	public function new(protocolHandler:ProtocolHandler) {
		this.protocolHandler = protocolHandler;
		this.processHash = new Map<MsgType,Dynamic->Void>();

		this._setUpEventListeners();
	}

	private function _setUpEventListeners() {

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
				if(data != null) {
					AppContext.LOGGER.info("no processor for " + data.msgType);
				} else { 
					AppContext.LOGGER.info("no data returned on polling channel response");
				}
			} else {
				AppContext.LOGGER.debug("received " + data.msgType);
				processor(data);
			}
		}));

		EM.addListener(EMEvent.FILTER_RUN, new EMListener(function(filter: Filter): Void {
			if(filterIsRunning) {
				protocolHandler.stopCurrentFilter(
					function() { 
							protocolHandler.filter(filter); 
						} 
				);
			} else {
        		protocolHandler.filter(filter);
			} 
			filterIsRunning = true;
        }));

        EM.addListener(EMEvent.PAGE_CLOSE, new EMListener(function(n: Nothing): Void {
			if(filterIsRunning) {
				protocolHandler.stopCurrentFilter(JQ.noop, false);
			} 
        }));

        EM.addListener(EMEvent.EndOfContent, new EMListener(function(nextPageURI: String): Void {
            filterIsRunning = false;
        }));

        EM.addListener(EMEvent.NextContent, new EMListener(function(nextPageURI: String): Void {
            protocolHandler.nextPage(nextPageURI);
        }));

        EM.addListener(EMEvent.ALIAS_CREATE, new EMListener(function(alias: Alias): Void {
            protocolHandler.createAlias(alias);
        }));

        EM.addListener(EMEvent.ALIAS_EDIT, new EMListener(function(alias: Alias): Void {
            protocolHandler.updateAlias(alias);
        }));

        EM.addListener(EMEvent.USER_LOGIN, new EMListener(function(login: Login): Void {
          	protocolHandler.getUser(login);
        }));

        EM.addListener(EMEvent.USER_CREATE, new EMListener(function(user: NewUser): Void {
            protocolHandler.createUser(user);
        }));

        EM.addListener(EMEvent.USER_UPDATE, new EMListener(function(agent: Agent): Void {
            protocolHandler.updateUser(agent);
        }));

        EM.addListener(EMEvent.USER_VALIDATE, new EMListener(function(token: String): Void {
            protocolHandler.validateUser(token);
        }));

        EM.addListener(EMEvent.CreateContent, new EMListener(function(data:CreateContentData): Void {
        	protocolHandler.createContent(data);
    	}));

        EM.addListener(EMEvent.CreateLabel, new EMListener(function(data:CreateLabelData): Void {
        	protocolHandler.createLabel(data.label, data.parentIid);
    	}));

        EM.addListener(EMEvent.DeleteLabel, new EMListener(function(l:Label): Void {
            protocolHandler.deleteLabel(l);
        }));

        EM.addListener(EMEvent.INTRODUCTION_REQUEST, new EMListener(function(intro: Introduction):Void{
        	protocolHandler.beginIntroduction(intro);
        }));

        EM.addListener(EMEvent.INTRODUCTION_CONFIRMATION, new EMListener(function(confirmation: IntroductionConfirmation):Void{
        	protocolHandler.confirmIntroduction(confirmation);
        }));

        EM.addListener(EMEvent.TARGET_CHANGE, new EMListener(function(conn:Connection):Void{
        	// Do something
        }));

        // EM.addListener(EMEvent.BACKUP, new EMListener(function(nameOfBackup: String): Void{
        // 	protocolHandler.backup(nameOfBackup);
        // }));

        // EM.addListener(EMEvent.RESTORE, new EMListener(function(nameOfBackup: String): Void{
        // 	protocolHandler.restore(nameOfBackup);
        // }));

        // EM.addListener(EMEvent.RESTORES_REQUEST, new EMListener(function(n: Nothing): Void{
        // 	protocolHandler.restores();
        // }));

		EM.addListener(EMEvent.BACKUP, new EMListener(function(n: Nothing): Void{
        	protocolHandler.backup();
        }));

        EM.addListener(EMEvent.RESTORE, new EMListener(function(n: Nothing): Void{
        	protocolHandler.restore();
        }));

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
    		// AppContext.LOGGER.debug("sessionPong was received from the server");
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

     //    processHash.set(MsgType.getAliasConnectionsResponse, function(data: Dynamic){
    	// 	AppContext.LOGGER.debug("getAliasConnectionsResponse was received from the server");
    	// 	var resp: GetAliasConnectionsResponse = AppContext.SERIALIZER.fromJsonX(data, GetAliasConnectionsResponse);
    	// 	AppContext.alias.connectionSet.clear();
    	// 	AppContext.alias.connectionSet.addAll(resp.contentImpl.connections);
    	// });

        processHash.set(MsgType.getAliasConnectionsError, function(data: Dynamic){
    		AppContext.LOGGER.error("getAliasConnectionsError was received from the server");
    	});

     //    processHash.set(MsgType.getAliasLabelsResponse, function(data: Dynamic){
    	// 	AppContext.LOGGER.debug("getAliasLabelsResponse was received from the server");
    	// 	var resp: GetAliasLabelsResponse = AppContext.SERIALIZER.fromJsonX(data, GetAliasLabelsResponse);
    	// 	AppContext.alias.labelSet.clear();
    	// 	AppContext.alias.labelSet.addAll(resp.contentImpl.aliasLabels);
    	// });

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
}