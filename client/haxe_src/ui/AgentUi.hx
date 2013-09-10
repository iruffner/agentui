package ui;

import js.JQuery;

import m3.jq.JQ;

import m3.log.Logga;
import m3.log.LogLevel;

import ui.model.ModelObj;
import ui.model.Node;
import ui.model.EventModel;
import ui.model.ModelEvents;
import ui.api.ProtocolHandler;

import m3.observable.OSet;

import m3.util.UidGenerator;
import m3.util.HtmlUtil;

import ui.widget.ConnectionsList;
import ui.widget.LabelsList;
import ui.widget.ContentFeed;
import ui.widget.FilterComp;
import ui.widget.UserComp;
import ui.widget.PostComp;
import ui.widget.LoginComp;
import ui.widget.MessagingComp;
import ui.widget.InviteComp;
import ui.widget.NewUserComp;

import m3.serialization.Serialization;

using m3.helper.ArrayHelper;
using m3.helper.StringHelper;
using Lambda;

@:expose
class AgentUi {
    
    public static var LOGGER: Logga;
	public static var DEMO: Bool = true;
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
        if(urlVars.demo.isNotBlank() && (urlVars.demo == "no" || urlVars.demo == "false")) {
            DEMO = false;
        } 

        new JQ("body").keyup(function(evt: JQEvent) {
            if(HOT_KEY_ACTIONS.hasValues()) {
                for(action_ in 0...HOT_KEY_ACTIONS.length) {
                    HOT_KEY_ACTIONS[action_](evt);
                }
            }
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

        var fitWindowListener = new EventListener(function(n: Null<Dynamic>) {
                untyped __js__("fitWindow()");
            });

        var fireFitWindow = new EventListener(function(n: Null<Dynamic>) {
                EventModel.change(ModelEvents.FitWindow);
            });

        EventModel.addListener(ModelEvents.MoreContent, fireFitWindow);

        EventModel.addListener(ModelEvents.USER_LOGIN, fireFitWindow);
        EventModel.addListener(ModelEvents.USER_CREATE, fireFitWindow);

        EventModel.addListener(ModelEvents.USER, new EventListener(function(user: User) {
                USER = user;
                EventModel.change(ModelEvents.AliasLoaded, user.currentAlias);
            })
        );

        EventModel.addListener(ModelEvents.AliasLoaded, new EventListener(function(alias: Alias) {
                USER.currentAlias = alias;
            })
        );

        EventModel.addListener(ModelEvents.FitWindow, fitWindowListener);

        new JQ("body").click(function(evt: JqEvent): Void {
            new JQ(".nonmodalPopup").hide();
        });

        if(urlVars.agentURI.isNotBlank()) {
            agentURI = urlVars.agentURI;
            // LOGGER.info("Login via id | " + urlVars.uuid);
            // var login: LoginById = new LoginById();
            // login.id = urlVars.agentURI;
            // EventModel.change(ModelEvents.USER_LOGIN, login);
        //     showLogin();
        // } else {
        //     showNewUser();
        }
        showLogin();
    }

    public static function showLogin(): Void {
        var loginComp: LoginComp = new LoginComp(".loginComp");
        if(loginComp.exists()) {
            loginComp.loginComp("open");
        } else {
            loginComp = new LoginComp("<div></div>");
            loginComp.appendTo(new JQ("body"));
            loginComp.loginComp();
            loginComp.loginComp("open");
        }
    }

    public static function showNewUser(): Void {
        var newUserComp: NewUserComp = new NewUserComp(".newUserComp");
        if(newUserComp.exists()) {
            newUserComp.newUserComp("open");
        } else {
            newUserComp = new NewUserComp("<div></div>");
            newUserComp.appendTo(new JQ("body"));
            newUserComp.newUserComp();
            newUserComp.newUserComp("open");
        }
    }
}
