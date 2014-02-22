package ui.api;

import haxe.ds.StringMap;
import haxe.Timer;

import m3.jq.JQ;
import m3.util.JqueryUtil;
import m3.observable.OSet;
import ui.api.Synchronizer;
import ui.model.EM;
import ui.model.ModelObj;
import ui.api.Requester;

using m3.helper.ArrayHelper;
using m3.helper.OSetHelper;
using m3.helper.StringHelper;
using Lambda;

class ResponseProcessor {

    public static var modelUpdateHandle:String;

	public static function processResponse(dataArr: Array<Dynamic>, textStatus: String, jqXHR: JQXHR) {
		if (dataArr == null || dataArr.length == 0) { return; }

		dataArr.iter(function(data:Dynamic): Void {
			if (data.success == false) {
				JqueryUtil.alert("ERROR:  " + data.error.message + "     Context: " + data.context);
	            AppContext.LOGGER.error(data.error.stacktrace);
            } else {
                if (data.responseType == "profile") {
                    Timer.delay(function() {processProfile(data.data);}, 50);
                } else if (data.responseType == "squery") {
                    updateModelObject(data.data);
                } else {
                    Synchronizer.processResponse(data);
                }
			}
		});
	}

    private static function updateModelObject(data:Dynamic) {
        var type:String = data.type.toLowerCase();
        switch (type) {
            case "alias":
                AppContext.MASTER_ALIASES.addOrUpdate(AppContext.SERIALIZER.fromJsonX(data.instance, Alias));
            case "connection":
                AppContext.MASTER_CONNECTIONS.addOrUpdate(AppContext.SERIALIZER.fromJsonX(data.instance, Connection));
            case "content":
                AppContext.MASTER_CONTENT.addOrUpdate(AppContext.SERIALIZER.fromJsonX(data.instance, Content));
            case "introduction":
                AppContext.INTRODUCTIONS.addOrUpdate(AppContext.SERIALIZER.fromJsonX(data.instance, Introduction));
            case "label":
                AppContext.MASTER_LABELS.addOrUpdate(AppContext.SERIALIZER.fromJsonX(data.instance, Label));
            case "labelchild":
                AppContext.MASTER_LABELCHILDREN.addOrUpdate(AppContext.SERIALIZER.fromJsonX(data.instance, LabelChild));
            case "labeledcontent":
                AppContext.MASTER_LABELEDCONTENT.addOrUpdate(AppContext.SERIALIZER.fromJsonX(data.instance, LabeledContent));
            case "notification":
                AppContext.MASTER_NOTIFICATIONS.addOrUpdate(AppContext.SERIALIZER.fromJsonX(data.instance, Notification));
            case "profile":
                processProfile(data.instance);
            default:
                AppContext.LOGGER.error("Unknown type: " + type);
        }
    }

	public static function initialDataLoad(data:SynchronizationParms) {
		// Load the data into the app context
        if (data.agent != null) {
            AppContext.AGENT = data.agent;
        } else {
            // Create a dummy agent with the correct agent id.  This will be used
            // in sending messages
            AppContext.AGENT = new Agent();
            AppContext.AGENT.iid = AppContext.AGENT.name = data.aliases[0].agentId;
        }

		AppContext.MASTER_ALIASES.addAll(data.aliases);
		AppContext.MASTER_LABELS.addAll(data.labels);
		AppContext.MASTER_LABELCHILDREN.addAll(data.labelChildren);
        AppContext.MASTER_CONNECTIONS.addAll(data.connections);
        AppContext.INTRODUCTIONS.addAll(data.introductions);
        AppContext.MASTER_NOTIFICATIONS.addAll(data.notifications);
        AppContext.MASTER_CONTENT.addAll(data.content);
        AppContext.MASTER_LABELEDCONTENT.addAll(data.labeledContent);

        if (data.agent == null) {
            AgentUi.PROTOCOL.getAgent(data.aliases[0].agentId);
        } else {
            EM.change(EMEvent.AGENT, data.agent);
        }
	}

    public static function registerModelUpdates(data:SynchronizationParms) {
        modelUpdateHandle = data.result.handle;
    }

    public static function processProfile(rec:Dynamic) {
        var connection = AppContext.MASTER_CONNECTIONS.getElement(rec.connectionIid);
        connection.data = AppContext.SERIALIZER.fromJsonX(rec.profile, Profile);
        AppContext.MASTER_CONNECTIONS.addOrUpdate(connection);
    }

    public static function beginIntroduction(data:SynchronizationParms) {
        EM.change(EMEvent.INTRODUCTION_RESPONSE);
    }

    public static function confirmIntroduction(data:SynchronizationParms) {
        EM.change(RespondToIntroduction_RESPONSE);
    }

    public static function grantAccess(data:SynchronizationParms) {
        EM.change(AccessGranted);
    }

    public static function filterContent(data:SynchronizationParms) {
        var arr = new Array<String>();
        for (c in data.content) {
            arr.push(c.iid);
        }
        var filteredContent = new FilteredSet<Content<Dynamic>>(AppContext.MASTER_CONTENT,function(c:Content<Dynamic>):Bool{
            for (iid in arr) {
                if (c.iid == iid) {return true;}
            }
            return false;
        });
        EM.change(LoadFilteredContent, filteredContent);
        EM.change(EMEvent.FitWindow);
    }

    public static function getAgent(data:SynchronizationParms) {
        EM.change(EMEvent.AGENT, data.agent);
    }
}