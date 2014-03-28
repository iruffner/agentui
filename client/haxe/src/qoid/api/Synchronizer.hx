package ui.api;
import haxe.ds.StringMap;
import m3.util.UidGenerator;
import ui.model.Context;
import ui.model.ModelObj;

using m3.helper.OSetHelper;

class SynchronizationParms {
    public var aliases:Array<Alias>;
    public var content:Array<Content<Dynamic>>;
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
        content = new Array<Content<Dynamic>>();
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

    public function dataReceived(c:Context, dataObj:Dynamic) {
        var data = dataObj.results;
        if (data == null) {return;}

    	switch (dataObj.type) {
    		case "alias":
    			for (alias_ in cast(data, Array<Dynamic>)) {
    				parms.aliases.push(AppContext.SERIALIZER.fromJsonX(alias_, Alias));
    			}
            case "connection":
                for (content_ in cast(data, Array<Dynamic>)) {
                    parms.connections.push(AppContext.SERIALIZER.fromJsonX(content_, Connection));
                }
            case "content":
                for (content_ in cast(data, Array<Dynamic>)) {
                    parms.content.push(AppContext.SERIALIZER.fromJsonX(content_, Content));
                }
            case "introduction":
                for (content_ in cast(data, Array<Dynamic>)) {
                    parms.introductions.push(AppContext.SERIALIZER.fromJsonX(content_, Introduction));
                }
    		case "label":
    			for (label_ in cast(data, Array<Dynamic>)) {
    				parms.labels.push(AppContext.SERIALIZER.fromJsonX(label_, Label));
    			}
            case "labelacl":
                for (label_ in cast(data, Array<Dynamic>)) {
                    parms.labelAcls.push(AppContext.SERIALIZER.fromJsonX(label_, LabelAcl));
                }
    		case "labelChild":
    			for (labelChild_ in cast(data, Array<Dynamic>)) {
    				parms.labelChildren.push(AppContext.SERIALIZER.fromJsonX(labelChild_, LabelChild));
    			}
            case "labeledContent":
                for (labeledContent_ in cast(data, Array<Dynamic>)) {
                    parms.labeledContent.push(AppContext.SERIALIZER.fromJsonX(labeledContent_, LabeledContent));
                }
            case "notification":
                for (content_ in cast(data, Array<Dynamic>)) {
                    parms.notifications.push(AppContext.SERIALIZER.fromJsonX(content_, Notification));
                }
            case "profile":
                for (profile_ in cast(data, Array<Dynamic>)) {
                    parms.profiles.push(AppContext.SERIALIZER.fromJsonX(profile_, Profile));
                }
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
