package m3.util;

class Tuple<L,R> {
	public var left: L;
	public var right: R;

	public function new(?l: L, ?r: R) {
		this.left = l;
		this.right = r;
	}
}