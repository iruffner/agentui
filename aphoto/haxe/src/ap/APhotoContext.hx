package ap;

import ap.AppContext;
import haxe.ds.StringMap;

import m3.jq.JQ;
import m3.log.Logga;
import m3.log.LogLevel;
import m3.observable.OSet;
import m3.serialization.Serialization;

import ap.APhoto;
import ap.model.EM;
import qoid.model.Filter;
import qoid.model.Filter.FilterData;
import qoid.model.ModelObj;
import ap.pages.APhotoPageMgr;
import qoid.model.Node;

using m3.helper.ArrayHelper;
using m3.helper.StringHelper;
using m3.helper.OSetHelper;

class APhotoContext {

    public static var PAGE_MGR: APhotoPageMgr;
    public static var APP_INITIALIZED: Bool;

    public static var CURRENT_ALBUM: String;
    public static var CURRENT_MEDIA: String;
    // public static var CURRENT_ALBUM_PATH: Array<String>;

    public static var ROOT_LABEL_NAME_OF_ALL_APPS: String = "com.qoid.apps";
    public static var APP_ROOT_LABEL_NAME: String = "com.qoid.apps.aphoto";

    @:isVar public static var ROOT_LABEL_OF_ALL_APPS(get,set): Label;
    
    //this is a child of the current alias' root label
    @:isVar public static var ROOT_ALBUM(get,set): Label;

    public static var ALBUM_CONFIGS: ObservableSet<ConfigContent>;

    public static function init() {
        PAGE_MGR = APhotoPageMgr.get;
    	
        AppContext.init();

        ALBUM_CONFIGS = new ObservableSet<ConfigContent>(ModelObjWithIid.identifier);

        EM.listenOnce(
            EMEvent.APP_INITIALIZED,
            function(n: {}) {
                	APP_INITIALIZED = true;
                },
            "APhotoContext-AppInitialized"
         );


    }

    static function get_ROOT_ALBUM(): Label {
        return ROOT_ALBUM;
    }

    static function set_ROOT_ALBUM(l: Label): Label {
        ROOT_ALBUM = l;

        var root: Node = new Or();
        root.type = "ROOT";
        var path = new Array<String>();
        path.push(AppContext.LABELS.getElement(AppContext.currentAlias.rootLabelIid).name);
        path.push(APhotoContext.ROOT_LABEL_OF_ALL_APPS.name);
        path.push(APhotoContext.ROOT_ALBUM.name);
        root.addNode(new LabelNode(l, path));

        var filterData = new FilterData("albumConfig");
        filterData.filter = new Filter(root);
        filterData.filter.q = filterData.filter.q + " and contentType = 'com.qoid.apps.aphoto.config'";
        filterData.connectionIids = [];
        filterData.aliasIid       = AppContext.currentAlias.iid;

        EM.change(EMEvent.FILTER_RUN, filterData);

        return l;
    }

    static function get_ROOT_LABEL_OF_ALL_APPS(): Label {
        return ROOT_LABEL_OF_ALL_APPS;
    }

    static function set_ROOT_LABEL_OF_ALL_APPS(l: Label): Label {
        ROOT_LABEL_OF_ALL_APPS = l;
        return l;
    }
}