package pagent.widget;

import pagent.PinterContext;
import pagent.model.EM;
import m3.jq.JQ;
import m3.jq.M3Menu;
import m3.jq.M3Dialog;
import m3.observable.OSet;
import m3.widget.Widgets;
import m3.exception.Exception;

import qoid.model.ModelObj;
import agentui.widget.Popup;
import qoid.Qoid;

using m3.helper.OSetHelper;
using m3.helper.StringHelper;
using agentui.widget.UploadComp;
using pagent.widget.ConnectionAvatar;

typedef BoardListOptions = {
	@:optional var title: String;
	@:optional var boardList: ObservableSet<Label>;
}

typedef BoardListWidgetDef = {
	@:optional var options: BoardListOptions;
	var _create: Void->Void;
	var destroy: Void->Void;

	@:optional var mappedLabelChilds: MappedSet<LabelChild, BoardComp>;
	@:optional var mappedLabels: MappedSet<Label, BoardComp>;
	@:optional var onchangeLabelChildren: BoardComp->EventType->Void;
	
	@:optional var listenerId: String;
}

@:native("$")
extern class BoardList extends JQ {

	@:overload(function<T>(cmd : String):T{})
	@:overload(function<T>(cmd:String, opt:String):T{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function boardList(?opts: BoardListOptions): BoardList;

	private static function __init__(): Void {
		var defineWidget: Void->BoardListWidgetDef = function(): BoardListWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: BoardListWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of BoardList must be a div element");
		        	}

		        	selfElement.addClass("_boardList");

		        	if(self.options.title.isNotBlank())
		        		new JQ("<h2>" + self.options.title + "</h2>").appendTo(selfElement);

			        self.onchangeLabelChildren = function(BoardComp: BoardComp, evt: EventType): Void {
	            		if(evt.isAdd()) {
	            			selfElement.append(BoardComp);
	            		} else if (evt.isUpdate()) {
	            			throw new Exception("this should never happen");
	            		} else if (evt.isDelete()) {
	            			BoardComp.remove();
	            		}
	            	};

		        	if(self.options.boardList == null) {
						if (Qoid.groupedLabelChildren.delegate().get(PinterContext.ROOT_BOARD.iid) == null) {
		        			Qoid.groupedLabelChildren.addEmptyGroup(PinterContext.ROOT_BOARD.iid);
	    				}

	            		self.mappedLabelChilds = new MappedSet<LabelChild, BoardComp>(Qoid.groupedLabelChildren.delegate().get(PinterContext.ROOT_BOARD.iid), 
			        		function(labelChild: LabelChild): BoardComp {
			        			return new BoardComp("<div></div>").boardComp({
			        				board: Qoid.labels.getElementComplex(labelChild.childIid)
			        			});
		        		});
			        	self.mappedLabelChilds.visualId = "root_map";

			        	self.mappedLabelChilds.listen(self.onchangeLabelChildren);
		        	} else {
		        		self.mappedLabels = new MappedSet<Label, BoardComp>(self.options.boardList, 
			        		function(label: Label): BoardComp {
			        			return new BoardComp("<div></div>").boardComp({
			        				board: label
			        			});
		        		});

		        		self.mappedLabels.visualId = "boardList_map";

			        	self.mappedLabels.listen(self.onchangeLabelChildren);
		        		
		        	}
		        },

		        destroy: function() {
		        	var self: BoardListWidgetDef = Widgets.getSelf();
		        	if(self.mappedLabelChilds != null && self.onchangeLabelChildren != null) 
		        		self.mappedLabelChilds.removeListener(self.onchangeLabelChildren);
	        		if(self.mappedLabels != null && self.onchangeLabelChildren != null) 
	        			self.mappedLabels.removeListener(self.onchangeLabelChildren);
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.boardList", defineWidget());
	}
}