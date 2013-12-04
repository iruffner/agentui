package ui.api;

import ui.model.ModelObj;
import ui.model.Node;
import ui.model.EM;
import m3.observable.OSet.ObservableSet;
import m3.util.UidGenerator;

using m3.helper.ArrayHelper;
using m3.helper.OSetHelper;

class TestDao {

	private static var connections: Array<Connection>;
	private static var labels: Array<Label>;
	private static var aliases: Array<Alias>;
	private static var initialized: Bool = false;
	private static var _lastRandom: Int = 0;

	private static function buildConnections(): Void {
		connections = new Array<Connection>();
		 //connections
        var george: Connection = new Connection(new UserData("George Costanza", "media/test/george.jpg"));
        george.source = "jerry";
        george.target = "george";
        george.label = "jerryToGeorge";
        connections.push(george);

        var elaine: Connection = new Connection(new UserData("Elaine Benes", "media/test/elaine.jpg"));
        elaine.source = "jerry";
        elaine.target = "elaine";
        elaine.label = "jerryToElaine";
        connections.push(elaine);

        var kramer: Connection = new Connection(new UserData("Cosmo Kramer", "media/test/kramer.jpg"));
        kramer.source = "jerry";
        kramer.target = "kramer";
        kramer.label = "jerryToKramer";
        connections.push(kramer);

        var toms: Connection = new Connection(new UserData("Tom's Restaurant", "media/test/toms.jpg"));
        toms.source = "jerry";
        toms.target = "toms";
        toms.label = "jerryToToms";
        connections.push(toms);

        var newman: Connection = new Connection(new UserData("Newman", "media/test/newman.jpg"));
        newman.source = "jerry";
        newman.target = "newman";
        newman.label = "jerryToNewman";
        connections.push(newman);

        var bania: Connection = new Connection(new UserData("Kenny Bania", "media/test/bania.jpg"));
        bania.source = "jerry";
        bania.target = "bania";
        bania.label = "jerryToBania";
        connections.push(bania);
	}

	private static function buildLabels(): Void {
		labels = new Array<Label>();
		
        //labels
        var locations: Label = new Label("Locations");
        labels.push(locations);

        var home: Label = new Label("Home");
        home.parentUid = locations.uid;
        labels.push(home);

        var city: Label = new Label("City");
        city.parentUid = locations.uid;
        labels.push(city);

        var media: Label = new Label("Media");
        labels.push(media);

        var personal: Label = new Label("Personal");
        personal.parentUid = media.uid;
        labels.push(personal);

        var work: Label = new Label("Work");
        work.parentUid = media.uid;
        labels.push(work);

        var interests = new Label("Interests");
        labels.push(interests);
	}

    private static function randomDate():Date {
        var  year : Int = 2012 + Std.random(2);
        var month : Int = Std.random(12);
        var day : Int   = 1 + Std.random(28);
        var hour : Int  = Std.random(24);
        var min : Int = Std.random(60);
        var sec : Int = Std.random(60);

        return new Date(year, month, day, hour, min, sec);
    }

	private static function buildAliases(): Void {
		aliases = new Array<Alias>();

        var aliasData:Array<Dynamic> = [
              {label: "Comedian", imgSrc:"media/test/jerry_comedy.jpg"}
            , {label: "Actor", imgSrc:"media/test/jerry_bee.jpg"}
            , {label: "Private", imgSrc:"media/test/default_avatar.jpg"}
            , {label: "Philatelist", imgSrc:"media/test/jerry_stamp.jpg"}
        ];

        for (i in 0...aliasData.length) {
    		var alias: Alias = new Alias();
            alias.label  = aliasData[i].label;
            alias.profile = new UserData();
            alias.profile.imgSrc = aliasData[i].imgSrc;
            aliases.push(alias);
        }
	}

