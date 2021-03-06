package pagent.pages;

import m3.jq.JQ;
import pagent.PinterContext;
import pagent.widget.ConnectionsList;
import qoid.Qoid;

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

		content.append("<h1>Connections I Follow</h1>");
		
		var cl: ConnectionsList = new ConnectionsList("<div></div>");
		cl.appendTo(content);
		
		cl.connectionsList({
				connectionIids: PinterContext.sharedBoardsByConnection.keys()
			});
	}
}