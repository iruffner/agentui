package ui.helper;

import ui.jq.JQ;

using StringTools;

class StringHelper {

    public static function compare( left:String, right: String):Int {
        if ( left < right ) return -1;
        else if ( left > right ) return 1;
        else return 0;
    }

	public static function extractLast( term:String, ?splitValue:Dynamic=","):String {
		var lastTerm:String = null;
		if(Std.is(splitValue, EReg)) {
			lastTerm = cast(splitValue, EReg).split(term).pop();
		} else {
			lastTerm = term.split( splitValue ).pop();
		}
	    return lastTerm;
	}

    public static function replaceAll(original:String, sub:Dynamic, by:String): String {
        if(!Std.is(original, String)) {
            original = Std.string(original);
        }
        while(original.indexOf(sub) >= 0) {
            if(Std.is(sub, EReg)) {
                original = cast(sub,EReg).replace(original, by);
            } else {
                original = original.replace(sub, by);
            }
        }
        return original;
    }

	public static function replaceLast(original:String, newLastTerm:String, ?splitValue:Dynamic="."):String {
	    var pathSplit = original.split(splitValue);
	    pathSplit.pop();
	    pathSplit.push(newLastTerm);
	    return pathSplit.join(".");
	}

	public static function capitalizeFirstLetter(str:String) {
	    return str.substr(0,1).toUpperCase() + str.substr(1,str.length);
	}

	public static function isBlank(str:String) {
		return str == null || JQ.trim(str) == "";
	}

	public static function isNotBlank(str:String) {
		return !isBlank(str);
	}

	public static function padLeft( baseString:String, minChars:Int, padChar:String ):String {
        if(baseString == null) baseString = "";
        var padding:String = "";
        if(baseString.length < minChars) {
            for(i_ in baseString.length...minChars) {
                padding += padChar;
            }
        }
        return padding + baseString;
    }
    
    public static function padRight( baseString:String, minChars:Int, padChar:String ):String {
        if(baseString == null) baseString = "";
        var padding:String = "";
        if(baseString.length < minChars) {
            for(i_ in baseString.length...minChars) {
                padding += padChar;
            }
        }
        return baseString + padding;
    }
    
    public static function trimLeft( s: String, minChars: Int = 0, trimChars: String = " \n\t"): String {
        if(s == null) s = "";
        if(s.length < minChars) return s; 
        var i = 0;
        while(i <= s.length && trimChars.indexOf(s.substr(i, 1)) >= 0) {
            i += 1;
        }
        if ( s.length - i < minChars ) i = s.length-minChars;
        return s.substr(i);
    }

    public static function trimRight( s: String, minChars: Int = 0, trimChars: String = " \n\t"): String {
        if(s == null) s = "";
        if(s.length < minChars) return s; 
        var i = s.length;
        while( i > 0 && trimChars.indexOf(s.substr(i-1, 1)) >= 0 ) {
            i -= 1;
        }
        if ( s.length - i < minChars ) i = minChars;
        return s.substr(0, i);
    }

    public static function contains( baseString: String, str: String): Bool {
        if(baseString == null) baseString = "";
        return (baseString.indexOf(str) > -1);
    }

    public static function splitByReg(baseString: String, reg: EReg): Array<String> {
        var result: Array<String> = null;
        if(baseString != null && reg != null) {
            result = reg.split(baseString);
        }
        return result;
    }
}