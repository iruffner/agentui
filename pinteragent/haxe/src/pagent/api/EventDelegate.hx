package pagent.api;

import m3.jq.JQ;

import agentui.api.CrudMessage;
import agentui.model.Filter;
import pagent.model.EM;
import qoid.QoidAPI;
import qoid.model.ModelObj;

class EventDelegate {
	
	// private var QoidAPI:QoidAPI;
	// private var filterIsRunning: Bool = false;

	// public function new(QoidAPI:QoidAPI) {
	// 	this.QoidAPI = QoidAPI;
	// 	this._setUpEventListeners();
	// }

	public static function init() {

		EM.addListener(EMEvent.FILTER_RUN, function(filterData:FilterData): Void {
            if(filterData.type == "boardConfig") {
                QoidAPI.query("boardConfig", "content", filterData.filter.q, true, true);
        	} else 
                QoidAPI.query("filterContent", "content", filterData.filter.q, true, true);
        });

        EM.addListener(EMEvent.CreateAgent, function(user: NewUser): Void {
            QoidAPI.createAgent(user.name, user.pwd);
        });

        EM.addListener(EMEvent.CreateContent, function(data:EditContentData): Void {
        	QoidAPI.createContent(data.content.contentType, data.content, data.labelIids);
    	});

        EM.addListener(EMEvent.UpdateContent, function(data:EditContentData): Void {
            QoidAPI.updateContent(data.content.iid, data.content);
        });

        EM.addListener(EMEvent.DeleteContent, function(data:EditContentData): Void {
            QoidAPI.deleteContent(data.content.iid);
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

        EM.addListener(EMEvent.GrantAccess, function(parms:{connectionIid: String,labelIid: String}):Void{
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
	}
}