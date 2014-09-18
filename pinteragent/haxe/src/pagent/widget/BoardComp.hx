package pagent.widget;

import m3.log.Logga;
import pagent.PinterContext;
import pagent.pages.PinterPageMgr;
import pagent.model.PinterModel;
import haxe.Json;
import m3.jq.JQ;
import m3.jq.JQDroppable;
import m3.jq.JQDraggable;
import m3.widget.Widgets;
import m3.observable.OSet;
import m3.exception.Exception;
import m3.util.UidGenerator;

import agentui.widget.FilterableComponent;
import qoid.model.ModelObj;
import agentui.model.Node;
import pagent.model.EM;
import qoid.Qoid;

using pagent.widget.BoardComp;
using m3.helper.OSetHelper;
using StringTools;

typedef BoardCompOptions  = { 
	var board: Label;
}

typedef BoardCompWidgetDef = {
	@:optional var options: BoardCompOptions;
	@:optional var filteredSet:FilteredSet<Label>;
	var _create: Void->Void;
	var _registerListeners: Void->Void;
	@:optional var _super: Void->Void;
	@:optional var _onupdate: Label->EventType->Void;
	@:optional var _onBoardConfig: ConfigContent->EventType->Void;
	@:optional var _onBoardCreatorProfile: Profile->EventType->Void;
	var destroy: Void->Void;
	var getLabel:Void->Label;

	@:optional var img: JQ;
	@:optional var nameDiv: JQ;
	@:optional var creatorDiv: JQ;
}

class BoardCompHelper {
	public static function getBoard(l: BoardComp): Label {
		return l.boardComp("getLabel");
	}
}
@:native("$")
extern class BoardComp extends JQ {

	@:overload(function<T>(cmd : String):T{})
	@:overload(function<T>(cmd:String, opt:String):T{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function boardComp(opts: BoardCompOptions): BoardComp;

	private static function __init__(): Void {
		var defineWidget: Void->BoardCompWidgetDef = function(): BoardCompWidgetDef {
			return {

		        getLabel: function():Label {
		        	var self: BoardCompWidgetDef = Widgets.getSelf();
		        	return self.options.board;
		        },

		        _registerListeners: function():Void {
		        	var self: BoardCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

			        self._onupdate = function(label:Label, t:EventType): Void {
						if (t.isAddOrUpdate()) {
							self.options.board = label;
				        } else if (t.isDelete()) {
				        	self.destroy();
				        	selfElement.remove();
				        }
		        	};
		        
		        	self.filteredSet = new FilteredSet<Label>(Qoid.labels, function(label:Label):Bool {
		        		return label.iid == self.options.board.iid;
		        	});
					self.filteredSet.listen(self._onupdate);

					self._onBoardConfig = function(mc: ConfigContent, evt: EventType) {
						if(mc.props.boardIid == self.options.board.iid) {
							try {
								self.img.attr("src", mc.props.defaultImg);
							} catch (err: Dynamic) {
								Logga.DEFAULT.error("problem using the default img");
							}
						}
					}


					PinterContext.boardConfigs.listen(self._onBoardConfig);
					PinterContext.sharedBoardConfigs.listen(self._onBoardConfig);

					self._onBoardCreatorProfile = function(p: Profile, evt: EventType) {
						if(evt.isAddOrUpdate()) {
							if(p.connectionIid == self.options.board.connectionIid) {
								// if(self.options.board.createdByConnectionIid != Qoid.currentAlias.iid) {

								// }
								self.creatorDiv.empty().append("<i>created by</i> " + p.name);

							}

						}
					}
					Qoid.profiles.listen(self._onBoardCreatorProfile);
		        },
		        
		        _create: function(): Void {
		        	var self: BoardCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
					if(!selfElement.is("div")) {
		        		throw new Exception("Root of BoardComp must be a div element");
		        	}

		        	selfElement.addClass("_boardComp ").attr("id", self.options.board.name.htmlEscape() + "_" + UidGenerator.create(8));

		        	self.nameDiv = new JQ("<div class='labelNameWrapper'></div>").appendTo(selfElement);
		        	self.nameDiv.append("<span class='boardLabel'>" + self.options.board.name + "</span>");
		        	selfElement.append("<br/>");
		        	self.img = new JQ("<img src='" + "media/board.jpg" + "' />").appendTo(selfElement);

		        	self.creatorDiv = new JQ("<div class='creatorDiv' style='margin-top: 10px;'></div>").appendTo(selfElement);

		        	self._registerListeners();

		        	selfElement.click(function(evt: JQEvent) {
		        			var pg = PinterPageMgr.MY_BOARD_SCREEN;
		        			if(self.options.board.connectionIid != Qoid.currentAlias.connectionIid) {
		        				pg = PinterPageMgr.BOARD_SCREEN;
		        			}
	            			PinterContext.CURRENT_BOARD = self.options.board.iid;
		        			PinterContext.PAGE_MGR.CURRENT_PAGE = pg;
	            			js.Browser.window.history.pushState(
	            				{}, 
	            				self.options.board.iid,
	            				"index.html?board=" + self.options.board.iid
            				);
		        		});
		        },

		        destroy: function() {
		        	var self: BoardCompWidgetDef = Widgets.getSelf();
		        	self.filteredSet.removeListener(self._onupdate);
		        	PinterContext.boardConfigs.removeListener(self._onBoardConfig);
		        	PinterContext.sharedBoardConfigs.removeListener(self._onBoardConfig);
		        	Qoid.profiles.removeListener(self._onBoardCreatorProfile);
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.boardComp", defineWidget());
	}	
}