package ui.widget.score;

import haxe.ds.StringMap;
import m3.jq.JQ;
import m3.widget.Widgets;
import ui.model.ContentSource;
import ui.model.ModelObj;
import m3.observable.OSet;
import m3.exception.Exception;
import snap.Snap;

using m3.helper.OSetHelper;
using m3.helper.StringHelper;


typedef ScoreCompOptions = {
}

typedef ScoreCompWidgetDef = {
	@:optional var options: ScoreCompOptions;
	@:optional var contentTimeLines: StringMap<ContentTimeLine>;
	@:optional var paper:Snap;
	@:optional var timeMarker:TimeMarker;
	@:optional var uberGroup:SnapElement;
	@:optional var startTime:Date;
	@:optional var endTime:Date;
	@:optional var initialWidth:Float;
	@:optional var contentSource:ContentSource<SnapElement>;

	var _addContent:Content<Dynamic>->Void;
	var _deleteContent:Content<Dynamic>->Void;
	var _updateContent:Content<Dynamic>->Void;
	var _create: Void->Void;
	var destroy: Void->Void;
}

@:native("$")
extern class ScoreComp extends JQ {

	@:overload(function<T>(cmd : String):T{})
	@:overload(function<T>(cmd:String, opt:String):T{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function scoreComp(?opts: ScoreCompOptions): ScoreComp;

	private static function __init__(): Void {
		var defineWidget: Void->ScoreCompWidgetDef = function(): ScoreCompWidgetDef {
			return {

				_addContent: function(content:Content<Dynamic>): Void {
		        	var self: ScoreCompWidgetDef = Widgets.getSelf();
	            	var alias = AppContext.MASTER_ALIASES.getElement(content.aliasIid);
 	            	if (self.contentTimeLines.get(content.aliasIid) == null) {
 	            		var timeLine = new ContentTimeLine(self.paper, alias.profile, 
 	            			                               self.startTime.getTime(), 
 	            			                               self.endTime.getTime(),
 	            			                               self.initialWidth);
 	            		self.contentTimeLines.set(content.aliasIid, timeLine);
		            }

	            	self.contentTimeLines.get(content.aliasIid).addContent(content);
	            	self.uberGroup.append(self.contentTimeLines.get(content.aliasIid).timeLineElement);
				},

				_deleteContent: function (content:Content<Dynamic>) {
		        	var self: ScoreCompWidgetDef = Widgets.getSelf();
		        	var ctl = self.contentTimeLines.get(content.aliasIid);
		        	if (ctl != null) {
			        	ctl.removeElements();
						self.contentTimeLines.remove(content.aliasIid);
						if (!self.contentTimeLines.iterator().hasNext()) {
							ContentTimeLine.resetPositions();
						}
					}
				},

				_updateContent: function(content:Content<Dynamic>): Void {
				},

		        _create: function(): Void {
		        	var self: ScoreCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of ScoreComp must be a div element");
		        	}
		        	selfElement.addClass("container shadow scoreComp");

		        	var mapListener = function(content:Content<Dynamic>, ele:SnapElement, evt:EventType): Void {
	            		if(evt.isAdd()) {
	            			self._addContent(content);
	            		} else if (evt.isUpdate()) {
	            			self._updateContent(content);
	            		} else if (evt.isDelete()) {
	            			self._deleteContent(content);
	            		}
	            	};

	            	var beforeSetContent = function(content:OSet<Content<Dynamic>>) {
	            		new JQ("#score-comp-svg").empty();

		        		self.contentTimeLines = new StringMap<ContentTimeLine>();

			        	self.initialWidth = 1000;

						self.paper = new Snap("#score-comp-svg");
						self.uberGroup = self.paper.group(self.paper, [])
						                           .attr("id", "uber-group")
						                           .attr("transform", "matrix(1 0 0 1 0 0)");

						self.startTime = null;
						self.endTime = null;
						var it = content.iterator();
						while (it.hasNext()) {
							var el = it.next();
							if (self.startTime == null) {
								self.startTime = self.endTime = el.created;
							} else {
								if (el.created.getTime() < self.startTime.getTime()) {
									self.startTime = el.created;
								}
								if (el.created.getTime() > self.endTime.getTime()) {
									self.endTime = el.created;
								}
							}
						}
						
						self.timeMarker = new TimeMarker(self.uberGroup, self.paper, self.initialWidth);
	            	};
	            	var widgetCreator = function(content:Content<Dynamic>):SnapElement {
	            		return null;
	            	}
	            	self.contentSource = new ContentSource<SnapElement>(mapListener, beforeSetContent, widgetCreator);
		        },

		        destroy: function() {
		        	var self: ScoreCompWidgetDef = Widgets.getSelf();
		        	self.contentSource.cleanup();
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.scoreComp", defineWidget());
	}
}