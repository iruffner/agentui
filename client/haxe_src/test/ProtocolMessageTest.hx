package test;

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
    function test_CreateUserRequest() {
        var cur: CreateUserRequest = new CreateUserRequest();
        var data: UserRequestData = new UserRequestData();
        cur.contentImpl = data;
        data.email = "user_email";
        data.password = "user_password";
        data.jsonBlob = {};
        data.jsonBlob.name = "user_name";

        var actual = AgentUi.SERIALIZER.toJsonString(cur);

        var expected = '{"msgType":"createUserRequest","content":{"email":"user_email","password":"user_password","jsonBlob":{"name":"user_name"}}}';

        Assert.areEqual(expected, actual);
    }
    
    @test
    function test_test2() {
    }
}
