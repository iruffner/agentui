package ui.widgets.qtype;

import js.html.VideoElement;

import m3.jq.JQ;
import m3.widget.Widgets;

import m3.exception.Exception;
import m3.log.Logga;

import ui.exception.ValidationException;

import ui.model.BModel;
import ui.pages.Pages;
import ui.widgets.targets.QuestionComp.QuestionCompOptions;

using m3.helper.StringHelper;
using m3.helper.ArrayHelper;

typedef TextareaWidgetDef = {
	@:optional var options: QuestionCompOptions;
	var _create: Void->Void;
	var result: Void->String;
	var destroy: Void->Void;
	@:optional var label: JQ;
	@:optional var input: JQ;
}

class TextareaHelper {
	public static function result(s: Textarea): String {
		return s.textarea("result");
	}
}

@:native("$")
extern class Textarea extends JQ {
	@:overload(function(cmd : String):String{})
	@:overload(function(cmd : String, arg: Dynamic):Dynamic{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function textarea(opts: QuestionCompOptions): Textarea;

	private static function __init__(): Void {
		
		var defineWidget: Void->TextareaWidgetDef = function(): TextareaWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: TextareaWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of TextareaComp must be a div element");
		        	}

		        	selfElement.addClass("_textarea center");

		        	var question: Question = self.options.question;

	        		self.label = new JQ("<label for='quest" + question.uid + "'>" + question.text + "</label>").appendTo(selfElement);
	        		// var multi: String = self.options.multi ? " multiple ": "";
	        		var multi: String = "";
	        		self.input = new JQ("<textarea name='" + question.uid + "' id='quest" + question.uid + "'></textarea>");
	        		if(self.options.answers.hasValues()) self.input.val(self.options.answers[0].response);
		        	
	        		selfElement.append(self.input);
		        },

		        result: function(): String {
		        	var self: TextareaWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
					var value: String = self.input.val();
					if(value.isBlank() && self.options.question.required) {
						throw new ValidationException(self.options.question.uid + " is required");
						self.label.css("color", "red");
					} else if(value.isBlank()) {
						return "";
					} else {
						return value;
					}
	        	},

		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.textarea", defineWidget());
	}
}