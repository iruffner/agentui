package ap.pages;

import ap.APhotoContext;
import ap.model.APhotoModel.APhotoContentTypes;
import ap.model.APhotoModel.ConfigContent;
import ap.model.ContentSource;
import ap.pages.APhotoPageMgr;
import haxe.Json;
import m3.jq.JQ;


import ap.widget.AlbumDetails;
import ap.widget.ContentFeed;
import ap.model.EM;
import m3.observable.OSet.EventType;
import m3.observable.OSet.FilteredSet;
import agentui.model.Filter;
import qoid.model.ModelObj;
import agentui.model.Node;
import qoid.Qoid;
import qoid.QoidAPI;

using m3.helper.OSetHelper;
using ap.widget.MediaComp;
using Lambda;

class ContentScreen extends APhotoPage {

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

		var contentId: String = APhotoContext.CURRENT_MEDIA;

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

		var albumDetails: AlbumDetails = new AlbumDetails("<div></div>");
		albumDetails.appendTo(leftSideOfPage);
		albumDetails.albumDetails({
			label: label,
			parentIid: APhotoContext.ROOT_ALBUM.iid
		});

		var setDefaultBtn: JQ = new JQ("<button class='setDefaultBtn'>Set as Default Picture</button>")
			.click(function(evt: JQEvent) {
					//find this config
					var config: ConfigContent = null;
					var event: String = null;
					APhotoContext.ALBUM_CONFIGS.iter(function(c: ConfigContent) {
							var match: LabeledContent = Qoid.labeledContent.getElementComplex(c.iid+"_"+label.iid, function(lc: LabeledContent): String {
										return lc.contentIid+"_"+lc.labelIid;
									});
							if(match != null) config = c;
						});
					if(config == null) {
						config = new ConfigContent();
						event = EMEvent.CreateContent;
					} else {
						config.props.defaultImg = _content.props.imgSrc;
						event = EMEvent.UpdateContent;
					}
					config.props.defaultImg = _content.props.imgSrc;
					
					var ccd = new EditContentData(config);
					ccd.labelIids.push(APhotoContext.CURRENT_ALBUM);
					EM.change(event, ccd);
				})
			.button()
			.appendTo(leftSideOfPage);

		var removeBtn: JQ = new JQ("<button class='removeBtn'>Remove From This Album</button>")
			.click(function(evt: JQEvent) {
					EM.listenOnce(EMEvent.OnRemoveContentLabel, function(n: {}) {
                            APhotoContext.PAGE_MGR.CURRENT_PAGE = APhotoPageMgr.ALBUM_SCREEN;
                        });
                    QoidAPI.removeContentLabel( APhotoContext.CURRENT_MEDIA, APhotoContext.CURRENT_ALBUM);
				})
			.button()
			.appendTo(leftSideOfPage);
	}

	private function _noLabel(screen: JQ) {

	}
	
	private function pageHideFcn(screen: JQ): Void {
		var content: JQ = new JQ(".content", screen).empty();
		if(this._onDestroy != null) this._onDestroy();
	}
}