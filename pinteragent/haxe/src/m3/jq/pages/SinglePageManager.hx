package m3.jq.pages;

import js.html.Element;
import js.html.HtmlElement;
import m3.jq.JQ;
import m3.log.Logga;
import m3.exception.RedirectionException;

using Lambda;
using m3.helper.StringHelper;

class SinglePageManager {
    public static var SCREEN_MAP: Map<String,Page> = new Map();

    public var CURRENT_PAGE(get,set): Page; 

    public function new(isAppInitialized: Void->Bool, onAppInitialized: (Dynamic->Void)->Void) {
        this.isAppInitialized = isAppInitialized;
        // if(!this.isAppInitialized()) {
        //     onAppInitialized(function(d: {}) {
        //             CURRENT_PAGE.screen.trigger("pageshow");
        //             this.pageShow({
        //                         target: CURRENT_PAGE.screen[0]
        //                     });
        //         });
        // }
    }

    public var history: Array<Page> = new Array();
    var isAppInitialized: Void->Bool;

    var backBtn: JQ;

    function get_CURRENT_PAGE(): Page {
        return getScreen(new JQ(".activePage").attr("id"));
    }
    function set_CURRENT_PAGE(page: Page): Page {
        Logga.DEFAULT.debug("set current page to " + page.nonCssId);
        if(page == CURRENT_PAGE) {
            Logga.DEFAULT.debug("already on page " + page.nonCssId);
        } else {
            changePage(page, false);
        }
        return page;
    }

    function changePage(page: Page, isBack: Bool) {
        var currentPage: Page = CURRENT_PAGE;
        if(currentPage != null) {
            currentPage.screen.hide(0, function() {
                    currentPage.screen.trigger("pagehide");
                });
            currentPage.screen.removeClass("activePage");
            if(!isBack) {
                history.push(currentPage);
            }
        }
        page.screen.trigger("pagebeforeshow");
        page.screen.addClass("activePage");
        page.screen.show(0, function() {
                page.screen.trigger("pageshow");
            });
        if(this.backBtn != null) {
            if(history.empty()) this.backBtn.hide();
            else this.backBtn.show();
        }
    }

    public function setBackButton(backButton: JQ): Void {
        this.backBtn = backButton;
        this.backBtn.click(function(evt: JQEvent): Void {
                back();
            }
        );
    }

    public function back(): Void {
        if(!history.empty()) {
            var page: Page = history.pop();
            changePage(page, true);
            js.Browser.window.history.back();
        }
        if(this.backBtn != null) {
            //deselect it
        }
    }

	public function getScreen<T:(Page)>(id: String): T {
        if(id.isBlank()) return null;
		if(id.charAt(0) != "#") id = "#" + id;
        return cast SCREEN_MAP.get(id);
	}

    public function getScreens(): Array<Page> {
        return SCREEN_MAP.array();
    }

	public function beforePageShow(evt: {target: Element}): Void {
        try {
            if(evt != null && evt.target != null) {
                var target: JQ = new JQ(evt.target);
                var page: Page = null;
                if( (page = getScreen(target.attr("id"))) != null) {
                    page.pageBeforeShow(target);
                }
            }
        } catch (err: RedirectionException) {
            Logga.DEFAULT.error('Redirecting to ${err.location.id} because ${err.message}');
            changePage(getScreen(err.location.id), false);
        } catch (err: Dynamic) {
            var page: String = {
                if(evt != null && evt.target != null)
                    new JQ(evt.target).attr("id");
                else "";
            }
            Logga.DEFAULT.error("Error showing page " + page, Logga.getExceptionInst(err));
        }
    };

    public function pageBeforeCreate(evt: {target: Element}): Void {
        try {
            if(evt != null && evt.target != null) {
                var target: JQ = new JQ(evt.target);
                if(!target.exists()) {
                    js.Lib.alert("target page does not exist");
                }
                var page: Page = null;
                if( (page = getScreen(target.attr("id"))) != null) {
                    // AppContext.LOGGER.debug("pageBeforeCreate " + target.attr("id"));
                    page.pageBeforeCreate(target);
                }
            }
        } catch (err: Dynamic) {
            var page: String = {
                if(evt != null && evt.target != null)
                    new JQ(evt.target).attr("id");
                else "";
            }
            Logga.DEFAULT.error("Error showing page " + page, Logga.getExceptionInst(err));
        }
    }

    public function pageShow(evt: {target: Element}): Void {
        try {
            if(evt != null && evt.target != null) {
                var target: JQ = new JQ(evt.target);
                if(!target.exists()) {
                    js.Lib.alert("target page does not exist");
                }
                var page: Page = null;
                if( (page = getScreen(target.attr("id"))) != null) {
                    // AppContext.LOGGER.debug("pageBeforeCreate " + target.attr("id"));
                    page.pageShow(target);
                }
            }
        } catch (err: Dynamic) {
            var page: String = {
                if(evt != null && evt.target != null)
                    new JQ(evt.target).attr("id");
                else "";
            }
            Logga.DEFAULT.error("Error showing page " + page, Logga.getExceptionInst(err));
        }
    }

    public function pageHide(evt: {target: Element}): Void {
        try {
            if(evt != null && evt.target != null) {
                var target: JQ = new JQ(evt.target);
                if(!target.exists()) {
                    js.Lib.alert("target page does not exist");
                }
                var page: Page = null;
                if( (page = getScreen(target.attr("id"))) != null) {
                    // AppContext.LOGGER.debug("pageBeforeCreate " + target.attr("id"));
                    page.pageHide(target);
                }
            }
        } catch (err: Dynamic) {
            var page: String = {
                if(evt != null && evt.target != null)
                    new JQ(evt.target).attr("id");
                else "";
            }
            Logga.DEFAULT.error("Error hiding page " + page, Logga.getExceptionInst(err));
        }
    }
}