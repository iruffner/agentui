package ap.widget;

import ap.APhotoContext;

import ap.model.EM;
import m3.jq.JQ;
import m3.jq.M3Menu;
import m3.jq.M3Dialog;
import m3.log.Logga;
import m3.observable.OSet;
import m3.widget.Widgets;
import m3.exception.Exception;

import qoid.model.ModelObj;
import agentui.widget.Popup;
import qoid.Qoid;

using m3.helper.OSetHelper;
using m3.helper.StringHelper;
using agentui.widget.UploadComp;
using ap.widget.ConnectionAvatar;

typedef AlbumListOptions = {
	var title: String;
}

typedef AlbumListWidgetDef = {
	@:optional var options: AlbumListOptions;
	var _create: Void->Void;
	var destroy: Void->Void;

	@:optional var mappedLabels: MappedSet<LabelChild, AlbumComp>;
	@:optional var onchangeLabelChildren: AlbumComp->EventType->Void;
	
	var _showNewLabelPopup: JQ->Void;
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

		        	new JQ("<button class='newAlbumButton'>+</button>")
		        		.appendTo(selfElement)
		        		.button()
		        		.click(function(evt: JQEvent) {
		        				evt.stopPropagation();
			        			self._showNewLabelPopup(JQ.cur);
		        			});
					if (Qoid.groupedLabelChildren.delegate().get(APhotoContext.ROOT_ALBUM.iid) == null) {
	        			Qoid.groupedLabelChildren.addEmptyGroup(APhotoContext.ROOT_ALBUM.iid);
    				}

    				selfElement.append("<br/>");
			        self.onchangeLabelChildren = function(albumComp: AlbumComp, evt: EventType): Void {
	            		if(evt.isAdd()) {
	            			selfElement.append(albumComp);
	            		} else if (evt.isUpdate()) {
	            			throw new Exception("this should never happen");
	            		} else if (evt.isDelete()) {
	            			albumComp.remove();
	            		}
	            	};

            		self.mappedLabels = new MappedSet<LabelChild, AlbumComp>(Qoid.groupedLabelChildren.delegate().get(APhotoContext.ROOT_ALBUM.iid), 
		        		function(labelChild: LabelChild): AlbumComp {
		        			return new AlbumComp("<div></div>").albumComp({
		        				album: Qoid.labels.getElementComplex(labelChild.childIid)
		        			});
	        		});
		        	self.mappedLabels.visualId = "root_map";

		        	self.mappedLabels.listen(self.onchangeLabelChildren);
		        },

		       	_showNewLabelPopup: function(reference: JQ): Void {
					var self: AlbumListWidgetDef = Widgets.getSelf();
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
        						new JQ("<button class='fright ui-helper-clearfix' style='font-size: .8em;'>Add Label</button>")
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
  									var eventData = new EditLabelData(label, APhotoContext.ROOT_ALBUM.iid);
  									EM.change(EMEvent.CreateLabel, eventData);
									new JQ("body").click();
        						};
        					},
        					positionalElement: reference
        				});

					},

		        destroy: function() {
		        	var self: AlbumListWidgetDef = Widgets.getSelf();
	        		if(self.mappedLabels != null && self.onchangeLabelChildren != null) 
	        			self.mappedLabels.removeListener(self.onchangeLabelChildren);
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.albumList", defineWidget());
	}
}