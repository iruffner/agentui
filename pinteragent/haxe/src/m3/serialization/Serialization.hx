package m3.serialization;

import m3.exception.Exception;
import m3.observable.OSet;

import haxe.Json;
// import haxe.rtti.Infos;
import Type;
import haxe.rtti.CType;
import haxe.CallStack;

using m3.serialization.TypeTools;
using m3.helper.ArrayHelper;
using Lambda;

/*

	TODO 

			-- short term --
		@:abstract on class throw nice warning

			-- quite possibly someday --
		typedef's
		type hints support
		coerce int to float
		properties support
		use json type enum for handlers

*/




class Serializer {
	
	var _handlersMap: Map<String,TypeHandler>;
	var _defaultToStrict: Bool;

	public function new(defaultToStrict: Bool = true) {
		_defaultToStrict = defaultToStrict;
		_handlersMap = new Map();
		addHandlerViaName("Array<Dynamic>", new DynamicArrayHandler());
	}

	public function addHandler<T>(clazz: Class<T>, handler: TypeHandler) {
		var typename = Type.getClassName(clazz);
		_handlersMap.set(typename, handler);
	}

	public function addHandlerViaName<T>(typename: String, handler: TypeHandler) {
		_handlersMap.set(typename, handler);
	}

	public function load<T>(fromJson: Dynamic, instance: T, ?strict: Bool): JsonReader<T> {
		if(strict == null) strict = _defaultToStrict;
		var reader: JsonReader<T> = cast createReader(strict);
		reader.read(fromJson, Type.getClass(instance), instance);
		return reader;
	}

	public function fromJsonX<T>(fromJson: Dynamic, clazz: Class<T>, ?strict: Bool): T {
		if(strict == null) strict = _defaultToStrict;
		var reader: JsonReader<T> = cast createReader(strict);
		reader.read(fromJson, clazz);
		return reader.instance;
	}

	public function fromJson<T>(fromJson: Dynamic, clazz: Class<T>, ?strict: Bool): JsonReader<T> {
		if(strict == null) strict = _defaultToStrict;
		var reader: JsonReader<T> = cast createReader(strict);
		reader.read(fromJson, clazz);
		return reader;
	}

	public function toJson(value: Dynamic) : Dynamic {
		return createWriter().write(value);
	}

	public function toJsonString(value: Dynamic) : String {
		return haxe.Json.stringify(toJson(value));
	}

	function createReader(strict: Bool = true) { return new JsonReader<Dynamic>(this, strict); }

	function createWriter() { return new JsonWriter(this); }

	public function getHandlerViaClass<T>(clazz: Class<T>) {
		var typename: String = clazz.classname();
		return getHandler(CClass(typename, new List()));
	}

	public function getHandler(type: CType) {
		var typename = type.typename();
		var handler = _handlersMap.get(typename);
		if ( handler == null ) {
			handler = createHandler(type);
			_handlersMap.set(typename, handler);
		}
		return handler;
	}

	function createHandler(type: CType): TypeHandler {
		return switch ( type ) {
			case CEnum(path, parms): 
				if ( path == "Bool" ) new BoolHandler();
				else new EnumHandler(path, parms);
			case CClass(path, parms), CAbstract(path, parms):
				switch(path) {
	  				case "Bool": new BoolHandler();
					case "Float": new FloatHandler();
					case "String": new StringHandler();
					case "Int": new IntHandler();
					case "Array": new ArrayHandler(parms, this);
					case "Date": new DateHandler();
					// case "ui.observable.ObservableSet": new ObservableSetHandler(parms, this);
					default:
						new ClassHandler(Type.resolveClass(type.classname()), type.typename(), this);
				}
			case CDynamic(_):
				new DynamicHandler();
			case CFunction(args, ret):
				new FunctionHandler();
			default: throw new JsonException("don't know how to handle " + type);
		}
	}

}


