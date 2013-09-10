package ui.model;

import m3.util.ColorProvider;
import m3.observable.OSet;
import m3.serialization.Serialization;
import m3.exception.Exception;

using m3.helper.ArrayHelper;
using m3.helper.OSetHelper;
using m3.helper.StringHelper;

@:rtti
class ModelObj<T> {
	public var uid: String;

	public static function identifier<T>(t: {uid: String}): String {
		return t.uid;
	}
}

class Login extends ModelObj<Login> {
	public function new () {}
	public var password: String;

	public function getUri(): String {
		return throw new Exception("don't call me!");
	}
}

class LoginByUn extends Login {
	public var email: String;
	// public var agency: String;

	override public function getUri(): String {
		// return "agent://" + username + ":" + password + "@server:9876/" + agency + "?email=george@costanza.com&fullname=George+Costanza";
		return "agent://email/" + email + "?password=" + password;
	}
}

class LoginById extends Login {
	public var uuid: String;

	override public function getUri(): String {
		return uuid + "?password=" + password;
	}
}

class NewUser extends ModelObj<NewUser> {
	public var name: String;
	public var userName: String;
	public var email: String;
	public var pwd: String;

	public function new () {}
}

class User extends ModelObj<User> {
	public var sessionURI: String;
	public var fname: String;
	public var lname: String;
	@:optional public var imgSrc: String;
	@:transient public var aliasSet: ObservableSet<Alias>;
	private var aliases: Array<Alias>;
	@:isVar public var currentAlias (get,set): Alias;

	public function new () {}

	private function get_currentAlias(): Alias {
		if(currentAlias == null && aliasSet != null) {
			currentAlias = aliasSet.iterator().next();
		} else if (currentAlias == null) {
			currentAlias = new Alias();
			AgentUi.LOGGER.warn("No aliases found for user.");
		}
		return currentAlias;
	}

	private function set_currentAlias(alias: Alias): Alias {
		currentAlias = alias;
		return currentAlias;
	}

	public function hasValidSession(): Bool {
		//TODO //IMPLEMENT ME
		ui.AgentUi.LOGGER.warn("implement User.hasValidSession");
		return true;
	}

	private function readResolve(): Void {
		aliasSet = new ObservableSet<Alias>(ModelObj.identifier, aliases);
	}

	private function writeResolve(): Void {
		aliases = aliasSet.asArray();
	}
}

class Alias extends ModelObj<Alias> {
	@:optional public var imgSrc: String;
	public var label: String;
	@:transient public var labelSet: ObservableSet<Label>;
	private var labels: Array<Label>;
	@:transient public var connectionSet: ObservableSet<Connection>;
	private var connections: Array<Connection>;


	public function new () {}

	private function readResolve(): Void {
		labelSet = new ObservableSet<Label>(ModelObj.identifier, labels);
		connectionSet = new ObservableSet<Connection>(ModelObj.identifier, connections);
	}

	private function writeResolve(): Void {
		labels = labelSet.asArray();
		connections = connectionSet.asArray();
	}
}

interface Filterable {

}

class Label extends ModelObj<Connection> implements Filterable {
	public var text: String;
	@:optional public var parentUid: String;

	@:transient public var color: String;

	public function new(?text: String) {
		this.text = text;
		color = ColorProvider.getNextColor();
	}
}

class Connection extends ModelObj<Connection> implements Filterable {
	public var fname: String;
	public var lname: String;
	public var imgSrc: String;

	public function new(?fname: String, ?lname: String, ?imgSrc: String) {
		this.fname = fname;
		this.lname = lname;
		this.imgSrc = imgSrc;
	}
}

class Content extends ModelObj<Content> {
	public var type: String;
	@:transient public var labelSet: ObservableSet<String>;
	private var labels: Array<String>;
	@:transient public var connectionSet: ObservableSet<String>;
	private var connections: Array<String>;
	public var creator: String;

	private function readResolve(): Void {
		labelSet = new ObservableSet<String>(OSetHelper.strIdentifier, labels);
		connectionSet = new ObservableSet<String>(OSetHelper.strIdentifier, connections);
	}

	private function writeResolve(): Void {
		labels = labelSet.asArray();
		connections = connectionSet.asArray();
	}

	public function toInsertExpression(): String {
		var str: String = "InsertContent(";
		var labels = labelSet.joinX(",");
		if(labels.isNotBlank()) {
			if(labels.contains(",")) {
				str += "any(" + labels + ")";
			} else {
				str += labels;
			}
		} else {
			str += "_";
		}
		str += ",";

		var conns = connectionSet.joinX(",");
		if(conns.isNotBlank()) {
			if(conns.contains(",")) {
				str += "any(" + conns + "," + AgentUi.USER.uid + ")";
			} else {
				str += conns + "," + AgentUi.USER.uid;
			}
		} else {
			str += AgentUi.USER.uid;
		}
		str += ",";

		str += AgentUi.SERIALIZER.toJsonString(this);

		return str + ")";
	}
}

class ImageContent extends Content {
	public var imgSrc: String;
	public var caption: String;

	public function new () {}
}

class AudioContent extends Content {
	public var audioSrc: String;
	public var audioType: String;
	public var title: String;

	public function new () {}
}

class MessageContent extends Content {
	public var text: String;

	public function new () {}
}

class UrlContent extends MessageContent {
	public var url: String;
}

