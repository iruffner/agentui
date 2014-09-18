package terminal.widget;

import m3.jq.JQ;
import m3.exception.Exception;
import m3.observable.OSet;
import m3.widget.Widgets;
import terminal.model.TerminalModel;
import terminal.widget.AuditLogEntry;

typedef AuditLogOptions = {
}

typedef AuditLogWidgetDef = {
    @:optional var options: AuditLogOptions;

    var _create: Void->Void;
    var destroy: Void->Void;
    var _registerListeners: Void->Void;
    @:optional var _onAuditLog: AuditLogContent->EventType->Void;
}

@:native("$")
extern class AuditLog extends JQ {

    function auditLog(?opts: AuditLogOptions): AuditLog;

    private static function __init__(): Void {
        var defineWidget: Void->AuditLogWidgetDef = function(): AuditLogWidgetDef {
            return {

                _registerListeners: function(): Void {
                    var self: AuditLogWidgetDef = Widgets.getSelf();
                    var selfElement: JQ = Widgets.getSelfElement();

                    self._onAuditLog = function(content: AuditLogContent, evt: EventType) {
                        var contentAuditLogEntry: AuditLogEntry = new AuditLogEntry("<div></div>");
                        contentAuditLogEntry.appendTo(selfElement);
                        contentAuditLogEntry.auditLogEntry({auditLogContent: content});
                    }

                    TerminalContext.AUDIT_LOGS.listen(self._onAuditLog);
                },

                _create: function(): Void {
                    var self: AuditLogWidgetDef = Widgets.getSelf();
                    var selfElement: JQ = Widgets.getSelfElement();

                    if (!selfElement.is("div")) {
                        throw new Exception("Root of AuditLog must be a div element");
                    }

                    selfElement.addClass("_auditLog");

                    self._registerListeners();
                },

                destroy: function() {
                    var self: AuditLogWidgetDef = Widgets.getSelf();
                    TerminalContext.AUDIT_LOGS.removeListener(self._onAuditLog);
                    untyped JQ.Widget.prototype.destroy.call(JQ.curNoWrap);
                }
            };
        }

        JQ.widget("ui.auditLog", defineWidget());
    }
}