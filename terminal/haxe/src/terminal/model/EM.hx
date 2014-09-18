package terminal.model;

import m3.event.EventManager;

class EMEvent {
    public static inline var QueryAuditLogs: String = "QueryAuditLogs";
    public static inline var OnAuditLog: String = "onAuditLog";
    public static inline var CreateAgent: String = "CreateAgent";
    public static inline var UserLogout: String = "UserLogout";
}

class EM {
    private static var delegate:EventManager;

    private static function __init__(): Void {
        delegate = EventManager.instance;
    }

    public static function addListener<T>(id: String, func: T->Void, ?listenerName:String): String {
        return delegate.addListener(id, func, listenerName);
    }

    public static function listenOnce<T>(id: String, func: T->Void, ?listenerName:String): String {
        return delegate.listenOnce(id, func, listenerName);
    }
    
    public static function removeListener<T>(id: String, listenerUid: String):Void {
        delegate.removeListener(id, listenerUid);
    }

    public static function change<T>(id: String, ?t: T): Void {
        delegate.change(id, t);
    }
}