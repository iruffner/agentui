package ui.widget;

import haxe.Timer;

import m3.exception.Exception;
import m3.jq.JQ;
import m3.jq.JQDroppable;
import m3.jq.M3Menu;
import m3.observable.OSet;
import m3.util.JqueryUtil;
import m3.widget.Widgets;

import ui.model.EM;
import ui.model.ModelObj;
import ui.widget.DialogManager;

using ui.widget.ConnectionComp;
using Lambda;

typedef ConnectionsTabsOptions = {
}

typedef ConnectionsTabsWidgetDef = {
	@:optional var options: ConnectionsTabsOptions;
	var _create: Void->Void;
	var _addTab:String->String->Void;
	var destroy: Void->Void;
	@:optional var aliases: OSet<Alias>;
	@:optional var _listener: Alias->EventType->Void;
}

@:native("$")
extern class ConnectionsTabs extends JQ {
	@:overload(function<T>(cmd : String):T{})
	@:overload(function<T>(cmd:String, opt:String):T{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function connectionsTabs(?opts: ConnectionsTabsOptions): ConnectionsTabs;

	private static function __init__(): Void {
		var defineWidget: Void->ConnectionsTabsWidgetDef = function(): ConnectionsTabsWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: ConnectionsTabsWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
					if(!selfElement.is("div")) {
		        		throw new Exception("Root of ConnectionsTabs must be a div element");
		        	}
		        	selfElement.addClass(Widgets.getWidgetClasses() + " connectionTabs");

		        	// Create the tabs element
		        	new JQ("#connectionsTabs").tabs();

		        	// Set up a listener for aliases and use it to create additional alias lists/tabs
		        	self._listener = function(a:Alias, evt:EventType):Void {
		        		if (evt.isAdd()) {
		        			self._addTab(a.iid, a.profile.name);
		        		} else if (evt.isDelete()) {
		        			new JQ("#tab-" + a.iid).remove();
		        			new JQ("#connections-" + a.iid).remove();
		        		}
		        	}

		        	self.aliases = new SortedSet<Alias>(AppContext.ALIASES, function(a:Alias):String {
						return a.profile.name.toLowerCase();
					});

		        	EM.addListener(EMEvent.InitialDataLoadComplete, function(n:{}) {
			        	// Create a connections list for all connections
			        	self._addTab("all", "All");
			        	new JQ("#tab-all").click();

				        self.aliases.listen(self._listener);
				    });

				    EM.addListener(EMEvent.AliasLoaded, function(alias: Alias): Void {
				    	new JQ("#tab-" + alias.iid).click();
				    });
			    },

			    _addTab: function(iid:String, name:String) {
			    	var self: ConnectionsTabsWidgetDef = Widgets.getSelf();
			    	var tabs = new JQ("#connectionsTabs");
        			var ul = new JQ("#connectionsTabsHeader");
					var tab = new JQ("<li><a id='tab-" + iid + "' href='#connections-" + iid + "'>" + name + "</a></li>").appendTo(ul);
					var connectionDiv = new JQ("<div id='connections-" + iid + "'></div>" ).appendTo(tabs);
        			// Create a new tab for the alias
        			var cl = new ConnectionsList("#connections-" + iid).connectionsList();
					tabs.tabs("refresh");
			    },
		        
		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }

		    };
		}
		JQ.widget( "ui.connectionsTabs", defineWidget());
	}	
}