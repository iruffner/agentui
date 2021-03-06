
package agentui.widget;

import m3.jq.JQ;
import m3.jq.M3Menu;
import m3.jq.M3Dialog;
import m3.jq.JQDroppable;
import m3.jq.JQDraggable;
import m3.observable.OSet;
import m3.widget.Widgets;
import qoid.model.ModelObj;
import agentui.model.EM;
import agentui.widget.UploadComp;
import agentui.widget.ConnectionAvatar;
import m3.util.M;
import m3.exception.Exception;
import m3.util.JqueryUtil;
import qoid.Qoid;
import qoid.QE;

using m3.helper.OSetHelper;
using m3.helper.StringHelper;
using agentui.widget.UploadComp;
using agentui.widget.ConnectionAvatar;

typedef AliasCompOptions = {
}

typedef AliasCompWidgetDef = {
	@:optional var options: AliasCompOptions;
	var _create: Void->Void;
	var _setAlias: Alias->Void;
	var _updateAliasWidgets: Alias->Void;
	var _setTarget: Connection->Void;
	var _createAliasMenu: Void->M3Menu;
	var destroy: Void->Void;

	@:optional var container: JQ;
	@:optional var userImg: JQ;
	@:optional var userIdTxt: JQ;
	@:optional var switchAliasLink: JQ;
	@:optional var avatar: JQ;

	@:optional var aliasSet:FilteredSet<Alias>;
	@:optional var _onupdate: Alias->EventType->Void;
	@:optional var profileSet:FilteredSet<Profile>;
	@:optional var _onupdateProfile: Profile->EventType->Void;
}

@:native("$")
extern class AliasComp extends JQ {

	@:overload(function(cmd : String):Bool{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function AliasComp(?opts: AliasCompOptions): AliasComp;

	private static function __init__(): Void {
		var defineWidget: Void->AliasCompWidgetDef = function(): AliasCompWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: AliasCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of AliasComp must be a div element");
		        	}

		        	selfElement.addClass("ocontainer shadow _aliasComp");
		        	self.container = new JQ("<div class='container'></div>");
		        	selfElement.append(self.container);

		        	self.avatar = new JQ("<div></div>").appendTo(self.container);
		        	self.userIdTxt = new JQ("<div class='userIdTxt'></div>");
		        	self.container.append(self.userIdTxt);
		        	self.userIdTxt.html("...");
		        	self._setAlias(new Alias());

		        	var changeDiv: JQ = new JQ("<div class='ui-helper-clearfix'></div>");
	        		self.container.append(changeDiv);
		        	self.switchAliasLink = new JQ("<a class='aliasToggle'>Aliases</a>");
	        		changeDiv.append(self.switchAliasLink);

		        	self.switchAliasLink.click(function(evt: JQEvent): Dynamic {
		        		var aliasMenu = self._createAliasMenu();

	        			aliasMenu.show();
	        			aliasMenu.position({
		        			my: "left top",
		        			at: "right-6px center",
		        			of: selfElement
		        		});

						evt.preventDefault();
	        			evt.stopPropagation();
	        			return false;
		        	});


		        	EM.addListener(QE.onAliasLoaded, function(alias: Alias): Void {
		        			self._setAlias(alias);
		        		}, "AliasComp-Alias"
		        	);

		        	cast(self.container, JQDroppable).droppable({
						accept: function(d) {
			    			return d.is(".connectionAvatar");
			    		},
						activeClass: "ui-state-hover",
				      	hoverClass: "ui-state-active",
				      	drop: function( event: JQEvent, _ui: UIDroppable ) {
				      		// Check to see if the element being dropped is already in the container
				      		var dragstop = function(dragstopEvt: JQEvent, dragstopUi: UIDraggable): Void {
			                	if(!self.container.intersects(dragstopUi.helper)) {
			                		dragstopUi.helper.remove();
			                		selfElement.removeClass("targetChange");
			                		JqueryUtil.deleteEffects(dragstopEvt);
			                		// TODO: AppContext.TARGET = null;
			                		self._setAlias(Qoid.currentAlias);
			                	}
			                };

			                selfElement.addClass("targetChange");

			                var clone: ConnectionAvatar = _ui.draggable.data("clone")(_ui.draggable, false, false, dragstop);
			                clone.addClass("small");
			                
		                	clone.insertBefore(new JQ(".ui-helper-clearfix", self.container));

		                	self._setTarget(clone.getConnection());
				      	}
					});

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
		        },

		       	_createAliasMenu: function() : M3Menu {
		        	var self: AliasCompWidgetDef = Widgets.getSelf();

		       		new JQ("#userAliasMenu").remove();

		        	var menu: M3Menu = new M3Menu("<ul id='userAliasMenu'></ul>");
		        	menu.appendTo(self.container);

		        	var menuOptions:Array<MenuOption> = [];

					var menuOption: MenuOption;

					var aliases = new SortedSet<Alias>(Qoid.aliases, function(a:Alias):String {
						return a.profile.name.toLowerCase();
					});

					for (alias in aliases) {
						var icon: String = "ui-icon-person";
						// if(alias.iid == Qoid.currentAlias.iid) {
						// 	icon = "ui-icon-check";
						// }
						menuOption = {
							label: alias.profile.name,
							icon: icon,
							action: function(evt: JQEvent, m: M3Menu): Void {
								if (Alias.identifier(Qoid.currentAlias) == Alias.identifier(alias)) {
									menu.hide();
								} else {
    								Qoid.currentAlias = alias;
    								EM.change(EMEvent.UseAlias, alias);
    								EM.change(QE.onAliasLoaded, alias);
    							}
							}
						};
						menuOptions.push(menuOption);
					}

					menuOption = {
						label: "Manage Aliases...",
						icon: "ui-icon-circle-plus",
						action: function(evt: JQEvent, m: M3Menu): Void {
			        		agentui.widget.DialogManager.showAliasManager();
						}
					};
					menuOptions.push(menuOption);

        			menu.m3menu({menuOptions:menuOptions, wrapLabelInAtag: true}).hide();

					return menu;
		       	},

		       	_updateAliasWidgets: function(alias:Alias):Void {
		        	var self: AliasCompWidgetDef = Widgets.getSelf();
		       		var avatar = new ConnectionAvatar("<div class='avatar' style='position:relative;left:50px;'></div>").connectionAvatar({
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

	        	_setTarget: function(conn: Connection): Void {
		        	var self: AliasCompWidgetDef = Widgets.getSelf();
		        	self.switchAliasLink.hide();
	        		self.userIdTxt.html(conn.data.name);

		        	//TODO:  Qoid.TARGET = conn;
	        		EM.change(EMEvent.TargetChange, conn);
        		},

		        destroy: function() {
		        	var self: AliasCompWidgetDef = Widgets.getSelf();
		        	if (self.aliasSet != null) {
	        			self.aliasSet.removeListener(self._onupdate);
	        		}
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.AliasComp", defineWidget());
	}
}