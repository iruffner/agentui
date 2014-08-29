package m3.test;


import m3.test.Assert;
import haxe.Json;
import m3.util.DeepCompare;

@:rtti class DeepCompareTest {

    @test
    function testInts() {    	
    	DeepCompare.assert(1,1);
    }

    @test
    function testStrings() {
    	DeepCompare.assert("a","a");
    }

    @test
    function testFailure() {

    	var left = {
    		a: 1,
    		b: "xyz"
    	}

    	var right = {
    		a: 1,
    		b: "xyz",
    		c: 5
    	}

    	try {
    		DeepCompare.assert(left, right);
    		Assert.fail("we should have blown up");
    	} catch ( e: Dynamic ) {    		
    	}

    }

    @test
    function testArrayFailure() {
    	var left = [1,2,3];
    	var right = [1,2,3,4];
    	try {
    		DeepCompare.assert(left, right);
    		Assert.fail("we should have blown up");
    	} catch ( e: Dynamic ) {
    		trace("we blewup as we should have");
    		trace(e);
    	}

    }

    @test
    function testDeepCompareFailureMessage() {
    	try {
    		DeepCompare.assert(
                { a: { b: { c: [1,2,3] } } }, 
                 { a: { b: { c: [1,2,3,4] } } }
            );
    		Assert.fail("we should have blown up");
    	} catch ( e: Dynamic ) {
    		trace("we blewup as we should have");
    		trace(e);
    	}

        try {
            DeepCompare.assert(
                { a: { b: { c: [1,2,3] } } }, 
                 { a: { b: { c: [1,2,99] } } }
            );
            Assert.fail("we should have blown up");
        } catch ( e: Dynamic ) {
            trace("we blewup as we should have");
            trace(e);
        }

    }

    @test
    function testArraySuccess() {
    	var left = [1,2,3];
    	var right = [1,2,3];
   		DeepCompare.assert(left, right);
    }

}