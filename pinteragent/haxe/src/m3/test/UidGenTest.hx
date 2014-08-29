package m3.test;

import m3.test.Assert;

@:rtti class UidGenTest {
	
	@test
	function test() {
		var uid = m3.util.UidGenerator.create(24);
		Assert.areEqual(uid.length, 24);
	}
	
}