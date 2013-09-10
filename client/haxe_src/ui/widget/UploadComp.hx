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

	var _uploadFile: Dynamic->Void;
	var _traverseFiles: Dynamic->Void;
}

@:native("$")
extern class UploadComp extends JQ {

	@:overload(function(cmd : String):Bool{})
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

		        	var filesUpload = new JQ("<input id='files-upload' type='file' multiple style='float: left;margin-top: 25px;margin-left: 25px;'/>").appendTo(selfElement);



		   //      	var filesUpload: JQ = new JQ("files-upload"),
					// 	dropArea: JQ = new JQ("drop-area"),
					// 	fileList: JQ = new JQ("file-list");

					filesUpload.change(function (evt: JQEvent) {
						untyped self._traverseFiles(JQ.curNoWrap.files);
					});
					
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

		        _uploadFile: function(file: Dynamic) {
		        	var self: UploadCompWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

					ui.AgentUi.LOGGER.debug("upload " + file.name);

					// var li = new JQ("<li></li>"),
					// 	div = new JQ("<div></div>"),
					// 	img,
					// 	progressBarContainer = new JQ("<div></div>"),
					// 	progressBar = new JQ("<div></div>"),
					// 	reader,
					// 	xhr,
					// 	fileInfo;
						
					// li.append(div);
					
					// progressBarContainer.addClass("progress-bar-container");
					// progressBar.addClass("progress-bar");
					// progressBarContainer.append(progressBar);
					// li.append(progressBarContainer);
					
					/*
						If the file is an image and the web browser supports FileReader,
						present a preview in the file list
					*/
					if (untyped __js__("typeof FileReader !== 'undefined'") && (~/image/i).match(file.type)) {
						var img = new JQ("<img style='max-height: 90px;'/>").appendTo(selfElement);
						var reader = untyped __js__("new FileReader()");
						reader.onload = function (evt) {
							// return function (evt) {
							img.attr("src", evt.target.result);
							// };
						};
						// }(img));
						reader.readAsDataURL(file);
					}
					
					// // Uploading - for Firefox, Google Chrome and Safari
					// xhr = new XMLHttpRequest();
					
					// // Update progress bar
					// xhr.upload.on("progress", function (evt: JQEvent, d: Dynamic) {
					// 	if (evt.lengthComputable) {
					// 		progressBar.style.width = (evt.loaded / evt.total) * 100 + "%";
					// 	}
					// 	else {
					// 		// No data to calculate on
					// 	}
					// });
					
					// // File uploaded
					// xhr.on("load", function (evt: JQEvent, d: Dynamic) {
					// 	progressBarContainer.addClass = "uploaded";
					// 	progressBar.innerHTML = "Uploaded!";
					// });
					
					// xhr.open("post", "upload/upload.php", true);
					
					// // Set appropriate headers
					// xhr.setRequestHeader("Content-Type", "multipart/form-data");
					// xhr.setRequestHeader("X-File-Name", file.name);
					// xhr.setRequestHeader("X-File-Size", file.size);
					// xhr.setRequestHeader("X-File-Type", file.type);

					// // Send the file (doh)
					// xhr.send(file);
					
					// // Present file info and append it to the list of files
					// fileInfo = "<div><strong>Name:</strong> " + file.name + "</div>";
					// fileInfo += "<div><strong>Size:</strong> " + parseInt(file.size / 1024, 10) + " kb</div>";
					// fileInfo += "<div><strong>Type:</strong> " + file.type + "</div>";
					// div.innerHTML = fileInfo;
					
					// fileList.append(li);
				},

				_traverseFiles: function(files: Array<Dynamic>) {
					ui.AgentUi.LOGGER.debug("traverse the files");
		        	var self: UploadCompWidgetDef = Widgets.getSelf();

					if (files.hasValues()) {
						for (i in 0...files.length) {
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
		        }
		    };
		}
		JQ.widget( "ui.uploadComp", defineWidget());
	}
}