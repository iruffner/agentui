package ui.widget;

import js.JQuery;
import ui.jq.JQ;
import ui.model.ModelObj;
import ui.model.EventModel;

using ui.helper.StringHelper;

typedef UserCompOptions = {
}

typedef UserCompWidgetDef = {
	@:optional var options: UserCompOptions;
	@:optional var user: User;
	var _create: Void->Void;
	var _setUser: Void->Void;
	var destroy: Void->Void;
}

extern class UserComp extends JQ {

	@:overload(function(cmd : String):Bool{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function userComp(?opts: UserCompOptions): UserComp;

	private static function __init__(): Void {
		untyped UserComp = window.jQuery;
		var defineWidget: Void->UserCompWidgetDef = function(): UserCompWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: UserCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new ui.exception.Exception("Root of UserComp must be a div element");
		        	}

		        	selfElement.addClass("ocontainer shadow ");
		        	selfElement.append(new JQ("<div class='container'></div>"));
		        	EventModel.addListener("user", new EventListener(function(user: User): Void {
		        			self.user = user;
		        			self._setUser();
		        		})
		        	);

		        	EventModel.addListener("loadAlias", new EventListener(function(alias: Alias): Void {
		        			self._setUser();
		        		})
		        	);
		        },

		        _setUser: function(): Void {
		        	var self: UserCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	var user = self.user;

					var container = selfElement.children(".container").empty();
					var imgSrc: String;
					if(user.currentAlias.imgSrc.isNotBlank()) {
						imgSrc = user.currentAlias.imgSrc;
					} else {
						imgSrc = user.imgSrc;
					}
		        	var img: JQ = new JQ("<img alt='user' src='" + imgSrc + "' class='shadow'/>");
		        	container.append(img);
		        	var userIdTxt: JQ = new JQ("<div class='userIdTxt'></div>");
		        	container.append(userIdTxt);
		        	userIdTxt
		        		.append("<strong>" + user.fname + " " + user.lname + "</strong>")
		        		.append("<br/>")
		        		.append("<font style='font-size:12px'>" + user.currentAlias.label + "</font>");
		        	var changeDiv: JQ = new JQ("<div class='ui-helper-clearfix'></div>");
		        	var change: JQ = new JQ("<a class='aliasToggle'>Change Alias</a>");
	        		changeDiv.append(change);
	        		container.append(changeDiv);
		        	var aliases: JQ = new JQ("<div class='aliases ocontainer nonmodalPopup' style='position: absolute;'></div>");
		        	container.append(aliases);
		        	var iter: Iterator<Alias> = user.aliases.iterator();
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
		        			.click(function(evt: JqEvent) {
		        					EventModel.change("loadAlias", alias.uid);
		        				});
		        	}

		        	aliases.position({
		        			my: "left top",
		        			at: "right-6px center",
		        			of: selfElement
		        		});
		        	aliases.hide();
		        	change.click(function(evt: JqEvent): Void {
		        			aliases.toggle();
		        			evt.stopPropagation();
		        		});

	        	},


		        
		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.userComp", defineWidget());
	}
}