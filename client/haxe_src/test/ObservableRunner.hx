package test;


import ui.observable.OSet;
import ui.M;
import ui.jq.JQ;
using StringTools;
using Lambda;

class ObservableRunner {
	

	static function main() {
		new JQ("document").ready(function (event) {
			new ObservableRunner().start();
		});
	}

	var _mainDiv: JQ;

	public function new() {		
	}

	public function start() {
		_mainDiv = new JQ("#tests_go_here");
		// buildSimpleOSetExample();
		buildMenuExample();
	}

	function buildSimpleOSetExample() {

		var div = new JQ("<div></div>");

		_mainDiv.append(div);

		var input = new JQ("<input size=\"20\" type=\"text\"></input>");
		var button = new JQ("<button>add</button>");

		div.append(input).append(button).append("<br/><br/>");

		var filterTextInput = new JQ("<input size=\"20\" type=\"text\"></input>");
		div.append(filterTextInput).append("<br/><br/>");

		var set = new ObservableSet(M.fn1(it));

		set.listen(M.fn2(trace("set -- " + _0 + " -- " + _1.name())));

		button.click(function(evt: js.JQuery.JqEvent): Void {
			set.add(input.val());
		});

		var mapper = function(t) {
			return new JQ("<div>BOOYAKA!! " + t + "<div>");
		}

		var widgetSet = new MappedSet(set, M.fn1(new JQ("<div>BOOYAKA!! " + it + "</div><br/>")));
		new SimpleDivInjector(widgetSet, div);

		widgetSet.listen(M.fn2(trace("widgetSet -- " + _0 + " -- " + _1.name())));

		var filter: String->Bool = function(it) {
			var f = filterTextInput.val();
			trace("checking -- " + it + " -- " + f);
			return it.startsWith(f);
		}

		var filteredSet = new FilteredSet(set, filter);
		set.listen(M.fn2(trace("filteredSet -- " + _0 + " -- " + _1.name())));

		var filteredWidgetSet = new MappedSet<String,JQ>(filteredSet, M.fn1(new JQ("<div>Filtered!! " + it + "</div><br/>")));
		new SimpleDivInjector(filteredWidgetSet, div);

		filteredWidgetSet.listen(M.fn2(trace("filteredWidgetSet -- " + _0 + " -- " + _1.name())));


		var refilter = function(evt) {
			filteredSet.refilter();
		};
		filterTextInput.keyup(refilter);

	}

	function buildMenuExample() {

		var menuItems = new ObservableSet<MenuItem>(M.fn1(it.uid));

		// setup the filter
		var filterTextInput = new JQ("<input size=\"20\" type=\"text\"></input>");

		var filterFn = function(it: MenuItem) {
			var f = filterTextInput.val();
			return it.description.startsWith(f) || it.category.startsWith(f);
		};

		var filteredMenuItems = new FilteredSet(menuItems, filterFn);

		filterTextInput.keyup(function(evt) {
			filteredMenuItems.refilter();
		});

		var categorizedItems = new GroupedSet<MenuItem>(filteredMenuItems, M.fn1(it.category));

		buildMenuItemAdder(menuItems, _mainDiv);

		_mainDiv.append("<br/><br/>").append("Filter:").append(filterTextInput).append("<br/><br/>");

		var div = new JQ("<div></div>");		
		_mainDiv.append(div);

		categorizedItems.listen(function(_, type) {
			var s = "";
			categorizedItems.delegate().iter(function(set) {
				var first = true;
				set.delegate().iter(function(mi) {
					if ( first ) {
						first = false;
						s += mi.category + "\n";
					}
					s += "     " + mi.uid + " -- " + mi.description + "\n";
			 	});
			});
			div.empty();
			div.append("<pre>" + s + "</pre>");
		});

	}

	function buildMenuItemAdder(menuItems: ObservableSet<MenuItem>, mainDiv: JQ) {
		var uidIndex = 1000;

		var category = new JQ("<input size=\"20\" type=\"text\"></input>");
		var description= new JQ("<input size=\"20\" type=\"text\"></input>");
		var button = new JQ("<button>add</button>");

		button.click(function(evt: js.JQuery.JqEvent): Void {
			var uid = "" + uidIndex;
			uidIndex += 1;
			trace("adding " + uid);
			menuItems.add({
				uid: uid,
				category: category.val(),
				description: description.val()
			});
		});

		var div = new JQ("<div></div>");

		div.append("Category:").append(category)
			.append("Description:").append(description)
			.append(button)
			.append("<br/><br/>")
			;

		mainDiv.append(div);

	}

}



class SimpleDivInjector {

	var _set: OSet<JQ>;
	public var parent: JQ;

	public function new(set: OSet<JQ>, jq: JQ) {
		_set = set;		
		parent = new JQ("<div></div>");
		jq.append(parent);
		_set.listen(function(widget, type) {
			if ( type == EventType.Add ) {
				parent.append(widget);
			} else if ( type.isDelete() ) {
				widget.remove();
			}
		});
	}

}

typedef MenuItem = {
	var uid: String;
	var category: String;
	var description: String;
}