interface TypeHandler {
	function read(fromJson: Dynamic, reader: JsonReader<Dynamic>, ?instance: Dynamic): Dynamic;
	function write(value: Dynamic, writer: JsonWriter): Dynamic;
}

class ArrayHandler implements TypeHandler {

	var _parms: List<CType>;
	var _serializer: Serializer;
	var _elementHandler: TypeHandler;

	public function new(parms: List<CType>, serializer: Serializer) {
		_parms = parms;
		_serializer = serializer;
		_elementHandler = _serializer.getHandler(_parms.first());
	}

	public function read(fromJson: Dynamic, reader: JsonReader<Dynamic>, ?instance: Dynamic): Dynamic {
		if ( instance == null ) {
			instance = [];
		}
		if ( fromJson != null ) {
			var arr: Array<Dynamic>;

			if (Std.is(fromJson, Array)) {
				arr = cast fromJson;
			} else {
				arr = [fromJson];
			}

			var i = 0;
			// return arr.map(function(e) { return _elementHandler.read(e, reader); });
			for ( e in arr ) {
				var context = "[" + i + "]";
				reader.stack.push(context);
				try {
					instance.push(_elementHandler.read(e, reader));
	 			} catch ( msg: String ) {
	 				reader.error("error reading " + context + "\n" + msg);
	 			} catch ( e: JsonException ) {
	 				reader.error("error reading " + context, e);
	 			}
				reader.stack.pop();
				i += 1;
			}
		}
		return instance;
	}

	public function write(value: Dynamic, writer: JsonWriter): Dynamic {
		var arr: Array<Dynamic> = cast value;
		var result = [];
		for ( e in arr ) {
			result.push(_elementHandler.write(e, writer));
		}
		return result;
	}

}

/*class ObservableSetHandler implements TypeHandler {

	var _parms: List<CType>;
	var _serializer: Serializer;
	var _elementHandler: TypeHandler;

    public function new(parms: List<CType>, serializer: Serializer) {
    	_parms = parms;
		_serializer = serializer;
		_elementHandler = _serializer.getHandler(_parms.first());
    }

    public function read(fromJson: Dynamic, reader: JsonReader<Dynamic>, ?instance: Dynamic): Dynamic {
    	if ( instance == null ) {
			instance = new ObservableSet<Dynamic>();
		}
		if ( fromJson != null ) {
			var arr: Array<Dynamic> = cast fromJson;
			var i = 0;
			// return arr.map(function(e) { return _elementHandler.read(e, reader); });
			for ( e in arr ) {
				var context = "[" + i + "]";
				reader.stack.push(context);
				try {
					instance.push(_elementHandler.read(e, reader));
	 			} catch ( msg: String ) {
	 				reader.error("error reading " + context + "\n" + msg);
	 			} catch ( e: JsonException ) {
	 				reader.error("error reading " + context, e);
	 			}
				reader.stack.pop();
				i += 1;
			}
		}
		return instance;
    }

    public function write(value: Dynamic, writer: JsonWriter): Dynamic {
        // var handler = _serializer.getHandlerViaClass(Type.getClass(value));
        // return handler.write(value, writer);
        return null;
    }
}*/

class EnumHandler implements TypeHandler {
	var _enumName: String;
	var _enum: Enum<Dynamic>;
	var _enumValues: Array<Dynamic>;
	var _parms: List<CType>;
	public function new(enumName: String, parms: List<CType>) {
		_enumName = enumName;
		_parms = parms;
		_enum = Type.resolveEnum(_enumName);
		if ( _enum == null ) throw new JsonException("no enum named " + _enumName + " found");
		_enumValues = Type.allEnums(_enum);
	}
	public function read(fromJson: Dynamic, reader: JsonReader<Dynamic>, ?instance: Dynamic): Dynamic {
		if ( instance != null ) reader.error("enum type can not populate a passed in instance");
		var type = Type.getClass(fromJson);
		var result = switch(type) {
			case String: Type.createEnum(_enum, fromJson);
			case Int: Type.createEnumIndex(_enum, fromJson);
			case _: reader.error(fromJson + " is a(n) " + type + " not a String"); null;
		}
		return result;
	}
	public function write(value: Dynamic, writer: JsonWriter) {
		return Std.string(value);
	}
}

