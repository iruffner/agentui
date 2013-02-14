package ui.widget;

import js.JQuery;
import ui.jq.JQ;
import ui.model.ModelObj;
import ui.model.EventModel;

typedef UserCompOptions = {
}

typedef UserCompWidgetDef = {
	@:optional var options: UserCompOptions;
	var _create: Void->Void;
	var _setUser: User->Void;
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
		        			self._setUser(user);
		        		})
		        	);
		        },

		        _setUser: function(user: User): Void {
		        	var self: UserCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
					var container = selfElement.children(".container");
		        	var img: JQ = new JQ("<img alt='user' src='" + user.imgSrc + "' class='shadow'/>");
		        	container.append(img);
		        	var userIdTxt: JQ = new JQ("<div class='userIdTxt ui-helper-clearfix'></div>");
		        	container.append(userIdTxt);
		        	userIdTxt
		        		.append("<strong>" + user.fname + " " + user.lname + "</strong>")
		        		.append("<br/>")
		        		.append("<font style='font-size:12px'>" + user.currentAlias.label + "</font>");
	        	},
		        
		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.userComp", defineWidget());
	}
}