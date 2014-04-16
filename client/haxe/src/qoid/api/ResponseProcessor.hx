package qoid.api;

import haxe.ds.StringMap;
import haxe.Timer;

import m3.jq.JQ;
import m3.util.JqueryUtil;
import m3.observable.OSet;
import qoid.api.Synchronizer;
import qoid.model.Context;
import qoid.model.EM;
import qoid.model.Filter;
import qoid.model.ModelObj;
import qoid.api.Requester;

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
                    case "beginIntroduction":
                        beginIntroduction();
                    case "confirmIntroduction":
                        confirmIntroduction();
                    case "connectionProfile":
                        processProfile(data);
                    case "grantAccess":
                        grantAccess();
                    case "initialDataLoad":
                        if (data.responseType == "query") {
                            Synchronizer.processResponse(data);
                        } else if (data.responseType == "squery") {
                            updateModelObject(data.type, data.results);
                        } else if (data.result && data.result.handle) {
                            AgentUi.PROTOCOL.addHandle(data.result.handle);
                        }
                    case "filterContent":
                        if (data.responseType == "query") {
                            EM.change(EMEvent.LoadFilteredContent, data);
                        } else if (data.responseType == "squery") {
                            EM.change(EMEvent.AppendFilteredContent, data);
                        } else if (data.result && data.result.handle) {
                            AgentUi.PROTOCOL.addHandle(data.result.handle);
                        }
                    case "verificationRequest":
                        if (data.result == "success") {
                            EM.change(EMEvent.VerificationResponse);
                        }
                    default:
                        Synchronizer.processResponse(data);
                }
			}
		});
	}

    private static function updateModelObject(type:String, data:Dynamic) {
        var type = type.toLowerCase();
        switch (type) {
            case "alias":
                for (alias_ in cast(data, Array<Dynamic>)) {
                    AppContext.MASTER_ALIASES.addOrUpdate(AppContext.SERIALIZER.fromJsonX(alias_, Alias));
                }
            case "connection":
                for (content_ in cast(data, Array<Dynamic>)) {
                    AppContext.MASTER_CONNECTIONS.addOrUpdate(AppContext.SERIALIZER.fromJsonX(content_, Connection));
                }
            case "introduction":
                for (content_ in cast(data, Array<Dynamic>)) {
                    AppContext.INTRODUCTIONS.addOrUpdate(AppContext.SERIALIZER.fromJsonX(content_, Introduction));
                }
            case "label":
                for (label_ in cast(data, Array<Dynamic>)) {
                    AppContext.MASTER_LABELS.addOrUpdate(AppContext.SERIALIZER.fromJsonX(label_, Label));
                }
            case "labelacl":
                for (label_ in cast(data, Array<Dynamic>)) {
                    AppContext.MASTER_LABELACLS.addOrUpdate(AppContext.SERIALIZER.fromJsonX(label_, LabelAcl));
                }
            case "labelchild":
                for (labelChild_ in cast(data, Array<Dynamic>)) {
                    AppContext.MASTER_LABELCHILDREN.addOrUpdate(AppContext.SERIALIZER.fromJsonX(labelChild_, LabelChild));
                }
            case "labeledcontent":
                for (labeledContent_ in cast(data, Array<Dynamic>)) {
                    AppContext.MASTER_LABELEDCONTENT.addOrUpdate(AppContext.SERIALIZER.fromJsonX(labeledContent_, LabeledContent));
                }
            case "notification":
                for (content_ in cast(data, Array<Dynamic>)) {
                    AppContext.MASTER_NOTIFICATIONS.addOrUpdate(AppContext.SERIALIZER.fromJsonX(content_, Notification));
                }
            case "profile":
                for (profile_ in cast(data, Array<Dynamic>)) {
                    AppContext.PROFILES.addOrUpdate(AppContext.SERIALIZER.fromJsonX(profile_, Profile));
                }
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
        AppContext.MASTER_LABELEDCONTENT.addAll(data.labeledContent);
        AppContext.MASTER_LABELACLS.addAll(data.labelAcls);
        AppContext.PROFILES.addAll(data.profiles);

        // Update the aliases with their profile
        for (alias_ in AppContext.MASTER_ALIASES) {
            for (profile_ in AppContext.PROFILES) {
                if (profile_.aliasIid == alias_.iid) {
                    alias_.profile = profile_;
                    AppContext.MASTER_ALIASES.update(alias_);
                }
            }
        }

        EM.change(EMEvent.InitialDataLoadComplete);
	}

    public static function processProfile(rec:Dynamic) {
        if (rec.result && rec.result.handle) {
            AgentUi.PROTOCOL.addHandle(rec.result.handle);
        } else {
            var connection = AppContext.MASTER_CONNECTIONS.getElement(rec.connectionIid);
            connection.data = AppContext.SERIALIZER.fromJsonX(rec.results[0], Profile);
            AppContext.MASTER_CONNECTIONS.addOrUpdate(connection);
        }
    }

    public static function beginIntroduction() {
        EM.change(EMEvent.INTRODUCTION_RESPONSE);
    }

    public static function confirmIntroduction() {
        EM.change(RespondToIntroduction_RESPONSE);
    }

    public static function grantAccess() {
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
