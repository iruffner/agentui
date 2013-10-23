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

	public static function main() {
        LOGGER = new Logga(LogLevel.DEBUG);
        CONTENT = new ObservableSet<Content>(ModelObj.identifier);
        PROTOCOL = new ProtocolHandler();
        SERIALIZER = new Serializer();

        HOT_KEY_ACTIONS = new Array<JQEvent->Void>();

        // SERIALIZER.addHandler(ObservableSet, new ObservableSetHandler());
    }

    public static function start(): Void {
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

        EM.addListener(EMEvent.MoreContent, fireFitWindow);

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
