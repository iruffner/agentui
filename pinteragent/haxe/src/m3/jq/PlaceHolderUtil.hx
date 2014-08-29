package m3.jq;

import m3.jq.JQ;

using m3.helper.StringHelper;

class PlaceHolderUtil {
	public static function setFocusBehavior(input:JQ, placeholder:JQ) {

    	placeholder.focus(function(evt: JQEvent): Void {
			placeholder.hide();
			input.show().focus();
		});

    	input.blur(function(evt: JQEvent): Void {
			if(input.val().isBlank()) {
    			placeholder.show();
    			input.hide();
			}
		});

	}
}