class ValueTypeHandler implements TypeHandler {
	var _valueType: ValueType;
	public function new(valueType: ValueType) {
		_valueType = valueType;
	}
	public function read(fromJson: Dynamic, reader: JsonReader<Dynamic>, ?instance: Dynamic): Dynamic {
		if ( instance != null ) reader.error("value type can not populate a passed in instance");
		var type = Type.typeof(fromJson);
		if ( type == _valueType ) {
			return fromJson;
		} else {
			reader.error(fromJson + " is a(n) " + type + " not an " + _valueType);
			return null;
		}
	}
	public function write(value: Dynamic, writer: JsonWriter) {
		return value;
	}
}

class DynamicArrayHandler implements TypeHandler {
	public function new() {
	}
	public function read(fromJson: Dynamic, reader: JsonReader<Dynamic>, ?instance: Dynamic): Dynamic {
		var classname = ValueTypeTools.getClassname(Type.typeof(fromJson));
		if ( classname == "Array" ) {
			return fromJson;
		} else {
			return reader.error("expected an array got a " + classname);
		}
	}
	public function write(value: Dynamic, writer: JsonWriter) {
		return value;
	}
}

class DynamicHandler implements TypeHandler {
	public function new() {
	}
	public function read(fromJson: Dynamic, reader: JsonReader<Dynamic>, ?instance: Dynamic): Dynamic {
		return fromJson;
	}
	public function write(value: Dynamic, writer: JsonWriter) {
		return value;
	}
}
class IntHandler extends ValueTypeHandler {
	public function new() {
		super(TInt);
	}
}

class FloatHandler extends ValueTypeHandler {
	public function new() {
		super(TFloat);
	}

	override public function read(fromJson: Dynamic, reader: JsonReader<Dynamic>, ?instance: Dynamic): Dynamic {
		if ( instance != null ) reader.error("value type can not populate a passed in instance");
		var type = Type.typeof(fromJson);
		if ( type == TFloat || type == TInt ) {
			return fromJson;
		} else {
			reader.error(fromJson + " is a(n) " + type + " not an " + _valueType);
			return null;
		}
	}
}

class BoolHandler extends ValueTypeHandler {
	public function new() {
		super(TBool);
	}
}

class StringHandler implements TypeHandler {
	public function new() {
	}
	public function read(fromJson: Dynamic, reader: JsonReader<Dynamic>, ?instance: Dynamic): Dynamic {
		if ( instance != null ) reader.error("StringHandler can not populate a passed in String, aka String's are immutable");
		var type = Type.getClass(fromJson);
		if ( type == String || fromJson == null ) {
			return fromJson;
		} else {
			reader.error(fromJson + " is a(n) " + type + " not a String");
			return null;
		}
	}
	public function write(value: Dynamic, writer: JsonWriter) {
		return value;
	}
}

class DateHandler implements TypeHandler {

    public function new() {
    }

    public function read(fromJson: Dynamic, reader: JsonReader<Dynamic>, ?instance: Dynamic): Dynamic {
        // Lop off the milliseconds, if it exists
        fromJson = fromJson.split(".")[0];
        return Date.fromString(fromJson);
    }

    public function write(value: Dynamic, writer: JsonWriter): Dynamic {
        return cast(value, Date).toString();
    }
}

