package ui.widgets.qtype;

import js.html.VideoElement;

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

typedef RadioWidgetDef = {
	@:optional var options: QuestionCompOptions;
	var _create: Void->Void;
	var result: Void->String;
	var destroy: Void->Void;
	@:optional var legend: JQ;
}

class RadioHelper {
	public static function result(r: Radio): String {
		return r.radio("result");
	}
}

@:native("$")
extern class Radio extends JQ {
	@:overload(function<T>(cmd : String):T{})
	@:overload(function(cmd : String, arg: Dynamic):Dynamic{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function radio(opts: QuestionCompOptions): Radio;

	private static function __init__(): Void {
		
		var defineWidget: Void->RadioWidgetDef = function(): RadioWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: RadioWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of Radio must be a div element");
		        	}

		        	selfElement.addClass("_radio center");

		        	var question: Question = self.options.question;

		        	var fieldset: JQ = new JQ(	"<fieldset data-role='controlgroup' data-type='horizontal'>" + 
		        								"</fieldset>").appendTo(selfElement);

					self.legend = new JQ("<legend>" + question.text + "</legend>").appendTo(fieldset);

		        	for(ans_ in 0...question.options.length) {
		        		var choice: Choice = question.options[ans_];
		        		var input: JQ = new JQ( "<input type='radio'/>" )
		        								.attr("name", "quest" + question.uid)
		        								.attr("id", "ans" + choice.uid)
		        								.attr("value", choice.value);
		        		fieldset.append(input)
		        				.append("<label for='ans" + choice.uid + "'>" + choice.text + "</label>");

		        		if(self.options.answers.hasValues() && self.options.answers.containsComplex(choice.value, function(ans: Answer): String {
									if(ans.question_uid == question.uid) return ans.response;
									else return "nowaynohow";
								})) {
								input.attr("checked", "checked");
							}
		        	}
		        },

		        result: function(): String {
		        	var self: RadioWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
					var value: String = new JQ(":checked", selfElement).val();
					if(value.isBlank() && self.options.question.required) {
						throw new ValidationException(self.options.question.uid + " is required");
						self.legend.css("color", "red");
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
		JQ.widget( "ui.radio", defineWidget());
	}
}