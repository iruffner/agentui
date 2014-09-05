package pagent.widget;

import pagent.AppContext;
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
import qoid.widget.Popup;
import qoid.widget.UploadComp;

using m3.helper.OSetHelper;
using m3.helper.StringHelper;
using qoid.widget.UploadComp;

typedef BoardDetailsOptions = {
	var label: Label;
	var parentIid: String;
	var owner: String;
}

typedef BoardDetailsWidgetDef = {
	@:optional var options: BoardDetailsOptions;
	
	@:optional var img: JQ;
	@:optional var nameDiv: JQ;

	var _create: Void->Void;
	var destroy: Void->Void;
	var _showEditPopup: JQ->Void;
	var _showDotPopup: JQ->Void;
    var _showAccessPopup: JQ->Void;
	var _showAddAccessPopup: JQ->Void;
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

		        	var bar: JQ = new JQ("<div class='optionBar ui-widget-content ui-corner-all'></div>").appendTo(selfElement);
		        	bar.append("<div class='fleft boardOwner'>" + self.options.owner + "</div>");

		        	var editButton: JQ = new JQ("<button class='center'>Edit Board</button>")
		        		.appendTo(bar)
		        		.button()
		        		.click(function(evt: JQEvent) {
		        				evt.stopPropagation();
		        				self._showEditPopup(JQ.cur);
		        			});

	        		var dotButton: JQ = new JQ("<button class='center'>1 Degree of Trust</button>")
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

	        		var pins: JQ = new JQ("<div class='fright pinCount'> 0 pins </div>").appendTo(bar);
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
									AppContext.LOGGER.info("Update label | " + label.iid);
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
        						var input: JQ = new JQ("<input id='labelName' type='number' min='1' max='5' class='ui-corner-all ui-widget-content' style='font-size: 20px;' value=''/>").appendTo(container);
        						input.keypress(enterFcn).click(function(evt: JQEvent): Void {
        								evt.stopPropagation();
        								if(JQ.cur.val() == "New Board") {
        									JQ.cur.val("");
        								}
    								}).focus();
        						var buttonText = "Update Trust";
    							input.val(self.options.label.name);
        						container.append("<br/>");
        						new JQ("<button class='fright ui-helper-clearfix' style='font-size: .8em;'>" + buttonText + "</button>")
        							.button()
        							.appendTo(container)
        							.click(function(evt: JQEvent): Void {
        								updateDot();
        							});

        						updateDot = function(): Void {
									if (input.val().length == 0) {return;}
									var label = self.options.label;
									AppContext.LOGGER.info("Update label | " + label.iid);
									label.name = input.val();
  									var eventData = new EditLabelData(label);
  									EM.change(EMEvent.UpdateLabel, eventData);
									new JQ("body").click();
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

        						var labels: OSet<LabelAcl> = AppContext.LABELACLS_ByLabel.getElement(pagent.PinterContext.CURRENT_BOARD);
        						if(labels != null)
                                    Lambda.iter(labels,
        								function(l: LabelAcl) {
                                            var connectionDiv: JQ = new JQ("<div class='connectionDiv ui-corner-all ui-state-active'></div>")
                                                .appendTo(connectionsContainer)
                                                .click(function(evt:JQEvent) {
                                                        var parms = {
                                                            connectionIid: l.connectionIid,
                                                            labelIid: self.options.label.iid,
                                                        }
                                                        EM.change(EMEvent.RevokeAccess, parms);
                                                    });
                                            var connAvatar: ConnectionAvatar = new ConnectionAvatar("<div></div>");
                                            connAvatar.appendTo(connectionDiv);
                                            var nameDiv: JQ = new JQ("<div></div>").appendTo(connectionDiv);
                                            connAvatar.connectionAvatar({
                                                        connectionIid: l.connectionIid,
                                                        onProfileUpdate: function(p: Profile) {
                                                            nameDiv.empty().append(p.name);
                                                        }                                                   
                                                    });
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
                                

                                var labels: OSet<LabelAcl> = AppContext.LABELACLS_ByLabel.getElement(pagent.PinterContext.CURRENT_BOARD);
                                var connections: OSet<Connection> = AppContext.CONNECTIONS.filter(
                                    function(c: Connection): Bool {
                                            return labels == null || labels.getElementComplex(c.iid, function(l: LabelAcl) { return l.connectionIid; }) == null;
                                        });
                                if(connections != null)
                                    Lambda.iter(connections,
                                        function(c: Connection) {
                                            var connectionDiv: JQ = new JQ("<div class='connectionDiv ui-corner-all ui-state-active'></div>")
                                                .appendTo(connectionsContainer)
                                                .click(function(evt:JQEvent) {
                                                        // EM.listenOnce(EMEvent.AccessGranted, function(n: {}): Void {
                                                        //     selfElement.close();
                                                        // });

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
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.boardDetails", defineWidget());
	}
}