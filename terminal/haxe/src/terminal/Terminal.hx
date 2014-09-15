package terminal;

import m3.jq.JQ;
import terminal.api.EventDelegate;
import terminal.widget.DialogManager;

@:expose
class Terminal {
    public static function main() {
        EventDelegate.init();
        TerminalContext.init();
    }

    public static function start(): Void {
        new JQ("body").click(function(): Void {
            new JQ(".nonmodalPopup").hide();
        });

        DialogManager.showLogin();
    }
}