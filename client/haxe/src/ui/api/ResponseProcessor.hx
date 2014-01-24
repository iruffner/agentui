package ui.api;

import haxe.ds.StringMap;

import m3.observable.OSet;
import ui.model.EM;
import ui.model.ModelObj;

using m3.helper.ArrayHelper;

class ResponseProcessor {

	private static var aliasIntialized:Bool = false;
	private static var labelIntialized:Bool = false;
	private static var labelChildIntialized:Bool = false;

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

    	if(data.hasValues()) {
	    	for (alias_ in data) {
	    		var alias = AppContext.SERIALIZER.fromJsonX(alias_, Alias);
	    		agent.aliasSet.add(alias);
	    	}
	    }

    	if (agent.aliasSet.isEmpty()) {
    		var defaultAlias: Alias = new Alias("Default Alias");
    		EM.change(EMEvent.ALIAS_CREATE, defaultAlias);
    		agent.aliasSet.add(defaultAlias);
    	}

    	agent.currentAlias = agent.aliasSet.iterator().next();

		EM.change(EMEvent.AGENT, agent);
		EM.change(EMEvent.FitWindow);

		aliasIntialized = true;
		doInitialDataLoad();
	}

	private static function initialDataloadLabel(data:Array<Dynamic>) {
    	if(data.hasValues()) {
	    	for (label_ in data) {
	    		var label = AppContext.SERIALIZER.fromJsonX(label_, Label);
	    		AppContext.LABELS.add(label);
	    	}
	    }

		labelIntialized = true;
		doInitialDataLoad();
	}

	private static function initialDataloadLabelChild(data:Array<Dynamic>) {
    	if(data.hasValues()) {
	    	for (labelChild_ in data) {
	    		var labelChild = AppContext.SERIALIZER.fromJsonX(labelChild_, LabelChild);
	    		AppContext.LABELCHILDS.add(labelChild);
	    	}
	    }
		labelChildIntialized = true;
		doInitialDataLoad();
	}

	private static function doInitialDataLoad() {
		if (!aliasIntialized || !labelIntialized || !labelChildIntialized) { return; }

		// Create a grouped set to build out the structure of the labels
		var gs = new GroupedSet<LabelChild>(AppContext.LABELCHILDS, function(lc: LabelChild): String { return lc.parentIid;});

		for (label in AppContext.LABELS) {
			label.labelChildren = gs.delegate().get(label.iid);
		}
	}
}