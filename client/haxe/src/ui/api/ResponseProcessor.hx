package ui.api;

import haxe.ds.StringMap;

import m3.jq.JQ;
import m3.util.JqueryUtil;
import m3.observable.OSet;
import ui.api.Synchronizer;
import ui.model.EM;
import ui.model.ModelObj;

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
                    processProfile(data.data);
                } else if (data.responseType == "squery") {
                    updateModelObject(data.data);
                } else {
    				var context:Array<String> = data.context.split("-");
                    if (context == null) {return;}

					var synchronizer = Synchronizer.synchronizers.get(context[0]);
					if (synchronizer == null) {
						synchronizer = Synchronizer.add(data.context);
					}
					synchronizer.dataReceived(data);
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
            default:
                AppContext.LOGGER.error("Unknown type: " + type);
        }
    }

	public static function initialDataLoad(data:SynchronizationParms) {
		// Load the data into the app context
        if (data.agent != null) {
            AppContext.AGENT = data.agent;
        } else {
            // Create a dummy agent with the correct agent id
            AppContext.AGENT = new Agent();
            AppContext.AGENT.iid = AppContext.AGENT.name = data.aliases[0].agentId;
        }
        if (AppContext.AGENT.data.name.isBlank()) {
            AppContext.AGENT.data = new UserData(AppContext.AGENT.name, "media/test/koi.jpg");
        }

		AppContext.MASTER_ALIASES.addAll(data.aliases);
		AppContext.MASTER_LABELS.addAll(data.labels);
		AppContext.MASTER_CONTENT.addAll(data.content);
		AppContext.MASTER_LABELEDCONTENT.addAll(data.labeledContent);
		AppContext.MASTER_LABELCHILDREN.addAll(data.labelChildren);
        AppContext.MASTER_CONNECTIONS.addAll(data.connections);
        AppContext.INTRODUCTIONS.addAll(data.introductions);
        AppContext.MASTER_NOTIFICATIONS.addAll(data.notifications);

    	var initialAlias:Alias = null;
    	for (alias in AppContext.ALIASES) {
    		if (alias.data.isDefault) {
    			initialAlias = alias;
    			break;
    		}
    	}
    	if (initialAlias == null) {
	     	initialAlias = AppContext.ALIASES.iterator().next();
	    }
	    AppContext.currentAlias = initialAlias;

        // Set the uber label's iid
        var uberAlias = AppContext.ALIASES.getElement(AppContext.AGENT.uberAliasIid);
        AppContext.UBER_LABEL_IID = uberAlias.rootLabelIid;

        // Set the intro label's iid
        var fs = new FilteredSet<Label>(AppContext.MASTER_LABELS, function(c:Label):Bool {
            return c.name == "intro label";
        });
        AppContext.INTRO_LABEL_IID = fs.iterator().next().iid;
        AppContext.LABELCHILDREN.refilter();

    	// Fire the events that will cause the UI to load the data
		EM.change(EMEvent.AGENT, AppContext.AGENT);
		EM.change(EMEvent.FitWindow);
	}

    public static function registerModelUpdates(data:SynchronizationParms) {
        modelUpdateHandle = data.result.handle;
    }

    public static function processProfile(rec:Dynamic) {
        var connection = AppContext.MASTER_CONNECTIONS.getElement(rec.connectionIid);
        connection.data = AppContext.SERIALIZER.fromJsonX(rec.profile, UserData);
        AppContext.MASTER_CONNECTIONS.addOrUpdate(connection);
    }

    public static function beginIntroduction(data:SynchronizationParms) {
        EM.change(EMEvent.INTRODUCTION_RESPONSE);
    }

    public static function confirmIntroduction(data:SynchronizationParms) {
        EM.change(RespondToIntroduction_RESPONSE);
    }
}