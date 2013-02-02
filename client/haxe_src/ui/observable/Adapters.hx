package embi.observable;


import embi.observable.OSet;
import embi.mdjq.JQ;

class Adapters {

	public static function attachComboBox<T>(observable: OSet<T>, comboBox: JQ, getters: { key: T->String, value: T->String } ) {

		var values = new Hash<T3<T,String,String>>();

		observable.listen(function(t, type) {
   			var id = observable.identifier()(t);
			function add() {
				var t3 = new T3(t, getters.key(t), getters.value(t));
				values.set(id, t3);
				var option = new JQ('<option></option>').attr("value", t3._2).text(t3._1);
				comboBox.append(option);
			}
			function remove() {
				var t3 = values.get(id);
				var options: JQ = comboBox.find("option");
				var removeFn = function(i: Int, dom: js.Dom.HtmlDom) {
					var option = new JQ(dom);
					if ( option.val() == t3._1 ) {
						option.remove();
					}
				};
				options.each(removeFn);
			}
			if ( type == EventType.Add ) {
				add();
			} else if ( type == EventType.Update ) {
				remove();
				add();
			} else if ( type == EventType.Delete ) {
				remove();
			}
		});

	}

}

class T2<T0,T1> {

	public var _0: T0;
	public var _1: T1;

	public function new(_0: T0, _1: T1) {
		this._0 = _0;
		this._1 = _1;
	}

}

class T3<T0,T1,T2> {

	public var _0: T0;
	public var _1: T1;
	public var _2: T2;

	public function new(_0: T0, _1: T1, _2: T2) {
		this._0 = _0;
		this._1 = _1;
		this._2 = _2;
	}

}
