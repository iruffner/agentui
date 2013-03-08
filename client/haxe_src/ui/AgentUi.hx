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

import ui.widget.ConnectionsList;
import ui.widget.LabelsList;
import ui.widget.ContentFeed;
import ui.widget.FilterComp;
import ui.widget.UserComp;
import ui.widget.PostComp;
import ui.widget.LoginComp;
import ui.widget.MessagingComp;

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

	public static function main() {
        LOGGER = new Logga(LogLevel.DEBUG);
        CONTENT = new ObservableSet<Content>(ModelObj.identifier);
        PROTOCOL = new ProtocolHandler();
        SERIALIZER = new Serializer();
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

        EventModel.addListener(ModelEvents.FilterComplete, new EventListener(function(filter: Node) {
                EventModel.change(ModelEvents.FitWindow);
            })
        );

        EventModel.addListener(ModelEvents.User, new EventListener(function(user: User) {
                USER = user;
                EventModel.change(ModelEvents.AliasLoaded, user.currentAlias);
            })
        );

        EventModel.addListener(ModelEvents.AliasLoaded, new EventListener(function(alias: Alias) {
                USER.currentAlias = alias;
            })
        );

        EventModel.addListener(ModelEvents.Login, new EventListener(function(login: Login) {
                EventModel.change(ModelEvents.FitWindow);
            })
        );

        EventModel.addListener(ModelEvents.FitWindow, new EventListener(function(n: Null<Dynamic>) {
                untyped __js__("fitWindow()");
            })
        );

        new JQ("body").click(function(evt: JqEvent): Void {
            new JQ(".nonmodalPopup").hide();
        });

        //TODO load the user from the session
        var loginComp: LoginComp = new LoginComp("<div></div>");
        loginComp.appendTo(new JQ("body"));
        loginComp.loginComp();
        loginComp.loginComp("open");

        // demo();
    }

    // private static function demo(): Void {
    //     USER = PROTOCOL.getUser(null);
    //     EventModel.change("user", USER);
    // }

}
