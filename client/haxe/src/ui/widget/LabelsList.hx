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
using m3.helper.OSetHelper;

typedef LabelsListWidgetDef = {
	@:optional var selectedLabelComp:LabelComp;
	var _create: Void->Void;
	var _showNewLabelPopup:JQ->Bool->Void;
	var destroy: Void->Void;
	var getSelected: Void->LabelComp;
}


class LabelsListHelper {
	public static function getSelected(l: LabelsList): LabelComp {
		return l.labelsList("getSelected");
	}
}

@:native("$")
extern class LabelsList extends JQ {
	@:overload(function<T>(cmd : String):T{})
	@:overload(function<T>(cmd:String, opt:String):T{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function labelsList(): LabelsList;

	private static function __init__(): Void {
		var defineWidget: Void->LabelsListWidgetDef = function(): LabelsListWidgetDef {
			return {
				getSelected: function() : LabelComp {
					var self: LabelsListWidgetDef = Widgets.getSelf();
					return self.selectedLabelComp;
				},
				_showNewLabelPopup: function(reference: JQ, isUpdate:Bool): Void {
					var self: LabelsListWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

        			var popup: Popup = new Popup("<div style='position: absolute;width:300px;'></div>");
        			popup.appendTo(selfElement);
        			popup = popup.popup({
        					createFcn: function(el: JQ): Void {
        						var createLabel: Void->Void = null;
        						var updateLabel: Void->Void = null;
        						var stopFcn: JQEvent->Void = function (evt: JQEvent): Void { evt.stopPropagation(); };
        						var enterFcn: JQEvent->Void = function (evt: JQEvent): Void { 
        							if(evt.keyCode == 13) {
        								if (isUpdate) {updateLabel();}
        								else {createLabel();};
    								}
        						};

        						var container: JQ = new JQ("<div class='icontainer'></div>").appendTo(el);
        						container.click(stopFcn).keypress(enterFcn);
        						var parent: JQ = null;
        						if (!isUpdate) {
	        						container.append("<label for='labelParent'>Parent: </label> ");
	        						parent = new JQ("<select id='labelParent' class='ui-corner-left ui-widget-content' style='width: 191px;'><option value='" + AppContext.alias.rootLabelIid+ "'>No Parent</option></select>").appendTo(container);
	        						parent.click(stopFcn);
	        						var aliasLabels = AppContext.getLabelDescendents(AppContext.alias.rootLabelIid);
	        						var iter: Iterator<Label> = aliasLabels.iterator();
	        						while(iter.hasNext()) {
	        							var label: Label = iter.next();
	        							if (label.iid != AppContext.alias.rootLabelIid) {
		        							var option = "<option value='" + label.iid + "'";
		        							if (self.selectedLabelComp != null && self.selectedLabelComp.getLabel().iid == label.iid) {
		        								option += " SELECTED";
		        							}
		        							option += ">" + label.name + "</option>";
		        							parent.append(option);
		        						}
	        						}
	        					}
        						container.append("<br/><label for='labelName'>Name: </label> ");
        						var input: JQ = new JQ("<input id='labelName' class='ui-corner-all ui-widget-content' value='New Label'/>").appendTo(container);
        						input.keypress(enterFcn).click(function(evt: JQEvent): Void {
        								evt.stopPropagation();
        								if(JQ.cur.val() == "New Label") {
        									JQ.cur.val("");
        								}
    								}).focus();
        						var buttonText = "Add Label";
        						if (isUpdate) {
        							buttonText = "Update Label";
        							input.val(self.selectedLabelComp.getLabel().name);
        						}
        						container.append("<br/>");
        						new JQ("<button class='fright ui-helper-clearfix' style='font-size: .8em;'>" + buttonText + "</button>")
        							.button()
        							.appendTo(container)
        							.click(function(evt: JQEvent): Void {
        								if (isUpdate) {updateLabel();}
        								else {createLabel();};
        							});

        						createLabel = function(): Void {
									if (input.val().length == 0) {return;}
									AppContext.LOGGER.info("Create new label | " + input.val());
									var label: Label = new Label();
									label.name = input.val();
  									var eventData = new EditLabelData(label, parent.val());
  									EM.change(EMEvent.CreateLabel, eventData);
									new JQ("body").click();
        						};

        						updateLabel = function(): Void {
									if (input.val().length == 0) {return;}
									var label = self.selectedLabelComp.getLabel();
									AppContext.LOGGER.info("Update label | " + label.iid);
									label.name = input.val();
  									var eventData = new EditLabelData(label);
  									EM.change(EMEvent.UpdateLabel, eventData);
									new JQ("body").click();
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
		        	self.selectedLabelComp = null;
		        	EM.addListener(EMEvent.AliasLoaded, new EMListener(function(alias: Alias) {
		        		self.selectedLabelComp = null;

	        			// Create the top-level label tree
	        			selfElement.children(".labelTree").remove();
						var labelTree: LabelTree = new LabelTree("<div id='labels' class='labelDT'></div>").labelTree({
			                parentIid:alias.rootLabelIid
			            });
			        	selfElement.prepend(labelTree);
        			}, "LabelsList-Alias"));

		        	var newLabelButton: JQ = new JQ("<button class='newLabelButton'>New Label</button>");
		        	selfElement.append(newLabelButton).append("<div class='clear'></div>");
		        	newLabelButton.button().click(function(evt: JQEvent): Void {
		        			evt.stopPropagation();
		        			self.selectedLabelComp = null;
		        			self._showNewLabelPopup(newLabelButton, false);
		        		});

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
    								self._showNewLabelPopup(reference, false);
    								menu.hide();
    								return false;
    							}
    						},
    						{ 
    							label: "Edit Label",
    							icon: "ui-icon-pencil",
    							action: function(evt: JQEvent, m: M3Menu): Dynamic {
    								evt.stopPropagation();
    								var reference:JQ = self.selectedLabelComp;
    								if (reference == null) {
    									reference = new JQ(evt.target);
    								}
    								self._showNewLabelPopup(reference, true);
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
   		        								EM.change(EMEvent.DeleteLabel, 
   		        									new EditLabelData(self.selectedLabelComp.getLabel(), 
   		        										              self.selectedLabelComp.parentIid()));
   		        							}
   		        						);
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

		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.labelsList", defineWidget());
	}
}

// TODO:  Add a listener to MASTER_LABELS.  On the add event, check to see if the 
// label that was added is a child of the selected label.  If it is, expand that
// labelTreeBranch...