(function ($hx_exports) { "use strict";
$hx_exports.pagent = $hx_exports.pagent || {};
$hx_exports.pagent.widget = $hx_exports.pagent.widget || {};
$hx_exports.m3 = $hx_exports.m3 || {};
$hx_exports.m3.util = $hx_exports.m3.util || {};
;$hx_exports.m3.helper = $hx_exports.m3.helper || {};
var $hxClasses = {};
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var DateTools = function() { };
$hxClasses["DateTools"] = DateTools;
DateTools.__name__ = ["DateTools"];
DateTools.__format_get = function(d,e) {
	switch(e) {
	case "%":
		return "%";
	case "C":
		return StringTools.lpad(Std.string(Std["int"](d.getFullYear() / 100)),"0",2);
	case "d":
		return StringTools.lpad(Std.string(d.getDate()),"0",2);
	case "D":
		return DateTools.__format(d,"%m/%d/%y");
	case "e":
		return Std.string(d.getDate());
	case "H":case "k":
		return StringTools.lpad(Std.string(d.getHours()),e == "H"?"0":" ",2);
	case "I":case "l":
		var hour = d.getHours() % 12;
		return StringTools.lpad(Std.string(hour == 0?12:hour),e == "I"?"0":" ",2);
	case "m":
		return StringTools.lpad(Std.string(d.getMonth() + 1),"0",2);
	case "M":
		return StringTools.lpad(Std.string(d.getMinutes()),"0",2);
	case "n":
		return "\n";
	case "p":
		if(d.getHours() > 11) return "PM"; else return "AM";
		break;
	case "r":
		return DateTools.__format(d,"%I:%M:%S %p");
	case "R":
		return DateTools.__format(d,"%H:%M");
	case "s":
		return Std.string(Std["int"](d.getTime() / 1000));
	case "S":
		return StringTools.lpad(Std.string(d.getSeconds()),"0",2);
	case "t":
		return "\t";
	case "T":
		return DateTools.__format(d,"%H:%M:%S");
	case "u":
		var t = d.getDay();
		if(t == 0) return "7"; else if(t == null) return "null"; else return "" + t;
		break;
	case "w":
		return Std.string(d.getDay());
	case "y":
		return StringTools.lpad(Std.string(d.getFullYear() % 100),"0",2);
	case "Y":
		return Std.string(d.getFullYear());
	default:
		throw "Date.format %" + e + "- not implemented yet.";
	}
};
DateTools.__format = function(d,f) {
	var r = new StringBuf();
	var p = 0;
	while(true) {
		var np = f.indexOf("%",p);
		if(np < 0) break;
		r.addSub(f,p,np - p);
		r.add(DateTools.__format_get(d,HxOverrides.substr(f,np + 1,1)));
		p = np + 2;
	}
	r.addSub(f,p,f.length - p);
	return r.b;
};
DateTools.format = function(d,f) {
	return DateTools.__format(d,f);
};
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
$hxClasses["EReg"] = EReg;
EReg.__name__ = ["EReg"];
EReg.prototype = {
	match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,split: function(s) {
		var d = "#__delim__#";
		return s.replace(this.r,d).split(d);
	}
	,replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,__class__: EReg
};
var HxOverrides = function() { };
$hxClasses["HxOverrides"] = HxOverrides;
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d < 10?"0" + d:"" + d) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
};
HxOverrides.strDate = function(s) {
	var _g = s.length;
	switch(_g) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d.setTime(0);
		d.setUTCHours(k[0]);
		d.setUTCMinutes(k[1]);
		d.setUTCSeconds(k[2]);
		return d;
	case 10:
		var k1 = s.split("-");
		return new Date(k1[0],k1[1] - 1,k1[2],0,0,0);
	case 19:
		var k2 = s.split(" ");
		var y = k2[0].split("-");
		var t = k2[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw "Invalid date format : " + s;
	}
};
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
HxOverrides.indexOf = function(a,obj,i) {
	var len = a.length;
	if(i < 0) {
		i += len;
		if(i < 0) i = 0;
	}
	while(i < len) {
		if(a[i] === obj) return i;
		i++;
	}
	return -1;
};
HxOverrides.remove = function(a,obj) {
	var i = HxOverrides.indexOf(a,obj,0);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
};
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var Lambda = function() { };
$hxClasses["Lambda"] = Lambda;
Lambda.__name__ = ["Lambda"];
Lambda.array = function(it) {
	var a = new Array();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var i = $it0.next();
		a.push(i);
	}
	return a;
};
Lambda.iter = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		f(x);
	}
};
Lambda.empty = function(it) {
	return !$iterator(it)().hasNext();
};
Lambda.indexOf = function(it,v) {
	var i = 0;
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var v2 = $it0.next();
		if(v == v2) return i;
		i++;
	}
	return -1;
};
var List = function() {
	this.length = 0;
};
$hxClasses["List"] = List;
List.__name__ = ["List"];
List.prototype = {
	add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,first: function() {
		if(this.h == null) return null; else return this.h[0];
	}
	,last: function() {
		if(this.q == null) return null; else return this.q[0];
	}
	,isEmpty: function() {
		return this.h == null;
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
	,map: function(f) {
		var b = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			b.add(f(v));
		}
		return b;
	}
	,__class__: List
};
var IMap = function() { };
$hxClasses["IMap"] = IMap;
IMap.__name__ = ["IMap"];
IMap.prototype = {
	__class__: IMap
};
Math.__name__ = ["Math"];
var Reflect = function() { };
$hxClasses["Reflect"] = Reflect;
Reflect.__name__ = ["Reflect"];
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		return null;
	}
};
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
};
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
};
Reflect.compare = function(a,b) {
	if(a == b) return 0; else if(a > b) return 1; else return -1;
};
Reflect.isEnumValue = function(v) {
	return v != null && v.__enum__ != null;
};
var Std = function() { };
$hxClasses["Std"] = Std;
Std.__name__ = ["Std"];
Std["is"] = function(v,t) {
	return js.Boot.__instanceof(v,t);
};
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
};
Std["int"] = function(x) {
	return x | 0;
};
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
Std.random = function(x) {
	if(x <= 0) return 0; else return Math.floor(Math.random() * x);
};
var StringBuf = function() {
	this.b = "";
};
$hxClasses["StringBuf"] = StringBuf;
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	add: function(x) {
		this.b += Std.string(x);
	}
	,addSub: function(s,pos,len) {
		if(len == null) this.b += HxOverrides.substr(s,pos,null); else this.b += HxOverrides.substr(s,pos,len);
	}
	,__class__: StringBuf
};
var StringTools = function() { };
$hxClasses["StringTools"] = StringTools;
StringTools.__name__ = ["StringTools"];
StringTools.htmlEscape = function(s,quotes) {
	s = s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
	if(quotes) return s.split("\"").join("&quot;").split("'").join("&#039;"); else return s;
};
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	return slen >= elen && HxOverrides.substr(s,slen - elen,elen) == end;
};
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c > 8 && c < 14 || c == 32;
};
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
};
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return HxOverrides.substr(s,0,l - r); else return s;
};
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
};
StringTools.lpad = function(s,c,l) {
	if(c.length <= 0) return s;
	while(s.length < l) s = c + s;
	return s;
};
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
};
StringTools.hex = function(n,digits) {
	var s = "";
	var hexChars = "0123456789ABCDEF";
	do {
		s = hexChars.charAt(n & 15) + s;
		n >>>= 4;
	} while(n > 0);
	if(digits != null) while(s.length < digits) s = "0" + s;
	return s;
};
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
};
var ValueType = $hxClasses["ValueType"] = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] };
ValueType.TNull = ["TNull",0];
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; return $x; };
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; return $x; };
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.__enum__ = ValueType;
ValueType.__empty_constructs__ = [ValueType.TNull,ValueType.TInt,ValueType.TFloat,ValueType.TBool,ValueType.TObject,ValueType.TFunction,ValueType.TUnknown];
var Type = function() { };
$hxClasses["Type"] = Type;
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null;
	if((o instanceof Array) && o.__enum__ == null) return Array; else return o.__class__;
};
Type.getSuperClass = function(c) {
	return c.__super__;
};
Type.getClassName = function(c) {
	var a = c.__name__;
	return a.join(".");
};
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
};
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || !cl.__name__) return null;
	return cl;
};
Type.resolveEnum = function(name) {
	var e = $hxClasses[name];
	if(e == null || !e.__ename__) return null;
	return e;
};
Type.createInstance = function(cl,args) {
	var _g = args.length;
	switch(_g) {
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
};
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) throw "No such constructor " + constr;
	if(Reflect.isFunction(f)) {
		if(params == null) throw "Constructor " + constr + " need parameters";
		return f.apply(e,params);
	}
	if(params != null && params.length != 0) throw "Constructor " + constr + " does not need parameters";
	return f;
};
Type.createEnumIndex = function(e,index,params) {
	var c = e.__constructs__[index];
	if(c == null) throw index + " is not a valid enum constructor index";
	return Type.createEnum(e,c,params);
};
Type["typeof"] = function(v) {
	var _g = typeof(v);
	switch(_g) {
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
		var c;
		if((v instanceof Array) && v.__enum__ == null) c = Array; else c = v.__class__;
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
};
Type.enumEq = function(a,b) {
	if(a == b) return true;
	try {
		if(a[0] != b[0]) return false;
		var _g1 = 2;
		var _g = a.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(!Type.enumEq(a[i],b[i])) return false;
		}
		var e = a.__enum__;
		if(e != b.__enum__ || e == null) return false;
	} catch( e1 ) {
		return false;
	}
	return true;
};
Type.allEnums = function(e) {
	return e.__empty_constructs__;
};
var XmlType = $hxClasses["XmlType"] = { __ename__ : ["XmlType"], __constructs__ : [] };
XmlType.__empty_constructs__ = [];
var Xml = function() {
};
$hxClasses["Xml"] = Xml;
Xml.__name__ = ["Xml"];
Xml.parse = function(str) {
	return haxe.xml.Parser.parse(str);
};
Xml.createElement = function(name) {
	var r = new Xml();
	r.nodeType = Xml.Element;
	r._children = new Array();
	r._attributes = new haxe.ds.StringMap();
	r.set_nodeName(name);
	return r;
};
Xml.createPCData = function(data) {
	var r = new Xml();
	r.nodeType = Xml.PCData;
	r.set_nodeValue(data);
	return r;
};
Xml.createCData = function(data) {
	var r = new Xml();
	r.nodeType = Xml.CData;
	r.set_nodeValue(data);
	return r;
};
Xml.createComment = function(data) {
	var r = new Xml();
	r.nodeType = Xml.Comment;
	r.set_nodeValue(data);
	return r;
};
Xml.createDocType = function(data) {
	var r = new Xml();
	r.nodeType = Xml.DocType;
	r.set_nodeValue(data);
	return r;
};
Xml.createProcessingInstruction = function(data) {
	var r = new Xml();
	r.nodeType = Xml.ProcessingInstruction;
	r.set_nodeValue(data);
	return r;
};
Xml.createDocument = function() {
	var r = new Xml();
	r.nodeType = Xml.Document;
	r._children = new Array();
	return r;
};
Xml.prototype = {
	get_nodeName: function() {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._nodeName;
	}
	,set_nodeName: function(n) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._nodeName = n;
	}
	,get_nodeValue: function() {
		if(this.nodeType == Xml.Element || this.nodeType == Xml.Document) throw "bad nodeType";
		return this._nodeValue;
	}
	,set_nodeValue: function(v) {
		if(this.nodeType == Xml.Element || this.nodeType == Xml.Document) throw "bad nodeType";
		return this._nodeValue = v;
	}
	,get: function(att) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._attributes.get(att);
	}
	,set: function(att,value) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		this._attributes.set(att,value);
	}
	,exists: function(att) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._attributes.exists(att);
	}
	,iterator: function() {
		if(this._children == null) throw "bad nodetype";
		return { cur : 0, x : this._children, hasNext : function() {
			return this.cur < this.x.length;
		}, next : function() {
			return this.x[this.cur++];
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
			var k1 = this.cur;
			var l1 = this.x.length;
			while(k1 < l1) {
				var n = this.x[k1];
				k1 += 1;
				if(n.nodeType == Xml.Element) {
					this.cur = k1;
					return n;
				}
			}
			return null;
		}};
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
			var k1 = this.cur;
			var l1 = this.x.length;
			while(k1 < l1) {
				var n1 = this.x[k1];
				k1++;
				if(n1.nodeType == Xml.Element && n1._nodeName == name) {
					this.cur = k1;
					return n1;
				}
			}
			return null;
		}};
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
	,addChild: function(x) {
		if(this._children == null) throw "bad nodetype";
		if(x._parent != null) HxOverrides.remove(x._parent._children,x);
		x._parent = this;
		this._children.push(x);
	}
	,toString: function() {
		if(this.nodeType == Xml.PCData) return StringTools.htmlEscape(this._nodeValue);
		if(this.nodeType == Xml.CData) return "<![CDATA[" + this._nodeValue + "]]>";
		if(this.nodeType == Xml.Comment) return "<!--" + this._nodeValue + "-->";
		if(this.nodeType == Xml.DocType) return "<!DOCTYPE " + this._nodeValue + ">";
		if(this.nodeType == Xml.ProcessingInstruction) return "<?" + this._nodeValue + "?>";
		var s = new StringBuf();
		if(this.nodeType == Xml.Element) {
			s.b += "<";
			s.b += Std.string(this._nodeName);
			var $it0 = this._attributes.keys();
			while( $it0.hasNext() ) {
				var k = $it0.next();
				s.b += " ";
				if(k == null) s.b += "null"; else s.b += "" + k;
				s.b += "=\"";
				s.add(this._attributes.get(k));
				s.b += "\"";
			}
			if(this._children.length == 0) {
				s.b += "/>";
				return s.b;
			}
			s.b += ">";
		}
		var $it1 = this.iterator();
		while( $it1.hasNext() ) {
			var x = $it1.next();
			s.add(x.toString());
		}
		if(this.nodeType == Xml.Element) {
			s.b += "</";
			s.b += Std.string(this._nodeName);
			s.b += ">";
		}
		return s.b;
	}
	,__class__: Xml
};
var haxe = {};
haxe.StackItem = $hxClasses["haxe.StackItem"] = { __ename__ : ["haxe","StackItem"], __constructs__ : ["CFunction","Module","FilePos","Method","LocalFunction"] };
haxe.StackItem.CFunction = ["CFunction",0];
haxe.StackItem.CFunction.__enum__ = haxe.StackItem;
haxe.StackItem.Module = function(m) { var $x = ["Module",1,m]; $x.__enum__ = haxe.StackItem; return $x; };
haxe.StackItem.FilePos = function(s,file,line) { var $x = ["FilePos",2,s,file,line]; $x.__enum__ = haxe.StackItem; return $x; };
haxe.StackItem.Method = function(classname,method) { var $x = ["Method",3,classname,method]; $x.__enum__ = haxe.StackItem; return $x; };
haxe.StackItem.LocalFunction = function(v) { var $x = ["LocalFunction",4,v]; $x.__enum__ = haxe.StackItem; return $x; };
haxe.StackItem.__empty_constructs__ = [haxe.StackItem.CFunction];
haxe.CallStack = function() { };
$hxClasses["haxe.CallStack"] = haxe.CallStack;
haxe.CallStack.__name__ = ["haxe","CallStack"];
haxe.CallStack.callStack = function() {
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
	var a = haxe.CallStack.makeStack(new Error().stack);
	a.shift();
	Error.prepareStackTrace = oldValue;
	return a;
};
haxe.CallStack.makeStack = function(s) {
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
};
haxe.Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
$hxClasses["haxe.Timer"] = haxe.Timer;
haxe.Timer.__name__ = ["haxe","Timer"];
haxe.Timer.delay = function(f,time_ms) {
	var t = new haxe.Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
};
haxe.Timer.prototype = {
	stop: function() {
		if(this.id == null) return;
		clearInterval(this.id);
		this.id = null;
	}
	,run: function() {
	}
	,__class__: haxe.Timer
};
haxe.ds = {};
haxe.ds.BalancedTree = function() {
};
$hxClasses["haxe.ds.BalancedTree"] = haxe.ds.BalancedTree;
haxe.ds.BalancedTree.__name__ = ["haxe","ds","BalancedTree"];
haxe.ds.BalancedTree.prototype = {
	set: function(key,value) {
		this.root = this.setLoop(key,value,this.root);
	}
	,get: function(key) {
		var node = this.root;
		while(node != null) {
			var c = this.compare(key,node.key);
			if(c == 0) return node.value;
			if(c < 0) node = node.left; else node = node.right;
		}
		return null;
	}
	,iterator: function() {
		var ret = [];
		this.iteratorLoop(this.root,ret);
		return HxOverrides.iter(ret);
	}
	,setLoop: function(k,v,node) {
		if(node == null) return new haxe.ds.TreeNode(null,k,v,null);
		var c = this.compare(k,node.key);
		if(c == 0) return new haxe.ds.TreeNode(node.left,k,v,node.right,node == null?0:node._height); else if(c < 0) {
			var nl = this.setLoop(k,v,node.left);
			return this.balance(nl,node.key,node.value,node.right);
		} else {
			var nr = this.setLoop(k,v,node.right);
			return this.balance(node.left,node.key,node.value,nr);
		}
	}
	,iteratorLoop: function(node,acc) {
		if(node != null) {
			this.iteratorLoop(node.left,acc);
			acc.push(node.value);
			this.iteratorLoop(node.right,acc);
		}
	}
	,balance: function(l,k,v,r) {
		var hl;
		if(l == null) hl = 0; else hl = l._height;
		var hr;
		if(r == null) hr = 0; else hr = r._height;
		if(hl > hr + 2) {
			if((function($this) {
				var $r;
				var _this = l.left;
				$r = _this == null?0:_this._height;
				return $r;
			}(this)) >= (function($this) {
				var $r;
				var _this1 = l.right;
				$r = _this1 == null?0:_this1._height;
				return $r;
			}(this))) return new haxe.ds.TreeNode(l.left,l.key,l.value,new haxe.ds.TreeNode(l.right,k,v,r)); else return new haxe.ds.TreeNode(new haxe.ds.TreeNode(l.left,l.key,l.value,l.right.left),l.right.key,l.right.value,new haxe.ds.TreeNode(l.right.right,k,v,r));
		} else if(hr > hl + 2) {
			if((function($this) {
				var $r;
				var _this2 = r.right;
				$r = _this2 == null?0:_this2._height;
				return $r;
			}(this)) > (function($this) {
				var $r;
				var _this3 = r.left;
				$r = _this3 == null?0:_this3._height;
				return $r;
			}(this))) return new haxe.ds.TreeNode(new haxe.ds.TreeNode(l,k,v,r.left),r.key,r.value,r.right); else return new haxe.ds.TreeNode(new haxe.ds.TreeNode(l,k,v,r.left.left),r.left.key,r.left.value,new haxe.ds.TreeNode(r.left.right,r.key,r.value,r.right));
		} else return new haxe.ds.TreeNode(l,k,v,r,(hl > hr?hl:hr) + 1);
	}
	,compare: function(k1,k2) {
		return Reflect.compare(k1,k2);
	}
	,__class__: haxe.ds.BalancedTree
};
haxe.ds.TreeNode = function(l,k,v,r,h) {
	if(h == null) h = -1;
	this.left = l;
	this.key = k;
	this.value = v;
	this.right = r;
	if(h == -1) this._height = ((function($this) {
		var $r;
		var _this = $this.left;
		$r = _this == null?0:_this._height;
		return $r;
	}(this)) > (function($this) {
		var $r;
		var _this1 = $this.right;
		$r = _this1 == null?0:_this1._height;
		return $r;
	}(this))?(function($this) {
		var $r;
		var _this2 = $this.left;
		$r = _this2 == null?0:_this2._height;
		return $r;
	}(this)):(function($this) {
		var $r;
		var _this3 = $this.right;
		$r = _this3 == null?0:_this3._height;
		return $r;
	}(this))) + 1; else this._height = h;
};
$hxClasses["haxe.ds.TreeNode"] = haxe.ds.TreeNode;
haxe.ds.TreeNode.__name__ = ["haxe","ds","TreeNode"];
haxe.ds.TreeNode.prototype = {
	__class__: haxe.ds.TreeNode
};
haxe.ds.EnumValueMap = function() {
	haxe.ds.BalancedTree.call(this);
};
$hxClasses["haxe.ds.EnumValueMap"] = haxe.ds.EnumValueMap;
haxe.ds.EnumValueMap.__name__ = ["haxe","ds","EnumValueMap"];
haxe.ds.EnumValueMap.__interfaces__ = [IMap];
haxe.ds.EnumValueMap.__super__ = haxe.ds.BalancedTree;
haxe.ds.EnumValueMap.prototype = $extend(haxe.ds.BalancedTree.prototype,{
	compare: function(k1,k2) {
		var d = k1[1] - k2[1];
		if(d != 0) return d;
		var p1 = k1.slice(2);
		var p2 = k2.slice(2);
		if(p1.length == 0 && p2.length == 0) return 0;
		return this.compareArgs(p1,p2);
	}
	,compareArgs: function(a1,a2) {
		var ld = a1.length - a2.length;
		if(ld != 0) return ld;
		var _g1 = 0;
		var _g = a1.length;
		while(_g1 < _g) {
			var i = _g1++;
			var d = this.compareArg(a1[i],a2[i]);
			if(d != 0) return d;
		}
		return 0;
	}
	,compareArg: function(v1,v2) {
		if(Reflect.isEnumValue(v1) && Reflect.isEnumValue(v2)) return this.compare(v1,v2); else if((v1 instanceof Array) && v1.__enum__ == null && ((v2 instanceof Array) && v2.__enum__ == null)) return this.compareArgs(v1,v2); else return Reflect.compare(v1,v2);
	}
	,__class__: haxe.ds.EnumValueMap
});
haxe.ds.StringMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.StringMap"] = haxe.ds.StringMap;
haxe.ds.StringMap.__name__ = ["haxe","ds","StringMap"];
haxe.ds.StringMap.__interfaces__ = [IMap];
haxe.ds.StringMap.prototype = {
	set: function(key,value) {
		this.h["$" + key] = value;
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,remove: function(key) {
		key = "$" + key;
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref["$" + i];
		}};
	}
	,__class__: haxe.ds.StringMap
};
haxe.macro = {};
haxe.macro.Constant = $hxClasses["haxe.macro.Constant"] = { __ename__ : ["haxe","macro","Constant"], __constructs__ : ["CInt","CFloat","CString","CIdent","CRegexp"] };
haxe.macro.Constant.CInt = function(v) { var $x = ["CInt",0,v]; $x.__enum__ = haxe.macro.Constant; return $x; };
haxe.macro.Constant.CFloat = function(f) { var $x = ["CFloat",1,f]; $x.__enum__ = haxe.macro.Constant; return $x; };
haxe.macro.Constant.CString = function(s) { var $x = ["CString",2,s]; $x.__enum__ = haxe.macro.Constant; return $x; };
haxe.macro.Constant.CIdent = function(s) { var $x = ["CIdent",3,s]; $x.__enum__ = haxe.macro.Constant; return $x; };
haxe.macro.Constant.CRegexp = function(r,opt) { var $x = ["CRegexp",4,r,opt]; $x.__enum__ = haxe.macro.Constant; return $x; };
haxe.macro.Constant.__empty_constructs__ = [];
haxe.macro.Binop = $hxClasses["haxe.macro.Binop"] = { __ename__ : ["haxe","macro","Binop"], __constructs__ : ["OpAdd","OpMult","OpDiv","OpSub","OpAssign","OpEq","OpNotEq","OpGt","OpGte","OpLt","OpLte","OpAnd","OpOr","OpXor","OpBoolAnd","OpBoolOr","OpShl","OpShr","OpUShr","OpMod","OpAssignOp","OpInterval","OpArrow"] };
haxe.macro.Binop.OpAdd = ["OpAdd",0];
haxe.macro.Binop.OpAdd.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpMult = ["OpMult",1];
haxe.macro.Binop.OpMult.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpDiv = ["OpDiv",2];
haxe.macro.Binop.OpDiv.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpSub = ["OpSub",3];
haxe.macro.Binop.OpSub.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpAssign = ["OpAssign",4];
haxe.macro.Binop.OpAssign.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpEq = ["OpEq",5];
haxe.macro.Binop.OpEq.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpNotEq = ["OpNotEq",6];
haxe.macro.Binop.OpNotEq.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpGt = ["OpGt",7];
haxe.macro.Binop.OpGt.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpGte = ["OpGte",8];
haxe.macro.Binop.OpGte.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpLt = ["OpLt",9];
haxe.macro.Binop.OpLt.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpLte = ["OpLte",10];
haxe.macro.Binop.OpLte.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpAnd = ["OpAnd",11];
haxe.macro.Binop.OpAnd.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpOr = ["OpOr",12];
haxe.macro.Binop.OpOr.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpXor = ["OpXor",13];
haxe.macro.Binop.OpXor.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpBoolAnd = ["OpBoolAnd",14];
haxe.macro.Binop.OpBoolAnd.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpBoolOr = ["OpBoolOr",15];
haxe.macro.Binop.OpBoolOr.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpShl = ["OpShl",16];
haxe.macro.Binop.OpShl.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpShr = ["OpShr",17];
haxe.macro.Binop.OpShr.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpUShr = ["OpUShr",18];
haxe.macro.Binop.OpUShr.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpMod = ["OpMod",19];
haxe.macro.Binop.OpMod.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpAssignOp = function(op) { var $x = ["OpAssignOp",20,op]; $x.__enum__ = haxe.macro.Binop; return $x; };
haxe.macro.Binop.OpInterval = ["OpInterval",21];
haxe.macro.Binop.OpInterval.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpArrow = ["OpArrow",22];
haxe.macro.Binop.OpArrow.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.__empty_constructs__ = [haxe.macro.Binop.OpAdd,haxe.macro.Binop.OpMult,haxe.macro.Binop.OpDiv,haxe.macro.Binop.OpSub,haxe.macro.Binop.OpAssign,haxe.macro.Binop.OpEq,haxe.macro.Binop.OpNotEq,haxe.macro.Binop.OpGt,haxe.macro.Binop.OpGte,haxe.macro.Binop.OpLt,haxe.macro.Binop.OpLte,haxe.macro.Binop.OpAnd,haxe.macro.Binop.OpOr,haxe.macro.Binop.OpXor,haxe.macro.Binop.OpBoolAnd,haxe.macro.Binop.OpBoolOr,haxe.macro.Binop.OpShl,haxe.macro.Binop.OpShr,haxe.macro.Binop.OpUShr,haxe.macro.Binop.OpMod,haxe.macro.Binop.OpInterval,haxe.macro.Binop.OpArrow];
haxe.macro.Unop = $hxClasses["haxe.macro.Unop"] = { __ename__ : ["haxe","macro","Unop"], __constructs__ : ["OpIncrement","OpDecrement","OpNot","OpNeg","OpNegBits"] };
haxe.macro.Unop.OpIncrement = ["OpIncrement",0];
haxe.macro.Unop.OpIncrement.__enum__ = haxe.macro.Unop;
haxe.macro.Unop.OpDecrement = ["OpDecrement",1];
haxe.macro.Unop.OpDecrement.__enum__ = haxe.macro.Unop;
haxe.macro.Unop.OpNot = ["OpNot",2];
haxe.macro.Unop.OpNot.__enum__ = haxe.macro.Unop;
haxe.macro.Unop.OpNeg = ["OpNeg",3];
haxe.macro.Unop.OpNeg.__enum__ = haxe.macro.Unop;
haxe.macro.Unop.OpNegBits = ["OpNegBits",4];
haxe.macro.Unop.OpNegBits.__enum__ = haxe.macro.Unop;
haxe.macro.Unop.__empty_constructs__ = [haxe.macro.Unop.OpIncrement,haxe.macro.Unop.OpDecrement,haxe.macro.Unop.OpNot,haxe.macro.Unop.OpNeg,haxe.macro.Unop.OpNegBits];
haxe.macro.ExprDef = $hxClasses["haxe.macro.ExprDef"] = { __ename__ : ["haxe","macro","ExprDef"], __constructs__ : ["EConst","EArray","EBinop","EField","EParenthesis","EObjectDecl","EArrayDecl","ECall","ENew","EUnop","EVars","EFunction","EBlock","EFor","EIn","EIf","EWhile","ESwitch","ETry","EReturn","EBreak","EContinue","EUntyped","EThrow","ECast","EDisplay","EDisplayNew","ETernary","ECheckType","EMeta"] };
haxe.macro.ExprDef.EConst = function(c) { var $x = ["EConst",0,c]; $x.__enum__ = haxe.macro.ExprDef; return $x; };
haxe.macro.ExprDef.EArray = function(e1,e2) { var $x = ["EArray",1,e1,e2]; $x.__enum__ = haxe.macro.ExprDef; return $x; };
haxe.macro.ExprDef.EBinop = function(op,e1,e2) { var $x = ["EBinop",2,op,e1,e2]; $x.__enum__ = haxe.macro.ExprDef; return $x; };
haxe.macro.ExprDef.EField = function(e,field) { var $x = ["EField",3,e,field]; $x.__enum__ = haxe.macro.ExprDef; return $x; };
haxe.macro.ExprDef.EParenthesis = function(e) { var $x = ["EParenthesis",4,e]; $x.__enum__ = haxe.macro.ExprDef; return $x; };
haxe.macro.ExprDef.EObjectDecl = function(fields) { var $x = ["EObjectDecl",5,fields]; $x.__enum__ = haxe.macro.ExprDef; return $x; };
haxe.macro.ExprDef.EArrayDecl = function(values) { var $x = ["EArrayDecl",6,values]; $x.__enum__ = haxe.macro.ExprDef; return $x; };
haxe.macro.ExprDef.ECall = function(e,params) { var $x = ["ECall",7,e,params]; $x.__enum__ = haxe.macro.ExprDef; return $x; };
haxe.macro.ExprDef.ENew = function(t,params) { var $x = ["ENew",8,t,params]; $x.__enum__ = haxe.macro.ExprDef; return $x; };
haxe.macro.ExprDef.EUnop = function(op,postFix,e) { var $x = ["EUnop",9,op,postFix,e]; $x.__enum__ = haxe.macro.ExprDef; return $x; };
haxe.macro.ExprDef.EVars = function(vars) { var $x = ["EVars",10,vars]; $x.__enum__ = haxe.macro.ExprDef; return $x; };
haxe.macro.ExprDef.EFunction = function(name,f) { var $x = ["EFunction",11,name,f]; $x.__enum__ = haxe.macro.ExprDef; return $x; };
haxe.macro.ExprDef.EBlock = function(exprs) { var $x = ["EBlock",12,exprs]; $x.__enum__ = haxe.macro.ExprDef; return $x; };
haxe.macro.ExprDef.EFor = function(it,expr) { var $x = ["EFor",13,it,expr]; $x.__enum__ = haxe.macro.ExprDef; return $x; };
haxe.macro.ExprDef.EIn = function(e1,e2) { var $x = ["EIn",14,e1,e2]; $x.__enum__ = haxe.macro.ExprDef; return $x; };
haxe.macro.ExprDef.EIf = function(econd,eif,eelse) { var $x = ["EIf",15,econd,eif,eelse]; $x.__enum__ = haxe.macro.ExprDef; return $x; };
haxe.macro.ExprDef.EWhile = function(econd,e,normalWhile) { var $x = ["EWhile",16,econd,e,normalWhile]; $x.__enum__ = haxe.macro.ExprDef; return $x; };
haxe.macro.ExprDef.ESwitch = function(e,cases,edef) { var $x = ["ESwitch",17,e,cases,edef]; $x.__enum__ = haxe.macro.ExprDef; return $x; };
haxe.macro.ExprDef.ETry = function(e,catches) { var $x = ["ETry",18,e,catches]; $x.__enum__ = haxe.macro.ExprDef; return $x; };
haxe.macro.ExprDef.EReturn = function(e) { var $x = ["EReturn",19,e]; $x.__enum__ = haxe.macro.ExprDef; return $x; };
haxe.macro.ExprDef.EBreak = ["EBreak",20];
haxe.macro.ExprDef.EBreak.__enum__ = haxe.macro.ExprDef;
haxe.macro.ExprDef.EContinue = ["EContinue",21];
haxe.macro.ExprDef.EContinue.__enum__ = haxe.macro.ExprDef;
haxe.macro.ExprDef.EUntyped = function(e) { var $x = ["EUntyped",22,e]; $x.__enum__ = haxe.macro.ExprDef; return $x; };
haxe.macro.ExprDef.EThrow = function(e) { var $x = ["EThrow",23,e]; $x.__enum__ = haxe.macro.ExprDef; return $x; };
haxe.macro.ExprDef.ECast = function(e,t) { var $x = ["ECast",24,e,t]; $x.__enum__ = haxe.macro.ExprDef; return $x; };
haxe.macro.ExprDef.EDisplay = function(e,isCall) { var $x = ["EDisplay",25,e,isCall]; $x.__enum__ = haxe.macro.ExprDef; return $x; };
haxe.macro.ExprDef.EDisplayNew = function(t) { var $x = ["EDisplayNew",26,t]; $x.__enum__ = haxe.macro.ExprDef; return $x; };
haxe.macro.ExprDef.ETernary = function(econd,eif,eelse) { var $x = ["ETernary",27,econd,eif,eelse]; $x.__enum__ = haxe.macro.ExprDef; return $x; };
haxe.macro.ExprDef.ECheckType = function(e,t) { var $x = ["ECheckType",28,e,t]; $x.__enum__ = haxe.macro.ExprDef; return $x; };
haxe.macro.ExprDef.EMeta = function(s,e) { var $x = ["EMeta",29,s,e]; $x.__enum__ = haxe.macro.ExprDef; return $x; };
haxe.macro.ExprDef.__empty_constructs__ = [haxe.macro.ExprDef.EBreak,haxe.macro.ExprDef.EContinue];
haxe.macro.ComplexType = $hxClasses["haxe.macro.ComplexType"] = { __ename__ : ["haxe","macro","ComplexType"], __constructs__ : ["TPath","TFunction","TAnonymous","TParent","TExtend","TOptional"] };
haxe.macro.ComplexType.TPath = function(p) { var $x = ["TPath",0,p]; $x.__enum__ = haxe.macro.ComplexType; return $x; };
haxe.macro.ComplexType.TFunction = function(args,ret) { var $x = ["TFunction",1,args,ret]; $x.__enum__ = haxe.macro.ComplexType; return $x; };
haxe.macro.ComplexType.TAnonymous = function(fields) { var $x = ["TAnonymous",2,fields]; $x.__enum__ = haxe.macro.ComplexType; return $x; };
haxe.macro.ComplexType.TParent = function(t) { var $x = ["TParent",3,t]; $x.__enum__ = haxe.macro.ComplexType; return $x; };
haxe.macro.ComplexType.TExtend = function(p,fields) { var $x = ["TExtend",4,p,fields]; $x.__enum__ = haxe.macro.ComplexType; return $x; };
haxe.macro.ComplexType.TOptional = function(t) { var $x = ["TOptional",5,t]; $x.__enum__ = haxe.macro.ComplexType; return $x; };
haxe.macro.ComplexType.__empty_constructs__ = [];
haxe.macro.TypeParam = $hxClasses["haxe.macro.TypeParam"] = { __ename__ : ["haxe","macro","TypeParam"], __constructs__ : ["TPType","TPExpr"] };
haxe.macro.TypeParam.TPType = function(t) { var $x = ["TPType",0,t]; $x.__enum__ = haxe.macro.TypeParam; return $x; };
haxe.macro.TypeParam.TPExpr = function(e) { var $x = ["TPExpr",1,e]; $x.__enum__ = haxe.macro.TypeParam; return $x; };
haxe.macro.TypeParam.__empty_constructs__ = [];
haxe.rtti = {};
haxe.rtti.CType = $hxClasses["haxe.rtti.CType"] = { __ename__ : ["haxe","rtti","CType"], __constructs__ : ["CUnknown","CEnum","CClass","CTypedef","CFunction","CAnonymous","CDynamic","CAbstract"] };
haxe.rtti.CType.CUnknown = ["CUnknown",0];
haxe.rtti.CType.CUnknown.__enum__ = haxe.rtti.CType;
haxe.rtti.CType.CEnum = function(name,params) { var $x = ["CEnum",1,name,params]; $x.__enum__ = haxe.rtti.CType; return $x; };
haxe.rtti.CType.CClass = function(name,params) { var $x = ["CClass",2,name,params]; $x.__enum__ = haxe.rtti.CType; return $x; };
haxe.rtti.CType.CTypedef = function(name,params) { var $x = ["CTypedef",3,name,params]; $x.__enum__ = haxe.rtti.CType; return $x; };
haxe.rtti.CType.CFunction = function(args,ret) { var $x = ["CFunction",4,args,ret]; $x.__enum__ = haxe.rtti.CType; return $x; };
haxe.rtti.CType.CAnonymous = function(fields) { var $x = ["CAnonymous",5,fields]; $x.__enum__ = haxe.rtti.CType; return $x; };
haxe.rtti.CType.CDynamic = function(t) { var $x = ["CDynamic",6,t]; $x.__enum__ = haxe.rtti.CType; return $x; };
haxe.rtti.CType.CAbstract = function(name,params) { var $x = ["CAbstract",7,name,params]; $x.__enum__ = haxe.rtti.CType; return $x; };
haxe.rtti.CType.__empty_constructs__ = [haxe.rtti.CType.CUnknown];
haxe.rtti.Rights = $hxClasses["haxe.rtti.Rights"] = { __ename__ : ["haxe","rtti","Rights"], __constructs__ : ["RNormal","RNo","RCall","RMethod","RDynamic","RInline"] };
haxe.rtti.Rights.RNormal = ["RNormal",0];
haxe.rtti.Rights.RNormal.__enum__ = haxe.rtti.Rights;
haxe.rtti.Rights.RNo = ["RNo",1];
haxe.rtti.Rights.RNo.__enum__ = haxe.rtti.Rights;
haxe.rtti.Rights.RCall = function(m) { var $x = ["RCall",2,m]; $x.__enum__ = haxe.rtti.Rights; return $x; };
haxe.rtti.Rights.RMethod = ["RMethod",3];
haxe.rtti.Rights.RMethod.__enum__ = haxe.rtti.Rights;
haxe.rtti.Rights.RDynamic = ["RDynamic",4];
haxe.rtti.Rights.RDynamic.__enum__ = haxe.rtti.Rights;
haxe.rtti.Rights.RInline = ["RInline",5];
haxe.rtti.Rights.RInline.__enum__ = haxe.rtti.Rights;
haxe.rtti.Rights.__empty_constructs__ = [haxe.rtti.Rights.RNormal,haxe.rtti.Rights.RNo,haxe.rtti.Rights.RMethod,haxe.rtti.Rights.RDynamic,haxe.rtti.Rights.RInline];
haxe.rtti.TypeTree = $hxClasses["haxe.rtti.TypeTree"] = { __ename__ : ["haxe","rtti","TypeTree"], __constructs__ : ["TPackage","TClassdecl","TEnumdecl","TTypedecl","TAbstractdecl"] };
haxe.rtti.TypeTree.TPackage = function(name,full,subs) { var $x = ["TPackage",0,name,full,subs]; $x.__enum__ = haxe.rtti.TypeTree; return $x; };
haxe.rtti.TypeTree.TClassdecl = function(c) { var $x = ["TClassdecl",1,c]; $x.__enum__ = haxe.rtti.TypeTree; return $x; };
haxe.rtti.TypeTree.TEnumdecl = function(e) { var $x = ["TEnumdecl",2,e]; $x.__enum__ = haxe.rtti.TypeTree; return $x; };
haxe.rtti.TypeTree.TTypedecl = function(t) { var $x = ["TTypedecl",3,t]; $x.__enum__ = haxe.rtti.TypeTree; return $x; };
haxe.rtti.TypeTree.TAbstractdecl = function(a) { var $x = ["TAbstractdecl",4,a]; $x.__enum__ = haxe.rtti.TypeTree; return $x; };
haxe.rtti.TypeTree.__empty_constructs__ = [];
haxe.rtti.XmlParser = function() {
	this.root = new Array();
};
$hxClasses["haxe.rtti.XmlParser"] = haxe.rtti.XmlParser;
haxe.rtti.XmlParser.__name__ = ["haxe","rtti","XmlParser"];
haxe.rtti.XmlParser.prototype = {
	mkPath: function(p) {
		return p;
	}
	,mkTypeParams: function(p) {
		var pl = p.split(":");
		if(pl[0] == "") return new Array();
		return pl;
	}
	,mkRights: function(r) {
		switch(r) {
		case "null":
			return haxe.rtti.Rights.RNo;
		case "method":
			return haxe.rtti.Rights.RMethod;
		case "dynamic":
			return haxe.rtti.Rights.RDynamic;
		case "inline":
			return haxe.rtti.Rights.RInline;
		default:
			return haxe.rtti.Rights.RCall(r);
		}
	}
	,xerror: function(c) {
		throw "Invalid " + c.get_name();
	}
	,processElement: function(x) {
		var c = new haxe.xml.Fast(x);
		var _g = c.get_name();
		switch(_g) {
		case "class":
			return haxe.rtti.TypeTree.TClassdecl(this.xclass(c));
		case "enum":
			return haxe.rtti.TypeTree.TEnumdecl(this.xenum(c));
		case "typedef":
			return haxe.rtti.TypeTree.TTypedecl(this.xtypedef(c));
		case "abstract":
			return haxe.rtti.TypeTree.TAbstractdecl(this.xabstract(c));
		default:
			return this.xerror(c);
		}
	}
	,xmeta: function(x) {
		var ml = [];
		var $it0 = x.nodes.resolve("m").iterator();
		while( $it0.hasNext() ) {
			var m = $it0.next();
			var pl = [];
			var $it1 = m.nodes.resolve("e").iterator();
			while( $it1.hasNext() ) {
				var p = $it1.next();
				pl.push(p.get_innerHTML());
			}
			ml.push({ name : m.att.resolve("n"), params : pl});
		}
		return ml;
	}
	,xoverloads: function(x) {
		var l = new List();
		var $it0 = x.get_elements();
		while( $it0.hasNext() ) {
			var m = $it0.next();
			l.add(this.xclassfield(m));
		}
		return l;
	}
	,xpath: function(x) {
		var path = this.mkPath(x.att.resolve("path"));
		var params = new List();
		var $it0 = x.get_elements();
		while( $it0.hasNext() ) {
			var c = $it0.next();
			params.add(this.xtype(c));
		}
		return { path : path, params : params};
	}
	,xclass: function(x) {
		var csuper = null;
		var doc = null;
		var tdynamic = null;
		var interfaces = new List();
		var fields = new List();
		var statics = new List();
		var meta = [];
		var $it0 = x.get_elements();
		while( $it0.hasNext() ) {
			var c = $it0.next();
			var _g = c.get_name();
			switch(_g) {
			case "haxe_doc":
				doc = c.get_innerData();
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
				meta = this.xmeta(c);
				break;
			default:
				if(c.x.exists("static")) statics.add(this.xclassfield(c)); else fields.add(this.xclassfield(c));
			}
		}
		return { file : x.has.resolve("file")?x.att.resolve("file"):null, path : this.mkPath(x.att.resolve("path")), module : x.has.resolve("module")?this.mkPath(x.att.resolve("module")):null, doc : doc, isPrivate : x.x.exists("private"), isExtern : x.x.exists("extern"), isInterface : x.x.exists("interface"), params : this.mkTypeParams(x.att.resolve("params")), superClass : csuper, interfaces : interfaces, fields : fields, statics : statics, tdynamic : tdynamic, platforms : this.defplat(), meta : meta};
	}
	,xclassfield: function(x,defPublic) {
		var e = x.get_elements();
		var t = this.xtype(e.next());
		var doc = null;
		var meta = [];
		var overloads = null;
		while( e.hasNext() ) {
			var c = e.next();
			var _g = c.get_name();
			switch(_g) {
			case "haxe_doc":
				doc = c.get_innerData();
				break;
			case "meta":
				meta = this.xmeta(c);
				break;
			case "overloads":
				overloads = this.xoverloads(c);
				break;
			default:
				this.xerror(c);
			}
		}
		return { name : x.get_name(), type : t, isPublic : x.x.exists("public") || defPublic, isOverride : x.x.exists("override"), line : x.has.resolve("line")?Std.parseInt(x.att.resolve("line")):null, doc : doc, get : x.has.resolve("get")?this.mkRights(x.att.resolve("get")):haxe.rtti.Rights.RNormal, set : x.has.resolve("set")?this.mkRights(x.att.resolve("set")):haxe.rtti.Rights.RNormal, params : x.has.resolve("params")?this.mkTypeParams(x.att.resolve("params")):[], platforms : this.defplat(), meta : meta, overloads : overloads};
	}
	,xenum: function(x) {
		var cl = new List();
		var doc = null;
		var meta = [];
		var $it0 = x.get_elements();
		while( $it0.hasNext() ) {
			var c = $it0.next();
			if(c.get_name() == "haxe_doc") doc = c.get_innerData(); else if(c.get_name() == "meta") meta = this.xmeta(c); else cl.add(this.xenumfield(c));
		}
		return { file : x.has.resolve("file")?x.att.resolve("file"):null, path : this.mkPath(x.att.resolve("path")), module : x.has.resolve("module")?this.mkPath(x.att.resolve("module")):null, doc : doc, isPrivate : x.x.exists("private"), isExtern : x.x.exists("extern"), params : this.mkTypeParams(x.att.resolve("params")), constructors : cl, platforms : this.defplat(), meta : meta};
	}
	,xenumfield: function(x) {
		var args = null;
		var xdoc = x.x.elementsNamed("haxe_doc").next();
		var meta;
		if(x.hasNode.resolve("meta")) meta = this.xmeta(x.node.resolve("meta")); else meta = [];
		if(x.has.resolve("a")) {
			var names = x.att.resolve("a").split(":");
			var elts = x.get_elements();
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
		return { name : x.get_name(), args : args, doc : xdoc == null?null:new haxe.xml.Fast(xdoc).get_innerData(), meta : meta, platforms : this.defplat()};
	}
	,xabstract: function(x) {
		var doc = null;
		var impl = null;
		var athis = null;
		var meta = [];
		var to = [];
		var from = [];
		var $it0 = x.get_elements();
		while( $it0.hasNext() ) {
			var c = $it0.next();
			var _g = c.get_name();
			switch(_g) {
			case "haxe_doc":
				doc = c.get_innerData();
				break;
			case "meta":
				meta = this.xmeta(c);
				break;
			case "to":
				var $it1 = c.get_elements();
				while( $it1.hasNext() ) {
					var t = $it1.next();
					to.push({ t : this.xtype(new haxe.xml.Fast(t.x.firstElement())), field : t.has.resolve("field")?t.att.resolve("field"):null});
				}
				break;
			case "from":
				var $it2 = c.get_elements();
				while( $it2.hasNext() ) {
					var t1 = $it2.next();
					from.push({ t : this.xtype(new haxe.xml.Fast(t1.x.firstElement())), field : t1.has.resolve("field")?t1.att.resolve("field"):null});
				}
				break;
			case "impl":
				impl = this.xclass(c.node.resolve("class"));
				break;
			case "this":
				athis = this.xtype(new haxe.xml.Fast(c.x.firstElement()));
				break;
			default:
				this.xerror(c);
			}
		}
		return { file : x.has.resolve("file")?x.att.resolve("file"):null, path : this.mkPath(x.att.resolve("path")), module : x.has.resolve("module")?this.mkPath(x.att.resolve("module")):null, doc : doc, isPrivate : x.x.exists("private"), params : this.mkTypeParams(x.att.resolve("params")), platforms : this.defplat(), meta : meta, athis : athis, to : to, from : from, impl : impl};
	}
	,xtypedef: function(x) {
		var doc = null;
		var t = null;
		var meta = [];
		var $it0 = x.get_elements();
		while( $it0.hasNext() ) {
			var c = $it0.next();
			if(c.get_name() == "haxe_doc") doc = c.get_innerData(); else if(c.get_name() == "meta") meta = this.xmeta(c); else t = this.xtype(c);
		}
		var types = new haxe.ds.StringMap();
		if(this.curplatform != null) types.set(this.curplatform,t);
		return { file : x.has.resolve("file")?x.att.resolve("file"):null, path : this.mkPath(x.att.resolve("path")), module : x.has.resolve("module")?this.mkPath(x.att.resolve("module")):null, doc : doc, isPrivate : x.x.exists("private"), params : this.mkTypeParams(x.att.resolve("params")), type : t, types : types, platforms : this.defplat(), meta : meta};
	}
	,xtype: function(x) {
		var _g = x.get_name();
		switch(_g) {
		case "unknown":
			return haxe.rtti.CType.CUnknown;
		case "e":
			return haxe.rtti.CType.CEnum(this.mkPath(x.att.resolve("path")),this.xtypeparams(x));
		case "c":
			return haxe.rtti.CType.CClass(this.mkPath(x.att.resolve("path")),this.xtypeparams(x));
		case "t":
			return haxe.rtti.CType.CTypedef(this.mkPath(x.att.resolve("path")),this.xtypeparams(x));
		case "x":
			return haxe.rtti.CType.CAbstract(this.mkPath(x.att.resolve("path")),this.xtypeparams(x));
		case "f":
			var args = new List();
			var aname = x.att.resolve("a").split(":");
			var eargs = HxOverrides.iter(aname);
			var evalues;
			if(x.has.resolve("v")) {
				var _this = x.att.resolve("v").split(":");
				evalues = HxOverrides.iter(_this);
			} else evalues = null;
			var $it0 = x.get_elements();
			while( $it0.hasNext() ) {
				var e = $it0.next();
				var opt = false;
				var a = eargs.next();
				if(a == null) a = "";
				if(a.charAt(0) == "?") {
					opt = true;
					a = HxOverrides.substr(a,1,null);
				}
				var v;
				if(evalues == null) v = null; else v = evalues.next();
				args.add({ name : a, opt : opt, t : this.xtype(e), value : v == ""?null:v});
			}
			var ret = args.last();
			args.remove(ret);
			return haxe.rtti.CType.CFunction(args,ret.t);
		case "a":
			var fields = new List();
			var $it1 = x.get_elements();
			while( $it1.hasNext() ) {
				var f = $it1.next();
				var f1 = this.xclassfield(f,true);
				f1.platforms = new List();
				fields.add(f1);
			}
			return haxe.rtti.CType.CAnonymous(fields);
		case "d":
			var t = null;
			var tx = x.x.firstElement();
			if(tx != null) t = this.xtype(new haxe.xml.Fast(tx));
			return haxe.rtti.CType.CDynamic(t);
		default:
			return this.xerror(x);
		}
	}
	,xtypeparams: function(x) {
		var p = new List();
		var $it0 = x.get_elements();
		while( $it0.hasNext() ) {
			var c = $it0.next();
			p.add(this.xtype(c));
		}
		return p;
	}
	,defplat: function() {
		var l = new List();
		if(this.curplatform != null) l.add(this.curplatform);
		return l;
	}
	,__class__: haxe.rtti.XmlParser
};
haxe.xml = {};
haxe.xml._Fast = {};
haxe.xml._Fast.NodeAccess = function(x) {
	this.__x = x;
};
$hxClasses["haxe.xml._Fast.NodeAccess"] = haxe.xml._Fast.NodeAccess;
haxe.xml._Fast.NodeAccess.__name__ = ["haxe","xml","_Fast","NodeAccess"];
haxe.xml._Fast.NodeAccess.prototype = {
	resolve: function(name) {
		var x = this.__x.elementsNamed(name).next();
		if(x == null) {
			var xname;
			if(this.__x.nodeType == Xml.Document) xname = "Document"; else xname = this.__x.get_nodeName();
			throw xname + " is missing element " + name;
		}
		return new haxe.xml.Fast(x);
	}
	,__class__: haxe.xml._Fast.NodeAccess
};
haxe.xml._Fast.AttribAccess = function(x) {
	this.__x = x;
};
$hxClasses["haxe.xml._Fast.AttribAccess"] = haxe.xml._Fast.AttribAccess;
haxe.xml._Fast.AttribAccess.__name__ = ["haxe","xml","_Fast","AttribAccess"];
haxe.xml._Fast.AttribAccess.prototype = {
	resolve: function(name) {
		if(this.__x.nodeType == Xml.Document) throw "Cannot access document attribute " + name;
		var v = this.__x.get(name);
		if(v == null) throw this.__x.get_nodeName() + " is missing attribute " + name;
		return v;
	}
	,__class__: haxe.xml._Fast.AttribAccess
};
haxe.xml._Fast.HasAttribAccess = function(x) {
	this.__x = x;
};
$hxClasses["haxe.xml._Fast.HasAttribAccess"] = haxe.xml._Fast.HasAttribAccess;
haxe.xml._Fast.HasAttribAccess.__name__ = ["haxe","xml","_Fast","HasAttribAccess"];
haxe.xml._Fast.HasAttribAccess.prototype = {
	resolve: function(name) {
		if(this.__x.nodeType == Xml.Document) throw "Cannot access document attribute " + name;
		return this.__x.exists(name);
	}
	,__class__: haxe.xml._Fast.HasAttribAccess
};
haxe.xml._Fast.HasNodeAccess = function(x) {
	this.__x = x;
};
$hxClasses["haxe.xml._Fast.HasNodeAccess"] = haxe.xml._Fast.HasNodeAccess;
haxe.xml._Fast.HasNodeAccess.__name__ = ["haxe","xml","_Fast","HasNodeAccess"];
haxe.xml._Fast.HasNodeAccess.prototype = {
	resolve: function(name) {
		return this.__x.elementsNamed(name).hasNext();
	}
	,__class__: haxe.xml._Fast.HasNodeAccess
};
haxe.xml._Fast.NodeListAccess = function(x) {
	this.__x = x;
};
$hxClasses["haxe.xml._Fast.NodeListAccess"] = haxe.xml._Fast.NodeListAccess;
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
	,__class__: haxe.xml._Fast.NodeListAccess
};
haxe.xml.Fast = function(x) {
	if(x.nodeType != Xml.Document && x.nodeType != Xml.Element) throw "Invalid nodeType " + Std.string(x.nodeType);
	this.x = x;
	this.node = new haxe.xml._Fast.NodeAccess(x);
	this.nodes = new haxe.xml._Fast.NodeListAccess(x);
	this.att = new haxe.xml._Fast.AttribAccess(x);
	this.has = new haxe.xml._Fast.HasAttribAccess(x);
	this.hasNode = new haxe.xml._Fast.HasNodeAccess(x);
};
$hxClasses["haxe.xml.Fast"] = haxe.xml.Fast;
haxe.xml.Fast.__name__ = ["haxe","xml","Fast"];
haxe.xml.Fast.prototype = {
	get_name: function() {
		if(this.x.nodeType == Xml.Document) return "Document"; else return this.x.get_nodeName();
	}
	,get_innerData: function() {
		var it = this.x.iterator();
		if(!it.hasNext()) throw this.get_name() + " does not have data";
		var v = it.next();
		var n = it.next();
		if(n != null) {
			if(v.nodeType == Xml.PCData && n.nodeType == Xml.CData && StringTools.trim(v.get_nodeValue()) == "") {
				var n2 = it.next();
				if(n2 == null || n2.nodeType == Xml.PCData && StringTools.trim(n2.get_nodeValue()) == "" && it.next() == null) return n.get_nodeValue();
			}
			throw this.get_name() + " does not only have data";
		}
		if(v.nodeType != Xml.PCData && v.nodeType != Xml.CData) throw this.get_name() + " does not have data";
		return v.get_nodeValue();
	}
	,get_innerHTML: function() {
		var s = new StringBuf();
		var $it0 = this.x.iterator();
		while( $it0.hasNext() ) {
			var x = $it0.next();
			s.add(x.toString());
		}
		return s.b;
	}
	,get_elements: function() {
		var it = this.x.elements();
		return { hasNext : $bind(it,it.hasNext), next : function() {
			var x = it.next();
			if(x == null) return null;
			return new haxe.xml.Fast(x);
		}};
	}
	,__class__: haxe.xml.Fast
};
haxe.xml.Parser = function() { };
$hxClasses["haxe.xml.Parser"] = haxe.xml.Parser;
haxe.xml.Parser.__name__ = ["haxe","xml","Parser"];
haxe.xml.Parser.parse = function(str) {
	var doc = Xml.createDocument();
	haxe.xml.Parser.doParse(str,0,doc);
	return doc;
};
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
	var buf = new StringBuf();
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
				var child = Xml.createPCData(buf.b + HxOverrides.substr(str,start,p - start));
				buf = new StringBuf();
				parent.addChild(child);
				nsubs++;
				state = 0;
				next = 2;
			} else if(c == 38) {
				buf.addSub(str,start,p - start);
				state = 18;
				next = 13;
				start = p + 1;
			}
			break;
		case 17:
			if(c == 93 && str.charCodeAt(p + 1) == 93 && str.charCodeAt(p + 2) == 62) {
				var child1 = Xml.createCData(HxOverrides.substr(str,start,p - start));
				parent.addChild(child1);
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
				if(v != parent.get_nodeName()) throw "Expected </" + parent.get_nodeName() + ">";
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
				parent.addChild(Xml.createProcessingInstruction(str1));
				state = 1;
			}
			break;
		case 18:
			if(c == 59) {
				var s = HxOverrides.substr(str,start,p - start);
				if(s.charCodeAt(0) == 35) {
					var i;
					if(s.charCodeAt(1) == 120) i = Std.parseInt("0" + HxOverrides.substr(s,1,s.length - 1)); else i = Std.parseInt(HxOverrides.substr(s,1,s.length - 1));
					buf.add(String.fromCharCode(i));
				} else if(!haxe.xml.Parser.escapes.exists(s)) buf.b += Std.string("&" + s + ";"); else buf.add(haxe.xml.Parser.escapes.get(s));
				start = p + 1;
				state = next;
			}
			break;
		}
		c = StringTools.fastCodeAt(str,++p);
	}
	if(state == 1) {
		start = p;
		state = 13;
	}
	if(state == 13) {
		if(p != start || nsubs == 0) parent.addChild(Xml.createPCData(buf.b + HxOverrides.substr(str,start,p - start)));
		return p;
	}
	throw "Unexpected end";
};
var js = {};
js.Boot = function() { };
$hxClasses["js.Boot"] = js.Boot;
js.Boot.__name__ = ["js","Boot"];
js.Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) return Array; else return o.__class__;
};
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
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i1;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js.Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
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
		var str2 = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str2.length != 2) str2 += ", \n";
		str2 += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str2 += "\n" + s + "}";
		return str2;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
};
js.Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Array:
		return (o instanceof Array) && o.__enum__ == null;
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) return true;
				if(js.Boot.__interfLoop(js.Boot.getClass(o),cl)) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
};
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
};
js.Lib = function() { };
$hxClasses["js.Lib"] = js.Lib;
js.Lib.__name__ = ["js","Lib"];
js.Lib.alert = function(v) {
	alert(js.Boot.__string_rec(v,""));
};
var m3 = {};
m3.CrossMojo = function() { };
$hxClasses["m3.CrossMojo"] = m3.CrossMojo;
m3.CrossMojo.__name__ = ["m3","CrossMojo"];
m3.CrossMojo.jq = function(selector,arg2) {
	var v;
	if(arg2 == null) v = $(selector); else v = $(selector, arg2);
	return v;
};
m3.CrossMojo.windowConsole = function() {
	return window.console;
};
m3.CrossMojo.confirm = function() {
	return confirm;
};
m3.CrossMojo.pushState = function(data,title,url) {
	History.pushState(data, title, url);
};
m3.CrossMojo.prettyPrintString = function(json) {
	return JSON.stringify(JSON.parse(json), undefined, 2);
};
m3.CrossMojo.prettyPrint = function(json) {
	return JSON.stringify(json, undefined, 2);
};
m3.comm = {};
m3.comm.BaseRequest = function(requestData,successFcn,errorFcn,accessDeniedFcn) {
	this.requestData = requestData;
	this.onSuccess = successFcn;
	this.onError = errorFcn;
	this.onAccessDenied = accessDeniedFcn;
};
$hxClasses["m3.comm.BaseRequest"] = m3.comm.BaseRequest;
m3.comm.BaseRequest.__name__ = ["m3","comm","BaseRequest"];
m3.comm.BaseRequest.prototype = {
	start: function(opts) {
		var _g = this;
		var ajaxOpts = { dataType : "json", contentType : "application/json", data : this.requestData, type : "POST", success : function(data,textStatus,jqXHR) {
			if(jqXHR.getResponseHeader("Content-Length") == "0") return;
			if(_g.onSuccess != null) _g.onSuccess(data);
		}, error : function(jqXHR1,textStatus1,errorThrown) {
			if(jqXHR1.getResponseHeader("Content-Length") == "0") return;
			if(jqXHR1.status == 403 && _g.onAccessDenied != null) return _g.onAccessDenied();
			var error_message = null;
			if(m3.helper.StringHelper.isNotBlank(jqXHR1.message)) error_message = jqXHR1.message; else if(m3.helper.StringHelper.isNotBlank(jqXHR1.responseText) && jqXHR1.responseText.charAt(0) != "<") error_message = jqXHR1.responseText; else if(errorThrown == null || typeof(errorThrown) == "string") error_message = errorThrown; else error_message = errorThrown.message;
			if(m3.helper.StringHelper.isBlank(error_message)) error_message = "Error, but no error msg from server";
			m3.log.Logga.get_DEFAULT().error("Request Error handler: Status " + jqXHR1.status + " | " + error_message);
			if(_g.onError != null) _g.onError(new m3.exception.AjaxException(error_message,null,jqXHR1.status)); else {
				m3.util.JqueryUtil.alert("There was an error making your request:  " + error_message);
				throw new m3.exception.Exception("Error executing ajax call | Response Code: " + jqXHR1.status + " | " + error_message);
			}
		}};
		$.extend(ajaxOpts,this.baseOpts);
		if(opts != null) $.extend(ajaxOpts,opts);
		return $.ajax(ajaxOpts);
	}
	,abort: function() {
	}
	,__class__: m3.comm.BaseRequest
};
m3.comm.LongPollingRequest = function(channel,requestToRepeat,logga,successFcn,errorFcn,ajaxOpts) {
	this.timeout = 30000;
	this.delayNextPoll = false;
	this.running = true;
	var _g = this;
	this.channel = channel;
	this.logger = logga;
	this.baseOpts = { complete : function(jqXHR,textStatus) {
		_g.poll();
	}};
	if(ajaxOpts != null) $.extend(this.baseOpts,ajaxOpts);
	var onSuccess = function(data) {
		if(_g.running) try {
			successFcn(data);
		} catch( e ) {
			if( js.Boot.__instanceof(e,m3.exception.Exception) ) {
				_g.logger.error("Error while polling",e);
			} else throw(e);
		}
	};
	var onError = function(exc) {
		_g.delayNextPoll = true;
		if(errorFcn != null) errorFcn(exc);
	};
	m3.comm.BaseRequest.call(this,requestToRepeat,onSuccess,onError);
};
$hxClasses["m3.comm.LongPollingRequest"] = m3.comm.LongPollingRequest;
m3.comm.LongPollingRequest.__name__ = ["m3","comm","LongPollingRequest"];
m3.comm.LongPollingRequest.__super__ = m3.comm.BaseRequest;
m3.comm.LongPollingRequest.prototype = $extend(m3.comm.BaseRequest.prototype,{
	pause: function() {
		this.running = false;
		this.poll();
	}
	,resume: function() {
		this.running = false;
		this.poll();
	}
	,toggle: function() {
		this.running = !this.running;
		this.logger.debug("Long Polling is running? " + Std.string(this.running));
		this.poll();
	}
	,getChannelId: function() {
		return this.channel;
	}
	,start: function(opts) {
		this.poll();
		return this.jqXHR;
	}
	,abort: function() {
		this.running = false;
		if(this.jqXHR != null) try {
			this.jqXHR.abort();
			this.jqXHR = null;
		} catch( err ) {
			this.logger.error("error on poll abort | " + Std.string(err));
		}
	}
	,poll: function() {
		if(this.running) {
			if(this.delayNextPoll == true) {
				this.delayNextPoll = false;
				haxe.Timer.delay($bind(this,this.poll),this.timeout / 2 | 0);
			} else {
				this.baseOpts.url = "/api/channel/poll?channel=" + this.channel + "&timeoutMillis=" + Std.string(this.timeout);
				this.baseOpts.timeout = this.timeout + 1000;
				this.jqXHR = m3.comm.BaseRequest.prototype.start.call(this);
			}
		}
	}
	,__class__: m3.comm.LongPollingRequest
});
m3.event = {};
m3.event.EventManager = function() {
	this.hash = new haxe.ds.EnumValueMap();
	this.oneTimers = new Array();
};
$hxClasses["m3.event.EventManager"] = m3.event.EventManager;
m3.event.EventManager.__name__ = ["m3","event","EventManager"];
m3.event.EventManager.prototype = {
	get_logger: function() {
		if(this._logger == null) this._logger = m3.log.Logga.get_DEFAULT();
		return this._logger;
	}
	,addListener: function(id,func,listenerName) {
		var listener = new m3.event.EMListener(func,listenerName);
		return this.addListenerInternal(id,listener);
	}
	,addListenerInternal: function(id,listener) {
		var map = this.hash.get(id);
		if(map == null) {
			map = new haxe.ds.StringMap();
			this.hash.set(id,map);
		}
		var key = listener.get_uid();
		map.set(key,listener);
		return listener.get_uid();
	}
	,listenOnce: function(id,func,listenerName) {
		var listener = new m3.event.EMListener(func,listenerName);
		return this.listenOnceInternal(id,listener);
	}
	,listenOnceInternal: function(id,listener) {
		var map = this.hash.get(id);
		this.oneTimers.push(listener.get_uid());
		return this.addListenerInternal(id,listener);
	}
	,removeListener: function(id,listenerUid) {
		var map = this.hash.get(id);
		if(map != null) map.remove(listenerUid);
	}
	,change: function(id,t) {
		this.get_logger().debug("EVENTMODEL: Change to " + Std.string(id));
		var map = this.hash.get(id);
		if(map == null) {
			this.get_logger().warn("No listeners for event " + Std.string(id));
			return;
		}
		var iter = map.iterator();
		while(iter.hasNext()) {
			var listener = iter.next();
			this.get_logger().debug("Notifying " + listener.get_name() + " of " + Std.string(id) + " event");
			try {
				listener.change(t);
				if((function($this) {
					var $r;
					var x = listener.get_uid();
					$r = HxOverrides.remove($this.oneTimers,x);
					return $r;
				}(this))) {
					var key = listener.get_uid();
					map.remove(key);
				}
			} catch( err ) {
				this.get_logger().error("Error executing " + listener.get_name() + " of " + Std.string(id) + " event",m3.log.Logga.getExceptionInst(err));
			}
		}
	}
	,__class__: m3.event.EventManager
};
m3.event.EMListener = function(fcn,name) {
	this.fcn = fcn;
	this.uid = m3.util.UidGenerator.create(20);
	if(name == null) this.name = this.get_uid(); else this.name = name;
};
$hxClasses["m3.event.EMListener"] = m3.event.EMListener;
m3.event.EMListener.__name__ = ["m3","event","EMListener"];
m3.event.EMListener.prototype = {
	change: function(t) {
		this.fcn(t);
	}
	,get_uid: function() {
		return this.uid;
	}
	,get_name: function() {
		return this.name;
	}
	,__class__: m3.event.EMListener
};
m3.exception = {};
m3.exception.Exception = function(message,cause) {
	this.message = message;
	this.cause = cause;
	try {
		this.callStack = haxe.CallStack.callStack();
	} catch( err ) {
	}
};
$hxClasses["m3.exception.Exception"] = m3.exception.Exception;
m3.exception.Exception.__name__ = ["m3","exception","Exception"];
m3.exception.Exception.prototype = {
	rootCause: function() {
		var ch = this.chain();
		return ch[ch.length - 1];
	}
	,chain: function() {
		var chain = [];
		var gather;
		var gather1 = null;
		gather1 = function(e) {
			if(e != null) {
				chain.push(e);
				gather1(e.cause);
			}
		};
		gather = gather1;
		gather(this);
		return chain;
	}
	,stackTrace: function() {
		var l = new Array();
		var index = 0;
		var _g = 0;
		var _g1 = this.chain();
		while(_g < _g1.length) {
			var e = _g1[_g];
			++_g;
			if(index++ > 0) l.push("CAUSED BY: " + e.message); else l.push("ERROR: " + e.message);
			var _g2 = 0;
			var _g3 = e.callStack;
			while(_g2 < _g3.length) {
				var s = _g3[_g2];
				++_g2;
				l.push("  " + Std.string(s));
			}
		}
		return l.join("\n");
	}
	,messageList: function() {
		return this.chain().map(function(e) {
			return e.message;
		});
	}
	,__class__: m3.exception.Exception
};
m3.exception.AjaxException = function(message,cause,statusCode) {
	this.statusCode = statusCode;
	m3.exception.Exception.call(this,message,cause);
};
$hxClasses["m3.exception.AjaxException"] = m3.exception.AjaxException;
m3.exception.AjaxException.__name__ = ["m3","exception","AjaxException"];
m3.exception.AjaxException.__super__ = m3.exception.Exception;
m3.exception.AjaxException.prototype = $extend(m3.exception.Exception.prototype,{
	__class__: m3.exception.AjaxException
});
m3.exception.RedirectionException = function(message,cause,location) {
	m3.exception.Exception.call(this,message,cause);
	this.location = location;
};
$hxClasses["m3.exception.RedirectionException"] = m3.exception.RedirectionException;
m3.exception.RedirectionException.__name__ = ["m3","exception","RedirectionException"];
m3.exception.RedirectionException.__super__ = m3.exception.Exception;
m3.exception.RedirectionException.prototype = $extend(m3.exception.Exception.prototype,{
	__class__: m3.exception.RedirectionException
});
m3.helper = {};
m3.helper.ArrayHelper = $hx_exports.m3.helper.ArrayHelper = function() { };
$hxClasses["m3.helper.ArrayHelper"] = m3.helper.ArrayHelper;
m3.helper.ArrayHelper.__name__ = ["m3","helper","ArrayHelper"];
m3.helper.ArrayHelper.indexOf = function(array,t) {
	if(array == null) return -1;
	var index = -1;
	var _g1 = 0;
	var _g = array.length;
	while(_g1 < _g) {
		var i_ = _g1++;
		if(array[i_] == t) {
			index = i_;
			break;
		}
	}
	return index;
};
m3.helper.ArrayHelper.indexOfComplex = function(array,value,propOrFcn,startingIndex) {
	if(startingIndex == null) startingIndex = 0;
	if(array == null) return -1;
	var result = -1;
	if(array != null && array.length > 0) {
		var _g1 = startingIndex;
		var _g = array.length;
		while(_g1 < _g) {
			var idx_ = _g1++;
			var comparisonValue;
			if(typeof(propOrFcn) == "string") comparisonValue = Reflect.field(array[idx_],propOrFcn); else comparisonValue = propOrFcn(array[idx_]);
			if(value == comparisonValue) {
				result = idx_;
				break;
			}
		}
	}
	return result;
};
m3.helper.ArrayHelper.indexOfComplexInSubArray = function(array,value,subArrayProp,startingIndex) {
	if(startingIndex == null) startingIndex = 0;
	if(array == null) return -1;
	var result = -1;
	var _g1 = startingIndex;
	var _g = array.length;
	while(_g1 < _g) {
		var idx_ = _g1++;
		var subArray = Reflect.field(array[idx_],subArrayProp);
		if(m3.helper.ArrayHelper.contains(subArray,value)) {
			result = idx_;
			break;
		}
	}
	return result;
};
m3.helper.ArrayHelper.indexOfArrayComparison = function(array,comparison,startingIndex) {
	if(startingIndex == null) startingIndex = 0;
	var result = -1;
	if(array != null) {
		if(m3.helper.ArrayHelper.hasValues(comparison)) {
			var base = comparison[0];
			var baseIndex = m3.helper.ArrayHelper.indexOfComplex(array,base.value,base.propOrFcn,startingIndex);
			while(baseIndex > -1 && result < 0) {
				var candidate = array[baseIndex];
				var breakOut = false;
				var _g1 = 1;
				var _g = comparison.length;
				while(_g1 < _g) {
					var c_ = _g1++;
					var comparisonValue;
					if(typeof(comparison[c_].propOrFcn) == "string") comparisonValue = Reflect.field(candidate,comparison[c_].propOrFcn); else comparisonValue = comparison[c_].propOrFcn(candidate);
					if(comparison[c_].value == comparisonValue) continue; else {
						baseIndex = m3.helper.ArrayHelper.indexOfComplex(array,base.value,base.propOrFcn,baseIndex + 1);
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
};
m3.helper.ArrayHelper.getElementComplex = function(array,value,propOrFcn,startingIndex) {
	if(startingIndex == null) startingIndex = 0;
	if(array == null) return null;
	var result = null;
	var _g1 = startingIndex;
	var _g = array.length;
	while(_g1 < _g) {
		var idx_ = _g1++;
		var comparisonValue;
		if(typeof(propOrFcn) == "string") comparisonValue = Reflect.field(array[idx_],propOrFcn); else comparisonValue = propOrFcn(array[idx_]);
		if(value == comparisonValue) {
			result = array[idx_];
			break;
		}
	}
	return result;
};
m3.helper.ArrayHelper.getElementComplexInSubArray = function(array,value,subArrayProp,startingIndex) {
	if(startingIndex == null) startingIndex = 0;
	if(array == null) return null;
	var result = null;
	var _g1 = startingIndex;
	var _g = array.length;
	while(_g1 < _g) {
		var idx_ = _g1++;
		var subArray = Reflect.field(array[idx_],subArrayProp);
		if(m3.helper.ArrayHelper.contains(subArray,value)) {
			result = array[idx_];
			break;
		}
	}
	return result;
};
m3.helper.ArrayHelper.getElementArrayComparison = function(array,comparison,startingIndex) {
	if(startingIndex == null) startingIndex = 0;
	var result = null;
	if(array != null) {
		if(m3.helper.ArrayHelper.hasValues(comparison)) {
			var base = comparison[0];
			var baseIndex = m3.helper.ArrayHelper.indexOfComplex(array,base.value,base.propOrFcn,startingIndex);
			while(baseIndex > -1 && result == null) {
				var candidate = array[baseIndex];
				var breakOut = false;
				var _g1 = 1;
				var _g = comparison.length;
				while(_g1 < _g) {
					var c_ = _g1++;
					var comparisonValue;
					if(typeof(comparison[c_].propOrFcn) == "string") comparisonValue = Reflect.field(candidate,comparison[c_].propOrFcn); else comparisonValue = comparison[c_].propOrFcn(candidate);
					if(comparison[c_].value == comparisonValue) continue; else {
						baseIndex = m3.helper.ArrayHelper.indexOfComplex(array,base.value,base.propOrFcn,baseIndex + 1);
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
};
m3.helper.ArrayHelper.contains = function(array,value) {
	if(array == null) return false;
	var contains = Lambda.indexOf(array,value);
	return contains > -1;
};
m3.helper.ArrayHelper.containsAny = function(array,valueArray) {
	if(array == null || valueArray == null) return false;
	var contains = -1;
	var _g1 = 0;
	var _g = valueArray.length;
	while(_g1 < _g) {
		var v_ = _g1++;
		contains = Lambda.indexOf(array,valueArray[v_]);
		if(contains > -1) break;
	}
	return contains > -1;
};
m3.helper.ArrayHelper.containsAll = function(array,valueArray) {
	if(array == null || valueArray == null) return false;
	var anyFailures = false;
	var _g1 = 0;
	var _g = valueArray.length;
	while(_g1 < _g) {
		var v_ = _g1++;
		var index = Lambda.indexOf(array,valueArray[v_]);
		if(index < 0) {
			anyFailures = true;
			break;
		}
	}
	return !anyFailures;
};
m3.helper.ArrayHelper.containsComplex = function(array,value,propOrFcn,startingIndex) {
	if(startingIndex == null) startingIndex = 0;
	if(array == null) return false;
	var contains = m3.helper.ArrayHelper.indexOfComplex(array,value,propOrFcn,startingIndex);
	return contains > -1;
};
m3.helper.ArrayHelper.containsComplexInSubArray = function(array,value,subArrayProp,startingIndex) {
	if(startingIndex == null) startingIndex = 0;
	if(array == null) return false;
	var contains = m3.helper.ArrayHelper.indexOfComplexInSubArray(array,value,subArrayProp,startingIndex);
	return contains > -1;
};
m3.helper.ArrayHelper.containsArrayComparison = function(array,comparison,startingIndex) {
	if(startingIndex == null) startingIndex = 0;
	if(array == null) return false;
	var contains = m3.helper.ArrayHelper.indexOfArrayComparison(array,comparison,startingIndex);
	return contains > -1;
};
m3.helper.ArrayHelper.hasValues = function(array) {
	return array != null && array.length > 0;
};
m3.helper.ArrayHelper.joinX = function(array,sep) {
	if(array == null) return null;
	var s = "";
	var _g1 = 0;
	var _g = array.length;
	while(_g1 < _g) {
		var str_ = _g1++;
		var tmp = array[str_];
		if(m3.helper.StringHelper.isNotBlank(tmp)) tmp = StringTools.trim(tmp);
		if(m3.helper.StringHelper.isNotBlank(tmp) && str_ > 0 && s.length > 0) s += sep;
		s += array[str_];
	}
	return s;
};
m3.helper.DateHelper = function() { };
$hxClasses["m3.helper.DateHelper"] = m3.helper.DateHelper;
m3.helper.DateHelper.__name__ = ["m3","helper","DateHelper"];
m3.helper.DateHelper.inThePast = function(d) {
	return d.getTime() < new Date().getTime();
};
m3.helper.DateHelper.inTheFuture = function(d) {
	return d.getTime() > new Date().getTime();
};
m3.helper.DateHelper.isValid = function(d) {
	return d != null && !Math.isNaN(d.getTime());
};
m3.helper.DateHelper.isBefore = function(d1,d2) {
	return d1.getTime() < d2.getTime();
};
m3.helper.DateHelper.isAfter = function(d1,d2) {
	return !m3.helper.DateHelper.isBefore(d1,d2);
};
m3.helper.DateHelper.isBeforeToday = function(d) {
	return d.getTime() < m3.helper.DateHelper.startOfToday().getTime();
};
m3.helper.DateHelper.startOfToday = function() {
	var now = new Date();
	var s = now.getFullYear() + "-" + m3.helper.StringHelper.padLeft("" + (now.getMonth() + 1),2,"0") + "-" + m3.helper.StringHelper.padLeft("" + now.getDate(),2,"0");
	return HxOverrides.strDate(s);
};
m3.helper.OSetHelper = function() { };
$hxClasses["m3.helper.OSetHelper"] = m3.helper.OSetHelper;
m3.helper.OSetHelper.__name__ = ["m3","helper","OSetHelper"];
m3.helper.OSetHelper.getElement = function(oset,value,startingIndex) {
	if(startingIndex == null) startingIndex = 0;
	return m3.helper.OSetHelper.getElementComplex(oset,value,null,startingIndex);
};
m3.helper.OSetHelper.getElementComplex = function(oset,value,propOrFcn,startingIndex) {
	if(startingIndex == null) startingIndex = 0;
	if(oset == null) return null;
	if(propOrFcn == null) propOrFcn = oset.identifier();
	var result = null;
	var index_ = -1;
	var iter = oset.iterator();
	while(iter.hasNext()) if(startingIndex > ++index_) continue; else {
		var comparisonT = iter.next();
		var comparisonValue;
		if(typeof(propOrFcn) == "string") comparisonValue = Reflect.field(comparisonT,propOrFcn); else comparisonValue = propOrFcn(comparisonT);
		if(value == comparisonValue) {
			result = comparisonT;
			break;
		}
	}
	return result;
};
m3.helper.OSetHelper.getElementComplex2 = function(oset,criteriaFunc) {
	if(oset == null) return null;
	if(criteriaFunc == null) return null;
	var result = null;
	var iter = oset.iterator();
	while(iter.hasNext()) {
		var comparisonT = iter.next();
		if(criteriaFunc(comparisonT)) {
			result = comparisonT;
			break;
		}
	}
	return result;
};
m3.helper.OSetHelper.hasValues = function(oset) {
	return oset != null && oset.iterator().hasNext();
};
m3.helper.OSetHelper.joinX = function(oset,sep,getString) {
	if(getString == null) getString = oset.identifier();
	var s = "";
	var iter = oset.iterator();
	var index = 0;
	while(iter.hasNext()) {
		var t = iter.next();
		var tmp = getString(t);
		if(m3.helper.StringHelper.isNotBlank(tmp)) tmp = StringTools.trim(tmp);
		if(m3.helper.StringHelper.isNotBlank(tmp) && index > 0 && s.length > 0) s += sep;
		s += getString(t);
		index++;
	}
	return s;
};
m3.helper.OSetHelper.strIdentifier = function(str) {
	return str;
};
m3.helper.StringHelper = function() { };
$hxClasses["m3.helper.StringHelper"] = m3.helper.StringHelper;
m3.helper.StringHelper.__name__ = ["m3","helper","StringHelper"];
m3.helper.StringHelper.compare = function(left,right) {
	if(left < right) return -1; else if(left > right) return 1; else return 0;
};
m3.helper.StringHelper.extractLast = function(term,splitValue) {
	if(splitValue == null) splitValue = ",";
	if(term == null) return term;
	var lastTerm = null;
	if(js.Boot.__instanceof(splitValue,EReg)) lastTerm = (js.Boot.__cast(splitValue , EReg)).split(term).pop(); else lastTerm = term.split(splitValue).pop();
	return lastTerm;
};
m3.helper.StringHelper.replaceAll = function(original,sub,by) {
	if(original == null) return original;
	if(!(typeof(original) == "string")) if(original == null) original = "null"; else original = "" + original;
	while(original.indexOf(sub) >= 0) if(js.Boot.__instanceof(sub,EReg)) original = (js.Boot.__cast(sub , EReg)).replace(original,by); else original = StringTools.replace(original,sub,by);
	return original;
};
m3.helper.StringHelper.replaceLast = function(original,newLastTerm,splitValue) {
	if(splitValue == null) splitValue = ".";
	if(m3.helper.StringHelper.isBlank(original)) return original;
	var pathSplit = original.split(splitValue);
	pathSplit.pop();
	pathSplit.push(newLastTerm);
	return pathSplit.join(".");
};
m3.helper.StringHelper.capitalizeFirstLetter = function(str) {
	if(m3.helper.StringHelper.isBlank(str)) return str;
	return HxOverrides.substr(str,0,1).toUpperCase() + HxOverrides.substr(str,1,str.length);
};
m3.helper.StringHelper.camelCase = function(str) {
	if(m3.helper.StringHelper.isBlank(str)) return str;
	return HxOverrides.substr(str,0,1).toLowerCase() + HxOverrides.substr(str,1,str.length);
};
m3.helper.StringHelper.isBlank = function(str) {
	return str == null || $.trim(str) == "";
};
m3.helper.StringHelper.isNotBlank = function(str) {
	return !m3.helper.StringHelper.isBlank(str);
};
m3.helper.StringHelper.indentLeft = function(baseString,chars,padChar) {
	if(baseString == null) baseString = "";
	var padding = "";
	var _g = 0;
	while(_g < chars) {
		var i_ = _g++;
		padding += padChar;
	}
	return padding + baseString;
};
m3.helper.StringHelper.padLeft = function(baseString,minChars,padChar) {
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
};
m3.helper.StringHelper.padRight = function(baseString,minChars,padChar) {
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
};
m3.helper.StringHelper.trimLeft = function(s,minChars,trimChars) {
	if(trimChars == null) trimChars = " \n\t";
	if(minChars == null) minChars = 0;
	if(s == null) s = "";
	if(s.length < minChars) return s;
	var i = 0;
	while(i <= s.length && trimChars.indexOf(HxOverrides.substr(s,i,1)) >= 0) i += 1;
	if(s.length - i < minChars) i = s.length - minChars;
	return HxOverrides.substr(s,i,null);
};
m3.helper.StringHelper.trimRight = function(s,minChars,trimChars) {
	if(trimChars == null) trimChars = " \n\t";
	if(minChars == null) minChars = 0;
	if(s == null) s = "";
	if(s.length < minChars) return s;
	var i = s.length;
	while(i > 0 && trimChars.indexOf(HxOverrides.substr(s,i - 1,1)) >= 0) i -= 1;
	if(s.length - i < minChars) i = minChars;
	return HxOverrides.substr(s,0,i);
};
m3.helper.StringHelper.contains = function(baseString,str) {
	if(m3.helper.StringHelper.isBlank(baseString)) return false;
	return baseString.indexOf(str) > -1;
};
m3.helper.StringHelper.containsAny = function(baseString,sarray) {
	if(m3.helper.StringHelper.isBlank(baseString)) return false; else {
		var _g1 = 0;
		var _g = sarray.length;
		while(_g1 < _g) {
			var s_ = _g1++;
			if(m3.helper.StringHelper.contains(baseString,sarray[s_])) return true;
		}
	}
	return false;
};
m3.helper.StringHelper.startsWithAny = function(baseString,sarray) {
	if(m3.helper.StringHelper.isBlank(baseString)) return false; else {
		var _g1 = 0;
		var _g = sarray.length;
		while(_g1 < _g) {
			var s_ = _g1++;
			if(HxOverrides.substr(baseString,0,sarray[s_].length) == sarray[s_]) return true;
		}
	}
	return false;
};
m3.helper.StringHelper.endsWithAny = function(baseString,sarray) {
	if(m3.helper.StringHelper.isBlank(baseString)) return false; else {
		var _g1 = 0;
		var _g = sarray.length;
		while(_g1 < _g) {
			var s_ = _g1++;
			if(StringTools.endsWith(baseString,sarray[s_])) return true;
		}
	}
	return false;
};
m3.helper.StringHelper.splitByReg = function(baseString,reg) {
	var result = null;
	if(baseString != null && reg != null) result = reg.split(baseString);
	return result;
};
m3.helper.StringHelper.toDate = function(baseString) {
	var date = null;
	if(m3.helper.StringHelper.isNotBlank(baseString)) {
		try {
			date = HxOverrides.strDate(baseString);
		} catch( err ) {
		}
		if(!m3.helper.DateHelper.isValid(date) && baseString.indexOf("/") > -1) try {
			var split = baseString.split("/");
			var temp = split[2] + "-" + split[0] + "-" + split[1];
			date = HxOverrides.strDate(temp);
		} catch( err1 ) {
		}
	}
	if(!m3.helper.DateHelper.isValid(date)) date == null;
	return date;
};
m3.helper.StringHelper.boolAsYesNo = function(bool) {
	if(bool) return "Yes"; else return "No";
};
m3.helper.StringHelper.toBool = function(str) {
	if(str == null) return false;
	return str.toLowerCase() == "true";
};
m3.jq = {};
m3.jq.JQDialogHelper = function() { };
$hxClasses["m3.jq.JQDialogHelper"] = m3.jq.JQDialogHelper;
m3.jq.JQDialogHelper.__name__ = ["m3","jq","JQDialogHelper"];
m3.jq.JQDialogHelper.close = function(d) {
	d.dialog("close");
};
m3.jq.JQDialogHelper.open = function(d) {
	d.dialog("open");
};
m3.jq.JQMenuHelper = function() { };
$hxClasses["m3.jq.JQMenuHelper"] = m3.jq.JQMenuHelper;
m3.jq.JQMenuHelper.__name__ = ["m3","jq","JQMenuHelper"];
m3.jq.JQMenuHelper.blur = function(m) {
	m.menu("blur");
};
m3.jq.JQMenuHelper.collapseAll = function(m) {
	m.menu("collapseAll");
};
m3.jq.JQMenuHelper.refresh = function(m) {
	m.menu("refresh");
};
m3.jq.M3DialogHelper = function() { };
$hxClasses["m3.jq.M3DialogHelper"] = m3.jq.M3DialogHelper;
m3.jq.M3DialogHelper.__name__ = ["m3","jq","M3DialogHelper"];
m3.jq.M3DialogHelper.close = function(dlg) {
	dlg.m3dialog("close");
};
m3.jq.M3DialogHelper.open = function(dlg) {
	dlg.m3dialog("open");
};
m3.jq.M3DialogHelper.isOpen = function(dlg) {
	return dlg.m3dialog("isOpen");
};
m3.log = {};
m3.log.Logga = function(logLevel) {
	this.initialized = false;
	this.loggerLevel = logLevel;
};
$hxClasses["m3.log.Logga"] = m3.log.Logga;
m3.log.Logga.__name__ = ["m3","log","Logga"];
m3.log.Logga.get_DEFAULT = function() {
	if(m3.log.Logga.DEFAULT == null) m3.log.Logga.DEFAULT = new m3.log.RemoteLogga(m3.log.LogLevel.DEBUG,m3.log.LogLevel.DEBUG);
	return m3.log.Logga.DEFAULT;
};
m3.log.Logga.getExceptionInst = function(err) {
	if(js.Boot.__instanceof(err,m3.exception.Exception)) return err; else return new m3.exception.Exception(err);
};
m3.log.Logga.prototype = {
	doOverrides: function() {
		this.overrideConsoleError();
		this.overrideConsoleTrace();
		this.overrideConsoleLog();
		window.onerror = function(message,url,lineNumber) {
			LOGGER.error("WindowError | " + url + " (" + lineNumber + ") | " + message);
			return false;
		};
	}
	,_getLogger: function() {
		this.console = window.console;
		this.initialized = true;
	}
	,overrideConsoleError: function() {
		var _g = this;
		if(!this.initialized) this._getLogger();
		if(this.console != null) try {
			this.preservedConsoleError = ($_=this.console,$bind($_,$_.error));
			this.console.error = function() {
				_g.error(arguments[0]);
			};
		} catch( err ) {
			this.warn("Could not override console.error");
		}
	}
	,overrideConsoleTrace: function() {
		var _g = this;
		if(!this.initialized) this._getLogger();
		if(this.console != null) try {
			this.preservedConsoleTrace = ($_=this.console,$bind($_,$_.trace));
			this.console.trace = function() {
				_g.preservedConsoleTrace.apply(_g.console);
			};
		} catch( err ) {
			this.warn("Could not override console.trace");
		}
	}
	,overrideConsoleLog: function() {
		var _g = this;
		if(!this.initialized) this._getLogger();
		if(this.console != null) try {
			this.console.log("prime console.log");
			this.preservedConsoleLog = ($_=this.console,$bind($_,$_.log));
			this.console.log = function() {
				_g.warn(arguments[0]);
			};
		} catch( err ) {
			this.warn("Could not override console.log");
		}
	}
	,setStatementPrefix: function(prefix) {
		this.statementPrefix = prefix;
	}
	,log: function(statement,level,exception) {
		if(!this.initialized) this._getLogger();
		if(level == null) level = m3.log.LogLevel.INFO;
		try {
			if(exception != null && $bind(exception,exception.stackTrace) != null && Reflect.isFunction($bind(exception,exception.stackTrace))) statement += "\n" + exception.stackTrace();
		} catch( err ) {
			this.log("Could not get stackTrace",m3.log.LogLevel.ERROR);
		}
		if(m3.helper.StringHelper.isBlank(statement)) {
			this.console.error("empty log statement");
			this.console.trace();
		}
		if(m3.helper.StringHelper.isNotBlank(this.statementPrefix)) statement = this.statementPrefix + " || " + statement;
		if(this.logsAtLevel(level) && this.console != null) try {
			if((Type.enumEq(level,m3.log.LogLevel.TRACE) || Type.enumEq(level,m3.log.LogLevel.DEBUG)) && ($_=this.console,$bind($_,$_.debug)) != null) this.console.debug(statement); else if(Type.enumEq(level,m3.log.LogLevel.INFO) && ($_=this.console,$bind($_,$_.info)) != null) this.console.info(statement); else if(Type.enumEq(level,m3.log.LogLevel.WARN) && ($_=this.console,$bind($_,$_.warn)) != null) this.console.warn(statement); else if(Type.enumEq(level,m3.log.LogLevel.ERROR) && this.preservedConsoleError != null) {
				this.preservedConsoleError.apply(this.console,[statement]);
				this.console.trace();
			} else if(Type.enumEq(level,m3.log.LogLevel.ERROR) && ($_=this.console,$bind($_,$_.error)) != null) {
				this.console.error(statement);
				this.console.trace();
			} else if(this.preservedConsoleLog != null) this.preservedConsoleLog.apply(this.console,[statement]); else this.console.log(statement);
		} catch( err1 ) {
			if(this.console != null && Object.prototype.hasOwnProperty.call(this.console,"error")) this.console.error(err1);
		}
	}
	,logsAtLevel: function(level) {
		return this.loggerLevel[1] <= level[1];
	}
	,setLogLevel: function(logLevel) {
		this.loggerLevel = logLevel;
	}
	,trace: function(statement,exception) {
		this.log(statement,m3.log.LogLevel.TRACE,exception);
	}
	,debug: function(statement,exception) {
		this.log(statement,m3.log.LogLevel.DEBUG,exception);
	}
	,info: function(statement,exception) {
		this.log(statement,m3.log.LogLevel.INFO,exception);
	}
	,warn: function(statement,exception) {
		this.log(statement,m3.log.LogLevel.WARN,exception);
	}
	,error: function(statement,exception) {
		this.log(statement,m3.log.LogLevel.ERROR,exception);
	}
	,__class__: m3.log.Logga
};
m3.log.LogLevel = $hxClasses["m3.log.LogLevel"] = { __ename__ : ["m3","log","LogLevel"], __constructs__ : ["TRACE","DEBUG","INFO","WARN","ERROR"] };
m3.log.LogLevel.TRACE = ["TRACE",0];
m3.log.LogLevel.TRACE.__enum__ = m3.log.LogLevel;
m3.log.LogLevel.DEBUG = ["DEBUG",1];
m3.log.LogLevel.DEBUG.__enum__ = m3.log.LogLevel;
m3.log.LogLevel.INFO = ["INFO",2];
m3.log.LogLevel.INFO.__enum__ = m3.log.LogLevel;
m3.log.LogLevel.WARN = ["WARN",3];
m3.log.LogLevel.WARN.__enum__ = m3.log.LogLevel;
m3.log.LogLevel.ERROR = ["ERROR",4];
m3.log.LogLevel.ERROR.__enum__ = m3.log.LogLevel;
m3.log.LogLevel.__empty_constructs__ = [m3.log.LogLevel.TRACE,m3.log.LogLevel.DEBUG,m3.log.LogLevel.INFO,m3.log.LogLevel.WARN,m3.log.LogLevel.ERROR];
m3.log.RemoteLogga = function(consoleLevel,remoteLevel) {
	m3.log.Logga.call(this,consoleLevel);
	this.remoteLogLevel = remoteLevel;
	this.logs = [];
	this.sessionUid = m3.util.UidGenerator.create(32);
	this.log("SessionUid: " + this.sessionUid);
};
$hxClasses["m3.log.RemoteLogga"] = m3.log.RemoteLogga;
m3.log.RemoteLogga.__name__ = ["m3","log","RemoteLogga"];
m3.log.RemoteLogga.pauseRemoteLogging = function() {
	if(Std["is"](m3.log.Logga.get_DEFAULT(),m3.log.RemoteLogga)) {
		var rl = m3.log.Logga.get_DEFAULT();
		rl.pause();
	}
};
m3.log.RemoteLogga.unpauseRemoteLogging = function() {
	if(Std["is"](m3.log.Logga.get_DEFAULT(),m3.log.RemoteLogga)) {
		var rl = m3.log.Logga.get_DEFAULT();
		rl.unpause();
	}
};
m3.log.RemoteLogga.__super__ = m3.log.Logga;
m3.log.RemoteLogga.prototype = $extend(m3.log.Logga.prototype,{
	log: function(statement,level,exception) {
		if(level == null) level = m3.log.LogLevel.INFO;
		m3.log.Logga.prototype.log.call(this,statement,level,exception);
		if(this.timer != null && this.remoteLogsAtLevel(level)) {
			try {
				if(exception != null && $bind(exception,exception.stackTrace) != null && Reflect.isFunction($bind(exception,exception.stackTrace))) statement += "\n" + exception.stackTrace();
			} catch( err ) {
			}
			this.logs.push({ sessionUid : this.sessionUid, at : DateTools.format(new Date(),"%Y-%m-%d %T"), message : statement, severity : level[0], category : "ui"});
			if(this.logs.length > 50) this.timer.run();
		}
	}
	,remoteLogsAtLevel: function(level) {
		return this.remoteLogLevel[1] <= level[1];
	}
	,setRemoteLoggingFcn: function(remoteLogFcn) {
		var _g = this;
		if(this.timer != null) this.timer.stop();
		if(remoteLogFcn != null) this.timer = new m3.log._RemoteLogga.RemoteLoggingTimer(remoteLogFcn,function() {
			var saved = _g.logs;
			_g.logs = [];
			return saved;
		});
	}
	,pause: function() {
		if(this.timer != null) this.timer.pause();
	}
	,unpause: function() {
		if(this.timer != null) this.timer.unpause();
	}
	,__class__: m3.log.RemoteLogga
});
m3.util = {};
m3.util.UidGenerator = function() { };
$hxClasses["m3.util.UidGenerator"] = m3.util.UidGenerator;
m3.util.UidGenerator.__name__ = ["m3","util","UidGenerator"];
m3.util.UidGenerator.get_chars = function() {
	return "ABCDEFGHIJKLMNOPQRSTUVWXYZabsdefghijklmnopqrstuvwxyz0123456789";
};
m3.util.UidGenerator.get_nums = function() {
	return "0123456789";
};
m3.util.UidGenerator.create = function(length) {
	if(length == null) length = 20;
	var str = new Array();
	var charsLength = m3.util.UidGenerator.get_chars().length;
	while(str.length == 0) {
		var ch = m3.util.UidGenerator.randomChar();
		if(m3.util.UidGenerator.isLetter(ch)) str.push(ch);
	}
	while(str.length < length) {
		var ch1 = m3.util.UidGenerator.randomChar();
		str.push(ch1);
	}
	return str.join("");
};
m3.util.UidGenerator.isLetter = function($char) {
	var _g1 = 0;
	var _g = m3.util.UidGenerator.get_chars().length;
	while(_g1 < _g) {
		var i = _g1++;
		if(m3.util.UidGenerator.get_chars().charAt(i) == $char) return true;
	}
	return false;
};
m3.util.UidGenerator.randomNum = function() {
	var max = m3.util.UidGenerator.get_chars().length - 1;
	var min = 0;
	return min + Math.round(Math.random() * (max - min) + 1);
};
m3.util.UidGenerator.randomIndex = function(str) {
	var max = str.length - 1;
	var min = 0;
	return min + Math.round(Math.random() * (max - min) + 1);
};
m3.util.UidGenerator.randomChar = function() {
	var i = 0;
	while((i = m3.util.UidGenerator.randomIndex(m3.util.UidGenerator.get_chars())) >= m3.util.UidGenerator.get_chars().length) continue;
	return m3.util.UidGenerator.get_chars().charAt(i);
};
m3.util.UidGenerator.randomNumChar = function() {
	var i = 0;
	while((i = m3.util.UidGenerator.randomIndex(m3.util.UidGenerator.get_nums())) >= m3.util.UidGenerator.get_nums().length) continue;
	return Std.parseInt(m3.util.UidGenerator.get_nums().charAt(i));
};
m3.jq.PlaceHolderUtil = function() { };
$hxClasses["m3.jq.PlaceHolderUtil"] = m3.jq.PlaceHolderUtil;
m3.jq.PlaceHolderUtil.__name__ = ["m3","jq","PlaceHolderUtil"];
m3.jq.PlaceHolderUtil.setFocusBehavior = function(input,placeholder) {
	placeholder.focus(function(evt) {
		placeholder.hide();
		input.show().focus();
	});
	input.blur(function(evt1) {
		if(m3.helper.StringHelper.isBlank(input.val())) {
			placeholder.show();
			input.hide();
		}
	});
};
m3.jq.pages = {};
m3.jq.pages.Page = function(opts) {
	this.holdingOnInitialization = false;
	this.showBackButton = true;
	var _g = this;
	if(!m3.jq.pages.SinglePageManager.SCREEN_MAP.exists(opts.id)) m3.jq.pages.SinglePageManager.SCREEN_MAP.set(opts.id,this); else throw new m3.exception.Exception("Page with this ID already exists! | " + opts.id);
	this.options = opts;
	this.applyDefaults();
	this.id = this.options.id;
	this.showBackButton = this.options.showBackButton;
	this.pageBeforeCreate = function(screen) {
		_g.options.pageBeforeCreateFcn(screen);
	};
	this.pageShow = function(screen1) {
		m3.log.Logga.get_DEFAULT().debug("pageShow " + _g.id);
		_g.options.pageShowFcn(screen1);
	};
	this.pageHide = function(screen2) {
		m3.log.Logga.get_DEFAULT().debug("pageHide " + _g.id);
		_g.options.pageHideFcn(screen2);
	};
	if(this.options.customReloadFcn == null) this.reshow = function(screen3) {
		if(_g.holdingOnInitialization) {
			m3.log.Logga.get_DEFAULT().debug("don't reshow b/c we're holding on initialization");
			return;
		}
		_g.options.pageBeforeShowFcn(screen3);
	}; else this.reshow = function(screen4) {
		if(_g.holdingOnInitialization) {
			m3.log.Logga.get_DEFAULT().debug("don't reshow b/c we're holding on initialization");
			return;
		}
		_g.options.customReloadFcn(screen4);
	};
};
$hxClasses["m3.jq.pages.Page"] = m3.jq.pages.Page;
m3.jq.pages.Page.__name__ = ["m3","jq","pages","Page"];
m3.jq.pages.Page.noOp = function(jq) {
};
m3.jq.pages.Page.prototype = {
	getDefaults: function() {
		return { id : null, pageBeforeCreateFcn : m3.jq.pages.Page.noOp, pageBeforeShowFcn : m3.jq.pages.Page.noOp, pageHideFcn : m3.jq.pages.Page.noOp, pageShowFcn : m3.jq.pages.Page.noOp, reqUser : true, reloadUserOnShow : false, showBackButton : this.showBackButton, usesKeyboard : false};
	}
	,applyDefaults: function() {
		this.options = $.extend(this.getDefaults(),this.options);
	}
	,addPageToDom: function() {
		var pageDiv = new $("<div class='page' id='" + this.get_nonCssId() + "'></div>").appendTo(new $(window.document.body));
		this.initializePageContents(pageDiv);
	}
	,initializePageContents: function(pageDiv) {
		if(pageDiv != null) pageDiv.trigger("pagebeforecreate");
	}
	,get_pageBeforeCreate: function() {
		return this.pageBeforeCreate;
	}
	,get_pageBeforeShow: function() {
		return this.pageBeforeShow;
	}
	,get_pageShow: function() {
		return this.pageShow;
	}
	,get_pageHide: function() {
		return this.pageHide;
	}
	,get_reshow: function() {
		return this.reshow;
	}
	,get_screen: function() {
		if(this.screen == null) this.set_screen(new $(this.id));
		return this.screen;
	}
	,set_screen: function(screen) {
		this.screen = screen;
		return this.get_screen();
	}
	,get_nonCssId: function() {
		return this.id.substring(1);
	}
	,__class__: m3.jq.pages.Page
};
m3.jq.pages.SinglePageManager = function(isAppInitialized,onAppInitialized) {
	this.history = new Array();
	this.isAppInitialized = isAppInitialized;
};
$hxClasses["m3.jq.pages.SinglePageManager"] = m3.jq.pages.SinglePageManager;
m3.jq.pages.SinglePageManager.__name__ = ["m3","jq","pages","SinglePageManager"];
m3.jq.pages.SinglePageManager.prototype = {
	get_CURRENT_PAGE: function() {
		return this.getScreen(new $(".activePage").attr("id"));
	}
	,set_CURRENT_PAGE: function(page) {
		m3.log.Logga.get_DEFAULT().debug("set current page to " + page.get_nonCssId());
		if(page == this.get_CURRENT_PAGE()) m3.log.Logga.get_DEFAULT().debug("already on page " + page.get_nonCssId()); else this.changePage(page,false);
		return page;
	}
	,changePage: function(page,isBack) {
		var currentPage = this.get_CURRENT_PAGE();
		if(currentPage != null) {
			currentPage.get_screen().hide(0,function() {
				currentPage.get_screen().trigger("pagehide");
			});
			currentPage.get_screen().removeClass("activePage");
			if(!isBack) this.history.push(currentPage);
		}
		page.get_screen().trigger("pagebeforeshow");
		page.get_screen().addClass("activePage");
		page.get_screen().show(0,function() {
			page.get_screen().trigger("pageshow");
		});
		if(this.backBtn != null) {
			if(Lambda.empty(this.history)) this.backBtn.hide(); else this.backBtn.show();
		}
	}
	,setBackButton: function(backButton) {
		var _g = this;
		this.backBtn = backButton;
		this.backBtn.click(function(evt) {
			_g.back();
		});
	}
	,back: function() {
		if(!Lambda.empty(this.history)) {
			var page = this.history.pop();
			this.changePage(page,true);
			window.history.back();
		}
		if(this.backBtn != null) {
		}
	}
	,getScreen: function(id) {
		if(m3.helper.StringHelper.isBlank(id)) return null;
		if(id.charAt(0) != "#") id = "#" + id;
		return m3.jq.pages.SinglePageManager.SCREEN_MAP.get(id);
	}
	,getScreens: function() {
		return Lambda.array(m3.jq.pages.SinglePageManager.SCREEN_MAP);
	}
	,beforePageShow: function(evt) {
		try {
			if(evt != null && evt.target != null) {
				var target = new $(evt.target);
				var page = null;
				if((page = this.getScreen(target.attr("id"))) != null) (page.get_pageBeforeShow())(target);
			}
		} catch( $e0 ) {
			if( js.Boot.__instanceof($e0,m3.exception.RedirectionException) ) {
				var err = $e0;
				m3.log.Logga.get_DEFAULT().error("Redirecting to " + err.location.id + " because " + err.message);
				this.changePage(this.getScreen(err.location.id),false);
			} else {
			var err1 = $e0;
			var page1;
			if(evt != null && evt.target != null) page1 = new $(evt.target).attr("id"); else page1 = "";
			m3.log.Logga.get_DEFAULT().error("Error showing page " + page1,m3.log.Logga.getExceptionInst(err1));
			}
		}
	}
	,pageBeforeCreate: function(evt) {
		try {
			if(evt != null && evt.target != null) {
				var target = new $(evt.target);
				if(!target.exists()) js.Lib.alert("target page does not exist");
				var page = null;
				if((page = this.getScreen(target.attr("id"))) != null) (page.get_pageBeforeCreate())(target);
			}
		} catch( err ) {
			var page1;
			if(evt != null && evt.target != null) page1 = new $(evt.target).attr("id"); else page1 = "";
			m3.log.Logga.get_DEFAULT().error("Error showing page " + page1,m3.log.Logga.getExceptionInst(err));
		}
	}
	,pageShow: function(evt) {
		try {
			if(evt != null && evt.target != null) {
				var target = new $(evt.target);
				if(!target.exists()) js.Lib.alert("target page does not exist");
				var page = null;
				if((page = this.getScreen(target.attr("id"))) != null) (page.get_pageShow())(target);
			}
		} catch( err ) {
			var page1;
			if(evt != null && evt.target != null) page1 = new $(evt.target).attr("id"); else page1 = "";
			m3.log.Logga.get_DEFAULT().error("Error showing page " + page1,m3.log.Logga.getExceptionInst(err));
		}
	}
	,pageHide: function(evt) {
		try {
			if(evt != null && evt.target != null) {
				var target = new $(evt.target);
				if(!target.exists()) js.Lib.alert("target page does not exist");
				var page = null;
				if((page = this.getScreen(target.attr("id"))) != null) (page.get_pageHide())(target);
			}
		} catch( err ) {
			var page1;
			if(evt != null && evt.target != null) page1 = new $(evt.target).attr("id"); else page1 = "";
			m3.log.Logga.get_DEFAULT().error("Error hiding page " + page1,m3.log.Logga.getExceptionInst(err));
		}
	}
	,__class__: m3.jq.pages.SinglePageManager
};
m3.jqm = {};
m3.jqm.pages = {};
m3.jqm.pages.Page = function(opts) {
	this.holdingOnInitialization = false;
	this.showBackButton = true;
	if(!m3.jqm.pages.PageManager.SCREEN_MAP.exists(opts.id)) m3.jqm.pages.PageManager.SCREEN_MAP.set(opts.id,this); else throw new m3.exception.Exception("Page with this ID already exists! | " + opts.id);
	this.options = opts;
	this.applyDefaults();
	this.id = opts.id;
	this.showBackButton = opts.showBackButton;
};
$hxClasses["m3.jqm.pages.Page"] = m3.jqm.pages.Page;
m3.jqm.pages.Page.__name__ = ["m3","jqm","pages","Page"];
m3.jqm.pages.Page.noOp = function(jq) {
};
m3.jqm.pages.Page.prototype = {
	getDefaults: function() {
		return { id : null, pageBeforeCreateFcn : function(screen) {
		}, pageBeforeShowFcn : m3.jqm.pages.Page.noOp, pageChangeFcn : m3.jqm.pages.Page.noOp, reqUser : true, reloadUserOnShow : false, showBackButton : this.showBackButton, usesKeyboard : false};
	}
	,getDefaultPageTheme: function() {
		return "b";
	}
	,applyDefaults: function() {
		this.options = $.extend(this.getDefaults(),this.options);
	}
	,addPageToDom: function() {
		var pageDiv = new $("<div data-role='page' id='" + this.get_nonCssId() + "' data-theme='" + this.getDefaultPageTheme() + "'></div>").appendTo(new $(window.document.body));
		this.initializePageContents(pageDiv);
		pageDiv.page();
	}
	,initializePageContents: function(pageDiv) {
		throw "OVERRIDE ME";
	}
	,get_pageBeforeCreate: function() {
		return this.pageBeforeCreate;
	}
	,get_pageBeforeShow: function() {
		return this.pageBeforeShow;
	}
	,get_pageChange: function() {
		return this.pageChange;
	}
	,get_reshow: function() {
		return this.reshow;
	}
	,get_nonCssId: function() {
		return this.id.substring(1);
	}
	,__class__: m3.jqm.pages.Page
};
m3.jqm.pages.PageManager = function() {
};
$hxClasses["m3.jqm.pages.PageManager"] = m3.jqm.pages.PageManager;
m3.jqm.pages.PageManager.__name__ = ["m3","jqm","pages","PageManager"];
m3.jqm.pages.PageManager.prototype = {
	get_CURRENT_PAGE: function() {
		return this.getScreen(window.jQuery.mobile.activePage.attr("id"));
	}
	,set_CURRENT_PAGE: function(page) {
		m3.log.Logga.get_DEFAULT().debug("set current page to " + page.get_nonCssId());
		if(page == this.get_CURRENT_PAGE()) m3.log.Logga.get_DEFAULT().debug("already on page " + page.get_nonCssId()); else window.jQuery.mobile.changePage(page.id);
		return page;
	}
	,getScreen: function(id) {
		if(id.charAt(0) != "#") id = "#" + id;
		return m3.jqm.pages.PageManager.SCREEN_MAP.get(id);
	}
	,getScreens: function() {
		return Lambda.array(m3.jqm.pages.PageManager.SCREEN_MAP);
	}
	,beforePageShow: function(evt) {
		try {
			if(evt != null && evt.target != null) {
				var target = new $(evt.target);
				var page = null;
				if((page = this.getScreen(target.attr("id"))) != null) (page.get_pageBeforeShow())(target);
			}
		} catch( $e0 ) {
			if( js.Boot.__instanceof($e0,m3.exception.RedirectionException) ) {
				var err = $e0;
				m3.log.Logga.get_DEFAULT().error("Redirecting to " + err.location.id + " because " + err.message);
				window.jQuery.mobile.changePage(err.location.id);
			} else {
			var err1 = $e0;
			var page1;
			if(evt != null && evt.target != null) page1 = new $(evt.target).attr("id"); else page1 = "";
			m3.log.Logga.get_DEFAULT().error("Error showing page " + page1,m3.log.Logga.getExceptionInst(err1));
			}
		}
	}
	,pageBeforeCreate: function(evt) {
		try {
			if(evt != null && evt.target != null) {
				var target = new $(evt.target);
				if(!target.exists()) js.Lib.alert("target page does not exist");
				var page = null;
				if((page = this.getScreen(target.attr("id"))) != null) (page.get_pageBeforeCreate())(target);
			}
		} catch( err ) {
			var page1;
			if(evt != null && evt.target != null) page1 = new $(evt.target).attr("id"); else page1 = "";
			m3.log.Logga.get_DEFAULT().error("Error showing page " + page1,m3.log.Logga.getExceptionInst(err));
		}
	}
	,pageChange: function(evt,props) {
		try {
			if(props != null && props.toPage != null) {
				var id = props.toPage.attr("id");
				var page = null;
				if((page = this.getScreen(id)) != null) (page.get_pageChange())(props.toPage);
			}
		} catch( err ) {
			var page1;
			if(props != null && props.toPage != null) page1 = props.toPage.attr("id"); else page1 = "";
			m3.log.Logga.get_DEFAULT().error("Error showing page " + page1,m3.log.Logga.getExceptionInst(err));
		}
	}
	,__class__: m3.jqm.pages.PageManager
};
m3.log._RemoteLogga = {};
m3.log._RemoteLogga.RemoteLoggingTimer = function(remoteLogFcn,getMsgs) {
	this.paused = false;
	haxe.Timer.call(this,30000);
	this.remoteLogFcn = remoteLogFcn;
	this.getLogs = getMsgs;
};
$hxClasses["m3.log._RemoteLogga.RemoteLoggingTimer"] = m3.log._RemoteLogga.RemoteLoggingTimer;
m3.log._RemoteLogga.RemoteLoggingTimer.__name__ = ["m3","log","_RemoteLogga","RemoteLoggingTimer"];
m3.log._RemoteLogga.RemoteLoggingTimer.__super__ = haxe.Timer;
m3.log._RemoteLogga.RemoteLoggingTimer.prototype = $extend(haxe.Timer.prototype,{
	run: function() {
		if(this.paused) return;
		var logs = this.getLogs();
		if(m3.helper.ArrayHelper.hasValues(logs)) this.remoteLogFcn(logs); else {
		}
	}
	,pause: function() {
		m3.log.Logga.get_DEFAULT().debug("pausing remote logga");
		this.paused = true;
	}
	,unpause: function() {
		m3.log.Logga.get_DEFAULT().debug("unpausing remote logga");
		this.paused = false;
	}
	,__class__: m3.log._RemoteLogga.RemoteLoggingTimer
});
m3.observable = {};
m3.observable.OSet = function() { };
$hxClasses["m3.observable.OSet"] = m3.observable.OSet;
m3.observable.OSet.__name__ = ["m3","observable","OSet"];
m3.observable.OSet.prototype = {
	__class__: m3.observable.OSet
};
m3.observable.EventManager = function(set) {
	this._set = set;
	this._listeners = [];
};
$hxClasses["m3.observable.EventManager"] = m3.observable.EventManager;
m3.observable.EventManager.__name__ = ["m3","observable","EventManager"];
m3.observable.EventManager.prototype = {
	add: function(l,autoFire) {
		if(autoFire) Lambda.iter(this._set,function(it) {
			return l(it,m3.observable.EventType.Add);
		});
		this._listeners.push(l);
	}
	,remove: function(l) {
		HxOverrides.remove(this._listeners,l);
	}
	,fire: function(t,type) {
		var _g = this;
		Lambda.iter(this._listeners,function(l) {
			try {
				l(t,type);
			} catch( err ) {
				m3.log.Logga.get_DEFAULT().error("Error processing listener on " + _g._set.getVisualId(),m3.log.Logga.getExceptionInst(err));
			}
		});
	}
	,listenerCount: function() {
		return this._listeners.length;
	}
	,__class__: m3.observable.EventManager
};
m3.observable.EventType = function(name,add,update,clear) {
	this._name = name;
	this._add = add;
	this._update = update;
	this._clear = clear;
};
$hxClasses["m3.observable.EventType"] = m3.observable.EventType;
m3.observable.EventType.__name__ = ["m3","observable","EventType"];
m3.observable.EventType.prototype = {
	name: function() {
		return this._name;
	}
	,isAdd: function() {
		return this._add;
	}
	,isUpdate: function() {
		return this._update;
	}
	,isAddOrUpdate: function() {
		return this._add || this._update;
	}
	,isDelete: function() {
		return !(this._add || this._update || this._clear);
	}
	,isClear: function() {
		return this._clear;
	}
	,__class__: m3.observable.EventType
};
m3.observable.AbstractSet = function() {
	this._eventManager = new m3.observable.EventManager(this);
};
$hxClasses["m3.observable.AbstractSet"] = m3.observable.AbstractSet;
m3.observable.AbstractSet.__name__ = ["m3","observable","AbstractSet"];
m3.observable.AbstractSet.__interfaces__ = [m3.observable.OSet];
m3.observable.AbstractSet.prototype = {
	listen: function(l,autoFire) {
		if(autoFire == null) autoFire = true;
		this._eventManager.add(l,autoFire);
	}
	,removeListener: function(l) {
		this._eventManager.remove(l);
	}
	,filter: function(f) {
		return new m3.observable.FilteredSet(this,f);
	}
	,map: function(f) {
		return new m3.observable.MappedSet(this,f);
	}
	,fire: function(t,type) {
		this._eventManager.fire(t,type);
	}
	,getVisualId: function() {
		return this.visualId;
	}
	,identifier: function() {
		throw new m3.exception.Exception("implement me");
	}
	,iterator: function() {
		throw new m3.exception.Exception("implement me");
	}
	,delegate: function() {
		throw new m3.exception.Exception("implement me");
	}
	,__class__: m3.observable.AbstractSet
};
m3.observable.ObservableSet = function(identifier,tArr) {
	m3.observable.AbstractSet.call(this);
	this._identifier = identifier;
	this._delegate = new m3.util.SizedMap();
	if(tArr != null) this.addAll(tArr);
};
$hxClasses["m3.observable.ObservableSet"] = m3.observable.ObservableSet;
m3.observable.ObservableSet.__name__ = ["m3","observable","ObservableSet"];
m3.observable.ObservableSet.__super__ = m3.observable.AbstractSet;
m3.observable.ObservableSet.prototype = $extend(m3.observable.AbstractSet.prototype,{
	add: function(t) {
		this.addOrUpdate(t);
	}
	,addAll: function(tArr) {
		if(tArr != null && tArr.length > 0) {
			var _g1 = 0;
			var _g = tArr.length;
			while(_g1 < _g) {
				var t_ = _g1++;
				this.addOrUpdate(tArr[t_]);
			}
		}
	}
	,iterator: function() {
		return this._delegate.iterator();
	}
	,isEmpty: function() {
		return Lambda.empty(this._delegate);
	}
	,addOrUpdate: function(t) {
		var key = (this.identifier())(t);
		var type;
		if(this._delegate.exists(key)) type = m3.observable.EventType.Update; else type = m3.observable.EventType.Add;
		this._delegate.set(key,t);
		this.fire(t,type);
	}
	,delegate: function() {
		return this._delegate;
	}
	,update: function(t) {
		this.addOrUpdate(t);
	}
	,'delete': function(t) {
		var key = (this.identifier())(t);
		if(this._delegate.exists(key)) {
			this._delegate.remove(key);
			this.fire(t,m3.observable.EventType.Delete);
		}
	}
	,identifier: function() {
		return this._identifier;
	}
	,clear: function() {
		this._delegate = new m3.util.SizedMap();
		this.fire(null,m3.observable.EventType.Clear);
	}
	,size: function() {
		return this._delegate.size;
	}
	,asArray: function() {
		var a = new Array();
		var iter = this.iterator();
		while(iter.hasNext()) a.push(iter.next());
		return a;
	}
	,__class__: m3.observable.ObservableSet
});
m3.observable.MappedSet = function(source,mapper,remapOnUpdate) {
	if(remapOnUpdate == null) remapOnUpdate = false;
	m3.observable.AbstractSet.call(this);
	this._mappedSet = new haxe.ds.StringMap();
	this._mapListeners = new Array();
	this._source = source;
	this._remapOnUpdate = remapOnUpdate;
	this._mapper = mapper;
	this._source.listen($bind(this,this._sourceListener));
};
$hxClasses["m3.observable.MappedSet"] = m3.observable.MappedSet;
m3.observable.MappedSet.__name__ = ["m3","observable","MappedSet"];
m3.observable.MappedSet.__super__ = m3.observable.AbstractSet;
m3.observable.MappedSet.prototype = $extend(m3.observable.AbstractSet.prototype,{
	_sourceListener: function(t,type) {
		var mappedValue;
		if(type.isClear()) {
			this._mappedSet = new haxe.ds.StringMap();
			mappedValue = null;
		} else {
			var key = (this._source.identifier())(t);
			if(type.isAdd() || this._remapOnUpdate && type.isUpdate()) {
				mappedValue = this._mapper(t);
				this._mappedSet.set(key,mappedValue);
			} else if(type.isUpdate()) mappedValue = this._mappedSet.get(key); else {
				mappedValue = this._mappedSet.get(key);
				this._mappedSet.remove(key);
			}
		}
		this.fire(mappedValue,type);
		Lambda.iter(this._mapListeners,function(it) {
			return it(t,mappedValue,type);
		});
	}
	,identifier: function() {
		return $bind(this,this.identify);
	}
	,delegate: function() {
		return this._mappedSet;
	}
	,identify: function(u) {
		var keys = this._mappedSet.keys();
		while(keys.hasNext()) {
			var key = keys.next();
			if(this._mappedSet.get(key) == u) return key;
		}
		throw new m3.exception.Exception("unable to find identity for " + Std.string(u));
	}
	,iterator: function() {
		return this._mappedSet.iterator();
	}
	,mapListen: function(f) {
		var iter = this._mappedSet.keys();
		while(iter.hasNext()) {
			var key = iter.next();
			var t = m3.helper.OSetHelper.getElement(this._source,key);
			var u = this._mappedSet.get(key);
			f(t,u,m3.observable.EventType.Add);
		}
		this._mapListeners.push(f);
	}
	,removeListeners: function(mapListener) {
		HxOverrides.remove(this._mapListeners,mapListener);
		this._source.removeListener($bind(this,this._sourceListener));
	}
	,__class__: m3.observable.MappedSet
});
m3.observable.FilteredSet = function(source,filter) {
	var _g = this;
	m3.observable.AbstractSet.call(this);
	this._filteredSet = new haxe.ds.StringMap();
	this._source = source;
	this._filter = filter;
	this._source.listen(function(t,type) {
		if(type.isAddOrUpdate()) _g.apply(t); else if(type.isDelete()) {
			var key = (_g.identifier())(t);
			if(_g._filteredSet.exists(key)) {
				_g._filteredSet.remove(key);
				_g.fire(t,type);
			}
		} else if(type.isClear()) {
			_g._filteredSet = new haxe.ds.StringMap();
			_g.fire(t,type);
		}
	});
};
$hxClasses["m3.observable.FilteredSet"] = m3.observable.FilteredSet;
m3.observable.FilteredSet.__name__ = ["m3","observable","FilteredSet"];
m3.observable.FilteredSet.__super__ = m3.observable.AbstractSet;
m3.observable.FilteredSet.prototype = $extend(m3.observable.AbstractSet.prototype,{
	delegate: function() {
		return this._filteredSet;
	}
	,apply: function(t) {
		var key = (this._source.identifier())(t);
		var f = this._filter(t);
		var exists = this._filteredSet.exists(key);
		if(f != exists) {
			if(f) {
				this._filteredSet.set(key,t);
				this.fire(t,m3.observable.EventType.Add);
			} else {
				this._filteredSet.remove(key);
				this.fire(t,m3.observable.EventType.Delete);
			}
		} else if(exists) this.fire(t,m3.observable.EventType.Update);
	}
	,refilter: function() {
		var _g = this;
		Lambda.iter(this._source,function(it) {
			return _g.apply(it);
		});
	}
	,identifier: function() {
		return this._source.identifier();
	}
	,iterator: function() {
		return this._filteredSet.iterator();
	}
	,asArray: function() {
		var a = new Array();
		var iter = this.iterator();
		while(iter.hasNext()) a.push(iter.next());
		return a;
	}
	,__class__: m3.observable.FilteredSet
});
m3.observable.GroupedSet = function(source,groupingFn) {
	var _g = this;
	m3.observable.AbstractSet.call(this);
	this._source = source;
	this._groupingFn = groupingFn;
	this._groupedSets = new haxe.ds.StringMap();
	this._identityToGrouping = new haxe.ds.StringMap();
	source.listen(function(t,type) {
		var groupingKey = groupingFn(t);
		var previousGroupingKey = _g._identityToGrouping.get(groupingKey);
		if(type.isAddOrUpdate()) {
			if(previousGroupingKey != groupingKey) {
				_g["delete"](t,false);
				_g.add(t);
			}
		} else _g["delete"](t);
	});
};
$hxClasses["m3.observable.GroupedSet"] = m3.observable.GroupedSet;
m3.observable.GroupedSet.__name__ = ["m3","observable","GroupedSet"];
m3.observable.GroupedSet.__super__ = m3.observable.AbstractSet;
m3.observable.GroupedSet.prototype = $extend(m3.observable.AbstractSet.prototype,{
	'delete': function(t,deleteEmptySet) {
		if(deleteEmptySet == null) deleteEmptySet = true;
		var id = (this._source.identifier())(t);
		var key = this._identityToGrouping.get(id);
		if(key != null) {
			this._identityToGrouping.remove(id);
			var groupedSet = this._groupedSets.get(key);
			if(groupedSet != null) {
				groupedSet["delete"](t);
				if(groupedSet.isEmpty() && deleteEmptySet) {
					this._groupedSets.remove(key);
					this.fire(groupedSet,m3.observable.EventType.Delete);
				} else this.fire(groupedSet,m3.observable.EventType.Update);
			} else {
			}
		} else {
		}
	}
	,add: function(t) {
		var id = (this._source.identifier())(t);
		var key = this._identityToGrouping.get(id);
		if(key != null) throw new m3.exception.Exception("cannot add it is already in the list" + id + " -- " + key);
		key = this._groupingFn(t);
		this._identityToGrouping.set(id,key);
		var groupedSet = this._groupedSets.get(key);
		if(groupedSet == null) {
			groupedSet = this.addEmptyGroup(key);
			groupedSet.addOrUpdate(t);
			this.fire(groupedSet,m3.observable.EventType.Add);
		} else {
			groupedSet.addOrUpdate(t);
			this.fire(groupedSet,m3.observable.EventType.Update);
		}
	}
	,addEmptyGroup: function(key) {
		if(this._groupedSets.get(key) == null) {
			var groupedSet = new m3.observable.ObservableSet(this._source.identifier());
			groupedSet.visualId = key;
			this._groupedSets.set(key,groupedSet);
		}
		return this._groupedSets.get(key);
	}
	,identifier: function() {
		return $bind(this,this.identify);
	}
	,identify: function(set) {
		var keys = this._groupedSets.keys();
		while(keys.hasNext()) {
			var key = keys.next();
			if(this._groupedSets.get(key) == set) return key;
		}
		throw new m3.exception.Exception("unable to find identity for " + Std.string(set));
	}
	,iterator: function() {
		return this._groupedSets.iterator();
	}
	,delegate: function() {
		return this._groupedSets;
	}
	,__class__: m3.observable.GroupedSet
});
m3.observable.SortedSet = function(source,sortByFn) {
	var _g = this;
	m3.observable.AbstractSet.call(this);
	this._source = source;
	if(sortByFn == null) this._sortByFn = source.identifier(); else this._sortByFn = sortByFn;
	this._sorted = new Array();
	this._dirty = true;
	this._comparisonFn = function(l,r) {
		var l0 = _g._sortByFn(l);
		var r0 = _g._sortByFn(r);
		var cmp = m3.helper.StringHelper.compare(l0,r0);
		if(cmp != 0) return cmp;
		var li = (_g.identifier())(l);
		var ri = (_g.identifier())(r);
		return m3.helper.StringHelper.compare(li,ri);
	};
	source.listen(function(t,type) {
		if(type.isDelete()) _g["delete"](t); else if(type.isUpdate()) {
			_g["delete"](t);
			_g.add(t);
		} else if(type.isAdd()) _g.add(t); else if(type.isClear()) {
			_g._sorted = new Array();
			_g.fire(t,type);
		}
	});
};
$hxClasses["m3.observable.SortedSet"] = m3.observable.SortedSet;
m3.observable.SortedSet.__name__ = ["m3","observable","SortedSet"];
m3.observable.SortedSet.__super__ = m3.observable.AbstractSet;
m3.observable.SortedSet.prototype = $extend(m3.observable.AbstractSet.prototype,{
	sorted: function() {
		if(this._dirty) {
			this._sorted.sort(this._comparisonFn);
			this._dirty = false;
		}
		return this._sorted;
	}
	,indexOf: function(t) {
		this.sorted();
		return this.binarySearch(t,this._sortByFn(t),0,this._sorted.length - 1);
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
	,'delete': function(t) {
		HxOverrides.remove(this._sorted,t);
		this.fire(t,m3.observable.EventType.Delete);
	}
	,add: function(t) {
		this._sorted.push(t);
		this._dirty = true;
		this.fire(t,m3.observable.EventType.Add);
	}
	,identifier: function() {
		return this._source.identifier();
	}
	,iterator: function() {
		var _this = this.sorted();
		return HxOverrides.iter(_this);
	}
	,delegate: function() {
		throw new m3.exception.Exception("not implemented");
		return null;
	}
	,__class__: m3.observable.SortedSet
});
m3.serialization = {};
m3.serialization.Serializer = function(defaultToStrict) {
	if(defaultToStrict == null) defaultToStrict = true;
	this._defaultToStrict = defaultToStrict;
	this._handlersMap = new haxe.ds.StringMap();
	this.addHandlerViaName("Array<Dynamic>",new m3.serialization.DynamicArrayHandler());
};
$hxClasses["m3.serialization.Serializer"] = m3.serialization.Serializer;
m3.serialization.Serializer.__name__ = ["m3","serialization","Serializer"];
m3.serialization.Serializer.prototype = {
	addHandler: function(clazz,handler) {
		var typename = Type.getClassName(clazz);
		this._handlersMap.set(typename,handler);
	}
	,addHandlerViaName: function(typename,handler) {
		this._handlersMap.set(typename,handler);
	}
	,load: function(fromJson,instance,strict) {
		if(strict == null) strict = this._defaultToStrict;
		var reader = this.createReader(strict);
		reader.read(fromJson,Type.getClass(instance),instance);
		return reader;
	}
	,fromJsonX: function(fromJson,clazz,strict) {
		if(strict == null) strict = this._defaultToStrict;
		var reader = this.createReader(strict);
		reader.read(fromJson,clazz);
		return reader.instance;
	}
	,fromJson: function(fromJson,clazz,strict) {
		if(strict == null) strict = this._defaultToStrict;
		var reader = this.createReader(strict);
		reader.read(fromJson,clazz);
		return reader;
	}
	,toJson: function(value) {
		return this.createWriter().write(value);
	}
	,toJsonString: function(value) {
		return JSON.stringify(this.toJson(value));
	}
	,createReader: function(strict) {
		if(strict == null) strict = true;
		return new m3.serialization.JsonReader(this,strict);
	}
	,createWriter: function() {
		return new m3.serialization.JsonWriter(this);
	}
	,getHandlerViaClass: function(clazz) {
		var typename = m3.serialization.TypeTools.classname(clazz);
		return this.getHandler(haxe.rtti.CType.CClass(typename,new List()));
	}
	,getHandler: function(type) {
		var typename = m3.serialization.CTypeTools.typename(type);
		var handler = this._handlersMap.get(typename);
		if(handler == null) {
			handler = this.createHandler(type);
			this._handlersMap.set(typename,handler);
		}
		return handler;
	}
	,createHandler: function(type) {
		switch(type[1]) {
		case 1:
			var parms = type[3];
			var path = type[2];
			if(path == "Bool") return new m3.serialization.BoolHandler(); else return new m3.serialization.EnumHandler(path,parms);
			break;
		case 2:
			var parms1 = type[3];
			var path1 = type[2];
			switch(path1) {
			case "Bool":
				return new m3.serialization.BoolHandler();
			case "Float":
				return new m3.serialization.FloatHandler();
			case "String":
				return new m3.serialization.StringHandler();
			case "Int":
				return new m3.serialization.IntHandler();
			case "Array":
				return new m3.serialization.ArrayHandler(parms1,this);
			case "Date":
				return new m3.serialization.DateHandler();
			default:
				return new m3.serialization.ClassHandler(Type.resolveClass(m3.serialization.CTypeTools.classname(type)),m3.serialization.CTypeTools.typename(type),this);
			}
			break;
		case 7:
			var parms1 = type[3];
			var path1 = type[2];
			switch(path1) {
			case "Bool":
				return new m3.serialization.BoolHandler();
			case "Float":
				return new m3.serialization.FloatHandler();
			case "String":
				return new m3.serialization.StringHandler();
			case "Int":
				return new m3.serialization.IntHandler();
			case "Array":
				return new m3.serialization.ArrayHandler(parms1,this);
			case "Date":
				return new m3.serialization.DateHandler();
			default:
				return new m3.serialization.ClassHandler(Type.resolveClass(m3.serialization.CTypeTools.classname(type)),m3.serialization.CTypeTools.typename(type),this);
			}
			break;
		case 6:
			return new m3.serialization.DynamicHandler();
		case 4:
			var ret = type[3];
			var args = type[2];
			return new m3.serialization.FunctionHandler();
		default:
			throw new m3.serialization.JsonException("don't know how to handle " + Std.string(type));
		}
	}
	,__class__: m3.serialization.Serializer
};
m3.serialization.TypeHandler = function() { };
$hxClasses["m3.serialization.TypeHandler"] = m3.serialization.TypeHandler;
m3.serialization.TypeHandler.__name__ = ["m3","serialization","TypeHandler"];
m3.serialization.TypeHandler.prototype = {
	__class__: m3.serialization.TypeHandler
};
m3.serialization.ArrayHandler = function(parms,serializer) {
	this._parms = parms;
	this._serializer = serializer;
	this._elementHandler = this._serializer.getHandler(this._parms.first());
};
$hxClasses["m3.serialization.ArrayHandler"] = m3.serialization.ArrayHandler;
m3.serialization.ArrayHandler.__name__ = ["m3","serialization","ArrayHandler"];
m3.serialization.ArrayHandler.__interfaces__ = [m3.serialization.TypeHandler];
m3.serialization.ArrayHandler.prototype = {
	read: function(fromJson,reader,instance) {
		if(instance == null) instance = [];
		if(fromJson != null) {
			var arr;
			if((fromJson instanceof Array) && fromJson.__enum__ == null) arr = fromJson; else arr = [fromJson];
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
					} else if( js.Boot.__instanceof($e0,m3.serialization.JsonException) ) {
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
	,write: function(value,writer) {
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
	,__class__: m3.serialization.ArrayHandler
};
m3.serialization.EnumHandler = function(enumName,parms) {
	this._enumName = enumName;
	this._parms = parms;
	this._enum = Type.resolveEnum(this._enumName);
	if(this._enum == null) throw new m3.serialization.JsonException("no enum named " + this._enumName + " found");
	this._enumValues = Type.allEnums(this._enum);
};
$hxClasses["m3.serialization.EnumHandler"] = m3.serialization.EnumHandler;
m3.serialization.EnumHandler.__name__ = ["m3","serialization","EnumHandler"];
m3.serialization.EnumHandler.__interfaces__ = [m3.serialization.TypeHandler];
m3.serialization.EnumHandler.prototype = {
	read: function(fromJson,reader,instance) {
		if(instance != null) reader.error("enum type can not populate a passed in instance");
		var type = Type.getClass(fromJson);
		var result;
		switch(type) {
		case String:
			result = Type.createEnum(this._enum,fromJson);
			break;
		case Int:
			result = Type.createEnumIndex(this._enum,fromJson);
			break;
		default:
			reader.error(Std.string(fromJson) + " is a(n) " + Std.string(type) + " not a String");
			result = null;
		}
		return result;
	}
	,write: function(value,writer) {
		return Std.string(value);
	}
	,__class__: m3.serialization.EnumHandler
};
m3.serialization.ValueTypeHandler = function(valueType) {
	this._valueType = valueType;
};
$hxClasses["m3.serialization.ValueTypeHandler"] = m3.serialization.ValueTypeHandler;
m3.serialization.ValueTypeHandler.__name__ = ["m3","serialization","ValueTypeHandler"];
m3.serialization.ValueTypeHandler.__interfaces__ = [m3.serialization.TypeHandler];
m3.serialization.ValueTypeHandler.prototype = {
	read: function(fromJson,reader,instance) {
		if(instance != null) reader.error("value type can not populate a passed in instance");
		var type = Type["typeof"](fromJson);
		if(type == this._valueType) return fromJson; else {
			reader.error(Std.string(fromJson) + " is a(n) " + Std.string(type) + " not an " + Std.string(this._valueType));
			return null;
		}
	}
	,write: function(value,writer) {
		return value;
	}
	,__class__: m3.serialization.ValueTypeHandler
};
m3.serialization.DynamicArrayHandler = function() {
};
$hxClasses["m3.serialization.DynamicArrayHandler"] = m3.serialization.DynamicArrayHandler;
m3.serialization.DynamicArrayHandler.__name__ = ["m3","serialization","DynamicArrayHandler"];
m3.serialization.DynamicArrayHandler.__interfaces__ = [m3.serialization.TypeHandler];
m3.serialization.DynamicArrayHandler.prototype = {
	read: function(fromJson,reader,instance) {
		var classname = m3.serialization.ValueTypeTools.getClassname(Type["typeof"](fromJson));
		if(classname == "Array") return fromJson; else return reader.error("expected an array got a " + classname);
	}
	,write: function(value,writer) {
		return value;
	}
	,__class__: m3.serialization.DynamicArrayHandler
};
m3.serialization.DynamicHandler = function() {
};
$hxClasses["m3.serialization.DynamicHandler"] = m3.serialization.DynamicHandler;
m3.serialization.DynamicHandler.__name__ = ["m3","serialization","DynamicHandler"];
m3.serialization.DynamicHandler.__interfaces__ = [m3.serialization.TypeHandler];
m3.serialization.DynamicHandler.prototype = {
	read: function(fromJson,reader,instance) {
		return fromJson;
	}
	,write: function(value,writer) {
		return value;
	}
	,__class__: m3.serialization.DynamicHandler
};
m3.serialization.IntHandler = function() {
	m3.serialization.ValueTypeHandler.call(this,ValueType.TInt);
};
$hxClasses["m3.serialization.IntHandler"] = m3.serialization.IntHandler;
m3.serialization.IntHandler.__name__ = ["m3","serialization","IntHandler"];
m3.serialization.IntHandler.__super__ = m3.serialization.ValueTypeHandler;
m3.serialization.IntHandler.prototype = $extend(m3.serialization.ValueTypeHandler.prototype,{
	__class__: m3.serialization.IntHandler
});
m3.serialization.FloatHandler = function() {
	m3.serialization.ValueTypeHandler.call(this,ValueType.TFloat);
};
$hxClasses["m3.serialization.FloatHandler"] = m3.serialization.FloatHandler;
m3.serialization.FloatHandler.__name__ = ["m3","serialization","FloatHandler"];
m3.serialization.FloatHandler.__super__ = m3.serialization.ValueTypeHandler;
m3.serialization.FloatHandler.prototype = $extend(m3.serialization.ValueTypeHandler.prototype,{
	read: function(fromJson,reader,instance) {
		if(instance != null) reader.error("value type can not populate a passed in instance");
		var type = Type["typeof"](fromJson);
		if(type == ValueType.TFloat || type == ValueType.TInt) return fromJson; else {
			reader.error(Std.string(fromJson) + " is a(n) " + Std.string(type) + " not an " + Std.string(this._valueType));
			return null;
		}
	}
	,__class__: m3.serialization.FloatHandler
});
m3.serialization.BoolHandler = function() {
	m3.serialization.ValueTypeHandler.call(this,ValueType.TBool);
};
$hxClasses["m3.serialization.BoolHandler"] = m3.serialization.BoolHandler;
m3.serialization.BoolHandler.__name__ = ["m3","serialization","BoolHandler"];
m3.serialization.BoolHandler.__super__ = m3.serialization.ValueTypeHandler;
m3.serialization.BoolHandler.prototype = $extend(m3.serialization.ValueTypeHandler.prototype,{
	__class__: m3.serialization.BoolHandler
});
m3.serialization.StringHandler = function() {
};
$hxClasses["m3.serialization.StringHandler"] = m3.serialization.StringHandler;
m3.serialization.StringHandler.__name__ = ["m3","serialization","StringHandler"];
m3.serialization.StringHandler.__interfaces__ = [m3.serialization.TypeHandler];
m3.serialization.StringHandler.prototype = {
	read: function(fromJson,reader,instance) {
		if(instance != null) reader.error("StringHandler can not populate a passed in String, aka String's are immutable");
		var type = Type.getClass(fromJson);
		if(type == String || fromJson == null) return fromJson; else {
			reader.error(Std.string(fromJson) + " is a(n) " + Std.string(type) + " not a String");
			return null;
		}
	}
	,write: function(value,writer) {
		return value;
	}
	,__class__: m3.serialization.StringHandler
};
m3.serialization.DateHandler = function() {
};
$hxClasses["m3.serialization.DateHandler"] = m3.serialization.DateHandler;
m3.serialization.DateHandler.__name__ = ["m3","serialization","DateHandler"];
m3.serialization.DateHandler.__interfaces__ = [m3.serialization.TypeHandler];
m3.serialization.DateHandler.prototype = {
	read: function(fromJson,reader,instance) {
		fromJson = fromJson.split(".")[0];
		var s = fromJson;
		return HxOverrides.strDate(s);
	}
	,write: function(value,writer) {
		var _this;
		_this = js.Boot.__cast(value , Date);
		return HxOverrides.dateStr(_this);
	}
	,__class__: m3.serialization.DateHandler
};
m3.serialization.FunctionHandler = function() {
};
$hxClasses["m3.serialization.FunctionHandler"] = m3.serialization.FunctionHandler;
m3.serialization.FunctionHandler.__name__ = ["m3","serialization","FunctionHandler"];
m3.serialization.FunctionHandler.__interfaces__ = [m3.serialization.TypeHandler];
m3.serialization.FunctionHandler.prototype = {
	read: function(fromJson,reader,instance) {
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
	,write: function(value,writer) {
		return value;
	}
	,__class__: m3.serialization.FunctionHandler
};
m3.serialization.Field = function() {
	this.required = true;
};
$hxClasses["m3.serialization.Field"] = m3.serialization.Field;
m3.serialization.Field.__name__ = ["m3","serialization","Field"];
m3.serialization.Field.prototype = {
	__class__: m3.serialization.Field
};
m3.serialization.ClassHandler = function(clazz,typename,serializer) {
	this._clazz = clazz;
	this._typename = typename;
	this._serializer = serializer;
	if(this._clazz == null) throw new m3.serialization.JsonException("clazz is null");
	var rtti = this._clazz.__rtti;
	if(rtti == null) {
		var msg = "no rtti found for " + this._typename;
		console.log(msg);
		throw new m3.serialization.JsonException(msg);
	}
	var x = Xml.parse(rtti).firstElement();
	var typeTree = new haxe.rtti.XmlParser().processElement(x);
	switch(typeTree[1]) {
	case 1:
		var c = typeTree[2];
		this._classDef = c;
		break;
	default:
		throw new m3.serialization.JsonException("expected a class got " + Std.string(typeTree));
	}
	this._fields = new Array();
	var superClass = Type.getSuperClass(clazz);
	if(superClass != null) {
		var superClassHandler = new m3.serialization.ClassHandler(superClass,Type.getClassName(superClass),serializer);
		var _g = 0;
		var _g1 = superClassHandler._fields;
		while(_g < _g1.length) {
			var f = _g1[_g];
			++_g;
			this._fields.push(f);
		}
	}
	var $it0 = this._classDef.fields.iterator();
	while( $it0.hasNext() ) {
		var f1 = $it0.next();
		var field = new m3.serialization.Field();
		var $transient = false;
		var fieldXml = x.elementsNamed(f1.name).next();
		var set = fieldXml.get("set");
		var $it1 = fieldXml.elementsNamed("meta");
		while( $it1.hasNext() ) {
			var meta = $it1.next();
			var $it2 = meta.elementsNamed("m");
			while( $it2.hasNext() ) {
				var m = $it2.next();
				var _g2 = m.get("n");
				switch(_g2) {
				case ":optional":case "optional":
					field.required = false;
					break;
				case ":transient":case "transient":
					$transient = true;
					break;
				}
			}
		}
		if(!$transient && set != "method") {
			var _g3 = f1.type;
			switch(_g3[1]) {
			case 2:case 1:case 6:case 4:case 7:
				field.name = f1.name;
				field.type = f1.type;
				field.typename = m3.serialization.CTypeTools.typename(f1.type);
				field.handler = this._serializer.getHandler(field.type);
				this._fields.push(field);
				break;
			case 3:
				field.name = f1.name;
				field.type = haxe.rtti.CType.CDynamic();
				field.typename = m3.serialization.CTypeTools.typename(field.type);
				field.handler = this._serializer.getHandler(field.type);
				this._fields.push(field);
				break;
			default:
			}
		}
	}
	this._fieldsByName = new haxe.ds.StringMap();
	var _g4 = 0;
	var _g11 = this._fields;
	while(_g4 < _g11.length) {
		var f2 = _g11[_g4];
		++_g4;
		this._fieldsByName.set(f2.name,f2);
	}
};
$hxClasses["m3.serialization.ClassHandler"] = m3.serialization.ClassHandler;
m3.serialization.ClassHandler.__name__ = ["m3","serialization","ClassHandler"];
m3.serialization.ClassHandler.__interfaces__ = [m3.serialization.TypeHandler];
m3.serialization.ClassHandler.prototype = {
	createInstance: function() {
		return Type.createInstance(this._clazz,[]);
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
		var _g1 = 0;
		var _g11 = this._fields;
		while(_g1 < _g11.length) {
			var f = _g11[_g1];
			++_g1;
			if(f.required) {
				var found = false;
				if(m3.helper.ArrayHelper.contains(jsonFieldNames,f.name)) found = true;
				if(!found) reader.error("instance of " + this._typename + " has required field named " + f.name + " json does not does not " + JSON.stringify(fromJson));
			}
		}
		var _g2 = 0;
		while(_g2 < jsonFieldNames.length) {
			var fieldName = jsonFieldNames[_g2];
			++_g2;
			var f1 = this._fieldsByName.get(fieldName);
			try {
				if(Lambda.empty(reader.stack)) reader.stack.push(fieldName); else reader.stack.push("." + fieldName);
				var rawValue = Reflect.field(fromJson,f1.name);
				if(f1.required || rawValue != null) {
					var value = f1.handler.read(rawValue,reader);
					instance[f1.name] = value;
				}
			} catch( $e0 ) {
				if( js.Boot.__instanceof($e0,String) ) {
					var msg = $e0;
					reader.error("error reading field " + fieldName + "\n" + msg);
				} else if( js.Boot.__instanceof($e0,m3.exception.Exception) ) {
					var e = $e0;
					reader.error("error reading field " + fieldName,e);
				} else {
				var e1 = $e0;
				reader.error("error reading field " + fieldName,e1);
				}
			}
			reader.stack.pop();
		}
		if(instance.readResolve != null && Reflect.isFunction(instance.readResolve)) instance.readResolve();
		return instance;
	}
	,write: function(instanceValue,writer) {
		var instance = { };
		if(instanceValue.writeResolve != null && Reflect.isFunction(instanceValue.writeResolve)) instanceValue.writeResolve();
		var _g = 0;
		var _g1 = this._fields;
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
					throw new m3.serialization.JsonException("error writing field " + f.name + "\n" + msg);
				} else if( js.Boot.__instanceof($e0,m3.exception.Exception) ) {
					var e = $e0;
					throw new m3.serialization.JsonException("error writing field " + f.name,e);
				} else {
				var e1 = $e0;
				throw new m3.serialization.JsonException("error writing field " + f.name,e1);
				}
			}
		}
		return instance;
	}
	,__class__: m3.serialization.ClassHandler
};
m3.serialization.JsonException = function(msg,cause) {
	m3.exception.Exception.call(this,msg,cause);
};
$hxClasses["m3.serialization.JsonException"] = m3.serialization.JsonException;
m3.serialization.JsonException.__name__ = ["m3","serialization","JsonException"];
m3.serialization.JsonException.__super__ = m3.exception.Exception;
m3.serialization.JsonException.prototype = $extend(m3.exception.Exception.prototype,{
	__class__: m3.serialization.JsonException
});
m3.serialization.JsonReader = function(serializer,strict) {
	this._serializer = serializer;
	this.stack = new Array();
	this.warnings = new Array();
	this.strict = strict;
};
$hxClasses["m3.serialization.JsonReader"] = m3.serialization.JsonReader;
m3.serialization.JsonReader.__name__ = ["m3","serialization","JsonReader"];
m3.serialization.JsonReader.prototype = {
	read: function(fromJson,clazz,instance) {
		var handler = this._serializer.getHandlerViaClass(clazz);
		this.instance = handler.read(fromJson,this,instance);
	}
	,error: function(msg,cause) {
		if(this.strict) throw new m3.serialization.JsonException(msg,cause); else return null;
	}
	,__class__: m3.serialization.JsonReader
};
m3.serialization.JsonWriter = function(serializer) {
	this._serializer = serializer;
};
$hxClasses["m3.serialization.JsonWriter"] = m3.serialization.JsonWriter;
m3.serialization.JsonWriter.__name__ = ["m3","serialization","JsonWriter"];
m3.serialization.JsonWriter.prototype = {
	write: function(value) {
		var clazz = m3.serialization.TypeTools.clazz(value);
		var handler = this._serializer.getHandlerViaClass(clazz);
		return handler.write(value,this);
	}
	,__class__: m3.serialization.JsonWriter
};
m3.serialization.TypeTools = function() { };
$hxClasses["m3.serialization.TypeTools"] = m3.serialization.TypeTools;
m3.serialization.TypeTools.__name__ = ["m3","serialization","TypeTools"];
m3.serialization.TypeTools.classname = function(clazz) {
	try {
		return Type.getClassName(clazz);
	} catch( err ) {
		throw new m3.exception.Exception(Std.string(err));
	}
};
m3.serialization.TypeTools.clazz = function(d) {
	var c = Type.getClass(d);
	if(c == null) console.log("tried to get class for type -- " + Std.string(Type["typeof"](d)) + " -- " + Std.string(d));
	return c;
};
m3.serialization.CTypeTools = function() { };
$hxClasses["m3.serialization.CTypeTools"] = m3.serialization.CTypeTools;
m3.serialization.CTypeTools.__name__ = ["m3","serialization","CTypeTools"];
m3.serialization.CTypeTools.classname = function(type) {
	switch(type[1]) {
	case 2:
		var parms = type[3];
		var path = type[2];
		return path;
	case 1:
		var parms = type[3];
		var path = type[2];
		return path;
	case 6:
		return "Dynamic";
	default:
		throw new m3.exception.Exception("don't know how to handle " + Std.string(type));
	}
};
m3.serialization.CTypeTools.typename = function(type) {
	switch(type[1]) {
	case 2:
		var parms = type[3];
		var path = type[2];
		return m3.serialization.CTypeTools.makeTypename(path,parms);
	case 1:
		var parms = type[3];
		var path = type[2];
		return m3.serialization.CTypeTools.makeTypename(path,parms);
	case 7:
		var parms = type[3];
		var path = type[2];
		return m3.serialization.CTypeTools.makeTypename(path,parms);
	case 6:
		return "Dynamic";
	case 4:
		return "Function";
	default:
		throw new m3.exception.Exception("don't know how to handle " + Std.string(type));
	}
};
m3.serialization.CTypeTools.makeTypename = function(path,parms) {
	if(parms.isEmpty()) return path; else return path + "<" + Lambda.array(parms.map(function(ct) {
		return m3.serialization.CTypeTools.typename(ct);
	})).join(",") + ">";
};
m3.serialization.ValueTypeTools = function() { };
$hxClasses["m3.serialization.ValueTypeTools"] = m3.serialization.ValueTypeTools;
m3.serialization.ValueTypeTools.__name__ = ["m3","serialization","ValueTypeTools"];
m3.serialization.ValueTypeTools.getClassname = function(type) {
	switch(type[1]) {
	case 8:
		return "TUnknown";
	case 4:
		return "TObject";
	case 0:
		return "TNull";
	case 1:
		return "Int";
	case 5:
		return "TFunction";
	case 2:
		return "Float";
	case 3:
		return "Bool";
	case 7:
		var e = type[2];
		return Type.getEnumName(e);
	case 6:
		var c = type[2];
		return Type.getClassName(c);
	}
};
m3.serialization.ValueTypeTools.getName = function(type) {
	switch(type[1]) {
	case 8:
		return "TUnknown";
	case 4:
		return "TObject";
	case 0:
		return "TNull";
	case 1:
		return "Int";
	case 5:
		return "TFunction";
	case 2:
		return "Float";
	case 3:
		return "Bool";
	case 7:
		var e = type[2];
		return "TEnum";
	case 6:
		var c = type[2];
		return "TClass";
	}
};
m3.util.FixedSizeArray = function(maxSize) {
	this._maxSize = maxSize;
	this._delegate = new Array();
};
$hxClasses["m3.util.FixedSizeArray"] = m3.util.FixedSizeArray;
m3.util.FixedSizeArray.__name__ = ["m3","util","FixedSizeArray"];
m3.util.FixedSizeArray.prototype = {
	push: function(t) {
		if(this._delegate.length >= this._maxSize) this._delegate.shift();
		this._delegate.push(t);
	}
	,contains: function(t) {
		return m3.helper.ArrayHelper.contains(this._delegate,t);
	}
	,__class__: m3.util.FixedSizeArray
};
m3.util.ColorProvider = function() { };
$hxClasses["m3.util.ColorProvider"] = m3.util.ColorProvider;
m3.util.ColorProvider.__name__ = ["m3","util","ColorProvider"];
m3.util.ColorProvider.getNextColor = function() {
	if(m3.util.ColorProvider._INDEX >= m3.util.ColorProvider._COLORS.length) m3.util.ColorProvider._INDEX = 0;
	return m3.util.ColorProvider._COLORS[m3.util.ColorProvider._INDEX++];
};
m3.util.ColorProvider.getRandomColor = function() {
	var index;
	do index = Std.random(m3.util.ColorProvider._COLORS.length); while(m3.util.ColorProvider._LAST_COLORS_USED.contains(index));
	m3.util.ColorProvider._LAST_COLORS_USED.push(index);
	return m3.util.ColorProvider._COLORS[index];
};
m3.util.HotKeyManager = function() {
	m3.util.HotKeyManager.HOT_KEY_ACTIONS = new Array();
	m3.util.HotKeyManager.HOT_KEYS = new Array();
	new $("body").keyup(function(evt) {
		if(m3.helper.ArrayHelper.hasValues(m3.util.HotKeyManager.HOT_KEY_ACTIONS)) {
			var _g = 0;
			var _g1 = m3.util.HotKeyManager.HOT_KEY_ACTIONS;
			while(_g < _g1.length) {
				var action = _g1[_g];
				++_g;
				action(evt);
			}
		}
		if(m3.helper.ArrayHelper.hasValues(m3.util.HotKeyManager.HOT_KEYS)) {
			var _g2 = 0;
			var _g11 = m3.util.HotKeyManager.HOT_KEYS;
			while(_g2 < _g11.length) {
				var tuple_ = _g11[_g2];
				++_g2;
				if(evt.keyCode == tuple_.left.keyCode && evt.altKey == tuple_.left.altKey && evt.ctrlKey == tuple_.left.ctrlKey && evt.shiftKey == tuple_.left.shiftKey) tuple_.right();
			}
		}
	});
};
$hxClasses["m3.util.HotKeyManager"] = m3.util.HotKeyManager;
m3.util.HotKeyManager.__name__ = ["m3","util","HotKeyManager"];
m3.util.HotKeyManager.get_get = function() {
	if(m3.util.HotKeyManager._instance == null) m3.util.HotKeyManager._instance = new m3.util.HotKeyManager();
	return m3.util.HotKeyManager._instance;
};
m3.util.HotKeyManager.prototype = {
	addHotKeyFcn: function(fcn) {
		m3.util.HotKeyManager.HOT_KEY_ACTIONS.push(fcn);
	}
	,addHotKey: function(hotKey,fcn) {
		hotKey = $.extend({ keyCode : null, altKey : false, ctrlKey : false, shiftKey : false},hotKey);
		m3.util.HotKeyManager.HOT_KEYS.push(new m3.util.Tuple(hotKey,fcn));
	}
	,__class__: m3.util.HotKeyManager
};
m3.util.JqueryUtil = $hx_exports.m3.util.JqueryUtil = function() { };
$hxClasses["m3.util.JqueryUtil"] = m3.util.JqueryUtil;
m3.util.JqueryUtil.__name__ = ["m3","util","JqueryUtil"];
m3.util.JqueryUtil.isAttached = function(elem) {
	return elem.parents("body").length > 0;
};
m3.util.JqueryUtil.labelSelect = function(elem,str) {
	try {
		m3.CrossMojo.jq("option",elem).filter(function() {
			return $(this).text() == str;
		})[0].selected = true;
	} catch( err ) {
	}
};
m3.util.JqueryUtil.getOrCreateDialog = function(selector,dlgOptions,createdFcn) {
	if(m3.helper.StringHelper.isBlank(selector)) selector = "dlg" + m3.util.UidGenerator.create(10);
	var dialog = new $(selector);
	if(dlgOptions == null) dlgOptions = { autoOpen : false, height : 380, width : 320, modal : true};
	if(!dialog.exists()) {
		dialog = new $("<div id=" + HxOverrides.substr(selector,1,null) + " style='display:none;'></div>");
		if(Reflect.isFunction(createdFcn)) createdFcn(dialog);
		new $("body").append(dialog);
		dialog.m3dialog(dlgOptions);
	} else if(!dialog["is"](":data(dialog)")) dialog.m3dialog(dlgOptions);
	return dialog;
};
m3.util.JqueryUtil.deleteEffects = function(dragstopEvt,width,duration,src) {
	if(src == null) src = "media/cloud.gif";
	if(duration == null) duration = 800;
	if(width == null) width = "70px";
	var img = new $("<img/>");
	img.appendTo("body");
	img.css("width",width);
	img.position({ my : "center", at : "center", of : dragstopEvt, collision : "fit"});
	img.attr("src",src);
	haxe.Timer.delay(function() {
		img.remove();
	},duration);
};
m3.util.JqueryUtil.confirm = function(title,question,action) {
	var dlg = new $("<div id=\"confirm-dialog\"></div>");
	var content = new $("<div style=\"width: 500px;text-align:left;\">" + question + "</div>");
	dlg.append(content);
	dlg.appendTo("body");
	var dlgOptions = { modal : true, title : title, zIndex : 10000, autoOpen : true, width : "auto", resizable : false, buttons : { Yes : function() {
		action();
		$(this).dialog("close");
	}, No : function() {
		$(this).dialog("close");
	}}, close : function(event,ui) {
		$(this).remove();
	}};
	dlg.dialog(dlgOptions);
};
m3.util.JqueryUtil.alert = function(statement,title,action) {
	if(title == null) title = "Alert";
	var dlg = new $("<div id=\"alert-dialog\"></div>");
	var content = new $("<div style=\"width: 500px;text-align:left;\">" + statement + "</div>");
	dlg.append(content);
	dlg.appendTo("body");
	var dlgOptions = { modal : true, title : title, zIndex : 10000, autoOpen : true, width : "auto", resizable : false, buttons : { OK : function() {
		$(this).dialog("close");
	}}, close : function(event,ui) {
		if(action != null) action();
		$(this).remove();
	}};
	dlg.dialog(dlgOptions);
};
m3.util.JqueryUtil.getWindowWidth = function() {
	return new $(window).width();
};
m3.util.JqueryUtil.getWindowHeight = function() {
	return new $(window).height();
};
m3.util.JqueryUtil.getDocumentWidth = function() {
	return new $(window.document).width();
};
m3.util.JqueryUtil.getDocumentHeight = function() {
	return new $(window.document).height();
};
m3.util.JqueryUtil.getEmptyDiv = function() {
	return new $("<div></div>");
};
m3.util.JqueryUtil.getEmptyTable = function() {
	return new $("<table style='margin:auto; text-align: center; width: 100%;'></table>");
};
m3.util.JqueryUtil.getEmptyRow = function() {
	return new $("<tr></tr>");
};
m3.util.JqueryUtil.getEmptyCell = function() {
	return new $("<td></td>");
};
m3.util.M = function() { };
$hxClasses["m3.util.M"] = m3.util.M;
m3.util.M.__name__ = ["m3","util","M"];
m3.util.M.makeSafeGetExpression = function(e,default0,pos) {
	if(default0 == null) default0 = m3.util.M.expr(haxe.macro.ExprDef.EConst(haxe.macro.Constant.CIdent("null")),pos);
	var dynamicType = haxe.macro.ComplexType.TPath({ sub : null, name : "Dynamic", pack : [], params : []});
	var catches = [{ type : dynamicType, name : "__e", expr : default0}];
	var result = haxe.macro.ExprDef.ETry(e,catches);
	return { expr : result, pos : pos};
};
m3.util.M.exprBlock = function(exprDefs,pos) {
	return { expr : haxe.macro.ExprDef.EBlock(m3.util.M.exprs(exprDefs,pos)), pos : pos};
};
m3.util.M.expr = function(exprDef,pos) {
	return { expr : exprDef, pos : pos};
};
m3.util.M.exprs = function(exprDefs,pos) {
	var arr = [];
	Lambda.iter(exprDefs,function(ed) {
		arr.push({ expr : ed, pos : pos});
	});
	return arr;
};
m3.util.SizedMap = function() {
	haxe.ds.StringMap.call(this);
	this.size = 0;
};
$hxClasses["m3.util.SizedMap"] = m3.util.SizedMap;
m3.util.SizedMap.__name__ = ["m3","util","SizedMap"];
m3.util.SizedMap.__super__ = haxe.ds.StringMap;
m3.util.SizedMap.prototype = $extend(haxe.ds.StringMap.prototype,{
	set: function(key,val) {
		if(!this.exists(key)) this.size++;
		haxe.ds.StringMap.prototype.set.call(this,key,val);
	}
	,remove: function(key) {
		if(this.exists(key)) this.size--;
		return haxe.ds.StringMap.prototype.remove.call(this,key);
	}
	,__class__: m3.util.SizedMap
});
m3.util.Tuple = function(l,r) {
	this.left = l;
	this.right = r;
};
$hxClasses["m3.util.Tuple"] = m3.util.Tuple;
m3.util.Tuple.__name__ = ["m3","util","Tuple"];
m3.util.Tuple.prototype = {
	__class__: m3.util.Tuple
};
m3.widget = {};
m3.widget.Widgets = function() { };
$hxClasses["m3.widget.Widgets"] = m3.widget.Widgets;
m3.widget.Widgets.__name__ = ["m3","widget","Widgets"];
m3.widget.Widgets.getSelf = function() {
	return this;
};
m3.widget.Widgets.getSelfElement = function() {
	return this.element;
};
m3.widget.Widgets.getWidgetClasses = function() {
	return " ui-widget";
};
var pagent = {};
pagent.AppContext = function() { };
$hxClasses["pagent.AppContext"] = pagent.AppContext;
pagent.AppContext.__name__ = ["pagent","AppContext"];
pagent.AppContext.init = function() {
	pagent.AppContext.LOGGER = new m3.log.Logga(m3.log.LogLevel.DEBUG);
	pagent.AppContext.MASTER_NOTIFICATIONS = new m3.observable.ObservableSet(qoid.model.ModelObjWithIid.identifier);
	pagent.AppContext.NOTIFICATIONS = new m3.observable.FilteredSet(pagent.AppContext.MASTER_NOTIFICATIONS,function(a) {
		return !a.consumed;
	});
	pagent.AppContext.ALIASES = new m3.observable.ObservableSet(qoid.model.ModelObjWithIid.identifier);
	pagent.AppContext.ALIASES.listen(function(a1,evt) {
		if(evt.isAddOrUpdate()) {
			var p = m3.helper.OSetHelper.getElementComplex(pagent.AppContext.PROFILES,a1.iid,"aliasIid");
			if(p != null) a1.profile = p;
			if(evt.isAdd()) pagent.model.EM.change(pagent.model.EMEvent.AliasCreated,a1); else pagent.model.EM.change(pagent.model.EMEvent.AliasUpdated,a1);
		}
	});
	pagent.AppContext.LABELS = new m3.observable.ObservableSet(qoid.model.Label.identifier);
	pagent.AppContext.LABELACLS = new m3.observable.ObservableSet(qoid.model.LabelAcl.identifier);
	pagent.AppContext.GROUPED_LABELACLS = new m3.observable.GroupedSet(pagent.AppContext.LABELACLS,function(l) {
		return l.connectionIid;
	});
	pagent.AppContext.LABELCHILDREN = new m3.observable.ObservableSet(qoid.model.LabelChild.identifier);
	pagent.AppContext.GROUPED_LABELCHILDREN = new m3.observable.GroupedSet(pagent.AppContext.LABELCHILDREN,function(lc) {
		return lc.parentIid;
	});
	pagent.AppContext.LABELEDCONTENT = new m3.observable.ObservableSet(qoid.model.LabeledContent.identifier);
	pagent.AppContext.GROUPED_LABELEDCONTENT = new m3.observable.GroupedSet(pagent.AppContext.LABELEDCONTENT,function(lc1) {
		return lc1.contentIid;
	});
	pagent.AppContext.PROFILES = new m3.observable.ObservableSet(qoid.model.Profile.identifier);
	pagent.AppContext.PROFILES.listen(function(p1,evt1) {
		if(evt1.isAddOrUpdate()) {
			var alias = m3.helper.OSetHelper.getElement(pagent.AppContext.ALIASES,p1.aliasIid);
			if(alias != null) {
				alias.profile = p1;
				pagent.AppContext.ALIASES.addOrUpdate(alias);
			}
		}
	});
	pagent.AppContext.SERIALIZER = new m3.serialization.Serializer();
	pagent.AppContext.SERIALIZER.addHandler(qoid.model.Content,new pagent.PinterContentHandler());
	pagent.AppContext.SERIALIZER.addHandler(qoid.model.Notification,new qoid.model.NotificationHandler());
	pagent.AppContext.registerGlobalListeners();
};
pagent.AppContext.isAliasRootLabel = function(iid) {
	var $it0 = pagent.AppContext.ALIASES.iterator();
	while( $it0.hasNext() ) {
		var alias = $it0.next();
		if(alias.rootLabelIid == iid) return true;
	}
	return false;
};
pagent.AppContext.getUberLabelIid = function() {
	return m3.helper.OSetHelper.getElement(pagent.AppContext.ALIASES,pagent.AppContext.UBER_ALIAS_ID).rootLabelIid;
};
pagent.AppContext.onInitialDataLoadComplete = function(nada) {
	pagent.AppContext.ROOT_LABEL_ID = m3.helper.OSetHelper.getElement(pagent.AppContext.ALIASES,pagent.AppContext.UBER_ALIAS_ID).rootLabelIid;
	pagent.AppContext.currentAlias = m3.helper.OSetHelper.getElement(pagent.AppContext.ALIASES,pagent.AppContext.UBER_ALIAS_ID);
	var $it0 = pagent.AppContext.ALIASES.iterator();
	while( $it0.hasNext() ) {
		var alias = $it0.next();
		if(alias.data.isDefault == true) {
			pagent.AppContext.currentAlias = alias;
			break;
		}
	}
	var rootLabelOfThisApp = m3.helper.OSetHelper.getElementComplex(pagent.AppContext.LABELS,pagent.PinterContext.APP_ROOT_LABEL_NAME,function(l) {
		return l.name;
	});
	var rootLabelOfAllApps = m3.helper.OSetHelper.getElementComplex(pagent.AppContext.LABELS,pagent.PinterContext.ROOT_LABEL_NAME_OF_ALL_APPS,function(l1) {
		return l1.name;
	});
	if(rootLabelOfThisApp == null) {
		var createRootLabelOfThisApp = function(theRootLabelOfAllApps) {
			var listener = null;
			listener = function(l2,evtType) {
				if(evtType.isAdd()) {
					if(l2.name == pagent.PinterContext.APP_ROOT_LABEL_NAME) {
						pagent.AppContext.LABELS.removeListener(listener);
						pagent.PinterContext.set_ROOT_ALBUM(l2);
						pagent.model.EM.change(pagent.model.EMEvent.AliasLoaded,pagent.AppContext.currentAlias);
						pagent.model.EM.change(pagent.model.EMEvent.APP_INITIALIZED);
					}
				}
			};
			pagent.AppContext.LABELS.listen(listener,false);
			var label = new qoid.model.Label();
			label.name = pagent.PinterContext.APP_ROOT_LABEL_NAME;
			var eventData = new qoid.model.EditLabelData(label,pagent.PinterContext.get_ROOT_LABEL_OF_ALL_APPS().iid);
			pagent.model.EM.change(pagent.model.EMEvent.CreateLabel,eventData);
		};
		if(rootLabelOfAllApps == null) {
			var listener1 = null;
			listener1 = function(l3,evtType1) {
				if(evtType1.isAdd()) {
					if(l3.name == pagent.PinterContext.ROOT_LABEL_NAME_OF_ALL_APPS) {
						pagent.AppContext.LABELS.removeListener(listener1);
						pagent.PinterContext.set_ROOT_LABEL_OF_ALL_APPS(l3);
						createRootLabelOfThisApp(l3);
					}
				}
			};
			pagent.AppContext.LABELS.listen(listener1,false);
			var label1 = new qoid.model.Label();
			label1.name = pagent.PinterContext.ROOT_LABEL_NAME_OF_ALL_APPS;
			var eventData1 = new qoid.model.EditLabelData(label1,pagent.AppContext.currentAlias.rootLabelIid);
			pagent.model.EM.change(pagent.model.EMEvent.CreateLabel,eventData1);
		} else {
			pagent.PinterContext.set_ROOT_LABEL_OF_ALL_APPS(rootLabelOfAllApps);
			createRootLabelOfThisApp(rootLabelOfAllApps);
		}
	} else {
		pagent.PinterContext.set_ROOT_LABEL_OF_ALL_APPS(rootLabelOfAllApps);
		pagent.PinterContext.set_ROOT_ALBUM(rootLabelOfThisApp);
		pagent.model.EM.change(pagent.model.EMEvent.AliasLoaded,pagent.AppContext.currentAlias);
		pagent.model.EM.change(pagent.model.EMEvent.APP_INITIALIZED);
	}
};
pagent.AppContext.registerGlobalListeners = function() {
	new $(window).on("unload",function(evt) {
		pagent.model.EM.change(pagent.model.EMEvent.UserLogout);
	});
	pagent.model.EM.addListener(pagent.model.EMEvent.InitialDataLoadComplete,pagent.AppContext.onInitialDataLoadComplete,"AppContext-InitialDataLoadComplete");
	pagent.model.EM.addListener(pagent.model.EMEvent.AliasLoaded,function(a) {
		window.document.title = a.profile.name + " | PinterAgent";
	});
};
pagent.AppContext.getLabelDescendents = function(parentIid) {
	var labelDescendents = new m3.observable.ObservableSet(qoid.model.Label.identifier);
	var getDescendentIids;
	getDescendentIids = function(iid,iidList) {
		iidList.splice(0,0,iid);
		var children = new m3.observable.FilteredSet(pagent.AppContext.LABELCHILDREN,function(lc) {
			return lc.parentIid == iid;
		}).asArray();
		var _g1 = 0;
		var _g = children.length;
		while(_g1 < _g) {
			var i = _g1++;
			getDescendentIids(children[i].childIid,iidList);
		}
	};
	var iid_list = new Array();
	getDescendentIids(parentIid,iid_list);
	HxOverrides.remove(iid_list,parentIid);
	var _g2 = 0;
	while(_g2 < iid_list.length) {
		var iid_ = iid_list[_g2];
		++_g2;
		var label = m3.helper.OSetHelper.getElement(pagent.AppContext.LABELS,iid_);
		if(label == null) pagent.AppContext.LOGGER.error("LabelChild references missing label: " + iid_); else labelDescendents.add(label);
	}
	return labelDescendents;
};
pagent.PinterAgent = $hx_exports.pagent.PinterAgent = function() { };
$hxClasses["pagent.PinterAgent"] = pagent.PinterAgent;
pagent.PinterAgent.__name__ = ["pagent","PinterAgent"];
pagent.PinterAgent.main = function() {
	pagent.PinterContext.init();
	pagent.PinterAgent.PROTOCOL = new pagent.api.ProtocolHandler();
	pagent.PinterAgent.HOT_KEY_ACTIONS = m3.util.HotKeyManager.get_get();
};
pagent.PinterAgent.start = function() {
	pagent.PinterContext.PAGE_MGR.setBackButton(new $("#navBackButton").button({ icons : { primary : "ui-icon-arrowthick-1-w"}}));
	pagent.PinterContext.PAGE_MGR.initClientPages();
	var document = new $(window.document);
	document.bind("pagebeforeshow",($_=pagent.PinterContext.PAGE_MGR,$bind($_,$_.beforePageShow)));
	document.bind("pagebeforecreate",($_=pagent.PinterContext.PAGE_MGR,$bind($_,$_.pageBeforeCreate)));
	document.bind("pageshow",($_=pagent.PinterContext.PAGE_MGR,$bind($_,$_.pageShow)));
	document.bind("pagehide",($_=pagent.PinterContext.PAGE_MGR,$bind($_,$_.pageHide)));
	pagent.PinterContext.PAGE_MGR.set_CURRENT_PAGE(pagent.pages.PinterPageMgr.HOME_SCREEN);
	new $("body").click(function(evt) {
		new $(".nonmodalPopup").hide();
	});
	pagent.widget.DialogManager.showLogin();
};
pagent.PinterContentHandler = function() {
};
$hxClasses["pagent.PinterContentHandler"] = pagent.PinterContentHandler;
pagent.PinterContentHandler.__name__ = ["pagent","PinterContentHandler"];
pagent.PinterContentHandler.__interfaces__ = [m3.serialization.TypeHandler];
pagent.PinterContentHandler.prototype = {
	read: function(fromJson,reader,instance) {
		var obj = null;
		try {
			var _g = fromJson.contentType;
			switch(_g) {
			case qoid.model.ContentType.AUDIO:
				obj = pagent.AppContext.SERIALIZER.fromJsonX(fromJson,qoid.model.AudioContent);
				break;
			case qoid.model.ContentType.IMAGE:
				obj = pagent.AppContext.SERIALIZER.fromJsonX(fromJson,qoid.model.ImageContent);
				break;
			case qoid.model.ContentType.URL:
				obj = pagent.AppContext.SERIALIZER.fromJsonX(fromJson,qoid.model.UrlContent);
				break;
			case qoid.model.ContentType.VERIFICATION:
				obj = pagent.AppContext.SERIALIZER.fromJsonX(fromJson,qoid.model.VerificationContent);
				break;
			case qoid.model.ContentType.TEXT:
				obj = pagent.AppContext.SERIALIZER.fromJsonX(fromJson,qoid.model.MessageContent);
				break;
			case qoid.model.ContentType.CONFIG:
				obj = pagent.AppContext.SERIALIZER.fromJsonX(fromJson,qoid.model.ConfigContent);
				break;
			}
		} catch( err ) {
			fromJson.contentType = qoid.model.ContentType.TEXT;
			obj = pagent.AppContext.SERIALIZER.fromJsonX(fromJson,qoid.model.MessageContent);
		}
		return obj;
	}
	,write: function(value,writer) {
		return pagent.AppContext.SERIALIZER.toJson(value);
	}
	,__class__: pagent.PinterContentHandler
};
pagent.PinterContext = function() { };
$hxClasses["pagent.PinterContext"] = pagent.PinterContext;
pagent.PinterContext.__name__ = ["pagent","PinterContext"];
pagent.PinterContext.init = function() {
	pagent.PinterContext.PAGE_MGR = pagent.pages.PinterPageMgr.get_get();
	pagent.AppContext.init();
	pagent.PinterContext.BOARD_CONFIGS = new m3.observable.ObservableSet(qoid.model.ModelObjWithIid.identifier);
	pagent.model.EM.listenOnce(pagent.model.EMEvent.APP_INITIALIZED,function(n) {
		pagent.PinterContext.APP_INITIALIZED = true;
	},"PinterContext-AppInitialized");
};
pagent.PinterContext.get_ROOT_ALBUM = function() {
	return pagent.PinterContext.ROOT_ALBUM;
};
pagent.PinterContext.set_ROOT_ALBUM = function(l) {
	pagent.PinterContext.ROOT_ALBUM = l;
	var root = new qoid.model.Or();
	root.type = "ROOT";
	var path = new Array();
	path.push(m3.helper.OSetHelper.getElement(pagent.AppContext.LABELS,pagent.AppContext.currentAlias.rootLabelIid).name);
	path.push(pagent.PinterContext.get_ROOT_LABEL_OF_ALL_APPS().name);
	path.push(pagent.PinterContext.get_ROOT_ALBUM().name);
	root.addNode(new qoid.model.LabelNode(l,path));
	var filterData = new qoid.model.FilterData("boardConfig");
	filterData.filter = new qoid.model.Filter(root);
	filterData.filter.q = filterData.filter.q + " and contentType = '" + pagent.PinterContext.APP_ROOT_LABEL_NAME + ".config'";
	filterData.connectionIids = [];
	filterData.aliasIid = pagent.AppContext.currentAlias.iid;
	pagent.model.EM.change(pagent.model.EMEvent.FILTER_RUN,filterData);
	return l;
};
pagent.PinterContext.get_ROOT_LABEL_OF_ALL_APPS = function() {
	return pagent.PinterContext.ROOT_LABEL_OF_ALL_APPS;
};
pagent.PinterContext.set_ROOT_LABEL_OF_ALL_APPS = function(l) {
	pagent.PinterContext.ROOT_LABEL_OF_ALL_APPS = l;
	return l;
};
pagent.api = {};
pagent.api.EventDelegate = function(protocolHandler) {
	this.filterIsRunning = false;
	this.protocolHandler = protocolHandler;
	this._setUpEventListeners();
};
$hxClasses["pagent.api.EventDelegate"] = pagent.api.EventDelegate;
pagent.api.EventDelegate.__name__ = ["pagent","api","EventDelegate"];
pagent.api.EventDelegate.prototype = {
	_setUpEventListeners: function() {
		var _g = this;
		pagent.model.EM.addListener(pagent.model.EMEvent.FILTER_RUN,function(filterData) {
			if(filterData.type == "albumConfig") {
				filterData.type = "content";
				_g.protocolHandler.albumConfigs(filterData);
			} else _g.protocolHandler.filter(filterData);
		});
		pagent.model.EM.addListener(pagent.model.EMEvent.CreateAlias,function(alias) {
			_g.protocolHandler.createAlias(alias);
		});
		pagent.model.EM.addListener(pagent.model.EMEvent.DeleteAlias,function(alias1) {
			_g.protocolHandler.deleteAlias(alias1);
		});
		pagent.model.EM.addListener(pagent.model.EMEvent.UpdateAlias,function(alias2) {
			_g.protocolHandler.updateAlias(alias2);
		});
		pagent.model.EM.addListener(pagent.model.EMEvent.UserLogin,function(login) {
			_g.protocolHandler.login(login);
		});
		pagent.model.EM.addListener(pagent.model.EMEvent.CreateAgent,function(user) {
			_g.protocolHandler.createAgent(user);
		});
		pagent.model.EM.addListener(pagent.model.EMEvent.CreateContent,function(data) {
			_g.protocolHandler.createContent(data);
		});
		pagent.model.EM.addListener(pagent.model.EMEvent.UpdateContent,function(data1) {
			_g.protocolHandler.updateContent(data1);
		});
		pagent.model.EM.addListener(pagent.model.EMEvent.DeleteContent,function(data2) {
			_g.protocolHandler.deleteContent(data2);
		});
		pagent.model.EM.addListener(pagent.model.EMEvent.CreateLabel,function(data3) {
			_g.protocolHandler.createLabel(data3);
		});
		pagent.model.EM.addListener(pagent.model.EMEvent.UpdateLabel,function(data4) {
			_g.protocolHandler.updateLabel(data4);
		});
		pagent.model.EM.addListener(pagent.model.EMEvent.MoveLabel,function(data5) {
			_g.protocolHandler.moveLabel(data5);
		});
		pagent.model.EM.addListener(pagent.model.EMEvent.CopyLabel,function(data6) {
			_g.protocolHandler.copyLabel(data6);
		});
		pagent.model.EM.addListener(pagent.model.EMEvent.DeleteLabel,function(data7) {
			_g.protocolHandler.deleteLabel(data7);
		});
		pagent.model.EM.addListener(pagent.model.EMEvent.RespondToIntroduction,function(intro) {
			_g.protocolHandler.confirmIntroduction(intro);
		});
		pagent.model.EM.addListener(pagent.model.EMEvent.INTRODUCTION_REQUEST,function(intro1) {
			_g.protocolHandler.beginIntroduction(intro1);
		});
		pagent.model.EM.addListener(pagent.model.EMEvent.GrantAccess,function(parms) {
			_g.protocolHandler.grantAccess(parms.connectionIid,parms.labelIid);
		});
		pagent.model.EM.addListener(pagent.model.EMEvent.RevokeAccess,function(lacls) {
			_g.protocolHandler.revokeAccess(lacls);
		});
		pagent.model.EM.addListener(pagent.model.EMEvent.DeleteConnection,function(c) {
			_g.protocolHandler.deleteConnection(c);
		});
		pagent.model.EM.addListener(pagent.model.EMEvent.UserLogout,function(c1) {
			_g.protocolHandler.deregisterAllSqueries();
		});
		pagent.model.EM.addListener(pagent.model.EMEvent.TargetChange,function(conn) {
		});
		pagent.model.EM.addListener(pagent.model.EMEvent.BACKUP,function(n) {
			_g.protocolHandler.backup();
		});
		pagent.model.EM.addListener(pagent.model.EMEvent.RESTORE,function(n1) {
			_g.protocolHandler.restore();
		});
		pagent.model.EM.addListener(pagent.model.EMEvent.VerificationRequest,function(vr) {
			_g.protocolHandler.verificationRequest(vr);
		});
		pagent.model.EM.addListener(pagent.model.EMEvent.RespondToVerification,function(vr1) {
			_g.protocolHandler.respondToVerificationRequest(vr1);
		});
		pagent.model.EM.addListener(pagent.model.EMEvent.AcceptVerification,function(notificationIid) {
			_g.protocolHandler.acceptVerification(notificationIid);
		});
		pagent.model.EM.addListener(pagent.model.EMEvent.RejectVerificationRequest,function(notificationIid1) {
			_g.protocolHandler.rejectVerificationRequest(notificationIid1);
		});
	}
	,__class__: pagent.api.EventDelegate
};
pagent.api.ProtocolHandler = function() {
	this.eventDelegate = new pagent.api.EventDelegate(this);
	this.registeredHandles = new Array();
};
$hxClasses["pagent.api.ProtocolHandler"] = pagent.api.ProtocolHandler;
pagent.api.ProtocolHandler.__name__ = ["pagent","api","ProtocolHandler"];
pagent.api.ProtocolHandler.prototype = {
	createChannel: function(aliasName,successFunc) {
		new qoid.api.SimpleRequest("/api/channel/create/" + aliasName,"",successFunc).start();
	}
	,addHandle: function(handle) {
		this.registeredHandles.push(handle);
	}
	,deregisterAllSqueries: function() {
		if(this.registeredHandles.length > 0) this.deregisterSqueries(this.registeredHandles.slice());
	}
	,deregisterSqueries: function(handles) {
		var context = pagent.api.Synchronizer.createContext(handles.length,"deregisterSqueriesResponse");
		var requests = new Array();
		var _g = 0;
		while(_g < handles.length) {
			var handle = handles[_g];
			++_g;
			requests.push(new qoid.api.ChannelRequestMessage(pagent.api.ProtocolHandler.DEREGISTER,context,new qoid.api.DeregisterMessage(handle)));
			HxOverrides.remove(this.registeredHandles,handle);
		}
		new qoid.api.SubmitRequest(requests).start({ async : false});
	}
	,getProfiles: function(connectionIids) {
		var context = pagent.api.Synchronizer.createContext(1,"connectionProfile");
		var qm = qoid.api.QueryMessage.create("profile");
		qm.connectionIids = connectionIids;
		qm.local = false;
		new qoid.api.SubmitRequest([new qoid.api.ChannelRequestMessage(pagent.api.ProtocolHandler.QUERY,context,qm)]).start();
	}
	,getVerificationContent: function(connectionIids,iids) {
		var context = pagent.api.Synchronizer.createContext(1,"verificationContent");
		var qm = qoid.api.QueryMessage.create("content");
		qm.connectionIids = connectionIids;
		qm.q = "iid in (" + iids.join(",") + ")";
		qm.local = false;
		qm.standing = false;
		new qoid.api.SubmitRequest([new qoid.api.ChannelRequestMessage(pagent.api.ProtocolHandler.QUERY,context,qm)]).start();
	}
	,login: function(login) {
		this.createChannel(login.agentId,$bind(this,this.onCreateSubmitChannel));
	}
	,createAgent: function(newUser) {
		var req = new qoid.api.SimpleRequest("/api/agent/create/" + newUser.name,"",function(data) {
			pagent.model.EM.change(pagent.model.EMEvent.AgentCreated);
		});
		req.start();
	}
	,beginIntroduction: function(intro) {
		var context = pagent.api.Synchronizer.createContext(1,"beginIntroduction");
		var req = new qoid.api.SubmitRequest([new qoid.api.ChannelRequestMessage(pagent.api.ProtocolHandler.INTRODUCE,context,new qoid.api.IntroMessage(intro))]);
		req.start();
	}
	,confirmIntroduction: function(confirmation) {
		var context = pagent.api.Synchronizer.createContext(1,"confirmIntroduction");
		var req = new qoid.api.SubmitRequest([new qoid.api.ChannelRequestMessage(pagent.api.ProtocolHandler.INTRO_RESPONSE,context,confirmation)]);
		req.start();
	}
	,deleteConnection: function(c) {
		var context = pagent.api.Synchronizer.createContext(1,"connectionDeleted");
		new qoid.api.SubmitRequest([new qoid.api.ChannelRequestMessage(pagent.api.ProtocolHandler.DELETE,context,qoid.api.DeleteMessage.create(c))]).start();
	}
	,grantAccess: function(connectionIid,labelIid) {
		var acl = new qoid.model.LabelAcl(connectionIid,labelIid);
		var context = pagent.api.Synchronizer.createContext(1,"grantAccess");
		var req = new qoid.api.SubmitRequest([new qoid.api.ChannelRequestMessage(pagent.api.ProtocolHandler.UPSERT,context,qoid.api.CrudMessage.create(acl))]);
		req.start();
	}
	,revokeAccess: function(lacls) {
		var context = pagent.api.Synchronizer.createContext(1,"accessRevoked");
		var requests = new Array();
		var _g = 0;
		while(_g < lacls.length) {
			var lacl = lacls[_g];
			++_g;
			requests.push(new qoid.api.ChannelRequestMessage(pagent.api.ProtocolHandler.DELETE,context,qoid.api.DeleteMessage.create(lacl)));
		}
		new qoid.api.SubmitRequest(requests).start();
	}
	,filter: function(filterData) {
		var context = pagent.api.Synchronizer.createContext(1,"filterContent");
		var requests = [new qoid.api.ChannelRequestMessage(pagent.api.ProtocolHandler.QUERY,context,new qoid.api.QueryMessage(filterData))];
		new qoid.api.SubmitRequest(requests).start();
	}
	,albumConfigs: function(filterData) {
		var context = pagent.api.Synchronizer.createContext(1,"albumConfigs");
		var requests = [new qoid.api.ChannelRequestMessage(pagent.api.ProtocolHandler.QUERY,context,new qoid.api.QueryMessage(filterData))];
		new qoid.api.SubmitRequest(requests).start();
	}
	,createAlias: function(alias) {
		alias.name = alias.profile.name;
		var options = { profileName : alias.profile.name, profileImgSrc : alias.profile.imgSrc, parentIid : pagent.AppContext.ROOT_LABEL_ID};
		var context = pagent.api.Synchronizer.createContext(1,"aliasCreated");
		var req = new qoid.api.SubmitRequest([new qoid.api.ChannelRequestMessage(pagent.api.ProtocolHandler.UPSERT,context,qoid.api.CrudMessage.create(alias,options))]);
		req.start();
	}
	,updateAlias: function(alias) {
		alias.name = alias.profile.name;
		var context = pagent.api.Synchronizer.createContext(1,"aliasUpdated");
		var req = new qoid.api.SubmitRequest([new qoid.api.ChannelRequestMessage(pagent.api.ProtocolHandler.UPSERT,context,qoid.api.CrudMessage.create(alias)),new qoid.api.ChannelRequestMessage(pagent.api.ProtocolHandler.UPSERT,context,qoid.api.CrudMessage.create(alias.profile))]);
		req.start();
	}
	,deleteAlias: function(alias) {
		var context = pagent.api.Synchronizer.createContext(1,"aliasDeleted");
		new qoid.api.SubmitRequest([new qoid.api.ChannelRequestMessage(pagent.api.ProtocolHandler.DELETE,context,qoid.api.DeleteMessage.create(alias))]).start();
	}
	,createContent: function(data) {
		if(data.content == null) {
			pagent.AppContext.LOGGER.error("CONTENT IS NULL");
			return;
		}
		var context = pagent.api.Synchronizer.createContext(1 + data.labelIids.length,"contentCreated");
		var requests = new Array();
		requests.push(new qoid.api.ChannelRequestMessage(pagent.api.ProtocolHandler.UPSERT,context,qoid.api.CrudMessage.create(data.content)));
		var _g = 0;
		var _g1 = data.labelIids;
		while(_g < _g1.length) {
			var iid = _g1[_g];
			++_g;
			var labeledContent = new qoid.model.LabeledContent(data.content.iid,iid);
			requests.push(new qoid.api.ChannelRequestMessage(pagent.api.ProtocolHandler.UPSERT,context,qoid.api.CrudMessage.create(labeledContent)));
		}
		new qoid.api.SubmitRequest(requests).start();
	}
	,updateContent: function(data) {
		var currentLabels;
		var this1 = pagent.AppContext.GROUPED_LABELEDCONTENT.delegate();
		currentLabels = this1.get(data.content.iid);
		var labelsToDelete = new Array();
		var $it0 = currentLabels.iterator();
		while( $it0.hasNext() ) {
			var labeledContent = $it0.next();
			var found = false;
			var _g = 0;
			var _g1 = data.labelIids;
			while(_g < _g1.length) {
				var iid = _g1[_g];
				++_g;
				if(iid == labeledContent.labelIid) {
					found = true;
					break;
				}
			}
			if(!found) labelsToDelete.push(labeledContent);
		}
		var labelsToAdd = new Array();
		var _g2 = 0;
		var _g11 = data.labelIids;
		while(_g2 < _g11.length) {
			var iid1 = _g11[_g2];
			++_g2;
			var found1 = false;
			var $it1 = currentLabels.iterator();
			while( $it1.hasNext() ) {
				var labeledContent1 = $it1.next();
				if(iid1 == labeledContent1.labelIid) {
					found1 = true;
					break;
				}
			}
			if(!found1) labelsToAdd.push(new qoid.model.LabeledContent(data.content.iid,iid1));
		}
		var context = pagent.api.Synchronizer.createContext(1 + labelsToAdd.length + labelsToDelete.length,"contentUpdated");
		var requests = new Array();
		requests.push(new qoid.api.ChannelRequestMessage(pagent.api.ProtocolHandler.UPSERT,context,qoid.api.CrudMessage.create(data.content)));
		var _g3 = 0;
		while(_g3 < labelsToDelete.length) {
			var lc = labelsToDelete[_g3];
			++_g3;
			requests.push(new qoid.api.ChannelRequestMessage(pagent.api.ProtocolHandler.DELETE,context,qoid.api.DeleteMessage.create(lc)));
		}
		var _g4 = 0;
		while(_g4 < labelsToAdd.length) {
			var lc1 = labelsToAdd[_g4];
			++_g4;
			requests.push(new qoid.api.ChannelRequestMessage(pagent.api.ProtocolHandler.UPSERT,context,qoid.api.CrudMessage.create(lc1)));
		}
		new qoid.api.SubmitRequest(requests).start();
	}
	,deleteContent: function(data) {
		var context = pagent.api.Synchronizer.createContext(1 + data.labelIids.length,"contentDeleted");
		var requests = new Array();
		requests.push(new qoid.api.ChannelRequestMessage(pagent.api.ProtocolHandler.DELETE,context,qoid.api.DeleteMessage.create(data.content)));
		var $it0 = ((function($this) {
			var $r;
			var this1 = pagent.AppContext.GROUPED_LABELEDCONTENT.delegate();
			$r = this1.get(data.content.iid);
			return $r;
		}(this))).iterator();
		while( $it0.hasNext() ) {
			var lc = $it0.next();
			requests.push(new qoid.api.ChannelRequestMessage(pagent.api.ProtocolHandler.DELETE,context,qoid.api.DeleteMessage.create(lc)));
		}
		new qoid.api.SubmitRequest(requests).start();
	}
	,createLabel: function(data) {
		var context = pagent.api.Synchronizer.createContext(1,"labelCreated");
		var req = new qoid.api.SubmitRequest([new qoid.api.ChannelRequestMessage(pagent.api.ProtocolHandler.UPSERT,context,qoid.api.CrudMessage.create(data.label,{ parentIid : data.parentIid}))]);
		req.start();
	}
	,updateLabel: function(data) {
		var context = pagent.api.Synchronizer.createContext(1,"labelUpdated");
		var req = new qoid.api.SubmitRequest([new qoid.api.ChannelRequestMessage(pagent.api.ProtocolHandler.UPSERT,context,qoid.api.CrudMessage.create(data.label))]);
		req.start();
	}
	,getExistingLabelChild: function(parentIid,childIid) {
		var lcs = new m3.observable.FilteredSet(pagent.AppContext.LABELCHILDREN,function(lc) {
			return lc.parentIid == parentIid && lc.childIid == childIid;
		});
		return lcs.iterator().next();
	}
	,moveLabel: function(data) {
		var lcs = new m3.observable.FilteredSet(pagent.AppContext.LABELCHILDREN,function(lc) {
			return lc.parentIid == data.parentIid && lc.childIid == data.label.iid;
		});
		var lcToRemove = this.getExistingLabelChild(data.parentIid,data.label.iid);
		var lcToAdd = this.getExistingLabelChild(data.newParentId,data.label.iid);
		if(lcToAdd == null) lcToAdd = new qoid.model.LabelChild(data.newParentId,data.label.iid);
		var context = pagent.api.Synchronizer.createContext(2,"labelMoved");
		var req = new qoid.api.SubmitRequest([new qoid.api.ChannelRequestMessage(pagent.api.ProtocolHandler.DELETE,context,qoid.api.DeleteMessage.create(lcToRemove)),new qoid.api.ChannelRequestMessage(pagent.api.ProtocolHandler.UPSERT,context,qoid.api.CrudMessage.create(lcToAdd))]);
		req.start();
	}
	,copyLabel: function(data) {
		var lcToAdd = this.getExistingLabelChild(data.newParentId,data.label.iid);
		if(lcToAdd == null) lcToAdd = new qoid.model.LabelChild(data.newParentId,data.label.iid);
		var context = pagent.api.Synchronizer.createContext(1,"labelCopied");
		var req = new qoid.api.SubmitRequest([new qoid.api.ChannelRequestMessage(pagent.api.ProtocolHandler.UPSERT,context,qoid.api.CrudMessage.create(lcToAdd))]);
		req.start();
	}
	,deleteLabel: function(data) {
		var lc = m3.helper.OSetHelper.getElementComplex2(pagent.AppContext.LABELCHILDREN,function(lc1) {
			return lc1.parentIid == data.parentIid && lc1.childIid == data.label.iid;
		});
		var context = pagent.api.Synchronizer.createContext(1,"labelDeleted");
		new qoid.api.SubmitRequest([new qoid.api.ChannelRequestMessage(pagent.api.ProtocolHandler.DELETE,context,qoid.api.DeleteMessage.create(lc))]).start();
	}
	,verificationRequest: function(vr) {
		var context = pagent.api.Synchronizer.createContext(1,"verificationRequest");
		var req = new qoid.api.SubmitRequest([new qoid.api.ChannelRequestMessage(pagent.api.ProtocolHandler.VERIFICATION_REQUEST,context,new qoid.api.VerificationRequestMessage(vr))]);
		req.start();
	}
	,respondToVerificationRequest: function(vr) {
		var context = pagent.api.Synchronizer.createContext(1,"respondToVerificationRequest");
		var req = new qoid.api.SubmitRequest([new qoid.api.ChannelRequestMessage(pagent.api.ProtocolHandler.VERIFICATION_RESPONSE,context,new qoid.api.VerificationResponseMessage(vr))]);
		req.start();
	}
	,rejectVerificationRequest: function(notificationIid) {
		var notification = m3.helper.OSetHelper.getElement(pagent.AppContext.NOTIFICATIONS,notificationIid);
		notification.consumed = true;
		var context = pagent.api.Synchronizer.createContext(1,"verificationRequestRejected");
		var req = new qoid.api.SubmitRequest([new qoid.api.ChannelRequestMessage(pagent.api.ProtocolHandler.UPSERT,context,qoid.api.CrudMessage.create(notification))]);
		req.start();
	}
	,acceptVerification: function(notificationIid) {
		var context = pagent.api.Synchronizer.createContext(1,"acceptVerification");
		var req = new qoid.api.SubmitRequest([new qoid.api.ChannelRequestMessage(pagent.api.ProtocolHandler.VERIFICATION_ACCEPT,context,new qoid.api.AcceptVerificationMessage(notificationIid))]);
		req.start();
	}
	,onCreateSubmitChannel: function(data) {
		pagent.AppContext.SUBMIT_CHANNEL = data.channelId;
		pagent.AppContext.UBER_ALIAS_ID = data.aliasIid;
		this._startPolling(data.channelId);
		var context = pagent.api.Synchronizer.createContext(6,"initialDataLoad");
		var requests = [new qoid.api.ChannelRequestMessage(pagent.api.ProtocolHandler.QUERY,context,qoid.api.QueryMessage.create("alias")),new qoid.api.ChannelRequestMessage(pagent.api.ProtocolHandler.QUERY,context,qoid.api.QueryMessage.create("label")),new qoid.api.ChannelRequestMessage(pagent.api.ProtocolHandler.QUERY,context,qoid.api.QueryMessage.create("labelAcl")),new qoid.api.ChannelRequestMessage(pagent.api.ProtocolHandler.QUERY,context,qoid.api.QueryMessage.create("labeledContent")),new qoid.api.ChannelRequestMessage(pagent.api.ProtocolHandler.QUERY,context,qoid.api.QueryMessage.create("labelChild")),new qoid.api.ChannelRequestMessage(pagent.api.ProtocolHandler.QUERY,context,qoid.api.QueryMessage.create("profile"))];
		new qoid.api.SubmitRequest(requests).start();
	}
	,_startPolling: function(channelId) {
		var timeout = 10000;
		var ajaxOptions = { contentType : "", type : "GET"};
		this.listeningChannel = new m3.comm.LongPollingRequest(channelId,"",pagent.AppContext.LOGGER,pagent.api.ResponseProcessor.processResponse,null,ajaxOptions);
		this.listeningChannel.timeout = timeout;
		this.listeningChannel.start();
	}
	,backup: function() {
		throw new m3.exception.Exception("E_NOTIMPLEMENTED");
	}
	,restore: function() {
		throw new m3.exception.Exception("E_NOTIMPLEMENTED");
	}
	,restores: function() {
		throw new m3.exception.Exception("E_NOTIMPLEMENTED");
	}
	,__class__: pagent.api.ProtocolHandler
};
pagent.api.ResponseProcessor = function() { };
$hxClasses["pagent.api.ResponseProcessor"] = pagent.api.ResponseProcessor;
pagent.api.ResponseProcessor.__name__ = ["pagent","api","ResponseProcessor"];
pagent.api.ResponseProcessor.processResponse = function(dataArr) {
	if(dataArr == null || dataArr.length == 0) return;
	Lambda.iter(dataArr,function(data) {
		if(data.success == false) {
			m3.util.JqueryUtil.alert("ERROR:  " + Std.string(data.error.message) + "     Context: " + Std.string(data.context));
			pagent.AppContext.LOGGER.error(data.error.stacktrace);
		} else {
			if(data.context == null) return;
			var context = new qoid.model.Context(data.context);
			var _g = context.oncomplete;
			switch(_g) {
			case "initialDataLoad":
				if(data.responseType == "query") pagent.api.Synchronizer.processResponse(data); else if(data.responseType == "squery") pagent.api.ResponseProcessor.updateModelObject(data.type,data.action,data.results); else if(data.result && data.result.handle) pagent.PinterAgent.PROTOCOL.addHandle(data.result.handle);
				break;
			case "filterContent":
				if(data.responseType == "query") pagent.model.EM.change(pagent.model.EMEvent.LoadFilteredContent,data); else if(data.responseType == "squery") pagent.model.EM.change(pagent.model.EMEvent.AppendFilteredContent,data); else if(data.result && data.result.handle) pagent.PinterAgent.PROTOCOL.addHandle(data.result.handle);
				break;
			default:
				pagent.api.Synchronizer.processResponse(data);
			}
		}
	});
};
pagent.api.ResponseProcessor.processModelObject = function(set,type,action,data) {
	var _g = 0;
	var _g1;
	_g1 = js.Boot.__cast(data , Array);
	while(_g < _g1.length) {
		var datum = _g1[_g];
		++_g;
		var obj = pagent.AppContext.SERIALIZER.fromJsonX(datum,type);
		if(action == "delete") set["delete"](obj); else set.addOrUpdate(obj);
	}
};
pagent.api.ResponseProcessor.updateModelObject = function(type,action,data) {
	var type1 = type.toLowerCase();
	switch(type1) {
	case "alias":
		pagent.api.ResponseProcessor.processModelObject(pagent.AppContext.ALIASES,qoid.model.Alias,action,data);
		break;
	case "label":
		pagent.api.ResponseProcessor.processModelObject(pagent.AppContext.LABELS,qoid.model.Label,action,data);
		break;
	case "labelacl":
		pagent.api.ResponseProcessor.processModelObject(pagent.AppContext.LABELACLS,qoid.model.LabelAcl,action,data);
		break;
	case "labelchild":
		pagent.api.ResponseProcessor.processModelObject(pagent.AppContext.LABELCHILDREN,qoid.model.LabelChild,action,data);
		break;
	case "labeledcontent":
		pagent.api.ResponseProcessor.processModelObject(pagent.AppContext.LABELEDCONTENT,qoid.model.LabeledContent,action,data);
		break;
	case "notification":
		pagent.api.ResponseProcessor.processModelObject(pagent.AppContext.MASTER_NOTIFICATIONS,qoid.model.Notification,action,data);
		break;
	case "profile":
		pagent.api.ResponseProcessor.processModelObject(pagent.AppContext.PROFILES,qoid.model.Profile,action,data);
		break;
	default:
		pagent.AppContext.LOGGER.error("Unknown type: " + type1);
	}
};
pagent.api.ResponseProcessor.initialDataLoad = function(data) {
	pagent.AppContext.ALIASES.addAll(data.aliases);
	pagent.AppContext.LABELS.addAll(data.labels);
	pagent.AppContext.LABELCHILDREN.addAll(data.labelChildren);
	pagent.AppContext.LABELEDCONTENT.addAll(data.labeledContent);
	pagent.AppContext.LABELACLS.addAll(data.labelAcls);
	pagent.AppContext.PROFILES.addAll(data.profiles);
	var $it0 = pagent.AppContext.ALIASES.iterator();
	while( $it0.hasNext() ) {
		var alias_ = $it0.next();
		var $it1 = pagent.AppContext.PROFILES.iterator();
		while( $it1.hasNext() ) {
			var profile_ = $it1.next();
			if(profile_.aliasIid == alias_.iid) {
				alias_.profile = profile_;
				pagent.AppContext.ALIASES.update(alias_);
			}
		}
	}
	pagent.model.EM.change(pagent.model.EMEvent.InitialDataLoadComplete);
};
pagent.api.ResponseProcessor.albumConfigs = function(data) {
	pagent.PinterContext.BOARD_CONFIGS.addAll(data.content);
};
pagent.api.SynchronizationParms = function() {
	this.aliases = new Array();
	this.content = new Array();
	this.labels = new Array();
	this.labelAcls = new Array();
	this.labelChildren = new Array();
	this.labeledContent = new Array();
	this.profiles = new Array();
};
$hxClasses["pagent.api.SynchronizationParms"] = pagent.api.SynchronizationParms;
pagent.api.SynchronizationParms.__name__ = ["pagent","api","SynchronizationParms"];
pagent.api.SynchronizationParms.prototype = {
	__class__: pagent.api.SynchronizationParms
};
pagent.api.Synchronizer = function(iid,numResponsesExpected,oncomplete) {
	this.iid = iid;
	this.numResponsesExpected = numResponsesExpected;
	this.oncomplete = oncomplete;
	this.parms = new pagent.api.SynchronizationParms();
};
$hxClasses["pagent.api.Synchronizer"] = pagent.api.Synchronizer;
pagent.api.Synchronizer.__name__ = ["pagent","api","Synchronizer"];
pagent.api.Synchronizer.createContext = function(numResponsesExpected,oncomplete) {
	return m3.util.UidGenerator.create(32) + "-" + (numResponsesExpected == null?"null":"" + numResponsesExpected) + "-" + oncomplete;
};
pagent.api.Synchronizer.processResponse = function(data) {
	var context = new qoid.model.Context(data.context);
	var synchronizer = pagent.api.Synchronizer.synchronizers.get(context.iid);
	if(synchronizer == null) synchronizer = pagent.api.Synchronizer.add(context);
	synchronizer.dataReceived(context,data);
};
pagent.api.Synchronizer.add = function(c) {
	var synchronizer = new pagent.api.Synchronizer(c.iid,c.numResponsesExpected,c.oncomplete);
	pagent.api.Synchronizer.synchronizers.set(c.iid,synchronizer);
	return synchronizer;
};
pagent.api.Synchronizer.remove = function(iid) {
	pagent.api.Synchronizer.synchronizers.remove(iid);
};
pagent.api.Synchronizer.prototype = {
	processDataReceived: function(list,type,data) {
		var _g = 0;
		var _g1;
		_g1 = js.Boot.__cast(data , Array);
		while(_g < _g1.length) {
			var datum = _g1[_g];
			++_g;
			list.push(pagent.AppContext.SERIALIZER.fromJsonX(datum,type));
		}
	}
	,dataReceived: function(c,dataObj) {
		var data = dataObj.results;
		if(data == null) return;
		var type = dataObj.type.toLowerCase();
		switch(type) {
		case "alias":
			this.processDataReceived(this.parms.aliases,qoid.model.Alias,data);
			break;
		case "content":
			this.processDataReceived(this.parms.content,qoid.model.Content,data);
			break;
		case "label":
			this.processDataReceived(this.parms.labels,qoid.model.Label,data);
			break;
		case "labelacl":
			this.processDataReceived(this.parms.labelAcls,qoid.model.LabelAcl,data);
			break;
		case "labelchild":
			this.processDataReceived(this.parms.labelChildren,qoid.model.LabelChild,data);
			break;
		case "labeledcontent":
			this.processDataReceived(this.parms.labeledContent,qoid.model.LabeledContent,data);
			break;
		case "profile":
			this.processDataReceived(this.parms.profiles,qoid.model.Profile,data);
			break;
		default:
			pagent.AppContext.LOGGER.error("Unknown data type: " + Std.string(dataObj.type));
		}
		this.numResponsesExpected -= 1;
		if(this.numResponsesExpected == 0) {
			var func = Reflect.field(pagent.api.ResponseProcessor,this.oncomplete);
			if(func == null) pagent.AppContext.LOGGER.info("Missing oncomplete function: " + this.oncomplete); else func.apply(pagent.api.ResponseProcessor,[this.parms]);
			pagent.api.Synchronizer.remove(this.iid);
			var length = 0;
			var $it0 = pagent.api.Synchronizer.synchronizers.keys();
			while( $it0.hasNext() ) {
				var key = $it0.next();
				length += 1;
			}
			pagent.AppContext.LOGGER.info("Number Synchronizers: " + length);
		}
	}
	,__class__: pagent.api.Synchronizer
};
pagent.model = {};
pagent.model.EMEvent = $hxClasses["pagent.model.EMEvent"] = { __ename__ : ["pagent","model","EMEvent"], __constructs__ : ["APP_INITIALIZED","FILTER_RUN","FILTER_CHANGE","LoadFilteredContent","AppendFilteredContent","EditContentClosed","CreateAgent","AgentCreated","InitialDataLoadComplete","UserLogin","UserLogout","AliasLoaded","AliasCreated","AliasUpdated","CreateAlias","UpdateAlias","DeleteAlias","CreateContent","DeleteContent","UpdateContent","CreateLabel","UpdateLabel","MoveLabel","CopyLabel","DeleteLabel","GrantAccess","RevokeAccess","DeleteConnection","INTRODUCTION_REQUEST","RespondToIntroduction","TargetChange","VerificationRequest","RespondToVerification","RejectVerificationRequest","AcceptVerification","BACKUP","RESTORE"] };
pagent.model.EMEvent.APP_INITIALIZED = ["APP_INITIALIZED",0];
pagent.model.EMEvent.APP_INITIALIZED.__enum__ = pagent.model.EMEvent;
pagent.model.EMEvent.FILTER_RUN = ["FILTER_RUN",1];
pagent.model.EMEvent.FILTER_RUN.__enum__ = pagent.model.EMEvent;
pagent.model.EMEvent.FILTER_CHANGE = ["FILTER_CHANGE",2];
pagent.model.EMEvent.FILTER_CHANGE.__enum__ = pagent.model.EMEvent;
pagent.model.EMEvent.LoadFilteredContent = ["LoadFilteredContent",3];
pagent.model.EMEvent.LoadFilteredContent.__enum__ = pagent.model.EMEvent;
pagent.model.EMEvent.AppendFilteredContent = ["AppendFilteredContent",4];
pagent.model.EMEvent.AppendFilteredContent.__enum__ = pagent.model.EMEvent;
pagent.model.EMEvent.EditContentClosed = ["EditContentClosed",5];
pagent.model.EMEvent.EditContentClosed.__enum__ = pagent.model.EMEvent;
pagent.model.EMEvent.CreateAgent = ["CreateAgent",6];
pagent.model.EMEvent.CreateAgent.__enum__ = pagent.model.EMEvent;
pagent.model.EMEvent.AgentCreated = ["AgentCreated",7];
pagent.model.EMEvent.AgentCreated.__enum__ = pagent.model.EMEvent;
pagent.model.EMEvent.InitialDataLoadComplete = ["InitialDataLoadComplete",8];
pagent.model.EMEvent.InitialDataLoadComplete.__enum__ = pagent.model.EMEvent;
pagent.model.EMEvent.UserLogin = ["UserLogin",9];
pagent.model.EMEvent.UserLogin.__enum__ = pagent.model.EMEvent;
pagent.model.EMEvent.UserLogout = ["UserLogout",10];
pagent.model.EMEvent.UserLogout.__enum__ = pagent.model.EMEvent;
pagent.model.EMEvent.AliasLoaded = ["AliasLoaded",11];
pagent.model.EMEvent.AliasLoaded.__enum__ = pagent.model.EMEvent;
pagent.model.EMEvent.AliasCreated = ["AliasCreated",12];
pagent.model.EMEvent.AliasCreated.__enum__ = pagent.model.EMEvent;
pagent.model.EMEvent.AliasUpdated = ["AliasUpdated",13];
pagent.model.EMEvent.AliasUpdated.__enum__ = pagent.model.EMEvent;
pagent.model.EMEvent.CreateAlias = ["CreateAlias",14];
pagent.model.EMEvent.CreateAlias.__enum__ = pagent.model.EMEvent;
pagent.model.EMEvent.UpdateAlias = ["UpdateAlias",15];
pagent.model.EMEvent.UpdateAlias.__enum__ = pagent.model.EMEvent;
pagent.model.EMEvent.DeleteAlias = ["DeleteAlias",16];
pagent.model.EMEvent.DeleteAlias.__enum__ = pagent.model.EMEvent;
pagent.model.EMEvent.CreateContent = ["CreateContent",17];
pagent.model.EMEvent.CreateContent.__enum__ = pagent.model.EMEvent;
pagent.model.EMEvent.DeleteContent = ["DeleteContent",18];
pagent.model.EMEvent.DeleteContent.__enum__ = pagent.model.EMEvent;
pagent.model.EMEvent.UpdateContent = ["UpdateContent",19];
pagent.model.EMEvent.UpdateContent.__enum__ = pagent.model.EMEvent;
pagent.model.EMEvent.CreateLabel = ["CreateLabel",20];
pagent.model.EMEvent.CreateLabel.__enum__ = pagent.model.EMEvent;
pagent.model.EMEvent.UpdateLabel = ["UpdateLabel",21];
pagent.model.EMEvent.UpdateLabel.__enum__ = pagent.model.EMEvent;
pagent.model.EMEvent.MoveLabel = ["MoveLabel",22];
pagent.model.EMEvent.MoveLabel.__enum__ = pagent.model.EMEvent;
pagent.model.EMEvent.CopyLabel = ["CopyLabel",23];
pagent.model.EMEvent.CopyLabel.__enum__ = pagent.model.EMEvent;
pagent.model.EMEvent.DeleteLabel = ["DeleteLabel",24];
pagent.model.EMEvent.DeleteLabel.__enum__ = pagent.model.EMEvent;
pagent.model.EMEvent.GrantAccess = ["GrantAccess",25];
pagent.model.EMEvent.GrantAccess.__enum__ = pagent.model.EMEvent;
pagent.model.EMEvent.RevokeAccess = ["RevokeAccess",26];
pagent.model.EMEvent.RevokeAccess.__enum__ = pagent.model.EMEvent;
pagent.model.EMEvent.DeleteConnection = ["DeleteConnection",27];
pagent.model.EMEvent.DeleteConnection.__enum__ = pagent.model.EMEvent;
pagent.model.EMEvent.INTRODUCTION_REQUEST = ["INTRODUCTION_REQUEST",28];
pagent.model.EMEvent.INTRODUCTION_REQUEST.__enum__ = pagent.model.EMEvent;
pagent.model.EMEvent.RespondToIntroduction = ["RespondToIntroduction",29];
pagent.model.EMEvent.RespondToIntroduction.__enum__ = pagent.model.EMEvent;
pagent.model.EMEvent.TargetChange = ["TargetChange",30];
pagent.model.EMEvent.TargetChange.__enum__ = pagent.model.EMEvent;
pagent.model.EMEvent.VerificationRequest = ["VerificationRequest",31];
pagent.model.EMEvent.VerificationRequest.__enum__ = pagent.model.EMEvent;
pagent.model.EMEvent.RespondToVerification = ["RespondToVerification",32];
pagent.model.EMEvent.RespondToVerification.__enum__ = pagent.model.EMEvent;
pagent.model.EMEvent.RejectVerificationRequest = ["RejectVerificationRequest",33];
pagent.model.EMEvent.RejectVerificationRequest.__enum__ = pagent.model.EMEvent;
pagent.model.EMEvent.AcceptVerification = ["AcceptVerification",34];
pagent.model.EMEvent.AcceptVerification.__enum__ = pagent.model.EMEvent;
pagent.model.EMEvent.BACKUP = ["BACKUP",35];
pagent.model.EMEvent.BACKUP.__enum__ = pagent.model.EMEvent;
pagent.model.EMEvent.RESTORE = ["RESTORE",36];
pagent.model.EMEvent.RESTORE.__enum__ = pagent.model.EMEvent;
pagent.model.EMEvent.__empty_constructs__ = [pagent.model.EMEvent.APP_INITIALIZED,pagent.model.EMEvent.FILTER_RUN,pagent.model.EMEvent.FILTER_CHANGE,pagent.model.EMEvent.LoadFilteredContent,pagent.model.EMEvent.AppendFilteredContent,pagent.model.EMEvent.EditContentClosed,pagent.model.EMEvent.CreateAgent,pagent.model.EMEvent.AgentCreated,pagent.model.EMEvent.InitialDataLoadComplete,pagent.model.EMEvent.UserLogin,pagent.model.EMEvent.UserLogout,pagent.model.EMEvent.AliasLoaded,pagent.model.EMEvent.AliasCreated,pagent.model.EMEvent.AliasUpdated,pagent.model.EMEvent.CreateAlias,pagent.model.EMEvent.UpdateAlias,pagent.model.EMEvent.DeleteAlias,pagent.model.EMEvent.CreateContent,pagent.model.EMEvent.DeleteContent,pagent.model.EMEvent.UpdateContent,pagent.model.EMEvent.CreateLabel,pagent.model.EMEvent.UpdateLabel,pagent.model.EMEvent.MoveLabel,pagent.model.EMEvent.CopyLabel,pagent.model.EMEvent.DeleteLabel,pagent.model.EMEvent.GrantAccess,pagent.model.EMEvent.RevokeAccess,pagent.model.EMEvent.DeleteConnection,pagent.model.EMEvent.INTRODUCTION_REQUEST,pagent.model.EMEvent.RespondToIntroduction,pagent.model.EMEvent.TargetChange,pagent.model.EMEvent.VerificationRequest,pagent.model.EMEvent.RespondToVerification,pagent.model.EMEvent.RejectVerificationRequest,pagent.model.EMEvent.AcceptVerification,pagent.model.EMEvent.BACKUP,pagent.model.EMEvent.RESTORE];
pagent.model.EM = function() { };
$hxClasses["pagent.model.EM"] = pagent.model.EM;
pagent.model.EM.__name__ = ["pagent","model","EM"];
pagent.model.EM.addListener = function(id,func,listenerName) {
	return pagent.model.EM.delegate.addListener(id,func,listenerName);
};
pagent.model.EM.listenOnce = function(id,func,listenerName) {
	return pagent.model.EM.delegate.listenOnce(id,func,listenerName);
};
pagent.model.EM.removeListener = function(id,listenerUid) {
	pagent.model.EM.delegate.removeListener(id,listenerUid);
};
pagent.model.EM.change = function(id,t) {
	pagent.model.EM.delegate.change(id,t);
};
pagent.model.Nothing = function() { };
$hxClasses["pagent.model.Nothing"] = pagent.model.Nothing;
pagent.model.Nothing.__name__ = ["pagent","model","Nothing"];
pagent.pages = {};
pagent.pages.PinterPage = function(opts) {
	var _g = this;
	m3.jq.pages.Page.call(this,opts);
	this.pageBeforeShow = function(screen) {
		m3.log.Logga.get_DEFAULT().debug("pageBeforeShow " + _g.id);
		var justReloaded = false;
		var fcn = function() {
			try {
				_g.options.pageBeforeShowFcn(screen);
			} catch( err ) {
				m3.log.Logga.get_DEFAULT().error("Error showing " + _g.options.id,m3.log.Logga.getExceptionInst(err));
				m3.util.JqueryUtil.alert("There was a problem showing this screen.","Error");
				return;
			}
			justReloaded = false;
		};
		if(pagent.PinterContext.APP_INITIALIZED) fcn(); else {
			m3.log.Logga.get_DEFAULT().debug(_g.get_nonCssId() + " is holdingOnInitialization");
			_g.holdingOnInitialization = true;
			pagent.model.EM.listenOnce(pagent.model.EMEvent.APP_INITIALIZED,function(n) {
				justReloaded = true;
				fcn();
				_g.holdingOnInitialization = false;
				pagent.AppContext.LOGGER.debug(_g.get_nonCssId() + " is no longer holdingOnInitialization");
			},"PageBefore-AppInitialized");
		}
	};
};
$hxClasses["pagent.pages.PinterPage"] = pagent.pages.PinterPage;
pagent.pages.PinterPage.__name__ = ["pagent","pages","PinterPage"];
pagent.pages.PinterPage.__super__ = m3.jq.pages.Page;
pagent.pages.PinterPage.prototype = $extend(m3.jq.pages.Page.prototype,{
	initializePageContents: function(pageDiv) {
		if(pageDiv == null) pageDiv = new $(this.id);
		m3.jq.pages.Page.prototype.initializePageContents.call(this,pageDiv);
		var pageContent = new $("<div class='ui-content content'></div>").appendTo(pageDiv);
	}
	,__class__: pagent.pages.PinterPage
});
pagent.pages.HomeScreen = function() {
	pagent.pages.PinterPage.call(this,{ id : "#homeScreen", pageBeforeShowFcn : $bind(this,this.pageBeforeShowFcn), reqUser : true, showBackButton : false});
};
$hxClasses["pagent.pages.HomeScreen"] = pagent.pages.HomeScreen;
pagent.pages.HomeScreen.__name__ = ["pagent","pages","HomeScreen"];
pagent.pages.HomeScreen.__super__ = pagent.pages.PinterPage;
pagent.pages.HomeScreen.prototype = $extend(pagent.pages.PinterPage.prototype,{
	pageBeforeShowFcn: function(screen) {
		var content = new $(".content",screen).empty();
		content.addClass("center");
		var aliasComp = new $("<div></div>");
		aliasComp.appendTo(content);
		aliasComp.aliasComp();
		var optionBar = new $("<div></div>");
		optionBar.appendTo(content);
		optionBar.optionBar();
	}
	,__class__: pagent.pages.HomeScreen
});
pagent.pages.PinterPageMgr = function() {
	m3.jq.pages.SinglePageManager.call(this,function() {
		return pagent.PinterContext.APP_INITIALIZED;
	},function(fcn) {
		pagent.model.EM.listenOnce(pagent.model.EMEvent.APP_INITIALIZED,fcn);
	});
};
$hxClasses["pagent.pages.PinterPageMgr"] = pagent.pages.PinterPageMgr;
pagent.pages.PinterPageMgr.__name__ = ["pagent","pages","PinterPageMgr"];
pagent.pages.PinterPageMgr.get_get = function() {
	if(pagent.pages.PinterPageMgr._instance == null) pagent.pages.PinterPageMgr._instance = new pagent.pages.PinterPageMgr();
	return pagent.pages.PinterPageMgr._instance;
};
pagent.pages.PinterPageMgr.__super__ = m3.jq.pages.SinglePageManager;
pagent.pages.PinterPageMgr.prototype = $extend(m3.jq.pages.SinglePageManager.prototype,{
	initClientPages: function() {
		var pages = this.getScreens();
		var _g1 = 0;
		var _g = pages.length;
		while(_g1 < _g) {
			var p_ = _g1++;
			var page = pages[p_];
			var screen = null;
			if(!(screen = new $(page.id)).exists()) page.addPageToDom(); else page.initializePageContents(screen);
		}
	}
	,__class__: pagent.pages.PinterPageMgr
});
var qoid = {};
qoid.model = {};
qoid.model.ModelObj = function() {
};
$hxClasses["qoid.model.ModelObj"] = qoid.model.ModelObj;
qoid.model.ModelObj.__name__ = ["qoid","model","ModelObj"];
qoid.model.ModelObj.prototype = {
	objectType: function() {
		var className = m3.serialization.TypeTools.classname(m3.serialization.TypeTools.clazz(this)).toLowerCase();
		var parts = className.split(".");
		return parts[parts.length - 1];
	}
	,__class__: qoid.model.ModelObj
};
qoid.model.ModelObjWithIid = function() {
	qoid.model.ModelObj.call(this);
	this.iid = m3.util.UidGenerator.create(32);
	this.created = new Date();
	this.modified = new Date();
};
$hxClasses["qoid.model.ModelObjWithIid"] = qoid.model.ModelObjWithIid;
qoid.model.ModelObjWithIid.__name__ = ["qoid","model","ModelObjWithIid"];
qoid.model.ModelObjWithIid.identifier = function(t) {
	return t.iid;
};
qoid.model.ModelObjWithIid.__super__ = qoid.model.ModelObj;
qoid.model.ModelObjWithIid.prototype = $extend(qoid.model.ModelObj.prototype,{
	__class__: qoid.model.ModelObjWithIid
});
qoid.model.Alias = function() {
	qoid.model.ModelObjWithIid.call(this);
	this.profile = new qoid.model.Profile();
	this.data = new qoid.model.AliasData();
};
$hxClasses["qoid.model.Alias"] = qoid.model.Alias;
qoid.model.Alias.__name__ = ["qoid","model","Alias"];
qoid.model.Alias.identifier = function(alias) {
	return alias.iid;
};
qoid.model.Alias.__super__ = qoid.model.ModelObjWithIid;
qoid.model.Alias.prototype = $extend(qoid.model.ModelObjWithIid.prototype,{
	__class__: qoid.model.Alias
});
qoid.model.Profile = function(name,imgSrc,aliasIid) {
	qoid.model.ModelObjWithIid.call(this);
	if(name == null) this.name = "Unknown"; else this.name = name;
	if(imgSrc == null) this.imgSrc = "media/koi.jpg"; else this.imgSrc = imgSrc;
	this.aliasIid = aliasIid;
};
$hxClasses["qoid.model.Profile"] = qoid.model.Profile;
qoid.model.Profile.__name__ = ["qoid","model","Profile"];
qoid.model.Profile.identifier = function(profile) {
	return profile.iid;
};
qoid.model.Profile.__super__ = qoid.model.ModelObjWithIid;
qoid.model.Profile.prototype = $extend(qoid.model.ModelObjWithIid.prototype,{
	__class__: qoid.model.Profile
});
qoid.model.AliasData = function() {
	qoid.model.ModelObj.call(this);
	this.isDefault = false;
};
$hxClasses["qoid.model.AliasData"] = qoid.model.AliasData;
qoid.model.AliasData.__name__ = ["qoid","model","AliasData"];
qoid.model.AliasData.__super__ = qoid.model.ModelObj;
qoid.model.AliasData.prototype = $extend(qoid.model.ModelObj.prototype,{
	__class__: qoid.model.AliasData
});
pagent.widget = {};
pagent.widget.DialogManager = $hx_exports.pagent.widget.DialogManager = function() { };
$hxClasses["pagent.widget.DialogManager"] = pagent.widget.DialogManager;
pagent.widget.DialogManager.__name__ = ["pagent","widget","DialogManager"];
pagent.widget.DialogManager.showDialog = function(dialogFcnName,options) {
	if(options == null) options = { };
	var selector = "." + dialogFcnName;
	var dialog = new $(selector);
	if(!dialog.exists()) {
		dialog = new $("<div></div>");
		dialog.appendTo(window.document.body);
		var dlg = (Reflect.field($.ui,dialogFcnName))(options);
		dlg.open();
	} else {
		var field = Reflect.field(dialog,dialogFcnName);
		var _g = 0;
		var _g1 = Reflect.fields(options);
		while(_g < _g1.length) {
			var key = _g1[_g];
			++_g;
			var value = Reflect.field(options,key);
			field.apply(dialog,["option",key,value]);
		}
		field.apply(dialog,["open"]);
	}
};
pagent.widget.DialogManager.showLogin = function() {
	pagent.widget.DialogManager.showDialog("loginDialog");
};
pagent.widget.DialogManager.showCreateAgent = function() {
	pagent.widget.DialogManager.showDialog("createAgentDialog");
};
pagent.widget.DialogManager.showAliasManager = function() {
	pagent.widget.DialogManager.showDialog("aliasManagerDialog");
};
pagent.widget.ConnectionAvatarHelper = function() { };
$hxClasses["pagent.widget.ConnectionAvatarHelper"] = pagent.widget.ConnectionAvatarHelper;
pagent.widget.ConnectionAvatarHelper.__name__ = ["pagent","widget","ConnectionAvatarHelper"];
pagent.widget.ConnectionAvatarHelper.getAlias = function(c) {
	return c.connectionAvatar("getAlias");
};
pagent.widget.LabelCompHelper = function() { };
$hxClasses["pagent.widget.LabelCompHelper"] = pagent.widget.LabelCompHelper;
pagent.widget.LabelCompHelper.__name__ = ["pagent","widget","LabelCompHelper"];
pagent.widget.LabelCompHelper.getLabel = function(l) {
	return l.labelComp("getLabel");
};
pagent.widget.LabelCompHelper.parentIid = function(l) {
	return l.labelComp("option","parentIid");
};
qoid.model.Label = function(name) {
	qoid.model.ModelObjWithIid.call(this);
	this.name = name;
	this.data = new qoid.model.LabelData();
};
$hxClasses["qoid.model.Label"] = qoid.model.Label;
qoid.model.Label.__name__ = ["qoid","model","Label"];
qoid.model.Label.identifier = function(l) {
	return l.iid;
};
qoid.model.Label.__super__ = qoid.model.ModelObjWithIid;
qoid.model.Label.prototype = $extend(qoid.model.ModelObjWithIid.prototype,{
	__class__: qoid.model.Label
});
qoid.model.LabelData = function() {
	qoid.model.ModelObj.call(this);
	this.color = m3.util.ColorProvider.getNextColor();
};
$hxClasses["qoid.model.LabelData"] = qoid.model.LabelData;
qoid.model.LabelData.__name__ = ["qoid","model","LabelData"];
qoid.model.LabelData.__super__ = qoid.model.ModelObj;
qoid.model.LabelData.prototype = $extend(qoid.model.ModelObj.prototype,{
	__class__: qoid.model.LabelData
});
qoid.model.Node = function(type) {
	this.type = "ROOT";
	if(type != null) this.type = type;
};
$hxClasses["qoid.model.Node"] = qoid.model.Node;
qoid.model.Node.__name__ = ["qoid","model","Node"];
qoid.model.Node.prototype = {
	addNode: function(n) {
		this.nodes.push(n);
	}
	,hasChildren: function() {
		return m3.helper.ArrayHelper.hasValues(this.nodes);
	}
	,getQuery: function() {
		return "";
	}
	,__class__: qoid.model.Node
};
qoid.model.ContentNode = function(type,content) {
	qoid.model.Node.call(this,type);
	this.content = content;
};
$hxClasses["qoid.model.ContentNode"] = qoid.model.ContentNode;
qoid.model.ContentNode.__name__ = ["qoid","model","ContentNode"];
qoid.model.ContentNode.__super__ = qoid.model.Node;
qoid.model.ContentNode.prototype = $extend(qoid.model.Node.prototype,{
	hasChildren: function() {
		return false;
	}
	,__class__: qoid.model.ContentNode
});
qoid.model.LabelNode = function(label,labelPath) {
	qoid.model.ContentNode.call(this,"LABEL",label);
	this.labelPath = labelPath;
};
$hxClasses["qoid.model.LabelNode"] = qoid.model.LabelNode;
qoid.model.LabelNode.__name__ = ["qoid","model","LabelNode"];
qoid.model.LabelNode.__super__ = qoid.model.ContentNode;
qoid.model.LabelNode.prototype = $extend(qoid.model.ContentNode.prototype,{
	getQuery: function() {
		var ret = "hasLabelPath(";
		var _g1 = 1;
		var _g = this.labelPath.length;
		while(_g1 < _g) {
			var i = _g1++;
			ret += "'" + StringTools.replace(this.labelPath[i],"'","\\'") + "'";
			if(i < this.labelPath.length - 1) ret += ",";
		}
		ret += ")";
		return ret;
	}
	,__class__: qoid.model.LabelNode
});
qoid.model.EditLabelData = function(label,parentIid,newParentId) {
	this.label = label;
	this.parentIid = parentIid;
	this.newParentId = newParentId;
};
$hxClasses["qoid.model.EditLabelData"] = qoid.model.EditLabelData;
qoid.model.EditLabelData.__name__ = ["qoid","model","EditLabelData"];
qoid.model.EditLabelData.prototype = {
	__class__: qoid.model.EditLabelData
};
pagent.widget.OptionBarHelper = function() { };
$hxClasses["pagent.widget.OptionBarHelper"] = pagent.widget.OptionBarHelper;
pagent.widget.OptionBarHelper.__name__ = ["pagent","widget","OptionBarHelper"];
qoid.api = {};
qoid.api.ChannelMessage = function() { };
$hxClasses["qoid.api.ChannelMessage"] = qoid.api.ChannelMessage;
qoid.api.ChannelMessage.__name__ = ["qoid","api","ChannelMessage"];
qoid.api.BennuMessage = function(type) {
	this.type = type;
};
$hxClasses["qoid.api.BennuMessage"] = qoid.api.BennuMessage;
qoid.api.BennuMessage.__name__ = ["qoid","api","BennuMessage"];
qoid.api.BennuMessage.__interfaces__ = [qoid.api.ChannelMessage];
qoid.api.BennuMessage.prototype = {
	__class__: qoid.api.BennuMessage
};
qoid.api.DeleteMessage = function(type,primaryKey) {
	qoid.api.BennuMessage.call(this,type);
	this.primaryKey = primaryKey;
};
$hxClasses["qoid.api.DeleteMessage"] = qoid.api.DeleteMessage;
qoid.api.DeleteMessage.__name__ = ["qoid","api","DeleteMessage"];
qoid.api.DeleteMessage.create = function(object) {
	return new qoid.api.DeleteMessage(object.objectType(),object.iid);
};
qoid.api.DeleteMessage.__super__ = qoid.api.BennuMessage;
qoid.api.DeleteMessage.prototype = $extend(qoid.api.BennuMessage.prototype,{
	__class__: qoid.api.DeleteMessage
});
qoid.api.CrudMessage = function(type,instance,optionals) {
	qoid.api.BennuMessage.call(this,type);
	this.instance = instance;
	if(optionals != null) {
		this.parentIid = optionals.parentIid;
		this.profileName = optionals.profileName;
		this.profileImgSrc = optionals.profileImgSrc;
		this.labelIids = optionals.labelIids;
	}
};
$hxClasses["qoid.api.CrudMessage"] = qoid.api.CrudMessage;
qoid.api.CrudMessage.__name__ = ["qoid","api","CrudMessage"];
qoid.api.CrudMessage.create = function(object,optionals) {
	var instance = pagent.AppContext.SERIALIZER.toJson(object);
	return new qoid.api.CrudMessage(object.objectType(),instance,optionals);
};
qoid.api.CrudMessage.__super__ = qoid.api.BennuMessage;
qoid.api.CrudMessage.prototype = $extend(qoid.api.BennuMessage.prototype,{
	__class__: qoid.api.CrudMessage
});
qoid.api.DeregisterMessage = function(handle) {
	this.handle = handle;
};
$hxClasses["qoid.api.DeregisterMessage"] = qoid.api.DeregisterMessage;
qoid.api.DeregisterMessage.__name__ = ["qoid","api","DeregisterMessage"];
qoid.api.DeregisterMessage.__interfaces__ = [qoid.api.ChannelMessage];
qoid.api.DeregisterMessage.prototype = {
	__class__: qoid.api.DeregisterMessage
};
qoid.api.IntroMessage = function(i) {
	this.aConnectionIid = i.aConnectionIid;
	this.aMessage = i.aMessage;
	this.bConnectionIid = i.bConnectionIid;
	this.bMessage = i.bMessage;
};
$hxClasses["qoid.api.IntroMessage"] = qoid.api.IntroMessage;
qoid.api.IntroMessage.__name__ = ["qoid","api","IntroMessage"];
qoid.api.IntroMessage.__interfaces__ = [qoid.api.ChannelMessage];
qoid.api.IntroMessage.prototype = {
	__class__: qoid.api.IntroMessage
};
qoid.api.VerificationRequestMessage = function(vr) {
	this.contentIid = vr.contentIid;
	this.connectionIids = vr.connectionIids;
	this.message = vr.message;
};
$hxClasses["qoid.api.VerificationRequestMessage"] = qoid.api.VerificationRequestMessage;
qoid.api.VerificationRequestMessage.__name__ = ["qoid","api","VerificationRequestMessage"];
qoid.api.VerificationRequestMessage.__interfaces__ = [qoid.api.ChannelMessage];
qoid.api.VerificationRequestMessage.prototype = {
	__class__: qoid.api.VerificationRequestMessage
};
qoid.api.VerificationResponseMessage = function(vr) {
	this.notificationIid = vr.notificationIid;
	this.verificationContent = vr.verificationContent;
};
$hxClasses["qoid.api.VerificationResponseMessage"] = qoid.api.VerificationResponseMessage;
qoid.api.VerificationResponseMessage.__name__ = ["qoid","api","VerificationResponseMessage"];
qoid.api.VerificationResponseMessage.__interfaces__ = [qoid.api.ChannelMessage];
qoid.api.VerificationResponseMessage.prototype = {
	__class__: qoid.api.VerificationResponseMessage
};
qoid.api.AcceptVerificationMessage = function(notificationIid) {
	this.notificationIid = notificationIid;
};
$hxClasses["qoid.api.AcceptVerificationMessage"] = qoid.api.AcceptVerificationMessage;
qoid.api.AcceptVerificationMessage.__name__ = ["qoid","api","AcceptVerificationMessage"];
qoid.api.AcceptVerificationMessage.__interfaces__ = [qoid.api.ChannelMessage];
qoid.api.AcceptVerificationMessage.prototype = {
	__class__: qoid.api.AcceptVerificationMessage
};
qoid.api.IntroResponseMessage = function(notificationIid,accepted) {
	this.notificationIid = notificationIid;
	this.accepted = accepted;
};
$hxClasses["qoid.api.IntroResponseMessage"] = qoid.api.IntroResponseMessage;
qoid.api.IntroResponseMessage.__name__ = ["qoid","api","IntroResponseMessage"];
qoid.api.IntroResponseMessage.__interfaces__ = [qoid.api.ChannelMessage];
qoid.api.IntroResponseMessage.prototype = {
	__class__: qoid.api.IntroResponseMessage
};
qoid.api.QueryMessage = function(fd,type,q) {
	if(fd == null) {
		this.type = type;
		this.q = q;
		this.aliasIid = null;
		this.connectionIids = new Array();
		this.local = true;
	} else {
		this.type = fd.type;
		this.q = fd.filter.q;
		this.aliasIid = fd.aliasIid;
		this.connectionIids = fd.connectionIids;
		this.local = fd.aliasIid != null;
	}
	this.historical = true;
	this.standing = true;
};
$hxClasses["qoid.api.QueryMessage"] = qoid.api.QueryMessage;
qoid.api.QueryMessage.__name__ = ["qoid","api","QueryMessage"];
qoid.api.QueryMessage.__interfaces__ = [qoid.api.ChannelMessage];
qoid.api.QueryMessage.create = function(type) {
	return new qoid.api.QueryMessage(null,type,"1=1");
};
qoid.api.QueryMessage.prototype = {
	__class__: qoid.api.QueryMessage
};
qoid.api.ChannelRequestMessage = function(path,context,msg) {
	this.path = path;
	this.context = context;
	this.parms = pagent.AppContext.SERIALIZER.toJson(msg);
};
$hxClasses["qoid.api.ChannelRequestMessage"] = qoid.api.ChannelRequestMessage;
qoid.api.ChannelRequestMessage.__name__ = ["qoid","api","ChannelRequestMessage"];
qoid.api.ChannelRequestMessage.prototype = {
	__class__: qoid.api.ChannelRequestMessage
};
qoid.api.ChannelRequestMessageBundle = function(requests_) {
	this.channel = pagent.AppContext.SUBMIT_CHANNEL;
	if(requests_ == null) this.requests = new Array(); else this.requests = requests_;
};
$hxClasses["qoid.api.ChannelRequestMessageBundle"] = qoid.api.ChannelRequestMessageBundle;
qoid.api.ChannelRequestMessageBundle.__name__ = ["qoid","api","ChannelRequestMessageBundle"];
qoid.api.ChannelRequestMessageBundle.prototype = {
	addChannelRequest: function(request) {
		this.requests.push(request);
	}
	,addRequest: function(path,context,parms) {
		var request = new qoid.api.ChannelRequestMessage(path,context,parms);
		this.addChannelRequest(request);
	}
	,__class__: qoid.api.ChannelRequestMessageBundle
};
qoid.api.SimpleRequest = function(path,data,successFcn) {
	this.baseOpts = { async : true, url : path};
	m3.comm.BaseRequest.call(this,data,successFcn);
};
$hxClasses["qoid.api.SimpleRequest"] = qoid.api.SimpleRequest;
qoid.api.SimpleRequest.__name__ = ["qoid","api","SimpleRequest"];
qoid.api.SimpleRequest.__super__ = m3.comm.BaseRequest;
qoid.api.SimpleRequest.prototype = $extend(m3.comm.BaseRequest.prototype,{
	__class__: qoid.api.SimpleRequest
});
qoid.api.SubmitRequest = function(msgs,successFcn) {
	this.baseOpts = { dataType : "text", async : true, url : "/api/channel/submit"};
	if(successFcn == null) successFcn = function(data) {
	};
	var bundle = new qoid.api.ChannelRequestMessageBundle(msgs);
	var data1 = pagent.AppContext.SERIALIZER.toJsonString(bundle);
	m3.comm.BaseRequest.call(this,data1,successFcn);
};
$hxClasses["qoid.api.SubmitRequest"] = qoid.api.SubmitRequest;
qoid.api.SubmitRequest.__name__ = ["qoid","api","SubmitRequest"];
qoid.api.SubmitRequest.__super__ = m3.comm.BaseRequest;
qoid.api.SubmitRequest.prototype = $extend(m3.comm.BaseRequest.prototype,{
	__class__: qoid.api.SubmitRequest
});
qoid.model.Context = function(context) {
	var c = context.split("-");
	if(c.length != 3) throw new m3.exception.Exception("invalid context");
	this.iid = c[0];
	this.numResponsesExpected = Std.parseInt(c[1]);
	this.oncomplete = c[2];
};
$hxClasses["qoid.model.Context"] = qoid.model.Context;
qoid.model.Context.__name__ = ["qoid","model","Context"];
qoid.model.Context.prototype = {
	__class__: qoid.model.Context
};
qoid.model.Filter = function(node) {
	this.rootNode = node;
	this.nodes = new Array();
	if(node.hasChildren()) {
		var _g = 0;
		var _g1 = node.nodes;
		while(_g < _g1.length) {
			var childNode = _g1[_g];
			++_g;
			this.nodes.push(childNode);
		}
	}
	this.q = this.getQuery();
};
$hxClasses["qoid.model.Filter"] = qoid.model.Filter;
qoid.model.Filter.__name__ = ["qoid","model","Filter"];
qoid.model.Filter.prototype = {
	getQuery: function() {
		return this._queryify(this.nodes,this.rootNode.getQuery());
	}
	,_queryify: function(nodes,joinWith) {
		var str = "";
		if(m3.helper.ArrayHelper.hasValues(nodes)) {
			str += "(";
			var iteration = 0;
			var _g1 = 0;
			var _g = nodes.length;
			while(_g1 < _g) {
				var ln_ = _g1++;
				if(iteration++ > 0) str += joinWith;
				str += nodes[ln_].getQuery();
				if(nodes[ln_].hasChildren()) str += this._queryify(nodes[ln_].nodes,nodes[ln_].getQuery());
			}
			str += ")";
		}
		return str;
	}
	,__class__: qoid.model.Filter
};
qoid.model.FilterData = function(type) {
	this.type = type;
	this.aliasIid = null;
	this.connectionIids = new Array();
};
$hxClasses["qoid.model.FilterData"] = qoid.model.FilterData;
qoid.model.FilterData.__name__ = ["qoid","model","FilterData"];
qoid.model.FilterData.prototype = {
	__class__: qoid.model.FilterData
};
qoid.model.FilterResponse = function(filterIid,content) {
	this.filterIid = filterIid;
	this.content = content;
};
$hxClasses["qoid.model.FilterResponse"] = qoid.model.FilterResponse;
qoid.model.FilterResponse.__name__ = ["qoid","model","FilterResponse"];
qoid.model.FilterResponse.prototype = {
	__class__: qoid.model.FilterResponse
};
qoid.model.LabelChild = function(parentIid,childIid) {
	if(parentIid != null && childIid != null && parentIid == childIid) throw new m3.exception.Exception("parentIid and childIid of LabelChild must be different");
	qoid.model.ModelObjWithIid.call(this);
	this.parentIid = parentIid;
	this.childIid = childIid;
};
$hxClasses["qoid.model.LabelChild"] = qoid.model.LabelChild;
qoid.model.LabelChild.__name__ = ["qoid","model","LabelChild"];
qoid.model.LabelChild.identifier = function(l) {
	return l.iid;
};
qoid.model.LabelChild.__super__ = qoid.model.ModelObjWithIid;
qoid.model.LabelChild.prototype = $extend(qoid.model.ModelObjWithIid.prototype,{
	__class__: qoid.model.LabelChild
});
qoid.model.LabelAcl = function(connectionIid,labelIid) {
	qoid.model.ModelObjWithIid.call(this);
	this.connectionIid = connectionIid;
	this.labelIid = labelIid;
};
$hxClasses["qoid.model.LabelAcl"] = qoid.model.LabelAcl;
qoid.model.LabelAcl.__name__ = ["qoid","model","LabelAcl"];
qoid.model.LabelAcl.identifier = function(l) {
	return l.iid;
};
qoid.model.LabelAcl.__super__ = qoid.model.ModelObjWithIid;
qoid.model.LabelAcl.prototype = $extend(qoid.model.ModelObjWithIid.prototype,{
	__class__: qoid.model.LabelAcl
});
qoid.model.Connection = function() {
	qoid.model.ModelObjWithIid.call(this);
	this.data = new qoid.model.Profile("-->*<--","");
};
$hxClasses["qoid.model.Connection"] = qoid.model.Connection;
qoid.model.Connection.__name__ = ["qoid","model","Connection"];
qoid.model.Connection.identifier = function(c) {
	return c.iid;
};
qoid.model.Connection.__super__ = qoid.model.ModelObjWithIid;
qoid.model.Connection.prototype = $extend(qoid.model.ModelObjWithIid.prototype,{
	equals: function(c) {
		return this.iid == c.iid;
	}
	,__class__: qoid.model.Connection
});
qoid.model.ContentType = function() { };
$hxClasses["qoid.model.ContentType"] = qoid.model.ContentType;
qoid.model.ContentType.__name__ = ["qoid","model","ContentType"];
qoid.model.ContentHandler = function() {
};
$hxClasses["qoid.model.ContentHandler"] = qoid.model.ContentHandler;
qoid.model.ContentHandler.__name__ = ["qoid","model","ContentHandler"];
qoid.model.ContentHandler.__interfaces__ = [m3.serialization.TypeHandler];
qoid.model.ContentHandler.prototype = {
	read: function(fromJson,reader,instance) {
		var obj = null;
		var _g = fromJson.contentType;
		switch(_g) {
		case qoid.model.ContentType.AUDIO:
			obj = pagent.AppContext.SERIALIZER.fromJsonX(fromJson,qoid.model.AudioContent);
			break;
		case qoid.model.ContentType.IMAGE:
			obj = pagent.AppContext.SERIALIZER.fromJsonX(fromJson,qoid.model.ImageContent);
			break;
		case qoid.model.ContentType.TEXT:
			obj = pagent.AppContext.SERIALIZER.fromJsonX(fromJson,qoid.model.MessageContent);
			break;
		case qoid.model.ContentType.URL:
			obj = pagent.AppContext.SERIALIZER.fromJsonX(fromJson,qoid.model.UrlContent);
			break;
		case qoid.model.ContentType.VERIFICATION:
			obj = pagent.AppContext.SERIALIZER.fromJsonX(fromJson,qoid.model.VerificationContent);
			break;
		}
		return obj;
	}
	,write: function(value,writer) {
		return pagent.AppContext.SERIALIZER.toJson(value);
	}
	,__class__: qoid.model.ContentHandler
};
qoid.model.ContentFactory = function() { };
$hxClasses["qoid.model.ContentFactory"] = qoid.model.ContentFactory;
qoid.model.ContentFactory.__name__ = ["qoid","model","ContentFactory"];
qoid.model.ContentFactory.create = function(contentType,data) {
	var ret = null;
	switch(contentType) {
	case qoid.model.ContentType.AUDIO:
		var ac = new qoid.model.AudioContent();
		ac.props.audioSrc = js.Boot.__cast(data , String);
		ret = ac;
		break;
	case qoid.model.ContentType.IMAGE:
		var ic = new qoid.model.ImageContent();
		ic.props.imgSrc = js.Boot.__cast(data , String);
		ret = ic;
		break;
	case qoid.model.ContentType.TEXT:
		var mc = new qoid.model.MessageContent();
		mc.props.text = js.Boot.__cast(data , String);
		ret = mc;
		break;
	case qoid.model.ContentType.URL:
		var uc = new qoid.model.UrlContent();
		uc.props.url = js.Boot.__cast(data , String);
		ret = uc;
		break;
	case qoid.model.ContentType.VERIFICATION:
		var uc1 = new qoid.model.VerificationContent();
		uc1.props.text = js.Boot.__cast(data , String);
		ret = uc1;
		break;
	case qoid.model.ContentType.CONFIG:
		var mc1 = new qoid.model.ConfigContent();
		mc1.props.defaultImg = js.Boot.__cast(data , String);
		ret = mc1;
		break;
	}
	return ret;
};
qoid.model.LabeledContent = function(contentIid,labelIid) {
	qoid.model.ModelObjWithIid.call(this);
	this.contentIid = contentIid;
	this.labelIid = labelIid;
};
$hxClasses["qoid.model.LabeledContent"] = qoid.model.LabeledContent;
qoid.model.LabeledContent.__name__ = ["qoid","model","LabeledContent"];
qoid.model.LabeledContent.identifier = function(l) {
	return l.iid;
};
qoid.model.LabeledContent.__super__ = qoid.model.ModelObjWithIid;
qoid.model.LabeledContent.prototype = $extend(qoid.model.ModelObjWithIid.prototype,{
	__class__: qoid.model.LabeledContent
});
qoid.model.ContentData = function() {
};
$hxClasses["qoid.model.ContentData"] = qoid.model.ContentData;
qoid.model.ContentData.__name__ = ["qoid","model","ContentData"];
qoid.model.ContentData.prototype = {
	__class__: qoid.model.ContentData
};
qoid.model.ContentVerification = function() { };
$hxClasses["qoid.model.ContentVerification"] = qoid.model.ContentVerification;
qoid.model.ContentVerification.__name__ = ["qoid","model","ContentVerification"];
qoid.model.ContentVerification.prototype = {
	__class__: qoid.model.ContentVerification
};
qoid.model.VerifiedContentMetaData = function() { };
$hxClasses["qoid.model.VerifiedContentMetaData"] = qoid.model.VerifiedContentMetaData;
qoid.model.VerifiedContentMetaData.__name__ = ["qoid","model","VerifiedContentMetaData"];
qoid.model.VerifiedContentMetaData.prototype = {
	__class__: qoid.model.VerifiedContentMetaData
};
qoid.model.ContentMetaData = function() {
	this.verifications = new Array();
};
$hxClasses["qoid.model.ContentMetaData"] = qoid.model.ContentMetaData;
qoid.model.ContentMetaData.__name__ = ["qoid","model","ContentMetaData"];
qoid.model.ContentMetaData.prototype = {
	__class__: qoid.model.ContentMetaData
};
qoid.model.Content = function(contentType,type) {
	qoid.model.ModelObjWithIid.call(this);
	this.contentType = contentType;
	if(pagent.AppContext.currentAlias == null) this.aliasIid = null; else this.aliasIid = pagent.AppContext.currentAlias.iid;
	this.data = { };
	this.type = type;
	this.props = Type.createInstance(type,[]);
	this.metaData = new qoid.model.ContentMetaData();
};
$hxClasses["qoid.model.Content"] = qoid.model.Content;
qoid.model.Content.__name__ = ["qoid","model","Content"];
qoid.model.Content.__super__ = qoid.model.ModelObjWithIid;
qoid.model.Content.prototype = $extend(qoid.model.ModelObjWithIid.prototype,{
	setData: function(data) {
		this.data = data;
	}
	,readResolve: function() {
		this.props = pagent.AppContext.SERIALIZER.fromJsonX(this.data,this.type);
	}
	,writeResolve: function() {
		this.data = pagent.AppContext.SERIALIZER.toJson(this.props);
	}
	,getTimestamp: function() {
		return DateTools.format(this.created,"%Y-%m-%d %T");
	}
	,objectType: function() {
		return "content";
	}
	,__class__: qoid.model.Content
});
qoid.model.ImageContentData = function() {
	qoid.model.ContentData.call(this);
};
$hxClasses["qoid.model.ImageContentData"] = qoid.model.ImageContentData;
qoid.model.ImageContentData.__name__ = ["qoid","model","ImageContentData"];
qoid.model.ImageContentData.__super__ = qoid.model.ContentData;
qoid.model.ImageContentData.prototype = $extend(qoid.model.ContentData.prototype,{
	__class__: qoid.model.ImageContentData
});
qoid.model.ImageContent = function() {
	qoid.model.Content.call(this,qoid.model.ContentType.IMAGE,qoid.model.ImageContentData);
};
$hxClasses["qoid.model.ImageContent"] = qoid.model.ImageContent;
qoid.model.ImageContent.__name__ = ["qoid","model","ImageContent"];
qoid.model.ImageContent.__super__ = qoid.model.Content;
qoid.model.ImageContent.prototype = $extend(qoid.model.Content.prototype,{
	__class__: qoid.model.ImageContent
});
qoid.model.AudioContentData = function() {
	qoid.model.ContentData.call(this);
};
$hxClasses["qoid.model.AudioContentData"] = qoid.model.AudioContentData;
qoid.model.AudioContentData.__name__ = ["qoid","model","AudioContentData"];
qoid.model.AudioContentData.__super__ = qoid.model.ContentData;
qoid.model.AudioContentData.prototype = $extend(qoid.model.ContentData.prototype,{
	__class__: qoid.model.AudioContentData
});
qoid.model.AudioContent = function() {
	qoid.model.Content.call(this,qoid.model.ContentType.AUDIO,qoid.model.AudioContentData);
};
$hxClasses["qoid.model.AudioContent"] = qoid.model.AudioContent;
qoid.model.AudioContent.__name__ = ["qoid","model","AudioContent"];
qoid.model.AudioContent.__super__ = qoid.model.Content;
qoid.model.AudioContent.prototype = $extend(qoid.model.Content.prototype,{
	__class__: qoid.model.AudioContent
});
qoid.model.MessageContentData = function() {
	qoid.model.ContentData.call(this);
};
$hxClasses["qoid.model.MessageContentData"] = qoid.model.MessageContentData;
qoid.model.MessageContentData.__name__ = ["qoid","model","MessageContentData"];
qoid.model.MessageContentData.__super__ = qoid.model.ContentData;
qoid.model.MessageContentData.prototype = $extend(qoid.model.ContentData.prototype,{
	__class__: qoid.model.MessageContentData
});
qoid.model.MessageContent = function() {
	qoid.model.Content.call(this,qoid.model.ContentType.TEXT,qoid.model.MessageContentData);
};
$hxClasses["qoid.model.MessageContent"] = qoid.model.MessageContent;
qoid.model.MessageContent.__name__ = ["qoid","model","MessageContent"];
qoid.model.MessageContent.__super__ = qoid.model.Content;
qoid.model.MessageContent.prototype = $extend(qoid.model.Content.prototype,{
	__class__: qoid.model.MessageContent
});
qoid.model.ConfigContentData = function() {
	qoid.model.ContentData.call(this);
};
$hxClasses["qoid.model.ConfigContentData"] = qoid.model.ConfigContentData;
qoid.model.ConfigContentData.__name__ = ["qoid","model","ConfigContentData"];
qoid.model.ConfigContentData.__super__ = qoid.model.ContentData;
qoid.model.ConfigContentData.prototype = $extend(qoid.model.ContentData.prototype,{
	__class__: qoid.model.ConfigContentData
});
qoid.model.ConfigContent = function() {
	qoid.model.Content.call(this,qoid.model.ContentType.CONFIG,qoid.model.ConfigContentData);
};
$hxClasses["qoid.model.ConfigContent"] = qoid.model.ConfigContent;
qoid.model.ConfigContent.__name__ = ["qoid","model","ConfigContent"];
qoid.model.ConfigContent.__super__ = qoid.model.Content;
qoid.model.ConfigContent.prototype = $extend(qoid.model.Content.prototype,{
	__class__: qoid.model.ConfigContent
});
qoid.model.UrlContentData = function() {
	qoid.model.ContentData.call(this);
};
$hxClasses["qoid.model.UrlContentData"] = qoid.model.UrlContentData;
qoid.model.UrlContentData.__name__ = ["qoid","model","UrlContentData"];
qoid.model.UrlContentData.__super__ = qoid.model.ContentData;
qoid.model.UrlContentData.prototype = $extend(qoid.model.ContentData.prototype,{
	__class__: qoid.model.UrlContentData
});
qoid.model.UrlContent = function() {
	qoid.model.Content.call(this,qoid.model.ContentType.URL,qoid.model.UrlContentData);
};
$hxClasses["qoid.model.UrlContent"] = qoid.model.UrlContent;
qoid.model.UrlContent.__name__ = ["qoid","model","UrlContent"];
qoid.model.UrlContent.__super__ = qoid.model.Content;
qoid.model.UrlContent.prototype = $extend(qoid.model.Content.prototype,{
	__class__: qoid.model.UrlContent
});
qoid.model.VerificationContentData = function() {
	qoid.model.ContentData.call(this);
};
$hxClasses["qoid.model.VerificationContentData"] = qoid.model.VerificationContentData;
qoid.model.VerificationContentData.__name__ = ["qoid","model","VerificationContentData"];
qoid.model.VerificationContentData.__super__ = qoid.model.ContentData;
qoid.model.VerificationContentData.prototype = $extend(qoid.model.ContentData.prototype,{
	__class__: qoid.model.VerificationContentData
});
qoid.model.VerificationContent = function() {
	qoid.model.Content.call(this,qoid.model.ContentType.VERIFICATION,qoid.model.VerificationContentData);
};
$hxClasses["qoid.model.VerificationContent"] = qoid.model.VerificationContent;
qoid.model.VerificationContent.__name__ = ["qoid","model","VerificationContent"];
qoid.model.VerificationContent.__super__ = qoid.model.Content;
qoid.model.VerificationContent.prototype = $extend(qoid.model.Content.prototype,{
	__class__: qoid.model.VerificationContent
});
qoid.model.NotificationHandler = function() {
};
$hxClasses["qoid.model.NotificationHandler"] = qoid.model.NotificationHandler;
qoid.model.NotificationHandler.__name__ = ["qoid","model","NotificationHandler"];
qoid.model.NotificationHandler.__interfaces__ = [m3.serialization.TypeHandler];
qoid.model.NotificationHandler.prototype = {
	read: function(fromJson,reader,instance) {
		var obj = null;
		var _g = Type.createEnum(qoid.model.NotificationKind,fromJson.kind,null);
		switch(_g[1]) {
		case 0:
			obj = pagent.AppContext.SERIALIZER.fromJsonX(fromJson,qoid.model.IntroductionRequestNotification);
			break;
		case 1:
			obj = pagent.AppContext.SERIALIZER.fromJsonX(fromJson,qoid.model.VerificationRequestNotification);
			break;
		case 2:
			obj = pagent.AppContext.SERIALIZER.fromJsonX(fromJson,qoid.model.VerificationResponseNotification);
			break;
		}
		return obj;
	}
	,write: function(value,writer) {
		return pagent.AppContext.SERIALIZER.toJson(value);
	}
	,__class__: qoid.model.NotificationHandler
};
qoid.model.NotificationKind = $hxClasses["qoid.model.NotificationKind"] = { __ename__ : ["qoid","model","NotificationKind"], __constructs__ : ["IntroductionRequest","VerificationRequest","VerificationResponse"] };
qoid.model.NotificationKind.IntroductionRequest = ["IntroductionRequest",0];
qoid.model.NotificationKind.IntroductionRequest.__enum__ = qoid.model.NotificationKind;
qoid.model.NotificationKind.VerificationRequest = ["VerificationRequest",1];
qoid.model.NotificationKind.VerificationRequest.__enum__ = qoid.model.NotificationKind;
qoid.model.NotificationKind.VerificationResponse = ["VerificationResponse",2];
qoid.model.NotificationKind.VerificationResponse.__enum__ = qoid.model.NotificationKind;
qoid.model.NotificationKind.__empty_constructs__ = [qoid.model.NotificationKind.IntroductionRequest,qoid.model.NotificationKind.VerificationRequest,qoid.model.NotificationKind.VerificationResponse];
qoid.model.Notification = function(kind,type) {
	qoid.model.ModelObjWithIid.call(this);
	this.kind = kind;
	this.data = { };
	this.type = type;
	this.props = Type.createInstance(type,[]);
};
$hxClasses["qoid.model.Notification"] = qoid.model.Notification;
qoid.model.Notification.__name__ = ["qoid","model","Notification"];
qoid.model.Notification.__super__ = qoid.model.ModelObjWithIid;
qoid.model.Notification.prototype = $extend(qoid.model.ModelObjWithIid.prototype,{
	objectType: function() {
		return "notification";
	}
	,readResolve: function() {
		this.props = pagent.AppContext.SERIALIZER.fromJsonX(this.data,this.type);
	}
	,writeResolve: function() {
		this.data = pagent.AppContext.SERIALIZER.toJson(this.props);
	}
	,__class__: qoid.model.Notification
});
qoid.model.IntroductionState = $hxClasses["qoid.model.IntroductionState"] = { __ename__ : ["qoid","model","IntroductionState"], __constructs__ : ["NotResponded","Accepted","Rejected"] };
qoid.model.IntroductionState.NotResponded = ["NotResponded",0];
qoid.model.IntroductionState.NotResponded.__enum__ = qoid.model.IntroductionState;
qoid.model.IntroductionState.Accepted = ["Accepted",1];
qoid.model.IntroductionState.Accepted.__enum__ = qoid.model.IntroductionState;
qoid.model.IntroductionState.Rejected = ["Rejected",2];
qoid.model.IntroductionState.Rejected.__enum__ = qoid.model.IntroductionState;
qoid.model.IntroductionState.__empty_constructs__ = [qoid.model.IntroductionState.NotResponded,qoid.model.IntroductionState.Accepted,qoid.model.IntroductionState.Rejected];
qoid.model.IntroductionRequest = function() {
	qoid.model.ModelObjWithIid.call(this);
};
$hxClasses["qoid.model.IntroductionRequest"] = qoid.model.IntroductionRequest;
qoid.model.IntroductionRequest.__name__ = ["qoid","model","IntroductionRequest"];
qoid.model.IntroductionRequest.__super__ = qoid.model.ModelObjWithIid;
qoid.model.IntroductionRequest.prototype = $extend(qoid.model.ModelObjWithIid.prototype,{
	__class__: qoid.model.IntroductionRequest
});
qoid.model.Introduction = function() {
	qoid.model.ModelObjWithIid.call(this);
};
$hxClasses["qoid.model.Introduction"] = qoid.model.Introduction;
qoid.model.Introduction.__name__ = ["qoid","model","Introduction"];
qoid.model.Introduction.__super__ = qoid.model.ModelObjWithIid;
qoid.model.Introduction.prototype = $extend(qoid.model.ModelObjWithIid.prototype,{
	__class__: qoid.model.Introduction
});
qoid.model.IntroductionRequestNotification = function() {
	qoid.model.Notification.call(this,qoid.model.NotificationKind.IntroductionRequest,qoid.model.IntroductionRequestData);
};
$hxClasses["qoid.model.IntroductionRequestNotification"] = qoid.model.IntroductionRequestNotification;
qoid.model.IntroductionRequestNotification.__name__ = ["qoid","model","IntroductionRequestNotification"];
qoid.model.IntroductionRequestNotification.__super__ = qoid.model.Notification;
qoid.model.IntroductionRequestNotification.prototype = $extend(qoid.model.Notification.prototype,{
	__class__: qoid.model.IntroductionRequestNotification
});
qoid.model.IntroductionRequestData = function() { };
$hxClasses["qoid.model.IntroductionRequestData"] = qoid.model.IntroductionRequestData;
qoid.model.IntroductionRequestData.__name__ = ["qoid","model","IntroductionRequestData"];
qoid.model.IntroductionRequestData.prototype = {
	__class__: qoid.model.IntroductionRequestData
};
qoid.model.VerificationRequestNotification = function() {
	qoid.model.Notification.call(this,qoid.model.NotificationKind.VerificationRequest,qoid.model.VerificationRequestData);
};
$hxClasses["qoid.model.VerificationRequestNotification"] = qoid.model.VerificationRequestNotification;
qoid.model.VerificationRequestNotification.__name__ = ["qoid","model","VerificationRequestNotification"];
qoid.model.VerificationRequestNotification.__super__ = qoid.model.Notification;
qoid.model.VerificationRequestNotification.prototype = $extend(qoid.model.Notification.prototype,{
	__class__: qoid.model.VerificationRequestNotification
});
qoid.model.VerificationRequestData = function() { };
$hxClasses["qoid.model.VerificationRequestData"] = qoid.model.VerificationRequestData;
qoid.model.VerificationRequestData.__name__ = ["qoid","model","VerificationRequestData"];
qoid.model.VerificationRequestData.prototype = {
	getContent: function() {
		try {
			var fromJson = { iid : this.contentIid, contentType : Std.string(this.contentType), data : this.contentData, created : (function($this) {
				var $r;
				var _this = new Date();
				$r = HxOverrides.dateStr(_this);
				return $r;
			}(this)), modified : (function($this) {
				var $r;
				var _this1 = new Date();
				$r = HxOverrides.dateStr(_this1);
				return $r;
			}(this)), createdByAliasIid : "Chewbaca", modifiedByAliasIid : "PizzaTheHut"};
			return pagent.AppContext.SERIALIZER.fromJsonX(fromJson,qoid.model.Content);
		} catch( e ) {
			pagent.AppContext.LOGGER.error(e);
			throw e;
		}
	}
	,__class__: qoid.model.VerificationRequestData
};
qoid.model.VerificationResponseNotification = function() {
	qoid.model.Notification.call(this,qoid.model.NotificationKind.VerificationResponse,qoid.model.VerificationResponseData);
};
$hxClasses["qoid.model.VerificationResponseNotification"] = qoid.model.VerificationResponseNotification;
qoid.model.VerificationResponseNotification.__name__ = ["qoid","model","VerificationResponseNotification"];
qoid.model.VerificationResponseNotification.__super__ = qoid.model.Notification;
qoid.model.VerificationResponseNotification.prototype = $extend(qoid.model.Notification.prototype,{
	__class__: qoid.model.VerificationResponseNotification
});
qoid.model.VerificationResponseData = function() { };
$hxClasses["qoid.model.VerificationResponseData"] = qoid.model.VerificationResponseData;
qoid.model.VerificationResponseData.__name__ = ["qoid","model","VerificationResponseData"];
qoid.model.VerificationResponseData.prototype = {
	__class__: qoid.model.VerificationResponseData
};
qoid.model.Login = function() {
	qoid.model.ModelObj.call(this);
};
$hxClasses["qoid.model.Login"] = qoid.model.Login;
qoid.model.Login.__name__ = ["qoid","model","Login"];
qoid.model.Login.__super__ = qoid.model.ModelObj;
qoid.model.Login.prototype = $extend(qoid.model.ModelObj.prototype,{
	__class__: qoid.model.Login
});
qoid.model.NewUser = function() {
	qoid.model.ModelObj.call(this);
};
$hxClasses["qoid.model.NewUser"] = qoid.model.NewUser;
qoid.model.NewUser.__name__ = ["qoid","model","NewUser"];
qoid.model.NewUser.__super__ = qoid.model.ModelObj;
qoid.model.NewUser.prototype = $extend(qoid.model.ModelObj.prototype,{
	__class__: qoid.model.NewUser
});
qoid.model.EditContentData = function(content,labelIids) {
	this.content = content;
	if(labelIids == null) labelIids = new Array();
	this.labelIids = labelIids;
};
$hxClasses["qoid.model.EditContentData"] = qoid.model.EditContentData;
qoid.model.EditContentData.__name__ = ["qoid","model","EditContentData"];
qoid.model.EditContentData.prototype = {
	__class__: qoid.model.EditContentData
};
qoid.model.VerificationRequest = function(contentIid,connectionIids,message) {
	this.message = message;
	this.contentIid = contentIid;
	this.connectionIids = connectionIids;
};
$hxClasses["qoid.model.VerificationRequest"] = qoid.model.VerificationRequest;
qoid.model.VerificationRequest.__name__ = ["qoid","model","VerificationRequest"];
qoid.model.VerificationRequest.prototype = {
	__class__: qoid.model.VerificationRequest
};
qoid.model.VerificationResponse = function(notificationIid,verificationContent) {
	this.notificationIid = notificationIid;
	this.verificationContent = verificationContent;
};
$hxClasses["qoid.model.VerificationResponse"] = qoid.model.VerificationResponse;
qoid.model.VerificationResponse.__name__ = ["qoid","model","VerificationResponse"];
qoid.model.VerificationResponse.prototype = {
	__class__: qoid.model.VerificationResponse
};
qoid.model.Verification = function() { };
$hxClasses["qoid.model.Verification"] = qoid.model.Verification;
qoid.model.Verification.__name__ = ["qoid","model","Verification"];
qoid.model.Verification.prototype = {
	__class__: qoid.model.Verification
};
qoid.model.And = function() {
	qoid.model.Node.call(this,"AND");
	this.nodes = new Array();
};
$hxClasses["qoid.model.And"] = qoid.model.And;
qoid.model.And.__name__ = ["qoid","model","And"];
qoid.model.And.__super__ = qoid.model.Node;
qoid.model.And.prototype = $extend(qoid.model.Node.prototype,{
	getQuery: function() {
		return " AND ";
	}
	,__class__: qoid.model.And
});
qoid.model.Or = function() {
	qoid.model.Node.call(this,"OR");
	this.nodes = new Array();
};
$hxClasses["qoid.model.Or"] = qoid.model.Or;
qoid.model.Or.__name__ = ["qoid","model","Or"];
qoid.model.Or.__super__ = qoid.model.Node;
qoid.model.Or.prototype = $extend(qoid.model.Node.prototype,{
	getQuery: function() {
		return " OR ";
	}
	,__class__: qoid.model.Or
});
qoid.model.ConnectionNode = function(connection) {
	qoid.model.ContentNode.call(this,"CONNECTION",connection);
};
$hxClasses["qoid.model.ConnectionNode"] = qoid.model.ConnectionNode;
qoid.model.ConnectionNode.__name__ = ["qoid","model","ConnectionNode"];
qoid.model.ConnectionNode.__super__ = qoid.model.ContentNode;
qoid.model.ConnectionNode.prototype = $extend(qoid.model.ContentNode.prototype,{
	getQuery: function() {
		return "";
	}
	,__class__: qoid.model.ConnectionNode
});
qoid.widget = {};
qoid.widget.UploadCompHelper = function() { };
$hxClasses["qoid.widget.UploadCompHelper"] = qoid.widget.UploadCompHelper;
qoid.widget.UploadCompHelper.__name__ = ["qoid","widget","UploadCompHelper"];
qoid.widget.UploadCompHelper.value = function(m) {
	return m.uploadComp("value");
};
qoid.widget.UploadCompHelper.clear = function(m) {
	m.uploadComp("clear");
};
qoid.widget.UploadCompHelper.setPreviewImage = function(m,src) {
	m.uploadComp("setPreviewImage",src);
};
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; }
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
$hxClasses.Math = Math;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i1) {
	return isNaN(i1);
};
String.prototype.__class__ = $hxClasses.String = String;
String.__name__ = ["String"];
$hxClasses.Array = Array;
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
if(Array.prototype.map == null) Array.prototype.map = function(f) {
	var a = [];
	var _g1 = 0;
	var _g = this.length;
	while(_g1 < _g) {
		var i = _g1++;
		a[i] = f(this[i]);
	}
	return a;
};
Xml.Element = "element";
Xml.PCData = "pcdata";
Xml.CData = "cdata";
Xml.Comment = "comment";
Xml.DocType = "doctype";
Xml.ProcessingInstruction = "processingInstruction";
Xml.Document = "document";
var q = window.jQuery;
js.JQuery = q;
if(!Array.indexOf){Array.prototype.indexOf = function(obj){for(var i=0; i<this.length; i++){if(this[i]==obj){return i;}}return -1;}}
$.fn.exists = function() {
	return $(this).length > 0;
};
$.fn.isVisible = function() {
	return $(this).css("display") != "none";
};
$.fn.hasAttr = function(name) {
	return $(this).attr(name) != undefined;
};
$.fn.intersects = function(el) {
	var tAxis = $(this).offset();
	var t_x_0 = tAxis.left;
	var t_x_1 = tAxis.left + $(this).outerWidth();
	var t_y_0 = tAxis.top;
	var t_y_1 = tAxis.top + $(this).outerHeight();
	var thisPos = el.offset();
	var i_x_0 = thisPos.left;
	var i_x_1 = thisPos.left + el.outerWidth();
	var i_y_0 = thisPos.top;
	var i_y_1 = thisPos.top + el.outerHeight();
	var intersects = false;
	if(t_x_0 < i_x_1 && t_x_1 > i_x_0 && t_y_0 < i_y_1 && t_y_1 > i_y_0) intersects = true;
	return intersects;
};
var defineWidget = function() {
	return { options : { autoOpen : true, height : 320, width : 320, modal : true, buttons : { }, showHelp : false, onMaxToggle : $.noop}, originalSize : { width : 10, height : 10}, _create : function() {
		this._super("create");
		var self = this;
		var selfElement = this.element;
		var closeBtn = selfElement.prev().find(".ui-dialog-titlebar-close");
		var hovers = new $("blah");
		if(self.options.showHelp && false) {
			if(!Reflect.isFunction(self.options.buildHelp)) m3.log.Logga.get_DEFAULT().error("Supposed to show help but buildHelp is not a function"); else {
				var helpIconWrapper = new $("<a href='#' class='ui-dialog-titlebar-close ui-corner-all' style='margin-right: 18px;' role='button'>");
				var helpIcon = new $("<span class='ui-icon ui-icon-help'>help</span>");
				hovers = hovers.add(helpIconWrapper);
				helpIconWrapper.append(helpIcon);
				closeBtn.before(helpIconWrapper);
				helpIconWrapper.click(function(evt) {
					self.options.buildHelp();
				});
			}
		}
		if(self.options.showMaximizer) {
			self.maxIconWrapper = new $("<a href='#' class='ui-dialog-titlebar-close ui-corner-all' style='margin-right: 18px;' role='button'>");
			var maxIcon = new $("<span class='ui-icon ui-icon-extlink'>maximize</span>");
			hovers = hovers.add(self.maxIconWrapper);
			self.maxIconWrapper.append(maxIcon);
			closeBtn.before(self.maxIconWrapper);
			self.maxIconWrapper.click(function(evt1) {
				self.maximize();
			});
		}
		self.restoreIconWrapper = new $("<a href='#' class='ui-dialog-titlebar-close ui-corner-all' style='margin-right: 18px; display: none;' role='button'>");
		var restoreIcon = new $("<span class='ui-icon ui-icon-newwin'>restore</span>");
		hovers = hovers.add(self.restoreIconWrapper);
		self.restoreIconWrapper.append(restoreIcon);
		closeBtn.before(self.restoreIconWrapper);
		self.restoreIconWrapper.click(function(evt2) {
			self.restore();
		});
		hovers.hover(function(evt3) {
			$(this).addClass("ui-state-hover");
		},function(evt4) {
			$(this).removeClass("ui-state-hover");
		});
	}, restore : function() {
		var self1 = this;
		var selfElement1 = this.element;
		selfElement1.m3dialog("option","height",self1.originalSize.height);
		selfElement1.m3dialog("option","width",self1.originalSize.width);
		selfElement1.parent().position({ my : "middle", at : "middle", of : window});
		self1.restoreIconWrapper.hide();
		self1.maxIconWrapper.show();
		self1.options.onMaxToggle();
	}, maximize : function() {
		var self2 = this;
		var selfElement2 = this.element;
		self2.originalSize = { height : selfElement2.parent().height(), width : selfElement2.parent().width()};
		var $window = new $(window);
		var windowDimensions_height = $window.height();
		var windowDimensions_width = $window.width();
		selfElement2.m3dialog("option","height",windowDimensions_height * .85);
		selfElement2.m3dialog("option","width",windowDimensions_width * .85);
		selfElement2.parent().position({ my : "middle", at : "middle", of : $window});
		self2.maxIconWrapper.hide();
		self2.restoreIconWrapper.show();
		self2.options.onMaxToggle();
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.m3dialog",$.ui.dialog,defineWidget());
var defineWidget = function() {
	return { options : { menuOptions : null, width : 200, classes : ""}, _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("ul")) throw new m3.exception.Exception("Root of M3Menu should be a ul");
		selfElement.css("position","absolute");
		selfElement.addClass("m3menu nonmodalPopup");
		if(m3.helper.StringHelper.isNotBlank(self.options.classes)) selfElement.addClass(self.options.classes);
		selfElement.width(self.options.width);
		var _g = 0;
		var _g1 = self.options.menuOptions;
		while(_g < _g1.length) {
			var menuOption = [_g1[_g]];
			++_g;
			var icon;
			if(m3.helper.StringHelper.isNotBlank(menuOption[0].icon)) icon = "<span class='ui-icon " + menuOption[0].icon + "'></span>"; else icon = "";
			new $("<li><a href='#'>" + icon + menuOption[0].label + "</a></li>").appendTo(selfElement).click((function(menuOption) {
				return function(evt) {
					menuOption[0].action(evt,selfElement);
				};
			})(menuOption));
		}
		selfElement.on("contextmenu",function(evt1) {
			return false;
		});
		this._super("create");
	}, _closeOnDocumentClick : function(evt2) {
		return true;
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.m3menu",$.ui.menu,defineWidget());
m3.util.ColorProvider._COLORS = new Array();
m3.util.ColorProvider._COLORS.push("#5C9BCC");
m3.util.ColorProvider._COLORS.push("#CC5C64");
m3.util.ColorProvider._COLORS.push("#5CCC8C");
m3.util.ColorProvider._COLORS.push("#5C64CC");
m3.util.ColorProvider._COLORS.push("#8C5CCC");
m3.util.ColorProvider._COLORS.push("#C45CCC");
m3.util.ColorProvider._COLORS.push("#5CCCC4");
m3.util.ColorProvider._COLORS.push("#8BB8DA");
m3.util.ColorProvider._COLORS.push("#B9D4E9");
m3.util.ColorProvider._COLORS.push("#CC5C9B");
m3.util.ColorProvider._COLORS.push("#E9CEB9");
m3.util.ColorProvider._COLORS.push("#DAAD8B");
m3.util.ColorProvider._COLORS.push("#64CC5C");
m3.util.ColorProvider._COLORS.push("#9BCC5C");
m3.util.ColorProvider._COLORS.push("#CCC45C");
m3.util.ColorProvider._COLORS.push("#CC8C5C");
m3.util.ColorProvider._LAST_COLORS_USED = new m3.util.FixedSizeArray(10);
pagent.model.EM.delegate = new m3.event.EventManager();
var defineWidget = function() {
	return { options : { isDragByHelper : true, containment : false, dndEnabled : true, classes : null, dragstop : null, cloneFcn : function(filterableComp,isDragByHelper,containment,dragstop) {
		if(containment == null) containment = false;
		if(isDragByHelper == null) isDragByHelper = false;
		var connectionAvatar;
		connectionAvatar = js.Boot.__cast(filterableComp , $);
		if(connectionAvatar.hasClass("clone")) return connectionAvatar;
		var clone = new $("<div class='clone'></div>");
		clone.connectionAvatar({ connectionIid : connectionAvatar.connectionAvatar("option","connectionIid"), aliasIid : connectionAvatar.connectionAvatar("option","aliasIid"), isDragByHelper : isDragByHelper, containment : containment, dragstop : dragstop, classes : connectionAvatar.connectionAvatar("option","classes"), cloneFcn : connectionAvatar.connectionAvatar("option","cloneFcn"), dropTargetClass : connectionAvatar.connectionAvatar("option","dropTargetClass"), helperFcn : connectionAvatar.connectionAvatar("option","helperFcn")});
		return clone;
	}, dropTargetClass : "connectionDT", helperFcn : function() {
		var clone1 = $(this).clone();
		return clone1.children("img").addClass("connectionDraggingImg");
	}}, getAlias : function() {
		var self = this;
		return m3.helper.OSetHelper.getElement(pagent.AppContext.ALIASES,self.options.aliasIid);
	}, _create : function() {
		var self1 = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of ConnectionAvatar must be a div element");
		var id;
		id = "connavatar_" + (self1.options.aliasIid == null?self1.options.connectionIid:self1.options.aliasIid);
		selfElement.attr("id",id);
		selfElement.addClass(m3.widget.Widgets.getWidgetClasses() + " connectionAvatar filterable");
		if(self1.options.aliasIid != null) selfElement.addClass("aliasAvatar");
		var img = new $("<img class=''/>");
		selfElement.append(img);
		self1._updateWidgets(new qoid.model.Profile());
		if(self1.options.aliasIid != null) {
			self1.filteredSetAlias = new m3.observable.FilteredSet(pagent.AppContext.ALIASES,function(a) {
				return a.iid == self1.options.aliasIid;
			});
			self1._onUpdateAlias = function(a1,evt) {
				if(evt.isAddOrUpdate()) self1._updateWidgets(a1.profile); else if(evt.isDelete()) {
					self1.destroy();
					selfElement.remove();
				}
			};
			self1.filteredSetAlias.listen(self1._onUpdateAlias);
		} else pagent.AppContext.LOGGER.warn("AliasIid is not set for Avatar");
		(js.Boot.__cast(selfElement , $)).tooltip();
		if(!self1.options.dndEnabled) img.mousedown(function(evt1) {
			return false;;
		});
	}, _updateWidgets : function(profile) {
		var self2 = this;
		var selfElement1 = this.element;
		var imgSrc = "media/default_avatar.jpg";
		if(m3.helper.StringHelper.isNotBlank((function($this) {
			var $r;
			try {
				$r = profile.imgSrc;
			} catch( __e ) {
				$r = "";
			}
			return $r;
		}(this)))) imgSrc = profile.imgSrc;
		selfElement1.children("img").attr("src",imgSrc);
		selfElement1.attr("title",(function($this) {
			var $r;
			try {
				$r = profile.name;
			} catch( __e1 ) {
				$r = "";
			}
			return $r;
		}(this)));
	}, destroy : function() {
		var self3 = this;
		if(self3.filteredSetConnection != null) self3.filteredSetConnection.removeListener(self3._onUpdateConnection); else if(self3.filteredSetAlias != null) self3.filteredSetAlias.removeListener(self3._onUpdateAlias);
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.connectionAvatar",defineWidget());
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of AliasComp must be a div element");
		selfElement.addClass("_aliasComp");
		self.container = new $("<div class=''></div>");
		selfElement.append(self.container);
		self.avatar = new $("<div></div>").appendTo(self.container);
		self.userIdTxt = new $("<div class='userIdTxt'></div>");
		self.container.append(self.userIdTxt);
		self.userIdTxt.html("...");
		self._setAlias(new qoid.model.Alias());
		self.aliasLoadedListener = pagent.model.EM.addListener(pagent.model.EMEvent.AliasLoaded,function(alias) {
			self._setAlias(alias);
		},"AliasComp-Alias");
		self._onupdate = function(alias1,t) {
			if(t.isAddOrUpdate()) self._updateAliasWidgets(alias1); else if(t.isDelete()) {
				self.destroy();
				selfElement.remove();
			}
		};
		self._onupdateProfile = function(p,t1) {
			var alias2 = m3.helper.OSetHelper.getElement(pagent.AppContext.ALIASES,p.aliasIid);
			self._updateAliasWidgets(alias2);
		};
		if(pagent.AppContext.currentAlias != null) self._setAlias(pagent.AppContext.currentAlias);
	}, _createAliasMenu : function() {
		var self1 = this;
		new $("#userAliasMenu").remove();
		var menu = new $("<ul id='userAliasMenu'></ul>");
		menu.appendTo(self1.container);
		var menuOptions = [];
		var menuOption;
		var aliases = new m3.observable.SortedSet(pagent.AppContext.ALIASES,function(a) {
			return a.profile.name.toLowerCase();
		});
		var $it0 = aliases.iterator();
		while( $it0.hasNext() ) {
			var alias3 = $it0.next();
			var alias4 = [alias3];
			menuOption = { label : alias4[0].profile.name, icon : "ui-icon-person", action : (function(alias4) {
				return function(evt,m) {
					if(qoid.model.Alias.identifier(pagent.AppContext.currentAlias) == qoid.model.Alias.identifier(alias4[0])) menu.hide(); else {
						pagent.AppContext.currentAlias = alias4[0];
						pagent.model.EM.change(pagent.model.EMEvent.AliasLoaded,alias4[0]);
					}
				};
			})(alias4)};
			menuOptions.push(menuOption);
		}
		menuOption = { label : "Manage Aliases...", icon : "ui-icon-circle-plus", action : function(evt1,m1) {
			pagent.widget.DialogManager.showAliasManager();
		}};
		menuOptions.push(menuOption);
		menu.m3menu({ menuOptions : menuOptions}).hide();
		return menu;
	}, _updateAliasWidgets : function(alias5) {
		var self2 = this;
		var avatar = new $("<div class='avatar' style=''></div>").connectionAvatar({ aliasIid : alias5.iid, dndEnabled : true, isDragByHelper : true, containment : false});
		self2.avatar.replaceWith(avatar);
		self2.avatar = avatar;
		new $(".userIdTxt").html(alias5.profile.name);
	}, _setAlias : function(alias6) {
		var self3 = this;
		var selfElement1 = this.element;
		self3._updateAliasWidgets(alias6);
		if(self3.aliasSet != null) self3.aliasSet.removeListener(self3._onupdate);
		self3.aliasSet = new m3.observable.FilteredSet(pagent.AppContext.ALIASES,function(a1) {
			return a1.iid == alias6.iid;
		});
		self3.aliasSet.listen(self3._onupdate);
		if(self3.profileSet != null) self3.profileSet.removeListener(self3._onupdateProfile);
		self3.profileSet = new m3.observable.FilteredSet(pagent.AppContext.PROFILES,function(p1) {
			return p1.aliasIid == alias6.iid;
		});
		self3.profileSet.listen(self3._onupdateProfile);
	}, destroy : function() {
		var self4 = this;
		if(self4.aliasSet != null) self4.aliasSet.removeListener(self4._onupdate);
		if(self4.profileSet != null) self4.profileSet.removeListener(self4._onupdateProfile);
		pagent.model.EM.removeListener(pagent.model.EMEvent.AliasLoaded,self4.aliasLoadedListener);
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.aliasComp",defineWidget());
var defineWidget = function() {
	return { options : { labelIid : null, isDragByHelper : true, containment : false, dndEnabled : true, classes : null, dropTargetClass : "labelDT", dragstop : null, cloneFcn : function(filterableComp,isDragByHelper,containment,dragstop) {
		if(containment == null) containment = false;
		if(isDragByHelper == null) isDragByHelper = false;
		var labelComp;
		labelComp = js.Boot.__cast(filterableComp , $);
		if(labelComp.hasClass("clone")) return labelComp;
		var clone = new $("<div class='clone'></div>");
		clone.labelComp({ labelIid : labelComp.labelComp("option","labelIid"), parentIid : labelComp.labelComp("option","parentIid"), labelPath : labelComp.labelComp("option","labelPath"), isDragByHelper : isDragByHelper, containment : containment, dragstop : dragstop, classes : labelComp.labelComp("option","classes"), cloneFcn : labelComp.labelComp("option","cloneFcn"), dropTargetClass : labelComp.labelComp("option","dropTargetClass")});
		return clone;
	}}, getLabel : function() {
		var self = this;
		return self.label;
	}, getLabelPathNames : function() {
		var self1 = this;
		var ret = new Array();
		var _g = 0;
		var _g1 = self1.options.labelPath;
		while(_g < _g1.length) {
			var iid = _g1[_g];
			++_g;
			var label = m3.helper.OSetHelper.getElement(pagent.AppContext.LABELS,iid);
			ret.push(label.name);
		}
		return ret;
	}, _registerListeners : function() {
		var self2 = this;
		var selfElement = this.element;
		self2._onupdate = function(label1,t) {
			if(t.isAddOrUpdate()) {
				self2.label = label1;
				selfElement.find(".labelBody").text(label1.name);
				selfElement.find(".labelTail").css("border-right-color",label1.data.color);
				selfElement.find(".labelBox").css("background",label1.data.color);
			} else if(t.isDelete()) {
				self2.destroy();
				selfElement.remove();
			}
		};
		self2.filteredSet = new m3.observable.FilteredSet(pagent.AppContext.LABELS,function(label2) {
			return label2.iid == self2.options.labelIid;
		});
		self2.filteredSet.listen(self2._onupdate);
	}, _create : function() {
		var self3 = this;
		var selfElement1 = this.element;
		if(!selfElement1["is"]("div")) throw new m3.exception.Exception("Root of LabelComp must be a div element");
		self3.label = m3.helper.OSetHelper.getElement(pagent.AppContext.LABELS,self3.options.labelIid);
		if(self3.label == null) {
			self3.label = new qoid.model.Label("-->*<--");
			self3.label.iid = self3.options.labelIid;
			pagent.AppContext.LABELS.add(self3.label);
		}
		selfElement1.addClass("label labelComp ").attr("id",StringTools.htmlEscape(self3.label.name) + "_" + m3.util.UidGenerator.create(8));
		var labelBox = new $("<div class='labelBox shadowRight'></div>");
		labelBox.css("background",self3.label.data.color);
		var labelBody = new $("<div class='labelBody'></div>");
		var labelText = new $("<div>" + self3.label.name + "</div>");
		labelBody.append(labelText);
		labelBox.append(labelBody);
		selfElement1.append(labelBox).append("<div class='clear'></div>");
		selfElement1.addClass("filterable");
		self3._registerListeners();
		if(self3.options.dndEnabled) {
			selfElement1.data("clone",self3.options.cloneFcn);
			selfElement1.data("dropTargetClass",self3.options.dropTargetClass);
			selfElement1.data("getNode",function() {
				return new qoid.model.LabelNode(self3.label,self3.getLabelPathNames());
			});
			var helper = "clone";
			if(!self3.options.isDragByHelper) helper = "original"; else if(self3.options.helperFcn != null && Reflect.isFunction(self3.options.helperFcn)) helper = self3.options.helperFcn;
			selfElement1.on("dragstop",function(dragstopEvt,_ui) {
				pagent.AppContext.LOGGER.debug("dragstop on label | " + self3.label.name);
				if(self3.options.dragstop != null) self3.options.dragstop(dragstopEvt,_ui);
				new $(window.document).off("keydown keyup");
				_ui.helper.find("#copyIndicator").remove();
			});
			var showOrHideCopyIndicator = function(event,_ui1) {
				var ci = _ui1.helper.find("#copyIndicator");
				if(event.ctrlKey) {
					if(ci.length == 0) new $("<img src='svg/add.svg' id='copyIndicator'/>").appendTo(_ui1.helper); else ci.show();
				} else ci.hide();
			};
			selfElement1.on("dragstart",function(event1,_ui2) {
				new $(window.document).on("keydown keyup",function(event2) {
					showOrHideCopyIndicator(event2,_ui2);
				});
			});
			selfElement1.on("drag",function(event3,_ui3) {
				showOrHideCopyIndicator(event3,_ui3);
			});
			(js.Boot.__cast(selfElement1 , $)).draggable({ containment : self3.options.containment, helper : helper, distance : 10, scroll : false, revertDuration : 200, start : function(evt,_ui4) {
				(js.Boot.__cast(selfElement1 , $)).draggable("option","revert",false);
			}});
			var copyOrMoveLabel = function(event4,_ui5) {
				var labelComp1;
				labelComp1 = js.Boot.__cast(_ui5.draggable , $);
				var eld = new qoid.model.EditLabelData(pagent.widget.LabelCompHelper.getLabel(labelComp1),pagent.widget.LabelCompHelper.parentIid(labelComp1),self3.getLabel().iid);
				if(event4.ctrlKey) pagent.model.EM.change(pagent.model.EMEvent.CopyLabel,eld); else pagent.model.EM.change(pagent.model.EMEvent.MoveLabel,eld);
			};
		}
	}, destroy : function() {
		var self4 = this;
		self4.filteredSet.removeListener(self4._onupdate);
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.labelComp",defineWidget());
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of OptionBar must be a div element");
		selfElement.addClass("_optionBar ui-widget-content ui-corner-all");
		self.boardsBtn = new $("<button>0 Boards</button>").appendTo(selfElement).button();
		new $("<button>New Board...</button>").appendTo(selfElement).button();
		new $("<button>All Pins...</button>").appendTo(selfElement).button();
		new $("<button class='fright'>Followers</button>").appendTo(selfElement).button();
		new $("<button class='fright'>Following</button>").appendTo(selfElement).button();
		if((function($this) {
			var $r;
			var this1 = pagent.AppContext.GROUPED_LABELCHILDREN.delegate();
			$r = this1.get(pagent.PinterContext.get_ROOT_ALBUM().iid);
			return $r;
		}(this)) == null) pagent.AppContext.GROUPED_LABELCHILDREN.addEmptyGroup(pagent.PinterContext.get_ROOT_ALBUM().iid);
		self._onUpdateBoards = function(board,evt) {
			if(evt.isAdd()) {
			} else if(evt.isUpdate()) throw new m3.exception.Exception("this should never happen"); else if(evt.isDelete()) {
			} else if(evt.isClear()) {
			}
		};
		self.boards = new m3.observable.MappedSet((function($this) {
			var $r;
			var this11 = pagent.AppContext.GROUPED_LABELCHILDREN.delegate();
			$r = this11.get(pagent.PinterContext.get_ROOT_ALBUM().iid);
			return $r;
		}(this)),function(labelChild) {
			return m3.helper.OSetHelper.getElementComplex(pagent.AppContext.LABELS,labelChild.childIid);
		});
		self.boards.visualId = "root_map";
		self.boards.listen(self._onUpdateBoards);
	}, destroy : function() {
		var self1 = this;
		if(self1.boards != null) self1.boards.removeListener(self1._onUpdateBoards);
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.optionBar",defineWidget());
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of CreateAgentDialog must be a div element");
		self._cancelled = false;
		selfElement.addClass("createAgentDialog").hide();
		var labels = new $("<div class='fleft'></div>").appendTo(selfElement);
		var inputs = new $("<div class='fleft'></div>").appendTo(selfElement);
		labels.append("<div class='labelDiv'><label id='n_label' for='newu_n'>Name</label></div>");
		labels.append("<div class='labelDiv'><label id='em_label' for='newu_em'>Email</label></div>");
		labels.append("<div class='labelDiv'><label id='pw_label' for='newu_pw'>Password</label></div>");
		self.input_n = new $("<input id='newu_n' style='display: none;' class='ui-corner-all ui-state-active ui-widget-content'>").appendTo(inputs);
		self.placeholder_n = new $("<input id='login_un_f' class='placeholder ui-corner-all ui-widget-content' value='Please enter Name'>").appendTo(inputs);
		inputs.append("<br/>");
		self.input_em = new $("<input id='newu_em' style='display: none;' class='ui-corner-all ui-state-active ui-widget-content'>").appendTo(inputs);
		self.placeholder_em = new $("<input id='login_un_f' class='placeholder ui-corner-all ui-widget-content' value='Please enter Email'>").appendTo(inputs);
		inputs.append("<br/>");
		self.input_pw = new $("<input type='password' id='newu_pw' style='display: none;' class='ui-corner-all ui-state-active ui-widget-content'/>").appendTo(inputs);
		self.placeholder_pw = new $("<input id='login_pw_f' class='placeholder ui-corner-all ui-widget-content' value='Please enter Password'/>").appendTo(inputs);
		inputs.append("<br/>");
		inputs.children("input").keypress(function(evt) {
			if(evt.keyCode == 13) self._createNewUser();
		});
		m3.jq.PlaceHolderUtil.setFocusBehavior(self.input_n,self.placeholder_n);
		m3.jq.PlaceHolderUtil.setFocusBehavior(self.input_pw,self.placeholder_pw);
		m3.jq.PlaceHolderUtil.setFocusBehavior(self.input_em,self.placeholder_em);
	}, initialized : false, _createNewUser : function() {
		var self1 = this;
		var selfElement1 = this.element;
		var valid = true;
		var newUser = new qoid.model.NewUser();
		newUser.name = self1.input_n.val();
		if(m3.helper.StringHelper.isBlank(newUser.name)) {
			self1.placeholder_n.addClass("ui-state-error");
			valid = false;
		}
		if(!valid) return;
		selfElement1.find(".ui-state-error").removeClass("ui-state-error");
		pagent.model.EM.change(pagent.model.EMEvent.CreateAgent,newUser);
		pagent.model.EM.listenOnce(pagent.model.EMEvent.AgentCreated,function(n) {
			selfElement1.dialog("close");
		},"CreateAgentDialog-UserSignup");
	}, _buildDialog : function() {
		var self2 = this;
		var selfElement2 = this.element;
		self2.initialized = true;
		var dlgOptions = { autoOpen : false, title : "Create New Agent", height : 320, width : 400, modal : true, buttons : { 'Create My Agent' : function() {
			self2._registered = true;
			self2._createNewUser();
		}, Cancel : function() {
			self2._cancelled = true;
			$(this).dialog("close");
		}}, close : function(evt1,ui) {
			selfElement2.find(".placeholder").removeClass("ui-state-error");
			pagent.widget.DialogManager.showLogin();
		}};
		selfElement2.dialog(dlgOptions);
	}, open : function() {
		var self3 = this;
		var selfElement3 = this.element;
		self3._cancelled = false;
		if(!self3.initialized) self3._buildDialog();
		selfElement3.children("#n_label").focus();
		self3.input_n.blur();
		selfElement3.dialog("open");
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.createAgentDialog",defineWidget());
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of LoginDialog must be a div element");
		selfElement.addClass("loginDialog").hide();
		var labels = new $("<div class='fleft'></div>").appendTo(selfElement);
		var inputs = new $("<div class='fleft'></div>").appendTo(selfElement);
		labels.append("<div class='labelDiv'><label id='un_label' for='login_un'>Agent Id</label></div>");
		labels.append("<div class='labelDiv'><label for='login_pw'>Password</label></div>");
		self.input_un = new $("<input id='login_un' style='display: none;' class='ui-corner-all ui-state-active ui-widget-content'>").appendTo(inputs);
		self.placeholder_un = new $("<input id='login_un_f' class='placeholder ui-corner-all ui-widget-content' value='Please enter Email'>").appendTo(inputs);
		inputs.append("<br/>");
		self.input_pw = new $("<input type='password' id='login_pw' class='ui-corner-all ui-state-active ui-widget-content'/>").appendTo(inputs);
		self.placeholder_pw = new $("<input id='login_pw_f' style='display: none;' class='placeholder ui-corner-all ui-widget-content' value='Please enter Password'/>").appendTo(inputs);
		self.input_un.val("Isaiah");
		self.input_pw.val("ohyea");
		inputs.children("input").keypress(function(evt) {
			if(evt.keyCode == 13) self._login();
		});
		m3.jq.PlaceHolderUtil.setFocusBehavior(self.input_un,self.placeholder_un);
		m3.jq.PlaceHolderUtil.setFocusBehavior(self.input_pw,self.placeholder_pw);
		pagent.model.EM.addListener(pagent.model.EMEvent.InitialDataLoadComplete,function(n) {
			selfElement.dialog("close");
		},"Login-InitialDataLoadComplete");
	}, initialized : false, _login : function() {
		var self1 = this;
		var selfElement1 = this.element;
		var valid = true;
		var login = new qoid.model.Login();
		login.agentId = self1.input_un.val();
		if(m3.helper.StringHelper.isBlank(login.agentId)) {
			self1.placeholder_un.addClass("ui-state-error");
			valid = false;
		}
		login.password = self1.input_pw.val();
		if(m3.helper.StringHelper.isBlank(login.password)) {
			self1.placeholder_pw.addClass("ui-state-error");
			valid = false;
		}
		if(!valid) return;
		selfElement1.find(".ui-state-error").removeClass("ui-state-error");
		pagent.model.EM.change(pagent.model.EMEvent.UserLogin,login);
	}, _buildDialog : function() {
		var self2 = this;
		var selfElement2 = this.element;
		self2.initialized = true;
		var dlgOptions = { autoOpen : false, title : "Login", height : 280, width : 400, modal : true, buttons : { Login : function() {
			self2._login();
		}, 'I\'m New...' : function() {
			pagent.widget.DialogManager.showCreateAgent();
		}}, beforeClose : function(evt1,ui) {
			if(pagent.AppContext.UBER_ALIAS_ID == null) {
				m3.util.JqueryUtil.alert("A valid login is required to use the app");
				return false;
			}
			return true;
		}};
		selfElement2.dialog(dlgOptions);
	}, open : function() {
		var self3 = this;
		var selfElement3 = this.element;
		if(!self3.initialized) self3._buildDialog();
		selfElement3.children("#un_label").focus();
		self3.input_un.blur();
		self3.input_pw.blur();
		selfElement3.dialog("open");
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.loginDialog",defineWidget());
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of UploadComp must be a div element");
		selfElement.addClass("uploadComp container " + m3.widget.Widgets.getWidgetClasses());
		self._createFileUploadComponent();
		selfElement.on("dragleave",function(evt,d) {
			pagent.AppContext.LOGGER.debug("dragleave");
			var target = evt.target;
			if(target != null && target == selfElement[0]) $(this).removeClass("drop");
			evt.preventDefault();
			evt.stopPropagation();
		});
		selfElement.on("dragenter",function(evt1,d1) {
			pagent.AppContext.LOGGER.debug("dragenter");
			$(this).addClass("over");
			evt1.preventDefault();
			evt1.stopPropagation();
		});
		selfElement.on("dragover",function(evt2,d2) {
			pagent.AppContext.LOGGER.debug("dragover");
			evt2.preventDefault();
			evt2.stopPropagation();
		});
		selfElement.on("drop",function(evt3,d3) {
			pagent.AppContext.LOGGER.debug("drop");
			self._traverseFiles(evt3.originalEvent.dataTransfer.files);
			$(this).removeClass("drop");
			evt3.preventDefault();
			evt3.stopPropagation();
		});
	}, _createFileUploadComponent : function() {
		var self1 = this;
		var selfElement1 = this.element;
		if(self1.inner_element_id != null) new $("#" + self1.inner_element_id).remove();
		self1.inner_element_id = "files-upload-" + StringTools.hex(Std.random(999999));
		var filesUpload = new $("<input id='" + self1.inner_element_id + "' class='files-upload' type='file'/>").prependTo(selfElement1);
		filesUpload.change(function(evt4) {
			self1._traverseFiles(this.files);
		});
	}, _uploadFile : function(file) {
		var self2 = this;
		var selfElement2 = this.element;
		if(typeof FileReader === 'undefined') {
			m3.util.JqueryUtil.alert("FileUpload is not supported by your browser");
			return;
		}
		if(self2.options.contentType == qoid.model.ContentType.IMAGE && !new EReg("image","i").match(file.type)) {
			m3.util.JqueryUtil.alert("Please select an image file.");
			return;
		}
		if(self2.options.contentType == qoid.model.ContentType.AUDIO && !new EReg("audio","i").match(file.type)) {
			m3.util.JqueryUtil.alert("Please select an audio file.");
			return;
		}
		pagent.AppContext.LOGGER.debug("upload " + Std.string(file.name));
		var reader = new FileReader();
		reader.onload = function(evt5) {
			self2.setPreviewImage(evt5.target.result);
			if(self2.options.onload != null) self2.options.onload(evt5.target.result);
		};
		reader.readAsDataURL(file);
	}, setPreviewImage : function(src) {
		var self3 = this;
		if(self3.previewImg == null) {
			var selfElement3 = this.element;
			self3.previewImg = new $("<img class='file_about_to_be_uploaded'/>").appendTo(selfElement3);
		}
		self3.previewImg.attr("src",src);
	}, _traverseFiles : function(files) {
		pagent.AppContext.LOGGER.debug("traverse the files");
		var self4 = this;
		if(m3.helper.ArrayHelper.hasValues(files)) {
			var _g = 0;
			while(_g < 1) {
				var i = _g++;
				self4._uploadFile(files[i]);
			}
		} else {
		}
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}, value : function() {
		var self5 = this;
		return self5.previewImg.attr("src");
	}, clear : function() {
		var self6 = this;
		self6.previewImg.remove();
		self6.previewImg = null;
		self6._createFileUploadComponent();
	}};
};
$.widget("ui.uploadComp",defineWidget());
haxe.xml.Parser.escapes = (function($this) {
	var $r;
	var h = new haxe.ds.StringMap();
	h.set("lt","<");
	h.set("gt",">");
	h.set("amp","&");
	h.set("quot","\"");
	h.set("apos","'");
	h.set("nbsp",String.fromCharCode(160));
	$r = h;
	return $r;
}(this));
m3.jq.pages.SinglePageManager.SCREEN_MAP = new haxe.ds.StringMap();
m3.jqm.pages.PageManager.SCREEN_MAP = new haxe.ds.StringMap();
m3.observable.OSet.__rtti = "<class path=\"m3.observable.OSet\" params=\"T\" interface=\"1\">\n\t<identifier public=\"1\" set=\"method\"><f a=\"\"><f a=\"\">\n\t<c path=\"m3.observable.OSet.T\"/>\n\t<c path=\"String\"/>\n</f></f></identifier>\n\t<listen public=\"1\" set=\"method\"><f a=\"l:?autoFire\">\n\t<f a=\":\">\n\t\t<c path=\"m3.observable.OSet.T\"/>\n\t\t<c path=\"m3.observable.EventType\"/>\n\t\t<x path=\"Void\"/>\n\t</f>\n\t<x path=\"Bool\"/>\n\t<x path=\"Void\"/>\n</f></listen>\n\t<removeListener public=\"1\" set=\"method\"><f a=\"l\">\n\t<f a=\":\">\n\t\t<c path=\"m3.observable.OSet.T\"/>\n\t\t<c path=\"m3.observable.EventType\"/>\n\t\t<x path=\"Void\"/>\n\t</f>\n\t<x path=\"Void\"/>\n</f></removeListener>\n\t<iterator public=\"1\" set=\"method\"><f a=\"\"><t path=\"Iterator\"><c path=\"m3.observable.OSet.T\"/></t></f></iterator>\n\t<delegate public=\"1\" set=\"method\"><f a=\"\"><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"m3.observable.OSet.T\"/>\n</x></f></delegate>\n\t<getVisualId public=\"1\" set=\"method\"><f a=\"\"><c path=\"String\"/></f></getVisualId>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
m3.observable.EventManager.__rtti = "<class path=\"m3.observable.EventManager\" params=\"T\" module=\"m3.observable.OSet\">\n\t<_listeners><c path=\"Array\"><f a=\":\">\n\t<c path=\"m3.observable.EventManager.T\"/>\n\t<c path=\"m3.observable.EventType\"/>\n\t<x path=\"Void\"/>\n</f></c></_listeners>\n\t<_set><c path=\"m3.observable.OSet\"><c path=\"m3.observable.EventManager.T\"/></c></_set>\n\t<add public=\"1\" set=\"method\" line=\"47\"><f a=\"l:autoFire\">\n\t<f a=\":\">\n\t\t<c path=\"m3.observable.EventManager.T\"/>\n\t\t<c path=\"m3.observable.EventType\"/>\n\t\t<x path=\"Void\"/>\n\t</f>\n\t<x path=\"Bool\"/>\n\t<x path=\"Void\"/>\n</f></add>\n\t<remove public=\"1\" set=\"method\" line=\"56\"><f a=\"l\">\n\t<f a=\":\">\n\t\t<c path=\"m3.observable.EventManager.T\"/>\n\t\t<c path=\"m3.observable.EventType\"/>\n\t\t<x path=\"Void\"/>\n\t</f>\n\t<x path=\"Void\"/>\n</f></remove>\n\t<fire public=\"1\" set=\"method\" line=\"59\"><f a=\"t:type\">\n\t<c path=\"m3.observable.EventManager.T\"/>\n\t<c path=\"m3.observable.EventType\"/>\n\t<x path=\"Void\"/>\n</f></fire>\n\t<listenerCount public=\"1\" set=\"method\" line=\"70\"><f a=\"\"><x path=\"Int\"/></f></listenerCount>\n\t<new public=\"1\" set=\"method\" line=\"43\"><f a=\"set\">\n\t<c path=\"m3.observable.OSet\"><c path=\"m3.observable.EventManager.T\"/></c>\n\t<x path=\"Void\"/>\n</f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
m3.observable.EventType.Add = new m3.observable.EventType("Add",true,false,false);
m3.observable.EventType.Update = new m3.observable.EventType("Update",false,true,false);
m3.observable.EventType.Delete = new m3.observable.EventType("Delete",false,false,false);
m3.observable.EventType.Clear = new m3.observable.EventType("Clear",false,false,true);
m3.observable.AbstractSet.__rtti = "<class path=\"m3.observable.AbstractSet\" params=\"T\" module=\"m3.observable.OSet\">\n\t<implements path=\"m3.observable.OSet\"><c path=\"m3.observable.AbstractSet.T\"/></implements>\n\t<_eventManager public=\"1\"><c path=\"m3.observable.EventManager\"><c path=\"m3.observable.AbstractSet.T\"/></c></_eventManager>\n\t<visualId public=\"1\"><c path=\"String\"/></visualId>\n\t<listen public=\"1\" set=\"method\" line=\"129\"><f a=\"l:?autoFire\" v=\":true\">\n\t<f a=\":\">\n\t\t<c path=\"m3.observable.AbstractSet.T\"/>\n\t\t<c path=\"m3.observable.EventType\"/>\n\t\t<x path=\"Void\"/>\n\t</f>\n\t<x path=\"Bool\"/>\n\t<x path=\"Void\"/>\n</f></listen>\n\t<removeListener public=\"1\" set=\"method\" line=\"133\"><f a=\"l\">\n\t<f a=\":\">\n\t\t<c path=\"m3.observable.AbstractSet.T\"/>\n\t\t<c path=\"m3.observable.EventType\"/>\n\t\t<x path=\"Void\"/>\n\t</f>\n\t<x path=\"Void\"/>\n</f></removeListener>\n\t<filter public=\"1\" set=\"method\" line=\"137\"><f a=\"f\">\n\t<f a=\"\">\n\t\t<c path=\"m3.observable.AbstractSet.T\"/>\n\t\t<x path=\"Bool\"/>\n\t</f>\n\t<c path=\"m3.observable.OSet\"><c path=\"m3.observable.AbstractSet.T\"/></c>\n</f></filter>\n\t<map public=\"1\" params=\"U\" set=\"method\" line=\"141\"><f a=\"f\">\n\t<f a=\"\">\n\t\t<c path=\"m3.observable.AbstractSet.T\"/>\n\t\t<c path=\"map.U\"/>\n\t</f>\n\t<c path=\"m3.observable.OSet\"><c path=\"map.U\"/></c>\n</f></map>\n\t<fire set=\"method\" line=\"145\"><f a=\"t:type\">\n\t<c path=\"m3.observable.AbstractSet.T\"/>\n\t<c path=\"m3.observable.EventType\"/>\n\t<x path=\"Void\"/>\n</f></fire>\n\t<getVisualId public=\"1\" set=\"method\" line=\"149\"><f a=\"\"><c path=\"String\"/></f></getVisualId>\n\t<identifier public=\"1\" set=\"method\" line=\"153\"><f a=\"\"><f a=\"\">\n\t<c path=\"m3.observable.AbstractSet.T\"/>\n\t<c path=\"String\"/>\n</f></f></identifier>\n\t<iterator public=\"1\" set=\"method\" line=\"157\"><f a=\"\"><t path=\"Iterator\"><c path=\"m3.observable.AbstractSet.T\"/></t></f></iterator>\n\t<delegate public=\"1\" set=\"method\" line=\"161\"><f a=\"\"><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"m3.observable.AbstractSet.T\"/>\n</x></f></delegate>\n\t<new set=\"method\" line=\"125\"><f a=\"\"><x path=\"Void\"/></f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
m3.observable.ObservableSet.__rtti = "<class path=\"m3.observable.ObservableSet\" params=\"T\" module=\"m3.observable.OSet\">\n\t<extends path=\"m3.observable.AbstractSet\"><c path=\"m3.observable.ObservableSet.T\"/></extends>\n\t<_delegate><c path=\"m3.util.SizedMap\"><c path=\"m3.observable.ObservableSet.T\"/></c></_delegate>\n\t<_identifier><f a=\"\">\n\t<c path=\"m3.observable.ObservableSet.T\"/>\n\t<c path=\"String\"/>\n</f></_identifier>\n\t<add public=\"1\" set=\"method\" line=\"181\"><f a=\"t\">\n\t<c path=\"m3.observable.ObservableSet.T\"/>\n\t<x path=\"Void\"/>\n</f></add>\n\t<addAll public=\"1\" set=\"method\" line=\"185\"><f a=\"tArr\">\n\t<c path=\"Array\"><c path=\"m3.observable.ObservableSet.T\"/></c>\n\t<x path=\"Void\"/>\n</f></addAll>\n\t<iterator public=\"1\" set=\"method\" line=\"193\" override=\"1\"><f a=\"\"><t path=\"Iterator\"><c path=\"m3.observable.ObservableSet.T\"/></t></f></iterator>\n\t<isEmpty public=\"1\" set=\"method\" line=\"197\"><f a=\"\"><x path=\"Bool\"/></f></isEmpty>\n\t<addOrUpdate public=\"1\" set=\"method\" line=\"201\"><f a=\"t\">\n\t<c path=\"m3.observable.ObservableSet.T\"/>\n\t<x path=\"Void\"/>\n</f></addOrUpdate>\n\t<delegate public=\"1\" set=\"method\" line=\"213\" override=\"1\"><f a=\"\"><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"m3.observable.ObservableSet.T\"/>\n</x></f></delegate>\n\t<update public=\"1\" set=\"method\" line=\"217\"><f a=\"t\">\n\t<c path=\"m3.observable.ObservableSet.T\"/>\n\t<x path=\"Void\"/>\n</f></update>\n\t<delete public=\"1\" set=\"method\" line=\"221\"><f a=\"t\">\n\t<c path=\"m3.observable.ObservableSet.T\"/>\n\t<x path=\"Void\"/>\n</f></delete>\n\t<identifier public=\"1\" set=\"method\" line=\"229\" override=\"1\"><f a=\"\"><f a=\"\">\n\t<c path=\"m3.observable.ObservableSet.T\"/>\n\t<c path=\"String\"/>\n</f></f></identifier>\n\t<clear public=\"1\" set=\"method\" line=\"233\"><f a=\"\"><x path=\"Void\"/></f></clear>\n\t<size public=\"1\" set=\"method\" line=\"238\"><f a=\"\"><x path=\"Int\"/></f></size>\n\t<asArray public=\"1\" set=\"method\" line=\"242\"><f a=\"\"><c path=\"Array\"><c path=\"m3.observable.ObservableSet.T\"/></c></f></asArray>\n\t<new public=\"1\" set=\"method\" line=\"172\"><f a=\"identifier:?tArr\" v=\":null\">\n\t<f a=\"\">\n\t\t<c path=\"m3.observable.ObservableSet.T\"/>\n\t\t<c path=\"String\"/>\n\t</f>\n\t<c path=\"Array\"><c path=\"m3.observable.ObservableSet.T\"/></c>\n\t<x path=\"Void\"/>\n</f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
m3.observable.MappedSet.__rtti = "<class path=\"m3.observable.MappedSet\" params=\"T:U\" module=\"m3.observable.OSet\">\n\t<extends path=\"m3.observable.AbstractSet\"><c path=\"m3.observable.MappedSet.U\"/></extends>\n\t<_source><c path=\"m3.observable.OSet\"><c path=\"m3.observable.MappedSet.T\"/></c></_source>\n\t<_mapper><f a=\"\">\n\t<c path=\"m3.observable.MappedSet.T\"/>\n\t<c path=\"m3.observable.MappedSet.U\"/>\n</f></_mapper>\n\t<_mappedSet><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"m3.observable.MappedSet.U\"/>\n</x></_mappedSet>\n\t<_remapOnUpdate><x path=\"Bool\"/></_remapOnUpdate>\n\t<_mapListeners><c path=\"Array\"><f a=\"::\">\n\t<c path=\"m3.observable.MappedSet.T\"/>\n\t<c path=\"m3.observable.MappedSet.U\"/>\n\t<c path=\"m3.observable.EventType\"/>\n\t<x path=\"Void\"/>\n</f></c></_mapListeners>\n\t<_sourceListener set=\"method\" line=\"270\"><f a=\"t:type\">\n\t<c path=\"m3.observable.MappedSet.T\"/>\n\t<c path=\"m3.observable.EventType\"/>\n\t<x path=\"Void\"/>\n</f></_sourceListener>\n\t<identifier public=\"1\" set=\"method\" line=\"296\" override=\"1\"><f a=\"\"><f a=\"\">\n\t<c path=\"m3.observable.MappedSet.U\"/>\n\t<c path=\"String\"/>\n</f></f></identifier>\n\t<delegate public=\"1\" set=\"method\" line=\"300\" override=\"1\"><f a=\"\"><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"m3.observable.MappedSet.U\"/>\n</x></f></delegate>\n\t<identify set=\"method\" line=\"304\"><f a=\"u\">\n\t<c path=\"m3.observable.MappedSet.U\"/>\n\t<c path=\"String\"/>\n</f></identify>\n\t<iterator public=\"1\" set=\"method\" line=\"315\" override=\"1\"><f a=\"\"><t path=\"Iterator\"><c path=\"m3.observable.MappedSet.U\"/></t></f></iterator>\n\t<mapListen public=\"1\" set=\"method\" line=\"319\"><f a=\"f\">\n\t<f a=\"::\">\n\t\t<c path=\"m3.observable.MappedSet.T\"/>\n\t\t<c path=\"m3.observable.MappedSet.U\"/>\n\t\t<c path=\"m3.observable.EventType\"/>\n\t\t<x path=\"Void\"/>\n\t</f>\n\t<x path=\"Void\"/>\n</f></mapListen>\n\t<removeListeners public=\"1\" set=\"method\" line=\"330\"><f a=\"mapListener\">\n\t<f a=\"::\">\n\t\t<c path=\"m3.observable.MappedSet.T\"/>\n\t\t<c path=\"m3.observable.MappedSet.U\"/>\n\t\t<c path=\"m3.observable.EventType\"/>\n\t\t<x path=\"Void\"/>\n\t</f>\n\t<x path=\"Void\"/>\n</f></removeListeners>\n\t<new public=\"1\" set=\"method\" line=\"260\"><f a=\"source:mapper:?remapOnUpdate\" v=\"::false\">\n\t<c path=\"m3.observable.OSet\"><c path=\"m3.observable.MappedSet.T\"/></c>\n\t<f a=\"\">\n\t\t<c path=\"m3.observable.MappedSet.T\"/>\n\t\t<c path=\"m3.observable.MappedSet.U\"/>\n\t</f>\n\t<x path=\"Bool\"/>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
m3.observable.FilteredSet.__rtti = "<class path=\"m3.observable.FilteredSet\" params=\"T\" module=\"m3.observable.OSet\">\n\t<extends path=\"m3.observable.AbstractSet\"><c path=\"m3.observable.FilteredSet.T\"/></extends>\n\t<_filteredSet><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"m3.observable.FilteredSet.T\"/>\n</x></_filteredSet>\n\t<_source><c path=\"m3.observable.OSet\"><c path=\"m3.observable.FilteredSet.T\"/></c></_source>\n\t<_filter><f a=\"\">\n\t<c path=\"m3.observable.FilteredSet.T\"/>\n\t<x path=\"Bool\"/>\n</f></_filter>\n\t<delegate public=\"1\" set=\"method\" line=\"366\" override=\"1\"><f a=\"\"><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"m3.observable.FilteredSet.T\"/>\n</x></f></delegate>\n\t<apply set=\"method\" line=\"370\"><f a=\"t\">\n\t<c path=\"m3.observable.FilteredSet.T\"/>\n\t<x path=\"Void\"/>\n</f></apply>\n\t<refilter public=\"1\" set=\"method\" line=\"387\"><f a=\"\"><x path=\"Void\"/></f></refilter>\n\t<identifier public=\"1\" set=\"method\" line=\"391\" override=\"1\"><f a=\"\"><f a=\"\">\n\t<c path=\"m3.observable.FilteredSet.T\"/>\n\t<c path=\"String\"/>\n</f></f></identifier>\n\t<iterator public=\"1\" set=\"method\" line=\"395\" override=\"1\"><f a=\"\"><t path=\"Iterator\"><c path=\"m3.observable.FilteredSet.T\"/></t></f></iterator>\n\t<asArray public=\"1\" set=\"method\" line=\"399\"><f a=\"\"><c path=\"Array\"><c path=\"m3.observable.FilteredSet.T\"/></c></f></asArray>\n\t<new public=\"1\" set=\"method\" line=\"342\"><f a=\"source:filter\">\n\t<c path=\"m3.observable.OSet\"><c path=\"m3.observable.FilteredSet.T\"/></c>\n\t<f a=\"\">\n\t\t<c path=\"m3.observable.FilteredSet.T\"/>\n\t\t<x path=\"Bool\"/>\n\t</f>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
m3.observable.GroupedSet.__rtti = "<class path=\"m3.observable.GroupedSet\" params=\"T\" module=\"m3.observable.OSet\">\n\t<extends path=\"m3.observable.AbstractSet\"><c path=\"m3.observable.OSet\"><c path=\"m3.observable.GroupedSet.T\"/></c></extends>\n\t<_source><c path=\"m3.observable.OSet\"><c path=\"m3.observable.GroupedSet.T\"/></c></_source>\n\t<_groupingFn><f a=\"\">\n\t<c path=\"m3.observable.GroupedSet.T\"/>\n\t<c path=\"String\"/>\n</f></_groupingFn>\n\t<_groupedSets><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"m3.observable.ObservableSet\"><c path=\"m3.observable.GroupedSet.T\"/></c>\n</x></_groupedSets>\n\t<_identityToGrouping><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"String\"/>\n</x></_identityToGrouping>\n\t<delete set=\"method\" line=\"437\"><f a=\"t:?deleteEmptySet\" v=\":true\">\n\t<c path=\"m3.observable.GroupedSet.T\"/>\n\t<x path=\"Bool\"/>\n\t<x path=\"Void\"/>\n</f></delete>\n\t<add set=\"method\" line=\"460\"><f a=\"t\">\n\t<c path=\"m3.observable.GroupedSet.T\"/>\n\t<x path=\"Void\"/>\n</f></add>\n\t<addEmptyGroup public=\"1\" set=\"method\" line=\"479\"><f a=\"key\">\n\t<c path=\"String\"/>\n\t<c path=\"m3.observable.ObservableSet\"><c path=\"m3.observable.GroupedSet.T\"/></c>\n</f></addEmptyGroup>\n\t<identifier public=\"1\" set=\"method\" line=\"488\" override=\"1\"><f a=\"\"><f a=\"\">\n\t<c path=\"m3.observable.OSet\"><c path=\"m3.observable.GroupedSet.T\"/></c>\n\t<c path=\"String\"/>\n</f></f></identifier>\n\t<identify set=\"method\" line=\"492\"><f a=\"set\">\n\t<c path=\"m3.observable.OSet\"><c path=\"m3.observable.GroupedSet.T\"/></c>\n\t<c path=\"String\"/>\n</f></identify>\n\t<iterator public=\"1\" set=\"method\" line=\"503\" override=\"1\"><f a=\"\"><t path=\"Iterator\"><c path=\"m3.observable.OSet\"><c path=\"m3.observable.GroupedSet.T\"/></c></t></f></iterator>\n\t<delegate public=\"1\" set=\"method\" line=\"507\" override=\"1\"><f a=\"\"><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"m3.observable.OSet\"><c path=\"m3.observable.GroupedSet.T\"/></c>\n</x></f></delegate>\n\t<new public=\"1\" set=\"method\" line=\"417\"><f a=\"source:groupingFn\">\n\t<c path=\"m3.observable.OSet\"><c path=\"m3.observable.GroupedSet.T\"/></c>\n\t<f a=\"\">\n\t\t<c path=\"m3.observable.GroupedSet.T\"/>\n\t\t<c path=\"String\"/>\n\t</f>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
m3.observable.SortedSet.__rtti = "<class path=\"m3.observable.SortedSet\" params=\"T\" module=\"m3.observable.OSet\">\n\t<extends path=\"m3.observable.AbstractSet\"><c path=\"m3.observable.SortedSet.T\"/></extends>\n\t<_source><c path=\"m3.observable.OSet\"><c path=\"m3.observable.SortedSet.T\"/></c></_source>\n\t<_sortByFn><f a=\"\">\n\t<c path=\"m3.observable.SortedSet.T\"/>\n\t<c path=\"String\"/>\n</f></_sortByFn>\n\t<_sorted><c path=\"Array\"><c path=\"m3.observable.SortedSet.T\"/></c></_sorted>\n\t<_dirty><x path=\"Bool\"/></_dirty>\n\t<_comparisonFn><f a=\":\">\n\t<c path=\"m3.observable.SortedSet.T\"/>\n\t<c path=\"m3.observable.SortedSet.T\"/>\n\t<x path=\"Int\"/>\n</f></_comparisonFn>\n\t<sorted public=\"1\" set=\"method\" line=\"562\"><f a=\"\"><c path=\"Array\"><c path=\"m3.observable.SortedSet.T\"/></c></f></sorted>\n\t<indexOf set=\"method\" line=\"570\"><f a=\"t\">\n\t<c path=\"m3.observable.SortedSet.T\"/>\n\t<x path=\"Int\"/>\n</f></indexOf>\n\t<binarySearch set=\"method\" line=\"575\"><f a=\"value:sortBy:startIndex:endIndex\">\n\t<c path=\"m3.observable.SortedSet.T\"/>\n\t<c path=\"String\"/>\n\t<x path=\"Int\"/>\n\t<x path=\"Int\"/>\n\t<x path=\"Int\"/>\n</f></binarySearch>\n\t<delete set=\"method\" line=\"593\"><f a=\"t\">\n\t<c path=\"m3.observable.SortedSet.T\"/>\n\t<x path=\"Void\"/>\n</f></delete>\n\t<add set=\"method\" line=\"597\"><f a=\"t\">\n\t<c path=\"m3.observable.SortedSet.T\"/>\n\t<x path=\"Void\"/>\n</f></add>\n\t<identifier public=\"1\" set=\"method\" line=\"603\" override=\"1\"><f a=\"\"><f a=\"\">\n\t<c path=\"m3.observable.SortedSet.T\"/>\n\t<c path=\"String\"/>\n</f></f></identifier>\n\t<iterator public=\"1\" set=\"method\" line=\"607\" override=\"1\"><f a=\"\"><t path=\"Iterator\"><c path=\"m3.observable.SortedSet.T\"/></t></f></iterator>\n\t<delegate public=\"1\" set=\"method\" line=\"611\" override=\"1\"><f a=\"\"><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"m3.observable.SortedSet.T\"/>\n</x></f></delegate>\n\t<new public=\"1\" set=\"method\" line=\"520\"><f a=\"source:?sortByFn\" v=\":null\">\n\t<c path=\"m3.observable.OSet\"><c path=\"m3.observable.SortedSet.T\"/></c>\n\t<f a=\"\">\n\t\t<c path=\"m3.observable.SortedSet.T\"/>\n\t\t<c path=\"String\"/>\n\t</f>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
m3.util.ColorProvider._INDEX = 0;
pagent.PinterContext.APP_INITIALIZED = false;
pagent.PinterContext.ROOT_LABEL_NAME_OF_ALL_APPS = "com.qoid.apps";
pagent.PinterContext.APP_ROOT_LABEL_NAME = pagent.PinterContext.ROOT_LABEL_NAME_OF_ALL_APPS + ".pinteragent";
pagent.api.ProtocolHandler.QUERY = "/api/query";
pagent.api.ProtocolHandler.UPSERT = "/api/upsert";
pagent.api.ProtocolHandler.DELETE = "/api/delete";
pagent.api.ProtocolHandler.INTRODUCE = "/api/introduction/initiate";
pagent.api.ProtocolHandler.DEREGISTER = "/api/query/deregister";
pagent.api.ProtocolHandler.INTRO_RESPONSE = "/api/introduction/respond";
pagent.api.ProtocolHandler.VERIFY = "/api/verification/verify";
pagent.api.ProtocolHandler.VERIFICATION_ACCEPT = "/api/verification/accept";
pagent.api.ProtocolHandler.VERIFICATION_REQUEST = "/api/verification/request";
pagent.api.ProtocolHandler.VERIFICATION_RESPONSE = "/api/verification/respond";
pagent.api.Synchronizer.synchronizers = new haxe.ds.StringMap();
pagent.pages.PinterPageMgr.HOME_SCREEN = new pagent.pages.HomeScreen();
qoid.model.ModelObj.__rtti = "<class path=\"qoid.model.ModelObj\" params=\"\">\n\t<objectType public=\"1\" set=\"method\" line=\"26\"><f a=\"\"><c path=\"String\"/></f></objectType>\n\t<new public=\"1\" set=\"method\" line=\"23\"><f a=\"\"><x path=\"Void\"/></f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
qoid.model.ModelObjWithIid.__rtti = "<class path=\"qoid.model.ModelObjWithIid\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ModelObj\"/>\n\t<identifier public=\"1\" set=\"method\" line=\"47\" static=\"1\"><f a=\"t\">\n\t<c path=\"qoid.model.ModelObjWithIid\"/>\n\t<c path=\"String\"/>\n</f></identifier>\n\t<iid public=\"1\"><c path=\"String\"/></iid>\n\t<created public=\"1\"><c path=\"Date\"/></created>\n\t<modified public=\"1\"><c path=\"Date\"/></modified>\n\t<createdByAliasIid public=\"1\"><c path=\"String\"/></createdByAliasIid>\n\t<modifiedByAliasIid public=\"1\"><c path=\"String\"/></modifiedByAliasIid>\n\t<new public=\"1\" set=\"method\" line=\"40\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.Alias.__rtti = "<class path=\"qoid.model.Alias\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ModelObjWithIid\"/>\n\t<identifier public=\"1\" set=\"method\" line=\"90\" static=\"1\"><f a=\"alias\">\n\t<c path=\"qoid.model.Alias\"/>\n\t<c path=\"String\"/>\n</f></identifier>\n\t<rootLabelIid public=\"1\"><c path=\"String\"/></rootLabelIid>\n\t<name public=\"1\"><c path=\"String\"/></name>\n\t<profile public=\"1\">\n\t\t<c path=\"qoid.model.Profile\"/>\n\t\t<meta><m n=\":transient\"/></meta>\n\t</profile>\n\t<data public=\"1\">\n\t\t<c path=\"qoid.model.AliasData\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</data>\n\t<new public=\"1\" set=\"method\" line=\"84\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.Profile.__rtti = "<class path=\"qoid.model.Profile\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ModelObjWithIid\"/>\n\t<identifier public=\"1\" set=\"method\" line=\"65\" static=\"1\"><f a=\"profile\">\n\t<c path=\"qoid.model.Profile\"/>\n\t<c path=\"String\"/>\n</f></identifier>\n\t<sharedId public=\"1\"><c path=\"String\"/></sharedId>\n\t<aliasIid public=\"1\"><c path=\"String\"/></aliasIid>\n\t<name public=\"1\"><c path=\"String\"/></name>\n\t<imgSrc public=\"1\">\n\t\t<c path=\"String\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</imgSrc>\n\t<connectionIid public=\"1\">\n\t\t<c path=\"String\"/>\n\t\t<meta><m n=\":transient\"/></meta>\n\t</connectionIid>\n\t<new public=\"1\" set=\"method\" line=\"59\"><f a=\"?name:?imgSrc:?aliasIid\" v=\"null:null:null\">\n\t<c path=\"String\"/>\n\t<c path=\"String\"/>\n\t<c path=\"String\"/>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
qoid.model.AliasData.__rtti = "<class path=\"qoid.model.AliasData\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ModelObj\"/>\n\t<isDefault public=\"1\">\n\t\t<x path=\"Bool\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</isDefault>\n\t<new public=\"1\" set=\"method\" line=\"72\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.Label.__rtti = "<class path=\"qoid.model.Label\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ModelObjWithIid\"/>\n\t<identifier public=\"1\" set=\"method\" line=\"114\" static=\"1\"><f a=\"l\">\n\t<c path=\"qoid.model.Label\"/>\n\t<c path=\"String\"/>\n</f></identifier>\n\t<name public=\"1\"><c path=\"String\"/></name>\n\t<data public=\"1\">\n\t\t<c path=\"qoid.model.LabelData\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</data>\n\t<labelChildren public=\"1\">\n\t\t<c path=\"m3.observable.OSet\"><c path=\"qoid.model.LabelChild\"/></c>\n\t\t<meta><m n=\":transient\"/></meta>\n\t</labelChildren>\n\t<new public=\"1\" set=\"method\" line=\"108\"><f a=\"?name\" v=\"null\">\n\t<c path=\"String\"/>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
qoid.model.LabelData.__rtti = "<class path=\"qoid.model.LabelData\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ModelObj\"/>\n\t<color public=\"1\"><c path=\"String\"/></color>\n\t<new public=\"1\" set=\"method\" line=\"97\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.api.ChannelMessage.__rtti = "<class path=\"qoid.api.ChannelMessage\" params=\"\" module=\"qoid.api.CrudMessage\" interface=\"1\"><meta><m n=\":rtti\"/></meta></class>";
qoid.api.BennuMessage.__rtti = "<class path=\"qoid.api.BennuMessage\" params=\"\" module=\"qoid.api.CrudMessage\">\n\t<implements path=\"qoid.api.ChannelMessage\"/>\n\t<type public=\"1\"><c path=\"String\"/></type>\n\t<new public=\"1\" set=\"method\" line=\"16\"><f a=\"type\">\n\t<c path=\"String\"/>\n\t<x path=\"Void\"/>\n</f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
qoid.api.DeleteMessage.__rtti = "<class path=\"qoid.api.DeleteMessage\" params=\"\" module=\"qoid.api.CrudMessage\">\n\t<extends path=\"qoid.api.BennuMessage\"/>\n\t<create public=\"1\" set=\"method\" line=\"29\" static=\"1\"><f a=\"object\">\n\t<c path=\"qoid.model.ModelObjWithIid\"/>\n\t<c path=\"qoid.api.DeleteMessage\"/>\n</f></create>\n\t<primaryKey><c path=\"String\"/></primaryKey>\n\t<new public=\"1\" set=\"method\" line=\"24\"><f a=\"type:primaryKey\">\n\t<c path=\"String\"/>\n\t<c path=\"String\"/>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
qoid.api.CrudMessage.__rtti = "<class path=\"qoid.api.CrudMessage\" params=\"\">\n\t<extends path=\"qoid.api.BennuMessage\"/>\n\t<create public=\"1\" set=\"method\" line=\"52\" static=\"1\"><f a=\"object:?optionals\" v=\":null\">\n\t<c path=\"qoid.model.ModelObjWithIid\"/>\n\t<d/>\n\t<c path=\"qoid.api.CrudMessage\"/>\n</f></create>\n\t<instance><d/></instance>\n\t<parentIid>\n\t\t<c path=\"String\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</parentIid>\n\t<profileName>\n\t\t<c path=\"String\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</profileName>\n\t<profileImgSrc>\n\t\t<c path=\"String\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</profileImgSrc>\n\t<labelIids>\n\t\t<c path=\"Array\"><c path=\"String\"/></c>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</labelIids>\n\t<new public=\"1\" set=\"method\" line=\"41\"><f a=\"type:instance:?optionals\" v=\"::null\">\n\t<c path=\"String\"/>\n\t<d/>\n\t<d/>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
qoid.api.DeregisterMessage.__rtti = "<class path=\"qoid.api.DeregisterMessage\" params=\"\" module=\"qoid.api.CrudMessage\">\n\t<implements path=\"qoid.api.ChannelMessage\"/>\n\t<handle public=\"1\"><c path=\"String\"/></handle>\n\t<new public=\"1\" set=\"method\" line=\"61\"><f a=\"handle\">\n\t<c path=\"String\"/>\n\t<x path=\"Void\"/>\n</f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
qoid.api.IntroMessage.__rtti = "<class path=\"qoid.api.IntroMessage\" params=\"\" module=\"qoid.api.CrudMessage\">\n\t<implements path=\"qoid.api.ChannelMessage\"/>\n\t<aConnectionIid public=\"1\"><c path=\"String\"/></aConnectionIid>\n\t<aMessage public=\"1\"><c path=\"String\"/></aMessage>\n\t<bConnectionIid public=\"1\"><c path=\"String\"/></bConnectionIid>\n\t<bMessage public=\"1\"><c path=\"String\"/></bMessage>\n\t<new public=\"1\" set=\"method\" line=\"73\"><f a=\"i\">\n\t<c path=\"qoid.model.IntroductionRequest\"/>\n\t<x path=\"Void\"/>\n</f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
qoid.api.VerificationRequestMessage.__rtti = "<class path=\"qoid.api.VerificationRequestMessage\" params=\"\" module=\"qoid.api.CrudMessage\">\n\t<implements path=\"qoid.api.ChannelMessage\"/>\n\t<contentIid public=\"1\"><c path=\"String\"/></contentIid>\n\t<connectionIids public=\"1\"><c path=\"Array\"><c path=\"String\"/></c></connectionIids>\n\t<message public=\"1\"><c path=\"String\"/></message>\n\t<new public=\"1\" set=\"method\" line=\"87\"><f a=\"vr\">\n\t<c path=\"qoid.model.VerificationRequest\"/>\n\t<x path=\"Void\"/>\n</f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
qoid.api.VerificationResponseMessage.__rtti = "<class path=\"qoid.api.VerificationResponseMessage\" params=\"\" module=\"qoid.api.CrudMessage\">\n\t<implements path=\"qoid.api.ChannelMessage\"/>\n\t<notificationIid public=\"1\"><c path=\"String\"/></notificationIid>\n\t<verificationContent public=\"1\"><c path=\"String\"/></verificationContent>\n\t<new public=\"1\" set=\"method\" line=\"99\"><f a=\"vr\">\n\t<c path=\"qoid.model.VerificationResponse\"/>\n\t<x path=\"Void\"/>\n</f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
qoid.api.AcceptVerificationMessage.__rtti = "<class path=\"qoid.api.AcceptVerificationMessage\" params=\"\" module=\"qoid.api.CrudMessage\">\n\t<implements path=\"qoid.api.ChannelMessage\"/>\n\t<notificationIid public=\"1\"><c path=\"String\"/></notificationIid>\n\t<new public=\"1\" set=\"method\" line=\"109\"><f a=\"notificationIid\">\n\t<c path=\"String\"/>\n\t<x path=\"Void\"/>\n</f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
qoid.api.IntroResponseMessage.__rtti = "<class path=\"qoid.api.IntroResponseMessage\" params=\"\" module=\"qoid.api.CrudMessage\">\n\t<implements path=\"qoid.api.ChannelMessage\"/>\n\t<notificationIid public=\"1\"><c path=\"String\"/></notificationIid>\n\t<accepted public=\"1\"><x path=\"Bool\"/></accepted>\n\t<new public=\"1\" set=\"method\" line=\"119\"><f a=\"notificationIid:accepted\">\n\t<c path=\"String\"/>\n\t<x path=\"Bool\"/>\n\t<x path=\"Void\"/>\n</f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
qoid.api.QueryMessage.__rtti = "<class path=\"qoid.api.QueryMessage\" params=\"\" module=\"qoid.api.CrudMessage\">\n\t<implements path=\"qoid.api.ChannelMessage\"/>\n\t<create public=\"1\" set=\"method\" line=\"153\" static=\"1\"><f a=\"type\">\n\t<c path=\"String\"/>\n\t<c path=\"qoid.api.QueryMessage\"/>\n</f></create>\n\t<type public=\"1\"><c path=\"String\"/></type>\n\t<q public=\"1\"><c path=\"String\"/></q>\n\t<aliasIid public=\"1\"><c path=\"String\"/></aliasIid>\n\t<connectionIids public=\"1\"><c path=\"Array\"><c path=\"String\"/></c></connectionIids>\n\t<standing public=\"1\"><x path=\"Bool\"/></standing>\n\t<historical public=\"1\"><x path=\"Bool\"/></historical>\n\t<local public=\"1\"><x path=\"Bool\"/></local>\n\t<new public=\"1\" set=\"method\" line=\"135\"><f a=\"fd:?type:?q\" v=\":null:null\">\n\t<c path=\"qoid.model.FilterData\"/>\n\t<c path=\"String\"/>\n\t<c path=\"String\"/>\n\t<x path=\"Void\"/>\n</f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
qoid.api.ChannelRequestMessage.__rtti = "<class path=\"qoid.api.ChannelRequestMessage\" params=\"\" module=\"qoid.api.CrudMessage\">\n\t<path><c path=\"String\"/></path>\n\t<context><c path=\"String\"/></context>\n\t<parms><d/></parms>\n\t<new public=\"1\" set=\"method\" line=\"164\"><f a=\"path:context:msg\">\n\t<c path=\"String\"/>\n\t<c path=\"String\"/>\n\t<c path=\"qoid.api.ChannelMessage\"/>\n\t<x path=\"Void\"/>\n</f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
qoid.api.ChannelRequestMessageBundle.__rtti = "<class path=\"qoid.api.ChannelRequestMessageBundle\" params=\"\" module=\"qoid.api.CrudMessage\">\n\t<channel><c path=\"String\"/></channel>\n\t<requests><c path=\"Array\"><c path=\"qoid.api.ChannelRequestMessage\"/></c></requests>\n\t<addChannelRequest public=\"1\" set=\"method\" line=\"186\"><f a=\"request\">\n\t<c path=\"qoid.api.ChannelRequestMessage\"/>\n\t<x path=\"Void\"/>\n</f></addChannelRequest>\n\t<addRequest public=\"1\" set=\"method\" line=\"190\"><f a=\"path:context:parms\">\n\t<c path=\"String\"/>\n\t<c path=\"String\"/>\n\t<c path=\"qoid.api.BennuMessage\"/>\n\t<x path=\"Void\"/>\n</f></addRequest>\n\t<new public=\"1\" set=\"method\" line=\"177\"><f a=\"?requests_\" v=\"null\">\n\t<c path=\"Array\"><c path=\"qoid.api.ChannelRequestMessage\"/></c>\n\t<x path=\"Void\"/>\n</f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
qoid.model.LabelChild.__rtti = "<class path=\"qoid.model.LabelChild\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ModelObjWithIid\"/>\n\t<identifier public=\"1\" set=\"method\" line=\"133\" static=\"1\"><f a=\"l\">\n\t<c path=\"qoid.model.LabelChild\"/>\n\t<c path=\"String\"/>\n</f></identifier>\n\t<parentIid public=\"1\"><c path=\"String\"/></parentIid>\n\t<childIid public=\"1\"><c path=\"String\"/></childIid>\n\t<data public=\"1\">\n\t\t<d/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</data>\n\t<new public=\"1\" set=\"method\" line=\"124\"><f a=\"?parentIid:?childIid\" v=\"null:null\">\n\t<c path=\"String\"/>\n\t<c path=\"String\"/>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
qoid.model.LabelAcl.__rtti = "<class path=\"qoid.model.LabelAcl\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ModelObjWithIid\"/>\n\t<identifier public=\"1\" set=\"method\" line=\"148\" static=\"1\"><f a=\"l\">\n\t<c path=\"qoid.model.LabelAcl\"/>\n\t<c path=\"String\"/>\n</f></identifier>\n\t<connectionIid public=\"1\"><c path=\"String\"/></connectionIid>\n\t<labelIid public=\"1\"><c path=\"String\"/></labelIid>\n\t<new public=\"1\" set=\"method\" line=\"142\"><f a=\"?connectionIid:?labelIid\" v=\"null:null\">\n\t<c path=\"String\"/>\n\t<c path=\"String\"/>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
qoid.model.Connection.__rtti = "<class path=\"qoid.model.Connection\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ModelObjWithIid\"/>\n\t<identifier public=\"1\" set=\"method\" line=\"161\" static=\"1\"><f a=\"c\">\n\t<c path=\"qoid.model.Connection\"/>\n\t<c path=\"String\"/>\n</f></identifier>\n\t<aliasIid public=\"1\"><c path=\"String\"/></aliasIid>\n\t<localPeerId public=\"1\"><c path=\"String\"/></localPeerId>\n\t<remotePeerId public=\"1\"><c path=\"String\"/></remotePeerId>\n\t<allowedDegreesOfVisibility public=\"1\"><x path=\"Int\"/></allowedDegreesOfVisibility>\n\t<metaLabelIid public=\"1\"><c path=\"String\"/></metaLabelIid>\n\t<data public=\"1\">\n\t\t<c path=\"qoid.model.Profile\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</data>\n\t<equals public=\"1\" set=\"method\" line=\"170\"><f a=\"c\">\n\t<c path=\"qoid.model.Connection\"/>\n\t<x path=\"Bool\"/>\n</f></equals>\n\t<new public=\"1\" set=\"method\" line=\"165\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.ContentType.AUDIO = "AUDIO";
qoid.model.ContentType.IMAGE = "IMAGE";
qoid.model.ContentType.URL = "URL";
qoid.model.ContentType.TEXT = "TEXT";
qoid.model.ContentType.VERIFICATION = "VERIFICATION";
qoid.model.ContentType.CONFIG = "com.qoid.apps.aphoto.config";
qoid.model.LabeledContent.__rtti = "<class path=\"qoid.model.LabeledContent\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ModelObjWithIid\"/>\n\t<identifier public=\"1\" set=\"method\" line=\"257\" static=\"1\"><f a=\"l\">\n\t<c path=\"qoid.model.LabeledContent\"/>\n\t<c path=\"String\"/>\n</f></identifier>\n\t<contentIid public=\"1\"><c path=\"String\"/></contentIid>\n\t<labelIid public=\"1\"><c path=\"String\"/></labelIid>\n\t<data public=\"1\">\n\t\t<d/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</data>\n\t<new public=\"1\" set=\"method\" line=\"261\"><f a=\"contentIid:labelIid\">\n\t<c path=\"String\"/>\n\t<c path=\"String\"/>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
qoid.model.ContentData.__rtti = "<class path=\"qoid.model.ContentData\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<new public=\"1\" set=\"method\" line=\"270\"><f a=\"\"><x path=\"Void\"/></f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
qoid.model.ContentVerification.__rtti = "<class path=\"qoid.model.ContentVerification\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<verifierId public=\"1\"><c path=\"String\"/></verifierId>\n\t<verificationIid public=\"1\"><c path=\"String\"/></verificationIid>\n\t<hash public=\"1\"><d/></hash>\n\t<hashAlgorithm public=\"1\"><c path=\"String\"/></hashAlgorithm>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
qoid.model.VerifiedContentMetaData.__rtti = "<class path=\"qoid.model.VerifiedContentMetaData\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<hash public=\"1\"><d/></hash>\n\t<hashAlgorithm public=\"1\"><c path=\"String\"/></hashAlgorithm>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
qoid.model.ContentMetaData.__rtti = "<class path=\"qoid.model.ContentMetaData\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<verifications public=\"1\">\n\t\t<c path=\"Array\"><c path=\"qoid.model.ContentVerification\"/></c>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</verifications>\n\t<verifiedContent public=\"1\">\n\t\t<c path=\"qoid.model.VerifiedContentMetaData\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</verifiedContent>\n\t<new public=\"1\" set=\"method\" line=\"293\"><f a=\"\"><x path=\"Void\"/></f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
qoid.model.Content.__rtti = "<class path=\"qoid.model.Content\" params=\"T\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ModelObjWithIid\"/>\n\t<contentType public=\"1\"><c path=\"String\"/></contentType>\n\t<aliasIid public=\"1\">\n\t\t<c path=\"String\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</aliasIid>\n\t<connectionIid public=\"1\">\n\t\t<c path=\"String\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</connectionIid>\n\t<metaData public=\"1\">\n\t\t<c path=\"qoid.model.ContentMetaData\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</metaData>\n\t<data><d/></data>\n\t<props public=\"1\">\n\t\t<c path=\"qoid.model.Content.T\"/>\n\t\t<meta><m n=\":transient\"/></meta>\n\t</props>\n\t<type>\n\t\t<x path=\"Class\"><c path=\"qoid.model.Content.T\"/></x>\n\t\t<meta><m n=\":transient\"/></meta>\n\t</type>\n\t<setData public=\"1\" set=\"method\" line=\"320\"><f a=\"data\">\n\t<d/>\n\t<x path=\"Void\"/>\n</f></setData>\n\t<readResolve set=\"method\" line=\"324\"><f a=\"\"><x path=\"Void\"/></f></readResolve>\n\t<writeResolve set=\"method\" line=\"328\"><f a=\"\"><x path=\"Void\"/></f></writeResolve>\n\t<getTimestamp public=\"1\" set=\"method\" line=\"332\"><f a=\"\"><c path=\"String\"/></f></getTimestamp>\n\t<objectType public=\"1\" set=\"method\" line=\"336\" override=\"1\"><f a=\"\"><c path=\"String\"/></f></objectType>\n\t<new public=\"1\" set=\"method\" line=\"309\"><f a=\"contentType:type\">\n\t<c path=\"String\"/>\n\t<x path=\"Class\"><c path=\"qoid.model.Content.T\"/></x>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
qoid.model.ImageContentData.__rtti = "<class path=\"qoid.model.ImageContentData\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ContentData\"/>\n\t<imgSrc public=\"1\"><c path=\"String\"/></imgSrc>\n\t<caption public=\"1\">\n\t\t<c path=\"String\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</caption>\n\t<new public=\"1\" set=\"method\" line=\"345\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.ImageContent.__rtti = "<class path=\"qoid.model.ImageContent\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.Content\"><c path=\"qoid.model.ImageContentData\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"351\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.AudioContentData.__rtti = "<class path=\"qoid.model.AudioContentData\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ContentData\"/>\n\t<audioSrc public=\"1\"><c path=\"String\"/></audioSrc>\n\t<audioType public=\"1\">\n\t\t<c path=\"String\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</audioType>\n\t<title public=\"1\">\n\t\t<c path=\"String\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</title>\n\t<new public=\"1\" set=\"method\" line=\"361\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.AudioContent.__rtti = "<class path=\"qoid.model.AudioContent\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.Content\"><c path=\"qoid.model.AudioContentData\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"367\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.MessageContentData.__rtti = "<class path=\"qoid.model.MessageContentData\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ContentData\"/>\n\t<text public=\"1\"><c path=\"String\"/></text>\n\t<new public=\"1\" set=\"method\" line=\"375\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.MessageContent.__rtti = "<class path=\"qoid.model.MessageContent\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.Content\"><c path=\"qoid.model.MessageContentData\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"381\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.ConfigContentData.__rtti = "<class path=\"qoid.model.ConfigContentData\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ContentData\"/>\n\t<defaultImg public=\"1\"><c path=\"String\"/></defaultImg>\n\t<new public=\"1\" set=\"method\" line=\"389\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.ConfigContent.__rtti = "<class path=\"qoid.model.ConfigContent\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.Content\"><c path=\"qoid.model.ConfigContentData\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"395\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.UrlContentData.__rtti = "<class path=\"qoid.model.UrlContentData\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ContentData\"/>\n\t<url public=\"1\"><c path=\"String\"/></url>\n\t<text public=\"1\">\n\t\t<c path=\"String\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</text>\n\t<new public=\"1\" set=\"method\" line=\"404\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.UrlContent.__rtti = "<class path=\"qoid.model.UrlContent\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.Content\"><c path=\"qoid.model.UrlContentData\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"410\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.VerificationContentData.__rtti = "<class path=\"qoid.model.VerificationContentData\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ContentData\"/>\n\t<text public=\"1\"><c path=\"String\"/></text>\n\t<created public=\"1\"><c path=\"Date\"/></created>\n\t<modified public=\"1\"><c path=\"Date\"/></modified>\n\t<new public=\"1\" set=\"method\" line=\"419\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.VerificationContent.__rtti = "<class path=\"qoid.model.VerificationContent\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.Content\"><c path=\"qoid.model.VerificationContentData\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"425\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.Notification.__rtti = "<class path=\"qoid.model.Notification\" params=\"T\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ModelObjWithIid\"/>\n\t<consumed public=\"1\"><x path=\"Bool\"/></consumed>\n\t<fromConnectionIid public=\"1\"><c path=\"String\"/></fromConnectionIid>\n\t<kind public=\"1\"><e path=\"qoid.model.NotificationKind\"/></kind>\n\t<data><d/></data>\n\t<props public=\"1\">\n\t\t<c path=\"qoid.model.Notification.T\"/>\n\t\t<meta><m n=\":transient\"/></meta>\n\t</props>\n\t<type>\n\t\t<x path=\"Class\"><c path=\"qoid.model.Notification.T\"/></x>\n\t\t<meta><m n=\":transient\"/></meta>\n\t</type>\n\t<objectType public=\"1\" set=\"method\" line=\"474\" override=\"1\"><f a=\"\"><c path=\"String\"/></f></objectType>\n\t<readResolve set=\"method\" line=\"486\"><f a=\"\"><x path=\"Void\"/></f></readResolve>\n\t<writeResolve set=\"method\" line=\"490\"><f a=\"\"><x path=\"Void\"/></f></writeResolve>\n\t<new public=\"1\" set=\"method\" line=\"478\"><f a=\"kind:type\">\n\t<e path=\"qoid.model.NotificationKind\"/>\n\t<x path=\"Class\"><c path=\"qoid.model.Notification.T\"/></x>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
qoid.model.IntroductionRequest.__rtti = "<class path=\"qoid.model.IntroductionRequest\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ModelObjWithIid\"/>\n\t<aConnectionIid public=\"1\"><c path=\"String\"/></aConnectionIid>\n\t<bConnectionIid public=\"1\"><c path=\"String\"/></bConnectionIid>\n\t<aMessage public=\"1\"><c path=\"String\"/></aMessage>\n\t<bMessage public=\"1\"><c path=\"String\"/></bMessage>\n\t<new public=\"1\" set=\"method\" line=\"503\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.Introduction.__rtti = "<class path=\"qoid.model.Introduction\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ModelObjWithIid\"/>\n\t<aConnectionIid public=\"1\"><c path=\"String\"/></aConnectionIid>\n\t<bConnectionIid public=\"1\"><c path=\"String\"/></bConnectionIid>\n\t<aState public=\"1\"><e path=\"qoid.model.IntroductionState\"/></aState>\n\t<bState public=\"1\"><e path=\"qoid.model.IntroductionState\"/></bState>\n\t<recordVersion public=\"1\"><x path=\"Int\"/></recordVersion>\n\t<new public=\"1\" set=\"method\" line=\"510\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.IntroductionRequestNotification.__rtti = "<class path=\"qoid.model.IntroductionRequestNotification\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.Notification\"><c path=\"qoid.model.IntroductionRequestData\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"520\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.IntroductionRequestData.__rtti = "<class path=\"qoid.model.IntroductionRequestData\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<introductionIid public=\"1\"><c path=\"String\"/></introductionIid>\n\t<message public=\"1\"><c path=\"String\"/></message>\n\t<profile public=\"1\"><c path=\"qoid.model.Profile\"/></profile>\n\t<accepted public=\"1\">\n\t\t<x path=\"Bool\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</accepted>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
qoid.model.VerificationRequestNotification.__rtti = "<class path=\"qoid.model.VerificationRequestNotification\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.Notification\"><c path=\"qoid.model.VerificationRequestData\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"533\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.VerificationRequestData.__rtti = "<class path=\"qoid.model.VerificationRequestData\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<contentIid public=\"1\"><c path=\"String\"/></contentIid>\n\t<contentType public=\"1\"><c path=\"qoid.model.ContentType\"/></contentType>\n\t<contentData public=\"1\"><d/></contentData>\n\t<message public=\"1\"><c path=\"String\"/></message>\n\t<getContent public=\"1\" set=\"method\" line=\"545\">\n\t\t<f a=\"\"><c path=\"qoid.model.Content\"><d/></c></f>\n\t\t<meta><m n=\":transient\"/></meta>\n\t</getContent>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
qoid.model.VerificationResponseNotification.__rtti = "<class path=\"qoid.model.VerificationResponseNotification\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.Notification\"><c path=\"qoid.model.VerificationResponseData\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"565\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.VerificationResponseData.__rtti = "<class path=\"qoid.model.VerificationResponseData\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<contentIid public=\"1\"><c path=\"String\"/></contentIid>\n\t<verificationContentIid public=\"1\"><c path=\"String\"/></verificationContentIid>\n\t<verificationContentData public=\"1\"><d/></verificationContentData>\n\t<verifierId public=\"1\"><c path=\"String\"/></verifierId>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
qoid.model.Login.__rtti = "<class path=\"qoid.model.Login\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ModelObj\"/>\n\t<agentId public=\"1\"><c path=\"String\"/></agentId>\n\t<password public=\"1\"><c path=\"String\"/></password>\n\t<new public=\"1\" set=\"method\" line=\"582\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.NewUser.__rtti = "<class path=\"qoid.model.NewUser\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ModelObj\"/>\n\t<name public=\"1\"><c path=\"String\"/></name>\n\t<userName public=\"1\"><c path=\"String\"/></userName>\n\t<email public=\"1\"><c path=\"String\"/></email>\n\t<pwd public=\"1\"><c path=\"String\"/></pwd>\n\t<new public=\"1\" set=\"method\" line=\"595\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
pagent.PinterAgent.main();
})(typeof window != "undefined" ? window : exports);
