package m3.widget;

import js.html.Element;

import m3.jq.JQ;
import m3.observable.OSet;
import m3.widget.Widgets;

import m3.log.Logga;
import m3.exception.Exception;

import ui.api.ApiWrapper;
import ui.model.BModel;
import ui.model.EM;
import ui.model.EMEvent;

using m3.helper.StringHelper;
using m3.helper.StringFormatHelper;
using DateTools;

typedef NumericInputOptions = {
	@:optional var realTime: Bool;
	@:optional var allowDecimal: Bool;
}

typedef NumericInputWidgetDef = {
	@:optional var options: NumericInputOptions;
	var _create: Void->Void;
	var destroy: Void->Void;
}

@:native("$")
extern class NumericInput extends JQ {
	@:overload(function(cmd : String):Bool{})
	@:overload(function(cmd : String, arg: Dynamic):Void{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function numericInput(?opts: NumericInputOptions): NumericInput;

	@:overload(function( selector: JQ ) : NumericInput{})
	@:overload(function( selector: Element ) : NumericInput{})
	override function appendTo( selector: String ): NumericInput;

	@:overload(function(value:JQ):NumericInput{})
	@:overload(function(value:Element):NumericInput{})
	override function insertBefore( html : String ) : NumericInput;

	private static function __init__(): Void {
		
		var defineWidget: Void->NumericInputWidgetDef = function(): NumericInputWidgetDef {
			return {
				options: {
					realTime: true,
					allowDecimal: false
				},
		        
		        _create: function(): Void {
		        	var self: NumericInputWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

		        	if(!selfElement.is("input")) {
		        		throw new Exception("Root of NumericInput must be an input element");
		        	}

		        	selfElement.addClass("_numericInput");

		        	selfElement.keyup(function(evt: JQEvent) {
						if (evt != null) {
							var keyUnicode = evt.charCode == null ? evt.keyCode : evt.charCode;
							switch (keyUnicode) {
								case 27: selfElement.val(''); // Esc: clear entry
								case 16:  // Shift
								case 35:  // End
								case 36:  // Home
								case 37:  // cursor left
								case 38:  // cursor up
								case 39:  // cursor right
								case 40:  // cursor down
								case 78:  // N (Opera 9.63+ maps the "." from the number key section to the "N" key too!) (See: http://unixpapa.com/js/key.html search for ". Del")
								case 110:  // . number block (Opera 9.63+ maps the "." from the number block to the "N" key (78) !!!)
								case 190:  // .
								default: selfElement.val(selfElement.val().stripNonDigits(self.options.allowDecimal).formatNumber({numberOfDecimals: 0,thousandSeparator: ','}));
							}
						}
					});
		        },

		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.numericInput", defineWidget());
	}
}