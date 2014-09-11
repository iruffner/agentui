package agentui.widget;

import ap.widget.DialogManager;
import ap.model.EM;
import m3.jq.JQ;
import m3.jq.JQDialog;
import m3.jq.PlaceHolderUtil;
import m3.widget.Widgets;
import qoid.model.ModelObj;
import m3.exception.Exception;

using m3.helper.StringHelper;

typedef CreateAgentDialogOptions = {
}

typedef CreateAgentDialogWidgetDef = {
	@:optional var options: CreateAgentDialogOptions;
	@:optional var _cancelled: Bool;
	@:optional var _registered: Bool;

	@:optional var input_n: JQ;
	// @:optional var input_un: JQ;
	@:optional var input_pw: JQ;
	// @:optional var input_em: JQ;
	@:optional var placeholder_n: JQ;
	// @:optional var placeholder_un: JQ;
	@:optional var placeholder_pw: JQ;
	// @:optional var placeholder_em: JQ;
	
	var initialized: Bool;

	var _buildDialog: Void->Void;
	var open: Void->Void;
	var _createNewUser: Void->Void;

	var _create: Void->Void;
	var destroy: Void->Void;
}

@:native("$")
extern class CreateAgentDialog extends JQ {

	@:overload(function(cmd : String):Bool{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function createAgentDialog(?opts: CreateAgentDialogOptions): CreateAgentDialog;

	private static function __init__(): Void {
		var defineWidget: Void->CreateAgentDialogWidgetDef = function(): CreateAgentDialogWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: CreateAgentDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQDialog = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of CreateAgentDialog must be a div element");
		        	}

		        	self._cancelled = false;

		        	selfElement.addClass("createAgentDialog").hide();

		        	var labels: JQ = new JQ("<div class='fleft'></div>").appendTo(selfElement);
		        	var inputs: JQ = new JQ("<div class='fleft'></div>").appendTo(selfElement);

		        	labels.append("<div class='labelDiv'><label id='n_label' for='newu_n'>Name</label></div>");
		        	// labels.append("<div class='labelDiv'><label id='em_label' for='newu_em'>Email</label></div>");
		        	// labels.append("<div class='labelDiv'><label id='un_label' for='newu_un'>Username</label></div>");
		        	labels.append("<div class='labelDiv'><label id='pw_label' for='newu_pw'>Password</label></div>");

		        	self.input_n = new JQ("<input id='newu_n' style='display: none;' class='ui-corner-all ui-state-active ui-widget-content'>").appendTo(inputs);
		        	self.placeholder_n = new JQ("<input id='login_un_f' class='placeholder ui-corner-all ui-widget-content' value='Please enter Name'>").appendTo(inputs);
		        	inputs.append("<br/>");
		        	// self.input_em = new JQ("<input id='newu_em' style='display: none;' class='ui-corner-all ui-state-active ui-widget-content'>").appendTo(inputs);
		        	// self.placeholder_em = new JQ("<input id='login_un_f' class='placeholder ui-corner-all ui-widget-content' value='Please enter Email'>").appendTo(inputs);
		        	// inputs.append("<br/>");
		        	// self.input_un = new JQ("<input id='newu_un' style='display: none;' class='ui-corner-all ui-state-active ui-widget-content'>").appendTo(inputs);
		        	// self.placeholder_un = new JQ("<input id='login_un_f' class='placeholder ui-corner-all ui-widget-content' value='Please enter Username'>").appendTo(inputs);
		        	// inputs.append("<br/>");
		        	self.input_pw = new JQ("<input type='password' id='newu_pw' style='display: none;' class='ui-corner-all ui-state-active ui-widget-content'/>").appendTo(inputs);
		        	self.placeholder_pw = new JQ("<input id='login_pw_f' class='placeholder ui-corner-all ui-widget-content' value='Please enter Password'/>").appendTo(inputs);
		        	inputs.append("<br/>");
		        	// self.input_em = new JQ("<input id='login_em' style='display: none;' class='ui-corner-all ui-state-active ui-widget-content'/>").appendTo(inputs);
		        	// self.placeholder_em = new JQ("<input id='login_em_f' class='placeholder ui-corner-all ui-widget-content' value='Please enter Password'/>").appendTo(inputs);

		        	inputs.children("input").keypress(function(evt: JQEvent): Void {
	        			if(evt.keyCode == 13) {
	        				self._createNewUser();
	        			}
	        		});

		        	PlaceHolderUtil.setFocusBehavior(self.input_n, self.placeholder_n);
		        	PlaceHolderUtil.setFocusBehavior(self.input_pw, self.placeholder_pw);
		        	// PlaceHolderUtil.setFocusBehavior(self.input_em, self.placeholder_em);
		        },

		        initialized: false,

		        _createNewUser: function(): Void {
		        	var self: CreateAgentDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQDialog = Widgets.getSelfElement();

		        	var valid = true;
    				var newUser: NewUser = new NewUser();
    				// newUser.userName = self.input_un.val();
    				// if(newUser.userName.isBlank()) {
    				// 	self.placeholder_un.addClass("ui-state-error");
    				// 	valid = false;
    				// }
    				
    				newUser.pwd = self.input_pw.val();
    				if(newUser.pwd.isBlank()) {
    					self.placeholder_pw.addClass("ui-state-error");
    					valid = false;
    				}
    				// newUser.email = self.input_em.val();
    				// if(newUser.email.isBlank()) {
    				// 	self.placeholder_em.addClass("ui-state-error");
    				// 	valid = false;
    				// }
    				
    				newUser.name = self.input_n.val();
    				if(newUser.name.isBlank()) {
    					self.placeholder_n.addClass("ui-state-error");
    					valid = false;
    				}
    				if(!valid) return;
    				selfElement.find(".ui-state-error").removeClass("ui-state-error");
    				EM.change(EMEvent.CreateAgent, newUser);

    				EM.listenOnce(qoid.QE.onAgentCreated, function(n: {}): Void {
    					selfElement.dialog("close");
    				}, "CreateAgentDialog-UserSignup");
	        	},

		        _buildDialog: function(): Void {
		        	var self: CreateAgentDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQDialog = Widgets.getSelfElement();

		        	self.initialized = true;

		        	var dlgOptions: JQDialogOptions = {
		        		autoOpen: false,
		        		title: "Create New Agent",
		        		height: 320,
		        		width: 400,
		        		modal: true,
		        		buttons: {
		        			"Create My Agent": function() {
		        				self._registered = true;
		        				self._createNewUser();
		        			},
		        			"Cancel": function() {
		        				self._cancelled = true;
		        				JQDialog.cur.dialog("close");
		        			}
		        		},
		        		close: function(evt: JQEvent, ui: UIJQDialog): Void {
		        			selfElement.find(".placeholder").removeClass("ui-state-error");
	        				DialogManager.showLogin();
		        		}
		        	};
		        	selfElement.dialog(dlgOptions);
		        },

	        	open: function(): Void {
		        	var self: CreateAgentDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQDialog = Widgets.getSelfElement();

					self._cancelled = false;

		        	if(!self.initialized) {
		        		self._buildDialog();
		        	}
		        	selfElement.children("#n_label").focus();
		        	self.input_n.blur();
	        		selfElement.dialog("open");
        		},
		        
		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.createAgentDialog", defineWidget());
	}
}