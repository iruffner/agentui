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

typedef ConnectionCompOptions = {
	@:optional var click: Void->Void;
	@:optional var connectionIid: String;
	@:optional var aliasIid: String;
}

typedef ConnectionCompWidgetDef = {
	@:optional var options: ConnectionCompOptions;
	var _create: Void->Void;
	var destroy: Void->Void;
}

class ConnectionCompHelper {
	
}

@:native("$")
extern class ConnectionComp extends JQ {
	
	@:overload(function<T>(cmd : String):T{})
	@:overload(function<T>(cmd:String, opt:Dynamic):T{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function connectionComp(opts: ConnectionCompOptions): ConnectionComp;

	static function __init__(): Void {
		var defineWidget: Void->ConnectionCompWidgetDef = function(): ConnectionCompWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: ConnectionCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
					if(!selfElement.is("div")) {
		        		throw new Exception("Root of ConnectionComp must be a div element");
		        	}

		        	selfElement.addClass("_connectionComp");
		        	selfElement.attr("cnxn", self.options.connectionIid);

		        	if(self.options.click != null) 
	                    selfElement.click(self.options.click);
                    var connAvatar: ConnectionAvatar = new ConnectionAvatar("<div></div>");
                    connAvatar.appendTo(selfElement);
                    var nameDiv: JQ = new JQ("<div></div>").appendTo(selfElement);
                    connAvatar.connectionAvatar({
                                connectionIid: self.options.connectionIid,
                                aliasIid: self.options.aliasIid,
                                onProfileUpdate: function(p: Profile) {
                                    nameDiv.empty().append(p.name);
                                }                                                   
                            });
		        },

		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.connectionComp", defineWidget());
	}	
}