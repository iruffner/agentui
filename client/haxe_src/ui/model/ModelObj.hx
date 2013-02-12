package ui.model;

import ui.util.ColorProvider;
import ui.observable.OSet;

class ModelObj<T> implements haxe.rtti.Infos {
	public var uid: String;

	public static function identifier<T>(t: {uid: String}): String {
		return t.uid;
	}
}

class User extends ModelObj<User> {

}

interface Filterable {

}

class Label extends ModelObj<Connection>, implements Filterable {
	public var text: String;
	public var parentUid: String;

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