package ui.util;

import haxe.macro.Context;
import haxe.macro.Expr;
using Lambda;

class M {

    @:macro public static function printExpr(e: Expr) {
    	trace(e);
    	return e;
    }

    @:macro public static function getX<T>(e: ExprOf<T>, ?default0: ExprOf<T>): ExprOf<T> {
    	return makeSafeGetExpression(e, default0, Context.currentPos());
    }

    /**
  		takes e and default0 and wraps it as follows

  		try { 
  		  e; 
  		} catch ( __e: Dynamic ) {
	      default0;
  		}

    */
    static function makeSafeGetExpression<T>(e: ExprOf<T>, ?default0: ExprOf<T>, pos: Position): ExprOf<T> {
        if ( default0 == null ) {
            default0 = expr(EConst(CIdent("null")), pos);
        }
    	var dynamicType = TPath({ sub: null, name: "Dynamic", pack:[], params:[] });
        var catches = [{ type : dynamicType, name : "__e", expr: default0 }];
    	var result = ETry(e, catches);
        return { expr: result, pos: pos };
    }

    static function exprBlock(exprDefs: Array<ExprDef>, pos: Position): Expr {
      return { expr: EBlock(exprs(exprDefs, pos)), pos: pos };
    }
    static function expr(exprDef: ExprDef, pos: Position): Expr {
      return { expr: exprDef, pos: pos };
    }
    static function exprs(exprDefs: Array<ExprDef>, pos: Position): Array<Expr> {
        var arr = [];
        exprDefs.iter(function(ed) {
            arr.push({ expr: ed, pos: pos });
        });
        return arr;
    }

    @:macro public static function notNullX(e: ExprOf<Dynamic>): ExprOf<Bool> {
        var pos = Context.currentPos();
        var getExpr = makeSafeGetExpression(e, null, pos);
        return expr(EBinop(OpNotEq, getExpr, expr(EConst(CIdent("null")), pos)),pos);
    }


    /**
        creates a one argument function with the argumnet called it.  So it takes this
            M.fn1(it+10)
        expands to
            function(it) { return it + 10; }
        
    */
    @:macro public static function fn1(e: Expr): Expr {
        function expr(exprDef: ExprDef) {
            return { expr: exprDef, pos: Context.currentPos() };
        }
//  { 
//      args => [{ name => it, type => null, opt => false, value => null }], 
//      expr => { expr => EBlock([{ expr => EReturn({ expr => EBinop(OpAdd,{ expr => EConst(CIdent(it)), pos => #pos(src/embi/App.hx:88: characters 42-44) },{ expr => EConst(CInt(1)), pos => #pos(src/embi/App.hx:88: characters 45-46) }), pos => #pos(src/embi/App.hx:88: characters 42-46) }), pos => #pos(src/embi/App.hx:88: characters 35-46) }]), pos => #pos(src/embi/App.hx:88: characters 33-49) }, params => [], ret => null }), pos => #pos(src/embi/App.hx:88: characters 20-49) }      
        var body = expr(EBlock([
            expr(EReturn(
                e
            ))   
        ]));

        var fun = { 
            args: [{ name: "it", type: null, opt: false, value: null}],
            ret: null,
            params: [],
            expr: body
        };

        return expr(EFunction(null, fun));

    }
    /**
        creates a one argument function with the argumnet called it.  So it takes this
            M.fn2(_0+10+_1)
        expands to
            function(_0,_1) { return _0 + 10 + _1; }
        
    */
    @:macro public static function fn2(e: Expr): Expr {
        function expr(exprDef: ExprDef) {
            return { expr: exprDef, pos: Context.currentPos() };
        }
//  { 
//      args => [{ name => it, type => null, opt => false, value => null }], 
//      expr => { expr => EBlock([{ expr => EReturn({ expr => EBinop(OpAdd,{ expr => EConst(CIdent(it)), pos => #pos(src/embi/App.hx:88: characters 42-44) },{ expr => EConst(CInt(1)), pos => #pos(src/embi/App.hx:88: characters 45-46) }), pos => #pos(src/embi/App.hx:88: characters 42-46) }), pos => #pos(src/embi/App.hx:88: characters 35-46) }]), pos => #pos(src/embi/App.hx:88: characters 33-49) }, params => [], ret => null }), pos => #pos(src/embi/App.hx:88: characters 20-49) }      
        var body = expr(EBlock([
            expr(EReturn(
                e
            ))   
        ]));

        var fun = { 
            args: [{ name: "_0", type: null, opt: false, value: null}, { name: "_1", type: null, opt: false, value: null}],
            ret: null,
            params: [],
            expr: body
        };

        return expr(EFunction(null, fun));

    }

}