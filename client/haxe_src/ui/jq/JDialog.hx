package ui.jq;

import ui.jq.JQ;
import ui.widget.Widgets;

typedef UIJDialog = {
	helper: JQ, 
	position: UIPosition, 
	offset: UIPosition
}

typedef JDialogOptions = {
	@:optional var autoOpen:Bool;
	@:optional var height:Dynamic;
	@:optional var width: Dynamic;
	@:optional var modal: Bool;
	@:optional var title: String;
	@:optional var buttons: Dynamic;
	@:optional var beforeClose: JQEvent->UIJDialog->Dynamic;
	@:optional var close: JQEvent->UIJDialog->Void;
	@:optional var position: Array<Float>;
	@:optional var showHelp: Bool;
	@:optional var buildHelp: Void->Void;
}

typedef JDialogWidgetDef = {
	var options: JDialogOptions;
	var _create: Void->Void;
	var destroy: Void->Void;
}

extern class JDialog extends JQ {
	
	@:overload(function(cmd : String):Bool{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function jdialog(opts: JDialogOptions): JDialog;

	static var cur(get, null): JDialog;
	private static inline function get_cur() : JDialog {
		return untyped __js__("$(this)");
	}

	private static function __init__(): Void {
		untyped JDialog = window.jQuery;
		var defineWidget: Void->JDialogWidgetDef = function(): JDialogWidgetDef {
			return {
		        options: {
		            autoOpen: true
			        , height: 320
			        , width: 320
			        , modal: true
			        , buttons: {
			   //      	"Cancel" : function() {
						// 	JDialog.cur.JDialog("close");
						// }
			        }
			        , showHelp: false
		        },
		        
		        _create: function(): Void {
		        	cast (JQ.curNoWrap)._super('create');
		        	var self: JDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
					if(self.options.showHelp) {
						if(!Reflect.isFunction(self.options.buildHelp)) {
							AgentUi.LOGGER.error("Supposed to show help but buildHelp is not a function");
						} else {
							var helpIconWrapper: JQ = new JQ("<a href='#' class='ui-dialog-titlebar-close ui-corner-all' style='right: 1.5em;' role='button'>");
							var helpIcon: JQ = new JQ("<span class='ui-icon ui-icon-help'>close</span>");
							helpIconWrapper.hover(function(evt: js.JQuery.JqEvent) {
									JQ.cur.addClass("ui-state-hover");
								}, function(evt: js.JQuery.JqEvent) {
									JQ.cur.removeClass("ui-state-hover");
								}
							);

							helpIconWrapper.append(helpIcon);
							selfElement.prev().find(".ui-dialog-titlebar-close").before(helpIconWrapper);
							helpIconWrapper.click(function(evt: js.JQuery.JqEvent) {
									self.options.buildHelp();
								});
						}
					}
		        },
		        
		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.jdialog", JQ.ui.dialog, defineWidget());
	}
}