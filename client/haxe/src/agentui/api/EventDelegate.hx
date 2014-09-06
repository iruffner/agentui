package agentui.api;

import m3.jq.JQ;

import agentui.api.CrudMessage;
import agentui.api.ProtocolHandler;
import agentui.model.ModelObj;
import agentui.model.EM;
import agentui.model.Filter;

class EventDelegate {
	
	private var protocolHandler:ProtocolHandler;
	private var filterIsRunning: Bool = false;

	public function new(protocolHandler:ProtocolHandler) {
		this.protocolHandler = protocolHandler;
		this._setUpEventListeners();
	}

	private function _setUpEventListeners() {

		EM.addListener(EMEvent.FILTER_RUN, function(filterData:FilterData): Void {
        	protocolHandler.filter(filterData);
        });

        EM.addListener(EMEvent.CreateAlias, function(alias: Alias): Void {
            protocolHandler.createAlias(alias);
        });

        EM.addListener(EMEvent.DeleteAlias, function(alias: Alias): Void {
            protocolHandler.deleteAlias(alias);
        });

        EM.addListener(EMEvent.UpdateAlias, function(alias: Alias): Void {
            protocolHandler.updateAlias(alias);
        });

        EM.addListener(EMEvent.UserLogin, function(login: Login): Void {
          	protocolHandler.login(login);
        });

        EM.addListener(EMEvent.CreateAgent, function(user: NewUser): Void {
            protocolHandler.createAgent(user);
        });

        EM.addListener(EMEvent.CreateContent, function(data:EditContentData): Void {
        	protocolHandler.createContent(data);
    	});

        EM.addListener(EMEvent.UpdateContent, function(data:EditContentData): Void {
            protocolHandler.updateContent(data);
        });

        EM.addListener(EMEvent.DeleteContent, function(data:EditContentData): Void {
            protocolHandler.deleteContent(data);
        });

        EM.addListener(EMEvent.CreateLabel, function(data:EditLabelData): Void {
        	protocolHandler.createLabel(data);
    	});

        EM.addListener(EMEvent.UpdateLabel, function(data:EditLabelData): Void {
            protocolHandler.updateLabel(data);
        });

        EM.addListener(EMEvent.MoveLabel, function(data:EditLabelData): Void {
            protocolHandler.moveLabel(data);
        });

        EM.addListener(EMEvent.CopyLabel, function(data:EditLabelData): Void {
            protocolHandler.copyLabel(data);
        });

        EM.addListener(EMEvent.DeleteLabel, function(data:EditLabelData): Void {
            protocolHandler.deleteLabel(data);
        });

        EM.addListener(EMEvent.RespondToIntroduction, function(intro: IntroResponseMessage):Void{
            protocolHandler.confirmIntroduction(intro);
        });

        EM.addListener(EMEvent.INTRODUCTION_REQUEST, function(intro: IntroductionRequest):Void{
        	protocolHandler.beginIntroduction(intro);
        });

        EM.addListener(EMEvent.GrantAccess, function(parms:Dynamic):Void{
            protocolHandler.grantAccess(parms.connectionIid, parms.labelIid);
        });

        EM.addListener(EMEvent.RevokeAccess, function(lacls:Array<LabelAcl>):Void{
            protocolHandler.revokeAccess(lacls);
        });

        EM.addListener(EMEvent.DeleteConnection, function(c:Connection):Void{
            protocolHandler.deleteConnection(c);
        });

        EM.addListener(EMEvent.UserLogout, function(c:{}):Void{
            protocolHandler.deregisterAllSqueries();
        });

        EM.addListener(EMEvent.TargetChange, function(conn:Connection):Void{
            // Do something
        });

		EM.addListener(EMEvent.BACKUP, function(n: {}): Void{
        	protocolHandler.backup();
        });

        EM.addListener(EMEvent.RESTORE, function(n: {}): Void{
        	protocolHandler.restore();
        });

        EM.addListener(EMEvent.VerificationRequest, function(vr:VerificationRequest){
            protocolHandler.verificationRequest(vr);
        });

        EM.addListener(EMEvent.RespondToVerification, function(vr:VerificationResponse){
            protocolHandler.respondToVerificationRequest(vr);
        });
        
        EM.addListener(EMEvent.AcceptVerification, function(notificationIid:String){
            protocolHandler.acceptVerification(notificationIid);
        });

        EM.addListener(EMEvent.RejectVerificationRequest, function(notificationIid:String){
            protocolHandler.rejectVerificationRequest(notificationIid);
        });

        EM.addListener(EMEvent.RejectVerification, function(notificationIid:String){
            protocolHandler.rejectVerificationResponse(notificationIid);
        });
	}
}