package m3.test;

import m3.test.Assert;

@:rtti class ExampleTest {

    @setup
    function setup() {     
    }

    @teardown
    function teardown() {        
    }

    @test
    function example1() {
        Assert.areEqual("a", "a");
    }


}
