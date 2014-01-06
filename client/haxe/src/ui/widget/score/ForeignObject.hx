package ui.widget.score;
import ui.model.ModelObj;
import js.d3.D3;
import js.html.*;

class ForeignObject {

	private static function createForeignObject(ele_id:String, bbox:Dynamic):Dynamic {
		var klone = D3.select("#" + ele_id);
		var fo = klone.append("foreignObject")
		    .attr("width", Std.string(bbox.width - 21))
		    .attr("height", bbox.height)
		    .attr("x", Std.string(bbox.x))
		    .attr("y", Std.string(bbox.y))
		    .append("xhtml:body");
		return fo;
	}

	public static function appendMessageContent(ele_id:String, bbox:Dynamic, content:MessageContent) {
		var fo = createForeignObject(ele_id, bbox);
		fo.append("div")
		    .attr("class", "messageContent-large-text")
		    .style("width", Std.string(bbox.width - 49) + "px")
		    .style("height", Std.string(bbox.height) + "px")
		    .html(content.text);
	}

	public static function appendUrlContent(ele_id:String, bbox:Dynamic, content:UrlContent) {
		bbox.y = bbox.y + bbox.height/2 - 12;
		bbox.x += 12;
		var fo = createForeignObject(ele_id, bbox);
		var div = fo.append("div")
		    .style("width", Std.string(bbox.width - 49) + "px")
		    .style("font-size", "12px");

		div.append("a")
		    .attr("href", content.url)
		    .attr("target", "_blank")
		    .html(content.text)
		    .on("click", function(){
		    	D3.event.stopPropagation();
			});
	}

	public static function appendImageContent(ele_id:String, bbox:Dynamic, content:ImageContent) {
		bbox.y = bbox.y + bbox.height/2;

		var fo = createForeignObject(ele_id, bbox);
		var div = fo.append("div");
		div.append("div")
			.attr("class", "imageCaption")
			.html(content.caption);
		
		div.append("img")
		    .attr("src", content.imgSrc)
		    .style("width", Std.string(bbox.width - 49) + "px")
		    .style("height", Std.string(bbox.height) + "px");
	}

	public static function appendAudioContent(ele_id:String, bbox:Dynamic, content:AudioContent) {
		bbox.y = bbox.y + bbox.height/2 - 12;
		bbox.x = bbox.x + bbox.width/3;
		var fo = createForeignObject(ele_id, bbox);
		var div = fo.append("div");
		
		div.append("div")
			.attr("class", "audioTitle")
			.style("width", Std.string(bbox.width - 49) + "px")
		    .style("font-size", "12px")
			.html(content.title);
		
		var audioDiv = div.append("div")
			.style("width", Std.string(bbox.width - 49) + "px");

		audioDiv.append("audio")
		    .attr("src", content.audioSrc)
		    .attr("controls", "controls")
		    .style("width", "230px")
		    .style("height", "50px")
   		    .on("click", function(){
		    	D3.event.stopPropagation();
			});

	}
}