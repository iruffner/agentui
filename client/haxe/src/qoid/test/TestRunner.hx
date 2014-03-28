package ui.test;

import m3.jq.JQ;
import m3.widget.Widgets;
import m3.jq.JQDialog;
import m3.jq.M3Dialog;
import m3.test.TestRunnerBase;

class TestRunner extends TestRunnerBase {

	override function getUnitTestClasses() {
	    var tests: Array<Dynamic> = [
			ui.test.ProtocolMessageTest
		];
		return tests;
	}

	static function main() {
		new JQ("document").ready(function (event) {
			new TestRunner().start();
		});
	}
}