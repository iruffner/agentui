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
        showLogin();
    }

    public static function showLogin(): Void {
        var loginComp: LoginComp = new LoginComp(".loginComp");
        if(loginComp.exists()) {
            loginComp.loginComp("open");
        } else {
            loginComp = new LoginComp("<div></div>");
            loginComp.appendTo(js.Browser.document.body);
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
            newUserComp.appendTo(js.Browser.document.body);
            newUserComp.newUserComp();
            newUserComp.newUserComp("open");
        }
    }

    public static function showSignupConfirmation(): Void {
        var signupConfirmationDialog: SignupConfirmationDialog = new SignupConfirmationDialog(".signupConfirmationDialog");
        if(signupConfirmationDialog.exists()) {
            signupConfirmationDialog.signupConfirmationDialog("open");
        } else {
            signupConfirmationDialog = new SignupConfirmationDialog("<div></div>");
            signupConfirmationDialog.appendTo(js.Browser.document.body);
            signupConfirmationDialog.signupConfirmationDialog();
            signupConfirmationDialog.signupConfirmationDialog("open");
        }
    }

    public static function showNewAlias(): Void {
        var newUserComp: NewAliasComp = new NewAliasComp(".newAliasComp");
        if(newUserComp.exists()) {
            newUserComp.newAliasComp("open");
        } else {
            newUserComp = new NewAliasComp("<div></div>");
            newUserComp.appendTo(js.Browser.document.body);
            newUserComp.newAliasComp();
            newUserComp.newAliasComp("open");
        }
    }

    public static function test(): Void {

        Alias._processDataLog("Work");
        Alias._processDataLog("n_Work(Colleagues, Tasks)");
        Alias._processDataLog("n_Work(n_Colleagues(Emeris, Biosim), Tasks)");
        Alias._processDataLog("and(n_Work(n_Colleagues(Emeris, Biosim), Tasks), n_Personal(n_Family(Ruffner, Denmark), Friends))");
        Alias._processDataLog("and (n_Work (n_Colleagues(Emeris, Biosim), Tasks), n_Personal(n_Family(Ruffner and Patton, Denmark), Friends))");
    }
}
