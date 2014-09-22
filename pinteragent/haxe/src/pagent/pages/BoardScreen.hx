package pagent.pages;

import m3.jq.JQ;

import pagent.model.ContentSource;
import pagent.PinterContext;
import pagent.widget.PinFeed;
import pagent.model.EM;
import m3.jq.M3Dialog;
import m3.observable.OSet.EventType;
import m3.observable.OSet.FilteredSet;
import agentui.model.Filter;
import qoid.model.ModelObj;
import agentui.model.Node;
import agentui.widget.UploadComp;
import qoid.Qoid;

using m3.helper.OSetHelper;
using m3.jq.M3Dialog;
using pagent.widget.BoardDetails;

class BoardScreen extends PinterPage {

	var labelSetListener: Label->EventType->Void;
	var labelSet: FilteredSet<Label>;

	var board: String;

	public function new(): Void {
		super({
			id: "#boardScreen",
			pageBeforeShowFcn: pageBeforeShowFcn, 
			pageHideFcn: pageHideFcn, 
			reqUser: true
		});
	}

	private function pageBeforeShowFcn(screen: JQ): Void {
		screen.addClass("__boardScreen");
		if(board != PinterContext.CURRENT_BOARD) {
			board = PinterContext.CURRENT_BOARD;
			var content: JQ = new JQ(".content", screen).empty();
			content.addClass("center");

			labelSet = new FilteredSet(PinterContext.sharedBoards, function(l: Label) {
					return l.iid == PinterContext.CURRENT_BOARD;
				});
			
			this.labelSetListener = function(label: Label, evt: EventType) {
				if(evt.isAddOrUpdate())
					_applyAlbumToScreen(screen, label);
				if(evt.isClear() || evt.isDelete())
					_noLabel(screen);
			}
		}
		
		labelSet.listen(this.labelSetListener, true);
	}

	private function _applyAlbumToScreen(screen: JQ, label: Label) {
		var content: JQ = new JQ(".content", screen).empty();
		content.addClass("center");

		var boardDetails: BoardDetails = new BoardDetails("<div></div>");
		boardDetails.appendTo(content);
		boardDetails.boardDetails({
			label: label,
			parentIid: PinterContext.ROOT_BOARD.iid,
			showOptionBar: true
		});

		ContentSource.clearQuery();

		var root: Node = new Or();
		root.type = "ROOT";
		var path = new Array<String>();
		path.push(Qoid.labels.getElement(Qoid.currentAlias.labelIid).name);
		path.push(PinterContext.ROOT_LABEL_OF_ALL_APPS.name);
		path.push(PinterContext.ROOT_BOARD.name);
		path.push(label.name);
		root.addNode(new LabelNode(label, path));

		var filterData = new FilterData("content");
		filterData.filter = new Filter(root);
		filterData.connectionIids = [];
		if(label.connectionIid != Qoid.currentAlias.iid) {
			filterData.connectionIids.push(label.connectionIid);
		}
		filterData.aliasIid       = Qoid.currentAlias.iid;

		EM.change(EMEvent.FILTER_RUN, filterData);

		var contentFeed: PinFeed = new PinFeed("<div></div>");
		contentFeed.appendTo(content);
		contentFeed.pinFeed({ isMyBoard: false });
	}

	private function _noLabel(screen: JQ) {

	}
	
	private function pageHideFcn(screen: JQ): Void {
		labelSet.removeListener(this.labelSetListener);
	}
}