// package m3.jq;

// import js.html.Element;

// import m3.util.JqueryUtil;
// import m3.mobidash.Mobidash;
// import m3.widgets.Widgets;

// using m3.helper.StringHelper;
// using m3.helper.ArrayHelper;
// using StringTools;

// typedef AccordionMenuOptions = {
// 	var buttonSelector: String;
// 	var menuSelector: String;
// 	var preventButtonActiveState: Bool;
// 	var reload: Dynamic->Void;
// 	var showFilter: Bool;
// }

// typedef AccordionMenuWidgetDef = {
// 	@:optional var options: AccordionMenuOptions;
// 	@:optional var button: JQ;
// 	@:optional var menu: JQ;
// 	@:optional var buttons: JQ;
// 	var isOpen: Bool;
// 	var _create: Void->Void;
// 	var build: Void->Void;
// 	var refresh: Void->Void;
// 	var positionMenu: Void->Void;
// 	var toggleMenu: Bool->Void;
// 	var showMenu: Bool->Void;
// 	var closeMenu: Bool->Void;
// 	var reloadMenu: Dynamic->Void;
// 	var destroy: Void->Void;
// }

// extern class AccordionMenu extends JQ {

// 	@:overload(function(cmd:String):Dynamic{})
// 	function accordionMenu(opts: AccordionMenuOptions): AccordionMenu;

// 	private static var menus: Array<AccordionMenuWidgetDef>;

// 	static var cur(get, null): AccordionMenu;
// 	private static inline function get_cur() : AccordionMenu {
// 		return untyped __js__("$(this)");
// 	}

// 	private static function __init__(): Void {
// 		untyped AccordionMenu = window.jQuery;
// 		AccordionMenu.menus = new Array<AccordionMenuWidgetDef>();
// 		var defineWidget: Void->AccordionMenuWidgetDef = function(): AccordionMenuWidgetDef {
// 			return {
// 		        _create: function(): Void {
// 		        	var self: AccordionMenuWidgetDef = Widgets.getSelf();
// 		        	AccordionMenu.menus.push(self);
// 				    self.button = new JQ(self.options.buttonSelector);
// 				    Mobidash.executeOnResize(self.positionMenu);
// 				    self.button
// 					    .click(function(evt: JQEvent) {
// 						    	self.toggleMenu(false);
// 					    	})
// 					    .hover(function(evt: JQEvent){
// 						    }, function(evt: JQEvent){
// 						    	if(self.isOpen) {
// 						    		self.button.addClass('ui-state-hover');
// 						    	}
// 						    });
// 					self.build();
// 		        },

// 		        build: function(): Void {
// 		        	var self: AccordionMenuWidgetDef = Widgets.getSelf();
// 					var selfElement: JQ = Widgets.getSelfElement();


// 					self.menu = new JQ(self.options.menuSelector);
// 				    self.menu.accordion({
// 				        heightStyle: "content"
// 				    });
// 				    self.buttons = self.menu.find("label.button").click(function(evt: JQEvent): Void {
// 				    	self.closeMenu(true); 
// 			    	});
// 				    var b: JQ = self.menu.children('div');
// 				    b.buttonsetv(233);
// 				    self.positionMenu();
					
// 					if(self.options.showFilter) {
// 						var filterInput: JQ = new JQ("<input value='Start typing to filter' class='ui-widget ui-widget-content ui-corner-all' style='width: 95%; padding: .2em;'/>");
// 						selfElement.prepend(filterInput);

// 						filterInput.focusin(function(evt: js.JQuery.JqEvent) {
// 			                if(filterInput.val() == "Start typing to filter") {
// 			                    filterInput.val("");
// 			                }
// 			            });
// 			            filterInput.focusout(function(evt: js.JQuery.JqEvent) {
// 			                if(filterInput.val() == "") {
// 			                    filterInput.val("Start typing to filter");
// 			                }
// 			            });

// 			            filterInput.keyup(function(evt: js.JQuery.JqEvent) {
// 				            var filterVal: String = filterInput.val().toLowerCase();
// 				            if(filterVal == "start typing to filter") {
// 				                filterVal = null;
// 				            }

