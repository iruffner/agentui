package ui.util;

class SizedMap<T> extends haxe.ds.StringMap<T> {
  public var size(default, null): Int;

  public function new() { super(); size = 0; }

  public override function set(key: String, val: T) : Void {
    if ( !exists(key) ) size++;
    super.set(key, val);
  }

  public override function remove(key: String) : Bool {
    if (exists(key)) size--;
    return super.remove(key);
  }
}