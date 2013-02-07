package ui.model;

import ui.util.ColorProvider;
import ui.observable.OSet;

class ModelObj<T> implements haxe.rtti.Infos {

}

class User extends ModelObj<User> {

}

interface Filterable {}

class Label extends ModelObj<Label>, implements Filterable {
	public var uid: String;
	public var text: String;
	public var parentUid: String;

	@:transient public var color: String;

	public function new(?text: String) {
		this.text = text;
		color = ColorProvider.getNextColor();
	}

	public static function identifier(label: Label): String {
		return label.uid;
	}
}

class Connection extends ModelObj<Connection>, implements Filterable {
	public var uid: String;
	public var fname: String;
	public var lname: String;
	public var imgSrc: String;

	public function new(?fname: String, ?lname: String, ?imgSrc: String) {
		this.fname = fname;
		this.lname = lname;
		this.imgSrc = imgSrc;
	}

	public static function identifier(conn: Connection): String {
		return conn.uid;
	}
}

class Content extends ModelObj<Content> {
	public var uid: String;
	public var type: String;
	public var labels: ObservableSet<Label>;
	public var connections: ObservableSet<Connection>;

	public static function identifier(cont: Content): String {
		return cont.uid;
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