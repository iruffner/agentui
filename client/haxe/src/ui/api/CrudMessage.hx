package ui.api;

enum CrudVerb {
	create;
	update;
	delete;
}

class CrudMessage extends ProtocolMessage<CrudPayload>{
	public static function create(verb:CrudVerb, obj:Dynamic):CrudMessage {
		return new CrudMessage(verb, obj);
	}

	public function new(verb:CrudVerb, obj:Dynamic) {
		super(MsgType.crudMessage, CrudMessagePayload);
		this.contentImpl.verb   = verb;
		this.contentImpl.record = obj;
	}
}

class CrudMessagePayload extends PayloadWithSessionURI {
	public var verb:CrudVerb;
	public var record: Dynamic;
}