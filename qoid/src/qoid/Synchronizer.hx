package qoid;
import haxe.ds.StringMap;
import qoid.model.ModelObj;
import m3.serialization.Serialization;
import m3.log.Logga;
import qoid.QoidAPI.RequestContext;
import qoid.ResponseProcessor.Response;
import qoid.ResponseProcessor.ResponseResult;

using m3.helper.OSetHelper;
using m3.helper.ArrayHelper;

class SynchronizationParms {
    public var aliases:Array<Alias>;
    public var connections:Array<Connection>;
    public var introductions:Array<Introduction>;
    public var labels:Array<Label>;
    public var labelChildren:Array<LabelChild>;
    public var labeledContent:Array<LabeledContent>;
    public var labelAcls:Array<LabelAcl>;
    public var notifications:Array<Notification<Dynamic>>;
    public var profiles:Array<Profile>;

    public function new() {
        aliases = new Array<Alias>();
        connections = new Array<Connection>();
        introductions = new Array<Introduction>();
        labels  = new Array<Label>();
        labelAcls = new Array<LabelAcl>();
        labelChildren = new Array<LabelChild>();
        labeledContent = new Array<LabeledContent>();
        notifications = new Array<Notification<Dynamic>>();
        profiles      = new Array<Profile>();
    }
}

class Synchronizer {
	// The global list of synchronizers
	public static var synchronizers = new StringMap<Synchronizer>();

    public static function processResponse(context: RequestContext, data: Response):Bool {
        var synchronizer = Synchronizer.synchronizers.get(context.context);
        if (synchronizer != null) {
            synchronizer.dataReceived(context, data);
        }
        return (synchronizer != null);
    }

	public static function remove(iid:String) {
		synchronizers.remove(iid);
	}

	public var context: String;
    public var numResponsesExpected: Int;
    private var oncomplete: SynchronizationParms->Void;
    private var parms: SynchronizationParms;

    public function new(context:String, numResponsesExpected:Int, oncomplete:SynchronizationParms->Void) {
    	this.context = context;
    	this.numResponsesExpected = numResponsesExpected;
    	this.oncomplete = oncomplete;
    	this.parms = new SynchronizationParms();
        synchronizers.set(context, this);
    }

    private function processDataReceived<T>(list:Array<T>, type: Class<T>, result:ResponseResult):Void {
        var data = result.results;
        if(data.hasValues())
            for (datum in data) {
                list.push(Serializer.instance.fromJsonX(datum, type));
            }
    }

    private function processProfileReceived<T>(list:Array<Profile>, result:ResponseResult):Void {
        var data = result.results;
        for (datum in data) {
            var profile: Profile = Serializer.instance.fromJsonX(datum, Profile);
            if(result.route.hasValues()) 
                profile.connectionIid = result.route[result.route.length - 1];
            list.push(profile);
        }
    }

    private function processNotificationReceived<T>(list:Array<Notification<T>>, result:ResponseResult):Void {
        var data = result.results;
        if(data.hasValues())
            for (datum in data) {
                var notification: Notification<T> = Serializer.instance.fromJsonX(datum, Notification);
                // if(result.route.hasValues()) 
                //     notification.connectionIid = result.route[0];
                list.push(notification);
            }
    }

    public function dataReceived(c:RequestContext, dataObj:Response) {
        var data: ResponseResult = dataObj.result;
        var type: String = dataObj.result.type.toLowerCase();

        if (data != null) {
        	switch (type) {
        		case "alias":
                    processDataReceived(parms.aliases, Alias, data);
                case "connection":
                    processDataReceived(parms.connections, Connection, data);
                case "introduction":
                    processDataReceived(parms.introductions, Introduction, data);
        		case "label":
                    processDataReceived(parms.labels, Label, data);
                case "labelacl":
                    processDataReceived(parms.labelAcls, LabelAcl, data);
        		case "labelchild":
                    processDataReceived(parms.labelChildren, LabelChild, data);
                case "labeledcontent":
                    processDataReceived(parms.labeledContent, LabeledContent, data);
                case "notification":
                    processNotificationReceived(parms.notifications, data);
                case "profile":
                    processProfileReceived(parms.profiles, data);
                default:
                    Logga.DEFAULT.error("Unknown data type: " + data.type);
            }
        }
    	numResponsesExpected -= 1;
    	if (numResponsesExpected == 0) {
            oncomplete(parms);
   			Synchronizer.remove(this.context);
    	}
    }
}
