package ui.widget;

import m3.jq.JQ;
import m3.jq.JQDialog;
import m3.widget.Widgets;
import ui.model.ModelObj;
import ui.model.EM;
import m3.exception.Exception;

using m3.helper.StringHelper;

typedef LoginDialogOptions = {
}

typedef LoginDialogWidgetDef = {
	@:optional var options: LoginDialogOptions;
	@:optional var user: User;
	@:optional var _newUser: Bool;

	@:optional var input_un: JQ;
	@:optional var input_pw: JQ;
	@:optional var input_ag: JQ;
	@:optional var placeholder_un: JQ;
	@:optional var placeholder_pw: JQ;
	@:optional var placeholder_ag: JQ;
	
	var initialized: Bool;

	var _setUser: User->Void;
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

		        	self._newUser = false;

		        	selfElement.addClass("loginDialog").hide();

		        	var labels: JQ = new JQ("<div class='fleft'></div>").appendTo(selfElement);
		        	var inputs: JQ = new JQ("<div class='fleft'></div>").appendTo(selfElement);

		        	if(ui.AgentUi.agentURI.isBlank()) {
		        		labels.append("<div class='labelDiv'><label id='un_label' for='login_un'>Email</label></div>");
		        	}
		        	labels.append("<div class='labelDiv'><label for='login_pw'>Password</label></div>");
		        	// labels.append("<div class='labelDiv'><label for='login_ag'>Agency</label></div>");

		        	if(ui.AgentUi.agentURI.isBlank()) {
			        	self.input_un = new JQ("<input id='login_un' style='display: none;' class='ui-corner-all ui-state-active ui-widget-content'>").appendTo(inputs);
			        	self.placeholder_un = new JQ("<input id='login_un_f' class='placeholder ui-corner-all ui-widget-content' value='Please enter Username'>").appendTo(inputs);
			        	inputs.append("<br/>");
			        }
		        	self.input_pw = new JQ("<input type='password' id='login_pw' style='display: none;' class='ui-corner-all ui-state-active ui-widget-content'/>").appendTo(inputs);
		        	self.placeholder_pw = new JQ("<input id='login_pw_f' class='placeholder ui-corner-all ui-widget-content' value='Please enter Password'/>").appendTo(inputs);
		        	// inputs.append("<br/>");
		        	// self.input_ag = new JQ("<input id='login_ag' style='display: none;' class='ui-corner-all ui-state-active ui-widget-content'/>").appendTo(inputs);
		        	// self.placeholder_ag = new JQ("<input id='login_ag_f' class='placeholder ui-corner-all ui-widget-content' value='Please enter Password'/>").appendTo(inputs);

		        	if(AgentUi.DEMO) {
		        		self.input_un.val("George.Costanza");
		        		self.input_pw.val("Bosco");
		        		// self.input_ag.val("TheAgency");
		        	}

		        	inputs.children("input").keypress(function(evt: JQEvent): Void {
		        			if(evt.keyCode == 13) {
		        				self._login();
		        			}
		        		});

		        	if(ui.AgentUi.agentURI.isBlank()) {
			        	self.placeholder_un.focus(function(evt: JQEvent): Void {
			        			self.placeholder_un.hide();
			        			self.input_un.show().focus();
			        		});

			        	self.input_un.blur(function(evt: JQEvent): Void {
			        			if(self.input_un.val().isBlank()) {
				        			self.placeholder_un.show();
				        			self.input_un.hide();
			        			}
			        		});
			        }

		        	self.placeholder_pw.focus(function(evt: JQEvent): Void {
		        			self.placeholder_pw.hide();
		        			self.input_pw.show().focus();
		        		});

		        	self.input_pw.blur(function(evt: JQEvent): Void {
		        			if(self.input_pw.val().isBlank()) {
			        			self.placeholder_pw.show();
			        			self.input_pw.hide();
		        			}
		        		});

		        	// self.placeholder_ag.focus(function(evt: JQEvent): Void {
		        	// 		self.placeholder_ag.hide();
		        	// 		self.input_ag.show().focus();
		        	// 	});

		        	// self.input_ag.blur(function(evt: JQEvent): Void {
		        	// 		if(self.input_ag.val().isBlank()) {
			        // 			self.placeholder_ag.show();
			        // 			self.input_ag.hide();
		        	// 		}
		        	// 	});

		        	EM.addListener(EMEvent.USER, new EMListener(function(user: User): Void {
	        				self._setUser(user);
		        			if(user == null) {
		        				self.open();
		        			} else {
    							selfElement.dialog("close");
		        			}
		        		}, "Login-User")
		        	);

		        	EM.addListener(EMEvent.USER_SIGNUP, new EMListener(function(user: User): Void {
	        				selfElement.dialog("close");
		        		}, "Login-UserSignup")
		        	);
		        },

		        initialized: false,

		        _login: function(): Void {
		        	var self: LoginDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQDialog = Widgets.getSelfElement();

		        	var valid = true;
    				var login: Login;
    				if(ui.AgentUi.agentURI.isNotBlank()) {
    					login = new LoginById();
    					cast(login,LoginById).uuid = ui.AgentUi.agentURI;
    				} else {
    					login = new LoginByUn();
    					var l: LoginByUn = cast(login,LoginByUn);
    					l.email = self.input_un.val();
	    				if(l.email.isBlank() && ui.AgentUi.agentURI.isBlank()) {
	    					self.placeholder_un.addClass("ui-state-error");
	    					valid = false;
	    				}
    				}
    				login.password = self.input_pw.val();
    				if(login.password.isBlank()) {
    					self.placeholder_pw.addClass("ui-state-error");
    					valid = false;
    				}
    				// login.agency = self.input_ag.val();
    				// if(login.agency.isBlank()) {
    				// 	self.placeholder_ag.addClass("ui-state-error");
    				// 	valid = false;
    				// }

    				if(!valid) return;

    				selfElement.find(".ui-state-error").removeClass("ui-state-error");

    				EM.change(EMEvent.USER_LOGIN, login);
    				
    				// EM.addListener(EMEvent.USER, new EMListener(function(n: Nothing): Void {
    				// 		selfElement.dialog("close");
    				// 	}));
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
		        		buttons: {
		        			"Login": function() {
		        				self._login();
		        			},
		        			"I\\\'m New": function() {
		        				self._newUser = true;
		        				JQDialog.cur.dialog("close");
		        				DialogManager.showNewUser();
		        			},
		        			"Validate": function() {
		        				self._newUser = true;
		        				JQDialog.cur.dialog("close");
		        				DialogManager.showSignupConfirmation();
		        			}
		        		},
		        		beforeClose: function(evt: JQEvent, ui: UIJQDialog): Dynamic {
		        			if(!self._newUser && (self.user == null || !self.user.hasValidSession())) {
		        				js.Lib.alert("A valid user is required to use the app");
		        				return false;
		        			}
		        			return true;
		        		}
		        	};
		        	selfElement.dialog(dlgOptions);
		        },

		        _setUser: function(user: User): Void {
		        	var self: LoginDialogWidgetDef = Widgets.getSelf();

		        	self.user = user;
	        	},

	        	open: function(): Void {
		        	var self: LoginDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQDialog = Widgets.getSelfElement();

					self._newUser = false;

		        	if(!self.initialized) {
		        		self._buildDialog();
		        	}
		        	selfElement.children("#un_label").focus();
		        	if(ui.AgentUi.agentURI.isBlank()) {
		        		self.input_un.blur();
		        	}
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