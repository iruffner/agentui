package pagent;

import m3.observable.OSet;

import m3.serialization.Serialization.Serializer;
import pagent.pages.PinterPageMgr;
import pagent.model.EM;

import agentui.model.Filter;
import agentui.model.Node;
import qoid.model.ModelObj;
import pagent.model.PinterModel;
import qoid.Qoid;
import qoid.QE;
import qoid.QoidAPI;

using m3.helper.OSetHelper;
using m3.helper.ArrayHelper;

class PinterContext {
	public static var PAGE_MGR: PinterPageMgr;
    public static var APP_INITIALIZED: Bool = false;

    public static var labelAclsByLabel: GroupedSet<LabelAcl>;
    public static var sharedBoards: ObservableSet<Label>;
    public static var sharedBoardsByConnection: GroupedSet<Label>;
    public static var sharedBoardConfigs: ObservableSet<ConfigContent>;

    public static var CURRENT_BOARD: String;
    public static var CURRENT_MEDIA: String;

    public static var ROOT_LABEL_NAME_OF_ALL_APPS: String = "com.qoid.apps";
    public static var APP_ROOT_LABEL_NAME: String = ROOT_LABEL_NAME_OF_ALL_APPS + ".pinteragent";
    public static var APP_COMMENTS_LABEL_NAME: String = APP_ROOT_LABEL_NAME + ".comments";

    //this is a child of the current alias' root label
    @:isVar public static var ROOT_LABEL_OF_ALL_APPS(get,set): Label;
    
    //this is a child of the root label of all apps
    @:isVar public static var ROOT_BOARD(get,set): Label;

    //this is a child of the root board
    @:isVar public static var COMMENTS(default,set): Label;

    public static var boardConfigs: ObservableSet<ConfigContent>;

    public static function init() {
        PAGE_MGR = PinterPageMgr.get;

        registerListeners();
    	
        labelAclsByLabel = new GroupedSet<LabelAcl>(Qoid.labelAcls, function(l:LabelAcl):String {
            return l.labelIid;
        });

        sharedBoards = new ObservableSet<Label>(Label.identifier);
        sharedBoardsByConnection = new GroupedSet<Label>(sharedBoards, function(l:Label):String {
            return l.connectionIid;
        });

        boardConfigs = new ObservableSet<ConfigContent>(ModelObjWithIid.identifier);
        sharedBoardConfigs = new ObservableSet<ConfigContent>(ModelObjWithIid.identifier);

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
        path.push(Qoid.labels.getElement(Qoid.currentAlias.labelIid).name);
        path.push(PinterContext.ROOT_LABEL_OF_ALL_APPS.name);
        path.push(PinterContext.ROOT_BOARD.name);
        root.addNode(new LabelNode(l, path));

        var filterData = new FilterData("boardConfig");
        filterData.filter = new Filter(root);
        filterData.filter.q = filterData.filter.q + " and contentType = '" + PinterContentTypes.CONFIG + "'";
        filterData.connectionIids = [];
        filterData.aliasIid       = Qoid.currentAlias.iid;

        EM.change(EMEvent.FILTER_RUN, filterData);

        return l;
    }

    static function set_COMMENTS(l: Label): Label {
        COMMENTS = l;
        Qoid.connections.listen(function(c: Connection, evt: EventType): Void {
                var parms = {
                    connectionIid: c.iid,
                    labelIid: COMMENTS.iid,
                }
                EM.change(EMEvent.GrantAccess, parms);
            });
        return l;    
    }

    static function get_ROOT_LABEL_OF_ALL_APPS(): Label {
        return ROOT_LABEL_OF_ALL_APPS;
    }

    static function set_ROOT_LABEL_OF_ALL_APPS(l: Label): Label {
        ROOT_LABEL_OF_ALL_APPS = l;
        return l;
    }

    static function registerListeners(): Void {
        EM.listenOnce(QE.onInitialDataload, _onInitialDataLoadComplete, "PinterContext-onInitialDataLoad");
        EM.addListener(EMEvent.OnBoardConfig, _onBoardConfig , "PinterContext-onBoardConfig");
        EM.addListener(EMEvent.OnConnectionBoards, _onSharedBoard , "PinterContext-onConnectionBoards");
        EM.addListener(EMEvent.OnConnectionBoardConfigs, _onSharedBoardConfigs , "PinterContext-onConnectionBoardConfigs");

        Qoid.connections.listen(
            function(c: Connection, evt: EventType): Void {
                    if (evt.isAdd()) {
                         QoidAPI.query(
                            new RequestContext("connectionBoards"), 
                            "label", 
                            "(hasParentLabelPath('" + PinterContext.ROOT_LABEL_NAME_OF_ALL_APPS + "','" + PinterContext.APP_ROOT_LABEL_NAME + "'))", 
                            true,
                            true,
                            [c.iid]
                        );
                        QoidAPI.query(
                            new RequestContext("connectionBoardConfigs"), 
                            "content", 
                            "(hasLabelPath('" + PinterContext.ROOT_LABEL_NAME_OF_ALL_APPS + "','" + PinterContext.APP_ROOT_LABEL_NAME + "')) and contentType = '" + PinterContentTypes.CONFIG + "'", 
                            true,
                            true,
                            [c.iid]
                        );
                    }
                });
    }

