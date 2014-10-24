package agentui;

import haxe.Timer;
import js.JQuery;

import m3.jq.JQ;
import m3.log.Logga;
import m3.log.LogLevel;
import m3.serialization.Serialization;
import qoid.QE;
import agentui.widget.*;
import agentui.api.EventDelegate;
import agentui.model.EM;
import qoid.model.ModelObj;

using m3.helper.ArrayHelper;
using agentui.widget.ConnectionsList;
using Lambda;

@:expose
class AgentUi {

    public static var HOT_KEY_ACTIONS: Array<JQEvent->Void>;

	public static function main() {
        HOT_KEY_ACTIONS = new Array<JQEvent->Void>();
        EventDelegate.init();

        EM.addListener(QE.onAliasLoaded, function(a:Alias){
            js.Browser.document.title = a.profile.name + " | Qoid-Bennu"; 
        }, "AgentUi-onAliasLoaded");

        EM.addListener(EMEvent.FitWindow, function(n: {}) {
            untyped __js__("fitWindow()");
        });
    }

    public static function start(): Void {

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

        new FilterComp("#filter").filterComp();

        new ContentFeed("#feed").contentFeed();

        new AliasComp("#userId").AliasComp();
        
        new PostComp("#postInput").postComp();

        new InviteComp("#sideRight #sideRightInvite").inviteComp();

        new JQ("body").click(function(evt: JqEvent): Void {
            new JQ(".nonmodalPopup").hide();
        });

        Timer.delay(function() {
                 DialogManager.showLogin();
            }, 100);
    }
}
