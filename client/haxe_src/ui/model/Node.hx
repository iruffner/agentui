package ui.model;

import ui.model.ModelObj;
import ui.exception.Exception;

using ui.helper.ArrayHelper;
using ui.helper.StringHelper;

class Node {
	public var nodes: Array<Node>;

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
