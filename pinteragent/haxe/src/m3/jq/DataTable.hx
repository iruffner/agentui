package m3.jq;

import js.html.Element;
import js.JQuery;

typedef DataTableOptions = {
	@:optional var aaData: Array<Dynamic>;
	@:optional var aoColumnDefs:Dynamic;
	@:optional var bAutoWidth: Bool;
	@:optional var iDisplayLength: Int;
	@:optional var bJQueryUI: Bool;
	@:optional var bStateSave: Bool;
	@:optional var bSort: Bool;
	@:optional var sDom: String;
	@:optional var bDeferRender: Bool;
	@:optional var sScrollX: String;
	@:optional var sScrollXInner: String;
	@:optional var bScrollCollapse: Bool;
	@:optional var bProcessing: Bool;
	@:optional var fnRowCallback: Dynamic->Array<Dynamic>->Int->Int->Void;
	@:optional var fnInitComplete: Dynamic->Void;

    @:optional var aLengthMenu:Array<Dynamic>;    
    @:optional var bFilter: Bool;    
    @:optional var bPaginate: Bool;    

}

typedef DataTableColumnFilterDef = {
	var aoColumns:Array<Dynamic>;
	@:optional var sPlaceHolder:String;
	@:optional var sRangeSeparator:String;
	@:optional var sRangeFormat:String;
	@:optional var fnOnFiltered:Void->Void;
}

@:native("$")
extern class DataTable extends JQ{

	function dataTable(?options:DataTableOptions):DataTable;

	public var nTr:JQ;

	public function fnAdjustColumnSizing():Void;
	public function fnDeleteRow(row: Element):Void;
	public function fnVisibleToColumnIndex(i:Int):Int;
	public function rowGrouping(opts:{
	            iGroupingColumnIndex:Int, 
	            sGroupingClass:String, 
	            bExpandableGrouping: Bool, 
	            sGroupLabelPrefix: String, 
	            sEmptyGroupLabel: String,
	            fnGroupLabelFormat: Dynamic->String
	        }):Void;

	public function columnFilter(opts:DataTableColumnFilterDef):Void;

	public function fnSort(sort:Dynamic):Void;

	public function fnSettings():Dynamic;
	public function makeEditable(opts:Dynamic):Void;
	// public function makeEditable(opts:{
	//             sUpdateURL: String,
	//             sAddDeleteToolbarSelector: String,
	//             sAddNewRowButtonId: String,
	//             sDeleteRowButtonId: String,
	//             sAddNewRowFormId: String,
	//             sAddURL: String,
	//             sDeleteURL: String,
	//             oDeleteParameters: Dynamic,
	//             oUpdateParameters: Dynamic,
	//             aoColumns: Dynamic,
	//             oAddNewRowFormOptions: mdjq.JQ.DialogOptions
	//         }):Void;
	public function fnDraw(): Void;
	public function fnGetPosition(node: Element): Array<Int>;
	@:overload(function(node: Element, ?int: Int): Dynamic{})
	public function fnGetData(?row: Int, ?col: Int): Dynamic;
	public function fnGetNodes(?int: Int): Dynamic;

	public function fnUpdate(data: Dynamic, row: Dynamic, ?col: Int, ?redraw: Bool = true, ?runPreDraw: Bool = true): Int;

	public function fnSetColumnVis(col: Int, visible: Bool, ?redraw: Bool = true): Void;  

	/**
		Return the current JQuery element (in a callback), similar to $(this) in JS.
	**/
	static var cur(get, null) : DataTable;
	private static inline function get_cur() : DataTable {
		return untyped __js__("$(this)");
	}

	// private static function __init__() : Void untyped {
	// 	DataTable = window.jQuery;
	// }
	
}