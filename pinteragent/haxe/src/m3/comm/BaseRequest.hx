package m3.comm;

import m3.exception.Exception;
import m3.jq.JQ;
import m3.util.JqueryUtil;
import m3.log.Logga;

using m3.helper.StringHelper;

class BaseRequest {
	private var requestData:String;
	private var onSuccess: Dynamic->Void;
	private var onError: AjaxException->Void;
	private var onAccessDenied: Void->Void;
	private var baseOpts:AjaxOptions;

	public function new(requestData: String, ?successFcn: Dynamic->Void, ?errorFcn: AjaxException->Void,
		                                     ?accessDeniedFcn: Void->Void) {
		this.requestData = requestData;
		this.onSuccess   = successFcn;
		this.onError     = errorFcn;
		this.onAccessDenied = accessDeniedFcn;
	}

	public function start(?opts: AjaxOptions): Dynamic {
		// NB:  url must be passed in through opts
		var ajaxOpts: AjaxOptions = {
	        dataType: "json", 
	        contentType: "application/json",
	        data: requestData,
	        type: "POST",
			success: function(data: Dynamic, textStatus: Dynamic, jqXHR: JQXHR) {
				//SystemStatus.instance().onMessage();
   				if (jqXHR.getResponseHeader("Content-Length") == "0") {
   					return;
   				}
				if(onSuccess != null) 
					onSuccess(data);
			},
   			error: function(jqXHR:JQXHR, textStatus:String, errorThrown:Dynamic) {
   				if (jqXHR.getResponseHeader("Content-Length") == "0") {
   					return;
   				}

                if (jqXHR.status == 403 && this.onAccessDenied != null) {
   					return this.onAccessDenied();
   				}

   				var error_message:String = null;
                if (jqXHR.message.isNotBlank()) {
                    error_message = jqXHR.message;
                } else if (jqXHR.responseText.isNotBlank() && jqXHR.responseText.charAt(0) != "<") {
                    error_message = jqXHR.responseText;
                } else if (errorThrown == null || Std.is(errorThrown, String)){
                    error_message = errorThrown;
                } else {
                	error_message = errorThrown.message;
                }	

                if (error_message.isBlank()) {
                	error_message = "Error, but no error msg from server";
                }

                Logga.DEFAULT.error("Request Error handler: Status " +jqXHR.status + " | " + error_message);
                
   				if (onError != null) {
   					onError(new AjaxException(error_message, null, jqXHR.status));
   				} else {
	   				JqueryUtil.alert("There was an error making your request:  " + error_message);
	   				throw new Exception("Error executing ajax call | Response Code: " + jqXHR.status + " | " + error_message);
	   			}
			}
        };

        JQ.extend(ajaxOpts, baseOpts);
        if (opts != null) {
        	JQ.extend(ajaxOpts, opts);
        }
		return JQ.ajax(ajaxOpts);
	}

	public function abort(): Void {
	}
}

