package m3.test;


import haxe.Json;
import m3.serialization.Serialization;
import m3.exception.Exception;
import m3.test.Assert;

typedef Bob = {
	var a: String;
	var b: String;
}

enum Enum1 {
	ev1;
	ev2;
}

@:rtti class Subclass {
	public var f1 = 21;
	public function new() {}
}

@:rtti class AbstractClass {
	public var name: String;
	public function new() {}
}

class Concrete1 extends AbstractClass {
	public var name1: String;
	public function new() {
		super();
	}
}

class Concrete2 extends AbstractClass {
	public var name2: String;
	public function new() {
		super();
	}
}

@:rtti class HasArrayOfDynamic {
	public var arrayOfDynamic: Array<Dynamic>;
	public function new() {
		arrayOfDynamic = new Array<Dynamic>();
	}
}

@:rtti class HasFunction {
	public var fn: Dynamic->String;
	public function new() {		
	}
}

@:rtti class HasOptionalFunction {
	@:optional public var fn: Dynamic->String;
	public function new() {		
	}
}

class AbstractClassHandler implements TypeHandler {

	var _serializer: Serializer;

	public function new(serializer: Serializer) {
		_serializer = serializer;
	}

	public function read(fromJson: Dynamic, reader: JsonReader<Dynamic>, ?instance: Dynamic): Dynamic {
		var handler: TypeHandler;
	  	if ( Reflect.hasField(fromJson, "name1" ) ) {
			handler = _serializer.getHandlerViaClass(Concrete1);
		} else {
			handler = _serializer.getHandlerViaClass(Concrete2);
		}
		return handler.read(fromJson, reader, instance);
	}

	public function write(value: Dynamic, writer: JsonWriter): Dynamic {
		var handler = _serializer.getHandlerViaClass(Type.getClass(value));
		return handler.write(value, writer);
	}

}

@:rtti class HasAbstractClass {
	var ac: AbstractClass;
	public function new() {}
}


@:rtti class SerializeMe {

	@:transient public var aTransientField: String;
	@:optional public var anOptionalField: String;
	public var bool1: Bool;
	public var int1: Int;
	public var float1: Float;
	public var string1: String;
	public var subClass1: Subclass;
	public var enum1: Enum1;
	public var lotsOfStrings: Array<String>;
	public var arrayInArrayInArrayOfStrings: Array<Array<Array<String>>>;
	public var lotsOfSubclasses: Array<Subclass>;

	public function new() {
		subClass1 = new Subclass();
		lotsOfStrings = new Array<String>();
		lotsOfSubclasses = new Array<Subclass>();
		lotsOfSubclasses.push(new Subclass());
	}

}

class ArrayOfArrays extends AbstractClass {
	public var theArrayOfArrays: Array<Array<Int>>;
	public function new() {
		super();
		theArrayOfArrays = new Array();
	}
}

@:rtti class Dynamite {
	public var dynamite: Dynamic;
	public function new() {}
}

typedef MyTypeDef = {
	var a: String;
	var b: Int;
}

@:rtti class HasTypeDef {
	public var mtd: MyTypeDef;
	public function new() {}
}


@:rtti class BaseClass {
	public var name: String;	
}

class ConcreteClass extends BaseClass {
	public var title: String;	
	public function new() {}
}

