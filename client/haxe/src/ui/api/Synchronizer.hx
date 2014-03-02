package ui.api;
import haxe.ds.StringMap;
import m3.util.UidGenerator;
import ui.model.ModelObj;

using m3.helper.OSetHelper;

class SynchronizationParms {
    public var agent:Agent;
    public var aliases:Array<Alias>;
    public var content:Array<Content<Dynamic>>;
    public var connections:Array<Connection>;
    public var handle:String;
    public var introductions:Array<Introduction>;
    public var labels:Array<Label>;
    public var labelChildren:Array<LabelChild>;
    public var labeledContent:Array<LabeledContent>;
    public var labelAcls:Array<LabelAcl>;
    public var notifications:Array<Notification<Dynamic>>;
    public var result:Dynamic;

    public function new() {
        agent = null;
        aliases = new Array<Alias>();
        content = new Array<Content<Dynamic>>();
        connections = new Array<Connection>();
        handle = "";
        introductions = new Array<Introduction>();
        labels  = new Array<Label>();
        labelAcls = new Array<LabelAcl>();
        labelChildren = new Array<LabelChild>();
        labeledContent = new Array<LabeledContent>();
        notifications = new Array<Notification<Dynamic>>();
        result = {};
    }
}

class Synchronizer {
	// The global list of synchronizers
	public static var synchronizers = new StringMap<Synchronizer>();

	public static function createContext(numResponsesExpected: Int, oncomplete:String):String {
		return UidGenerator.create(32) + "-" + Std.string(numResponsesExpected) + "-" + oncomplete + "-";
	}

    public static function processResponse(data:Dynamic):Void {
        var context:Array<String> = data.context.split("-");
        if (context == null) {return;}

        var synchronizer = Synchronizer.synchronizers.get(context[0]);
        if (synchronizer == null) {
            synchronizer = Synchronizer.add(data.context);
        }
        synchronizer.dataReceived(data);
    }

	public static function add(context:String):Synchronizer {
		var parts:Array<String> = context.split("-");
		var synchronizer = new Synchronizer(parts[0], Std.parseInt(parts[1]), parts[2]);
		synchronizers.set(synchronizer.iid, synchronizer);
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

    public function dataReceived(dataObj:Dynamic) {
        var context:Array<String> = dataObj.context.split("-");
        var responseType = context[3];

        parms.result = dataObj.result;
        var data:Dynamic = dataObj.result;
        if (!Std.is(data, String)) {
        	switch (responseType) {
                case "agent":
                    if (data.length > 0) {
                        parms.agent = AppContext.SERIALIZER.fromJsonX(data[0], Agent);
                    }
        		case "alias":
        			parms.aliases.push(AppContext.SERIALIZER.fromJsonX(data, Alias));
        		case "aliases":
        			for (alias_ in cast(data, Array<Dynamic>)) {
        				parms.aliases.push(AppContext.SERIALIZER.fromJsonX(alias_, Alias));
        			}
                case "connection":
                    parms.connections.push(AppContext.SERIALIZER.fromJsonX(data, Connection));
                case "connections":
                    for (content_ in cast(data, Array<Dynamic>)) {
                        parms.connections.push(AppContext.SERIALIZER.fromJsonX(content_, Connection));
                    }
                case "content":
                    parms.content.push(AppContext.SERIALIZER.fromJsonX(data, Content));
                case "contents":
                    for (content_ in cast(data, Array<Dynamic>)) {
                        parms.content.push(AppContext.SERIALIZER.fromJsonX(content_, Content));
                    }
                case "handle":
                    parms.handle = data.handle;
                case "introduction":
                    parms.introductions.push(AppContext.SERIALIZER.fromJsonX(data, Introduction));
                case "introductions":
                    for (content_ in cast(data, Array<Dynamic>)) {
                        parms.introductions.push(AppContext.SERIALIZER.fromJsonX(content_, Introduction));
                    }
        		case "label":
        			parms.labels.push(AppContext.SERIALIZER.fromJsonX(data, Label));
        		case "labels":
        			for (label_ in cast(data, Array<Dynamic>)) {
        				parms.labels.push(AppContext.SERIALIZER.fromJsonX(label_, Label));
        			}
                case "labelacl":
                    parms.labelAcls.push(AppContext.SERIALIZER.fromJsonX(data, LabelAcl));
                case "labelacls":
                    for (label_ in cast(data, Array<Dynamic>)) {
                        parms.labelAcls.push(AppContext.SERIALIZER.fromJsonX(label_, LabelAcl));
                    }
        		case "labelChild":
        			parms.labelChildren.push(AppContext.SERIALIZER.fromJsonX(data, LabelChild));
        		case "labelChildren":
        			for (labelChild_ in cast(data, Array<Dynamic>)) {
        				parms.labelChildren.push(AppContext.SERIALIZER.fromJsonX(labelChild_, LabelChild));
        			}
                case "labeledContent":
                    parms.labeledContent.push(AppContext.SERIALIZER.fromJsonX(data, LabeledContent));
                case "labeledContents":
                    for (labeledContent_ in cast(data, Array<Dynamic>)) {
                        parms.labeledContent.push(AppContext.SERIALIZER.fromJsonX(labeledContent_, LabeledContent));
                    }
                case "notification":
                    parms.notifications.push(AppContext.SERIALIZER.fromJsonX(data, Notification));
                case "notifications":
                    for (content_ in cast(data, Array<Dynamic>)) {
                        parms.notifications.push(AppContext.SERIALIZER.fromJsonX(content_, Notification));
                    }
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
