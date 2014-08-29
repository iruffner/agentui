package m3.test;


import m3.util.M;
using Lambda;
import m3.test.Assert;

@:rtti class MTest {

	@test
	function fn1() {
		var input = [1,2,3,4];
		var expected = [10,20,30,40];

		var actual = input.map(M.fn1(it*10)).array();

		Assert.areEqual("" + actual, "" + expected);

		Assert.areEqual(actual.length, expected.length);

		trace("  actual = " + actual);
		trace("expected = " + expected);

		for ( i in 0...actual.length ) {
			Assert.areEqual(actual[i], expected[i]);
		}

	}


	@test
	function getXSimpleDefaults() {

		var x: String = null;

		Assert.areEqual( M.getX(25,       10), 25);
		Assert.areEqual( M.getX(x.length, 10), 10);

	}

	@test
	function getXComplexDefault() {

		var a: A = new A();
		var aa: A = a;
		a.setB(null);

		Assert.areEqual( M.getX(a, aa ), aa );
	}

	@test
	function notNullXSimpleVarTest() {

		var x: String = null;

		Assert.isFalse( try { x.length; true; } catch (e: Dynamic) { false; }  );
		Assert.isFalse( M.notNullX(x) );
		Assert.isTrue( M.notNullX("hello world") );

	}

	@test
	function notNullXComplexObjectTest() {

		var a: A = new A();

		a.setB(null);

		Assert.isFalse ( M.notNullX(a.getB().getC().getStringValue()) );

	}

}

class A {
	var b: B;
	public function new() {
		b = new B();
	}

	public function getB(): B {
		return b;
	}

	public function setB(bb: B) {
		b = bb;
	}
}

class B {

	var c: C;
	public function new() {
		c = new C();
	}

	public function getC(): C {
		return c;
	}

	public function setC(cc: C) {
		c = cc;
	}
}

class C {
	var stringValue: String;
	public function new() {
		stringValue = "class C!";
	}

	public function getStringValue(): String {
		return stringValue;
	}
}