package ui.widget.score;

import haxe.ds.StringMap;
import m3.jq.JQ;
import m3.widget.Widgets;
import ui.model.ModelObj;
import m3.observable.OSet;
import m3.exception.Exception;
import snap.Snap;

using m3.helper.OSetHelper;
using m3.helper.StringHelper;


typedef ScoreCompOptions = {
  var content: OSet<Content>;
}

typedef ScoreCompWidgetDef = {
	@:optional var options: ScoreCompOptions;
	@:optional var contentTimeLines: StringMap<ContentTimeLine>;
	@:optional var paper:Snap;
	@:optional var timeMarker:TimeMarker;
	@:optional var startTime:Date;
	@:optional var endTime:Date;
	@:optional var initialWidth:Float;

	var _addContent:Content->Void;
	var _deleteContent:Content->Void;
	var _updateContent:Content->Void;
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

				_addContent: function(content:Content): Void {
		        	var self: ScoreCompWidgetDef = Widgets.getSelf();
	            	var connection: Connection = AppContext.USER.currentAlias.connectionSet.getElementComplex(content.creator);

 	            	if (self.contentTimeLines.get(content.creator) == null) {
 	            		var timeLine = new ContentTimeLine(self.paper, connection, 
 	            			                               self.startTime.getTime(), 
 	            			                               self.endTime.getTime(),
 	            			                               self.initialWidth);
 	            		self.contentTimeLines.set(content.creator, timeLine);
		            }

	            	self.contentTimeLines.get(content.creator).addContent(content);
				},

				_deleteContent: function (content:Content) {
		        	var self: ScoreCompWidgetDef = Widgets.getSelf();
		        	var ctl = self.contentTimeLines.get(content.creator);
		        	if (ctl != null) {
			        	ctl.removeElements();
						self.contentTimeLines.remove(content.creator);
						if (!self.contentTimeLines.iterator().hasNext()) {
							ContentTimeLine.resetPositions();
						}
					}
				},

				_updateContent: function(content:Content): Void {
				},

		        _create: function(): Void {
		        	var self: ScoreCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of ScoreComp must be a div element");
		        	}
		        	selfElement.addClass("container shadow scoreComp");

		        	self.contentTimeLines = new StringMap<ContentTimeLine>();

	        		self.options.content.listen(function(content: Content, evt: EventType): Void {
	            		if(evt.isAdd()) {
	            			self._addContent(content);
	            		} else if (evt.isUpdate()) {
	            			self._updateContent(content);
	            		} else if (evt.isDelete()) {
	            			self._deleteContent(content);
	            		}
	            	});

		        	self.initialWidth = 1000;

					self.paper = new Snap("#score-comp-svg");

					self.startTime = new Date(2012, 1, 1, 0, 0, 0);
					self.endTime   = new Date(2013, 12, 31, 0, 0, 0);

					self.timeMarker = new TimeMarker(self.paper, self.initialWidth);
		        },

		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.scoreComp", defineWidget());
	}
}