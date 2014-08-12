package ap.pages;

import m3.jq.JQ;

using m3.helper.OSetHelper;


class HomeScreen extends ConvoPage {

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
		content.attr("data-theme", "e");

		var convoDiv: JQ = new JQ("<button class='ui-btn ui-btn-e ui-shadow ui-corner-all ui-btn-icon-left ui-icon-comment tallBtn'>Conversations</button>")
			.appendTo(content)
			.click(function(evt: JQEvent) {

				})
			.append("<span class='badge'>1</span>");
		var connectionsDiv: JQ = new JQ("<button class='ui-btn ui-btn-e ui-shadow ui-corner-all ui-btn-icon-left ui-icon-user tallBtn'>Connections</button>").appendTo(content);
		var agentDiv: JQ = new JQ("<button class='ui-btn ui-btn-e ui-shadow ui-corner-all ui-btn-icon-left ui-icon-gear tallBtn'>My Agent</button>").appendTo(content);

		screen.trigger("create");
	}
	
}