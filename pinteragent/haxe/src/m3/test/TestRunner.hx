package m3.test;

import m3.jq.JQ;
import m3.exception.Exception;
using m3.serialization.TypeTools;
using Lambda;
import Type;
import haxe.rtti.CType;
import m3.util.M;
import m3.test.TestRunnerBase;

class TestRunner extends TestRunnerBase{

	override function getUnitTestClasses() {
		var tests = super.getUnitTestClasses();
		// Add your app-specific tests here
		return tests;
	}

	static function main() {
		new JQ("document").ready(function (event) {
			new TestRunner().start();
		});
	}
}