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

        EM.addListener(EMEvent.CreateAlias, new EMListener(function(alias: Alias): Void {
            protocolHandler.createAlias(alias);
        }));

        EM.addListener(EMEvent.DeleteAlias, new EMListener(function(alias: Alias): Void {
            protocolHandler.deleteAlias(alias);
        }));

        EM.addListener(EMEvent.UpdateAlias, new EMListener(function(alias: Alias): Void {
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

        EM.addListener(EMEvent.CreateContent, new EMListener(function(data:EditContentData): Void {
        	protocolHandler.createContent(data);
    	}));

        EM.addListener(EMEvent.UpdateContent, new EMListener(function(data:EditContentData): Void {
            protocolHandler.updateContent(data);
        }));

        EM.addListener(EMEvent.CreateLabel, new EMListener(function(data:EditLabelData): Void {
        	protocolHandler.createLabel(data);
    	}));

        EM.addListener(EMEvent.UpdateLabel, new EMListener(function(data:EditLabelData): Void {
            protocolHandler.updateLabel(data);
        }));

        EM.addListener(EMEvent.DeleteLabel, new EMListener(function(data:EditLabelData): Void {
            protocolHandler.deleteLabel(data);
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