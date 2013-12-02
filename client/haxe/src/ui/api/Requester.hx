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

class StandardRequest implements Requester {
	private var request: ProtocolMessage<Dynamic>;
	private var successFcn: Dynamic->String->JQXHR->Void;

	public function new(request: ProtocolMessage<Dynamic>, successFcn: Dynamic->String->JQXHR->Void) {
		this.request = request;
		this.successFcn = successFcn;
	}

	public function start(?opts: AjaxOptions): Void {
		AppContext.LOGGER.debug("send " + request.msgType);
		var ajaxOpts: AjaxOptions = { 
			async: true,
			url: AgentUi.URL + "/api", 
	        dataType: "json", 
	        contentType: "application/json",
	        data: AppContext.SERIALIZER.toJsonString(request),
	        type: "POST",
			success: successFcn,
   			error: function(jqXHR:JQXHR, textStatus:String, errorThrown:String) {
   				JqueryUtil.alert("There was an error making your request.\n" + jqXHR.message);
   				throw new Exception("Error executing ajax call | Response Code: " + jqXHR.status + " | " + jqXHR.message);
			}
        };
        if(opts != null) {
        	JQ.extend(ajaxOpts, opts);
        }
		JQ.ajax(ajaxOpts);
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