	private static function generateContent(node: Node): Array<Content> {

		var availableConnections = getConnectionsFromNode(node);
		var availableLabels = getLabelsFromNode(node);

		var content = new Array<Content>();

		var audioContent: AudioContent = new AudioContent();
        audioContent.audioSrc = "media/test/hello_newman.mp3";
        audioContent.audioType = "audio/mpeg";
        audioContent.title = "Hello Newman Compilation";
        audioContent.created = randomDate();
        if(availableConnections.hasValues()) {
            audioContent.creator = getRandomFromArray(availableConnections).uid;
        } else {
            audioContent.creator = AppContext.USER.currentAlias.label;
        }
        if(availableConnections.hasValues()) {
        	addConnections(availableConnections, audioContent, 2);
	    }
        if(availableLabels.hasValues()) {
        	addLabels(availableLabels, audioContent, 2);
	    }
        content.push(audioContent);

        var imgData:Array<Dynamic> = [
            {imgSrc: "media/test/soupkitchen.jpg", caption: "Soup Kitchen"}
            ,{imgSrc: "media/test/apt.jpg", caption: "Apartment"}
            ,{imgSrc: "media/test/jrmint.jpg", caption: "The Junior Mint!!!"}
            ,{imgSrc: "media/test/oldschool.jpg", caption: "Retro Jerry"}
            ,{imgSrc: "media/test/mailman.jpg", caption: "Jerry Delivering the mail"}
            ,{imgSrc: "media/test/closet.jpg", caption: "Stuck in the closet!"}
        ];

        for (i in 0...imgData.length) {
            var img: ImageContent = new ImageContent();
            img.imgSrc = imgData[i].imgSrc;
            img.caption = imgData[i].caption;
            img.created = randomDate();
            if(availableConnections.hasValues()) {
                img.creator = getRandomFromArray(availableConnections).uid;
            } else {
                img.creator = AppContext.USER.currentAlias.label;
            }
            if(availableConnections.hasValues()) {
            	addConnections(availableConnections, img, 1);
    	    }
            if(availableLabels.hasValues()) {
            	addLabels(availableLabels, img, 2);
    	    }
            content.push(img);
        }

        var url_data:Array<Dynamic> = [
            {text: "Check out this link", url: "http://www.bing.com"}
            ,{text: "CNN", url: "http://cnn.com"}
            ,{text: "IMDB", url: "http://www.imdb.com"}
        ];

        for (i in 0...url_data.length) {
            var urlContent = new UrlContent();
            urlContent.text = url_data[i].text;
            urlContent.url  = url_data[i].url;
            urlContent.created = randomDate();
            if(availableConnections.hasValues()) {
                urlContent.creator = getRandomFromArray(availableConnections).uid;
            } else {
                urlContent.creator = AppContext.USER.currentAlias.label;
            }
            if(availableConnections.hasValues()) {
                addConnections(availableConnections, urlContent, 1);
            }
            if(availableLabels.hasValues()) {
                addLabels(availableLabels, urlContent, 2);
            }
            content.push(urlContent);
        }

        var phrases = [
            "It's the best, Jerry! The best!"
            , "You should've seen her face. It was the exact same look my father gave me when I told him I wanted to be a ventriloquist."
            , "I find tinsel distracting."
            , "The Moops invaded Spain in the 8th century."
            , " You put the balm on? Who told you to put the balm on? I didn't tell you to put the balm on. Why'd you put the balm on? You haven't even been to see the doctor. If your gonna put a balm on, let a doctor put a balm on.   Oh oh oh, so a Maestro tells you to put a balm on and you do it?  Do you know what a balm is? Have you ever seen a balm? Didn't you read the instructions?"
            , "They don't have a decent piece of fruit at the supermarket. The apples are mealy, the oranges are dry... I don't know what's going on with the papayas!"
        ];
        for (i in 0...phrases.length) {
            var textContent = new MessageContent();
            textContent.text = phrases[i];
            textContent.created = randomDate();
            if(availableConnections.hasValues()) {
                textContent.creator = getRandomFromArray(availableConnections).uid;
            } else {
                textContent.creator = AppContext.USER.currentAlias.label;
            }
            if(availableConnections.hasValues()) {
                addConnections(availableConnections, textContent, 1);
            }
            if(availableLabels.hasValues()) {
                addLabels(availableLabels, textContent, 2);
            }
            content.push(textContent);
        }

        return content;
	}

	private static function addConnections(availableConnections: Array<Connection>, content: Content, numToAdd: Int) {
		if(availableConnections.hasValues()) {
        	if(numToAdd == 1) {
        		addOne(availableConnections, content.connectionSet);
        	} else if(numToAdd == 2) {
        		addTwo(availableConnections, content.connectionSet);
    		} else {
    			addAll(availableConnections, content.connectionSet);
    		}
	    }
	}

	private static function addLabels(availableConnections: Array<Label>, content: Content, numToAdd: Int) {
		if(availableConnections.hasValues()) {
        	if(numToAdd == 1) {
        		addOne(availableConnections, content.labelSet);
        	} else if(numToAdd == 2) {
        		addTwo(availableConnections, content.labelSet);
    		} else {
    			addAll(availableConnections, content.labelSet);
    		}
	    }
	}

	private static function addOne(available: Array<Dynamic>, arr: ObservableSet<Dynamic>): Void {
		// if(available.length == 1) {
  //       	arr.add(available[0]);
		// } else {
        	arr.add(getRandomFromArray(available));
    	// }
	}

