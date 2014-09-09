package qoid;
import haxe.ds.StringMap;
import qoid.model.ModelObj;
import m3.serialization.Serialization;
import m3.log.Logga;

using m3.helper.OSetHelper;

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

    public static function processResponse(data:Dynamic):Void {
        var context:String = data.context.split("-")[0];
        var synchronizer = Synchronizer.synchronizers.get(context);
        synchronizer.dataReceived(context, data.result);
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

    private function processDataReceived<T>(list:Array<T>, type: Class<T>, data:Dynamic):Void {
        for (datum in cast(data, Array<Dynamic>)) {
            list.push(Serializer.instance.fromJsonX(datum, type));
        }
    }

    public function dataReceived(c:String, dataObj:Dynamic) {
        var data = dataObj.results;
        var type = dataObj.type.toLowerCase();

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
                    processDataReceived(parms.notifications, Notification, data);
                case "profile":
                    processDataReceived(parms.profiles, Profile, data);
                default:
                    Logga.DEFAULT.error("Unknown data type: " + dataObj.type);
            }
        }
    	numResponsesExpected -= 1;
    	if (numResponsesExpected == 0) {
            oncomplete(parms);
   			Synchronizer.remove(this.context);
    	}
    }
}
