package pagent.widget;

import pagent.widget.DialogManager;
import pagent.model.EM;
import m3.jq.JQ;
import m3.jq.M3Menu;
import m3.jq.M3Dialog;
import m3.jq.JQDroppable;
import m3.jq.JQDraggable;
import m3.observable.OSet;
import m3.widget.Widgets;
import qoid.model.ModelObj;
import m3.util.M;
import m3.exception.Exception;
import m3.util.JqueryUtil;
import qoid.Qoid;
import qoid.QE;

using m3.helper.OSetHelper;
using m3.helper.StringHelper;
using agentui.widget.UploadComp;
using pagent.widget.ConnectionAvatar;

typedef AliasCompOptions = {
}

typedef AliasCompWidgetDef = {
	@:optional var options: AliasCompOptions;
	var _create: Void->Void;
	var _setAlias: Alias->Void;
	var _updateAliasWidgets: Alias->Void;
	var destroy: Void->Void;

	@:optional var userImg: JQ;
	@:optional var userIdTxt: JQ;
	@:optional var avatar: JQ;
	
	@:optional var aliasLoadedListener: String;

	@:optional var aliasSet:FilteredSet<Alias>;
	@:optional var _onupdate: Alias->EventType->Void;
	@:optional var profileSet:FilteredSet<Profile>;
	@:optional var _onupdateProfile: Profile->EventType->Void;
}

@:native("$")
extern class AliasComp extends JQ {

	@:overload(function(cmd : String):Bool{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function aliasComp(?opts: AliasCompOptions): AliasComp;

	private static function __init__(): Void {
		var defineWidget: Void->AliasCompWidgetDef = function(): AliasCompWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: AliasCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of AliasComp must be a div element");
		        	}

		        	selfElement.addClass("_aliasComp");
		        	self.avatar = new JQ("<div></div>").appendTo(selfElement);
		        	self.userIdTxt = new JQ("<div class='userIdTxt'></div>");
		        	selfElement.append(self.userIdTxt);
		        	self.userIdTxt.html("...");
		        	self._setAlias(new Alias());

		        	self.aliasLoadedListener = EM.addListener(QE.onAliasLoaded, function(alias: Alias): Void {
		        			self._setAlias(alias);
		        		}, "AliasComp-Alias"
		        	);

			       	self._onupdate = function(alias:Alias, t:EventType): Void {
						if (t.isAddOrUpdate()) {
							self._updateAliasWidgets(alias);
				        } else if (t.isDelete()) {
				        	self.destroy();
				        	selfElement.remove();
				        }
		        	};

			       	self._onupdateProfile = function(p:Profile, t:EventType): Void {
			       		var alias = Qoid.aliases.getElement(p.aliasIid);
						self._updateAliasWidgets(alias);
			       	};

			       	if(Qoid.currentAlias != null) {
			       		self._setAlias(Qoid.currentAlias);
			       	}
		        },

		       	_updateAliasWidgets: function(alias:Alias):Void {
		        	var self: AliasCompWidgetDef = Widgets.getSelf();
		       		var avatar = new ConnectionAvatar("<div class='avatar' style=''></div>").connectionAvatar({
		        		aliasIid: alias.iid,
		        		dndEnabled: true,
		        		isDragByHelper: true,
		        		containment: false
	        		});
	        		self.avatar.replaceWith(avatar);
	        		self.avatar = avatar;

	        		new JQ(".userIdTxt").html(alias.profile.name);
		       	},

		        _setAlias: function(alias:Alias): Void {
		        	var self: AliasCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

					self._updateAliasWidgets(alias);

	        		if (self.aliasSet != null) {
	        			self.aliasSet.removeListener(self._onupdate);
	        		}
		        
		        	self.aliasSet = new FilteredSet<Alias>(Qoid.aliases, function(a:Alias):Bool {
		        		return a.iid == alias.iid;
		        	});
					self.aliasSet.listen(self._onupdate);

					// Update the listener on the profile
	        		if (self.profileSet != null) {
	        			self.profileSet.removeListener(self._onupdateProfile);
	        		}

		        	self.profileSet = new FilteredSet<Profile>(Qoid.profiles, function(p:Profile):Bool {
		        		return p.aliasIid == alias.iid;
		        	});
					self.profileSet.listen(self._onupdateProfile);
	        	},

		        destroy: function() {
		        	var self: AliasCompWidgetDef = Widgets.getSelf();
		        	if (self.aliasSet != null) {
	        			self.aliasSet.removeListener(self._onupdate);
	        		}
	        		if (self.profileSet != null) {
	        			self.profileSet.removeListener(self._onupdateProfile);
	        		}
	        		EM.removeListener(QE.onAliasLoaded, self.aliasLoadedListener);
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.aliasComp", defineWidget());
	}
}