package ui.widget;

import m3.jq.JQ;
import m3.jq.JQDialog;
import m3.widget.Widgets;
import ui.model.ModelObj;
import ui.model.EM;
import m3.exception.Exception;
import ui.api.ProtocolMessage;
using m3.helper.StringHelper;

typedef RequestIntroductionDialogOptions = {
	@:optional var from:Connection;
	@:optional var to:Connection;
}

typedef RequestIntroductionDialogWidgetDef = {
	@:optional var options: RequestIntroductionDialogOptions;

	var initialized: Bool;

	var _buildDialog: Void->Void;
	var _sendRequest: Void->Void;
	var open: Void->Void;
	var _appendConnectionAvatar: Connection->JQ->Void;

	var _create: Void->Void;
	var destroy: Void->Void;
}

@:native("$")
extern class RequestIntroductionDialog extends JQ {

	@:overload(function<T>(cmd : String):T{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function requestIntroductionDialog(opts: RequestIntroductionDialogOptions): RequestIntroductionDialog;

	private static function __init__(): Void {
		var defineWidget: Void->RequestIntroductionDialogWidgetDef = function(): RequestIntroductionDialogWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: RequestIntroductionDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQDialog = Widgets.getSelfElement();
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

		        	var ridTitle:JQ = new JQ("<div class='rid_row'></div>").appendTo(selfElement);
		        	var introDiv = new JQ("<div class='rid_cell' style='text-align:left;'>Introduction Message for " + toName + "</div>")
		        	               .appendTo(ridTitle);
		        	var sameDiv = new JQ("<div class='rid_cell' id='same_messsage_div' style='text-align:right;'>Same Message for " + fromName + "</div>")
		        	               .appendTo(ridTitle);
		        	
		        	var cb:JQ = new JQ("<input type='checkbox' id='same_messsage' checked='checked'>")
		        				.prependTo(sameDiv)
		        				.change(function(evt){
		        					var tgt = new JQ(evt.target);
		        					var from_text = new JQ("#from_text");
		        					var to_text = new JQ("#to_text");
		        					to_text.prop("readonly", tgt.prop("checked"));
		        					if (tgt.prop("checked")) {
		        						to_text.val(from_text.val());
		        					}
		        				});
		        	cb.prop("checked", true);

		        	var ridTa:JQ = new JQ("<div class='rid_row'></div>").appendTo(selfElement);

		        	var from_text_changed = function(evt) {
						var same_messsage = new JQ("#same_messsage");
						if (same_messsage.prop("checked")) {
							var from_text = new JQ("#from_text");
    						var to_text = new JQ("#to_text");
							to_text.val(from_text.val());
						}
		        	};

		        	var divTa1:JQ = new JQ("<div class='rid_cell' style='height:140px;'></div>").appendTo(ridTa);
					var from_text: JQ = new JQ("<textarea class='boxsizingBorder container rid_ta'></textarea>")
 	  		        				.appendTo(divTa1)
 	  		        				.attr("id", "from_text")
 	  		        				.keyup(from_text_changed)
 	  		        				.val("Hi " + toName + " & " + fromName + ",\nHere's an introduction for the two of you to connect.\nwith love,\n" + AppContext.USER.userData.name);

		        	var divTa2:JQ = new JQ("<div class='rid_cell' style='height:140px;text-align:right;padding-left: 7px;'></div>").appendTo(ridTa);
					var to_text: JQ = new JQ("<textarea class='boxsizingBorder container rid_ta' readonly='readonly'></textarea>")
 	  		        				.appendTo(divTa2)
 	  		        				.attr("id", "to_text")
 	  		        				.val(from_text.val());
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

		        _sendRequest: function(): Void {
		        	var self: RequestIntroductionDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQDialog = Widgets.getSelfElement();

					// Build out the introduction request message
					var alias:String = AppContext.USER.currentAlias.label;
					var intro: Introduction = new Introduction();
					intro.aConn = self.options.to;
					intro.bConn = self.options.from;
					intro.aMsg = new JQ("#to_text").val();
					intro.bMsg = new JQ("#from_text").val();

    				EM.addListener(EMEvent.INTRODUCTION_RESPONSE, new EMListener(function(n: Nothing): Void {
    					selfElement.dialog("close");
    				}, "RequestIntroductionDialog-Introduction-Response"));

    				EM.change(EMEvent.INTRODUCTION_REQUEST, intro);
	        	},


		        _buildDialog: function(): Void {
		        	var self: RequestIntroductionDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQDialog = Widgets.getSelfElement();

		        	if (self.initialized) {return;}

		        	self.initialized = true;

		        	var dlgOptions: JQDialogOptions = {
		        		autoOpen: false,
		        		title: "Introduction Request",
		        		height: 400,
		        		width: 600,
		        		buttons: {
		        			"Send": function() {
		        				self._sendRequest();
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
		        	var self: RequestIntroductionDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQDialog = Widgets.getSelfElement();

					if (selfElement.exists()) {
						selfElement.empty();
						self._create();
					}
		        	self._buildDialog();

		        	// selfElement.children("#n_label").focus();
		        	// self.input_n.blur();
	        		selfElement.dialog("open");
        		},
		        
		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.requestIntroductionDialog", defineWidget());
	}
}