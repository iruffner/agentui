package terminal;

import m3.log.Logga;
import m3.observable.OSet;
import m3.serialization.Serialization.Serializer;
import qoid.QE;
import qoid.model.ModelObj;
import terminal.model.EM;
import terminal.model.TerminalModel;

using m3.helper.ArrayHelper;

class TerminalContext {
    public static var AUDIT_LOGS: ObservableSet<AuditLogContent>;

    public static function init() {
        registerListeners();

        AUDIT_LOGS = new ObservableSet<AuditLogContent>(ModelObjWithIid.identifier);
    }

    static function registerListeners(): Void {
        EM.listenOnce(QE.onInitialDataload, _onInitialDataLoadComplete, "TerminalContext-onInitialDataLoad");
        EM.addListener(EMEvent.OnAuditLog, _onAuditLog, "TerminalContext-onAuditLog");
    }

    static function _onInitialDataLoadComplete(n: {}) {
        EM.change(EMEvent.QueryAuditLogs);
    }

    static function _onAuditLog(data: {result: {standing: Bool, results: Array<Dynamic>}}): Void {
        if (data.result.results.hasValues()) {
            for (result in data.result.results) {
                var c = Serializer.instance.fromJsonX(result, AuditLogContent);

                if (c != null) {
                    AUDIT_LOGS.addOrUpdate(c);
                }
            }
        }
    }
}