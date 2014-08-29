package m3.jq;

import m3.jq.JQ;
import m3.jq.JQTooltip;
import m3.util.M;
import js.html.Element;

import m3.widget.Widgets;

using m3.helper.StringHelper;

typedef ComboBoxOptions = {
	@:optional var customCssOnInput: String;
	@:optional var customCssOnSpan: String;
}

typedef ComboBoxWidgetDef = {
	var options: ComboBoxOptions;
	var _create: Void->Void;
	@:optional var _trigger: String->js.JQuery.JqEvent->Dynamic->Void;
	var destroy: Void->Void;
	@:optional var wrapper: JQ;
}

@:native("$")
extern class ComboBox extends JQ {

	function comboBox(?opts: ComboBoxOptions): ComboBox;
	
	private static function __init__(): Void {
		// untyped ComboBox = window.jQuery;
		var defineWidget: Void->ComboBoxWidgetDef = function(): ComboBoxWidgetDef {
			return {
				options: {
					customCssOnInput: ""
				},
				_create: function(): Void {
					var self: ComboBoxWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();

					var input: JQTooltip = null,
	                    select: JQ = selfElement.hide(),
	                    selected = select.children( ":selected" ),
	                    value = selected.val() != null ? selected.text() : "",
	                    wrapper: JQ = self.wrapper = new JQ( "<span>" )
	                        .addClass( "ui-combobox" )
	                        .insertAfter( select )
	                        .attr( "style", "white-space:nowrap;margin-right:40px;" + M.getX(self.options.customCssOnSpan, "") );
	 
	                function removeIfInvalid(element: JQ): Dynamic {
	                    var value = element.val(),
	                        matcher = new EReg( "^" + JQ.ui.autocomplete.escapeRegex( value ) + "$", "i" ),
	                        valid = false;
	                    select.children( "option" ).each(function(indexInArray: Int, valueOfElement: Element): Void {
	                        if ( matcher.match(JQ.cur.text()) ) {
	                            cast (JQ.curNoWrap).selected = valid = true;
	                            return null;
	                        }
	                    });
	                    if ( !valid ) {
	                        // remove invalid value, as it didn't match anything
	                        cast(
	                        	new JQ( element )
		                            .val( "" )
		                            .attr( "title", value + " didn't match any item" ),
	                            JQTooltip)
		                            .tooltip( "open" );
	                        select.val( "" );
	                        haxe.Timer.delay(function() {
	                            input.tooltip( "close" ).attr( "title", "" );
	                        }, 2500 );
	                        input.data( "ui-autocomplete" ).term = "";
	                        return false;
	                    }
	                    return null;
	                }
	 
	                input = new JQTooltip( "<input>" );
                    input.appendTo( wrapper )
	                    .val( value )
	                    .attr( {"title": "" , "style": self.options.customCssOnInput} )
	                    // .addClass( "ui-state-default ui-combobox-input" )
	                    .addClass( "ui-combobox-input" )
	                    .autocomplete({
	                        delay: 0,
	                        minLength: 0,
	                        source: function( request, response ) {
	                            var matcher = new EReg( JQ.ui.autocomplete.escapeRegex(request.term), "i" );
	                            response( select.children( "option" ).map(function(elementOfArray: JQ, indexInArray:Int): Dynamic {
	                                var text = JQ.cur.text();
	                                var valU = cast (JQ.curNoWrap).value;
	                                if ( valU && ( !request.term || matcher.match(text) ) )
	                                    return {
	                                        label: text.replaceAll(
	                                            new EReg(
	                                                "(?![^&;]+;)(?!<[^<>]*)(" +
	                                                JQ.ui.autocomplete.escapeRegex(request.term) +
	                                                ")(?![^<>]*>)(?![^&;]+;)", "gi"
	                                            ), "<strong>$1</strong>" ),
	                                        value: text,
	                                        option: JQ.curNoWrap
	                                    };
                                    return null;
	                            }) );
	                        },
	                        select: function( event: js.JQuery.JqEvent, ui: Dynamic ): Void {
	                            ui.item.option.selected = true;
	                            self._trigger( "selected", event, {
	                                item: ui.item.option
	                            });
	                            select.change();
	                        },
	                        change: function( event: js.JQuery.JqEvent, ui: Dynamic ): Dynamic {
	                            if ( ui.item == null )
	                                return removeIfInvalid( JQ.cur );
                                return null;
	                        },
	                        open: function( event: js.JQuery.JqEvent, ui: Dynamic ): Void {
	                        	new JQ("ul.ui-autocomplete").css("z-index", "10000");
	                        }
	                    })
	                    .addClass( "ui-widget ui-widget-content ui-corner-left" )
	                    .click(function(evt: js.JQuery.JqEvent) {
	                    	JQ.cur.select();
                    	});
                    select.change(function(evt: js.JQuery.JqEvent) {
	                    var label = select.children('[value="' + select.val() + '"]').text();
	                    input.val(label); 
	                });
	 
	                input.data( "ui-autocomplete" )._renderItem = function( ul, item ) {
	                    return new JQ( "<li>" )
	                        .data( "item.autocomplete", item )
	                        .append( "<a>" + item.label + "</a>" )
	                        .appendTo( ul );
	                };
	 
	                var a: JQTooltip = new JQTooltip( "<a>" );
                    a.attr( {
	                    		"tabIndex": -1,
	                    		"title": "Show All Items" 
	                    		});
                    a.tooltip();
                    a.appendTo( wrapper )
	                    .button({
	                        icons: {
	                            primary: "ui-icon-triangle-1-s"
	                        },
	                        text: false
	                    })
	                    .removeClass( "ui-corner-all" )
	                    .addClass( "ui-corner-right ui-combobox-toggle" )
	                    .click(function() {
	                        // close if already visible
	                        if ( input.autocomplete( "widget" ).is( ":visible" ) ) {
	                            input.autocomplete( "close" );
	                            removeIfInvalid( input );
	                            return;
	                        }
	 
	                        // work around a bug (likely same cause as #5265)
	                        JQ.cur.blur();
	 
	                        // pass empty string as value to search for, displaying all results
	                        input.autocomplete( "search", "" );
	                        input.focus();
	                    });
	 
	                    input
	                        .tooltip({
	                            position: {
	                                of: cast (JQ.curNoWrap).button
	                            },
	                            tooltipClass: "ui-state-highlight"
	                        });

		        },
		        
		        destroy: function() {
		        	var self: ComboBoxWidgetDef = Widgets.getSelf();
					var selfElement: JQ = Widgets.getSelfElement();
		        	self.wrapper.remove();
	                selfElement.show();
	                untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
		        }
		    }
		}
		JQ.widget( "ui.comboBox", defineWidget());
	}
}