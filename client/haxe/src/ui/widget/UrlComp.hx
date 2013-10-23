package ui.widget;

import m3.jq.JQ;
import m3.widget.Widgets;
import m3.exception.Exception;
// import js.html.FileReader;
// import js.html.File;

using m3.helper.ArrayHelper;


typedef UrlCompOptions = {
}

typedef UrlCompWidgetDef = {
	@:optional var options: UrlCompOptions;
	var _create: Void->Void;
	var destroy: Void->Void;
	var valEle: Void->JQ;

	@:optional var urlInput: JQ;
	var _post: Void->Void;
}

@:native("$")
extern class UrlComp extends JQ {

	private static var API_KEY: String;


	@:overload(function(cmd : String):Bool{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function urlComp(?opts: UrlCompOptions): UrlComp;

	private static function __init__(): Void {
		var defineWidget: Void->UrlCompWidgetDef = function(): UrlCompWidgetDef {
			return {
		        _create: function(): Void {
		        	UrlComp.API_KEY = "2e63db21c89b06a54fd2eac5fd96e488";
		        	var self: UrlCompWidgetDef = Widgets.getSelf();
					var selfElement: UrlComp = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of UrlComp must be a div element");
		        	}

		        	selfElement.addClass("urlComp container " + Widgets.getWidgetClasses());
		        	new JQ("<label class='fleft ui-helper-clearfix' style='margin-left: 5px;'>Enter URL</label>").appendTo(selfElement);
		        	self.urlInput = new JQ("<input id='' class='clear textInput boxsizingBorder' style='float: left;margin-top: 5px;'/>")
		        		.appendTo(selfElement);
		        },

		        _post: function() {
		        	var self: UrlCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

					ui.AgentUi.LOGGER.debug("post " + self.urlInput.val());
				},

		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        },

		        valEle: function(): JQ {
		        	var self: UrlCompWidgetDef = Widgets.getSelf();
		        	return self.urlInput;
		        }
		    };
		}
		JQ.widget( "ui.urlComp", defineWidget());
	}
}