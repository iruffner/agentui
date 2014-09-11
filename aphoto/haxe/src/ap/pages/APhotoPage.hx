package ap.pages;

import m3.jq.JQ;
import m3.jq.pages.Page;
import m3.log.Logga;
import m3.util.JqueryUtil;

import ap.APhotoContext;
import ap.model.EM;

class APhotoPage extends Page {

	public function new(opts: PageOptions) {
        super(opts);

        this.pageBeforeShow = function(screen: JQ): Void {
            Logga.DEFAULT.debug("pageBeforeShow " + id);
            var justReloaded: Bool = false;
            var fcn = function() {
                // if(this.options.reqUser && AppContext.currentAlias == null) {
                    // Convo.POST_LOGIN_ACTIONS.push(function() {
                    //         AppContext.PAGE_MGR.CURRENT_PAGE = this;
                    //     });
                    // AppContext.PAGE_MGR.CURRENT_PAGE = ConvoPageMgr.LOGIN_SCREEN;
                // } else {
                    try{
                        this.options.pageBeforeShowFcn(screen);
                    } catch (err: Dynamic) {
                        Logga.DEFAULT.error("Error showing " + this.options.id, Logga.getExceptionInst(err));
                        JqueryUtil.alert("There was a problem showing this screen.", "Error");
                        return;
                    }
                // }
                justReloaded = false;
            }

            if(APhotoContext.APP_INITIALIZED) {
                fcn();
            } else {
                Logga.DEFAULT.debug(nonCssId + " is holdingOnInitialization");
                holdingOnInitialization = true;
                EM.listenOnce(
                    EMEvent.APP_INITIALIZED,
                    function(n: {}) {
                            justReloaded = true;
                            fcn();
                            holdingOnInitialization = false;
                            Logga.DEFAULT.debug(nonCssId + " is no longer holdingOnInitialization");
                        },
                    "PageBefore-AppInitialized"
                 );
            }
            
        };
	}

    override function initializePageContents(?pageDiv: JQ) {
        if (pageDiv == null) {
            pageDiv = new JQ(this.id);
        }

        super.initializePageContents(pageDiv);
        var pageContent: JQ = new JQ("<div class='ui-content content'></div>").appendTo(pageDiv);
    }
}