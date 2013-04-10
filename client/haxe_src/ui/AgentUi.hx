package ui;

import js.JQuery;

import ui.jq.JQ;

import ui.log.Logga;
import ui.log.LogLevel;

import ui.model.ModelObj;
import ui.model.Node;
import ui.model.EventModel;
import ui.model.ModelEvents;
import ui.api.ProtocolHandler;

import ui.observable.OSet;

import ui.util.UidGenerator;
import ui.util.HtmlUtil;

import ui.widget.ConnectionsList;
import ui.widget.LabelsList;
import ui.widget.ContentFeed;
import ui.widget.FilterComp;
import ui.widget.UserComp;
import ui.widget.PostComp;
import ui.widget.LoginComp;
import ui.widget.MessagingComp;
import ui.widget.InviteComp;

import ui.serialization.Serialization;

using ui.helper.ArrayHelper;
using ui.helper.StringHelper;
using Lambda;


class AgentUi {
    
    public static var LOGGER: Logga;
	public static var DEMO: Bool = true;
    public static var CONTENT: ObservableSet<Content>;
    public static var USER: User;
    public static var SERIALIZER: Serializer;
    public static var PROTOCOL: ProtocolHandler;
    public static var URL: String = "";//"http://64.27.3.17";


	public static function main() {
        LOGGER = new Logga(LogLevel.DEBUG);
        CONTENT = new ObservableSet<Content>(ModelObj.identifier);
        PROTOCOL = new ProtocolHandler();
        SERIALIZER = new Serializer();

        // SERIALIZER.addHandler(ObservableSet, new ObservableSetHandler());

        // var content: MessageContent = new MessageContent();
        // content.type = "audio";
        // content.labels = new ObservableSet<Label>(ModelObj.identifier);
        // content.connections = new ObservableSet<Connection>(ModelObj.identifier);
        // content.text = "test";

        // var str: String = SERIALIZER.toJsonString(content);
        // LOGGER.debug(str);
    }

    public static function start(): Void {
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

        EventModel.addListener(ModelEvents.Login, fireFitWindow);

        EventModel.addListener(ModelEvents.User, new EventListener(function(user: User) {
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


        var urlVars: Dynamic<String> = HtmlUtil.getUrlVars();
        if(urlVars.id.isNotBlank()) {
            LOGGER.info("Login via id | " + urlVars.id);
            var login: LoginById = new LoginById();
            login.id = urlVars.id;
            EventModel.change(ModelEvents.Login, login);
        } else {
            var loginComp: LoginComp = new LoginComp("<div></div>");
            loginComp.appendTo(new JQ("body"));
            loginComp.loginComp();
            loginComp.loginComp("open");            
        }
    }
}
