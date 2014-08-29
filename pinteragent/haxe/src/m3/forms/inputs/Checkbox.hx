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


typedef CheckboxWidgetDef = {
	@:optional var options: QuestionCompOptions;
	var _create: Void->Void;
	var result: Void->Array<String>;
	var destroy: Void->Void;
}

class CheckboxHelper {
	public static function result(cb: Checkbox): Array<String> {
		return cb.checkbox("result");
	}
}

@:native("$")
extern class Checkbox extends JQ {
	@:overload(function<T>(cmd : String):T{})
	@:overload(function(cmd : String, arg: Dynamic):Dynamic{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function checkbox(opts: QuestionCompOptions): Checkbox;

	private static function __init__(): Void {
		
		var defineWidget: Void->CheckboxWidgetDef = function(): CheckboxWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: CheckboxWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of Checkbox must be a div element");
		        	}

		        	selfElement.addClass("_checkbox center");

		        	var question: Question = self.options.question;

	        		var fieldset: JQ = new JQ(	"<fieldset data-role='controlgroup'>" + 
		        									"<legend>" + question.text + "</legend>" + 
		        								"</fieldset>").appendTo(selfElement);


		        	for(ans_ in 0...question.options.length) {
		        		var choice: Choice = question.options[ans_];
		        		var input: JQ = new JQ( "<input type='checkbox'/>" )
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

		        result: function(): Array<String> {
					var self: CheckboxWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
					var selections: JQ = new JQ(":checked", selfElement);
					var value: Array<String> = {
						if(selections.exists()) {
							Lambda.map(selections,
								function(elem: JQ): String {
										return elem.val();
									}
							).array();
						} else null;
					}
					if(!value.hasValues() && self.options.question.required) {
						throw new ValidationException(self.options.question.uid + " is required");
					} else if(!value.hasValues()) {
						return null;
					} else {
						return value;
					}
	        	},

		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.checkbox", defineWidget());
	}
}