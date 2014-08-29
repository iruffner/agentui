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

using m3.helper.StringFormatHelper;
using m3.helper.StringHelper;
using m3.helper.ArrayHelper;

typedef DateWidgetDef = {
	@:optional var options: QuestionCompOptions;
	var _create: Void->Void;
	var result: Void->String;
	var destroy: Void->Void;
	@:optional var label: JQ;
	@:optional var input: JQ;
}

class DateCompHelper {
	public static function result(s: DateComp): String {
		return s.dateComp("result");
	}
}

@:native("$")
extern class DateComp extends JQ {
	@:overload(function(cmd : String):String{})
	@:overload(function(cmd : String, arg: Dynamic):Dynamic{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function dateComp(opts: QuestionCompOptions): DateComp;

	private static function __init__(): Void {
		
		var defineWidget: Void->DateWidgetDef = function(): DateWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: DateWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of DateCompComp must be a div element");
		        	}

		        	selfElement.addClass("_dateComp center");

		        	var question: Question = self.options.question;

	        		self.label = new JQ("<label for='quest" + question.uid + "'>" + question.text + "</label>").appendTo(selfElement);
	        		
	        		self.input = new JQ("<input type='date' name='" + question.uid + "' id='quest" + question.uid + "'/>");

        			try {
	        			if(self.options.answers.hasValues()) {
		        			var dateStr: String = self.options.answers[0].response;
		        			var date: Date = null;
		        				date = dateStr.toDate();
		        			if(date != null)
		        				self.input.val(date.dateYYYY_MM_DD());	
		        			else 
		        			self.input.val(self.options.answers[0].response);

	        			}
        			} catch (exc: Dynamic) { }
		        	
	        		selfElement.append(self.input);
		        },

		        result: function(): String {
		        	var self: DateWidgetDef = Widgets.getSelf();
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
		JQ.widget( "ui.dateComp", defineWidget());
	}
}