class FunctionHandler implements TypeHandler {
	public function new() {
	}
	public function read(fromJson: Dynamic, reader: JsonReader<Dynamic>, ?instance: Dynamic): Dynamic {
		if ( instance != null ) reader.error("FunctionHandler can not populate a passed in String, aka String's are immutable");
		var type = Type.getClass(fromJson);
		if ( type == String ) {
			if(Std.string(fromJson).length > 0) {
				try {
					return untyped __js__("new Function('arg', fromJson)");
				} catch (e: Dynamic) {
					reader.error("unable to parse into a function -- " + fromJson + " -- " + e);
					return null;			
				}
			} else {
				return null;
			}
		} else {
			reader.error(fromJson + " is a(n) " + type + " not a String");
			return null;
		}
	}
	public function write(value: Dynamic, writer: JsonWriter) {
		return value;
	}	
}

class Field {
	public var required = true;
	public var typename: String;
	public var type: CType;
	public var handler: TypeHandler;
	public var name: String;
	public function new() {		
	}
}


class ClassHandler<T> implements TypeHandler {

	// var _type: CType;
	var _typename: String;
	var _clazz: Class<T>;
    var _classDef: Classdef;
    var _fields: Array<Field>;
    var _serializer: Serializer;
    var _fieldsByName: Map<String,Field>;

	public function new(clazz: Class<T>, typename: String, serializer: Serializer) {
		_clazz = clazz;
		_typename = typename;
		_serializer = serializer;

		if ( _clazz == null ) throw new JsonException("clazz is null");

		var rtti: String = untyped _clazz.__rtti;
		if ( rtti == null ) {
			var msg = "no rtti found for " + this._typename;
			trace(msg);
			throw new JsonException(msg);
		}

		var x = Xml.parse(rtti).firstElement();
        var typeTree: TypeTree = new haxe.rtti.XmlParser().processElement(x);
        _classDef = switch ( typeTree ) {
        	case TClassdecl(c): c;
        	default: throw new JsonException("expected a class got " + typeTree);
        }

        _fields = new Array();

 		var superClass = Type.getSuperClass(clazz);
 		if ( superClass != null ) {
	 		var superClassHandler = new ClassHandler<Dynamic>(superClass, Type.getClassName(superClass), serializer);
	 		for ( f in superClassHandler._fields ) {
	 			_fields.push(f);
	 		}
	 	}

 		for ( f in _classDef.fields ) {
 			var field = new Field();
 			var transient = false;
 			var fieldXml = x.elementsNamed(f.name).next();
 			var set = fieldXml.get("set");
 			for( meta in fieldXml.elementsNamed("meta") ) {
 				for ( m in meta.elementsNamed("m") ) {
 					switch( m.get("n") ) {
 						case ":optional", "optional": field.required = false;
 						case ":transient", "transient": transient = true;
 					}
 				}
 			}
 			if ( !transient && set != "method") {
	 			switch (f.type) {
	 				case CClass(_, _), CEnum(_, _), CDynamic(_), CFunction(_,_), CAbstract(_,_): 
			 			field.name = f.name;
			 			field.type = f.type;
			 			field.typename = f.type.typename();
			 			field.handler = _serializer.getHandler(field.type);
	 					_fields.push(field);
	 				case CTypedef(_,_):
			 			field.name = f.name;
			 			field.type = CDynamic();
			 			field.typename = field.type.typename();
			 			field.handler = _serializer.getHandler(field.type);
	 					_fields.push(field);
	 				default:
	 			}
	 		}
 		}

 		_fieldsByName = new Map();
 		for ( f in _fields ) {
 			_fieldsByName.set(f.name, f);
 		}

	}

	function createInstance() {
		return Type.createInstance(_clazz, []);
	}

