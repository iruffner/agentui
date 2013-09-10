package ui.model;

import m3.exception.Exception;

using m3.helper.ArrayHelper;

class Filter {
	public var labelNodes: Array<Node>;
	public var connectionNodes: Array<Node>;
	public var rootNode: Node;

	public function new(node: Node) {
		this.rootNode = node;
		connectionNodes = new Array<Node>();
		labelNodes = new Array<Node>();
		if(node.hasChildren()) {
			for(ch_ in 0...node.nodes.length) {
				if(node.nodes[ch_].type == "CONNECTION") {
					connectionNodes.push(node.nodes[ch_]);
				} else if(node.nodes[ch_].type == "LABEL") {
					labelNodes.push(node.nodes[ch_]);
				} else {
					throw new Exception("dont know how to handle node of type " + node.nodes[ch_].type);
				}
			}
		}
	}

	public function kdbxify(): String {
		var queries: Array<String> = [this._kdbxify(labelNodes), _kdbxify(connectionNodes)];
		var query: String = queries.joinX(",");
		return query;
	}

	private function _kdbxify(nodes: Array<Node>): String {
		var str: String = "";//this.rootNode.getKdbxName();
		if(nodes.hasValues()) {
			if(nodes.length > 1)
				str += "(";
			var iteration: Int = 0;
			for(ln_ in 0...nodes.length) {
				if(iteration++ > 0) str += ",";
				str += nodes[ln_].getKdbxName();
				if(nodes[ln_].hasChildren()) {
					str += _kdbxify(nodes[ln_].nodes);
				}
			}
			if(nodes.length > 1)
				str += ")";
		}
		return str;
	}
}