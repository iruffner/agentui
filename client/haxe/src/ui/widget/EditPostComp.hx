package ui.widget;

import js.html.Element;

import m3.jq.JQ;
import m3.jq.JQDroppable;
import m3.jq.JQDraggable;
import m3.widget.Widgets;
import ui.widget.UploadComp;
import ui.model.EM;
import ui.model.ModelObj;
import m3.observable.OSet;
import m3.util.UidGenerator;
import m3.util.JqueryUtil;
import m3.exception.Exception;

using m3.helper.OSetHelper;
using ui.widget.ContentComp;
using ui.widget.UrlComp;
using ui.widget.UploadComp;
using ui.widget.LabelComp;
using ui.widget.ConnectionAvatar;

typedef EditPostCompOptions = {
	var content: Content;
}

typedef EditPostCompWidgetDef = {
	@:optional var options: EditPostCompOptions;
	@:optional var tags: JQDroppable;
	@:optional var valueElement: JQ;
	@:optional var uploadComp:UploadComp;
	var _create: Void->Void;
	var _initConections:Void->JQ;
	var _initLabels:JQ->Void;
	var _addToTagsContainer:UIDroppable->Void;
	var _getDragStop:Void->(JQEvent->UIDraggable->Void);
	var _updateContent:Void->Void;
	var _createButtonBlock:EditPostCompWidgetDef->JQ->Void;
	var destroy: Void->Void;
}


