package ap.api;


// import qoid.api.CrudMessage;
import ap.model.EM;
import m3.serialization.Serialization.Serializer;
import m3.util.UidGenerator;
import qoid.model.ModelObj;
import agentui.model.Filter;
import qoid.QoidAPI;

class EventDelegate {
	
	public static function init() {

		EM.addListener(EMEvent.FILTER_RUN, function(filterData:FilterData): Void {
            if(filterData.type == "albumConfig") {
                QoidAPI.query(new RequestContext("albumConfig"), "content", filterData.filter.q, true, true);
        	} else 
                QoidAPI.query(new RequestContext("filteredContent", UidGenerator.create(12)), "content", filterData.filter.q, true, true);
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

        EM.addListener(EMEvent.DeleteContent, function(data:EditContentData): Void {
            QoidAPI.deleteContent(data.content.iid);
        });

        EM.addListener(EMEvent.CreateLabel, function(data:EditLabelData): Void {
            QoidAPI.createLabel(data.parentIid, data.label.name, data.label.data);
        });

        EM.addListener(EMEvent.UpdateLabel, function(data:EditLabelData): Void {
            QoidAPI.updateLabel(data.label.iid, data.label.name, data.label.data);
        });

        EM.addListener(EMEvent.DeleteLabel, function(data:EditLabelData): Void {
            QoidAPI.deleteLabel(data.label.iid, data.parentIid);
        });

        EM.addListener(EMEvent.UserLogout, function(c:{}):Void{
            QoidAPI.logout();
        });
	}
}