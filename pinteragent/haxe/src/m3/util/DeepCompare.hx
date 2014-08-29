package m3.util;

import Type;
import m3.exception.Exception;

using Lambda;
using m3.util.LambdaX;
using m3.serialization.TypeTools;
	
class DeepCompare {

	static var _typeComparators = [
		new ArrayComparator(),
		new ClassComparator(String),
		new BasicComparator(TBool),
		new ObjectComparator("TClass"),
		new EnumComparator(),
		new BasicComparator(TFloat),
		new BasicComparator(TFunction),
		new BasicComparator(TInt),
		new BasicComparator(TNull),
		new ObjectComparator("TObject"),
		new ObjectComparator("TUnknown"),
	];

	/**
	 * Throws CompareFailure on the first difference encountered.
	 * returns successfully if left and right are the same
	 */
	public static function assert(left: Dynamic, right: Dynamic) {
		assertImpl(new VariablePath(), left, right);
	}

	public static function assertImpl(path: VariablePath, left: Dynamic, right: Dynamic) {
		try {
			var leftType = Type.typeof(left);
			var rightType = Type.typeof(right);

			var lc = leftType.getClassname();
			var rc = rightType.getClassname();

			if ( lc != rc ) throw new Exception("types differ " + lc + " != " + rc);

			var comparator = findComparator(leftType);
			var equiv = comparator.equivalent(path, left, right);
			if ( !equiv ) {
				throw new Exception("values differ " + left + " != " + right);
			}
		} catch ( e: CompareFailure ) {
			throw e;
		} catch ( e: Exception ) {
			throw new CompareFailure(path, e.message, e);
		}
	}

	static function findComparator(type: ValueType): TypeComparator {
		for( i in 0..._typeComparators.length-1 ) {
			if ( _typeComparators[i].canCompare(type) ) {
				return _typeComparators[i];
			}
		}
		throw new Exception("unable to find comparator for " + type);
	}

}

class BasicComparator implements TypeComparator {
	var valueType: ValueType;
	public function new(valueType: ValueType) {
		this.valueType = valueType;
	}
	public function canCompare(vt: ValueType) {
		return valueType == vt;
	}
	public function equivalent(path: VariablePath, left: Dynamic, right: Dynamic): Bool {
		return left == right;
	}
}

class ArrayComparator implements TypeComparator {
	public function new() {
	}
	public function canCompare(vt: ValueType) {
		return "Array" == vt.getClassname();
	}

	public function equivalent(path: VariablePath, left: Dynamic, right: Dynamic): Bool {
		var l: Array<Dynamic> = left;
		var r: Array<Dynamic> = right;

		if ( l.length != r.length ) {
			throw new Exception("array length mismatch " + l.length + " != " + r.length);
		}

		for ( i in 0...l.length ) {
			path.arrayAccess(i, function() {
			 	DeepCompare.assertImpl(path, l[i], r[i]);
			});
		}

		return true;

	}
}

class ClassComparator implements TypeComparator {
	var classname: String;
	public function new(clazz: Class<Dynamic>) {
		classname = clazz.classname();
	}
	public function canCompare(vt: ValueType) {
		return classname == vt.getClassname();
	}
	public function equivalent(path: VariablePath, left: Dynamic, right: Dynamic): Bool {
		return left == right;
	}
}

class EnumComparator implements TypeComparator {
	public function new() {
	}
	public function canCompare(vt: ValueType) {
		return vt.getName() == "TEnum";
	}
	public function equivalent(path: VariablePath, left: Dynamic, right: Dynamic): Bool {
		return Type.enumEq(left, right);
	}
}

class ObjectComparator implements TypeComparator {

	var valueTypeName: String;

	public function new(valueTypeName: String) {
		this.valueTypeName = valueTypeName;
	}

	public function canCompare(vt: ValueType) {
		return vt.getName() == valueTypeName;
	}

	public function equivalent(path: VariablePath, left: Dynamic, right: Dynamic): Bool {

		var fields = compareFieldNames( Reflect.fields(left), Reflect.fields(right) );

		fields.iter(function(field) {
			
			var l = Reflect.field(left, field);
			var r = Reflect.field(right, field);

			path.fieldAccess(field, function() {
				try {
				 	DeepCompare.assertImpl(path, l, r);
				} catch ( e: CompareFailure ) {
					throw e;
				} catch ( e: Exception ) {
					throw new CompareFailure(path, e.message, e);
				}
			});

		});

		return true;
	}

	public static function compareFieldNames(left: Array<String>, right: Array<String>): Array<String> {
		function sorter(l: String, r: String): Int {
			if ( l == r ) return 0;
			else if ( l < r ) return -1;
			else return 1;
		}
		left.sort(sorter);
		right.sort(sorter);

		if ( left.length != right.length ) {
			throw new Exception("different field names -- " + left + " -- " + right);
		}

		left.iteri(function(l,i) {
			var r = right[i];
			if ( l != r ) {
				throw new Exception("different field names -- " + left + " -- " + right);				
			}
		});

		return left;

	}

}

interface TypeComparator {
	function canCompare(type: ValueType): Bool;
	function equivalent(path: VariablePath, left: Dynamic, right: Dynamic): Bool;
}


class VariablePath {

	var _paths: Array<String>;

	public function new() {
		_paths = ["root"];
	}

	public function arrayAccess<T>(index: Int, fn: Void->T) {
		return access("[" + index + "]", fn);
	}

	public function fieldAccess<T>(name: String, fn: Void->T) {
		return access("." + name, fn);	
	}

	function access<T>(name: String, fn: Void->T) {
		if ( _paths.length > 99 ) throw new Exception("stack blowup -- " + get());
		_paths.push(name);
		try {
			var result = fn();
			_paths.pop();
			return result;
		} catch ( e: Dynamic ) {
			_paths.pop();
			throw e;
		}
	}

	public function get(): String {
		return _paths.join("");
	}

	public function clone(): VariablePath {
		var c = new VariablePath();
		this._paths.iter(function(i) {
			c._paths.push(i);
		});
		return c;
	}


}

class CompareFailure extends Exception {
	public var path: VariablePath;
	public function new(path: VariablePath, ?message: String, ?cause: Exception) {
		super(path.get() + " -- " + message, cause);
		this.path = path.clone();
	}
}

