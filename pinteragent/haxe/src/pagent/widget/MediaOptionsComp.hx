package pagent.widget;

import m3.log.Logga;
import pagent.model.PinterModel.ConfigContent;
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
import qoid.QoidAPI;

using m3.helper.OSetHelper;
using m3.helper.StringHelper;
using Lambda;

typedef MediaOptionsCompOptions = {
	var content: Content<Dynamic>;
}

typedef MediaOptionsCompWidgetDef = {
	@:optional var options: MediaOptionsCompOptions;
	var _create: Void->Void;
	var _addComment: String->Void;
	var update: ImageContent->Void;
	var destroy: Void->Void;
	@:optional var mappedLabels:MappedSet<LabeledContent, JQ>;
	@:optional var onchangeLabelChildren:JQ->EventType->Void;
	var _showEditCaptionPopup: ImageContent->JQ->Void;
	var _showEditAlbumsPopup: ImageContent->JQ->Void;
	@:optional var labelListener: LabeledContent->EventType->Void;
}


class MediaOptionsCompHelper {
	public static function content(cc: MediaOptionsComp): Content<Dynamic> {
		return cc.mediaOptionsComp("option", "content");
	}

	public static function update(cc: MediaOptionsComp, c:ImageContent): Void {
		return cc.mediaOptionsComp("update", c);
	}
}


@:native("$")
extern class MediaOptionsComp extends ContentComp {

	@:overload(function<T>(cmd : String):T{})
	@:overload(function<T>(cmd : String, param:Dynamic):T{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function mediaOptionsComp(?opts: MediaOptionsCompOptions): MediaOptionsComp;

	private static function __init__(): Void {
		var defineWidget: Void->MediaOptionsCompWidgetDef = function(): MediaOptionsCompWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: MediaOptionsCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of MediaOptionsComp must be a div element");
		        	}

		        	selfElement.addClass("_mediaOptionsComp " + Widgets.getWidgetClasses());
		        	

					var content: Content<Dynamic> = self.options.content;

                    if(content.connectionIid == Qoid.currentAlias.connectionIid) {
                        var setDefaultBtn: JQ = new JQ("<button class='setDefaultBtn'>Use as Cover Picture</button>")
                            .click(function(evt: JQEvent) {
                                    //find this config
                                    var config: ConfigContent = null;
                                    var event: String = null;
                                    PinterContext.boardConfigs.iter(function(c: ConfigContent) {
                                            var match: LabeledContent = Qoid.labeledContent.getElementComplex(c.iid+"_"+PinterContext.CURRENT_BOARD, function(lc: LabeledContent): String {
                                                        return lc.contentIid+"_"+lc.labelIid;
                                                    });
                                            if(match != null) config = c;
                                        });
                                    if(config == null) {
                                        config = new ConfigContent();
                                        event = EMEvent.CreateContent;
                                    } else {
                                        event = EMEvent.UpdateContent;
                                    }
                                    config.props.defaultImg = self.options.content.props.imgSrc;
                                    config.props.boardIid = PinterContext.CURRENT_BOARD;
                                    
                                    var ccd = new EditContentData(config);
                                    ccd.labelIids.push(PinterContext.CURRENT_BOARD);
                                    EM.change(event, ccd);
                                })
                            .button()
                            .appendTo(selfElement);
                    }
					   
                    var pinBtn: JQ = new JQ("<button class='pinBtn'>Pin It</button>")
                            .click(function(evt: JQEvent) {
                                    self._showEditAlbumsPopup(cast self.options.content, JQ.cur);
                                    evt.stopPropagation();
                                })
                            .button()
                            .appendTo(selfElement);                

                    if(content.connectionIid == Qoid.currentAlias.connectionIid) {
                        var unpinBtn: JQ = new JQ("<button class='unpinBtn'>Unpin It</button>")
                            .click(function(evt: JQEvent) {
                                    EM.listenOnce(EMEvent.OnRemoveContentLabel, function(n: {}) {
                                            PinterContext.PAGE_MGR.CURRENT_PAGE = PinterPageMgr.BOARD_SCREEN;
                                        });
                                    QoidAPI.removeContentLabel( content.iid, PinterContext.CURRENT_BOARD);
                                })
                            .button()
                            .appendTo(selfElement);
                    }
				},

				_addComment: function(str: String) {
					var self: MediaOptionsCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

				},

				_showEditCaptionPopup: function(c: ImageContent, reference: JQ): Void {
					var self: MediaOptionsCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

        			var popup: Popup = new Popup("<div class='updateCaptionPopup' style='position: absolute;width:600px;'></div>");
        			popup.appendTo(selfElement);
        			popup = popup.popup({
        					createFcn: function(el: JQ): Void {
        						var updateCaption: Void->Void = null;
        						var stopFcn: JQEvent->Void = function (evt: JQEvent): Void { evt.stopPropagation(); };
        						var container: JQ = new JQ("<div class='icontainer'></div>").appendTo(el);
        						container.click(stopFcn);
        						var parent: JQ = null;
        						container.append("<label for='caption'>Caption: </label> ");
        						var input: JQ = new JQ("<textarea id='caption' class='ui-corner-all ui-widget-content' style='font-size: 20px;'></textarea>").appendTo(container);
        						input.focus();
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
					var self: MediaOptionsCompWidgetDef = Widgets.getSelf();
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
    							container.append("<label for='labelParent'>Board: </label> ");
        						var select: JQ = new JQ("<select id='labelParent' class='ui-corner-left ui-widget-content' style='width: 191px;'></select>").appendTo(container);
        						select.click(stopFcn);
        						var aliasLabels = Qoid.getLabelDescendents(PinterContext.ROOT_BOARD.iid);
        						var iter: Iterator<Label> = aliasLabels.iterator();
        						while(iter.hasNext()) {
        							var label: Label = iter.next();
        							if (label.iid != PinterContext.CURRENT_BOARD && label.iid != PinterContext.COMMENTS.iid) {
	        							var option = "<option value='" + label.iid + "'>" + label.name + "</option>";
	        							select.append(option);
	        						}
        						}
        						var buttonText = "Pin It";
        						container.append("<br/>");
        						new JQ("<button class='fright ui-helper-clearfix' style='font-size: .8em;'>" + buttonText + "</button>")
        							.button()
        							.appendTo(container)
        							.click(function(evt: JQEvent): Void {
        								updateLabels();
        							});

        						updateLabels = function(): Void {
                                    if(c.connectionIid == Qoid.currentAlias.connectionIid) {
    									Logga.DEFAULT.info("Add content label | " + c.iid);
                                        QoidAPI.addContentLabel( c.iid, select.val());
                                    } else {
                                        Logga.DEFAULT.info("Add content link | " + c.iid);
                                        var link: LinkContent = new LinkContent();
                                        link.props.contentIid = c.iid;
                                        link.props.route = [c.connectionIid];
                                        var edc: EditContentData = new EditContentData(link, [select.val()]);
                                        EM.change(EMEvent.CreateContent, edc);
                                    }
									new JQ("body").click();
        						};
        					},
        					positionalElement: reference
        				});

					},

		        update: function(content:ImageContent) : Void {
		        	
		        },

		        destroy: function() {
		        	var self: MediaOptionsCompWidgetDef = Widgets.getSelf();
		        	Qoid.groupedLabeledContent.getElement(self.options.content.iid).removeListener(self.labelListener);
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.mediaOptionsComp", defineWidget());
	}
}