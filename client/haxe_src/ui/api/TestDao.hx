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
        var george: Connection = new Connection("George", "Costanza", "media/test/george.jpg");
        george.uid = UidGenerator.create();
        connections.push(george);

        var elaine: Connection = new Connection("Elaine", "Benes", "media/test/elaine.jpg");
        elaine.uid = UidGenerator.create();
        connections.push(elaine);

        var kramer: Connection = new Connection("Cosmo", "Kramer", "media/test/kramer.jpg");
        kramer.uid = UidGenerator.create();
        connections.push(kramer);

        var toms: Connection = new Connection("Tom's", "Restaurant", "media/test/toms.jpg");
        toms.uid = UidGenerator.create();
        connections.push(toms);

        var newman: Connection = new Connection("Newman", "", "media/test/newman.jpg");
        newman.uid = UidGenerator.create();
        connections.push(newman);
	}

	private static function buildLabels(): Void {
		labels = new Array<Label>();
		
        //labels
        var locations: Label = new Label("Locations");
        locations.uid = UidGenerator.create();
        labels.push(locations);

        var home: Label = new Label("Home");
        home.uid = UidGenerator.create();
        home.parentUid = locations.uid;
        labels.push(home);

        var city: Label = new Label("City");
        city.uid = UidGenerator.create();
        city.parentUid = locations.uid;
        labels.push(city);

        var media: Label = new Label("Media");
        media.uid = UidGenerator.create();
        labels.push(media);

        var personal: Label = new Label("Personal");
        personal.uid = UidGenerator.create();
        personal.parentUid = media.uid;
        labels.push(personal);

        var work: Label = new Label("Work");
        work.uid = UidGenerator.create();
        work.parentUid = media.uid;
        labels.push(work);

        var interests = new Label("Interests");
        interests.uid = UidGenerator.create();
        labels.push(interests);
	}

	private static function buildAliases(): Void {
		aliases = new Array<Alias>();

		var alias: Alias = new Alias();
        alias.uid = UidGenerator.create();
        alias.label = "Comedian";
        alias.imgSrc = "media/test/jerry_comedy.jpg";
        aliases.push(alias);

        alias = new Alias();
        alias.uid = UidGenerator.create();
        alias.label = "Actor";
        alias.imgSrc = "media/test/jerry_bee.jpg";
        aliases.push(alias);

        alias = new Alias();
        alias.uid = UidGenerator.create();
        alias.label = "Private";
        alias.imgSrc = "media/default_avatar.jpg";
        aliases.push(alias);
	}

	// private static function generateContent(node: Node): Array<Content> {
	// 	var availableConnections = getConnectionsFromNode(node);
	// 	var availableLabels = getLabelsFromNode(node);

	// 	var content = new Array<Content>();
	// 	var audioContent: AudioContent = new AudioContent();
 //        audioContent.uid = UidGenerator.create();
 //        audioContent.type = ContentType.AUDIO;
 //        audioContent.audioSrc = "media/test/hello_newman.mp3";
 //        audioContent.audioType = "audio/mpeg";
 //        audioContent.connectionSet = new ObservableSet<String>(OSetHelper.strIdentifier);
 //        audioContent.labelSet = new ObservableSet<String>(OSetHelper.strIdentifier);
 //        if(availableConnections.hasValues()) {
 //            audioContent.creator = getRandomFromArray(availableConnections).uid;
 //        } else {
 //            audioContent.creator = AgentUi.USER.currentAlias.uid;
 //        }
 //        if(availableConnections.hasValues()) {
 //        	addConnections(availableConnections, audioContent, 2);
	//     }
 //        if(availableLabels.hasValues()) {
 //        	addLabels(availableLabels, audioContent, 2);
	//     }
 //        audioContent.title = "Hello Newman Compilation";
 //        content.push(audioContent);

 //        var img: ImageContent = new ImageContent();
 //        img.uid = UidGenerator.create();
 //        img.type = ContentType.IMAGE;
 //        img.imgSrc = "media/test/soupkitchen.jpg";
 //        img.caption = "Soup Kitchen";
 //        img.connectionSet = new ObservableSet<String>(OSetHelper.strIdentifier);
 //        img.labelSet = new ObservableSet<String>(OSetHelper.strIdentifier);
 //        if(availableConnections.hasValues()) {
 //            img.creator = getRandomFromArray(availableConnections).uid;
 //        } else {
 //            img.creator = AgentUi.USER.currentAlias.uid;
 //        }
 //        if(availableConnections.hasValues()) {
 //        	addConnections(availableConnections, img, 1);
	//     }
 //        if(availableLabels.hasValues()) {
 //        	addLabels(availableLabels, img, 2);
	//     }
 //        content.push(img);

 //        img = new ImageContent();
 //        img.uid = UidGenerator.create();
 //        img.type = ContentType.IMAGE;
 //        img.imgSrc = "media/test/apt.jpg";
 //        img.caption = "Apartment";
 //        img.connectionSet = new ObservableSet<String>(OSetHelper.strIdentifier);
 //        img.labelSet = new ObservableSet<String>(OSetHelper.strIdentifier);
 //        if(availableConnections.hasValues()) {
 //            img.creator = getRandomFromArray(availableConnections).uid;
 //        } else {
 //            img.creator = AgentUi.USER.currentAlias.uid;
 //        }
 //        if(availableConnections.hasValues()) {
 //        	addConnections(availableConnections, img, 1);
	//     }
 //        if(availableLabels.hasValues()) {
 //        	addLabels(availableLabels, img, 1);
	//     }
 //        content.push(img);

 //        img = new ImageContent();
 //        img.uid = UidGenerator.create();
 //        img.type = ContentType.IMAGE;
 //        img.imgSrc = "media/test/jrmint.jpg";
 //        img.caption = "The Junior Mint!";
 //        img.connectionSet = new ObservableSet<String>(OSetHelper.strIdentifier);
 //        img.labelSet = new ObservableSet<String>(OSetHelper.strIdentifier);
 //        if(availableConnections.hasValues()) {
 //            img.creator = getRandomFromArray(availableConnections).uid;
 //        } else {
 //            img.creator = AgentUi.USER.currentAlias.uid;
 //        }
 //        if(availableConnections.hasValues()) {
 //        	addConnections(availableConnections, img, 3);
	//     }
 //        if(availableLabels.hasValues()) {
 //        	addLabels(availableLabels, img, 2);
	//     }
 //        content.push(img);

 //        img = new ImageContent();
 //        img.uid = UidGenerator.create();
 //        img.type = ContentType.IMAGE;
 //        img.imgSrc = "media/test/oldschool.jpg";
 //        img.caption = "Retro";
 //        img.connectionSet = new ObservableSet<String>(OSetHelper.strIdentifier);
 //        img.labelSet = new ObservableSet<String>(OSetHelper.strIdentifier);
 //        if(availableConnections.hasValues()) {
 //            img.creator = getRandomFromArray(availableConnections).uid;
 //        } else {
 //            img.creator = AgentUi.USER.currentAlias.uid;
 //        }
 //        if(availableConnections.hasValues()) {
 //        	addConnections(availableConnections, img, 3);
	//     }
 //        if(availableLabels.hasValues()) {
 //        	addLabels(availableLabels, img, 1);
	//     }
 //        content.push(img);

 //        img = new ImageContent();
 //        img.uid = UidGenerator.create();
 //        img.type = ContentType.IMAGE;
 //        img.imgSrc = "media/test/mailman.jpg";
 //        img.caption = "Jerry Delivering the mail";
 //        img.connectionSet = new ObservableSet<String>(OSetHelper.strIdentifier);
 //        img.labelSet = new ObservableSet<String>(OSetHelper.strIdentifier);
 //        if(availableConnections.hasValues()) {
 //            img.creator = getRandomFromArray(availableConnections).uid;
 //        } else {
 //            img.creator = AgentUi.USER.currentAlias.uid;
 //        }
 //        if(availableConnections.hasValues()) {
 //        	addConnections(availableConnections, img, 1);
	//     }
 //        if(availableLabels.hasValues()) {
 //        	addLabels(availableLabels, img, 1);
	//     }
 //        content.push(img);

 //        img = new ImageContent();
 //        img.uid = UidGenerator.create();
 //        img.type = ContentType.IMAGE;
 //        img.imgSrc = "media/test/closet.jpg";
 //        img.caption = "Stuck in the closet!";
 //        img.connectionSet = new ObservableSet<String>(OSetHelper.strIdentifier);
 //        img.labelSet = new ObservableSet<String>(OSetHelper.strIdentifier);
 //        if(availableConnections.hasValues()) {
 //            img.creator = getRandomFromArray(availableConnections).uid;
 //        } else {
 //            img.creator = AgentUi.USER.currentAlias.uid;
 //        }
 //        if(availableConnections.hasValues()) {
 //        	addConnections(availableConnections, img, 1);
	//     }
 //        if(availableLabels.hasValues()) {
 //        	addLabels(availableLabels, img, 2);
	//     }
 //        content.push(img);

 //        var urlContent = new UrlContent();
 //        urlContent.uid = UidGenerator.create();
 //        urlContent.type = ContentType.URL;
 //        urlContent.connectionSet = new ObservableSet<String>(OSetHelper.strIdentifier);
 //        urlContent.labelSet = new ObservableSet<String>(OSetHelper.strIdentifier);
 //        urlContent.text = "Check out this link";
 //        urlContent.url = "http://www.bing.com";
 //        if(availableConnections.hasValues()) {
 //            urlContent.creator = getRandomFromArray(availableConnections).uid;
 //        } else {
 //            urlContent.creator = AgentUi.USER.currentAlias.uid;
 //        }
 //        if(availableConnections.hasValues()) {
 //            addConnections(availableConnections, urlContent, 1);
 //        }
 //        if(availableLabels.hasValues()) {
 //            addLabels(availableLabels, urlContent, 2);
 //        }
 //        content.push(urlContent);

 //        return content;
	// }

	// private static function addConnections(availableConnections: Array<Connection>, content: Content, numToAdd: Int) {
	// 	if(availableConnections.hasValues()) {
 //        	if(numToAdd == 1) {
 //        		addOne(availableConnections, content.connectionSet);
 //        	} else if(numToAdd == 2) {
 //        		addTwo(availableConnections, content.connectionSet);
 //    		} else {
 //    			addAll(availableConnections, content.connectionSet);
 //    		}
	//     }
	// }

	// private static function addLabels(availableConnections: Array<Label>, content: Content, numToAdd: Int) {
	// 	if(availableConnections.hasValues()) {
 //        	if(numToAdd == 1) {
 //        		addOne(availableConnections, content.labelSet);
 //        	} else if(numToAdd == 2) {
 //        		addTwo(availableConnections, content.labelSet);
 //    		} else {
 //    			addAll(availableConnections, content.labelSet);
 //    		}
	//     }
	// }

	private static function addOne(available: Array<Dynamic>, arr: ObservableSet<String>): Void {
		// if(available.length == 1) {
  //       	arr.add(available[0]);
		// } else {
        	arr.add(getRandomFromArray(available).uid);
    	// }
	}

	private static function addTwo(available: Array<Dynamic>, arr: ObservableSet<String>) {
		if(available.length == 1) {
        	// arr.add(available[0]);
        	arr.add(getRandomFromArray(available).uid);
		} else {
        	arr.add(getRandomFromArray(available).uid);
        	arr.add(getRandomFromArray(available).uid);
    	}
	}

	private static function addAll(available: Array<Dynamic>, arr: ObservableSet<String>) {
		for(t_ in 0...available.length) {
			arr.add(available[t_].uid);
		}
	}

	private static function getRandomFromArray<T>(arr: Array<T>): T {
		var t: T = null;
		if(arr.hasValues()) {
			t = arr[Std.random(arr.length)];
		}
		return t;
	}

	// private static function getConnectionsFromNode(node: Node): Array<Connection> {
	// 	var connections: Array<Connection> = new Array<Connection>();
	// 	if(Std.is(node, ContentNode)) {
	// 		if(cast(node, ContentNode).type == "CONNECTION") {
	// 			connections.push(cast(cast(node, ContentNode).filterable, Connection));
	// 		}
	// 	} else {
	// 		for(n_ in 0...node.nodes.length) {
	// 			var childNode = node.nodes[n_];
	// 			if(Std.is(childNode, ContentNode) && cast(childNode, ContentNode).type == "CONNECTION") {
	// 				connections.push(cast(cast(childNode, ContentNode).filterable, Connection));
	// 			} else if (childNode.nodes.hasValues()) {
	// 				for(nn_ in 0...childNode.nodes.length) {
	// 					var grandChild = childNode.nodes[nn_];
	// 					connections = connections.concat(getConnectionsFromNode(grandChild));
	// 				}

	// 			}
	// 		}
	// 	}
	// 	return connections;
	// }

	// private static function getLabelsFromNode(node: Node): Array<Label> {
	// 	var labels: Array<Label> = new Array<Label>();
	// 	if(Std.is(node, ContentNode)) {
	// 		if(cast(node, ContentNode).type == "LABEL") {
	// 			labels.push(cast(cast(node, ContentNode).filterable, Label));
	// 		}
	// 	} else {
	// 		for(n_ in 0...node.nodes.length) {
	// 			var childNode = node.nodes[n_];
	// 			if(Std.is(childNode, ContentNode) && cast(childNode, ContentNode).type == "LABEL") {
	// 				labels.push(cast(cast(childNode, ContentNode).filterable, Label));
	// 			} else if (childNode.nodes.hasValues()) {
	// 				for(nn_ in 0...childNode.nodes.length) {
	// 					var grandChild = childNode.nodes[nn_];
	// 					labels = labels.concat(getLabelsFromNode(grandChild));
	// 				}

	// 			}
	// 		}
	// 	}
	// 	return labels;
	// }

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
		ui.AgentUi.LOGGER.debug("return " + amount);
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

	// public static function getContent(node: Node): Array<Content> {
	// 	if(!initialized) initialize();
	// 	var arr: Array<Content> = randomizeOrder( generateContent(node) );
	// 	return getRandomNumber(arr , Std.random(arr.length));
	// }

	public static function getUser(uid: String): User {
		if(!initialized) initialize();
		var user: User = new User();
        user.sessionURI = "agent-session://ArtVandelay@session1";
        user.userData = new UserData();
        user.userData.name = "Jerry Seinfeld";
        user.uid = UidGenerator.create();
        user.userData.imgSrc = "media/test/jerry_default.jpg";
        user.aliasSet = new ObservableSet<Alias>(ModelObj.identifier);
        user.aliasSet.visualId = "TestAlias";
        user.aliasSet.addAll(aliases);
        var alias: Alias = aliases[0];
        alias.connectionSet = new ObservableSet<Connection>(ModelObj.identifier, connections);
        alias.connectionSet.visualId = "TestAliasConnections";
        alias.labelSet = new ObservableSet<Label>(ModelObj.identifier, labels);
        alias.labelSet.visualId = "TestAliasLabels";
        user.currentAlias = alias;
        
        return user;
	}

	public static function getAlias(uid: String): Alias {
		if(!initialized) initialize();
		var alias: Alias = aliases.getElementComplex(uid, "uid");
		alias.connectionSet = new ObservableSet<Connection>(ModelObj.identifier, connections);
        alias.connectionSet.visualId = "TestAliasConnections";
        alias.labelSet = new ObservableSet<Label>(ModelObj.identifier, labels);
        alias.labelSet.visualId = "TestAliasLabels";
		return alias;
	}
}