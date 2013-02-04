package ui.util;

import haxe.Int64;

class UidGenerator {
	
    private static var chars: String = "ABCDEFGHIJKLMNOPQRSTUVWXYZabsdefghijklmnopqrstuvwxyz0123456789";
	private static var nums: String = "0123456789";

	public static function create(length: Int=20): String {
    	var str = new Array<String>();
    	var charsLength: Int = chars.length;
    	while(str.length == 0) {
    		var ch: String = randomChar();
    		if (isLetter(ch)) {
    			str.push(ch);
    		}
    	}
    	while (str.length < length) {
    		var ch: String = randomChar();
    		str.push(ch);
    	}
    	return str.join("");
	}

	public static function isLetter(char: String): Bool {
		for (i in 0 ... chars.length) {
			if (chars.charAt(i) == char) {
				return true;
			}
		}
		return false;
	}

    private static function randomIndex(str: String): Int {
        var max = str.length - 1;
        var min = 0;
        return min + Math.round(Math.random() * (max - min) + 1);
    }

	public static function randomChar(): String {
		var i: Int = 0;
        while( (i = randomIndex(chars)) >= chars.length) {
            continue;
        }
        return chars.charAt(i);
	}

    public static function randomNumChar(): Int {
        var i: Int = 0;
        while( (i = randomIndex(nums)) >= nums.length) {
            continue;
        }
        return Std.parseInt(nums.charAt(i));
    }

   

}	

