package ui.exception;

import ui.api.ProtocolMessage;
import m3.exception.Exception;

class InitializeSessionException extends Exception {
	public var initSessErr: InitializeSessionError;

	public function new(error: InitializeSessionError, ?message: String, ?cause: Exception) {
		super(message, cause);
		this.initSessErr = error;
	}
}