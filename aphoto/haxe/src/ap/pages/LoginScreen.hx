package ui.pages;

import m3.jq.JQ;

using m3.helper.OSetHelper;


class LoginScreen extends ConvoPage {

	public function new(): Void {
		super({
			id: "#loginScreen",
			pageBeforeShowFcn: pageBeforeShowFcn, 
			reqUser: false,
			showBackButton: false
		});
	}

	private function pageBeforeShowFcn(screen: JQ): Void {
		var content: JQ = new JQ(".content", screen).empty();

		new JQ("<div class='loginWarning'><h2>Login to Convo<h2></div>").appendTo(content);

		var un: JQ = new JQ("<input type='text' placeholder='Username' />").appendTo(content);
		var pw: JQ = new JQ("<input type='password' placeholder='Password' />").appendTo(content);
		new JQ("<button class='ui-btn ui-corner-all'>Login</button>")
			.appendTo(content)
			.click(function(evt: JQEvent) {
					AppContext.PAGE_MGR.CURRENT_PAGE = ui.pages.ConvoPageMgr.HOME_SCREEN;
				});
		content.append("<br/><div>New to Convo?</div>");
		new JQ("<button class='ui-btn ui-corner-all'>Sign Up</button>")
			.appendTo(content)
			.click(function(evt: JQEvent) {
				
				});


		screen.trigger("create");
	}
	
}