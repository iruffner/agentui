package pagent;

import m3.observable.OSet.ObservableSet;

import pagent.AppContext;
import pagent.pages.PinterPageMgr;
import pagent.model.EM;

import qoid.model.Filter;
import qoid.model.ModelObj;
import qoid.model.Node;

using m3.helper.OSetHelper;

class PinterContext {
	public static var PAGE_MGR: PinterPageMgr;
    public static var APP_INITIALIZED: Bool = false;

    public static var CURRENT_BOARD: String;
    public static var CURRENT_MEDIA: String;

    public static var ROOT_LABEL_NAME_OF_ALL_APPS: String = "com.qoid.apps";
    public static var APP_ROOT_LABEL_NAME: String = ROOT_LABEL_NAME_OF_ALL_APPS + ".pinteragent";

    @:isVar public static var ROOT_LABEL_OF_ALL_APPS(get,set): Label;
    
    //this is a child of the current alias' root label
    @:isVar public static var ROOT_BOARD(get,set): Label;

    public static var BOARD_CONFIGS: ObservableSet<ConfigContent>;

    public static function init() {
        PAGE_MGR = PinterPageMgr.get;
    	
        AppContext.init();

        BOARD_CONFIGS = new ObservableSet<ConfigContent>(ModelObjWithIid.identifier);

        EM.listenOnce(
            EMEvent.APP_INITIALIZED,
            function(n: {}) {
                	APP_INITIALIZED = true;
                },
            "PinterContext-AppInitialized"
         );


    }

    static function get_ROOT_BOARD(): Label {
        return ROOT_BOARD;
    }

    static function set_ROOT_BOARD(l: Label): Label {
        ROOT_BOARD = l;

        var root: Node = new Or();
        root.type = "ROOT";
        var path = new Array<String>();
        path.push(AppContext.LABELS.getElement(AppContext.currentAlias.rootLabelIid).name);
        path.push(PinterContext.ROOT_LABEL_OF_ALL_APPS.name);
        path.push(PinterContext.ROOT_BOARD.name);
        root.addNode(new LabelNode(l, path));

        var filterData = new FilterData("boardConfig");
        filterData.filter = new Filter(root);
        filterData.filter.q = filterData.filter.q + " and contentType = '" + APP_ROOT_LABEL_NAME + ".config'";
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