package ui.widget.score;

import snap.Snap;
import ui.model.ModelObj;
import js.html.*;
import m3.util.M;
import m3.jq.JQ;
import js.d3.*;

class ContentTimeLine {
	private static var initial_y_pos = 60;

	private static var next_y_pos:Int = initial_y_pos;
	private static var next_x_pos:Int = 10;
	private static var width:Int = 40;
 	private static var height:Int = 50;

	private var paper: Snap;
	private var connection: Connection;
	private var connectionElement:SnapElement;

	private var contents: Array<Content>;
	private var contentElements: Array<SnapElement>;

 	private var startTime:Float;
 	private var endTime:Float;

 	private var time_line_x:Float;
 	private var time_line_y:Float;

 	private var initialWidth:Float;

 	public static function resetPositions(): Void {
		ContentTimeLine.next_y_pos = initial_y_pos;
		ContentTimeLine.next_x_pos = 10;
 	}

	public function new(paper:Snap, connection: Connection, startTime:Float, endTime:Float, initialWidth:Float) {
		this.paper      = paper;
		this.connection = connection;
		this.startTime  = startTime;
		this.endTime    = endTime;
		this.initialWidth = initialWidth;

		this.contents = new Array<Content>();
		this.contentElements = new Array<SnapElement>();

		if (ContentTimeLine.next_y_pos > initial_y_pos) {
			ContentTimeLine.next_y_pos += ContentTimeLine.height + 20;
		}
		ContentTimeLine.next_y_pos += 10;

	 	time_line_x = ContentTimeLine.next_x_pos;
	 	time_line_y = ContentTimeLine.next_y_pos;

   		createConnectionElement();

   		createMessageContent();
	}

	public function removeElements() {
		connectionElement.remove();

		var iter = contentElements.iterator();
		while (iter.hasNext()) {
			iter.next().remove();
		}
	}

	private function createConnectionElement(): Void {
		var line = paper.line(time_line_x, time_line_y + height/2, initialWidth, time_line_y + height/2)
		                .attr({"class":"contentLine"});
		var img = paper.image(M.getX(connection.profile.imgSrc,"media/default_avatar.jpg"), time_line_x, time_line_y, width, height);
		var rect = paper.rect(time_line_x, time_line_y, width, height, 10, 10).attr({"class": "contentRect"});
		connectionElement = paper.group(paper, [line, img, rect]);
	}

	public function addContent(content:Content):Void {
		contents.push(content);
		createContentElement(content);
	}

	private function createContentElement(content:Content):Void {
		var radius = 10;
		var gap    = 10;

		var x:Float = (this.endTime - content.created.getTime())/(this.endTime - this.startTime) * initialWidth + time_line_x + ContentTimeLine.width;
		var y:Float = time_line_y  + height/2;

		var ele:SnapElement;
		if (content.type == ContentType.TEXT) {
			addContentElement(content, createTextElement(cast(content, MessageContent), x, y, 80, 40));
		} else if (content.type == ContentType.IMAGE) {
			addContentElement(content, createImageElement(cast(content, ImageContent), x, y, 40, 30));
		} else if (content.type == ContentType.URL) {
			addContentElement(content, createLinkElement(cast(content, UrlContent), x, y, 20));
		} else if (content.type == ContentType.AUDIO) {
			addContentElement(content, createAudioElement(cast(content, AudioContent), x, y, 40, 20));
		}
	}

	private function cloneElement(ele:SnapElement):SnapElement {
		var clone = ele.clone();
		clone.attr({"contentType": ele.attr("contentType")});
		clone.attr({"id": ele.attr("id") + "-clone"});
		return clone;		
	}

