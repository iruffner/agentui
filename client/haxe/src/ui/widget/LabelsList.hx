package ui.widget;

import m3.exception.Exception;
import m3.jq.JQ;
import m3.jq.M3Menu;
import m3.observable.OSet;
import m3.util.UidGenerator;
import m3.util.JqueryUtil;
import m3.widget.Widgets;

import ui.model.ModelObj;
import ui.model.EM;
import ui.widget.LabelComp;

using m3.helper.StringHelper;
using ui.widget.LabelComp;

typedef LabelsListWidgetDef = {
	@:optional var labels: ObservableSet<Label>;
	@:optional var selectedLabelComp:LabelComp;
	var _create: Void->Void;
	var _setLabels: ObservableSet<Label>->Void;
	var _showNewLabelPopup:JQ->Void;
	var destroy: Void->Void;
}

@:native("$")
extern class LabelsList extends JQ {
	@:overload(function(cmd : String):Bool{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function labelsList(): LabelsList;

	private static function __init__(): Void {
		var defineWidget: Void->LabelsListWidgetDef = function(): LabelsListWidgetDef {
			return {
				_showNewLabelPopup: function(reference: JQ): Void {
					var self: LabelsListWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

        			var popup: Popup = new Popup("<div style='position: absolute;width:300px;'></div>");
        			popup.appendTo(selfElement);
        			popup = popup.popup({
        					createFcn: function(el: JQ): Void {
        						var createLabel: Void->Void = null;
        						var stopFcn: JQEvent->Void = function (evt: JQEvent): Void { evt.stopPropagation(); };
        						var enterFcn: JQEvent->Void = function (evt: JQEvent): Void { 
        							if(evt.keyCode == 13) {
        								createLabel();
    								}
        						};

        						var container: JQ = new JQ("<div class='icontainer'></div>").appendTo(el);
        						container.click(stopFcn).keypress(enterFcn);
        						container.append("<label for='labelParent'>Parent: </label> ");
        						var parent: JQ = new JQ("<select id='labelParent' class='ui-corner-left ui-widget-content' style='width: 191px;'><option value='" + AppContext.AGENT.currentAlias.rootLabelIid+ "'>No Parent</option></select>").appendTo(container);
        						parent.click(stopFcn);
        						var iter: Iterator<Label> = AppContext.AGENT.currentAlias.labelSet.iterator();
        						while(iter.hasNext()) {
        							var label: Label = iter.next();
        							var option = "<option value='" + label.iid + "'";
        							if (self.selectedLabelComp != null && self.selectedLabelComp.getLabel().iid == label.iid) {
        								option += " SELECTED";
        							}
        							option += ">" + label.name + "</option>";
        							parent.append(option);
        						}
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

									if (input.val().length > 0) {
										AppContext.LOGGER.info("Create new label | " + input.val());
										var label: Label = new Label();
										label.name = input.val();
      									AppContext.LOGGER.debug("add to " + self.labels.visualId);
      									var eventData = {label:label, parentIid:parent.val()};
	  									EM.change(EMEvent.CreateLabel, eventData);
										new JQ("body").click();
									}
        						};
        					},
        					positionalElement: reference
        				});

					},

		        _create: function(): Void {
		        	var self: LabelsListWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of LabelsList must be a div element");
		        	}

		        	selfElement.addClass("icontainer labelsList " + Widgets.getWidgetClasses());

		        	EM.addListener(EMEvent.AliasLoaded, new EMListener(function(alias: Alias) {
		        			self._setLabels(alias.labelSet);
	        			}, "LabelsList-Alias")
		        	);

		        	var newLabelButton: JQ = new JQ("<button class='newLabelButton'>New Label</button>");
		        	selfElement.append(newLabelButton).append("<div class='clear'></div>");
		        	newLabelButton.button().click(function(evt: JQEvent): Void {
		        			evt.stopPropagation();
		        			self.selectedLabelComp = null;
		        			self._showNewLabelPopup(newLabelButton);
		        		});

					var getLabelDescendents = function(label:Label, label_list:Array<Label>):Void {

						var getDescendentIids:String->Array<String>->Void;
						getDescendentIids = function(iid:String, iidList:Array<String>):Void {
							iidList.insert(0, iid);
							var children: Array<LabelChild> = new FilteredSet(AppContext.LABELCHILDS, function(lc:LabelChild):Bool {
								return lc.parentIid == iid;
							}).asArray();

							for (i in 0...children.length) {
								getDescendentIids(children[i].childIid, iidList);
							}
						};

						var iid_list = new Array<String>();
						getDescendentIids(label.iid, iid_list);
						for (iid_ in iid_list) {
							label_list.push(AppContext.LABELMAP.get(iid_));
						}
					};

		        	var menu: M3Menu = new M3Menu("<ul id='label-action-menu'></ul>");
		        	menu.appendTo(selfElement);
        			menu.m3menu({
        				classes: "container shadow",
    					menuOptions: [
    						{ 
    							label: "New Child Label",
    							icon: "ui-icon-circle-plus",
    							action: function(evt: JQEvent, m: M3Menu): Dynamic {
    								evt.stopPropagation();
    								var reference:JQ = self.selectedLabelComp;
    								if (reference == null) {
    									reference = new JQ(evt.target);
    								}
    								self._showNewLabelPopup(reference);
    								menu.hide();
    								return false;
    							}
    						},
    						{ 
    							label: "Delete Label",
    							icon: "ui-icon-circle-minus",
    							action: function(evt: JQEvent, m: M3Menu): Void {
    								if (self.selectedLabelComp != null) {
    									JqueryUtil.confirm("Delete Label", "Are you sure you want to delete this label?", 
   		        							function(){
   		        								var labelsToDelete:Array<Label> = [];
   		        								getLabelDescendents(self.selectedLabelComp.getLabel(), labelsToDelete);

   		        								EM.change(EMEvent.DeleteLabels, labelsToDelete);

   		        								for (i in 0...labelsToDelete.length) {
	   		        								self.labels.delete(labelsToDelete[i]);
	   		        							}
   		        							}
   		        						);
    								} else {
    								}
    							}
    						}

    					],
    					width: 225
    				}).hide();
		        
					selfElement.bind("contextmenu",function(evt: JQEvent): Dynamic {
	        			menu.show();
	        			menu.position({
	        				my: "left top",
	        				of: evt
	        			});

	        			var target = new JQ(evt.target);

	        			if (!target.hasClass("labelComp")) {
	        				var parents = target.parents(".labelComp");
	        				if (parents.length > 0) {
	        					target = new JQ(parents[0]);
	        				} else {
	        					target = null;
	        				}
	        			}

	        			if (target != null) {
	        				self.selectedLabelComp = new LabelComp(target);
	        			} else {
	        				self.selectedLabelComp = null;
	        			}

						evt.preventDefault();
	        			evt.stopPropagation();
	        			return false;
					});

		        },

		        _setLabels: function(labels: ObservableSet<Label>): Void {
		        	var self: LabelsListWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

					self.labels = labels;

					selfElement.children(".labelTree").remove();

					var labelTree: LabelTree = new LabelTree("<div id='labels' class='labelDT'></div>").labelTree({
		                labels: labels 
		            });

		        	selfElement.prepend(labelTree);

		        	var jqevent:JQEvent = null;
	        	},
		        
		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.labelsList", defineWidget());
	}
}
