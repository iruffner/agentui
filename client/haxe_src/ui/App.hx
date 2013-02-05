package ui;

import js.JQuery;

import ui.jq.JQ;

import ui.log.Logga;
import ui.log.LogLevel;

import ui.model.ModelObj;

import ui.observable.OSet;

import ui.util.UidGenerator;

import ui.widget.LabelComp;

using ui.helper.ArrayHelper;
using ui.helper.StringHelper;
using Lambda;


class App {
    
	public static var LOGGER: Logga;

    public static var CONNECTIONS: ObservableSet<Connection>;
    public static var LABELS: ObservableSet<Label>;
	

	public static function main() {
        LOGGER = new Logga(LogLevel.DEBUG);
        CONNECTIONS = new ObservableSet<Connection>(function(conn: Connection): String {
                return conn.uid;
            });
        LABELS = new ObservableSet<Label>(function(label: Label): String {
                return label.uid;
            });
    }

    public static function start(): Void {
    	new JQ("#middleContainer #content #tabs").tabs();

        new ui.widget.ConnectionsList("#connections").connectionsList({
                connections: App.CONNECTIONS
            });
        new ui.widget.LabelTree("#labels").labelTree({
                labels: new FilteredSet(App.LABELS, function(label: Label): Bool { 
                        return label.parentUid.isBlank();
                    })
            });

        new ui.widget.FilterComp("#filter").filterComp(null);

        demo();
    }

    private static function demo(): Void {
        //connections
        var c: Connection = new Connection("George", "Costanza", "media/test/george.jpg");
        c.uid = UidGenerator.create();
        App.CONNECTIONS.add(c);

        c = new Connection("Elaine", "Benes", "media/test/elaine.jpg");
        c.uid = UidGenerator.create();
        App.CONNECTIONS.add(c);

        c = new Connection("Cosmo", "Kramer", "media/test/kramer.jpg");
        c.uid = UidGenerator.create();
        App.CONNECTIONS.add(c);

        c = new Connection("Tom's", "Restaurant", "media/test/toms.jpg");
        c.uid = UidGenerator.create();
        App.CONNECTIONS.add(c);

        c = new Connection("Newman", "", "media/test/newman.jpg");
        c.uid = UidGenerator.create();
        App.CONNECTIONS.add(c);

        //labels
        var par: Label = new Label("Locations");
        par.uid = UidGenerator.create();
        App.LABELS.add(par);

        var ch: Label = new Label("Personal");
        ch.uid = UidGenerator.create();
        ch.parentUid = par.uid;
        App.LABELS.add(ch);

        ch = new Label("Work");
        ch.uid = UidGenerator.create();
        ch.parentUid = par.uid;
        App.LABELS.add(ch);

        par = new Label("Media");
        par.uid = UidGenerator.create();
        App.LABELS.add(par);

        ch = new Label("Personal");
        ch.uid = UidGenerator.create();
        ch.parentUid = par.uid;
        App.LABELS.add(ch);

        ch = new Label("Work");
        ch.uid = UidGenerator.create();
        ch.parentUid = par.uid;
        App.LABELS.add(ch);

        var par = new Label("Interests");
        par.uid = UidGenerator.create();
        App.LABELS.add(par);
    }

}
