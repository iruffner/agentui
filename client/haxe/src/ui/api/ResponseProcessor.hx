package ui.api;

import haxe.ds.StringMap;

import m3.observable.OSet;
import ui.model.EM;
import ui.model.ModelObj;

class ResponseProcessor {

	private static var aliasIntialized:Bool = false;
	private static var labelIntialized:Bool = false;
	private static var labelChildIntialized:Bool = false;
	private static var uberLabelSet:ObservableSet<Label> = new ObservableSet<Label>(Label.identifier);
 	private static var uberLabelChildSet:ObservableSet<LabelChild> = new ObservableSet<LabelChild>(LabelChild.identifier);
 	private static var labelSet = new ObservableSet<Label>(Label.identifier);


	public static function processAliasResponse(context:String, data:Dynamic) {
		switch (context) {
			case "initialDataload":
				initialDataloadAlias(data.result);
			case "create":
				var alias = AppContext.SERIALIZER.fromJsonX(data.result.instance, Alias);
    			AppContext.AGENT.aliasSet.add(alias);
	       		EM.change(EMEvent.NewAlias);
		}
	}

	public static function processLabelResponse(context:String, data:Dynamic) {
		switch (context) {
			case "initialDataload":
				initialDataloadLabel(data.result);
		}
	}

	public static function processLabelChildResponse(context:String, data:Dynamic) {
		switch (context) {
			case "initialDataload":
				initialDataloadLabelChild(data.result);
		}
	}

	private static function initialDataloadAlias(data:Array<Dynamic>) {
    	var agent = ui.AppContext.AGENT;

    	for (alias_ in data) {
    		var alias = AppContext.SERIALIZER.fromJsonX(alias_, Alias);
    		agent.aliasSet.add(alias);
    	}

    	if (agent.aliasSet.isEmpty()) {
    		agent.aliasSet.add(new Alias("placeholder"));
    	}

    	agent.currentAlias = agent.aliasSet.iterator().next();

		EM.change(EMEvent.AGENT, agent);
		EM.change(EMEvent.FitWindow);

		aliasIntialized = true;
		doInitialDataLoad();
	}

	private static function initialDataloadLabel(data:Array<Dynamic>) {
    	for (label_ in data) {
    		var label = AppContext.SERIALIZER.fromJsonX(label_, Label);
    		uberLabelSet.add(label);
    	}

		labelIntialized = true;
		doInitialDataLoad();
	}

	private static function initialDataloadLabelChild(data:Array<Dynamic>) {
    	for (labelChild_ in data) {
    		var labelChild = AppContext.SERIALIZER.fromJsonX(labelChild_, LabelChild);
    		uberLabelChildSet.add(labelChild);
    	}
		labelChildIntialized = true;
		doInitialDataLoad();
	}

	private static function doInitialDataLoad() {
		if (!aliasIntialized || !labelIntialized || !labelChildIntialized) { return; }

		// Create a grouped set to build out the structure of the labels
		var gs = new GroupedSet<LabelChild>(uberLabelChildSet, function(lc: LabelChild): String { return lc.parentIid;});

		for (label in uberLabelSet) {
			//label.children = gs.delegate().get(label.iid);
		}
		// Now the label tree can be built, starting with the root id of "qoid"
	}

}