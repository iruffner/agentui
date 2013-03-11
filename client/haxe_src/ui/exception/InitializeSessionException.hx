package ui.exception;

import ui.api.ProtocolMessage;

class InitializeSessionException extends Exception {
	public var error: InitializeSessionError;

	public function new(error: InitializeSessionError, ?message: String, ?cause: Exception) {
		super(message, cause);
		this.error = error;
	}
}