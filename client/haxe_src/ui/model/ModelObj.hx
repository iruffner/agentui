package ui.model;

import ui.util.ColorProvider;
import ui.observable.OSet;
import ui.serialization.Serialization;

class ModelObj<T> implements haxe.rtti.Infos  {
	public var uid: String;

	public static function identifier<T>(t: {uid: String}): String {
		return t.uid;
	}
}

class Login extends ModelObj<Login> {
	public var username: String;
	public var password: String;
	public var agency: String;

	public function new () {}
}

class User extends ModelObj<User> {
	public var sessionURI: String;
	public var fname: String;
	public var lname: String;
	@:optional public var imgSrc: String;
	public var aliases: ObservableSet<Alias>;
	public var currentAlias (_getCurrentAlias,_setCurrentAlias): Alias;

	public function new () {}

	private function _getCurrentAlias(): Alias {
		if(currentAlias == null) {
			currentAlias = aliases.iterator().next();
		}
		return currentAlias;
	}

	private function _setCurrentAlias(alias: Alias): Alias {
		currentAlias = alias;
		return currentAlias;
	}

	public function hasValidSession(): Bool {
		//TODO //IMPLEMENT ME
		ui.AgentUi.LOGGER.warn("implement User.hasValidSession");
		return true;
	}
}

class Alias extends ModelObj<Alias> {
	@:optional public var imgSrc: String;
	public var label: String;
	public var labels: ObservableSet<Label>;
	public var connections: ObservableSet<Connection>;

	public function new () {}
}

interface Filterable {

}

class Label extends ModelObj<Connection>, implements Filterable {
	public var text: String;
	@:optional public var parentUid: String;

	@:transient public var color: String;

	public function new(?text: String) {
		this.text = text;
		color = ColorProvider.getNextColor();
	}
}

class Connection extends ModelObj<Connection>, implements Filterable {
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
	public var labels: ObservableSet<Label>;
	public var connections: ObservableSet<Connection>;
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

