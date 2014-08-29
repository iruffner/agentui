package m3.jq;

import js.html.Element;

import m3.jq.JQ;

typedef JQDatepickerOpts = {
	/**
	 * An input element that is to be updated with the selected date from the 
	 * datepicker. Use the altFormat option to change the format of the date within 
	 * this field. Leave as blank for no alternate field.
	*/
	@:optional var altField: Dynamic; //selector
	/**
	 * The dateFormat to be used for the altField option. This allows one date format to 
	 * be shown to the user for selection purposes, while a different format is actually 
	 * sent behind the scenes. For a full list of the possible formats see the 
	 * formatDate function
	*/
	@:optional var altFormat: String; //""
	/**
	 * The text to display after each date field, e.g., to show the required format.
	*/
	@:optional var appendText: String; //""
	/**
	 * Set to true to automatically resize the input field to accommodate dates in the 
	 * current dateFormat.
	*/
	@:optional var autoSize: Bool; //false
	/**
	 * A function that takes an input field and current datepicker instance and 
	 * returns an options object to update the datepicker with. It is called just before
	 * the datepicker is displayed.
	*/
	@:optional var beforeShow: JQ->Dynamic->Void;//null
	/**
	 * The maximum  selectable date. When set to null, there is no maximum .
		Multiple types supported:
			- Date:   A date object containing the maximum  date.
			- Number: A number of days from today. For example 2 represents two days 
					  from today and -1 represents yesterday.
			- String: A string in the format defined by the dateFormat option, or a 
			          relative date. Relative dates must contain value and period pairs; 
			          valid periods are "y" for years, "m" for months, "w" for weeks, 
			          and "d" for days. For example, "+1m +7d" represents one month and 
			          seven days from today.
	*/
	@:optional var maxDate: Dynamic;//null
	/**
	 * The minimum selectable date. When set to null, there is no minimum.
		Multiple types supported:
			- Date:   A date object containing the minimum date.
			- Number: A number of days from today. For example 2 represents two days 
					  from today and -1 represents yesterday.
			- String: A string in the format defined by the dateFormat option, or a 
			          relative date. Relative dates must contain value and period pairs; 
			          valid periods are "y" for years, "m" for months, "w" for weeks, 
			          and "d" for days. For example, "+1m +7d" represents one month and 
			          seven days from today.
	*/
	@:optional var minDate: Dynamic;//null
}

class JQDatepickerTools {
	public static function getDate(d: JQDatepicker): Date {
		return d.datepicker('getDate');
	}
	public static function refresh(d: JQDatepicker): Date {
		return d.datepicker('refresh');
	}
	public static function setDate(d: JQDatepicker, date: Date): Date {
		return d.datepicker('setDate', date);
	}
}

@:native("$")
extern class JQDatepicker extends JQ {
	@:overload(function<T>(cmd : String):T{})
	@:overload(function<T>(cmd:String, opt:Dynamic):T{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function datepicker(opts: JQDatepickerOpts): JQDatepicker;

	@:overload(function( selector: JQ ) : JQDatepicker{})
	@:overload(function( selector: Element ) : JQDatepicker{})
	override function appendTo( selector: String ): JQDatepicker;
}