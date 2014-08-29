package m3.helper;

using m3.helper.StringHelper;
using StringTools;

typedef ArrayComparison = {
    var propOrFcn:Dynamic;
    var value:Dynamic;
}

// this is exposed for BI
@:expose
class ArrayHelper {

    private static function __init__(): Void {
        untyped __js__("if(!Array.indexOf){Array.prototype.indexOf = function(obj){for(var i=0; i<this.length; i++){if(this[i]==obj){return i;}}return -1;}}");
    }

    public static function indexOf<T>(array:Array<T>, t:T):Int {
        if(array == null) return -1;
        var index = -1;
        for(i_ in 0...array.length) {
            if(array[i_] == t) {
                index = i_;
                break;
            }
        }
        return index;
    }

    public static function indexOfComplex(array:Array<Dynamic>, value:Dynamic, propOrFcn:Dynamic, ?startingIndex:Int=0):Int {
        if(array == null) return -1;
        var result = -1;
        if(array != null && array.length > 0) {
            for(idx_ in startingIndex...array.length) {
                var comparisonValue;
                if(Std.is(propOrFcn, String)) {
                    comparisonValue = Reflect.field(array[idx_], propOrFcn);
                } else {
                    comparisonValue = propOrFcn(array[idx_]);
                }
                if(value == comparisonValue) {
                    result = idx_;
                    break;
                }
            }
        }
        return result;
    }

    public static function indexOfComplexInSubArray(array:Array<Dynamic>, value:Dynamic, subArrayProp:String, ?startingIndex:Int=0):Int {
        if(array == null) return -1;
        var result = -1;
        for(idx_ in startingIndex...array.length) {
            var subArray = Reflect.field(array[idx_], subArrayProp);
            if(contains(subArray, value)) {
                result = idx_;
                break;
            }
        }
        return result;
    }

    public static function indexOfArrayComparison<T>(array:Array<T>, comparison:Array<ArrayComparison>, ?startingIndex:Int=0):Int {
        var result:Int = -1;
        if(array != null) {
            if(hasValues(comparison)) {
                var base:ArrayComparison = comparison[0];
                var baseIndex = indexOfComplex(array, base.value, base.propOrFcn, startingIndex);
                while(baseIndex > -1 && result < 0) {
                    var candidate:T = array[baseIndex];
                    var breakOut:Bool = false;
                    for(c_ in 1...comparison.length) {
                        var comparisonValue;
                        if(Std.is(comparison[c_].propOrFcn, String)) {
                            comparisonValue = Reflect.field(candidate, comparison[c_].propOrFcn);
                        } else {
                            comparisonValue = comparison[c_].propOrFcn(candidate);
                        }
                        if(comparison[c_].value == comparisonValue) {
                            continue;
                        } else {
                            baseIndex = indexOfComplex(array, base.value, base.propOrFcn, baseIndex+1);
                            breakOut = true;
                            break;
                        }
                    } 
                    if(breakOut) continue;
                    result = baseIndex;  
                }
            }
        }
        
        return result;
    }

    public static function getElementComplex<T>(array:Array<T>, value:Dynamic, propOrFcn:Dynamic, ?startingIndex:Int=0):T {
        if(array == null) return null;
        var result:T = null;
        for(idx_ in startingIndex...array.length) {
            var comparisonValue;
            if(Std.is(propOrFcn, String)) {
                comparisonValue = Reflect.field(array[idx_], propOrFcn);
            } else {
                comparisonValue = propOrFcn(array[idx_]);
            }
            if(value == comparisonValue) {
                result = array[idx_];
                break;
            }
        }
        return result;
    }

    public static function getElementComplexInSubArray<T>(array:Array<T>, value:Dynamic, subArrayProp:String, ?startingIndex:Int=0):T {
        if(array == null) return null;
        var result:T = null;
        for(idx_ in startingIndex...array.length) {
            var subArray = Reflect.field(array[idx_], subArrayProp);
            if(ArrayHelper.contains(subArray, value)) {
                result = array[idx_];
                break;
            }
        }
        return result;
    }

    public static function getElementArrayComparison<T>(array:Array<T>, comparison:Array<ArrayComparison>, ?startingIndex:Int=0):T {
        var result:T = null;
        if(array != null) {
            if(hasValues(comparison)) {
                var base:ArrayComparison = comparison[0];
                var baseIndex = indexOfComplex(array, base.value, base.propOrFcn, startingIndex);
                while(baseIndex > -1 && result == null) {
                    var candidate:T = array[baseIndex];
                    var breakOut:Bool = false;
                    for(c_ in 1...comparison.length) {
                        var comparisonValue;
                        if(Std.is(comparison[c_].propOrFcn, String)) {
                            comparisonValue = Reflect.field(candidate, comparison[c_].propOrFcn);
                        } else {
                            comparisonValue = comparison[c_].propOrFcn(candidate);
                        }
                        if(comparison[c_].value == comparisonValue) {
                            continue;
                        } else {
                            baseIndex = indexOfComplex(array, base.value, base.propOrFcn, baseIndex+1);
                            breakOut = true;
                            break;
                        }
                    } 
                    if(breakOut) continue;
                    result = candidate;
                }
            }
        }
        
        return result;
    }

    public static function contains<T>(array:Array<T>, value:T):Bool {
        if(array == null) return false;
        var contains = Lambda.indexOf(array, value);
        return contains > -1;
    }

    public static function containsAny<T>(array:Array<T>, valueArray:Array<T>):Bool {
        if(array == null || valueArray == null) return false;
        var contains:Int = -1;
        for(v_ in 0...valueArray.length) {
            contains = Lambda.indexOf(array, valueArray[v_]);
            if(contains > -1) {
                break;
            }
        }
        return contains > -1;
    }

    public static function containsAll<T>(array:Array<T>, valueArray:Array<T>):Bool {
        if(array == null || valueArray == null) return false;
        var anyFailures = false;
        for(v_ in 0...valueArray.length) {
            var index:Int = Lambda.indexOf(array, valueArray[v_]);
            if(index < 0) {
                anyFailures = true;
                break;
            }
        }
        return !anyFailures;
    }

    public static function containsComplex<T>(array:Array<T>, value:Dynamic, propOrFcn:Dynamic, ?startingIndex:Int=0):Bool {
        if(array == null) return false;
        var contains = indexOfComplex(array, value, propOrFcn, startingIndex);
        return contains > -1;
    }

    public static function containsComplexInSubArray<T>(array:Array<T>, value:Dynamic, subArrayProp:String, ?startingIndex:Int=0):Bool {
        if(array == null) return false;
        var contains = indexOfComplexInSubArray(array, value, subArrayProp, startingIndex);
        return contains > -1;
    }

    public static function containsArrayComparison<T>(array:Array<T>, comparison:Array<ArrayComparison>, ?startingIndex:Int=0):Bool {
        if(array == null) return false;
        var contains = indexOfArrayComparison(array, comparison, startingIndex);
        return contains > -1;
    }

    public static function hasValues<T>(array:Array<T>):Bool {
        return array != null && array.length > 0;
    }

    public static function joinX(array: Array<String>, sep: String): String {
        if(array == null) return null;
        var s: String = "";
        for(str_ in 0...array.length) {
            var tmp: String = array[str_];
            if(tmp.isNotBlank()) {
                tmp = tmp.trim();
            }
            if(tmp.isNotBlank() && str_ > 0 && s.length > 0) {
                s += sep;
            }
            s += array[str_];
        }
        return s;
    }
}