    static function _onInitialDataLoadComplete(n: {}) {
        var getLabelNameFcn = function(l: Label) {
                return l.name;
            };
        var rootLabelOfAllApps: Label = Qoid.labels.getElementComplex(PinterContext.ROOT_LABEL_NAME_OF_ALL_APPS, getLabelNameFcn);
        var rootLabelOfThisApp: Label = Qoid.labels.getElementComplex(PinterContext.APP_ROOT_LABEL_NAME, getLabelNameFcn);
        var commentsLabel: Label = Qoid.labels.getElementComplex(PinterContext.APP_COMMENTS_LABEL_NAME, getLabelNameFcn);

        if(rootLabelOfAllApps == null) {
            _processNullRootAppsLabel();
        } else if(rootLabelOfThisApp == null) {
            _processNullAppLabel(rootLabelOfAllApps);
        } else if(commentsLabel == null) {
            _processNullCommentsLabel(rootLabelOfThisApp);
        } else {
            PinterContext.ROOT_LABEL_OF_ALL_APPS = rootLabelOfAllApps;
            PinterContext.ROOT_BOARD = rootLabelOfThisApp;
            PinterContext.COMMENTS = commentsLabel;
            EM.change(QE.onAliasLoaded, Qoid.currentAlias);
            EM.change(EMEvent.APP_INITIALIZED);
        }
    }

    private static function _processNullRootAppsLabel() {
        //listen for changes to the labels since the next add event should be our new label
        var listener: Label->EventType->Void = null;
        listener = function(l: Label, evtType: EventType) {
                if(evtType.isAdd()) {
                    if(l.name == PinterContext.ROOT_LABEL_NAME_OF_ALL_APPS) {
                        Qoid.labels.removeListener(listener);
                        PinterContext.ROOT_LABEL_OF_ALL_APPS = l;
                        _onInitialDataLoadComplete(null);
                    }
                }
            };
        Qoid.labels.listen(listener, false);
        
        var label: Label = new Label();
        label.name = PinterContext.ROOT_LABEL_NAME_OF_ALL_APPS;
        var eventData = new EditLabelData(label, Qoid.currentAlias.labelIid);
        EM.change(EMEvent.CreateLabel, eventData);
    }

    private static function _processNullAppLabel(rootLabelOfAllApps: Label) {
        //listen for changes to the labels since the next add event should be our new label
        var listener: Label->EventType->Void = null;
        listener = function(l: Label, evtType: EventType) {
                if(evtType.isAdd()) {
                    if(l.name == PinterContext.APP_ROOT_LABEL_NAME) {
                        Qoid.labels.removeListener(listener);
                        PinterContext.ROOT_BOARD = l;
                        _onInitialDataLoadComplete(null);
                    }
                }
            };
        Qoid.labels.listen(listener, false);
        
        var label: Label = new Label();
        label.name = PinterContext.APP_ROOT_LABEL_NAME;
        var eventData = new EditLabelData(label, rootLabelOfAllApps.iid);
        EM.change(EMEvent.CreateLabel, eventData);
    }

    private static function _processNullCommentsLabel(rootLabelOfThisApp: Label) {
        //listen for changes to the labels since the next add event should be our new label
        var listener: Label->EventType->Void = null;
        listener = function(l: Label, evtType: EventType) {
                if(evtType.isAdd()) {
                    if(l.name == PinterContext.APP_COMMENTS_LABEL_NAME) {
                        Qoid.labels.removeListener(listener);
                        PinterContext.COMMENTS = l;
                        _onInitialDataLoadComplete(null);
                    }
                }
            };
        Qoid.labels.listen(listener, false);
        
        var label: Label = new Label();
        label.name = PinterContext.APP_COMMENTS_LABEL_NAME;
        var eventData = new EditLabelData(label, rootLabelOfThisApp.iid);
        EM.change(EMEvent.CreateLabel, eventData);
    }

    static function _onBoardConfig(data:{result: {standing: Bool, results: Array<Dynamic>, route: Array<String>}}) {
        if(data.result.results.hasValues())
            for (result in data.result.results) {
                var c = Serializer.instance.fromJsonX(result, ConfigContent);
                if(c != null) { //occurs when there is an unknown content type
                    if(data.result.route.hasValues())
                        c.connectionIid = data.result.route[0];
                    boardConfigs.addOrUpdate(c);
                }
            }
    }

    static function _onSharedBoard(data:{result: {standing: Bool, results: Array<Dynamic>, route: Array<String>}}) {
        if(data.result.results.hasValues())
            for (result in data.result.results) {
                var c = Serializer.instance.fromJsonX(result, Label);
                if(c != null) { //occurs when there is an unknown content type
                    if(data.result.route.hasValues())
                        c.connectionIid = data.result.route[0];
                    sharedBoards.addOrUpdate(c);
                }
            }
    }

    static function _onSharedBoardConfigs(data:{result: {standing: Bool, results: Array<Dynamic>, route: Array<String>}}) {
        if(data.result.results.hasValues())
            for (result in data.result.results) {
                var c = Serializer.instance.fromJsonX(result, ConfigContent);
                if(c != null) { //occurs when there is an unknown content type
                    if(data.result.route.hasValues())
                        c.connectionIid = data.result.route[0];
                    sharedBoardConfigs.addOrUpdate(c);
                }
            }
    }
}