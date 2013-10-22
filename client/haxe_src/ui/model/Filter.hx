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

	public function toProlog(): String {
		var queries: Array<String> = [_prologify(labelNodes), _prologify(connectionNodes)];
		var query: String = queries.joinX(",");
		return query;
	}

	public function labelsProlog(): String {
		return rootNode.getProlog() + "(" + _prologify(labelNodes) + ")";
	}

	private function _prologify(nodes: Array<Node>): String {
		var str: String = "";
		if(nodes.hasValues()) {
			// if(nodes.length == 1) {
			// 	str += nodes[0].getProlog();
			// } else {

			// }
			if(nodes.length > 1)
				str += "(";
			var iteration: Int = 0;
			for(ln_ in 0...nodes.length) {
				if(iteration++ > 0) str += ",";
				str += nodes[ln_].getProlog();
				if(nodes[ln_].hasChildren()) {
					str += _prologify(nodes[ln_].nodes);
				}
			}
			if(nodes.length > 1)
				str += ")";
		}
		return str;
	}
}