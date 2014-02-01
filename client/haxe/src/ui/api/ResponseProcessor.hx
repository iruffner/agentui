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
				if (context[2] == "initialDataLoad") {
					var synchronizer = Synchronizer.synchronizers.get(context[0]);
					if (synchronizer == null) {
						synchronizer = Synchronizer.add(data.context);
					}
					synchronizer.dataReceived(data.result, context[3]);
				} else {
					updateModel(data.result, context[3]);
				}
			}
		});
	}

	public static function updateModel(data:Dynamic, responseType:String) {

	    if (data.primaryKey != null) {
            switch (responseType) {
                case "alias":
                    var alias = AppContext.AGENT.aliasSet.getElement(data.primaryKey);
                	alias.deleted = true;
                	AppContext.AGENT.aliasSet.addOrUpdate(alias);
                case "content":
                    var content = AppContext.MASTER_CONTENT.getElement(data.primaryKey);
                	content.deleted = true;
                	AppContext.MASTER_CONTENT.addOrUpdate(content);
                case "label":
                    var label = AppContext.MASTER_LABELS.getElement(data.primaryKey);
                   	label.deleted = true;
                    AppContext.MASTER_LABELS.addOrUpdate(label);
                case "labelChild":
                    var lc = AppContext.MASTER_LABELCHILDREN.getElement(data.primaryKey);
                   	lc.deleted = true;
                    AppContext.MASTER_LABELCHILDREN.addOrUpdate(lc);
                case "labeledContent":
                    var lc = AppContext.MASTER_LABELEDCONTENT.getElement(data.primaryKey);
                    lc.deleted = true;
                    AppContext.MASTER_LABELEDCONTENT.addOrUpdate(lc);
            }
        } else {
        	switch (responseType) {
        		case "alias":
        			AppContext.AGENT.aliasSet.addOrUpdate(AppContext.SERIALIZER.fromJsonX(data.instance, Alias));
                case "content":
                    AppContext.MASTER_CONTENT.addOrUpdate(AppContext.SERIALIZER.fromJsonX(data.instance, Content));
        		case "label":
        			AppContext.MASTER_LABELS.addOrUpdate(AppContext.SERIALIZER.fromJsonX(data.instance, Label));
        		case "labelChild":
        			AppContext.MASTER_LABELCHILDREN.addOrUpdate(AppContext.SERIALIZER.fromJsonX(data.instance, LabelChild));
                case "labeledContent":
                    AppContext.MASTER_LABELEDCONTENT.addOrUpdate(AppContext.SERIALIZER.fromJsonX(data.instance, LabeledContent));
        	}
        }
	}

	public static function initialDataLoad(data:SynchronizationParms) {
		// Load the data into the app context
		AppContext.AGENT.aliasSet.addAll(data.aliases);
		AppContext.MASTER_LABELS.addAll(data.labels);
		AppContext.MASTER_CONTENT.addAll(data.content);
		AppContext.MASTER_LABELEDCONTENT.addAll(data.labeledContent);
		AppContext.MASTER_LABELCHILDREN.addAll(data.labelChildren);

	    // Set the current alias
    	if (AppContext.AGENT.aliasSet.isEmpty()) {
    		var defaultAlias: Alias = new Alias("Default Alias");
    		EM.change(EMEvent.ALIAS_CREATE, defaultAlias);
    		AppContext.AGENT.aliasSet.add(defaultAlias);
    	}

    	var initialAlias:Alias = null;
    	for (alias in AppContext.AGENT.aliasSet) {
    		if (alias.data.isDefault) {
    			initialAlias = alias;
    			break;
    		}
    	}
    	if (initialAlias == null) {
	     	initialAlias = AppContext.AGENT.aliasSet.iterator().next();
	    }
	    AppContext.alias = initialAlias;

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