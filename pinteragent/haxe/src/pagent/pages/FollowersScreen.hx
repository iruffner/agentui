package pagent.pages;

import m3.jq.JQ;

using m3.helper.OSetHelper;


class FollowersScreen extends PinterPage {

	public function new(): Void {
		super({
			id: "#followersScreen",
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