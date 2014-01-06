package ui.widget;

import m3.exception.Exception;
import m3.jq.JQ;
import m3.jq.M3Dialog;
import m3.widget.Widgets;
import ui.model.ModelObj;
import ui.model.EM;
import ui.api.ProtocolMessage;

using m3.helper.StringHelper;
using m3.helper.ArrayHelper;

typedef RestoreWidgetOptions = {
}

typedef RestoreWidgetDef = {
	@:optional var options: RestoreWidgetOptions;
	var _create: Void->Void;
	var destroy: Void->Void;
	var open: Void->Void;
	@:optional var container: JQ;
	@:optional var inputContainer: JQ;

	@:optional var _data: Map<String, String>;
}

@:native("$")
extern class RestoreWidget extends JQ {

	@:overload(function<T>(cmd : String):T{})
	@:overload(function<T>(cmd:String, opt:String, newVal:Dynamic):T{})
	function restoreWidget(?opts: RestoreWidgetOptions): RestoreWidget;

	private static function __init__(): Void {
		var defineWidget: Void->RestoreWidgetDef = function(): RestoreWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: RestoreWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of RestoreWidget must be a div element");
		        	}

		        	selfElement.addClass("RestoreWidget");
		        	self.container = new JQ("<div class=''></div>");
		        	selfElement.append(self.container);
		        	self.inputContainer = new JQ("<div class='' style='margin-top: 15px;'></div>");
		        	selfElement.append(self.inputContainer);
		        	
        			new JQ("<button>Backup</button>")
        					.button()
        					.click(function(evt: JQEvent): Void {
        							self.inputContainer.empty();
        							self.inputContainer.append("<h3>Backup Options</h3>")
        									.append("<label>Name of Backup</label>");
        							var name: JQ = new JQ("<input style='width: 80%;' class='ui-corner-all ui-widget-content'/>").appendTo(self.inputContainer);
        							var submit: JQ = new JQ("<button>Submit Backup</button>")
        												.appendTo(self.inputContainer)
        												.click(function(evt: JQEvent): Void {
        													if(m3.CrossMojo.confirm()("Perform Backup?")) {
        														cast(selfElement, M3Dialog).m3dialog("close");
        														EM.change(EMEvent.BACKUP);
        													}
        												// 		if(name.val().isBlank()) {
        												// 			js.Lib.alert("Please specify a name for this backup");
        												// 			return;
        												// 		}
        												// 		cast(selfElement, M3Dialog).m3dialog("close");
	       												// 		EM.change(EMEvent.BACKUP, name.val());
        													});
        						})
        					.appendTo(self.container);

        			new JQ("<button>Restore</button>")
        					.button()
        					.click(function(evt: JQEvent): Void {
        							if(m3.CrossMojo.confirm()("Restore from backup?")) {
										cast(selfElement, M3Dialog).m3dialog("close");
										EM.change(EMEvent.RESTORE);
									}
        							// self.inputContainer.empty();
        							// self.inputContainer.append("<h3>Restore Options</h3>")
        							// 		.append("<label style='text-decoration: underline; font-weight: bold;'>Available Backups</label><br/>");
        							// var table: JQ = new JQ("<div style='width: 90%; margin: auto;'></div>").appendTo(self.inputContainer);
        							// table.append("Requesting available backups...");
        							// EM.listenOnce(EMEvent.AVAILABLE_BACKUPS, new EMListener(
        							// 	function(backups: Array<String>): Void {
        							// 		table.empty();
		        					// 		if(!backups.hasValues()) {
		        					// 			table.append("No backups available");
		        					// 		} else {
		        					// 			for(i_ in 0...backups.length) {
		        					// 				var name: String = backups[i_];
		        					// 				table.append(
		        					// 						new JQ("<span style='cursor: pointer;'>" + name + "</span>").click(function(evt: JQEvent): Void {
		        					// 								if(m3.CrossMojo.confirm()("Restore " + name + "?")) {
		        					// 									cast(selfElement, M3Dialog).m3dialog("close");
		        					// 									EM.change(EMEvent.RESTORE, name);
		        					// 								}
		        					// 							})
		        					// 					);
		        					// 				table.append("</br>");
		        					// 			}
		        					// 		}
        							// 	}, "RestoreWidget-AvailableBackups")
        							// );
        							// EM.change(EMEvent.RESTORES_REQUEST);
        						})
        					.appendTo(self.container);

					cast(selfElement, M3Dialog).m3dialog({
							autoOpen: false,
							title: "Data Backup & Restore"
						});
		        	
		        },

		        open: function() {
					var selfElement: M3Dialog = Widgets.getSelfElement();
					selfElement.m3dialog("open");
	        	},

		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.restoreWidget", defineWidget());
	}
}