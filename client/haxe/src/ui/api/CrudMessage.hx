package ui.api;

import ui.model.ModelObj;
using m3.serialization.TypeTools;

@:rtti
class BennuMessage {
	public var type:String;

	public function new(type:String) {
		this.type = type;
	}
}

class DeleteMessage extends BennuMessage {
	private var primaryKey: String;

	public function new(type:String, primaryKey: String) {
		super(type);
		this.primaryKey = primaryKey;		
	}

	public static function create(object:ModelObjWithIid):DeleteMessage {
		return new DeleteMessage(object.objectType(), object.iid);
	}
}

class CrudMessage extends BennuMessage {
	private var instance: Dynamic;

	public function new(type:String, instance: Dynamic) {
		super(type);
		this.instance = instance;		
	}

	public static function create(object:ModelObjWithIid):CrudMessage {
		var instance = AppContext.SERIALIZER.toJson(object);
		return new CrudMessage(object.objectType(), instance);
	}
}

class QueryMessage extends BennuMessage {
	private var q:String;

	public function new(type:String, q:String="1=1") {
		super(type);
		this.q = q;		
	}
}

@:rtti
class ChannelRequestMessage {
	private var path:String;
	private var context:String;
	private var parms:Dynamic;

	public function new(path:String, context:String, msg:BennuMessage):Void {
		this.path    = path;
		this.context = context;
		this.parms   = AppContext.SERIALIZER.toJson(msg);
	}
}

@:rtti
class ChannelRequestMessageBundle {

	private var agentId:String;
	private var channel:String;
	private var requests:Array<ChannelRequestMessage>;

	public function new(?requests_:Array<ChannelRequestMessage>) {
		this.agentId = AppContext.AGENT.iid;
		this.channel = AppContext.CHANNEL;
		if (requests_ == null) {
			this.requests = new Array<ChannelRequestMessage>();
		} else {
			this.requests = requests_;
		}
	}

	public function addChannelRequest(request:ChannelRequestMessage):Void {
		this.requests.push(request);
	}

	public function addRequest(path:String, context:String, parms:BennuMessage):Void {
		var request = new ChannelRequestMessage(path, context, parms);
		this.addChannelRequest(request);
	}
}

@:rtti
class RegisterChannelListenerData {
	public var types: Array<String>;
	public var handle:String;
	public var agentId:String;
	public var channelId:String;

	public function new(types:Array<String>, handle:String, ?agentId:String, ?channelId:String) {
		this.types = types;
		this.handle = handle;
		this.agentId = (agentId == null) ? ui.AppContext.AGENT.iid : agentId;
		this.channelId = (channelId == null) ? AppContext.CHANNEL : channelId;
	}
}

class DeregisterChannelListenerData {
	public var handle:String;
	public function new(handle:String) {
		this.handle = handle;
	}
}