package ui.widget;

import m3.jq.JQ;
import m3.widget.Widgets;
import m3.exception.Exception;

using m3.helper.StringHelper;

typedef InviteCompOptions = {
}

typedef InviteCompWidgetDef = {
	@:optional var options: InviteCompOptions;
	var _create: Void->Void;
	var destroy: Void->Void;
}

@:native("$")
extern class InviteComp extends JQ {

	@:overload(function(cmd : String):Bool{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function inviteComp(?opts: InviteCompOptions): InviteComp;

	private static function __init__(): Void {
		var defineWidget: Void->InviteCompWidgetDef = function(): InviteCompWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: InviteCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of InviteComp must be a div element");
		        	}

		        	selfElement.addClass("inviteComp ui-helper-clearfix " + Widgets.getWidgetClasses());

		        	var input: JQ = new JQ('<input id="sideRightInviteInput" style="display: none;" class="ui-widget-content boxsizingBorder textInput"/>');
		        	var input_placeHolder: JQ = new JQ('<input id="sideRightInviteInput_PH" class="placeholder ui-widget-content boxsizingBorder textInput" value="Enter Email Address"/>');
		        	var btn: JQ = new JQ("<button class='fright'>Invite</button>").button();
		        	selfElement.append(input).append(input_placeHolder).append(btn);

		        	input_placeHolder.focus(function(evt: JQEvent): Void {
		        			input_placeHolder.hide();
		        			input.show().focus();
		        		});

		        	input.blur(function(evt: JQEvent): Void {
		        			if(input.val().isBlank()) {
			        			input_placeHolder.show();
			        			input.hide();
		        			}
		        		});
		        },

		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.inviteComp", defineWidget());
	}
}