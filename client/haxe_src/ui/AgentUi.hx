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

using ui.helper.ArrayHelper;
using ui.helper.StringHelper;
using Lambda;


class AgentUi {
    
	public static var LOGGER: Logga;

    // public static var CONNECTIONS: ObservableSet<Connection>;
    // public static var LABELS: ObservableSet<Label>;
    public static var CONTENT: ObservableSet<Content>;
    public static var USER: User;

    public static var PROTOCOL: ProtocolHandler;

	public static function main() {
        LOGGER = new Logga(LogLevel.DEBUG);
        // CONNECTIONS = new ObservableSet<Connection>(ModelObj.identifier);
        // LABELS = new ObservableSet<Label>(ModelObj.identifier);
        CONTENT = new ObservableSet<Content>(ModelObj.identifier);
        PROTOCOL = new ProtocolHandler();
    }

    public static function start(): Void {
    	new JQ("#middleContainer #content #tabs").tabs();

        new ConnectionsList("#connections").connectionsList({
                // connections: AgentUi.CONNECTIONS
            });
        new LabelsList("#labelsList").labelsList();

        new FilterComp("#filter").filterComp(null);

        new ContentFeed("#feed").contentFeed({
                content: AgentUi.CONTENT
            });

        new UserComp("#userId").userComp();

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
        // var connections: Array<Connection> = DAO.getConnections(null);
        // for(c_ in 0...connections.length) {
            // CONNECTIONS.add(connections[c_]);
        // }
        // var labels: Array<Label> = DAO.getLabels(null);
        // for(l_ in 0...labels.length) {
            // LABELS.add(labels[l_]);
        // }
    }

}
