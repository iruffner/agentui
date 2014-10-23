package ap.widget;


import ap.APhotoContext;
import ap.model.APhotoModel.ConfigContent;
import ap.model.EM;
import m3.jq.JQ;
import m3.log.Logga;
import m3.widget.Widgets;
import m3.observable.OSet;
import m3.util.M;
import m3.exception.Exception;
import m3.util.JqueryUtil;
import qoid.model.ModelObj;
import agentui.widget.Popup;
import qoid.Qoid;

using m3.helper.OSetHelper;
using m3.helper.StringHelper;
using agentui.widget.UploadComp;

typedef AlbumDetailsOptions = {
	var label: Label;
	var parentIid: String;
}

typedef AlbumDetailsWidgetDef = {
	@:optional var options: AlbumDetailsOptions;
	
	@:optional var img: JQ;
	@:optional var nameDiv: JQ;

	var _create: Void->Void;
	var destroy: Void->Void;
	var _registerListeners: Void->Void;

	@:optional var _onAlbumConfig: ConfigContent->EventType->Void;
	@:optional var _onLabeledContent: LabeledContent->EventType->Void;

	
	var _showNewLabelPopup: Void->Void;
}

@:native("$")
extern class AlbumDetails extends JQ {

	@:overload(function(cmd : String):Bool{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function albumDetails(opts: AlbumDetailsOptions): AlbumDetails;

	private static function __init__(): Void {
		var defineWidget: Void->AlbumDetailsWidgetDef = function(): AlbumDetailsWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: AlbumDetailsWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of AlbumDetails must be a div element");
		        	}

		        	selfElement.addClass("_albumDetails");
		        	self.img = new JQ("<img src='" + "media/albums-icon.jpg" + "' />").appendTo(selfElement);
		        	selfElement.append("<br/>");
		        	self.nameDiv = new JQ("<div class='labelNameWrapper'></div>").appendTo(selfElement);
		        	self.nameDiv.append("<span class='albumLabel'>" + self.options.label.name + "</span>");

		        	self._registerListeners();

		        	new JQ("<button class='deleteButton'>Delete</button")
		        		.button({
		        			{
			                    icons: {
			                        primary: "ui-icon-trash"
			                      },
		                      	text: false
			                }
		        		})
		        		.appendTo(self.nameDiv)
		        		.click(function(evt: JQEvent) {
									JqueryUtil.confirm("Delete Album", "Are you sure you want to delete this album?", 
		        							function(){
		        								EM.change(
		        									EMEvent.DeleteLabel, 
		        									new EditLabelData(self.options.label, self.options.parentIid));
		        							}
		        						);
		        			});

		        	new JQ("<button class='editButton'>Edit</button")
		        		.button({
		        			{
			                    icons: {
			                        primary: "ui-icon-pencil"
			                      },
		                      	text: false
			                }
		        		})
		        		.appendTo(self.nameDiv)
		        		.click(function(evt: JQEvent) {
		        				self._showNewLabelPopup();
		        				evt.stopPropagation();
		        			});
			       	
		        },

		        _registerListeners: function():Void {
		        	var self: AlbumDetailsWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

			   //      self._onupdate = function(label:Label, t:EventType): Void {
						// if (t.isAddOrUpdate()) {
						// 	self.options.label = label;
				  //       } else if (t.isDelete()) {
				  //       	self.destroy();
				  //       	selfElement.remove();
				  //       }
		    //     	};
		        
		   //      	self.filteredSet = new FilteredSet<Label>(AppContext.LABELS, function(label:Label):Bool {
		   //      		return label.iid == self.options.album.iid;
		   //      	});
					// self.filteredSet.listen(self._onupdate);

					/* 
						this catches an updated ConfigContent, but no a new one since we don't have 
						the new LabeledContent record yet
					*/
					self._onAlbumConfig = function(mc: ConfigContent, evt: EventType) {
						var match: LabeledContent = Qoid.labeledContent.getElementComplex(mc.iid+"_"+self.options.label.iid, function(lc: LabeledContent): String {
								return lc.contentIid+"_"+lc.labelIid;
							});
						if(match != null) {
							try {
								self.img.attr("src", mc.props.defaultImg);
							} catch (err: Dynamic) {
								Logga.DEFAULT.error("problem using the default img");
							}
						}
					}
					APhotoContext.ALBUM_CONFIGS.listen(self._onAlbumConfig);

					self._onLabeledContent = function(lc: LabeledContent, evt: EventType) {
						if(evt.isAdd()) {
							if(lc.labelIid == self.options.label.iid) {
								var match: ConfigContent = APhotoContext.ALBUM_CONFIGS.getElement(lc.contentIid);

								if(match != null) {
									try {
										self.img.attr("src", match.props.defaultImg);
									} catch (err: Dynamic) {
										Logga.DEFAULT.error("problem using the default img");
									}
								}
							}
						}
					}
					Qoid.labeledContent.listen(self._onLabeledContent, false);
		        },

		        _showNewLabelPopup: function(): Void {
					var self: AlbumDetailsWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

        			var popup: Popup = new Popup("<div class='updateLabelPopup' style='position: absolute;width:300px;'></div>");
        			popup.appendTo(selfElement);
        			popup = popup.popup({
        					createFcn: function(el: JQ): Void {
        						var updateLabel: Void->Void = null;
        						var stopFcn: JQEvent->Void = function (evt: JQEvent): Void { evt.stopPropagation(); };
        						var enterFcn: JQEvent->Void = function (evt: JQEvent): Void { 
        							if(evt.keyCode == 13) {
        								updateLabel();
    								}
        						};

        						var container: JQ = new JQ("<div class='icontainer'></div>").appendTo(el);
        						container.click(stopFcn).keypress(enterFcn);
        						var parent: JQ = null;
        						container.append("<label for='labelName'>Name: </label> ");
        						var input: JQ = new JQ("<input id='labelName' class='ui-corner-all ui-widget-content' style='font-size: 20px;' value='New Label'/>").appendTo(container);
        						input.keypress(enterFcn).click(function(evt: JQEvent): Void {
        								evt.stopPropagation();
        								if(JQ.cur.val() == "New Label") {
        									JQ.cur.val("");
        								}
    								}).focus();
        						var buttonText = "Update Label";
    							input.val(self.options.label.name);
        						container.append("<br/>");
        						new JQ("<button class='fright ui-helper-clearfix' style='font-size: .8em;'>" + buttonText + "</button>")
        							.button()
        							.appendTo(container)
        							.click(function(evt: JQEvent): Void {
        								updateLabel();
        							});

        						updateLabel = function(): Void {
									if (input.val().length == 0) {return;}
									var label = self.options.label;
									Logga.DEFAULT.info("Update label | " + label.iid);
									label.name = input.val();
  									var eventData = new EditLabelData(label);
  									EM.change(EMEvent.UpdateLabel, eventData);
									new JQ("body").click();
        						};
        					},
        					positionalElement: self.nameDiv
        				});

					},

		        destroy: function() {
		        	var self: AlbumDetailsWidgetDef = Widgets.getSelf();
		        	APhotoContext.ALBUM_CONFIGS.removeListener(self._onAlbumConfig);
		        	Qoid.labeledContent.removeListener(self._onLabeledContent);
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.albumDetails", defineWidget());
	}
}