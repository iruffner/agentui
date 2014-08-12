package qoid.api;

import qoid.model.Filter;
import qoid.model.ModelObj;
using m3.serialization.TypeTools;

@:rtti
interface ChannelMessage {
}

@:rtti
class BennuMessage implements ChannelMessage {
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
	@:optional private var parentIid: String;
	@:optional private var profileName: String;
	@:optional private var profileImgSrc: String;
	@:optional private var labelIids: Array<String>;

	public function new(type:String, instance: Dynamic, ?optionals:Dynamic) {
		super(type);
		this.instance = instance;
		if (optionals != null) {
			parentIid = optionals.parentIid;
			profileName = optionals.profileName;
			profileImgSrc = optionals.profileImgSrc;
			labelIids = optionals.labelIids;
		}
	}

	public static function create(object:ModelObjWithIid, ?optionals:Dynamic):CrudMessage {
		var instance = AppContext.SERIALIZER.toJson(object);
		return new CrudMessage(object.objectType(), instance, optionals);
	}
}

@:rtti
class DeregisterMessage implements ChannelMessage {
	public var handle:String;
	public function new(handle:String) {
		this.handle = handle;
	}
}


@:rtti
class IntroMessage implements ChannelMessage {
	public var aConnectionIid: String;
	public var aMessage: String;
	public var bConnectionIid: String;
	public var bMessage: String;
	public function new(i:IntroductionRequest) {
		this.aConnectionIid = i.aConnectionIid;
		this.aMessage = i.aMessage;
		this.bConnectionIid = i.bConnectionIid;
		this.bMessage = i.bMessage;
	}
}

@:rtti
class VerificationRequestMessage implements ChannelMessage {
    public var contentIid:String;
    public var connectionIids:Array<String>;
    public var message:String;

    public function new(vr:VerificationRequest) {
    	contentIid = vr.contentIid;
    	connectionIids = vr.connectionIids;
    	message = vr.message;
    }
}

@:rtti
class VerificationResponseMessage implements ChannelMessage {
	public var notificationIid:String;
    public var verificationContent:String;

    public function new(vr:VerificationResponse) {
    	notificationIid = vr.notificationIid;
    	verificationContent = vr.verificationContent;
    }
}

@:rtti
class AcceptVerificationMessage implements ChannelMessage {
	public var notificationIid: String;

	public function new(notificationIid: String) {
		this.notificationIid = notificationIid;
	}
}

@:rtti
class IntroResponseMessage implements ChannelMessage {
	public var notificationIid: String;
	public var accepted: Bool;

	public function new(notificationIid: String, accepted: Bool) {
		this.notificationIid = notificationIid;
		this.accepted = accepted;
	}
}

@:rtti
class QueryMessage implements ChannelMessage{
	public var type: String;
	public var q: String;
	public var aliasIid: String;
	public var connectionIids: Array<String>;
	public var standing: Bool;
	public var historical: Bool;
	public var local: Bool;

	public function new(fd:FilterData, ?type:String, ?q:String) {
		if (fd == null) {
			this.type = type;
			this.q = q;
			this.aliasIid  = null;
			connectionIids = new Array<String>();
			local      = true;
		} else {
			this.type           = fd.type;
			this.q              = fd.filter.q;
			this.aliasIid       = fd.aliasIid;
			this.connectionIids = fd.connectionIids;
			local               = fd.aliasIid != null;
		}
		historical = true;
		standing   = true;
	}

	public static function create(type:String):QueryMessage {
		return new QueryMessage(null, type, "1=1");
	}
}

@:rtti
class ChannelRequestMessage {
	private var path:String;
	private var context:String;
	private var parms:Dynamic;

	public function new(path:String, context:String, msg:ChannelMessage):Void {
		this.path    = path;
		this.context = context;
		this.parms   = AppContext.SERIALIZER.toJson(msg);
	}
}

@:rtti
class ChannelRequestMessageBundle {

	private var channel:String;
	private var requests:Array<ChannelRequestMessage>;

	public function new(?requests_:Array<ChannelRequestMessage>) {
		this.channel = AppContext.SUBMIT_CHANNEL;
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
