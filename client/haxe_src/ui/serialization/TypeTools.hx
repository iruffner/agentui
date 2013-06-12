package ui.serialization;


import Type;
import haxe.rtti.CType;
import ui.exception.Exception;

using Lambda;

class TypeTools {
	public static function classname<T>(clazz: Class<T>) {
		try {
			return Type.getClassName(clazz);
		} catch (err:Dynamic) {
			ui.AgentUi.LOGGER.error(err);
			throw new Exception(Std.string(err));
		}
	}
	public static function clazz(d: Dynamic) {
		var c = Type.getClass(d);
		if ( c == null ) {
			trace("tried to get class for type -- " + Type.typeof(d) + " -- " + d);
		}
		return c;
	}
}

class CTypeTools {

	public static function classname(type: CType): String {
		return switch ( type ) {
			case CClass(path, parms), CEnum(path, parms): path;
			case CDynamic(_): "Dynamic";
			default: throw new Exception("don't know how to handle " + type);
		}				
	}

	public static function typename(type: CType): String {
		return switch ( type ) {
			case CClass(path, parms), CEnum(path, parms), CAbstract(path, parms): makeTypename(path, parms);
			case CDynamic(_): "Dynamic";
			case CFunction(_,_): "Function";
			default: throw new Exception("don't know how to handle " + type);
		}		
	}

	static function makeTypename(path: String, parms: List<CType>): String {
		return
		  	if ( parms.isEmpty() ) path;
			else path + "<" + parms.map( function(ct) { return typename(ct); } ).array().join(",") + ">";
	}

}

class ValueTypeTools {

	public static function getClassname(type: ValueType) {
		return switch ( type ) {
			case TUnknown: "TUnknown";
			case TObject: "TObject";
			case TNull: "TNull";
			case TInt: "Int";
			case TFunction: "TFunction";
			case TFloat: "Float";
			case TBool: "Bool";
			case TEnum(e): Type.getEnumName(e);
			case TClass(c): Type.getClassName(c);
			// default: throw new Exception("don't know how to handle " + type);
		}				
	}

	public static function getName(type: ValueType) {
		return switch ( type ) {
			case TUnknown: "TUnknown";
			case TObject: "TObject";
			case TNull: "TNull";
			case TInt: "Int";
			case TFunction: "TFunction";
			case TFloat: "Float";
			case TBool: "Bool";
			case TEnum(e): "TEnum";
			case TClass(c): "TClass";
			// default: throw new Exception("don't know how to handle " + type);
		}				
	}

}
