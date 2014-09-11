package ap.pages;

import ap.APhotoContext;
import m3.jq.JQ;


import ap.widget.AlbumDetails;
import ap.widget.ContentFeed;
import ap.model.EM;
import m3.jq.M3Dialog;
import m3.observable.OSet.EventType;
import m3.observable.OSet.FilteredSet;
import agentui.model.Filter;
import qoid.model.ModelObj;
import agentui.model.Node;
import agentui.widget.UploadComp;
import qoid.Qoid;

using m3.helper.OSetHelper;
using ap.widget.AlbumList;
using m3.jq.M3Dialog;

class AlbumScreen extends APhotoPage {

	var labelSetListener: Label->EventType->Void;
	var labelSet: FilteredSet<Label>;

	public function new(): Void {
		super({
			id: "#albumScreen",
			pageBeforeShowFcn: pageBeforeShowFcn, 
			pageHideFcn: pageHideFcn, 
			reqUser: true,
			showBackButton: false
		});
	}

	private function pageBeforeShowFcn(screen: JQ): Void {
		var content: JQ = new JQ(".content", screen).empty();
		content.addClass("center");

		labelSet = new FilteredSet(Qoid.labels, function(l: Label) {
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

		var leftDiv: JQ = new JQ("<div class='leftDiv'></div>").appendTo(content);

		var albumDetails: AlbumDetails = new AlbumDetails("<div></div>");
		albumDetails.appendTo(leftDiv);
		albumDetails.albumDetails({
			label: label,
			parentIid: APhotoContext.ROOT_ALBUM.iid
		});

		var uploadButton: JQ = new JQ("<button class='uploadButton'>Upload</button>")
			.appendTo(leftDiv)
			.button({
					{
	                    icons: {
	                        primary: "ui-icon-circle-plus"
	                      }
	                }
				})
			.click(function(evt: JQEvent) {
					var dlg: M3Dialog = new M3Dialog("<div id='profilePictureUploader'></div>");
					dlg.appendTo(screen);
					var uploadComp: UploadComp = new UploadComp("<div class='boxsizingBorder' style='height: 150px;'></div>");
					uploadComp.appendTo(dlg);
					uploadComp.uploadComp({
							onload: function(bytes: String): Void {
								dlg.close();
								var ccd = new EditContentData(ContentFactory.create(ContentTypes.IMAGE, bytes));
								ccd.labelIids.push(APhotoContext.CURRENT_ALBUM);			
								EM.change(EMEvent.CreateContent, ccd);
							}
						});
					
					dlg.m3dialog({
							width: 400,
							height: 305,
							title: "Add Picture to Album",
							buttons: {
								"Cancel" : function() {
									M3Dialog.cur.close();
								}
							}
						});
				});

		var root: Node = new Or();
		root.type = "ROOT";
		var path = new Array<String>();
		path.push(Qoid.labels.getElement(Qoid.currentAlias.labelIid).name);
		path.push(APhotoContext.ROOT_LABEL_OF_ALL_APPS.name);
		path.push(APhotoContext.ROOT_ALBUM.name);
		path.push(label.name);
		root.addNode(new LabelNode(label, path));

		var filterData = new FilterData("content");
		filterData.filter = new Filter(root);
		filterData.connectionIids = [];
		filterData.aliasIid       = Qoid.currentAlias.iid;

		EM.change(EMEvent.FILTER_RUN, filterData);

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