package m3.log;

import m3.log.Logga;

class LoggaTimer {
    
    var logger: Logga;
    
    var startTime:Float;
    var stopTime:Float;
    var previousTime:Float;

    public function new(logLevel) {
        logger = new Logga(logLevel);
        startTime = getNow();
    }
    
    public function start(statement:String, ?level:LogLevel) {
        level = checkLevel(level);
        startTime = getNow();
        previousTime = startTime;
        logger.log(statement, level);
    }
    
    public function lap(statement:String, ?level:LogLevel) {
        level = checkLevel(level);
        if(logger.logsAtLevel(level)) {
            var now = getNow();
            var lapDiff = now - previousTime;
            previousTime = now;
            var totalDiff = now - startTime;
            statement += " | " + lapDiff + "ms for lap | " + totalDiff + "ms total";
            logger.log(statement, level);
        }
    }
    
    public function stop(statement:String, ?level:LogLevel) {
        level = checkLevel(level);
        var stopTime = getNow();
        var totalDiff = stopTime - startTime;
        statement += " | " + totalDiff + "ms total";
        logger.log(statement, level);
    }

    private function checkLevel(level:LogLevel) {
        if(level == null) {
            level = LogLevel.DEBUG;
        }
        return level;
    }

    private function getNow():Float {
        return Date.now().getTime();
    }
}