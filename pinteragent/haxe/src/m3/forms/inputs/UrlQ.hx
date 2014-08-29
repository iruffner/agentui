package ui.widgets.qtype;

import m3.jq.JQ;

import m3.widget.Widgets;

import m3.exception.Exception;
import m3.log.Logga;
import ui.exception.ValidationException;

import ui.model.BModel;
import ui.pages.Pages;
import ui.widgets.targets.QuestionComp;

using m3.helper.StringHelper;
using m3.helper.ArrayHelper;
using Lambda;


typedef UrlQWidgetDef = {
	@:optional var options: QuestionCompOptions;
	var _create: Void->Void;
	var result: Void->Void;
	var destroy: Void->Void;

	@:optional var clicked: Bool;
}

class UrlQHelper {
	public static function result(cb: UrlQ): Array<String> {
		return cb.urlQ("result");
	}
}

@:native("$")
extern class UrlQ extends JQ {
	@:overload(function<T>(cmd : String):T{})
	@:overload(function(cmd : String, arg: Dynamic):Dynamic{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function urlQ(opts: QuestionCompOptions): UrlQ;

	private static function __init__(): Void {
		
		var defineWidget: Void->UrlQWidgetDef = function(): UrlQWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: UrlQWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of UrlQ must be a div element");
		        	}

		        	selfElement.addClass("_urlQ center");

		        	var question: Question = self.options.question;

		        	selfElement.append(question.text);

	        		selfElement.append("<br/><a href='" + question.options[0].value + "' target='_blank'>" + question.options[0].text + "</a>");
		        },

		        result: function(): Void {
					
	        	},

		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.urlQ", defineWidget());
	}
}