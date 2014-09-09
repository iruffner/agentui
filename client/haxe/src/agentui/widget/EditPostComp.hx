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
import qoid.Qoid;

using m3.helper.OSetHelper;
using agentui.widget.UrlComp;
using agentui.widget.UploadComp;
using agentui.widget.LabelComp;
using agentui.widget.ConnectionAvatar;

typedef EditPostCompOptions = {
	var content: Content<Dynamic>;
}

typedef EditPostCompWidgetDef = {
	@:optional var options: EditPostCompOptions;
	@:optional var tags: JQDroppable;
	@:optional var valueElement: JQ;
	@:optional var uploadComp:UploadComp;
	@:optional var mappedLabels:MappedSet<LabeledContent, JQ>;
	@:optional var onchangeLabelChildren:JQ->EventType->Void;
	var _create: Void->Void;
	var _initLabels:JQ->Void;
	var _addToTagsContainer:UIDroppable->Void;
	var _getDragStop:Void->(JQEvent->UIDraggable->Void);
	var _updateContent:Void->EditContentData;
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


				_initLabels: function(of:JQ) : Void {
		        	var self: EditPostCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	var edit_post_comps_tags: JQ = new JQ("#edit_post_comps_tags", selfElement);

		        	if (Qoid.groupedLabeledContent.delegate().get(self.options.content.iid) == null) {
		        		Qoid.groupedLabeledContent.addEmptyGroup(self.options.content.iid);
		        	}

		        	self.onchangeLabelChildren = function(jq: JQ, evt: EventType): Void {
	            		if(evt.isAdd()) {
	            			edit_post_comps_tags.append(jq);
	            		} else if (evt.isUpdate()) {
	            			throw new Exception("this should never happen");
	            		} else if (evt.isDelete()) {
	            			jq.remove();
	            		}
	            	};

            		self.mappedLabels = new MappedSet<LabeledContent, JQ>(Qoid.groupedLabeledContent.delegate().get(self.options.content.iid), 
		        		function(lc: LabeledContent): JQ {
		        			var connection = Qoid.connectionFromMetaLabel(lc.labelIid);
		        			if (connection != null) {
				        		var ca = new ConnectionAvatar("<div></div>").connectionAvatar({
				        				connectionIid: connection.iid,
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
			                	return ca;
		        			} else {
				        		var lc = new LabelComp("<div></div>").labelComp({
				        				labelIid: lc.labelIid,
				        				dndEnabled: true,
						        		isDragByHelper: false,
						        		containment: false,
						        		dragstop: self._getDragStop(),
				        			    });
				        		lc.css("position", "absolute")
				        		  .addClass("small");
				        		lc.position({
					                my: "top",
				                    	at: "bottom",
				                    	of: of,
				                    	collision: "flipfit",
				                    	within: self.tags
				                	});
			                	of = lc;
			                	return lc;
			                }
		        		}
		        	);
		        	self.mappedLabels.listen(self.onchangeLabelChildren);
				},

				_createButtonBlock:function(self: EditPostCompWidgetDef, selfElement:JQ): Void {
					
					var close:Void->Void = function():Void{
						selfElement.remove();
						self.destroy();
			            EM.change(EMEvent.FitWindow);
					};

					var buttonBlock = new JQ("<div></div>").css("text-align", "right").appendTo(selfElement);

					new JQ("<button title='Update Post'></button>")
						.appendTo(buttonBlock)
						.button({text: false,   icons: { primary: "ui-icon-disk"}})
						.css("width", "23px")
						.click(function(evt: JQEvent): Void {
							var ecd = self._updateContent();
							EM.change(EMEvent.UpdateContent, ecd);
							close();
						}
					);

					new JQ("<button title='Close'></button>")
						.appendTo(buttonBlock)
						.button({text: false, icons: { primary: "ui-icon-closethick"}})
						.css("width", "23px")
						.click(function(evt: JQEvent): Void {
							EM.change(EMEvent.EditContentClosed, self.options.content);
							close();
						}
					);

				},

				_updateContent: function(): EditContentData {
		        	var self: EditPostCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

					switch (self.options.content.contentType) {
						case "TEXT":
							cast(self.options.content, MessageContent).props.text = self.valueElement.val();
						case "URL":
							cast(self.options.content, UrlContent).props.url = self.valueElement.val();
						case "IMAGE":
							cast(self.options.content, ImageContent).props.imgSrc = self.uploadComp.value();
						case "AUDIO":
							cast(self.options.content, AudioContent).props.audioSrc = self.uploadComp.value();
						case "VERIFICATION":
		        			throw new Exception("VerificationContent should not be displayed"); 
					}

					var ecd = new EditContentData(self.options.content);

					self.tags.children(".label").each(function(i: Int, dom: Element): Void {
						var labelComp: LabelComp = new LabelComp(dom);
						ecd.labelIids.push(labelComp.getLabel().iid);
					});
					
					self.tags.children(".connectionAvatar").each(function(i: Int, dom: Element): Void {
						var conn: ConnectionAvatar = new ConnectionAvatar(dom);
						ecd.labelIids.push(conn.getConnection().labelIid);
					});

					return ecd;
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

		        	if (self.options.content.contentType == "TEXT") {
			        	var textInput: JQ = new JQ("<div class='postContainer boxsizingBorder'></div>");
			        	textInput.appendTo(section);
			        	self.valueElement = new JQ("<textarea class='boxsizingBorder container' style='resize: none;'></textarea>")
			        			.appendTo(textInput)
			        			.attr("id", "textInput_ta");
			        	self.valueElement.val(cast(self.options.content, MessageContent).props.text);
			        	tab_class = "ui-icon-document";
			        }

		        	else if (self.options.content.contentType == "URL") {
			        	var urlComp: UrlComp = new UrlComp("<div class='postContainer boxsizingBorder'></div>").urlComp();
		        		self.valueElement = urlComp.urlInput();
			        	urlComp.appendTo(section);
			        	urlComp.urlInput().val(cast(self.options.content, UrlContent).props.url);
			        	tab_class = "ui-icon-link";
					}

		        	else if (self.options.content.contentType == "IMAGE") {
				        var options:UploadCompOptions = {contentType: "IMAGE"};
				        var imageInput = new UploadComp("<div class='postContainer boxsizingBorder'></div>").uploadComp(options);
		        		self.uploadComp = imageInput;
			        	imageInput.appendTo(section);
			        	imageInput.setPreviewImage(cast(self.options.content, ImageContent).props.imgSrc);
			        	tab_class = "ui-icon-image";
		        	}

		        	else if (self.options.content.contentType == "AUDIO") {
				        var options:UploadCompOptions = {contentType: "AUDIO"};
			        	var audioInput = new UploadComp("<div class='postContainer boxsizingBorder'></div>").uploadComp(options);
		        		self.uploadComp = audioInput;
			        	audioInput.appendTo(section);
			        	audioInput.setPreviewImage(cast(self.options.content, AudioContent).props.audioSrc);
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
				    			return d.is(".filterable") && !d.is(".aliasAvatar");
				    		},
							activeClass: "ui-state-hover",
					      	hoverClass: "ui-state-active",
					      	drop: function( event: JQEvent, _ui: UIDroppable ) {
					      		// Check to see if the element being dropped is already in the container
						      	if (isDuplicate(".connectionAvatar", _ui.draggable, tags, function(ele:JQ){return new ConnectionAvatar(ele).getConnection().iid;} )
					      		 || isDuplicate(".labelComp"       , _ui.draggable, tags, function(ele:JQ){return new LabelComp(ele).getLabel().iid;})) {
					      			if (_ui.draggable.parent().attr("id") != "edit_post_comps_tags") {
						      			_ui.draggable.draggable("option", "revert", true);
						      		}
					      			return;
					      		}

					      		self._addToTagsContainer(_ui);
					      	}
						});

					self.tags = tags;

		        	self._initLabels(null);
		        },

		        destroy: function() {
		        	var self: EditPostCompWidgetDef = Widgets.getSelf();
		        	self.mappedLabels.removeListener(self.onchangeLabelChildren);
		            untyped JQ.Widget.prototype.destroy.call(JQ.curNoWrap);
		        }
		    };
		}
		JQ.widget( "ui.editPostComp", defineWidget());
	}
}
