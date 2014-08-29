package m3.forms;

import js.html.Element;

import m3.exception.Exception;
import m3.jq.JQ;
import m3.widget.Widgets;

using m3.helper.StringFormatHelper;
using m3.forms.inputs.FormInput;
using m3.forms.inputs.TextInput;

enum InputType {
	SELECT;
	TEXT;
	COMBOBOX;
}

typedef FormItem = {
	var name: String;
	@:optional var label: String;
	var type: InputType;
	@:optional var value: Dynamic;
	@:optional var required: Bool;
	@:optional var validate: String->Bool;
}

typedef FormBuilderOptions = {
	@:optional var title: String;
	var formItems: Array<FormItem>;
}

typedef FormBuilderWidgetDef = {
	var options: FormBuilderOptions;

	@:optional var _formInputs: Array<FormInput>;
	var _create: Void->Void;
	var destroy: Void->Void;

}

class FormBuilderHelper {
	// public static function update(dc: FormBuilder, dr: DeviceReport): Void {
	// 	dc.FormBuilder("update", dr);
	// }
}

@:native("$")
extern class FormBuilder extends JQ {
	
	@:overload(function<T>(cmd : String):T{})
	@:overload(function<T>(cmd : String, arg: Dynamic):T{})
	@:overload(function(cmd : String, opt: String, newVal: Dynamic):JQ{})
	function formBuilder(opts: FormBuilderOptions): FormBuilder;

	@:overload(function( selector: JQ ) : FormBuilder{})
	@:overload(function( selector: Element ) : FormBuilder{})
	override function appendTo( selector: String ): FormBuilder;

	private static function __init__(): Void {
		
		var defineWidget: Void->FormBuilderWidgetDef = function(): FormBuilderWidgetDef {
			return {

				options: {
					title: "",
					formItems: null
				},

				_create: function(): Void {
		        	var self: FormBuilderWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of FormBuilder must be a div element");
		        	}

		        	selfElement.addClass("_formBuilder");
		        	
		        	selfElement.append("<h2>" + self.options.title + "</h2>");

		        	var form: JQ = new JQ("<div class='formInputs'></div>").appendTo(selfElement);

		        	for(formItem in self.options.formItems) {
		        		switch(formItem.type) {
		        			case InputType.TEXT: 
		        				var fi: TextInput = new TextInput("<div></div>")
		        					.appendTo(form)
		        					.textInput({formItem: formItem});
		        			case _:

		        		}
		        	}
		        },

		        // update: function(dr: DeviceReport): Void {
		        // 	if(dr == null) return;
		        // 	var self: FormBuilderWidgetDef = Widgets.getSelf();

		        // 	self._super(dr);

		        // 	switch(dr.msgType) {
		        // 		case MsgType.healthReport: 
		        // 			AppContext.LAST_HEALTH_REPORTS.set(Device.identifier(self.options.device), dr);
	        	// 		case MsgType.dataReport:
		        // 			AppContext.LAST_DATA_REPORTS.set(Device.identifier(self.options.device), dr);
		        // 	}

	        	// },

		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.formBuilder", defineWidget());
	}
}