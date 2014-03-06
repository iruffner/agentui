package ui.model;

import ui.model.ModelObj;
import m3.exception.Exception;

import m3.observable.OSet.ObservableSet;

using StringTools;
using m3.helper.ArrayHelper;
using m3.helper.StringHelper;

class Node {
	public var nodes: Array<Node>;
	public var type: String = "ROOT";

	public function new(?type:String) {
		if (type != null) {
			this.type = type;
		}
	}

	public function addNode(n: Node) {
		this.nodes.push(n);
	}

	public function hasChildren(): Bool {
		return this.nodes.hasValues();
	}

	public function getQuery(): String {
		return "";
	}
}

class And extends Node {
	public function new() {
		super("AND");
		nodes = new Array<Node>();
	}

	override public function getQuery(): String {
		return " AND ";
	}
}

class Or extends Node {
	public function new() {
		super("OR");
		nodes = new Array<Node>();
	}

	override public function getQuery(): String {
		return " OR ";
	}
}

class ContentNode<T> extends Node {
	public var content: T;

	public function new(type:String, content: T) {
		super(type);
		this.content = content;
	}

	override public function hasChildren(): Bool {
		return false;
	}
}

class LabelNode extends ContentNode<Label> {
	public var labelPath:Array<String>;

	public function new(label:Label, labelPath:Array<String>) {
		super("LABEL", label);
		this.labelPath = labelPath;
	}

	override public function getQuery(): String {
		var ret = "hasLabelPath(";
		for (i in 0...labelPath.length) {
			ret += "'" + labelPath[i].replace("'", "\\'") + "'";
			if (i < labelPath.length - 1) {
				ret += ",";
			}
		}
		ret += ")";
		return ret;
	}
}

class ConnectionNode extends ContentNode<Connection> {
	public function new(connection:Connection) {
		super("CONNECTION", connection);
	}

	override public function getQuery(): String {
		return "";
	}
}
