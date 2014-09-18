package terminal.api;

import qoid.QoidAPI;
import qoid.model.ModelObj;
import terminal.model.EM;

class EventDelegate {
    public static function init() {
        EM.addListener(EMEvent.QueryAuditLogs, function(query: String): Void {
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