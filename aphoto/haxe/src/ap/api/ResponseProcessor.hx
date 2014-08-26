package ap.api;

import ap.APhotoContext;
import ap.AppContext;
import ap.APhoto;

import haxe.ds.StringMap;
import haxe.Timer;

import m3.jq.JQ;
import m3.util.JqueryUtil;
import m3.observable.OSet;

import ap.api.Synchronizer;
import qoid.model.Context;
import ap.model.EM;
import qoid.model.Filter;
import qoid.model.ModelObj;
import qoid.api.Requester;

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
                    case "initialDataLoad":
                        if (data.responseType == "query") {
                            Synchronizer.processResponse(data);
                        } else if (data.responseType == "squery") {
                            updateModelObject(data.type, data.action, data.results);
                        } else if (data.result && data.result.handle) {
                            APhoto.PROTOCOL.addHandle(data.result.handle);
                        }
                    case "filterContent":
                        if (data.responseType == "query") {
                            EM.change(EMEvent.LoadFilteredContent, data);
                        } else if (data.responseType == "squery") {
                            EM.change(EMEvent.AppendFilteredContent, data);
                        } else if (data.result && data.result.handle) {
                            APhoto.PROTOCOL.addHandle(data.result.handle);
                        }
                    // case "albumConfigs":
                    //     if (data.responseType == "query") {
                    //         EM.change(EMEvent.LoadFilteredContent, data);
                    //     } else if (data.responseType == "squery") {
                    //         EM.change(EMEvent.AppendFilteredContent, data);
                    //     } else if (data.result && data.result.handle) {
                    //         APhoto.PROTOCOL.addHandle(data.result.handle);
                    //     }
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
		AppContext.LABELS.addAll(data.labels);
		AppContext.LABELCHILDREN.addAll(data.labelChildren);
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

    public static function albumConfigs(data:SynchronizationParms) {
        APhotoContext.ALBUM_CONFIGS.addAll(cast data.content);
    }

    // public static function processProfile(rec:Dynamic) {
    //     if (rec.result && rec.result.handle) {
    //         APhoto.PROTOCOL.addHandle(rec.result.handle);
    //     } else {
    //         var connection = AppContext.CONNECTIONS.getElement(rec.connectionIid);
    //         var profile = AppContext.SERIALIZER.fromJsonX(rec.results[0], Profile);
    //         profile.connectionIid = rec.connectionIid;
    //         connection.data = profile;
    //         AppContext.CONNECTIONS.addOrUpdate(connection);
    //         AppContext.PROFILES.addOrUpdate(profile);
    //     }
    // }
}
