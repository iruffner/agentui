var $hxClasses = $hxClasses || {},$estr = function() { return js.Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function inherit() {}; inherit.prototype = from; var proto = new inherit();
	for (var name in fields) proto[name] = fields[name];
	return proto;
}
var EReg = $hxClasses["EReg"] = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = ["EReg"];
EReg.prototype = {
	customReplace: function(s,f) {
		var buf = new StringBuf();
		while(true) {
			if(!this.match(s)) break;
			buf.b += Std.string(this.matchedLeft());
			buf.b += Std.string(f(this));
			s = this.matchedRight();
		}
		buf.b += Std.string(s);
		return buf.b;
	}
	,replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,split: function(s) {
		var d = "#__delim__#";
		return s.replace(this.r,d).split(d);
	}
	,matchedPos: function() {
		if(this.r.m == null) throw "No string matched";
		return { pos : this.r.m.index, len : this.r.m[0].length};
	}
	,matchedRight: function() {
		if(this.r.m == null) throw "No string matched";
		var sz = this.r.m.index + this.r.m[0].length;
		return this.r.s.substr(sz,this.r.s.length - sz);
	}
	,matchedLeft: function() {
		if(this.r.m == null) throw "No string matched";
		return this.r.s.substr(0,this.r.m.index);
	}
	,matched: function(n) {
		return this.r.m != null && n >= 0 && n < this.r.m.length?this.r.m[n]:(function($this) {
			var $r;
			throw "EReg::matched";
			return $r;
		}(this));
	}
	,match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,r: null
	,__class__: EReg
}
var Hash = $hxClasses["Hash"] = function() {
	this.h = { };
};
Hash.__name__ = ["Hash"];
Hash.prototype = {
	toString: function() {
		var s = new StringBuf();
		s.b += Std.string("{");
		var it = this.keys();
		while( it.hasNext() ) {
			var i = it.next();
			s.b += Std.string(i);
			s.b += Std.string(" => ");
			s.b += Std.string(Std.string(this.get(i)));
			if(it.hasNext()) s.b += Std.string(", ");
		}
		s.b += Std.string("}");
		return s.b;
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref["$" + i];
		}};
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,remove: function(key) {
		key = "$" + key;
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,set: function(key,value) {
		this.h["$" + key] = value;
	}
	,h: null
	,__class__: Hash
}
var HxOverrides = $hxClasses["HxOverrides"] = function() { }
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d < 10?"0" + d:"" + d) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
}
HxOverrides.strDate = function(s) {
	switch(s.length) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d.setTime(0);
		d.setUTCHours(k[0]);
		d.setUTCMinutes(k[1]);
		d.setUTCSeconds(k[2]);
		return d;
	case 10:
		var k = s.split("-");
		return new Date(k[0],k[1] - 1,k[2],0,0,0);
	case 19:
		var k = s.split(" ");
		var y = k[0].split("-");
		var t = k[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw "Invalid date format : " + s;
	}
}
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
}
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
}
HxOverrides.remove = function(a,obj) {
	var i = 0;
	var l = a.length;
	while(i < l) {
		if(a[i] == obj) {
			a.splice(i,1);
			return true;
		}
		i++;
	}
	return false;
}
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
}
var IntIter = $hxClasses["IntIter"] = function(min,max) {
	this.min = min;
	this.max = max;
};
IntIter.__name__ = ["IntIter"];
IntIter.prototype = {
	next: function() {
		return this.min++;
	}
	,hasNext: function() {
		return this.min < this.max;
	}
	,max: null
	,min: null
	,__class__: IntIter
}
var Lambda = $hxClasses["Lambda"] = function() { }
Lambda.__name__ = ["Lambda"];
Lambda.array = function(it) {
	var a = new Array();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var i = $it0.next();
		a.push(i);
	}
	return a;
}
Lambda.list = function(it) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var i = $it0.next();
		l.add(i);
	}
	return l;
}
Lambda.map = function(it,f) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(f(x));
	}
	return l;
}
Lambda.mapi = function(it,f) {
	var l = new List();
	var i = 0;
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(f(i++,x));
	}
	return l;
}
Lambda.has = function(it,elt,cmp) {
	if(cmp == null) {
		var $it0 = $iterator(it)();
		while( $it0.hasNext() ) {
			var x = $it0.next();
			if(x == elt) return true;
		}
	} else {
		var $it1 = $iterator(it)();
		while( $it1.hasNext() ) {
			var x = $it1.next();
			if(cmp(x,elt)) return true;
		}
	}
	return false;
}
Lambda.exists = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) return true;
	}
	return false;
}
Lambda.foreach = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(!f(x)) return false;
	}
	return true;
}
Lambda.iter = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		f(x);
	}
}
Lambda.filter = function(it,f) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) l.add(x);
	}
	return l;
}
Lambda.fold = function(it,f,first) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		first = f(x,first);
	}
	return first;
}
Lambda.count = function(it,pred) {
	var n = 0;
	if(pred == null) {
		var $it0 = $iterator(it)();
		while( $it0.hasNext() ) {
			var _ = $it0.next();
			n++;
		}
	} else {
		var $it1 = $iterator(it)();
		while( $it1.hasNext() ) {
			var x = $it1.next();
			if(pred(x)) n++;
		}
	}
	return n;
}
Lambda.empty = function(it) {
	return !$iterator(it)().hasNext();
}
Lambda.indexOf = function(it,v) {
	var i = 0;
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var v2 = $it0.next();
		if(v == v2) return i;
		i++;
	}
	return -1;
}
Lambda.concat = function(a,b) {
	var l = new List();
	var $it0 = $iterator(a)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(x);
	}
	var $it1 = $iterator(b)();
	while( $it1.hasNext() ) {
		var x = $it1.next();
		l.add(x);
	}
	return l;
}
var List = $hxClasses["List"] = function() {
	this.length = 0;
};
List.__name__ = ["List"];
List.prototype = {
	map: function(f) {
		var b = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			b.add(f(v));
		}
		return b;
	}
	,filter: function(f) {
		var l2 = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			if(f(v)) l2.add(v);
		}
		return l2;
	}
	,join: function(sep) {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		while(l != null) {
			if(first) first = false; else s.b += Std.string(sep);
			s.b += Std.string(l[0]);
			l = l[1];
		}
		return s.b;
	}
	,toString: function() {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		s.b += Std.string("{");
		while(l != null) {
			if(first) first = false; else s.b += Std.string(", ");
			s.b += Std.string(Std.string(l[0]));
			l = l[1];
		}
		s.b += Std.string("}");
		return s.b;
	}
	,iterator: function() {
		return { h : this.h, hasNext : function() {
			return this.h != null;
		}, next : function() {
			if(this.h == null) return null;
			var x = this.h[0];
			this.h = this.h[1];
			return x;
		}};
	}
	,remove: function(v) {
		var prev = null;
		var l = this.h;
		while(l != null) {
			if(l[0] == v) {
				if(prev == null) this.h = l[1]; else prev[1] = l[1];
				if(this.q == l) this.q = prev;
				this.length--;
				return true;
			}
			prev = l;
			l = l[1];
		}
		return false;
	}
	,clear: function() {
		this.h = null;
		this.q = null;
		this.length = 0;
	}
	,isEmpty: function() {
		return this.h == null;
	}
	,pop: function() {
		if(this.h == null) return null;
		var x = this.h[0];
		this.h = this.h[1];
		if(this.h == null) this.q = null;
		this.length--;
		return x;
	}
	,last: function() {
		return this.q == null?null:this.q[0];
	}
	,first: function() {
		return this.h == null?null:this.h[0];
	}
	,push: function(item) {
		var x = [item,this.h];
		this.h = x;
		if(this.q == null) this.q = x;
		this.length++;
	}
	,add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,length: null
	,q: null
	,h: null
	,__class__: List
}
var Reflect = $hxClasses["Reflect"] = function() { }
Reflect.__name__ = ["Reflect"];
Reflect.hasField = function(o,field) {
	return Object.prototype.hasOwnProperty.call(o,field);
}
Reflect.field = function(o,field) {
	var v = null;
	try {
		v = o[field];
	} catch( e ) {
	}
	return v;
}
Reflect.setField = function(o,field,value) {
	o[field] = value;
}
Reflect.getProperty = function(o,field) {
	var tmp;
	return o == null?null:o.__properties__ && (tmp = o.__properties__["get_" + field])?o[tmp]():o[field];
}
Reflect.setProperty = function(o,field,value) {
	var tmp;
	if(o.__properties__ && (tmp = o.__properties__["set_" + field])) o[tmp](value); else o[field] = value;
}
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
}
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
}
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
}
Reflect.compare = function(a,b) {
	return a == b?0:a > b?1:-1;
}
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
}
Reflect.isObject = function(v) {
	if(v == null) return false;
	var t = typeof(v);
	return t == "string" || t == "object" && !v.__enum__ || t == "function" && (v.__name__ || v.__ename__);
}
Reflect.deleteField = function(o,f) {
	if(!Reflect.hasField(o,f)) return false;
	delete(o[f]);
	return true;
}
Reflect.copy = function(o) {
	var o2 = { };
	var _g = 0, _g1 = Reflect.fields(o);
	while(_g < _g1.length) {
		var f = _g1[_g];
		++_g;
		o2[f] = Reflect.field(o,f);
	}
	return o2;
}
Reflect.makeVarArgs = function(f) {
	return function() {
		var a = Array.prototype.slice.call(arguments);
		return f(a);
	};
}
var Std = $hxClasses["Std"] = function() { }
Std.__name__ = ["Std"];
Std["is"] = function(v,t) {
	return js.Boot.__instanceof(v,t);
}
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
Std["int"] = function(x) {
	return x | 0;
}
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
}
Std.parseFloat = function(x) {
	return parseFloat(x);
}
Std.random = function(x) {
	return Math.floor(Math.random() * x);
}
var StringBuf = $hxClasses["StringBuf"] = function() {
	this.b = "";
};
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	toString: function() {
		return this.b;
	}
	,addSub: function(s,pos,len) {
		this.b += HxOverrides.substr(s,pos,len);
	}
	,addChar: function(c) {
		this.b += String.fromCharCode(c);
	}
	,add: function(x) {
		this.b += Std.string(x);
	}
	,b: null
	,__class__: StringBuf
}
var StringTools = $hxClasses["StringTools"] = function() { }
StringTools.__name__ = ["StringTools"];
StringTools.urlEncode = function(s) {
	return encodeURIComponent(s);
}
StringTools.urlDecode = function(s) {
	return decodeURIComponent(s.split("+").join(" "));
}
StringTools.htmlEscape = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
StringTools.htmlUnescape = function(s) {
	return s.split("&gt;").join(">").split("&lt;").join("<").split("&amp;").join("&");
}
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && HxOverrides.substr(s,0,start.length) == start;
}
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	return slen >= elen && HxOverrides.substr(s,slen - elen,elen) == end;
}
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c >= 9 && c <= 13 || c == 32;
}
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
}
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return HxOverrides.substr(s,0,l - r); else return s;
}
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
}
StringTools.rpad = function(s,c,l) {
	var sl = s.length;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		s += HxOverrides.substr(c,0,l - sl);
		sl = l;
	} else {
		s += c;
		sl += cl;
	}
	return s;
}
StringTools.lpad = function(s,c,l) {
	var ns = "";
	var sl = s.length;
	if(sl >= l) return s;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		ns += HxOverrides.substr(c,0,l - sl);
		sl = l;
	} else {
		ns += c;
		sl += cl;
	}
	return ns + s;
}
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
}
StringTools.hex = function(n,digits) {
	var s = "";
	var hexChars = "0123456789ABCDEF";
	do {
		s = hexChars.charAt(n & 15) + s;
		n >>>= 4;
	} while(n > 0);
	if(digits != null) while(s.length < digits) s = "0" + s;
	return s;
}
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
}
StringTools.isEOF = function(c) {
	return c != c;
}
var ValueType = $hxClasses["ValueType"] = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] }
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
var Type = $hxClasses["Type"] = function() { }
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null;
	return o.__class__;
}
Type.getEnum = function(o) {
	if(o == null) return null;
	return o.__enum__;
}
Type.getSuperClass = function(c) {
	return c.__super__;
}
Type.getClassName = function(c) {
	var a = c.__name__;
	return a.join(".");
}
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
}
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || !cl.__name__) return null;
	return cl;
}
Type.resolveEnum = function(name) {
	var e = $hxClasses[name];
	if(e == null || !e.__ename__) return null;
	return e;
}
Type.createInstance = function(cl,args) {
	switch(args.length) {
	case 0:
		return new cl();
	case 1:
		return new cl(args[0]);
	case 2:
		return new cl(args[0],args[1]);
	case 3:
		return new cl(args[0],args[1],args[2]);
	case 4:
		return new cl(args[0],args[1],args[2],args[3]);
	case 5:
		return new cl(args[0],args[1],args[2],args[3],args[4]);
	case 6:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5]);
	case 7:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
	case 8:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
	default:
		throw "Too many arguments";
	}
	return null;
}
Type.createEmptyInstance = function(cl) {
	function empty() {}; empty.prototype = cl.prototype;
	return new empty();
}
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) throw "No such constructor " + constr;
	if(Reflect.isFunction(f)) {
		if(params == null) throw "Constructor " + constr + " need parameters";
		return f.apply(e,params);
	}
	if(params != null && params.length != 0) throw "Constructor " + constr + " does not need parameters";
	return f;
}
Type.createEnumIndex = function(e,index,params) {
	var c = e.__constructs__[index];
	if(c == null) throw index + " is not a valid enum constructor index";
	return Type.createEnum(e,c,params);
}
Type.getInstanceFields = function(c) {
	var a = [];
	for(var i in c.prototype) a.push(i);
	HxOverrides.remove(a,"__class__");
	HxOverrides.remove(a,"__properties__");
	return a;
}
Type.getClassFields = function(c) {
	var a = Reflect.fields(c);
	HxOverrides.remove(a,"__name__");
	HxOverrides.remove(a,"__interfaces__");
	HxOverrides.remove(a,"__properties__");
	HxOverrides.remove(a,"__super__");
	HxOverrides.remove(a,"prototype");
	return a;
}
Type.getEnumConstructs = function(e) {
	var a = e.__constructs__;
	return a.slice();
}
Type["typeof"] = function(v) {
	switch(typeof(v)) {
	case "boolean":
		return ValueType.TBool;
	case "string":
		return ValueType.TClass(String);
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	case "object":
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c = v.__class__;
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	case "function":
		if(v.__name__ || v.__ename__) return ValueType.TObject;
		return ValueType.TFunction;
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
}
Type.enumEq = function(a,b) {
	if(a == b) return true;
	try {
		if(a[0] != b[0]) return false;
		var _g1 = 2, _g = a.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(!Type.enumEq(a[i],b[i])) return false;
		}
		var e = a.__enum__;
		if(e != b.__enum__ || e == null) return false;
	} catch( e ) {
		return false;
	}
	return true;
}
Type.enumConstructor = function(e) {
	return e[0];
}
Type.enumParameters = function(e) {
	return e.slice(2);
}
Type.enumIndex = function(e) {
	return e[1];
}
Type.allEnums = function(e) {
	var all = [];
	var cst = e.__constructs__;
	var _g = 0;
	while(_g < cst.length) {
		var c = cst[_g];
		++_g;
		var v = Reflect.field(e,c);
		if(!Reflect.isFunction(v)) all.push(v);
	}
	return all;
}
var Xml = $hxClasses["Xml"] = function() {
};
Xml.__name__ = ["Xml"];
Xml.Element = null;
Xml.PCData = null;
Xml.CData = null;
Xml.Comment = null;
Xml.DocType = null;
Xml.Prolog = null;
Xml.Document = null;
Xml.parse = function(str) {
	return haxe.xml.Parser.parse(str);
}
Xml.createElement = function(name) {
	var r = new Xml();
	r.nodeType = Xml.Element;
	r._children = new Array();
	r._attributes = new Hash();
	r.setNodeName(name);
	return r;
}
Xml.createPCData = function(data) {
	var r = new Xml();
	r.nodeType = Xml.PCData;
	r.setNodeValue(data);
	return r;
}
Xml.createCData = function(data) {
	var r = new Xml();
	r.nodeType = Xml.CData;
	r.setNodeValue(data);
	return r;
}
Xml.createComment = function(data) {
	var r = new Xml();
	r.nodeType = Xml.Comment;
	r.setNodeValue(data);
	return r;
}
Xml.createDocType = function(data) {
	var r = new Xml();
	r.nodeType = Xml.DocType;
	r.setNodeValue(data);
	return r;
}
Xml.createProlog = function(data) {
	var r = new Xml();
	r.nodeType = Xml.Prolog;
	r.setNodeValue(data);
	return r;
}
Xml.createDocument = function() {
	var r = new Xml();
	r.nodeType = Xml.Document;
	r._children = new Array();
	return r;
}
Xml.prototype = {
	toString: function() {
		if(this.nodeType == Xml.PCData) return this._nodeValue;
		if(this.nodeType == Xml.CData) return "<![CDATA[" + this._nodeValue + "]]>";
		if(this.nodeType == Xml.Comment) return "<!--" + this._nodeValue + "-->";
		if(this.nodeType == Xml.DocType) return "<!DOCTYPE " + this._nodeValue + ">";
		if(this.nodeType == Xml.Prolog) return "<?" + this._nodeValue + "?>";
		var s = new StringBuf();
		if(this.nodeType == Xml.Element) {
			s.b += Std.string("<");
			s.b += Std.string(this._nodeName);
			var $it0 = this._attributes.keys();
			while( $it0.hasNext() ) {
				var k = $it0.next();
				s.b += Std.string(" ");
				s.b += Std.string(k);
				s.b += Std.string("=\"");
				s.b += Std.string(this._attributes.get(k));
				s.b += Std.string("\"");
			}
			if(this._children.length == 0) {
				s.b += Std.string("/>");
				return s.b;
			}
			s.b += Std.string(">");
		}
		var $it1 = this.iterator();
		while( $it1.hasNext() ) {
			var x = $it1.next();
			s.b += Std.string(x.toString());
		}
		if(this.nodeType == Xml.Element) {
			s.b += Std.string("</");
			s.b += Std.string(this._nodeName);
			s.b += Std.string(">");
		}
		return s.b;
	}
	,insertChild: function(x,pos) {
		if(this._children == null) throw "bad nodetype";
		if(x._parent != null) HxOverrides.remove(x._parent._children,x);
		x._parent = this;
		this._children.splice(pos,0,x);
	}
	,removeChild: function(x) {
		if(this._children == null) throw "bad nodetype";
		var b = HxOverrides.remove(this._children,x);
		if(b) x._parent = null;
		return b;
	}
	,addChild: function(x) {
		if(this._children == null) throw "bad nodetype";
		if(x._parent != null) HxOverrides.remove(x._parent._children,x);
		x._parent = this;
		this._children.push(x);
	}
	,firstElement: function() {
		if(this._children == null) throw "bad nodetype";
		var cur = 0;
		var l = this._children.length;
		while(cur < l) {
			var n = this._children[cur];
			if(n.nodeType == Xml.Element) return n;
			cur++;
		}
		return null;
	}
	,firstChild: function() {
		if(this._children == null) throw "bad nodetype";
		return this._children[0];
	}
	,elementsNamed: function(name) {
		if(this._children == null) throw "bad nodetype";
		return { cur : 0, x : this._children, hasNext : function() {
			var k = this.cur;
			var l = this.x.length;
			while(k < l) {
				var n = this.x[k];
				if(n.nodeType == Xml.Element && n._nodeName == name) break;
				k++;
			}
			this.cur = k;
			return k < l;
		}, next : function() {
			var k = this.cur;
			var l = this.x.length;
			while(k < l) {
				var n = this.x[k];
				k++;
				if(n.nodeType == Xml.Element && n._nodeName == name) {
					this.cur = k;
					return n;
				}
			}
			return null;
		}};
	}
	,elements: function() {
		if(this._children == null) throw "bad nodetype";
		return { cur : 0, x : this._children, hasNext : function() {
			var k = this.cur;
			var l = this.x.length;
			while(k < l) {
				if(this.x[k].nodeType == Xml.Element) break;
				k += 1;
			}
			this.cur = k;
			return k < l;
		}, next : function() {
			var k = this.cur;
			var l = this.x.length;
			while(k < l) {
				var n = this.x[k];
				k += 1;
				if(n.nodeType == Xml.Element) {
					this.cur = k;
					return n;
				}
			}
			return null;
		}};
	}
	,iterator: function() {
		if(this._children == null) throw "bad nodetype";
		return { cur : 0, x : this._children, hasNext : function() {
			return this.cur < this.x.length;
		}, next : function() {
			return this.x[this.cur++];
		}};
	}
	,attributes: function() {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._attributes.keys();
	}
	,exists: function(att) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._attributes.exists(att);
	}
	,remove: function(att) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		this._attributes.remove(att);
	}
	,set: function(att,value) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		this._attributes.set(att,value);
	}
	,get: function(att) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._attributes.get(att);
	}
	,getParent: function() {
		return this._parent;
	}
	,setNodeValue: function(v) {
		if(this.nodeType == Xml.Element || this.nodeType == Xml.Document) throw "bad nodeType";
		return this._nodeValue = v;
	}
	,getNodeValue: function() {
		if(this.nodeType == Xml.Element || this.nodeType == Xml.Document) throw "bad nodeType";
		return this._nodeValue;
	}
	,setNodeName: function(n) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._nodeName = n;
	}
	,getNodeName: function() {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._nodeName;
	}
	,_parent: null
	,_children: null
	,_attributes: null
	,_nodeValue: null
	,_nodeName: null
	,parent: null
	,nodeValue: null
	,nodeName: null
	,nodeType: null
	,__class__: Xml
	,__properties__: {set_nodeName:"setNodeName",get_nodeName:"getNodeName",set_nodeValue:"setNodeValue",get_nodeValue:"getNodeValue",get_parent:"getParent"}
}
var haxe = haxe || {}
haxe.Int32 = $hxClasses["haxe.Int32"] = function() { }
haxe.Int32.__name__ = ["haxe","Int32"];
haxe.Int32.make = function(a,b) {
	return a << 16 | b;
}
haxe.Int32.ofInt = function(x) {
	return x | 0;
}
haxe.Int32.clamp = function(x) {
	return x | 0;
}
haxe.Int32.toInt = function(x) {
	if((x >> 30 & 1) != x >>> 31) throw "Overflow " + Std.string(x);
	return x;
}
haxe.Int32.toNativeInt = function(x) {
	return x;
}
haxe.Int32.add = function(a,b) {
	return a + b | 0;
}
haxe.Int32.sub = function(a,b) {
	return a - b | 0;
}
haxe.Int32.mul = function(a,b) {
	return a * (b & 65535) + (a * (b >>> 16) << 16 | 0) | 0;
}
haxe.Int32.div = function(a,b) {
	return a / b | 0;
}
haxe.Int32.mod = function(a,b) {
	return a % b;
}
haxe.Int32.shl = function(a,b) {
	return a << b;
}
haxe.Int32.shr = function(a,b) {
	return a >> b;
}
haxe.Int32.ushr = function(a,b) {
	return a >>> b;
}
haxe.Int32.and = function(a,b) {
	return a & b;
}
haxe.Int32.or = function(a,b) {
	return a | b;
}
haxe.Int32.xor = function(a,b) {
	return a ^ b;
}
haxe.Int32.neg = function(a) {
	return -a;
}
haxe.Int32.isNeg = function(a) {
	return a < 0;
}
haxe.Int32.isZero = function(a) {
	return a == 0;
}
haxe.Int32.complement = function(a) {
	return ~a;
}
haxe.Int32.compare = function(a,b) {
	return a - b;
}
haxe.Int32.ucompare = function(a,b) {
	if(a < 0) return b < 0?~b - ~a:1;
	return b < 0?-1:a - b;
}
haxe.Int64 = $hxClasses["haxe.Int64"] = function(high,low) {
	this.high = high;
	this.low = low;
};
haxe.Int64.__name__ = ["haxe","Int64"];
haxe.Int64.make = function(high,low) {
	return new haxe.Int64(high,low);
}
haxe.Int64.ofInt = function(x) {
	return new haxe.Int64(x >> 31 | 0,x | 0);
}
haxe.Int64.ofInt32 = function(x) {
	return new haxe.Int64(x >> 31,x);
}
haxe.Int64.toInt = function(x) {
	if(haxe.Int32.toInt(x.high) != 0) {
		if(x.high < 0) return -haxe.Int64.toInt(haxe.Int64.neg(x));
		throw "Overflow";
	}
	return haxe.Int32.toInt(x.low);
}
haxe.Int64.getLow = function(x) {
	return x.low;
}
haxe.Int64.getHigh = function(x) {
	return x.high;
}
haxe.Int64.add = function(a,b) {
	var high = a.high + b.high | 0;
	var low = a.low + b.low | 0;
	if(haxe.Int32.ucompare(low,a.low) < 0) high = high + (1 | 0) | 0;
	return new haxe.Int64(high,low);
}
haxe.Int64.sub = function(a,b) {
	var high = a.high - b.high | 0;
	var low = a.low - b.low | 0;
	if(haxe.Int32.ucompare(a.low,b.low) < 0) high = high - (1 | 0) | 0;
	return new haxe.Int64(high,low);
}
haxe.Int64.mul = function(a,b) {
	var mask = 65535 | 0;
	var al = a.low & mask, ah = a.low >>> 16;
	var bl = b.low & mask, bh = b.low >>> 16;
	var p00 = al * (bl & 65535) + (al * (bl >>> 16) << 16 | 0) | 0;
	var p10 = ah * (bl & 65535) + (ah * (bl >>> 16) << 16 | 0) | 0;
	var p01 = al * (bh & 65535) + (al * (bh >>> 16) << 16 | 0) | 0;
	var p11 = ah * (bh & 65535) + (ah * (bh >>> 16) << 16 | 0) | 0;
	var low = p00;
	var high = (p11 + (p01 >>> 16) | 0) + (p10 >>> 16) | 0;
	p01 = p01 << 16;
	low = low + p01 | 0;
	if(haxe.Int32.ucompare(low,p01) < 0) high = high + (1 | 0) | 0;
	p10 = p10 << 16;
	low = low + p10 | 0;
	if(haxe.Int32.ucompare(low,p10) < 0) high = high + (1 | 0) | 0;
	high = high + haxe.Int32.mul(a.low,b.high) | 0;
	high = high + haxe.Int32.mul(a.high,b.low) | 0;
	return new haxe.Int64(high,low);
}
haxe.Int64.divMod = function(modulus,divisor) {
	var quotient = new haxe.Int64(0 | 0,0 | 0);
	var mask = new haxe.Int64(0 | 0,1 | 0);
	divisor = new haxe.Int64(divisor.high,divisor.low);
	while(!(divisor.high < 0)) {
		var cmp = haxe.Int64.ucompare(divisor,modulus);
		divisor.high = divisor.high << 1 | divisor.low >>> 31;
		divisor.low = divisor.low << 1;
		mask.high = mask.high << 1 | mask.low >>> 31;
		mask.low = mask.low << 1;
		if(cmp >= 0) break;
	}
	while(!((mask.low | mask.high) == 0)) {
		if(haxe.Int64.ucompare(modulus,divisor) >= 0) {
			quotient.high = quotient.high | mask.high;
			quotient.low = quotient.low | mask.low;
			modulus = haxe.Int64.sub(modulus,divisor);
		}
		mask.low = mask.low >>> 1 | mask.high << 31;
		mask.high = mask.high >>> 1;
		divisor.low = divisor.low >>> 1 | divisor.high << 31;
		divisor.high = divisor.high >>> 1;
	}
	return { quotient : quotient, modulus : modulus};
}
haxe.Int64.div = function(a,b) {
	var sign = (a.high | b.high) < 0;
	if(a.high < 0) a = haxe.Int64.neg(a);
	if(b.high < 0) b = haxe.Int64.neg(b);
	var q = haxe.Int64.divMod(a,b).quotient;
	return sign?haxe.Int64.neg(q):q;
}
haxe.Int64.mod = function(a,b) {
	var sign = (a.high | b.high) < 0;
	if(a.high < 0) a = haxe.Int64.neg(a);
	if(b.high < 0) b = haxe.Int64.neg(b);
	var m = haxe.Int64.divMod(a,b).modulus;
	return sign?haxe.Int64.neg(m):m;
}
haxe.Int64.shl = function(a,b) {
	return (b & 63) == 0?a:(b & 63) < 32?new haxe.Int64(a.high << b | a.low >>> 32 - (b & 63),a.low << b):new haxe.Int64(a.low << b - 32,0 | 0);
}
haxe.Int64.shr = function(a,b) {
	return (b & 63) == 0?a:(b & 63) < 32?new haxe.Int64(a.high >> b,a.low >>> b | a.high << 32 - (b & 63)):new haxe.Int64(a.high >> 31,a.high >> b - 32);
}
haxe.Int64.ushr = function(a,b) {
	return (b & 63) == 0?a:(b & 63) < 32?new haxe.Int64(a.high >>> b,a.low >>> b | a.high << 32 - (b & 63)):new haxe.Int64(0 | 0,a.high >>> b - 32);
}
haxe.Int64.and = function(a,b) {
	return new haxe.Int64(a.high & b.high,a.low & b.low);
}
haxe.Int64.or = function(a,b) {
	return new haxe.Int64(a.high | b.high,a.low | b.low);
}
haxe.Int64.xor = function(a,b) {
	return new haxe.Int64(a.high ^ b.high,a.low ^ b.low);
}
haxe.Int64.neg = function(a) {
	var high = ~a.high;
	var low = -a.low;
	if(low == 0) high = high + (1 | 0) | 0;
	return new haxe.Int64(high,low);
}
haxe.Int64.isNeg = function(a) {
	return a.high < 0;
}
haxe.Int64.isZero = function(a) {
	return (a.high | a.low) == 0;
}
haxe.Int64.compare = function(a,b) {
	var v = a.high - b.high;
	return v != 0?v:haxe.Int32.ucompare(a.low,b.low);
}
haxe.Int64.ucompare = function(a,b) {
	var v = haxe.Int32.ucompare(a.high,b.high);
	return v != 0?v:haxe.Int32.ucompare(a.low,b.low);
}
haxe.Int64.toStr = function(a) {
	return a.toString();
}
haxe.Int64.prototype = {
	toString: function() {
		if(this.high == 0 && this.low == 0) return "0";
		var str = "";
		var neg = false;
		var i = this;
		if(i.high < 0) {
			neg = true;
			i = haxe.Int64.neg(i);
		}
		var ten = new haxe.Int64(0 | 0,10 | 0);
		while(!((i.high | i.low) == 0)) {
			var r = haxe.Int64.divMod(i,ten);
			str = haxe.Int32.toInt(r.modulus.low) + str;
			i = r.quotient;
		}
		if(neg) str = "-" + str;
		return str;
	}
	,low: null
	,high: null
	,__class__: haxe.Int64
}
haxe.Json = $hxClasses["haxe.Json"] = function() {
};
haxe.Json.__name__ = ["haxe","Json"];
haxe.Json.parse = function(text) {
	return new haxe.Json().doParse(text);
}
haxe.Json.stringify = function(value) {
	return new haxe.Json().toString(value);
}
haxe.Json.prototype = {
	parseString: function() {
		var start = this.pos;
		var buf = new StringBuf();
		while(true) {
			var c = this.str.charCodeAt(this.pos++);
			if(c == 34) break;
			if(c == 92) {
				buf.b += HxOverrides.substr(this.str,start,this.pos - start - 1);
				c = this.str.charCodeAt(this.pos++);
				switch(c) {
				case 114:
					buf.b += String.fromCharCode(13);
					break;
				case 110:
					buf.b += String.fromCharCode(10);
					break;
				case 116:
					buf.b += String.fromCharCode(9);
					break;
				case 98:
					buf.b += String.fromCharCode(8);
					break;
				case 102:
					buf.b += String.fromCharCode(12);
					break;
				case 47:case 92:case 34:
					buf.b += String.fromCharCode(c);
					break;
				case 117:
					var uc = Std.parseInt("0x" + HxOverrides.substr(this.str,this.pos,4));
					this.pos += 4;
					buf.b += String.fromCharCode(uc);
					break;
				default:
					throw "Invalid escape sequence \\" + String.fromCharCode(c) + " at position " + (this.pos - 1);
				}
				start = this.pos;
			} else if(c != c) throw "Unclosed string";
		}
		buf.b += HxOverrides.substr(this.str,start,this.pos - start - 1);
		return buf.b;
	}
	,parseRec: function() {
		while(true) {
			var c = this.str.charCodeAt(this.pos++);
			switch(c) {
			case 32:case 13:case 10:case 9:
				break;
			case 123:
				var obj = { }, field = null, comma = null;
				while(true) {
					var c1 = this.str.charCodeAt(this.pos++);
					switch(c1) {
					case 32:case 13:case 10:case 9:
						break;
					case 125:
						if(field != null || comma == false) this.invalidChar();
						return obj;
					case 58:
						if(field == null) this.invalidChar();
						obj[field] = this.parseRec();
						field = null;
						comma = true;
						break;
					case 44:
						if(comma) comma = false; else this.invalidChar();
						break;
					case 34:
						if(comma) this.invalidChar();
						field = this.parseString();
						break;
					default:
						this.invalidChar();
					}
				}
				break;
			case 91:
				var arr = [], comma = null;
				while(true) {
					var c1 = this.str.charCodeAt(this.pos++);
					switch(c1) {
					case 32:case 13:case 10:case 9:
						break;
					case 93:
						if(comma == false) this.invalidChar();
						return arr;
					case 44:
						if(comma) comma = false; else this.invalidChar();
						break;
					default:
						if(comma) this.invalidChar();
						this.pos--;
						arr.push(this.parseRec());
						comma = true;
					}
				}
				break;
			case 116:
				var save = this.pos;
				if(this.str.charCodeAt(this.pos++) != 114 || this.str.charCodeAt(this.pos++) != 117 || this.str.charCodeAt(this.pos++) != 101) {
					this.pos = save;
					this.invalidChar();
				}
				return true;
			case 102:
				var save = this.pos;
				if(this.str.charCodeAt(this.pos++) != 97 || this.str.charCodeAt(this.pos++) != 108 || this.str.charCodeAt(this.pos++) != 115 || this.str.charCodeAt(this.pos++) != 101) {
					this.pos = save;
					this.invalidChar();
				}
				return false;
			case 110:
				var save = this.pos;
				if(this.str.charCodeAt(this.pos++) != 117 || this.str.charCodeAt(this.pos++) != 108 || this.str.charCodeAt(this.pos++) != 108) {
					this.pos = save;
					this.invalidChar();
				}
				return null;
			case 34:
				return this.parseString();
			case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:case 45:
				this.pos--;
				if(!this.reg_float.match(HxOverrides.substr(this.str,this.pos,null))) throw "Invalid float at position " + this.pos;
				var v = this.reg_float.matched(0);
				this.pos += v.length;
				var f = Std.parseFloat(v);
				var i = f | 0;
				return i == f?i:f;
			default:
				this.invalidChar();
			}
		}
	}
	,nextChar: function() {
		return this.str.charCodeAt(this.pos++);
	}
	,invalidChar: function() {
		this.pos--;
		throw "Invalid char " + this.str.charCodeAt(this.pos) + " at position " + this.pos;
	}
	,doParse: function(str) {
		this.reg_float = new EReg("^-?(0|[1-9][0-9]*)(\\.[0-9]+)?([eE][+-]?[0-9]+)?","");
		this.str = str;
		this.pos = 0;
		return this.parseRec();
	}
	,quote: function(s) {
		this.buf.b += Std.string("\"");
		var i = 0;
		while(true) {
			var c = s.charCodeAt(i++);
			if(c != c) break;
			switch(c) {
			case 34:
				this.buf.b += Std.string("\\\"");
				break;
			case 92:
				this.buf.b += Std.string("\\\\");
				break;
			case 10:
				this.buf.b += Std.string("\\n");
				break;
			case 13:
				this.buf.b += Std.string("\\r");
				break;
			case 9:
				this.buf.b += Std.string("\\t");
				break;
			case 8:
				this.buf.b += Std.string("\\b");
				break;
			case 12:
				this.buf.b += Std.string("\\f");
				break;
			default:
				this.buf.b += String.fromCharCode(c);
			}
		}
		this.buf.b += Std.string("\"");
	}
	,toStringRec: function(v) {
		var $e = (Type["typeof"](v));
		switch( $e[1] ) {
		case 8:
			this.buf.b += Std.string("\"???\"");
			break;
		case 4:
			this.objString(v);
			break;
		case 1:
		case 2:
			this.buf.b += Std.string(v);
			break;
		case 5:
			this.buf.b += Std.string("\"<fun>\"");
			break;
		case 6:
			var c = $e[2];
			if(c == String) this.quote(v); else if(c == Array) {
				var v1 = v;
				this.buf.b += Std.string("[");
				var len = v1.length;
				if(len > 0) {
					this.toStringRec(v1[0]);
					var i = 1;
					while(i < len) {
						this.buf.b += Std.string(",");
						this.toStringRec(v1[i++]);
					}
				}
				this.buf.b += Std.string("]");
			} else if(c == Hash) {
				var v1 = v;
				var o = { };
				var $it0 = v1.keys();
				while( $it0.hasNext() ) {
					var k = $it0.next();
					o[k] = v1.get(k);
				}
				this.objString(o);
			} else this.objString(v);
			break;
		case 7:
			var e = $e[2];
			this.buf.b += Std.string(v[1]);
			break;
		case 3:
			this.buf.b += Std.string(v?"true":"false");
			break;
		case 0:
			this.buf.b += Std.string("null");
			break;
		}
	}
	,objString: function(v) {
		this.fieldsString(v,Reflect.fields(v));
	}
	,fieldsString: function(v,fields) {
		var first = true;
		this.buf.b += Std.string("{");
		var _g = 0;
		while(_g < fields.length) {
			var f = fields[_g];
			++_g;
			var value = Reflect.field(v,f);
			if(Reflect.isFunction(value)) continue;
			if(first) first = false; else this.buf.b += Std.string(",");
			this.quote(f);
			this.buf.b += Std.string(":");
			this.toStringRec(value);
		}
		this.buf.b += Std.string("}");
	}
	,toString: function(v) {
		this.buf = new StringBuf();
		this.toStringRec(v);
		return this.buf.b;
	}
	,reg_float: null
	,pos: null
	,str: null
	,buf: null
	,__class__: haxe.Json
}
haxe.StackItem = $hxClasses["haxe.StackItem"] = { __ename__ : ["haxe","StackItem"], __constructs__ : ["CFunction","Module","FilePos","Method","Lambda"] }
haxe.StackItem.CFunction = ["CFunction",0];
haxe.StackItem.CFunction.toString = $estr;
haxe.StackItem.CFunction.__enum__ = haxe.StackItem;
haxe.StackItem.Module = function(m) { var $x = ["Module",1,m]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.FilePos = function(s,file,line) { var $x = ["FilePos",2,s,file,line]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.Method = function(classname,method) { var $x = ["Method",3,classname,method]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.Lambda = function(v) { var $x = ["Lambda",4,v]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.Stack = $hxClasses["haxe.Stack"] = function() { }
haxe.Stack.__name__ = ["haxe","Stack"];
haxe.Stack.callStack = function() {
	var oldValue = Error.prepareStackTrace;
	Error.prepareStackTrace = function(error,callsites) {
		var stack = [];
		var _g = 0;
		while(_g < callsites.length) {
			var site = callsites[_g];
			++_g;
			var method = null;
			var fullName = site.getFunctionName();
			if(fullName != null) {
				var idx = fullName.lastIndexOf(".");
				if(idx >= 0) {
					var className = HxOverrides.substr(fullName,0,idx);
					var methodName = HxOverrides.substr(fullName,idx + 1,null);
					method = haxe.StackItem.Method(className,methodName);
				}
			}
			stack.push(haxe.StackItem.FilePos(method,site.getFileName(),site.getLineNumber()));
		}
		return stack;
	};
	var a = haxe.Stack.makeStack(new Error().stack);
	a.shift();
	Error.prepareStackTrace = oldValue;
	return a;
}
haxe.Stack.exceptionStack = function() {
	return [];
}
haxe.Stack.toString = function(stack) {
	var b = new StringBuf();
	var _g = 0;
	while(_g < stack.length) {
		var s = stack[_g];
		++_g;
		b.b += Std.string("\nCalled from ");
		haxe.Stack.itemToString(b,s);
	}
	return b.b;
}
haxe.Stack.itemToString = function(b,s) {
	var $e = (s);
	switch( $e[1] ) {
	case 0:
		b.b += Std.string("a C function");
		break;
	case 1:
		var m = $e[2];
		b.b += Std.string("module ");
		b.b += Std.string(m);
		break;
	case 2:
		var line = $e[4], file = $e[3], s1 = $e[2];
		if(s1 != null) {
			haxe.Stack.itemToString(b,s1);
			b.b += Std.string(" (");
		}
		b.b += Std.string(file);
		b.b += Std.string(" line ");
		b.b += Std.string(line);
		if(s1 != null) b.b += Std.string(")");
		break;
	case 3:
		var meth = $e[3], cname = $e[2];
		b.b += Std.string(cname);
		b.b += Std.string(".");
		b.b += Std.string(meth);
		break;
	case 4:
		var n = $e[2];
		b.b += Std.string("local function #");
		b.b += Std.string(n);
		break;
	}
}
haxe.Stack.makeStack = function(s) {
	if(typeof(s) == "string") {
		var stack = s.split("\n");
		var m = [];
		var _g = 0;
		while(_g < stack.length) {
			var line = stack[_g];
			++_g;
			m.push(haxe.StackItem.Module(line));
		}
		return m;
	} else return s;
}
if(!haxe.macro) haxe.macro = {}
haxe.macro.Context = $hxClasses["haxe.macro.Context"] = function() { }
haxe.macro.Context.__name__ = ["haxe","macro","Context"];
haxe.macro.Constant = $hxClasses["haxe.macro.Constant"] = { __ename__ : ["haxe","macro","Constant"], __constructs__ : ["CInt","CFloat","CString","CIdent","CRegexp","CType"] }
haxe.macro.Constant.CInt = function(v) { var $x = ["CInt",0,v]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; }
haxe.macro.Constant.CFloat = function(f) { var $x = ["CFloat",1,f]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; }
haxe.macro.Constant.CString = function(s) { var $x = ["CString",2,s]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; }
haxe.macro.Constant.CIdent = function(s) { var $x = ["CIdent",3,s]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; }
haxe.macro.Constant.CRegexp = function(r,opt) { var $x = ["CRegexp",4,r,opt]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; }
haxe.macro.Constant.CType = function(s) { var $x = ["CType",5,s]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; }
haxe.macro.Binop = $hxClasses["haxe.macro.Binop"] = { __ename__ : ["haxe","macro","Binop"], __constructs__ : ["OpAdd","OpMult","OpDiv","OpSub","OpAssign","OpEq","OpNotEq","OpGt","OpGte","OpLt","OpLte","OpAnd","OpOr","OpXor","OpBoolAnd","OpBoolOr","OpShl","OpShr","OpUShr","OpMod","OpAssignOp","OpInterval"] }
haxe.macro.Binop.OpAdd = ["OpAdd",0];
haxe.macro.Binop.OpAdd.toString = $estr;
haxe.macro.Binop.OpAdd.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpMult = ["OpMult",1];
haxe.macro.Binop.OpMult.toString = $estr;
haxe.macro.Binop.OpMult.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpDiv = ["OpDiv",2];
haxe.macro.Binop.OpDiv.toString = $estr;
haxe.macro.Binop.OpDiv.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpSub = ["OpSub",3];
haxe.macro.Binop.OpSub.toString = $estr;
haxe.macro.Binop.OpSub.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpAssign = ["OpAssign",4];
haxe.macro.Binop.OpAssign.toString = $estr;
haxe.macro.Binop.OpAssign.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpEq = ["OpEq",5];
haxe.macro.Binop.OpEq.toString = $estr;
haxe.macro.Binop.OpEq.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpNotEq = ["OpNotEq",6];
haxe.macro.Binop.OpNotEq.toString = $estr;
haxe.macro.Binop.OpNotEq.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpGt = ["OpGt",7];
haxe.macro.Binop.OpGt.toString = $estr;
haxe.macro.Binop.OpGt.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpGte = ["OpGte",8];
haxe.macro.Binop.OpGte.toString = $estr;
haxe.macro.Binop.OpGte.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpLt = ["OpLt",9];
haxe.macro.Binop.OpLt.toString = $estr;
haxe.macro.Binop.OpLt.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpLte = ["OpLte",10];
haxe.macro.Binop.OpLte.toString = $estr;
haxe.macro.Binop.OpLte.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpAnd = ["OpAnd",11];
haxe.macro.Binop.OpAnd.toString = $estr;
haxe.macro.Binop.OpAnd.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpOr = ["OpOr",12];
haxe.macro.Binop.OpOr.toString = $estr;
haxe.macro.Binop.OpOr.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpXor = ["OpXor",13];
haxe.macro.Binop.OpXor.toString = $estr;
haxe.macro.Binop.OpXor.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpBoolAnd = ["OpBoolAnd",14];
haxe.macro.Binop.OpBoolAnd.toString = $estr;
haxe.macro.Binop.OpBoolAnd.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpBoolOr = ["OpBoolOr",15];
haxe.macro.Binop.OpBoolOr.toString = $estr;
haxe.macro.Binop.OpBoolOr.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpShl = ["OpShl",16];
haxe.macro.Binop.OpShl.toString = $estr;
haxe.macro.Binop.OpShl.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpShr = ["OpShr",17];
haxe.macro.Binop.OpShr.toString = $estr;
haxe.macro.Binop.OpShr.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpUShr = ["OpUShr",18];
haxe.macro.Binop.OpUShr.toString = $estr;
haxe.macro.Binop.OpUShr.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpMod = ["OpMod",19];
haxe.macro.Binop.OpMod.toString = $estr;
haxe.macro.Binop.OpMod.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpAssignOp = function(op) { var $x = ["OpAssignOp",20,op]; $x.__enum__ = haxe.macro.Binop; $x.toString = $estr; return $x; }
haxe.macro.Binop.OpInterval = ["OpInterval",21];
haxe.macro.Binop.OpInterval.toString = $estr;
haxe.macro.Binop.OpInterval.__enum__ = haxe.macro.Binop;
haxe.macro.Unop = $hxClasses["haxe.macro.Unop"] = { __ename__ : ["haxe","macro","Unop"], __constructs__ : ["OpIncrement","OpDecrement","OpNot","OpNeg","OpNegBits"] }
haxe.macro.Unop.OpIncrement = ["OpIncrement",0];
haxe.macro.Unop.OpIncrement.toString = $estr;
haxe.macro.Unop.OpIncrement.__enum__ = haxe.macro.Unop;
haxe.macro.Unop.OpDecrement = ["OpDecrement",1];
haxe.macro.Unop.OpDecrement.toString = $estr;
haxe.macro.Unop.OpDecrement.__enum__ = haxe.macro.Unop;
haxe.macro.Unop.OpNot = ["OpNot",2];
haxe.macro.Unop.OpNot.toString = $estr;
haxe.macro.Unop.OpNot.__enum__ = haxe.macro.Unop;
haxe.macro.Unop.OpNeg = ["OpNeg",3];
haxe.macro.Unop.OpNeg.toString = $estr;
haxe.macro.Unop.OpNeg.__enum__ = haxe.macro.Unop;
haxe.macro.Unop.OpNegBits = ["OpNegBits",4];
haxe.macro.Unop.OpNegBits.toString = $estr;
haxe.macro.Unop.OpNegBits.__enum__ = haxe.macro.Unop;
haxe.macro.ExprDef = $hxClasses["haxe.macro.ExprDef"] = { __ename__ : ["haxe","macro","ExprDef"], __constructs__ : ["EConst","EArray","EBinop","EField","EParenthesis","EObjectDecl","EArrayDecl","ECall","ENew","EUnop","EVars","EFunction","EBlock","EFor","EIn","EIf","EWhile","ESwitch","ETry","EReturn","EBreak","EContinue","EUntyped","EThrow","ECast","EDisplay","EDisplayNew","ETernary","ECheckType","EType"] }
haxe.macro.ExprDef.EConst = function(c) { var $x = ["EConst",0,c]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EArray = function(e1,e2) { var $x = ["EArray",1,e1,e2]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EBinop = function(op,e1,e2) { var $x = ["EBinop",2,op,e1,e2]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EField = function(e,field) { var $x = ["EField",3,e,field]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EParenthesis = function(e) { var $x = ["EParenthesis",4,e]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EObjectDecl = function(fields) { var $x = ["EObjectDecl",5,fields]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EArrayDecl = function(values) { var $x = ["EArrayDecl",6,values]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.ECall = function(e,params) { var $x = ["ECall",7,e,params]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.ENew = function(t,params) { var $x = ["ENew",8,t,params]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EUnop = function(op,postFix,e) { var $x = ["EUnop",9,op,postFix,e]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EVars = function(vars) { var $x = ["EVars",10,vars]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EFunction = function(name,f) { var $x = ["EFunction",11,name,f]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EBlock = function(exprs) { var $x = ["EBlock",12,exprs]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EFor = function(it,expr) { var $x = ["EFor",13,it,expr]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EIn = function(e1,e2) { var $x = ["EIn",14,e1,e2]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EIf = function(econd,eif,eelse) { var $x = ["EIf",15,econd,eif,eelse]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EWhile = function(econd,e,normalWhile) { var $x = ["EWhile",16,econd,e,normalWhile]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.ESwitch = function(e,cases,edef) { var $x = ["ESwitch",17,e,cases,edef]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.ETry = function(e,catches) { var $x = ["ETry",18,e,catches]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EReturn = function(e) { var $x = ["EReturn",19,e]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EBreak = ["EBreak",20];
haxe.macro.ExprDef.EBreak.toString = $estr;
haxe.macro.ExprDef.EBreak.__enum__ = haxe.macro.ExprDef;
haxe.macro.ExprDef.EContinue = ["EContinue",21];
haxe.macro.ExprDef.EContinue.toString = $estr;
haxe.macro.ExprDef.EContinue.__enum__ = haxe.macro.ExprDef;
haxe.macro.ExprDef.EUntyped = function(e) { var $x = ["EUntyped",22,e]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EThrow = function(e) { var $x = ["EThrow",23,e]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.ECast = function(e,t) { var $x = ["ECast",24,e,t]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EDisplay = function(e,isCall) { var $x = ["EDisplay",25,e,isCall]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EDisplayNew = function(t) { var $x = ["EDisplayNew",26,t]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.ETernary = function(econd,eif,eelse) { var $x = ["ETernary",27,econd,eif,eelse]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.ECheckType = function(e,t) { var $x = ["ECheckType",28,e,t]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EType = function(e,field) { var $x = ["EType",29,e,field]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ComplexType = $hxClasses["haxe.macro.ComplexType"] = { __ename__ : ["haxe","macro","ComplexType"], __constructs__ : ["TPath","TFunction","TAnonymous","TParent","TExtend","TOptional"] }
haxe.macro.ComplexType.TPath = function(p) { var $x = ["TPath",0,p]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; }
haxe.macro.ComplexType.TFunction = function(args,ret) { var $x = ["TFunction",1,args,ret]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; }
haxe.macro.ComplexType.TAnonymous = function(fields) { var $x = ["TAnonymous",2,fields]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; }
haxe.macro.ComplexType.TParent = function(t) { var $x = ["TParent",3,t]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; }
haxe.macro.ComplexType.TExtend = function(p,fields) { var $x = ["TExtend",4,p,fields]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; }
haxe.macro.ComplexType.TOptional = function(t) { var $x = ["TOptional",5,t]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; }
haxe.macro.TypeParam = $hxClasses["haxe.macro.TypeParam"] = { __ename__ : ["haxe","macro","TypeParam"], __constructs__ : ["TPType","TPExpr"] }
haxe.macro.TypeParam.TPType = function(t) { var $x = ["TPType",0,t]; $x.__enum__ = haxe.macro.TypeParam; $x.toString = $estr; return $x; }
haxe.macro.TypeParam.TPExpr = function(e) { var $x = ["TPExpr",1,e]; $x.__enum__ = haxe.macro.TypeParam; $x.toString = $estr; return $x; }
haxe.macro.Access = $hxClasses["haxe.macro.Access"] = { __ename__ : ["haxe","macro","Access"], __constructs__ : ["APublic","APrivate","AStatic","AOverride","ADynamic","AInline"] }
haxe.macro.Access.APublic = ["APublic",0];
haxe.macro.Access.APublic.toString = $estr;
haxe.macro.Access.APublic.__enum__ = haxe.macro.Access;
haxe.macro.Access.APrivate = ["APrivate",1];
haxe.macro.Access.APrivate.toString = $estr;
haxe.macro.Access.APrivate.__enum__ = haxe.macro.Access;
haxe.macro.Access.AStatic = ["AStatic",2];
haxe.macro.Access.AStatic.toString = $estr;
haxe.macro.Access.AStatic.__enum__ = haxe.macro.Access;
haxe.macro.Access.AOverride = ["AOverride",3];
haxe.macro.Access.AOverride.toString = $estr;
haxe.macro.Access.AOverride.__enum__ = haxe.macro.Access;
haxe.macro.Access.ADynamic = ["ADynamic",4];
haxe.macro.Access.ADynamic.toString = $estr;
haxe.macro.Access.ADynamic.__enum__ = haxe.macro.Access;
haxe.macro.Access.AInline = ["AInline",5];
haxe.macro.Access.AInline.toString = $estr;
haxe.macro.Access.AInline.__enum__ = haxe.macro.Access;
haxe.macro.FieldType = $hxClasses["haxe.macro.FieldType"] = { __ename__ : ["haxe","macro","FieldType"], __constructs__ : ["FVar","FFun","FProp"] }
haxe.macro.FieldType.FVar = function(t,e) { var $x = ["FVar",0,t,e]; $x.__enum__ = haxe.macro.FieldType; $x.toString = $estr; return $x; }
haxe.macro.FieldType.FFun = function(f) { var $x = ["FFun",1,f]; $x.__enum__ = haxe.macro.FieldType; $x.toString = $estr; return $x; }
haxe.macro.FieldType.FProp = function(get,set,t,e) { var $x = ["FProp",2,get,set,t,e]; $x.__enum__ = haxe.macro.FieldType; $x.toString = $estr; return $x; }
haxe.macro.TypeDefKind = $hxClasses["haxe.macro.TypeDefKind"] = { __ename__ : ["haxe","macro","TypeDefKind"], __constructs__ : ["TDEnum","TDStructure","TDClass"] }
haxe.macro.TypeDefKind.TDEnum = ["TDEnum",0];
haxe.macro.TypeDefKind.TDEnum.toString = $estr;
haxe.macro.TypeDefKind.TDEnum.__enum__ = haxe.macro.TypeDefKind;
haxe.macro.TypeDefKind.TDStructure = ["TDStructure",1];
haxe.macro.TypeDefKind.TDStructure.toString = $estr;
haxe.macro.TypeDefKind.TDStructure.__enum__ = haxe.macro.TypeDefKind;
haxe.macro.TypeDefKind.TDClass = function(extend,implement,isInterface) { var $x = ["TDClass",2,extend,implement,isInterface]; $x.__enum__ = haxe.macro.TypeDefKind; $x.toString = $estr; return $x; }
haxe.macro.Error = $hxClasses["haxe.macro.Error"] = function(m,p) {
	this.message = m;
	this.pos = p;
};
haxe.macro.Error.__name__ = ["haxe","macro","Error"];
haxe.macro.Error.prototype = {
	pos: null
	,message: null
	,__class__: haxe.macro.Error
}
if(!haxe.rtti) haxe.rtti = {}
haxe.rtti.CType = $hxClasses["haxe.rtti.CType"] = { __ename__ : ["haxe","rtti","CType"], __constructs__ : ["CUnknown","CEnum","CClass","CTypedef","CFunction","CAnonymous","CDynamic"] }
haxe.rtti.CType.CUnknown = ["CUnknown",0];
haxe.rtti.CType.CUnknown.toString = $estr;
haxe.rtti.CType.CUnknown.__enum__ = haxe.rtti.CType;
haxe.rtti.CType.CEnum = function(name,params) { var $x = ["CEnum",1,name,params]; $x.__enum__ = haxe.rtti.CType; $x.toString = $estr; return $x; }
haxe.rtti.CType.CClass = function(name,params) { var $x = ["CClass",2,name,params]; $x.__enum__ = haxe.rtti.CType; $x.toString = $estr; return $x; }
haxe.rtti.CType.CTypedef = function(name,params) { var $x = ["CTypedef",3,name,params]; $x.__enum__ = haxe.rtti.CType; $x.toString = $estr; return $x; }
haxe.rtti.CType.CFunction = function(args,ret) { var $x = ["CFunction",4,args,ret]; $x.__enum__ = haxe.rtti.CType; $x.toString = $estr; return $x; }
haxe.rtti.CType.CAnonymous = function(fields) { var $x = ["CAnonymous",5,fields]; $x.__enum__ = haxe.rtti.CType; $x.toString = $estr; return $x; }
haxe.rtti.CType.CDynamic = function(t) { var $x = ["CDynamic",6,t]; $x.__enum__ = haxe.rtti.CType; $x.toString = $estr; return $x; }
haxe.rtti.Rights = $hxClasses["haxe.rtti.Rights"] = { __ename__ : ["haxe","rtti","Rights"], __constructs__ : ["RNormal","RNo","RCall","RMethod","RDynamic","RInline"] }
haxe.rtti.Rights.RNormal = ["RNormal",0];
haxe.rtti.Rights.RNormal.toString = $estr;
haxe.rtti.Rights.RNormal.__enum__ = haxe.rtti.Rights;
haxe.rtti.Rights.RNo = ["RNo",1];
haxe.rtti.Rights.RNo.toString = $estr;
haxe.rtti.Rights.RNo.__enum__ = haxe.rtti.Rights;
haxe.rtti.Rights.RCall = function(m) { var $x = ["RCall",2,m]; $x.__enum__ = haxe.rtti.Rights; $x.toString = $estr; return $x; }
haxe.rtti.Rights.RMethod = ["RMethod",3];
haxe.rtti.Rights.RMethod.toString = $estr;
haxe.rtti.Rights.RMethod.__enum__ = haxe.rtti.Rights;
haxe.rtti.Rights.RDynamic = ["RDynamic",4];
haxe.rtti.Rights.RDynamic.toString = $estr;
haxe.rtti.Rights.RDynamic.__enum__ = haxe.rtti.Rights;
haxe.rtti.Rights.RInline = ["RInline",5];
haxe.rtti.Rights.RInline.toString = $estr;
haxe.rtti.Rights.RInline.__enum__ = haxe.rtti.Rights;
haxe.rtti.TypeTree = $hxClasses["haxe.rtti.TypeTree"] = { __ename__ : ["haxe","rtti","TypeTree"], __constructs__ : ["TPackage","TClassdecl","TEnumdecl","TTypedecl"] }
haxe.rtti.TypeTree.TPackage = function(name,full,subs) { var $x = ["TPackage",0,name,full,subs]; $x.__enum__ = haxe.rtti.TypeTree; $x.toString = $estr; return $x; }
haxe.rtti.TypeTree.TClassdecl = function(c) { var $x = ["TClassdecl",1,c]; $x.__enum__ = haxe.rtti.TypeTree; $x.toString = $estr; return $x; }
haxe.rtti.TypeTree.TEnumdecl = function(e) { var $x = ["TEnumdecl",2,e]; $x.__enum__ = haxe.rtti.TypeTree; $x.toString = $estr; return $x; }
haxe.rtti.TypeTree.TTypedecl = function(t) { var $x = ["TTypedecl",3,t]; $x.__enum__ = haxe.rtti.TypeTree; $x.toString = $estr; return $x; }
haxe.rtti.TypeApi = $hxClasses["haxe.rtti.TypeApi"] = function() { }
haxe.rtti.TypeApi.__name__ = ["haxe","rtti","TypeApi"];
haxe.rtti.TypeApi.typeInfos = function(t) {
	var inf;
	var $e = (t);
	switch( $e[1] ) {
	case 1:
		var c = $e[2];
		inf = c;
		break;
	case 2:
		var e = $e[2];
		inf = e;
		break;
	case 3:
		var t1 = $e[2];
		inf = t1;
		break;
	case 0:
		throw "Unexpected Package";
		break;
	}
	return inf;
}
haxe.rtti.TypeApi.isVar = function(t) {
	return (function($this) {
		var $r;
		switch( (t)[1] ) {
		case 4:
			$r = false;
			break;
		default:
			$r = true;
		}
		return $r;
	}(this));
}
haxe.rtti.TypeApi.leq = function(f,l1,l2) {
	var it = l2.iterator();
	var $it0 = l1.iterator();
	while( $it0.hasNext() ) {
		var e1 = $it0.next();
		if(!it.hasNext()) return false;
		var e2 = it.next();
		if(!f(e1,e2)) return false;
	}
	if(it.hasNext()) return false;
	return true;
}
haxe.rtti.TypeApi.rightsEq = function(r1,r2) {
	if(r1 == r2) return true;
	var $e = (r1);
	switch( $e[1] ) {
	case 2:
		var m1 = $e[2];
		var $e = (r2);
		switch( $e[1] ) {
		case 2:
			var m2 = $e[2];
			return m1 == m2;
		default:
		}
		break;
	default:
	}
	return false;
}
haxe.rtti.TypeApi.typeEq = function(t1,t2) {
	var $e = (t1);
	switch( $e[1] ) {
	case 0:
		return t2 == haxe.rtti.CType.CUnknown;
	case 1:
		var params = $e[3], name = $e[2];
		var $e = (t2);
		switch( $e[1] ) {
		case 1:
			var params2 = $e[3], name2 = $e[2];
			return name == name2 && haxe.rtti.TypeApi.leq(haxe.rtti.TypeApi.typeEq,params,params2);
		default:
		}
		break;
	case 2:
		var params = $e[3], name = $e[2];
		var $e = (t2);
		switch( $e[1] ) {
		case 2:
			var params2 = $e[3], name2 = $e[2];
			return name == name2 && haxe.rtti.TypeApi.leq(haxe.rtti.TypeApi.typeEq,params,params2);
		default:
		}
		break;
	case 3:
		var params = $e[3], name = $e[2];
		var $e = (t2);
		switch( $e[1] ) {
		case 3:
			var params2 = $e[3], name2 = $e[2];
			return name == name2 && haxe.rtti.TypeApi.leq(haxe.rtti.TypeApi.typeEq,params,params2);
		default:
		}
		break;
	case 4:
		var ret = $e[3], args = $e[2];
		var $e = (t2);
		switch( $e[1] ) {
		case 4:
			var ret2 = $e[3], args2 = $e[2];
			return haxe.rtti.TypeApi.leq(function(a,b) {
				return a.name == b.name && a.opt == b.opt && haxe.rtti.TypeApi.typeEq(a.t,b.t);
			},args,args2) && haxe.rtti.TypeApi.typeEq(ret,ret2);
		default:
		}
		break;
	case 5:
		var fields = $e[2];
		var $e = (t2);
		switch( $e[1] ) {
		case 5:
			var fields2 = $e[2];
			return haxe.rtti.TypeApi.leq(function(a,b) {
				return a.name == b.name && haxe.rtti.TypeApi.typeEq(a.t,b.t);
			},fields,fields2);
		default:
		}
		break;
	case 6:
		var t = $e[2];
		var $e = (t2);
		switch( $e[1] ) {
		case 6:
			var t21 = $e[2];
			if(t == null != (t21 == null)) return false;
			return t == null || haxe.rtti.TypeApi.typeEq(t,t21);
		default:
		}
		break;
	}
	return false;
}
haxe.rtti.TypeApi.fieldEq = function(f1,f2) {
	if(f1.name != f2.name) return false;
	if(!haxe.rtti.TypeApi.typeEq(f1.type,f2.type)) return false;
	if(f1.isPublic != f2.isPublic) return false;
	if(f1.doc != f2.doc) return false;
	if(!haxe.rtti.TypeApi.rightsEq(f1.get,f2.get)) return false;
	if(!haxe.rtti.TypeApi.rightsEq(f1.set,f2.set)) return false;
	if(f1.params == null != (f2.params == null)) return false;
	if(f1.params != null && f1.params.join(":") != f2.params.join(":")) return false;
	return true;
}
haxe.rtti.TypeApi.constructorEq = function(c1,c2) {
	if(c1.name != c2.name) return false;
	if(c1.doc != c2.doc) return false;
	if(c1.args == null != (c2.args == null)) return false;
	if(c1.args != null && !haxe.rtti.TypeApi.leq(function(a,b) {
		return a.name == b.name && a.opt == b.opt && haxe.rtti.TypeApi.typeEq(a.t,b.t);
	},c1.args,c2.args)) return false;
	return true;
}
haxe.rtti.Infos = $hxClasses["haxe.rtti.Infos"] = function() { }
haxe.rtti.Infos.__name__ = ["haxe","rtti","Infos"];
haxe.rtti.XmlParser = $hxClasses["haxe.rtti.XmlParser"] = function() {
	this.root = new Array();
};
haxe.rtti.XmlParser.__name__ = ["haxe","rtti","XmlParser"];
haxe.rtti.XmlParser.prototype = {
	defplat: function() {
		var l = new List();
		if(this.curplatform != null) l.add(this.curplatform);
		return l;
	}
	,xtypeparams: function(x) {
		var p = new List();
		var $it0 = x.getElements();
		while( $it0.hasNext() ) {
			var c = $it0.next();
			p.add(this.xtype(c));
		}
		return p;
	}
	,xtype: function(x) {
		return (function($this) {
			var $r;
			switch(x.getName()) {
			case "unknown":
				$r = haxe.rtti.CType.CUnknown;
				break;
			case "e":
				$r = haxe.rtti.CType.CEnum($this.mkPath(x.att.resolve("path")),$this.xtypeparams(x));
				break;
			case "c":
				$r = haxe.rtti.CType.CClass($this.mkPath(x.att.resolve("path")),$this.xtypeparams(x));
				break;
			case "t":
				$r = haxe.rtti.CType.CTypedef($this.mkPath(x.att.resolve("path")),$this.xtypeparams(x));
				break;
			case "f":
				$r = (function($this) {
					var $r;
					var args = new List();
					var aname = x.att.resolve("a").split(":");
					var eargs = HxOverrides.iter(aname);
					var $it0 = x.getElements();
					while( $it0.hasNext() ) {
						var e = $it0.next();
						var opt = false;
						var a = eargs.next();
						if(a == null) a = "";
						if(a.charAt(0) == "?") {
							opt = true;
							a = HxOverrides.substr(a,1,null);
						}
						args.add({ name : a, opt : opt, t : $this.xtype(e)});
					}
					var ret = args.last();
					args.remove(ret);
					$r = haxe.rtti.CType.CFunction(args,ret.t);
					return $r;
				}($this));
				break;
			case "a":
				$r = (function($this) {
					var $r;
					var fields = new List();
					var $it1 = x.getElements();
					while( $it1.hasNext() ) {
						var f = $it1.next();
						fields.add({ name : f.getName(), t : $this.xtype(new haxe.xml.Fast(f.x.firstElement()))});
					}
					$r = haxe.rtti.CType.CAnonymous(fields);
					return $r;
				}($this));
				break;
			case "d":
				$r = (function($this) {
					var $r;
					var t = null;
					var tx = x.x.firstElement();
					if(tx != null) t = $this.xtype(new haxe.xml.Fast(tx));
					$r = haxe.rtti.CType.CDynamic(t);
					return $r;
				}($this));
				break;
			default:
				$r = $this.xerror(x);
			}
			return $r;
		}(this));
	}
	,xtypedef: function(x) {
		var doc = null;
		var t = null;
		var $it0 = x.getElements();
		while( $it0.hasNext() ) {
			var c = $it0.next();
			if(c.getName() == "haxe_doc") doc = c.getInnerData(); else if(c.getName() == "meta") {
			} else t = this.xtype(c);
		}
		var types = new Hash();
		if(this.curplatform != null) types.set(this.curplatform,t);
		return { path : this.mkPath(x.att.resolve("path")), module : x.has.resolve("module")?this.mkPath(x.att.resolve("module")):null, doc : doc, isPrivate : x.x.exists("private"), params : this.mkTypeParams(x.att.resolve("params")), type : t, types : types, platforms : this.defplat()};
	}
	,xenumfield: function(x) {
		var args = null;
		var xdoc = x.x.elementsNamed("haxe_doc").next();
		if(x.has.resolve("a")) {
			var names = x.att.resolve("a").split(":");
			var elts = x.getElements();
			args = new List();
			var _g = 0;
			while(_g < names.length) {
				var c = names[_g];
				++_g;
				var opt = false;
				if(c.charAt(0) == "?") {
					opt = true;
					c = HxOverrides.substr(c,1,null);
				}
				args.add({ name : c, opt : opt, t : this.xtype(elts.next())});
			}
		}
		return { name : x.getName(), args : args, doc : xdoc == null?null:new haxe.xml.Fast(xdoc).getInnerData(), platforms : this.defplat()};
	}
	,xenum: function(x) {
		var cl = new List();
		var doc = null;
		var $it0 = x.getElements();
		while( $it0.hasNext() ) {
			var c = $it0.next();
			if(c.getName() == "haxe_doc") doc = c.getInnerData(); else if(c.getName() == "meta") {
			} else cl.add(this.xenumfield(c));
		}
		return { path : this.mkPath(x.att.resolve("path")), module : x.has.resolve("module")?this.mkPath(x.att.resolve("module")):null, doc : doc, isPrivate : x.x.exists("private"), isExtern : x.x.exists("extern"), params : this.mkTypeParams(x.att.resolve("params")), constructors : cl, platforms : this.defplat()};
	}
	,xclassfield: function(x) {
		var e = x.getElements();
		var t = this.xtype(e.next());
		var doc = null;
		while( e.hasNext() ) {
			var c = e.next();
			switch(c.getName()) {
			case "haxe_doc":
				doc = c.getInnerData();
				break;
			case "meta":
				break;
			default:
				this.xerror(c);
			}
		}
		return { name : x.getName(), type : t, isPublic : x.x.exists("public"), isOverride : x.x.exists("override"), doc : doc, get : x.has.resolve("get")?this.mkRights(x.att.resolve("get")):haxe.rtti.Rights.RNormal, set : x.has.resolve("set")?this.mkRights(x.att.resolve("set")):haxe.rtti.Rights.RNormal, params : x.has.resolve("params")?this.mkTypeParams(x.att.resolve("params")):null, platforms : this.defplat()};
	}
	,xclass: function(x) {
		var csuper = null;
		var doc = null;
		var tdynamic = null;
		var interfaces = new List();
		var fields = new List();
		var statics = new List();
		var $it0 = x.getElements();
		while( $it0.hasNext() ) {
			var c = $it0.next();
			switch(c.getName()) {
			case "haxe_doc":
				doc = c.getInnerData();
				break;
			case "extends":
				csuper = this.xpath(c);
				break;
			case "implements":
				interfaces.add(this.xpath(c));
				break;
			case "haxe_dynamic":
				tdynamic = this.xtype(new haxe.xml.Fast(c.x.firstElement()));
				break;
			case "meta":
				break;
			default:
				if(c.x.exists("static")) statics.add(this.xclassfield(c)); else fields.add(this.xclassfield(c));
			}
		}
		return { path : this.mkPath(x.att.resolve("path")), module : x.has.resolve("module")?this.mkPath(x.att.resolve("module")):null, doc : doc, isPrivate : x.x.exists("private"), isExtern : x.x.exists("extern"), isInterface : x.x.exists("interface"), params : this.mkTypeParams(x.att.resolve("params")), superClass : csuper, interfaces : interfaces, fields : fields, statics : statics, tdynamic : tdynamic, platforms : this.defplat()};
	}
	,xpath: function(x) {
		var path = this.mkPath(x.att.resolve("path"));
		var params = new List();
		var $it0 = x.getElements();
		while( $it0.hasNext() ) {
			var c = $it0.next();
			params.add(this.xtype(c));
		}
		return { path : path, params : params};
	}
	,processElement: function(x) {
		var c = new haxe.xml.Fast(x);
		return (function($this) {
			var $r;
			switch(c.getName()) {
			case "class":
				$r = haxe.rtti.TypeTree.TClassdecl($this.xclass(c));
				break;
			case "enum":
				$r = haxe.rtti.TypeTree.TEnumdecl($this.xenum(c));
				break;
			case "typedef":
				$r = haxe.rtti.TypeTree.TTypedecl($this.xtypedef(c));
				break;
			default:
				$r = $this.xerror(c);
			}
			return $r;
		}(this));
	}
	,xroot: function(x) {
		var $it0 = x.x.elements();
		while( $it0.hasNext() ) {
			var c = $it0.next();
			this.merge(this.processElement(c));
		}
	}
	,xerror: function(c) {
		return (function($this) {
			var $r;
			throw "Invalid " + c.getName();
			return $r;
		}(this));
	}
	,mkRights: function(r) {
		return (function($this) {
			var $r;
			switch(r) {
			case "null":
				$r = haxe.rtti.Rights.RNo;
				break;
			case "method":
				$r = haxe.rtti.Rights.RMethod;
				break;
			case "dynamic":
				$r = haxe.rtti.Rights.RDynamic;
				break;
			case "inline":
				$r = haxe.rtti.Rights.RInline;
				break;
			default:
				$r = haxe.rtti.Rights.RCall(r);
			}
			return $r;
		}(this));
	}
	,mkTypeParams: function(p) {
		var pl = p.split(":");
		if(pl[0] == "") return new Array();
		return pl;
	}
	,mkPath: function(p) {
		return p;
	}
	,merge: function(t) {
		var inf = haxe.rtti.TypeApi.typeInfos(t);
		var pack = inf.path.split(".");
		var cur = this.root;
		var curpack = new Array();
		pack.pop();
		var _g = 0;
		while(_g < pack.length) {
			var p = pack[_g];
			++_g;
			var found = false;
			var _g1 = 0;
			try {
				while(_g1 < cur.length) {
					var pk = cur[_g1];
					++_g1;
					var $e = (pk);
					switch( $e[1] ) {
					case 0:
						var subs = $e[4], pname = $e[2];
						if(pname == p) {
							found = true;
							cur = subs;
							throw "__break__";
						}
						break;
					default:
					}
				}
			} catch( e ) { if( e != "__break__" ) throw e; }
			curpack.push(p);
			if(!found) {
				var pk = new Array();
				cur.push(haxe.rtti.TypeTree.TPackage(p,curpack.join("."),pk));
				cur = pk;
			}
		}
		var prev = null;
		var _g = 0;
		while(_g < cur.length) {
			var ct = cur[_g];
			++_g;
			var tinf;
			try {
				tinf = haxe.rtti.TypeApi.typeInfos(ct);
			} catch( e ) {
				continue;
			}
			if(tinf.path == inf.path) {
				var sameType = true;
				if(tinf.doc == null != (inf.doc == null)) {
					if(inf.doc == null) inf.doc = tinf.doc; else tinf.doc = inf.doc;
				}
				if(tinf.module == inf.module && tinf.doc == inf.doc && tinf.isPrivate == inf.isPrivate) {
					var $e = (ct);
					switch( $e[1] ) {
					case 1:
						var c = $e[2];
						var $e = (t);
						switch( $e[1] ) {
						case 1:
							var c2 = $e[2];
							if(this.mergeClasses(c,c2)) return;
							break;
						default:
							sameType = false;
						}
						break;
					case 2:
						var e = $e[2];
						var $e = (t);
						switch( $e[1] ) {
						case 2:
							var e2 = $e[2];
							if(this.mergeEnums(e,e2)) return;
							break;
						default:
							sameType = false;
						}
						break;
					case 3:
						var td = $e[2];
						var $e = (t);
						switch( $e[1] ) {
						case 3:
							var td2 = $e[2];
							if(this.mergeTypedefs(td,td2)) return;
							break;
						default:
						}
						break;
					case 0:
						sameType = false;
						break;
					}
				}
				var msg = tinf.module != inf.module?"module " + inf.module + " should be " + tinf.module:tinf.doc != inf.doc?"documentation is different":tinf.isPrivate != inf.isPrivate?"private flag is different":!sameType?"type kind is different":"could not merge definition";
				throw "Incompatibilities between " + tinf.path + " in " + tinf.platforms.join(",") + " and " + this.curplatform + " (" + msg + ")";
			}
		}
		cur.push(t);
	}
	,mergeTypedefs: function(t,t2) {
		if(this.curplatform == null) return false;
		t.platforms.add(this.curplatform);
		t.types.set(this.curplatform,t2.type);
		return true;
	}
	,mergeEnums: function(e,e2) {
		if(e.isExtern != e2.isExtern) return false;
		if(this.curplatform != null) e.platforms.add(this.curplatform);
		var $it0 = e2.constructors.iterator();
		while( $it0.hasNext() ) {
			var c2 = $it0.next();
			var found = null;
			var $it1 = e.constructors.iterator();
			while( $it1.hasNext() ) {
				var c = $it1.next();
				if(haxe.rtti.TypeApi.constructorEq(c,c2)) {
					found = c;
					break;
				}
			}
			if(found == null) return false;
			if(this.curplatform != null) found.platforms.add(this.curplatform);
		}
		return true;
	}
	,mergeClasses: function(c,c2) {
		if(c.isInterface != c2.isInterface) return false;
		if(this.curplatform != null) c.platforms.add(this.curplatform);
		if(c.isExtern != c2.isExtern) c.isExtern = false;
		var $it0 = c2.fields.iterator();
		while( $it0.hasNext() ) {
			var f2 = $it0.next();
			var found = null;
			var $it1 = c.fields.iterator();
			while( $it1.hasNext() ) {
				var f = $it1.next();
				if(this.mergeFields(f,f2)) {
					found = f;
					break;
				}
			}
			if(found == null) {
				this.newField(c,f2);
				c.fields.add(f2);
			} else if(this.curplatform != null) found.platforms.add(this.curplatform);
		}
		var $it2 = c2.statics.iterator();
		while( $it2.hasNext() ) {
			var f2 = $it2.next();
			var found = null;
			var $it3 = c.statics.iterator();
			while( $it3.hasNext() ) {
				var f = $it3.next();
				if(this.mergeFields(f,f2)) {
					found = f;
					break;
				}
			}
			if(found == null) {
				this.newField(c,f2);
				c.statics.add(f2);
			} else if(this.curplatform != null) found.platforms.add(this.curplatform);
		}
		return true;
	}
	,newField: function(c,f) {
	}
	,mergeFields: function(f,f2) {
		return haxe.rtti.TypeApi.fieldEq(f,f2) || f.name == f2.name && (this.mergeRights(f,f2) || this.mergeRights(f2,f)) && this.mergeDoc(f,f2) && haxe.rtti.TypeApi.fieldEq(f,f2);
	}
	,mergeDoc: function(f1,f2) {
		if(f1.doc == null) f2.doc = f2.doc; else if(f2.doc == null) f2.doc = f1.doc;
		return true;
	}
	,mergeRights: function(f1,f2) {
		if(f1.get == haxe.rtti.Rights.RInline && f1.set == haxe.rtti.Rights.RNo && f2.get == haxe.rtti.Rights.RNormal && f2.set == haxe.rtti.Rights.RMethod) {
			f1.get = haxe.rtti.Rights.RNormal;
			f1.set = haxe.rtti.Rights.RMethod;
			return true;
		}
		return false;
	}
	,process: function(x,platform) {
		this.curplatform = platform;
		this.xroot(new haxe.xml.Fast(x));
	}
	,sortFields: function(fl) {
		var a = Lambda.array(fl);
		a.sort(function(f1,f2) {
			var v1 = haxe.rtti.TypeApi.isVar(f1.type);
			var v2 = haxe.rtti.TypeApi.isVar(f2.type);
			if(v1 && !v2) return -1;
			if(v2 && !v1) return 1;
			if(f1.name == "new") return -1;
			if(f2.name == "new") return 1;
			if(f1.name > f2.name) return 1;
			return -1;
		});
		return Lambda.list(a);
	}
	,sort: function(l) {
		if(l == null) l = this.root;
		l.sort(function(e1,e2) {
			var n1 = (function($this) {
				var $r;
				var $e = (e1);
				switch( $e[1] ) {
				case 0:
					var p = $e[2];
					$r = " " + p;
					break;
				default:
					$r = haxe.rtti.TypeApi.typeInfos(e1).path;
				}
				return $r;
			}(this));
			var n2 = (function($this) {
				var $r;
				var $e = (e2);
				switch( $e[1] ) {
				case 0:
					var p = $e[2];
					$r = " " + p;
					break;
				default:
					$r = haxe.rtti.TypeApi.typeInfos(e2).path;
				}
				return $r;
			}(this));
			if(n1 > n2) return 1;
			return -1;
		});
		var _g = 0;
		while(_g < l.length) {
			var x = l[_g];
			++_g;
			var $e = (x);
			switch( $e[1] ) {
			case 0:
				var l1 = $e[4];
				this.sort(l1);
				break;
			case 1:
				var c = $e[2];
				c.fields = this.sortFields(c.fields);
				c.statics = this.sortFields(c.statics);
				break;
			case 2:
				var e = $e[2];
				break;
			case 3:
				break;
			}
		}
	}
	,curplatform: null
	,root: null
	,__class__: haxe.rtti.XmlParser
}
if(!haxe.xml) haxe.xml = {}
if(!haxe.xml._Fast) haxe.xml._Fast = {}
haxe.xml._Fast.NodeAccess = $hxClasses["haxe.xml._Fast.NodeAccess"] = function(x) {
	this.__x = x;
};
haxe.xml._Fast.NodeAccess.__name__ = ["haxe","xml","_Fast","NodeAccess"];
haxe.xml._Fast.NodeAccess.prototype = {
	resolve: function(name) {
		var x = this.__x.elementsNamed(name).next();
		if(x == null) {
			var xname = this.__x.nodeType == Xml.Document?"Document":this.__x.getNodeName();
			throw xname + " is missing element " + name;
		}
		return new haxe.xml.Fast(x);
	}
	,__x: null
	,__class__: haxe.xml._Fast.NodeAccess
}
haxe.xml._Fast.AttribAccess = $hxClasses["haxe.xml._Fast.AttribAccess"] = function(x) {
	this.__x = x;
};
haxe.xml._Fast.AttribAccess.__name__ = ["haxe","xml","_Fast","AttribAccess"];
haxe.xml._Fast.AttribAccess.prototype = {
	resolve: function(name) {
		if(this.__x.nodeType == Xml.Document) throw "Cannot access document attribute " + name;
		var v = this.__x.get(name);
		if(v == null) throw this.__x.getNodeName() + " is missing attribute " + name;
		return v;
	}
	,__x: null
	,__class__: haxe.xml._Fast.AttribAccess
}
haxe.xml._Fast.HasAttribAccess = $hxClasses["haxe.xml._Fast.HasAttribAccess"] = function(x) {
	this.__x = x;
};
haxe.xml._Fast.HasAttribAccess.__name__ = ["haxe","xml","_Fast","HasAttribAccess"];
haxe.xml._Fast.HasAttribAccess.prototype = {
	resolve: function(name) {
		if(this.__x.nodeType == Xml.Document) throw "Cannot access document attribute " + name;
		return this.__x.exists(name);
	}
	,__x: null
	,__class__: haxe.xml._Fast.HasAttribAccess
}
haxe.xml._Fast.HasNodeAccess = $hxClasses["haxe.xml._Fast.HasNodeAccess"] = function(x) {
	this.__x = x;
};
haxe.xml._Fast.HasNodeAccess.__name__ = ["haxe","xml","_Fast","HasNodeAccess"];
haxe.xml._Fast.HasNodeAccess.prototype = {
	resolve: function(name) {
		return this.__x.elementsNamed(name).hasNext();
	}
	,__x: null
	,__class__: haxe.xml._Fast.HasNodeAccess
}
haxe.xml._Fast.NodeListAccess = $hxClasses["haxe.xml._Fast.NodeListAccess"] = function(x) {
	this.__x = x;
};
haxe.xml._Fast.NodeListAccess.__name__ = ["haxe","xml","_Fast","NodeListAccess"];
haxe.xml._Fast.NodeListAccess.prototype = {
	resolve: function(name) {
		var l = new List();
		var $it0 = this.__x.elementsNamed(name);
		while( $it0.hasNext() ) {
			var x = $it0.next();
			l.add(new haxe.xml.Fast(x));
		}
		return l;
	}
	,__x: null
	,__class__: haxe.xml._Fast.NodeListAccess
}
haxe.xml.Fast = $hxClasses["haxe.xml.Fast"] = function(x) {
	if(x.nodeType != Xml.Document && x.nodeType != Xml.Element) throw "Invalid nodeType " + Std.string(x.nodeType);
	this.x = x;
	this.node = new haxe.xml._Fast.NodeAccess(x);
	this.nodes = new haxe.xml._Fast.NodeListAccess(x);
	this.att = new haxe.xml._Fast.AttribAccess(x);
	this.has = new haxe.xml._Fast.HasAttribAccess(x);
	this.hasNode = new haxe.xml._Fast.HasNodeAccess(x);
};
haxe.xml.Fast.__name__ = ["haxe","xml","Fast"];
haxe.xml.Fast.prototype = {
	getElements: function() {
		var it = this.x.elements();
		return { hasNext : $bind(it,it.hasNext), next : function() {
			var x = it.next();
			if(x == null) return null;
			return new haxe.xml.Fast(x);
		}};
	}
	,getInnerHTML: function() {
		var s = new StringBuf();
		var $it0 = this.x.iterator();
		while( $it0.hasNext() ) {
			var x = $it0.next();
			s.b += Std.string(x.toString());
		}
		return s.b;
	}
	,getInnerData: function() {
		var it = this.x.iterator();
		if(!it.hasNext()) throw this.getName() + " does not have data";
		var v = it.next();
		var n = it.next();
		if(n != null) {
			if(v.nodeType == Xml.PCData && n.nodeType == Xml.CData && StringTools.trim(v.getNodeValue()) == "") {
				var n2 = it.next();
				if(n2 == null || n2.nodeType == Xml.PCData && StringTools.trim(n2.getNodeValue()) == "" && it.next() == null) return n.getNodeValue();
			}
			throw this.getName() + " does not only have data";
		}
		if(v.nodeType != Xml.PCData && v.nodeType != Xml.CData) throw this.getName() + " does not have data";
		return v.getNodeValue();
	}
	,getName: function() {
		return this.x.nodeType == Xml.Document?"Document":this.x.getNodeName();
	}
	,elements: null
	,hasNode: null
	,has: null
	,att: null
	,nodes: null
	,node: null
	,innerHTML: null
	,innerData: null
	,name: null
	,x: null
	,__class__: haxe.xml.Fast
	,__properties__: {get_name:"getName",get_innerData:"getInnerData",get_innerHTML:"getInnerHTML",get_elements:"getElements"}
}
haxe.xml.Parser = $hxClasses["haxe.xml.Parser"] = function() { }
haxe.xml.Parser.__name__ = ["haxe","xml","Parser"];
haxe.xml.Parser.parse = function(str) {
	var doc = Xml.createDocument();
	haxe.xml.Parser.doParse(str,0,doc);
	return doc;
}
haxe.xml.Parser.doParse = function(str,p,parent) {
	if(p == null) p = 0;
	var xml = null;
	var state = 1;
	var next = 1;
	var aname = null;
	var start = 0;
	var nsubs = 0;
	var nbrackets = 0;
	var c = str.charCodeAt(p);
	while(!(c != c)) {
		switch(state) {
		case 0:
			switch(c) {
			case 10:case 13:case 9:case 32:
				break;
			default:
				state = next;
				continue;
			}
			break;
		case 1:
			switch(c) {
			case 60:
				state = 0;
				next = 2;
				break;
			default:
				start = p;
				state = 13;
				continue;
			}
			break;
		case 13:
			if(c == 60) {
				var child = Xml.createPCData(HxOverrides.substr(str,start,p - start));
				parent.addChild(child);
				nsubs++;
				state = 0;
				next = 2;
			}
			break;
		case 17:
			if(c == 93 && str.charCodeAt(p + 1) == 93 && str.charCodeAt(p + 2) == 62) {
				var child = Xml.createCData(HxOverrides.substr(str,start,p - start));
				parent.addChild(child);
				nsubs++;
				p += 2;
				state = 1;
			}
			break;
		case 2:
			switch(c) {
			case 33:
				if(str.charCodeAt(p + 1) == 91) {
					p += 2;
					if(HxOverrides.substr(str,p,6).toUpperCase() != "CDATA[") throw "Expected <![CDATA[";
					p += 5;
					state = 17;
					start = p + 1;
				} else if(str.charCodeAt(p + 1) == 68 || str.charCodeAt(p + 1) == 100) {
					if(HxOverrides.substr(str,p + 2,6).toUpperCase() != "OCTYPE") throw "Expected <!DOCTYPE";
					p += 8;
					state = 16;
					start = p + 1;
				} else if(str.charCodeAt(p + 1) != 45 || str.charCodeAt(p + 2) != 45) throw "Expected <!--"; else {
					p += 2;
					state = 15;
					start = p + 1;
				}
				break;
			case 63:
				state = 14;
				start = p;
				break;
			case 47:
				if(parent == null) throw "Expected node name";
				start = p + 1;
				state = 0;
				next = 10;
				break;
			default:
				state = 3;
				start = p;
				continue;
			}
			break;
		case 3:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				if(p == start) throw "Expected node name";
				xml = Xml.createElement(HxOverrides.substr(str,start,p - start));
				parent.addChild(xml);
				state = 0;
				next = 4;
				continue;
			}
			break;
		case 4:
			switch(c) {
			case 47:
				state = 11;
				nsubs++;
				break;
			case 62:
				state = 9;
				nsubs++;
				break;
			default:
				state = 5;
				start = p;
				continue;
			}
			break;
		case 5:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				var tmp;
				if(start == p) throw "Expected attribute name";
				tmp = HxOverrides.substr(str,start,p - start);
				aname = tmp;
				if(xml.exists(aname)) throw "Duplicate attribute";
				state = 0;
				next = 6;
				continue;
			}
			break;
		case 6:
			switch(c) {
			case 61:
				state = 0;
				next = 7;
				break;
			default:
				throw "Expected =";
			}
			break;
		case 7:
			switch(c) {
			case 34:case 39:
				state = 8;
				start = p;
				break;
			default:
				throw "Expected \"";
			}
			break;
		case 8:
			if(c == str.charCodeAt(start)) {
				var val = HxOverrides.substr(str,start + 1,p - start - 1);
				xml.set(aname,val);
				state = 0;
				next = 4;
			}
			break;
		case 9:
			p = haxe.xml.Parser.doParse(str,p,xml);
			start = p;
			state = 1;
			break;
		case 11:
			switch(c) {
			case 62:
				state = 1;
				break;
			default:
				throw "Expected >";
			}
			break;
		case 12:
			switch(c) {
			case 62:
				if(nsubs == 0) parent.addChild(Xml.createPCData(""));
				return p;
			default:
				throw "Expected >";
			}
			break;
		case 10:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				if(start == p) throw "Expected node name";
				var v = HxOverrides.substr(str,start,p - start);
				if(v != parent.getNodeName()) throw "Expected </" + parent.getNodeName() + ">";
				state = 0;
				next = 12;
				continue;
			}
			break;
		case 15:
			if(c == 45 && str.charCodeAt(p + 1) == 45 && str.charCodeAt(p + 2) == 62) {
				parent.addChild(Xml.createComment(HxOverrides.substr(str,start,p - start)));
				p += 2;
				state = 1;
			}
			break;
		case 16:
			if(c == 91) nbrackets++; else if(c == 93) nbrackets--; else if(c == 62 && nbrackets == 0) {
				parent.addChild(Xml.createDocType(HxOverrides.substr(str,start,p - start)));
				state = 1;
			}
			break;
		case 14:
			if(c == 63 && str.charCodeAt(p + 1) == 62) {
				p++;
				var str1 = HxOverrides.substr(str,start + 1,p - start - 2);
				parent.addChild(Xml.createProlog(str1));
				state = 1;
			}
			break;
		}
		c = str.charCodeAt(++p);
	}
	if(state == 1) {
		start = p;
		state = 13;
	}
	if(state == 13) {
		if(p != start || nsubs == 0) parent.addChild(Xml.createPCData(HxOverrides.substr(str,start,p - start)));
		return p;
	}
	throw "Unexpected end";
}
haxe.xml.Parser.isValidChar = function(c) {
	return c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45;
}
var js = js || {}
js.Boot = $hxClasses["js.Boot"] = function() { }
js.Boot.__name__ = ["js","Boot"];
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
js.Boot.__trace = function(v,i) {
	var msg = i != null?i.fileName + ":" + i.lineNumber + ": ":"";
	msg += js.Boot.__string_rec(v,"");
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if(typeof(console) != "undefined" && console.log != null) console.log(msg);
}
js.Boot.__clear_trace = function() {
	var d = document.getElementById("haxe:trace");
	if(d != null) d.innerHTML = "";
}
js.Boot.isClass = function(o) {
	return o.__name__;
}
js.Boot.isEnum = function(e) {
	return e.__ename__;
}
js.Boot.getClass = function(o) {
	return o.__class__;
}
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2, _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			var _g = 0;
			while(_g < l) {
				var i1 = _g++;
				str += (i1 > 0?",":"") + js.Boot.__string_rec(o[i1],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
}
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0, _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
}
js.Boot.__instanceof = function(o,cl) {
	try {
		if(o instanceof cl) {
			if(cl == Array) return o.__enum__ == null;
			return true;
		}
		if(js.Boot.__interfLoop(o.__class__,cl)) return true;
	} catch( e ) {
		if(cl == null) return false;
	}
	switch(cl) {
	case Int:
		return Math.ceil(o%2147483648.0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return o === true || o === false;
	case String:
		return typeof(o) == "string";
	case Dynamic:
		return true;
	default:
		if(o == null) return false;
		if(cl == Class && o.__name__ != null) return true; else null;
		if(cl == Enum && o.__ename__ != null) return true; else null;
		return o.__enum__ == cl;
	}
}
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
}
var ui = ui || {}
ui.AgentUi = $hxClasses["ui.AgentUi"] = function() { }
ui.AgentUi.__name__ = ["ui","AgentUi"];
ui.AgentUi.LOGGER = null;
ui.AgentUi.CONTENT = null;
ui.AgentUi.USER = null;
ui.AgentUi.SERIALIZER = null;
ui.AgentUi.PROTOCOL = null;
ui.AgentUi.main = function() {
	ui.AgentUi.LOGGER = new ui.log.Logga(ui.log.LogLevel.DEBUG);
	ui.AgentUi.CONTENT = new ui.observable.ObservableSet(ui.model.ModelObj.identifier);
	ui.AgentUi.PROTOCOL = new ui.api.ProtocolHandler();
	ui.AgentUi.SERIALIZER = new ui.serialization.Serializer();
}
ui.AgentUi.start = function() {
	new ui.jq.JQ("#middleContainer #content #tabs").tabs();
	new ui.jq.JQ("#sideRight #chat").tabs();
	new ui.widget.ConnectionsList("#connections").connectionsList({ });
	new ui.widget.LabelsList("#labelsList").labelsList();
	new ui.widget.FilterComp("#filter").filterComp(null);
	new ui.widget.ContentFeed("#feed").contentFeed({ content : ui.AgentUi.CONTENT});
	new ui.widget.UserComp("#userId").userComp();
	new ui.widget.PostComp("#postInput").postComp();
	ui.model.EventModel.addListener("filterComplete",new ui.model.EventListener(function(filter) {
		ui.model.EventModel.change("fitWindow");
	}));
	ui.model.EventModel.addListener("aliasLoaded",new ui.model.EventListener(function(alias) {
		ui.AgentUi.USER._setCurrentAlias(alias);
	}));
	ui.model.EventModel.addListener("fitWindow",new ui.model.EventListener(function(n) {
		fitWindow();
	}));
	new ui.jq.JQ("body").click(function(evt) {
		new ui.jq.JQ(".nonmodalPopup").hide();
	});
	ui.AgentUi.demo();
}
ui.AgentUi.demo = function() {
	ui.AgentUi.USER = ui.AgentUi.PROTOCOL.getUser("");
	ui.model.EventModel.change("user",ui.AgentUi.USER);
}
ui.CrossMojo = $hxClasses["ui.CrossMojo"] = function() { }
ui.CrossMojo.__name__ = ["ui","CrossMojo"];
ui.CrossMojo.jq = function(selector,arg2) {
	var v;
	if(arg2 == null) v = $(selector); else v = $(selector, arg2);
	return v;
}
ui.CrossMojo.windowConsole = function() {
	return window.console;
}
ui.CrossMojo.confirm = function() {
	return confirm;
}
if(!ui.api) ui.api = {}
ui.api.ProtocolHandler = $hxClasses["ui.api.ProtocolHandler"] = function() {
	var _g = this;
	ui.model.EventModel.addListener("runFilter",new ui.model.EventListener(function(filter) {
		_g.filter(filter);
	}));
	ui.model.EventModel.addListener("loadAlias",new ui.model.EventListener(function(uid) {
		var alias = _g.getAlias(uid);
		ui.model.EventModel.change("aliasLoaded",alias);
	}));
};
ui.api.ProtocolHandler.__name__ = ["ui","api","ProtocolHandler"];
ui.api.ProtocolHandler.prototype = {
	getLabels: function(user) {
		return ui.api.TestDao.getLabels(user);
	}
	,getConnections: function(user) {
		return ui.api.TestDao.getConnections(user);
	}
	,getAlias: function(uid) {
		return ui.api.TestDao.getAlias(uid);
	}
	,getUser: function(uid) {
		new ui.api.InitializeSessionRequest();
		return ui.api.TestDao.getUser(uid);
	}
	,filter: function(filter) {
		filter.rootNode.log();
		ui.AgentUi.CONTENT.clear();
		if(filter.rootNode.hasChildren()) {
			var string = filter.kdbxify();
			ui.AgentUi.LOGGER.debug("FILTER --> feed(  " + string + "  )");
			var content = ui.api.TestDao.getContent(filter.rootNode);
			ui.AgentUi.CONTENT.addAll(content);
			var evalRequest = new ui.api.EvalRequest();
			var evalRequestData = new ui.api.EvalRequestData();
			evalRequestData.expression = "feed( " + string + " )";
			evalRequestData.sessionUri = "agent-session://myLovelySession/1234,";
			evalRequest.contents = evalRequestData;
			new ui.api.LongPollingRequest(evalRequest).start();
		}
	}
	,currentFilter: null
	,__class__: ui.api.ProtocolHandler
}
ui.api.ProtocolMessage = $hxClasses["ui.api.ProtocolMessage"] = function() { }
ui.api.ProtocolMessage.__name__ = ["ui","api","ProtocolMessage"];
ui.api.ProtocolMessage.__interfaces__ = [haxe.rtti.Infos];
ui.api.ProtocolMessage.prototype = {
	getContents: function() {
		return this.contents;
	}
	,toJsonString: function() {
		return ui.AgentUi.SERIALIZER.toJsonString(this);
	}
	,contents: null
	,msgType: null
	,__class__: ui.api.ProtocolMessage
}
ui.api.Payload = $hxClasses["ui.api.Payload"] = function() { }
ui.api.Payload.__name__ = ["ui","api","Payload"];
ui.api.Payload.__interfaces__ = [haxe.rtti.Infos];
ui.api.InitializeSessionRequest = $hxClasses["ui.api.InitializeSessionRequest"] = function() {
	this.msgType = ui.api.MsgType.initializeSessionRequest;
};
ui.api.InitializeSessionRequest.__name__ = ["ui","api","InitializeSessionRequest"];
ui.api.InitializeSessionRequest.__super__ = ui.api.ProtocolMessage;
ui.api.InitializeSessionRequest.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	__class__: ui.api.InitializeSessionRequest
});
ui.api.InitializeSessionRequestData = $hxClasses["ui.api.InitializeSessionRequestData"] = function() { }
ui.api.InitializeSessionRequestData.__name__ = ["ui","api","InitializeSessionRequestData"];
ui.api.InitializeSessionRequestData.__interfaces__ = [ui.api.Payload];
ui.api.InitializeSessionRequestData.prototype = {
	agentIdentifier: null
	,userCredentials: null
	,__class__: ui.api.InitializeSessionRequestData
}
ui.api.InitializeSessionResponse = $hxClasses["ui.api.InitializeSessionResponse"] = function() {
	this.msgType = ui.api.MsgType.initializeSessionResponse;
};
ui.api.InitializeSessionResponse.__name__ = ["ui","api","InitializeSessionResponse"];
ui.api.InitializeSessionResponse.__super__ = ui.api.ProtocolMessage;
ui.api.InitializeSessionResponse.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	__class__: ui.api.InitializeSessionResponse
});
ui.api.InitializeSessionResponseData = $hxClasses["ui.api.InitializeSessionResponseData"] = function() { }
ui.api.InitializeSessionResponseData.__name__ = ["ui","api","InitializeSessionResponseData"];
ui.api.InitializeSessionResponseData.__interfaces__ = [ui.api.Payload];
ui.api.InitializeSessionResponseData.prototype = {
	userToken: null
	,sessionIdentifier: null
	,lastActiveFilter: null
	,connections: null
	,labels: null
	,defaultAlias: null
	,aliases: null
	,__class__: ui.api.InitializeSessionResponseData
}
ui.api.CloseSessionRequest = $hxClasses["ui.api.CloseSessionRequest"] = function() {
	this.msgType = ui.api.MsgType.closeSessionRequest;
};
ui.api.CloseSessionRequest.__name__ = ["ui","api","CloseSessionRequest"];
ui.api.CloseSessionRequest.__super__ = ui.api.ProtocolMessage;
ui.api.CloseSessionRequest.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	__class__: ui.api.CloseSessionRequest
});
ui.api.CloseSessionRequestData = $hxClasses["ui.api.CloseSessionRequestData"] = function() { }
ui.api.CloseSessionRequestData.__name__ = ["ui","api","CloseSessionRequestData"];
ui.api.CloseSessionRequestData.__interfaces__ = [ui.api.Payload];
ui.api.CloseSessionRequestData.prototype = {
	reason: null
	,userToken: null
	,sessionIdentifier: null
	,__class__: ui.api.CloseSessionRequestData
}
ui.api.CloseSessionResponse = $hxClasses["ui.api.CloseSessionResponse"] = function() {
	this.msgType = ui.api.MsgType.closeSessionResponse;
};
ui.api.CloseSessionResponse.__name__ = ["ui","api","CloseSessionResponse"];
ui.api.CloseSessionResponse.__super__ = ui.api.ProtocolMessage;
ui.api.CloseSessionResponse.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	__class__: ui.api.CloseSessionResponse
});
ui.api.CloseSessionResponseData = $hxClasses["ui.api.CloseSessionResponseData"] = function() { }
ui.api.CloseSessionResponseData.__name__ = ["ui","api","CloseSessionResponseData"];
ui.api.CloseSessionResponseData.__interfaces__ = [ui.api.Payload];
ui.api.CloseSessionResponseData.prototype = {
	userToken: null
	,sessionIdentifier: null
	,__class__: ui.api.CloseSessionResponseData
}
ui.api.EvalRequest = $hxClasses["ui.api.EvalRequest"] = function() {
	this.msgType = ui.api.MsgType.evalRequest;
};
ui.api.EvalRequest.__name__ = ["ui","api","EvalRequest"];
ui.api.EvalRequest.__super__ = ui.api.ProtocolMessage;
ui.api.EvalRequest.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	__class__: ui.api.EvalRequest
});
ui.api.EvalRequestData = $hxClasses["ui.api.EvalRequestData"] = function() {
};
ui.api.EvalRequestData.__name__ = ["ui","api","EvalRequestData"];
ui.api.EvalRequestData.__interfaces__ = [ui.api.Payload];
ui.api.EvalRequestData.prototype = {
	sessionUri: null
	,expression: null
	,__class__: ui.api.EvalRequestData
}
ui.api.EvalResponse = $hxClasses["ui.api.EvalResponse"] = function() {
	this.msgType = ui.api.MsgType.evalResponse;
};
ui.api.EvalResponse.__name__ = ["ui","api","EvalResponse"];
ui.api.EvalResponse.__super__ = ui.api.ProtocolMessage;
ui.api.EvalResponse.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	__class__: ui.api.EvalResponse
});
ui.api.EvalComplete = $hxClasses["ui.api.EvalComplete"] = function() {
	this.msgType = ui.api.MsgType.evalComplete;
};
ui.api.EvalComplete.__name__ = ["ui","api","EvalComplete"];
ui.api.EvalComplete.__super__ = ui.api.ProtocolMessage;
ui.api.EvalComplete.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	__class__: ui.api.EvalComplete
});
ui.api.EvalResponseData = $hxClasses["ui.api.EvalResponseData"] = function() { }
ui.api.EvalResponseData.__name__ = ["ui","api","EvalResponseData"];
ui.api.EvalResponseData.__interfaces__ = [ui.api.Payload];
ui.api.EvalResponseData.prototype = {
	userToken: null
	,sessionIdentifier: null
	,subsessionIdentifier: null
	,posts: null
	,__class__: ui.api.EvalResponseData
}
ui.api.EvalError = $hxClasses["ui.api.EvalError"] = function() {
	this.msgType = ui.api.MsgType.evalError;
};
ui.api.EvalError.__name__ = ["ui","api","EvalError"];
ui.api.EvalError.__super__ = ui.api.ProtocolMessage;
ui.api.EvalError.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	__class__: ui.api.EvalError
});
ui.api.EvalErrorData = $hxClasses["ui.api.EvalErrorData"] = function() { }
ui.api.EvalErrorData.__name__ = ["ui","api","EvalErrorData"];
ui.api.EvalErrorData.__interfaces__ = [ui.api.Payload];
ui.api.EvalErrorData.prototype = {
	userToken: null
	,sessionIdentifier: null
	,subsessionIdentifier: null
	,errorMsg: null
	,__class__: ui.api.EvalErrorData
}
ui.api.StopEvalRequest = $hxClasses["ui.api.StopEvalRequest"] = function() {
	this.msgType = ui.api.MsgType.stopEvalRequest;
};
ui.api.StopEvalRequest.__name__ = ["ui","api","StopEvalRequest"];
ui.api.StopEvalRequest.__super__ = ui.api.ProtocolMessage;
ui.api.StopEvalRequest.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	__class__: ui.api.StopEvalRequest
});
ui.api.StopEvalResponse = $hxClasses["ui.api.StopEvalResponse"] = function() {
	this.msgType = ui.api.MsgType.stopEvalResponse;
};
ui.api.StopEvalResponse.__name__ = ["ui","api","StopEvalResponse"];
ui.api.StopEvalResponse.__super__ = ui.api.ProtocolMessage;
ui.api.StopEvalResponse.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	__class__: ui.api.StopEvalResponse
});
ui.api.StopMsgData = $hxClasses["ui.api.StopMsgData"] = function() { }
ui.api.StopMsgData.__name__ = ["ui","api","StopMsgData"];
ui.api.StopMsgData.__interfaces__ = [ui.api.Payload];
ui.api.StopMsgData.prototype = {
	userToken: null
	,sessionIdentifier: null
	,subsessionIdentifier: null
	,__class__: ui.api.StopMsgData
}
ui.api.MsgType = $hxClasses["ui.api.MsgType"] = { __ename__ : ["ui","api","MsgType"], __constructs__ : ["initializeSessionRequest","initializeSessionResponse","closeSessionRequest","closeSessionResponse","evalRequest","evalResponse","evalComplete","evalError","stopEvalRequest","stopEvalResponse"] }
ui.api.MsgType.initializeSessionRequest = ["initializeSessionRequest",0];
ui.api.MsgType.initializeSessionRequest.toString = $estr;
ui.api.MsgType.initializeSessionRequest.__enum__ = ui.api.MsgType;
ui.api.MsgType.initializeSessionResponse = ["initializeSessionResponse",1];
ui.api.MsgType.initializeSessionResponse.toString = $estr;
ui.api.MsgType.initializeSessionResponse.__enum__ = ui.api.MsgType;
ui.api.MsgType.closeSessionRequest = ["closeSessionRequest",2];
ui.api.MsgType.closeSessionRequest.toString = $estr;
ui.api.MsgType.closeSessionRequest.__enum__ = ui.api.MsgType;
ui.api.MsgType.closeSessionResponse = ["closeSessionResponse",3];
ui.api.MsgType.closeSessionResponse.toString = $estr;
ui.api.MsgType.closeSessionResponse.__enum__ = ui.api.MsgType;
ui.api.MsgType.evalRequest = ["evalRequest",4];
ui.api.MsgType.evalRequest.toString = $estr;
ui.api.MsgType.evalRequest.__enum__ = ui.api.MsgType;
ui.api.MsgType.evalResponse = ["evalResponse",5];
ui.api.MsgType.evalResponse.toString = $estr;
ui.api.MsgType.evalResponse.__enum__ = ui.api.MsgType;
ui.api.MsgType.evalComplete = ["evalComplete",6];
ui.api.MsgType.evalComplete.toString = $estr;
ui.api.MsgType.evalComplete.__enum__ = ui.api.MsgType;
ui.api.MsgType.evalError = ["evalError",7];
ui.api.MsgType.evalError.toString = $estr;
ui.api.MsgType.evalError.__enum__ = ui.api.MsgType;
ui.api.MsgType.stopEvalRequest = ["stopEvalRequest",8];
ui.api.MsgType.stopEvalRequest.toString = $estr;
ui.api.MsgType.stopEvalRequest.__enum__ = ui.api.MsgType;
ui.api.MsgType.stopEvalResponse = ["stopEvalResponse",9];
ui.api.MsgType.stopEvalResponse.toString = $estr;
ui.api.MsgType.stopEvalResponse.__enum__ = ui.api.MsgType;
ui.api.Requester = $hxClasses["ui.api.Requester"] = function() { }
ui.api.Requester.__name__ = ["ui","api","Requester"];
ui.api.Requester.prototype = {
	abort: null
	,start: null
	,__class__: ui.api.Requester
}
ui.api.LongPollingRequest = $hxClasses["ui.api.LongPollingRequest"] = function(request) {
	this.stop = false;
	var _g = this;
	this.request = request;
	ui.model.EventModel.addListener("runFilter",new ui.model.EventListener(function(filter) {
		_g.abort();
	}));
};
ui.api.LongPollingRequest.__name__ = ["ui","api","LongPollingRequest"];
ui.api.LongPollingRequest.__interfaces__ = [ui.api.Requester];
ui.api.LongPollingRequest.prototype = {
	poll: function() {
		var _g = this;
		if(!this.stop) this.jqXHR = ui.jq.JQ.ajax({ url : "http://64.27.3.17:9876/", crossDomain : true, dataType : "json", data : this.request.toJsonString(), type : "POST", success : function(data,textStatus,jqXHR) {
			if(!_g.stop) {
			}
		}, complete : function(arg) {
		}, timeout : 30000});
	}
	,abort: function() {
		this.stop = true;
		if(this.jqXHR != null) try {
			this.jqXHR.abort();
			this.jqXHR = null;
		} catch( err ) {
		}
	}
	,start: function() {
		this.poll();
	}
	,stop: null
	,request: null
	,jqXHR: null
	,__class__: ui.api.LongPollingRequest
}
ui.api.TestDao = $hxClasses["ui.api.TestDao"] = function() { }
ui.api.TestDao.__name__ = ["ui","api","TestDao"];
ui.api.TestDao.connections = null;
ui.api.TestDao.labels = null;
ui.api.TestDao.aliases = null;
ui.api.TestDao.buildConnections = function() {
	ui.api.TestDao.connections = new Array();
	var george = new ui.model.Connection("George","Costanza","media/test/george.jpg");
	george.uid = ui.util.UidGenerator.create();
	ui.api.TestDao.connections.push(george);
	var elaine = new ui.model.Connection("Elaine","Benes","media/test/elaine.jpg");
	elaine.uid = ui.util.UidGenerator.create();
	ui.api.TestDao.connections.push(elaine);
	var kramer = new ui.model.Connection("Cosmo","Kramer","media/test/kramer.jpg");
	kramer.uid = ui.util.UidGenerator.create();
	ui.api.TestDao.connections.push(kramer);
	var toms = new ui.model.Connection("Tom's","Restaurant","media/test/toms.jpg");
	toms.uid = ui.util.UidGenerator.create();
	ui.api.TestDao.connections.push(toms);
	var newman = new ui.model.Connection("Newman","","media/test/newman.jpg");
	newman.uid = ui.util.UidGenerator.create();
	ui.api.TestDao.connections.push(newman);
}
ui.api.TestDao.buildLabels = function() {
	ui.api.TestDao.labels = new Array();
	var locations = new ui.model.Label("Locations");
	locations.uid = ui.util.UidGenerator.create();
	ui.api.TestDao.labels.push(locations);
	var home = new ui.model.Label("Home");
	home.uid = ui.util.UidGenerator.create();
	home.parentUid = locations.uid;
	ui.api.TestDao.labels.push(home);
	var city = new ui.model.Label("City");
	city.uid = ui.util.UidGenerator.create();
	city.parentUid = locations.uid;
	ui.api.TestDao.labels.push(city);
	var media = new ui.model.Label("Media");
	media.uid = ui.util.UidGenerator.create();
	ui.api.TestDao.labels.push(media);
	var personal = new ui.model.Label("Personal");
	personal.uid = ui.util.UidGenerator.create();
	personal.parentUid = media.uid;
	ui.api.TestDao.labels.push(personal);
	var work = new ui.model.Label("Work");
	work.uid = ui.util.UidGenerator.create();
	work.parentUid = media.uid;
	ui.api.TestDao.labels.push(work);
	var interests = new ui.model.Label("Interests");
	interests.uid = ui.util.UidGenerator.create();
	ui.api.TestDao.labels.push(interests);
}
ui.api.TestDao.buildAliases = function() {
	ui.api.TestDao.aliases = new Array();
	var alias = new ui.model.Alias();
	alias.uid = ui.util.UidGenerator.create();
	alias.label = "Comedian";
	alias.imgSrc = "media/test/jerry_comedy.jpg";
	ui.api.TestDao.aliases.push(alias);
	alias = new ui.model.Alias();
	alias.uid = ui.util.UidGenerator.create();
	alias.label = "Actor";
	alias.imgSrc = "media/test/jerry_bee.jpg";
	ui.api.TestDao.aliases.push(alias);
	alias = new ui.model.Alias();
	alias.uid = ui.util.UidGenerator.create();
	alias.label = "Private";
	ui.api.TestDao.aliases.push(alias);
}
ui.api.TestDao.generateContent = function(node) {
	var availableConnections = ui.api.TestDao.getConnectionsFromNode(node);
	var availableLabels = ui.api.TestDao.getLabelsFromNode(node);
	var content = new Array();
	var audioContent = new ui.model.AudioContent();
	audioContent.uid = ui.util.UidGenerator.create();
	audioContent.type = "AUDIO";
	audioContent.audioSrc = "media/test/hello_newman.mp3";
	audioContent.audioType = "audio/mpeg";
	audioContent.connections = new ui.observable.ObservableSet(ui.model.ModelObj.identifier);
	audioContent.labels = new ui.observable.ObservableSet(ui.model.ModelObj.identifier);
	if(ui.helper.ArrayHelper.hasValues(availableConnections)) ui.api.TestDao.addConnections(availableConnections,audioContent,2);
	if(ui.helper.ArrayHelper.hasValues(availableLabels)) ui.api.TestDao.addLabels(availableLabels,audioContent,2);
	audioContent.title = "Hello Newman Compilation";
	content.push(audioContent);
	var img = new ui.model.ImageContent();
	img.uid = ui.util.UidGenerator.create();
	img.type = "IMAGE";
	img.imgSrc = "media/test/soupkitchen.jpg";
	img.caption = "Soup Kitchen";
	img.connections = new ui.observable.ObservableSet(ui.model.ModelObj.identifier);
	img.labels = new ui.observable.ObservableSet(ui.model.ModelObj.identifier);
	if(ui.helper.ArrayHelper.hasValues(availableConnections)) ui.api.TestDao.addConnections(availableConnections,img,1);
	if(ui.helper.ArrayHelper.hasValues(availableLabels)) ui.api.TestDao.addLabels(availableLabels,img,2);
	content.push(img);
	img = new ui.model.ImageContent();
	img.uid = ui.util.UidGenerator.create();
	img.type = "IMAGE";
	img.imgSrc = "media/test/apt.jpg";
	img.caption = "Apartment";
	img.connections = new ui.observable.ObservableSet(ui.model.ModelObj.identifier);
	img.labels = new ui.observable.ObservableSet(ui.model.ModelObj.identifier);
	if(ui.helper.ArrayHelper.hasValues(availableConnections)) ui.api.TestDao.addConnections(availableConnections,img,1);
	if(ui.helper.ArrayHelper.hasValues(availableLabels)) ui.api.TestDao.addLabels(availableLabels,img,1);
	content.push(img);
	img = new ui.model.ImageContent();
	img.uid = ui.util.UidGenerator.create();
	img.type = "IMAGE";
	img.imgSrc = "media/test/jrmint.jpg";
	img.caption = "The Junior Mint!";
	img.connections = new ui.observable.ObservableSet(ui.model.ModelObj.identifier);
	img.labels = new ui.observable.ObservableSet(ui.model.ModelObj.identifier);
	if(ui.helper.ArrayHelper.hasValues(availableConnections)) ui.api.TestDao.addConnections(availableConnections,img,3);
	if(ui.helper.ArrayHelper.hasValues(availableLabels)) ui.api.TestDao.addLabels(availableLabels,img,2);
	content.push(img);
	img = new ui.model.ImageContent();
	img.uid = ui.util.UidGenerator.create();
	img.type = "IMAGE";
	img.imgSrc = "media/test/oldschool.jpg";
	img.caption = "Retro";
	img.connections = new ui.observable.ObservableSet(ui.model.ModelObj.identifier);
	img.labels = new ui.observable.ObservableSet(ui.model.ModelObj.identifier);
	if(ui.helper.ArrayHelper.hasValues(availableConnections)) ui.api.TestDao.addConnections(availableConnections,img,3);
	if(ui.helper.ArrayHelper.hasValues(availableLabels)) ui.api.TestDao.addLabels(availableLabels,img,1);
	content.push(img);
	img = new ui.model.ImageContent();
	img.uid = ui.util.UidGenerator.create();
	img.type = "IMAGE";
	img.imgSrc = "media/test/mailman.jpg";
	img.caption = "Jerry Delivering the mail";
	img.connections = new ui.observable.ObservableSet(ui.model.ModelObj.identifier);
	img.labels = new ui.observable.ObservableSet(ui.model.ModelObj.identifier);
	if(ui.helper.ArrayHelper.hasValues(availableConnections)) ui.api.TestDao.addConnections(availableConnections,img,1);
	if(ui.helper.ArrayHelper.hasValues(availableLabels)) ui.api.TestDao.addLabels(availableLabels,img,1);
	content.push(img);
	img = new ui.model.ImageContent();
	img.uid = ui.util.UidGenerator.create();
	img.type = "IMAGE";
	img.imgSrc = "media/test/closet.jpg";
	img.caption = "Stuck in the closet!";
	img.connections = new ui.observable.ObservableSet(ui.model.ModelObj.identifier);
	img.labels = new ui.observable.ObservableSet(ui.model.ModelObj.identifier);
	if(ui.helper.ArrayHelper.hasValues(availableConnections)) ui.api.TestDao.addConnections(availableConnections,img,1);
	if(ui.helper.ArrayHelper.hasValues(availableLabels)) ui.api.TestDao.addLabels(availableLabels,img,2);
	content.push(img);
	return content;
}
ui.api.TestDao.addConnections = function(availableConnections,content,numToAdd) {
	if(ui.helper.ArrayHelper.hasValues(availableConnections)) {
		if(numToAdd == 1) ui.api.TestDao.addOne(availableConnections,content.connections); else if(numToAdd == 2) ui.api.TestDao.addTwo(availableConnections,content.connections); else ui.api.TestDao.addAll(availableConnections,content.connections);
	}
}
ui.api.TestDao.addLabels = function(availableConnections,content,numToAdd) {
	if(ui.helper.ArrayHelper.hasValues(availableConnections)) {
		if(numToAdd == 1) ui.api.TestDao.addOne(availableConnections,content.labels); else if(numToAdd == 2) ui.api.TestDao.addTwo(availableConnections,content.labels); else ui.api.TestDao.addAll(availableConnections,content.labels);
	}
}
ui.api.TestDao.addOne = function(available,arr) {
	arr.add(ui.api.TestDao.getRandomFromArray(available));
}
ui.api.TestDao.addTwo = function(available,arr) {
	if(available.length == 1) arr.add(ui.api.TestDao.getRandomFromArray(available)); else {
		arr.add(ui.api.TestDao.getRandomFromArray(available));
		arr.add(ui.api.TestDao.getRandomFromArray(available));
	}
}
ui.api.TestDao.addAll = function(available,arr) {
	var _g1 = 0, _g = available.length;
	while(_g1 < _g) {
		var t_ = _g1++;
		arr.add(available[t_]);
	}
}
ui.api.TestDao.getRandomFromArray = function(arr) {
	var t = null;
	if(ui.helper.ArrayHelper.hasValues(arr)) t = arr[Std.random(arr.length)];
	return t;
}
ui.api.TestDao.getConnectionsFromNode = function(node) {
	var connections = new Array();
	if(js.Boot.__instanceof(node,ui.model.ContentNode)) {
		if((js.Boot.__cast(node , ui.model.ContentNode)).type == "CONNECTION") connections.push(js.Boot.__cast((js.Boot.__cast(node , ui.model.ContentNode)).filterable , ui.model.Connection));
	} else {
		var _g1 = 0, _g = node.nodes.length;
		while(_g1 < _g) {
			var n_ = _g1++;
			var childNode = node.nodes[n_];
			if(js.Boot.__instanceof(childNode,ui.model.ContentNode) && (js.Boot.__cast(childNode , ui.model.ContentNode)).type == "CONNECTION") connections.push(js.Boot.__cast((js.Boot.__cast(childNode , ui.model.ContentNode)).filterable , ui.model.Connection)); else if(ui.helper.ArrayHelper.hasValues(childNode.nodes)) {
				var _g3 = 0, _g2 = childNode.nodes.length;
				while(_g3 < _g2) {
					var nn_ = _g3++;
					var grandChild = childNode.nodes[nn_];
					connections = connections.concat(ui.api.TestDao.getConnectionsFromNode(grandChild));
				}
			}
		}
	}
	return connections;
}
ui.api.TestDao.getLabelsFromNode = function(node) {
	var labels = new Array();
	if(js.Boot.__instanceof(node,ui.model.ContentNode)) {
		if((js.Boot.__cast(node , ui.model.ContentNode)).type == "LABEL") labels.push(js.Boot.__cast((js.Boot.__cast(node , ui.model.ContentNode)).filterable , ui.model.Label));
	} else {
		var _g1 = 0, _g = node.nodes.length;
		while(_g1 < _g) {
			var n_ = _g1++;
			var childNode = node.nodes[n_];
			if(js.Boot.__instanceof(childNode,ui.model.ContentNode) && (js.Boot.__cast(childNode , ui.model.ContentNode)).type == "LABEL") labels.push(js.Boot.__cast((js.Boot.__cast(childNode , ui.model.ContentNode)).filterable , ui.model.Label)); else if(ui.helper.ArrayHelper.hasValues(childNode.nodes)) {
				var _g3 = 0, _g2 = childNode.nodes.length;
				while(_g3 < _g2) {
					var nn_ = _g3++;
					var grandChild = childNode.nodes[nn_];
					labels = labels.concat(ui.api.TestDao.getLabelsFromNode(grandChild));
				}
			}
		}
	}
	return labels;
}
ui.api.TestDao.randomizeOrder = function(arr) {
	var newArr = new Array();
	do {
		var randomIndex = Std.random(arr.length);
		newArr.push(arr[randomIndex]);
		arr.splice(randomIndex,1);
	} while(arr.length > 0);
	return newArr;
}
ui.api.TestDao.getRandomNumber = function(arr,amount) {
	ui.AgentUi.LOGGER.debug("return " + amount);
	var newArr = new Array();
	do {
		var randomIndex = Std.random(arr.length);
		newArr.push(arr[randomIndex]);
		arr.splice(randomIndex,1);
	} while(newArr.length < amount);
	return newArr;
}
ui.api.TestDao.initialize = function() {
	ui.api.TestDao.initialized = true;
	ui.api.TestDao.buildConnections();
	ui.api.TestDao.buildLabels();
	ui.api.TestDao.buildAliases();
}
ui.api.TestDao.getConnections = function(user) {
	if(!ui.api.TestDao.initialized) ui.api.TestDao.initialize();
	return ui.api.TestDao.connections;
}
ui.api.TestDao.getLabels = function(user) {
	if(!ui.api.TestDao.initialized) ui.api.TestDao.initialize();
	return ui.api.TestDao.labels;
}
ui.api.TestDao.getContent = function(node) {
	if(!ui.api.TestDao.initialized) ui.api.TestDao.initialize();
	var arr = ui.api.TestDao.randomizeOrder(ui.api.TestDao.generateContent(node));
	return ui.api.TestDao.getRandomNumber(arr,Std.random(arr.length));
}
ui.api.TestDao.getUser = function(uid) {
	if(!ui.api.TestDao.initialized) ui.api.TestDao.initialize();
	var user = new ui.model.User();
	user.fname = "Jerry";
	user.lname = "Seinfeld";
	user.uid = ui.util.UidGenerator.create();
	user.imgSrc = "media/test/jerry_default.jpg";
	user.aliases = new ui.observable.ObservableSet(ui.model.ModelObj.identifier);
	user.aliases.addAll(ui.api.TestDao.aliases);
	var alias = ui.api.TestDao.aliases[0];
	alias.connections = new ui.observable.ObservableSet(ui.model.ModelObj.identifier);
	alias.connections.addAll(ui.api.TestDao.connections);
	alias.labels = new ui.observable.ObservableSet(ui.model.ModelObj.identifier);
	alias.labels.addAll(ui.api.TestDao.labels);
	user._setCurrentAlias(alias);
	return user;
}
ui.api.TestDao.getAlias = function(uid) {
	if(!ui.api.TestDao.initialized) ui.api.TestDao.initialize();
	var alias = ui.helper.ArrayHelper.getElementComplex(ui.api.TestDao.aliases,uid,"uid");
	alias.connections = new ui.observable.ObservableSet(ui.model.ModelObj.identifier);
	alias.connections.addAll(ui.api.TestDao.connections);
	alias.labels = new ui.observable.ObservableSet(ui.model.ModelObj.identifier);
	alias.labels.addAll(ui.api.TestDao.labels);
	return alias;
}
if(!ui.exception) ui.exception = {}
ui.exception.Exception = $hxClasses["ui.exception.Exception"] = function(message,cause) {
	this.message = message;
	this.cause = cause;
	this.callStack = haxe.Stack.callStack();
};
ui.exception.Exception.__name__ = ["ui","exception","Exception"];
ui.exception.Exception.prototype = {
	messageList: function() {
		return Lambda.map(this.chain(),function(e) {
			return e.message;
		});
	}
	,stackTrace: function() {
		var l = new Array();
		var index = 0;
		var _g = 0, _g1 = this.chain();
		while(_g < _g1.length) {
			var e = _g1[_g];
			++_g;
			if(index++ > 0) l.push("CAUSED BY: " + e.message); else l.push("ERROR: " + e.message);
			var _g2 = 0, _g3 = e.callStack;
			while(_g2 < _g3.length) {
				var s = _g3[_g2];
				++_g2;
				l.push("  " + Std.string(s));
			}
		}
		return l.join("\n");
	}
	,chain: function() {
		var chain = [];
		var gather = (function($this) {
			var $r;
			var gather1 = null;
			gather1 = function(e) {
				if(e != null) {
					chain.push(e);
					gather1(e.cause);
				}
			};
			$r = gather1;
			return $r;
		}(this));
		gather(this);
		return chain;
	}
	,rootCause: function() {
		var ch = this.chain();
		return ch[ch.length - 1];
	}
	,message: null
	,cause: null
	,callStack: null
	,__class__: ui.exception.Exception
}
if(!ui.helper) ui.helper = {}
ui.helper.ArrayHelper = $hxClasses["ui.helper.ArrayHelper"] = function() { }
ui.helper.ArrayHelper.__name__ = ["ui","helper","ArrayHelper"];
ui.helper.ArrayHelper.indexOf = function(array,t) {
	if(array == null) return -1;
	var index = -1;
	var _g1 = 0, _g = array.length;
	while(_g1 < _g) {
		var i_ = _g1++;
		if(array[i_] == t) {
			index = i_;
			break;
		}
	}
	return index;
}
ui.helper.ArrayHelper.indexOfComplex = function(array,value,propOrFcn,startingIndex) {
	if(startingIndex == null) startingIndex = 0;
	if(array == null) return -1;
	var result = -1;
	if(array != null && array.length > 0) {
		var _g1 = startingIndex, _g = array.length;
		while(_g1 < _g) {
			var idx_ = _g1++;
			var comparisonValue;
			if(js.Boot.__instanceof(propOrFcn,String)) comparisonValue = Reflect.field(array[idx_],propOrFcn); else comparisonValue = propOrFcn(array[idx_]);
			if(value == comparisonValue) {
				result = idx_;
				break;
			}
		}
	}
	return result;
}
ui.helper.ArrayHelper.indexOfComplexInSubArray = function(array,value,subArrayProp,startingIndex) {
	if(startingIndex == null) startingIndex = 0;
	if(array == null) return -1;
	var result = -1;
	var _g1 = startingIndex, _g = array.length;
	while(_g1 < _g) {
		var idx_ = _g1++;
		var subArray = Reflect.field(array[idx_],subArrayProp);
		if(ui.helper.ArrayHelper.contains(subArray,value)) {
			result = idx_;
			break;
		}
	}
	return result;
}
ui.helper.ArrayHelper.indexOfArrayComparison = function(array,comparison,startingIndex) {
	if(startingIndex == null) startingIndex = 0;
	var result = -1;
	if(array != null) {
		if(ui.helper.ArrayHelper.hasValues(comparison)) {
			var base = comparison[0];
			var baseIndex = ui.helper.ArrayHelper.indexOfComplex(array,base.value,base.propOrFcn,startingIndex);
			while(baseIndex > -1 && result < 0) {
				var candidate = array[baseIndex];
				var breakOut = false;
				var _g1 = 1, _g = comparison.length;
				while(_g1 < _g) {
					var c_ = _g1++;
					var comparisonValue;
					if(js.Boot.__instanceof(comparison[c_].propOrFcn,String)) comparisonValue = Reflect.field(candidate,comparison[c_].propOrFcn); else comparisonValue = comparison[c_].propOrFcn(candidate);
					if(comparison[c_].value == comparisonValue) continue; else {
						baseIndex = ui.helper.ArrayHelper.indexOfComplex(array,base.value,base.propOrFcn,baseIndex + 1);
						breakOut = true;
						break;
					}
				}
				if(breakOut) continue;
				result = baseIndex;
			}
		}
	}
	return result;
}
ui.helper.ArrayHelper.getElementComplex = function(array,value,propOrFcn,startingIndex) {
	if(startingIndex == null) startingIndex = 0;
	if(array == null) return null;
	var result = null;
	var _g1 = startingIndex, _g = array.length;
	while(_g1 < _g) {
		var idx_ = _g1++;
		var comparisonValue;
		if(js.Boot.__instanceof(propOrFcn,String)) comparisonValue = Reflect.field(array[idx_],propOrFcn); else comparisonValue = propOrFcn(array[idx_]);
		if(value == comparisonValue) {
			result = array[idx_];
			break;
		}
	}
	return result;
}
ui.helper.ArrayHelper.getElementComplexInSubArray = function(array,value,subArrayProp,startingIndex) {
	if(startingIndex == null) startingIndex = 0;
	if(array == null) return null;
	var result = null;
	var _g1 = startingIndex, _g = array.length;
	while(_g1 < _g) {
		var idx_ = _g1++;
		var subArray = Reflect.field(array[idx_],subArrayProp);
		if(ui.helper.ArrayHelper.contains(subArray,value)) {
			result = array[idx_];
			break;
		}
	}
	return result;
}
ui.helper.ArrayHelper.getElementArrayComparison = function(array,comparison,startingIndex) {
	if(startingIndex == null) startingIndex = 0;
	var result = null;
	if(array != null) {
		if(ui.helper.ArrayHelper.hasValues(comparison)) {
			var base = comparison[0];
			var baseIndex = ui.helper.ArrayHelper.indexOfComplex(array,base.value,base.propOrFcn,startingIndex);
			while(baseIndex > -1 && result == null) {
				var candidate = array[baseIndex];
				var breakOut = false;
				var _g1 = 1, _g = comparison.length;
				while(_g1 < _g) {
					var c_ = _g1++;
					var comparisonValue;
					if(js.Boot.__instanceof(comparison[c_].propOrFcn,String)) comparisonValue = Reflect.field(candidate,comparison[c_].propOrFcn); else comparisonValue = comparison[c_].propOrFcn(candidate);
					if(comparison[c_].value == comparisonValue) continue; else {
						baseIndex = ui.helper.ArrayHelper.indexOfComplex(array,base.value,base.propOrFcn,baseIndex + 1);
						breakOut = true;
						break;
					}
				}
				if(breakOut) continue;
				result = candidate;
			}
		}
	}
	return result;
}
ui.helper.ArrayHelper.contains = function(array,value) {
	if(array == null) return false;
	var contains = Lambda.indexOf(array,value);
	return contains > -1;
}
ui.helper.ArrayHelper.containsAny = function(array,valueArray) {
	if(array == null || valueArray == null) return false;
	var contains = -1;
	var _g1 = 0, _g = valueArray.length;
	while(_g1 < _g) {
		var v_ = _g1++;
		contains = Lambda.indexOf(array,valueArray[v_]);
		if(contains > -1) break;
	}
	return contains > -1;
}
ui.helper.ArrayHelper.containsAll = function(array,valueArray) {
	if(array == null || valueArray == null) return false;
	var anyFailures = false;
	var _g1 = 0, _g = valueArray.length;
	while(_g1 < _g) {
		var v_ = _g1++;
		var index = Lambda.indexOf(array,valueArray[v_]);
		if(index < 0) {
			anyFailures = true;
			break;
		}
	}
	return !anyFailures;
}
ui.helper.ArrayHelper.containsComplex = function(array,value,propOrFcn,startingIndex) {
	if(startingIndex == null) startingIndex = 0;
	if(array == null) return false;
	var contains = ui.helper.ArrayHelper.indexOfComplex(array,value,propOrFcn,startingIndex);
	return contains > -1;
}
ui.helper.ArrayHelper.containsComplexInSubArray = function(array,value,subArrayProp,startingIndex) {
	if(startingIndex == null) startingIndex = 0;
	if(array == null) return false;
	var contains = ui.helper.ArrayHelper.indexOfComplexInSubArray(array,value,subArrayProp,startingIndex);
	return contains > -1;
}
ui.helper.ArrayHelper.containsArrayComparison = function(array,comparison,startingIndex) {
	if(startingIndex == null) startingIndex = 0;
	if(array == null) return false;
	var contains = ui.helper.ArrayHelper.indexOfArrayComparison(array,comparison,startingIndex);
	return contains > -1;
}
ui.helper.ArrayHelper.hasValues = function(array) {
	return array != null && array.length > 0;
}
ui.helper.ArrayHelper.joinX = function(array,sep) {
	var s = "";
	var _g1 = 0, _g = array.length;
	while(_g1 < _g) {
		var str_ = _g1++;
		var tmp = array[str_];
		if(ui.helper.StringHelper.isNotBlank(tmp)) tmp = StringTools.trim(tmp);
		if(ui.helper.StringHelper.isNotBlank(tmp) && str_ > 0 && s.length > 0) s += sep;
		s += array[str_];
	}
	return s;
}
ui.helper.StringHelper = $hxClasses["ui.helper.StringHelper"] = function() { }
ui.helper.StringHelper.__name__ = ["ui","helper","StringHelper"];
ui.helper.StringHelper.compare = function(left,right) {
	if(left < right) return -1; else if(left > right) return 1; else return 0;
}
ui.helper.StringHelper.extractLast = function(term,splitValue) {
	if(splitValue == null) splitValue = ",";
	var lastTerm = null;
	if(js.Boot.__instanceof(splitValue,EReg)) lastTerm = (js.Boot.__cast(splitValue , EReg)).split(term).pop(); else lastTerm = term.split(splitValue).pop();
	return lastTerm;
}
ui.helper.StringHelper.replaceAll = function(original,sub,by) {
	if(!js.Boot.__instanceof(original,String)) original = Std.string(original);
	while(original.indexOf(sub) >= 0) if(js.Boot.__instanceof(sub,EReg)) original = (js.Boot.__cast(sub , EReg)).replace(original,by); else original = StringTools.replace(original,sub,by);
	return original;
}
ui.helper.StringHelper.replaceLast = function(original,newLastTerm,splitValue) {
	if(splitValue == null) splitValue = ".";
	var pathSplit = original.split(splitValue);
	pathSplit.pop();
	pathSplit.push(newLastTerm);
	return pathSplit.join(".");
}
ui.helper.StringHelper.capitalizeFirstLetter = function(str) {
	return HxOverrides.substr(str,0,1).toUpperCase() + HxOverrides.substr(str,1,str.length);
}
ui.helper.StringHelper.isBlank = function(str) {
	return str == null || ui.jq.JQ.trim(str) == "";
}
ui.helper.StringHelper.isNotBlank = function(str) {
	return !ui.helper.StringHelper.isBlank(str);
}
ui.helper.StringHelper.indentLeft = function(baseString,chars,padChar) {
	if(baseString == null) baseString = "";
	var padding = "";
	var _g = 0;
	while(_g < chars) {
		var i_ = _g++;
		padding += padChar;
	}
	return padding + baseString;
}
ui.helper.StringHelper.padLeft = function(baseString,minChars,padChar) {
	if(baseString == null) baseString = "";
	var padding = "";
	if(baseString.length < minChars) {
		var _g = baseString.length;
		while(_g < minChars) {
			var i_ = _g++;
			padding += padChar;
		}
	}
	return padding + baseString;
}
ui.helper.StringHelper.padRight = function(baseString,minChars,padChar) {
	if(baseString == null) baseString = "";
	var padding = "";
	if(baseString.length < minChars) {
		var _g = baseString.length;
		while(_g < minChars) {
			var i_ = _g++;
			padding += padChar;
		}
	}
	return baseString + padding;
}
ui.helper.StringHelper.trimLeft = function(s,minChars,trimChars) {
	if(trimChars == null) trimChars = " \n\t";
	if(minChars == null) minChars = 0;
	if(s == null) s = "";
	if(s.length < minChars) return s;
	var i = 0;
	while(i <= s.length && trimChars.indexOf(HxOverrides.substr(s,i,1)) >= 0) i += 1;
	if(s.length - i < minChars) i = s.length - minChars;
	return HxOverrides.substr(s,i,null);
}
ui.helper.StringHelper.trimRight = function(s,minChars,trimChars) {
	if(trimChars == null) trimChars = " \n\t";
	if(minChars == null) minChars = 0;
	if(s == null) s = "";
	if(s.length < minChars) return s;
	var i = s.length;
	while(i > 0 && trimChars.indexOf(HxOverrides.substr(s,i - 1,1)) >= 0) i -= 1;
	if(s.length - i < minChars) i = minChars;
	return HxOverrides.substr(s,0,i);
}
ui.helper.StringHelper.contains = function(baseString,str) {
	if(baseString == null) baseString = "";
	return baseString.indexOf(str) > -1;
}
ui.helper.StringHelper.splitByReg = function(baseString,reg) {
	var result = null;
	if(baseString != null && reg != null) result = reg.split(baseString);
	return result;
}
if(!ui.log) ui.log = {}
ui.log.LogLevel = $hxClasses["ui.log.LogLevel"] = { __ename__ : ["ui","log","LogLevel"], __constructs__ : ["TRACE","DEBUG","INFO","WARN","ERROR"] }
ui.log.LogLevel.TRACE = ["TRACE",0];
ui.log.LogLevel.TRACE.toString = $estr;
ui.log.LogLevel.TRACE.__enum__ = ui.log.LogLevel;
ui.log.LogLevel.DEBUG = ["DEBUG",1];
ui.log.LogLevel.DEBUG.toString = $estr;
ui.log.LogLevel.DEBUG.__enum__ = ui.log.LogLevel;
ui.log.LogLevel.INFO = ["INFO",2];
ui.log.LogLevel.INFO.toString = $estr;
ui.log.LogLevel.INFO.__enum__ = ui.log.LogLevel;
ui.log.LogLevel.WARN = ["WARN",3];
ui.log.LogLevel.WARN.toString = $estr;
ui.log.LogLevel.WARN.__enum__ = ui.log.LogLevel;
ui.log.LogLevel.ERROR = ["ERROR",4];
ui.log.LogLevel.ERROR.toString = $estr;
ui.log.LogLevel.ERROR.__enum__ = ui.log.LogLevel;
ui.log.Logga = $hxClasses["ui.log.Logga"] = function(logLevel) {
	this.initialized = false;
	this.loggerLevel = logLevel;
};
ui.log.Logga.__name__ = ["ui","log","Logga"];
ui.log.Logga.getExceptionInst = function(err) {
	if(js.Boot.__instanceof(err,ui.exception.Exception)) return err; else return new ui.exception.Exception(err);
}
ui.log.Logga.prototype = {
	error: function(statement,exception) {
		this.log(statement,ui.log.LogLevel.ERROR,exception);
	}
	,warn: function(statement,exception) {
		this.log(statement,ui.log.LogLevel.WARN,exception);
	}
	,info: function(statement,exception) {
		this.log(statement,ui.log.LogLevel.INFO,exception);
	}
	,debug: function(statement,exception) {
		this.log(statement,ui.log.LogLevel.DEBUG,exception);
	}
	,trace: function(statement,exception) {
		this.log(statement,ui.log.LogLevel.TRACE,exception);
	}
	,setLogLevel: function(logLevel) {
		this.loggerLevel = logLevel;
	}
	,logsAtLevel: function(level) {
		return this.loggerLevel[1] <= level[1];
	}
	,log: function(statement,level,exception) {
		if(!this.initialized) this._getLogger();
		if(level == null) level = ui.log.LogLevel.INFO;
		try {
			if(exception != null && $bind(exception,exception.stackTrace) != null && Reflect.isFunction($bind(exception,exception.stackTrace))) statement += "\n" + exception.stackTrace();
		} catch( err ) {
			this.log("Could not get stackTrace",ui.log.LogLevel.ERROR);
		}
		if(this.logsAtLevel(level) && this.console != null) try {
			if((Type.enumEq(level,ui.log.LogLevel.TRACE) || Type.enumEq(level,ui.log.LogLevel.DEBUG)) && this.console.debug != null) this.console.debug(statement); else if(Type.enumEq(level,ui.log.LogLevel.INFO) && this.console.info != null) this.console.info(statement); else if(Type.enumEq(level,ui.log.LogLevel.WARN) && this.console.warn != null) this.console.warn(statement); else if(Type.enumEq(level,ui.log.LogLevel.ERROR) && this.console.error != null) this.console.error(statement); else this.console.log(statement);
		} catch( err ) {
			if(Reflect.hasField((function($this) {
				var $r;
				try {
					$r = $this.console;
				} catch( __e ) {
					$r = { };
				}
				return $r;
			}(this)),"error")) this.console.error(err);
		}
	}
	,_getLogger: function() {
		this.console = window.console;
		this.initialized = true;
	}
	,initialized: null
	,console: null
	,loggerLevel: null
	,__class__: ui.log.Logga
}
if(!ui.model) ui.model = {}
ui.model.EventModel = $hxClasses["ui.model.EventModel"] = function() { }
ui.model.EventModel.__name__ = ["ui","model","EventModel"];
ui.model.EventModel.hash = null;
ui.model.EventModel.addListener = function(id,listener) {
	var arr = ui.model.EventModel.hash.get(id);
	if(arr == null) {
		arr = new Array();
		ui.model.EventModel.hash.set(id,arr);
	}
	arr.push(listener);
}
ui.model.EventModel.change = function(id,t) {
	ui.AgentUi.LOGGER.debug("EVENTMODEL: Change to " + id);
	var arr = ui.model.EventModel.hash.get(id);
	if(ui.helper.ArrayHelper.hasValues(arr)) {
		var _g1 = 0, _g = arr.length;
		while(_g1 < _g) {
			var l_ = _g1++;
			arr[l_].change(t);
		}
	}
}
ui.model.EventListener = $hxClasses["ui.model.EventListener"] = function(fcn) {
	this.fcn = fcn;
	this.uid = ui.util.UidGenerator.create(10);
};
ui.model.EventListener.__name__ = ["ui","model","EventListener"];
ui.model.EventListener.prototype = {
	change: function(t) {
		this.fcn(t);
	}
	,uid: null
	,fcn: null
	,__class__: ui.model.EventListener
}
ui.model.Filter = $hxClasses["ui.model.Filter"] = function(node) {
	this.rootNode = node;
	this.connectionNodes = new Array();
	this.labelNodes = new Array();
	if(node.hasChildren()) {
		var _g1 = 0, _g = node.nodes.length;
		while(_g1 < _g) {
			var ch_ = _g1++;
			if(node.nodes[ch_].type == "CONNECTION") this.connectionNodes.push(node.nodes[ch_]); else if(node.nodes[ch_].type == "LABEL") this.labelNodes.push(node.nodes[ch_]); else throw new ui.exception.Exception("dont know how to handle node of type " + node.nodes[ch_].type);
		}
	}
};
ui.model.Filter.__name__ = ["ui","model","Filter"];
ui.model.Filter.prototype = {
	_kdbxify: function(nodes) {
		var str = "";
		if(ui.helper.ArrayHelper.hasValues(nodes)) {
			if(nodes.length > 1) str += "(";
			var iteration = 0;
			var _g1 = 0, _g = nodes.length;
			while(_g1 < _g) {
				var ln_ = _g1++;
				if(iteration++ > 0) str += ",";
				str += nodes[ln_].getKdbxName();
				if(nodes[ln_].hasChildren()) str += this._kdbxify(nodes[ln_].nodes);
			}
			if(nodes.length > 1) str += ")";
		}
		return str;
	}
	,kdbxify: function() {
		var queries = [this._kdbxify(this.labelNodes),this._kdbxify(this.connectionNodes)];
		var query = ui.helper.ArrayHelper.joinX(queries,",");
		return query;
	}
	,rootNode: null
	,connectionNodes: null
	,labelNodes: null
	,__class__: ui.model.Filter
}
ui.model.ModelObj = $hxClasses["ui.model.ModelObj"] = function() { }
ui.model.ModelObj.__name__ = ["ui","model","ModelObj"];
ui.model.ModelObj.__interfaces__ = [haxe.rtti.Infos];
ui.model.ModelObj.identifier = function(t) {
	return t.uid;
}
ui.model.ModelObj.prototype = {
	uid: null
	,__class__: ui.model.ModelObj
}
ui.model.User = $hxClasses["ui.model.User"] = function() {
};
ui.model.User.__name__ = ["ui","model","User"];
ui.model.User.__super__ = ui.model.ModelObj;
ui.model.User.prototype = $extend(ui.model.ModelObj.prototype,{
	_setCurrentAlias: function(alias) {
		this.currentAlias = alias;
		return this._getCurrentAlias();
	}
	,_getCurrentAlias: function() {
		if(this.currentAlias == null) this._setCurrentAlias(this.aliases.iterator().next());
		return this.currentAlias;
	}
	,currentAlias: null
	,aliases: null
	,imgSrc: null
	,lname: null
	,fname: null
	,__class__: ui.model.User
	,__properties__: {set_currentAlias:"_setCurrentAlias",get_currentAlias:"_getCurrentAlias"}
});
ui.model.Alias = $hxClasses["ui.model.Alias"] = function() {
};
ui.model.Alias.__name__ = ["ui","model","Alias"];
ui.model.Alias.__super__ = ui.model.ModelObj;
ui.model.Alias.prototype = $extend(ui.model.ModelObj.prototype,{
	connections: null
	,labels: null
	,label: null
	,imgSrc: null
	,__class__: ui.model.Alias
});
ui.model.Filterable = $hxClasses["ui.model.Filterable"] = function() { }
ui.model.Filterable.__name__ = ["ui","model","Filterable"];
ui.model.Label = $hxClasses["ui.model.Label"] = function(text) {
	this.text = text;
	this.color = ui.util.ColorProvider.getNextColor();
};
ui.model.Label.__name__ = ["ui","model","Label"];
ui.model.Label.__interfaces__ = [ui.model.Filterable];
ui.model.Label.__super__ = ui.model.ModelObj;
ui.model.Label.prototype = $extend(ui.model.ModelObj.prototype,{
	color: null
	,parentUid: null
	,text: null
	,__class__: ui.model.Label
});
ui.model.Connection = $hxClasses["ui.model.Connection"] = function(fname,lname,imgSrc) {
	this.fname = fname;
	this.lname = lname;
	this.imgSrc = imgSrc;
};
ui.model.Connection.__name__ = ["ui","model","Connection"];
ui.model.Connection.__interfaces__ = [ui.model.Filterable];
ui.model.Connection.__super__ = ui.model.ModelObj;
ui.model.Connection.prototype = $extend(ui.model.ModelObj.prototype,{
	imgSrc: null
	,lname: null
	,fname: null
	,__class__: ui.model.Connection
});
ui.model.Content = $hxClasses["ui.model.Content"] = function() { }
ui.model.Content.__name__ = ["ui","model","Content"];
ui.model.Content.__super__ = ui.model.ModelObj;
ui.model.Content.prototype = $extend(ui.model.ModelObj.prototype,{
	connections: null
	,labels: null
	,type: null
	,__class__: ui.model.Content
});
ui.model.ImageContent = $hxClasses["ui.model.ImageContent"] = function() {
};
ui.model.ImageContent.__name__ = ["ui","model","ImageContent"];
ui.model.ImageContent.__super__ = ui.model.Content;
ui.model.ImageContent.prototype = $extend(ui.model.Content.prototype,{
	caption: null
	,imgSrc: null
	,__class__: ui.model.ImageContent
});
ui.model.AudioContent = $hxClasses["ui.model.AudioContent"] = function() {
};
ui.model.AudioContent.__name__ = ["ui","model","AudioContent"];
ui.model.AudioContent.__super__ = ui.model.Content;
ui.model.AudioContent.prototype = $extend(ui.model.Content.prototype,{
	title: null
	,audioType: null
	,audioSrc: null
	,__class__: ui.model.AudioContent
});
ui.model.Node = $hxClasses["ui.model.Node"] = function() {
	this.type = "ROOT";
};
ui.model.Node.__name__ = ["ui","model","Node"];
ui.model.Node.prototype = {
	getKdbxName: function() {
		throw new ui.exception.Exception("override me");
		return null;
	}
	,getPrintName: function() {
		throw new ui.exception.Exception("override me");
		return null;
	}
	,hasChildren: function() {
		return ui.helper.ArrayHelper.hasValues(this.nodes);
	}
	,addNode: function(n) {
		this.nodes.push(n);
	}
	,_log: function(depth) {
		if(depth == null) depth = 0;
		var str = "\n" + ui.helper.StringHelper.indentLeft(this.getPrintName(),depth * 5," ");
		if(ui.helper.ArrayHelper.hasValues(this.nodes)) {
			var _g1 = 0, _g = this.nodes.length;
			while(_g1 < _g) {
				var n_ = _g1++;
				str += this.nodes[n_]._log(depth + 1);
			}
		}
		return str;
	}
	,log: function() {
		var msg = this._log();
		ui.AgentUi.LOGGER.debug("===================");
		ui.AgentUi.LOGGER.debug(msg);
		ui.AgentUi.LOGGER.debug("===================");
	}
	,type: null
	,nodes: null
	,__class__: ui.model.Node
}
ui.model.And = $hxClasses["ui.model.And"] = function() {
	this.nodes = new Array();
};
ui.model.And.__name__ = ["ui","model","And"];
ui.model.And.__super__ = ui.model.Node;
ui.model.And.prototype = $extend(ui.model.Node.prototype,{
	getKdbxName: function() {
		return "all";
	}
	,getPrintName: function() {
		return "AND (" + this.type + " )";
	}
	,__class__: ui.model.And
});
ui.model.Or = $hxClasses["ui.model.Or"] = function() {
	this.nodes = new Array();
};
ui.model.Or.__name__ = ["ui","model","Or"];
ui.model.Or.__super__ = ui.model.Node;
ui.model.Or.prototype = $extend(ui.model.Node.prototype,{
	getKdbxName: function() {
		return "any";
	}
	,getPrintName: function() {
		return "OR (" + this.type + " )";
	}
	,__class__: ui.model.Or
});
ui.model.ContentNode = $hxClasses["ui.model.ContentNode"] = function() {
};
ui.model.ContentNode.__name__ = ["ui","model","ContentNode"];
ui.model.ContentNode.__super__ = ui.model.Node;
ui.model.ContentNode.prototype = $extend(ui.model.Node.prototype,{
	getKdbxName: function() {
		return this.contentUid;
	}
	,getPrintName: function() {
		return "CONTENT(" + this.type + " | " + this.contentUid + ")";
	}
	,hasChildren: function() {
		return false;
	}
	,filterable: null
	,contentUid: null
	,__class__: ui.model.ContentNode
});
if(!ui.observable) ui.observable = {}
ui.observable.OSet = $hxClasses["ui.observable.OSet"] = function() { }
ui.observable.OSet.__name__ = ["ui","observable","OSet"];
ui.observable.OSet.prototype = {
	delegate: null
	,iterator: null
	,listen: null
	,identifier: null
	,__class__: ui.observable.OSet
}
ui.observable.EventManager = $hxClasses["ui.observable.EventManager"] = function(set) {
	this._set = set;
	this._listeners = [];
};
ui.observable.EventManager.__name__ = ["ui","observable","EventManager"];
ui.observable.EventManager.prototype = {
	fire: function(t,type) {
		Lambda.iter(this._listeners,function(it) {
			return it(t,type);
		});
	}
	,add: function(l) {
		Lambda.iter(this._set,function(it) {
			return l(it,ui.observable.EventType.Add);
		});
		this._listeners.push(l);
	}
	,_set: null
	,_listeners: null
	,__class__: ui.observable.EventManager
}
ui.observable.EventType = $hxClasses["ui.observable.EventType"] = function(name,add,update) {
	this._name = name;
	this._add = add;
	this._update = update;
};
ui.observable.EventType.__name__ = ["ui","observable","EventType"];
ui.observable.EventType.prototype = {
	isDelete: function() {
		return !(this._add || this._update);
	}
	,isAddOrUpdate: function() {
		return this._add || this._update;
	}
	,isUpdate: function() {
		return this._add;
	}
	,isAdd: function() {
		return this._add;
	}
	,name: function() {
		return this._name;
	}
	,_update: null
	,_add: null
	,_name: null
	,__class__: ui.observable.EventType
}
ui.observable.AbstractSet = $hxClasses["ui.observable.AbstractSet"] = function() {
	this._eventManager = new ui.observable.EventManager(this);
};
ui.observable.AbstractSet.__name__ = ["ui","observable","AbstractSet"];
ui.observable.AbstractSet.__interfaces__ = [ui.observable.OSet];
ui.observable.AbstractSet.prototype = {
	delegate: function() {
		return (function($this) {
			var $r;
			throw new ui.exception.Exception("implement me");
			return $r;
		}(this));
	}
	,iterator: function() {
		return (function($this) {
			var $r;
			throw new ui.exception.Exception("implement me");
			return $r;
		}(this));
	}
	,identifier: function() {
		return (function($this) {
			var $r;
			throw new ui.exception.Exception("implement me");
			return $r;
		}(this));
	}
	,fire: function(t,type) {
		this._eventManager.fire(t,type);
	}
	,map: function(f) {
		return new ui.observable.MappedSet(this,f);
	}
	,filter: function(f) {
		return new ui.observable.FilteredSet(this,f);
	}
	,listen: function(l) {
		this._eventManager.add(l);
	}
	,_eventManager: null
	,__class__: ui.observable.AbstractSet
}
ui.observable.ObservableSet = $hxClasses["ui.observable.ObservableSet"] = function(identifier) {
	ui.observable.AbstractSet.call(this);
	this._identifier = identifier;
	this._delegate = new ui.util.SizedHash();
};
ui.observable.ObservableSet.__name__ = ["ui","observable","ObservableSet"];
ui.observable.ObservableSet.__super__ = ui.observable.AbstractSet;
ui.observable.ObservableSet.prototype = $extend(ui.observable.AbstractSet.prototype,{
	size: function() {
		return this._delegate.size;
	}
	,clear: function() {
		var iter = this.iterator();
		while(iter.hasNext()) this["delete"](iter.next());
	}
	,identifier: function() {
		return this._identifier;
	}
	,'delete': function(t) {
		var key = (this.identifier())(t);
		if(this._delegate.exists(key)) {
			this._delegate.remove(key);
			this.fire(t,ui.observable.EventType.Delete);
		}
	}
	,update: function(t) {
		this.addOrUpdate(t);
	}
	,delegate: function() {
		return this._delegate;
	}
	,addOrUpdate: function(t) {
		var key = (this.identifier())(t);
		var type;
		if(this._delegate.exists(key)) type = ui.observable.EventType.Update; else type = ui.observable.EventType.Add;
		this._delegate.set(key,t);
		this.fire(t,type);
	}
	,isEmpty: function() {
		return Lambda.empty(this._delegate);
	}
	,iterator: function() {
		return this._delegate.iterator();
	}
	,addAll: function(tArr) {
		if(tArr != null && tArr.length > 0) {
			var _g1 = 0, _g = tArr.length;
			while(_g1 < _g) {
				var t_ = _g1++;
				this.addOrUpdate(tArr[t_]);
			}
		}
	}
	,add: function(t) {
		this.addOrUpdate(t);
	}
	,_identifier: null
	,_delegate: null
	,__class__: ui.observable.ObservableSet
});
ui.observable.MappedSet = $hxClasses["ui.observable.MappedSet"] = function(source,mapper) {
	var _g = this;
	ui.observable.AbstractSet.call(this);
	this._mappedSet = new Hash();
	this._source = source;
	this._source.listen(function(t,type) {
		var key = (_g._source.identifier())(t);
		var mappedValue;
		if(type.isAddOrUpdate()) {
			mappedValue = mapper(t);
			_g._mappedSet.set(key,mappedValue);
		} else {
			mappedValue = _g._mappedSet.get(key);
			_g._mappedSet.remove(key);
		}
		_g.fire(mappedValue,type);
	});
};
ui.observable.MappedSet.__name__ = ["ui","observable","MappedSet"];
ui.observable.MappedSet.__super__ = ui.observable.AbstractSet;
ui.observable.MappedSet.prototype = $extend(ui.observable.AbstractSet.prototype,{
	iterator: function() {
		return this._mappedSet.iterator();
	}
	,identify: function(u) {
		var keys = this._mappedSet.keys();
		while(keys.hasNext()) {
			var key = keys.next();
			if(this._mappedSet.get(key) == u) return key;
		}
		throw new ui.exception.Exception("unable to find identity for " + Std.string(u));
	}
	,delegate: function() {
		return this._mappedSet;
	}
	,identifier: function() {
		return $bind(this,this.identify);
	}
	,_mappedSet: null
	,_mapper: null
	,_source: null
	,__class__: ui.observable.MappedSet
});
ui.observable.FilteredSet = $hxClasses["ui.observable.FilteredSet"] = function(source,filter) {
	var _g = this;
	ui.observable.AbstractSet.call(this);
	this._filteredSet = new Hash();
	this._source = source;
	this._filter = filter;
	this._identifier = source.identifier();
	this._source.listen(function(t,type) {
		if(type.isAddOrUpdate()) _g.apply(t); else if(type.isDelete()) {
			var key = (_g.identifier())(t);
			if(_g._filteredSet.exists(key)) {
				_g._filteredSet.remove(key);
				_g.fire(t,type);
			}
		}
	});
};
ui.observable.FilteredSet.__name__ = ["ui","observable","FilteredSet"];
ui.observable.FilteredSet.__super__ = ui.observable.AbstractSet;
ui.observable.FilteredSet.prototype = $extend(ui.observable.AbstractSet.prototype,{
	iterator: function() {
		return this._filteredSet.iterator();
	}
	,identifier: function() {
		return this._identifier;
	}
	,refilter: function() {
		var _g = this;
		Lambda.iter(this._source,function(it) {
			return _g.apply(it);
		});
	}
	,apply: function(t) {
		var key = (this._source.identifier())(t);
		var f = this._filter(t);
		var exists = this._filteredSet.exists(key);
		if(f != exists) {
			if(f) {
				this._filteredSet.set(key,t);
				this.fire(t,ui.observable.EventType.Add);
			} else {
				this._filteredSet.remove(key);
				this.fire(t,ui.observable.EventType.Delete);
			}
		} else if(exists) this.fire(t,ui.observable.EventType.Update);
	}
	,delegate: function() {
		return this._filteredSet;
	}
	,_identifier: null
	,_filter: null
	,_source: null
	,_filteredSet: null
	,__class__: ui.observable.FilteredSet
});
ui.observable.GroupedSet = $hxClasses["ui.observable.GroupedSet"] = function(source,groupingFn) {
	var _g = this;
	ui.observable.AbstractSet.call(this);
	this._source = source;
	this._groupingFn = groupingFn;
	this._groupedSets = new Hash();
	this._identityToGrouping = new Hash();
	source.listen(function(t,type) {
		var groupingKey = groupingFn(t);
		var previousGroupingKey = _g._identityToGrouping.get(groupingKey);
		if(type.isAddOrUpdate()) {
			if(previousGroupingKey != groupingKey) {
				_g["delete"](t);
				_g.add(t);
			}
		} else _g["delete"](t);
	});
};
ui.observable.GroupedSet.__name__ = ["ui","observable","GroupedSet"];
ui.observable.GroupedSet.__super__ = ui.observable.AbstractSet;
ui.observable.GroupedSet.prototype = $extend(ui.observable.AbstractSet.prototype,{
	delegate: function() {
		return this._groupedSets;
	}
	,iterator: function() {
		return this._groupedSets.iterator();
	}
	,identify: function(set) {
		var keys = this._groupedSets.keys();
		while(keys.hasNext()) {
			var key = keys.next();
			if(this._groupedSets.get(key) == set) return key;
		}
		throw new ui.exception.Exception("unable to find identity for " + Std.string(set));
	}
	,identifier: function() {
		return $bind(this,this.identify);
	}
	,add: function(t) {
		var id = (this._source.identifier())(t);
		var key = this._identityToGrouping.get(id);
		if(key != null) throw new ui.exception.Exception("cannot add it is already in the list" + id + " -- " + key);
		key = this._groupingFn(t);
		this._identityToGrouping.set(id,key);
		var groupedSet = this._groupedSets.get(key);
		if(groupedSet == null) {
			groupedSet = new ui.observable.ObservableSet(this._source.identifier());
			this._groupedSets.set(key,groupedSet);
			groupedSet.addOrUpdate(t);
			this.fire(groupedSet,ui.observable.EventType.Add);
		} else {
			groupedSet.addOrUpdate(t);
			this.fire(groupedSet,ui.observable.EventType.Update);
		}
	}
	,'delete': function(t) {
		var id = (this._source.identifier())(t);
		var key = this._identityToGrouping.get(id);
		if(key != null) {
			this._identityToGrouping.remove(id);
			var groupedSet = this._groupedSets.get(key);
			if(groupedSet != null) {
				groupedSet["delete"](t);
				if(groupedSet.isEmpty()) {
					this._groupedSets.remove(key);
					this.fire(groupedSet,ui.observable.EventType.Delete);
				} else this.fire(groupedSet,ui.observable.EventType.Update);
			} else {
			}
		} else {
		}
	}
	,_identityToGrouping: null
	,_groupedSets: null
	,_groupingFn: null
	,_source: null
	,__class__: ui.observable.GroupedSet
});
ui.observable.SortedSet = $hxClasses["ui.observable.SortedSet"] = function(source,sortByFn) {
	var _g = this;
	ui.observable.AbstractSet.call(this);
	this._source = source;
	if(sortByFn == null) this._sortByFn = source.identifier(); else this._sortByFn = sortByFn;
	this._sorted = new Array();
	this._dirty = true;
	this._comparisonFn = function(l,r) {
		var l0 = _g._sortByFn(l);
		var r0 = _g._sortByFn(r);
		var cmp = ui.helper.StringHelper.compare(l0,r0);
		if(cmp != 0) return cmp;
		var li = (_g.identifier())(l);
		var ri = (_g.identifier())(r);
		return ui.helper.StringHelper.compare(li,ri);
	};
	source.listen(function(t,type) {
		if(type.isDelete()) _g["delete"](t); else if(type.isUpdate()) {
			_g["delete"](t);
			_g.add(t);
		} else _g.add(t);
	});
};
ui.observable.SortedSet.__name__ = ["ui","observable","SortedSet"];
ui.observable.SortedSet.__super__ = ui.observable.AbstractSet;
ui.observable.SortedSet.prototype = $extend(ui.observable.AbstractSet.prototype,{
	delegate: function() {
		throw new ui.exception.Exception("not implemented");
		return null;
	}
	,iterator: function() {
		return HxOverrides.iter(this.sorted());
	}
	,identifier: function() {
		return this._source.identifier();
	}
	,add: function(t) {
		this._sorted.push(t);
		this._dirty = true;
		this.fire(t,ui.observable.EventType.Add);
	}
	,'delete': function(t) {
		HxOverrides.remove(this._sorted,t);
		this.fire(t,ui.observable.EventType.Delete);
	}
	,binarySearch: function(value,sortBy,startIndex,endIndex) {
		var middleIndex = startIndex + endIndex >> 1;
		if(startIndex < endIndex) {
			var middleValue = this._sorted[middleIndex];
			var middleSortBy = this._sortByFn(middleValue);
			if(middleSortBy == sortBy) return middleIndex; else if(middleSortBy > sortBy) return this.binarySearch(value,sortBy,startIndex,middleIndex); else return this.binarySearch(value,sortBy,middleIndex + 1,endIndex);
		}
		return -1;
	}
	,indexOf: function(t) {
		this.sorted();
		return this.binarySearch(t,this._sortByFn(t),0,this._sorted.length - 1);
	}
	,sorted: function() {
		if(this._dirty) {
			this._sorted.sort(this._comparisonFn);
			this._dirty = false;
		}
		return this._sorted;
	}
	,_comparisonFn: null
	,_dirty: null
	,_sorted: null
	,_sortByFn: null
	,_source: null
	,__class__: ui.observable.SortedSet
});
if(!ui.serialization) ui.serialization = {}
ui.serialization.Serializer = $hxClasses["ui.serialization.Serializer"] = function() {
	this._handlersMap = new Hash();
	this.addHandlerViaName("Array<Dynamic>",new ui.serialization.DynamicArrayHandler());
};
ui.serialization.Serializer.__name__ = ["ui","serialization","Serializer"];
ui.serialization.Serializer.prototype = {
	createHandler: function(type) {
		return (function($this) {
			var $r;
			var $e = (type);
			switch( $e[1] ) {
			case 1:
				var parms = $e[3], path = $e[2];
				$r = path == "Bool"?new ui.serialization.BoolHandler():new ui.serialization.EnumHandler(path,parms);
				break;
			case 2:
				var parms = $e[3], path = $e[2];
				$r = (function($this) {
					var $r;
					switch(path) {
					case "Bool":
						$r = new ui.serialization.BoolHandler();
						break;
					case "Float":
						$r = new ui.serialization.FloatHandler();
						break;
					case "String":
						$r = new ui.serialization.StringHandler();
						break;
					case "Int":
						$r = new ui.serialization.IntHandler();
						break;
					case "Array":
						$r = new ui.serialization.ArrayHandler(parms,$this);
						break;
					default:
						$r = new ui.serialization.ClassHandler(Type.resolveClass(ui.serialization.CTypeTools.classname(type)),ui.serialization.CTypeTools.typename(type),$this);
					}
					return $r;
				}($this));
				break;
			case 6:
				$r = new ui.serialization.DynamicHandler();
				break;
			case 4:
				var ret = $e[3], args = $e[2];
				$r = new ui.serialization.FunctionHandler();
				break;
			default:
				$r = (function($this) {
					var $r;
					throw new ui.serialization.JsonException("don't know how to handle " + Std.string(type));
					return $r;
				}($this));
			}
			return $r;
		}(this));
	}
	,getHandler: function(type) {
		var typename = ui.serialization.CTypeTools.typename(type);
		var handler = this._handlersMap.get(typename);
		if(handler == null) {
			handler = this.createHandler(type);
			this._handlersMap.set(typename,handler);
		}
		return handler;
	}
	,getHandlerViaClass: function(clazz) {
		return new ui.serialization.ClassHandler(clazz,ui.serialization.TypeTools.classname(clazz),this);
	}
	,createWriter: function() {
		return new ui.serialization.JsonWriter(this);
	}
	,createReader: function(strict) {
		if(strict == null) strict = true;
		return new ui.serialization.JsonReader(this,strict);
	}
	,toJsonString: function(value) {
		return haxe.Json.stringify(this.toJson(value));
	}
	,toJson: function(value) {
		return this.createWriter().write(value);
	}
	,fromJson: function(fromJson,clazz,strict) {
		if(strict == null) strict = true;
		var reader = this.createReader(strict);
		reader.read(fromJson,clazz);
		return reader;
	}
	,fromJsonX: function(fromJson,clazz,strict) {
		if(strict == null) strict = true;
		var reader = this.createReader(strict);
		reader.read(fromJson,clazz);
		return reader.instance;
	}
	,load: function(fromJson,instance,strict) {
		if(strict == null) strict = true;
		var reader = this.createReader(strict);
		reader.read(fromJson,Type.getClass(instance),instance);
		return reader;
	}
	,addHandlerViaName: function(typename,handler) {
		this._handlersMap.set(typename,handler);
	}
	,addHandler: function(clazz,handler) {
		var typename = Type.getClassName(clazz);
		this._handlersMap.set(typename,handler);
	}
	,_handlersMap: null
	,__class__: ui.serialization.Serializer
}
ui.serialization.TypeHandler = $hxClasses["ui.serialization.TypeHandler"] = function() { }
ui.serialization.TypeHandler.__name__ = ["ui","serialization","TypeHandler"];
ui.serialization.TypeHandler.prototype = {
	write: null
	,read: null
	,__class__: ui.serialization.TypeHandler
}
ui.serialization.ArrayHandler = $hxClasses["ui.serialization.ArrayHandler"] = function(parms,serializer) {
	this._parms = parms;
	this._serializer = serializer;
	this._elementHandler = this._serializer.getHandler(this._parms.first());
};
ui.serialization.ArrayHandler.__name__ = ["ui","serialization","ArrayHandler"];
ui.serialization.ArrayHandler.__interfaces__ = [ui.serialization.TypeHandler];
ui.serialization.ArrayHandler.prototype = {
	write: function(value,writer) {
		var arr = value;
		var result = [];
		var _g = 0;
		while(_g < arr.length) {
			var e = arr[_g];
			++_g;
			result.push(this._elementHandler.write(e,writer));
		}
		return result;
	}
	,read: function(fromJson,reader,instance) {
		if(instance == null) instance = [];
		if(fromJson != null) {
			var arr = fromJson;
			var i = 0;
			var _g = 0;
			while(_g < arr.length) {
				var e = arr[_g];
				++_g;
				var context = "[" + i + "]";
				reader.stack.push(context);
				try {
					instance.push(this._elementHandler.read(e,reader));
				} catch( $e0 ) {
					if( js.Boot.__instanceof($e0,String) ) {
						var msg = $e0;
						reader.error("error reading " + context + "\n" + msg);
					} else if( js.Boot.__instanceof($e0,ui.serialization.JsonException) ) {
						var e1 = $e0;
						reader.error("error reading " + context,e1);
					} else throw($e0);
				}
				reader.stack.pop();
				i += 1;
			}
		}
		return instance;
	}
	,_elementHandler: null
	,_serializer: null
	,_parms: null
	,__class__: ui.serialization.ArrayHandler
}
ui.serialization.EnumHandler = $hxClasses["ui.serialization.EnumHandler"] = function(enumName,parms) {
	this._enumName = enumName;
	this._parms = parms;
	this._enum = Type.resolveEnum(this._enumName);
	if(this._enum == null) throw new ui.serialization.JsonException("no enum named " + this._enumName + " found");
	this._enumValues = Type.allEnums(this._enum);
};
ui.serialization.EnumHandler.__name__ = ["ui","serialization","EnumHandler"];
ui.serialization.EnumHandler.__interfaces__ = [ui.serialization.TypeHandler];
ui.serialization.EnumHandler.prototype = {
	write: function(value,writer) {
		return Std.string(value);
	}
	,read: function(fromJson,reader,instance) {
		if(instance != null) reader.error("enum type can not populate a passed in instance");
		var type = Type.getClass(fromJson);
		if(type == String) return Type.createEnum(this._enum,fromJson); else if(type == Int) return Type.createEnumIndex(this._enum,fromJson); else {
			reader.error(Std.string(fromJson) + " is a(n) " + Std.string(type) + " not a String");
			return null;
		}
	}
	,_parms: null
	,_enumValues: null
	,_enum: null
	,_enumName: null
	,__class__: ui.serialization.EnumHandler
}
ui.serialization.ValueTypeHandler = $hxClasses["ui.serialization.ValueTypeHandler"] = function(valueType) {
	this._valueType = valueType;
};
ui.serialization.ValueTypeHandler.__name__ = ["ui","serialization","ValueTypeHandler"];
ui.serialization.ValueTypeHandler.__interfaces__ = [ui.serialization.TypeHandler];
ui.serialization.ValueTypeHandler.prototype = {
	write: function(value,writer) {
		return value;
	}
	,read: function(fromJson,reader,instance) {
		if(instance != null) reader.error("value type can not populate a passed in instance");
		var type = Type["typeof"](fromJson);
		if(type == this._valueType) return fromJson; else {
			reader.error(Std.string(fromJson) + " is a(n) " + Std.string(type) + " not an " + Std.string(this._valueType));
			return null;
		}
	}
	,_valueType: null
	,__class__: ui.serialization.ValueTypeHandler
}
ui.serialization.DynamicArrayHandler = $hxClasses["ui.serialization.DynamicArrayHandler"] = function() {
};
ui.serialization.DynamicArrayHandler.__name__ = ["ui","serialization","DynamicArrayHandler"];
ui.serialization.DynamicArrayHandler.__interfaces__ = [ui.serialization.TypeHandler];
ui.serialization.DynamicArrayHandler.prototype = {
	write: function(value,writer) {
		return value;
	}
	,read: function(fromJson,reader,instance) {
		var classname = ui.serialization.ValueTypeTools.getClassname(Type["typeof"](fromJson));
		if(classname == "Array") return fromJson; else return reader.error("expected an array got a " + classname);
	}
	,__class__: ui.serialization.DynamicArrayHandler
}
ui.serialization.DynamicHandler = $hxClasses["ui.serialization.DynamicHandler"] = function() {
};
ui.serialization.DynamicHandler.__name__ = ["ui","serialization","DynamicHandler"];
ui.serialization.DynamicHandler.__interfaces__ = [ui.serialization.TypeHandler];
ui.serialization.DynamicHandler.prototype = {
	write: function(value,writer) {
		return value;
	}
	,read: function(fromJson,reader,instance) {
		return fromJson;
	}
	,__class__: ui.serialization.DynamicHandler
}
ui.serialization.IntHandler = $hxClasses["ui.serialization.IntHandler"] = function() {
	ui.serialization.ValueTypeHandler.call(this,ValueType.TInt);
};
ui.serialization.IntHandler.__name__ = ["ui","serialization","IntHandler"];
ui.serialization.IntHandler.__super__ = ui.serialization.ValueTypeHandler;
ui.serialization.IntHandler.prototype = $extend(ui.serialization.ValueTypeHandler.prototype,{
	__class__: ui.serialization.IntHandler
});
ui.serialization.FloatHandler = $hxClasses["ui.serialization.FloatHandler"] = function() {
	ui.serialization.ValueTypeHandler.call(this,ValueType.TFloat);
};
ui.serialization.FloatHandler.__name__ = ["ui","serialization","FloatHandler"];
ui.serialization.FloatHandler.__super__ = ui.serialization.ValueTypeHandler;
ui.serialization.FloatHandler.prototype = $extend(ui.serialization.ValueTypeHandler.prototype,{
	__class__: ui.serialization.FloatHandler
});
ui.serialization.BoolHandler = $hxClasses["ui.serialization.BoolHandler"] = function() {
	ui.serialization.ValueTypeHandler.call(this,ValueType.TBool);
};
ui.serialization.BoolHandler.__name__ = ["ui","serialization","BoolHandler"];
ui.serialization.BoolHandler.__super__ = ui.serialization.ValueTypeHandler;
ui.serialization.BoolHandler.prototype = $extend(ui.serialization.ValueTypeHandler.prototype,{
	__class__: ui.serialization.BoolHandler
});
ui.serialization.StringHandler = $hxClasses["ui.serialization.StringHandler"] = function() {
};
ui.serialization.StringHandler.__name__ = ["ui","serialization","StringHandler"];
ui.serialization.StringHandler.__interfaces__ = [ui.serialization.TypeHandler];
ui.serialization.StringHandler.prototype = {
	write: function(value,writer) {
		return value;
	}
	,read: function(fromJson,reader,instance) {
		if(instance != null) reader.error("StringHandler can not populate a passed in String, aka String's are immutable");
		var type = Type.getClass(fromJson);
		if(type == String || fromJson == null) return fromJson; else {
			reader.error(Std.string(fromJson) + " is a(n) " + Std.string(type) + " not a String");
			return null;
		}
	}
	,__class__: ui.serialization.StringHandler
}
ui.serialization.FunctionHandler = $hxClasses["ui.serialization.FunctionHandler"] = function() {
};
ui.serialization.FunctionHandler.__name__ = ["ui","serialization","FunctionHandler"];
ui.serialization.FunctionHandler.__interfaces__ = [ui.serialization.TypeHandler];
ui.serialization.FunctionHandler.prototype = {
	write: function(value,writer) {
		return value;
	}
	,read: function(fromJson,reader,instance) {
		if(instance != null) reader.error("FunctionHandler can not populate a passed in String, aka String's are immutable");
		var type = Type.getClass(fromJson);
		if(type == String) {
			if(Std.string(fromJson).length > 0) try {
				return new Function('arg', fromJson);
			} catch( e ) {
				reader.error("unable to parse into a function -- " + Std.string(fromJson) + " -- " + Std.string(e));
				return null;
			} else return null;
		} else {
			reader.error(Std.string(fromJson) + " is a(n) " + Std.string(type) + " not a String");
			return null;
		}
	}
	,__class__: ui.serialization.FunctionHandler
}
ui.serialization.Field = $hxClasses["ui.serialization.Field"] = function() {
	this.required = true;
};
ui.serialization.Field.__name__ = ["ui","serialization","Field"];
ui.serialization.Field.prototype = {
	name: null
	,handler: null
	,type: null
	,typename: null
	,required: null
	,__class__: ui.serialization.Field
}
ui.serialization.ClassHandler = $hxClasses["ui.serialization.ClassHandler"] = function(clazz,typename,serializer) {
	this._clazz = clazz;
	this._typename = typename;
	this._serializer = serializer;
	if(this._clazz == null) throw new ui.serialization.JsonException("clazz is null");
	var rtti = this._clazz.__rtti;
	if(rtti == null) {
		var msg = "no rtti found for " + this._typename;
		console.log(msg);
		throw new ui.serialization.JsonException(msg);
	}
	var x = Xml.parse(rtti).firstElement();
	var typeTree = new haxe.rtti.XmlParser().processElement(x);
	this._classDef = (function($this) {
		var $r;
		var $e = (typeTree);
		switch( $e[1] ) {
		case 1:
			var c = $e[2];
			$r = c;
			break;
		default:
			$r = (function($this) {
				var $r;
				throw new ui.serialization.JsonException("expected a class got " + Std.string(typeTree));
				return $r;
			}($this));
		}
		return $r;
	}(this));
	this._fields = new Array();
	var superClass = Type.getSuperClass(clazz);
	if(superClass != null) {
		var superClassHandler = new ui.serialization.ClassHandler(superClass,Type.getClassName(superClass),serializer);
		var _g = 0, _g1 = superClassHandler._fields;
		while(_g < _g1.length) {
			var f = _g1[_g];
			++_g;
			this._fields.push(f);
		}
	}
	var $it0 = this._classDef.fields.iterator();
	while( $it0.hasNext() ) {
		var f = $it0.next();
		var field = new ui.serialization.Field();
		var $transient = false;
		var fieldXml = x.elementsNamed(f.name).next();
		var set = fieldXml.get("set");
		var $it1 = fieldXml.elementsNamed("meta");
		while( $it1.hasNext() ) {
			var meta = $it1.next();
			var $it2 = meta.elementsNamed("m");
			while( $it2.hasNext() ) {
				var m = $it2.next();
				switch(m.get("n")) {
				case ":optional":
					field.required = false;
					break;
				case "optional":
					field.required = false;
					break;
				case ":transient":
					$transient = true;
					break;
				case "transient":
					$transient = true;
					break;
				}
			}
		}
		if(!$transient && set != "method") {
			switch( (f.type)[1] ) {
			case 2:
				field.name = f.name;
				field.type = f.type;
				field.typename = ui.serialization.CTypeTools.typename(f.type);
				field.handler = this._serializer.getHandler(field.type);
				this._fields.push(field);
				break;
			case 1:
				field.name = f.name;
				field.type = f.type;
				field.typename = ui.serialization.CTypeTools.typename(f.type);
				field.handler = this._serializer.getHandler(field.type);
				this._fields.push(field);
				break;
			case 6:
				field.name = f.name;
				field.type = f.type;
				field.typename = ui.serialization.CTypeTools.typename(f.type);
				field.handler = this._serializer.getHandler(field.type);
				this._fields.push(field);
				break;
			case 3:
				field.name = f.name;
				field.type = haxe.rtti.CType.CDynamic();
				field.typename = ui.serialization.CTypeTools.typename(field.type);
				field.handler = this._serializer.getHandler(field.type);
				this._fields.push(field);
				break;
			case 4:
				field.name = f.name;
				field.type = f.type;
				field.typename = ui.serialization.CTypeTools.typename(field.type);
				field.handler = this._serializer.getHandler(field.type);
				this._fields.push(field);
				break;
			default:
			}
		}
	}
	this._fieldsByName = new Hash();
	var _g = 0, _g1 = this._fields;
	while(_g < _g1.length) {
		var f = _g1[_g];
		++_g;
		this._fieldsByName.set(f.name,f);
	}
};
ui.serialization.ClassHandler.__name__ = ["ui","serialization","ClassHandler"];
ui.serialization.ClassHandler.__interfaces__ = [ui.serialization.TypeHandler];
ui.serialization.ClassHandler.prototype = {
	write: function(instanceValue,writer) {
		var instance = { };
		var _g = 0, _g1 = this._fields;
		while(_g < _g1.length) {
			var f = _g1[_g];
			++_g;
			try {
				var fieldValue = Reflect.field(instanceValue,f.name);
				if(fieldValue == null && !f.required) {
				} else {
					var jsonValue = f.handler.write(fieldValue,writer);
					instance[f.name] = jsonValue;
				}
			} catch( $e0 ) {
				if( js.Boot.__instanceof($e0,String) ) {
					var msg = $e0;
					throw new ui.serialization.JsonException("error writing field " + f.name + "\n" + msg);
				} else if( js.Boot.__instanceof($e0,ui.exception.Exception) ) {
					var e = $e0;
					throw new ui.serialization.JsonException("error writing field " + f.name,e);
				} else {
				var e = $e0;
				throw new ui.serialization.JsonException("error writing field " + f.name,e);
				}
			}
		}
		return instance;
	}
	,read: function(fromJson,reader,instance) {
		if(instance == null) instance = this.createInstance();
		var jsonFieldNames = Reflect.fields(fromJson);
		var _g = 0;
		while(_g < jsonFieldNames.length) {
			var jsonFieldName = jsonFieldNames[_g];
			++_g;
			if(!this._fieldsByName.exists(jsonFieldName)) reader.error("json has field named " + jsonFieldName + " instance of " + this._typename + " does not");
		}
		var _g = 0, _g1 = this._fields;
		while(_g < _g1.length) {
			var f = _g1[_g];
			++_g;
			if(f.required) {
				var found = false;
				var _g2 = 0;
				while(_g2 < jsonFieldNames.length) {
					var jsonFieldName = jsonFieldNames[_g2];
					++_g2;
					if(f.name == jsonFieldName) {
						found = true;
						break;
					}
				}
				if(!found) reader.error("instance of " + this._typename + " has required field named " + f.name + " json does not does not " + haxe.Json.stringify(fromJson));
			}
		}
		var _g = 0;
		while(_g < jsonFieldNames.length) {
			var fieldName = jsonFieldNames[_g];
			++_g;
			var f = this._fieldsByName.get(fieldName);
			try {
				if(Lambda.empty(reader.stack)) reader.stack.push(fieldName); else reader.stack.push("." + fieldName);
				var rawValue = Reflect.field(fromJson,f.name);
				if(f.required || rawValue != null) {
					var value = f.handler.read(rawValue,reader);
					instance[f.name] = value;
				}
			} catch( $e0 ) {
				if( js.Boot.__instanceof($e0,String) ) {
					var msg = $e0;
					reader.error("error reading field " + fieldName + "\n" + msg);
				} else if( js.Boot.__instanceof($e0,ui.exception.Exception) ) {
					var e = $e0;
					reader.error("error reading field " + fieldName,e);
				} else {
				var e = $e0;
				reader.error("error reading field " + fieldName,e);
				}
			}
			reader.stack.pop();
		}
		return instance;
	}
	,createInstance: function() {
		return Type.createInstance(this._clazz,[]);
	}
	,_fieldsByName: null
	,_serializer: null
	,_fields: null
	,_classDef: null
	,_clazz: null
	,_typename: null
	,__class__: ui.serialization.ClassHandler
}
ui.serialization.JsonException = $hxClasses["ui.serialization.JsonException"] = function(msg,cause) {
	ui.exception.Exception.call(this,msg,cause);
};
ui.serialization.JsonException.__name__ = ["ui","serialization","JsonException"];
ui.serialization.JsonException.__super__ = ui.exception.Exception;
ui.serialization.JsonException.prototype = $extend(ui.exception.Exception.prototype,{
	__class__: ui.serialization.JsonException
});
ui.serialization.JsonReader = $hxClasses["ui.serialization.JsonReader"] = function(serializer,strict) {
	this._serializer = serializer;
	this.stack = new Array();
	this.warnings = new Array();
	this.strict = strict;
};
ui.serialization.JsonReader.__name__ = ["ui","serialization","JsonReader"];
ui.serialization.JsonReader.prototype = {
	error: function(msg,cause) {
		if(this.strict) throw new ui.serialization.JsonException(msg,cause); else {
		}
	}
	,read: function(fromJson,clazz,instance) {
		var handler = this._serializer.getHandlerViaClass(clazz);
		this.instance = handler.read(fromJson,this,instance);
	}
	,strict: null
	,instance: null
	,warnings: null
	,stack: null
	,_serializer: null
	,__class__: ui.serialization.JsonReader
}
ui.serialization.JsonWriter = $hxClasses["ui.serialization.JsonWriter"] = function(serializer) {
	this._serializer = serializer;
};
ui.serialization.JsonWriter.__name__ = ["ui","serialization","JsonWriter"];
ui.serialization.JsonWriter.prototype = {
	write: function(value) {
		var clazz = ui.serialization.TypeTools.clazz(value);
		var handler = this._serializer.getHandlerViaClass(clazz);
		return handler.write(value,this);
	}
	,_serializer: null
	,__class__: ui.serialization.JsonWriter
}
ui.serialization.TypeTools = $hxClasses["ui.serialization.TypeTools"] = function() { }
ui.serialization.TypeTools.__name__ = ["ui","serialization","TypeTools"];
ui.serialization.TypeTools.classname = function(clazz) {
	try {
		return Type.getClassName(clazz);
	} catch( err ) {
		ui.AgentUi.LOGGER.error(err);
		throw new ui.exception.Exception(Std.string(err));
	}
}
ui.serialization.TypeTools.clazz = function(d) {
	var c = Type.getClass(d);
	if(c == null) console.log("tried to get class for type -- " + Std.string(Type["typeof"](d)) + " -- " + Std.string(d));
	return c;
}
ui.serialization.CTypeTools = $hxClasses["ui.serialization.CTypeTools"] = function() { }
ui.serialization.CTypeTools.__name__ = ["ui","serialization","CTypeTools"];
ui.serialization.CTypeTools.classname = function(type) {
	return (function($this) {
		var $r;
		var $e = (type);
		switch( $e[1] ) {
		case 2:
			var parms = $e[3], path = $e[2];
			$r = path;
			break;
		case 1:
			var parms = $e[3], path = $e[2];
			$r = path;
			break;
		case 6:
			$r = "Dynamic";
			break;
		default:
			$r = (function($this) {
				var $r;
				throw new ui.exception.Exception("don't know how to handle " + Std.string(type));
				return $r;
			}($this));
		}
		return $r;
	}(this));
}
ui.serialization.CTypeTools.typename = function(type) {
	return (function($this) {
		var $r;
		var $e = (type);
		switch( $e[1] ) {
		case 2:
			var parms = $e[3], path = $e[2];
			$r = ui.serialization.CTypeTools.makeTypename(path,parms);
			break;
		case 1:
			var parms = $e[3], path = $e[2];
			$r = ui.serialization.CTypeTools.makeTypename(path,parms);
			break;
		case 6:
			$r = "Dynamic";
			break;
		case 4:
			$r = "Function";
			break;
		default:
			$r = (function($this) {
				var $r;
				throw new ui.exception.Exception("don't know how to handle " + Std.string(type));
				return $r;
			}($this));
		}
		return $r;
	}(this));
}
ui.serialization.CTypeTools.makeTypename = function(path,parms) {
	return parms.isEmpty()?path:path + "<" + Lambda.array(parms.map(function(ct) {
		return ui.serialization.CTypeTools.typename(ct);
	})).join(",") + ">";
}
ui.serialization.ValueTypeTools = $hxClasses["ui.serialization.ValueTypeTools"] = function() { }
ui.serialization.ValueTypeTools.__name__ = ["ui","serialization","ValueTypeTools"];
ui.serialization.ValueTypeTools.getClassname = function(type) {
	return (function($this) {
		var $r;
		var $e = (type);
		switch( $e[1] ) {
		case 8:
			$r = "TUnknown";
			break;
		case 4:
			$r = "TObject";
			break;
		case 0:
			$r = "TNull";
			break;
		case 1:
			$r = "Int";
			break;
		case 5:
			$r = "TFunction";
			break;
		case 2:
			$r = "Float";
			break;
		case 3:
			$r = "Bool";
			break;
		case 7:
			var e = $e[2];
			$r = Type.getEnumName(e);
			break;
		case 6:
			var c = $e[2];
			$r = Type.getClassName(c);
			break;
		default:
			$r = (function($this) {
				var $r;
				throw new ui.exception.Exception("don't know how to handle " + Std.string(type));
				return $r;
			}($this));
		}
		return $r;
	}(this));
}
ui.serialization.ValueTypeTools.getName = function(type) {
	return (function($this) {
		var $r;
		var $e = (type);
		switch( $e[1] ) {
		case 8:
			$r = "TUnknown";
			break;
		case 4:
			$r = "TObject";
			break;
		case 0:
			$r = "TNull";
			break;
		case 1:
			$r = "Int";
			break;
		case 5:
			$r = "TFunction";
			break;
		case 2:
			$r = "Float";
			break;
		case 3:
			$r = "Bool";
			break;
		case 7:
			var e = $e[2];
			$r = "TEnum";
			break;
		case 6:
			var c = $e[2];
			$r = "TClass";
			break;
		default:
			$r = (function($this) {
				var $r;
				throw new ui.exception.Exception("don't know how to handle " + Std.string(type));
				return $r;
			}($this));
		}
		return $r;
	}(this));
}
if(!ui.util) ui.util = {}
ui.util.FixedSizeArray = $hxClasses["ui.util.FixedSizeArray"] = function(maxSize) {
	this._maxSize = maxSize;
	this._delegate = new Array();
};
ui.util.FixedSizeArray.__name__ = ["ui","util","FixedSizeArray"];
ui.util.FixedSizeArray.prototype = {
	contains: function(t) {
		return ui.helper.ArrayHelper.contains(this._delegate,t);
	}
	,push: function(t) {
		if(this._delegate.length >= this._maxSize) this._delegate.shift();
		this._delegate.push(t);
	}
	,_maxSize: null
	,_delegate: null
	,__class__: ui.util.FixedSizeArray
}
ui.util.ColorProvider = $hxClasses["ui.util.ColorProvider"] = function() { }
ui.util.ColorProvider.__name__ = ["ui","util","ColorProvider"];
ui.util.ColorProvider._COLORS = null;
ui.util.ColorProvider._LAST_COLORS_USED = null;
ui.util.ColorProvider.getNextColor = function() {
	if(ui.util.ColorProvider._INDEX >= ui.util.ColorProvider._COLORS.length) ui.util.ColorProvider._INDEX = 0;
	return ui.util.ColorProvider._COLORS[ui.util.ColorProvider._INDEX++];
}
ui.util.ColorProvider.getRandomColor = function() {
	var index;
	do index = Std.random(ui.util.ColorProvider._COLORS.length); while(ui.util.ColorProvider._LAST_COLORS_USED.contains(index));
	ui.util.ColorProvider._LAST_COLORS_USED.push(index);
	return ui.util.ColorProvider._COLORS[index];
}
ui.util.M = $hxClasses["ui.util.M"] = function() { }
ui.util.M.__name__ = ["ui","util","M"];
ui.util.M.makeSafeGetExpression = function(e,default0,pos) {
	if(default0 == null) default0 = ui.util.M.expr(haxe.macro.ExprDef.EConst(haxe.macro.Constant.CIdent("null")),pos);
	var dynamicType = haxe.macro.ComplexType.TPath({ sub : null, name : "Dynamic", pack : [], params : []});
	var catches = [{ type : dynamicType, name : "__e", expr : default0}];
	var result = haxe.macro.ExprDef.ETry(e,catches);
	return { expr : result, pos : pos};
}
ui.util.M.exprBlock = function(exprDefs,pos) {
	return { expr : haxe.macro.ExprDef.EBlock(ui.util.M.exprs(exprDefs,pos)), pos : pos};
}
ui.util.M.expr = function(exprDef,pos) {
	return { expr : exprDef, pos : pos};
}
ui.util.M.exprs = function(exprDefs,pos) {
	var arr = [];
	Lambda.iter(exprDefs,function(ed) {
		arr.push({ expr : ed, pos : pos});
	});
	return arr;
}
ui.util.SizedHash = $hxClasses["ui.util.SizedHash"] = function() {
	Hash.call(this);
	this.size = 0;
};
ui.util.SizedHash.__name__ = ["ui","util","SizedHash"];
ui.util.SizedHash.__super__ = Hash;
ui.util.SizedHash.prototype = $extend(Hash.prototype,{
	remove: function(key) {
		if(this.exists(key)) this.size--;
		return Hash.prototype.remove.call(this,key);
	}
	,set: function(key,val) {
		if(!this.exists(key)) this.size++;
		Hash.prototype.set.call(this,key,val);
	}
	,size: null
	,__class__: ui.util.SizedHash
});
ui.util.UidGenerator = $hxClasses["ui.util.UidGenerator"] = function() { }
ui.util.UidGenerator.__name__ = ["ui","util","UidGenerator"];
ui.util.UidGenerator.create = function(length) {
	if(length == null) length = 20;
	var str = new Array();
	var charsLength = ui.util.UidGenerator.chars.length;
	while(str.length == 0) {
		var ch = ui.util.UidGenerator.randomChar();
		if(ui.util.UidGenerator.isLetter(ch)) str.push(ch);
	}
	while(str.length < length) {
		var ch = ui.util.UidGenerator.randomChar();
		str.push(ch);
	}
	return str.join("");
}
ui.util.UidGenerator.isLetter = function($char) {
	var _g1 = 0, _g = ui.util.UidGenerator.chars.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(ui.util.UidGenerator.chars.charAt(i) == $char) return true;
	}
	return false;
}
ui.util.UidGenerator.randomIndex = function(str) {
	var max = str.length - 1;
	var min = 0;
	return min + Math.round(Math.random() * (max - min) + 1);
}
ui.util.UidGenerator.randomChar = function() {
	var i = 0;
	while((i = ui.util.UidGenerator.randomIndex(ui.util.UidGenerator.chars)) >= ui.util.UidGenerator.chars.length) continue;
	return ui.util.UidGenerator.chars.charAt(i);
}
ui.util.UidGenerator.randomNumChar = function() {
	var i = 0;
	while((i = ui.util.UidGenerator.randomIndex(ui.util.UidGenerator.nums)) >= ui.util.UidGenerator.nums.length) continue;
	return Std.parseInt(ui.util.UidGenerator.nums.charAt(i));
}
if(!ui.widget) ui.widget = {}
ui.widget.Widgets = $hxClasses["ui.widget.Widgets"] = function() { }
ui.widget.Widgets.__name__ = ["ui","widget","Widgets"];
ui.widget.Widgets.getSelf = function() {
	return this;
}
ui.widget.Widgets.getSelfElement = function() {
	return this.element;
}
ui.widget.Widgets.getWidgetClasses = function() {
	return " ui-widget";
}
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; };
var $_;
function $bind(o,m) { var f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; return f; };
if(Array.prototype.indexOf) HxOverrides.remove = function(a,o) {
	var i = a.indexOf(o);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
}; else null;
Math.__name__ = ["Math"];
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
$hxClasses.Math = Math;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i) {
	return isNaN(i);
};
String.prototype.__class__ = $hxClasses.String = String;
String.__name__ = ["String"];
Array.prototype.__class__ = $hxClasses.Array = Array;
Array.__name__ = ["Array"];
Date.prototype.__class__ = $hxClasses.Date = Date;
Date.__name__ = ["Date"];
var Int = $hxClasses.Int = { __name__ : ["Int"]};
var Dynamic = $hxClasses.Dynamic = { __name__ : ["Dynamic"]};
var Float = $hxClasses.Float = Number;
Float.__name__ = ["Float"];
var Bool = $hxClasses.Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = $hxClasses.Class = { __name__ : ["Class"]};
var Enum = { };
var Void = $hxClasses.Void = { __ename__ : ["Void"]};
Xml.Element = "element";
Xml.PCData = "pcdata";
Xml.CData = "cdata";
Xml.Comment = "comment";
Xml.DocType = "doctype";
Xml.Prolog = "prolog";
Xml.Document = "document";
if(typeof(JSON) != "undefined") haxe.Json = JSON;
var q = window.jQuery;
js.JQuery = q;
q.fn.iterator = function() {
	return { pos : 0, j : this, hasNext : function() {
		return this.pos < this.j.length;
	}, next : function() {
		return $(this.j[this.pos++]);
	}};
};
ui.jq = function() {}
ui.jq.JQ = window.jQuery;
ui.jq.JQ.fn.exists = function() {
	return $(this).length > 0;
};
ui.jq.JQ.fn.isVisible = function() {
	return $(this).css("display") != "none";
};
ui.jq.JQ.fn.hasAttr = function(name) {
	return $(this).attr(name) != undefined;
};
ui.jq.JQSortable = window.jQuery;
ui.jq.JDialog = window.jQuery;
ui.jq.JQDraggable = window.jQuery;
ui.jq.JQDroppable = window.jQuery;
ui.jq.JQTooltip = window.jQuery;
ui.model.EventModel.hash = new Hash();
ui.util.ColorProvider._COLORS = new Array();
ui.util.ColorProvider._COLORS.push("#5C9BCC");
ui.util.ColorProvider._COLORS.push("#CC5C64");
ui.util.ColorProvider._COLORS.push("#5CCC8C");
ui.util.ColorProvider._COLORS.push("#5C64CC");
ui.util.ColorProvider._COLORS.push("#8C5CCC");
ui.util.ColorProvider._COLORS.push("#C45CCC");
ui.util.ColorProvider._COLORS.push("#5CCCC4");
ui.util.ColorProvider._COLORS.push("#8BB8DA");
ui.util.ColorProvider._COLORS.push("#B9D4E9");
ui.util.ColorProvider._COLORS.push("#CC5C9B");
ui.util.ColorProvider._COLORS.push("#E9CEB9");
ui.util.ColorProvider._COLORS.push("#DAAD8B");
ui.util.ColorProvider._COLORS.push("#64CC5C");
ui.util.ColorProvider._COLORS.push("#9BCC5C");
ui.util.ColorProvider._COLORS.push("#CCC45C");
ui.util.ColorProvider._COLORS.push("#CC8C5C");
ui.util.ColorProvider._LAST_COLORS_USED = new ui.util.FixedSizeArray(10);
ui.widget.AndOrToggle = window.jQuery;
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new ui.exception.Exception("Root of AndOrToggle must be a div element");
		selfElement.addClass("andOrToggle");
		var or = new ui.jq.JQ("<div class='ui-widget-content ui-state-active ui-corner-top any'>Any</div>");
		var and = new ui.jq.JQ("<div class='ui-widget-content ui-corner-bottom all'>All</div>");
		selfElement.append(or).append(and);
		var children = selfElement.children();
		children.hover(function(evt) {
			$(this).addClass("ui-state-hover");
		},function() {
			$(this).removeClass("ui-state-hover");
		}).click(function(evt) {
			children.toggleClass("ui-state-active");
			self._fireFilter();
		});
		selfElement.data("getNode",function() {
			var root;
			if(or.hasClass("ui-state-active")) root = new ui.model.Or(); else root = new ui.model.And();
			return root;
		});
	}, _fireFilter : function() {
		var selfElement = this.element;
		var filter = js.Boot.__cast(selfElement.closest("#filter") , ui.widget.FilterComp);
		filter.filterComp("fireFilter");
	}, destroy : function() {
		ui.jq.JQ.Widget.prototype.destroy.call(this);
	}};
};
ui.jq.JQ.widget("ui.andOrToggle",defineWidget());
ui.widget.FilterableComponent = window.jQuery;
ui.widget.FilterCombination = window.jQuery;
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new ui.exception.Exception("Root of FilterCombination must be a div element");
		selfElement.data("getNode",function() {
			var root = (selfElement.children(".andOrToggle").data("getNode"))();
			root.type = self.options.type;
			var filterables = selfElement.children(".filterable");
			filterables.each(function(idx,el) {
				var filterable = new ui.widget.FilterableComponent(el);
				var node = (filterable.data("getNode"))();
				root.addNode(node);
			});
			return root;
		});
		self._filterables = new ui.observable.ObservableSet(function(fc) {
			return (js.Boot.__cast(fc , ui.jq.JQ)).attr("id");
		});
		self._filterables.listen(function(fc,evt) {
			if(evt.isAdd()) self._add(fc); else if(evt.isUpdate()) {
			} else if(evt.isDelete()) self._remove(fc);
		});
		selfElement.addClass("ui-state-highlight connectionDT labelDT filterable dropCombiner filterCombination filterTrashable container shadow" + ui.widget.Widgets.getWidgetClasses());
		selfElement.position({ my : "bottom right", at : "left top", of : self.options.event, collision : "flipfit", within : "#filter"});
		selfElement.data("clone",function(filterableComp,isDragByHelper,containment) {
			if(containment == null) containment = false;
			if(isDragByHelper == null) isDragByHelper = false;
			var fc = js.Boot.__cast(filterableComp , ui.widget.FilterCombination);
			return fc;
		});
		var toggle = new ui.widget.AndOrToggle("<div class='andOrToggle'></div>").andOrToggle();
		selfElement.append(toggle);
		(js.Boot.__cast(selfElement , ui.jq.JQDraggable)).draggable({ containment : "parent", distance : 10, scroll : false});
		(js.Boot.__cast(selfElement , ui.jq.JQDroppable)).droppable({ accept : function(d) {
			return self.options.type == "LABEL" && d["is"](".label") || self.options.type == "CONNECTION" && d["is"](".connectionAvatar");
		}, activeClass : "ui-state-hover", hoverClass : "ui-state-active", greedy : true, drop : function(event,_ui) {
			var clone = (_ui.draggable.data("clone"))(_ui.draggable,false,"#filter");
			clone.addClass("filterTrashable " + _ui.draggable.data("dropTargetClass")).appendTo(selfElement).css("position","absolute").css({ left : "", top : ""});
			self.addFilterable(clone);
			selfElement.position({ collision : "flipfit", within : "#filter"});
		}, tolerance : "pointer"});
	}, position : function() {
		var self = this;
		var selfElement = this.element;
		selfElement.position({ my : "center", at : "center", of : self.options.event, collision : "flipfit", within : "#filter"});
	}, addFilterable : function(filterable) {
		var self = this;
		self._filterables.add(filterable);
		if(self._filterables.size() > 1) self._fireFilter();
	}, removeFilterable : function(filterable) {
		var self = this;
		self._filterables["delete"](filterable);
	}, _add : function(filterable) {
		var self = this;
		var selfElement = this.element;
		var jq = js.Boot.__cast(filterable , ui.jq.JQ);
		jq.appendTo(selfElement).css("position","absolute").css({ left : "", top : ""});
		self._layout();
	}, _remove : function(filterable) {
		var self = this;
		var selfElement = this.element;
		var iter = self._filterables.iterator();
		if(iter.hasNext()) {
			var filterable1 = iter.next();
			if(iter.hasNext()) self._layout(); else {
				var jq = js.Boot.__cast(filterable1 , ui.jq.JQ);
				var position = jq.offset();
				jq.appendTo(selfElement.parent()).offset(position);
				selfElement.remove();
				self.destroy();
			}
		} else {
			self.destroy();
			selfElement.remove();
		}
	}, _layout : function() {
		var self = this;
		var selfElement = this.element;
		var filterableConns = new ui.observable.FilteredSet(self._filterables,function(fc) {
			return fc.hasClass("connectionAvatar");
		});
		var filterableLabels = new ui.observable.FilteredSet(self._filterables,function(fc) {
			return fc.hasClass("label");
		});
		var leftPadding = 30;
		var topPadding = 6;
		var typeGap = 10;
		var rowGap = 50;
		var iterC = filterableConns.iterator();
		var connCount = 0;
		var connPairs = 0;
		while(iterC.hasNext()) {
			connCount++;
			connPairs = (connCount / 2 | 0) + connCount % 2;
			var connAvatar = iterC.next();
			connAvatar.css({ left : leftPadding + 35 * (connPairs - 1), top : topPadding + rowGap * ((connCount + 1) % 2)});
		}
		var connectionWidth = 35 * connPairs;
		var iterL = filterableLabels.iterator();
		var labelCount = 0;
		var labelPairs = 0;
		while(iterL.hasNext()) {
			labelCount++;
			labelPairs = (labelCount / 2 | 0) + labelCount % 2;
			var labelComp = iterL.next();
			labelComp.css({ left : leftPadding + connectionWidth + typeGap + 135 * (labelPairs - 1), top : topPadding + rowGap * ((labelCount + 1) % 2)});
		}
		selfElement.css({ width : 35 * connPairs + 135 * labelPairs + "px", 'min-width' : 35 * connPairs + 135 * labelPairs + "px"});
	}, _fireFilter : function() {
		var selfElement = this.element;
		var filter = js.Boot.__cast(selfElement.parent("#filter") , ui.widget.FilterComp);
		filter.filterComp("fireFilter");
	}, destroy : function() {
		ui.jq.JQ.Widget.prototype.destroy.call(this);
	}};
};
ui.jq.JQ.widget("ui.filterCombination",defineWidget());
ui.widget.ConnectionAvatar = window.jQuery;
var defineWidget = function() {
	return { options : { connection : null, isDragByHelper : true, containment : false, dndEnabled : true, classes : null, cloneFcn : function(filterableComp,isDragByHelper,containment) {
		if(containment == null) containment = false;
		if(isDragByHelper == null) isDragByHelper = false;
		var connectionAvatar = js.Boot.__cast(filterableComp , ui.widget.ConnectionAvatar);
		if(connectionAvatar.hasClass("clone")) return connectionAvatar;
		var clone = new ui.widget.ConnectionAvatar("<div class='clone'></div>");
		clone.connectionAvatar({ connection : connectionAvatar.connectionAvatar("option","connection"), isDragByHelper : isDragByHelper, containment : containment, classes : connectionAvatar.connectionAvatar("option","classes"), cloneFcn : connectionAvatar.connectionAvatar("option","cloneFcn"), dropTargetClass : connectionAvatar.connectionAvatar("option","dropTargetClass"), helperFcn : connectionAvatar.connectionAvatar("option","helperFcn")});
		return clone;
	}, dropTargetClass : "connectionDT", helperFcn : function() {
		var clone = $(this).clone();
		return clone.children("img").addClass("connectionDraggingImg");
	}}, _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new ui.exception.Exception("Root of ConnectionAvatar must be a div element");
		selfElement.attr("id","connavatar_" + StringTools.htmlEscape(self.options.connection.lname + self.options.connection.fname));
		selfElement.addClass(ui.widget.Widgets.getWidgetClasses() + " connectionAvatar filterable").attr("title",self.options.connection.fname + " " + self.options.connection.lname);
		var img = new ui.jq.JQ("<img src='" + self.options.connection.imgSrc + "' class='shadow'/>");
		selfElement.append(img);
		(js.Boot.__cast(selfElement , ui.jq.JQTooltip)).tooltip();
		if(!self.options.dndEnabled) img.mousedown(function(evt) {
			return false;;
		}); else {
			selfElement.addClass("filterable");
			selfElement.data("clone",self.options.cloneFcn);
			selfElement.data("dropTargetClass",self.options.dropTargetClass);
			selfElement.data("getNode",function() {
				var node = new ui.model.ContentNode();
				node.type = "CONNECTION";
				node.contentUid = self.options.connection.uid;
				node.filterable = self.options.connection;
				return node;
			});
			var helper = "clone";
			if(!self.options.isDragByHelper) helper = "original"; else if(self.options.helperFcn != null && Reflect.isFunction(self.options.helperFcn)) helper = self.options.helperFcn;
			(js.Boot.__cast(selfElement , ui.jq.JQDraggable)).draggable({ containment : self.options.containment, helper : helper, distance : 10, scroll : false});
			(js.Boot.__cast(selfElement , ui.jq.JQDroppable)).droppable({ accept : function(d) {
				return !$(this).parent()["is"](".filterCombination") && $(this).parent()["is"](".dropCombiner") && d["is"](".connectionAvatar");
			}, activeClass : "ui-state-hover", hoverClass : "ui-state-active", greedy : true, drop : function(event,_ui) {
				var filterCombiner = new ui.widget.FilterCombination("<div></div>");
				filterCombiner.appendTo($(this).parent());
				filterCombiner.filterCombination({ event : event, type : "CONNECTION"});
				filterCombiner.filterCombination("addFilterable",$(this));
				var clone = (_ui.draggable.data("clone"))(_ui.draggable,false,"#filter");
				clone.addClass("filterTrashable " + _ui.draggable.data("dropTargetClass"));
				filterCombiner.filterCombination("addFilterable",clone);
				filterCombiner.filterCombination("position");
			}, tolerance : "pointer"});
		}
	}, update : function() {
		var self = this;
		var selfElement = this.element;
		selfElement.children("img").attr("src",self.options.connection.imgSrc);
		selfElement.children("div").text(self.options.connection.fname + " " + self.options.connection.lname);
	}, destroy : function() {
		ui.jq.JQ.Widget.prototype.destroy.call(this);
	}};
};
ui.jq.JQ.widget("ui.connectionAvatar",defineWidget());
ui.widget.ConnectionComp = window.jQuery;
var defineWidget = function() {
	return { options : { connection : null, classes : null}, _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new ui.exception.Exception("Root of ConnectionComp must be a div element");
		selfElement.addClass(ui.widget.Widgets.getWidgetClasses() + " connection container boxsizingBorder");
		self._avatar = new ui.widget.ConnectionAvatar("<div class='avatar'></div>").connectionAvatar({ connection : self.options.connection, dndEnabled : true, isDragByHelper : true, containment : false});
		selfElement.append(self._avatar);
		selfElement.append("<div class='name'>" + self.options.connection.fname + " " + self.options.connection.lname + "</div>");
	}, update : function() {
		var self = this;
		var selfElement = this.element;
		selfElement.children("img").attr("src",self.options.connection.imgSrc);
		selfElement.children("div").text(self.options.connection.fname + " " + self.options.connection.lname);
		self._avatar.connectionAvatar("update");
	}, destroy : function() {
		ui.jq.JQ.Widget.prototype.destroy.call(this);
	}};
};
ui.jq.JQ.widget("ui.connectionComp",defineWidget());
ui.widget.ConnectionsList = window.jQuery;
var defineWidget = function() {
	return { options : { itemsClass : null}, _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new ui.exception.Exception("Root of ConnectionsList must be a div element");
		selfElement.addClass(ui.widget.Widgets.getWidgetClasses());
		ui.model.EventModel.addListener("aliasLoaded",new ui.model.EventListener(function(alias) {
			self._setConnections(alias.connections);
		}));
		ui.model.EventModel.addListener("user",new ui.model.EventListener(function(user) {
			self._setConnections(user._getCurrentAlias().connections);
		}));
	}, _setConnections : function(connections) {
		var self = this;
		var selfElement = this.element;
		selfElement.children(".connection").remove();
		var spacer = selfElement.children("#sideRightSpacer");
		self.connectionsMap = new ui.observable.MappedSet(connections,function(conn) {
			return new ui.widget.ConnectionComp("<div></div>").connectionComp({ connection : conn});
		});
		self.connectionsMap.listen(function(connComp,evt) {
			if(evt.isAdd()) spacer.before(connComp); else if(evt.isUpdate()) connComp.connectionComp("update"); else if(evt.isDelete()) connComp.remove();
		});
	}, destroy : function() {
		ui.jq.JQ.Widget.prototype.destroy.call(this);
	}};
};
ui.jq.JQ.widget("ui.connectionsList",defineWidget());
ui.widget.LabelComp = window.jQuery;
var defineWidget = function() {
	return { options : { label : null, isDragByHelper : true, containment : false, dndEnabled : true, classes : null, dropTargetClass : "labelDT", cloneFcn : function(filterableComp,isDragByHelper,containment) {
		if(containment == null) containment = false;
		if(isDragByHelper == null) isDragByHelper = false;
		var labelComp = js.Boot.__cast(filterableComp , ui.widget.LabelComp);
		if(labelComp.hasClass("clone")) return labelComp;
		var clone = new ui.widget.LabelComp("<div class='clone'></div>");
		clone.labelComp({ label : labelComp.labelComp("option","label"), isDragByHelper : isDragByHelper, containment : containment, classes : labelComp.labelComp("option","classes"), cloneFcn : labelComp.labelComp("option","cloneFcn"), dropTargetClass : labelComp.labelComp("option","dropTargetClass")});
		return clone;
	}}, _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new ui.exception.Exception("Root of LabelComp must be a div element");
		selfElement.addClass("label labelComp ").attr("id",StringTools.htmlEscape(self.options.label.text) + "_" + ui.util.UidGenerator.create(8));
		var labelTail = new ui.jq.JQ("<div class='labelTail'></div>");
		labelTail.css("border-right-color",self.options.label.color);
		selfElement.append(labelTail);
		var labelBox = new ui.jq.JQ("<div class='labelBox shadowRight'></div>");
		labelBox.css("background",self.options.label.color);
		var labelBody = new ui.jq.JQ("<div class='labelBody'></div>");
		var labelText = new ui.jq.JQ("<div>" + self.options.label.text + "</div>");
		labelBody.append(labelText);
		labelBox.append(labelBody);
		selfElement.append(labelBox).append("<div class='clear'></div>");
		selfElement.addClass("filterable");
		if(self.options.dndEnabled) {
			selfElement.data("clone",self.options.cloneFcn);
			selfElement.data("dropTargetClass",self.options.dropTargetClass);
			selfElement.data("getNode",function() {
				var node = new ui.model.ContentNode();
				node.type = "LABEL";
				node.contentUid = self.options.label.uid;
				node.filterable = self.options.label;
				return node;
			});
			var helper = "clone";
			if(!self.options.isDragByHelper) helper = "original"; else if(self.options.helperFcn != null && Reflect.isFunction(self.options.helperFcn)) helper = self.options.helperFcn;
			(js.Boot.__cast(selfElement , ui.jq.JQDraggable)).draggable({ containment : self.options.containment, helper : helper, distance : 10, scroll : false});
			(js.Boot.__cast(selfElement , ui.jq.JQDroppable)).droppable({ accept : function(d) {
				return !$(this).parent()["is"](".filterCombination") && $(this).parent()["is"](".dropCombiner") && d["is"](".label");
			}, activeClass : "ui-state-hover", hoverClass : "ui-state-active", greedy : true, drop : function(event,_ui) {
				var filterCombiner = new ui.widget.FilterCombination("<div></div>");
				filterCombiner.appendTo($(this).parent());
				filterCombiner.filterCombination({ event : event, type : "LABEL"});
				filterCombiner.filterCombination("addFilterable",$(this));
				var clone = (_ui.draggable.data("clone"))(_ui.draggable,false,"#filter");
				clone.addClass("filterTrashable " + _ui.draggable.data("dropTargetClass"));
				filterCombiner.filterCombination("addFilterable",clone);
				filterCombiner.filterCombination("position");
			}, tolerance : "pointer"});
		}
	}, update : function() {
		var self = this;
		var selfElement = this.element;
		selfElement.find(".labelBody").text(self.options.label.text);
	}, destroy : function() {
		ui.jq.JQ.Widget.prototype.destroy.call(this);
	}};
};
ui.jq.JQ.widget("ui.labelComp",defineWidget());
ui.widget.ContentComp = window.jQuery;
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new ui.exception.Exception("Root of ContentComp must be a div element");
		selfElement.addClass("post container shadow " + ui.widget.Widgets.getWidgetClasses());
		var postWr = new ui.jq.JQ("<section class='postWr'></section>");
		selfElement.append(postWr);
		var postContentWr = new ui.jq.JQ("<div class='postContentWr'></div>");
		postWr.append(postContentWr);
		var postContent = new ui.jq.JQ("<div class='postContent'></div>");
		postContentWr.append(postContent);
		if(self.options.content.type == "AUDIO") {
			var audio = js.Boot.__cast(self.options.content , ui.model.AudioContent);
			postContent.append(audio.title + "<br/>");
			var audioControls = new ui.jq.JQ("<audio controls></audio>");
			postContent.append(audioControls);
			audioControls.append("<source src='" + audio.audioSrc + "' type='" + audio.audioType + "'>Your browser does not support the audio element.");
		} else if(self.options.content.type == "IMAGE") {
			var img = js.Boot.__cast(self.options.content , ui.model.ImageContent);
			postContent.append("<img alt='" + img.caption + "' src='" + img.imgSrc + "'/>");
		}
		var postConnections = new ui.jq.JQ("<aside class='postConnections'></aside>");
		postWr.append(postConnections);
		var connIter = self.options.content.connections.iterator();
		while(connIter.hasNext()) {
			var connection = connIter.next();
			var connAvatar = new ui.widget.ConnectionAvatar("<div></div>").connectionAvatar({ dndEnabled : false, connection : connection});
			postConnections.append(connAvatar);
		}
		var postLabels = new ui.jq.JQ("<aside class='postLabels'></div>");
		postWr.append(postLabels);
		var labelIter = self.options.content.labels.iterator();
		while(labelIter.hasNext()) {
			var label = labelIter.next();
			var labelComp = new ui.widget.LabelComp("<div></div>").labelComp({ dndEnabled : false, label : label});
			postLabels.append(labelComp);
		}
	}, destroy : function() {
		ui.jq.JQ.Widget.prototype.destroy.call(this);
	}};
};
ui.jq.JQ.widget("ui.contentComp",defineWidget());
ui.widget.ContentFeed = window.jQuery;
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new ui.exception.Exception("Root of ContentFeed must be a div element");
		selfElement.addClass("container " + ui.widget.Widgets.getWidgetClasses()).css("padding","10px");
		selfElement.append("<div id='middleContainerSpacer' class='spacer'></div>");
		self.content = new ui.observable.MappedSet(self.options.content,function(content) {
			return new ui.widget.ContentComp("<div></div>").contentComp({ content : content});
		});
		self.content.listen(function(contentComp,evt) {
			if(evt.isAdd()) new ui.jq.JQ("#postInput").after(contentComp); else if(evt.isUpdate()) contentComp.contentComp("update"); else if(evt.isDelete()) contentComp.remove();
		});
	}, destroy : function() {
		ui.jq.JQ.Widget.prototype.destroy.call(this);
	}};
};
ui.jq.JQ.widget("ui.contentFeed",defineWidget());
ui.widget.FilterComp = window.jQuery;
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new ui.exception.Exception("Root of FilterComp must be a div element");
		selfElement.addClass("connectionDT labelDT dropCombiner " + ui.widget.Widgets.getWidgetClasses());
		var toggle = new ui.widget.AndOrToggle("<div class='rootToggle andOrToggle'></div>").andOrToggle();
		selfElement.append(toggle);
		(js.Boot.__cast(selfElement , ui.jq.JQDroppable)).droppable({ accept : function(d) {
			return d["is"](".filterable");
		}, activeClass : "ui-state-hover", hoverClass : "ui-state-active", drop : function(event,_ui) {
			var clone = (_ui.draggable.data("clone"))(_ui.draggable,false,"#filter");
			var cloneOffset = clone.offset();
			clone.addClass("filterTrashable " + _ui.draggable.data("dropTargetClass"));
			var isInFilterCombination = _ui.draggable.parent(".filterCombination").length > 0;
			if(isInFilterCombination) {
				var filterCombination = js.Boot.__cast(_ui.draggable.parent() , ui.widget.FilterCombination);
				$(this).append(clone);
				filterCombination.filterCombination("removeFilterable",_ui.draggable);
			} else $(this).append(clone);
			clone.css({ position : "absolute"});
			if(cloneOffset.top != 0) clone.offset(cloneOffset); else clone.position({ my : "left top", at : "left top", of : _ui.helper, collision : "flipfit", within : "#filter"});
			self.fireFilter();
		}});
		var trashDiv = selfElement.children("#filterTrash");
		var trashCan = trashDiv.children("img");
		var grow = function(duration) {
			if(duration == null) duration = 300;
			trashDiv.animate({ width : "100px"},duration);
			trashCan.animate({ 'max-width' : "100px", 'margin-top' : "35px"},duration);
		};
		var shrink = function() {
			trashDiv.animate({ width : "50px"},200);
			trashCan.animate({ 'max-width' : "50px", 'margin-top' : "50px"},200);
		};
		(js.Boot.__cast(trashDiv , ui.jq.JQDroppable)).droppable({ accept : function(d) {
			return d["is"](".filterTrashable");
		}, activeClass : "ui-state-hover", hoverClass : "ui-state-active", greedy : true, drop : function(event,_ui) {
			_ui.draggable.remove();
			shrink();
			self.fireFilter();
		}, tolerance : "pointer", over : function(event,_ui) {
			grow(300);
		}, out : function(event,_ui) {
			shrink();
		}}).tooltip().dblclick(function(event) {
			grow(150);
			var trashables = selfElement.children(".filterTrashable");
			trashables.position({ my : "center", at : "center", of : trashCan, using : function(pos) {
				$(this).animate({ left : pos.left, top : pos.top},500,function() {
					$(this).remove();
					shrink();
				});
			}});
			self.fireFilter();
		});
	}, fireFilter : function() {
		var self = this;
		var selfElement = this.element;
		var root = (selfElement.children(".rootToggle").data("getNode"))();
		root.type = "ROOT";
		var filterables = selfElement.children(".filterable");
		filterables.each(function(idx,el) {
			var filterable = new ui.widget.FilterableComponent(el);
			var node = (filterable.data("getNode"))();
			root.addNode(node);
		});
		ui.model.EventModel.change("runFilter",new ui.model.Filter(root));
	}, destroy : function() {
		ui.jq.JQ.Widget.prototype.destroy.call(this);
	}};
};
ui.jq.JQ.widget("ui.filterComp",defineWidget());
ui.widget.LabelTreeBranch = window.jQuery;
var defineWidget = function() {
	return { options : { label : null, children : null, classes : null}, _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new ui.exception.Exception("Root of LabelTreeBranch must be a div element");
		selfElement.addClass("labelTreeBranch ");
		var expander = new ui.jq.JQ("<div class='labelTreeExpander' style='visibility:hidden;'>+</div>");
		selfElement.append(expander);
		var label = new ui.widget.LabelComp("<div></div>").labelComp({ label : self.options.label, isDragByHelper : true, containment : false});
		selfElement.append(label);
		label.hover(function() {
			if(self.options.children.iterator().hasNext()) expander.css("visibility","visible");
		},function() {
			expander.css("visibility","hidden");
		});
		if(self.options.children != null) {
			var labelChildren = new ui.widget.LabelTree("<div class='labelChildren' style='display: none;'></div>");
			labelChildren.labelTree({ labels : self.options.children});
			selfElement.append(labelChildren);
			label.click(function(evt) {
				labelChildren.toggle();
				ui.model.EventModel.change("fitWindow");
			});
		}
	}, update : function() {
		var self = this;
		var selfElement = this.element;
		selfElement.find(".labelBody").text(self.options.label.text);
	}, destroy : function() {
		ui.jq.JQ.Widget.prototype.destroy.call(this);
	}};
};
ui.jq.JQ.widget("ui.labelTreeBranch",defineWidget());
ui.widget.LabelTree = window.jQuery;
var defineWidget = function() {
	return { options : { labels : null, itemsClass : null}, _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new ui.exception.Exception("Root of LabelTree must be a div element");
		selfElement.addClass("labelTree " + ui.widget.Widgets.getWidgetClasses());
		self.labels = new ui.observable.MappedSet(self.options.labels,function(label) {
			return new ui.widget.LabelTreeBranch("<div></div>").labelTreeBranch({ label : label, children : new ui.observable.FilteredSet(ui.AgentUi.USER._getCurrentAlias().labels,function(child) {
				return child.parentUid == label.uid;
			})});
		});
		self.labels.listen(function(labelTreeBranch,evt) {
			if(evt.isAdd()) selfElement.append(labelTreeBranch); else if(evt.isUpdate()) labelTreeBranch.labelTreeBranch("update"); else if(evt.isDelete()) labelTreeBranch.remove();
		});
	}, destroy : function() {
		ui.jq.JQ.Widget.prototype.destroy.call(this);
	}};
};
ui.jq.JQ.widget("ui.labelTree",defineWidget());
ui.widget.LabelsList = window.jQuery;
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new ui.exception.Exception("Root of LabelsList must be a div element");
		selfElement.addClass("icontainer labelsList " + ui.widget.Widgets.getWidgetClasses());
		ui.model.EventModel.addListener("aliasLoaded",new ui.model.EventListener(function(alias) {
			self._setLabels(alias.labels);
		}));
		ui.model.EventModel.addListener("user",new ui.model.EventListener(function(user) {
			self._setLabels(user._getCurrentAlias().labels);
		}));
	}, _setLabels : function(labels) {
		var self = this;
		var selfElement = this.element;
		selfElement.children(".labelTree").remove();
		var labelTree = new ui.widget.LabelTree("<div id='labels' class='labelDT'></div>").labelTree({ labels : new ui.observable.FilteredSet(labels,function(label) {
			return ui.helper.StringHelper.isBlank(label.parentUid);
		})});
		selfElement.prepend(labelTree);
	}, destroy : function() {
		ui.jq.JQ.Widget.prototype.destroy.call(this);
	}};
};
ui.jq.JQ.widget("ui.labelsList",defineWidget());
ui.widget.UploadComp = window.jQuery;
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new ui.exception.Exception("Root of UploadComp must be a div element");
		selfElement.addClass("uploadComp container " + ui.widget.Widgets.getWidgetClasses());
		var filesUpload = new ui.jq.JQ("<input id='files-upload' type='file' multiple style='float: left;margin-top: 25px;margin-left: 25px;'/>").appendTo(selfElement);
		filesUpload.change(function(evt) {
			self._traverseFiles(this.files);
		});
		selfElement.on("dragleave",null,function(evt,d) {
			ui.AgentUi.LOGGER.debug("dragleave");
			var target = evt.target;
			if(target != null && target == selfElement[0]) $(this).removeClass("drop");
			evt.preventDefault();
			evt.stopPropagation();
		});
		selfElement.on("dragenter",null,function(evt,d) {
			ui.AgentUi.LOGGER.debug("dragenter");
			$(this).addClass("over");
			evt.preventDefault();
			evt.stopPropagation();
		});
		selfElement.on("dragover",null,function(evt,d) {
			ui.AgentUi.LOGGER.debug("dragover");
			evt.preventDefault();
			evt.stopPropagation();
		});
		selfElement.on("drop",null,function(evt,d) {
			ui.AgentUi.LOGGER.debug("drop");
			self._traverseFiles(evt.originalEvent.dataTransfer.files);
			$(this).removeClass("drop");
			evt.preventDefault();
			evt.stopPropagation();
		});
	}, _uploadFile : function(file) {
		var self = this;
		var selfElement = this.element;
		ui.AgentUi.LOGGER.debug("upload " + Std.string(file.name));
		if(typeof FileReader !== 'undefined' && new EReg("image","i").match(file.type)) {
			var img = new ui.jq.JQ("<img style='max-height: 90px;'/>").appendTo(selfElement);
			var reader = new FileReader();
			reader.onload = function(evt) {
				img.attr("src",evt.target.result);
			};
			reader.readAsDataURL(file);
		}
	}, _traverseFiles : function(files) {
		ui.AgentUi.LOGGER.debug("traverse the files");
		var self = this;
		if(ui.helper.ArrayHelper.hasValues(files)) {
			var _g1 = 0, _g = files.length;
			while(_g1 < _g) {
				var i = _g1++;
				self._uploadFile(files[i]);
			}
		} else {
		}
	}, destroy : function() {
		ui.jq.JQ.Widget.prototype.destroy.call(this);
	}};
};
ui.jq.JQ.widget("ui.uploadComp",defineWidget());
ui.widget.PostComp = window.jQuery;
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new ui.exception.Exception("Root of PostComp must be a div element");
		selfElement.addClass("postComp container shadow " + ui.widget.Widgets.getWidgetClasses());
		var section = new ui.jq.JQ("<section id='postSection'></section>").appendTo(selfElement);
		var textInput = new ui.jq.JQ("<div class='postContainer'></div>").appendTo(section);
		var ta = new ui.jq.JQ("<textarea class='boxsizingBorder ui-corner-all container' style='resize: none;'></textarea>").appendTo(textInput);
		var mediaInput = new ui.widget.UploadComp("<div class='postContainer boxsizingBorder'></div>").uploadComp();
		mediaInput.appendTo(section);
		var label = new ui.jq.JQ("<aside class='label'><span>Post:</span></aside>").appendTo(section);
		var tabs = new ui.jq.JQ("<aside class='tabs'></aside>").appendTo(section);
		var fcn = function(evt) {
			tabs.children(".active").removeClass("active");
			$(this).addClass("active");
		};
		var textTab = new ui.jq.JQ("<span class='ui-icon ui-icon-document active ui-corner-left'></span>").appendTo(tabs).click(function(evt) {
			tabs.children(".active").removeClass("active");
			$(this).addClass("active");
			textInput.show();
			mediaInput.hide();
		});
		var imgTab = new ui.jq.JQ("<span class='ui-icon ui-icon-image ui-corner-left'></span>").appendTo(tabs).appendTo(tabs).click(function(evt) {
			tabs.children(".active").removeClass("active");
			$(this).addClass("active");
			textInput.hide();
			mediaInput.show();
		});
		mediaInput.hide();
	}, destroy : function() {
		ui.jq.JQ.Widget.prototype.destroy.call(this);
	}};
};
ui.jq.JQ.widget("ui.postComp",defineWidget());
ui.widget.UserComp = window.jQuery;
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new ui.exception.Exception("Root of UserComp must be a div element");
		selfElement.addClass("ocontainer shadow ");
		selfElement.append(new ui.jq.JQ("<div class='container'></div>"));
		ui.model.EventModel.addListener("user",new ui.model.EventListener(function(user) {
			self.user = user;
			self._setUser();
		}));
		ui.model.EventModel.addListener("loadAlias",new ui.model.EventListener(function(alias) {
			self._setUser();
		}));
	}, _setUser : function() {
		var self = this;
		var selfElement = this.element;
		var user = self.user;
		var container = selfElement.children(".container").empty();
		var imgSrc;
		if(ui.helper.StringHelper.isNotBlank(user._getCurrentAlias().imgSrc)) imgSrc = user._getCurrentAlias().imgSrc; else imgSrc = user.imgSrc;
		var img = new ui.jq.JQ("<img alt='user' src='" + imgSrc + "' class='shadow'/>");
		container.append(img);
		var userIdTxt = new ui.jq.JQ("<div class='userIdTxt'></div>");
		container.append(userIdTxt);
		userIdTxt.append("<strong>" + user.fname + " " + user.lname + "</strong>").append("<br/>").append("<font style='font-size:12px'>" + user._getCurrentAlias().label + "</font>");
		var changeDiv = new ui.jq.JQ("<div class='ui-helper-clearfix'></div>");
		var change = new ui.jq.JQ("<a class='aliasToggle'>Change Alias</a>");
		changeDiv.append(change);
		container.append(changeDiv);
		var aliases = new ui.jq.JQ("<div class='aliases ocontainer nonmodalPopup' style='position: absolute;'></div>");
		container.append(aliases);
		var iter = user.aliases.iterator();
		while(iter.hasNext()) {
			var alias = [iter.next()];
			var btn = new ui.jq.JQ("<div id='" + alias[0].uid + "' class='aliasBtn ui-widget ui-button boxsizingBorder ui-state-default'>" + alias[0].label + "</div>");
			if(alias[0].uid == user._getCurrentAlias().uid) btn.addClass("ui-state-active");
			aliases.append(btn);
			btn.hover((function() {
				return function() {
					$(this).addClass("ui-state-hover");
				};
			})(),(function() {
				return function() {
					$(this).removeClass("ui-state-hover");
				};
			})()).click((function(alias) {
				return function(evt) {
					ui.model.EventModel.change("loadAlias",alias[0].uid);
				};
			})(alias));
		}
		aliases.position({ my : "left top", at : "right-6px center", of : selfElement});
		aliases.hide();
		change.click(function(evt) {
			aliases.toggle();
			evt.stopPropagation();
		});
	}, destroy : function() {
		ui.jq.JQ.Widget.prototype.destroy.call(this);
	}};
};
ui.jq.JQ.widget("ui.userComp",defineWidget());
ui.api.ProtocolMessage.__rtti = "<class path=\"ui.api.ProtocolMessage\" params=\"\">\n\t<implements path=\"haxe.rtti.Infos\"/>\n\t<msgType public=\"1\" set=\"null\"><e path=\"ui.api.MsgType\"/></msgType>\n\t<contents public=\"1\"><d/></contents>\n\t<toJsonString public=\"1\" set=\"method\" line=\"9\"><f a=\"\"><c path=\"String\"/></f></toJsonString>\n\t<getContents public=\"1\" params=\"T\" set=\"method\" line=\"13\"><f a=\"\"><c path=\"getContents.T\"/></f></getContents>\n</class>";
ui.api.Payload.__rtti = "<class path=\"ui.api.Payload\" params=\"\" module=\"ui.api.ProtocolMessage\" interface=\"1\">\n\t<implements path=\"haxe.rtti.Infos\"/>\n\t<haxe_dynamic><d/></haxe_dynamic>\n</class>";
ui.api.InitializeSessionRequest.__rtti = "<class path=\"ui.api.InitializeSessionRequest\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"/>\n\t<new public=\"1\" set=\"method\" line=\"27\"><f a=\"\"><e path=\"Void\"/></f></new>\n\t<haxe_doc>Initialize Session Request/Response</haxe_doc>\n</class>";
ui.api.InitializeSessionResponse.__rtti = "<class path=\"ui.api.InitializeSessionResponse\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"/>\n\t<new public=\"1\" set=\"method\" line=\"38\"><f a=\"\"><e path=\"Void\"/></f></new>\n</class>";
ui.api.CloseSessionRequest.__rtti = "<class path=\"ui.api.CloseSessionRequest\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"/>\n\t<new public=\"1\" set=\"method\" line=\"57\"><f a=\"\"><e path=\"Void\"/></f></new>\n\t<haxe_doc>Close Session Request/Response</haxe_doc>\n</class>";
ui.api.CloseSessionResponse.__rtti = "<class path=\"ui.api.CloseSessionResponse\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"/>\n\t<new public=\"1\" set=\"method\" line=\"69\"><f a=\"\"><e path=\"Void\"/></f></new>\n</class>";
ui.api.EvalRequest.__rtti = "<class path=\"ui.api.EvalRequest\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"/>\n\t<new public=\"1\" set=\"method\" line=\"83\"><f a=\"\"><e path=\"Void\"/></f></new>\n\t<haxe_doc>Evaluate Request/Response</haxe_doc>\n</class>";
ui.api.EvalResponse.__rtti = "<class path=\"ui.api.EvalResponse\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"/>\n\t<new public=\"1\" set=\"method\" line=\"96\"><f a=\"\"><e path=\"Void\"/></f></new>\n</class>";
ui.api.EvalComplete.__rtti = "<class path=\"ui.api.EvalComplete\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"/>\n\t<new public=\"1\" set=\"method\" line=\"102\"><f a=\"\"><e path=\"Void\"/></f></new>\n</class>";
ui.api.EvalError.__rtti = "<class path=\"ui.api.EvalError\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"/>\n\t<new public=\"1\" set=\"method\" line=\"115\"><f a=\"\"><e path=\"Void\"/></f></new>\n</class>";
ui.api.StopEvalRequest.__rtti = "<class path=\"ui.api.StopEvalRequest\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"/>\n\t<new public=\"1\" set=\"method\" line=\"131\"><f a=\"\"><e path=\"Void\"/></f></new>\n\t<haxe_doc>Stop Evaluation Request/Response</haxe_doc>\n</class>";
ui.api.StopEvalResponse.__rtti = "<class path=\"ui.api.StopEvalResponse\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"/>\n\t<new public=\"1\" set=\"method\" line=\"137\"><f a=\"\"><e path=\"Void\"/></f></new>\n</class>";
ui.api.TestDao.initialized = false;
ui.api.TestDao._lastRandom = 0;
ui.model.ModelObj.__rtti = "<class path=\"ui.model.ModelObj\" params=\"T\">\n\t<implements path=\"haxe.rtti.Infos\"/>\n\t<identifier public=\"1\" params=\"T\" set=\"method\" line=\"9\" static=\"1\"><f a=\"t\">\n\t<a><uid><c path=\"String\"/></uid></a>\n\t<c path=\"String\"/>\n</f></identifier>\n\t<uid public=\"1\"><c path=\"String\"/></uid>\n</class>";
ui.model.User.__rtti = "<class path=\"ui.model.User\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.ModelObj\"><c path=\"ui.model.User\"/></extends>\n\t<fname public=\"1\"><c path=\"String\"/></fname>\n\t<lname public=\"1\"><c path=\"String\"/></lname>\n\t<imgSrc public=\"1\">\n\t\t<c path=\"String\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</imgSrc>\n\t<aliases public=\"1\"><c path=\"ui.observable.ObservableSet\"><c path=\"ui.model.Alias\"/></c></aliases>\n\t<currentAlias public=\"1\" get=\"_getCurrentAlias\" set=\"_setCurrentAlias\"><c path=\"ui.model.Alias\"/></currentAlias>\n\t<_getCurrentAlias set=\"method\" line=\"23\"><f a=\"\"><c path=\"ui.model.Alias\"/></f></_getCurrentAlias>\n\t<_setCurrentAlias set=\"method\" line=\"30\"><f a=\"alias\">\n\t<c path=\"ui.model.Alias\"/>\n\t<c path=\"ui.model.Alias\"/>\n</f></_setCurrentAlias>\n\t<new public=\"1\" set=\"method\" line=\"21\"><f a=\"\"><e path=\"Void\"/></f></new>\n</class>";
ui.model.Alias.__rtti = "<class path=\"ui.model.Alias\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.ModelObj\"><c path=\"ui.model.Alias\"/></extends>\n\t<imgSrc public=\"1\">\n\t\t<c path=\"String\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</imgSrc>\n\t<label public=\"1\"><c path=\"String\"/></label>\n\t<labels public=\"1\"><c path=\"ui.observable.ObservableSet\"><c path=\"ui.model.Label\"/></c></labels>\n\t<connections public=\"1\"><c path=\"ui.observable.ObservableSet\"><c path=\"ui.model.Connection\"/></c></connections>\n\t<new public=\"1\" set=\"method\" line=\"42\"><f a=\"\"><e path=\"Void\"/></f></new>\n</class>";
ui.model.Label.__rtti = "<class path=\"ui.model.Label\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.ModelObj\"><c path=\"ui.model.Connection\"/></extends>\n\t<implements path=\"ui.model.Filterable\"/>\n\t<text public=\"1\"><c path=\"String\"/></text>\n\t<parentUid public=\"1\">\n\t\t<c path=\"String\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</parentUid>\n\t<color public=\"1\">\n\t\t<c path=\"String\"/>\n\t\t<meta><m n=\":transient\"/></meta>\n\t</color>\n\t<new public=\"1\" set=\"method\" line=\"55\"><f a=\"?text\">\n\t<c path=\"String\"/>\n\t<e path=\"Void\"/>\n</f></new>\n</class>";
ui.model.Connection.__rtti = "<class path=\"ui.model.Connection\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.ModelObj\"><c path=\"ui.model.Connection\"/></extends>\n\t<implements path=\"ui.model.Filterable\"/>\n\t<fname public=\"1\"><c path=\"String\"/></fname>\n\t<lname public=\"1\"><c path=\"String\"/></lname>\n\t<imgSrc public=\"1\"><c path=\"String\"/></imgSrc>\n\t<new public=\"1\" set=\"method\" line=\"66\"><f a=\"?fname:?lname:?imgSrc\">\n\t<c path=\"String\"/>\n\t<c path=\"String\"/>\n\t<c path=\"String\"/>\n\t<e path=\"Void\"/>\n</f></new>\n</class>";
ui.model.Content.__rtti = "<class path=\"ui.model.Content\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.ModelObj\"><c path=\"ui.model.Content\"/></extends>\n\t<type public=\"1\"><c path=\"String\"/></type>\n\t<labels public=\"1\"><c path=\"ui.observable.ObservableSet\"><c path=\"ui.model.Label\"/></c></labels>\n\t<connections public=\"1\"><c path=\"ui.observable.ObservableSet\"><c path=\"ui.model.Connection\"/></c></connections>\n</class>";
ui.model.ImageContent.__rtti = "<class path=\"ui.model.ImageContent\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.Content\"/>\n\t<imgSrc public=\"1\"><c path=\"String\"/></imgSrc>\n\t<caption public=\"1\"><c path=\"String\"/></caption>\n\t<new public=\"1\" set=\"method\" line=\"83\"><f a=\"\"><e path=\"Void\"/></f></new>\n</class>";
ui.model.AudioContent.__rtti = "<class path=\"ui.model.AudioContent\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.Content\"/>\n\t<audioSrc public=\"1\"><c path=\"String\"/></audioSrc>\n\t<audioType public=\"1\"><c path=\"String\"/></audioType>\n\t<title public=\"1\"><c path=\"String\"/></title>\n\t<new public=\"1\" set=\"method\" line=\"91\"><f a=\"\"><e path=\"Void\"/></f></new>\n</class>";
ui.observable.EventType.Add = new ui.observable.EventType("Add",true,false);
ui.observable.EventType.Update = new ui.observable.EventType("Update",false,true);
ui.observable.EventType.Delete = new ui.observable.EventType("Delete",false,false);
ui.util.ColorProvider._INDEX = 0;
ui.util.UidGenerator.chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabsdefghijklmnopqrstuvwxyz0123456789";
ui.util.UidGenerator.nums = "0123456789";
ui.AgentUi.main();

//@ sourceMappingURL=AgentUi.js.map