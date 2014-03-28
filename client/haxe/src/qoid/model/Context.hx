package ui.model;
import m3.exception.Exception;


class Context {
	public var iid:String;
	public var numResponsesExpected:Int;
	public var oncomplete:String;

	public function new(context:String) {
		var c = context.split("-");
		if (c.length != 3) {
			throw new Exception("invalid context");
		}
		this.iid = c[0];
		this.numResponsesExpected = Std.parseInt(c[1]);
		this.oncomplete = c[2];
	}
}