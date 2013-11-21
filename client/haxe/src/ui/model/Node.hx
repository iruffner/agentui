package ui.model;

import ui.model.ModelObj;
import m3.exception.Exception;

import ui.helper.PrologHelper;
import m3.observable.OSet.ObservableSet;

using m3.helper.ArrayHelper;
using m3.helper.StringHelper;

class Node {
	public var nodes: Array<Node>;
	public var type: String = "ROOT";

	public function addNode(n: Node) {
		this.nodes.push(n);
	}

	public function hasChildren(): Bool {
		return this.nodes.hasValues(); //this.connectionNodes.hasValues() || this.labelNodes.hasValues();
	}

	public function getProlog(): String {
		throw new Exception("override me");
		return null;
	}
}

class And extends Node {
	public function new() {
		nodes = new Array<Node>();
	}

	override public function getProlog(): String {
		return "all";
	}
}

class Or extends Node {
	public function new() {
		nodes = new Array<Node>();
	}

	override public function getProlog(): String {
		return "any";
	}
}

class ContentNode<T> extends Node {
	public var content: T;

	public function new() {
	}

	override public function hasChildren(): Bool {
		return false;
	}
}

class LabelNode extends ContentNode<Label> {
	override public function getProlog(): String {
		return PrologHelper.labelsToProlog(new ObservableSet<Label>(Label.identifier, [this.content]));
	}
}

class ConnectionNode extends ContentNode<Connection> {
	override public function getProlog(): String {
		return PrologHelper.connectionsToProlog(new ObservableSet<Connection>(Connection.identifier, [this.content]));
	}
}
