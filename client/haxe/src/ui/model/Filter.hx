package ui.model;

import m3.exception.Exception;
import m3.observable.OSet;
import ui.model.ModelObj;

using m3.helper.ArrayHelper;
using m3.helper.StringHelper;

class Filter {
	private var rootNode: Node;
	private var nodes: Array<Node>;
	public var q:String;

	public function new(node: Node) {
		this.rootNode = node;
		nodes = new Array<Node>();
		if(node.hasChildren()) {
			for(childNode in node.nodes) {
				nodes.push(childNode);
			}
		}
		this.q = getQuery();
	}

	private function getQuery(): String {
		return _queryify(nodes, rootNode.getQuery());
	}

	private function _queryify(nodes: Array<Node>, joinWith:String): String {
		var str: String = "";
		if (nodes.hasValues()) {
			str += "(";
			var iteration: Int = 0;
			for(ln_ in 0...nodes.length) {
				if (iteration++ > 0) str += joinWith;
				str += nodes[ln_].getQuery();
				if(nodes[ln_].hasChildren()) {
					str += _queryify(nodes[ln_].nodes, nodes[ln_].getQuery());
				}
			}
			str += ")";
		}
		return str;
	}
}

class FilterData {
	public var type:String;
	public var filter:Filter;
	public var connectionIids:Array<String>;
	public var aliasIid:String;

	public function new(type:String) {
		this.type = type;
		this.aliasIid = null;
		this.connectionIids = new Array<String>();
	}
}

class FilterResponse {
	public var filterIid:String;
	public var content: ObservableSet<Content<Dynamic>>;
	public function new(filterIid:String, content: ObservableSet<Content<Dynamic>>) {
		this.filterIid = filterIid;
		this.content   = content;
	}
}