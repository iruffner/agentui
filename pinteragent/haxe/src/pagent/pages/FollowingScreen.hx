package pagent.pages;

import m3.jq.JQ;
import pagent.pages.PinterPage;

using m3.helper.OSetHelper;


class FollowingScreen extends PinterPage {

	public function new(): Void {
		super({
			id: "#followingScreen",
			pageBeforeShowFcn: pageBeforeShowFcn, 
			reqUser: true,
			showBackButton: true
		});
	}

	private function pageBeforeShowFcn(screen: JQ): Void {
		var content: JQ = new JQ(".content", screen).empty();
		content.addClass("center");
		
	}
	
}