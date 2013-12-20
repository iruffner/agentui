package ui.widget.score;

import snap.Snap;
import ui.model.ModelObj;
import js.html.*;


class ContentTimeLine {
	private static var next_y_pos:Int = 60;
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

 	public static function resetPositions(): Void {
		ContentTimeLine.next_y_pos = 60;
		ContentTimeLine.next_x_pos = 10;
 	}

	public function new(paper:Snap, connection: Connection, startTime:Float, endTime:Float) {
		this.paper      = paper;
		this.connection = connection;
		this.startTime  = startTime;
		this.endTime    = endTime;

		this.contents = new Array<Content>();
		this.contentElements = new Array<SnapElement>();

		if (ContentTimeLine.next_y_pos > 0) {
			ContentTimeLine.next_y_pos += ContentTimeLine.height + 20;
		}
		ContentTimeLine.next_y_pos += 10;

	 	time_line_x = ContentTimeLine.next_x_pos;
	 	time_line_y = ContentTimeLine.next_y_pos;

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
		var line = paper.line(time_line_x, time_line_y + height/2, 1000, time_line_y + height/2)
		                .attr({strokeOpacity: 0.6,
			                   stroke: "#cccccc", 
			                   strokeWidth: 1
        			});
		var img = paper.image(connection.profile.imgSrc, time_line_x, time_line_y, width, height);
		var rect = paper.rect(time_line_x, time_line_y, width, height, 10, 10).attr({fill:"none", stroke: "#bada55", strokeWidth: 1});
		connectionElement = paper.group(paper, [line, img, rect]);
	}

	public function addContent(content:Content):Void {
		contents.push(content);
		createContentElement(content);
	}

	private function createContentElement(content:Content):Void {
		var radius = 10;
		var gap    = 10;

		var x:Float = (this.endTime - content.created.getTime())/(this.endTime - this.startTime) * 700 + time_line_x + ContentTimeLine.width;
		var y:Float = time_line_y  + height/2;

		if (content.type == ContentType.TEXT) {
			addContentElement(content, createTextElement(cast(content, MessageContent), x, y));
		} else if (content.type == ContentType.IMAGE) {
			addContentElement(content, createImageElement(cast(content, ImageContent), x, y));
		} else if (content.type == ContentType.URL) {
			addContentElement(content, createLinkElement(cast(content, UrlContent), x, y));
		} else if (content.type == ContentType.AUDIO) {
			addContentElement(content, createAudioElement(cast(content, AudioContent), x, y));
		}
	}
/*
	private function hover_in(evt:Event):Void {
		m3.util.JqueryUtil.alert("hover hover");
	}
	private function hover_out(evt:Event):Void {
		m3.util.JqueryUtil.alert("hover out");
	}
*/
	private function addContentElement(content:Content, ele:SnapElement) {
		ele = ele.click(function(evt:Event):Void {
			var clone = ele.clone();
			clone.click(function(evt:Event){
				clone.remove();
			});
			clone.animate({
			    transform: "t10,10 s5",    
			   }, 200);		
			});
// 		ele = ele.hover(hover_in, hover_out);
		this.contentElements.push(ele);		
	}

	private function createTextElement(content:MessageContent, x:Float, y:Float):SnapElement {
		var ele_width:Float = 80;
		var ele_height:Float = 40;

		var eles = [];
		var rect = paper.rect(x - ele_width/2, y - ele_height/2, ele_width, ele_height, 3, 3).attr({stroke:"#00FF00", strokeWidth:"1px", fill: "orange"});
		eles.push(rect);

		// Break the text up into words and then re-assemble them
		var max_chars = 22;
		var words = content.text.split(" ");
		var lines = [];
		var line_no = 0;
		lines[line_no] = "";
		for (i in 0...words.length) {
			if (lines[line_no].length + words[i].length > max_chars) {
				line_no += 1;
				if (line_no == 3) {
					break;
				}
				lines[line_no] = "";
			}
			lines[line_no] += words[i] + " ";
		}

		var y_pos = y - ele_height/2 + 10;
		for (i in 0...line_no+1) {
			var text = paper.text(x - ele_width/2 + 4, y_pos, lines[i]).attr({color:"#ff00ff", fontSize:"6px"});
			eles.push(text);
			y_pos += 10;
		}
		return paper.group(paper, eles);
	}

	private function createImageElement(content:ImageContent, x:Float, y:Float):SnapElement {
		var ele_width:Float = 40;
		var ele_height:Float = 30;
		var img = paper.image(content.imgSrc, x, y - ele_height/2, ele_width, ele_height);
		return paper.group(paper, [img]);
	}

	private function createLinkElement(content:UrlContent, x:Float, y:Float):SnapElement {
		var hex = Shapes.createHexagon(paper, x, y, 20);
		hex.attr({stroke:"#00FF00", strokeWidth:"1px", fill: "cyan"});
		return paper.group(paper, [hex]);
	}

	private function createAudioElement(content:AudioContent, x:Float, y:Float):SnapElement {
		var ellipse = paper.ellipse(x, y, 40, 20);
		ellipse.attr({stroke:"wheat", strokeWidth:"1px", fill: "tomato"});

		// Create a triangle play button
		var triangle = paper.polygon([x+10, y, x-10, y-10, x-10, y+10]);
		triangle.attr({stroke:"green", strokeWidth:"1px", fill:"red", strokeOpacity: 0.6, fillOpacity:0.6});
		return paper.group(paper, [ellipse, triangle]);
	}
}
