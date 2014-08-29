package m3.widget;

import m3.jq.JQ;
import m3.util.JqueryUtil;
import m3.widget.Widgets;

using m3.jq.M3Dialog;
using m3.helper.StringHelper;
using m3.helper.ArrayHelper;
using StringTools;

typedef CodeEditorOptions = {
	@:optional var label: String;
    @:optional var dialogOptions: M3DialogOptions;
    @:optional var mode: String;
    @:optional var src: JQ;
    @:optional var submit: String->Void;//action to take when 'OK' button is clicked
    @:optional var cancel: Void->Void;//action to take when 'Cancel' button is clicked
    @:optional var text: String;//text that should be shown in the editor on show
}

typedef CodeEditorWidgetDef = {
	@:optional var editorDiv: JQ;
	@:optional var editor: Dynamic;
	@:optional var editorInitialized: Bool;
	var options: CodeEditorOptions;
	var _create: Void->Void;
	var _buildDialog: Void->Void;
	var _initializeEditor: Void->Void;
	var showEditor: Void->Void;
	var getText: Void->String;
	var destroy: Void->Void;
}

/*
	This requires ace.js and jquery-ui 1.11.0+
*/
@:native("$")
extern class CodeEditor extends JQ {

	public static var JAVASCRIPT: String;
	public static var JSON: String;
	public static var HAXE: String;
	public static var SQL: String;

	private static var modes: Array<String>;

	public static var supported: String->Bool;

	@:overload(function(cmd:String):Dynamic{})
	@:overload(function(cmd:String, opt:String, val:Dynamic):Dynamic{})
	function codeEditor(opts:CodeEditorOptions): CodeEditor;

	private static function __init__(): Void {
		JAVASCRIPT = "javascript";
		JSON = "json";
		HAXE = "haxe";
		SQL = "sql";
		modes = [JAVASCRIPT, JSON, HAXE, SQL];
		supported = function(mode: String) {
			return modes.contains(mode);
		}
		var defineWidget: Void->CodeEditorWidgetDef = function(): CodeEditorWidgetDef {
			return {
		        options: {
		            dialogOptions: {
		                autoOpen: false,
		                height: 450,
		                width: 630,
		                modal: true,
		                title: "Code Editor",
		                buttons: { 
		                    "OK":  function() { 
		                        M3Dialog.cur.close();
		                        var self: CodeEditorWidgetDef = CodeEditor.cur.codeEditor("instance");
		                        self.options.submit(self.editor.getValue());
		                    },
		                    "Cancel": function() { 
		                        M3Dialog.cur.close(); 
		                        var self: CodeEditorWidgetDef = CodeEditor.cur.codeEditor("instance");
		                        self.options.cancel();
		                    }
		                }
		            },
		        },

		        _create: function() {
		            var self: CodeEditorWidgetDef = Widgets.getSelf();
	    			var selfElement: M3Dialog = Widgets.getSelfElement();
		            selfElement.addClass("_codeEditor");
		            self.editorInitialized = false;
	    			//add the input and do the right thing to make this an editor
		            self._buildDialog();
		        },
		        
		        showEditor: function(): Void {
		        	var self: CodeEditorWidgetDef = Widgets.getSelf();
	    			var selfElement: M3Dialog = Widgets.getSelfElement();
	    			if(self.options.src != null)
		            	self.options.dialogOptions.position = 
		            		[ self.options.src.offset().left - self.options.dialogOptions.width, self.options.src.offset().top ];
		            if(!selfElement.isOpen()) {
		                selfElement.open();
		            }
		            if(!self.editorInitialized) {
		            	self._initializeEditor();
		            } else {
		            	self.editor.setValue(self.options.text);
		            }
		        },
		        
		        _buildDialog: function(): Void {
		        	var self: CodeEditorWidgetDef = Widgets.getSelf();
	    			var selfElement: M3Dialog = Widgets.getSelfElement();
	    			self.editorDiv = new JQ("<div id='aceEditorDiv'></div>");
	    			self.editorDiv.css({
	    				position: "absolute",
				        top: 0,
				        right: 0,
				        bottom: 0,
				        left: 0,
				        "text-align": "left"
    				});
	    			selfElement.append(self.editorDiv);
	    			selfElement.m3dialog(self.options.dialogOptions);
		        },
		        
		        _initializeEditor: function(): Void {
		        	var self: CodeEditorWidgetDef = Widgets.getSelf();
	    			untyped self.editor = ace.edit(self.editorDiv[0]);
	    			self.editor.setTheme("ace/theme/chrome");
    				self.editor.getSession().setMode("ace/mode/javascript");
    				self.editor.setValue(self.options.text);
    				self.editorInitialized = true;
	        	},

		        getText: function(): String {
		        	var self: CodeEditorWidgetDef = Widgets.getSelf();
		            return self.editor.val();
		        },

		        destroy: function() {
		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    }
		}
	    JQ.widget( "ui.codeEditor", defineWidget());
	}

	static var cur(get, null): CodeEditor;
	private static inline function get_cur() : CodeEditor {
		return untyped __js__("$(this)");
	}
}