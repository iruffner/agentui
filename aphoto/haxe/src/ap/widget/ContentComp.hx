package ap.widget;

import m3.jq.JQ;
import m3.jq.JQDroppable;
import m3.jq.M3Menu;
import m3.widget.Widgets;
import qoid.model.ModelObj;
import m3.observable.OSet;
import ap.widget.LabelComp;
import m3.exception.Exception;
import m3.util.JqueryUtil;
import qoid.model.EM;
import ap.widget.DialogManager;

using m3.helper.OSetHelper;

typedef ContentCompOptions = {
	var content: Content<Dynamic>;
}

typedef ContentCompWidgetDef = {
	@:optional var options: ContentCompOptions;
	@:optional var buttonBlock: JQ;
	@:optional var menu:M3Menu;
	var _create: Void->Void;
	var _createWidgets:JQ->ContentCompWidgetDef->Void;
	var _createContentMenu: Void->M3Menu;
	var update: Content<Dynamic>->Void;
	var destroy: Void->Void;
	var toggleActive:Void->Void;
	@:optional var mappedLabels:MappedSet<LabeledContent, JQ>;
	@:optional var onchangeLabelChildren:JQ->EventType->Void;
}

typedef VerifierData = {
	var profile:Profile;
	var message:String;
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

				_createWidgets: function(selfElement: JQ, self:ContentCompWidgetDef): Void {

					selfElement.empty();

					var content:Content<Dynamic> = self.options.content;

		        	switch(content.contentType) {
		        		case ContentType.IMAGE:
		        			var img: ImageContent = cast(content, ImageContent);
		        			selfElement.append("<img alt='" + img.props.caption + "' src='" + img.props.imgSrc + "'/>");// + img.caption);

		        		case _:
		        			throw new Exception("Only image content should be displayed"); 
		        	}
				},
		        
		        _create: function(): Void {
		        	var self: ContentCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of ContentComp must be a div element");
		        	}

		        	selfElement.addClass("contentComp " + Widgets.getWidgetClasses());
		        	selfElement.click(function(evt:js.JQuery.JqEvent){
		        		//go to post page
		        	});

		        	self._createWidgets(selfElement, self);

		        	EM.addListener(EMEvent.EditContentClosed, function(content: Content<Dynamic>): Void {
		        		if (content.iid == self.options.content.iid) {
		        			selfElement.show();
		        		}
		        	});
		        },

		       	_createContentMenu: function() : M3Menu {
		        	var self: ContentCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

		        	if (self.menu == null) {
			        	var menu: M3Menu = new M3Menu("<ul id='contentCompMenu-" + self.options.content.iid + "'></ul>");
			        	menu.appendTo(selfElement);

			        	var menuOptions:Array<MenuOption> = [];

						var menuOption: MenuOption;

						menuOption = {
							label: "Edit...",
							icon: "ui-icon-pencil",
							action: function(evt: JQEvent, m: M3Menu): Void {
								evt.stopPropagation();

				        		var comp = new JQ("<div id='edit-post-comp'></div>");
		            			comp.insertBefore(selfElement);
								comp.width(selfElement.width());
								comp.height(selfElement.height());

								selfElement.hide();
								// var editPostComp = new EditPostComp(comp).editPostComp({content: self.options.content});
							}
						};
						menuOptions.push(menuOption);

						menuOption = {
							label: "Delete...",
							icon: "ui-icon-circle-close",
							action: function(evt: JQEvent, m: M3Menu): Void {
								evt.stopPropagation();
								JqueryUtil.confirm("Delete Post", "Are you sure you want to delete this content?", 
									function(){
										var ecd = new EditContentData(self.options.content);
										EM.change(EMEvent.DeleteContent, ecd);
									}
								);
							}
						};
						menuOptions.push(menuOption);

	        			menu.m3menu({menuOptions:menuOptions}).hide();

	        			self.menu = menu;
					}
					return self.menu;
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

		        toggleActive: function(): Void {
		        	var self: ContentCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

	        		selfElement.toggleClass("postActive");
	        		self.buttonBlock.toggle();
		        },
		        
		        destroy: function() {
		        	var self: ContentCompWidgetDef = Widgets.getSelf();
		        	self.mappedLabels.removeListener(self.onchangeLabelChildren);
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.contentComp", defineWidget());
	}
}