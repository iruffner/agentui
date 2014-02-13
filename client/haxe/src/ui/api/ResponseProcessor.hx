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

	public static function processResponse(dataArr: Array<Dynamic>, textStatus: String, jqXHR: JQXHR) {
		if (dataArr == null || dataArr.length == 0) { return; }

		dataArr.iter(function(data:Dynamic): Void {
			if (data.success == false) {
				JqueryUtil.alert("ERROR:  " + data.error.message + "     Context: " + data.context);
	            AppContext.LOGGER.error(data.error.stacktrace);
            } else {
                if (data.type != null) {
                    updateModelObject(data.instance, data.type);
                } else if (Std.is(data.result,String)) {
                    ui.AppContext.LOGGER.warn(data);
                } else {
    				var context:Array<String> = data.context.split("-");
                    if (context == null) {return;}
    				if (context[2] == "initialDataLoad") {
    					var synchronizer = Synchronizer.synchronizers.get(context[0]);
    					if (synchronizer == null) {
    						synchronizer = Synchronizer.add(data.context);
    					}
    					synchronizer.dataReceived(data.result, context[3]);
    				} else if (context[2] == "getProfiles") {
                        for (rec in cast(data.result, Array<Dynamic>)) {
                            var fields = Reflect.fields(rec);
                            var connection = AppContext.MASTER_CONNECTIONS.getElement(fields[0]);
                            connection.data = AppContext.SERIALIZER.fromJsonX(Reflect.getProperty(rec,fields[0]), UserData);
                            AppContext.MASTER_CONNECTIONS.addOrUpdate(connection);
                        }
                    }
                }
			}
		});
	}

    private static function updateModelObject(instance:Dynamic, type:String) {
        type = type.toLowerCase();
        switch (type) {
            case "alias":
                AppContext.MASTER_ALIASES.addOrUpdate(AppContext.SERIALIZER.fromJsonX(instance, Alias));
            case "connection":
                AppContext.MASTER_CONNECTIONS.addOrUpdate(AppContext.SERIALIZER.fromJsonX(instance, Connection));
            case "content":
                AppContext.MASTER_CONTENT.addOrUpdate(AppContext.SERIALIZER.fromJsonX(instance, Content));
            case "introduction":
                AppContext.INTRODUCTIONS.addOrUpdate(AppContext.SERIALIZER.fromJsonX(instance, Introduction));
            case "label":
                AppContext.MASTER_LABELS.addOrUpdate(AppContext.SERIALIZER.fromJsonX(instance, Label));
            case "labelchild":
                AppContext.MASTER_LABELCHILDREN.addOrUpdate(AppContext.SERIALIZER.fromJsonX(instance, LabelChild));
            case "labeledcontent":
                AppContext.MASTER_LABELEDCONTENT.addOrUpdate(AppContext.SERIALIZER.fromJsonX(instance, LabeledContent));
            case "notification":
                AppContext.MASTER_NOTIFICATIONS.addOrUpdate(AppContext.SERIALIZER.fromJsonX(instance, Notification));
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

        // Request the profile for the connections
        var connectionIids = new Array<String>();
        for (connection in AppContext.MASTER_CONNECTIONS) {
            connectionIids.push(connection.iid);
        }
        AgentUi.PROTOCOL.getProfiles(connectionIids);

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
        var fs = new FilteredSet<Label>(AppContext.MASTER_LABELS, function(c:Label):Bool {
            return c.name == "uber label";
        });
        AppContext.UBER_LABEL_IID = fs.iterator().next().iid;

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
}