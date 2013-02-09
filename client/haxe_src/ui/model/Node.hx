package ui.model;

class Node {
	
}

class And extends Node {
	var nodes: Array<Node>;
}

class Or extends Node {
	var nodes: Array<Node>;
}

class Paren extends Node {
	var node: Node;
}

class ContentNode extends Node {
    var type: String;
	var contentUid: String;	
}
