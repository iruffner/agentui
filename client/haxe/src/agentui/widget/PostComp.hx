package agentui.widget;

import js.html.Element;

import m3.jq.JQ;
import m3.jq.JQDroppable;
import m3.jq.JQDraggable;
import m3.widget.Widgets;
import agentui.widget.UploadComp;
import agentui.model.EM;
import qoid.model.ModelObj;
import m3.observable.OSet;
import m3.util.UidGenerator;
import m3.util.JqueryUtil;
import m3.exception.Exception;
import m3.log.Logga;

using m3.helper.OSetHelper;
using agentui.widget.UploadComp;
using agentui.widget.UrlComp;
using agentui.widget.LabelComp;
using agentui.widget.ConnectionAvatar;

typedef PostCompOptions = {
}

typedef PostCompWidgetDef = {
	@:optional var options: PostCompOptions;
	var _create: Void->Void;
	var destroy: Void->Void;
}




@:native("$")
extern class PostComp extends JQ {

	@:overload(function<T>(cmd : String):T{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function postComp(?opts: PostCompOptions): PostComp;

	private static function __init__(): Void {
		var defineWidget: Void->PostCompWidgetDef = function(): PostCompWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: PostCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of PostComp must be a div element");
		        	}

		        	selfElement.addClass("postComp container shadow " + Widgets.getWidgetClasses());

		        	var section: JQ = new JQ("<section id='postSection'></section>").appendTo(selfElement);

		        	var addConnectionsAndLabels: EditContentData->Void = null;

		        	var doTextPost: JQEvent->ContentType->String->Void = function(evt: JQEvent, contentType: ContentType, value:String): Void {
		        		Logga.DEFAULT.debug("Post new text content");
						evt.preventDefault();

						var ccd = new EditContentData(ContentFactory.create(contentType, value));						
						addConnectionsAndLabels(ccd);
						EM.change(EMEvent.CreateContent, ccd);
		        	};

		        	var doTextPostForElement: JQEvent->ContentType->JQ->Void = function(evt: JQEvent, contentType: ContentType, ele:JQ): Void {
		        		doTextPost(evt, contentType, ele.val());
						ele.val("");
		        	};

		        	var textInput: JQ = new JQ("<div class='postContainer'></div>").appendTo(section);
		        	var ta: JQ = new JQ("<textarea class='boxsizingBorder container' style='resize: none;'></textarea>")
		        			.appendTo(textInput)
		        			.attr("id", "textInput_ta")
		        			.keypress(function(evt: JQEvent): Void {
		        					if( !(evt.altKey || evt.shiftKey || evt.ctrlKey) && evt.charCode == 13 ) {
		        						doTextPostForElement(evt, ContentType.TEXT, new JQ(evt.target));
		        					}
		        				})
		        			;

		        	var urlComp: UrlComp = new UrlComp("<div class='postContainer boxsizingBorder'></div>").urlComp();
		        	urlComp
		        		.appendTo(section)
		        		.keypress(function(evt: JQEvent): Void {
        					if( !(evt.altKey || evt.shiftKey || evt.ctrlKey) && evt.charCode == 13 ) {
        						doTextPostForElement(evt, ContentType.URL, new JQ(evt.target));
        					}
        				});

		        	var options:UploadCompOptions = {contentType: ContentType.IMAGE};
		        	var imageInput: UploadComp = new UploadComp("<div class='postContainer boxsizingBorder'></div>").uploadComp(options);
		        	imageInput.appendTo(section);
		        	
		        	options.contentType = ContentType.AUDIO;
		        	var audioInput: UploadComp = new UploadComp("<div class='postContainer boxsizingBorder'></div>").uploadComp(options);
		        	audioInput.appendTo(section);

		        	var tabs: JQ = new JQ("<aside class='tabs'></aside>").appendTo(section);
		        	var textTab: JQ = new JQ("<span class='ui-icon ui-icon-document active ui-corner-left'></span>")
		        						.appendTo(tabs)
		        						.click(function(evt: JQEvent): Void {
							        			tabs.children(".active").removeClass("active");
							        			JQ.cur.addClass("active");
							        			textInput.show();
							        			urlComp.hide();
							        			imageInput.hide();
							        			audioInput.hide();
							        		});

		        	var urlTab: JQ = new JQ("<span class='ui-icon ui-icon-link ui-corner-left'></span>")
		        						.appendTo(tabs)
		        						.click(function(evt: JQEvent): Void {
							        			tabs.children(".active").removeClass("active");
							        			JQ.cur.addClass("active");
							        			textInput.hide();
							        			urlComp.show();
							        			imageInput.hide();
							        			audioInput.hide();
							        		});

		        	var imgTab: JQ = new JQ("<span class='ui-icon ui-icon-image ui-corner-left'></span>")
		        						.appendTo(tabs)
		        						.click(function(evt: JQEvent): Void {
							        			tabs.children(".active").removeClass("active");
							        			JQ.cur.addClass("active");
							        			textInput.hide();
							        			urlComp.hide();
							        			imageInput.show();
							        			audioInput.hide();
							        		});

		        	var audioTab: JQ = new JQ("<span class='ui-icon ui-icon-volume-on ui-corner-left'></span>")
		        						.appendTo(tabs)
		        						.click(function(evt: JQEvent): Void {
							        			tabs.children(".active").removeClass("active");
							        			JQ.cur.addClass("active");
							        			textInput.hide();
							        			urlComp.hide();
							        			imageInput.hide();
							        			audioInput.show();
							        		});
					urlComp.hide();
					imageInput.hide();
					audioInput.hide();

					var isDuplicate = function(selector:String, ele:JQ, container: JQDroppable, getUid:JQ->String) {
						var is_duplicate = false;
			      		if (ele.is(selector)) {
				      		var new_uid:String = getUid(ele);

				      		container.children(selector).each(function(i: Int, dom: Element): Void {
				      			var uid:String = getUid(new JQ(dom));
				      			if (new_uid == uid) {
				      				is_duplicate = true;
				      			}
				      		});
						}
						return is_duplicate;
					};

					var tags: JQDroppable = new JQDroppable("<aside id='post_comps_tags' class='tags container boxsizingBorder'></aside>");
					tags.appendTo(section);
					tags.droppable({
							accept: function(d) {
				    			return d.is(".filterable") && !d.is(".aliasAvatar");
				    		},
							activeClass: "ui-state-hover",
					      	hoverClass: "ui-state-active",
					      	drop: function( event: JQEvent, _ui: UIDroppable ) {
					      		// Check to see if the element being dropped is already in the container
						      	if (isDuplicate(".connectionAvatar", _ui.draggable, tags, function(ele:JQ){return new ConnectionAvatar(ele).getConnection().iid;} )
					      		 || isDuplicate(".labelComp"       , _ui.draggable, tags, function(ele:JQ){return new LabelComp(ele).getLabel().iid;})) {
					      			if (_ui.draggable.parent().attr("id") != "post_comps_tags") {
						      			_ui.draggable.draggable("option", "revert", true);
						      		}
					      			return;
					      		}

					      		var dragstop = function(dragstopEvt: JQEvent, dragstopUi: UIDraggable): Void {
				                	if(!tags.intersects(dragstopUi.helper)) {
				                		dragstopUi.helper.remove();
				                		JqueryUtil.deleteEffects(dragstopEvt);
				                	}
				                };

				                var clone: JQDraggable = _ui.draggable.data("clone")(_ui.draggable, false, false, dragstop);
				                clone.addClass("small");
				                var cloneOffset: {top: Int, left: Int} = clone.offset();
				                
			                	JQ.cur.append(clone);
				                clone.css({
				                    "position": "absolute"
				                });

				                if (cloneOffset.top != 0) {
				                	clone.offset(cloneOffset);
			                	} else {
				                	clone.position({
				                    	my: "left top",
				                    	at: "left top",
				                    	of: _ui.helper, //event, // _ui.helper can be smoother, but since we don't always use a helper, sometimes we're trying to position of ourselves
				                    	collision: "flipfit",
				                    	within: ".tags"
		                    		});
				                }
					      	}
						});

					addConnectionsAndLabels = function(ccd: EditContentData): Void {
						tags.children(".label").each(function(i: Int, dom: Element): Void {
							var labelComp: LabelComp = new LabelComp(dom);
							ccd.labelIids.push(labelComp.getLabel().iid);
						});
						tags.children(".connectionAvatar").each(function(i: Int, dom: Element): Void {
							var avatar: ConnectionAvatar = new ConnectionAvatar(dom);
							var connection = avatar.getConnection();
							ccd.labelIids.push(connection.metaLabelIid);
						});
					}

					var postButton: JQ = new JQ("<button>Post</button>")
		        							.appendTo(selfElement)
		        							.button()
		        							.click(function(evt: JQEvent): Void {
		        								if (tags.children(".label").length == 0) {
		        									JqueryUtil.alert("Labels are required.  Please add at least one label to this content.");
		        									return;
		        								}

		        								if (textInput.isVisible()) {
		        									var ta = new JQ("#textInput_ta");
													doTextPostForElement(evt, ContentType.TEXT, ta);
		        								} else if (urlComp.isVisible()) {
		        									doTextPostForElement(evt, ContentType.URL, urlComp.urlInput());
		        								} else {
		        									doTextPost(evt, ContentType.IMAGE, imageInput.value());
		        									imageInput.clear();
		        								}
		        								tags.children(".label").remove();
		        								tags.children(".connectionAvatar").remove();
		        							});
		        },

		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.postComp", defineWidget());
	}
}
