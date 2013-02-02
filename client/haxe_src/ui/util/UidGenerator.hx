package ui.util;

import haxe.Int64;

class UidGenerator {
	
	private static var chars: String = "ABCDEFGHIJKLMNOPQRSTUVWXYZabsdefghijklmnopqrstuvwxyz0123456789";

	public static function create(length: Int=20): String {
    	var str = new Array<String>();
    	var charsLength: Int = chars.length;
    	while(str.length == 0) {
    		var i = randomNum();
    		if (i >= charsLength) {
    			continue;
    		}
    		var ch: String = chars.charAt(i);
    		if (isLetter(ch)) {
    			str.push(ch);
    		}
    	}
    	while (str.length < length) {
    		var i: Int = randomNum();
    		if ( i >= charsLength) {
    			continue;
    		}
    		var ch: String = chars.charAt(i);
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

	public static function randomNum(): Int {
		var max = chars.length - 1;
		var min = 0;
		return min + Math.round(Math.random() * (max - min) + 1);
	}

}	

