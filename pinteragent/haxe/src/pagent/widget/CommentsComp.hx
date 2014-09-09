package pagent.widget;

import m3.log.Logga;
import pagent.PinterContext;
import pagent.pages.PinterPage;
import pagent.pages.PinterPageMgr;
import pagent.model.EM;
import js.Browser;
import m3.jq.JQ;
import m3.jq.JQDroppable;
import m3.jq.M3Menu;
import m3.widget.Widgets;
import qoid.model.ModelObj;
import m3.observable.OSet;
import m3.exception.Exception;
import m3.util.JqueryUtil;
import agentui.widget.Popup;
import qoid.Qoid;

using m3.helper.OSetHelper;
using m3.helper.StringHelper;
using Lambda;

typedef CommentsCompOptions = {
	var content: ImageContent;
}

typedef CommentsCompWidgetDef = {
	@:optional var options: CommentsCompOptions;
	var _create: Void->Void;
	var _createWidgets:JQ->CommentsCompWidgetDef->Void;
	var _addComment: String->Void;
	var update: ImageContent->Void;
	var destroy: Void->Void;
	@:optional var mappedLabels:MappedSet<LabeledContent, JQ>;
	@:optional var onchangeLabelChildren:JQ->EventType->Void;
	var _showEditCaptionPopup: ImageContent->JQ->Void;
	var _showEditAlbumsPopup: ImageContent->JQ->Void;
	@:optional var labelListener: LabeledContent->EventType->Void;
}


class CommentsCompHelper {
	public static function content(cc: CommentsComp): Content<Dynamic> {
		return cc.commentsComp("option", "content");
	}

	public static function update(cc: CommentsComp, c:ImageContent): Void {
		return cc.commentsComp("update", c);
	}
}


