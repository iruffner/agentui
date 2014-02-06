package ui.model;

import m3.util.ColorProvider;
import m3.util.UidGenerator;
import m3.observable.OSet;
import m3.serialization.Serialization;
import m3.exception.Exception;

import ui.helper.LabelStringParser;
import ui.model.EM;

using m3.serialization.TypeTools;
using m3.helper.ArrayHelper;
using m3.helper.OSetHelper;
using m3.helper.StringHelper;
import DateTools;
using StringTools;
using Lambda;

@:rtti
class ModelObj {

	public function new() {
	}

	public function objectType():String {
		var className = this.clazz().classname().toLowerCase();
		var parts = className.split(".");
		return parts[parts.length-1];
	}
}

class ModelObjWithIid extends ModelObj {
	// Added here for all models
	public var deleted:Bool;
	public var agentId: String;
	public var iid: String;

	public function new() {
		super();
		this.iid = UidGenerator.create(32);
		this.deleted = false;
		this.agentId = (AppContext.AGENT == null) ? null : AppContext.AGENT.iid;
	}

	public static function identifier(t: ModelObjWithIid): String {
		return t.iid;
	}
}

class Agent extends ModelObj {
	public var iid: String;
	public var agentId: String;
  	public var name: String;
  	public var data: UserData;
	public var deleted: Bool;

	@:transient public var currentAlias: Alias;

	public function new () {
		super();
		this.data = new UserData();
	}
}

class UserData extends ModelObj {
	public var name: String;
	@:optional public var imgSrc: String;
	@:optional public var isDefault:Bool;
	@:optional public var email:String;

	public function new(?name:String="", ?imgSrc:String="") {
		super();
		this.name = name;
		this.imgSrc = imgSrc;
		this.isDefault = false;
		this.email = "";
	}
}

class Alias extends ModelObjWithIid {
	public var rootLabelIid:String;
	public var name: String;
	public var data: UserData;

	public function new(?name:String) {
		super();
		this.name = name;
		this.data = new UserData();
	}
	
	public static function identifier(alias: Alias): String {
		return alias.iid;
	}
}

interface Filterable {
}

class LabelData extends ModelObj {
	public var color:String;
	public function new() {
		super();
		this.color = ColorProvider.getNextColor();
	}
}

class Label extends ModelObjWithIid implements Filterable {
	public var name: String;
	public var data: LabelData;
	@:transient public var labelChildren:OSet<LabelChild>;

	public function new(?name: String) {
		super();
		this.name = name;
		this.data = new LabelData();
	}

	public static function identifier(l: Label): String {
		return l.iid;
	}
}

class LabelChild extends ModelObjWithIid {
	public var parentIid: String;
	public var childIid: String;
	@:optional public var data: Dynamic;

	public static function identifier(l: LabelChild): String {
		return l.iid;
	}

	public function new(?parentIid: String, ?childIid: String) {
		if (parentIid != null && childIid != null && parentIid == childIid) {
			throw new Exception("parentIid and childIid of LabelChild must be different");
		}
		super();
		this.parentIid = parentIid;
		this.childIid  = childIid;
	}
}

class Connection extends ModelObjWithIid implements Filterable {

	public var url: String;
	public var data:UserData;

	public static function identifier(c: Connection): String {
		return c.iid;
	}

	public function new(?profile: UserData) {
		super();
	}

	public function equals(c: Connection): Bool {
		return this.iid == c.iid;
	}

	public function name():String {
		return data.name;
	}
}

class ContentHandler implements TypeHandler {
	
    public function new() {
    }

    public function read(fromJson: {contentType: String}, reader: JsonReader<Dynamic>, ?instance: Dynamic): Dynamic {
        var obj: Content<Dynamic> = null;

        switch ( ContentType.createByName(fromJson.contentType) ) {
        	case ContentType.AUDIO:
        		obj = AppContext.SERIALIZER.fromJsonX(fromJson, AudioContent);
        	case ContentType.IMAGE:
        		obj = AppContext.SERIALIZER.fromJsonX(fromJson, ImageContent);
        	case ContentType.TEXT:
        		obj = AppContext.SERIALIZER.fromJsonX(fromJson, MessageContent);
        	case ContentType.URL:
        		obj = AppContext.SERIALIZER.fromJsonX(fromJson, UrlContent);
        }

        return obj;
    }

    public function write(value: Dynamic, writer: JsonWriter): Dynamic {
        return AppContext.SERIALIZER.toJson(value);
    }
}

