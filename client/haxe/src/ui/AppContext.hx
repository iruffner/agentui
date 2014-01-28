package ui;

import haxe.ds.StringMap;

import m3.jq.JQ;
import m3.log.Logga;
import m3.log.LogLevel;
import m3.observable.OSet;
import m3.serialization.Serialization;

import ui.api.ProtocolMessage;
import ui.model.EM;
import ui.model.ModelObj;

using m3.helper.ArrayHelper;
using m3.helper.OSetHelper;

class AppContext {
	public static var DEMO: Bool = false;
    public static var CHANNEL:String;
    public static var LOGGER: Logga;
    public static var AGENT: Agent;
    public static var TARGET: Connection;
    public static var CONTENT: ObservableSet<Content>;
    public static var SERIALIZER: Serializer;
    public static var INTRODUCTIONS: GroupedSet<IntroductionNotification>;
    public static var LABELS:ObservableSet<Label>;
    public static var LABELCHILDREN:ObservableSet<LabelChild>;
    public static var LCG: GroupedSet<LabelChild>;
    public static var placeHolderLabel:Label;
    @:isVar public static var alias(get, set): Alias;

    private static function get_alias(): Alias {
        return AGENT.currentAlias;
    }
    private static function set_alias(alias:Alias): Alias {
        AGENT.currentAlias = alias;
        return alias;
    }

    private static var _i: ObservableSet<IntroductionNotification>;

    public static function init() {

        // Create a dummy agent
        AGENT = new Agent();
        AGENT.userData = new UserData("Qoid", "media/test/koi.jpg");

    	LOGGER = new Logga(LogLevel.DEBUG);
        
        CONTENT = new ObservableSet<Content>(ModelObjWithIid.identifier);

        _i = new ObservableSet<IntroductionNotification>(
                    function(n: IntroductionNotification): String {
                        return n.contentImpl.correlationId;
                    }
                );

        INTRODUCTIONS = new GroupedSet<IntroductionNotification>( 
        	_i , 
        	function(n: IntroductionNotification): String {
        		return Connection.identifier(n.contentImpl.connection);
        	}
    	);

        LABELS = new ObservableSet<Label>(Label.identifier);
        placeHolderLabel = new Label("I'm a placeholder");
        placeHolderLabel.deleted = true;
        LABELS.add(AppContext.placeHolderLabel);

        LABELCHILDREN = new ObservableSet<LabelChild>(LabelChild.identifier);
        LCG = new GroupedSet<LabelChild>(LABELCHILDREN, function(lc:LabelChild):String {
            return lc.parentIid;
        });

        // var LM = new MappedSet<LabelChild, Label>(LCG, function(lc: LabelChild): Label {
        //         return null;
        //     });
        
		SERIALIZER = new Serializer();
        SERIALIZER.addHandler(Content, new ContentHandler());

    	registerGlobalListeners();
    }

	static function registerGlobalListeners() {
        new JQ(js.Browser.window).on("unload", function(evt: JQEvent){
                EM.change(EMEvent.PAGE_CLOSE);
            });
		var fitWindowListener = new EMListener(function(n: Nothing) {
                untyped __js__("fitWindow()");
            }, "FitWindowListener");

        var fireFitWindow = new EMListener(function(n: Nothing) {
                EM.change(EMEvent.FitWindow);
            }, "FireFitWindowListener");

        var processContent = new EMListener(function(arrOfContent: Array<Content>): Void {
                if(arrOfContent.hasValues()) {
                    AppContext.CONTENT.addAll(arrOfContent);
                }
                EM.change(EMEvent.FitWindow);            
            }, "ContentProcessor");

        EM.addListener(EMEvent.MoreContent, processContent);
        EM.addListener(EMEvent.EndOfContent, processContent);
        EM.addListener(EMEvent.FILTER_RUN, new EMListener(function(n: Nothing): Void {
                AppContext.CONTENT.clear();
                EM.change(EMEvent.FitWindow);
            })
        );

        EM.addListener(EMEvent.USER_LOGIN, fireFitWindow);
        EM.addListener(EMEvent.USER_CREATE, fireFitWindow);

        EM.addListener(EMEvent.AGENT, new EMListener(function(agent: Agent) {
                AGENT = agent;
                EM.change(EMEvent.AliasLoaded, agent.currentAlias);
            }, "AgentUi-AGENT")
        );

        EM.addListener(EMEvent.FitWindow, fitWindowListener);

        EM.addListener(EMEvent.INTRODUCTION_NOTIFICATION, new EMListener(function(notification: IntroductionNotification) {
                _i.add(notification);
            }, "AgentUi-IntroNotification")
        );
	}

    public static function getDescendentLabelChildren(iid:String):Array<LabelChild> {
        var lcs = new Array<LabelChild>();

        var getDescendents:String->Array<LabelChild>->Void;
        getDescendents = function(iid:String, lcList:Array<LabelChild>):Void {
            var children: Array<LabelChild> = new FilteredSet(AppContext.LABELCHILDREN, function(lc:LabelChild):Bool {
                return lc.parentIid == iid;
            }).asArray();

            for (i in 0...children.length) {
                if (!children[i].deleted) {
                    lcList.push(children[i]);
                    getDescendents(children[i].childIid, lcList);
                }
            }
        };

        getDescendents(iid, lcs);

        return lcs;
    }

    public static function getLabelDescendents(iid:String):ObservableSet<Label> {
        var labelDescendents = new ObservableSet<Label>(Label.identifier);

        var getDescendentIids:String->Array<String>->Void;
        getDescendentIids = function(iid:String, iidList:Array<String>):Void {
            iidList.insert(0, iid);
            var children: Array<LabelChild> = new FilteredSet(AppContext.LABELCHILDREN, function(lc:LabelChild):Bool {
                return lc.parentIid == iid;
            }).asArray();

            for (i in 0...children.length) {
                getDescendentIids(children[i].childIid, iidList);
            }
        };

        var iid_list = new Array<String>();
        getDescendentIids(iid, iid_list);
        for (iid_ in iid_list) {
            var label = LABELS.getElement(iid_);
            if (label == null) {
                AppContext.LOGGER.error("LabelChild references missing label: " + iid_);
            } else if (!label.deleted) {
                labelDescendents.add(label);
            }
        }
        return labelDescendents;
    }
}