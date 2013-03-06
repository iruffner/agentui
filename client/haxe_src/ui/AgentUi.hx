package ui;

import js.JQuery;

import ui.jq.JQ;

import ui.log.Logga;
import ui.log.LogLevel;

import ui.model.ModelObj;
import ui.model.Node;
import ui.model.EventModel;
import ui.api.ProtocolHandler;

import ui.observable.OSet;

import ui.util.UidGenerator;

import ui.widget.ConnectionsList;
import ui.widget.LabelsList;
import ui.widget.ContentFeed;
import ui.widget.FilterComp;
import ui.widget.UserComp;
import ui.widget.PostComp;
import ui.serialization.Serialization;

using ui.helper.ArrayHelper;
using ui.helper.StringHelper;
using Lambda;


class AgentUi {
    
	public static var LOGGER: Logga;
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
    	new JQ("#sideRight #chat").tabs();

        new ConnectionsList("#connections").connectionsList({
            });
        new LabelsList("#labelsList").labelsList();

        new FilterComp("#filter").filterComp(null);

        new ContentFeed("#feed").contentFeed({
                content: AgentUi.CONTENT
            });

        new UserComp("#userId").userComp();
        
        new PostComp("#postInput").postComp();

        EventModel.addListener("filterComplete", new EventListener(function(filter: Node) {
                EventModel.change("fitWindow");
            })
        );

        EventModel.addListener("aliasLoaded", new EventListener(function(alias: Alias) {
                USER.currentAlias = alias;
            })
        );

        EventModel.addListener("fitWindow", new EventListener(function(n: Null<Dynamic>) {
                untyped __js__("fitWindow()");
            })
        );

        new JQ("body").click(function(evt: JqEvent): Void {
            new JQ(".nonmodalPopup").hide();
        });

        //TODO load the user from the session

        demo();
    }

    private static function demo(): Void {
        USER = PROTOCOL.getUser("");
        EventModel.change("user", USER);
    }

}
