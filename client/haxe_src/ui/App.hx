package ui;

import ui.jq.JQ;

import ui.log.Logga;
import ui.log.LogLevel;

import ui.model.ModelObj;

import ui.observable.OSet;

using ui.helper.ArrayHelper;
using ui.helper.StringHelper;
using Lambda;


class App {
    
	public static var LOGGER: Logga;

    public static var CONNECTIONS: ObservableSet<Connection>;
	

	public static function main() {
        LOGGER = new Logga(LogLevel.DEBUG);
        CONNECTIONS = new ObservableSet<Connection>();
    }

    public static function start(): Void {
    	new JQ("#middleContainer #content #tabs").tabs();

        new ui.widget.ConnectionsComp("#connections").connectionsComp({
                connections: App.CONNECTIONS
            });

    	cast(new JQDraggable('.connection').draggable({ 
    		// containment: "#connections", 
    		revert: function(dropTarget: Dynamic) {

    			return (dropTarget == null || !cast(dropTarget, JQ).is(".connectionDT")) && JQ.cur.addClass("ui-drop-reverted") != null;
    		},
    		// helper: "clone",
    		distance: 10,
    		// grid: [5,5],
    		scroll: false, 
    		stop: function(event, ui) {
    			var clone = ui.helper.clone();
    			if(true) {
    				LOGGER.debug("true");

    			}
    		}
    	}), JQDroppable).droppable({
    		accept: function(d) {
    			return d.is(".connection") || d.is(".label");
    		},
			activeClass: "ui-state-hover",
	      	hoverClass: "ui-state-active",
	      	drop: function( event, ui ) {
	      		
	        	
	      	}
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

	    new JQDroppable( "#connections" ).droppable({
    		accept: function(d) {
    			return d.is(".connection");
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
        App.CONNECTIONS.add(c);

        c = new Connection("Elaine", "Benes", "media/test/elaine.jpg");
        App.CONNECTIONS.add(c);

        c = new Connection("Cosmo", "Kramer", "media/test/kramer.jpg");
        App.CONNECTIONS.add(c);

        c = new Connection("Tom's", "Restaurant", "media/test/toms.jpg");
        App.CONNECTIONS.add(c);

        c = new Connection("Newman", "", "media/test/newman.jpg");
        App.CONNECTIONS.add(c);
    }

}
