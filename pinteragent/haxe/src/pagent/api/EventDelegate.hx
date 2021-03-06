package pagent.api;


import agentui.model.Filter;
import m3.serialization.Serialization.Serializer;
import m3.util.UidGenerator;
import pagent.model.EM;
import qoid.QoidAPI;
import qoid.model.ModelObj;

class EventDelegate {
	
	public static function init() {

		EM.addListener(EMEvent.FILTER_RUN, function(filterData:FilterData): Void {
            if(filterData.type == "boardConfig") {
                QoidAPI.query(new RequestContext("boardConfig"), "content", filterData.filter.q, true, true);
        	} else 
                QoidAPI.query(new RequestContext("filteredContent", UidGenerator.create(12)), "content", filterData.filter.q, true, true, filterData.connectionIids);
        });

        EM.addListener(EMEvent.CreateAgent, function(user: NewUser): Void {
            QoidAPI.createAgent(user.name, user.pwd);
        });

        EM.addListener(EMEvent.CreateContent, function(data:EditContentData): Void {
            //make sure we use our Serializer to process the content, or it will send transient fields to the server
        	QoidAPI.createContent(data.content.contentType, Serializer.instance.toJson(data.content).data, data.labelIids, null/*routes*/, data.semanticId);
    	});

        EM.addListener(EMEvent.UpdateContent, function(data:EditContentData): Void {
            //make sure we use our Serializer to process the content, or it will send transient fields to the server
            QoidAPI.updateContent(data.content.iid, Serializer.instance.toJson(data.content).data);
        });

        // EM.addListener(EMEvent.DeleteContent, function(data:EditContentData): Void {
        //     QoidAPI.deleteContent(data.content.iid);
        // });

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

        EM.addListener(EMEvent.GrantAccess, function(acl: LabelAcl):Void{
            QoidAPI.grantAccess(acl.labelIid, acl.connectionIid, acl.maxDegreesOfVisibility);
        });

        EM.addListener(EMEvent.RevokeAccess, function(parms: {connectionIid: String,labelIid: String}):Void{
            QoidAPI.revokeAccess(parms.labelIid, parms.connectionIid);
        });

        EM.addListener(EMEvent.UpdateAccess, function(acl: LabelAcl):Void{
            QoidAPI.updateAccess(acl.labelIid, acl.connectionIid, acl.maxDegreesOfVisibility);
        });

        EM.addListener(EMEvent.DeleteConnection, function(c:Connection):Void{
            QoidAPI.deleteConnection(c.iid);
        });

        EM.addListener(EMEvent.UserLogout, function(c:{}):Void{
            QoidAPI.logout();
        });
	}
}