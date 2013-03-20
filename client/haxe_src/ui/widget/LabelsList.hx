package ui.widget;

import ui.jq.JQ;
import ui.model.ModelObj;
import ui.model.EventModel;
import ui.model.ModelEvents;
import ui.observable.OSet;
import ui.widget.LabelComp;

using ui.helper.StringHelper;

typedef LabelsListWidgetDef = {
	@:optional var labels: MappedSet<Label, LabelTreeBranch>;
	var _create: Void->Void;
	var _setLabels: ObservableSet<Label>->Void;
	var destroy: Void->Void;
}

extern class LabelsList extends JQ {
	@:overload(function(cmd : String):Bool{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function labelsList(): LabelsList;

	private static function __init__(): Void {
		untyped LabelsList = window.jQuery;
		var defineWidget: Void->LabelsListWidgetDef = function(): LabelsListWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: LabelsListWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new ui.exception.Exception("Root of LabelsList must be a div element");
		        	}

		        	selfElement.addClass("icontainer labelsList " + Widgets.getWidgetClasses());

		        	EventModel.addListener(ModelEvents.AliasLoaded, new EventListener(function(alias: Alias) {
		        			self._setLabels(alias.labels);
	        			})
		        	);

		        	var newLabelButton: JQ = new JQ("<button class='newLabelButton'>New Label</button>");
		        	selfElement.append(newLabelButton).append("<div class='clear'></div>");
		        	newLabelButton.button();

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