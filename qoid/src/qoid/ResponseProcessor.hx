package qoid;

import qoid.Qoid;
import m3.util.JqueryUtil;
import m3.observable.OSet;
import m3.event.EventManager;
import m3.log.Logga;
import m3.serialization.Serialization;
import qoid.Synchronizer;
import qoid.model.ModelObj;

using m3.helper.ArrayHelper;
using m3.helper.OSetHelper;
using m3.helper.StringHelper;
using Lambda;
using StringTools;

class ResponseProcessor {

	public static function processResponse(dataArr: Array<Dynamic>):Void {

		dataArr.iter(function(data:Dynamic): Void {
			if (data.success == false) {
				JqueryUtil.alert("ERROR:  " + data.error.message + "     Context: " + data.context);
	            Logga.DEFAULT.error(data.error.stacktrace);
            } else {
                var context:String = data.context;
                if (context.startsWith("initialDataLoad")) {
                    var result:Dynamic = data.result;
                    if (result != null) {
                        if (result.standing == true) {
                            updateModelObject(result.type, result.action, result.results);
                        } else {
                            Synchronizer.processResponse(data);
                        }
                    }
                } else if (context == "verificationContent") {
                    var result:Dynamic = data.result;
                    updateModelObject(result.type, result.action, result.results);
                } else {
                    var eventId = "on" + context.capitalizeFirstLetter();
                    EventManager.instance.change(eventId);
                }
			}
		});
	}

    private static function processModelObject<T>(set:ObservableSet<T>, type: Class<T>, action:String, data:Dynamic):Void {
        for (datum in cast(data, Array<Dynamic>)) {
            var obj = Serializer.instance.fromJsonX(datum, type);
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
                processModelObject(Qoid.aliases, Alias, action, data);
            case "connection":
                processModelObject(Qoid.connections, Connection, action, data);
            case "content":
                processModelObject(Qoid.verificationContent, Content, action, data);
            case "introduction":
                processModelObject(Qoid.introductions, Introduction, action, data);
            case "label":
                processModelObject(Qoid.labels, Label, action, data);
            case "labelacl":
                processModelObject(Qoid.labelAcls, LabelAcl, action, data);
            case "labelchild":
                processModelObject(Qoid.labelChildren, LabelChild, action, data);
            case "labeledcontent":
                processModelObject(Qoid.labeledContent, LabeledContent, action, data);
            case "notification":
                processModelObject(Qoid.notifications, Notification, action, data);
            case "profile":
                processModelObject(Qoid.profiles, Profile, action, data);
            default:
                Logga.DEFAULT.error("Unknown type: " + type);
        }
    }
}
