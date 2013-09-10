package ui.widget;

import m3.jq.JQ;
import m3.widget.Widgets;
import ui.model.ModelObj;
import ui.model.EventModel;
import ui.model.ModelEvents;
import m3.observable.OSet;
import ui.widget.LabelComp;
import m3.util.UidGenerator;
import m3.exception.Exception;

using m3.helper.StringHelper;

typedef LabelsListWidgetDef = {
	@:optional var labels: MappedSet<Label, LabelTreeBranch>;
	var _create: Void->Void;
	var _setLabels: ObservableSet<Label>->Void;
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
		        _create: function(): Void {
		        	var self: LabelsListWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of LabelsList must be a div element");
		        	}

		        	selfElement.addClass("icontainer labelsList " + Widgets.getWidgetClasses());

		        	EventModel.addListener(ModelEvents.AliasLoaded, new EventListener(function(alias: Alias) {
		        			self._setLabels(alias.labelSet);
	        			})
		        	);

		        	var newLabelButton: JQ = new JQ("<button class='newLabelButton'>New Label</button>");
		        	selfElement.append(newLabelButton).append("<div class='clear'></div>");
		        	newLabelButton.button().click(function(evt: JQEvent): Void {
		        			evt.stopPropagation();
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
		        						var parent: JQ = new JQ("<select id='labelParent' class='ui-corner-left ui-widget-content' style='width: 191px;'><option>No Parent</option></select>").appendTo(container);
		        						parent.click(stopFcn);
		        						var iter: Iterator<Label> = ui.AgentUi.USER.currentAlias.labelSet.iterator();
		        						while(iter.hasNext()) {
		        							var label: Label = iter.next();
		        							parent.append("<option value='" + label.uid + "'>" + label.text + "</option>");
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
        									AgentUi.LOGGER.info("Create new label | " + input.val());
        									//create new label
        									var label: Label = new Label();
        									label.parentUid = parent.val();
        									label.text = input.val();
        									label.uid = UidGenerator.create();
        									EventModel.change(ModelEvents.CreateLabel, label);
        									new JQ("body").click();
		        						};
		        					},
		        					positionalElement: newLabelButton
		        				});
		        		});

		        	// EventModel.addListener(ModelEvents.User, new EventListener(function(user: User) {
			        //        	self._setLabels(user.currentAlias.labels);
			        //     })
			        // );
		        },

		        _setLabels: function(labels: ObservableSet<Label>): Void {
		        	var self: LabelsListWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

					selfElement.children(".labelTree").remove();
					var labelTree: LabelTree = new LabelTree("<div id='labels' class='labelDT'></div>").labelTree({
		                labels: new FilteredSet(labels, function(label: Label): Bool { 
		                        return label.parentUid.isBlank();
		                    })
		            });

		        	selfElement.prepend(labelTree);
	        	},
		        
		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.labelsList", defineWidget());
	}
}