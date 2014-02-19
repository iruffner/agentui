package ui.model;

import m3.exception.Exception;

using m3.helper.ArrayHelper;
using m3.helper.StringHelper;

class Filter {
	public var rootNode: Node;
	public var nodes: Array<Node>;

	public function new(node: Node) {
		this.rootNode = node;
		nodes = new Array<Node>();
		if(node.hasChildren()) {
			for(childNode in node.nodes) {
				nodes.push(childNode);
			}
		}
	}

	public function getQuery(): String {
		return _queryify(nodes);
	}

	private function _queryify(nodes: Array<Node>, ?joinWith:String): String {
		if (joinWith == null) {
			joinWith = " OR ";
		}
		var str: String = "";
		if (nodes.hasValues()) {
			str += "(";
			var iteration: Int = 0;
			for(ln_ in 0...nodes.length) {
				if (iteration++ > 0) str += joinWith;
				str += nodes[ln_].getQuery();
				if(nodes[ln_].hasChildren()) {
					var jw:String = (nodes[ln_].type == "AND") ? " AND " : " OR ";
					str += _queryify(nodes[ln_].nodes, jw);
				}
			}
			str += ")";
		}
		return str;
	}
}