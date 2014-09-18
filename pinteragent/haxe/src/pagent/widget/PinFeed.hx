package pagent.widget;

import js.html.Element;

import m3.jq.JQ;
import m3.jq.JQDroppable;
import m3.util.UidGenerator;
import pagent.model.EM;
import pagent.model.ContentSource;
import qoid.model.ModelObj;
import m3.observable.OSet;
import m3.exception.Exception;
import m3.widget.Widgets;
import m3.helper.StringHelper;
import agentui.widget.UploadComp;

using pagent.widget.ContentComp;
using m3.jq.M3Dialog;

typedef PinFeedOptions = {
	var isMyBoard: Bool;
}

typedef PinFeedWidgetDef = {
	@:optional var options: PinFeedOptions;
	var _create: Void->Void;
	var destroy: Void->Void;

	@:optional var _onDestroy: Void->Void;
}

@:native("$")
extern class PinFeed extends JQ {

	@:overload(function(cmd : String):Bool{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function pinFeed(opts: PinFeedOptions): PinFeed;

	private static function __init__(): Void {
		var defineWidget: Void->PinFeedWidgetDef = function(): PinFeedWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: PinFeedWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of PinFeed must be a div element");
		        	}

		        	selfElement.addClass("_pinFeed " + Widgets.getWidgetClasses()).css("padding", "10px");
		        	var div: JQ = new JQ("<div class='wrapper'></div>").appendTo(selfElement);

		        	var addPinDiv: JQ = null;
		        	if(self.options.isMyBoard) {
			        	addPinDiv = new JQ("<div class='addPinDiv ui-corner-all'></div>").appendTo(div);

			        	var uploadButton: JQ = new JQ("<button class='uploadButton'>Add Pin</button>")
							.appendTo(addPinDiv)
							.button({
									{
					                    icons: {
					                        primary: "ui-icon-circle-plus"
					                      }
					                }
								})
							.click(function(evt: JQEvent) {
									var dlg: M3Dialog = new M3Dialog("<div id='profilePictureUploader'></div>");
									dlg.appendTo(selfElement);
									var uploadComp: UploadComp = new UploadComp("<div class='boxsizingBorder' style='height: 150px;'></div>");
									uploadComp.appendTo(dlg);
									uploadComp.uploadComp({
											onload: function(bytes: String): Void {
												dlg.close();
												var ccd = new EditContentData(ContentFactory.create(ContentTypes.IMAGE, bytes));
												ccd.semanticId = UidGenerator.create(32);
												ccd.labelIids.push(PinterContext.CURRENT_BOARD);
												EM.change(EMEvent.CreateContent, ccd);
											}
										});
									
									dlg.m3dialog({
											width: 400,
											height: 305,
											title: "Pin Picture to Board",
											buttons: {
												"Cancel" : function() {
													M3Dialog.cur.close();
												}
											}
										});
								});
					}

		        	var mapListener = function(content: Content<Dynamic>, contentComp:ContentComp, evt: EventType): Void {
		        		if(content != null && ContentTypes.IMAGE == content.contentType) {
		            		if(evt.isAdd()) {
		            			var contentComps = new JQ(".contentComp");
		            			if (contentComps.length == 0) {
		            				if(self.options.isMyBoard)
			            				contentComp.insertAfter( addPinDiv );
		            				else
		            					contentComp.appendTo(div);
		            			} else {
		            				var comps = new JQ(".contentComp");
		            				var inserted = false;
		            				comps.each(function(i: Int, dom: Element):Dynamic{
		            					var cc = new ContentComp(dom);
		            					var cmp = StringHelper.compare(contentComp.content().getTimestamp(), cc.content().getTimestamp());
		            					if (cmp > 0) {
		            						cc.before(contentComp);
		            						inserted = true;
		            						return false;
		            					} else {
		            						return true;
		            					}
		            				});

		            				if (!inserted) {
		            					comps.last().after(contentComp);
		            				}
		            			}
		            		} else if (evt.isUpdate()) {
		            			contentComp.update(content);
		            		} else if (evt.isDelete()) {
		            			contentComp.remove();
		            			//TODO go back to the album
		            		}
		            	}
	            	};

	            	var beforeSetContent = function() {
			        	selfElement.find(".contentComp").remove();
	            	};
	            	var widgetCreator = function(content:Content<Dynamic>):ContentComp {
	            		return new ContentComp("<div></div>").contentComp({
	        				content: content
	        			});
	            	}
	            	var id: String = ContentSource.addListener(mapListener, beforeSetContent, widgetCreator);
	            	self._onDestroy = function() {
	            		ContentSource.removeListener(id);
	            	}
		        },
		        
		        destroy: function() {
		        	var self: PinFeedWidgetDef = Widgets.getSelf();
		        	self._onDestroy();
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.pinFeed", defineWidget());
	}
}