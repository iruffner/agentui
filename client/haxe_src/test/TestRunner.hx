package test;

import js.Dom;
import ui.jq.JQ;
import ui.exception.Exception;
using ui.serialization.TypeTools;
using Lambda;
import haxe.rtti.Infos;
import Type;
import haxe.rtti.CType;
import ui.util.M;

class TestRunner {

	function getUnitTestClasses() {
		return [
			test.DeepCompareTest,
			test.ExampleTest,
			test.MTest,
			test.OSetTest,
			test.SerializationTest,
			test.UidGenTest,
			test.StringHelperTest
		];
	}

	static function main() {
		new JQ("document").ready(function (event) {
			new TestRunner().start();
		});
	}

	var _unitTestClasses: Array<TestClass>;
	var logger: Dynamic;

	function new() {
		_unitTestClasses = [];
		getUnitTestClasses().iter(function(clazz) {
			try {
				_unitTestClasses.push(new TestClass(clazz));
				} catch ( e: Dynamic ) {
					Logger.console.error("error creating TestClass for " + clazz.classname());
					Logger.console.error(e);
				}
		});
		logger = {};
	}

	function start() {

		var div = new JQ("#tests_go_here");

		for ( i in 0..._unitTestClasses.length) {
			var tw = _unitTestClasses[i];
			div.append("<h2>" + tw.getName() + "</h2><br/><br/>");

			tw.getTests().iter(function(testMethod) {

				testMethod.mainDiv = new JQ("<div></div>");
				testMethod.resultsDiv = new JQ("<span>not run</span>");
				testMethod.logDiv = new JQ("<div style='width: 800px; border: 1px solid black; min-height: 50px; overflow: auto; max-height: 500px; display: none; margin: auto; text-align: left;'></div>");
				var toggler: JQ = new JQ("<span>Toggle Logs</span>");
				toggler.click(function(evt: js.JQuery.JqEvent): Void {
					testMethod.logDiv.toggle();
				});

				var button = new JQ("<button>run</button>");
				button.click(function(evt: js.JQuery.JqEvent): Void {
					testMethod.runTest();
				});
				
				testMethod.mainDiv
					.append("<b>" + testMethod.name + "</b>")
					.append("&nbsp;&nbsp;&nbsp;")
					.append(button)
					.append("&nbsp;&nbsp;&nbsp;")
					.append(testMethod.resultsDiv)
					.append("&nbsp;&nbsp;&nbsp;")
					.append(toggler)
					.append("<br/>")
					.append(testMethod.logDiv);

				div.append(testMethod.mainDiv);
				div.append("<br/><br/>");
			});

	    }
		
		runTests();

		trace("tests ran woot woot");

	}

	function runTests() {
		_unitTestClasses.iter(function(t) {
			t.runTests();
		});
	}
			
}

class TestStatus {
	public static var Running = "Running"; 
	public static var Pass = "Pass"; 
	public static var Fail = "Fail"; 
	public static var Error = "Error"; 
}

class TestResults {
	public var status: String;
	public var messages: Array<String>;
	public var fail: Assert;
	public var error: Dynamic;
	public function new(status: String, messages: Array<String>) {
		this.status = status;
		this.messages = messages;
	}

}

class TestMethod {
	public var mainDiv: JQ;
	public var logDiv: JQ;
	public var resultsDiv: JQ;
	public var testClass: TestClass;
	public var name: String;

	public function new(tc: TestClass, name: String) {
		testClass = tc;
		this.name = name;
	}

	public function runTest() {

		var fn = function() {
			var testInstance = testClass.setup();

 			var results = runTestImpl();

			resultsDiv.text(results.status);

			logDiv.empty();
			results.messages.iter(function(msg) {
				logDiv.append(msg).append("<br/>");
			});

		}

		// run tests with timer

		haxe.Timer.delay(fn,0);

	}

	public function runTestImpl(): TestResults {

		var results = new TestResults(TestStatus.Running, new Array<String>());		

		try {

			results.messages.push("START -- " + Date.now());

			var instance = testClass.setup();

			try {
				testClass.runMethod(instance, name);
				results.status = TestStatus.Pass;
				results.messages.push("PASS");
			} catch ( e: Assert ) {
				Logger.exception(e);
				results.status = TestStatus.Fail;				
				results.messages.push("FAIL -- " + e.message);
				results.messages.push(e.stackTrace());
			}

			testClass.teardown(instance);

	 	} catch ( e: Exception ) {
			results.status = TestStatus.Error;
			results.messages.push("ERROR -- " + e.message);
			try{
				results.messages.push(e.stackTrace());
			} catch (er: Dynamic) {
				trace("Couldn't push stacktrace");
			}
			results.error = e;
			Logger.console.error(e);
	 	} catch ( e: Dynamic ) {
			results.status = TestStatus.Error;
			results.messages.push("ERROR -- " + e);
			results.messages.push("  " + e.stack);
			results.error = e;
			Logger.console.error(e.stack);
			Logger.exception(e);
	 	} 

	 	return results;

	}
}


class TestClass {

	var _clazz: Class<Dynamic>;
	var _classname: String;
    var _classDef: Classdef;

	var _setupMethods: Array<String>;
	var _teardownMethods: Array<String>;

	var _tests: Array<TestMethod>;

	public function new(clazz: Class<Dynamic>) {
		_clazz = clazz;
		_classname = _clazz.classname();

		_setupMethods = [];
		_teardownMethods = [];

		_tests = [];

		var rtti: String = untyped _clazz.__rtti;
		if ( rtti == null ) {
			var msg = "no rtti found for " + _classname;
			trace(msg);
			throw new Exception(msg);
		}

		var x = Xml.parse(rtti).firstElement();
        var typeTree: Dynamic = new haxe.rtti.XmlParser().processElement(x);
        _classDef = switch ( typeTree ) {
        	case TClassdecl(c): c;
        	default: throw new Exception("expected a class got " + typeTree);
        }

        var tests = [];

 		for ( f in _classDef.fields ) {
 			var fieldXml = x.elementsNamed(f.name).next();
 			if ( fieldXml.get("set") == "method" ) {
	 			for( meta in fieldXml.elementsNamed("meta") ) {
	 				for ( m in meta.elementsNamed("m") ) {
	 					switch( m.get("n") ) {
	 						case "setup": _setupMethods.push(f.name);
	 						case "teardown": _teardownMethods.push(f.name);
	 						case "test": tests.push(f.name);
	 					}
	 				}
	 			}
 		    }
 		}

 		_tests = [];
 		tests.iter(function(t) {
 			_tests.push(new TestMethod(this, t));
 		});

	}


	public function getName(): String {
		return _classname;
	}

	public function getTests(): Array<TestMethod> {
		return _tests;
	}

	public function runTests(): Void {
		_tests.iter(function(t) {
			t.runTest();
		});
	}

	function runMethods(obj: Dynamic, methods: Array<String>) {
		methods.iter(function(m) {
			runMethod(obj, m);
		});
	}

	public function setup(): Dynamic {
		var testInstance = Type.createInstance(_clazz, []);
		runMethods(testInstance, _setupMethods);
		return testInstance;
	}

	public function teardown(testInstance: Dynamic): Void {
		runMethods(testInstance, _teardownMethods);
	}

	public function runMethod(obj: Dynamic, method: String) {
		Reflect.callMethod(obj, Reflect.field(obj, method), []);
	}

}


class Logger {
	public static var console: Dynamic = untyped __js__('window.console');

	public static function exception(error: Dynamic) {
		console.error(error);
	}
}

