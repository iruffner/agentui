package ui.widget.score;

import snap.Snap;
import ui.model.ModelObj;

class ContentTimeLine {
	public var paper: Snap;
	public var connection: Connection;
	public var connectionElement:SnapElement;

	public var contents: Array<Content>;
	public var contentElements: Array<SnapElement>;

	public static var next_y_pos:Int = 60;
	public static var next_x_pos:Int = 10;
	public static var width:Int = 40;
 	public static var height:Int = 50;

 	private var startTime:Float;
 	private var endTime:Float;

 	private var time_line_x:Float;
 	private var time_line_y:Float;

 	public static function resetPositions(): Void {
		ContentTimeLine.next_y_pos = 60;
		ContentTimeLine.next_x_pos = 10;
 	}

	public function new (paper:Snap, connection: Connection, startTime:Float, endTime:Float) {
		this.paper = paper;
		this.connection = connection;
		this.startTime = startTime;
		this.endTime   = endTime;

		this.contents = new Array<Content>();
		this.contentElements = new Array<SnapElement>();

		// TODO:  add a class instance for x and y

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
		var line = paper.line(time_line_x, time_line_y + height/2, 1000, time_line_y + height/2).attr({{stroke: "red", strokeWidth: 1}});
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
		var gap = 10;

		var x:Float = (this.endTime - content.created.getTime())/(this.endTime - this.startTime) * 700 + time_line_x + ContentTimeLine.width;
		var y:Float = time_line_y  + height/2;

		if (content.type == ContentType.TEXT) {
			this.contentElements.push(createTextElement(cast(content, MessageContent), x, y));
		} else if (content.type == ContentType.IMAGE) {
			this.contentElements.push(createImageElement(cast(content, ImageContent), x, y));
		} else if (content.type == ContentType.URL) {
			this.contentElements.push(createLinkElement(cast(content, UrlContent), x, y));
		} else {
			var circle = paper.circle(x, y, radius);
			circle.attr({
			    fill: "#ff0000",
			    stroke: "#0000ff"
			});
			var text = paper.text(x, time_line_y, content.created).attr({fontSize: "8px"});

			this.contentElements.push(paper.group(paper, [circle, text]));
		}
	}

	private function createTextElement(content:MessageContent, x:Float, y:Float):SnapElement {
		var ele_width:Float = 60;
		var ele_height:Float = 40;

		var text = content.text.substr(0, 20) + "\n" + content.text.substring(20, content.text.length);
		var rect = paper.rect(x - ele_width/2, y - ele_height/2, ele_width, ele_height, 3, 3).attr({stroke:"#00FF00", strokeWidth:"1px", fill: "orange"});
		var text = paper.text(x - ele_width/2 + 4, y - ele_height/2 + 10, text).attr({color:"#ff00ff", fontSize:"6px"});
		return paper.group(paper, [rect, text]);
	}

	private function createImageElement(content:ImageContent, x:Float, y:Float):SnapElement {
		var ele_width:Float = 60;
		var ele_height:Float = 40;
		var img = paper.image(content.imgSrc, x, y - ele_height/2, ele_width, ele_height);
		return paper.group(paper, [img]);
	}

	private function createLinkElement(content:UrlContent, x:Float, y:Float):SnapElement {
		var hex = Shapes.createHexagon(paper, x, y, 30);
		hex.attr({stroke:"#00FF00", strokeWidth:"1px", fill: "cyan"});
		return paper.group(paper, [hex]);
	}
/*	
	private function createAudioElement(content:Content, x:Float, y:Float):SnapElement {

	}
	*/
}
