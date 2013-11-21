package ui;

import m3.log.Logga;
import m3.log.LogLevel;
import m3.observable.OSet;
import m3.serialization.Serialization;

import ui.api.ProtocolMessage;
import ui.model.EM;
import ui.model.ModelObj;

using m3.helper.ArrayHelper;

class AppContext {

    public static var LOGGER: Logga;
    public static var USER: User;
    public static var TARGET: Connection;
    public static var CONTENT: ObservableSet<Content>;
    public static var SERIALIZER: Serializer;
    public static var NOTIFICATION_STORAGE: Map<String, Dynamic>;
	
    public static function init() {
    	LOGGER = new Logga(LogLevel.DEBUG);
        
        CONTENT = new ObservableSet<Content>(ModelObj.identifier);
		SERIALIZER = new Serializer();
        SERIALIZER.addHandler(Content, new ContentHandler());

    	registerGlobalListeners();
    }



	static function registerGlobalListeners() {
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
            })
        );

        EM.addListener(EMEvent.USER_LOGIN, fireFitWindow);
        EM.addListener(EMEvent.USER_CREATE, fireFitWindow);

        EM.addListener(EMEvent.USER, new EMListener(function(user: User) {
                USER = user;
                EM.change(EMEvent.AliasLoaded, user.currentAlias);
            }, "AgentUi-User")
        );

        EM.addListener(EMEvent.AliasLoaded, new EMListener(function(alias: Alias) {
                USER.currentAlias = alias;
            }, "AgentUi-Alias")
        );

        EM.addListener(EMEvent.FitWindow, fitWindowListener);

        EM.addListener(EMEvent.INTRODUCTION_NOTIFICATION, new EMListener(function(notification: IntroductionNotification) {
                var arr: Array<Dynamic> = NOTIFICATION_STORAGE.get("cnxn_" + notification.contentImpl.connection.label + "_" + notification.contentImpl.connection.target);
                if(arr == null) {
                    arr = new Array();
                    NOTIFICATION_STORAGE.set( "cnxn_" + notification.contentImpl.connection.label + "_" + notification.contentImpl.connection.target , arr );
                }
                arr.push(notification);
            }, "AgentUi-IntroNotification")
        );

        EM.addListener(EMEvent.CONNECTION_UPDATE, new EMListener(function(conn: Connection): Void {
                AppContext.USER.currentAlias.connectionSet.update(conn);
            }, "AgentUi-ConnUpdate")
        );
	}
}