class ContentFactory {
	public static function create(contentType:ContentType, data:Dynamic):Content<Dynamic> {
		var ret:Content<Dynamic> = null;

		switch (contentType) {
        	case ContentType.AUDIO:
        		var ac = new AudioContent();
        		ac.props.audioSrc = cast(data, String);
        		ret = ac;
        	case ContentType.IMAGE:
        		var ic = new ImageContent();
        		ic.props.imgSrc = cast(data, String);
        		ret = ic;
        	case ContentType.TEXT:
        		var mc = new MessageContent();
        		mc.props.text = cast(data, String);
        		ret = mc;
        	case ContentType.URL:
        		var uc = new UrlContent();
        		uc.props.url = cast(data, String);
        		ret = uc;
        }
        return ret;
	}
}

class LabeledContent extends ModelObjWithIid {
  	public var contentIid: String;
  	public var labelIid: String;
	@:optional public var data: Dynamic;

	public static function identifier(l: LabeledContent): String {
		return l.iid;
	}

	public function new(contentIid: String, labelIid: String) {
		super();
		this.contentIid = contentIid;
		this.labelIid  = labelIid;
	}
}

@:rtti
class ContentData {
	public var created: Date;
	public var modified: Date;

	public function new() {
		this.created  = Date.now();
		this.modified = Date.now();		
	}
}

class Content<T:(ContentData)> extends ModelObjWithIid {
	public var contentType: ContentType;
	public var aliasIid: String;

	private var data:Dynamic;
	@:transient public var props: T;

	@:transient @:isVar public var created(get, null): Date;
	@:transient @:isVar public var modified(get, null): Date;
	@:transient var type: Class<T>;

	public function new (contentType:ContentType, type: Class<T>) {
		super();
		this.contentType = contentType;
		this.aliasIid = (AppContext.alias == null) ? null : AppContext.alias.iid;
		this.data = {};
		this.type = type;
		this.props = Type.createInstance(type, []);
	}

	public function get_created():Date {
		return props.created;
	}

	public function get_modified():Date {
		return props.modified;
	}

	// For testing only	
	public function setData(data:Dynamic) {
		this.data = data;
	}

	private function readResolve(): Void {
		this.props = AppContext.SERIALIZER.fromJsonX(this.data, this.type);
	}

	private function writeResolve(): Void {
		this.data = AppContext.SERIALIZER.toJson(this.props);
	}

	public function getTimestamp(): String {
		return DateTools.format(this.created, "%Y-%m-%d %T");
	}

	override public function objectType():String {
		return "content";
	}
}

class ImageContentData extends ContentData {
	public var imgSrc: String;
	@:optional public var caption: String;

	public function new() {
		super();
	}
}

class ImageContent extends Content<ImageContentData> {
	public function new () {
		super(ContentType.IMAGE, ImageContentData);
	}
}

class AudioContentData extends ContentData {
	public var audioSrc: String;
	@:optional public var audioType: String;
	@:optional public var title: String;

	public function new () {
		super();
	}
}

class AudioContent extends Content<AudioContentData> {
	public function new () {
		super(ContentType.AUDIO, AudioContentData);
	}
}

class MessageContentData extends ContentData {
	public var text: String;

	public function new () {
		super();
	}
}

class MessageContent extends Content<MessageContentData> {
	public function new () {
		super(ContentType.TEXT, MessageContentData);
	}
}

class UrlContentData extends ContentData {
	public var url: String;
	@:optional public var text: String;

	public function new () {
		super();
	}	
}

class UrlContent extends Content<UrlContentData> {
	public function new () {
		super(ContentType.URL, UrlContentData);
	}
}

enum ContentType {
	AUDIO;
	IMAGE;
	URL;
	TEXT;
}

class Login extends ModelObj {
	public function new () {
		super();
	}
	public var agentId:String;
	public var password: String;
}

class NewUser extends ModelObj {
	public var name: String;
	public var userName: String;
	public var email: String;
	public var pwd: String;

	public function new () {
		super();
	}
}

class Introduction extends ModelObj {
	public var aConn: Connection;
	public var bConn: Connection;

	public var aMsg: String;
	public var bMsg: String;
}

class IntroductionConfirmation extends ModelObj {
	public var accepted: Bool;
	public var introSessionId: String;
	public var correlationId: String;

	public function new(accepted:Bool, introSessionId:String, correlationId:String) {
		super();
		this.accepted       = accepted;
		this.introSessionId = introSessionId;
		this.correlationId  = correlationId;
	}
}

//-------------------------------------------------------------------
// Classes used to copy data around

class EditLabelData {
	public var label:Label;
	public var parentIid:String;
	public var newParentId:String;

	public function new(label:Label, ?parentIid:String, ?newParentId) {
		this.label = label;
		this.parentIid = parentIid;
		this.newParentId = newParentId;
	}
}

class EditContentData {
	public var content:Content<Dynamic>;
	public var labels:Array<Label>;

	public function new(content:Content<Dynamic>, ?labels:Array<Label>) {
		this.content = content;
		if (labels == null) {
			labels = new Array<Label>();
		}
		this.labels = labels;
	}
}