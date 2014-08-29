package m3.exception;

import m3.exception.Exception;

class ValidationException extends Exception {
	
	public function new(?message: String, ?cause: Exception) {
		super(message, cause);
		
	}
}