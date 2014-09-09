package pagent.pages;

import m3.jq.JQ;

import pagent.AppContext;
import pagent.PinterContext;
import pagent.widget.PinFeed;
import pagent.model.EM;
import m3.jq.M3Dialog;
import m3.observable.OSet.EventType;
import m3.observable.OSet.FilteredSet;
import qoid.model.Filter;
import qoid.model.ModelObj.ContentFactory;
import qoid.model.ModelObj.ContentType;
import qoid.model.ModelObj.EditContentData;
import qoid.model.ModelObj.Label;
import qoid.model.Node;
import qoid.widget.UploadComp;

using m3.helper.OSetHelper;
using m3.jq.M3Dialog;
using pagent.widget.BoardDetails;

class BoardScreen extends PinterPage {

	var labelSetListener: Label->EventType->Void;
	var labelSet: FilteredSet<Label>;

	public function new(): Void {
		super({
			id: "#boardScreen",
			pageBeforeShowFcn: pageBeforeShowFcn, 
			pageHideFcn: pageHideFcn, 
			reqUser: true
		});
	}

	private function pageBeforeShowFcn(screen: JQ): Void {
		var content: JQ = new JQ(".content", screen).empty();
		content.addClass("center");

		labelSet = new FilteredSet(AppContext.LABELS, function(l: Label) {
				return l.iid == PinterContext.CURRENT_BOARD;
			});
		
		this.labelSetListener = function(label: Label, evt: EventType) {
			if(evt.isAddOrUpdate())
				_applyAlbumToScreen(screen, label);
			if(evt.isClear() || evt.isDelete())
				_noLabel(screen);
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
			owner: "Isaiah Ruffner"
		});

		var root: Node = new Or();
		root.type = "ROOT";
		var path = new Array<String>();
		path.push(AppContext.LABELS.getElement(AppContext.currentAlias.rootLabelIid).name);
		path.push(PinterContext.ROOT_LABEL_OF_ALL_APPS.name);
		path.push(PinterContext.ROOT_BOARD.name);
		path.push(label.name);
		root.addNode(new LabelNode(label, path));

		var filterData = new FilterData("content");
		filterData.filter = new Filter(root);
		filterData.connectionIids = [];
		filterData.aliasIid       = AppContext.currentAlias.iid;

		EM.change(EMEvent.FILTER_RUN, filterData);

		var contentFeed: PinFeed = new PinFeed("<div></div>");
		contentFeed.appendTo(content);
		contentFeed.pinFeed();
	}

	private function _noLabel(screen: JQ) {

	}
	
	private function pageHideFcn(screen: JQ): Void {
		labelSet.removeListener(this.labelSetListener);
		labelSet = null;
	}
}