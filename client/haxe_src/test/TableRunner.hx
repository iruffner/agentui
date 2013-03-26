package test;


import ui.observable.OSet;
import ui.util.M;
import ui.jq.JQ;
using StringTools;
using Lambda;

class TableRunner {
	

	static function main() {
		new JQ("document").ready(function (event) {
			new TableRunner().start();
		});
	}

	var _mainDiv: JQ;

	public function new() {		
	}

	public function start() {
		_mainDiv = new JQ("#tests_go_here");

		var table = new JQ("<table></table>");

		_mainDiv.append(table);

		for ( row in 0...10 ) {
			var tr = new JQ("<tr></tr>");
			for ( col in 0...3 ) {
				var td = new JQ("<td>" + row + ":" + col + "</td>");
				tr.append(td);
			}
			table.append(tr); 
		}

	}

}

