package ui.widget;

import m3.jq.JQ;
import m3.jq.JDialog;
import m3.widget.Widgets;
import ui.model.ModelObj;
import ui.model.EM;
import m3.exception.Exception;

using m3.helper.StringHelper;

typedef RequestIntroductionDialogOptions = {
	@:optional var from:Connection;
	@:optional var to:Connection;
}

typedef RequestIntroductionDialogWidgetDef = {
	@:optional var options: RequestIntroductionDialogOptions;

	var initialized: Bool;

	var _buildDialog: Void->Void;
	var open: Void->Void;
	var _requestIntroduction: Void->Void;
	var _appendConnectionAvatar: Connection->JQ->Void;

	var _create: Void->Void;
	var destroy: Void->Void;
}

@:native("$")
extern class RequestIntroductionDialog extends JQ {

	@:overload(function(cmd : String):Bool{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function requestIntroductionDialog(opts: RequestIntroductionDialogOptions): RequestIntroductionDialog;

	private static function __init__(): Void {
		var defineWidget: Void->RequestIntroductionDialogWidgetDef = function(): RequestIntroductionDialogWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: RequestIntroductionDialogWidgetDef = Widgets.getSelf();
					var selfElement: JDialog = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of RequestIntroductionDialog must be a div element");
		        	}

		        	selfElement.addClass("requestIntroductionDialog").hide();

		        	var connections: JQ = new JQ("<div></div>").appendTo(selfElement);
		        	connections.append("<div class='labelDiv' style='display:inline'>Introduce&nbsp;&nbsp;</div>");

		        	self._appendConnectionAvatar(self.options.to, connections);
		        	
		        	connections.append("<div class='labelDiv' style='display:inline'>&nbsp;to&nbsp;</div>");

		        	self._appendConnectionAvatar(self.options.from, connections);
		        	connections.append("<div class='labelDiv'>&nbsp;</div>");

		        	var toName = self.options.to.name();
		        	var fromName = self.options.from.name();

		        	var ridTitle:JQ = new JQ("<div style='display:table-row;'></div>").appendTo(selfElement);
		        	ridTitle.append("<div style='width:270px;font-size:12px;display:table-cell;text-align:left;'>Introduction Message for " + toName + "</div>");
		        	ridTitle.append("<div class='labelDiv' style='width:270px;font-size:12px;display:table-cell;text-align:right;'><input type='checkbox' id='same_messsage' checked='checked'>Same Message for " + fromName + "</div>");

		        	var ridTa:JQ = new JQ("<div style='display:table-row;'></div>").appendTo(selfElement);
		        	var divTa1:JQ = new JQ("<div style='display:table-cell;width:270px;height:140px;'></div>").appendTo(ridTa);
		        	
					var ta1: JQ = new JQ("<textarea class='boxsizingBorder container' style='resize:none;font-size:12px;width:100%;height:100%;'></textarea>")
 	  		        				.appendTo(divTa1)
 	  		        				.attr("id", "ta1")
 	  		        				.html("Hi " + toName + " & " + fromName + ",\nHere's an introduction for the two of you to connect.\nwith love,\n" + AgentUi.USER.userData.name);

		        	var divTa2:JQ = new JQ("<div style='display:table-cell;width:270px;height:140px;text-align:right;padding-left: 7px;'></div>").appendTo(ridTa);
					var ta2: JQ = new JQ("<textarea class='boxsizingBorder container' style='resize: none;font-size:12px;width:100%;height:100%;' readonly='readonly'></textarea>")
 	  		        				.appendTo(divTa2)
 	  		        				.attr("id", "ta2")
 	  		        				.html(ta1.html());
		        },

		        _appendConnectionAvatar: function(connection:Connection, parent:JQ): Void {
		        	var avatar = new ConnectionAvatar("<div class='avatar'></div>").connectionAvatar({
		        		connection: connection,
		        		dndEnabled: false,
		        		isDragByHelper: true,
		        		containment: false
	        		}).appendTo(parent).css("display", "inline");

		        	parent.append("<div class='labelDiv' style='display:inline'>" + connection.name() + "</div>");
		        },

		        initialized: false,

		        _requestIntroduction: function(): Void {
		        	var self: RequestIntroductionDialogWidgetDef = Widgets.getSelf();
					var selfElement: JDialog = Widgets.getSelfElement();
	        	},

		        _buildDialog: function(): Void {
		        	var self: RequestIntroductionDialogWidgetDef = Widgets.getSelf();
					var selfElement: JDialog = Widgets.getSelfElement();

		        	if (self.initialized) {return;}

		        	self.initialized = true;

		        	var dlgOptions: JDialogOptions = {
		        		autoOpen: false,
		        		title: "Introduction Request",
		        		height: 400,
		        		width: 600,
		        		buttons: {
		        			"Send": function() {
		        				self._requestIntroduction();
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

	        	open: function(): Void {
		        	var self: RequestIntroductionDialogWidgetDef = Widgets.getSelf();
					var selfElement: JDialog = Widgets.getSelfElement();

					if (selfElement.exists()) {
						selfElement.empty();
						self._create();
					}
		        	self._buildDialog();

		        	// selfElement.children("#n_label").focus();
		        	// self.input_n.blur();
	        		selfElement.jdialog("open");
        		},
		        
		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.requestIntroductionDialog", defineWidget());
	}
}