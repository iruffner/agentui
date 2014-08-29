package m3.jq;

import m3.jq.JQ;
import m3.widget.Widgets;
import m3.log.Logga;

typedef M3DialogOptions = {
	@:optional var autoOpen:Bool;
	@:optional var height:Dynamic;
	@:optional var width: Dynamic;
	@:optional var modal: Bool;
	@:optional var title: String;
	@:optional var buttons: Dynamic;
	@:optional var close: Void->Void;
	@:optional var position: Array<Float>;
	@:optional var showMaximizer: Bool;
	@:optional var showHelp: Bool;
	@:optional var buildHelp: Void->Void;
	@:optional var onMaxToggle: Void->Void;
}

typedef M3DialogWidgetDef = {
	var options: M3DialogOptions;
	@:optional var maxIconWrapper: JQ;
	@:optional var restoreIconWrapper: JQ;
	var originalSize: UISize;
	var _create: Void->Void;
	var restore: Void->Void;
	var maximize: Void->Void;
	var destroy: Void->Void;
}

class M3DialogHelper {
	public static function close(dlg: M3Dialog): Void {
		dlg.m3dialog("close");
	}

	public static function open(dlg: M3Dialog): Void {
		dlg.m3dialog("open");
	}

	public static function isOpen(dlg: M3Dialog): Bool {
		return dlg.m3dialog("isOpen");
	}
}

@:native("$")
extern class M3Dialog extends JQ {
	
	@:overload(function<T>(cmd : String):T{})
	@:overload(function<T>(cmd:String, opt:String, ?newVal: Dynamic):T{})
	function m3dialog(opts: M3DialogOptions): M3Dialog;

	static var cur(get, null): M3Dialog;
	private static inline function get_cur() : M3Dialog {
		return untyped __js__("$(this)");
	}

	private static function __init__(): Void {
		// untyped M3Dialog = window.jQuery;
		var defineWidget: Void->M3DialogWidgetDef = function(): M3DialogWidgetDef {
			return {
		        options: {
		            autoOpen: true
			        , height: 320
			        , width: 320
			        , modal: true
			        , buttons: {
			   //      	"Cancel" : function() {
						// 	M3Dialog.cur.M3Dialog("close");
						// }
			        }
			        , showHelp: false
			        , onMaxToggle: JQ.noop
		        },

		        originalSize: {
		        	width: 10,
		        	height: 10
		        },

		        _create: function(): Void {
		        	cast (JQ.curNoWrap)._super('create');
		        	var self: M3DialogWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
					var closeBtn: JQ = selfElement.prev().find(".ui-dialog-titlebar-close");
					var hovers: JQ = new JQ("blah");
					if(self.options.showHelp && false) {
						if(!Reflect.isFunction(self.options.buildHelp)) {
							Logga.DEFAULT.error("Supposed to show help but buildHelp is not a function");
						} else {
							var helpIconWrapper: JQ = new JQ("<a href='#' class='ui-dialog-titlebar-close ui-corner-all' style='margin-right: 18px;' role='button'>");
							var helpIcon: JQ = new JQ("<span class='ui-icon ui-icon-help'>help</span>");
							hovers = hovers.add(helpIconWrapper);
							helpIconWrapper.append(helpIcon);
							closeBtn.before(helpIconWrapper);
							helpIconWrapper.click(function(evt: JQEvent) {
									self.options.buildHelp();
							});
						}

					}
					if(self.options.showMaximizer) {
						self.maxIconWrapper = new JQ("<a href='#' class='ui-dialog-titlebar-close ui-corner-all' style='margin-right: 18px;' role='button'>");
						var maxIcon: JQ = new JQ("<span class='ui-icon ui-icon-extlink'>maximize</span>");
						hovers = hovers.add(self.maxIconWrapper);
						self.maxIconWrapper.append(maxIcon);
						closeBtn.before(self.maxIconWrapper);
						self.maxIconWrapper.click(function(evt: JQEvent) {
								self.maximize();
						});
					}

					self.restoreIconWrapper = new JQ("<a href='#' class='ui-dialog-titlebar-close ui-corner-all' style='margin-right: 18px; display: none;' role='button'>");
					var restoreIcon: JQ = new JQ("<span class='ui-icon ui-icon-newwin'>restore</span>");
					hovers = hovers.add(self.restoreIconWrapper);
					self.restoreIconWrapper.append(restoreIcon);
					closeBtn.before(self.restoreIconWrapper);
					self.restoreIconWrapper.click(function(evt: JQEvent) {
							self.restore();
					});

					hovers.hover(function(evt: JQEvent) {
							JQ.cur.addClass("ui-state-hover");
						}, function(evt: JQEvent) {
							JQ.cur.removeClass("ui-state-hover");
						}
					);

		        },

		        restore: function() {
		        	var self: M3DialogWidgetDef = Widgets.getSelf();
					var selfElement: M3Dialog = Widgets.getSelfElement();
 
					//restore the orignal dimensions
					selfElement.m3dialog("option", "height", self.originalSize.height);
					selfElement.m3dialog("option", "width", self.originalSize.width);
					selfElement.parent().position({
							my: "middle",
							at:	"middle",
							of:	js.Browser.window
						});
				 
					//swap the buttons
					self.restoreIconWrapper.hide();
					self.maxIconWrapper.show();
					self.options.onMaxToggle();
				},

				maximize: function() { 
					var self: M3DialogWidgetDef = Widgets.getSelf();
					var selfElement: M3Dialog = Widgets.getSelfElement();

					//Store the original height/width
					self.originalSize = { height: selfElement.parent().height(), width: selfElement.parent().width() };
				 	
				 	var window: JQ = new JQ(js.Browser.window);
				 	var windowDimensions: UISize = { height: window.height(), width: window.width() };
					//expand dialog
					// selfElement.parent().css({
					// 		width: windowDimensions.width * .85, 
					// 		height: windowDimensions.height * .85
					// 	});
					selfElement.m3dialog("option", "height", windowDimensions.height * .85);
					selfElement.m3dialog("option", "width", windowDimensions.width * .85);
					selfElement.parent().position({
							my: "middle",
							at:	"middle",
							of:	window
					});
				 
					//swap buttons to show restore
					self.maxIconWrapper.hide();
					self.restoreIconWrapper.show();

					self.options.onMaxToggle();
				},
		        
		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.m3dialog", JQ.ui.dialog, defineWidget());
	}
}