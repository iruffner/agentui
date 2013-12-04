package ui;

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

    public static var LOGGER: Logga;
    public static var USER: User;
    public static var TARGET: Connection;
    public static var CONTENT: ObservableSet<Content>;
    public static var SERIALIZER: Serializer;
    private static var _i: ObservableSet<IntroductionNotification>;
    public static var INTRODUCTIONS: GroupedSet<IntroductionNotification>;
	
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

        EM.addListener(EMEvent.USER, new EMListener(function(user: User) {
                USER = user;
                EM.change(EMEvent.AliasLoaded, user.currentAlias);
            }, "AgentUi-User")
        );

        EM.addListener(EMEvent.FitWindow, fitWindowListener);

        EM.addListener(EMEvent.INTRODUCTION_NOTIFICATION, new EMListener(function(notification: IntroductionNotification) {
                _i.add(notification);
            }, "AgentUi-IntroNotification")
        );
	}
}