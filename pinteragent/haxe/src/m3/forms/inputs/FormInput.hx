package m3.forms.inputs;

import js.html.Element;

import m3.exception.Exception;
import m3.jq.JQ;
import m3.widget.Widgets;
import ui.event.EM;

import ui.model.MModel;
import ui.model.DeviceReport;
import ui.widget.StatusComp;

using m3.helper.StringFormatHelper;
using m3.helper.StringHelper;
using m3.forms.FormBuilder;

typedef FormInputOptions = {
	var formItem: FormItem;
}

typedef FormInputWidgetDef = {
	@:optional var options: FormInputOptions;

	@:optional var label: JQ;
	@:optional var input: JQ;

	var _create: Void->Void;
	var destroy: Void->Void;
}

class FormInputHelper {
	// public static function update(dc: FormInput, dr: DeviceReport): Void {
	// 	dc.FormInput("update", dr);
	// }
}

@:native("$")
extern class FormInput extends JQ {
	
	@:overload(function<T>(cmd : String):T{})
	@:overload(function<T>(cmd : String, arg: Dynamic):T{})
	@:overload(function(cmd : String, opt: String, newVal: Dynamic):JQ{})
	function formInput(opts: FormInputOptions): FormInput;

	private static function __init__(): Void {
		
		var defineWidget: Void->FormInputWidgetDef = function(): FormInputWidgetDef {
			return {

				_create: function(): Void {
		        	var self: FormInputWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of FormInput must be a div element");
		        	}

		        	selfElement.addClass("_formInput");

		        	var label: String = 
		        		self.options.formItem.label.isNotBlank() ? self.options.formItem.label : self.options.formItem.name.capitalizeFirstLetter();
		        	
		        	self.label = new JQ("<label for='" + self.options.formItem.name + "'>" + label + "</label>").appendTo(selfElement);
		        	

		        },

		        // update: function(dr: DeviceReport): Void {
		        // 	if(dr == null) return;
		        // 	var self: FormInputWidgetDef = Widgets.getSelf();

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
		JQ.widget( "ui.formInput", defineWidget());
	}
}