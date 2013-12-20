package ui.widget.score;

import snap.Snap;

class Shapes {
	public static function createHexagon(paper:Snap, x:Float, y:Float, r:Float):SnapElement {
		var theta = 0.523598775;
		return paper.polygon([
			x - r * Math.sin(theta), y - r * Math.cos(theta),
			x - r, y,
			x - r * Math.sin(theta), y + r * Math.cos(theta),
			x + r * Math.sin(theta), y + r * Math.cos(theta),
			x + r, y,
			x + r * Math.sin(theta), y - r * Math.cos(theta)
		]);
	}
}