package pagent;

import m3.jq.JQ;
import m3.log.Logga;
import m3.log.LogLevel;
import m3.serialization.Serialization;
import m3.util.HotKeyManager;

import pagent.PinterContext;
import pagent.api.ProtocolHandler;
import pagent.pages.PinterPageMgr;
import pagent.model.EM;
import pagent.widget.DialogManager;
import qoid.model.ModelObj;

using m3.helper.ArrayHelper;
using Lambda;

@:expose
class PinterAgent {
    
    public static var PROTOCOL: ProtocolHandler;
    public static var HOT_KEY_ACTIONS: HotKeyManager;

	public static function main() {
        PinterContext.init();

        PROTOCOL = new ProtocolHandler();
        HOT_KEY_ACTIONS = HotKeyManager.get;
    }

    public static function start(): Void {
        PinterContext.PAGE_MGR.setBackButton(new JQ("#navBackButton").button(
                {
                    icons: {
                        primary: "ui-icon-arrowthick-1-w"
                      }
                }
            )
        );

        PinterContext.PAGE_MGR.initClientPages();
        
        var document: JQ = new JQ(js.Browser.document);
        document.bind("pagebeforeshow", PinterContext.PAGE_MGR.beforePageShow);
        document.bind("pagebeforecreate", PinterContext.PAGE_MGR.pageBeforeCreate);
        document.bind("pageshow", PinterContext.PAGE_MGR.pageShow);
        document.bind("pagehide", PinterContext.PAGE_MGR.pageHide);
        
        PinterContext.PAGE_MGR.CURRENT_PAGE = PinterPageMgr.HOME_SCREEN;
        // EM.change(EMEvent.APP_INITIALIZED);

        new JQ("body").click(function(evt: JQEvent): Void {
            new JQ(".nonmodalPopup").hide();
        });

        DialogManager.showLogin();
    }

    // public static function showPopup(divContent: JQ, ?title: String = "", ?afterclose:JQEvent->Void): Void {
    //     MESSAGE_POPUP.show();
    //     new JQ(".ui-title", MESSAGE_POPUP)
    //         .empty()
    //         .append(title);
    //     new JQ(".popup-content", MESSAGE_POPUP)
    //         .empty()
    //         .append(divContent);
    //     MESSAGE_POPUP.unbind("popupafterclose");
    //     MESSAGE_POPUP.bind("popupafterclose", afterclose);
    //     MESSAGE_POPUP.trigger("create");
    //     MESSAGE_POPUP.popup("open", {positionTo: "window"});
    // }

    // public static function hidePopup(): Void {
    //     MESSAGE_POPUP.popup("close");
    // }

    // public static function showMessagePopup(msg: String, ?title: String = "", ?afterclose:JQEvent->Void): Void {
    //     showPopup(new JQ("<p>" + msg + "</p>"), title, afterclose);
    // }

    // public static function showOkCancelPopup(divContent: JQ, title: String, okBtnText: String, okAction: Void->Void, cancelAction: Void->Void, ?validate: Void->String): Void {
    //     OK_CANCEL_POPUP.show();
    //     new JQ(".ui-title", OK_CANCEL_POPUP)
    //         .empty()
    //         .append(title);
    //     new JQ(".popup-content", OK_CANCEL_POPUP)
    //         .empty()
    //         .append(divContent);
    //     var btn: JQ = new JQ("#okBtn", OK_CANCEL_POPUP)
    //         .unbind("click")
    //         .click(function(evt: JQEvent) {
    //                 var vMsg: String = null;
    //                 if(validate == null || (vMsg = validate()).isBlank() ) {
    //                     OK_CANCEL_POPUP.popup("close");
    //                     okAction();
    //                 } else {
    //                     divContent.prepend("<div class='error'>" + vMsg + "</div>");
    //                 }
    //             });
    //     var cancelBtn: JQ = new JQ("#cancelBtn", OK_CANCEL_POPUP)
    //         .unbind("click")
    //         .click(function(evt: JQEvent) {
    //                 if(cancelAction != null) cancelAction();
    //             });
    //     var btnText: JQ = new JQ(".ui-btn-text", btn);
    //     if(btnText.exists()) {
    //         btnText.text(okBtnText);
    //     } else {
    //         btn.text(okBtnText);   
    //     }
    //     OK_CANCEL_POPUP.trigger("create");
    //     OK_CANCEL_POPUP.popup("open");
    // }


}

class PinterContentHandler implements TypeHandler {
    
    public function new() {
    }

    public function read(fromJson: {contentType: String}, reader: JsonReader<Dynamic>, ?instance: Dynamic): Dynamic {
        var obj: Content<Dynamic> = null;

        try {
            switch ( fromJson.contentType ) {
                case ContentType.AUDIO:
                    obj = AppContext.SERIALIZER.fromJsonX(fromJson, AudioContent);
                case ContentType.IMAGE:
                    obj = AppContext.SERIALIZER.fromJsonX(fromJson, ImageContent);
                case ContentType.URL:
                    obj = AppContext.SERIALIZER.fromJsonX(fromJson, UrlContent);
                case ContentType.VERIFICATION:
                    obj = AppContext.SERIALIZER.fromJsonX(fromJson, VerificationContent);
                case ContentType.TEXT:
                    obj = AppContext.SERIALIZER.fromJsonX(fromJson, MessageContent);
                case ContentType.CONFIG:
                    obj = AppContext.SERIALIZER.fromJsonX(fromJson, ConfigContent);
            }
        } catch (err: Dynamic) {
            fromJson.contentType = ContentType.TEXT;
            obj = AppContext.SERIALIZER.fromJsonX(fromJson, MessageContent);
        }

        return obj;
    }

    public function write(value: Dynamic, writer: JsonWriter): Dynamic {
        return AppContext.SERIALIZER.toJson(value);
    }
}