package ui;

import js.JQuery;

import m3.jq.JQ;

import m3.log.Logga;
import m3.log.LogLevel;

import ui.model.ModelObj;
import ui.model.Node;
import ui.model.EM;
import ui.api.BennuHandler;
import ui.api.ProtocolHandler;


import m3.observable.OSet;

import m3.util.UidGenerator;
import m3.util.HtmlUtil;

import ui.widget.*;
import ui.widget.score.ScoreComp;

import m3.serialization.Serialization;

using m3.helper.ArrayHelper;
using m3.helper.StringHelper;
using ui.widget.ConnectionsList;
using Lambda;

@:expose
class AgentUi {
    
    public static var PROTOCOL: ProtocolHandler;
    public static var URL: String = "";//"http://64.27.3.17";
    public static var HOT_KEY_ACTIONS: Array<JQEvent->Void>;

	public static function main() {
        AppContext.init();

        PROTOCOL = new BennuHandler();
        HOT_KEY_ACTIONS = new Array<JQEvent->Void>();
    }

    public static function start(): Void {
        var r: RestoreWidget = new RestoreWidget("<div></div>");
        
        HOT_KEY_ACTIONS.push(function(evt: JQEvent): Void {
            if(evt.altKey && evt.shiftKey && evt.keyCode == 82 /* ALT+SHIFT+R */) {
                AppContext.LOGGER.debug("ALT + SHIFT + R");
                r.restoreWidget("open");
            }
        });

        new JQ("body").keyup(function(evt: JQEvent) {
            if(HOT_KEY_ACTIONS.hasValues()) {
                HOT_KEY_ACTIONS.iter(
                        function(act: JQEvent->Void) {
                            act(evt);
                        }
                    );
            }
        });

        new JQ("#sideRightSearchInput").keyup(function(evt){
            var search:JQ = new JQ(evt.target);
            var cl:ConnectionsList = new ConnectionsList("#connections");
            cl.filterConnections(search.val());
        });

        new JQ("#middleContainer #content #tabs").tabs({
            beforeActivate: function(evt:JqEvent, ui:Dynamic) {
                var max_height = Math.max(new JQ("#tabs-feed").height(), new JQ("#tabs-score").height());
                ui.newPanel.height(max_height);
            }
        });
        new MessagingComp("#sideRight #chat").messagingComp();

        new ConnectionsList("#connections").connectionsList();

        new LabelsList("#labelsList").labelsList();

        new FilterComp("#filter").filterComp(null);

        new ContentFeed("#feed").contentFeed({
        });

        new UserComp("#userId").userComp();
        
        new PostComp("#postInput").postComp();

        new InviteComp("#sideRight #sideRightInvite").inviteComp();

        new ScoreComp("#score-div").scoreComp({
            content: AppContext.CONTENT
        });
        new JQ("body").click(function(evt: JqEvent): Void {
            new JQ(".nonmodalPopup").hide();
        });

        r.appendTo(new JQ(js.Browser.document.body));
        r.restoreWidget();

        DialogManager.showLogin();
    }


}
