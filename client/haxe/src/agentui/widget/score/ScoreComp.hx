// package agentui.widget.score;

// import haxe.ds.StringMap;
// import m3.jq.JQ;
// import m3.widget.Widgets;
// import agentui.model.ContentSource;
// import qoid.model.ModelObj;
// import m3.observable.OSet;
// import m3.exception.Exception;
// import snap.Snap;
// import m3.log.Logga;
// import qoid.Qoid;

// using m3.helper.OSetHelper;
// using m3.helper.StringHelper;


// typedef ScoreCompOptions = {
// }

// typedef ScoreCompWidgetDef = {
// 	@:optional var options: ScoreCompOptions;
// 	@:optional var contentTimeLines: StringMap<ContentTimeLine>;
// 	@:optional var paper:Snap;
// 	@:optional var timeMarker:TimeMarker;
// 	@:optional var uberGroup:SnapElement;
// 	@:optional var startTime:Date;
// 	@:optional var endTime:Date;
// 	@:optional var viewBoxWidth:Float;

// 	var _getProfile:Content<Dynamic>->Profile;
// 	var _addContent:Content<Dynamic>->Void;
// 	var _deleteContent:Content<Dynamic>->Void;
// 	var _updateContent:Content<Dynamic>->Void;
// 	var _updateTimeLines:Void->Void;
// 	var _create: Void->Void;
// 	var destroy: Void->Void;
// }

// @:native("$")
// extern class ScoreComp extends JQ {

// 	@:overload(function<T>(cmd : String):T{})
// 	@:overload(function<T>(cmd:String, opt:String):T{})
// 	@:overload(function(cmd:String, opt:String, newVal:Dynamic):JQ{})
// 	function scoreComp(?opts: ScoreCompOptions): ScoreComp;

// 	private static function __init__(): Void {
// 		var defineWidget: Void->ScoreCompWidgetDef = function(): ScoreCompWidgetDef {
// 			return {
// 				_updateTimeLines: function():Void {
// 			        var self: ScoreCompWidgetDef = Widgets.getSelf();
// 					for (timeline in self.contentTimeLines) {
// 						timeline.reposition(self.startTime.getTime(), self.endTime.getTime());
// 					}
// 				},

// 				_getProfile:function(content:Content<Dynamic>):Profile {
// 		            var alias = Qoid.aliases.getElement(content.aliasIid);
// 		            if (alias != null) {
// 		            	return alias.profile;
// 		            }
// 		            var connection = Qoid.connections.getElement(content.connectionIid);
// 		            if (connection != null) {
// 		            	return connection.data;
// 		            }
// 		            return new Profile();
// 				},

// 				_addContent: function(content:Content<Dynamic>): Void {
// 					try {
// 			        	var self: ScoreCompWidgetDef = Widgets.getSelf();

// 		            	var updateTimelines = false;
// 		            	if (self.startTime.getTime() > content.created.getTime()) {
// 		            		self.startTime = content.created;
// 		            		updateTimelines = true;
// 		            	}
// 		            	if (self.endTime.getTime() < content.created.getTime()) {
// 		            		self.endTime = content.created;
// 		            		updateTimelines = true;
// 		            	}
// 		            	if (updateTimelines) {
// 		            		self._updateTimeLines();
// 		            	}

// 	 	            	if (self.contentTimeLines.get(content.aliasIid) == null) {
// 	 	            		var timeLine = new ContentTimeLine(self.paper, self._getProfile(content), 
// 	 	            			                               self.startTime.getTime(), 
// 	 	            			                               self.endTime.getTime(),
// 	 	            			                               self.viewBoxWidth);
// 	 	            		self.contentTimeLines.set(content.aliasIid, timeLine);
// 			            }

// 		            	self.contentTimeLines.get(content.aliasIid).addContent(content);
// 		            	self.uberGroup.append(self.contentTimeLines.get(content.aliasIid).timeLineElement);

// 		            } catch (e:Dynamic) {
// 		            	Logga.DEFAULT.error("error calling _addContent", e);
// 		            }
// 				},

// 				_deleteContent: function (content:Content<Dynamic>) {
// 		        	var self: ScoreCompWidgetDef = Widgets.getSelf();
// 		        	var ctl = self.contentTimeLines.get(content.aliasIid);
// 		        	if (ctl != null) {
// 			        	ctl.removeElements();
// 						self.contentTimeLines.remove(content.aliasIid);
// 						if (!self.contentTimeLines.iterator().hasNext()) {
// 							ContentTimeLine.resetPositions();
// 						}
// 					}
// 				},

// 				_updateContent: function(content:Content<Dynamic>): Void {
// 				},

// 		        _create: function(): Void {
// 		        	var self: ScoreCompWidgetDef = Widgets.getSelf();
// 					var selfElement: JQ = Widgets.getSelfElement();
// 		        	if(!selfElement.is("div")) {
// 		        		throw new Exception("Root of ScoreComp must be a div element");
// 		        	}
// 		        	selfElement.addClass("container shadow scoreComp");

// 		        	var mapListener = function(content:Content<Dynamic>, ele:SnapElement, evt:EventType): Void {
// 	            		if(evt.isAdd()) {
// 	            			self._addContent(content);
// 	            		} else if (evt.isUpdate()) {
// 	            			self._updateContent(content);
// 	            		} else if (evt.isDelete()) {
// 	            			self._deleteContent(content);
// 	            		}
// 	            	};

// 	            	var beforeSetContent = function():Void {
// 	            		new JQ("#score-comp-svg").empty();

// 		        		self.contentTimeLines = new StringMap<ContentTimeLine>();

// 			        	self.viewBoxWidth = 1000;

// 						self.paper = new Snap("#score-comp-svg");
// 						self.uberGroup = self.paper.group(self.paper, [])
// 						                           .attr("id", "uber-group")
// 						                           .attr("transform", "matrix(1 0 0 1 0 0)");

// 						self.startTime = null;
// 						self.endTime = null;
				
// 						if (self.startTime == null) {
// 							self.startTime = Date.fromTime(Date.now().getTime() - DateTools.hours(2));
// 							self.endTime   = Date.fromTime(self.startTime.getTime() + DateTools.hours(2));
// 		            	} else {
// 							self.startTime = Date.fromTime(self.startTime.getTime() - DateTools.hours(2));
// 							self.endTime   = Date.fromTime(self.endTime.getTime()   + DateTools.hours(2));
// 						}
// 						self.timeMarker = new TimeMarker(self.uberGroup, self.paper, 
// 							                  self.viewBoxWidth, self.startTime, self.endTime);
// 	            	};
// 	            	var widgetCreator = function(content:Content<Dynamic>):SnapElement {
// 	            		return null;
// 	            	}
// 	            	ContentSource.addListener(mapListener, beforeSetContent, widgetCreator);
// 		        },

// 		        destroy: function() {
// 		        	var self: ScoreCompWidgetDef = Widgets.getSelf();
// 		            untyped JQ.Widget.prototype.destroy.call( JQ.curNoWrap );
// 		        }
// 		    };
// 		}
// 		JQ.widget( "ui.scoreComp", defineWidget());
// 	}
// }