package agentui.api;

import agentui.api.CrudMessage.IntroResponseMessage;
import m3.jq.JQ;

import m3.serialization.Serialization.Serializer;
import m3.util.UidGenerator;
import qoid.model.ModelObj;
import agentui.model.Filter;
import qoid.model.ModelObj;

import agentui.model.EM;

import qoid.QoidAPI;

class EventDelegate {
	
	public static function init() {

		EM.addListener(EMEvent.FILTER_RUN, function(filterData:FilterData): Void {
        	QoidAPI.query(new RequestContext("filteredContent", UidGenerator.create(12)), "content", filterData.filter.q, true, true);
        });

        EM.addListener(EMEvent.DeleteAlias, function(alias: Alias): Void {
            QoidAPI.deleteAlias(alias.iid);
        });

        EM.addListener(EMEvent.UpdateAlias, function(alias: Alias): Void {
            QoidAPI.updateAlias(alias.iid, alias.data);
        });

        EM.addListener(EMEvent.CreateAgent, function(user: NewUser): Void {
            QoidAPI.createAgent(user.name, user.pwd);
        });

        EM.addListener(EMEvent.CreateContent, function(data:EditContentData): Void {
            //make sure we use our Serializer to process the content, or it will send transient fields to the server
            QoidAPI.createContent(data.content.contentType, Serializer.instance.toJson(data.content).data, data.labelIids);
        });

        EM.addListener(EMEvent.UpdateContent, function(data:EditContentData): Void {
            //make sure we use our Serializer to process the content, or it will send transient fields to the server
            QoidAPI.updateContent(data.content.iid, Serializer.instance.toJson(data.content).data);
        });

        EM.addListener(EMEvent.CreateLabel, function(data:EditLabelData): Void {
            QoidAPI.createLabel(data.parentIid, data.label.name, data.label.data);
    	});

        EM.addListener(EMEvent.UpdateLabel, function(data:EditLabelData): Void {
            QoidAPI.updateLabel(data.label.iid, data.label.name, data.label.data);
        });

        EM.addListener(EMEvent.MoveLabel, function(data:EditLabelData): Void {
            QoidAPI.moveLabel(data.label.iid, data.parentIid, data.newParentId);
        });

        EM.addListener(EMEvent.CopyLabel, function(data:EditLabelData): Void {
            QoidAPI.copyLabel(data.label.iid, data.newParentId);
        });

        EM.addListener(EMEvent.DeleteLabel, function(data:EditLabelData): Void {
            QoidAPI.deleteLabel(data.label.iid, data.parentIid);
        });

        EM.addListener(EMEvent.RespondToIntroduction, function(intro: IntroResponseMessage):Void{
            if(intro.accepted)
                QoidAPI.acceptIntroduction(intro.notificationIid);
            else
                QoidAPI.consumeNotification(intro.notificationIid);
        });

        // TODO:  Add DOV
        EM.addListener(EMEvent.GrantAccess, function(parms:Dynamic):Void{
            QoidAPI.grantAccess(parms.labelIid, parms.connectionIid, 1);
        });

        EM.addListener(EMEvent.RevokeAccess, function(parms: {connectionIid: String,labelIid: String}):Void{
            QoidAPI.revokeAccess(parms.labelIid, parms.connectionIid);
        });

        EM.addListener(EMEvent.DeleteConnection, function(c:Connection):Void{
            QoidAPI.deleteConnection(c.iid);
        });

        EM.addListener(EMEvent.UserLogout, function(c:{}):Void{
            QoidAPI.logout();
        });

        EM.addListener(EMEvent.VerificationRequest, function(vr:VerificationRequest){
            // TODO:  protocolHandler.verificationRequest(vr);
        });

        EM.addListener(EMEvent.RespondToVerification, function(vr:VerificationResponse){
            // TODO:  protocolHandler.respondToVerificationRequest(vr);
        });
        
        EM.addListener(EMEvent.AcceptVerification, function(notificationIid:String){
            // TODO:  protocolHandler.acceptVerification(notificationIid);
        });

        EM.addListener(EMEvent.RejectVerificationRequest, function(notificationIid:String){
            // TODO:  protocolHandler.rejectVerificationRequest(notificationIid);
        });

        EM.addListener(EMEvent.RejectVerification, function(notificationIid:String){
            // TODO:  protocolHandler.rejectVerificationResponse(notificationIid);
        });
	}
}