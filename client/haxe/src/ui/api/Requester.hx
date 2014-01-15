package ui.api;

import m3.jq.JQ;
import m3.util.JqueryUtil;
import ui.model.Filter;
import ui.model.EM;
import ui.api.ProtocolMessage;
import m3.exception.Exception;
import ui.exception.InitializeSessionException;

interface Requester {
	function start(?opts: AjaxOptions): Void;
	function abort(): Void;
}

/**
 * Base class for making http requests.
 */
class BaseRequest {
	private var requestData:String;
	private var onSuccess: Dynamic->String->JQXHR->Void;
	private var onError: JQXHR->String->String->Void;

	public function new(requestData: String, successFcn: Dynamic->String->JQXHR->Void, ?errorFcn: JQXHR->String->String->Void) {
		this.requestData = requestData;
		this.onSuccess   = successFcn;
		this.onError     = errorFcn;
	}

	public function send(?opts: AjaxOptions): Void {
		// NB:  url must be passed in through opts
		var ajaxOpts: AjaxOptions = {
	        dataType: "json", 
	        contentType: "application/json",
	        data: requestData,
	        type: "POST",
			success: function(data: Dynamic, textStatus: Dynamic, jqXHR: JQXHR) {
				SystemStatus.instance().onMessage();
				onSuccess(data, textStatus, jqXHR);
			},
   			error: function(jqXHR:JQXHR, textStatus:String, errorThrown:String) {
				var error_message:String = errorThrown;
				if (jqXHR.message != null) {
					error_message = jqXHR.message;
				} else if (jqXHR.responseText != null) {
					error_message = jqXHR.responseText;
				}
   				if (onError != null) {
   					onError(jqXHR, textStatus, errorThrown);
   				} else {
	   				JqueryUtil.alert("There was an error making your request:  " + error_message);
	   				throw new Exception("Error executing ajax call | Response Code: " + jqXHR.status + " | " + error_message);
	   			}
			}
        };
        if(opts != null) {
        	JQ.extend(ajaxOpts, opts);
        }
		JQ.ajax(ajaxOpts);
	}
}

class StandardRequest extends BaseRequest implements Requester {

	private var request: ProtocolMessage<Dynamic>;

	public function new(request: ProtocolMessage<Dynamic>, successFcn: Dynamic->String->JQXHR->Void) {
		this.request = request;
		super(AppContext.SERIALIZER.toJsonString(request), successFcn);
	}

	public function start(?opts: AjaxOptions): Void {
		AppContext.LOGGER.debug("send " + request.msgType);

		var ajaxOpts:AjaxOptions = {
			async: true,
			url: AgentUi.URL + "/api" 
		};

		if (opts != null) {
        	JQ.extend(ajaxOpts, opts);
        }

		super.send(ajaxOpts);
	}

	public function abort(): Void {
	}
}

class LongPollingRequest implements Requester {
	public static var reqId: Int = 1;

	private var jqXHR: Dynamic;
	private var request: ProtocolMessage<Dynamic>;
	private var requestJson: String;
	private var stop: Bool = false;
	private var successFcn: Dynamic->String->JQXHR->Void;


	public function new(requestToRepeat: ProtocolMessage<Dynamic>, successFcn: Dynamic->String->JQXHR->Void) {
		this.request = requestToRepeat;
		this.requestJson = AppContext.SERIALIZER.toJsonString(this.request);
		this.successFcn = successFcn;
		AgentUi.HOT_KEY_ACTIONS.push(function(evt: JQEvent): Void {
            if(evt.altKey && evt.shiftKey && evt.keyCode == 80 /* ALT+SHIFT+P */) {
                stop = !stop;
                AppContext.LOGGER.debug("Long Polling is paused? " + stop);
                if(!stop) {
                	poll();
                }
            }
        });
	}

	public function start(?opts: AjaxOptions): Void {
		poll();
	}

	public function abort(): Void {
		stop = true;
		if(jqXHR != null) {
			try {
				jqXHR.abort();
				jqXHR = null;
			} catch (err: Dynamic) {
				//TODO what happens if we error on abort?
				AppContext.LOGGER.error("error on poll abort | " + err);
			}
		}
	}

	private function poll(): Void {
		if(!stop) {
			var ajaxOpts: AjaxOptions = { 
				url: AgentUi.URL + "/api", 
		        dataType: "json", 
	        	contentType: "application/json",
		        data: this.requestJson,
		        type: "POST",
				success: function(data: Dynamic, textStatus: String, jqXHR: JQXHR): Void {
			        if(!stop) {
			        	//broadcast results
			        	try {
			        		this.successFcn(data,textStatus,jqXHR);
		        		} catch (err: Dynamic) {
		        			AppContext.LOGGER.error("long polling error", err);
		        		}
			        }
			    },
			    error: function(jqXHR:JQXHR, textStatus:String, errorThrown:String): Void {
	   				AppContext.LOGGER.error("Error executing ajax call | Response Code: " + jqXHR.status + " | " + jqXHR.message);
				},
		        complete: function(jqXHR:JQXHR, textStatus:String): Void {
		        	poll(); //to keep this going
	        	}, 
		        timeout: 30000 
	        };
			jqXHR = JQ.ajax( ajaxOpts );
		}
	}
}