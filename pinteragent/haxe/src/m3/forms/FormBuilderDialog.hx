package m3.forms;

import js.html.Element;

import m3.exception.Exception;
import m3.jq.JQ;
import m3.jq.M3Dialog;
import m3.widget.Widgets;

using m3.helper.StringFormatHelper;
using m3.forms.FormBuilder;

typedef FormBuilderDialogOptions = {
	>M3DialogOptions,
	var formItems: Array<FormItem>;
}

typedef FormBuilderDialogWidgetDef = {
	var options: FormBuilderDialogOptions;

	@:optional var formBuilder: FormBuilder;

	var _create: Void->Void;
	var destroy: Void->Void;

	@:optional var _super: Dynamic;
}

class FormBuilderDialogHelper {
	public static function close(dlg: FormBuilderDialog): Void {
		dlg.formBuilderDialog("close");
	}

	public static function open(dlg: FormBuilderDialog): Void {
		dlg.formBuilderDialog("open");
	}

	public static function isOpen(dlg: FormBuilderDialog): Bool {
		return dlg.formBuilderDialog("isOpen");
	}
}

@:native("$")
extern class FormBuilderDialog extends M3Dialog {
	
	@:overload(function<T>(cmd : String):T{})
	@:overload(function<T>(cmd : String, arg: Dynamic):T{})
	@:overload(function(cmd : String, opt: String, newVal: Dynamic):JQ{})
	function formBuilderDialog(opts: FormBuilderDialogOptions): FormBuilderDialog;

	@:overload(function( selector: JQ ) : FormBuilderDialog{})
	@:overload(function( selector: Element ) : FormBuilderDialog{})
	override function appendTo( selector: String ): FormBuilderDialog;

	private static function __init__(): Void {
		
		var defineWidget: Void->FormBuilderDialogWidgetDef = function(): FormBuilderDialogWidgetDef {
			return {

				options: {
					title: "",
					formItems: null
				},

				_create: function(): Void {
		        	var self: FormBuilderDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of FormBuilderDialog must be a div element");
		        	}

		        	self._super();

		        	selfElement.addClass("_formBuilderDialog");
		        	
		        	self.formBuilder = new FormBuilder("<div></div>")
		        		.appendTo(selfElement)
		        		.formBuilder({formItems: self.options.formItems});
		        },

		        // update: function(dr: DeviceReport): Void {
		        // 	if(dr == null) return;
		        // 	var self: FormBuilderDialogWidgetDef = Widgets.getSelf();

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
		JQ.widget( "ui.formBuilderDialog", (untyped $.ui.m3dialog), defineWidget());
	}
}