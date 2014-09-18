package pagent.widget;

import m3.log.Logga;
import pagent.PinterContext;
import pagent.pages.PinterPage;
import pagent.pages.PinterPageMgr;
import pagent.model.EM;
import js.Browser;
import m3.jq.JQ;
import m3.jq.JQDroppable;
import m3.jq.M3Menu;
import m3.widget.Widgets;
import pagent.widget.ConnectionComp;
import qoid.model.ModelObj;
import m3.observable.OSet;
import m3.exception.Exception;
import m3.util.JqueryUtil;
import agentui.widget.Popup;
import qoid.Qoid;

using m3.helper.OSetHelper;
using m3.helper.StringHelper;
using Lambda;

typedef CommentCompOptions = {
	var comment: MessageContent;
}

typedef CommentCompWidgetDef = {
	@:optional var options: CommentCompOptions;
	var _create: Void->Void;
	var destroy: Void->Void;
}


class CommentCompHelper {
	public static function comment(cc: CommentComp): Content<Dynamic> {
		return cc.commentComp("option", "comment");
	}

	public static function update(cc: CommentComp, c:ImageContent): Void {
		return cc.commentComp("update", c);
	}
}


@:native("$")
extern class CommentComp extends ContentComp {

	@:overload(function<T>(cmd : String):T{})
	@:overload(function<T>(cmd : String, param:Dynamic):T{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function commentComp(?opts: CommentCompOptions): CommentComp;

	private static function __init__(): Void {
		var defineWidget: Void->CommentCompWidgetDef = function(): CommentCompWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: CommentCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of CommentComp must be a div element");
		        	}

		        	selfElement.addClass("_commentComp ui-state-highlight " + Widgets.getWidgetClasses());
                    var props: ConnectionCompOptions;
		        	if(self.options.comment.connectionIid == Qoid.currentAlias.connectionIid) 
                        props = { aliasIid: Qoid.currentAlias.iid };
                    else
                        props = { connectionIid: self.options.comment.connectionIid };
                    new ConnectionComp("<div></div>")
                        .connectionComp(props)
                        .appendTo(selfElement);
                    new JQ("<div>" + self.options.comment.props.text + "</div>").appendTo(selfElement);
				},

		        destroy: function() {
		        	var self: CommentCompWidgetDef = Widgets.getSelf();
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.commentComp", defineWidget());
	}
}