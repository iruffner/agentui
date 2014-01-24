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
    public static var LABELCHILDS:ObservableSet<LabelChild>;
    public static var LABELMAP:StringMap<Label>;


    private static var _i: ObservableSet<IntroductionNotification>;

    public static function init() {
    	LOGGER = new Logga(LogLevel.DEBUG);
        
        CONTENT = new ObservableSet<Content>(ModelObjWithUid.identifier);

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

        LABELS      = new ObservableSet<Label>(Label.identifier);
        LABELS.listen(updateLabelMap);
        LABELCHILDS = new ObservableSet<LabelChild>(LabelChild.identifier);
        LABELMAP    = new StringMap<Label>();
        
		SERIALIZER = new Serializer();
        SERIALIZER.addHandler(Content, new ContentHandler());

    	registerGlobalListeners();
    }

    static function updateLabelMap(label: Label, evt: EventType): Void {
        if (evt.isAddOrUpdate()) {
            LABELMAP.set(label.iid, label);
        } else if (evt.isDelete()) {
            LABELMAP.remove(label.iid);
        }
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

    public static function getLabelChildren(iid:String):ObservableSet<Label> {
        var fs = new FilteredSet(LABELCHILDS, function(lc:LabelChild):Bool {
            return lc.parentIid == iid;
        });

        var labelChildren = new ObservableSet<Label>(Label.identifier);
        for (lc in fs) {
            labelChildren.add(LABELMAP.get(lc.childIid));
        }
        return labelChildren;
    }
}