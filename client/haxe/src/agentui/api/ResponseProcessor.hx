package agentui.api;

import m3.util.JqueryUtil;
import m3.observable.OSet;
import agentui.api.Synchronizer;
import agentui.model.Context;
import agentui.model.EM;
import agentui.model.ModelObj;

using m3.helper.ArrayHelper;
using m3.helper.OSetHelper;
using m3.helper.StringHelper;
using Lambda;

class ResponseProcessor {

	public static function processResponse(dataArr: Array<Dynamic>):Void {
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
                            updateModelObject(data.type, data.action, data.results);
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
                    case "verificationContent":
                        if (data.result && data.result.handle) {
                            AgentUi.PROTOCOL.addHandle(data.result.handle);
                        } else {
                            updateModelObject(data.type, data.action, data.results);
                        }
                    case "verificationRequest":
                        EM.change(EMEvent.VerificationRequest_RESPONSE);
                    case "respondToVerificationRequest":
                        EM.change(EMEvent.RespondToVerification_RESPONSE);
                    case "acceptVerification":
                        EM.change(EMEvent.AcceptVerification_RESPONSE);
                    case "verificationRequestRejected":
                        EM.change(EMEvent.RejectVerificationRequest_RESPONSE);
                    case "verificationResponseRejected":
                        EM.change(EMEvent.RejectVerification_RESPONSE);
                    default:
                        Synchronizer.processResponse(data);
                }
			}
		});
	}

    private static function processModelObject<T>(set:ObservableSet<T>, type: Class<T>, action:String, data:Dynamic):Void {
        for (datum in cast(data, Array<Dynamic>)) {
            var obj = AppContext.SERIALIZER.fromJsonX(datum, type);
            if (action == "delete") {
                set.delete(obj);
            } else {
                set.addOrUpdate(obj);
            }
        }
    }

    private static function updateModelObject(type:String, action:String, data:Dynamic) {
        var type = type.toLowerCase();
        switch (type) {
            case "alias":
                processModelObject(AppContext.ALIASES, Alias, action, data);
            case "connection":
                processModelObject(AppContext.CONNECTIONS, Connection, action, data);
            case "content":
                processModelObject(AppContext.VERIFICATION_CONTENT, Content, action, data);
            case "introduction":
                processModelObject(AppContext.INTRODUCTIONS, Introduction, action, data);
            case "label":
                processModelObject(AppContext.LABELS, Label, action, data);
            case "labelacl":
                processModelObject(AppContext.LABELACLS, LabelAcl, action, data);
            case "labelchild":
                processModelObject(AppContext.LABELCHILDREN, LabelChild, action, data);
            case "labeledcontent":
                processModelObject(AppContext.LABELEDCONTENT, LabeledContent, action, data);
            case "notification":
                processModelObject(AppContext.MASTER_NOTIFICATIONS, Notification, action, data);
            case "profile":
                processModelObject(AppContext.PROFILES, Profile, action, data);
            default:
                AppContext.LOGGER.error("Unknown type: " + type);
        }
    }

	public static function initialDataLoad(data:SynchronizationParms) {
		AppContext.ALIASES.addAll(data.aliases);
        AppContext.CONNECTIONS.addAll(data.connections);
		AppContext.LABELS.addAll(data.labels);
		AppContext.LABELCHILDREN.addAll(data.labelChildren);
        AppContext.INTRODUCTIONS.addAll(data.introductions);
        AppContext.MASTER_NOTIFICATIONS.addAll(data.notifications);
        AppContext.LABELEDCONTENT.addAll(data.labeledContent);
        AppContext.LABELACLS.addAll(data.labelAcls);
        AppContext.PROFILES.addAll(data.profiles);

        // Update the aliases with their profile
        for (alias_ in AppContext.ALIASES) {
            for (profile_ in AppContext.PROFILES) {
                if (profile_.aliasIid == alias_.iid) {
                    alias_.profile = profile_;
                    AppContext.ALIASES.update(alias_);
                }
            }
        }

        EM.change(EMEvent.InitialDataLoadComplete);
	}

    public static function processProfile(rec:Dynamic) {
        if (rec.result && rec.result.handle) {
            AgentUi.PROTOCOL.addHandle(rec.result.handle);
        } else {
            var connection = AppContext.CONNECTIONS.getElement(rec.connectionIid);
            var profile = AppContext.SERIALIZER.fromJsonX(rec.results[0], Profile);
            profile.connectionIid = rec.connectionIid;
            connection.data = profile;
            AppContext.CONNECTIONS.addOrUpdate(connection);
            AppContext.PROFILES.addOrUpdate(profile);
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
}
