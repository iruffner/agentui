package pagent.widget;

import m3.log.Logga;
import pagent.pages.PinterPageMgr;
import pagent.PinterContext;
import pagent.model.EM;
import m3.jq.JQ;
import m3.observable.OSet;
import m3.widget.Widgets;
import m3.observable.OSet.ObservableSet;
import m3.exception.Exception;
import qoid.model.ModelObj;
import agentui.widget.Popup;
import qoid.Qoid;
import qoid.QE;

using m3.helper.OSetHelper;

typedef UserBarOptions = {
}

typedef UserBarWidgetDef = {
	@:optional var options: UserBarOptions;
	var _create: Void->Void;
	var destroy: Void->Void;
	var _updateAliasWidgets: Alias->Void;
	var _setAlias: Alias->Void;

	@:optional var userImg: JQ;
	@:optional var userIdTxt: JQ;
	@:optional var avatar: JQ;

	@:optional var aliasLoadedListener: String;

	@:optional var aliasSet:FilteredSet<Alias>;
	@:optional var _onupdate: Alias->EventType->Void;
	@:optional var profileSet:FilteredSet<Profile>;
	@:optional var _onupdateProfile: Profile->EventType->Void;
}

class UserBarHelper {
	
}

@:native("$")
extern class UserBar extends JQ {
	
	@:overload(function<T>(cmd : String):T{})
	@:overload(function<T>(cmd:String, opt:Dynamic):T{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function userBar(?opts: UserBarOptions): UserBar;

	static function __init__(): Void {
		var defineWidget: Void->UserBarWidgetDef = function(): UserBarWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: UserBarWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
					if(!selfElement.is("div")) {
		        		throw new Exception("Root of UserBar must be a div element");
		        	}

		        	selfElement.addClass("_userBar");

		        	self.avatar = new JQ("<div></div>").appendTo(selfElement);
		        	self.userIdTxt = new JQ("<div class='userIdTxt ui-widget-content'></div>");
		        	selfElement.append(self.userIdTxt);
		        	self.userIdTxt
		        		.html("...")
		        		.click(function() {
		        				PinterContext.PAGE_MGR.CURRENT_PAGE = PinterPageMgr.HOME_SCREEN;
		        			});

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
		        	var self: UserBarWidgetDef = Widgets.getSelf();
		       		var avatar = new ConnectionAvatar("<div class='avatar' style=''></div>").connectionAvatar({
		        		aliasIid: alias.iid,
		        		dndEnabled: true,
		        		isDragByHelper: true,
		        		containment: false
	        		});
	        		self.avatar.replaceWith(avatar);
	        		self.avatar = avatar;

	        		new JQ(".userIdTxt").html(alias.profile.name);

	        		// new JQ("<button></button>")
	        		// 	.appendTo(selfElement)
	        		// 	.button()
	        		// 	.click(function(evt: JQEvent) {
		        	// 			evt.stopPropagation();
			        // 			self._showNewLabelPopup(JQ.cur);
		        	// 		});
		       	},

		        _setAlias: function(alias:Alias): Void {
		        	var self: UserBarWidgetDef = Widgets.getSelf();
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
		        	var self: UserBarWidgetDef = Widgets.getSelf();
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
		JQ.widget( "ui.userBar", defineWidget());
	}	
}