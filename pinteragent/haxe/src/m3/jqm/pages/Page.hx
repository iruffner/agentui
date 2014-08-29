package m3.jqm.pages;

import m3.jq.JQ;
import m3.jqm.JQMobile;
import m3.jqm.pages.PageManager;
import m3.exception.Exception;
import m3.exception.RedirectionException;
import m3.log.Logga;
import m3.util.M;

using Lambda;

typedef PageOptions = {
    var id: String;
    @:optional var pageBeforeShowFcn: JQ->Void;
    @:optional var pageBeforeCreateFcn: JQ->Void;
    @:optional var pageChangeFcn: JQ->Void;
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
    @:isVar public var pageChange(get,null): JQ->Void;
	@:isVar public var reshow(get,null): JQ->Void;

    public var showBackButton: Bool = true;

    private var holdingOnInitialization: Bool = false;

    private var options: PageOptions;

    public static function noOp(jq: JQ): Void { }

    function getDefaults(): PageOptions {
        return 
            {
                id: null,
                pageBeforeCreateFcn: function(screen: JQ): Void {
                        // Pages.standardPageCreation(screen, true, true);
                    },
                pageBeforeShowFcn: noOp,
                pageChangeFcn: noOp,
                reqUser: true,
                reloadUserOnShow: false,
                showBackButton: this.showBackButton,
                usesKeyboard: false
            };
    }

    function getDefaultPageTheme(): String {
        return "b";
    }

    function applyDefaults(): Void {
    	options =  
            JQ.extend(
                getDefaults(),
                options
            );
    }

    public function new(opts: PageOptions) {
        if(!PageManager.SCREEN_MAP.exists(opts.id)) {
            PageManager.SCREEN_MAP.set(opts.id, this);
        } else {
            throw new Exception("Page with this ID already exists! | " + opts.id);
        }

        this.options = opts;
        applyDefaults();
		this.id = opts.id;
        this.showBackButton = opts.showBackButton;
	}

    public function addPageToDom() {
        var pageDiv: JQMobile = cast new JQ("<div data-role='page' id='" + this.nonCssId + "' data-theme='" + getDefaultPageTheme() + "'></div>").appendTo(new JQ(js.Browser.document.body));
        initializePageContents(pageDiv);
        pageDiv.page();
    }

    public function initializePageContents(?pageDiv: JQ){
    	throw "OVERRIDE ME";
    };

    function get_pageBeforeCreate(): JQ->Void {
        return this.pageBeforeCreate;
    }

    function get_pageBeforeShow(): JQ->Void {
        return this.pageBeforeShow;
    }

    function get_pageChange(): JQ->Void {
        return this.pageChange;
    }

    function get_reshow(): JQ->Void {
        return this.reshow;
    }

	private function get_nonCssId(): String {
		return id.substring(1);
	}
}