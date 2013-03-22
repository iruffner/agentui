package test;

import ui.exception.Exception;

class Assert extends Exception {

    public function new(?message: String, ?cause: Exception) {
        super(message, cause);
    }

    public static function isTrue(b: Bool) {
        if ( !b ) {
            throw new Assert("isTrue(" + b + ")");
        }
    }
    public static function isFalse(b: Bool) {
        if ( b ) {
            throw new Assert("isFalse(" + b + ")");
        }
    }
    public static function areEqual(left: Dynamic, right: Dynamic) {
        if ( left != right ) {
            var msg = "FAIL!!  areEqual(\n" + left + ", \n" + right + "\n)";
            trace(msg);
            throw new Assert(msg);
        }   
    }
    public static function fail(msg: String) {
        throw msg;
    }
}