	private static function addTwo(available: Array<Dynamic>, arr: ObservableSet<Dynamic>) {
		if(available.length == 1) {
        	// arr.add(available[0]);
        	arr.add(getRandomFromArray(available));
		} else {
        	arr.add(getRandomFromArray(available));
        	arr.add(getRandomFromArray(available));
    	}
	}

	private static function addAll(available: Array<Dynamic>, arr: ObservableSet<Dynamic>) {
		for(t_ in 0...available.length) {
			arr.add(available[t_]);
		}
	}

	private static function getRandomFromArray<T>(arr: Array<T>): T {
		var t: T = null;
		if(arr.hasValues()) {
			t = arr[Std.random(arr.length)];
		}
		return t;
	}

	private static function getConnectionsFromNode(node: Node): Array<Connection> {
		var connections: Array<Connection> = new Array<Connection>();
		if(Std.is(node, ContentNode)) {
			if(node.type == "CONNECTION") {
				connections.push(cast(node, ConnectionNode).content);
			}
		} else {
			for(n_ in 0...node.nodes.length) {
				var childNode = node.nodes[n_];
				if(Std.is(childNode, ContentNode) && childNode.type == "CONNECTION") {
					connections.push(cast(childNode, ConnectionNode).content);
				} else if (childNode.nodes.hasValues()) {
					for(nn_ in 0...childNode.nodes.length) {
						var grandChild = childNode.nodes[nn_];
						connections = connections.concat(getConnectionsFromNode(grandChild));
					}

				}
			}
		}
		return connections;
	}

	private static function getLabelsFromNode(node: Node): Array<Label> {
		var labels: Array<Label> = new Array<Label>();
		if(Std.is(node, ContentNode)) {
			if(node.type == "LABEL") {
				labels.push(cast(node, LabelNode).content);
			}
		} else {
			for(n_ in 0...node.nodes.length) {
				var childNode = node.nodes[n_];
				if(Std.is(childNode, ContentNode) && childNode.type == "LABEL") {
					labels.push(cast(childNode, LabelNode).content);
				} else if (childNode.nodes.hasValues()) {
					for(nn_ in 0...childNode.nodes.length) {
						var grandChild = childNode.nodes[nn_];
						labels = labels.concat(getLabelsFromNode(grandChild));
					}

				}
			}
		}
		return labels;
	}

	private static function randomizeOrder<T>(arr: Array<T>): Array<T> {
		var newArr: Array<Dynamic> = new Array<Dynamic>();
		do {
			var randomIndex: Int = Std.random(arr.length);
			newArr.push(arr[randomIndex]);
			arr.splice(randomIndex, 1);
		} while(arr.length > 0);
		return cast newArr;
	}

	private static function getRandomNumber<T>(arr: Array<T>, amount: Int): Array<T> {
		AppContext.LOGGER.debug("return " + amount);
		var newArr: Array<Dynamic> = new Array<Dynamic>();
		do {
			var randomIndex: Int = Std.random(arr.length);
			newArr.push(arr[randomIndex]);
			arr.splice(randomIndex, 1);
		} while(newArr.length < amount);
		return cast newArr;
	}

	private static function initialize(): Void {
		initialized = true;
		buildConnections();
		buildLabels();
		buildAliases();
	}

	public static function getConnections(user: User): Array<Connection> {
		if(!initialized) initialize();
		return connections;
	}

	public static function getLabels(user: User): Array<Label> {
		if(!initialized) initialize();
		return labels;
	}

	public static function getContent(node: Node): Array<Content> {
		if(!initialized) initialize();
		var arr: Array<Content> = randomizeOrder( generateContent(node) );
		return getRandomNumber(arr , Std.random(arr.length));
	}

	public static function getUser(uid: String): User {
		if(!initialized) initialize();
		var user: User = new User();
        user.sessionURI = "agent-session://ArtVandelay@session1";
        user.userData = new UserData();
        user.userData.name = "Jerry Seinfeld";
        user.userData.imgSrc = "media/test/jerry_default.jpg";
        user.aliasSet = new ObservableSet<Alias>(Alias.identifier);
        user.aliasSet.visualId = "TestAlias";
        user.aliasSet.addAll(aliases);
        var alias: Alias = aliases[0];
        alias.connectionSet.visualId = "TestAliasConnections";
        alias.connectionSet.addAll(connections);
        alias.labelSet.visualId = "TestAliasLabels";
        alias.labelSet.addAll(labels);
        user.currentAlias = alias;
        
        return user;
	}

	public static function getAlias(uid: String): Alias {
		if(!initialized) initialize();
		var alias: Alias = aliases.getElementComplex(uid, "uid");
        alias.connectionSet.visualId = "TestAliasConnections";
        alias.connectionSet.addAll(connections);
        alias.labelSet.visualId = "TestAliasLabels";
        alias.labelSet.addAll(labels);
		return alias;
	}
}