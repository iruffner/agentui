// package ui.widget;

// import js.JQuery;
// import ui.jq.JQ;
// import ui.jq.JQDroppable;
// import ui.model.ModelObj;
// import ui.observable.OSet;
// import ui.widget.LabelComp;

// typedef ContentListOptions = {
// 	var content: OSet<Content>;
// }

// typedef ContentListWidgetDef = {
// 	@:optional var options: ContentListOptions;
// 	@:optional var content: MappedSet<Content, ContentComp>;
// 	var _create: Void->Void;
// 	var destroy: Void->Void;
// }

// extern class ContentList extends JQ {

// 	@:overload(function(cmd : String):Bool{})
// 	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
// 	function contentList(?opts: ContentListOptions): ContentList;

// 	private static function __init__(): Void {
// 		untyped ContentList = window.jQuery;
// 		var defineWidget: Void->ContentListWidgetDef = function(): ContentListWidgetDef {
// 			return {
// 		        _create: function(): Void {
// 		        	var self: ContentListWidgetDef = Widgets.getSelf();
// 					var selfElement: JQ = Widgets.getSelfElement();
// 		        	if(!selfElement.is("div")) {
// 		        		throw new ui.exception.Exception("Root of ContentList must be a div element");
// 		        	}

// 		        	selfElement.addClass("post container shadow " + Widgets.getWidgetClasses());
// 		        	selfElement.append("<div id='middleContainerSpacer' class='spacer'></div>");

// 		        	self.content = new MappedSet<Content, ContentComp>(self.options.content, function(content: Content): ContentComp {
// 		        			return new ContentComp("<section></section>").contentComp({
// 		        				content: content
// 		        			});
// 		        		});
// 		        	self.content.listen(function(contentComp: ContentComp, evt: EventType): Void {
// 		            		if(evt.isAdd()) {
// 		            			App.LOGGER.debug("Add " + evt.name());
// 		            			selfElement.append(contentComp);
// 		            		} else if (evt.isUpdate()) {
// 		            			contentComp.contentComp("update");
// 		            		} else if (evt.isDelete()) {
// 		            			contentComp.remove();
// 		            		}
// 		            	});
// 		        },
		        
// 		        destroy: function() {
// 		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
// 		        }
// 		    };
// 		}
// 		JQ.widget( "ui.contentList", defineWidget());
// 	}
// }