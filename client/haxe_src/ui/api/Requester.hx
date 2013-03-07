package ui.api;

import ui.jq.JQ;
import ui.model.Filter;
import ui.model.EventModel;
import ui.model.ModelEvents;

interface Requester {
	function start(): Void;
	function abort(): Void;
}

class LongPollingRequest implements Requester {
	private var jqXHR: Dynamic;
	private var request: ProtocolMessage;
	private var stop: Bool = false;


	public function new(request: ProtocolMessage) {
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
		        data: request.toJsonString(),
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