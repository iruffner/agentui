package ui;

import js.JQuery;

import m3.jq.JQ;

import m3.log.Logga;
import m3.log.LogLevel;

import ui.model.ModelObj;
import ui.model.Node;
import ui.model.EM;
import ui.api.ProtocolHandler;

import m3.observable.OSet;

import m3.util.UidGenerator;
import m3.util.HtmlUtil;

import ui.widget.*;

import m3.serialization.Serialization;

using m3.helper.ArrayHelper;
using m3.helper.StringHelper;
using ui.widget.ConnectionsList;
using Lambda;

@:expose
class AgentUi {
    
    public static var LOGGER: Logga;
	public static var DEMO: Bool = false;
    public static var CONTENT: ObservableSet<Content>;
    public static var USER: User;
    public static var SERIALIZER: Serializer;
    public static var PROTOCOL: ProtocolHandler;
    public static var URL: String = "";//"http://64.27.3.17";
    public static var HOT_KEY_ACTIONS: Array<JQEvent->Void>;
    public static var agentURI: String;
    public static var TARGET: Connection;
    // public static var NOTIFICATIONS: 

	public static function main() {
        LOGGER = new Logga(LogLevel.DEBUG);
        CONTENT = new ObservableSet<Content>(ModelObj.identifier);
        PROTOCOL = new ProtocolHandler();
        SERIALIZER = new Serializer();

        HOT_KEY_ACTIONS = new Array<JQEvent->Void>();

        SERIALIZER.addHandler(Content, new ContentHandler());
    }

    public static function start(): Void {
        HOT_KEY_ACTIONS.push(function(evt: JQEvent): Void {
            if(evt.altKey && evt.shiftKey && evt.keyCode == 78 /* ALT+SHIFT+N */) {
                LOGGER.debug("ALT + SHIFT + N");
                var connection: Connection = USER.currentAlias.connectionSet.asArray()[2];
                var notification: ui.api.ProtocolMessage.IntroductionNotification = new ui.api.ProtocolMessage.IntroductionNotification();
                notification.contentImpl = new ui.api.ProtocolMessage.IntroductionNotificationData();
                notification.contentImpl.connection = connection;
                notification.contentImpl.correlationId = "abc123";
                EM.change(EMEvent.INTRODUCTION_NOTIFICATION, notification);
                // new ConnectionComp(".connection").iter(function(cc: JQ): Void {
                //         cast(cc, ConnectionComp).connectionComp("addNotification");
                //     });
            }
        });


        var urlVars: Dynamic<String> = HtmlUtil.getUrlVars();
        if(urlVars.demo.isNotBlank() && (urlVars.demo == "yes" || urlVars.demo == "true")) {
            DEMO = true;
        } 

        new JQ("body").keyup(function(evt: JQEvent) {
            if(HOT_KEY_ACTIONS.hasValues()) {
                for(action_ in 0...HOT_KEY_ACTIONS.length) {
                    HOT_KEY_ACTIONS[action_](evt);
                }
            }
        });

        new JQ("#sideRightSearchInput").keyup(function(evt){
            var search:JQ = new JQ(evt.target);
            var cl:ConnectionsList = new ConnectionsList("#connections");
            cl.filterConnections(search.val());
        });

        new JQ("#middleContainer #content #tabs").tabs();
        new MessagingComp("#sideRight #chat").messagingComp();

        new ConnectionsList("#connections").connectionsList({
            });
        new LabelsList("#labelsList").labelsList();

        new FilterComp("#filter").filterComp(null);

        new ContentFeed("#feed").contentFeed({
                content: AgentUi.CONTENT
            });

        new UserComp("#userId").userComp();
        
        new PostComp("#postInput").postComp();

        new InviteComp("#sideRight #sideRightInvite").inviteComp();

        var fitWindowListener = new EMListener(function(n: Nothing) {
                untyped __js__("fitWindow()");
            }, "FitWindowListener");

        var fireFitWindow = new EMListener(function(n: Nothing) {
                EM.change(EMEvent.FitWindow);
            }, "FireFitWindowListener");

        var processContent = new EMListener(function(arrOfContent: Array<Content>): Void {
                if(arrOfContent.hasValues())
                    AgentUi.CONTENT.addAll(arrOfContent);
                EM.change(EMEvent.FitWindow);            
            }, "ContentProcessor");

        EM.addListener(EMEvent.MoreContent, processContent);
        EM.addListener(EMEvent.EndOfContent, processContent);
        EM.addListener(EMEvent.FILTER_RUN, new EMListener(function(n: Nothing): Void {
                AgentUi.CONTENT.clear();
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

        new JQ("body").click(function(evt: JqEvent): Void {
            new JQ(".nonmodalPopup").hide();
        });

        if(urlVars.agentURI.isNotBlank()) {
            agentURI = urlVars.agentURI;
            // LOGGER.info("Login via id | " + urlVars.uuid);
            // var login: LoginById = new LoginById();
            // login.id = urlVars.agentURI;
            // EM.change(EMEvent.USER_LOGIN, login);
        //     showLogin();
        // } else {
        //     showNewUser();
        }
        DialogManager.showLogin();
    }
}
