package ui.api;

import haxe.ds.StringMap;

import m3.jq.JQ;
import m3.observable.OSet;
import ui.api.Synchronizer;
import ui.model.EM;
import ui.model.ModelObj;

using m3.helper.ArrayHelper;
using Lambda;

class ResponseProcessor {

	public static function processResponse(dataArr: Array<Dynamic>, textStatus: String, jqXHR: JQXHR) {
		if (dataArr == null || dataArr.length == 0) { return; }

		dataArr.iter(function(data:Dynamic): Void {
			var context:Array<String> = data.context.split("-");
			var synchronizer = Synchronizer.synchronizers.get(context[0]);
			if (synchronizer == null) {
				synchronizer = Synchronizer.add(data.context);
			}
			synchronizer.dataReceived(data.result, context[3]);
		});
	}

	public static function aliasCreated(data:Dynamic) {
		AppContext.AGENT.aliasSet.add(data.aliases[0]);
		AppContext.LABELS.add(data.labels[0]);
		AppContext.LABELCHILDREN.add(data.labelChildren[0]);
   		EM.change(EMEvent.NewAlias);		
	}

	public static function aliasUpdated(data:Dynamic) {
       	EM.change(EMEvent.NewAlias);
	}

	public static function aliasDeleted(data:Dynamic) {
		
	}

	public static function labelCreated(data:Dynamic) {
		AppContext.LABELCHILDREN.add(data.labelChildren[0]);
		AppContext.LABELS.add(data.labels[0]);
		EM.change(EMEvent.LOAD_ALIAS, AppContext.alias);
       	EM.change(EMEvent.LabelCreated, new CreateLabelData(data.labels[0], data.labelChildren[0].parentIid));
	}

	public static function labelUpdated(data:Dynamic) {
		EM.change(EMEvent.LOAD_ALIAS, AppContext.alias);
       	EM.change(EMEvent.LabelUpdated, data.labels[0]);
	}

	public static function labelMoved(data:Dynamic) {
		EM.change(EMEvent.LOAD_ALIAS, AppContext.alias);
       	EM.change(EMEvent.LabelUpdated, AppContext.alias);		
	}

	public static function labelDeleted(data:Dynamic) {
		var labels = cast(data.labels, Array<Dynamic>);
		for (label in labels) {
			AppContext.LABELS.delete(label);
		}
		
		var lcs = cast(data.labelChildren, Array<Dynamic>);
		for (lc in lcs) {
			AppContext.LABELCHILDREN.delete(lc);
		}		
		
		EM.change(EMEvent.LOAD_ALIAS, AppContext.alias);
       	EM.change(EMEvent.LabelDeleted, data.labels[0]);
	}

	public static function initialDataLoad(data:Dynamic) {
		// Load the data into the app context
		AppContext.AGENT.aliasSet.addAll(data.aliases);
		AppContext.LABELS.addAll(data.labels);
		AppContext.LABELCHILDREN.addAll(data.labelChildren);

	    // Set the current alias
    	if (AppContext.AGENT.aliasSet.isEmpty()) {
    		var defaultAlias: Alias = new Alias("Default Alias");
    		EM.change(EMEvent.ALIAS_CREATE, defaultAlias);
    		AppContext.AGENT.aliasSet.add(defaultAlias);
    	}
    	AppContext.alias = AppContext.AGENT.aliasSet.iterator().next();

    	// Fire the events that will cause the UI to load the data
		EM.change(EMEvent.AGENT, AppContext.AGENT);
		EM.change(EMEvent.LOAD_ALIAS, AppContext.alias);
		EM.change(EMEvent.FitWindow);
	}
}