package ap;

import m3.jq.JQ;
import m3.log.Logga;
import m3.log.LogLevel;
import m3.serialization.Serialization;
import m3.util.HotKeyManager;

import ap.APhotoContext;
import ap.api.ProtocolHandler;
import ap.pages.APhotoPageMgr;
import qoid.model.EM;
import ap.widget.DialogManager;

using m3.helper.ArrayHelper;
using Lambda;

@:expose
class APhoto {
    
    public static var PROTOCOL: ProtocolHandler;
    public static var HOT_KEY_ACTIONS: HotKeyManager;

	public static function main() {
        APhotoContext.init();

        PROTOCOL = new ProtocolHandler();
        HOT_KEY_ACTIONS = HotKeyManager.get;
    }

    public static function start(): Void {
        APhotoContext.PAGE_MGR.setBackButton(new JQ("#navBackButton").button(
                {
                    icons: {
                        primary: "ui-icon-arrowthick-1-w"
                      }
                }
            )
        );

        APhotoContext.PAGE_MGR.initClientPages();
        
        var document: JQ = new JQ(js.Browser.document);
        document.bind("pagebeforeshow", APhotoContext.PAGE_MGR.beforePageShow);
        document.bind("pagebeforecreate", APhotoContext.PAGE_MGR.pageBeforeCreate);
        document.bind("pageshow", APhotoContext.PAGE_MGR.pageShow);
        document.bind("pagehide", APhotoContext.PAGE_MGR.pageHide);
        
        APhotoContext.PAGE_MGR.CURRENT_PAGE = APhotoPageMgr.HOME_SCREEN;
        EM.change(EMEvent.APP_INITIALIZED);

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
