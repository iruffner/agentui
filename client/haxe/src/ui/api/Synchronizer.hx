package ui.api;
import haxe.ds.StringMap;
import m3.util.UidGenerator;
import ui.model.ModelObj;

class Synchronizer {
	// The global list of synchronizers
	public static var synchronizers = new StringMap<Synchronizer>();

	public static function genIid():String {
		return UidGenerator.create(32);
	}

	public static function add(numResponsesExpected: Int, oncomplete: Dynamic->Void, ?iid:String):String {
		var synchronizer = new Synchronizer(numResponsesExpected, oncomplete);
		if (iid != null) {
			synchronizer.iid = iid;
		}
		synchronizers.set(synchronizer.iid, synchronizer);
		return synchronizer.iid;
	}

	public static function remove(iid:String) {
		synchronizers.remove(iid);
	}

	public var iid: String;
    public var numResponsesExpected: Int;
    private var oncomplete: Dynamic->Void;
    private var parms: Dynamic;

    public function new(numResponsesExpected: Int, oncomplete: Dynamic->Void) {
    	this.iid = genIid();
    	this.numResponsesExpected = numResponsesExpected;
    	this.oncomplete = oncomplete;
    	this.parms = {
    		aliases: new Array<Alias>(),
    		labels: new Array<Label>(),
    		labelChildren: new Array<LabelChild>()
    	};
    }

    public function dataReceived(data:Dynamic, responseType:String) {

    	switch (responseType) {
    		case "alias":
    			parms.aliases.push(AppContext.SERIALIZER.fromJsonX(data.instance, Alias));
    		case "aliases":
    			for (alias_ in cast(data, Array<Dynamic>)) {
    				parms.aliases.push(AppContext.SERIALIZER.fromJsonX(alias_, Alias));
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
    	}

    	numResponsesExpected -= 1;
    	if (numResponsesExpected == 0) {
    		oncomplete(parms);
   			Synchronizer.remove(this.iid);
    	}
    }
}
