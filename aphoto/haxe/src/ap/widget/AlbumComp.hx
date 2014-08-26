package ap.widget;

import ap.APhotoContext;
import ap.AppContext;
import ap.pages.APhotoPageMgr;
import haxe.Json;
import m3.jq.JQ;
import m3.jq.JQDroppable;
import m3.jq.JQDraggable;
import m3.widget.Widgets;
import m3.observable.OSet;
import m3.exception.Exception;
import m3.util.UidGenerator;

import qoid.widget.FilterableComponent;
import qoid.model.ModelObj;
import qoid.model.Node;
import ap.model.EM;

using ap.widget.AlbumComp;
using m3.helper.OSetHelper;
using StringTools;

typedef AlbumCompOptions  = { 
	var album: Label;
}

typedef AlbumCompWidgetDef = {
	@:optional var options: AlbumCompOptions;
	@:optional var filteredSet:FilteredSet<Label>;
	var _create: Void->Void;
	var _registerListeners: Void->Void;
	@:optional var _super: Void->Void;
	@:optional var _onupdate: Label->EventType->Void;
	@:optional var _onAlbumConfig: ConfigContent->EventType->Void;
	var destroy: Void->Void;
	var getLabel:Void->Label;

	@:optional var img: JQ;
	@:optional var nameDiv: JQ;
}

class AlbumCompHelper {
	public static function getLabel(l: AlbumComp): Label {
		return l.albumComp("getLabel");
	}
}
@:native("$")
extern class AlbumComp extends JQ {

	@:overload(function<T>(cmd : String):T{})
	@:overload(function<T>(cmd:String, opt:String):T{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function albumComp(opts: AlbumCompOptions): AlbumComp;

	private static function __init__(): Void {
		var defineWidget: Void->AlbumCompWidgetDef = function(): AlbumCompWidgetDef {
			return {

		        getLabel: function():Label {
		        	var self: AlbumCompWidgetDef = Widgets.getSelf();
		        	return self.options.album;
		        },

		        _registerListeners: function():Void {
		        	var self: AlbumCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

			        self._onupdate = function(label:Label, t:EventType): Void {
						if (t.isAddOrUpdate()) {
							self.options.album = label;
				        } else if (t.isDelete()) {
				        	self.destroy();
				        	selfElement.remove();
				        }
		        	};
		        
		        	self.filteredSet = new FilteredSet<Label>(AppContext.LABELS, function(label:Label):Bool {
		        		return label.iid == self.options.album.iid;
		        	});
					self.filteredSet.listen(self._onupdate);

					self._onAlbumConfig = function(mc: ConfigContent, evt: EventType) {
						var match: LabeledContent = AppContext.LABELEDCONTENT.getElementComplex(mc.iid+"_"+self.options.album.iid, function(lc: LabeledContent): String {
								return lc.contentIid+"_"+lc.labelIid;
							});
						if(match != null) {
							try {
								self.img.attr("src", mc.props.defaultImg);
							} catch (err: Dynamic) {
								AppContext.LOGGER.error("problem using the default img");
							}
						}
					}
					APhotoContext.ALBUM_CONFIGS.listen(self._onAlbumConfig);
		        },
		        
		        _create: function(): Void {
		        	var self: AlbumCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
					if(!selfElement.is("div")) {
		        		throw new Exception("Root of AlbumComp must be a div element");
		        	}

		        	selfElement.addClass("_albumComp ").attr("id", self.options.album.name.htmlEscape() + "_" + UidGenerator.create(8));

		        	self.img = new JQ("<img src='" + "media/albums-icon.jpg" + "' />").appendTo(selfElement);
		        	selfElement.append("<br/>");
		        	self.nameDiv = new JQ("<div class='labelNameWrapper'></div>").appendTo(selfElement);
		        	self.nameDiv.append("<span class='albumLabel'>" + self.options.album.name + "</span>");
		        	
		        	self._registerListeners();

		        	selfElement.click(function(evt: JQEvent) {
	            			APhotoContext.CURRENT_ALBUM = self.options.album.iid;
		        			APhotoContext.PAGE_MGR.CURRENT_PAGE = APhotoPageMgr.ALBUM_SCREEN;
	            			js.Browser.window.history.pushState(
	            				{}, 
	            				self.options.album.iid,
	            				"index.html?album=" + self.options.album.iid
            				);
		        		});
		        },

		        destroy: function() {
		        	var self: AlbumCompWidgetDef = Widgets.getSelf();
		        	self.filteredSet.removeListener(self._onupdate);
		        	APhotoContext.ALBUM_CONFIGS.removeListener(self._onAlbumConfig);
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    };
		}
		JQ.widget( "ui.albumComp", defineWidget());
	}	
}