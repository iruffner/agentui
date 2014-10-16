package pagent.widget;

import js.html.Element;
import m3.log.Logga;
import m3.serialization.Serialization;
import pagent.model.PinterModel;
import pagent.model.EM;
import m3.jq.JQ;
import m3.widget.Widgets;
import qoid.model.ModelObj;
import m3.exception.Exception;
import qoid.Qoid;
import qoid.QoidAPI;
import qoid.ResponseProcessor.Response;

using m3.helper.ArrayHelper;
using m3.helper.StringHelper;
using pagent.widget.CommentComp;
using Lambda;

typedef CommentsCompOptions = {
	var content: Content<Dynamic>;
}

typedef CommentsCompWidgetDef = {
	@:optional var options: CommentsCompOptions;
	var _create: Void->Void;
	var _addComment: MessageContent->Void;
	var destroy: Void->Void;

    @:optional var header: JQ;
    @:optional var commentsListenerId: String;
}


class CommentsCompHelper {
	public static function content(cc: CommentsComp): Content<Dynamic> {
		return cc.commentsComp("option", "content");
	}

	public static function update(cc: CommentsComp, c:ImageContent): Void {
		return cc.commentsComp("update", c);
	}
}


@:native("$")
extern class CommentsComp extends ContentComp {

	@:overload(function<T>(cmd : String):T{})
	@:overload(function<T>(cmd : String, param:Dynamic):T{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function commentsComp(?opts: CommentsCompOptions): CommentsComp;

	private static function __init__(): Void {
		var defineWidget: Void->CommentsCompWidgetDef = function(): CommentsCompWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: CommentsCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of CommentsComp must be a div element");
		        	}

		        	selfElement.addClass("_commentsComp " + Widgets.getWidgetClasses());
		        	
                    self.header = new JQ("<h2>Comments</h2>").appendTo(selfElement);

					var content: Content<Dynamic> = self.options.content;

                    var newCommentDiv: JQ = new JQ("<div class='newComment'></div>").appendTo(selfElement);
                    var ta: JQ = new JQ("<textarea class='boxsizingBorder container' style='resize: none; width: 100%;'></textarea>")
                            .appendTo(newCommentDiv)
                            .attr("id", "textInput_ta");
                    newCommentDiv.append("<br/>");
                    newCommentDiv.append(
                        new JQ("<button class='ui-helper-clearfix fright'>Add Comment</button>")
                            .button()
                            .click(function() {
                                    var value: String = ta.val();
                                    if(value.isBlank()) return;
                                    var ccd = new EditContentData(ContentFactory.create(ContentTypes.TEXT, value));
                                    ccd.content.contentType = PinterContentTypes.COMMENT;                  
                                    ccd.labelIids.push(PinterContext.COMMENTS.iid);
                                    ccd.semanticId = self.options.content.semanticId;

                                    EM.listenOnce(EMEvent.OnCreateContent, function(n: {}) {
                                            // self._addComment(null);
                                            ta.val("");
                                        });

                                    EM.change(EMEvent.CreateContent, ccd);
                                })
                    );
                    selfElement.append("<div class='clear'></div>");

                    self.commentsListenerId = EM.addListener(EMEvent.OnContentComments, function(data: Response) {
                            if(data.result.results.hasValues())
                                for (result in data.result.results) {
                                    var c: MessageContent = Serializer.instance.fromJsonX(result, MessageContent);
                                    if(c != null) { //occurs when there is an unknown content type
                                        if(data.result.route.hasValues())
                                            c.connectionIid = data.result.route[0];
                                        self._addComment(c);
                                    }
                                }
                        });
                    var query: String = 
                        "hasLabelPath('" + PinterContext.ROOT_LABEL_NAME_OF_ALL_APPS + "', '" + PinterContext.APP_ROOT_LABEL_NAME + "', '" + PinterContext.APP_COMMENTS_LABEL_NAME + "') " + 
                            "and contentType = '" + PinterContentTypes.COMMENT + "' and semanticId = '" + self.options.content.semanticId + "'";
                    QoidAPI.query( new RequestContext(EMEvent.ContentComments, content.semanticId+"_"+Qoid.currentAlias.connectionIid), 
                        "content", 
                        query,
                        true, true
                    );
                    Qoid.connections.iter(function(c: Connection) {
                            QoidAPI.query( new RequestContext(EMEvent.ContentComments, content.semanticId+"_"+c.iid), 
                                "content", 
                                query,
                                true, true,
                                [c.iid]
                            );
                        });
				},

				_addComment: function(comment: MessageContent) {
					var self: CommentsCompWidgetDef = Widgets.getSelf();

                    var commentComp: CommentComp = new CommentComp("<div></div>").commentComp({ comment: comment });
                    var comps = new JQ("._commentComp");
                    var inserted = false;
                    comps.each(function(i: Int, dom: Element):Dynamic{
                        var cc = new CommentComp(dom);
                        var cmp = StringHelper.compare(commentComp.comment().getTimestamp(), cc.comment().getTimestamp());
                        if (cmp < 0) {
                            cc.before(commentComp);
                            inserted = true;
                            return false;
                        } else {
                            return true;
                        }
                    });

                    if (!inserted) {
                        if(comps.length > 0)
                            comps.last().after(commentComp);
                        else
                            commentComp.insertAfter(self.header);
                    }
				},

		        destroy: function() {
		        	var self: CommentsCompWidgetDef = Widgets.getSelf();
                    QoidAPI.cancelQuery( new RequestContext(EMEvent.ContentComments, self.options.content.semanticId+"_"+Qoid.currentAlias.connectionIid));
                    Qoid.connections.iter(function(c: Connection) {
                            QoidAPI.cancelQuery( new RequestContext(EMEvent.ContentComments, self.options.content.semanticId+"_"+c.iid));
                        });
		        	EM.removeListener(EMEvent.OnContentComments, self.commentsListenerId);
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.commentsComp", defineWidget());
	}
}