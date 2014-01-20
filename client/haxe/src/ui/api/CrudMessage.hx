package ui.api;

import ui.model.ModelObj;
using m3.serialization.TypeTools;

@:rtti
class CrudMessage {
	public var type:String;
	public var instance: Dynamic;

	public function new(type:String, instance: Dynamic) {
		this.type = type;
		this.instance = instance;		
	}
}

@:rtti
class QueryMessage {
	public var type:String;
	public var q:String;

	public function new(type:String, q: String) {
		this.type = type;
		this.q = q;		
	}
}
