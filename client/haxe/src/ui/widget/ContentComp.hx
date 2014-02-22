package ui.widget;

import m3.jq.JQ;
import m3.jq.JQDroppable;
import m3.widget.Widgets;
import ui.model.ModelObj;
import m3.observable.OSet;
import ui.widget.LabelComp;
import m3.exception.Exception;
import m3.util.JqueryUtil;
import ui.model.EM;

using m3.helper.OSetHelper;
using ui.helper.ModelHelper;

typedef ContentCompOptions = {
	var content: Content<Dynamic>;
}

typedef ContentCompWidgetDef = {
	@:optional var options: ContentCompOptions;
	@:optional var buttonBlock: JQ;
	var _create: Void->Void;
	var _createWidgets:JQ->ContentCompWidgetDef->Void;
	var update: Content<Dynamic>->Void;
	var destroy: Void->Void;
	var toggleActive:Void->Void;
	@:optional var mappedLabels:MappedSet<LabeledContent, JQ>;
	@:optional var onchangeLabelChildren:JQ->EventType->Void;
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
				_createWidgets: function(selfElement: JQ, self:ContentCompWidgetDef): Void {

					selfElement.empty();

					var content:Content<Dynamic> = self.options.content;

		        	var postWr: JQ = new JQ("<section class='postWr'></section>");
		        	selfElement.append(postWr);
		        	var postContentWr: JQ = new JQ("<div class='postContentWr'></div>");
		        	postWr.append(postContentWr);
		        	var postContent: JQ = new JQ("<div class='postContent'></div>");
		        	postContentWr.append(postContent);
		        	postContent.append("<div class='content-timestamp'>" +  content.created + "</div>");
		        	switch(content.contentType) {
		        		case ContentType.AUDIO:
			        		var audio: AudioContent = cast(content, AudioContent);
			        		postContent.append(audio.props.title + "<br/>");
			        		var audioControls: JQ = new JQ("<audio controls></audio>");
			        		postContent.append(audioControls);
			        		audioControls.append("<source src='" + audio.props.audioSrc + "' type='" + audio.props.audioType + "'>Your browser does not support the audio element.");

		        		case ContentType.IMAGE:
		        			var img: ImageContent = cast(content, ImageContent);
		        			postContent.append("<img alt='" + img.props.caption + "' src='" + img.props.imgSrc + "'/>");// + img.caption);

						case ContentType.URL:
							var urlContent: UrlContent = cast(content, UrlContent);
							postContent.append("<img src='http://picoshot.com/t.php?picurl=" + urlContent.props.url + "'>");
							// postContent.append("<img alt='preview' src='http://api.thumbalizr.com/?api_key=2e63db21c89b06a54fd2eac5fd96e488&url=" + urlContent.url + "'/>");

	        			case ContentType.TEXT:
	        				var textContent: MessageContent = cast(content, MessageContent);
	        				postContent.append("<div class='content-text'><pre class='text-content'>" + textContent.props.text + "</pre></div>"); 
		        	}

					self.buttonBlock = new JQ("<div class='button-block' ></div>").css("text-align", "left").hide().appendTo(postContent);

					new JQ("<button title='Edit Post'></button>")
						.appendTo(self.buttonBlock)
						.button({text: false,  icons: { primary: "ui-icon-pencil"}})
						.css("width", "23px")
						.click(function(evt: JQEvent): Void {
							evt.stopPropagation();

			        		var comp = new JQ("<div id='edit-post-comp'></div>");
	            			comp.insertBefore(selfElement);
							comp.width(selfElement.width());
							comp.height(selfElement.height());

							selfElement.hide();
							var editPostComp = new EditPostComp(comp).editPostComp({content: self.options.content});
						});
		        	
		        	var postCreator: JQ = new JQ("<aside class='postCreator'></aside>").appendTo(postWr);

		        	var alias = AppContext.ALIASES.delegate().get(self.options.content.aliasIid);
	        		new ConnectionAvatar("<div></div>").connectionAvatar({
	        				dndEnabled: false,
	        				connection: alias.asConnection()
	        			}).appendTo(postCreator);


		        	var postLabels = new JQ("<aside class='postLabels'></div>").appendTo(postWr);
		        	var postConnections: JQ = new JQ("<aside class='postConnections'></aside>").appendTo(postWr);

		        	if (AppContext.GROUPED_LABELEDCONTENT.delegate().get(self.options.content.iid) == null) {
		        		AppContext.GROUPED_LABELEDCONTENT.addEmptyGroup(self.options.content.iid);
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

            		self.mappedLabels = new MappedSet<LabeledContent, JQ>(AppContext.GROUPED_LABELEDCONTENT.delegate().get(self.options.content.iid), 
		        		function(lc: LabeledContent): JQ {
		        			var connection = AppContext.connectionFromMetaLabel(lc.labelIid);
		        			if (connection != null) {
		        				return new ConnectionAvatar("<div></div>").connectionAvatar({
			        				dndEnabled: false,
			        				connection: connection
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

		        	EM.addListener(EMEvent.EditContentClosed, new EMListener(function(content: Content<Dynamic>): Void {
		        		if (content.iid == self.options.content.iid) {
		        			selfElement.show();
		        		}
		        	}));
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
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.contentComp", defineWidget());
	}
}