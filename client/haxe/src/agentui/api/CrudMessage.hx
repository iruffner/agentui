package agentui.api;

import qoid.model.ModelObj;

@:rtti
class VerificationRequestMessage  {
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
class VerificationResponseMessage  {
	public var notificationIid:String;
    public var verificationContent:String;

    public function new(vr:VerificationResponse) {
    	notificationIid = vr.notificationIid;
    	verificationContent = vr.verificationContent;
    }
}

@:rtti
class AcceptVerificationMessage  {
	public var notificationIid: String;

	public function new(notificationIid: String) {
		this.notificationIid = notificationIid;
	}
}

@:rtti
class IntroResponseMessage  {
	public var notificationIid: String;
	public var accepted: Bool;

	public function new(notificationIid: String, accepted: Bool) {
		this.notificationIid = notificationIid;
		this.accepted = accepted;
	}
}
