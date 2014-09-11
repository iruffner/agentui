package ap;

import ap.model.APhotoModel;
import haxe.ds.StringMap;

import m3.jq.JQ;
import m3.log.Logga;
import m3.log.LogLevel;
import m3.observable.OSet;
import m3.serialization.Serialization;

import ap.APhoto;
import ap.model.EM;
import agentui.model.Filter;
import qoid.model.ModelObj;
import ap.pages.APhotoPageMgr;
import agentui.model.Node;
import qoid.Qoid;
import qoid.QE;

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
    public static var APP_ROOT_LABEL_NAME: String = ROOT_LABEL_NAME_OF_ALL_APPS + ".aphoto";

    @:isVar public static var ROOT_LABEL_OF_ALL_APPS(get,set): Label;
    
    //this is a child of the current alias' root label
    @:isVar public static var ROOT_ALBUM(get,set): Label;

    public static var ALBUM_CONFIGS: ObservableSet<ConfigContent>;

    public static function init() {
        PAGE_MGR = APhotoPageMgr.get;
    	
        registerListeners();

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
        path.push(Qoid.labels.getElement(Qoid.currentAlias.labelIid).name);
        path.push(APhotoContext.ROOT_LABEL_OF_ALL_APPS.name);
        path.push(APhotoContext.ROOT_ALBUM.name);
        root.addNode(new LabelNode(l, path));

        var filterData = new FilterData("albumConfig");
        filterData.filter = new Filter(root);
        filterData.filter.q = filterData.filter.q + " and contentType = '" + APP_ROOT_LABEL_NAME + ".config'";
        filterData.connectionIids = [];
        filterData.aliasIid       = Qoid.currentAlias.iid;

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

    static function registerListeners(): Void {
        EM.listenOnce(QE.onInitialDataload, _onInitialDataLoadComplete, "APhotoContext-onInitialDataLoad");
        EM.addListener(EMEvent.ALBUM_CONFIGS, _onAlbumConfig , "APhotoContext-onAlbumConfig");
    }

    static function _onInitialDataLoadComplete(n: {}) {
        var rootLabelOfThisApp: Label = Qoid.labels.getElementComplex(APP_ROOT_LABEL_NAME, function(l: Label) {
                return l.name;
            });

        var rootLabelOfAllApps: Label = Qoid.labels.getElementComplex(ROOT_LABEL_NAME_OF_ALL_APPS, function(l: Label) {
            return l.name;
        });

        if(rootLabelOfThisApp == null) {

            var createRootLabelOfThisApp = function(theRootLabelOfAllApps: Label) {
                //listen for changes to the labels since the next add event should be our new label
                var listener: Label->EventType->Void = null;
                listener = function(l: Label, evtType: EventType) {
                        if(evtType.isAdd()) {
                            if(l.name == APP_ROOT_LABEL_NAME) {
                                Qoid.labels.removeListener(listener);
                                ROOT_ALBUM = l;
                                EM.change(QE.onAliasLoaded, Qoid.currentAlias);
                                EM.change(EMEvent.APP_INITIALIZED);
                            }
                        }
                    };
                Qoid.labels.listen(listener, false);
                
                var label: Label = new Label();
                label.name = APP_ROOT_LABEL_NAME;
                var eventData = new EditLabelData(label, ROOT_LABEL_OF_ALL_APPS.iid);
                EM.change(EMEvent.CreateLabel, eventData);
            }

            if(rootLabelOfAllApps == null) {
                //listen for changes to the labels since the next add event should be our new label
                var listener: Label->EventType->Void = null;
                listener = function(l: Label, evtType: EventType) {
                        if(evtType.isAdd()) {
                            if(l.name == ROOT_LABEL_NAME_OF_ALL_APPS) {
                                Qoid.labels.removeListener(listener);
                                ROOT_LABEL_OF_ALL_APPS = l;
                                createRootLabelOfThisApp(l);
                            }
                        }
                    };
                Qoid.labels.listen(listener, false);
                
                var label: Label = new Label();
                label.name = ROOT_LABEL_NAME_OF_ALL_APPS;
                var eventData = new EditLabelData(label, Qoid.currentAlias.labelIid);
                EM.change(EMEvent.CreateLabel, eventData);
            } else {
                ROOT_LABEL_OF_ALL_APPS = rootLabelOfAllApps;
                createRootLabelOfThisApp(rootLabelOfAllApps);
            }
        } else {
            ROOT_LABEL_OF_ALL_APPS = rootLabelOfAllApps;
            ROOT_ALBUM = rootLabelOfThisApp;
            EM.change(QE.onAliasLoaded, Qoid.currentAlias);
            EM.change(EMEvent.APP_INITIALIZED);
        }
    }

    static function _onAlbumConfig(data:{result: {standing: Bool, results: Array<Dynamic>}}) {
        if(data.result.results.hasValues())
            for (result in data.result.results) {
                var c = Serializer.instance.fromJsonX(result, ConfigContent);
                if(c != null) { //occurs when there is an unknown content type
                    ALBUM_CONFIGS.addOrUpdate(c);
                }
            }
    }
}