@:native("$")
extern class CommentsComp extends ContentComp {

	@:overload(function<T>(cmd : String):T{})
	@:overload(function<T>(cmd : String, param:Dynamic):T{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function commentsComp(?opts: CommentsCompOptions): CommentsComp;

	private static function __init__(): Void {
		var defineWidget: Void->CommentsCompWidgetDef = function(): CommentsCompWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: CommentsCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of CommentsComp must be a div element");
		        	}

		        	selfElement.addClass("_commentsComp " + Widgets.getWidgetClasses());
		        	
		        	self._createWidgets(selfElement, self);
		        },

		        _createWidgets: function(selfElement: JQ, self:CommentsCompWidgetDef): Void {

					selfElement.empty();

					var content: ImageContent = self.options.content;

					if(content.props.caption.isNotBlank()) {
						self._addComment(content.props.caption);
					}
				},

				_addComment: function(str: String) {
					var self: CommentsCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

				},

				_showEditCaptionPopup: function(c: ImageContent, reference: JQ): Void {
					var self: CommentsCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

        			var popup: Popup = new Popup("<div class='updateCaptionPopup' style='position: absolute;width:600px;'></div>");
        			popup.appendTo(selfElement);
        			popup = popup.popup({
        					createFcn: function(el: JQ): Void {
        						var updateCaption: Void->Void = null;
        						var stopFcn: JQEvent->Void = function (evt: JQEvent): Void { evt.stopPropagation(); };
        						var enterFcn: JQEvent->Void = function (evt: JQEvent): Void { 
        				// 			if(evt.keyCode == 13) {
        				// 				updateCaption();
    								// }
        						};

        						var container: JQ = new JQ("<div class='icontainer'></div>").appendTo(el);
        						container.click(stopFcn).keypress(enterFcn);
        						var parent: JQ = null;
        						container.append("<label for='caption'>Caption: </label> ");
        						var input: JQ = new JQ("<textarea id='caption' class='ui-corner-all ui-widget-content' style='font-size: 20px;'></textarea>").appendTo(container);
        						input
        				// 			.keypress(enterFcn).click(function(evt: JQEvent): Void {
        				// 				evt.stopPropagation();
        				// 				if(JQ.cur.val() == "New Label") {
        				// 					JQ.cur.val("");
        				// 				}
    								// })
    								.focus();
        						var buttonText = "Update Caption";
    							input.val(c.props.caption);
        						container.append("<br/>");
        						new JQ("<button class='fright ui-helper-clearfix' style='font-size: .8em;'>" + buttonText + "</button>")
        							.button()
        							.appendTo(container)
        							.click(function(evt: JQEvent): Void {
        								updateCaption();
        							});

        						updateCaption = function(): Void {
									if (input.val().length == 0) {return;}
									Logga.DEFAULT.info("Update content | " + c.iid);
									c.props.caption = input.val();
  									var eventData = new EditContentData(c, Qoid.groupedLabeledContent.getElement(c.iid).map(
  											function(laco: LabeledContent): String {
  													return laco.labelIid;
  												}  
										).array());
  									EM.change(EMEvent.UpdateContent, eventData);
									new JQ("body").click();
        						};
        					},
        					positionalElement: reference
        				});

					},

				_showEditAlbumsPopup: function(c: ImageContent, reference: JQ): Void {
					var self: CommentsCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

        			var popup: Popup = new Popup("<div class='updateAlbumPopup' style='position: absolute;width:400px;'></div>");
        			popup.appendTo(selfElement);
        			popup = popup.popup({
        					createFcn: function(el: JQ): Void {
        						var updateLabels: Void->Void = null;
        						var stopFcn: JQEvent->Void = function (evt: JQEvent): Void { evt.stopPropagation(); };
        						var enterFcn: JQEvent->Void = function (evt: JQEvent): Void { 
        							if(evt.keyCode == 13) {
        								updateLabels();
    								}
        						};

        						var container: JQ = new JQ("<div class='icontainer'></div>").appendTo(el);
        						container.click(stopFcn).keypress(enterFcn);
    							container.append("<label for='labelParent'>Album: </label> ");
        						var select: JQ = new JQ("<select id='labelParent' class='ui-corner-left ui-widget-content' style='width: 191px;'></select>").appendTo(container);
        						select.click(stopFcn);
        						var aliasLabels = Qoid.getLabelDescendents(PinterContext.ROOT_BOARD.iid);
        						var iter: Iterator<Label> = aliasLabels.iterator();
        						while(iter.hasNext()) {
        							var label: Label = iter.next();
        							if (label.iid != PinterContext.CURRENT_BOARD ) {
	        							var option = "<option value='" + label.iid + "'>" + label.name + "</option>";
	        							select.append(option);
	        						}
        						}
        						var buttonText = "Add to Album";
    							// input.val(c.props.caption);
        						container.append("<br/>");
        						new JQ("<button class='fright ui-helper-clearfix' style='font-size: .8em;'>" + buttonText + "</button>")
        							.button()
        							.appendTo(container)
        							.click(function(evt: JQEvent): Void {
        								updateLabels();
        							});

        						updateLabels = function(): Void {
									// if (input.val().length == 0) {return;}
									Logga.DEFAULT.info("Update content | " + c.iid);
									// [APhotoContext.CURRENT_ALBUM, select.val()]
									var list = Qoid.groupedLabeledContent.getElement(c.iid).map(
  											function(laco: LabeledContent): String {
  													return laco.labelIid;
  												}  
										);
									list.add(select.val());
  									var eventData = new EditContentData(
  										c, 
  										list.array()
									);
  									EM.change(EMEvent.UpdateContent, eventData);
									new JQ("body").click();
        						};
        					},
        					positionalElement: reference
        				});

					},

		        update: function(content:ImageContent) : Void {
		        	var self: CommentsCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
					self.options.content = content;
        			self._createWidgets(selfElement, self);
        			selfElement.show();
		        },

		        destroy: function() {
		        	var self: CommentsCompWidgetDef = Widgets.getSelf();
		        	Qoid.groupedLabeledContent.getElement(self.options.content.iid).removeListener(self.labelListener);
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.commentsComp", defineWidget());
	}
}