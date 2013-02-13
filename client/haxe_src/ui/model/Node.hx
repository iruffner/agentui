package ui.model;

import ui.model.ModelObj;
import ui.exception.Exception;

class Node {
	public var nodes: Array<Node>;

	public function getPrintName(): String {
		throw new Exception("override me");
		return null;
	}
}

class And extends Node {
	public function new() {
		nodes = new Array<Node>();
	}

	override public function getPrintName(): String {
		return "AND";
	}
}

class Or extends Node {
	public function new() {
		nodes = new Array<Node>();
	}

	override public function getPrintName(): String {
		return "OR";
	}
}

class ContentNode extends Node {
    public var type: String;
	public var contentUid: String;
	public var filterable: Filterable;

	public function new() {
	}

	override public function getPrintName(): String {
		return "CONTENT(" + type + " | " + contentUid + ")";
	}
}
