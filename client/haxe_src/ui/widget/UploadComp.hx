package ui.widget;

import m3.jq.JQ;
import m3.widget.Widgets;
import m3.exception.Exception;
// import js.html.FileReader;
// import js.html.File;

using m3.helper.ArrayHelper;


typedef UploadCompOptions = {
}

typedef UploadCompWidgetDef = {
	@:optional var options: UploadCompOptions;
	var _create: Void->Void;
	var destroy: Void->Void;

	var value: Void->String;
	var clear: Void->Void;

	var _uploadFile: Dynamic->Void;
	var _traverseFiles: Dynamic->Void;

	var _createFileUploadComponent: Void->Void;

	@:optional var previewImg: JQ;

}

class UploadCompHelper {
	public static function value(m:UploadComp):String {
		return cast m.uploadComp("value");
	}

	public static function clear(m:UploadComp):Void {
		m.uploadComp("clear");
	}

}

@:native("$")
extern class UploadComp extends JQ {

	@:overload(function<T>(cmd : String):T{})
	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
	function uploadComp(?opts: UploadCompOptions): UploadComp;

	private static function __init__(): Void {
		var defineWidget: Void->UploadCompWidgetDef = function(): UploadCompWidgetDef {
			return {
		        _create: function(): Void {
		        	var self: UploadCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	if(!selfElement.is("div")) {
		        		throw new Exception("Root of UploadComp must be a div element");
		        	}

		        	selfElement.addClass("uploadComp container " + Widgets.getWidgetClasses());

		        	self._createFileUploadComponent();
					
					selfElement.on("dragleave", function (evt: JQEvent, d: Dynamic) {
						ui.AgentUi.LOGGER.debug("dragleave");

						var target = evt.target;
						
						if (target != null && target == selfElement[0]) {
							JQ.cur.removeClass("drop");
						}
						evt.preventDefault();
						evt.stopPropagation();
					});
					
					selfElement.on("dragenter", function (evt: JQEvent, d: Dynamic) {
						ui.AgentUi.LOGGER.debug("dragenter");

						JQ.cur.addClass("over");
						evt.preventDefault();
						evt.stopPropagation();
					});
					
					selfElement.on("dragover", function (evt: JQEvent, d: Dynamic) {
						ui.AgentUi.LOGGER.debug("dragover");

						evt.preventDefault();
						evt.stopPropagation();
					});
					
					selfElement.on("drop", function (evt: JQEvent, d: Dynamic) {
						ui.AgentUi.LOGGER.debug("drop");

						self._traverseFiles(evt.originalEvent.dataTransfer.files);
						JQ.cur.removeClass("drop");
						evt.preventDefault();
						evt.stopPropagation();
					});
		        },

		        _createFileUploadComponent: function() {
		        	var self: UploadCompWidgetDef = Widgets.getSelf();
		        	var selfElement: JQ = Widgets.getSelfElement();
		        	
		        	new JQ("#files-upload").remove();
		        	
		        	var filesUpload = new JQ("<input id='files-upload' type='file'/>").prependTo(selfElement);
					filesUpload.change(function (evt: JQEvent) {
						untyped self._traverseFiles(JQ.curNoWrap.files);
					});
		        },

		        _uploadFile: function(file: Dynamic) {
		        	if (untyped __js__("typeof FileReader === 'undefined'")) {
		        		js.Lib.alert("FileUpload is not supported by your browser");
		        		return;
		        	}

		        	if (!(~/image/i).match(file.type)) {
		        		js.Lib.alert("Please select an image file.");
		        		return;
		        	}

		        	var self: UploadCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

					ui.AgentUi.LOGGER.debug("upload " + file.name);

					// present a preview in the file list
					if (self.previewImg == null) {
						self.previewImg = new JQ("<img id='file_about_to_be_uploaded'/>").appendTo(selfElement);
					}
					var reader = untyped __js__("new FileReader()");
					reader.onload = function (evt) {
						self.previewImg.attr("src", evt.target.result);
					};
					reader.readAsDataURL(file);
				},

				_traverseFiles: function(files: Array<Dynamic>) {
					ui.AgentUi.LOGGER.debug("traverse the files");
		        	var self: UploadCompWidgetDef = Widgets.getSelf();

					if (files.hasValues()) {
						for (i in 0...1 /*files.length*/) {
							self._uploadFile(files[i]);
						}
					}
					else {
						//TODO show message the FILE API unsupported
						// fileList.innerHTML = "No support for the File API in this web browser";
					}	
				},

		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        },

		        value: function() {
		        	var self: UploadCompWidgetDef = Widgets.getSelf();
					return self.previewImg.attr("src");
		        },

		        clear: function() {
		        	var self: UploadCompWidgetDef = Widgets.getSelf();
		        	self.previewImg.remove();
		        	self.previewImg = null;
		        	self._createFileUploadComponent();
		        }
		    };
		}
		JQ.widget( "ui.uploadComp", defineWidget());
	}
}