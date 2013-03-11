package ui.api;

import ui.jq.JQ;
import ui.model.Filter;
import ui.model.EventModel;
import ui.model.ModelEvents;
import ui.api.ProtocolMessage;
import ui.exception.InitializeSessionException;

interface Requester {
	function start(): Void;
	function abort(): Void;
}

class LoginRequest {
	private var jqXHR: Dynamic;
	private var request: InitializeSessionRequest;

	public function new(request: InitializeSessionRequest) {
		this.request = request;
	}

	public function execute(): InitializeSessionResponse {
		var response: InitializeSessionResponse = null;
		JQ.ajax( { 
			async: false,
			url: "http://64.27.3.17:9876/", 
	        dataType: "json", 
	        data: this.request.toJson(),
	        type: "POST",
			success: function(data: Dynamic, textStatus: Dynamic, jqXHR: Dynamic) {
		        if(data.msgType == MsgType.initializeSessionResponse) {

		        } else if(data.msgType == MsgType.initializeSessionError) {
		        	var error: InitializeSessionError = new InitializeSessionError();
		        	error.contents = AgentUi.SERIALIZER.fromJsonX(data.contents, InitializeSessionErrorData);
		        	throw new InitializeSessionException(error, "Login error");
		        }
        	}, 
	        timeout: 30000 
        } );
        return response;
	}
}

class LongPollingRequest implements Requester {
	private var jqXHR: Dynamic;
	private var request: ProtocolMessage<Dynamic>;
	private var stop: Bool = false;


	public function new(request: ProtocolMessage<Dynamic>) {
		this.request = request;
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

			}
		}
	}

	private function poll(): Void {
		if(!stop) {
			jqXHR = JQ.ajax( { 
				// url: "evalResponse.json", 
				// isLocal: true,
				url: "http://64.27.3.17:9876/", 
				crossDomain: true,
		        dataType: "json", 
		        data: request.toJson(),
		        type: "POST",
				success: function(data: Dynamic, textStatus: Dynamic, jqXHR: Dynamic) {
			        if(!stop) {
			        	//broadcast results
			        }
			    }, 
		        complete: function(arg: Dynamic): Void {
		        	// poll(); //to keep this going
	        	}, 
		        timeout: 30000 
	        } );
		}
	}
}