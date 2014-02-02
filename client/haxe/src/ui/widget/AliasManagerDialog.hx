package ui.widget;

import m3.exception.Exception;
import m3.jq.JQ;
import m3.widget.Widgets;
import m3.util.M;
import ui.model.ModelObj;
import ui.model.EM;

using m3.jq.M3Dialog;
using ui.widget.UploadComp;
using m3.helper.StringHelper;
using m3.jq.JQDialog;
using Lambda;

typedef AliasManagerDialogOptions = {
}

typedef AliasManagerDialogWidgetDef = {
	@:optional var options: AliasManagerDialogOptions;

	@:optional var aliasName: JQ;
	@:optional var username: JQ;
	
	var initialized: Bool;

	var _buildDialog: Void->Void;
	var open: Void->Void;
	var _createAliasManager: Void->Void;
	var _showAliasDetail: Alias->Void;
	var _showAliasEditor: Alias->Void;

	var _create: Void->Void;
	var destroy: Void->Void;
}

@:native("$")
extern class AliasManagerDialog extends JQ {

	@:overload(function<T>(cmd : String):T{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function aliasManagerDialog(?opts: AliasManagerDialogOptions): AliasManagerDialog;

	private static function __init__(): Void {
		var defineWidget: Void->AliasManagerDialogWidgetDef = function(): AliasManagerDialogWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: AliasManagerDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQDialog = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of AliasManagerDialog must be a div element");
		        	}

		        	selfElement.addClass("_aliasManagerDialog").hide();

		        	self._showAliasDetail(null);
		        },

		        initialized: false,

		        _showAliasDetail: function(alias: Alias): Void {
		        	var self: AliasManagerDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQDialog = Widgets.getSelfElement();
					selfElement.empty();
					var leftDiv: JQ = new JQ("<div class='fleft boxsizingBorder' style='min-width: 70%; min-height: 100%; padding-top: 15px;'></div>").appendTo(selfElement);
					var rightDiv: JQ = new JQ("<div class='fright ui-corner-all' style='min-width: 25%; background-color: lightblue; min-height: 100%;'></div>").appendTo(selfElement);
		        	var imgSrc: String = "media/default_avatar.jpg";

		        	if(alias != null) {
		        		var loadAliasBtn: JQ = new JQ("<button class='fleft'>Use This Alias</button>")
			        		.appendTo(leftDiv)
			        		.button()
			        		.click( function(evt: JQEvent): Void {
			        				AppContext.alias = alias;
    								EM.change(EMEvent.LOAD_ALIAS, alias);
    								EM.change(EMEvent.AliasLoaded, alias);
			        				selfElement.close();
			        			} );
		        		leftDiv.append("<br class='clear'/><br/>");

						if ( M.getX(alias.data.imgSrc, "").isNotBlank()) {
							imgSrc = alias.data.imgSrc;
						}
			        	leftDiv.append(new JQ("<img alt='alias' src='" + imgSrc + "' class='userImg shadow'/>"));

			        	leftDiv.append(new JQ("<h2>" + alias.name + "</h2>"));

			        	var btnDiv: JQ = new JQ("<div></div>").appendTo(leftDiv);

			        	var setDefaultBtn: JQ = new JQ("<button>Set Default</button>")
			        		.appendTo(btnDiv)
			        		.button()
			        		.click( function(evt: JQEvent): Void {
			        			alias.data.isDefault = true;
			        			EM.change(EMEvent.UpdateAlias, alias);
			        		});

			        	var editBtn: JQ = new JQ("<button>Edit</button>")
			        		.appendTo(btnDiv)
			        		.button()
			        		.click( function(evt: JQEvent): Void {
			        				self._showAliasEditor(alias);
			        			} );

			        	var deleteBtn: JQ = new JQ("<button>Delete</button>")
			        		.appendTo(btnDiv)
			        		.button()
			        		.click( function(evt: JQEvent): Void {
		        				EM.change(EMEvent.DeleteAlias, alias);
			        		});
		        	} else {
		        		if ( M.getX(AppContext.AGENT.userData.imgSrc, "").isNotBlank()) {
							imgSrc = AppContext.AGENT.userData.imgSrc;
						}
		        		leftDiv.append(new JQ("<img alt='alias' src='" + imgSrc + "' class='userImg shadow'/>"));
		        		leftDiv.append(new JQ("<h2>" + AppContext.AGENT.userData.name + "</h2>"));
		        	}

		        	rightDiv.append("<h2>Agent</h2>");
		        	var span: JQ = new JQ("<span class='clickable'></span>")
		        					.appendTo(rightDiv)
		        					.click(function(evt: JQEvent) {
		        							self._showAliasDetail(null);
		        						})
		        					.append(M.getX(AppContext.AGENT.userData.name, ""));
    				rightDiv.append("<br/>");

		        	rightDiv.append("<h2>Aliases</h2>");
		        	AppContext.AGENT.aliasSet.iter(
		        			function(a: Alias): Void {
		        				var span: JQ = new JQ("<span class='clickable'></span>")
		        					.appendTo(rightDiv)
		        					.click(function(evt: JQEvent) {
		        							self._showAliasDetail(a);
		        						})
		        					.append(a.name);
		        				rightDiv.append("<br/>");
		        			}
		        		);

		        	new JQ("<button style='margin-top: 30px;'>New Alias</button>")
		        		.button()
		        		.click(function(evt: JQEvent) {
		        				self._showAliasEditor(null);
		        			})
		        		.appendTo(rightDiv);
		        		// .position({
		        		// 		my: "center bottom",
		        		// 		at: "center bottom",
		        		// 		of: rightDiv
		        		// 	});
	        	},

	        	_showAliasEditor: function(alias: Alias): Void {
		        	var self: AliasManagerDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQDialog = Widgets.getSelfElement();
					selfElement.empty();
					var leftDiv: JQ = new JQ("<div class='fleft boxsizingBorder' style='min-width: 70%; min-height: 100%; padding-top: 15px;'></div>").appendTo(selfElement);
					var rightDiv: JQ = new JQ("<div class='fright ui-corner-all' style='min-width: 25%; background-color: lightblue; min-height: 100%;'></div>").appendTo(selfElement);
		        	var imgSrc: String = "media/default_avatar.jpg";

		        	leftDiv.append("<div style='text-align: left;font-weight: bold;font-size: 1.2em;'>Alias Name:</div>");
		        	var aliasName: JQ = new JQ("<input class='ui-corner-all ui-state-active ui-widget-content' style='width: 80%;padding: .2em .4em;'/>").appendTo(leftDiv);
		        	if(alias != null) aliasName.val(alias.name);
		        	leftDiv.append("<br/><br/>");

		        	var aliasImg: JQ = null;
					
		        	leftDiv.append(
		        			new JQ("<div style='text-align: left;font-weight: bold;font-size: 1.2em;'>Profile Picture: </div>")
		        				.append(
		        						new JQ("<a style='font-weight: 1em;font-weight: normal; cursor: pointer;'>Change</a>")
		        							.click(function(evt: JQEvent): Void {
		        									var dlg: M3Dialog = new M3Dialog("<div id='profilePictureUploader'></div>");
			        								dlg.appendTo(selfElement);
			        								var uploadComp: UploadComp = new UploadComp("<div class='boxsizingBorder' style='height: 150px;'></div>");
			        								uploadComp.appendTo(dlg);
			        								uploadComp.uploadComp({
			        										onload: function(bytes: String): Void {
			        											dlg.close();
			        											aliasImg.attr("src", bytes);
			        										}
			        									});
			        								
			        								dlg.m3dialog({
			        										width: 600,
			        										height: 305,
			        										title: "Profile Image Uploader",
			        										buttons: {
			        											"Cancel" : function() {
																	M3Dialog.cur.close();
																}
			        										}
			        									});
		        								})
		        					)
		        		);
					if ( M.getX(alias.data.imgSrc, "").isNotBlank()) {
						imgSrc = alias.data.imgSrc;
					}
					aliasImg = new JQ("<img alt='alias' src='" + imgSrc + "' class='userImg shadow'/>");
		        	leftDiv.append(aliasImg);
		        	
		        	leftDiv.append("<br/><br/>");

		        	var btnDiv: JQ = new JQ("<div></div>").appendTo(leftDiv);

		        	var updateBtn: JQ = new JQ("<button>" + (alias != null ? "Update":"Create") + "</button>")
		        		.appendTo(btnDiv)
		        		.button()
		        		.click( function(evt: JQEvent): Void {
		        				var name: String = aliasName.val();
		        				if(name.isBlank()) {
		        					m3.util.JqueryUtil.alert( "Alias name cannot be blank.", "Error");
		        					return;
		        				}
		        				var profilePic: String = aliasImg.attr("src");
		        				if(profilePic.startsWithAny(["media"])) profilePic = "";
		        				var applyDlg = {
		        					if(alias == null) {
		        						alias = new Alias();
		        						alias.data = new UserData();
		        						function() {
		        							EM.change(EMEvent.CreateAlias, alias);
		        						};
		        					} else {
		        						function() {
		        							EM.change(EMEvent.UpdateAlias, alias);
		        						};
		        					}
		        				}
		        				alias.name = name;
		        				alias.data.imgSrc = profilePic;
		        				applyDlg();
		        				self._showAliasDetail(alias);
		        				// EM.change(EMEvent.UpdateAlias, alias);
		        			} );

		        	var cancelBtn: JQ = new JQ("<button>Cancel</button>")
		        		.appendTo(btnDiv)
		        		.button()
		        		.click( function(evt: JQEvent): Void {
		        				self._showAliasDetail(alias);
		        			} );
		        	

		        	rightDiv.append("<h2>Agent</h2>");
		        	var span: JQ = new JQ("<span class='clickable'></span>")
		        					.appendTo(rightDiv)
		        					.click(function(evt: JQEvent) {
		        							self._showAliasDetail(null);
		        						})
		        					.append(M.getX(AppContext.AGENT.userData.name, ""));
    				rightDiv.append("<br/>");

		        	rightDiv.append("<h2>Aliases</h2>");
		        	AppContext.AGENT.aliasSet.iter(
		        			function(a: Alias): Void {
		        				var span: JQ = new JQ("<span class='clickable'></span>")
		        					.appendTo(rightDiv)
		        					.click(function(evt: JQEvent) {
		        							self._showAliasDetail(a);
		        						})
		        					.append(a.name);
		        				rightDiv.append("<br/>");
		        			}
		        		);

		        	new JQ("<button style='margin-top: 30px;'>New Alias</button>")
		        		.button()
		        		.click(function(evt: JQEvent) {

		        			})
		        		.appendTo(rightDiv);
		        		// .position({
		        		// 		my: "center bottom",
		        		// 		at: "center bottom",
		        		// 		of: rightDiv
		        		// 	});
	        	},

		        _createAliasManager: function(): Void {
		        	var self: AliasManagerDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQDialog = Widgets.getSelfElement();

    				var alias: Alias = new Alias();
    				alias.name = self.aliasName.val();
    				alias.data.name = self.username.val();
					if (alias.data.name.isBlank() || alias.name.isBlank()) {
						return;
					}

    				selfElement.find(".ui-state-error").removeClass("ui-state-error");
    				EM.change(EMEvent.CreateAlias, alias);

/*	TODO:  Listen to changes to the model here...
    				EM.listenOnce(EMEvent.NewAlias, new EMListener(function(n:Nothing): Void {
    						selfElement.close();
    						AppContext.AGENT.aliasSet.add(alias);
    						AppContext.alias = alias;
    						EM.change(EMEvent.AliasLoaded, alias);
    					}, "AliasManagerDialog-AliasManager")
    				);
*/
	        	},

		        _buildDialog: function(): Void {
		        	var self: AliasManagerDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQDialog = Widgets.getSelfElement();

		        	self.initialized = true;

		        	var dlgOptions: JQDialogOptions = {
		        		autoOpen: false,
		        		title: "Alias Manager",
		        		height: 440,
		        		width: 480,
		        		buttons: {
		        			// "Create New Alias": function() {
		        			// 	self._createAliasManager();
		        			// },
		        			// "Cancel": function() {
		        			// 	JQDialog.cur.dialog("close");
		        			// }
		        		},
		        		close: function(evt: JQEvent, ui: UIJQDialog): Void {
		        			selfElement.find(".placeholder").removeClass("ui-state-error");
		        		}
		        	};
		        	selfElement.dialog(dlgOptions);
		        },

	        	open: function(): Void {
		        	var self: AliasManagerDialogWidgetDef = Widgets.getSelf();
					var selfElement: JQDialog = Widgets.getSelfElement();

		        	if(!self.initialized) {
		        		self._buildDialog();
		        	}
		        	// selfElement.children("#n_label").focus();
		        	// self.aliasName.blur();
	        		selfElement.open();
        		},
		        
		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.aliasManagerDialog", defineWidget());
	}
}