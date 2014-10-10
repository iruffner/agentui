package pagent.widget;

import m3.log.Logga;
import m3.serialization.Serialization.Serializer;
import pagent.PinterContext;
import pagent.pages.PinterPage;
import pagent.pages.PinterPageMgr;
import pagent.model.EM;
import pagent.model.PinterModel;
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
import qoid.QoidAPI;
import qoid.ResponseProcessor.Response;

using m3.helper.OSetHelper;
using m3.helper.StringHelper;
using m3.helper.ArrayHelper;
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

	@:optional var creatorDiv: JQ;
	
	@:optional var mappedLabels:MappedSet<LabeledContent, JQ>;
	@:optional var onchangeLabelChildren:JQ->EventType->Void;
	var _showEditCaptionPopup: ImageContent->JQ->Void;
	@:optional var _onBoardCreatorProfile: Profile->EventType->Void;
	@:optional var labelListener: LabeledContent->EventType->Void;

	@:optional var linkListener: String;
	@:optional var removeLinkListener: Void->Void;
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
		        },

		        _createWidgets: function(selfElement: JQ, self:MediaCompWidgetDef): Void {

					selfElement.empty();

					var c: Content<Dynamic> = self.options.content;

					var currentAliasIsOwner = self.options.content.connectionIid == Qoid.currentAlias.connectionIid;
					var div: JQ = null;
					var fcn: Content<Dynamic>->Void = null;
					fcn = function(content: Content<Dynamic>) {
						var addCreatorDiv = function() {
							self.creatorDiv = new JQ("<div class='creatorDiv' style='margin-top: 10px;'></div>").appendTo(div);
				        	self._onBoardCreatorProfile = function(p: Profile, evt: EventType) {
								if(evt.isAddOrUpdate()) {
									if(p.connectionIid == content.connectionIid) {
										self.creatorDiv.empty().append("<i>created by</i> <b>" + p.name + "</b>");
									}
								}
							}
							Qoid.profiles.listen(self._onBoardCreatorProfile);

						}
			        	switch(content.contentType) {
			        		case ContentTypes.IMAGE:
			        			var imgDiv: JQ = div = new JQ("<div class='ui-widget-content ui-state-active ui-corner-all imgDiv'></div>").appendTo(selfElement);
			        			new MediaOptionsComp("<div class='ui-widget-content ui-state-active ui-corner-all'></div>")
			        				.mediaOptionsComp({
			        						content: content
			        					})
			        				.appendTo(selfElement);
			        			new CommentsComp("<div class='ui-widget-content ui-state-active ui-corner-all'></div>")
			        				.commentsComp({
			        						content: cast content
			        					})
			        				.appendTo(selfElement);
			        			var img: ImageContent = cast(content, ImageContent);
			        			imgDiv.append("<img alt='" + img.props.caption + "' src='" + img.props.imgSrc + "'/>");
			        			var captionDiv: JQ = new JQ("<div class='captionDiv'></div>").appendTo(imgDiv);
			        			var caption: JQ = new JQ("<div class='caption'></div>").appendTo(captionDiv);
								if(img.props.caption.isNotBlank()) {
									caption.append(img.props.caption);
								} else if(currentAliasIsOwner){
									caption.append("<i>Add caption</i>");
								}
			        			
			        			if(currentAliasIsOwner) {
				        			var editCaption: JQ = new JQ("<div class='editCaption'></div>").appendTo(captionDiv);

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

						        	imgDiv.append("<br/>");
						        	imgDiv.append("<br/>");
						        	
								}
								addCreatorDiv();	
							case ContentTypes.TEXT:
								var msgDiv: JQ = div = new JQ("<div class='ui-widget-content ui-state-active ui-corner-all msgDiv'></div>").appendTo(selfElement);
			        			new MediaOptionsComp("<div class='ui-widget-content ui-state-active ui-corner-all'></div>")
			        				.mediaOptionsComp({
			        						content: content
			        					})
			        				.appendTo(selfElement);
			        			new CommentsComp("<div class='ui-widget-content ui-state-active ui-corner-all'></div>")
			        				.commentsComp({
			        						content: cast content
			        					})
			        				.appendTo(selfElement);
			        			var msg: MessageContent = cast(content, MessageContent);
			        			msgDiv.append("<div>" + msg.props.text + "</div>");
			        			addCreatorDiv();
			        		case ContentTypes.LINK:
			        			var link: LinkContent = cast(content, LinkContent);
								QoidAPI.query(new RequestContext("contentLink_" + link.props.contentIid, "_mediaComp"), "content", "iid = '" + link.props.contentIid + "'" , true, true, link.props.route);
								self.linkListener = EM.addListener(
									"onContentLink_" + link.props.contentIid, 
									function(response: Response){
										if(response.result.results.hasValues()) {
											var reqCtx: RequestContext = Serializer.instance.fromJsonX(response.context, RequestContext);
											if(reqCtx.handle == "_mediaComp" && response.result.results.hasValues()) {
												var c: Content<Dynamic> = Serializer.instance.fromJsonX(response.result.results[0], Content);
												fcn(c);
											}
											
										}
									}, 
									"ContentComp-Link-" + link.props.contentIid	 
								);
								self.removeLinkListener = function() {
									EM.removeListener("onContentLink_" + link.props.contentIid, self.linkListener);
								}
			        		case _:
			        			// throw new Exception("Only image content should be displayed"); 
			        	}
			        }

			        fcn(c);

		        	
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
        						var input: JQ = new JQ("<textarea id='caption' class='ui-corner-all ui-widget-content' style=''></textarea>").appendTo(container);
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
		        	Qoid.profiles.removeListener(self._onBoardCreatorProfile);
		        	if(self.linkListener.isNotBlank()) {
		        		self.removeLinkListener();
		        	}
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.mediaComp", defineWidget());
	}
}