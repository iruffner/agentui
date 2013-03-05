package ui.widget;

import ui.jq.JQ;
import js.JQuery;
import ui.widget.UploadComp;

typedef PostCompOptions = {
}

typedef PostCompWidgetDef = {
	@:optional var options: PostCompOptions;
	var _create: Void->Void;
	var destroy: Void->Void;
}

extern class PostComp extends JQ {

@:overload(function(cmd : String):Bool{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function postComp(?opts: PostCompOptions): PostComp;

	private static function __init__(): Void {
		untyped PostComp = window.jQuery;
		var defineWidget: Void->PostCompWidgetDef = function(): PostCompWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: PostCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new ui.exception.Exception("Root of PostComp must be a div element");
		        	}

		        	selfElement.addClass("postComp container shadow " + Widgets.getWidgetClasses());

		        	var section: JQ = new JQ("<section id='postSection'></section>").appendTo(selfElement);

		        	var textInput: JQ = new JQ("<div class='postContainer'></div>").appendTo(section);
		        	var ta: JQ = new JQ("<textarea class='boxsizingBorder ui-corner-all container' style='resize: none;'></textarea>").appendTo(textInput);

		        	var mediaInput: UploadComp = new UploadComp("<div class='postContainer boxsizingBorder'></div>").uploadComp();
		        	mediaInput.appendTo(section);

		        	var label: JQ = new JQ("<aside class='label'><span>Post:</span></aside>").appendTo(section);

		        	var tabs: JQ = new JQ("<aside class='tabs'></aside>").appendTo(section);
		        	var fcn: JqEvent->Void = function(evt: JqEvent): Void {
		        			tabs.children(".active").removeClass("active");
		        			JQ.cur.addClass("active");
		        		};
		        	var textTab: JQ = new JQ("<span class='ui-icon ui-icon-document active ui-corner-left'></span>")
		        						.appendTo(tabs)
		        						.click(function(evt: JqEvent): Void {
							        			tabs.children(".active").removeClass("active");
							        			JQ.cur.addClass("active");
							        			textInput.show();
							        			mediaInput.hide();
							        		});
		        	var imgTab: JQ = new JQ("<span class='ui-icon ui-icon-image ui-corner-left'></span>").appendTo(tabs)
		        						.appendTo(tabs)
		        						.click(function(evt: JqEvent): Void {
							        			tabs.children(".active").removeClass("active");
							        			JQ.cur.addClass("active");
							        			textInput.hide();
							        			mediaInput.show();
							        		});
					mediaInput.hide();
		        },

		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.postComp", defineWidget());
	}
}