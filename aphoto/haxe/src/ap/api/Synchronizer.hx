package ap.api;

import ap.AppContext;
import haxe.ds.StringMap;
import m3.util.UidGenerator;
import qoid.model.Context;
import qoid.model.ModelObj;

using m3.helper.OSetHelper;

class SynchronizationParms {
    public var aliases:Array<Alias>;
    public var content:Array<Content<Dynamic>>;
    public var labels:Array<Label>;
    public var labelChildren:Array<LabelChild>;
    public var labeledContent:Array<LabeledContent>;
    public var labelAcls:Array<LabelAcl>;
    // public var notifications:Array<Notification<Dynamic>>;
    public var profiles:Array<Profile>;

    public function new() {
        aliases = new Array<Alias>();
        content = new Array<Content<Dynamic>>();
        labels  = new Array<Label>();
        labelAcls = new Array<LabelAcl>();
        labelChildren = new Array<LabelChild>();
        labeledContent = new Array<LabeledContent>();
        // notifications = new Array<Notification<Dynamic>>();
        profiles      = new Array<Profile>();
    }
}

class Synchronizer {
	// The global list of synchronizers
	public static var synchronizers = new StringMap<Synchronizer>();

	public static function createContext(numResponsesExpected: Int, oncomplete:String):String {
		return UidGenerator.create(32) + "-" + Std.string(numResponsesExpected) + "-" + oncomplete;
	}

    public static function processResponse(data:Dynamic):Void {
        var context = new Context(data.context);

        var synchronizer = Synchronizer.synchronizers.get(context.iid);
        if (synchronizer == null) {
            synchronizer = Synchronizer.add(context);
        }
        synchronizer.dataReceived(context, data);
    }

	public static function add(c:Context):Synchronizer {
		var synchronizer = new Synchronizer(c.iid, c.numResponsesExpected, c.oncomplete);
		synchronizers.set(c.iid, synchronizer);
		return synchronizer;
	}

	public static function remove(iid:String) {
		synchronizers.remove(iid);
	}

	public var iid: String;
    public var numResponsesExpected: Int;
    private var oncomplete: String;
    private var parms: SynchronizationParms;

    public function new(iid:String, numResponsesExpected:Int, oncomplete:String) {
    	this.iid = iid;
    	this.numResponsesExpected = numResponsesExpected;
    	this.oncomplete = oncomplete;
    	this.parms = new SynchronizationParms();
    }

    private function processDataReceived<T>(list:Array<T>, type: Class<T>, data:Dynamic):Void {
        for (datum in cast(data, Array<Dynamic>)) {
            list.push(AppContext.SERIALIZER.fromJsonX(datum, type));
        }
    }

    public function dataReceived(c:Context, dataObj:Dynamic) {
        var data = dataObj.results;
        if (data == null) {return;}

        var type = dataObj.type.toLowerCase();

    	switch (type) {
    		case "alias":
                processDataReceived(parms.aliases, Alias, data);
            case "content":
                processDataReceived(parms.content, Content, data);
    		case "label":
                processDataReceived(parms.labels, Label, data);
            case "labelacl":
                processDataReceived(parms.labelAcls, LabelAcl, data);
    		case "labelchild":
                processDataReceived(parms.labelChildren, LabelChild, data);
            case "labeledcontent":
                processDataReceived(parms.labeledContent, LabeledContent, data);
            // case "notification":
            //     processDataReceived(parms.notifications, Notification, data);
            case "profile":
                processDataReceived(parms.profiles, Profile, data);
            default:
                AppContext.LOGGER.error("Unknown data type: " + dataObj.type);
        }

    	numResponsesExpected -= 1;
    	if (numResponsesExpected == 0) {
    		var func = Reflect.field(ResponseProcessor, oncomplete);
            if (func == null) {
                AppContext.LOGGER.info("Missing oncomplete function: " + oncomplete);
            } else {
        		Reflect.callMethod(ResponseProcessor, func, [parms]);
            }
   			Synchronizer.remove(this.iid);
            var length = 0;
            for (key in synchronizers.keys()) {
                length += 1;
            }
            AppContext.LOGGER.info("Number Synchronizers: " + length);
    	}
    }
}
