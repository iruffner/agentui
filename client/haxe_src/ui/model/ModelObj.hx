package ui.model;

import ui.util.ColorProvider;

class ModelObj<T> implements haxe.rtti.Infos {

}

class User extends ModelObj<User> {

}

class Label extends ModelObj<Label> {
	public var uid: String;
	public var text: String;
	public var parentUid: String;

	@:transient public var color: String;

	public function new(?text: String) {
		this.text = text;
		color = ColorProvider.getNextColor();
		App.LOGGER.debug("Color for " + text + " is " + color);
	}
}

class Connection extends ModelObj<Connection> {
	public var uid: String;
	public var fname: String;
	public var lname: String;
	public var imgSrc: String;

	public function new(?fname: String, ?lname: String, ?imgSrc: String) {
		this.fname = fname;
		this.lname = lname;
		this.imgSrc = imgSrc;
	}
}