package qoid.test;

import m3.test.TestRunnerBase;
import m3.exception.Exception;
import m3.jq.JQ;
using m3.serialization.TypeTools;
using Lambda;
import Type;
import haxe.rtti.CType;

class TestRunner extends TestRunnerBase{

	override function getUnitTestClasses() {
		var tests = super.getUnitTestClasses();
		tests.push(new QoidApiTest());
		return tests;
	}

	static function main() {
		new JQ("document").ready(function (event) {
			new TestRunner().start();
		});
	}
}