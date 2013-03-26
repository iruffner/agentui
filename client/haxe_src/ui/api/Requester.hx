package ui.api;

import ui.jq.JQ;
import ui.model.Filter;
import ui.model.EventModel;
import ui.model.ModelEvents;
import ui.api.ProtocolMessage;
import ui.exception.Exception;
import ui.exception.InitializeSessionException;

interface Requester {
	function start(): Void;
	function abort(): Void;
}

class StandardRequest implements Requester {
	private var request: ProtocolMessage<Dynamic>;
	private var successFcn: Dynamic->String->JQXHR->Void;

	public function new(request: ProtocolMessage<Dynamic>, successFcn: Dynamic->String->JQXHR->Void) {
		this.request = request;
		this.successFcn = successFcn;
	}

	public function start(): Void {
		AgentUi.LOGGER.debug("send " + request.msgType);
		JQ.ajax( { 
			async: true,
			url: "/api", 
	        // dataType: "json", 
	        data: AgentUi.SERIALIZER.toJsonString(request),
	        type: "POST",
			success: successFcn,
   			error: function(jqXHR:JQXHR, textStatus:String, errorThrown:String) {
   				throw new Exception("Error executing ajax call | Response Code: " + jqXHR.status + " | " + jqXHR.message);
			}
        } );
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
	}

	public function start(): Void {
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
			jqXHR = JQ.ajax( { 
				url: "/api", 
		        // dataType: "json", 
		        data: this.requestJson,
		        type: "POST",
				success: function(data: Dynamic, textStatus: String, jqXHR: JQXHR) {
			        if(!stop) {
			        	//broadcast results
			        	this.successFcn(data,textStatus,jqXHR);
			        }
			    },
			    error: function(jqXHR:JQXHR, textStatus:String, errorThrown:String) {
	   				AgentUi.LOGGER.error("Error executing ajax call | Response Code: " + jqXHR.status + " | " + jqXHR.message);
				},
		        complete: function(jqXHR:JQXHR, textStatus:String): Void {
		        	poll(); //to keep this going
	        	}, 
		        timeout: 30000 
	        } );
		}
	}
}