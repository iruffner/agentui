package ap.pages;

import ap.APhotoContext;
import ap.model.EM;
import m3.jq.JQ;
import m3.jq.pages.SinglePageManager;
import m3.jq.pages.Page;

class APhotoPageMgr extends SinglePageManager {

	private static var _instance: APhotoPageMgr;
	public static var get(get,null): APhotoPageMgr;

    public static var HOME_SCREEN: APhotoPage = new HomeScreen();
    public static var ALBUM_SCREEN: APhotoPage = new AlbumScreen();
    public static var CONTENT_SCREEN: APhotoPage = new ContentScreen();
    // public static var LOGIN_SCREEN: APhotoPage = new LoginScreen();

    private function new() {
    	super(
                function() { return APhotoContext.APP_INITIALIZED; },
                function(fcn: Dynamic->Void): Void {
                    EM.listenOnce(EMEvent.APP_INITIALIZED, fcn);
                }
            );
    }

    private static function get_get(): APhotoPageMgr {
    	if(_instance == null) _instance = new APhotoPageMgr();
    	return _instance;
    }
	
	public function initClientPages(): Void {
        var pages: Array<Page> = getScreens();
        for(p_ in 0...pages.length) {
            var page: Page = pages[p_];
            var screen: JQ = null;
            if(! (screen = new JQ(page.id)).exists() ) {
                page.addPageToDom();
            } else {
                page.initializePageContents(screen);
            }
            
        }
    }
}