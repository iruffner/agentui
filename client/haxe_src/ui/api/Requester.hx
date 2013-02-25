package ui.api;

import ui.jq.JQ;
import ui.model.Filter;
import ui.model.EventModel;

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
		EventModel.addListener("runFilter", new EventListener(function(filter: Filter): Void {
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
				url: "server", 
		        dataType: "json", 
		        data: request.toJson(),
				success: function(data: Dynamic, textStatus: Dynamic, jqXHR: Dynamic) {
			        if(!stop) {
			        	//broadcast results
			        }
			    }, 
		        complete: function(arg: Dynamic): Void {
		        	poll();
	        	}, 
		        timeout: 30000 
	        } );
		}
	}
}