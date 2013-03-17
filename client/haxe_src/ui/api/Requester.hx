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

class StandardRequest {
	private var request: ProtocolMessage<Dynamic>;
	private var successFcn: Dynamic->Dynamic->JQXHR->Void;

	public function new(request: ProtocolMessage<Dynamic>, successFcn: Dynamic->Dynamic->JQXHR->Void) {
		this.request = request;
		this.successFcn = successFcn;
	}

	public function execute(): Void {
		JQ.ajax( { 
			async: false,
			url: "api/login", 
	        dataType: "json", 
	        data: AgentUi.SERIALIZER.toJson(request),
	        type: "POST",
			success: successFcn,
   			error: function(data: Dynamic, textStatus: Dynamic, jqXHR: JQXHR) {
   				throw new Exception("Error executing ajax call | " + jqXHR.code + " | " + jqXHR.message);
			}
			// , timeout: 30000 
        } );
	}
}

class LongPollingRequest implements Requester {
	private var jqXHR: Dynamic;
	private var request: ProtocolMessage<Dynamic>;
	private var requestJson: Dynamic;
	private var stop: Bool = false;
	private var successFcn: Dynamic->Dynamic->JQXHR->Void;


	public function new(requestToRepeat: ProtocolMessage<Dynamic>, successFcn: Dynamic->Dynamic->Dynamic->Void) {
		this.request = requestToRepeat;
		this.requestJson = AgentUi.SERIALIZER.toJson(this.request);
		this.successFcn = successFcn;
		EventModel.addListener(ModelEvents.RunFilter, new EventListener(function(filter: Filter): Void {
                this.abort();
            })
        );
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
				url: "api/poll", 
		        dataType: "json", 
		        data: this.requestJson,
		        type: "POST",
				success: function(data: Dynamic, textStatus: Dynamic, jqXHR: Dynamic) {
			        if(!stop) {
			        	//broadcast results
			        	this.successFcn(data,textStatus,jqXHR);
			        }
			    },
			    error: function(data: Dynamic, textStatus: Dynamic, jqXHR: JQXHR) {
	   				AgentUi.LOGGER.error("Error executing ajax call | " + jqXHR.code + " | " + jqXHR.message);
				},
		        complete: function(arg: Dynamic): Void {
		        	poll(); //to keep this going
	        	}, 
		        timeout: 30000 
	        } );
		}
	}
}