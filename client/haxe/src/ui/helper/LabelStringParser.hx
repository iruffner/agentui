package ui.helper;

using m3.helper.StringHelper;
using StringTools;

class LabelStringParser {

	var original: String;
	var processingString: String;

	public function new(str: String) {
		this.original = str;
		processingString = str;
	}

	public function consume(chars: Int, ?skipLeadingWhiteSpace: Bool = false): String {
		if(processingString.isBlank()) return null;
		if(skipLeadingWhiteSpace) processingString = processingString.ltrim();
		var consumedVal: String = processingString.substring(0, chars);
		processingString = processingString.substring(chars);
		return consumedVal;
	}

	public function nextTerm(?trim: Bool = true): String {
		if(processingString.isBlank()) return null;
		var tmp: String = "";
		for(char_ in 0...processingString.length) {
			var nextChar: String = processingString.substring(0,1);
			if(nextChar.containsAny(["(", ",", ")"])) {
				if(tmp.isBlank()) {
					tmp = consume(1);
				}
				break;
			}
			else tmp += consume(1);
		}

		return tmp.trim();
	}

	public function restore(str: String): Void {
		processingString = str + processingString;
	}
}