package ap.widget;

import ap.APhotoContext;

import ap.pages.APhotoPage;
import ap.pages.APhotoPageMgr;
import haxe.Json;
import js.Browser;
import m3.jq.JQ;
import m3.jq.JQDroppable;
import m3.jq.M3Menu;
import m3.log.Logga;
import m3.widget.Widgets;
import qoid.model.ModelObj;
import m3.observable.OSet;
import ap.widget.LabelComp;
import ap.model.EM;
import m3.exception.Exception;
import m3.util.JqueryUtil;
import ap.widget.DialogManager;

using m3.helper.OSetHelper;
using m3.helper.StringHelper;

typedef ContentCompOptions = {
	var content: Content<Dynamic>;
}

typedef ContentCompWidgetDef = {
	@:optional var options: ContentCompOptions;
	@:optional var buttonBlock: JQ;
	@:optional var menu:M3Menu;
	var _create: Void->Void;
	var _createWidgets:JQ->ContentCompWidgetDef->Void;
	var update: Content<Dynamic>->Void;
	var destroy: Void->Void;
}

class ContentCompHelper {
	public static function content(cc: ContentComp): Content<Dynamic> {
		return cc.contentComp("option", "content");
	}

	public static function update(cc: ContentComp, c:Content<Dynamic>): Void {
		return cc.contentComp("update", c);
	}
}


@:native("$")
extern class ContentComp extends JQ {

	@:overload(function<T>(cmd : String):T{})
	@:overload(function<T>(cmd : String, param:Dynamic):T{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function contentComp(?opts: ContentCompOptions): ContentComp;

	private static function __init__(): Void {
		var defineWidget: Void->ContentCompWidgetDef = function(): ContentCompWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: ContentCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of ContentComp must be a div element");
		        	}

		        	selfElement.addClass("contentComp " + Widgets.getWidgetClasses());
		        	selfElement.click(function(evt:js.JQuery.JqEvent){
		        		//go to post page
		        		APhotoContext.CURRENT_MEDIA = self.options.content.iid;
		        		APhotoContext.PAGE_MGR.CURRENT_PAGE = APhotoPageMgr.CONTENT_SCREEN;
		        		// Browser.window.history.pushState(
	           //  				{}, 
	           //  				self.options.content.iid,
	           //  				Browser.window.history.state. +"&media=" + self.options.content.iid
            // 				);
		        	});

		        	self._createWidgets(selfElement, self);

		        	EM.addListener(EMEvent.EditContentClosed, function(content: Content<Dynamic>): Void {
		        		if (content.iid == self.options.content.iid) {
		        			selfElement.show();
		        		}
		        	});
		        },

				_createWidgets: function(selfElement: JQ, self: ContentCompWidgetDef): Void {

					selfElement.empty();

					var content:Content<Dynamic> = self.options.content;

		        	switch(content.contentType) {
		        		case ContentTypes.IMAGE:
		        			var img: ImageContent = cast(content, ImageContent);
		        			selfElement.append("<img alt='" + img.props.caption + "' src='" + img.props.imgSrc + "'/>");// + img.caption);
		        		case _:
		        			Logga.DEFAULT.debug("Only image content should be displayed"); 
		        	}
				},
		        
		        update: function(content:Content<Dynamic>) : Void {
		        	var self: ContentCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

					var showButtonBlock = self.buttonBlock.isVisible();

					self.options.content = content;
        			self._createWidgets(selfElement, self);
        			if (showButtonBlock) {
	        			self.buttonBlock.show();
	        		}
        			selfElement.show();
		        },

		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.contentComp", defineWidget());
	}
}