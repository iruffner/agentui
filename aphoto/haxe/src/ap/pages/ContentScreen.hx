package ap.pages;

import ap.APhotoContext;
import m3.jq.JQ;

import ap.AppContext;
import ap.widget.AlbumDetails;
import ap.widget.ContentFeed;
import m3.observable.OSet.EventType;
import m3.observable.OSet.FilteredSet;
import qoid.model.EM.EMEvent;
import qoid.model.Filter;
import qoid.model.ModelObj.Label;
import qoid.model.Node;

using m3.helper.OSetHelper;
using ap.widget.AlbumList;

class ContentScreen extends APhotoPage {

	public function new(): Void {
		super({
			id: "#contentScreen",
			pageBeforeShowFcn: pageBeforeShowFcn, 
			reqUser: true,
			showBackButton: false
		});
	}

	private function pageBeforeShowFcn(screen: JQ): Void {
		var content: JQ = new JQ(".content", screen).empty();
		content.addClass("center");

		labelSet = new FilteredSet(AppContext.LABELS, function(l: Label) {
				return l.iid == APhotoContext.CURRENT_ALBUM;
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

		var albumDetails: AlbumDetails = new AlbumDetails("<div></div>");
		albumDetails.appendTo(content);
		albumDetails.albumDetails({label: label});

		var root: Node = new Or();
		root.type = "ROOT";
		var path = new Array<String>();
    	for (iid in APhotoContext.CURRENT_ALBUM_PATH) {
    		var label = AppContext.LABELS.getElement(iid);
    		path.push(label.name);
    	}
		root.addNode(new LabelNode(label, path));

		var filterData = new FilterData("content");
		filterData.filter = new Filter(root);
		filterData.connectionIids = [];
		filterData.aliasIid       = AppContext.currentAlias.iid;

		qoid.model.EM.change(EMEvent.FILTER_RUN, filterData);

		var contentFeed: ContentFeed = new ContentFeed("<div></div>");
		contentFeed.appendTo(content);
		contentFeed.contentFeed();
	}

	private function _noLabel(screen: JQ) {

	}
	
	private function pageHideFcn(screen: JQ): Void {
		labelSet.removeListener(this.labelSetListener);
		labelSet = null;
	}
}