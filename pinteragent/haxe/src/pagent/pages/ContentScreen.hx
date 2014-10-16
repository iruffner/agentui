package pagent.pages;

import pagent.PinterContext;
import pagent.model.ContentSource;
import haxe.Json;
import m3.jq.JQ;

import pagent.widget.BoardDetails;
import pagent.widget.PinFeed;
import pagent.model.EM;
import m3.observable.OSet.EventType;
import m3.observable.OSet.FilteredSet;
import agentui.model.Filter;
import agentui.model.Node;
import qoid.model.ModelObj;
import qoid.Qoid;

using m3.helper.OSetHelper;
using pagent.widget.MediaComp;
using Lambda;

class ContentScreen extends PinterPage {

	var _onDestroy: Void->Void;
	var labelSetListener: Label->EventType->Void;
	var labelSet: FilteredSet<Label>;
	var _content: ImageContent;

	public function new(): Void {
		super({
			id: "#contentScreen",
			pageBeforeShowFcn: pageBeforeShowFcn,
			pageHideFcn: pageHideFcn,
			reqUser: true,
			showBackButton: true
		});
	}

	private function pageBeforeShowFcn(screen: JQ): Void {
		var contentDiv: JQ = new JQ(".content", screen).empty();
		contentDiv.addClass("center");

		var contentId: String = PinterContext.CURRENT_MEDIA;

		labelSet = new FilteredSet(Qoid.labels, function(l: Label) {
				return l.iid == PinterContext.CURRENT_BOARD;
			});
		
		this.labelSetListener = function(label: Label, evt: EventType) {
			if(evt.isAddOrUpdate())
				_applyAlbumToScreen(screen, label);
			if(evt.isClear() || evt.isDelete())
				_noLabel(screen);
		}

		labelSet.listen(this.labelSetListener, true);


		var mapListener = function(content: Content<Dynamic>, contentComp:MediaComp, evt: EventType): Void {
			if(content != null && content.iid == contentId) {
				_content = cast content;
	    		if(evt.isAdd()) {
    				contentComp.appendTo(contentDiv);
	    		} else if (evt.isUpdate()) {
	    			contentComp.update(content);
	    		} else if (evt.isDelete()) {
	    			contentComp.remove();
	    		}
			}
    	};

    	var beforeSetContent = JQ.noop;
    	var widgetCreator = function(content:Content<Dynamic>): MediaComp {
    		if(content != null && content.iid == contentId)
	    		return new MediaComp("<div></div>").mediaComp({
					content: content
				});
			else
				return null;
    	}
    	var id: String = ContentSource.addListener(mapListener, beforeSetContent, widgetCreator);
    	this._onDestroy = function() {
    		ContentSource.removeListener(id);
    		labelSet.removeListener(this.labelSetListener);
    		this.labelSet = null;
    	}
		
	}

	private function _applyAlbumToScreen(screen: JQ, label: Label) {
		var content: JQ = new JQ(".content", screen).empty();
		content.addClass("center");

		var leftSideOfPage: JQ = new JQ("<div class='leftWrap'></div>").appendTo(content);

		var albumDetails: BoardDetails = new BoardDetails("<div></div>");
		albumDetails.appendTo(leftSideOfPage);
		albumDetails.boardDetails({
			label: label,
			parentIid: PinterContext.ROOT_BOARD.iid,
			showOptionBar: false
		});

		
	}

	private function _noLabel(screen: JQ) {

	}
	
	private function pageHideFcn(screen: JQ): Void {
		var content: JQ = new JQ(".content", screen).empty();
		if(this._onDestroy != null) this._onDestroy();
	}
}