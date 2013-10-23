package ui.widget;

import m3.jq.JQ;
import m3.jq.JQDialog;
import m3.widget.Widgets;
import ui.model.ModelObj;
import ui.model.EM;
import m3.exception.Exception;

using m3.helper.StringHelper;

typedef SignupConfirmationDialogOptions = {
}

typedef SignupConfirmationDialogWidgetDef = {
	@:optional var options: SignupConfirmationDialogOptions;
	@:optional var user: User;
	@:optional var _cancelled: Bool;

	@:optional var input: JQ;
	@:optional var inputLabel: JQ;
	
	var initialized: Bool;

	var _setUser: User->Void;
	var _buildDialog: Void->Void;
	var open: Void->Void;
	var _validateUser: Void->Void;

	var _create: Void->Void;
	var destroy: Void->Void;
}

@:native("$")
extern class SignupConfirmationDialog extends JQ {

	@:overload(function<T>(cmd : String):T{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function signupConfirmationDialog(?opts: SignupConfirmationDialogOptions): SignupConfirmationDialog;

	private static function __init__(): Void {
		var defineWidget: Void->SignupConfirmationDialogWidgetDef = function(): SignupConfirmationDialogWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: SignupConfirmationDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQDialog = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of SignupConfirmationDialog must be a div element");
		        	}

		        	self._cancelled = false;

		        	selfElement.addClass("signupConfirmationDialog").hide();

		        	selfElement.append("<p> Your request for a User Agent has been submitted. Upon receiving your confirmation email, you may click the " + 
		        							"link it contains or paste the token below to validate your email address.");

		        	self.inputLabel = new JQ("<div class='labelDiv'><label id='confirmTokenLabel' for='confirmToken'>Your Token</label></div>").appendTo(selfElement);
		        	self.input = new JQ("<input id='confirmToken' />").appendTo(selfElement);


		        	self.input.keypress(function(evt: JQEvent): Void {
		        			if(evt.keyCode == 13) {
		        				self._validateUser();
		        			}
		        		});

		        	EM.addListener(EMEvent.USER, new EMListener(function(user: User): Void {
	        				self._setUser(user);
		        		}, "SignupConfirmationDialog-User")
		        	);
		        },

		        initialized: false,

		        _validateUser: function(): Void {
		        	var self: SignupConfirmationDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQDialog = Widgets.getSelfElement();

		        	var valid = true;
    				
    				var token = self.input.val();
    				if(token.isBlank()) {
    					self.inputLabel.addClass("ui-state-error");
    					valid = false;
    				}
    				if(!valid) return;
    				selfElement.find(".ui-state-error").removeClass("ui-state-error");
    				EM.change(EMEvent.USER_VALIDATE, token);

    				EM.addListener(EMEvent.USER_VALIDATED, new EMListener(function(n: Nothing): Void {
    						selfElement.dialog("close");
    					}, "SignupConfirmationDialog-UserValidated"));
	        	},

		        _buildDialog: function(): Void {
		        	var self: SignupConfirmationDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQDialog = Widgets.getSelfElement();

		        	self.initialized = true;

		        	var dlgOptions: JQDialogOptions = {
		        		autoOpen: false,
		        		title: "Email Validation",
		        		height: 420,
		        		width: 420,
		        		buttons: {
		        			"Validate": function() {
		        				self._validateUser();
		        			},
		        			"Cancel": function() {
		        				self._cancelled = true;
		        				JQDialog.cur.dialog("close");
		        			}
		        		},
		        		close: function(evt: JQEvent, ui: UIJQDialog): Void {
		        			selfElement.find(".placeholder").removeClass("ui-state-error");
		        			if(self.user == null || !self.user.hasValidSession()) {
		        				DialogManager.showLogin();
		        			}
		        		}
		        	};
		        	selfElement.dialog(dlgOptions);
		        },

		        _setUser: function(user: User): Void {
		        	var self: SignupConfirmationDialogWidgetDef = Widgets.getSelf();

		        	self.user = user;
	        	},

	        	open: function(): Void {
		        	var self: SignupConfirmationDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQDialog = Widgets.getSelfElement();

					self._cancelled = false;

		        	if(!self.initialized) {
		        		self._buildDialog();
		        	}
		        	self.input.focus();
	        		selfElement.dialog("open");
        		},
		        
		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.signupConfirmationDialog", defineWidget());
	}
}