// 				            var buttonSets: JQ = self.menu.find("div.buttonListButton");
// 				            buttonSets.each(function(i: Int, buttonSetDom: Element): Void {
// 				            		var buttonSet: JQ = new JQ(buttonSetDom);
// 				            		var anyVisibleChildren = false;
// 				            		var buttons: JQ = buttonSet.children("label");
// 				            		buttons.each(function(j: Int, buttonDom: Element): Void {
// 				            				var button: JQ = new JQ(buttonDom);
// 				            				if(filterVal.isNotBlank() 
// 				            					&& button.find(".menuEntryName").text().toLowerCase().indexOf(filterVal) < 0 
// 				            					&& button.find(".menuEntryDescription").text().toLowerCase().indexOf(filterVal) < 0) {
// 				            					button.hide();
// 				            				} else {
// 				            					button.show();
// 				            					anyVisibleChildren = true;
// 				            				}
// 				            			});
// 				            		if(!anyVisibleChildren && filterVal.isNotBlank()) {
// 						                buttonSet.hide().prev("h3").hide();
// 						            } else if(!buttonSet.isVisible()) {
// 						                var prev: JQ = buttonSet.prev("h3").show();
// 						                if(prev.hasClass("ui-state-active")) {
// 						                	buttonSet.show();
// 						                }
// 						            }
// 						            buttonSet.buttonsetv(null, "refresh");
// 				            	});
// 				            self.menu.accordion("refresh");
// 			            });
// 					}
// 	        	},

// 		        isOpen: false,

// 		        positionMenu: function(): Void {
// 					var self: AccordionMenuWidgetDef = Widgets.getSelf();
// 					var selfElement: JQ = Widgets.getSelfElement();
// 					var button: JQ = self.button;
// 				    var buttonPosition = button.position();
// 				    var buttonHeight = button.height() + 0;
// 				    buttonHeight += Std.parseInt(button.css('padding-top').replace("px", ''));
// 				    buttonHeight += Std.parseInt(button.css('padding-bottom').replace("px", ''));
// 				    var posLeft = buttonPosition.left - Std.parseInt(button.css('border-left-width').replace("px", ''));
// 				    posLeft = buttonPosition.left - Std.parseInt(button.css('border-left-width').replace("px", ''));
// 				    selfElement.css({
// 				    	"left": buttonPosition.left,
// 				    	"top": buttonPosition.top + buttonHeight
// 				    });
// 	        	},

// 	        	toggleMenu: function(?immediate: Bool = false): Void {
// 	        		var self: AccordionMenuWidgetDef = Widgets.getSelf();
// 	        		if(self.isOpen) self.closeMenu(immediate);
// 	        		else self.showMenu(immediate);
// 	        	},

// 	        	showMenu: function(?immediate: Bool = false): Void {
// 	        		var self: AccordionMenuWidgetDef = Widgets.getSelf();
// 		        	if(!self.isOpen) {
// 		        		if(self.options.preventButtonActiveState) {
// 		        			self.buttons.removeClass("ui-state-active");
// 		        		}
// 		        		for(m_ in 0...AccordionMenu.menus.length) {
// 		        			var m: AccordionMenuWidgetDef;
// 		        			if(self != (m = AccordionMenu.menus[m_])) {
// 		        				m.closeMenu(true);
// 		        			}
// 		        		}
// 		        		var selfElement: JQ = Widgets.getSelfElement();
// 					    if(!immediate) {
// 					        selfElement.show('slow');
// 					    } else {
// 					        selfElement.show(5);
// 					    }
// 				    	self.isOpen = true;
// 		        		self.button.css({
// 		        			"border-bottom": "none"
// 		        			,"background-image": "none"
// 		        			});
// 				        self.button.removeClass('ui-corner-bottom').removeClass('ui-corner-all').addClass('ui-corner-top').removeClass('ui-state-focus').addClass('ui-state-hover');
// 					}
//         		},

//         		closeMenu: function(?immediate: Bool = false): Void {
// 	        		var self: AccordionMenuWidgetDef = Widgets.getSelf();
//         			if(self.isOpen) {
// 		        		var selfElement: JQ = Widgets.getSelfElement();
// 					    if(!immediate) {
// 					        selfElement.hide('slow');
// 					    } else {
// 					        selfElement.hide(5);
// 					    }
// 					    self.isOpen = false;
// 					    self.button.css({
// 		        			"border-bottom": ""
// 		        			,"background-image": ""
// 		        			});
// 				        self.button.addClass('ui-corner-bottom').removeClass('ui-state-hover');
// 					}
//         		},

//         		refresh: function(): Void {
//         			var self: AccordionMenuWidgetDef = Widgets.getSelf();
//         			self.menu.accordion("refresh");
//         // 			var b: JQ = self.menu.children('div');
// 				    // b.buttonsetv(233, "refresh");
// 				},

//         		reloadMenu: function(?arg: Dynamic): Void {
//         			var self: AccordionMenuWidgetDef = Widgets.getSelf();
//         			var selfElement: JQ = Widgets.getSelfElement();
//         			selfElement.empty();
//         			self.options.reload(arg);
//         		},
		        
// 		        destroy: function() {
// 		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
// 		        }
// 		    };
// 		}
// 		JQ.widget( "ui.accordionMenu", defineWidget());
// 	}	
// }