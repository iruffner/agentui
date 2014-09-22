package pagent.widget;

import m3.log.Logga;
import m3.serialization.Serialization.Serializer;
import pagent.PinterContext;
import pagent.pages.PinterPage;
import pagent.pages.PinterPageMgr;
import haxe.Json;
import js.Browser;
import m3.jq.JQ;
import m3.jq.JQDroppable;
import m3.jq.M3Menu;
import m3.widget.Widgets;
import qoid.model.ModelObj;
import m3.observable.OSet;
import pagent.model.EM;
import m3.exception.Exception;
import m3.util.JqueryUtil;
import pagent.widget.DialogManager;
import qoid.QoidAPI;
import qoid.ResponseProcessor.Response;

using m3.helper.OSetHelper;
using m3.helper.StringHelper;
using m3.helper.ArrayHelper;

typedef ContentCompOptions = {
	var content: Content<Dynamic>;
}

typedef ContentCompWidgetDef = {
	@:optional var options: ContentCompOptions;
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

		        	selfElement.addClass("contentComp ui-corner-all " + Widgets.getWidgetClasses());
		        	selfElement.click(function(evt: JQEvent){
		        		//go to post page
		        		PinterContext.CURRENT_MEDIA = self.options.content.iid;
		        		PinterContext.PAGE_MGR.CURRENT_PAGE = PinterPageMgr.CONTENT_SCREEN;
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



					var fcn: Content<Dynamic>->Void = null;
					fcn = function(content: Content<Dynamic>) {
						switch(content.contentType) {
			        		case ContentTypes.IMAGE:
			        			var img: ImageContent = cast(content, ImageContent);
			        			selfElement.append("<div class='imgDiv ui-corner-top'><img alt='" + img.props.caption + "' src='" + img.props.imgSrc + "'/></div>");
								var captionDiv: JQ = new JQ("<div class='caption ui-corner-bottom'></div>").appendTo(selfElement);
								if(img.props.caption.isNotBlank()) {
									captionDiv.append(img.props.caption);
								} else {
									// captionDiv.append( html : String )
								}
							case ContentTypes.TEXT:
								var text: MessageContent = cast(content, MessageContent);

							case ContentTypes.LINK:
								var link: LinkContent = cast(content, LinkContent);
								QoidAPI.query(new RequestContext("contentLink_" + link.props.contentIid, link.props.contentIid), "content", "contentIid = '" + link.props.contentIid + "'" , true, true, link.props.route);
								EM.listenOnce(
									"onContentLink_" + link.props.contentIid, 
									function(response: Response){
										if(response.result.results.hasValues()) {
											var c: Content<Dynamic> = Serializer.instance.fromJsonX(response.result.results[0], Content);
											fcn(c);
											
										}
									}, 
									"ContentComp-Link-" + link.props.contentIid	 
								);
	 
			        		case _:
			        			Logga.DEFAULT.debug("Unsupported content type"); 
			        	}
					}

		        	fcn(content);
				},
		        
		        update: function(content:Content<Dynamic>) : Void {
		        	var self: ContentCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

					self.options.content = content;
        			self._createWidgets(selfElement, self);
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