	private function addContentElement(content:Content, ele:SnapElement) {
		ele.attr({"contentType": Std.string(content.type)});
		ele.attr({"id" : content.creator + "-" + content.uid});

		var after_anim:Void->Void = function(){};

		ele = ele.click(function(evt:Event):Void {
			var clone = cloneElement(ele);

			switch (clone.attr("contentType")) {
				case "TEXT":
					var texts = clone.selectAll("text");
					texts.forEach( function(e:SnapElement):Void {
						e.remove();
					} , this);

					after_anim = function() {
						var bbox = clone.getBBox();
						clone.remove();

						var rect = paper.rect(bbox.x, bbox.y, bbox.width, bbox.height, 3, 3)
		                .attr({"class":"messageContent"});

						var lines = splitText(cast(content, MessageContent).text, 50);
						var eles:Array<SnapElement> = [];
						eles.push(rect);
						var y = bbox.y + 15;// - bbox.height/2 + 10;
						var x = bbox.x + 5;// - bbox.width/2 + 4;
						var max_width:Float = 0;
						for (i in 0...lines.length) {
							var text = paper.text(x, y, lines[i])
							                .attr({"class":"messageContent-large-text"});
							eles.push(text);
							max_width = Math.max(max_width, Std.int(text.getBBox().width));
							y += 15;
						}
						max_width += 50;
						if (max_width > bbox.width) {
							rect.attr({"width" : Std.string(max_width)});
						}
						var g = paper.group(paper, eles);
						g.click(function(evt:Event){
							g.remove();
						});
					};
				default:
					after_anim = function() { 
						clone.click(function(evt:Event):Void {
							clone.remove();
						});
					}
			}

			clone.animate(
				{transform: "t10,10 s5"},
			    200, "", function(){clone.animate({transform: "t10,10 s4"},100, "", after_anim);}
			);		
		});

		this.contentElements.push(ele);		
	}

	private function splitText(text:String, max_chars:Float, ?max_lines:Float=0):Array<String> {
		var words = text.split(" ");
		var lines = new Array<String>();
		var line_no = 0;
		lines[line_no] = "";
		for (i in 0...words.length) {
			if (lines[line_no].length + words[i].length > max_chars) {
				line_no += 1;
				if (line_no == max_lines) {
					break;
				}
				lines[line_no] = "";
			} else {
				lines[line_no] += " ";
			}
			lines[line_no] += words[i];
		}
		return lines;
	}

	private function createTextElement(content:MessageContent, x:Float, y:Float, ele_width:Float, ele_height:Float):SnapElement {
		var eles = [];
		var rect = paper.rect(x - ele_width/2, y - ele_height/2, ele_width, ele_height, 3, 3)
		                .attr({"class":"messageContent"});
		eles.push(rect);

		// Break the text up into words and then re-assemble them into lines
		var lines = splitText(content.text, 22, 3);

		var y_pos = y - ele_height/2 + 10;
		for (i in 0...lines.length) {
			var text = paper.text(x - ele_width/2 + 4, y_pos, lines[i])
			                .attr({"class":"messageContent-small-text"});
			eles.push(text);
			y_pos += 10;
		}
		return paper.group(paper, eles);
	}

	private function createMessageContent():Void {
		var score_comp = js.d3.D3.select("#score-comp-svg");
		score_comp.append("foreignObject")
		    .attr("width", "480")
		    .attr("height", "500")
		    .append("xhtml:body")
		    .style("font", "14px 'Helvetica Neue'")
		    .html("<b>what???</b>");
	}

	private function createImageElement(content:ImageContent, x:Float, y:Float, ele_width:Float, ele_height:Float):SnapElement {
		var img = paper.image(content.imgSrc, x, y - ele_height/2, ele_width, ele_height)
		               .attr({"preserveAspectRatio":"true"});
		return paper.group(paper, [img]);
	}

	private function createLinkElement(content:UrlContent, x:Float, y:Float, radius:Float):SnapElement {
		var hex = Shapes.createHexagon(paper, x, y, radius);
		hex.attr({"class":"urlContent"});
		return paper.group(paper, [hex]);
	}

	private function createAudioElement(content:AudioContent, x:Float, y:Float, rx:Float, ry:Float):SnapElement {
		var ellipse = paper.ellipse(x, y, rx, ry);
		ellipse.attr({"class":"audioEllipse"});

		// Create a triangle play button
		var triangle = paper.polygon([x+10, y, x-10, y-10, x-10, y+10]);
		triangle.attr({"class":"audioTriangle"});
		return paper.group(paper, [ellipse, triangle]);
	}
}
