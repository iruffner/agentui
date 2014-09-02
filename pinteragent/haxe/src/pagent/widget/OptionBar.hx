package pagent.widget;

import pagent.AppContext;
import pagent.PinterContext;
import m3.jq.JQ;
import m3.observable.OSet;
import m3.widget.Widgets;
import qoid.model.ModelObj;
import m3.observable.OSet.ObservableSet;
import m3.exception.Exception;

using m3.helper.OSetHelper;

typedef OptionBarOptions = {
}

typedef OptionBarWidgetDef = {
	@:optional var options: OptionBarOptions;
	var _create: Void->Void;
	var destroy: Void->Void;

	@:optional var boardsBtn: JQ;

	@:optional var boards:MappedSet<LabelChild, Label>;
	@:optional var _onUpdateBoards: Label->EventType->Void;
}

class OptionBarHelper {
	
}

@:native("$")
extern class OptionBar extends JQ {
	
	@:overload(function<T>(cmd : String):T{})
	@:overload(function<T>(cmd:String, opt:Dynamic):T{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function optionBar(?opts: OptionBarOptions): OptionBar;

	static function __init__(): Void {
		var defineWidget: Void->OptionBarWidgetDef = function(): OptionBarWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: OptionBarWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
					if(!selfElement.is("div")) {
		        		throw new Exception("Root of OptionBar must be a div element");
		        	}

		        	selfElement.addClass("_optionBar ui-widget-content ui-corner-all");

		        	self.boardsBtn = new JQ("<button>0 Boards</button>")
		        		.appendTo(selfElement)
		        		.button();

	        		new JQ("<button>New Board...</button>")
	        			.appendTo(selfElement)
	        			.button();

        			new JQ("<button>All Pins...</button>")
	        			.appendTo(selfElement)
	        			.button();

        			new JQ("<button class='fright'>Followers</button>")
	        			.appendTo(selfElement)
	        			.button();

        			new JQ("<button class='fright'>Following</button>")
	        			.appendTo(selfElement)
	        			.button();


		        	if (AppContext.GROUPED_LABELCHILDREN.delegate().get(PinterContext.ROOT_ALBUM.iid) == null) {
	        			AppContext.GROUPED_LABELCHILDREN.addEmptyGroup(PinterContext.ROOT_ALBUM.iid);
    				}
		        	
	        		self._onUpdateBoards = function(board: Label, evt: EventType): Void {
	            		if(evt.isAdd()) {
	            			// selfElement.append(albumComp);
	            		} else if (evt.isUpdate()) {
	            			throw new Exception("this should never happen");
	            		} else if (evt.isDelete()) {
	            			// albumComp.remove();
	            		} else if (evt.isClear()) {

	            		}
	            	};

            		self.boards = new MappedSet<LabelChild, Label>(AppContext.GROUPED_LABELCHILDREN.delegate().get(PinterContext.ROOT_ALBUM.iid), 
		        		function(labelChild: LabelChild): Label {
		        			return AppContext.LABELS.getElementComplex(labelChild.childIid);
	        		});
		        	self.boards.visualId = "root_map";

		        	self.boards.listen(self._onUpdateBoards);

		        },

		        destroy: function() {
		        	var self: OptionBarWidgetDef = Widgets.getSelf();
		        	if (self.boards != null) {
			        	self.boards.removeListener(self._onUpdateBoards);
		        	}

		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.optionBar", defineWidget());
	}	
}