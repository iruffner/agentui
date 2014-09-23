package pagent.widget;

import m3.log.Logga;
import pagent.model.ContentSource;
import pagent.model.EM;
import m3.jq.JQ;
import m3.widget.Widgets;
import m3.observable.OSet;
import m3.util.M;
import m3.exception.Exception;
import m3.util.JqueryUtil;
import pagent.PinterContext;
import pagent.widget.ConnectionAvatar;
import qoid.model.ModelObj;
import agentui.widget.Popup;
import qoid.Qoid;
import qoid.QoidAPI;

using m3.helper.OSetHelper;
using m3.helper.StringHelper;
using agentui.widget.UploadComp;

typedef BoardDetailsOptions = {
	var label: Label;
	var parentIid: String;
    var showOptionBar: Bool;
}

typedef BoardDetailsWidgetDef = {
	@:optional var options: BoardDetailsOptions;
	
	@:optional var img: JQ;
    @:optional var nameDiv: JQ;
    @:optional var ownerDiv: JQ;
	@:optional var dotButton: JQ;

	var _create: Void->Void;
	var destroy: Void->Void;
	var _showEditPopup: JQ->Void;
	var _showDotPopup: JQ->Void;
    var _showAccessPopup: JQ->Void;
	var _showAddAccessPopup: JQ->Void;

    @:optional var _profileListener: Profile->EventType->Void;
    @:optional var _pinListener: String;
}

