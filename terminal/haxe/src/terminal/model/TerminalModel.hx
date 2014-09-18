package terminal.model;

import m3.serialization.Serialization;
import qoid.model.ModelObj;
import terminal.TerminalContext;

class TerminalContentTypes {
    public static var AUDIT_LOG: ContentType = "AUDIT_LOG";
}

class AuditLogContentData extends ContentData {
    public var kind: String;
    public var route: Array<String>;
    public var messageData: Dynamic;
    public var success: Bool;
    @:optional public var errorCode: String;

    public function new() {
        super();
    }
}

class AuditLogContent extends Content<AuditLogContentData> {
    public function new() {
        super(TerminalContentTypes.AUDIT_LOG, AuditLogContentData);
    }
}

class TerminalContentHandler implements TypeHandler {
    
    public function new() {
    }

    public function read(fromJson: {contentType: String}, reader: JsonReader<Dynamic>, ?instance: Dynamic): Dynamic {
        var obj: Content<Dynamic> = null;

        try {
            switch (fromJson.contentType) {
                case TerminalContentTypes.AUDIT_LOG:
                    obj = Serializer.instance.fromJsonX(fromJson, AuditLogContent);
            }
        } catch (err: Dynamic) {
        }

        return obj;
    }

    public function write(value: Dynamic, writer: JsonWriter): Dynamic {
        return Serializer.instance.toJson(value);
    }
}