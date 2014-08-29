package m3.comm;

import haxe.Timer;
import m3.exception.Exception;
import m3.jq.JQ;
import m3.log.Logga;

class LongPollingRequest extends BaseRequest {

	private var jqXHR: Dynamic;
	private var running: Bool = true;
	private var delayNextPoll: Bool = false;
	private var channel:String;
	private var logger:Logga;

	public var timeout:Int = 30000;

	public function new(channel:String, requestToRepeat: String, logga:Logga, 
		                successFcn: Dynamic->Void, 
		                ?errorFcn: AjaxException->Void, ?ajaxOpts:AjaxOptions) {
		this.channel = channel;
		this.logger  = logga;

		baseOpts = {
	        complete: function(jqXHR:JQXHR, textStatus:String): Void {
	        	this.poll();
        	}
        };

        if (ajaxOpts != null) {
    		JQ.extend(baseOpts, ajaxOpts);
    	}

		var onSuccess = function(data: Dynamic) {
			if (running) {
				try {
					successFcn(data);
				} catch (e:Exception) {
					logger.error("Error while polling", e);
				}
			}
		};
		var onError = function(exc: AjaxException): Void {
	   		delayNextPoll = true;
	   		// logger.error("Error executing ajax call | Response Code: " + jqXHR.status + " | " + jqXHR.message);
	   		if (errorFcn != null) {
		   		errorFcn(exc);
		   	}
		};

		super(requestToRepeat, onSuccess, onError);
	}

	public function pause():Void {
		running = false;
		poll();
	}

	public function resume():Void {
		running = false;
		poll();
	}

	public function toggle():Void {
        running = !running;
        logger.debug("Long Polling is running? " + running);
        poll();
	}

	public function getChannelId(): String {
		return this.channel;
	}

	override public function start(?opts: AjaxOptions): Dynamic {
		poll();
		return jqXHR;
	}

	override public function abort(): Void {
		running = false;
		if(jqXHR != null) {
			try {
				jqXHR.abort();
				jqXHR = null;
			} catch (err: Dynamic) {
				//TODO what happens if we error on abort?
				logger.error("error on poll abort | " + err);
			}
		}
	}

	private function poll(): Void {
		if (running) {
			if (delayNextPoll == true) {
				delayNextPoll = false;
				Timer.delay(poll, Std.int(timeout/2));
			} else {
				// Set the url here in case the polling frequency has changed
				baseOpts.url = "/api/channel/poll?channel=" + 
				               this.channel + "&timeoutMillis=" + Std.string(this.timeout);
				baseOpts.timeout = this.timeout + 1000;

				jqXHR = super.start();
			}
		}
	}
}