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

import ui.widget.score.TimeMarker;


class ContentTimeLine {
	public var paper: Snap;
	public var connection: Connection;
	public var connectionElement:SnapElement;

	public var contents: Array<Content>;
	public var contentElements: Array<SnapElement>;

	public static var y_pos:Int = 60;
	public static var x_pos:Int = 10;
	public static var width:Int = 62;
 	public static var height:Int = 74;

 	private var startTime:Float;
 	private var endTime:Float;

 	private var time_line_x:Float;
 	private var time_line_y:Float;

 	public static function resetPositions(): Void {
		ContentTimeLine.y_pos = 60;
		ContentTimeLine.x_pos = 10;
 	}

	public function new (paper:Snap, connection: Connection, startTime:Float, endTime:Float) {
		this.paper = paper;
		this.connection = connection;
		this.startTime = startTime;
		this.endTime   = endTime;

		this.contents = new Array<Content>();
		this.contentElements = new Array<SnapElement>();

		// TODO:  add a class instance for x and y

		if (ContentTimeLine.y_pos > 0) {
			ContentTimeLine.y_pos += ContentTimeLine.height + 20;
		}
		ContentTimeLine.y_pos += 10;

	 	time_line_x = ContentTimeLine.x_pos + ContentTimeLine.width;
	 	time_line_y = ContentTimeLine.y_pos + height/2;

   		createConnectionElement();

	}

	public function removeElements() {
		connectionElement.remove();

		var iter = contentElements.iterator();
		while (iter.hasNext()) {
			iter.next().remove();
		}
	}

	private function createConnectionElement(): Void {
		var line = paper.line(x_pos, y_pos + height/2, 1000, y_pos + height/2).attr({{stroke: "red", strokeWidth: 1}});
		var img = paper.image(connection.profile.imgSrc, x_pos, y_pos, width, height);
		var rect = paper.rect(x_pos, y_pos, width, height, 10, 10).attr({fill:"none", stroke: "#bada55", strokeWidth: 1});
		connectionElement = paper.group(paper, [line, img, rect]);
	}

	public function addContent(content:Content):Void {
		contents.push(content);
		createContentElement(content);
	}

	private function createContentElement(content:Content):Void {
		var radius = 10;
		var gap = 10;

		var x:Float = (this.endTime - content.created.getTime())/(this.endTime - this.startTime) * 700 + time_line_x;

		var circle = paper.circle(x, time_line_y, radius);
		circle.attr({
		    fill: "#ff0000",
		    stroke: "#0000ff"
		});
		var text = paper.text(x, time_line_y, content.created).attr({fontSize: "8px"});

		this.contentElements.push(paper.group(paper, [circle, text]));
	}
}

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

	var _addContent:Content->Void;
	var _deleteContent:Content->Void;
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
 	            		var timeLine = new ContentTimeLine(self.paper, connection, self.startTime.getTime(), self.endTime.getTime());
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
	            		} else if (evt.isDelete()) {
	            			self._deleteContent(content);
	            		}
	            	});

		        	var max_x = 700;
		        	var max_y = 500;
		        	var viewBox = "0 0 " + max_x + " " + max_y;

		        	var svg = new JQ('<svg id="score-comp-svg" viewBox="' + viewBox + '" xmlns="http://www.w3.org/2000/svg"></svg>');
		        	selfElement.append(svg);

					self.paper = new Snap("#score-comp-svg");
					var line_attrs:Dynamic = {stroke: "#bada55", strokeWidth: 1};

					self.paper.line(0, 0, 0, max_y).attr(line_attrs);
					self.paper.line(0, max_y, max_x, max_y).attr(line_attrs);
					self.paper.line(max_x, max_y, max_x, 0).attr(line_attrs);
					self.paper.line(max_x, 0, 0, 0).attr(line_attrs);

					self.startTime = new Date(2012, 1, 1, 0, 0, 0);
					self.endTime = new Date(2013, 12, 31, 0, 0, 0);
					self.timeMarker = new TimeMarker(self.paper, max_x);
		        },

		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.scoreComp", defineWidget());
	}
}