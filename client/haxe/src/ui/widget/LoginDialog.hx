package ui.widget;

import m3.jq.JQ;
import m3.jq.JQDialog;
import m3.jq.PlaceHolderUtil;
import m3.widget.Widgets;
import ui.model.ModelObj;
import ui.model.EM;
import m3.exception.Exception;
import m3.util.JqueryUtil;

using m3.helper.StringHelper;

typedef LoginDialogOptions = {
}

typedef LoginDialogWidgetDef = {
	@:optional var options: LoginDialogOptions;

	@:optional var input_un: JQ;
	@:optional var input_pw: JQ;
	@:optional var placeholder_un: JQ;
	@:optional var placeholder_pw: JQ;
	
	var initialized: Bool;

	var _buildDialog: Void->Void;
	var open: Void->Void;
	var _login: Void->Void;

	var _create: Void->Void;
	var destroy: Void->Void;
}

@:native("$")
extern class LoginDialog extends JQ {

	@:overload(function(cmd : String):Bool{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function loginDialog(?opts: LoginDialogOptions): LoginDialog;

	private static function __init__(): Void {
		var defineWidget: Void->LoginDialogWidgetDef = function(): LoginDialogWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: LoginDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQDialog = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of LoginDialog must be a div element");
		        	}

		        	selfElement.addClass("loginDialog").hide();

		        	var labels: JQ = new JQ("<div class='fleft'></div>").appendTo(selfElement);
		        	var inputs: JQ = new JQ("<div class='fleft'></div>").appendTo(selfElement);

	        		labels.append("<div class='labelDiv'><label id='un_label' for='login_un'>Agent Id</label></div>");
		        	labels.append("<div class='labelDiv'><label for='login_pw'>Password</label></div>");

		        	self.input_un = new JQ("<input id='login_un' style='display: none;' class='ui-corner-all ui-state-active ui-widget-content'>").appendTo(inputs);
		        	self.placeholder_un = new JQ("<input id='login_un_f' class='placeholder ui-corner-all ui-widget-content' value='Please enter Email'>").appendTo(inputs);
		        	inputs.append("<br/>");

		        	self.input_pw = new JQ("<input type='password' id='login_pw' class='ui-corner-all ui-state-active ui-widget-content'/>").appendTo(inputs);
		        	self.placeholder_pw = new JQ("<input id='login_pw_f' style='display: none;' class='placeholder ui-corner-all ui-widget-content' value='Please enter Password'/>").appendTo(inputs);

	        		self.input_un.val("");
	        		self.input_pw.val("ohyea");

		        	inputs.children("input").keypress(function(evt: JQEvent): Void {
		        			if(evt.keyCode == 13) {
		        				self._login();
		        			}
		        		});

		        	PlaceHolderUtil.setFocusBehavior(self.input_un, self.placeholder_un);
		        	PlaceHolderUtil.setFocusBehavior(self.input_pw, self.placeholder_pw);

		        	EM.addListener(EMEvent.AGENT, new EMListener(function(agent: Agent): Void {
    						selfElement.dialog("close");
		        		}, "Login-AGENT")
		        	);
		        },

		        initialized: false,

		        _login: function(): Void {
		        	var self: LoginDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQDialog = Widgets.getSelfElement();

		        	var valid = true;
    				var login = new Login();
					login.agentId = self.input_un.val();
    				if(login.agentId.isBlank()) {
    					self.placeholder_un.addClass("ui-state-error");
    					valid = false;
    				}

    				login.password = self.input_pw.val();
    				if(login.password.isBlank()) {
    					self.placeholder_pw.addClass("ui-state-error");
    					valid = false;
    				}

    				if(!valid)return;

    				selfElement.find(".ui-state-error").removeClass("ui-state-error");

    				EM.change(EMEvent.USER_LOGIN, login);
	        	},

		        _buildDialog: function(): Void {
		        	var self: LoginDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQDialog = Widgets.getSelfElement();

		        	self.initialized = true;

		        	var dlgOptions: JQDialogOptions = {
		        		autoOpen: false,
		        		title: "Login",
		        		height: 280,
		        		width: 400,
		        		modal: true,
		        		buttons: {
		        			"Login": function() {
//		        				$(".loginDialog + div button").button("option", "disabled", true);
		        				self._login();
		        			},
		        			"I\\\'m New...": function() {
		        				DialogManager.showCreateAgent();
		        			}
		        		},
		        		beforeClose: function(evt: JQEvent, ui: UIJQDialog): Dynamic {
		        			if(AppContext.AGENT == null) {
		        				JqueryUtil.alert("A valid login is required to use the app");
		        				return false;
		        			}
		        			return true;
		        		}
		        	};
		        	selfElement.dialog(dlgOptions);
		        },

	        	open: function(): Void {
		        	var self: LoginDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQDialog = Widgets.getSelfElement();

		        	if(!self.initialized) {
		        		self._buildDialog();
		        	}
		        	selfElement.children("#un_label").focus();
	        		self.input_un.blur();
	        		self.input_pw.blur();
	        		selfElement.dialog("open");
        		},
		        
		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.loginDialog", defineWidget());
	}
}