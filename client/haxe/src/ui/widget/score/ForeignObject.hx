package ui.widget.score;

class ForeignObject {
	public static function appendMessageText(ele_id:String, bbox:Dynamic, content:MessageContent) {
		var klone = js.d3.D3.select("#" + ele_id);
		var fo = klone.append("foreignObject")
		    .attr("width", Std.string(bbox.width - 14))
		    .attr("height", rect.attr("height"))
		    .attr("x", Std.string(bbox.x))
		    .attr("y", Std.string(bbox.y))
		    .append("xhtml:body");
		fo.append("div")
		    .attr("class", "messageContent-large-text")
		    .style("width", Std.string(bbox.width - 49) + "px")
		    .style("height", Std.string(bbox.height - 49) + "px")
		    .html(content.text);
	}
}