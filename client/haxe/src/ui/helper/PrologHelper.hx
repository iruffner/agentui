package ui.helper;

import m3.observable.OSet;
import m3.util.UidGenerator;

import ui.model.ModelObj;

using m3.helper.ArrayHelper;
using m3.helper.StringHelper;
using m3.helper.OSetHelper;
using Lambda;
using StringTools;



class PrologHelper {
	public static function tagTreeAsStrings(labels: OSet<Label>): Array<String> {
		var sarray: Array<String> = new Array<String>();
		var topLevelLabels: FilteredSet<Label> = new FilteredSet(labels, function(l: Label): Bool { return l.parentUid.isBlank(); });

		topLevelLabels.iter(function(l: Label): Void {
				var s: String = "";
				var children: FilteredSet<Label> = new FilteredSet(labels, function(f: Label): Bool { return f.parentUid == l.uid; });
				if(children.hasValues()) {
					s += "n" + l.text + "(" + _processTagChildren(labels, children) + ")";
				} else {
					s += "l" + l.text + "(_)";
				}

				sarray.push(s);
			});
		return sarray;
	}

	private static function _processTagChildren(original: OSet<Label>, set: FilteredSet<Label>): String {
		var str: String = set.fold(function(l: Label, s: String): String {
				if(s.isNotBlank()) {
					s += ",";
				}
				var children: FilteredSet<Label> = new FilteredSet(original, function(f: Label): Bool { return f.parentUid == l.uid; });
				if(children.hasValues()) {
					s += "n" + l.text + "(";
					s += _processTagChildren(original, children);
					s += ")";
				} else {
					s += "l" + l.text + "(_)";
				}

				return s;
			},
			"");
		return str;
	}

	public static function tagTreeFromString(str: String): Array<Label> {
		var larray: Array<Label> = new Array<Label>();
		var parser: LabelStringParser = new LabelStringParser(str);
		var term: String = parser.nextTerm();
		if(term != "and") { // there are multiple top level labels
			parser.restore(term);
		}
		larray = _processDataLogChildren(null, parser);
		return larray;
	}

	private static function _processDataLogChildren(parentLabel: Label, parser: LabelStringParser): Array<Label> {
		var larray: Array<Label> = new Array<Label>();
		var term: String = parser.nextTerm();
		if(term == "(") { // this was the leading paren
			term = parser.nextTerm();
		}

		while(term != null && term != ")") { //continue until we hit our closing paren or we are out of data [null]
			if(term.startsWith("n")) { // this node has children
				term = term.substring(1);
				var l: Label = new Label(term);
				l.uid = UidGenerator.create(10);
				if(parentLabel != null) l.parentUid = parentLabel.uid;
				larray.push(l);
				var children: Array<Label> = _processDataLogChildren(l, parser);
				larray = larray.concat(children);
			} else if(term.isNotBlank() && term.startsWith("l") /*!term.contains(",")*/) { // this is a leaf
				term = term.substring(1);
				var l: Label = new Label(term);
				l.uid = UidGenerator.create(10);
				if(parentLabel != null) l.parentUid = parentLabel.uid;
				larray.push(l);
				parser.nextTerm();// "("
				parser.nextTerm();// "_"
				parser.nextTerm();// ")"
			}
			term = parser.nextTerm();
		}

		return larray;
	}

	public static function labelsToProlog(contentTags: OSet<Label>): String {
		var sarray: Array<String> = [];

		contentTags.iter(function(label: Label): Void {
				var path: Array<String> = [];
				var traveler: Label = label;
				while(traveler != null) {
					path.push(traveler.text);
					traveler = AgentUi.USER.currentAlias.labelSet.getElement(traveler.parentUid);
				}
				sarray.push("[" + path.join(",") + "]");
			});

		return (sarray.length > 1? "each(":"") + sarray.join(",") + (sarray.length > 1? ")":"");
	}

	public static function connectionsToProlog(connections: OSet<Connection>): String {
		var sarray: Array<String> = [];
		connections.iter(function(c: Connection): Void {
				var s: String = "";
				sarray.push(
					AgentUi.SERIALIZER.toJsonString(c)
				);
			});

		// var childStr = render(tagTree, pathLabels);
		var str: String = sarray.join(",");
		return "all(" + (str.isBlank() ? "_" : "[" + str + "]") + ")";
	}
}