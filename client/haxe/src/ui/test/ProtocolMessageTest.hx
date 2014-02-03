package ui.test;

import m3.test.Assert;
import ui.api.ProtocolMessage;
import ui.AgentUi;
import ui.model.ModelObj;

@:rtti class ProtocolMessageTest {

    @setup
    function setup() {
        var user:User = new User();
        AgentUi.USER = user; 
        AgentUi.SERIALIZER = new m3.serialization.Serialization.Serializer(); 
    }

    @teardown
    function teardown() {        
    }
    
    @test
    function test_test2() {
    }
}
