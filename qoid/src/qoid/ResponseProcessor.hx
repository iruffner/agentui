package qoid;

import haxe.Json;
import m3.serialization.Serialization.Serializer;
import qoid.Qoid;
import m3.observable.OSet;
import m3.event.EventManager;
import m3.log.Logga;
import m3.serialization.Serialization;
import qoid.QoidAPI.RequestContext;
import qoid.Synchronizer;
import qoid.model.ModelObj;

using m3.helper.ArrayHelper;
using m3.helper.OSetHelper;
using m3.helper.StringHelper;
using Lambda;
using StringTools;

typedef Response = {
    var success: Bool;
    var context: Dynamic<String>;
    var error: Dynamic;
    var result: ResponseResult;
}

typedef ResponseResult = {
    var route: Array<String>;
    var standing: Bool;
    var type: String;
    var results: Array<Dynamic>;
    @:optional var action: String;
}

class ResponseProcessor {

	public static function processResponse(dataArr: Array<Response>):Void {

		dataArr.iter(function(data: Response): Void {
			if (!data.success) {
				// JqueryUtil.alert("ERROR:  " + data.error.message + "     Context: " + data.context);
	            Logga.DEFAULT.error(data.error.stacktrace);
            } else {
                var context:RequestContext = Serializer.instance.fromJsonX(data.context, RequestContext);
                var result:ResponseResult = data.result;
                if (context.context == "initialDataLoad") {
                    if (result != null) {
                        if (result.standing == true) {
                            updateModelObject(result);//result.type, result.action, result.results);
                        } else {
                            Synchronizer.processResponse(context, data);
                        }
                    }
                } else if (context.context == "dataReload") {
                    if(result != null) {
                        updateModelObject(result);
                    }
                } else if (context.context == "verificationContent" && result != null) {
                    updateModelObject(result);
                } else if (context.context.startsWith("acceptVerificationRequest2") && result != null) {
                    QoidAPI.acceptVerificationRequest2(context.context, result);
                } else if (context.context.startsWith("acceptVerification2") && result != null) {
                    QoidAPI.acceptVerification2(context.context, result);
                } else if (!Synchronizer.processResponse(context, data)){
                    if (result != null) {
                        var eventId = "on" + context.context.capitalizeFirstLetter();
                        EventManager.instance.fire(eventId, data);
                    }
                }
			}
		});
	}

    private static function processModelObject<T>(set:ObservableSet<T>, type: Class<T>, action:String, data:Array<Dynamic>):Void {
        if(data.hasValues())
            for (datum in data) {
                var obj = Serializer.instance.fromJsonX(datum, type);
                if (action == "delete") {
                    set.delete(obj);
                } else {
                    set.addOrUpdate(obj);
                }
            }
    }

    private static function updateModelObject(result: ResponseResult) { //type:String, action:String, data:Dynamic) {
        var type: String = result.type.toLowerCase();
        var action: String = result.action;
        var data: Array<Dynamic> = result.results;
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
