package ui;

import ui.jq.JQ;

import ui.log.Logga;
import ui.log.LogLevel;

import ui.model.ModelObj;

import ui.observable.OSet;

import ui.util.UidGenerator;

using ui.helper.ArrayHelper;
using ui.helper.StringHelper;
using Lambda;


class App {
    
	public static var LOGGER: Logga;

    public static var CONNECTIONS: ObservableSet<Connection>;
	

	public static function main() {
        LOGGER = new Logga(LogLevel.DEBUG);
        CONNECTIONS = new ObservableSet<Connection>(function(conn: Connection): String {
                return conn.uid;
            });
    }

    public static function start(): Void {
    	new JQ("#middleContainer #content #tabs").tabs();

        new ui.widget.ConnectionsComp("#connections").connectionsComp({
                connections: App.CONNECTIONS
            });

    	new JQDraggable('.label').draggable({ 
    		// containment: "#connections", 
    		revert: function(dropTarget: Dynamic) {
    			return (dropTarget == null || !cast(dropTarget, JQ).is(".labelDT"));
    		},
    		// helper: "clone",
    		distance: 10,
    		// grid: [5,5],
    		scroll: false, 
    		stop: function(event, ui) {
    			LOGGER.debug("draggable stop");
    		}
    	});

    	new JQDroppable( "#filter" ).droppable({
    		accept: function(d) {
    			return d.is(".filterable");
    		},
			activeClass: "ui-state-hover",
	      	hoverClass: "ui-state-active",
	      	drop: function( event, ui ) {
	      		LOGGER.debug("droppable drop");	
	        	// $( this ).addClass( "ui-state-highlight" );
	      	}
	    });

	    

	    new JQDroppable( "#labels" ).droppable({
    		accept: function(d) {
    			return d.is(".label");
    		},
			activeClass: "ui-state-hover",
	      	hoverClass: "ui-state-active",
	      	drop: function( event, ui ) {
	      		LOGGER.debug("droppable drop");	
	        	// $( this ).addClass( "ui-state-highlight" );
	      	}
	    });

        demo();
    }

    private static function demo(): Void {
        //connections
        var c: Connection = new Connection("George", "Costanza", "media/test/george.jpg");
        c.uid = UidGenerator.create(20);
        App.CONNECTIONS.add(c);

        c = new Connection("Elaine", "Benes", "media/test/elaine.jpg");
        c.uid = UidGenerator.create(20);
        App.CONNECTIONS.add(c);

        c = new Connection("Cosmo", "Kramer", "media/test/kramer.jpg");
        c.uid = UidGenerator.create(20);
        App.CONNECTIONS.add(c);

        c = new Connection("Tom's", "Restaurant", "media/test/toms.jpg");
        c.uid = UidGenerator.create(20);
        App.CONNECTIONS.add(c);

        c = new Connection("Newman", "", "media/test/newman.jpg");
        c.uid = UidGenerator.create(20);
        App.CONNECTIONS.add(c);
    }

}
