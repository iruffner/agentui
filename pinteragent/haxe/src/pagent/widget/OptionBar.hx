package pagent.widget;

import pagent.AppContext;
import pagent.PinterContext;
import pagent.model.EM;
import m3.jq.JQ;
import m3.observable.OSet;
import m3.widget.Widgets;
import m3.observable.OSet.ObservableSet;
import m3.exception.Exception;
import qoid.model.ModelObj;
import qoid.widget.Popup;

using m3.helper.OSetHelper;

typedef OptionBarOptions = {
}

typedef OptionBarWidgetDef = {
	@:optional var options: OptionBarOptions;
	var _create: Void->Void;
	var destroy: Void->Void;
	var _showNewLabelPopup: JQ->Void;

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
	        			.button()
	        			.click(function(evt: JQEvent) {
		        				evt.stopPropagation();
			        			self._showNewLabelPopup(JQ.cur);
		        			});

        			new JQ("<button>All Pins...</button>")
	        			.appendTo(selfElement)
	        			.button();

        			new JQ("<button class='fright'>Followers</button>")
	        			.appendTo(selfElement)
	        			.button();

        			new JQ("<button class='fright'>Following</button>")
	        			.appendTo(selfElement)
	        			.button();


		        	if (AppContext.GROUPED_LABELCHILDREN.delegate().get(PinterContext.ROOT_BOARD.iid) == null) {
	        			AppContext.GROUPED_LABELCHILDREN.addEmptyGroup(PinterContext.ROOT_BOARD.iid);
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

            		self.boards = new MappedSet<LabelChild, Label>(AppContext.GROUPED_LABELCHILDREN.delegate().get(PinterContext.ROOT_BOARD.iid), 
		        		function(labelChild: LabelChild): Label {
		        			return AppContext.LABELS.getElementComplex(labelChild.childIid);
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
									AppContext.LOGGER.info("Create new label | " + input.val());
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