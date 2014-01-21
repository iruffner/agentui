package ui.api;

import haxe.Json;

import m3.jq.JQ;
import m3.util.JqueryUtil;
import m3.util.UidGenerator;

import ui.model.Filter;
import ui.model.EM;
import ui.model.ModelObj;
import ui.api.CrudMessage;

import m3.exception.Exception;
import ui.exception.InitializeSessionException;

interface Requester {
	function start(?opts: AjaxOptions): Dynamic;
	function abort(): Void;
}

/**
 * Base class for making http requests.
 */
class BaseRequest {
	private var requestData:String;
	private var onSuccess: Dynamic->String->JQXHR->Void;
	private var onError: JQXHR->String->String->Void;
	private var baseOpts:AjaxOptions;

	public function new(requestData: String, successFcn: Dynamic->String->JQXHR->Void, ?errorFcn: JQXHR->String->String->Void) {
		this.requestData = requestData;
		this.onSuccess   = successFcn;
		this.onError     = errorFcn;
	}

	public function start(?opts: AjaxOptions): Dynamic {
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
   			error: function(jqXHR:JQXHR, textStatus:String, errorThrown:Dynamic) {
				var error_message:String = "";

				if (errorThrown == null || Std.is(errorThrown, String)) {
					error_message = errorThrown;

					if (jqXHR.message != null) {
						error_message = jqXHR.message;
					} else if (jqXHR.responseText != null && jqXHR.responseText.charAt(0) != "<") {
						error_message = jqXHR.responseText;
					}
		   		} else {
		   			error_message = textStatus + ":  " + errorThrown.message;
		   		}

   				if (onError != null) {
   					onError(jqXHR, textStatus, errorThrown);
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

class BennuRequest extends BaseRequest implements Requester {
	public static var channelId:String;

	public function new(path:String, data:String, successFcn: Dynamic->String->JQXHR->Void) {
		baseOpts = {
			async: true,
			url: AgentUi.URL + path 
		};

		super(data, successFcn);
	}
}

class CrudRequest extends BaseRequest implements Requester {

	public function new(object:ModelObj, verb:String, successFcn: Dynamic->String->JQXHR->Void):Void {
		var instance = AppContext.SERIALIZER.toJson(object);
		var crudMessage = new CrudMessage(object.objectType(), instance);

		baseOpts = {
			async: true,
			url: AgentUi.URL + "/api/" + verb
		};
		super(AppContext.SERIALIZER.toJsonString(crudMessage), successFcn);
	}
}

class UpsertRequest extends CrudRequest {
	public function new(object:ModelObj, successFcn: Dynamic->String->JQXHR->Void):Void {
		super(object, "upsert", successFcn);
	}	
}

class DeleteRequest extends CrudRequest {
	public function new(object:ModelObj, successFcn: Dynamic->String->JQXHR->Void):Void {
		super(object, "delete", successFcn);
	}	
}

class QueryRequest extends BaseRequest implements Requester {
	private var queryMessage:QueryMessage;

	public function new(type:String, where:String, successFcn: Dynamic->String->JQXHR->Void):Void {
		var queryMessage = new QueryMessage(type, where);
		baseOpts = {
			async: true,
			url: AgentUi.URL + "/api/query"
		};
		super(AppContext.SERIALIZER.toJsonString(queryMessage), successFcn);
	}
}

class LongPollingRequest extends BaseRequest implements Requester {

	private var jqXHR: Dynamic;
	private var running: Bool = true;

	public var timeout:Int = 30000;

	public function new(requestToRepeat: String, successFcn: Dynamic->String->JQXHR->Void, ?path:String, ?ajaxOpts:AjaxOptions) {
		var url = AgentUi.URL + "/api";
		if (path != null) {
			url = AgentUi.URL + path;
		}

		baseOpts = { 
			url: url,
	        complete: function(jqXHR:JQXHR, textStatus:String): Void {
	        	this.poll();
        	}, 
	        timeout: this.timeout 
        };

        if (ajaxOpts != null) {
    		JQ.extend(baseOpts, ajaxOpts);
    	}

		var wrappedSuccessFcn = function(data: Dynamic, textStatus: String, jqXHR: JQXHR) {
			SystemStatus.instance().onMessage();
			if (running) {
				successFcn(data, textStatus, jqXHR);
			}
		};
		var errorFcn = function(jqXHR:JQXHR, textStatus:String, errorThrown:String): Void {
	   		AppContext.LOGGER.error("Error executing ajax call | Response Code: " + jqXHR.status + " | " + jqXHR.message);
		};

		super(requestToRepeat, wrappedSuccessFcn, errorFcn);

		setupHotKey();
	}

	private function setupHotKey():Void {
		AgentUi.HOT_KEY_ACTIONS.push(function(evt: JQEvent): Void {
            if(evt.altKey && evt.shiftKey && evt.keyCode == 80 /* ALT+SHIFT+P */) {
                running = !running;
                AppContext.LOGGER.debug("Long Polling is running? " + running);
                poll();
            }
        });		
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
				AppContext.LOGGER.error("error on poll abort | " + err);
			}
		}
	}

	private function poll(): Void {
		if (running) {
			jqXHR = super.start();
		}
	}
}