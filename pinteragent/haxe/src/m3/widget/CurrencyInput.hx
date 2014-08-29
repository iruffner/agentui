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

typedef CurrencyInputOptions = {
	@:optional var realTime: Bool;
	@:optional var allowCents: Bool;
}

typedef CurrencyInputWidgetDef = {
	@:optional var options: CurrencyInputOptions;
	var _create: Void->Void;
	var destroy: Void->Void;
}

@:native("$")
extern class CurrencyInput extends JQ {
	@:overload(function(cmd : String):Bool{})
	@:overload(function(cmd : String, arg: Dynamic):Void{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function currencyInput(?opts: CurrencyInputOptions): CurrencyInput;

	@:overload(function( selector: JQ ) : CurrencyInput{})
	@:overload(function( selector: Element ) : CurrencyInput{})
	override function appendTo( selector: String ): CurrencyInput;

	@:overload(function(value:JQ):CurrencyInput{})
	@:overload(function(value:Element):CurrencyInput{})
	override function insertBefore( html : String ) : CurrencyInput;

	private static function __init__(): Void {
		
		var defineWidget: Void->CurrencyInputWidgetDef = function(): CurrencyInputWidgetDef {
			return {
				options: {
					realTime: true,
					allowCents: true
				},
		        
		        _create: function(): Void {
		        	var self: CurrencyInputWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

		        	if(!selfElement.is("input")) {
		        		throw new Exception("Root of CurrencyInput must be an input element");
		        	}

		        	selfElement.addClass("_currencyInput");

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
								default: selfElement.val(selfElement.val().stripNonDigits(self.options.allowCents).toCurrency(true, false));
							}
						}
					});
		        },

		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.currencyInput", defineWidget());
	}
}