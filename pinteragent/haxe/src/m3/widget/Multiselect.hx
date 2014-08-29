package m3.widget;

import m3.jq.JQ;

typedef MultiselectOptions = {
	@:optional var header: Bool;//true,
	@:optional var height: Int;//175,
	@:optional var minWidth: Int;//225,
	@:optional var classes: String;//'',
	@:optional var checkAllText: String;//'Check all',
	@:optional var uncheckAllText: String;//'Uncheck all',
	@:optional var noneSelectedText: String;//'Select options',
	@:optional var selectedText: String;//'# selected',
	@:optional var selectedList: Int;//0,
	@:optional var show: String;//null,
	@:optional var hide: String;//null,
	@:optional var autoOpen: Bool;//false,
	@:optional var multiple: Bool;//true,
	@:optional var position: Dynamic;//{},
	@:optional var appendTo: String;//"body"
}

typedef MultiselectFilterOptions = {
	@:optional var label: String;//"Filter",
	@:optional var width: Int;//null,
	@:optional var placeholder: String;//225,
	@:optional var autoReset: Bool;//false,
}

class MultiselectHelper {
	public static function refresh(m: Multiselect): Void {
		return m.multiselect("refresh");
	}

	public static function open(m: Multiselect): Void {
		return m.multiselect("open");
	}

	public static function close(m: Multiselect): Void {
		return m.multiselect("close");
	}

	public static function getButton(m: Multiselect): JQ {
		return m.multiselect("getButton");
	}

	public static function option<T>(m: Multiselect, optName: String, ?optValue: Dynamic): T {
		return m.multiselect("option", optName, optValue);
	}
}

@:native("$")
extern class Multiselect extends JQ {
	
	@:overload(function<T>(cmd: String, ?arg1: Dynamic, ?arg2: Dynamic): T{})
	function multiselect(opts: MultiselectOptions): Multiselect;

	function multiselectfilter(?opts: MultiselectFilterOptions): Multiselect;

}