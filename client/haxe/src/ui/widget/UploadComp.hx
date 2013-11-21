package ui.widget;

import m3.jq.JQ;
import m3.util.JqueryUtil;
import m3.widget.Widgets;
import m3.exception.Exception;
import ui.model.ModelObj;

using m3.helper.ArrayHelper;

typedef UploadCompOptions = {
	 @:optional var contentType: ContentType;
}

typedef UploadCompWidgetDef = {
	@:optional var options: UploadCompOptions;
	@:optional var inner_element_id: String;
	var _create: Void->Void;
	var destroy: Void->Void;

	var value: Void->String;
	var clear: Void->Void;

	var _uploadFile: Dynamic->Void;
	var _traverseFiles: Dynamic->Void;
	var setPreviewImage:String->Void;

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

	public static function setPreviewImage(m:UploadComp, src:String):Void {
		m.uploadComp("setPreviewImage", src);
	}

}

@:native("$")
extern class UploadComp extends JQ {

	@:overload(function<T>(cmd : String):T{})
	@:overload(function(cmd:String, opt:String):Dynamic{})
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
						AppContext.LOGGER.debug("dragleave");

						var target = evt.target;
						
						if (target != null && target == selfElement[0]) {
							JQ.cur.removeClass("drop");
						}
						evt.preventDefault();
						evt.stopPropagation();
					});
					
					selfElement.on("dragenter", function (evt: JQEvent, d: Dynamic) {
						AppContext.LOGGER.debug("dragenter");

						JQ.cur.addClass("over");
						evt.preventDefault();
						evt.stopPropagation();
					});
					
					selfElement.on("dragover", function (evt: JQEvent, d: Dynamic) {
						AppContext.LOGGER.debug("dragover");

						evt.preventDefault();
						evt.stopPropagation();
					});
					
					selfElement.on("drop", function (evt: JQEvent, d: Dynamic) {
						AppContext.LOGGER.debug("drop");

						self._traverseFiles(evt.originalEvent.dataTransfer.files);
						JQ.cur.removeClass("drop");
						evt.preventDefault();
						evt.stopPropagation();
					});
		        },

		        _createFileUploadComponent: function() {
		        	var self: UploadCompWidgetDef = Widgets.getSelf();
		        	var selfElement: JQ = Widgets.getSelfElement();
		        	
		        	if (self.inner_element_id != null) {
			        	new JQ("#" + self.inner_element_id).remove();
		        	}
		        	self.inner_element_id = "files-upload-" + StringTools.hex(Std.random(999999));
		        	
		        	var filesUpload = new JQ("<input id='" + self.inner_element_id + "' class='files-upload' type='file'/>").prependTo(selfElement);
					filesUpload.change(function (evt: JQEvent) {
						untyped self._traverseFiles(JQ.curNoWrap.files);
					});
		        },

		        _uploadFile: function(file: Dynamic) {
		        	var self: UploadCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

		        	if (untyped __js__("typeof FileReader === 'undefined'")) {
		        		JqueryUtil.alert("FileUpload is not supported by your browser");
		        		return;
		        	}

		        	if (self.options.contentType == ContentType.IMAGE && !(~/image/i).match(file.type)) {
		        		JqueryUtil.alert("Please select an image file.");
		        		return;
		        	}

		        	if (self.options.contentType == ContentType.AUDIO && !(~/audio/i).match(file.type)) {
		        		JqueryUtil.alert("Please select an audio file.");
		        		return;
		        	}

					AppContext.LOGGER.debug("upload " + file.name);


					// TODO:  Add controls for previewing audio content
	        		// var audioControls: JQ = new JQ("<audio controls></audio>").appendTo(selfElement);
	        		// postContent.append(audioControls);
	        		// audioControls.append("<source src='" + audio.audioSrc + "' type='" + audio.audioType + "'>Your browser does not support the audio element.");

					// present a preview in the file list
					var reader = untyped __js__("new FileReader()");
					reader.onload = function (evt) {
						self.setPreviewImage(evt.target.result);
					};
					reader.readAsDataURL(file);
				},

				setPreviewImage: function(src:String):Void {
					var self: UploadCompWidgetDef = Widgets.getSelf();
					if (self.previewImg == null) {
						var selfElement: JQ = Widgets.getSelfElement();
						self.previewImg = new JQ("<img class='file_about_to_be_uploaded'/>").appendTo(selfElement);
					}
					self.previewImg.attr("src", src);
				},

				_traverseFiles: function(files: Array<Dynamic>) {
					AppContext.LOGGER.debug("traverse the files");
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