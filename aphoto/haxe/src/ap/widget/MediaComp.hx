package ap.widget;

import ap.APhotoContext;

import ap.pages.APhotoPage;
import ap.pages.APhotoPageMgr;
import ap.model.EM;
import js.Browser;
import m3.jq.JQ;
import m3.jq.JQDroppable;
import m3.jq.M3Menu;
import m3.log.Logga;
import m3.widget.Widgets;
import qoid.model.ModelObj;
import m3.observable.OSet;
import ap.widget.LabelComp;
import m3.exception.Exception;
import m3.util.JqueryUtil;
import agentui.widget.Popup;
import qoid.Qoid;
import qoid.QoidAPI;

using m3.helper.OSetHelper;
using m3.helper.StringHelper;
using Lambda;

typedef MediaCompOptions = {
	var content: Content<Dynamic>;
}

typedef MediaCompWidgetDef = {
	@:optional var options: MediaCompOptions;
	var _create: Void->Void;
	var _createWidgets:JQ->MediaCompWidgetDef->Void;
	var update: Content<Dynamic>->Void;
	var destroy: Void->Void;
	@:optional var mappedLabels:MappedSet<LabeledContent, JQ>;
	@:optional var onchangeLabelChildren:JQ->EventType->Void;
	var _showEditCaptionPopup: ImageContent->JQ->Void;
	var _showEditAlbumsPopup: ImageContent->JQ->Void;
	@:optional var labelListener: LabeledContent->EventType->Void;
}


class MediaCompHelper {
	public static function content(cc: MediaComp): Content<Dynamic> {
		return cc.mediaComp("option", "content");
	}

	public static function update(cc: MediaComp, c:Content<Dynamic>): Void {
		return cc.mediaComp("update", c);
	}
}


@:native("$")
extern class MediaComp extends ContentComp {

	@:overload(function<T>(cmd : String):T{})
	@:overload(function<T>(cmd : String, param:Dynamic):T{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function mediaComp(?opts: MediaCompOptions): MediaComp;

	private static function __init__(): Void {
		var defineWidget: Void->MediaCompWidgetDef = function(): MediaCompWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: MediaCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of MediaComp must be a div element");
		        	}

		        	selfElement.addClass("_mediaComp " + Widgets.getWidgetClasses());
		        	
		        	self._createWidgets(selfElement, self);

		        	// EM.addListener(EMEvent.EditContentClosed, function(content: Content<Dynamic>): Void {
		        	// 	if (content.iid == self.options.content.iid) {
		        	// 		selfElement.show();
		        	// 	}
		        	// });
		        },

		        _createWidgets: function(selfElement: JQ, self:MediaCompWidgetDef): Void {

					selfElement.empty();

					var content: Content<Dynamic> = self.options.content;

		        	switch(content.contentType) {
		        		case ContentTypes.IMAGE:
		        			var imgDiv: JQ = new JQ("<div class='imgDiv'></div>").appendTo(selfElement);
		        			var captionDiv: JQ = new JQ("<div class='captionDiv'></div>").appendTo(selfElement);
		        			var labelsDiv: JQ = new JQ("<div class='labelsDiv'></div>").appendTo(selfElement);
		        			var caption: JQ = new JQ("<div class='caption'></div>").appendTo(captionDiv);
		        			var editCaption: JQ = new JQ("<div class='editCaption'></div>").appendTo(captionDiv);
		        			var img: ImageContent = cast(content, ImageContent);
		        			imgDiv.append("<img alt='" + img.props.caption + "' src='" + img.props.imgSrc + "'/>");
							if(img.props.caption.isNotBlank()) {
								caption.append(img.props.caption);
							} else {
								caption.append("<i>Add caption</i>");
							}

							new JQ("<button class='editButton'>Edit</button")
				        		.button({
				        			{
					                    icons: {
					                        primary: "ui-icon-pencil"
					                      },
				                      	text: false
					                }
				        		})
				        		.appendTo(editCaption)
				        		.click(function(evt: JQEvent) {
				        				self._showEditCaptionPopup(cast self.options.content, JQ.cur);
				        				evt.stopPropagation();
				        			});

				        	var labelsDivHeader: JQ = new JQ("<h2>Also in Other Albums</h2>").appendTo(labelsDiv);
				        	new JQ("<button class='addButton'>Add</button")
				        		.button({
				        			{
					                    icons: {
					                        primary: "ui-icon-plus"
					                      },
				                      	text: false
					                }
				        		})
				        		.appendTo(labelsDivHeader)
				        		.click(function(evt: JQEvent) {
				        				self._showEditAlbumsPopup(cast self.options.content, JQ.cur);
				        				evt.stopPropagation();
				        			});

			        		var labels: OSet<LabeledContent> = Qoid.groupedLabeledContent.getElement(content.iid);
			        		self.labelListener = function(lc: LabeledContent, evt: EventType): Void {
			        			if(lc != null && lc.labelIid != APhotoContext.CURRENT_ALBUM) {
				        			if(evt.isAdd()) {
				        				new JQ("<div id='otherAlbum" + lc.labelIid + "' class='album'>" + Qoid.labels.getElementComplex(lc.labelIid).name + "</div>").appendTo(labelsDiv);
				        			} else if(evt.isUpdate()) {
				        				new JQ("#otherAlbum" + lc.labelIid, labelsDiv).text(Qoid.labels.getElementComplex(lc.labelIid).name);
				        			} else if(evt.isDelete()) {
				        				new JQ("#otherAlbum" + lc.labelIid, labelsDiv).remove();
				        			} else if(evt.isClear()) {
				        				new JQ(".album", labelsDiv).remove();
				        			}
				        		}
			        		};
			        		labels.listen(self.labelListener);

		        		case _:
		        			// throw new Exception("Only image content should be displayed"); 
		        	}
				},

				_showEditCaptionPopup: function(c: ImageContent, reference: JQ): Void {
					var self: MediaCompWidgetDef = Widgets.getSelf();
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
					var self: MediaCompWidgetDef = Widgets.getSelf();
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
        						var aliasLabels = Qoid.getLabelDescendents(APhotoContext.ROOT_ALBUM.iid);
        						var iter: Iterator<Label> = aliasLabels.iterator();
        						while(iter.hasNext()) {
        							var label: Label = iter.next();
        							if (label.iid != APhotoContext.CURRENT_ALBUM ) {
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
									Logga.DEFAULT.info("Add content label | " + c.iid);
                                    QoidAPI.addContentLabel( c.iid, select.val());
									new JQ("body").click();
        						};
        					},
        					positionalElement: reference
        				});

					},

		        update: function(content:Content<Dynamic>) : Void {
		        	var self: MediaCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
					self.options.content = content;
        			self._createWidgets(selfElement, self);
        			selfElement.show();
		        },

		        destroy: function() {
		        	var self: MediaCompWidgetDef = Widgets.getSelf();
		        	Qoid.groupedLabeledContent.getElement(self.options.content.iid).removeListener(self.labelListener);
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.mediaComp", defineWidget());
	}
}