
package ui.widget;

import m3.jq.JQ;
import m3.jq.M3Menu;
import m3.jq.M3Dialog;
import m3.jq.JQDroppable;
import m3.jq.JQDraggable;
import m3.observable.OSet;
import m3.widget.Widgets;
import ui.model.ModelObj;
import ui.model.EM;
import ui.widget.UploadComp;
import ui.widget.ConnectionAvatar;
import m3.util.M;
import m3.exception.Exception;
import m3.util.JqueryUtil;

using m3.helper.StringHelper;
using ui.widget.UploadComp;
using ui.widget.ConnectionAvatar;

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

		        	selfElement.addClass("ocontainer shadow ");
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


		        	EM.addListener(EMEvent.AliasLoaded, new EMListener(function(alias: Alias): Void {
		        			self._setAlias(alias);
		        		}, "AliasComp-Alias")
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
				                		AppContext.TARGET = null;
				                		self._setAlias(AppContext.currentAlias);
				                	}
				                };

				                selfElement.addClass("targetChange");

				                var clone: ConnectionAvatar = _ui.draggable.data("clone")(_ui.draggable, false, false, dragstop);
				                clone.addClass("small");
				                
			                	clone.insertBefore(new JQ(".ui-helper-clearfix", self.container));

			                	self._setTarget(clone.getConnection());
					      	}
						});
		        },

		       	_createAliasMenu: function() : M3Menu {
		        	var self: AliasCompWidgetDef = Widgets.getSelf();

		       		new JQ("#userAliasMenu").remove();

		        	var menu: M3Menu = new M3Menu("<ul id='userAliasMenu'></ul>");
		        	menu.appendTo(self.container);

		        	var menuOptions:Array<MenuOption> = [];

					var menuOption: MenuOption;

					var aliases = new SortedSet<Alias>(AppContext.ALIASES, function(a:Alias):String {
						return a.profile.name.toLowerCase();
					});

					for (alias in aliases) {
						menuOption = {
							label: alias.profile.name,
							icon: "ui-icon-person",
							action: function(evt: JQEvent, m: M3Menu): Void {
								if (Alias.identifier(AppContext.currentAlias) == Alias.identifier(alias)) {
									menu.hide();
								} else {
    								AppContext.currentAlias = alias;
    								EM.change(EMEvent.AliasLoaded, alias);
    							}
							}
						};
						menuOptions.push(menuOption);
					}

					menuOption = {
						label: "Manage Aliases...",
						icon: "ui-icon-circle-plus",
						action: function(evt: JQEvent, m: M3Menu): Void {
			        		ui.widget.DialogManager.showAliasManager();
						}
					};
					menuOptions.push(menuOption);

        			menu.m3menu({menuOptions:menuOptions}).hide();

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

			        self._onupdate = function(alias:Alias, t:EventType): Void {
						if (t.isAddOrUpdate()) {
							if (alias.deleted) {
					        	self.destroy();
					        	selfElement.remove();								
							} else {
								self._updateAliasWidgets(alias);
					        }
				        } else if (t.isDelete()) {
				        	self.destroy();
				        	selfElement.remove();
				        }
		        	};
		        
		        	self.aliasSet = new FilteredSet<Alias>(AppContext.ALIASES, function(a:Alias):Bool {
		        		return a.iid == alias.iid;
		        	});
					self.aliasSet.listen(self._onupdate);
	        	},

	        	_setTarget: function(conn: Connection): Void {
		        	var self: AliasCompWidgetDef = Widgets.getSelf();
		        	self.switchAliasLink.hide();
	        		self.userIdTxt.html(conn.data.name);

		        	AppContext.TARGET = conn;
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