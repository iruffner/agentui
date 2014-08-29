package m3.forms;

import m3.forms.Forms;
import m3.jq.JQ;
import embi.App;
import haxe.Json;

class FormsDemo {

	public static function main() {

		App.LOADING_GIF = new embi.ui.MDLoadingGif();
		new JQ("document").ready(function (event) {
			new FormsDemo().start();
		});
    }

    static function prettyPrint(json: Dynamic): String {
		return untyped __js__("JSON.stringify(json, undefined, 2)");
    }

    var _mainDiv: JQ;
    var _formDemo: JQ;
    var _formUpdater: JQ;
    var _resultsUpdater: JQ;
    var _form: Form;
    var _formData: JQ;

    function new() {
    }

    function start() {

		var initialFormDef  = {
			cube: "TESTCUBE",
			fields: [
				{ name: "boogee", label: "Boogee Ooogee", type: "int" },
				{ 
					name: "oogee", 
					label: "Ooogee Boogee", 
					type: "combobox",
					values: [
						{ id: "A", description: "A as in Apple" },
						{ id: "B", description: "B as in Boy" },
						{ id: "C", description: "C as in Cat" }
					]
				},
				{ name: "booboo", label: "Is this a Boo Boo?", type: "boolean" }
			],
		}
   		
   		_mainDiv = new JQ("#tests_go_here");
   		_formDemo = new JQ("<div></div>");
   		_formUpdater = new JQ("<div></div>");
   		_resultsUpdater = new JQ("<div></div>");
		
		_mainDiv
			.append("<br/><br/>")
			.append("<b>The Form</b><br/>")
			.append(_formDemo)
			.append("<br/><br/>")
			.append("<b>Update Form Definition</b><br/>")
			.append(_formUpdater)
			.append("<br/><br/>")
			.append("<b>Results Updater</b><br/>")
			.append(_resultsUpdater)
			.append("<br/><br/>")
			;

		_form = new Form(initialFormDef, _formDemo);

		initFormUpdater(prettyPrint(initialFormDef));

		initFormData();

		exportFormData();

    }

    function initFormUpdater(initialJson: String) {

    	var textarea = new JQ('<textarea rows="10" cols="80"/>');
    	var updateForm = new JQ('<button>Update Form</button>');

    	textarea.val(initialJson);

    	_formUpdater
    		.append(textarea)
    		.append("<br/>")
    		.append(updateForm)
    		.append("<br/>")
    		;

		updateForm.click(function(evt) {
			var json = textarea.val();
			_formDemo.empty();
			_form = new Form(Json.parse(json), _formDemo);
			exportFormData();
		});

    }

    function initFormData() {

    	_formData = new JQ('<textarea rows="10" cols="80"/>');

    	var toForm = new JQ('<button>Push Into Form</button>');
    	var fromForm = new JQ('<button>Pull From Form</button>');

    	_resultsUpdater
    		.append(_formData)
    		.append("<br/>")
    		.append(toForm)
    		.append(fromForm)
    		.append("<br/>")
    		;

		toForm.click(function(evt) {
			var json = Json.parse(_formData.val());
			_form.load(json);
		});

		fromForm.click(function(evt) {
			exportFormData();
		});

    }

    function exportFormData() {
		var data = _form.export({});
		_formData.val(prettyPrint(data));
    }

}

