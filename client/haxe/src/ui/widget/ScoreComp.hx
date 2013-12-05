package ui.widget;

import haxe.ds.StringMap;
import m3.jq.JQ;
import m3.widget.Widgets;
import ui.model.ModelObj;
import m3.observable.OSet;
import m3.exception.Exception;
import snap.Snap;

using m3.helper.OSetHelper;
using m3.helper.StringHelper;

class ContentTimeLine {
	public var paper: Snap;
	public var connection: Connection;
	public var connectionElement:SnapElement;

	public var contents: Array<Content>;
	public var contentElements: Array<SnapElement>;

	public static var y_pos:Int = 0;
	public static var x_pos:Int = 10;
	public static var width:Int = 62;
 	public static var height:Int = 74;

 	public static function resetPositions(): Void {
		ContentTimeLine.y_pos = 0;
		ContentTimeLine.x_pos = 10;
 	}

	public function new (paper:Snap, connection: Connection) {
		this.paper = paper;
		this.connection = connection;
		this.contents = new Array<Content>();
		this.contentElements = new Array<SnapElement>();

		if (ContentTimeLine.y_pos > 0) {
			ContentTimeLine.y_pos += ContentTimeLine.height + 20;
		}
		ContentTimeLine.y_pos += 10;

   		createConnectionElement();
	}

	private function createConnectionElement(): Void {
		var line = paper.line(x_pos, y_pos + height/2, 1000, y_pos + height/2).attr({{stroke: "red", strokeWidth: 3}});
		var img = paper.image(connection.profile.imgSrc, x_pos, y_pos, width, height);
		var rect = paper.rect(x_pos, y_pos, width, height, 10, 10).attr({fill:"none", stroke: "#bada55", strokeWidth: 1});
		connectionElement = paper.group(paper, [line, img, rect]);
	}

	public function addContent(content:Content):Void {
		contents.push(content);
		createContentElement(content);
	}

	private function createContentElement(content:Content):Void {

	}
}

typedef ScoreCompOptions = {
  var content: OSet<Content>;
}

typedef ScoreCompWidgetDef = {
	@:optional var options: ScoreCompOptions;
	@:optional var contentTimeLines: StringMap<ContentTimeLine>;
	@:optional var paper:Snap;
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
 	            	
 	            	var timeLine:ContentTimeLine = self.contentTimeLines.get(content.creator);

 	            	if (timeLine == null) {
 	            		timeLine = new ContentTimeLine(self.paper, connection);
 	            		self.contentTimeLines.set(content.creator, timeLine);
		            }

	            	timeLine.addContent(content);
				},

				_deleteContent: function (content:Content) {
		        	var self: ScoreCompWidgetDef = Widgets.getSelf();
		        	var ctl = self.contentTimeLines.get(content.creator);
		        	if (ctl != null) {
			        	ctl.connectionElement.remove();
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
		        },

		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.scoreComp", defineWidget());
	}
}