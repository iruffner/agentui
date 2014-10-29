package agentui.widget;

import m3.jq.JQ;
import m3.jq.JQDroppable;
import m3.jq.M3Menu;
import m3.widget.Widgets;
import qoid.model.ModelObj;
import m3.observable.OSet;
import agentui.widget.LabelComp;
import m3.exception.Exception;
import m3.util.JqueryUtil;
import agentui.model.EM;
import agentui.widget.DialogManager;
import qoid.Qoid;

using m3.helper.OSetHelper;

typedef ContentCompOptions = {
	var content: Content<Dynamic>;
}

typedef ContentCompWidgetDef = {
	@:optional var options: ContentCompOptions;
	@:optional var buttonBlock: JQ;
	@:optional var menu:M3Menu;
	var _create: Void->Void;
	var _createWidgets:JQ->ContentCompWidgetDef->Void;
	var _createContentMenu: Void->M3Menu;
	var _showVerifications:JQ->Void;
	var update: Content<Dynamic>->Void;
	var destroy: Void->Void;
	var toggleActive:Void->Void;
	@:optional var mappedLabels:MappedSet<LabeledContent, JQ>;
	@:optional var onchangeLabelChildren:JQ->EventType->Void;
	@:optional var contentClosedListenerId: String;
}

typedef VerifierData = {
	var profile:Profile;
	var message:String;
}

class ContentCompHelper {
	public static function content(cc: ContentComp): Content<Dynamic> {
		return cc.contentComp("option", "content");
	}

	public static function update(cc: ContentComp, c:Content<Dynamic>): Void {
		return cc.contentComp("update", c);
	}
}


