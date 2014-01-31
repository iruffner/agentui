package ui.api;

import haxe.ds.StringMap;

import m3.jq.JQ;
import m3.util.JqueryUtil;
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
			if (!data.success) {
				JqueryUtil.alert("ERROR:  " + data.error.message + "      Context: " + data.context);
			} else {
				var context:Array<String> = data.context.split("-");
				var synchronizer = Synchronizer.synchronizers.get(context[0]);
				if (synchronizer == null) {
					synchronizer = Synchronizer.add(data.context);
				}
				synchronizer.dataReceived(data.result, context[3]);
			}
		});
	}

	public static function aliasCreated(data:SynchronizationParms) {
		AppContext.AGENT.aliasSet.addOrUpdate(data.aliases[0]);
		AppContext.MASTER_LABELS.addOrUpdate(data.labels[0]);
		AppContext.MASTER_LABELCHILDREN.addOrUpdate(data.labelChildren[0]);
   		EM.change(EMEvent.NewAlias);		
	}

	public static function aliasUpdated(data:SynchronizationParms) {
		AppContext.AGENT.aliasSet.addOrUpdate(data.aliases[0]);
       	EM.change(EMEvent.NewAlias);
	}

	public static function aliasDeleted(data:SynchronizationParms) {
		AppContext.AGENT.aliasSet.addOrUpdate(data.aliases[0]);
	}

	public static function labelCreated(data:SynchronizationParms) {
		AppContext.MASTER_LABELS.addOrUpdate(data.labels[0]);
		AppContext.MASTER_LABELCHILDREN.addOrUpdate(data.labelChildren[0]);
	}

	public static function labelUpdated(data:SynchronizationParms) {
		AppContext.MASTER_LABELS.update(data.labels[0]);
	}

	public static function labelMoved(data:SynchronizationParms) {
		for (lc in data.labelChildren) {
			AppContext.MASTER_LABELCHILDREN.addOrUpdate(lc);
		}
	}

	public static function labelDeleted(data:SynchronizationParms) {
		for (lc in data.labelChildren) {
			AppContext.MASTER_LABELCHILDREN.addOrUpdate(lc);
		}

		for (label in data.labels) {
			AppContext.MASTER_LABELS.addOrUpdate(label);
		}

		for (lc in data.labeledContent) {
			AppContext.MASTER_LABELEDCONTENT.addOrUpdate(lc);
		}
	}

	public static function contentCreated(data:SynchronizationParms) {
		AppContext.MASTER_LABELEDCONTENT.addOrUpdate(data.labeledContent[0]);
		AppContext.MASTER_CONTENT.addOrUpdate(data.content[0]);
	}

	public static function contentUpdated(data:SynchronizationParms) {
		for (lc in data.labeledContent) {
			AppContext.MASTER_LABELEDCONTENT.addOrUpdate(lc);
		}
		AppContext.MASTER_CONTENT.addOrUpdate(data.content[0]);
	}

	public static function contentDeleted(data:SynchronizationParms) {
		for (lc in data.labeledContent) {
			AppContext.MASTER_LABELEDCONTENT.addOrUpdate(lc);
		}
		AppContext.MASTER_CONTENT.addOrUpdate(data.content[0]);
	}

	public static function initialDataLoad(data:SynchronizationParms) {
		// Load the data into the app context
		AppContext.AGENT.aliasSet.addAll(data.aliases);
		AppContext.MASTER_LABELEDCONTENT.addAll(data.labeledContent);
		AppContext.MASTER_LABELCHILDREN.addAll(data.labelChildren);
		AppContext.MASTER_LABELS.addAll(data.labels);
		AppContext.MASTER_CONTENT.addAll(data.content);

		// Cull any labelChildren that point to non-existent labels
		var lcsToRemove = new Array<LabelChild>();
		for (lc in AppContext.LABELCHILDREN) {
			if (AppContext.LABELS.getElement(lc.childIid) == null) {
				lcsToRemove.push(lc);
			}
		}
		for (lc in lcsToRemove) {
			ui.AppContext.LOGGER.warn("NON-DELETED LabelChild points to deleted label.  DELETE IT.");
			AppContext.MASTER_LABELCHILDREN.delete(lc);
		}

		// Cull any labeledContent that point to non-existent content
		var lacosToRemove = new Array<LabeledContent>();
		for (lc in AppContext.LABELEDCONTENT) {
			if (AppContext.CONTENT.getElement(lc.contentIid) == null ||
				AppContext.LABELS.getElement(lc.labelIid) == null) {
				lacosToRemove.push(lc);
			}
		}
		for (lc in lacosToRemove) {
			ui.AppContext.LOGGER.warn("NON-DELETED LabeledContent points to deleted content or label.  DELETE IT.");
			AppContext.MASTER_LABELEDCONTENT.delete(lc);
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