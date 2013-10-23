package ui.api;

import m3.jq.JQ;
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
		AgentUi.LOGGER.debug("send " + request.msgType);
		var ajaxOpts: AjaxOptions = { 
			async: true,
			url: AgentUi.URL + "/api", 
	        dataType: "json", 
	        contentType: "application/json",
	        // jsonp: "blah",
	        data: AgentUi.SERIALIZER.toJsonString(request),
	        type: "POST",
			success: successFcn,
   			error: function(jqXHR:JQXHR, textStatus:String, errorThrown:String) {
   				js.Lib.alert("There was an error making your request.\n" + jqXHR.message);
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
	private var jqXHR: Dynamic;
	private var request: ProtocolMessage<Dynamic>;
	private var requestJson: String;
	private var stop: Bool = false;
	private var successFcn: Dynamic->String->JQXHR->Void;


	public function new(requestToRepeat: ProtocolMessage<Dynamic>, successFcn: Dynamic->String->JQXHR->Void) {
		this.request = requestToRepeat;
		this.requestJson = AgentUi.SERIALIZER.toJsonString(this.request);
		this.successFcn = successFcn;
		ui.AgentUi.HOT_KEY_ACTIONS.push(function(evt: JQEvent): Void {
            if(evt.altKey && evt.shiftKey && evt.keyCode == 80 /* ALT+SHIFT+P */) {
                stop = !stop;
                ui.AgentUi.LOGGER.debug("Long Polling is paused? " + stop);
                if(!stop) {
                	poll();
                }
            // } else if (evt.altKey && evt.shiftKey && evt.keyCode == 82 /* ALT+SHIFT+R */) {
            //     ui.AgentUi.LOGGER.debug("Manual timer run");
            //     _run();
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
				AgentUi.LOGGER.error("error on poll abort | " + err);
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
			        	this.successFcn(data,textStatus,jqXHR);
			        }
			    },
			    error: function(jqXHR:JQXHR, textStatus:String, errorThrown:String): Void {
	   				AgentUi.LOGGER.error("Error executing ajax call | Response Code: " + jqXHR.status + " | " + jqXHR.message);
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