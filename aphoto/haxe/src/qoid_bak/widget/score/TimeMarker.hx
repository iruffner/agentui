package qoid.widget.score;

import snap.Snap;

class TimeMarker {

	private var paper: Snap;
	private var width: Float;
	private var line:SnapElement;
	private var group:SnapElement;
	private var start:Float;
	private var end:Float;

	public function new(uberGroup:SnapElement, paper:Snap, width:Float, start:Date, end:Date) {
		this.paper = paper;
		this.width = width;
		this.group = paper.group(paper, [])
		                  .attr("id", "time-marker");
		uberGroup.append(this.group);
		this.start = start.getTime();
		this.end   = end.getTime();

		drawTimeLine();
	}

	public function setStart(date:Date) {
		this.start = date.getTime();
		drawTimeLine();
	}

	public function setEnd(date:Date) {
		this.end = date.getTime();
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

		var eles = this.group.selectAll("*");
		eles.forEach(function(ele:SnapElement):Void{
			ele.remove();
		}, {});

	  	this.line = paper.line(margin, y, width - margin, y).attr(attrs);
	  	this.group.append(this.line);

	  	var interval = end - start;

	  	// 1 day:  each hour
	  	// 20 days: each day
	  	// 30-60 days: 5 days
	  	// 120 days: 10 days
	  	// ... month

	  	var interval:Float = (width - 2*margin) / 24;
		var x:Float = margin;
	  	for(i in 0...25) {
	  		switch(i) {
	  			case 0, 12, 24: 
	  				this.group.append(paper.line(x, y-margin, x, y+margin).attr(attrs));
			  		x += interval;
		  		case 3, 15: 
	  				this.group.append(paper.line(x, y, x, y+margin+2).attr(attrs));
			  		x += interval;
			  	case 6, 18: 
	  				this.group.append(paper.line(x, y, x, y+margin+2).attr(attrs));
			  		x += interval;
			  	case 9, 21: 
	  				this.group.append(paper.line(x, y, x, y+margin+2).attr(attrs));
			  		x += interval;

	  			case _: 
			  		this.group.append(paper.line(x, y, x, y+margin).attr(attrs));
			  		x += interval;
	  		}
	  	}
	}
}
