package pagent.widget;

import pagent.PinterContext;
import pagent.AppContext;
import pagent.model.EM;
import m3.jq.JQ;
import m3.jq.M3Menu;
import m3.jq.M3Dialog;
import m3.observable.OSet;
import m3.widget.Widgets;
import m3.exception.Exception;

import qoid.model.ModelObj;
import qoid.widget.Popup;

using m3.helper.OSetHelper;
using m3.helper.StringHelper;
using qoid.widget.UploadComp;
using pagent.widget.ConnectionAvatar;

typedef BoardListOptions = {
	var title: String;
}

typedef BoardListWidgetDef = {
	@:optional var options: BoardListOptions;
	var _create: Void->Void;
	var destroy: Void->Void;

	@:optional var mappedLabels: MappedSet<LabelChild, BoardComp>;
	@:optional var onchangeLabelChildren: BoardComp->EventType->Void;
	
	// var _showNewLabelPopup: JQ->Void;

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

		        	// new JQ("<button class='newBoardButton'>+</button>")
		        	// 	.appendTo(selfElement)
		        	// 	.button()
		        	// 	.click(function(evt: JQEvent) {
		        	// 			evt.stopPropagation();
			        // 			self._showNewLabelPopup(JQ.cur);
		        	// 		});
					if (AppContext.GROUPED_LABELCHILDREN.delegate().get(PinterContext.ROOT_BOARD.iid) == null) {
	        			AppContext.GROUPED_LABELCHILDREN.addEmptyGroup(PinterContext.ROOT_BOARD.iid);
    				}

			        self.onchangeLabelChildren = function(BoardComp: BoardComp, evt: EventType): Void {
	            		if(evt.isAdd()) {
	            			selfElement.append(BoardComp);
	            		} else if (evt.isUpdate()) {
	            			throw new Exception("this should never happen");
	            		} else if (evt.isDelete()) {
	            			BoardComp.remove();
	            		}
	            	};

            		self.mappedLabels = new MappedSet<LabelChild, BoardComp>(AppContext.GROUPED_LABELCHILDREN.delegate().get(PinterContext.ROOT_BOARD.iid), 
		        		function(labelChild: LabelChild): BoardComp {
		        			return new BoardComp("<div></div>").boardComp({
		        				board: AppContext.LABELS.getElementComplex(labelChild.childIid)
		        			});
	        		});
		        	self.mappedLabels.visualId = "root_map";

		        	self.mappedLabels.listen(self.onchangeLabelChildren);
		        },

		   //     	_showNewLabelPopup: function(reference: JQ): Void {
					// var self: BoardListWidgetDef = Widgets.getSelf();
					// var selfElement: JQ = Widgets.getSelfElement();

     //    			var popup: Popup = new Popup("<div class='newLabelPopup' style='position: absolute;width:300px;'></div>");
     //    			popup.appendTo(selfElement);
     //    			popup = popup.popup({
     //    					createFcn: function(el: JQ): Void {
     //    						var createLabel: Void->Void = null;
     //    						var updateLabel: Void->Void = null;
     //    						var stopFcn: JQEvent->Void = function (evt: JQEvent): Void { evt.stopPropagation(); };
     //    						var enterFcn: JQEvent->Void = function (evt: JQEvent): Void { 
     //    							if(evt.keyCode == 13) {
     //    								createLabel();
    	// 							}
     //    						};

     //    						var container: JQ = new JQ("<div class='icontainer'></div>").appendTo(el);
     //    						container.click(stopFcn).keypress(enterFcn);
        						
     //    						container.append("<br/><label for='labelName'>Name: </label> ");
     //    						var input: JQ = new JQ("<input id='labelName' class='ui-corner-all ui-widget-content' value='New Label'/>").appendTo(container);
     //    						input.keypress(enterFcn).click(function(evt: JQEvent): Void {
     //    								evt.stopPropagation();
     //    								if(JQ.cur.val() == "New Label") {
     //    									JQ.cur.val("");
     //    								}
    	// 							}).focus();
     //    						container.append("<br/>");
     //    						new JQ("<button class='fright ui-helper-clearfix' style='font-size: .8em;'>Add Label</button>")
     //    							.button()
     //    							.appendTo(container)
     //    							.click(function(evt: JQEvent): Void {
     //    								createLabel();
     //    							});

     //    						createLabel = function(): Void {
					// 				if (input.val().length == 0) {return;}
					// 				AppContext.LOGGER.info("Create new label | " + input.val());
					// 				var label: Label = new Label();
					// 				label.name = input.val();
  			// 						var eventData = new EditLabelData(label, PinterContext.ROOT_BOARD.iid);
  			// 						EM.change(EMEvent.CreateLabel, eventData);
					// 				new JQ("body").click();
     //    						};
     //    					},
     //    					positionalElement: reference
     //    				});

					// },

		        destroy: function() {
		        	var self: BoardListWidgetDef = Widgets.getSelf();
		        	EM.removeListener(EMEvent.AliasLoaded, self.listenerId);
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.boardList", defineWidget());
	}
}