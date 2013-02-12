package ui;

import js.JQuery;

import ui.jq.JQ;

import ui.log.Logga;
import ui.log.LogLevel;

import ui.model.ModelObj;

import ui.observable.OSet;

import ui.util.UidGenerator;

import ui.widget.ConnectionsList;
import ui.widget.ContentFeed;
import ui.widget.FilterComp;
import ui.widget.LabelTree;
import ui.widget.LabelComp;

using ui.helper.ArrayHelper;
using ui.helper.StringHelper;
using Lambda;


class App {
    
	public static var LOGGER: Logga;

    public static var CONNECTIONS: ObservableSet<Connection>;
    public static var LABELS: ObservableSet<Label>;
    public static var CONTENT: ObservableSet<Content>;
	

	public static function main() {
        LOGGER = new Logga(LogLevel.DEBUG);
        CONNECTIONS = new ObservableSet<Connection>(ModelObj.identifier);
        LABELS = new ObservableSet<Label>(ModelObj.identifier);
        CONTENT = new ObservableSet<Content>(ModelObj.identifier);

        //widgets
        // LabelComp.widgetizeMe();
        // ui.widget.ConnectionAvatar.widgetizeMe();
    }

    public static function start(): Void {
    	new JQ("#middleContainer #content #tabs").tabs();

        new ConnectionsList("#connections").connectionsList({
                connections: App.CONNECTIONS
            });
        new LabelTree("#labels").labelTree({
                labels: new FilteredSet(App.LABELS, function(label: Label): Bool { 
                        return label.parentUid.isBlank();
                    })
            });

        new FilterComp("#filter").filterComp(null);

        new ContentFeed("#feed").contentFeed({
                content: App.CONTENT
            });

        demo();
    }

    private static function demo(): Void {
        //connections
        var george: Connection = new Connection("George", "Costanza", "media/test/george.jpg");
        george.uid = UidGenerator.create();
        App.CONNECTIONS.add(george);

        var elaine: Connection = new Connection("Elaine", "Benes", "media/test/elaine.jpg");
        elaine.uid = UidGenerator.create();
        App.CONNECTIONS.add(elaine);

        var kramer: Connection = new Connection("Cosmo", "Kramer", "media/test/kramer.jpg");
        kramer.uid = UidGenerator.create();
        App.CONNECTIONS.add(kramer);

        var toms: Connection = new Connection("Tom's", "Restaurant", "media/test/toms.jpg");
        toms.uid = UidGenerator.create();
        App.CONNECTIONS.add(toms);

        var newman: Connection = new Connection("Newman", "", "media/test/newman.jpg");
        newman.uid = UidGenerator.create();
        App.CONNECTIONS.add(newman);

        //labels
        var locations: Label = new Label("Locations");
        locations.uid = UidGenerator.create();
        App.LABELS.add(locations);

        var home: Label = new Label("Home");
        home.uid = UidGenerator.create();
        home.parentUid = locations.uid;
        App.LABELS.add(home);

        var city: Label = new Label("City");
        city.uid = UidGenerator.create();
        city.parentUid = locations.uid;
        App.LABELS.add(city);

        var media: Label = new Label("Media");
        media.uid = UidGenerator.create();
        App.LABELS.add(media);

        var personal: Label = new Label("Personal");
        personal.uid = UidGenerator.create();
        personal.parentUid = media.uid;
        App.LABELS.add(personal);

        var work: Label = new Label("Work");
        work.uid = UidGenerator.create();
        work.parentUid = media.uid;
        App.LABELS.add(work);

        var interests = new Label("Interests");
        interests.uid = UidGenerator.create();
        App.LABELS.add(interests);

        //content
        var audioContent: AudioContent = new AudioContent();
        audioContent.uid = UidGenerator.create();
        audioContent.type = "AUDIO";
        audioContent.audioSrc = "media/test/hello_newman.mp3";
        audioContent.audioType = "audio/mpeg";
        audioContent.connections = new ObservableSet<Connection>(ModelObj.identifier);
        audioContent.connections.add(kramer);
        audioContent.connections.add(george);
        audioContent.connections.add(newman);
        audioContent.connections.add(elaine);
        audioContent.labels = new ObservableSet<Label>(ModelObj.identifier);
        audioContent.labels.add(media);
        audioContent.labels.add(personal);
        audioContent.title = "Hello Newman Compilation";
        App.CONTENT.add(audioContent);

        var img: ImageContent = new ImageContent();
        img.uid = UidGenerator.create();
        img.type = "IMAGE";
        img.imgSrc = "media/test/soupkitchen.jpg";
        img.caption = "Soup Kitchen";
        img.connections = new ObservableSet<Connection>(ModelObj.identifier);
        img.connections.add(george);
        img.connections.add(elaine);
        img.labels = new ObservableSet<Label>(ModelObj.identifier);
        img.labels.add(locations);
        img.labels.add(city);
        // img.labels.add(interests);
        App.CONTENT.add(img);

        img = new ImageContent();
        img.uid = UidGenerator.create();
        img.type = "IMAGE";
        img.imgSrc = "media/test/apt.jpg";
        img.caption = "Apartment";
        img.connections = new ObservableSet<Connection>(ModelObj.identifier);
        img.connections.add(kramer);
        img.connections.add(newman);
        img.labels = new ObservableSet<Label>(ModelObj.identifier);
        img.labels.add(locations);
        img.labels.add(home);
        App.CONTENT.add(img);

        img = new ImageContent();
        img.uid = UidGenerator.create();
        img.type = "IMAGE";
        img.imgSrc = "media/test/jrmint.jpg";
        img.caption = "The Junior Mint!";
        img.connections = new ObservableSet<Connection>(ModelObj.identifier);
        img.connections.add(kramer);
        img.labels = new ObservableSet<Label>(ModelObj.identifier);
        img.labels.add(interests);
        App.CONTENT.add(img);
    }

}
