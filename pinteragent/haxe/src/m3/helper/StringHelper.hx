package m3.helper;

import m3.jq.JQ;

using StringTools;
using m3.helper.DateHelper;

class StringHelper {

    public static function compare( left: String, right: String):Int {
        if ( left < right ) return -1;
        else if ( left > right ) return 1;
        else return 0;
    }

	public static function extractLast( term: String, ?splitValue:Dynamic=","):String {
        if(term == null) return term;
		var lastTerm:String = null;
		if(Std.is(splitValue, EReg)) {
			lastTerm = cast(splitValue, EReg).split(term).pop();
		} else {
			lastTerm = term.split( splitValue ).pop();
		}
	    return lastTerm;
	}

    public static function replaceAll(original: String, sub: Dynamic, by: String): String {
        if(original == null) return original;
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

	public static function replaceLast(original: String, newLastTerm: String, ?splitValue: Dynamic="."): String {
        if(isBlank(original)) return original;
	    var pathSplit = original.split(splitValue);
	    pathSplit.pop();
	    pathSplit.push(newLastTerm);
	    return pathSplit.join(".");
	}

	public static function capitalizeFirstLetter(str:String): String {
        if(isBlank(str)) return str;
	    return str.substr(0,1).toUpperCase() + str.substr(1,str.length);
	}

    public static function camelCase(str:String) {
        if(isBlank(str)) return str;
        return str.substr(0,1).toLowerCase() + str.substr(1,str.length);
    }

	public static function isBlank(str: String): Bool {
		return str == null || JQ.trim(str) == "";
	}

	public static function isNotBlank(str: String): Bool {
		return !isBlank(str);
	}

public static function indentLeft( baseString: String, chars: Int, padChar: String ): String {
        if(baseString == null) baseString = "";
        var padding: String = "";
        for(i_ in 0...chars) {
            padding += padChar;
        }
        return padding + baseString;
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
        if(isBlank(baseString)) return false;
        return (baseString.indexOf(str) > -1);
    }

    public static function containsAny( baseString: String, sarray: Array<String>): Bool {
        if(isBlank(baseString)) return false;
         else {
            for(s_ in 0...sarray.length) {
                if(contains(baseString, sarray[s_])) return true;
            }
        }
        return false;
    }

    public static function startsWithAny(baseString: String, sarray: Array<String>): Bool {
        if(isBlank(baseString)) return false;
        else {
            for(s_ in 0...sarray.length) {
                if(baseString.substr(0, sarray[s_].length) == sarray[s_]) return true;
            }
        }
        return false;
    }

    public static function endsWithAny(baseString: String, sarray: Array<String>): Bool {
        if(isBlank(baseString)) return false;
        else {
            for(s_ in 0...sarray.length) {
                if(baseString.endsWith(sarray[s_])) return true;
            }
        }
        return false;
    }

    public static function splitByReg(baseString: String, reg: EReg): Array<String> {
        var result: Array<String> = null;
        if(baseString != null && reg != null) {
            result = reg.split(baseString);
        }
        return result;
    }

    public static function toDate(baseString: String): Date {
        var date: Date = null;
        if(isNotBlank(baseString)){
            try {
                date = Date.fromString(baseString);
            } catch (err: Dynamic) { }
            if(!date.isValid() && baseString.indexOf("/") > -1) {
                try {
                    var split: Array<String> = baseString.split("/");
                    var temp: String = split[2] + "-" + split[0] + "-" + split[1];
                    date = Date.fromString(temp);
                } catch (err: Dynamic) { }
            } 
        }
        if(!date.isValid()) date == null;
        return date;
    }

    public static function boolAsYesNo(bool: Bool): String {
        if(bool) return "Yes";
        else return "No";
    }

    public static function toBool(str: String): Bool {
        if(str == null) return false;
        return str.toLowerCase() == "true";
    }
}