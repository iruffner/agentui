package ui.widget;

import m3.jq.JQ;
import m3.jq.JDialog;
import m3.widget.Widgets;
import ui.model.ModelObj;
import ui.model.EM;
import m3.exception.Exception;

using m3.helper.StringHelper;

typedef NewAliasCompOptions = {
}

typedef NewAliasCompWidgetDef = {
	@:optional var options: NewAliasCompOptions;
	@:optional var user: User;

	@:optional var input_n: JQ;
	
	var initialized: Bool;

	var _setUser: User->Void;
	var _buildDialog: Void->Void;
	var open: Void->Void;
	var _createNewAlias: Void->Void;

	var _create: Void->Void;
	var destroy: Void->Void;
}

@:native("$")
extern class NewAliasComp extends JQ {

	@:overload(function(cmd : String):Bool{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function newAliasComp(?opts: NewAliasCompOptions): NewAliasComp;

	private static function __init__(): Void {
		var defineWidget: Void->NewAliasCompWidgetDef = function(): NewAliasCompWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: NewAliasCompWidgetDef = Widgets.getSelf();
					var selfElement: JDialog = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of NewAliasComp must be a div element");
		        	}

		        	selfElement.addClass("_newAliasComp").hide();

		        	var labels: JQ = new JQ("<div class='fleft'></div>").appendTo(selfElement);
		        	var inputs: JQ = new JQ("<div class='fleft'></div>").appendTo(selfElement);

		        	labels.append("<div class='labelDiv' style='margin-top: 3px; margin-right: 6px;'><label id='n_label' for='newu_n'>Alias Name:</label></div>");

		        	self.input_n = new JQ("<input id='newu_n' class='ui-corner-all ui-state-active ui-widget-content'>").appendTo(inputs);
		        	inputs.append("<br/>");

		        	inputs.children("input").keypress(function(evt: JQEvent): Void {
		        			if(evt.keyCode == 13) {
		        				self._createNewAlias();
		        			}
		        		});

		        	EM.addListener(EMEvent.USER, new EMListener(function(user: User): Void {
	        				self._setUser(user);
		        		},"NewAliasComp-User")
		        	);
		        },

		        initialized: false,

		        _createNewAlias: function(): Void {
		        	var self: NewAliasCompWidgetDef = Widgets.getSelf();
					var selfElement: JDialog = Widgets.getSelfElement();

		        	var valid = true;
    				var alias: Alias = new Alias();
    				alias.label = self.input_n.val();
    				if(alias.label.isBlank()) {
    					valid = false;
    				}
    				if(!valid) return;
    				selfElement.find(".ui-state-error").removeClass("ui-state-error");
    				EM.change(EMEvent.AliasCreate, alias);

	        	},

		        _buildDialog: function(): Void {
		        	var self: NewAliasCompWidgetDef = Widgets.getSelf();
					var selfElement: JDialog = Widgets.getSelfElement();

		        	self.initialized = true;

		        	var dlgOptions: JDialogOptions = {
		        		autoOpen: false,
		        		title: "Create New Alias",
		        		height: 190,
		        		width: 340,
		        		buttons: {
		        			"Create New Alias": function() {
		        				self._createNewAlias();
		        			},
		        			"Cancel": function() {
		        				JDialog.cur.jdialog("close");
		        			}
		        		},
		        		close: function(evt: JQEvent, ui: UIJDialog): Void {
		        			selfElement.find(".placeholder").removeClass("ui-state-error");
		        		}
		        	};
		        	selfElement.jdialog(dlgOptions);
		        },

		        _setUser: function(user: User): Void {
		        	var self: NewAliasCompWidgetDef = Widgets.getSelf();

		        	self.user = user;
	        	},

	        	open: function(): Void {
		        	var self: NewAliasCompWidgetDef = Widgets.getSelf();
					var selfElement: JDialog = Widgets.getSelfElement();

		        	if(!self.initialized) {
		        		self._buildDialog();
		        	}
		        	// selfElement.children("#n_label").focus();
		        	// self.input_n.blur();
	        		selfElement.jdialog("open");
        		},
		        
		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.newAliasComp", defineWidget());
	}
}