package m3.comm;

class ChannelRequest {}

@:rtti
class ChannelRequestMessage {
	private var path:String;
	private var context:String;
	private var parms:Dynamic;

	public function new(path:String, context:String, parms:Dynamic):Void {
		this.path    = path;
		this.context = context;
		this.parms   = parms;
	}
}

@:rtti
class ChannelRequestMessageBundle {

	private var channel:String;
	private var requests:Array<ChannelRequestMessage>;

	public function new(?requests_:Array<ChannelRequestMessage>, channel: String) {
		this.channel = channel;
		if (requests_ == null) {
			this.requests = new Array<ChannelRequestMessage>();
		} else {
			this.requests = requests_;
		}
	}

	public function addChannelRequest(request:ChannelRequestMessage):Void {
		this.requests.push(request);
	}

	public function addRequest(path:String, context:String, parms:Dynamic):Void {
		var request = new ChannelRequestMessage(path, context, parms);
		this.addChannelRequest(request);
	}
}