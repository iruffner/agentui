package m3.jq.pages;

import m3.jq.JQ;
import m3.jq.pages.SinglePageManager;
import m3.exception.Exception;
import m3.exception.RedirectionException;
import m3.log.Logga;
import m3.util.M;

using Lambda;

typedef PageOptions = {
    var id: String;
    @:optional var pageBeforeShowFcn: JQ->Void;
    @:optional var pageBeforeCreateFcn: JQ->Void;
    @:optional var pageShowFcn: JQ->Void;
    @:optional var pageHideFcn: JQ->Void;
    @:optional var reqUser: Bool;
    @:optional var reloadUserOnShow: Bool;
    @:optional var customReloadFcn: JQ->Void;
    @:optional var showBackButton: Bool;
    @:optional var usesKeyboard: Bool;
}

class Page {
	public var id: String;
	public var nonCssId(get,null): String;
    @:isVar public var pageBeforeCreate(get,null): JQ->Void;
    @:isVar public var pageBeforeShow(get,null): JQ->Void;
    // @:isVar public var pageChange(get,null): JQ->Void;
    @:isVar public var pageShow(get,null): JQ->Void;
    @:isVar public var pageHide(get,null): JQ->Void;
	@:isVar public var reshow(get,null): JQ->Void;

    @:isVar public var screen(get,set): JQ;

    public var showBackButton: Bool = true;

    private var holdingOnInitialization: Bool = false;

    private var options: PageOptions;

    public static function noOp(jq: JQ): Void { }

    function getDefaults(): PageOptions {
        return 
            {
                id: null,
                pageBeforeCreateFcn: noOp,
                pageBeforeShowFcn: noOp,
                pageHideFcn: noOp,
                pageShowFcn: noOp,
                reqUser: true,
                reloadUserOnShow: false,
                showBackButton: this.showBackButton,
                usesKeyboard: false
            };
    }

    function applyDefaults(): Void {
    	options =  
            JQ.extend(
                getDefaults(),
                options
            );
    }

    public function new(opts: PageOptions) {
        if(!SinglePageManager.SCREEN_MAP.exists(opts.id)) {
            SinglePageManager.SCREEN_MAP.set(opts.id, this);
        } else {
            throw new Exception("Page with this ID already exists! | " + opts.id);
        }

        this.options = opts;
        applyDefaults();
		this.id = this.options.id;
        this.showBackButton = this.options.showBackButton;

        this.pageBeforeCreate = function(screen: JQ): Void {
            this.options.pageBeforeCreateFcn(screen);
        };

        this.pageShow = function(screen: JQ): Void {
            Logga.DEFAULT.debug("pageShow " + id);
            this.options.pageShowFcn(screen);
        };

        this.pageHide = function(screen: JQ): Void {
            Logga.DEFAULT.debug("pageHide " + id);
            this.options.pageHideFcn(screen);
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

    public function addPageToDom() {
        var pageDiv: JQ = new JQ("<div class='page' id='" + this.nonCssId + "'></div>").appendTo(new JQ(js.Browser.document.body));
        initializePageContents(pageDiv);
    }

    public function initializePageContents(?pageDiv: JQ){
    	if(pageDiv != null)
            pageDiv.trigger("pagebeforecreate");
    };

    function get_pageBeforeCreate(): JQ->Void {
        return this.pageBeforeCreate;
    }

    function get_pageBeforeShow(): JQ->Void {
        return this.pageBeforeShow;
    }

    // function get_pageChange(): JQ->Void {
    //     return this.pageChange;
    // }

    function get_pageShow(): JQ->Void {
        return this.pageShow;
    }

    function get_pageHide(): JQ->Void {
        return this.pageHide;
    }

    function get_reshow(): JQ->Void {
        return this.reshow;
    }

    function get_screen(): JQ {
        if(this.screen == null) {
            this.screen = new JQ(this.id);
        }
        return this.screen;
    }

    function set_screen(screen: JQ): JQ {
        this.screen = screen;
        return this.screen;
    }

	private function get_nonCssId(): String {
		return id.substring(1);
	}
}