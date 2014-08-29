package ui.widgets.qtype;

import js.html.Element;

import m3.jq.JQ;
import m3.widget.Widgets;

import m3.exception.Exception;
import m3.log.Logga;
import ui.exception.ValidationException;

import ui.model.BModel;
import ui.pages.Pages;
import ui.widgets.targets.QuestionComp;

using ui.widgets.ICheck.ICheckHelper;
using m3.helper.StringHelper;
using m3.helper.ArrayHelper;
using Lambda;


typedef PortalCheckboxWidgetDef = {
	@:optional var options: QuestionCompOptions;
	var _create: Void->Void;
	var result: Void->Array<String>;
	var destroy: Void->Void;
}

class PortalCheckboxHelper {
	public static function result(c: PortalCheckbox): Array<String> {
		return c.portalCheckbox("result");
	}
}

@:native("$")
extern class PortalCheckbox extends JQ {
	@:overload(function<T>(cmd : String):T{})
	@:overload(function<T>(cmd : String, arg: Dynamic):T{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function portalCheckbox(opts: QuestionCompOptions): PortalCheckbox;

	@:overload(function( selector: JQ ) : PortalCheckbox{})
	@:overload(function( selector: Element ) : PortalCheckbox{})
	override function appendTo( selector: String ): PortalCheckbox;

	private static function __init__(): Void {
		
		var defineWidget: Void->PortalCheckboxWidgetDef = function(): PortalCheckboxWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: PortalCheckboxWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of PortalCheckbox must be a div element");
		        	}

		        	selfElement.addClass("_portalCheckbox");

		        	var question: Question = self.options.question;

	        		new JQ("<div >" + question.text + "</div>").appendTo(selfElement);


		        	var targetPortalCheckboxes: Array<ICheck> = new Array<ICheck>();
					var allDiv: JQ = new JQ("<div class='_all displayInlineBlock'></div>").appendTo(selfElement);
					var allIcheck: ICheck = new ICheck( "<input id='choice_all' data-role='none' type='checkbox' value='' checked='checked'/>")
							.appendTo(allDiv)
							.on("ifChecked", function(evt: JQEvent) { 
													targetPortalCheckboxes.iter(
														function(icheck: ICheck): Void { 
																icheck.uncheck();
															}); 
												})
							.iCheck({
									checkboxClass: 'icheckbox_flat-blue displayInlineBlock inlinePortalCheckbox'
								});
					new JQ( "<label data-role='none' for='choice_all' class='displayInlineBlock'>All</label>")
							.appendTo(allDiv);
					var choicesDivs: Array<JQ> = new Array<JQ>();
					for(col_ in 0...question.columns) {
						choicesDivs.push(new JQ("<div class='_choices displayInlineBlock'></div>").appendTo(selfElement));
					}
					var rowsPerColumn: Int = Math.ceil(question.options.length / question.columns);
					for(opt_ in 0...question.options.length) {
							var opt: Choice = question.options[opt_];
							var columnIndex: Int = Math.ceil(cast(opt_ + 1, Float) / rowsPerColumn);
							var choicesDiv: JQ = choicesDivs[columnIndex - 1];
							var choiceDiv: JQ = new JQ("<div class='_choice'></div>").appendTo(choicesDiv);
							var checkbox: ICheck = new ICheck( "<input data-role='none' type='checkbox' />")
									.attr("id", "choice_" + opt.uid)
									.attr("name", "quest" + question.uid)
									.attr("value", opt.value)
									.appendTo(choiceDiv)
									.on("ifChecked", function(evt: JQEvent) { 
															allIcheck.uncheck(); 
														})
									.on("ifUnchecked", function(evt: JQEvent) { 
															if(targetPortalCheckboxes.foreach( function(cb: ui.widgets.ICheck) { return !cb.is(":checked"); }) ) {
																allIcheck.check();
															}
														})
									.iCheck({
											checkboxClass: 'icheckbox_flat-blue displayInlineBlock inlinePortalCheckbox'
										});
							if(self.options.answers.containsComplex(opt.value, function(ans: Answer): String {
									if(ans.question_uid == question.uid) return ans.response;
									else return "nowaynohow";
								})) {
								checkbox.check();
							}
							targetPortalCheckboxes.push(checkbox);
							new JQ( "<label data-role='none' for='choice_" + opt.uid + "' class='displayInlineBlock'>" + opt.text.capitalizeFirstLetter() + "</label>")
									.appendTo(choiceDiv);
						};

		        },

		        result: function(): Array<String> {
					var self: PortalCheckboxWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
					var selections: JQ = new JQ("input[name=quest" + self.options.question.uid + "]:checked", selfElement);
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
		JQ.widget( "ui.portalCheckbox", defineWidget());
	}
}