package m3.model;

using m3.helper.StringHelper;

class URL {
	public var protocol: String;
	public var domain: String;
	public var port: String;
	public var path: String;

	public function new(?protocol: String, ?domain: String, ?port: String, ?path: String) {
		this.protocol = protocol;
		this.domain = domain;
		this.port = port;
		this.path = path;
	}

	public function toString(): String {
		var url: String = "";
		if(this.protocol.isNotBlank()) {
			url += this.protocol + "://";
		}
		if(this.domain.isNotBlank()) {
			url += this.domain;
		}
		if(this.port.isNotBlank()) {
			url += ":" + this.port;
		}
		if(this.path.isNotBlank()) {
			url += "?" + this.path;
		}
		return url;
	}
}