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

@:rtti
class CrudMessage extends BennuMessage {
	public var instance: Dynamic;

	public function new(type:String, instance: Dynamic) {
		super(type);
		this.instance = instance;		
	}

	public static function create(object:ModelObj):CrudMessage {
		var instance = AppContext.SERIALIZER.toJson(object);
		return new CrudMessage(object.objectType(), instance);
	}
}

@:rtti
class QueryMessage extends BennuMessage {
	public var q:String;

	public function new(type:String, q: String) {
		super(type);
		this.q = q;		
	}
}

@:rtti
class ChannelRequestMessage {
	public var path:String;
	public var context:String;
	public var parms:BennuMessage;

	public function new(path:String, context:String, parms:BennuMessage):Void {
		this.path    = path;
		this.context = context;
		this.parms   = parms;
	}
}

@:rtti
class ChannelRequestMessageBundle {

	private var channel:String;
	private var requests:Array<ChannelRequestMessage>;

	public function new(?requests_:Array<ChannelRequestMessage>) {
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
