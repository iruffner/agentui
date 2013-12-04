package ui.widget;

import m3.jq.JQ;
import m3.jq.M3Menu;
import m3.jq.M3Dialog;
import m3.jq.JQDroppable;
import m3.jq.JQDraggable;
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

typedef UserCompOptions = {
}

typedef UserCompWidgetDef = {
	@:optional var options: UserCompOptions;
	@:optional var user: User;
	var _create: Void->Void;
	var _setUser: Void->Void;
	var _setTarget: Connection->Void;
	var _createImgMenu: UserCompWidgetDef->M3Menu;
	var _createAliasMenu: UserCompWidgetDef->M3Menu;
	var destroy: Void->Void;

	@:optional var container: JQ;
	@:optional var userImg: JQ;
	@:optional var userIdTxt: JQ;
	@:optional var changeAliasLink: JQ;
}

@:native("$")
extern class UserComp extends JQ {

	@:overload(function(cmd : String):Bool{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function userComp(?opts: UserCompOptions): UserComp;

	private static function __init__(): Void {
		var defineWidget: Void->UserCompWidgetDef = function(): UserCompWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: UserCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of UserComp must be a div element");
		        	}

		        	selfElement.addClass("ocontainer shadow ");
		        	self.container = new JQ("<div class='container'></div>");
		        	selfElement.append(self.container);
		        	self._setUser();//init the components

		        	EM.addListener(EMEvent.USER, new EMListener(function(user: User): Void {
		        			self.user = user;
		        			self._setUser();
		        		}, "UserComp-User")
		        	);

		        	EM.addListener(EMEvent.AliasLoaded, new EMListener(function(alias: Alias): Void {
		        			self._setUser();
		        		}, "UserComp-Alias")
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
				                		self._setUser();
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

		       	_createImgMenu: function(self: UserCompWidgetDef) : M3Menu {
		        	var menu: M3Menu = new M3Menu("<ul id='userImgMenu'></ul>");
		        	menu.appendTo(self.container);
        			menu.m3menu({
        					menuOptions: [
        						{ 
        							label: "Set Profile Image",
        							icon: "ui-icon-image",
        							action: function(evt: JQEvent, m: M3Menu): Void {
        								var dlg: M3Dialog = new M3Dialog("<div id='profilePictureUploader'></div>");
        								dlg.appendTo(self.container);
        								var uploadComp: UploadComp = new UploadComp("<div class='boxsizingBorder' style='height: 150px;'></div>");
        								uploadComp.appendTo(dlg);
        								uploadComp.uploadComp();
        								
        								dlg.m3dialog({
        										width: 800,
        										height: 305,
        										title: "Profile Image Uploader",
        										buttons: {
        											"Cancel" : function() {
														M3Dialog.cur.m3dialog("close");
													},
													"Set Profile Image": function() {
														AppContext.USER.userData.imgSrc = uploadComp.value();
														EM.change(EMEvent.USER_UPDATE, AppContext.USER);
														M3Dialog.cur.m3dialog("close");
													}
        										}
        									});
        							}
        						}
        					],
        					width: 225
        				}).hide();
					return menu;
		       	},

		       	_createAliasMenu: function(self: UserCompWidgetDef) : M3Menu {
		        	var menu: M3Menu = new M3Menu("<ul id='userAliasMenu'></ul>");
		        	menu.appendTo(self.container);

		        	var menuOptions:Array<MenuOption> = [];

					var user = self.user;
					var iter: Iterator<Alias> = M.getX(user.aliasSet.iterator());

					var menuOption: MenuOption;

			        if(iter != null) {
						while(iter.hasNext()) {
							var alias: Alias = iter.next();
							menuOption = {
    							label: alias.label,
    							icon: "ui-icon-person",
    							action: function(evt: JQEvent, m: M3Menu): Void {
    								user.currentAlias = alias;
    								EM.change(EMEvent.LOAD_ALIAS, alias);
    								EM.change(EMEvent.AliasLoaded, alias);
    							}
    						};
    						menuOptions.push(menuOption);
						}
					}

					menuOption = {
						label: "Create New Alias...",
						icon: "ui-icon-circle-plus",
						action: function(evt: JQEvent, m: M3Menu): Void {
							DialogManager.showNewAlias();
						}
					};
					menuOptions.push(menuOption);

        			menu.m3menu({menuOptions:menuOptions}).hide();

					return menu;
		       	},


		        _setUser: function(): Void {
		        	var self: UserCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	var user = self.user;

					self.container.empty();
					var imgSrc: String = "media/default_avatar.jpg";
					if(user != null) {
						if ( M.getX(user.currentAlias.profile.imgSrc, "").isNotBlank()) {
							imgSrc = user.currentAlias.profile.imgSrc;
						} else if (user.userData.imgSrc.isNotBlank()){
							imgSrc = user.userData.imgSrc;
						}
					}

		        	self.userImg = new JQ("<img alt='user' src='" + imgSrc + "' class='userImg shadow'/>");
		        	self.container.append(self.userImg);

		        	var imgMenu = self._createImgMenu(self);

					var displayImgMenu = function(evt: JQEvent): Dynamic {
	        			new JQ(".nonmodalPopup").hide();
	        			imgMenu.show();
	        			imgMenu.position({
	        					my: "left top",
	        					of: evt
	        				});
						evt.preventDefault();
	        			evt.stopPropagation();
	        			return false;
	        		};

		        	self.userImg.bind("contextmenu", displayImgMenu);
		        	self.userImg.click(displayImgMenu);

		        	self.userIdTxt = new JQ("<div class='userIdTxt'></div>");
		        	self.container.append(self.userIdTxt);
		        	var name: String = M.getX(user.userData.name, "");
		        	var aliasLabel: String = M.getX(user.currentAlias.label, "");
		        	if(aliasLabel.isBlank()) aliasLabel = "";
		        	self.userIdTxt
		        		.append("<strong>" + name + "</strong>")
		        		.append("<br/>")
		        		.append("<font style='font-size:12px'>" + aliasLabel + "</font>");
		        	var changeDiv: JQ = new JQ("<div class='ui-helper-clearfix'></div>");
	        		self.container.append(changeDiv);

	        		if(user != null) {
			        	self.changeAliasLink = new JQ("<a class='aliasToggle'>Change Alias</a>");
		        		changeDiv.append(self.changeAliasLink);

		        		var aliasMenu = self._createAliasMenu(self);

			        	self.changeAliasLink.click(function(evt: JQEvent): Dynamic {
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
			        }
	        	},

	        	_setTarget: function(conn: Connection): Void {
		        	var self: UserCompWidgetDef = Widgets.getSelf();
		        	self.changeAliasLink.hide();
	        		self.userIdTxt
	        			.empty()
		        		.append("<strong>" + conn.name() + "</strong>");

		        	AppContext.TARGET = conn;
	        		EM.change(EMEvent.TARGET_CHANGE, conn);
        		},

		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.userComp", defineWidget());
	}
}