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

@:rtti
class ChannelRequest {
	public var path:String;
	public var context:String;
	public var parms:CrudMessage;

	public function new(path:String, context:String, parms:CrudMessage):Void {
		this.path    = path;
		this.context = context;
		this.parms   = parms;
	}
}

@:rtti
class ChannelRequestMessage {

	private var channel:String;
	private var requests:Array<ChannelRequest>;

	public function new() {
		this.channel = AppContext.CHANNEL;
		this.requests = new Array<ChannelRequest>();		
	}

	public function addChannelRequest(request:ChannelRequest):Void {
		this.requests.push(request);
	}

	public function addRequest(path:String, context:String, parms:CrudMessage):Void {
		var request = new ChannelRequest(path, context, parms);
		this.addChannelRequest(request);
	}
}
