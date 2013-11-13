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

		        	EM.addListener(EMEvent.LoadAlias, new EMListener(function(alias: Alias): Void {
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

		        _setUser: function(): Void {
		        	var self: UserCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	var user = self.user;

					self.container.empty();
					var imgSrc: String = "media/default_avatar.jpg";
					if(user != null) {
						if (user.currentAlias != null && user.currentAlias.imgSrc.isNotBlank()) {
							imgSrc = user.currentAlias.imgSrc;
						} else if (user.userData.imgSrc.isNotBlank()){
							imgSrc = user.userData.imgSrc;
						}
					}

		        	self.userImg = new JQ("<img alt='user' src='" + imgSrc + "' class='userImg shadow'/>");
		        	self.container.append(self.userImg);
		        	var menu: M3Menu = new M3Menu("<ul id='userCompMenu'></ul>");
		        	menu.appendTo(self.container);
        			menu.m3menu({
        					menuOptions: [
        						{ 
        							label: "Set Profile Picture",
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
        										title: "Profile Picture Uploader",
        										buttons: {
        											"Cancel" : function() {
														M3Dialog.cur.m3dialog("close");
													},
													"Set Profile Image": function() {
														ui.AgentUi.USER.userData.imgSrc = uploadComp.value();
														EM.change(EMEvent.USER_UPDATE, ui.AgentUi.USER);
														M3Dialog.cur.m3dialog("close");
													}
        										}
        									});
        							}
        						}
        					],
        					width: 225
        				}).hide();
		        	self.userImg.click(function(evt: JQEvent): Void {
		        			new JQ(".nonmodalPopup").hide();
		        			menu.show();
		        			menu.position({
		        					my: "left top",
		        					of: evt
		        				});
		        			evt.stopPropagation();
		        		});
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
			        	var aliases: JQ = new JQ("<div class='aliases ocontainer nonmodalPopup' style='position: absolute; min-width: 100px;'></div>");
			        	self.container.append(aliases);
			        	var iter: Iterator<Alias> = M.getX(user.aliasSet.iterator());
			        	if(iter != null) {
				        	while(iter.hasNext()) {
				        		var alias: Alias = iter.next();
				        		var btn: JQ = new JQ("<div id='" + alias.uid + "' class='aliasBtn ui-widget ui-button boxsizingBorder ui-state-default'>" + alias.label + "</div>");
				        		if(alias.uid == user.currentAlias.uid) {
				        			btn.addClass("ui-state-active");
				        		}
				        		aliases.append(btn);
				        		btn
				        			.hover(function(){
				        					JQ.cur.addClass("ui-state-hover");
				        				}, function(){
				        					JQ.cur.removeClass("ui-state-hover");	
			        					})
				        			.click(function(evt: JQEvent) {
				        					EM.change(EMEvent.LoadAlias, alias);
				        				});
				        	}
				        }
				        var btn: JQ = new JQ("<div id='newAlias' class='aliasBtn ui-widget ui-button boxsizingBorder ui-state-default'>New Alias</div>");
				        aliases.append( btn );
				        btn
		        			.hover(function(){
		        					JQ.cur.addClass("ui-state-hover");
		        				}, function(){
		        					JQ.cur.removeClass("ui-state-hover");	
	        					})
		        			.click(function(evt: JQEvent) {
		        					DialogManager.showNewAlias();
		        				});

			        	aliases.position({
			        			my: "left top",
			        			at: "right-6px center",
			        			of: selfElement
			        		});
			        	aliases.hide();
			        	self.changeAliasLink.click(function(evt: JQEvent): Void {
			        			aliases.toggle();
			        			evt.stopPropagation();
			        		});
			        }
	        	},

	        	_setTarget: function(conn: Connection): Void {
		        	var self: UserCompWidgetDef = Widgets.getSelf();
		        	self.changeAliasLink.hide();
	        		self.userIdTxt
	        			.empty()
		        		.append("<strong>" + conn.name() + "</strong>");

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