@:native("$")
extern class BoardDetails extends JQ {

	@:overload(function(cmd : String):Bool{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function boardDetails(opts: BoardDetailsOptions): BoardDetails;

	private static function __init__(): Void {
		var defineWidget: Void->BoardDetailsWidgetDef = function(): BoardDetailsWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: BoardDetailsWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of AlbumDetails must be a div element");
		        	}

		        	selfElement.addClass("_boardDetails");
		        	self.nameDiv = new JQ("<div class='labelNameWrapper'></div>").appendTo(selfElement);
		        	self.nameDiv.append("<span class='boardLabel'>" + self.options.label.name + "</span>");

                    if(self.options.showOptionBar) {
    		        	var bar: JQ = new JQ("<div class='optionBar ui-widget-content ui-corner-all'></div>").appendTo(selfElement);
    		        	self.ownerDiv = new JQ("<div class='fleft boardOwner'></div>").appendTo(bar);

                        if(self.options.label.connectionIid == Qoid.currentAlias.connectionIid) {
        		        	var editButton: JQ = new JQ("<button class='center'>Edit Board</button>")
        		        		.appendTo(bar)
        		        		.button()
        		        		.click(function(evt: JQEvent) {
        		        				evt.stopPropagation();
        		        				self._showEditPopup(JQ.cur);
        		        			});

        	        		self.dotButton = new JQ("<button class='center'>1 Degree of Trust</button>")
        		        		.appendTo(bar)
        		        		.button()
        		        		.click(function(evt: JQEvent) {
        		        				evt.stopPropagation();
        		        				self._showDotPopup(JQ.cur);
        		        			});

        	        		var accessButton: JQ = new JQ("<button class='center'>Access Control</button>")
        		        		.appendTo(bar)
        		        		.button()
        		        		.click(function(evt: JQEvent) {
        		        				evt.stopPropagation();
        		        				self._showAccessPopup(JQ.cur);
        		        			});

                            var acls: OSet<LabelAcl> = PinterContext.labelAclsByLabel.getElement(PinterContext.CURRENT_BOARD);
                            if (acls == null) {
                                acls = PinterContext.labelAclsByLabel.addEmptyGroup(PinterContext.CURRENT_BOARD);
                            }
                            if(acls.hasValues()) {
                               var dot: Int = Lambda.array(acls)[0].maxDegreesOfVisibility;
                               var str: String = "";
                               switch(dot) {
                                    case 1: str = "1 Degree of Trust";
                                    case _: str = dot + " Degrees of Trust";
                               }
                               self.dotButton.children("span").text(str);
                            }

                        } else {
                            // var editButton: JQ = new JQ("<button class='center'>Repin Board</button>")
                            //     .appendTo(bar)
                            //     .button()
                            //     .click(function(evt: JQEvent) {
                            //             evt.stopPropagation();
                            //             // self._showEditPopup(JQ.cur);
                            //         });
                        }



    	        		var pins: JQ = new JQ("<div class='fright pinCount'> pins</div>").appendTo(bar);
                        var pinCnt: JQ = new JQ("<span>0</span>").prependTo(pins);
                        var mapListener = function(content: Content<Dynamic>, contentComp:ContentComp, evt: EventType): Void {
                            if(content != null) {
                                if(evt.isAdd()) {
                                    pinCnt.text( Std.string(Std.parseInt(pinCnt.text()) + 1));
                                } else if (evt.isDelete()) {
                                    pinCnt.text( Std.string(Std.parseInt(pinCnt.text()) - 1));
                                }
                            } else if (evt.isClear()) {
                                pinCnt.text("0");
                            }
                        };
                        var widgetCreator = function(content:Content<Dynamic>):ContentComp {
                            return null;
                        }
                        self._pinListener = ContentSource.addListener(mapListener, JQ.noop, widgetCreator);
                        bar.append("<div class='clear'></div>");
                    } else {
                        self.ownerDiv = new JQ("<div class='boardOwner' style='font-size:20px;'></div>").appendTo(selfElement);
                    }

                    if(self.options.label.connectionIid == Qoid.currentAlias.connectionIid) {
                        self.ownerDiv.empty().text(Qoid.currentAlias.profile.name);
                    } else {
                        self._profileListener = function(p: Profile, evt: EventType) {
                            if(evt.isAddOrUpdate() && p.connectionIid == self.options.label.connectionIid) {
                                self.ownerDiv.empty().text(p.name);
                            }
                        }
                        Qoid.profiles.listen(self._profileListener);
                    }

		        },

		        _showEditPopup: function(positionalElem: JQ): Void {
					var self: BoardDetailsWidgetDef = Widgets.getSelf();
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
        								if(JQ.cur.val() == "New Board") {
        									JQ.cur.val("");
        								}
    								}).focus();
        						var buttonText = "Update Board";
    							input.val(self.options.label.name);
        						container.append("<br/>");
        						new JQ("<button class='fright ui-helper-clearfix' style='font-size: .8em;'>" + buttonText + "</button>")
        							.button()
        							.appendTo(container)
        							.click(function(evt: JQEvent): Void {
        								updateLabel();
        							});
        						new JQ("<button class='fleft ui-helper-clearfix' style='font-size: .8em;'>Delete Board</button>")
        							.button()
        							.appendTo(container)
        							.click(function(evt: JQEvent): Void {
        								JqueryUtil.confirm("Delete Board", "Are you sure you want to delete this board?", 
		        							function(){
		        								EM.change(
		        									EMEvent.DeleteLabel, 
		        									new EditLabelData(self.options.label, self.options.parentIid));
		        							}
		        						);
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
        					positionalElement: positionalElem
        				});

					},

				_showDotPopup: function(positionalElem: JQ): Void {
					var self: BoardDetailsWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

        			var popup: Popup = new Popup("<div class='updateDotPopup' style='position: absolute;width:300px;'></div>");
        			popup.appendTo(selfElement);
        			popup = popup.popup({
        					createFcn: function(el: JQ): Void {
        						var updateDot: Void->Void = null;
        						var stopFcn: JQEvent->Void = function (evt: JQEvent): Void { evt.stopPropagation(); };
        						var enterFcn: JQEvent->Void = function (evt: JQEvent): Void { 
        							if(evt.keyCode == 13) {
        								updateDot();
    								}
        						};

        						var container: JQ = new JQ("<div class='icontainer'></div>").appendTo(el);
        						container.click(stopFcn).keypress(enterFcn);
        						var parent: JQ = null;
        						container.append("<label for='labelName'>Degrees of Trust: </label> ");
        						var input: JQ = new JQ("<input id='labelName' type='number' min='1' max='5' class='ui-corner-all ui-widget-content' style='font-size: 20px;' value='" + self.dotButton.children("span").text().split(" ")[0] + "'/>").appendTo(container);
        						input.keypress(enterFcn).click(function(evt: JQEvent): Void {
        								evt.stopPropagation();
        								if(JQ.cur.val() == "New Board") {
        									JQ.cur.val("");
        								}
    								}).focus();
        						var buttonText = "Update Trust";
        						container.append("<br/>");
        						new JQ("<button class='fright ui-helper-clearfix' style='font-size: .8em;'>" + buttonText + "</button>")
        							.button()
        							.appendTo(container)
        							.click(function(evt: JQEvent): Void {
        								updateDot();
        							});

        						updateDot = function(): Void {
									var acls: OSet<LabelAcl> = PinterContext.labelAclsByLabel.getElement(PinterContext.CURRENT_BOARD);
                                    if(acls.hasValues()) {
                                       var dot: Int = Std.parseInt(input.val());
                                        if(dot < 1) {
                                            js.Lib.alert("Cannot set Degrees of Trust less than 1.");
                                            return;
                                        }
                                        Lambda.iter(acls, function(acl: LabelAcl): Void {
                                                acl.maxDegreesOfVisibility = dot;
                                                EM.change(EMEvent.UpdateAccess, acl);
                                            });
                                        var str: String = "";
                                        switch(dot) {
                                            case 1: str = "1 Degree of Trust";
                                            case _: str = dot + " Degrees of Trust";
                                        }
                                        self.dotButton.children("span").text(str);
                                        EM.listenOnce(EMEvent.OnUpdateAccess, function(n: {}) {
                                            new JQ("body").click();
                                        });
                                    } else {
                                        js.Lib.alert("Cannot set Degrees of Trust because this board has not yet been shared.");
                                    }
        						};
        					},
        					positionalElement: positionalElem
        				});

					},

				_showAccessPopup: function(positionalElem: JQ): Void {
					var self: BoardDetailsWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

        			var popup: Popup = new Popup("<div class='updateAccessPopup' style='position: absolute;width:300px;'></div>");
        			popup.appendTo(selfElement);
        			popup = popup.popup({
        					createFcn: function(el: JQ): Void {
        						var updateDot: Void->Void = null;
        						var stopFcn: JQEvent->Void = function (evt: JQEvent): Void { evt.stopPropagation(); };

        						var container: JQ = new JQ("<div class='icontainer'></div>").appendTo(el);
        						container.click(stopFcn);
        						container.append("<label for='' style='font-size: 18px;'>Connections with Access: <br/>(Click to remove)</label> ");
        						var connectionsContainer: JQ = new JQ("<div class='connectionsContainer'></div>").appendTo(el);
                                new JQ("<button>Grant Access</button>")
                                    .button()
                                    .appendTo(el)
                                    .click(function(evt: JQEvent) {
                                        evt.stopPropagation();
                                        js.Browser.document.body.click();
                                        self._showAddAccessPopup(positionalElem);
                                    });

        						var labels: OSet<LabelAcl> = PinterContext.labelAclsByLabel.getElement(PinterContext.CURRENT_BOARD);
                                if (labels == null) {
                                    labels = PinterContext.labelAclsByLabel.addEmptyGroup(PinterContext.CURRENT_BOARD);
                                }
        						if(labels != null)
                                    Lambda.iter(labels,
        								function(l: LabelAcl) {
                                            new ConnectionComp("<div class='ui-corner-all ui-state-active'></div>")
                                                .connectionComp({
                                                        connectionIid: l.connectionIid,
                                                        click: function() {
                                                            var parms = {
                                                                connectionIid: l.connectionIid,
                                                                labelIid: self.options.label.iid,
                                                            }
                                                            EM.change(EMEvent.RevokeAccess, parms);
                                                        }
                                                    })
                                                .appendTo(connectionsContainer);
        								}
        							);
        					},
        					positionalElement: positionalElem
        				});

					},

                _showAddAccessPopup: function(positionalElem: JQ): Void {
                    var self: BoardDetailsWidgetDef = Widgets.getSelf();
                    var selfElement: JQ = Widgets.getSelfElement();

                    var popup: Popup = new Popup("<div class='addAccessPopup' style='position: absolute;width:300px;'></div>");
                    popup.appendTo(selfElement);
                    popup = popup.popup({
                            createFcn: function(el: JQ): Void {
                                var updateDot: Void->Void = null;
                                var stopFcn: JQEvent->Void = function (evt: JQEvent): Void { evt.stopPropagation(); };

                                var container: JQ = new JQ("<div class='icontainer'></div>").appendTo(el);
                                container.click(stopFcn);
                                container.append("<label for='' style='font-size: 18px;'>Click Connection to Grant Access: </label> ");
                                var connectionsContainer: JQ = new JQ("<div class='connectionsContainer'></div>").appendTo(el);
                                

                                var labels: OSet<LabelAcl> = PinterContext.labelAclsByLabel.getElement(pagent.PinterContext.CURRENT_BOARD);
                                var connections: OSet<Connection> = Qoid.connections.filter(
                                    function(c: Connection): Bool {
                                            return labels == null || labels.getElementComplex(c.iid, function(l: LabelAcl) { return l.connectionIid; }) == null;
                                        });
                                if(connections != null)
                                    Lambda.iter(connections,
                                        function(c: Connection) {
                                            var connectionDiv: JQ = new JQ("<div class='connectionDiv ui-corner-all ui-state-active'></div>")
                                                .appendTo(connectionsContainer)
                                                .click(function(evt:JQEvent) {
                                                        var parms = {
                                                            connectionIid: c.iid,
                                                            labelIid: self.options.label.iid,
                                                        }
                                                        EM.change(EMEvent.GrantAccess, parms);
                                                    });
                                            var connAvatar: ConnectionAvatar = new ConnectionAvatar("<div></div>");
                                            connAvatar.appendTo(connectionDiv);
                                            var nameDiv: JQ = new JQ("<div></div>").appendTo(connectionDiv);
                                            connAvatar.connectionAvatar({
                                                        connectionIid: c.iid,
                                                        onProfileUpdate: function(p: Profile) {
                                                            nameDiv.empty().append(p.name);
                                                        }                                                   
                                                    });
                                            // new JQ("<div>" + c.)
                                        }
                                    );

                    
                                
                            },
                            positionalElement: positionalElem
                        });

                    },

		        destroy: function() {
                    var self: BoardDetailsWidgetDef = Widgets.getSelf();
                    Qoid.profiles.removeListener(self._profileListener);
                    ContentSource.removeListener(self._pinListener);
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.boardDetails", defineWidget());
	}
}