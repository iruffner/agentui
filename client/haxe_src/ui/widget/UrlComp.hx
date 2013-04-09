package ui.widget;

import ui.jq.JQ;
// import js.html.FileReader;
// import js.html.File;

using ui.helper.ArrayHelper;


typedef UrlCompOptions = {
}

typedef UrlCompWidgetDef = {
	@:optional var options: UrlCompOptions;
	var _create: Void->Void;
	var destroy: Void->Void;

	@:optional var urlInput: JQ;
	var _post: Void->Void;
}

extern class UrlComp extends JQ {

	private static var API_KEY: String = "2e63db21c89b06a54fd2eac5fd96e488";


	@:overload(function(cmd : String):Bool{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function urlComp(?opts: UrlCompOptions): UrlComp;

	private static function __init__(): Void {
		untyped UrlComp = window.jQuery;
		var defineWidget: Void->UrlCompWidgetDef = function(): UrlCompWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: UrlCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new ui.exception.Exception("Root of UrlComp must be a div element");
		        	}

		        	selfElement.addClass("urlComp container " + Widgets.getWidgetClasses());
		        	new JQ("<label class='fleft ui-helper-clearfix' style='margin-left: 5px;'>Enter URL</label>").appendTo(selfElement);
		        	self.urlInput = new JQ("<input id='' class='clear textInput boxsizingBorder' style='float: left;margin-top: 5px;'/>").appendTo(selfElement);

		        	// urlInput.blur(function(evt: JQEvent): Void {
		        	// 		self.load
		        	// 	});
		        },

		        _post: function() {
		        	var self: UrlCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

					ui.AgentUi.LOGGER.debug("post " + self.urlInput.val());
				},

		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.urlComp", defineWidget());
	}
}