	public function read(fromJson: Dynamic, reader: JsonReader<Dynamic>, ?instance: Dynamic): Dynamic {
		if ( instance == null ) {
			instance = createInstance();
		}

		var jsonFieldNames: Array<String> = Reflect.fields(fromJson);
		// check that all the fields in the json have field in the class
		for ( jsonFieldName in jsonFieldNames ) {
			if ( !_fieldsByName.exists(jsonFieldName) ) {
				reader.error("json has field named " + jsonFieldName + " instance of " + _typename + " does not");
			}
		}

		// check that all the required fields in the class have a json field
		for ( f in _fields ) {
			if ( f.required ) {
				var found = false;
				if(jsonFieldNames.contains(f.name)) 
					found = true;
				// for ( jsonFieldName in jsonFieldNames ) {
				// 	if ( f.name == jsonFieldName ) {
				// 		found = true;
				// 		break;
				// 	}
				// }
				if ( !found ) {
					reader.error("instance of " + _typename + " has required field named " + f.name + " json does not does not "  + Json.stringify(fromJson) );
				}
			}
		}

		// okay everything is good to go do the deserialization now
		for ( fieldName in jsonFieldNames ) {
			var f = _fieldsByName.get(fieldName);
   		 	try {
		 		if ( reader.stack.empty() ) {
		 			reader.stack.push(fieldName);
		 		} else {
		 			reader.stack.push("." + fieldName);
		 		}
			 	var rawValue = Reflect.field(fromJson, f.name);
			 	if ( f.required || rawValue != null ) {
   			 		var value = f.handler.read(rawValue, reader);
 					Reflect.setField(instance, f.name, value);
 				}
 			} catch ( msg: String ) {
 				reader.error("error reading field " + fieldName + "\n" + msg);
 			} catch ( e: Exception ) {
 				reader.error("error reading field " + fieldName, e);
 			} catch ( e: Dynamic ) {
 				reader.error("error reading field " + fieldName, e);
 			}
			reader.stack.pop();
		}
		if(instance.readResolve != null && Reflect.isFunction(instance.readResolve)) {
			instance.readResolve();
		}
		return instance;
	}

	public function write(instanceValue: Dynamic, writer: JsonWriter) {
		var instance:Dynamic = {}
		if(instanceValue.writeResolve != null && Reflect.isFunction(instanceValue.writeResolve)) {
			instanceValue.writeResolve();
		}
		for ( f in _fields ) {
   		 	try {
			 	var fieldValue = Reflect.field(instanceValue, f.name);
			 	if ( fieldValue == null && !f.required ) {
			 		// do nothing
			 	} else {
   			 		var jsonValue = f.handler.write(fieldValue, writer);
 					Reflect.setField(instance, f.name, jsonValue);
 				}
 			} catch ( msg: String ) {
 				throw new JsonException("error writing field " + f.name + "\n" + msg);
 			} catch ( e: Exception ) {
 				throw new JsonException("error writing field " + f.name, e);
 			} catch ( e: Dynamic ) {
 				throw new JsonException("error writing field " + f.name, e);
 			}
 		}
		return instance;
	}

}

class JsonException extends Exception {
	
	public function new(msg: String, ?cause: Exception) {
		super(msg, cause);
	}

}

class JsonReader<T> {

	var _serializer: Serializer;
	public var stack: Array<String>;
	public var warnings: Array<String>;
	public var instance: T;
	public var strict: Bool;

	public function new(serializer: Serializer, strict: Bool) {
		_serializer = serializer;
		stack = new Array();
		warnings = new Array();
		this.strict = strict;
	}

 	public function read<T>(fromJson: Dynamic, clazz: Class<T>, ?instance: Dynamic) {
 		var handler = _serializer.getHandlerViaClass(clazz);
 		this.instance = handler.read(fromJson, this, instance);
 	}

 	public function error(msg: String, ?cause: Exception): Dynamic {
 		if ( strict ) {
 			throw new JsonException(msg, cause);
 		} else {
 			return null;
 		}
 	}

}


class JsonWriter {

	var _serializer: Serializer;

	public function new(serializer: Serializer) {
		_serializer = serializer;
	}

 	public function write(value: Dynamic) : Dynamic {
 		var clazz = value.clazz();
 		var handler = _serializer.getHandlerViaClass(clazz);
 		return handler.write(value, this);
 	}

}