@:native("$")
extern class EditPostComp extends JQ {

	@:overload(function<T>(cmd : String):T{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function editPostComp(?opts: EditPostCompOptions): EditPostComp;

	private static function __init__(): Void {
		var defineWidget: Void->EditPostCompWidgetDef = function(): EditPostCompWidgetDef {
			return {

				_getDragStop:function():(JQEvent->UIDraggable->Void) {
		        	var self: EditPostCompWidgetDef = Widgets.getSelf();
					return function(dragstopEvt: JQEvent, dragstopUi: UIDraggable): Void {
	                	if(!self.tags.intersects(dragstopUi.helper)) {
	                		dragstopUi.helper.remove();
	                		JqueryUtil.deleteEffects(dragstopEvt);
	                	}
	                };
				},

				_addToTagsContainer: function(_ui: UIDroppable):Void{
		        	var self: EditPostCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

	                var clone: JQDraggable = _ui.draggable.data("clone")(_ui.draggable, false, false, self._getDragStop());
	                clone.addClass("small");
	                var cloneOffset: {top: Int, left: Int} = clone.offset();
	                
                	self.tags.append(clone);
	                clone.css({
	                    "position": "absolute"
	                });

	                if (cloneOffset.top != 0) {
	                	clone.offset(cloneOffset);
                	} else {
	                	clone.position({
	                    	my: "left top",
	                    	at: "left top",
	                    	of: _ui.helper,
	                    	collision: "flipfit",
	                    	within: self.tags
                		});
	                }

				},

				_initConections: function() : JQ {
		        	var self: EditPostCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	var connIter: Iterator<Connection> = self.options.content.connectionSet.iterator();
		        	var edit_post_comps_tags: JQ = new JQ("#edit_post_comps_tags", selfElement);

		        	var of:JQ = null;

		        	while(connIter.hasNext()) {
		        		var connection: Connection = connIter.next();

		        		var ca = new ConnectionAvatar("<div></div>").connectionAvatar({
		        				connection: connection,
		        				dndEnabled: true,
				        		isDragByHelper: false,
				        		containment: false,
				        		dragstop: self._getDragStop()
		        			}).appendTo(edit_post_comps_tags)
		        		      .css("position", "absolute");

			        	ca.position({
		                    	my: "left",
		                    	at: "right",
		                    	of: of,
		                    	collision: "flipfit",
		                    	within: self.tags
	                	});

	                	of = ca;
		        	}
		        	return of;
				},

				_initLabels: function(of:JQ) : Void {
		        	var self: EditPostCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	var labelIter: Iterator<Label> = self.options.content.labelSet.iterator();

		        	var edit_post_comps_tags: JQ = new JQ("#edit_post_comps_tags", selfElement);
		        	while(labelIter.hasNext()) {
		        		var label: Label = labelIter.next();
		        		var lc = new LabelComp("<div></div>").labelComp({
		        				label: label,
		        				dndEnabled: true,
				        		isDragByHelper: false,
				        		containment: false,
				        		dragstop: self._getDragStop(),
		        			}).appendTo(edit_post_comps_tags)
		        		      .css("position", "absolute")
		        		      .addClass("small");

			        	lc.position({
		                    	my: "top",
		                    	at: "bottom",
		                    	of: of,
		                    	collision: "flipfit",
		                    	within: self.tags
	                	});
	                	of = lc;
		        	}
				},

				_createButtonBlock:function(self: EditPostCompWidgetDef, selfElement:JQ): Void {
					
					var close:Void->Void = function():Void{
						selfElement.remove();
						self.destroy();
			            EM.change(EMEvent.FitWindow);
					};

					var buttonBlock = new JQ("<div></div>").css("text-align", "right").appendTo(selfElement);

					var removeButton: JQ = new JQ("<button title='Remove Post'></button>")
		        							.appendTo(buttonBlock)
		        							.button({text: false,  icons: { primary: "ui-icon-circle-close"}})
		        							.css("width", "23px")
		        							.click(function(evt: JQEvent): Void {
		        								evt.stopPropagation();
		        								JqueryUtil.confirm("Delete Post", "Are you sure you want to remove this post?", 
		        									function(){
		        										close();
		        										AppContext.CONTENT.delete(self.options.content);
		        									});
		        							});

					var updateButton: JQ = new JQ("<button title='Update Post'></button>")
		        							.appendTo(buttonBlock)
		        							.button({text: false,   icons: { primary: "ui-icon-disk"}})
		        							.css("width", "23px")
		        							.click(function(evt: JQEvent): Void {
		        								self._updateContent();
		        								AppContext.CONTENT.update(self.options.content);
		        								close();
		        							});


					var closeButton: JQ = new JQ("<button title='Close'></button>")
		        							.appendTo(buttonBlock)
		        							.button({text: false, icons: { primary: "ui-icon-closethick"}})
		        							.css("width", "23px")
		        							.click(function(evt: JQEvent): Void {
		        								close();
		        								EM.change(EMEvent.EditContentClosed, self.options.content);
		        							});

				},

				_updateContent: function(): Void {
		        	var self: EditPostCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

					switch (self.options.content.type) {
						case ContentType.TEXT:
							cast(self.options.content, MessageContent).text = self.valueElement.val();
						case ContentType.URL:
							cast(self.options.content, UrlContent).url = self.valueElement.val();
						case ContentType.IMAGE:
							cast(self.options.content, ImageContent).imgSrc = self.uploadComp.value();
						case ContentType.AUDIO:
							cast(self.options.content, AudioContent).audioSrc = self.uploadComp.value();
					}

					self.options.content.labelSet.clear();
					self.options.content.connectionSet.clear();

					self.tags.children(".label").each(function(i: Int, dom: Element): Void {
						var labelComp: LabelComp = new LabelComp(dom);
						self.options.content.labelSet.add(labelComp.getLabel());
					});
					
					self.tags.children(".connectionAvatar").each(function(i: Int, dom: Element): Void {
						var conn: ConnectionAvatar = new ConnectionAvatar(dom);
						self.options.content.connectionSet.add( conn.getConnection() );
					});
				},

		        _create: function(): Void {
		        	var self: EditPostCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of EditPostComp must be a div element");
		        	}
		        	selfElement.addClass("post container shadow " + Widgets.getWidgetClasses());

		        	self._createButtonBlock(self, selfElement);

		        	var section: JQ = new JQ("<section id='postSection'></section>").appendTo(selfElement);

		        	var tab_class:String = "";

		        	if (self.options.content.type == ContentType.TEXT) {
			        	var textInput: JQ = new JQ("<div class='postContainer boxsizingBorder'></div>");
			        	textInput.appendTo(section);
			        	self.valueElement = new JQ("<textarea class='boxsizingBorder container' style='resize: none;'></textarea>")
			        			.appendTo(textInput)
			        			.attr("id", "textInput_ta");
			        	self.valueElement.val(cast(self.options.content, MessageContent).text);
			        	tab_class = "ui-icon-document";
			        }

		        	else if (self.options.content.type == ContentType.URL) {
			        	var urlComp: UrlComp = new UrlComp("<div class='postContainer boxsizingBorder'></div>").urlComp();
		        		self.valueElement = urlComp.urlInput();
			        	urlComp.appendTo(section);
			        	urlComp.urlInput().val(cast(self.options.content, UrlContent).url);
			        	tab_class = "ui-icon-link";
					}

		        	else if (self.options.content.type == ContentType.IMAGE) {
				        var options:UploadCompOptions = {contentType: ContentType.IMAGE};
				        var imageInput = new UploadComp("<div class='postContainer boxsizingBorder'></div>").uploadComp(options);
		        		self.uploadComp = imageInput;
			        	imageInput.appendTo(section);
			        	imageInput.setPreviewImage(cast(self.options.content, ImageContent).imgSrc);
			        	tab_class = "ui-icon-image";
		        	}

		        	else if (self.options.content.type == ContentType.AUDIO) {
				        var options:UploadCompOptions = {contentType: ContentType.AUDIO};
			        	var audioInput = new UploadComp("<div class='postContainer boxsizingBorder'></div>").uploadComp(options);
		        		self.uploadComp = audioInput;
			        	audioInput.appendTo(section);
			        	audioInput.setPreviewImage(cast(self.options.content, AudioContent).audioSrc);
			        	tab_class = "ui-icon-volume-on";
			        }

		        	var tabs: JQ = new JQ("<aside class='tabs'></aside>").appendTo(section);
			        var tab: JQ = new JQ("<span class='ui-icon " +  tab_class + " ui-icon-document active ui-corner-left active'></span>")
			        						.appendTo(tabs);

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

					var tags: JQDroppable = new JQDroppable("<aside id='edit_post_comps_tags' class='tags container boxsizingBorder'></aside>");
					tags.appendTo(section);
					tags.droppable({
							accept: function(d) {
				    			return d.is(".filterable");
				    		},
							activeClass: "ui-state-hover",
					      	hoverClass: "ui-state-active",
					      	drop: function( event: JQEvent, _ui: UIDroppable ) {
					      		// Check to see if the element being dropped is already in the container
						      	if (isDuplicate(".connectionAvatar", _ui.draggable, tags, function(ele:JQ){return new ConnectionAvatar(ele).getConnection().uid;} )
					      		 || isDuplicate(".labelComp"       , _ui.draggable, tags, function(ele:JQ){return new LabelComp(ele).getLabel().uid;})) {
					      			if (_ui.draggable.parent().attr("id") != "edit_post_comps_tags") {
						      			_ui.draggable.draggable("option", "revert", true);
						      		}
					      			return;
					      		}

					      		self._addToTagsContainer(_ui);
					      	}
						});

					self.tags = tags;

		        	var jq = self._initConections();
		        	self._initLabels(jq);
		        },

		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call(JQ.curNoWrap);
		        }
		    };
		}
		JQ.widget( "ui.editPostComp", defineWidget());
	}
}
