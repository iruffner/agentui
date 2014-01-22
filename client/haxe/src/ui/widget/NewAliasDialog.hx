package ui.widget;

import m3.jq.JQ;
import m3.widget.Widgets;
import ui.model.ModelObj;
import ui.model.EM;
import m3.exception.Exception;

using m3.helper.StringHelper;
using m3.jq.JQDialog;

typedef NewAliasDialogOptions = {
}

typedef NewAliasDialogWidgetDef = {
	@:optional var options: NewAliasDialogOptions;

	@:optional var aliasName: JQ;
	@:optional var username: JQ;
	
	var initialized: Bool;

	var _buildDialog: Void->Void;
	var open: Void->Void;
	var _createNewAlias: Void->Void;

	var _create: Void->Void;
	var destroy: Void->Void;
}

@:native("$")
extern class NewAliasDialog extends JQ {

	@:overload(function<T>(cmd : String):T{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function newAliasDialog(?opts: NewAliasDialogOptions): NewAliasDialog;

	private static function __init__(): Void {
		var defineWidget: Void->NewAliasDialogWidgetDef = function(): NewAliasDialogWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: NewAliasDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQDialog = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of NewAliasDialog must be a div element");
		        	}

		        	selfElement.addClass("_newAliasDialog").hide();

		        	var labels: JQ = new JQ("<div class='fleft'></div>").appendTo(selfElement);
		        	var inputs: JQ = new JQ("<div class='fleft'></div>").appendTo(selfElement);

		        	labels.append("<div class='labelDiv' style='margin-top: 3px; margin-right: 6px;'><label id='n_label' for='newu_n'>Alias Name:</label></div>");
		        	labels.append("<div class='labelDiv' style='margin-top: 3px; margin-right: 6px;'><label id='n_label' for='newu_n'>User Name:</label></div>");

		        	self.aliasName = new JQ("<input id='newu_n' class='ui-corner-all ui-state-active ui-widget-content'>").appendTo(inputs);
		        	inputs.append("<br/>");
		        	self.username = new JQ("<input id='username' class='ui-corner-all ui-state-active ui-widget-content'>").appendTo(inputs);

		        	inputs.children("input").keypress(function(evt: JQEvent): Void {
	        			if(evt.keyCode == 13) {
	        				self._createNewAlias();
	        			}
	        		});
		        },

		        initialized: false,

		        _createNewAlias: function(): Void {
		        	var self: NewAliasDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQDialog = Widgets.getSelfElement();

    				var alias: Alias = new Alias();
    				alias.name = self.aliasName.val();
    				alias.data.name = self.username.val();
					if (alias.data.name.isBlank() || alias.name.isBlank()) {
						return;
					}

    				selfElement.find(".ui-state-error").removeClass("ui-state-error");
    				EM.change(EMEvent.ALIAS_CREATE, alias);

    				EM.listenOnce(EMEvent.NewAlias, new EMListener(function(n:Nothing): Void {
    						selfElement.close();
    						AppContext.AGENT.aliasSet.add(alias);
    						AppContext.AGENT.currentAlias = alias;
    						EM.change(EMEvent.AliasLoaded, alias);
    					}, "NewAliasDialog-NewAlias")
    				);
	        	},

		        _buildDialog: function(): Void {
		        	var self: NewAliasDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQDialog = Widgets.getSelfElement();

		        	self.initialized = true;

		        	var dlgOptions: JQDialogOptions = {
		        		autoOpen: false,
		        		title: "Create New Alias",
		        		height: 190,
		        		width: 340,
		        		buttons: {
		        			"Create New Alias": function() {
		        				self._createNewAlias();
		        			},
		        			"Cancel": function() {
		        				JQDialog.cur.dialog("close");
		        			}
		        		},
		        		close: function(evt: JQEvent, ui: UIJQDialog): Void {
		        			selfElement.find(".placeholder").removeClass("ui-state-error");
		        		}
		        	};
		        	selfElement.dialog(dlgOptions);
		        },

	        	open: function(): Void {
		        	var self: NewAliasDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQDialog = Widgets.getSelfElement();

		        	if(!self.initialized) {
		        		self._buildDialog();
		        	}
		        	// selfElement.children("#n_label").focus();
		        	// self.aliasName.blur();
	        		selfElement.open();
        		},
		        
		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.newAliasDialog", defineWidget());
	}
}