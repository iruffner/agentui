package m3.helper;

import m3.jq.JQ;

using StringTools;
using m3.helper.StringHelper;
using m3.helper.ArrayHelper;


class StringFormatHelper {

	public static var MONTHS:Array<String> = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    public static var MONTHS_SHORT:Array<String> = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    public static var DAYS: Array<String> = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    public static var DAYS_SHORT: Array<String> = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    public static var DAYS_SUNDAYFIRST: Array<String> = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    public static var DAYS_SHORT_SUNDAYFIRST: Array<String> = [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

	public static function toString(val: Dynamic): String {
		return Std.string(val);
	}

	public static function nullsAsEmptyStr(val: Dynamic) {
		if (val == null) {
			return "";
		} else {
			return Std.string(val);
		}
	}

	public static function htmlEscape(val: Dynamic) {
		return Std.string(val).htmlEscape();		
	}

	public static function toDecimal(val: Dynamic, ?opts: FormattingOptions) {
		if(opts == null) opts = {};
		opts = JQ.extend({
				        numberOfDecimals: 2,
				        decimalSeparator: '.',
				        thousandSeparator: ','
				}, opts);
		
		return toFormattedNumber(val, opts);	
	}

	public static function toCurrency(num: Dynamic, ?decimals: Bool=true, ?forceNumberOfDecimals: Bool=true) :String {
	    return formatNumber(num, {
	            numberOfDecimals: decimals ? 2:0,
	            decimalSeparator: '.',
	            thousandSeparator: ',',
	            symbol: '$',
	            forceNumberOfDecimals: forceNumberOfDecimals
	    });
	}
	
	public static function toPercentage(num:String):String {
	    return formatNumber(num, {
	        numberOfDecimals: 1,
	        decimalSeparator: '.',
	        thousandSeparator: ',',
	        percentage: true
	    });
	}

	public static function stripNonDigits(num: String, allowDecimal: Bool): String {
		var r: String;
		if(num.isBlank()) r = num;
		else{ 
			r = ~/[^\d|\.]/g.replace(num,"");
			if(!allowDecimal) { 
				//todo strip non-decimal chars
			// 	// r = ~/[^0-9\.]/g.replace(num,"");
			// 	r = ~/[^\d|\.]/g.replace(num,"");
			// } else {
				// r = ~/[^0-9]/g.replace(num,"");
				// r = ~/[^\d]/g.replace(num,"");
			}
		}
		return r;
	}

	// ^\$?\-?([1-9]{1}[0-9]{0,2}(\,\d{3})*(\.\d{0,2})?|[1-9]{1}\d{0,}(\.\d{0,2})?|0(\.\d{0,2})?|(\.\d{1,2}))$|^\-?\$?([1-9]{1}\d{0,2}(\,\d{3})*(\.\d{0,2})?|[1-9]{1}\d{0,}(\.\d{0,2})?|0(\.\d{0,2})?|(\.\d{1,2}))$|^\(\$?([1-9]{1}\d{0,2}(\,\d{3})*(\.\d{0,2})?|[1-9]{1}\d{0,}(\.\d{0,2})?|0(\.\d{0,2})?|(\.\d{1,2}))\)$

	public static function formatNumber(numero: Dynamic, params: FormattingOptions): String { 
		if (Std.string(numero).isBlank()) {
			return "";
		}

	    var options:FormattingOptions = {			
	        numberOfDecimals: 2,
	        decimalSeparator: '.',
	        thousandSeparator: ',',
	        symbol: '',
	        percentage: false,
	        forceNumberOfDecimals: true
	    };

	    JQ.extend(options, params);//jQuery.extend(sDefaults, params);

	    var number:Dynamic = numero; 
	    if (number == null) {
	        number = '';
	    }
	    var decimals:Int = options.numberOfDecimals;
	    var dec_point = options.decimalSeparator;
	    var thousands_sep = options.thousandSeparator;
	    var currencySymbol = options.symbol;
	    var percentage = options.percentage;

	    var exponent = "";
	    var numberstr = Std.string(number);
	    var eindex = numberstr.indexOf ("e");
	    if (eindex > -1) {
	        exponent = numberstr.substring (eindex);
	        number = Std.parseFloat (numberstr.substring (0, eindex));
	    }

	    if (decimals != null) {
	        var temp = Math.pow (10, decimals);
	        number = Math.round (number * temp) / temp;
	    }
	    var sign = number < 0 ? "-" : "";
	    var integer = Std.string(number > 0 ? 
	        Math.floor (number) : Math.abs (Math.ceil (number)));

	    var fractional = Std.string(number).substring (integer.length + sign.length);
	    dec_point = dec_point != null ? dec_point : ".";
	    if(options.forceNumberOfDecimals || numberstr.indexOf(".") > -1) {
		    fractional = decimals != null && decimals > 0 || fractional.length > 1 ? (dec_point + fractional.substring (1)) : "";
		    if (decimals != null && decimals > 0 && options.forceNumberOfDecimals) {
		    	var z:Int = decimals;
		        for (i in (fractional.length - 1)...z) {
		        	z = decimals;
		            fractional += "0";
		        }
		    }
		}

	    thousands_sep = (thousands_sep != dec_point || fractional.length == 0) ? 
	    thousands_sep : null;
	    if (thousands_sep != null && thousands_sep != "") {
	    	var i = integer.length - 3;
	        while(i > 0) {
	            integer = integer.substring (0 , i) + thousands_sep + integer.substring (i);
	            i -= 3;
	        }
	    }


	    if (percentage) {
	        return sign + integer + fractional + exponent + "%";
	    } else if (options.symbol == '') {
	        return sign + integer + fractional + exponent;
	    } else {
	        return currencySymbol + '' + sign + integer + fractional + exponent;
	    }
	}

	public static function toFormattedPhone(num:String){ 
	    var formatted:String;
	    /*
	   * 7181238748 to 1(718)123-8748
	   */ 

	    if (num.length != 10) { 
	        /* 
	     * if user did not enter 10 digit phone number then simply print whatever user entered 
	     */ 
	        formatted = num;
	    } else { 
	        /* formating phone number here */ 
	        formatted = "(";
	        var ini = num.substring(0,3);
	        formatted += ini + ")";
	        var st = num.substring(3,6);
	        formatted += st + "-";
	        var end = num.substring(6,10);
	        formatted += end;
	    }
	    return formatted; 
	}
	public static function toFormattedNumber(num:String, ?options:FormattingOptions):String {
	    if (options == null) {
	        options = {
	            numberOfDecimals: 0,
	            decimalSeparator: '.',
	            thousandSeparator: ','
	        };
	    }
	    return formatNumber(num, options);
	}

	public static function toFormattedNumberDyn(num: String): String {
		return toFormattedNumber(num);
	}

	// public static function toPeriodDyn(val:Dynamic): String {
	// 	var val2 = Std.string(val);
	// 	if ( val2.length == 0 ) {
	// 		return "";
	// 	} else {
	// 		var num = Std.parseInt(val2);
	// 		return toPeriod(num);
	// 	}
	// }

	// public static function toPeriod(num:Int):String{
	// 	if (num == 0) return '';
	// 	var twoDigitYear = Math.floor(num / 100);
	// 	if ( twoDigitYear > 2000 ) twoDigitYear -= 2000;
	// 	var yearStr = "" + twoDigitYear;
	// 	if ( yearStr.length == 0 ) yearStr = "00";
	// 	if ( yearStr.length == 1 ) yearStr = "0" + yearStr;
	// 	var month = num % 100;
	// 	var monthStr = App.MONTHS_SHORT[month-1];
	// 	return monthStr + " " + yearStr;
	// }

	// public static function toMonth(num:String):String {
	// 	var month = Std.parseInt(num) % 100;
	// 	return App.MONTHS_SHORT[month-1];
	// }

	public static function dateYYYY_MM_DD(d: Date): String {
		return d.getFullYear() + "-" +  Std.string((d.getMonth() + 1)).padLeft(2, "0") + "-" + StringHelper.padLeft(Std.string(d.getDate()), 2, "0");
	}

	public static function datePretty(d: Date): String {
		return MONTHS[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
	}

	public static function dateLongPretty(d: Date): String {
		return DAYS_SUNDAYFIRST[d.getDay()] + ", " + MONTHS[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
	}

	public static function dateTimeMM_DD(d: Date): String {
		return Std.string((d.getMonth() + 1)).padLeft(2, "0") + "-" + StringHelper.padLeft(Std.string(d.getDate()), 2, "0") + " " + 
			d.getHours() + ":" + StringHelper.padLeft(Std.string(d.getMinutes()), 2, "0") + ":" + StringHelper.padLeft(Std.string(d.getSeconds()),2,"0");
	}

	public static function dateTimeYYYY_MM_DD(d: Date): String {
		return d.getFullYear() + "-" +  Std.string((d.getMonth() + 1)).padLeft(2, "0") + "-" + StringHelper.padLeft(Std.string(d.getDate()), 2, "0") + " " + 
			d.getHours() + ":" + StringHelper.padLeft(Std.string(d.getMinutes()), 2, "0") + ":" + StringHelper.padLeft(Std.string(d.getSeconds()),2,"0");
	}

	public static function dateTimePretty(d: Date): String {
		return MONTHS[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear() + " " +
			d.getHours() + ":" + StringHelper.padLeft(Std.string(d.getMinutes()), 2, "0") + ":" + StringHelper.padLeft(Std.string(d.getSeconds()),2,"0");
	}
}

private typedef FormattingOptions = {
	@:optional var numberOfDecimals:Int;
	@:optional var decimalSeparator:String;
	@:optional var thousandSeparator:String;
	@:optional var symbol:String;
	@:optional var percentage:Bool;
	@:optional var forceNumberOfDecimals:Bool;
}
