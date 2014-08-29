package m3.forms.inputs;

import js.html.Element;

import m3.jq.JQ;
import m3.widget.Widgets;

import m3.exception.Exception;
import m3.log.Logga;

import m3.exception.ValidationException;

using m3.helper.StringHelper;
using m3.helper.ArrayHelper;
using m3.forms.inputs.FormInput;
using m3.forms.FormBuilder;

typedef TextInputWidgetDef = {
	@:optional var options: FormInputOptions;
	var _create: Void->Void;
	var result: Void->String;
	var destroy: Void->Void;
	@:optional var input: JQ;

	@:optional var _super: Dynamic;

}

class TextInputHelper {
	public static function result(s: TextInput): String {
		return s.textInput("result");
	}
}

@:native("$")
extern class TextInput extends FormInput {
	@:overload(function(cmd : String):String{})
	@:overload(function(cmd : String, arg: Dynamic):Dynamic{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function textInput(opts: FormInputOptions): TextInput;

	@:overload(function( selector: JQ ) : TextInput{})
	@:overload(function( selector: Element ) : TextInput{})
	override function appendTo( selector: String ): TextInput;

	private static function __init__(): Void {
		
		var defineWidget: Void->TextInputWidgetDef = function(): TextInputWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: TextInputWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of TextInput must be a div element");
		        	}

		        	selfElement.addClass("_textInput center");

		        	self._super();

		        	var question: FormItem = self.options.formItem;

	        		self.input = new JQ("<input type='text' name='" + question.name + "' id='" + question.name + "'/>");
	        		if(self.options.formItem.value != null) self.input.val(self.options.formItem.value);

	        		selfElement.append(self.input);
		        },

		        result: function(): String {
		        	var self: TextInputWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
					var value: String = self.input.val();
					if(value.isBlank() && self.options.formItem.required) {
						throw new ValidationException(self.options.formItem.name + " is required");
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
		JQ.widget( "ui.textInput", (untyped $.ui.formInput), defineWidget());
	}
}