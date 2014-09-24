package pagent;

import m3.jq.JQ;
import m3.log.Logga;
import m3.log.LogLevel;
import m3.serialization.Serialization;
import m3.util.HotKeyManager;

import pagent.api.EventDelegate;
import pagent.PinterContext;
import pagent.pages.PinterPageMgr;
import pagent.model.EM;
import pagent.widget.DialogManager;
import pagent.model.PinterModel;
import pagent.widget.UserBar;
import qoid.model.ModelObj;
import qoid.QE;
import qoid.Qoid;

using m3.helper.ArrayHelper;
using Lambda;

@:expose
class PinterAgent {
    
    public static var HOT_KEY_ACTIONS: HotKeyManager;

	public static function main() {
        EventDelegate.init();
        PinterContext.init();

        EM.addListener(QE.onAliasLoaded, function(a:Alias) {
            Logga.DEFAULT.debug("loaded alias " + a.iid + "(" + a.objectId + ") | currentAlias " + (Qoid.currentAlias != null? Qoid.currentAlias.iid:null));
            if(Qoid.currentAlias != null && Qoid.currentAlias.iid == a.iid) {
                js.Browser.document.title = a.profile.name + " | Qoid-Bennu"; 
            }
        },"PinterAgent-AliasLoaded");

        EM.addListener(QE.onAliasUpdated, function(a:Alias) {
            Logga.DEFAULT.debug("updated alias " + a.iid + "(" + a.objectId + ") | currentAlias " + (Qoid.currentAlias != null? Qoid.currentAlias.iid:null));
            if(Qoid.currentAlias != null && Qoid.currentAlias.iid == a.iid) {
                js.Browser.document.title = a.profile.name + " | Qoid-Bennu";
            } 
        },"PinterAgent-AliasUpdated");

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
                    PinterContext.PAGE_MGR.CURRENT_PAGE = PinterPageMgr.SOCIAL_SCREEN;
                });

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
        
        // PinterContext.PAGE_MGR.CURRENT_PAGE = PinterPageMgr.HOME_SCREEN;
        PinterContext.PAGE_MGR.CURRENT_PAGE = PinterPageMgr.SOCIAL_SCREEN;

        new JQ("body").click(function(evt: JQEvent): Void {
            new JQ(".nonmodalPopup").hide();
        });

        new UserBar("#userBar").userBar();

        DialogManager.showLogin();
    }
}

class PinterContentHandler implements TypeHandler {
    
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
                case ContentTypes.TEXT:
                    obj = Serializer.instance.fromJsonX(fromJson, MessageContent);
                case ContentTypes.URL:
                    obj = Serializer.instance.fromJsonX(fromJson, UrlContent);
                case ContentTypes.VERIFICATION:
                    obj = Serializer.instance.fromJsonX(fromJson, VerificationContent);
                case PinterContentTypes.CONFIG:
                    obj = Serializer.instance.fromJsonX(fromJson, ConfigContent);
            }
        } catch (err: Dynamic) {
            fromJson.contentType = "TEXT";
            obj = Serializer.instance.fromJsonX(fromJson, MessageContent);
        }

        return obj;
    }

    public function write(value: Dynamic, writer: JsonWriter): Dynamic {
        return Serializer.instance.toJson(value);
    }
}