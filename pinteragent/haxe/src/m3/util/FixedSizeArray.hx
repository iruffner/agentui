package m3.util;

using m3.helper.ArrayHelper;

class FixedSizeArray<T> {

	private var _delegate: Array<T>;
	private var _maxSize: Int;

	public function new(maxSize: Int) {
		_maxSize = maxSize;
		_delegate = new Array<T>();
	}

	public function push(t: T): Void {
		if(_delegate.length >= _maxSize) {
			_delegate.shift();
		}
		_delegate.push(t);
	}

	public function contains(t: T): Bool {
		return _delegate.contains(t);
	}
	
}