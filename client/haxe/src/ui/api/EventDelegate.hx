package ui.api;

import m3.jq.JQ;

import ui.api.CrudMessage;
import ui.api.ProtocolHandler;
import ui.model.ModelObj;
import ui.model.EM;
import ui.model.Filter;

class EventDelegate {
	
	private var protocolHandler:ProtocolHandler;
	private var filterIsRunning: Bool = false;

	public function new(protocolHandler:ProtocolHandler) {
		this.protocolHandler = protocolHandler;
		this._setUpEventListeners();
	}

	private function _setUpEventListeners() {

		EM.addListener(EMEvent.FILTER_RUN, new EMListener(function(filter: Filter): Void {
        	protocolHandler.filter(filter);
        }));

        EM.addListener(EMEvent.PAGE_CLOSE, new EMListener(function(n: Nothing): Void {
			if(filterIsRunning) {
				protocolHandler.stopCurrentFilter(JQ.noop, false);
			} 
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
          	protocolHandler.login(login);
        }));

        EM.addListener(EMEvent.CreateAgent, new EMListener(function(user: NewUser): Void {
            protocolHandler.createAgent(user);
        }));

        EM.addListener(EMEvent.CreateContent, new EMListener(function(data:EditContentData): Void {
        	protocolHandler.createContent(data);
    	}));

        EM.addListener(EMEvent.UpdateContent, new EMListener(function(data:EditContentData): Void {
            protocolHandler.updateContent(data);
        }));

        EM.addListener(EMEvent.DeleteContent, new EMListener(function(data:EditContentData): Void {
            protocolHandler.deleteContent(data);
        }));

        EM.addListener(EMEvent.CreateLabel, new EMListener(function(data:EditLabelData): Void {
        	protocolHandler.createLabel(data);
    	}));

        EM.addListener(EMEvent.UpdateLabel, new EMListener(function(data:EditLabelData): Void {
            protocolHandler.updateLabel(data);
        }));

        EM.addListener(EMEvent.MoveLabel, new EMListener(function(data:EditLabelData): Void {
            protocolHandler.moveLabel(data);
        }));

        EM.addListener(EMEvent.CopyLabel, new EMListener(function(data:EditLabelData): Void {
            protocolHandler.copyLabel(data);
        }));

        EM.addListener(EMEvent.DeleteLabel, new EMListener(function(data:EditLabelData): Void {
            protocolHandler.deleteLabel(data);
        }));

        EM.addListener(EMEvent.RespondToIntroduction, new EMListener(function(intro: IntroResponseMessage):Void{
            protocolHandler.confirmIntroduction(intro);
        }));

        EM.addListener(EMEvent.INTRODUCTION_REQUEST, new EMListener(function(intro: IntroductionRequest):Void{
        	protocolHandler.beginIntroduction(intro);
        }));

        EM.addListener(EMEvent.GrantAccess, new EMListener(function(parms:Dynamic):Void{
            protocolHandler.grantAccess(parms.connectionIid, parms.labelIid);
        }));

        EM.addListener(EMEvent.DeleteConnection, new EMListener(function(c:Connection):Void{
            protocolHandler.deleteConnection(c);
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
	}
}