package m3.helper;

using DateTools;
using m3.helper.StringHelper;


class DateHelper {
    public static function inThePast(d: Date): Bool {
        return d.getTime() < Date.now().getTime();
    }

    public static function inTheFuture(d: Date): Bool {
        return d.getTime() > Date.now().getTime();
    }

    public static function isValid(d: Date): Bool {
    	return d != null && !Math.isNaN(d.getTime());
    }

    public static function isBefore(d1: Date, d2: Date): Bool {
    	return d1.getTime() < d2.getTime();
    }

    public static function isAfter(d1: Date, d2: Date): Bool {
    	return !isBefore(d1, d2);
    }

    public static function isBeforeToday(d: Date): Bool {
        return d.getTime() < startOfToday().getTime();
    }

    public static function startOfToday(): Date {
        var now: Date = Date.now();
        return Date.fromString(
            now.getFullYear() + "-" + m3.helper.StringHelper.padLeft(""+(now.getMonth() + 1),2,"0") + "-" + m3.helper.StringHelper.padLeft(""+now.getDate(),2,"0")
        );

    }
}