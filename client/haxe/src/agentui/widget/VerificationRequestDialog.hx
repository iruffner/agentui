package agentui.widget;

import js.html.Element;

import m3.jq.JQ;
import m3.jq.JQDialog;
import m3.widget.Widgets;
import qoid.model.ModelObj;
import agentui.model.EM;
import m3.exception.Exception;
using m3.helper.StringHelper;
import qoid.Qoid;

typedef VerificationRequestDialogOptions = {
	@:optional var content:Content<Dynamic>;
}

typedef VerificationRequestDialogWidgetDef = {
	@:optional var options: VerificationRequestDialogOptions;

	var initialized: Bool;

	var _buildDialog: Void->Void;
	var _sendRequest: Void->Void;
	var open: Void->Void;
	var _createConnectionSelection: Connection->JQ->Void;

	var _create: Void->Void;
	var destroy: Void->Void;
}

@:native("$")
extern class VerificationRequestDialog extends JQ {

	@:overload(function<T>(cmd : String):T{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function verificationRequestDialog(opts: VerificationRequestDialogOptions): VerificationRequestDialog;

	private static function __init__(): Void {
		var defineWidget: Void->VerificationRequestDialogWidgetDef = function(): VerificationRequestDialogWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: VerificationRequestDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQDialog = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of VerificationRequestDialog must be a div element");
		        	}

		        	selfElement.addClass("verificationRequestDialog").hide();

		        	var uberDiv = new JQ("<div style='text-align:left'></div>");
		        	selfElement.append(uberDiv);

		        	uberDiv.append("<h3>Request Verification From:</h3>");
		        	var connectionContainer = new JQ("<div class='container' style='width:450px;height:135px;overflow:auto;'></div>");
		        	uberDiv.append(connectionContainer);

		        	for (conn in Qoid.groupedConnections.delegate().get(Qoid.currentAlias.iid)) {
						self._createConnectionSelection(conn, connectionContainer);
					}

		        	uberDiv.append("<h3>Message:</h3>");
		        	uberDiv.append("<textarea id='vr_message' style='width:450px;'></textarea>");
		        },

		        _createConnectionSelection: function(connection:Connection, connectionContainer:JQ): Void {
	        		var connComp = new JQ("<div class='connection-selection' connection_name='" + connection.data.name + "'></div>");
	        		connComp.append("<input type='checkbox' class='conn_cb' id='cb_" + connection.iid + "'/>");
		        	var avatar = new ConnectionAvatar("<div class='avatar'></div>").connectionAvatar({
		        		connectionIid: connection.iid,
		        		dndEnabled: false,
		        		isDragByHelper: true,
		        		containment: false
	        		}).appendTo(connComp).css("display", "inline");

		        	connComp.append("<div class='labelDiv' style='display:inline'>" + connection.data.name + "</div>");

    				var found:Bool = false;
        			var concomps = connectionContainer.find(".connection-selection");
        			concomps.each(function(i: Int, dom: Element): Void {
        				if (!found) {
            				var comp:JQ = new JQ(dom);
            				if (comp.attr("connection_name") > connection.data.name) {
            					connComp.insertBefore(comp);
            					found = true;
            				}
            			}
        			});
        			if (!found){
            			connectionContainer.append(connComp);
        			}

		        },

		        initialized: false,

		        _sendRequest: function(): Void {
		        	var self: VerificationRequestDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQDialog = Widgets.getSelfElement();

					// TODO: validation

					// Get the checked verifiers
					var connectionIids = new Array<String>();
					new JQ(".conn_cb").each(function(i: Int, dom: Element):Void {
						var cb = new JQ(dom);
						if (cb.prop("checked")) {
							connectionIids.push(cb.attr("id").split("_")[1]);
						}
					});

					var vr = new VerificationRequest(self.options.content, connectionIids, new JQ("#vr_message").val());

					EM.listenOnce("onVerificationRequest", function(n:{}):Void{
						selfElement.dialog("close");
					});

					EM.change(EMEvent.VerificationRequest, vr);
	        	},

		        _buildDialog: function(): Void {
		        	var self: VerificationRequestDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQDialog = Widgets.getSelfElement();

		        	if (self.initialized) {return;}

		        	self.initialized = true;

		        	var dlgOptions: JQDialogOptions = {
		        		autoOpen: false,
		        		title: "Verification Request",
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
		        	var self: VerificationRequestDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQDialog = Widgets.getSelfElement();

					if (selfElement.exists()) {
						selfElement.empty();
						self._create();
					}
		        	self._buildDialog();

	        		selfElement.dialog("open");
        		},
		        
		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.verificationRequestDialog", defineWidget());
	}
}