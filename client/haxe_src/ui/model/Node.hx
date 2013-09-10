package ui.model;

import ui.model.ModelObj;
import m3.exception.Exception;

using m3.helper.ArrayHelper;
using m3.helper.StringHelper;

class Node {
	public var nodes: Array<Node>;
	public var type: String = "ROOT";

	public function log(): Void {
		var msg = _log();
		ui.AgentUi.LOGGER.debug("===================");
		ui.AgentUi.LOGGER.debug(msg);
		ui.AgentUi.LOGGER.debug("===================");
	}

	function _log(?depth: Int = 0): String {
		var str = "\n" + getPrintName().indentLeft(depth * 5, " ");
		if(nodes.hasValues()) {
			for(n_ in 0...nodes.length) {
				str += nodes[n_]._log(depth + 1);
			}
		}
		return str;
	}

	public function addNode(n: Node) {
	// 	if(n.type == "CONNECTION") {
	// 		connectionNodes.push(n);
	// 	} else if(n.type == "LABEL") {
	// 		labelNodes.push(n);
	// 	} else {
	// 		throw new Exception("dont know how to handle node of type " + n.type);
	// 	}
		this.nodes.push(n);
	}

	public function hasChildren(): Bool {
		return this.nodes.hasValues(); //this.connectionNodes.hasValues() || this.labelNodes.hasValues();
	}

	public function getPrintName(): String {
		throw new Exception("override me");
		return null;
	}

	public function getKdbxName(): String {
		throw new Exception("override me");
		return null;
	}
}

class And extends Node {
	public function new() {
		nodes = new Array<Node>();
	}

	override public function getPrintName(): String {
		return "AND (" + type + " )";
	}

	override public function getKdbxName(): String {
		return "all";
	}
}

class Or extends Node {
	public function new() {
		nodes = new Array<Node>();
	}

	override public function getPrintName(): String {
		return "OR (" + type + " )";
	}

	override public function getKdbxName(): String {
		return "any";
	}
}

class ContentNode extends Node {
	public var contentUid: String;
	public var filterable: Filterable;

	public function new() {
	}

	override public function hasChildren(): Bool {
		return false;
	}

	override public function getPrintName(): String {
		return "CONTENT(" + type + " | " + contentUid + ")";
	}

	override public function getKdbxName(): String {
		return contentUid;
	}
}
