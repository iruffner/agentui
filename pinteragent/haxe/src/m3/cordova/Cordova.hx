package m3.cordova;

import m3.jq.JQ;
import js.html.fs.Metadata;

@:extern
class Cordova {
}

@:native("device")
extern class Device {
	public static var cordova: String;
	public static var model: String;
	public static var name: String;
	public static var platform: String;
	public static var uuid: String;
	public static var version: String;
}

@:native("navigator")
extern class CordovaNavigator extends js.html.Navigator {

	public static inline function get(): CordovaNavigator {
		return untyped js.Browser.navigator;
	}

	public var camera: Camera;
	public var device: { capture: Capture };
}

@:native("Capture")
extern class Capture {
	public function captureAudio(fcn: String->Void, errFcn: String->Void, options: Dynamic): Void;
	public function captureImage(fcn: String->Void, errFcn: String->Void, options: Dynamic): Void;
	public function captureVideo(fcn: String->Void, errFcn: String->Void, options: Dynamic): Void;
}

@:native("Camera")
extern class Camera {

	public function getPicture(fcn: Dynamic->Void, errFcn: String->Void, options: Dynamic): Void;
}

@:native("FileTransfer")
extern class FileTransfer {

	public function new() {}

	public function upload(uri: Dynamic, serverUrl: String, fcn: Metadata->Void, errFcn: JQEvent->Void, options: FileUploadOptions): Void;
	public dynamic function onprogress(progressEvent: Dynamic): Void;
}

@:native("FileUploadOptions")
extern class FileUploadOptions {

	public function new() {}

	public var fileKey: String;
    public var fileName: String;
    public var mimeType: String;
    public var chunkedMode: Bool;
    public var params: Dynamic;
    public var headers: Dynamic;
}

extern class InAppBrowser {
	public function addEventListener(eventName: String, callbak: InAppBrowserEvent->Void): Void;
	public function removeEventListener(eventName: String, callbak: InAppBrowserEvent->Void): Void;
	public function close(): Void;
	public function show(): Void;
	public function executeScript(injectDetails: {file: String, code: String}, callbak: Dynamic->Void): Void;
	public function insertCSS(injectDetails: {file: String, code: String}, callbak: Dynamic->Void): Void;
}

@:native("window.cookies")
extern class Cookies {
	public static function clear(callbak: Void->Void): Void;
}

typedef InAppBrowserEvent = {
	var type: String;
	var url: String;
	var code: Int;
	var message: String;
}

@:native("navigator.camera.EncodingType")
extern enum EncodingTypeEnum {
	JPEG;
	PNG;
}

@:native("navigator.camera.DestinationType")
extern enum DestinationTypeEnum {
	FILE_URI;  //image file URI
	DATA_URL;  //image as base64 encoded string
}

@:native("Camera.PictureSourceType")
extern enum PictureSourceTypeEnum {
	CAMERA; SAVEDPHOTOALBUM; PHOTOLIBRARY;
}

@:native("Camera.MediaType")
extern enum MediaTypeEnum {
	PICTURE; VIDEO; ALLMEDIA;
}

extern enum InAppBrowserEventType {
	loadstart;
	loadstop;
	loaderror;
	exit;
}

extern class MediaFile {
	public var end: Int;
	public var fullPath: String;
	public var lastModifiedDate: Float;
	public var localURL: String;
	public var name: String;
	public var size: Float;
	public var start: Int;
	public var type: String;
}