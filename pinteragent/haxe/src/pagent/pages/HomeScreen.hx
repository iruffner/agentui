package pagent.pages;

import m3.jq.JQ;

import pagent.widget.AliasComp;
import pagent.widget.BoardList;
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

		var aliasComp: AliasComp = new AliasComp("<div></div>");
		aliasComp.appendTo(content);
		aliasComp.aliasComp();

		var optionBar: OptionBar = new OptionBar("<div></div>");
		optionBar.appendTo(content);
		optionBar.optionBar();

		var boardListing: BoardList = new BoardList("<div></div>");
		boardListing.appendTo(content);
		boardListing.boardList();
	}
	
}