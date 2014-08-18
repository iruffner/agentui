
package qoid.widget;

import m3.jq.JQ;
import m3.jq.M3Menu;
import m3.jq.M3Dialog;
import m3.observable.OSet;
import m3.widget.Widgets;
import qoid.model.ModelObj;
import qoid.model.EM;
import m3.exception.Exception;

using m3.helper.OSetHelper;
using m3.helper.StringHelper;
using qoid.widget.UploadComp;
using qoid.widget.ConnectionAvatar;

typedef AlbumListOptions = {
	var title: String;
}

typedef AlbumListWidgetDef = {
	@:optional var options: AlbumListOptions;
	var _create: Void->Void;
	var destroy: Void->Void;
}

@:native("$")
extern class AlbumList extends JQ {

	@:overload(function<T>(cmd : String):T{})
	@:overload(function<T>(cmd:String, opt:String):T{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function albumList(opts: AlbumListOptions): AlbumList;

	private static function __init__(): Void {
		var defineWidget: Void->AlbumListWidgetDef = function(): AlbumListWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: AlbumListWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of AlbumList must be a div element");
		        	}

		        	selfElement.addClass("_albumList");

		        	var title: JQ = new JQ("<h2>" + self.options.title + "</h2>").appendTo(selfElement);

		        	EM.addListener(EMEvent.AliasLoaded, function(alias: Alias) {
		        		// self.selectedLabelComp = null;

	        			// Create the top-level label tree
	        			selfElement.children(".labelTree").remove();
						var labelTree: LabelTree = new LabelTree("<div id='labels' class='labelDT'></div>").labelTree({
			                parentIid:alias.rootLabelIid,
			                labelPath:[alias.rootLabelIid]
			            });
			        	labelTree.insertAfter(title);
        			}, "LabelsList-Alias");

		        	new JQ("<button>Add New Album</button>")
		        		.appendTo(selfElement)
		        		.button()
		        		.click(function(evt: JQEvent) {

		        			});
		        },

		       	

		        destroy: function() {
		        	var self: AlbumListWidgetDef = Widgets.getSelf();
		        	// if (self.aliasSet != null) {
	        		// 	self.aliasSet.removeListener(self._onupdate);
	        		// }
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.albumList", defineWidget());
	}
}