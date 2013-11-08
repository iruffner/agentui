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
	var contentComp: JQ;
}

typedef EditPostCompWidgetDef = {
	@:optional var options: EditPostCompOptions;
	var _create: Void->Void;
	var _initConections:Void->Void;
	var _initLabels:Void->Void;
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

				_initConections: function() : Void {
		        	var self: EditPostCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	var connIter: Iterator<Connection> = self.options.content.connectionSet.iterator();
		        	var edit_post_comps_tags: JQ = new JQ("#edit_post_comps_tags", selfElement);

		        	while(connIter.hasNext()) {
		        		var connection: Connection = connIter.next();
		        		new ConnectionAvatar("<div></div>").connectionAvatar({
		        				dndEnabled: true,
		        				connection: connection
		        			}).appendTo(edit_post_comps_tags);
		        	}
				},

				_initLabels: function() : Void {
		        	var self: EditPostCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	var labelIter: Iterator<Label> = self.options.content.labelSet.iterator();

		        	var edit_post_comps_tags: JQ = new JQ("#edit_post_comps_tags", selfElement);
		        	while(labelIter.hasNext()) {
		        		var label: Label = labelIter.next();
		        		new LabelComp("<div class='small'></div>").labelComp({
		        				dndEnabled: true,
		        				label: label
		        			}).appendTo(edit_post_comps_tags);
		        	}
				},

		        _create: function(): Void {

		        	var self: EditPostCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of EditPostComp must be a div element");
		        	}
		        	selfElement.addClass("post container shadow " + Widgets.getWidgetClasses());

		        	var section: JQ = new JQ("<section id='postSection'></section>").appendTo(selfElement);

		        	var addConnectionsAndLabels: Content->Void = null;

		        	var doTextPost = function(evt: JQEvent, contentType: ContentType, value:String): Void {
		        		ui.AgentUi.LOGGER.debug("Post new text content");
						evt.preventDefault();
						
						var msg: MessageContent = new MessageContent();
						msg.type          = contentType;
						msg.uid           = UidGenerator.create();
						msg.text          = value;
						msg.connectionSet = new ObservableSet<Connection>(ModelObj.identifier);
						msg.labelSet      = new ObservableSet<Label>(ModelObj.identifier);

						addConnectionsAndLabels(msg);
						EM.change(EMEvent.NewContentCreated, msg);
		        	};

		        	var doTextPostForElement = function(evt: JQEvent, contentType: ContentType, ele:JQ): Void {
		        		doTextPost(evt, contentType, ele.val());
						ele.val("");
		        	};

		        	// Define the elements.  Don't add them to the DOM unless they are to be displayed.
		        	var textInput: JQ = new JQ("<div class='postContainer'></div>");
		        	var urlComp: UrlComp = new UrlComp("<div class='postContainer boxsizingBorder'></div>").urlComp();

			        var options:UploadCompOptions = {contentType: ContentType.IMAGE};
			        var imageInput = new UploadComp("<div class='postContainer boxsizingBorder'></div>").uploadComp(options);

		        	options.contentType = ContentType.AUDIO;
		        	var audioInput = new UploadComp("<div class='postContainer boxsizingBorder'></div>").uploadComp(options);

		        	var tab_class:String = "";

		        	if (self.options.content.type == ContentType.TEXT) {
			        	textInput.appendTo(section);
			        	var ta: JQ = new JQ("<textarea class='boxsizingBorder container' style='resize: none;'></textarea>")
			        			.appendTo(textInput)
			        			.attr("id", "textInput_ta")
			        			.keypress(function(evt: JQEvent): Void {
		        					if( !(evt.altKey || evt.shiftKey || evt.ctrlKey) && evt.charCode == 13 ) {
		        						doTextPostForElement(evt, ContentType.TEXT, new JQ(evt.target));
		        					}
		        				});
			        	ta.val(cast(self.options.content, MessageContent).text);
			        	tab_class = "ui-icon-document";
			        }

		        	else if (self.options.content.type == ContentType.URL) {
			        	urlComp
			        		.appendTo(section)
			        		.keypress(function(evt: JQEvent): Void {
	        					if( !(evt.altKey || evt.shiftKey || evt.ctrlKey) && evt.charCode == 13 ) {
	        						doTextPostForElement(evt, ContentType.URL, new JQ(evt.target));
	        					}
	        				});
			        	urlComp.urlInput().val(cast(self.options.content, UrlContent).url);
			        	tab_class = "ui-icon-link";
					}

		        	else if (self.options.content.type == ContentType.IMAGE) {
			        	imageInput.appendTo(section);
			        	tab_class = "ui-icon-image";
		        	}

		        	else if (self.options.content.type == ContentType.AUDIO) {
			        	audioInput.appendTo(section);
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
				                    	of: _ui.helper,
				                    	collision: "flipfit",
				                    	within: ".tags"
		                    		});
				                }
					      	}
						});

					addConnectionsAndLabels = function(content: Content): Void {
						tags.children(".label").each(function(i: Int, dom: Element): Void {
								var labelComp: LabelComp = new LabelComp(dom);
								content.labelSet.add(labelComp.getLabel());
							});
						tags.children(".connectionAvatar").each(function(i: Int, dom: Element): Void {
								var conn: ConnectionAvatar = new ConnectionAvatar(dom);
								content.connectionSet.add( conn.getConnection() );
							});
					}

					var removeButton: JQ = new JQ("<button>Remove</button>")
		        							.appendTo(selfElement)
		        							.button()
		        							.click(function(evt: JQEvent): Void {
	        									self.destroy();
	        									selfElement.remove();
	        									self.options.contentComp.show();

	        									EM.change(EMEvent.FitWindow);
		        							});

					var updateButton: JQ = new JQ("<button>Update</button>")
		        							.appendTo(selfElement)
		        							.button()
		        							.click(function(evt: JQEvent): Void {
		        								switch (self.options.content.type) {
		        									case ContentType.TEXT:
			        									var ta = new JQ("#textInput_ta");
														doTextPostForElement(evt, ContentType.TEXT, ta);
													case ContentType.URL:
														doTextPostForElement(evt, ContentType.URL, urlComp.urlInput());
													case ContentType.IMAGE:
														doTextPost(evt, ContentType.IMAGE, imageInput.value());
			        									imageInput.clear();
			        								case ContentType.AUDIO:
			        									doTextPost(evt, ContentType.AUDIO, audioInput.value());
			        									audioInput.clear();
		        								}
		        							});

		        	self._initConections();
		        	self._initLabels();
		        },

		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.editPostComp", defineWidget());
	}
}
