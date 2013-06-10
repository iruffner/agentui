package ui.exception;


import haxe.CallStack;
using Lambda;

class Exception {

	public var callStack: Array<StackItem>;
	public var cause: Exception;
	public var message: String;

	public function new(?message: String, ?cause: Exception) {
		this.message = message;
		this.cause = cause;
		this.callStack = CallStack.callStack();
	}

	public function rootCause(): Exception {
		var ch = chain();
        return ch[ch.length-1];
	}	

	/**
	 chain of exceptions with this one first
	*/
	public function chain(): Array<Exception> {
		var chain = [];
		function gather(e: Exception) {
			if ( e != null ) {
				chain.push(e);
				gather(e.cause);
			}
		}
		gather(this);
		return chain;
	}

	public function stackTrace(): String {
		var l = new Array<String>();
        var index:Int = 0;
		for ( e in chain() ) {
			if(index++ > 0) l.push("CAUSED BY: " + e.message) 
			else l.push("ERROR: " + e.message);
			for ( s in e.callStack ) {
				l.push("  " + s);
			}
		}
		return l.join("\n");
	}

	public function messageList(): Array<String> {
		return chain().map(function(e) { return e.message; });
	}

}


class AjaxException extends Exception {
	public var statusCode: Int;

}