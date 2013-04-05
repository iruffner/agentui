package test;

import ui.helper.StringHelper;
import test.Assert;

class StringHelperTest implements haxe.rtti.Infos {

	@test
	function padLeftTests() {
		var expected = "<<<<test";
		var actual = StringHelper.padLeft("test", 8, "<");
		Assert.areEqual(expected, actual);

		var expected1 = "----test";
		var actual1 = StringHelper.padLeft("test", 8, "-");
		Assert.areEqual(expected1, actual1);

		var expected2 = "----";
		var actual2 = StringHelper.padLeft(null, 4, "-");
		Assert.areEqual(expected2, actual2);
	}

	@test
	function padRightTests() {
		var expected = "test----";
		var actual = StringHelper.padRight("test", 8, "-");
		Assert.areEqual(expected, actual);

		var expected1 = "test";
		var actual1 = StringHelper.padRight("test", 4, "<");
		Assert.areEqual(expected1, actual1);

		var expected2 = "<<<<";
		var actual2 = StringHelper.padRight(null, 4, "<");
		Assert.areEqual(expected2, actual2);
	}

	@test
	function trimLeftTests() {
		var expected = "";
		var actual = StringHelper.trimLeft(null);
		Assert.areEqual(expected, actual);

		var expected1 = "good to go!";
		var actual1 = StringHelper.trimLeft("\n\tgood to go!");
		Assert.areEqual(expected1, actual1);

		var expected1 = "good to go!\n\t";
		var actual1 = StringHelper.trimLeft("\n\t\n\tgood to go!\n\t");
		Assert.areEqual(expected1, actual1);

		var expected2 = "good to do!";
		var actual2 = StringHelper.trimLeft("good to do!", 20);
		Assert.areEqual(expected2, actual2);

		var expected3 = "d to go!";
		var actual3 = StringHelper.trimLeft("good to go!", 2, "go");
		Assert.areEqual(expected3, actual3);
		
		var expected4 = "good to go!";
		var actual4 = StringHelper.trimLeft("good to go!", "o");
		Assert.areEqual(expected4, actual4);

		var expected5 = "dy is good!";
		var actual5 = StringHelper.trimLeft("body is good!", "bo");
		Assert.areEqual(expected5, actual5);
	}

	@test
	function trimRightTests() {
		var expected = "";
		var actual = StringHelper.trimRight(null);
		Assert.areEqual(expected, actual);

		var expected1 = "good to go!";
		var actual1 = StringHelper.trimRight("good to go!\n\t");
		Assert.areEqual(expected1, actual1);

		var expected1 = "\n\t\n\tgood to go!";
		var actual1 = StringHelper.trimRight("\n\t\n\tgood to go!\n\t");
		Assert.areEqual(expected1, actual1);

		var expected2 = "good to do!";
		var actual2 = StringHelper.trimRight("good to do!", 20);
		Assert.areEqual(expected2, actual2);

		var expected3 = "good to ";
		var actual3 = StringHelper.trimRight("good to go!", 2, "go!");
		Assert.areEqual(expected3, actual3);
		
		var expected4 = "good to go!";
		var actual4 = StringHelper.trimRight("good to go!", "o");
		Assert.areEqual(expected4, actual4);

		var expected5 = "body is";
		var actual5 = StringHelper.trimRight("body is good!", " good!");
		Assert.areEqual(expected5, actual5);
	}

}