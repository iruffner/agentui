package m3.forms;

import m3.exception.Exception;
import m3.jq.JQ;
import m3.jq.ComboBox;
import Reflect;


interface Widget {
	public function getElement(): JQ;
	public function getValue(): Dynamic;
	public function setValue(value: Dynamic): Void;
	public function addedToForm(): Void;
}

class AbstractWidget implements Widget {
    
	public var _element: JQ;

    public function new() {    	
    }

	public function getElement(): JQ {
		return _element;
	}

    public function setValue(value: Dynamic): Void {
    	_element.val(value);
    }

    public function getValue(): Dynamic {
    	return _element.val();
    }

	public function addedToForm(): Void {
	}

}

class TextFieldWidget extends AbstractWidget {

    public function new() {
    	super();
    	_element = new JQ('<input type="text"/>');
    }

}

class ComboBoxWidget extends AbstractWidget {

    public function new(field: Dynamic) {
    	super();
    	var cb = new ComboBox("<select id='" + field.name + "'></select>");
		var values: Array<{id: String, description: String}> = field.values;

	    for( v in values ) {
        	cb.append("<option value='" + v.id + "'>" + v.description + "</option>");
	    }

    	cb.change();
    	_element = cb;
    }

	override public function addedToForm(): Void {
		// commented out until we get the styling properrly taken care of
		// var cb = cast(_element, ComboBox);
		// cb.comboBox({
	 //    	customCssOnInput: "width: 95%;",
	 //    	customCssOnSpan: "width: 400px;"	
  //   	});
	}

    override public function setValue(value: Dynamic): Void {
    	super.setValue(value);
    }

}

class CheckboxWidget extends AbstractWidget {

    public function new(field: Dynamic) {    	
    	super();
    	_element = new JQ('<input type="checkbox" />');
    }

    override public function setValue(value: Dynamic): Void {
    	var b = if ( value ) true; else false;
    	_element.prop("checked", b);
    }

    override public function getValue(): Dynamic {
   		return _element.prop("checked");
    }

}

// class ComboBoxWidget implements Widget {
//     public function new() {    	
//     }
// }

class WidgetFactory {

    public function new() {    	
    }

	public function create(field: Dynamic): Widget {
		var widget = switch(field.type.toLowerCase()) {
			case "int": new TextFieldWidget();
			case "string": new TextFieldWidget();
			case "boolean": new CheckboxWidget(field);
			case "combobox": new ComboBoxWidget(field);
			// case "boolean": new CheckboxWidget();
			default: throw new Exception("don't know how to handle " + field);
		}

		return widget;

	}
}


class WidgetMapper {
	public var widget: Widget;
	public var name: String;
	public function new(name: String, widget: Widget) {
		this.name = name;
		this.widget = widget;
	}
	public function setValue(parent: Dynamic) {
		widget.setValue(Reflect.field(parent, name));
	}
	public function getValue(parent: Dynamic) {		
		Reflect.setField(parent, name, widget.getValue());
	}
}


@:expose
class Form {

    var _widgetFactory: WidgetFactory;
    var _widgets: Array<WidgetMapper>;

    public function new(formDef: Dynamic, parentContainer: JQ) {    	
		_widgetFactory = new WidgetFactory();
    	_widgets = [];

		var fields: Array<Dynamic> = formDef.fields;

	    for( fld in fields ) {
	    	parentContainer.append(fld.label);
	    	var widget = _widgetFactory.create(fld);
	    	parentContainer.append(widget.getElement());
	    	parentContainer.append("<br/>");
	    	_widgets.push(new WidgetMapper(fld.name, widget));
	    	widget.addedToForm();
    	}

	}

	public function load(obj: Dynamic): Dynamic {
		for ( w in _widgets ) {
			w.setValue(obj);
		}
		return obj;
	}

	public function export(obj: Dynamic): Dynamic {
		for ( w in _widgets ) {
			Reflect.setField(obj, w.name, w.widget.getValue());
		}
		return obj;
	}

}


