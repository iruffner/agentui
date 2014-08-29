package m3.log;

import haxe.Timer;
import m3.util.UidGenerator;
import m3.exception.Exception;

using m3.helper.ArrayHelper;

typedef LogMessage = {
	var sessionUid: String;
	var at: String;
	var message: String;
	var severity: String;
	@:optional var category: String;
}

class RemoteLogga extends Logga {
	
	var remoteLogLevel: LogLevel;
	var logs: Array<LogMessage>;
	var timer: RemoteLoggingTimer;
	public var sessionUid: String;

	public function new(consoleLevel: LogLevel, remoteLevel: LogLevel) {
		super(consoleLevel);
		this.remoteLogLevel = remoteLevel;
		this.logs = [];
		this.sessionUid = UidGenerator.create(32);
		log("SessionUid: " + this.sessionUid);
	}

	override public function log(statement: String, ?level: LogLevel, ?exception: Exception) {
		if(level == null) {
            level = LogLevel.INFO;
        }
        super.log(statement, level, exception);

        if(this.timer != null && this.remoteLogsAtLevel(level)) {
        	try {
	            if(exception != null && exception.stackTrace != null && Reflect.isFunction(exception.stackTrace) ) {
	                statement += "\n" + exception.stackTrace();
	            }
	        } catch (err: Dynamic) {
	            // log("Could not get stackTrace", LogLevel.ERROR);
	        }
        	logs.push({
        			sessionUid: this.sessionUid,
        			at: DateTools.format(Date.now(), "%Y-%m-%d %T"),
        			message: statement,
        			severity: level.getName(),
        			category: "ui"
        		});
    		if(logs.length > 50) {
    			this.timer.run();
    		}
        }
	}

	public function remoteLogsAtLevel(level:LogLevel) {
        return Type.enumIndex(this.remoteLogLevel) <= Type.enumIndex(level);
    }

    public function setRemoteLoggingFcn(remoteLogFcn: Array<LogMessage>->Void): Void {
    	if(this.timer != null) this.timer.stop();
    	if(remoteLogFcn != null) {
	    	this.timer = new RemoteLoggingTimer(remoteLogFcn, function() {
					var saved: Array<LogMessage> = this.logs;
					this.logs = [];
					return saved;
				});
	    }
    }

    public function pause() {
		if(this.timer != null) this.timer.pause();
	}

	public function unpause() {
		if(this.timer != null) this.timer.unpause();
	}

	public static function pauseRemoteLogging(): Void {
        if(Std.is(Logga.DEFAULT, m3.log.RemoteLogga)) {
        	var rl: RemoteLogga = cast Logga.DEFAULT;
            rl.pause();
        }
    }

    public static function unpauseRemoteLogging(): Void {
        if(Std.is(Logga.DEFAULT, m3.log.RemoteLogga)) {
        	var rl: RemoteLogga = cast Logga.DEFAULT;
            rl.unpause();
        }
    }
}

private class RemoteLoggingTimer extends Timer {

	var remoteLogFcn: Array<LogMessage>->Void;
	var getLogs: Void->Array<LogMessage>;
	var paused: Bool = false;

	public function new(remoteLogFcn: Array<LogMessage>->Void, getMsgs: Void->Array<LogMessage>) {
		super(30000);
		this.remoteLogFcn = remoteLogFcn;
		this.getLogs = getMsgs;
	}

	override public function run() {
		if(this.paused) return;
		var logs = this.getLogs();
		if(logs.hasValues()) {
			this.remoteLogFcn(logs);
		} else {
			// Logga.DEFAULT.debug("no remote logs to send");
		}
	}

	public function pause() {
		Logga.DEFAULT.debug("pausing remote logga");
		this.paused = true;
	}

	public function unpause() {
		Logga.DEFAULT.debug("unpausing remote logga");
		this.paused = false;
	}

}