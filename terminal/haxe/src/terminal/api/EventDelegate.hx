package terminal.api;

import qoid.QoidAPI;
import qoid.model.ModelObj;
import terminal.model.EM;
import terminal.model.TerminalModel;

class EventDelegate {
    public static function init() {
        EM.addListener(EMEvent.QueryAuditLogs, function(c: {}): Void {
            var query = 'hasLabelPath(\'Meta\',\'Audit Log\') and contentType = \'${TerminalContentTypes.AUDIT_LOG}\'';
            QoidAPI.query(new RequestContext("AuditLog"), "content", query, false, true);
        });

        EM.addListener(EMEvent.CreateAgent, function(user: NewUser): Void {
            QoidAPI.createAgent(user.name, user.pwd);
        });

        EM.addListener(EMEvent.UserLogout, function(c: {}): Void{
            QoidAPI.logout();
        });
    }
}