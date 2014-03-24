package ui.api;

import haxe.ds.StringMap;
import haxe.Timer;

import m3.jq.JQ;
import m3.util.JqueryUtil;
import m3.observable.OSet;
import ui.api.Synchronizer;
import ui.model.Context;
import ui.model.EM;
import ui.model.Filter;
import ui.model.ModelObj;
import ui.api.Requester;

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
                if (data.context == null) {
                    return;
                }
                var context = new Context(data.context);

                switch (context.oncomplete) {
                    case "initialDataLoad":
                        if (data.responseType == "query") {
                            Synchronizer.processResponse(data);
                        } else if (data.responseType == "squery") {
                            updateModelObject(data.data.type, data.data);
                        } else if (data.result && data.result.handle) {
                            AgentUi.PROTOCOL.addHandle(data.result.handle);
                        }
                    case "filterContent":
                        if (data.responseType == "query") {
                        } else if (data.responseType == "squery") {
                        }
                    default:
                        Synchronizer.processResponse(data);
                }
			}
		});
	}

    public static function processContent(dataArr: Array<Dynamic>, textStatus: String, jqXHR: JQXHR) {
    }

    private static function updateModelObject(type:String, data:Dynamic) {
        var type = type.toLowerCase();
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
            case "labelacl":
                AppContext.MASTER_LABELACLS.addOrUpdate(AppContext.SERIALIZER.fromJsonX(data.instance, LabelAcl));
            case "labelchild":
                AppContext.MASTER_LABELCHILDREN.addOrUpdate(AppContext.SERIALIZER.fromJsonX(data.instance, LabelChild));
            case "labeledcontent":
                AppContext.MASTER_LABELEDCONTENT.addOrUpdate(AppContext.SERIALIZER.fromJsonX(data.instance, LabeledContent));
            case "notification":
                AppContext.MASTER_NOTIFICATIONS.addOrUpdate(AppContext.SERIALIZER.fromJsonX(data.instance, Notification));
            case "profile":
                AppContext.PROFILES.addOrUpdate(AppContext.SERIALIZER.fromJsonX(data.instance, Profile));
            default:
                AppContext.LOGGER.error("Unknown type: " + type);
        }
    }

	public static function initialDataLoad(data:SynchronizationParms) {
		AppContext.MASTER_ALIASES.addAll(data.aliases);
		AppContext.MASTER_LABELS.addAll(data.labels);
		AppContext.MASTER_LABELCHILDREN.addAll(data.labelChildren);
        AppContext.MASTER_CONNECTIONS.addAll(data.connections);
        AppContext.INTRODUCTIONS.addAll(data.introductions);
        AppContext.MASTER_NOTIFICATIONS.addAll(data.notifications);
        AppContext.MASTER_CONTENT.addAll(data.content);
        AppContext.MASTER_LABELEDCONTENT.addAll(data.labeledContent);
        AppContext.MASTER_LABELACLS.addAll(data.labelAcls);
        AppContext.PROFILES.addAll(data.profiles);

        EM.change(EMEvent.InitialDataLoadComplete);
	}

    public static function aliasCreated(data:SynchronizationParms) {
        AppContext.MASTER_ALIASES.addAll(data.aliases);
        AppContext.MASTER_LABELCHILDREN.addAll(data.labelChildren);
        AppContext.MASTER_LABELS.addAll(data.labels);
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

    public static function filterContent(data:SynchronizationParms, filterIid:String) {
        var displayedContent = new ObservableSet<Content<Dynamic>>(ModelObjWithIid.identifier);
        displayedContent.addAll(data.content);

        var fr = new FilterResponse(filterIid, displayedContent);

        EM.change(LoadFilteredContent, fr);
        EM.change(EMEvent.FitWindow);
    }
}
