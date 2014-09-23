package pagent.widget;

import m3.log.Logga;
import pagent.pages.PinterPageMgr;
import pagent.PinterContext;
import pagent.model.EM;
import m3.jq.JQ;
import m3.observable.OSet;
import m3.widget.Widgets;
import m3.observable.OSet.ObservableSet;
import m3.exception.Exception;
import qoid.model.ModelObj;
import agentui.widget.Popup;
import qoid.Qoid;

using m3.helper.OSetHelper;

typedef OptionBarOptions = {
}

typedef OptionBarWidgetDef = {
	@:optional var options: OptionBarOptions;
	var _create: Void->Void;
	var destroy: Void->Void;
	var _showNewLabelPopup: JQ->Void;
	var _showImportLabelPopup: JQ->Void;

	@:optional var boardsDiv: JQ;
	@:optional var boardsCnt: Int;

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

		        	self.boardsDiv = new JQ("<div class='fleft boardCount' style='margin-right: 10px;'>0 Boards</div>")
		        		.appendTo(selfElement);
	        		self.boardsCnt = 0;

	        		new JQ("<button class='fleft'>New Board</button>")
	        			.appendTo(selfElement)
	        			.button()
	        			.click(function(evt: JQEvent) {
		        				evt.stopPropagation();
			        			self._showNewLabelPopup(JQ.cur);
		        			});

	        		new JQ("<button class='fleft'>Import</button>")
	        			.appendTo(selfElement)
	        			.button()
	        			.click(function(evt: JQEvent) {
		        				evt.stopPropagation();
			        			self._showImportLabelPopup(JQ.cur);
		        			});

        			new JQ("<button class='fright'>Followers</button>")
	        			.appendTo(selfElement)
	        			.button()
	        			.click(function(evt: JQEvent) {
		        				PinterContext.PAGE_MGR.CURRENT_PAGE = PinterPageMgr.FOLLOWERS_SCREEN;
		        			});

        			new JQ("<button class='fright'>Following</button>")
	        			.appendTo(selfElement)
	        			.button()
	        			.click(function(evt: JQEvent) {
		        				PinterContext.PAGE_MGR.CURRENT_PAGE = PinterPageMgr.FOLLOWING_SCREEN;
		        			});

        			selfElement.append("<div class='clear'></div>");


		        	if (Qoid.groupedLabelChildren.delegate().get(PinterContext.ROOT_BOARD.iid) == null) {
	        			Qoid.groupedLabelChildren.addEmptyGroup(PinterContext.ROOT_BOARD.iid);
    				}
		        	
	        		self._onUpdateBoards = function(board: Label, evt: EventType): Void {
	        			if(board != null && board.iid == PinterContext.COMMENTS.iid) return;
	            		if(evt.isAdd()) {
	            			self.boardsCnt += 1;
							var str: String = "";
							switch(self.boardsCnt) {
							    case 1: str = "1 Board";
							    case _: str = self.boardsCnt + " Boards";
							}
							self.boardsDiv.text(str);
	            		} else if (evt.isDelete()) {
	            			self.boardsCnt -= 1;
							var str: String = "";
							switch(self.boardsCnt) {
							    case 1: str = "1 Board";
							    case _: str = self.boardsCnt + " Boards";
							}
							self.boardsDiv.text(str);
	            		} else if (evt.isClear()) {
	            			self.boardsDiv.text("0 Boards");
	            			self.boardsCnt = 0;
	            		}
	            	};

            		self.boards = new MappedSet<LabelChild, Label>(Qoid.groupedLabelChildren.delegate().get(PinterContext.ROOT_BOARD.iid), 
		        		function(labelChild: LabelChild): Label {
		        			return Qoid.labels.getElementComplex(labelChild.childIid);
	        		});
		        	self.boards.visualId = "root_map";

		        	self.boards.listen(self._onUpdateBoards);

		        },

		        _showNewLabelPopup: function(reference: JQ): Void {
					var self: OptionBarWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

        			var popup: Popup = new Popup("<div class='newLabelPopup' style='position: absolute;width:300px;'></div>");
        			popup.appendTo(selfElement);
        			popup = popup.popup({
        					createFcn: function(el: JQ): Void {
        						var createLabel: Void->Void = null;
        						var updateLabel: Void->Void = null;
        						var stopFcn: JQEvent->Void = function (evt: JQEvent): Void { evt.stopPropagation(); };
        						var enterFcn: JQEvent->Void = function (evt: JQEvent): Void { 
        							if(evt.keyCode == 13) {
        								createLabel();
    								}
        						};

        						var container: JQ = new JQ("<div class='icontainer'></div>").appendTo(el);
        						container.click(stopFcn).keypress(enterFcn);
        						
        						container.append("<br/><label for='labelName'>Name: </label> ");
        						var input: JQ = new JQ("<input id='labelName' class='ui-corner-all ui-widget-content' value='New Label'/>").appendTo(container);
        						input.keypress(enterFcn).click(function(evt: JQEvent): Void {
        								evt.stopPropagation();
        								if(JQ.cur.val() == "New Label") {
        									JQ.cur.val("");
        								}
    								}).focus();
        						container.append("<br/>");
        						new JQ("<button class='fright ui-helper-clearfix' style='font-size: .8em;'>Add Board</button>")
        							.button()
        							.appendTo(container)
        							.click(function(evt: JQEvent): Void {
        								createLabel();
        							});

        						createLabel = function(): Void {
									if (input.val().length == 0) {return;}
									Logga.DEFAULT.info("Create new label | " + input.val());
									var label: Label = new Label();
									label.name = input.val();
  									var eventData = new EditLabelData(label, PinterContext.ROOT_BOARD.iid);
  									EM.change(EMEvent.CreateLabel, eventData);
									new JQ("body").click();
        						};
        					},
        					positionalElement: reference
        				});

				},

				_showImportLabelPopup: function(reference: JQ): Void {
					var self: OptionBarWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

        			var popup: Popup = new Popup("<div class='updateAlbumPopup' style='position: absolute;width:400px;'></div>");
        			popup.appendTo(selfElement);
        			popup = popup.popup({
        					createFcn: function(el: JQ): Void {
        						var updateLabels: Void->Void = null;
        						var stopFcn: JQEvent->Void = function (evt: JQEvent): Void { evt.stopPropagation(); };
        						var enterFcn: JQEvent->Void = function (evt: JQEvent): Void { 
        							if(evt.keyCode == 13) {
        								updateLabels();
    								}
        						};

        						var container: JQ = new JQ("<div class='icontainer'></div>").appendTo(el);
        						container.click(stopFcn).keypress(enterFcn);
    							container.append("<label for='labelParent'>Import: </label> ");
        						var select: JQ = new JQ("<select id='labelParent' class='ui-corner-left ui-widget-content' style='width: 191px;'></select>").appendTo(container);
        						select.click(stopFcn);
        						var iter: Iterator<Label> = Qoid.labels.iterator();
        						while(iter.hasNext()) {
        							var label: Label = iter.next();
        							// if (label.iid != PinterContext.CURRENT_BOARD && label.iid != PinterContext.COMMENTS.iid) {
	        							var option = "<option value='" + label.iid + "'>" + label.name + "</option>";
	        							select.append(option);
	        						// }
        						}
        						var buttonText = "Import";
        						container.append("<br/>");
        						new JQ("<button class='fright ui-helper-clearfix' style='font-size: .8em;'>" + buttonText + "</button>")
        							.button()
        							.appendTo(container)
        							.click(function(evt: JQEvent): Void {
        								updateLabels();
        							});

        						updateLabels = function(): Void {
                                    var eld: EditLabelData = new EditLabelData(Qoid.labels.getElement(select.val()));
                                    eld.newParentId = PinterContext.ROOT_BOARD.iid;
                                    EM.change(EMEvent.CopyLabel, eld);
									new JQ("body").click();
        						};
        					},
        					positionalElement: reference
        				});

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