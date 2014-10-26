package ap;

import ap.api.EventDelegate;
import ap.model.APhotoModel.APhotoContentTypes;
import ap.model.APhotoModel.ConfigContent;
import ap.pages.APhotoPage;
import haxe.Timer;
import m3.jq.JQ;
import m3.log.Logga;
import m3.log.LogLevel;
import m3.serialization.Serialization;
import m3.util.HotKeyManager;
import qoid.QE;
import qoid.Qoid;


import ap.APhotoContext;
import ap.pages.APhotoPageMgr;
import ap.model.EM;
import ap.widget.DialogManager;
import qoid.model.ModelObj;

using m3.helper.ArrayHelper;
using Lambda;

@:expose
class APhoto {
    
    public static var HOT_KEY_ACTIONS: HotKeyManager;

	public static function main() {
        EventDelegate.init();
        APhotoContext.init();

        EM.addListener(qoid.QE.onAliasLoaded, function(a:Alias) {
            Logga.DEFAULT.debug("loaded alias " + a.iid + "(" + a.objectId + ") | currentAlias " + (Qoid.currentAlias != null? Qoid.currentAlias.iid:null));
            if(Qoid.currentAlias != null && Qoid.currentAlias.iid == a.iid) {
                js.Browser.document.title = a.profile.name + " | aPhoto"; 
            }
        },"APhoto-AliasLoaded");

        HOT_KEY_ACTIONS = HotKeyManager.get;
    }

    public static function start(): Void {
        new JQ("#navHomeButton").button(
                {
                    icons: {
                        primary: "ui-icon-home"
                      }
                }
            )
            .click(function() {
                    APhotoContext.PAGE_MGR.CURRENT_PAGE = APhotoPageMgr.HOME_SCREEN;
                });
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

        new JQ("body").click(function(): Void {
            new JQ(".nonmodalPopup").hide();
        });

        Timer.delay(function() {
                 DialogManager.showLogin();
            }, 100);
    }
}


class AphotoContentHandler implements TypeHandler {
    
    public function new() {
    }

    public function read(fromJson: {contentType: String}, reader: JsonReader<Dynamic>, ?instance: Dynamic): Dynamic {
        var obj: Content<Dynamic> = null;

        try {
            switch ( fromJson.contentType ) {
                case ContentTypes.AUDIO:
                    obj = Serializer.instance.fromJsonX(fromJson, AudioContent);
                case ContentTypes.IMAGE:
                    obj = Serializer.instance.fromJsonX(fromJson, ImageContent);
                case ContentTypes.URL:
                    obj = Serializer.instance.fromJsonX(fromJson, UrlContent);
                case ContentTypes.VERIFICATION:
                    obj = Serializer.instance.fromJsonX(fromJson, VerificationContent);
                case ContentTypes.TEXT:
                    obj = Serializer.instance.fromJsonX(fromJson, MessageContent);
                case APhotoContentTypes.CONFIG:
                    obj = Serializer.instance.fromJsonX(fromJson, ConfigContent);
            }
        } catch (err: Dynamic) {
            fromJson.contentType = ContentTypes.TEXT;
            obj = Serializer.instance.fromJsonX(fromJson, MessageContent);
        }

        return obj;
    }

    public function write(value: Dynamic, writer: JsonWriter): Dynamic {
        return Serializer.instance.toJson(value);
    }
}