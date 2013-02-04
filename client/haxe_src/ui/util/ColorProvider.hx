package ui.util;


class ColorProvider {
	private static var _COLORS: Array<String>;
	private static var _LAST_COLORS_USED: FixedSizeArray<Int>;

	private static function __init__(): Void {
		_COLORS = new Array<String>();
		_COLORS.push("#5C9BCC");
		_COLORS.push("#5C64CC");
		_COLORS.push("#8C5CCC");
		_COLORS.push("#C45CCC");
		_COLORS.push("#5CCCC4");
		_COLORS.push("#8BB8DA");
		_COLORS.push("#B9D4E9");
		_COLORS.push("#CC5C9B");
		_COLORS.push("#5CCC8C");
		_COLORS.push("#E9CEB9");
		_COLORS.push("#DAAD8B");
		_COLORS.push("#CC5C64");
		_COLORS.push("#64CC5C");
		_COLORS.push("#9BCC5C");
		_COLORS.push("#CCC45C");
		_COLORS.push("#CC8C5C");
		_LAST_COLORS_USED = new FixedSizeArray(10);
	}

	public static function getNextColor(): String {
		var index: Int;
		do {
			index = Std.random(_COLORS.length);
		} while( _LAST_COLORS_USED.contains(index));
		App.LOGGER.debug("index " + index);
		_LAST_COLORS_USED.push(index);
		return _COLORS[index];
	}
}