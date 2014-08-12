package ap.pages;

import m3.jq.JQ;
import m3.jq.pages.Page;
import m3.log.Logga;
import m3.util.JqueryUtil;

import ap.APhotoContext;
import qoid.model.EM;

class APhotoPage extends Page {

	public function new(opts: PageOptions) {
        super(opts);

        this.pageBeforeCreate = function(screen: JQ): Void {
            this.options.pageBeforeCreateFcn(screen);
        };

        this.pageChange = function(screen: JQ): Void {
            Logga.DEFAULT.debug("pageChange " + id);
            this.options.pageChangeFcn(screen);
        };

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
                            AppContext.LOGGER.debug(nonCssId + " is no longer holdingOnInitialization");
                        },
                    "PageBefore-AppInitialized"
                 );
            }
            
        };

        this.reshow = {
            if(this.options.customReloadFcn == null) {
                function(screen: JQ) {
                    if(this.holdingOnInitialization) {
                        Logga.DEFAULT.debug("don't reshow b/c we're holding on initialization");
                        return;
                    }
                    this.options.pageBeforeShowFcn(screen);
                }
            } else {
                function(screen: JQ) {
                    if(this.holdingOnInitialization) {
                        Logga.DEFAULT.debug("don't reshow b/c we're holding on initialization");
                        return;
                    }
                    this.options.customReloadFcn(screen);
                }
            }
        };
	}

    override function initializePageContents(?pageDiv: JQ) {
        if (pageDiv == null) {
            pageDiv = new JQ(this.id);
        }

        var pageContent: JQ = new JQ("<div class='ui-content content'></div>").appendTo(pageDiv);
        
        // var header: JQ = createPageHeader();

        /*if (this.showBackButton){
            new JQ("<a href='#' data-rel='back' data-role='button' data-icon='arrow-l' data-iconpos='notext'>Back</a>").prependTo(header);
        }

        new JQ("<a href='" + this.id + "mp' data-role='button' data-icon='bars' data-iconpos='notext' class='ui-btn-right'>Menu</a>").appendTo(header);
        pageDiv.prepend(header);
        var panel: JQ = new JQ("<div data-role='panel' id='" + this.nonCssId + "mp' data-position='right' data-display='reveal' data-theme='a' class='ui-panel ui-panel-position-right ui-panel-display-reveal ui-body-a ui-panel-animate ui-panel-closed'></div>");
        // var userIdCompOptions: UserIDCompOptions = {
        //     allowLogin: false
        // };
        // var userIdComp: UserIDComp = new UserIDComp("<div class='userId ui-btn-right'></div>").userIDComp(userIdCompOptions);
        // userIdComp.appendTo(panel);
        var menuContent: JQ = new JQ("<div class='ui-panel-inner clear'></div>").appendTo(panel);
        var loginButton: JQ = new JQ("<button data-theme='b' class='loginButton ui-btn ui-corner-all ui-btn-b ui-btn-icon-left'>Login</button>")
                    .click(function(evt: JQEvent): Void {
                            var cp = AppContext.PAGE_MGR.CURRENT_PAGE;
                            Convo.POST_LOGIN_ACTIONS.push(function(){
                                if (cp == null) {
                                    cp = ConvoPageMgr.HOME_SCREEN;
                                }
                                AppContext.PAGE_MGR.CURRENT_PAGE = cp;
                            });
                            AppContext.PAGE_MGR.CURRENT_PAGE = ConvoPageMgr.LOGIN_SCREEN;
                        });

        EM.addListener(EMEvent.USER, function(v: Null<Dynamic>) {
                var parent: JQ = loginButton.parents(".ui-btn");
                if(AppContext.USER == null) {
                    parent.show();
                } else {
                    parent.hide();
                }
            }, "LoginButton-User");
        // menuContent
        //     .append(
        //         loginButton
        //     )
        //     .append(
        //         new JQ("<button class='ui-btn ui-corner-all ui-btn-b ui-btn-icon-left ui-icon-home'>Home</button>")
        //             .click(function(evt: JQEvent): Void {
        //                     AppContext.PAGE_MGR.CURRENT_PAGE = Pages.HOME_SCREEN;
        //                 })
        //     )
        //     .append(
        //         new JQ("<button class='ui-btn ui-corner-all ui-btn-b ui-btn-icon-left ui-icon-user'>My Friend Network</button>")
        //             .click(function(evt: JQEvent): Void {
        //                     AppContext.PAGE_MGR.CURRENT_PAGE = Pages.FRIEND_NETWORK_SCREEN;
        //                 })
        //     )
        //     .append(
        //         new JQ("<button class='ui-btn ui-corner-all ui-btn-b ui-btn-icon-left ui-icon-heart'>My Promotions</button>")
        //             .click(function(evt: JQEvent): Void {
        //                     AppContext.PAGE_MGR.CURRENT_PAGE = Pages.PROMOTIONS_LIST_SCREEN;
        //                 })
        //     )
        //     .append(
        //         new JQ("<button class='ui-btn ui-corner-all ui-btn-b ui-btn-icon-left ui-icon-shop'>My Earnings</button>")
        //             .click(function(evt: JQEvent): Void {
        //                     AppContext.PAGE_MGR.CURRENT_PAGE = Pages.EARNINGS_SCREEN;
        //                 })
        //     )
        //     .append(
        //         new JQ("<button class='ui-btn ui-corner-all ui-btn-b ui-btn-icon-left ui-icon-arrow-u'>New Upload</button>")
        //             .click(function(evt: JQEvent): Void {
        //                     AppContext.LAST_CAMPAIGN = null;
        //                     AppContext.PAGE_MGR.CURRENT_PAGE = Pages.USER_VIDEO_UPLOAD_SCREEN;
        //                 })
        //     )
        //     .append(
        //         new JQ("<button class='ui-btn ui-corner-all ui-btn-b ui-btn-icon-left ui-icon-gear'>Settings</button>")
        //             .click(function(evt: JQEvent): Void {
        //                     AppContext.PAGE_MGR.CURRENT_PAGE = Pages.MY_ACCOUNT_SCREEN;
        //                 })
        //     )
        //     .append(
        //         new JQ("<button class='ui-btn ui-corner-all ui-btn-b ui-btn-icon-left ui-icon-info'>Help</button>")
        //             .click(function(evt: JQEvent): Void {
        //                     AppContext.PAGE_MGR.CURRENT_PAGE = Pages.HELP_SCREEN;
        //                 })
        //     );
        // pageDiv.prepend(panel);
*/
    }
}