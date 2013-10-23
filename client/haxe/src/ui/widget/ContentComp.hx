package ui.widget;

import m3.jq.JQ;
import m3.jq.JQDroppable;
import m3.widget.Widgets;
import ui.model.ModelObj;
import m3.observable.OSet;
import ui.widget.LabelComp;
import m3.exception.Exception;

using m3.helper.OSetHelper;
using ui.helper.ModelHelper;

typedef ContentCompOptions = {
	var content: Content;
}

typedef ContentCompWidgetDef = {
	@:optional var options: ContentCompOptions;
	var _create: Void->Void;
	var destroy: Void->Void;
}

@:native("$")
extern class ContentComp extends JQ {

	@:overload(function(cmd : String):Bool{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function contentComp(?opts: ContentCompOptions): ContentComp;

	private static function __init__(): Void {
		var defineWidget: Void->ContentCompWidgetDef = function(): ContentCompWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: ContentCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of ContentComp must be a div element");
		        	}

		        	selfElement.addClass("post container shadow " + Widgets.getWidgetClasses());
		        	var postWr: JQ = new JQ("<section class='postWr'></section>");
		        	selfElement.append(postWr);
		        	var postContentWr: JQ = new JQ("<div class='postContentWr'></div>");
		        	postWr.append(postContentWr);
		        	var postContent: JQ = new JQ("<div class='postContent'></div>");
		        	postContentWr.append(postContent);
		        	switch(self.options.content.type) {
		        		case ContentType.AUDIO:
			        		var audio: AudioContent = cast(self.options.content, AudioContent);
			        		postContent.append(audio.title + "<br/>");
			        		var audioControls: JQ = new JQ("<audio controls></audio>");
			        		postContent.append(audioControls);
			        		audioControls.append("<source src='" + audio.audioSrc + "' type='" + audio.audioType + "'>Your browser does not support the audio element.");
		        		case ContentType.IMAGE:
		        			var img: ImageContent = cast(self.options.content, ImageContent);
		        			postContent.append("<img alt='" + img.caption + "' src='" + img.imgSrc + "'/>");// + img.caption);
						case ContentType.URL:
							var urlContent: UrlContent = cast(self.options.content, UrlContent);
		        			postContent.append("<img alt='preview' src='http://api.thumbalizr.com/?api_key=2e63db21c89b06a54fd2eac5fd96e488&url=" + urlContent.url + "'/>");
	        			case ContentType.TEXT:
	        				var textContent: MessageContent = cast(self.options.content, MessageContent);
	        				postContent.append("<p>" + textContent.text + "</p>"); 
		        	}
		        	
		        	var postCreator: JQ = new JQ("<aside class='postCreator'></aside>").appendTo(postWr);
		        	var connection: Connection = AgentUi.USER.currentAlias.connectionSet.getElementComplex(self.options.content.creator);
		        	if(connection == null) {
		        		connection = AgentUi.USER.currentAlias.asConnection();
		        	}
	        		new ConnectionAvatar("<div></div>").connectionAvatar({
	        				dndEnabled: false,
	        				connection: connection
	        			}).appendTo(postCreator);


		        	var postLabels: JQ = new JQ("<aside class='postLabels'></div>");
		        	postWr.append(postLabels);
		        	var labelIter: Iterator<Label> = self.options.content.labelSet.iterator();
		        	while(labelIter.hasNext()) {
		        		var label: Label = labelIter.next();
		        		new LabelComp("<div class='small'></div>").labelComp({
		        				dndEnabled: false,
		        				label: label
		        			}).appendTo(postLabels);
		        	}
		        	
		        	var postConnections: JQ = new JQ("<aside class='postConnections'></aside>").appendTo(postWr);
		        	var connIter: Iterator<Connection> = self.options.content.connectionSet.iterator();
		        	while(connIter.hasNext()) {
		        		var connection: Connection = connIter.next();
		        		new ConnectionAvatar("<div></div>").connectionAvatar({
		        				dndEnabled: false,
		        				connection: connection
		        			}).appendTo(postConnections);
		        	}
		        },
		        
		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.contentComp", defineWidget());
	}
}