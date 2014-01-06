package ui.widget.score;

import snap.Snap;

class Shapes {
	public static function createHexagon(paper:Snap, cx:Float, cy:Float, r:Float):SnapElement {
		var theta = 0.523598775;
		var hexagon = paper.polygon([
			cx - r * Math.sin(theta), cy - r * Math.cos(theta),
			cx - r, cy,
			cx - r * Math.sin(theta), cy + r * Math.cos(theta),
			cx + r * Math.sin(theta), cy + r * Math.cos(theta),
			cx + r, cy,
			cx + r * Math.sin(theta), cy - r * Math.cos(theta)
		]);

		hexagon.attr("cx", cx);
		hexagon.attr("cy", cy);
		hexagon.attr("r", r);

		return hexagon;
	}
}