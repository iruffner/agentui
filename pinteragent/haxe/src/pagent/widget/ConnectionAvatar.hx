package pagent.widget;

import m3.log.Logga;
import m3.util.M;
import m3.jq.JQ;
import m3.jq.JQDroppable;
import m3.jq.JQDraggable;
import m3.jq.JQTooltip;
import m3.observable.OSet;
import pagent.widget.DialogManager;
import m3.widget.Widgets;
import qoid.model.ModelObj;
import agentui.model.Node;
import m3.observable.OSet.ObservableSet;
import agentui.widget.FilterableComponent;
import m3.exception.Exception;
import qoid.Qoid;

using StringTools;
using m3.helper.OSetHelper;
using m3.helper.StringHelper;

typedef ConnectionAvatarOptions = {
	>FilterableCompOptions,
	@:optional var connectionIid: String;
	@:optional var aliasIid: String;
	@:optional var onProfileUpdate: Profile->Void;
}

typedef ConnectionAvatarWidgetDef = {
	var options: ConnectionAvatarOptions;
	var _create: Void->Void;
	@:optional var _super: Void->Void;
	var destroy: Void->Void;
	var _updateWidgets: Profile->Void;
	var getAlias: Void->Alias;

	@:optional var filteredSetConnection:FilteredSet<Connection>;
	@:optional var _onUpdateConnection: Connection->EventType->Void;
	@:optional var filteredSetAlias:FilteredSet<Alias>;
	@:optional var _onUpdateAlias: Alias->EventType->Void;
}

class ConnectionAvatarHelper {
	public static function getAlias(c: ConnectionAvatar): Alias {
		return c.connectionAvatar("getAlias");
	}
}

@:native("$")
extern class ConnectionAvatar extends FilterableComponent {
	
	@:overload(function<T>(cmd : String):T{})
	@:overload(function<T>(cmd:String, opt:Dynamic):T{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function connectionAvatar(opts: ConnectionAvatarOptions): ConnectionAvatar;

	static function __init__(): Void {
		var defineWidget: Void->ConnectionAvatarWidgetDef = function(): ConnectionAvatarWidgetDef {
			return {
		        options: {
		           
		        },

		        getAlias: function():Alias {
		        	var self: ConnectionAvatarWidgetDef = Widgets.getSelf();
		        	return Qoid.aliases.getElement(self.options.aliasIid);
		        },

		        _create: function(): Void {
		        	var self: ConnectionAvatarWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
					if(!selfElement.is("div")) {
		        		throw new Exception("Root of ConnectionAvatar must be a div element");
		        	}


		        	var id = "connavatar_" + ((self.options.aliasIid == null) ? self.options.connectionIid : self.options.aliasIid);
		        	selfElement.attr("id", id);
		        	selfElement.addClass(Widgets.getWidgetClasses() + " connectionAvatar filterable");
		        	if (self.options.aliasIid != null) {
		        		selfElement.addClass("aliasAvatar");
		        	}
		            var img: JQ = new JQ("<img class=''/>");
		            selfElement.append(img);

		            self._updateWidgets(new Profile());

		        	if (self.options.connectionIid != null) {
		        		self.filteredSetConnection = new FilteredSet<Connection>(Qoid.connections,function(c:Connection):Bool{
		        			return c.iid == self.options.connectionIid;
		        		});
		        		self._onUpdateConnection = function(c:Connection, evt:EventType) {
		        			if (evt.isAddOrUpdate()) {
		        				self._updateWidgets(c.data);
		        			} else if (evt.isDelete()) {
		        				self.destroy();
		        				selfElement.remove();
		        			}
		        		}
		        		self.filteredSetConnection.listen(self._onUpdateConnection);
		        	} else if (self.options.aliasIid != null){
		        		self.filteredSetAlias = new FilteredSet<Alias>(Qoid.aliases,function(a:Alias):Bool{
		        			return a.iid == self.options.aliasIid;
		        		});
		        		self._onUpdateAlias = function(a:Alias, evt:EventType) {
		        			if (evt.isAddOrUpdate()) {
		        				self._updateWidgets(a.profile);
		        			} else if (evt.isDelete()) {
		        				self.destroy();
		        				selfElement.remove();
		        			}
		        		}
		        		self.filteredSetAlias.listen(self._onUpdateAlias);
		        	} else {
		        		Logga.DEFAULT.warn("AliasIid is not set for Avatar");
		        	}

		            cast(selfElement, JQTooltip).tooltip();

		            if(!self.options.dndEnabled) {
		            	img.mousedown(function(evt: JQEvent) { 
		            		untyped __js__("return false;"); 
	            		});
	            	} 
		        },

		        _updateWidgets: function(profile:Profile): Void {
		        	var self: ConnectionAvatarWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

					var imgSrc: String = "media/default_avatar.jpg";
		        	if(M.getX(profile.imgSrc, "").isNotBlank() ) {
		        		imgSrc = profile.imgSrc;
		        	}

		        	selfElement.children("img").attr("src", imgSrc);
		            selfElement.attr("title", M.getX(profile.name,""));
		            if(self.options.onProfileUpdate != null) {
		            	self.options.onProfileUpdate(profile);
		            }
	        	},

		        destroy: function() {
		        	var self: ConnectionAvatarWidgetDef = Widgets.getSelf();
		        	if (self.filteredSetConnection != null) {
			        	self.filteredSetConnection.removeListener(self._onUpdateConnection);
		        	}
		        	else if (self.filteredSetAlias != null) {
			        	self.filteredSetAlias.removeListener(self._onUpdateAlias);
		        	}

		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.connectionAvatar", defineWidget());
	}	
}