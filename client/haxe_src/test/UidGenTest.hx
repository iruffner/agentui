package test;

import test.Assert;
import ui.util.UidGenerator;

class UidGenTest implements haxe.rtti.Infos {
	
	@test
	function test() {
		var uid = UidGenerator.create(24);
		Assert.areEqual(uid.length, 24);
	}
	
}