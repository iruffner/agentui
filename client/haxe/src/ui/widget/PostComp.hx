package ui.widget;

import js.html.Element;

import m3.jq.JQ;
import m3.jq.JQDroppable;
import m3.widget.Widgets;
import ui.widget.UploadComp;
import ui.model.EM;
import ui.model.ModelObj;
import m3.observable.OSet;
import m3.util.UidGenerator;
import m3.exception.Exception;

using m3.helper.OSetHelper;
using ui.widget.UploadComp;
using ui.widget.LabelComp;
using ui.widget.ConnectionAvatar;

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

		        	var addConnectionsAndLabels: Content->Void = null;

		        	var doTextPost: JQEvent->ContentType->String->Void = function(evt: JQEvent, contentType: ContentType, value:String): Void {
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

		        	var urlInput: UrlComp = new UrlComp("<div class='postContainer boxsizingBorder'></div>").urlComp();
		        	urlInput
		        		.appendTo(section)
		        		.keypress(function(evt: JQEvent): Void {
        					if( !(evt.altKey || evt.shiftKey || evt.ctrlKey) && evt.charCode == 13 ) {
        						doTextPostForElement(evt, ContentType.URL, new JQ(evt.target));
        					}
        				});

		        	var mediaInput: UploadComp = new UploadComp("<div class='postContainer boxsizingBorder'></div>").uploadComp({});
		        	mediaInput.appendTo(section);
		        	
		        	var label: JQ = new JQ("<aside class='label'><span>Post:</span></aside>").appendTo(section);

		        	var tabs: JQ = new JQ("<aside class='tabs'></aside>").appendTo(section);
		        	var textTab: JQ = new JQ("<span class='ui-icon ui-icon-document active ui-corner-left'></span>")
		        						.appendTo(tabs)
		        						.click(function(evt: JQEvent): Void {
							        			tabs.children(".active").removeClass("active");
							        			JQ.cur.addClass("active");
							        			textInput.show();
							        			urlInput.hide();
							        			mediaInput.hide();
							        		});

		        	var urlTab: JQ = new JQ("<span class='ui-icon ui-icon-link ui-corner-left'></span>")
		        						.appendTo(tabs)
		        						.click(function(evt: JQEvent): Void {
							        			tabs.children(".active").removeClass("active");
							        			JQ.cur.addClass("active");
							        			textInput.hide();
							        			urlInput.show();
							        			mediaInput.hide();
							        		});

		        	var imgTab: JQ = new JQ("<span class='ui-icon ui-icon-image ui-corner-left'></span>")
		        						.appendTo(tabs)
		        						.click(function(evt: JQEvent): Void {
							        			tabs.children(".active").removeClass("active");
							        			JQ.cur.addClass("active");
							        			textInput.hide();
							        			urlInput.hide();
							        			mediaInput.show();
							        		});
					urlInput.hide();
					mediaInput.hide();

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
				    			return d.is(".filterable");
				    		},
							activeClass: "ui-state-hover",
					      	hoverClass: "ui-state-active",
					      	drop: function( event: JQEvent, _ui: UIDroppable ) {
					      		// Check to see if the element being dropped is already in the container
						      	if (isDuplicate(".connectionAvatar", _ui.draggable, tags, function(ele:JQ){return new ConnectionAvatar(ele).getConnection().uid;} )
					      		 || isDuplicate(".labelComp"       , _ui.draggable, tags, function(ele:JQ){return new LabelComp(ele).getLabel().uid;})) {
					      			if (_ui.draggable.parent().attr("id") != "post_comps_tags") {
						      			_ui.draggable.draggable("option", "revert", true);
						      		}
					      			return;
					      		}

				                var clone: JQ = _ui.draggable.data("clone")(_ui.draggable, false, ".tags");
				                clone.addClass("small");
				                var cloneOffset: {top: Int, left: Int} = clone.offset();
				                
			                	JQ.cur.append(clone);
				                clone.css({
				                        "position": "absolute"
				                    });
				                if(cloneOffset.top != 0) {
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
				                // self.fireFilter();
					      	}
						});

					addConnectionsAndLabels = function(content: Content): Void {
						tags.children(".label").each(function(i: Int, dom: Element): Void {
								var labelComp: LabelComp = new LabelComp(dom);
								// // Given label.getLabel().uid, iterate through
								// // ui.AgentUi.USER.get_currentAlias().labelSet.asArray()
								// // to find the tag.	 Since label trees are at most two
								// // levels deep and can only have one child at the second
								// // level, we know how to construct the label tree.
								// var uid = label.getLabel().uid;
								// var labelArray = ui.AgentUi.USER.currentAlias.labelSet.asArray();
								// var labelMap = new Map();
								// var i: Int;
								// for (i in 0...labelArray.length) {
								// 	labelMap[labelArray[i].uid] = labelArray[i];
								// }
								// var labelTree: String = "l" + labelMap[uid].text + "(_)";
								// if (untyped __js__("!!labelMap.get(uid).parentUid")) {
								// 	labelTree = "n" + labelMap[labelMap[uid].parentUid].text + "(" + labelTree + ")";
								// }
								content.labelSet.add(labelComp.getLabel());
							});
						tags.children(".connectionAvatar").each(function(i: Int, dom: Element): Void {
								var conn: ConnectionAvatar = new ConnectionAvatar(dom);
								content.connectionSet.add( conn.getConnection() );
							});
					}
// 					addConnectionsAndLabels = function(content: Content): Void {
// 						tags.children(".label").each(function(i: Int, dom: Element): Void {
// 								var label: LabelComp = new LabelComp(dom);
// 								// Given label.getLabel().uid, iterate through
// 								// ui.AgentUi.USER.get_currentAlias().labelSet.asArray()
// 								// to find the tag.	 Since label trees are at most two
// 								// levels deep and can only have one child at the second
// 								// level, we know how to construct the label tree.
// 								var uid = label.getLabel().uid;
// 								var labelArray = ui.AgentUi.USER.get_currentAlias().labelSet.asArray();
// 								var labelMap = {};
// 								var i: Int;
// 								for (i in 0...labelArray.length) {
// 									labelMap[labelArray[i].uid] = labelArray[i];
// 								}
// 								var labelTree: String = "l" + labelMap[uid].text + "(_)";
// 								if (labelMap[uid].parentUid) {
// 									labelTree = "n" + labelMap[labelMap[uid].parentUid].text + "(" + labelTree + ")";
// 								}
// 								content.labelSet.add(labelTree);
// 							});
// 						tags.children(".connectionAvatar").each(function(i: Int, dom: Element): Void {
// 								var conn: ConnectionAvatar = new ConnectionAvatar(dom);
// 								content.connectionSet.add( conn.getConnection().uid );
// 							});
// 					}

					var postButton: JQ = new JQ("<button>Post</button>")
		        							.appendTo(selfElement)
		        							.button()
		        							.click(function(evt: JQEvent): Void {
		        								if (textInput.isVisible()) {
		        									var ta = new JQ("#textInput_ta");
													doTextPostForElement(evt, ContentType.TEXT, ta);
		        								} else if (urlInput.isVisible()) {
		        									doTextPostForElement(evt, ContentType.URL, urlInput.urlComp("valEle"));
		        								} else {
		        									doTextPost(evt, ContentType.IMAGE, mediaInput.value());
		        									mediaInput.clear();
		        								}
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