@:native("$")
extern class ContentComp extends JQ {

	@:overload(function<T>(cmd : String):T{})
	@:overload(function<T>(cmd : String, param:Dynamic):T{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function contentComp(?opts: ContentCompOptions): ContentComp;

	private static function __init__(): Void {
		var defineWidget: Void->ContentCompWidgetDef = function(): ContentCompWidgetDef {
			return {
				_showVerifications: function(ref:JQ) {
		        	var self: ContentCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

					// Get the data required to display the information
        			var vdata = new Array<VerifierData>();
					var vs = self.options.content.metaData.verifications;
					for (v in vs) {
						var p = Qoid.profiles.getElementComplex(v.verifierId, "sharedId");
						var msg:VerificationContent = cast(Qoid.verificationContent.getElement(v.verificationIid));
						var text = msg == null ? "Unable to retrieve verification content." : msg.props.text;
						vdata.push({profile:p, message:text});
					}

					// TODO:  set up a listener for verificationContent

					// Create a popup to show the verification information
        			var popup: Popup = new Popup("<div style='position: absolute;width:300px;'></div>");
        			popup.appendTo(selfElement);
        			popup = popup.popup({
        				createFcn: function(el: JQ): Void {
    						new JQ("<div class='ccv_header'>This content was verified by:</div>").appendTo(el);
    						var container: JQ = new JQ("<div class='icontainer cc_table'></div>").appendTo(el);
    						for (vd in vdata) {
    							var vcontainer = new JQ("<div class='cc_row'></div>").appendTo(container);
    							var vcell = new JQ("<div class='cc_cell'></div>").appendTo(vcontainer);
			   	        		new ConnectionAvatar("<div class='cc_cell'></div>").connectionAvatar({
			        				dndEnabled: false,
			        				connectionIid: vd.profile.connectionIid
			        			}).appendTo(vcell);
			        			new JQ("<div>" + vd.profile.name + "</div>").appendTo(vcell);
			        			new JQ("<div class='cc_cell'>" + vd.message + "</div>").appendTo(vcontainer);
			        		}
        				},
        				positionalElement: ref
        			});
				},

				_createWidgets: function(selfElement: JQ, self:ContentCompWidgetDef): Void {

					selfElement.empty();

					var content:Content<Dynamic> = self.options.content;

		        	var postWr: JQ = new JQ("<section class='postWr'></section>");
		        	selfElement.append(postWr);
		        	var postContentWr: JQ = new JQ("<div class='postContentWr'></div>");
		        	postWr.append(postContentWr);
		        	var postContent: JQ = new JQ("<div class='postContent'></div>");
		        	postContentWr.append(postContent);

		        	var contentInfo = new JQ("<div class='content-timestamp'></div>");
		        	postContent.append(contentInfo);

		        	contentInfo.append(content.created.toString() + "&nbsp;&nbsp;&nbsp;");
		        	if (content.metaData.verifications.length > 0) {
		        		var verified = new JQ("<img class='verified vimage' title='V for Verified' src='media/check.png'/>");
		        		verified.click(function(evt:m3.jq.JQEvent){
		        			self._showVerifications(verified);
							evt.preventDefault();
		        			evt.stopPropagation();
		        			return false;
		        		});
		        		contentInfo.append(verified);
		        	}
		        	switch(content.contentType) {
		        		case ContentTypes.AUDIO:
			        		var audio: AudioContent = cast(content, AudioContent);
			        		postContent.append(audio.props.title + "<br/>");
			        		var audioControls: JQ = new JQ("<audio controls></audio>");
			        		postContent.append(audioControls);
			        		audioControls.append("<source src='" + audio.props.audioSrc + "' type='" + audio.props.audioType + "'>Your browser does not support the audio element.");

		        		case ContentTypes.IMAGE:
		        			var img: ImageContent = cast(content, ImageContent);
		        			postContent.append("<img alt='" + img.props.caption + "' src='" + img.props.imgSrc + "'/>");// + img.caption);

						case ContentTypes.URL:
							var urlContent: UrlContent = cast(content, UrlContent);
							postContent.append("<img src='http://picoshot.com/t.php?picurl=" + urlContent.props.url + "'>");
							// postContent.append("<img alt='preview' src='http://api.thumbalizr.com/?api_key=2e63db21c89b06a54fd2eac5fd96e488&url=" + urlContent.url + "'/>");

	        			case ContentTypes.TEXT:
	        				var textContent: MessageContent = cast(content, MessageContent);
	        				postContent.append("<div class='content-text'><pre class='text-content'>" + textContent.props.text + "</pre></div>"); 
		        		
		        		case ContentTypes.VERIFICATION:
		        			throw new Exception("VerificationContent should not be displayed"); 
		        	}

					self.buttonBlock = new JQ("<div class='button-block' ></div>").css("text-align", "left").hide().appendTo(postContent);

					var mb = new JQ("<button title='Options'></button>")
						.appendTo(self.buttonBlock)
						.button({text: false,  icons: { primary: "ui-icon-circle-triangle-s"}})
						.css("width", "23px");

					mb.click(function(evt: JQEvent): Dynamic {
		        		var menu = self._createContentMenu();

	        			menu.show();
	        			menu.position({
		        			my: "left top",
		        			at: "right-6px center",
		        			of: mb
		        		});

						evt.preventDefault();
	        			evt.stopPropagation();
	        			return false;
		        	});
		        	
		        	var postCreator: JQ = new JQ("<aside class='postCreator'></aside>").appendTo(postWr);

		        	var aliasIid = null;
		        	var connectionIid = null;
		        	var alias: Alias;
		        	if ( (alias = Qoid.aliases.getElementComplex(self.options.content.connectionIid, function(a: Alias) { return a.connectionIid; })) != null) {
		        		aliasIid = alias.iid;
		        	} else {
		        		if (Qoid.connections.delegate().get(self.options.content.connectionIid) != null) {
		        			connectionIid = self.options.content.connectionIid;
		        		}
		        	}

	        		new ConnectionAvatar("<div></div>").connectionAvatar({
        				dndEnabled: false,
        				aliasIid: aliasIid,
        				connectionIid: connectionIid
        			}).appendTo(postCreator);

		        	var postLabels = new JQ("<aside class='postLabels'></div>").appendTo(postWr);
		        	var postConnections: JQ = new JQ("<aside class='postConnections'></aside>").appendTo(postWr);

		        	if (Qoid.groupedLabeledContent.delegate().get(self.options.content.iid) == null) {
		        		Qoid.groupedLabeledContent.addEmptyGroup(self.options.content.iid);
		        	}
		        	self.onchangeLabelChildren = function(ele: JQ, evt: EventType): Void {
	            		if(evt.isAdd()) {
	            			if (ele.is(".connectionAvatar")) {
	            				postConnections.append(ele);
	            			} else {
		            			postLabels.append(ele);
		            		}
	            		} else if (evt.isUpdate()) {
	            			throw new Exception("this should never happen");
	            		} else if (evt.isDelete()) {
	            			ele.remove();
	            		}
	            	};

            		self.mappedLabels = new MappedSet<LabeledContent, JQ>(Qoid.groupedLabeledContent.delegate().get(self.options.content.iid), 
		        		function(lc: LabeledContent): JQ {
		        			var connection = Qoid.connectionFromLabel(lc.labelIid);
		        			if (connection != null) {
		        				return new ConnectionAvatar("<div></div>").connectionAvatar({
			        				dndEnabled: false,
			        				connectionIid: connection.iid
			        			});
		        			} else {
			        			return new LabelComp("<div class='small'></div>").labelComp({
			        				dndEnabled: false,
			        				labelIid: lc.labelIid
			        			});
			        		}
		        		}
		        	);
		        	self.mappedLabels.listen(self.onchangeLabelChildren);		        	
				},
		        
		        _create: function(): Void {
		        	var self: ContentCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of ContentComp must be a div element");
		        	}

		        	selfElement.addClass("contentComp post container shadow " + Widgets.getWidgetClasses());
		        	selfElement.click(function(evt:js.JQuery.JqEvent){
		        		if (!selfElement.hasClass("postActive")) {
		        			new JQ(".postActive .button-block").toggle();
		        			new JQ(".postActive").toggleClass("postActive");
		        		}
		        		self.toggleActive();
		        	});

		        	self._createWidgets(selfElement, self);

		        	self.contentClosedListenerId = EM.addListener(EMEvent.EditContentClosed, function(content: Content<Dynamic>): Void {
		        		if (content.iid == self.options.content.iid) {
		        			selfElement.show();
		        		}
		        	}, "ContentComp-EditContentClosed");
		        },

		       	_createContentMenu: function() : M3Menu {
		        	var self: ContentCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

		        	if (self.menu == null) {
			        	var menu: M3Menu = new M3Menu("<ul id='contentCompMenu-" + self.options.content.iid + "'></ul>");
			        	menu.appendTo(selfElement);

			        	var menuOptions:Array<MenuOption> = [];

						var menuOption: MenuOption;

						menuOption = {
							label: "Edit...",
							icon: "ui-icon-pencil",
							action: function(evt: JQEvent, m: M3Menu): Void {
								evt.stopPropagation();

				        		var comp = new JQ("<div id='edit-post-comp'></div>");
		            			comp.insertBefore(selfElement);
								comp.width(selfElement.width());
								comp.height(selfElement.height());

								selfElement.hide();
								var editPostComp = new EditPostComp(comp).editPostComp({content: self.options.content});
							}
						};
						menuOptions.push(menuOption);

						menuOption = {
							label: "Delete...",
							icon: "ui-icon-circle-close",
							action: function(evt: JQEvent, m: M3Menu): Void {
								evt.stopPropagation();
								JqueryUtil.confirm("Delete Post", "Are you sure you want to delete this content?", 
									function(){
										var ecd = new EditContentData(self.options.content);
										// EM.change(EMEvent.DeleteContent, ecd);
										//TODO 
										throw "Delete content no longer supported";
									}
								);
							}
						};
						menuOptions.push(menuOption);

						menuOption = {
							label: "Request Verification...",
							icon: "ui-icon-circle-triangle-n",
							action: function(evt: JQEvent, m: M3Menu): Void {
								evt.preventDefault();
	        					evt.stopPropagation();
	        					self.menu.hide();
	        					DialogManager.requestVerification(self.options.content);
							}
						};
						menuOptions.push(menuOption);

	        			menu.m3menu({menuOptions:menuOptions, wrapLabelInAtag: true}).hide();

	        			self.menu = menu;
					}
					return self.menu;
		       	},

		        update: function(content:Content<Dynamic>) : Void {
		        	var self: ContentCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

					var showButtonBlock = self.buttonBlock.isVisible();

					self.options.content = content;
        			self._createWidgets(selfElement, self);
        			if (showButtonBlock) {
	        			self.buttonBlock.show();
	        		}
        			selfElement.show();
		        },

		        toggleActive: function(): Void {
		        	var self: ContentCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

	        		selfElement.toggleClass("postActive");
	        		self.buttonBlock.toggle();
		        },
		        
		        destroy: function() {
		        	var self: ContentCompWidgetDef = Widgets.getSelf();
		        	self.mappedLabels.removeListener(self.onchangeLabelChildren);
		        	EM.removeListener(EMEvent.EditContentClosed, self.contentClosedListenerId);
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.contentComp", defineWidget());
	}
}