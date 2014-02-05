package ui.api;
import haxe.ds.StringMap;
import m3.util.UidGenerator;
import ui.model.ModelObj;

using m3.helper.OSetHelper;

class SynchronizationParms {
    public var agent:Agent;
    public var aliases:Array<Alias>;
    public var labels:Array<Label>;
    public var labelChildren:Array<LabelChild>;
    public var content:Array<Content<Dynamic>>;
    public var labeledContent:Array<LabeledContent>;

    public function new() {
        agent = null;
        aliases = new Array<Alias>();
        labels  = new Array<Label>();
        labelChildren = new Array<LabelChild>();
        content = new Array<Content<Dynamic>>();
        labeledContent = new Array<LabeledContent>();
    }
}

class Synchronizer {
	// The global list of synchronizers
	public static var synchronizers = new StringMap<Synchronizer>();

	public static function createContext(numResponsesExpected: Int, oncomplete:String):String {
		return UidGenerator.create(32) + "-" + Std.string(numResponsesExpected) + "-" + oncomplete + "-";
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

    public function dataReceived(data:Dynamic, responseType:String) {

        if (data.primaryKey != null) {
            switch (responseType) {
                case "alias":
                    var alias = ui.AppContext.MASTER_ALIASES.getElement(data.primaryKey);
                    if (alias != null) {
                        parms.aliases.push(alias);
                    }
                case "content":
                    var content = ui.AppContext.CONTENT.getElement(data.primaryKey);
                    if (content != null) {
                        parms.content.push(content);
                    }
                case "label":
                    var label = ui.AppContext.LABELS.getElement(data.primaryKey);
                    if (label != null) {
                        parms.labels.push(label);
                    }
                case "labelChild":
                    var lc = ui.AppContext.LABELCHILDREN.getElement(data.primaryKey);
                    if (lc != null) {
                        parms.labelChildren.push(lc);
                    }
                case "labeledContent":
                    var lc = ui.AppContext.LABELEDCONTENT.getElement(data.primaryKey);
                    if (lc != null) {
                        parms.labeledContent.push(lc);
                    }
            }
        } else {
        	switch (responseType) {
                case "agent":
                    if (data[0].data.name == null) {
                        data[0].data.name = "";
                    }
                    parms.agent = AppContext.SERIALIZER.fromJsonX(data[0], Agent);

        		case "alias":
        			parms.aliases.push(AppContext.SERIALIZER.fromJsonX(data.instance, Alias));
        		case "aliases":
        			for (alias_ in cast(data, Array<Dynamic>)) {
        				parms.aliases.push(AppContext.SERIALIZER.fromJsonX(alias_, Alias));
        			}
                case "content":
                    parms.content.push(AppContext.SERIALIZER.fromJsonX(data.instance, Content));
                case "contents":
                    for (content_ in cast(data, Array<Dynamic>)) {
                        parms.content.push(AppContext.SERIALIZER.fromJsonX(content_, Content));
                    }
        		case "label":
        			parms.labels.push(AppContext.SERIALIZER.fromJsonX(data.instance, Label));
        		case "labels":
        			for (label_ in cast(data, Array<Dynamic>)) {
        				parms.labels.push(AppContext.SERIALIZER.fromJsonX(label_, Label));
        			}
        		case "labelChild":
        			parms.labelChildren.push(AppContext.SERIALIZER.fromJsonX(data.instance, LabelChild));
        		case "labelChildren":
        			for (labelChild_ in cast(data, Array<Dynamic>)) {
        				parms.labelChildren.push(AppContext.SERIALIZER.fromJsonX(labelChild_, LabelChild));
        			}
                case "labeledContent":
                    parms.labeledContent.push(AppContext.SERIALIZER.fromJsonX(data.instance, LabeledContent));
                case "labeledContents":
                    for (labeledContent_ in cast(data, Array<Dynamic>)) {
                        parms.labeledContent.push(AppContext.SERIALIZER.fromJsonX(labeledContent_, LabeledContent));
                    }
        	}
        }
    	numResponsesExpected -= 1;
    	if (numResponsesExpected == 0) {
    		var func = Reflect.field(ResponseProcessor, oncomplete);
    		Reflect.callMethod(ResponseProcessor, func, [parms]);
   			Synchronizer.remove(this.iid);
    	}
    }
}
