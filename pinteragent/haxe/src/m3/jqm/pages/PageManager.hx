package m3.jqm.pages;

import m3.jq.JQ;
// import m3.jqm.JQMobile;
import m3.log.Logga;
import m3.exception.RedirectionException;

using Lambda;

class PageManager {
    public static var SCREEN_MAP: Map<String,Page> = new Map();

    public var CURRENT_PAGE(get,set): Page; 

    public function new() {}

    function get_CURRENT_PAGE(): Page {
        return getScreen(JQMobile.activePage.attr("id"));
    }
    function set_CURRENT_PAGE(page: Page): Page {
        Logga.DEFAULT.debug("set current page to " + page.nonCssId);
        if(page == CURRENT_PAGE) {
            Logga.DEFAULT.debug("already on page " + page.nonCssId);
        } else {
            JQMobile.changePage(page.id);
        }
        return page;
    }

	public function getScreen<T:(Page)>(id: String): T {
		if(id.charAt(0) != "#") id = "#" + id;
        return cast SCREEN_MAP.get(id);
	}

    public function getScreens(): Array<Page> {
        return SCREEN_MAP.array();
    }

	public function beforePageShow(evt: JQEvent): Void {
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
            JQMobile.changePage(err.location.id);
        } catch (err: Dynamic) {
            var page: String = {
                if(evt != null && evt.target != null)
                    new JQ(evt.target).attr("id");
                else "";
            }
            Logga.DEFAULT.error("Error showing page " + page, Logga.getExceptionInst(err));
        }
    };

    public function pageBeforeCreate(evt: JQEvent): Void {
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

    public function pageChange(evt: JQEvent, props: {options: Dynamic, toPage: JQ}): Void {
        try {
            if(props != null && props.toPage != null) {
                var id: String = props.toPage.attr("id");
                var page: Page = null;
                if( (page = getScreen(id)) != null) {
                    // AppContext.LOGGER.debug("pageChange " + id);
                    page.pageChange(props.toPage);
                }
            }
        } catch (err: Dynamic) {
            var page: String = {
                if(props != null && props.toPage != null)
                    props.toPage.attr("id");
                else "";
            }
            Logga.DEFAULT.error("Error showing page " + page, Logga.getExceptionInst(err));
        }
    }

    // public static dynamic function get(): PagesManager;
}