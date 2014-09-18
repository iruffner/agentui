package terminal;

import m3.jq.JQ;
import terminal.api.EventDelegate;
import terminal.widget.AuditLog;
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

        var content: JQ = new JQ(".content");
        var contentAuditLog: AuditLog = new AuditLog("<div></div>");
        contentAuditLog.appendTo(content);
        contentAuditLog.auditLog();
    }
}