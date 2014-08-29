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

typedef SelectWidgetDef = {
	@:optional var options: QuestionCompOptions;
	var _create: Void->Void;
	var result: Void->String;
	var destroy: Void->Void;
	@:optional var label: JQ;
	@:optional var input: JQ;
}

class SelectHelper {
	public static function result(s: Select): String {
		return s.selectComp("result");
	}
}

@:native("$")
extern class Select extends JQ {
	@:overload(function(cmd : String):String{})
	@:overload(function(cmd : String, arg: Dynamic):Dynamic{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function selectComp(opts: QuestionCompOptions): Select;

	private static function __init__(): Void {
		
		var defineWidget: Void->SelectWidgetDef = function(): SelectWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: SelectWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of SelectComp must be a div element");
		        	}

		        	selfElement.addClass("_selectComp center");

		        	var question: Question = self.options.question;

	        		self.label = new JQ("<label for='quest" + question.uid + "'>" + question.text + "</label>").appendTo(selfElement);
	        		// var multi: String = self.options.multi ? " multiple ": "";
	        		var multi: String = "";
	        		self.input = new JQ("<select name='" + question.uid + "' id='quest" + question.uid + "'" + multi + "><option value=''>Please choose..</option></select>");

	        		var response: Answer = self.options.answers.hasValues() ? self.options.answers[0] : null;
		        	for(ans_ in 0...question.options.length) {
		        		var answer: Choice = question.options[ans_];
		        		var option: JQ = new JQ("<option></option>")
		        								.attr("value", answer.value)
		        								.appendTo(self.input)
		        								.append(answer.text);
		        		if(response != null && answer.value == response.response) option.attr("selected", "selected");
		        	}
	        		selfElement.append(self.input);
		        },

		        result: function(): String {
		        	var self: SelectWidgetDef = Widgets.getSelf();
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
		JQ.widget( "ui.selectComp", defineWidget());
	}
}