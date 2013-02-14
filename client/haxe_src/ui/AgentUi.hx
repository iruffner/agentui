package ui;

import js.JQuery;

import ui.jq.JQ;

import ui.log.Logga;
import ui.log.LogLevel;

import ui.model.ModelObj;
import ui.model.Dao;
import ui.model.Node;
import ui.model.EventModel;

import ui.observable.OSet;

import ui.util.UidGenerator;

import ui.widget.ConnectionsList;
import ui.widget.ContentFeed;
import ui.widget.FilterComp;
import ui.widget.LabelTree;
import ui.widget.LabelComp;
import ui.widget.UserComp;

import ui.model.TestDao;

using ui.helper.ArrayHelper;
using ui.helper.StringHelper;
using Lambda;


class AgentUi {
    
	public static var LOGGER: Logga;

    public static var CONNECTIONS: ObservableSet<Connection>;
    public static var LABELS: ObservableSet<Label>;
    public static var CONTENT: ObservableSet<Content>;

    public static var DAO: Dao;

	public static function main() {
        LOGGER = new Logga(LogLevel.DEBUG);
        CONNECTIONS = new ObservableSet<Connection>(ModelObj.identifier);
        LABELS = new ObservableSet<Label>(ModelObj.identifier);
        CONTENT = new ObservableSet<Content>(ModelObj.identifier);
        DAO = new Dao();

        //widgets
        // LabelComp.widgetizeMe();
        // ui.widget.ConnectionAvatar.widgetizeMe();
    }

    public static function start(): Void {
    	new JQ("#middleContainer #content #tabs").tabs();

        new ConnectionsList("#connections").connectionsList({
                connections: AgentUi.CONNECTIONS
            });
        new LabelTree("#labels").labelTree({
                labels: new FilteredSet(AgentUi.LABELS, function(label: Label): Bool { 
                        return label.parentUid.isBlank();
                    })
            });

        new FilterComp("#filter").filterComp(null);

        new ContentFeed("#feed").contentFeed({
                content: AgentUi.CONTENT
            });

        new UserComp("#userId").userComp();

        EventModel.addListener("filterComplete", new EventListener(function(filter: Node) {
                untyped __js__("fitWindow()");
            })
        );

        demo();
    }

    private static function demo(): Void {
        var user: User = DAO.getUser("");
        EventModel.change("user", user);
        var connections: Array<Connection> = DAO.getConnections(null);
        for(c_ in 0...connections.length) {
            CONNECTIONS.add(connections[c_]);
        }
        var labels: Array<Label> = DAO.getLabels(null);
        for(l_ in 0...labels.length) {
            LABELS.add(labels[l_]);
        }
    }

}
