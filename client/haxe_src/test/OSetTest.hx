package test;

import ui.observable.OSet;
import ui.util.M;
import ui.util.DeepCompare;
import test.Assert;

using Lambda;

class OSetTest implements haxe.rtti.Infos {

	@test
	function addWithFilterTest() {

		var set = new ObservableSet<String>(M.fn1(it));

		var fs = set.filter(M.fn1(it.length > 4));

		var setT: String = null;
		var setType: EventType = null;

		set.listen(function(t, type) {
			setT = t;
			setType = type;
		});

		var fsT: String = null;
		var fsType: EventType = null;

		fs.listen(function(t, type) {
			fsT = t;
			fsType = type;
		});

		set.add("a");
		Assert.areEqual(setT, "a");
		Assert.areEqual(setType, EventType.Add);
		Assert.areEqual(fsT, null);
		Assert.areEqual(fsType, null);

		set.add("bb");
		Assert.areEqual(setT, "bb");
		Assert.areEqual(setType, EventType.Add);
		Assert.areEqual(fsT, null);
		Assert.areEqual(fsType, null);

		set.add("ccc");
		Assert.areEqual(setT, "ccc");
		Assert.areEqual(setType, EventType.Add);
		Assert.areEqual(fsT, null);
		Assert.areEqual(fsType, null);

		set.add("ddddd");
		Assert.areEqual(setT, "ddddd");
		Assert.areEqual(setType, EventType.Add);
		Assert.areEqual(fsT, "ddddd");
		Assert.areEqual(fsType, EventType.Add);
	}

	@test
	function deleteTest() {
		var set = new ObservableSet<String>(M.fn1(it));

		var fs = set.filter(M.fn1(it.length > 4));

		var setT: String = null;
		var setType: EventType = null;

		set.listen(function(t, type) {
			setT = t;
			setType = type;
		});

		var fsT: String = null;
		var fsType: EventType = null;

		fs.listen(function(t, type) {
			fsT = t;
			fsType = type;
		});

		set.add("ggggggg");
		Assert.areEqual(setT, "ggggggg");
		Assert.areEqual(setType, EventType.Add);
		Assert.areEqual(fsT, "ggggggg");
		Assert.areEqual(fsType, EventType.Add);

		set.delete("ggggggg");
		Assert.areEqual(setT, "ggggggg");
		Assert.areEqual(setType, EventType.Delete);
		Assert.areEqual(fsT, "ggggggg");
		Assert.areEqual(fsType, EventType.Delete);
	}

	@test
	function updateTest() {

		var set = new ObservableSet<String>(M.fn1(it));

		var fs = set.filter(M.fn1(it.length > 4));

		var setT: String = null;
		var setType: EventType = null;

		set.listen(function(t, type) {
			setT = t;
			setType = type;
		});

		var fsT: String = null;
		var fsType: EventType = null;

		fs.listen(function(t, type) {
			fsT = t;
			fsType = type;
		});


		set.add("ffffff");
		Assert.areEqual(setT, "ffffff");
		Assert.areEqual(setType, EventType.Add);
		Assert.areEqual(fsT, "ffffff");
		Assert.areEqual(fsType, EventType.Add);

		set.update("ffffff");
		Assert.areEqual(setT, "ffffff");
		Assert.areEqual(setType, EventType.Update);
		Assert.areEqual(fsT, "ffffff");
		Assert.areEqual(fsType, EventType.Update);
	}

	@test
	function groupedSetTest() {

		var menuItems = new ObservableSet<MenuItem>(M.fn1(it.uid));
		var groupedItems = new GroupedSet(menuItems, M.fn1(it.category));

		menuItems.add({
			uid: "a",
			category: "coolness",
			description: "loads of coolness"
		});

		menuItems.add({
			uid: "b",
			category: "coolness",
			description: "extra coolness"
		});

		Assert.isTrue(groupedItems.delegate().exists("coolness"));

		menuItems.add({
			uid: "c",
			category: "meganess",
			description: "when you need more -ness go mega"
		}); 

		Assert.isTrue(groupedItems.delegate().exists("coolness") );
		Assert.isTrue(groupedItems.delegate().exists("meganess") );

	}

	@test
	function sortSetTests() {
		var menuItems = new ObservableSet<MenuItem>(M.fn1(it.uid));
		var sortedItems = new SortedSet<MenuItem>(menuItems, null);

		var a: MenuItem = {
			uid: "a",
			category: "coolness",
			description: "loads of coolness"
		}

		var b: MenuItem = {
			uid: "c",
			category: "meganess",
			description: "when you need more -ness go mega"
		}

		var c: MenuItem = {
			uid: "b",
			category: "coolness",
			description: "extra coolness"
		}

		menuItems.add(a);
		menuItems.add(c);
		menuItems.add(b);

		DeepCompare.assert(
			Lambda.list(["a", "b", "c"])
			, Lambda.map(sortedItems, function(mi) {return mi.uid;} )
		);

		menuItems.delete(b);

		// var expected = Lambda.list(["a", "c"]);
		// var actual = Lambda.map(sortedItems, function(mi) {return mi.uid;} );

		// DeepCompare.assert(expected, actual);

		var d: MenuItem = {
			uid: "a",
			category: "ultra mega coolness",
			description: "say what!?! coolness"
		};

		menuItems.update(d);

		var newA = sortedItems.delegate().get("a");

		DeepCompare.assert(d, newA);

	}

}

typedef MenuItem = {
	var uid: String;
	var category: String;
	var description: String;
}
