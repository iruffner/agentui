package pagent.pages;

import m3.jq.JQ;

import pagent.AppContext;
import pagent.widget.AliasComp;
import pagent.widget.OptionBar;

using m3.helper.OSetHelper;
// using pagent.widget.AlbumList;

class HomeScreen extends PinterPage {

	public function new(): Void {
		super({
			id: "#homeScreen",
			pageBeforeShowFcn: pageBeforeShowFcn, 
			reqUser: true,
			showBackButton: false
		});
	}

	private function pageBeforeShowFcn(screen: JQ): Void {
		var content: JQ = new JQ(".content", screen).empty();
		content.addClass("center");

		// var notificationsDiv: JQ = new JQ("<div class='notificationsDiv'></div>").appendTo(content);
		
		var aliasComp: AliasComp = new AliasComp("<div></div>");
		aliasComp.appendTo(content);
		aliasComp.aliasComp();

		var optionBar: OptionBar = new OptionBar("<div></div>");
		optionBar.appendTo(content);
		optionBar.optionBar();

		// notificationsDiv.append("<h2>My Notifications</h2>");

		// var albumListing: AlbumList = new AlbumList("<div style='margin-left: 50px;'></div>");
		// albumListing.appendTo(content);
		// albumListing.albumList({
		// 		title: "My Albums"
		// 	});
	}
	
}