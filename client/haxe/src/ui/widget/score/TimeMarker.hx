package ui.widget.score;

import snap.Snap;

class TimeMarker
{
	private var paper: Snap;
	private var width: Int;
	private var line:SnapElement;

	public function new(paper:Snap, width:Int) {
		this.paper = paper;
		this.width = width;

		drawTimeLine();
	}

	private function drawTimeLine() {
		var margin = 7;
		var y = 3*margin;
		var attrs = {
			strokeOpacity: 0.6,
			stroke: "#cccccc", 
			strokeWidth: 1
		};

	  	this.line = paper.line(margin, y, width - margin, y).attr(attrs);

	  	var interval:Float = (width - 2*margin) / 24;
		var x:Float = margin;
	  	for(i in 0...25) {
	  		paper.line(x, y, x, y+margin).attr(attrs);
	  		x += interval;
	  	}
	}
}
