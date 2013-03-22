package test;

import test.Assert;

class ExampleTest implements haxe.rtti.Infos {

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
