package ui.api;

import haxe.ds.StringMap;

import m3.jq.JQ;
import m3.observable.OSet;
import ui.api.Synchronizer;
import ui.model.EM;
import ui.model.ModelObj;

using m3.helper.ArrayHelper;
using m3.helper.OSetHelper;
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

	public static function aliasCreated(data:SynchronizationParms) {
		AppContext.AGENT.aliasSet.addOrUpdate(data.aliases[0]);
		AppContext.LABELS.add(data.labels[0]);
		AppContext.LABELCHILDREN.add(data.labelChildren[0]);
   		EM.change(EMEvent.NewAlias);		
	}

	public static function aliasUpdated(data:SynchronizationParms) {
		AppContext.AGENT.aliasSet.addOrUpdate(data.aliases[0]);
       	EM.change(EMEvent.NewAlias);
	}

	public static function aliasDeleted(data:SynchronizationParms) {
		AppContext.AGENT.aliasSet.delete(data.aliases[0]);
	}

	public static function labelCreated(data:SynchronizationParms) {
		AppContext.LABELS.add(data.labels[0]);
		AppContext.LABELCHILDREN.add(data.labelChildren[0]);
/* TODO:  Fix me
		// Delete the placeholder, if necessary
		var siblings = AppContext.LCG.delegate().get(data.labelChildren[0].parentIid);
		if (siblings != null) {
			var lcToDelete:LabelChild = null;
			for (lc in siblings) {
				if (lc.childIid == AppContext.placeHolderLabel.iid) {
					lcToDelete = lc;
					break;
				}
			}
			// TODO:  For some reason, TBD, this block of code is raising an exception
			if (lcToDelete != null) {
				AppContext.LABELCHILDREN.delete(lcToDelete);
			}
		}
*/
	}

	public static function labelUpdated(data:SynchronizationParms) {
		AppContext.LABELS.update(data.labels[0]);
	}

	// TODO:  Add a method to delete or add/update model objects based on their
	// deleted flag
	public static function labelMoved(data:SynchronizationParms) {
		for (lc in data.labelChildren) {
			if (lc.deleted) {
				AppContext.LABELCHILDREN.delete(lc);
			} else {
				AppContext.LABELCHILDREN.addOrUpdate(lc);
			}
		}
	}

	public static function labelDeleted(data:SynchronizationParms) {
		for (lc in data.labelChildren) {
			AppContext.LABELCHILDREN.delete(lc);
		}

		for (label in data.labels) {
			AppContext.LABELS.delete(label);
		}
	}

	public static function initialDataLoad(data:SynchronizationParms) {
		// Load the data into the app context
		AppContext.AGENT.aliasSet.addAll(data.aliases);
		AppContext.LABELS.addAll(data.labels);
		AppContext.LABELCHILDREN.addAll(data.labelChildren);

		// Cull any labelChildren that point to non-existent labels
		var lcsToRemove = new Array<LabelChild>();
		for (lc in AppContext.LABELCHILDREN) {
			if (AppContext.LABELS.getElement(lc.childIid) == null) {
				lcsToRemove.push(lc);
			}
		}
		for (lc in lcsToRemove) {
			ui.AppContext.LOGGER.warn("LabelChild points to non-existent label.  DELETE IT.");
			AppContext.LABELCHILDREN.delete(lc);
		}

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

		var img = new ImageContent();
		img.setData({
			created: Date.now(),
		    modified: Date.now(),
		    blah: "BLAH",
		    caption: "Yucatan",
		    imgSrc: "YSSDDD"
		});

		var imgdata = img.props;
	}
}