@:rtti class SerializationTest {

	function new() {}

	@test
	function arrayOfDynamicTest(): Void {
 		var serializer = new Serializer();
 		{
			var json = Json.parse("{ \"arrayOfDynamic\": [{\"name\": \"name\", \"name1\": \"name1\"}] }");
			var reader = serializer.fromJson(json, HasArrayOfDynamic);
			Assert.areEqual(reader.instance.arrayOfDynamic, json.arrayOfDynamic);
		}
 		{
			var json = { 
				arrayOfDynamic: {
					name: "name", 
					name1: "name1"
				} 
			};
			try {
				var reader = serializer.fromJson(json, HasArrayOfDynamic);
				Assert.fail("we should have blown up since we passed in an object and not an array");
			} catch (e: Dynamic) {
				trace("we blew up like we should have");
				// we should blow up since we passed in an object and not an array
			}
		}
	}

	@test
	public function abstractTest(): Void {
		var serializer = new Serializer();
		serializer.addHandler(AbstractClass, new AbstractClassHandler(serializer));

		{
			var json = {
				ac: {name: "name", name1: "name1"}
			}
			var reader = serializer.fromJson(json, HasAbstractClass);

			var str = Json.stringify(serializer.toJson(reader.instance));
			var expected = '{"ac":{"name":"name","name1":"name1"}}';

			Assert.areEqual(str, expected);
		}
		{
			var json = {
				ac: {name: "name", name2: "name2"}
			}
			var reader = serializer.fromJson(json, HasAbstractClass);

			var str = Json.stringify(serializer.toJson(reader.instance));
			var expected = '{"ac":{"name":"name","name2":"name2"}}';

			Assert.areEqual(str, expected);
		}

	}

	@test
	public function typeDefTest(): Void {
		var serializer = new Serializer();
		var json = {
			mtd: {a: "world", b: 32}
		}
		var reader = serializer.fromJson(json, HasTypeDef);

		var str = Json.stringify(serializer.toJson(reader.instance));
		var expected = '{"mtd":{"a":"world","b":32}}';

		Assert.areEqual(str, expected);

	}

	@test
	public function dynamiteTest(): Void {
		var serializer = new Serializer();
		var json = {
			dynamite: {hello: "world"}
		}
		var reader = serializer.fromJson(json, Dynamite);

		var str = Json.stringify(serializer.toJson(reader.instance));
		var expected = '{"dynamite":{"hello":"world"}}';

		Assert.areEqual(str, expected);

	}

	@test
	public function simpleSerialization(): Void {
		var serializer = new Serializer();
		var json = {
			bool1: true, 
			int1: 1, 
			float1: 1.2, 
			string1: "abc", 
			subClass1: { f1: 1234 },
			enum1: "ev1",
			lotsOfStrings: ["a","b","c"],
			lotsOfSubclasses: [ {f1: 4567} ],
			arrayInArrayInArrayOfStrings: [[["a","b","c"],["d","e","f"]]]
		}
		var reader = serializer.fromJson(json, SerializeMe);

		var str = Json.stringify(serializer.toJson(reader.instance));
		var expected = '{"bool1":true,"int1":1,"float1":1.2,"string1":"abc","subClass1":{"f1":1234},"enum1":"ev1","lotsOfStrings":["a","b","c"],"arrayInArrayInArrayOfStrings":[[["a","b","c"],["d","e","f"]]],"lotsOfSubclasses":[{"f1":4567}]}';

		Assert.areEqual(str, expected);
	}

	@test
	public function liftLoneValueIntoSingleValueArray(): Void {
		var serializer = new Serializer();
		var json = {
			bool1: true, 
			int1: 1, 
			float1: 1.2, 
			string1: "abc", 
			subClass1: { f1: 1234 },
			enum1: "ev1",
			lotsOfStrings: "single Value",
			lotsOfSubclasses: {f1: 4567},
			arrayInArrayInArrayOfStrings: [[["a","b","c"],["d","e","f"]]]
		}
		var reader = serializer.fromJson(json, SerializeMe);

		var str = Json.stringify(serializer.toJson(reader.instance));
		var expected = '{"bool1":true,"int1":1,"float1":1.2,"string1":"abc","subClass1":{"f1":1234},"enum1":"ev1","lotsOfStrings":["single Value"],"arrayInArrayInArrayOfStrings":[[["a","b","c"],["d","e","f"]]],"lotsOfSubclasses":[{"f1":4567}]}';

		Assert.areEqual(str, expected);
	}


	@test
	public function extraFieldInJsonFailure(): Void {
		var serializer = new Serializer();
		var json = {
			bool1: true, 
			int1: 1, 			
			float1: 1.2, 
			string1: "abc", 
			subClass1: { f1: 1234 },
			enum1: "ev1",
			lotsOfStrings: ["a","b","c"],
			lotsOfSubclasses: [ {f1: 4567, bigFatExtraUglyField: 123} ],
			arrayInArrayInArrayOfStrings: [[["a","b","c"],["d","e","f"]]]
		}
		try {
			serializer.fromJson(json, SerializeMe);
			Assert.fail("we should have blown up with a field not found exception");
		} catch (e: JsonException ) {
			trace("extraFieldInJsonFailure() we blew up like we should have -- " + e.messageList());
			Assert.isTrue(true);
		}
	}	

	@test
	public function fieldMissingFromJson(): Void {
		var serializer = new Serializer();
		var json = {
			// bool1: true, 
			int1: 1, 			
			float1: 1.2, 
			string1: "abc", 
			subClass1: { f1: 1234 },
			enum1: "ev1",
			lotsOfStrings: ["a","b","c"],
			lotsOfSubclasses: [ {f1: 4567, bigFatExtraUglyField: 123} ],
			arrayInArrayInArrayOfStrings: [[["a","b","c"],["d","e","f"]]]
		}
		try {
			serializer.fromJson(json, SerializeMe);
			Assert.fail("we should have blown up with a field not found exception");
		} catch (e: JsonException ) {
			trace("fieldMissingFromJson() we blew up like we should have -- " + e.messageList());
			Assert.isTrue(true);
		}
	}

	@test
	public function transientFieldsAreNotRequired(): Void {
		var serializer = new Serializer();
		var json = {
			bool1: true, 
			int1: 1, 			
			float1: 1.2, 
			string1: "abc", 
			subClass1: { f1: 1234 },
			enum1: "ev1",
			lotsOfStrings: ["a","b","c"],
			lotsOfSubclasses: [ {f1: 4567, bigFatExtraUglyField: 123} ],
			arrayInArrayInArrayOfStrings: [[["a","b","c"],["d","e","f"]]]
		}
		try {
			serializer.fromJson(json, SerializeMe);
			Assert.fail("we should have blown up with a field not found exception");
		} catch (e: JsonException ) {
			trace("fieldMissingFromJson() we blew up like we should have -- " + e.messageList());
			Assert.isTrue(true);
		}
	}	


	@test
	public function serializingFunctionText(): Void {
		var serializer = new Serializer();
		{ // required function has syntax errors we should blow up
			var json0 = {
				fn: "asdf asdf saf as fsaf sadfsdafa"
			};
			try {
				serializer.fromJson(json0, HasFunction);
				Assert.fail("we should have blown up");
			} catch ( e: JsonException ) {
				trace("YAY we blew up like we should have");
			}
		}
		{ // required function has valid def
			var json1 = {
				fn: "return arg;"
			};
			var hf = serializer.fromJson(json1, HasFunction).instance;
			Assert.isTrue( hf.fn != null );
		}
		{ // required function is null we should blow up
			var json1 = {
				fn: null
			};
			try {
				serializer.fromJson(json1, HasFunction);
				Assert.fail("we should have blown up");
			} catch ( e: JsonException ) {
				trace("YAY we blew up like we should have");
			}
		}
		{ // optional function is null we should allow it
			var json1 = {
				fn: ""
			};
			var hf = serializer.fromJson(json1, HasOptionalFunction).instance;
			Assert.isTrue( hf.fn == null );
		}
		{ // optional function is null we should allow it
			var json1 = {
				fn: null
			};
			var hf = serializer.fromJson(json1, HasOptionalFunction).instance;
			Assert.isTrue( hf.fn == null );
		}
		{
			var json1 = {
				fn: ""
			};
			var hf = serializer.fromJson(json1, HasOptionalFunction).instance;
			Assert.isTrue( hf.fn == null );
		}
	}


	@test
	public function serializingBaseAndConcrete(): Void {
		
		var serializer = new Serializer();

		var cc0 = new ConcreteClass();

		cc0.name = "nn";
		cc0.title = "tt";

		var json0 = serializer.toJson(cc0);
		var jsonStr0 = Json.stringify(json0);

		var cc1: ConcreteClass = serializer.fromJson(json0, ConcreteClass).instance;
		var json1 = serializer.toJson(cc1);
		var jsonStr1 = Json.stringify(json1);

		Assert.areEqual(jsonStr0, jsonStr1);

	}



	@test
	public function arrayOfArray(): Void {
		
		var serializer = new Serializer();

		var a0 = new ArrayOfArrays();

		a0.theArrayOfArrays[0] = [0,1,2];

		var json0 = serializer.toJson(a0);
		var jsonStr0 = Json.stringify(json0);

		var a1 = serializer.fromJson(json0, ArrayOfArrays).instance;
		var json1 = serializer.toJson(a1);
		var jsonStr1 = Json.stringify(json1);

		Assert.areEqual(jsonStr0, jsonStr1);

	}
}

