package m3.api;

import m3.log.Logga;
import m3.jq.JQ;
import m3.exception.Exception;

using m3.helper.StringHelper;

class AbstractAPI {

	static function getDefaultAjaxOptions(fcn: Dynamic->Void, ?errFcn: AjaxException->Void): AjaxOptions {
        var ajaxOptions: AjaxOptions = {
            async: true,
            cache: false,
            dataType: "json",
            type: "POST", 
            contentType: "application/json",
            crossDomain: true,
            success: function(data: Dynamic, textStatus: Dynamic, jqXHR: JQXHR): Void {
                try {
                    fcn(data);
                } catch (err: Dynamic) {
                    Logga.DEFAULT.error("Error processing success fcn of an ajax call", Logga.getExceptionInst(err));
                }
            },
            error: function(jqXHR: JQXHR, textStatus: String, errorThrown: String): Void {
                var error_message:String = errorThrown;
                if (jqXHR.message.isNotBlank()) {
                    error_message = jqXHR.message;
                } else if (jqXHR.responseText.isNotBlank() && jqXHR.responseText.charAt(0) != "<") {
                    error_message = jqXHR.responseText;
                } else if (error_message.isBlank()){
                    error_message = "{no error msg from server}";
                }
                Logga.DEFAULT.error("API error handler: Status " +jqXHR.status + " | " + error_message);
                Logga.DEFAULT.error("jqXHR\n--" + haxe.Json.stringify(jqXHR));
                
                if(errFcn != null)
                    errFcn(new AjaxException(error_message, null, jqXHR.status));
            }
        };
        return ajaxOptions;
    }

    function makeTheCall(url: String, fcn: Dynamic->Void, errFcn: AjaxException->Void, ?ajaxOptOverrides: AjaxOptions): Void {
    	var ajaxOptions: AjaxOptions = getDefaultAjaxOptions(fcn, errFcn);
        if(ajaxOptOverrides != null) ajaxOptions = JQ.extend(ajaxOptions, ajaxOptOverrides);
        ajaxOptions.url = url;
        JQ.ajax(ajaxOptions);
    }
}