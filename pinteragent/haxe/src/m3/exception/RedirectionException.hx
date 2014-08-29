package m3.exception;

import m3.jqm.pages.Page;

class RedirectionException extends Exception {
	
	public var location: Page;

	public function new(?message: String, ?cause: Exception, ?location: Page) {
		super(message, cause);
		this.location = location;
	}
}