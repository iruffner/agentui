(function ($hx_exports) { "use strict";
$hx_exports.m3 = $hx_exports.m3 || {};
$hx_exports.m3.helper = $hx_exports.m3.helper || {};
;$hx_exports.m3.util = $hx_exports.m3.util || {};
$hx_exports.qoid = $hx_exports.qoid || {};
$hx_exports.agentui = $hx_exports.agentui || {};
$hx_exports.agentui.widget = $hx_exports.agentui.widget || {};
var $hxClasses = {},$estr = function() { return js.Boot.__string_rec(this,''); };
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
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && HxOverrides.substr(s,0,start.length) == start;
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
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; };
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; };
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
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
var agentui = {};
agentui.AgentUi = $hx_exports.agentui.AgentUi = function() { };
$hxClasses["agentui.AgentUi"] = agentui.AgentUi;
agentui.AgentUi.__name__ = ["agentui","AgentUi"];
agentui.AgentUi.main = function() {
	agentui.AgentUi.HOT_KEY_ACTIONS = new Array();
	agentui.api.EventDelegate.init();
	agentui.model.EM.addListener(qoid.QE.onAliasLoaded,function(a) {
		window.document.title = a.profile.name + " | Qoid-Bennu";
	});
	agentui.model.EM.addListener(agentui.model.EMEvent.FitWindow,function(n) {
		fitWindow();
	});
};
agentui.AgentUi.start = function() {
	var r = new $("<div></div>");
	agentui.AgentUi.HOT_KEY_ACTIONS.push(function(evt) {
		if(evt.altKey && evt.shiftKey && evt.keyCode == 82) {
			m3.log.Logga.get_DEFAULT().debug("ALT + SHIFT + R");
			r.restoreWidget("open");
		}
	});
	new $("body").keyup(function(evt1) {
		if(m3.helper.ArrayHelper.hasValues(agentui.AgentUi.HOT_KEY_ACTIONS)) Lambda.iter(agentui.AgentUi.HOT_KEY_ACTIONS,function(act) {
			act(evt1);
		});
	});
	new $("#sideRightSearchInput").keyup(function(evt2) {
		var search = new $(evt2.target);
		var cl = new $("#connections");
		agentui.widget.ConnectionListHelper.filterConnections(cl,search.val());
	});
	new $("#middleContainer #content #tabs").tabs({ beforeActivate : function(evt3,ui) {
		var max_height = Math.max(new $("#tabs-feed").height(),new $("#tabs-score").height());
		ui.newPanel.height(max_height);
	}});
	new $("#sideRight #chat").messagingComp();
	new $("#connections").connectionsList();
	new $("#labelsList").labelsList();
	new $("#filter").filterComp();
	new $("#feed").contentFeed();
	new $("#userId").AliasComp();
	new $("#postInput").postComp();
	new $("#sideRight #sideRightInvite").inviteComp();
	new $("#score-div").scoreComp();
	new $("body").click(function(evt4) {
		new $(".nonmodalPopup").hide();
	});
	r.appendTo(new $(window.document.body));
	r.restoreWidget();
	agentui.widget.DialogManager.showLogin();
};
agentui.api = {};
agentui.api.VerificationRequestMessage = function(vr) {
	this.contentIid = vr.contentIid;
	this.connectionIids = vr.connectionIids;
	this.message = vr.message;
};
$hxClasses["agentui.api.VerificationRequestMessage"] = agentui.api.VerificationRequestMessage;
agentui.api.VerificationRequestMessage.__name__ = ["agentui","api","VerificationRequestMessage"];
agentui.api.VerificationRequestMessage.prototype = {
	__class__: agentui.api.VerificationRequestMessage
};
agentui.api.VerificationResponseMessage = function(vr) {
	this.notificationIid = vr.notificationIid;
	this.verificationContent = vr.verificationContent;
};
$hxClasses["agentui.api.VerificationResponseMessage"] = agentui.api.VerificationResponseMessage;
agentui.api.VerificationResponseMessage.__name__ = ["agentui","api","VerificationResponseMessage"];
agentui.api.VerificationResponseMessage.prototype = {
	__class__: agentui.api.VerificationResponseMessage
};
agentui.api.AcceptVerificationMessage = function(notificationIid) {
	this.notificationIid = notificationIid;
};
$hxClasses["agentui.api.AcceptVerificationMessage"] = agentui.api.AcceptVerificationMessage;
agentui.api.AcceptVerificationMessage.__name__ = ["agentui","api","AcceptVerificationMessage"];
agentui.api.AcceptVerificationMessage.prototype = {
	__class__: agentui.api.AcceptVerificationMessage
};
agentui.api.IntroResponseMessage = function(notificationIid,accepted) {
	this.notificationIid = notificationIid;
	this.accepted = accepted;
};
$hxClasses["agentui.api.IntroResponseMessage"] = agentui.api.IntroResponseMessage;
agentui.api.IntroResponseMessage.__name__ = ["agentui","api","IntroResponseMessage"];
agentui.api.IntroResponseMessage.prototype = {
	__class__: agentui.api.IntroResponseMessage
};
agentui.api.EventDelegate = function() { };
$hxClasses["agentui.api.EventDelegate"] = agentui.api.EventDelegate;
agentui.api.EventDelegate.__name__ = ["agentui","api","EventDelegate"];
agentui.api.EventDelegate.init = function() {
	agentui.model.EM.addListener(agentui.model.EMEvent.FILTER_RUN,function(filterData) {
	});
	agentui.model.EM.addListener(agentui.model.EMEvent.DeleteAlias,function(alias) {
		qoid.QoidAPI.deleteAlias(alias.iid);
	});
	agentui.model.EM.addListener(agentui.model.EMEvent.UpdateAlias,function(alias1) {
		qoid.QoidAPI.updateAlias(alias1.iid,alias1.data);
	});
	agentui.model.EM.addListener(agentui.model.EMEvent.CreateAgent,function(user) {
		qoid.QoidAPI.createAgent(user.name,user.pwd);
	});
	agentui.model.EM.addListener(agentui.model.EMEvent.CreateContent,function(data) {
		qoid.QoidAPI.createContent(data.content.contentType,data.content,data.labelIids);
	});
	agentui.model.EM.addListener(agentui.model.EMEvent.UpdateContent,function(data1) {
		qoid.QoidAPI.updateContent(data1.content.iid,data1.content);
	});
	agentui.model.EM.addListener(agentui.model.EMEvent.DeleteContent,function(data2) {
		qoid.QoidAPI.deleteContent(data2.content.iid);
	});
	agentui.model.EM.addListener(agentui.model.EMEvent.CreateLabel,function(data3) {
		qoid.QoidAPI.createLabel(data3.parentIid,data3.label.name,data3.label.data);
	});
	agentui.model.EM.addListener(agentui.model.EMEvent.UpdateLabel,function(data4) {
		qoid.QoidAPI.updateLabel(data4.label.iid,data4.label.name,data4.label.data);
	});
	agentui.model.EM.addListener(agentui.model.EMEvent.MoveLabel,function(data5) {
		qoid.QoidAPI.moveLabel(data5.label.iid,data5.parentIid,data5.newParentId);
	});
	agentui.model.EM.addListener(agentui.model.EMEvent.CopyLabel,function(data6) {
		qoid.QoidAPI.copyLabel(data6.label.iid,data6.newParentId);
	});
	agentui.model.EM.addListener(agentui.model.EMEvent.DeleteLabel,function(data7) {
		qoid.QoidAPI.deleteLabel(data7.label.iid,data7.parentIid);
	});
	agentui.model.EM.addListener(agentui.model.EMEvent.RespondToIntroduction,function(n) {
	});
	agentui.model.EM.addListener(agentui.model.EMEvent.INTRODUCTION_REQUEST,function(intro) {
	});
	agentui.model.EM.addListener(agentui.model.EMEvent.GrantAccess,function(parms) {
		qoid.QoidAPI.grantAccess(parms.labelIid,parms.connectionIid,1);
	});
	agentui.model.EM.addListener(agentui.model.EMEvent.RevokeAccess,function(lacls) {
	});
	agentui.model.EM.addListener(agentui.model.EMEvent.DeleteConnection,function(c) {
		qoid.QoidAPI.deleteConnection(c.iid);
	});
	agentui.model.EM.addListener(agentui.model.EMEvent.UserLogout,function(c1) {
		qoid.QoidAPI.logout();
	});
	agentui.model.EM.addListener(agentui.model.EMEvent.VerificationRequest,function(vr) {
	});
	agentui.model.EM.addListener(agentui.model.EMEvent.RespondToVerification,function(vr1) {
	});
	agentui.model.EM.addListener(agentui.model.EMEvent.AcceptVerification,function(notificationIid) {
	});
	agentui.model.EM.addListener(agentui.model.EMEvent.RejectVerificationRequest,function(notificationIid1) {
	});
	agentui.model.EM.addListener(agentui.model.EMEvent.RejectVerification,function(notificationIid2) {
	});
};
agentui.model = {};
agentui.model.ContentSourceListener = function(mapListener,onBeforeSetContent,widgetCreator,content) {
	this.mapListener = mapListener;
	this.onBeforeSetContent = onBeforeSetContent;
	this.widgetCreator = widgetCreator;
	this.contentMap = new m3.observable.MappedSet(content,function(content1) {
		return widgetCreator(content1);
	});
	this.contentMap.mapListen(this.mapListener);
};
$hxClasses["agentui.model.ContentSourceListener"] = agentui.model.ContentSourceListener;
agentui.model.ContentSourceListener.__name__ = ["agentui","model","ContentSourceListener"];
agentui.model.ContentSourceListener.prototype = {
	__class__: agentui.model.ContentSourceListener
};
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
var m3 = {};
m3.observable = {};
m3.observable.OSet = function() { };
$hxClasses["m3.observable.OSet"] = m3.observable.OSet;
m3.observable.OSet.__name__ = ["m3","observable","OSet"];
m3.observable.OSet.prototype = {
	__class__: m3.observable.OSet
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
var haxe = {};
haxe.ds = {};
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
m3.util = {};
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
m3.event = {};
m3.event.EventManager = function() {
	this.hash = new haxe.ds.StringMap();
	this.oneTimers = new Array();
};
$hxClasses["m3.event.EventManager"] = m3.event.EventManager;
m3.event.EventManager.__name__ = ["m3","event","EventManager"];
m3.event.EventManager.get_instance = function() {
	if(m3.event.EventManager.instance == null) m3.event.EventManager.instance = new m3.event.EventManager();
	return m3.event.EventManager.instance;
};
m3.event.EventManager.prototype = {
	on: function(id,func,listenerName) {
		return this.addListener(id,func,listenerName);
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
		this.oneTimers.push(listener.get_uid());
		return this.addListenerInternal(id,listener);
	}
	,removeListener: function(id,listenerUid) {
		var map = this.hash.get(id);
		if(map == null) m3.log.Logga.get_DEFAULT().warn("removeListener called for unknown uuid"); else {
			HxOverrides.remove(this.oneTimers,listenerUid);
			map.remove(listenerUid);
		}
	}
	,fire: function(id,t) {
		this.change(id,t);
	}
	,change: function(id,t) {
		var logger = m3.log.Logga.get_DEFAULT();
		logger.debug("EVENTMODEL: Change to " + id);
		var map = this.hash.get(id);
		if(map == null) {
			logger.warn("No listeners for event " + id);
			return;
		}
		var iter = map.iterator();
		while(iter.hasNext()) {
			var listener = iter.next();
			logger.debug("Notifying " + listener.get_name() + " of " + id + " event");
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
				logger.error("Error executing " + listener.get_name() + " of " + id + " event",m3.log.Logga.getExceptionInst(err));
			}
		}
	}
	,__class__: m3.event.EventManager
};
agentui.model.EM = function() { };
$hxClasses["agentui.model.EM"] = agentui.model.EM;
agentui.model.EM.__name__ = ["agentui","model","EM"];
agentui.model.EM.addListener = function(id,func,listenerName) {
	return agentui.model.EM.delegate.addListener(id,func,listenerName);
};
agentui.model.EM.listenOnce = function(id,func,listenerName) {
	return agentui.model.EM.delegate.listenOnce(id,func,listenerName);
};
agentui.model.EM.removeListener = function(id,listenerUid) {
	agentui.model.EM.delegate.removeListener(id,listenerUid);
};
agentui.model.EM.change = function(id,t) {
	agentui.model.EM.delegate.change(id,t);
};
qoid.QE = function() { };
$hxClasses["qoid.QE"] = qoid.QE;
qoid.QE.__name__ = ["qoid","QE"];
agentui.model.EMEvent = function() { };
$hxClasses["agentui.model.EMEvent"] = agentui.model.EMEvent;
agentui.model.EMEvent.__name__ = ["agentui","model","EMEvent"];
m3.serialization = {};
m3.serialization.Serializer = function(defaultToStrict) {
	if(defaultToStrict == null) defaultToStrict = true;
	this._defaultToStrict = defaultToStrict;
	this._handlersMap = new haxe.ds.StringMap();
	this.addHandlerViaName("Array<Dynamic>",new m3.serialization.DynamicArrayHandler());
};
$hxClasses["m3.serialization.Serializer"] = m3.serialization.Serializer;
m3.serialization.Serializer.__name__ = ["m3","serialization","Serializer"];
m3.serialization.Serializer.get_instance = function() {
	if(m3.serialization.Serializer.instance == null) m3.serialization.Serializer.instance = new m3.serialization.Serializer();
	return m3.serialization.Serializer.instance;
};
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
qoid.model.Content = function(contentType,type) {
	qoid.model.ModelObjWithIid.call(this);
	this.contentType = contentType;
	if(qoid.Qoid.get_currentAlias() == null) this.aliasIid = null; else this.aliasIid = qoid.Qoid.get_currentAlias().iid;
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
		this.props = m3.serialization.Serializer.get_instance().fromJsonX(this.data,this.type);
	}
	,writeResolve: function() {
		this.data = m3.serialization.Serializer.get_instance().toJson(this.props);
	}
	,getTimestamp: function() {
		return DateTools.format(this.created,"%Y-%m-%d %T");
	}
	,objectType: function() {
		return "content";
	}
	,__class__: qoid.model.Content
});
m3.helper = {};
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
qoid.QoidAPI = $hx_exports.qoid.QoidAPI = function() { };
$hxClasses["qoid.QoidAPI"] = qoid.QoidAPI;
qoid.QoidAPI.__name__ = ["qoid","QoidAPI"];
qoid.QoidAPI.main = function() {
};
qoid.QoidAPI.set_activeChannel = function(c) {
	qoid.QoidAPI.activeChannel = c;
	return qoid.QoidAPI.get_activeChannel();
};
qoid.QoidAPI.get_activeChannel = function() {
	return qoid.QoidAPI.activeChannel;
};
qoid.QoidAPI.set_activeAlias = function(a) {
	qoid.QoidAPI.activeAlias = a;
	return qoid.QoidAPI.get_activeAlias();
};
qoid.QoidAPI.get_activeAlias = function() {
	return qoid.QoidAPI.activeAlias;
};
qoid.QoidAPI.addChannel = function(c) {
	qoid.QoidAPI.channels.push(c);
};
qoid.QoidAPI.removeChannel = function(c) {
	return HxOverrides.remove(qoid.QoidAPI.channels,c);
};
qoid.QoidAPI.get_headers = function() {
	var ret = new haxe.ds.StringMap();
	ret.set("Qoid-ChannelId",qoid.QoidAPI.get_activeChannel());
	return ret;
};
qoid.QoidAPI.createAgent = function(name,password) {
	var json = { name : name, password : password};
	new m3.comm.JsonRequest(json,qoid.QoidAPI.AGENT_CREATE,function(data) {
		m3.event.EventManager.get_instance().change(qoid.QE.onAgentCreated,data);
	},function(exc) {
		js.Lib.alert(exc);
	}).start();
};
qoid.QoidAPI.login = function(authenticationId,password) {
	var json = { authenticationId : authenticationId, password : password};
	new m3.comm.JsonRequest(json,qoid.QoidAPI.LOGIN,qoid.QoidAPI.onLogin,qoid.QoidAPI.onLoginError).start();
};
qoid.QoidAPI.onLoginError = function(exc) {
	js.Lib.alert(exc);
};
qoid.QoidAPI.onLogin = function(data) {
	var auth = data;
	qoid.QoidAPI.addChannel(auth.channelId);
	qoid.QoidAPI.set_activeChannel(auth.channelId);
	qoid.QoidAPI.set_activeAlias(auth.connectionIid);
	qoid.QoidAPI._startPolling(auth.channelId);
	var context = "initialDataLoad";
	var sychoronizer = new qoid.Synchronizer(context,9,qoid.QoidAPI.onInitialDataload);
	var requests = [new m3.comm.ChannelRequestMessage(qoid.QoidAPI.QUERY,context + "-alias",qoid.QoidAPI.createQueryJson("alias")),new m3.comm.ChannelRequestMessage(qoid.QoidAPI.QUERY,context + "-introduction",qoid.QoidAPI.createQueryJson("introduction")),new m3.comm.ChannelRequestMessage(qoid.QoidAPI.QUERY,context + "-connection",qoid.QoidAPI.createQueryJson("connection")),new m3.comm.ChannelRequestMessage(qoid.QoidAPI.QUERY,context + "-notification",qoid.QoidAPI.createQueryJson("notification","consumed='0'")),new m3.comm.ChannelRequestMessage(qoid.QoidAPI.QUERY,context + "-label",qoid.QoidAPI.createQueryJson("label")),new m3.comm.ChannelRequestMessage(qoid.QoidAPI.QUERY,context + "-labelAcl",qoid.QoidAPI.createQueryJson("labelAcl")),new m3.comm.ChannelRequestMessage(qoid.QoidAPI.QUERY,context + "-labeledContent",qoid.QoidAPI.createQueryJson("labeledContent")),new m3.comm.ChannelRequestMessage(qoid.QoidAPI.QUERY,context + "-labelChild",qoid.QoidAPI.createQueryJson("labelChild")),new m3.comm.ChannelRequestMessage(qoid.QoidAPI.QUERY,context + "-profile",qoid.QoidAPI.createQueryJson("profile"))];
	new qoid.SubmitRequest(qoid.QoidAPI.get_activeChannel(),requests,qoid.QoidAPI.onSuccess,qoid.QoidAPI.onError).requestHeaders(qoid.QoidAPI.get_headers()).start();
	m3.event.EventManager.get_instance().change(qoid.QE.onUserLogin);
};
qoid.QoidAPI.onInitialDataload = function(data) {
	qoid.Qoid.aliases.addAll(data.aliases);
	qoid.Qoid.connections.addAll(data.connections);
	qoid.Qoid.labels.addAll(data.labels);
	qoid.Qoid.labelChildren.addAll(data.labelChildren);
	qoid.Qoid.introductions.addAll(data.introductions);
	qoid.Qoid.notifications.addAll(data.notifications);
	qoid.Qoid.labeledContent.addAll(data.labeledContent);
	qoid.Qoid.labelAcls.addAll(data.labelAcls);
	qoid.Qoid.profiles.addAll(data.profiles);
	var $it0 = qoid.Qoid.aliases.iterator();
	while( $it0.hasNext() ) {
		var alias_ = $it0.next();
		var $it1 = qoid.Qoid.profiles.iterator();
		while( $it1.hasNext() ) {
			var profile_ = $it1.next();
			if(profile_.aliasIid == alias_.iid) {
				alias_.profile = profile_;
				qoid.Qoid.aliases.update(alias_);
			}
		}
	}
	qoid.Qoid.onInitialDataLoadComplete(qoid.QoidAPI.get_activeAlias());
	m3.event.EventManager.get_instance().change(qoid.QE.onInitialDataload);
};
qoid.QoidAPI._startPolling = function(channelId) {
	var timeout = 10000;
	var ajaxOptions = { contentType : ""};
	var lpr = new m3.comm.LongPollingRequest(channelId,qoid.ResponseProcessor.processResponse,null,ajaxOptions,"/api/v1/channel/poll");
	lpr.timeout = timeout;
	lpr.requestHeaders(qoid.QoidAPI.get_headers());
	lpr.start();
	qoid.QoidAPI.longPolls.set(channelId,lpr);
};
qoid.QoidAPI.query = function(type,query,historical,standing,route) {
};
qoid.QoidAPI.createQueryJson = function(type,query,historical,standing,route) {
	if(standing == null) standing = true;
	if(historical == null) historical = true;
	if(query == null) query = "1=1";
	var ret = { type : type, query : query, historical : historical, standing : standing};
	if(route != null) ret.route = route;
	return ret;
};
qoid.QoidAPI.getProfile = function(connectionIid) {
	var json = qoid.QoidAPI.createQueryJson("profile",null,true,false,[connectionIid]);
	qoid.QoidAPI.submitRequest(json,qoid.QoidAPI.QUERY,"connectionProfile");
};
qoid.QoidAPI.getVerificationContent = function(connectionIids,iids) {
	var json = qoid.QoidAPI.createQueryJson("content","iid in (" + iids.join(",") + ")",true,false);
	qoid.QoidAPI.submitRequest(json,qoid.QoidAPI.QUERY,"verificationContent");
};
qoid.QoidAPI.cancelQuery = function(context) {
	qoid.QoidAPI.submitRequest({ },qoid.QoidAPI.QUERY_CANCEL,context);
};
qoid.QoidAPI.logout = function() {
	new m3.comm.JsonRequest({ },qoid.QoidAPI.LOGOUT).start();
};
qoid.QoidAPI.spawnSession = function(aliasIid) {
	var json = { authenticationId : aliasIid};
	qoid.QoidAPI.submitRequest(json,qoid.QoidAPI.SPAWN,"spawnSession");
};
qoid.QoidAPI.createAlias = function(profileName,profileImage,data,route) {
	var json = { name : profileName, profileName : profileName, profileImage : profileImage};
	if(route != null) json.route = route;
	if(data != null) json.data = data;
	qoid.QoidAPI.submitRequest(json,qoid.QoidAPI.ALIAS_CREATE,"createAlias");
};
qoid.QoidAPI.updateAlias = function(aliasIid,data,route) {
	var json = { aliasIid : aliasIid, data : data};
	if(route != null) json.route = route;
	qoid.QoidAPI.submitRequest(json,qoid.QoidAPI.ALIAS_UPDATE,"updateAlias");
};
qoid.QoidAPI.deleteAlias = function(aliasIid,route) {
	var json = { aliasIid : aliasIid};
	if(route != null) json.route = route;
	qoid.QoidAPI.submitRequest(json,qoid.QoidAPI.ALIAS_DELETE,"deleteAlias");
};
qoid.QoidAPI.createAliasLogin = function(aliasIid,password,route) {
	var json = { aliasIid : aliasIid, password : password};
	if(route != null) json.route = route;
	qoid.QoidAPI.submitRequest(json,qoid.QoidAPI.ALIAS_LOGIN_CREATE,"createAliasLogin");
};
qoid.QoidAPI.updateAliasLogin = function(aliasIid,password,route) {
	var json = { aliasIid : aliasIid, password : password};
	if(route != null) json.route = route;
	qoid.QoidAPI.submitRequest(json,qoid.QoidAPI.ALIAS_LOGIN_UPDATE,"updateAliasLogin");
};
qoid.QoidAPI.deleteAliasLogin = function(aliasIid,route) {
	var json = { aliasIid : aliasIid};
	if(route != null) json.route = route;
	qoid.QoidAPI.submitRequest(json,qoid.QoidAPI.ALIAS_LOGIN_DELETE,"deleteAliasLogin");
};
qoid.QoidAPI.updateAliasProfile = function(aliasIid,profileName,profileImage,route) {
	var json = { aliasIid : aliasIid, profileName : profileName, profileImage : profileImage};
	if(route != null) json.route = route;
	qoid.QoidAPI.submitRequest(json,qoid.QoidAPI.ALIAS_PROFILE_UPDATE,"updateAliasProfile");
};
qoid.QoidAPI.deleteConnection = function(connectionIid,route) {
	var json = { connectionIid : connectionIid};
	if(route != null) json.route = route;
	qoid.QoidAPI.submitRequest(json,qoid.QoidAPI.CONNECTION_DELETE,"deleteConnection");
};
qoid.QoidAPI.createContent = function(contentType,data,labelIids,route) {
	var json = { contentType : contentType, data : data, labelIids : labelIids};
	if(route != null) json.route = route;
	qoid.QoidAPI.submitRequest(json,qoid.QoidAPI.CONTENT_CREATE,"createContent");
};
qoid.QoidAPI.updateContent = function(contentIid,data,route) {
	var json = { contentIid : contentIid, data : data};
	if(route != null) json.route = route;
	qoid.QoidAPI.submitRequest(json,qoid.QoidAPI.CONTENT_UPDATE,"updateContent");
};
qoid.QoidAPI.deleteContent = function(contentIid,route) {
	var json = { contentIid : contentIid};
	if(route != null) json.route = route;
	qoid.QoidAPI.submitRequest(json,qoid.QoidAPI.CONTENT_DELETE,"deleteContent");
};
qoid.QoidAPI.addContentLabel = function(contentIid,labelIid,route) {
	var json = { contentIid : contentIid, labelIid : labelIid};
	if(route != null) json.route = route;
	qoid.QoidAPI.submitRequest(json,qoid.QoidAPI.CONTENT_LABEL_ADD,"addContentLabel");
};
qoid.QoidAPI.removeContentLabel = function(contentIid,labelIid,route) {
	var json = { contentIid : contentIid, labelIid : labelIid};
	if(route != null) json.route = route;
	qoid.QoidAPI.submitRequest(json,qoid.QoidAPI.CONTENT_LABEL_REMOVE,"removeContentLabel");
};
qoid.QoidAPI.createLabel = function(parentLabelIid,name,data,route) {
	var json = { parentLabelIid : parentLabelIid, name : name, data : data};
	if(route != null) json.route = route;
	qoid.QoidAPI.submitRequest(json,qoid.QoidAPI.LABEL_CREATE,"createLabel");
};
qoid.QoidAPI.updateLabel = function(labelIid,name,data,route) {
	var json = { labelIid : labelIid, name : name, data : data};
	if(route != null) json.route = route;
	qoid.QoidAPI.submitRequest(json,qoid.QoidAPI.LABEL_UPDATE,"updateLabel");
};
qoid.QoidAPI.moveLabel = function(labelIid,oldParentLabelIid,newParentLabelIid,route) {
	var json = { labelIid : labelIid, oldParentLabelIid : oldParentLabelIid, newParentLabelIid : newParentLabelIid};
	if(route != null) json.route = route;
	qoid.QoidAPI.submitRequest(json,qoid.QoidAPI.LABEL_MOVE,"moveLabel");
};
qoid.QoidAPI.copyLabel = function(labelIid,newParentLabelIid,route) {
	var json = { labelIid : labelIid, newParentLabelIid : newParentLabelIid};
	if(route != null) json.route = route;
	qoid.QoidAPI.submitRequest(json,qoid.QoidAPI.LABEL_COPY,"copyLabel");
};
qoid.QoidAPI.deleteLabel = function(labelIid,parentLabelIid,route) {
	var json = { labelIid : labelIid, parentLabelIid : parentLabelIid};
	if(route != null) json.route = route;
	qoid.QoidAPI.submitRequest(json,qoid.QoidAPI.LABEL_DELETE,"deleteLabel");
};
qoid.QoidAPI.grantAccess = function(labelIid,connectionIid,maxDoV,route) {
	var json = { labelIid : labelIid, connectionIid : connectionIid, maxDoV : maxDoV};
	if(route != null) json.route = route;
	qoid.QoidAPI.submitRequest(json,qoid.QoidAPI.LABEL_ACCESS_GRANT,"grantAccess");
};
qoid.QoidAPI.revokeAccess = function(labelIid,connectionIid,route) {
	var json = { labelIid : labelIid, connectionIid : connectionIid};
	if(route != null) json.route = route;
	qoid.QoidAPI.submitRequest(json,qoid.QoidAPI.LABEL_ACCESS_REVOKE,"revokeAccess");
};
qoid.QoidAPI.updateAccess = function(labelIid,connectionIid,maxDoV,route) {
	var json = { labelIid : labelIid, connectionIid : connectionIid, maxDoV : maxDoV};
	if(route != null) json.route = route;
	qoid.QoidAPI.submitRequest(json,qoid.QoidAPI.LABEL_ACCESS_UPDATE,"updateAccess");
};
qoid.QoidAPI.createNotification = function(kind,data,route) {
	var json = { kind : kind, data : data};
	if(route != null) json.route = route;
	qoid.QoidAPI.submitRequest(json,qoid.QoidAPI.NOTIFICATION_CREATE,"createNotification");
};
qoid.QoidAPI.consumeNotification = function(notificationIid,route) {
	var json = { notificationIid : notificationIid};
	if(route != null) json.route = route;
	qoid.QoidAPI.submitRequest(json,qoid.QoidAPI.NOTIFICATION_CONSUME,"consumeNotification");
};
qoid.QoidAPI.deleteNotification = function(notificationIid,route) {
	var json = { notificationIid : notificationIid};
	if(route != null) json.route = route;
	qoid.QoidAPI.submitRequest(json,qoid.QoidAPI.NOTIFICATION_DELETE,"deleteNotification");
};
qoid.QoidAPI.initiateIntroduction = function(aConnectionIid,aMessage,bConnectionIid,bMessage,route) {
	var json = { aConnectionIid : aConnectionIid, aMessage : aMessage, bConnectionIid : bConnectionIid, bMessage : bMessage};
	if(route != null) json.route = route;
	qoid.QoidAPI.submitRequest(json,qoid.QoidAPI.INTRODUCTION_INITIATE,"initiateIntroduction");
};
qoid.QoidAPI.acceptIntroduction = function(notificationIid,route) {
	var json = { notificationIid : notificationIid};
	if(route != null) json.route = route;
	qoid.QoidAPI.submitRequest(json,qoid.QoidAPI.INTRODUCTION_ACCEPT,"acceptIntroduction");
};
qoid.QoidAPI.submitRequest = function(json,path,context) {
	var msg = new m3.comm.ChannelRequestMessage(path,context,json);
	new qoid.SubmitRequest(qoid.QoidAPI.get_activeChannel(),[msg],qoid.QoidAPI.onSuccess,qoid.QoidAPI.onError).requestHeaders(qoid.QoidAPI.get_headers()).start();
};
qoid.QoidAPI.onSuccess = function(data) {
	if(data.context == "spawnSession") {
		var auth = data.results[0];
		qoid.QoidAPI.addChannel(auth.channelId);
		qoid.QoidAPI.set_activeChannel(auth.channelId);
		m3.event.EventManager.get_instance().change("sessionSpawned",auth);
	}
};
qoid.QoidAPI.onError = function(ae) {
	m3.log.Logga.get_DEFAULT().error("QoidAPI Error",ae);
};
m3.comm = {};
m3.comm.ChannelRequestMessage = function(path,context,parms) {
	this.path = path;
	this.context = context;
	this.parms = parms;
};
$hxClasses["m3.comm.ChannelRequestMessage"] = m3.comm.ChannelRequestMessage;
m3.comm.ChannelRequestMessage.__name__ = ["m3","comm","ChannelRequestMessage"];
m3.comm.ChannelRequestMessage.prototype = {
	__class__: m3.comm.ChannelRequestMessage
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
m3.log.LogLevel.TRACE.toString = $estr;
m3.log.LogLevel.TRACE.__enum__ = m3.log.LogLevel;
m3.log.LogLevel.DEBUG = ["DEBUG",1];
m3.log.LogLevel.DEBUG.toString = $estr;
m3.log.LogLevel.DEBUG.__enum__ = m3.log.LogLevel;
m3.log.LogLevel.INFO = ["INFO",2];
m3.log.LogLevel.INFO.toString = $estr;
m3.log.LogLevel.INFO.__enum__ = m3.log.LogLevel;
m3.log.LogLevel.WARN = ["WARN",3];
m3.log.LogLevel.WARN.toString = $estr;
m3.log.LogLevel.WARN.__enum__ = m3.log.LogLevel;
m3.log.LogLevel.ERROR = ["ERROR",4];
m3.log.LogLevel.ERROR.toString = $estr;
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
m3.comm.BaseRequest = function(requestData,url,successFcn,errorFcn,accessDeniedFcn) {
	this.requestData = requestData;
	this._url = url;
	this.onSuccess = successFcn;
	this.onError = errorFcn;
	this.onAccessDenied = accessDeniedFcn;
	this._requestHeaders = new haxe.ds.StringMap();
};
$hxClasses["m3.comm.BaseRequest"] = m3.comm.BaseRequest;
m3.comm.BaseRequest.__name__ = ["m3","comm","BaseRequest"];
m3.comm.BaseRequest.prototype = {
	ajaxOpts: function(opts) {
		if(opts == null) return this.baseOpts; else {
			this.baseOpts = opts;
			return this;
		}
	}
	,requestHeaders: function(headers) {
		if(headers == null) return this._requestHeaders; else {
			this._requestHeaders = headers;
			return this;
		}
	}
	,beforeSend: function(jqXHR,settings) {
		var $it0 = this._requestHeaders.keys();
		while( $it0.hasNext() ) {
			var key = $it0.next();
			if(this._requestHeaders.get(key) != null) jqXHR.setRequestHeader(key,this._requestHeaders.get(key));
		}
	}
	,start: function(opts) {
		var _g = this;
		if(opts == null) opts = { };
		var ajaxOpts = { async : true, beforeSend : $bind(this,this.beforeSend), contentType : "application/json", dataType : "json", data : this.requestData, type : "POST", url : this._url, success : function(data,textStatus,jqXHR) {
			if(jqXHR.getResponseHeader("Content-Length") == "0") data = [];
			if(_g.onSuccess != null) _g.onSuccess(data);
		}, error : function(jqXHR1,textStatus1,errorThrown) {
			if(jqXHR1.status == 403 && _g.onAccessDenied != null) return _g.onAccessDenied();
			var errorMessage = null;
			if(m3.helper.StringHelper.isNotBlank(jqXHR1.message)) errorMessage = jqXHR1.message; else if(m3.helper.StringHelper.isNotBlank(jqXHR1.responseText) && jqXHR1.responseText.charAt(0) != "<") errorMessage = jqXHR1.responseText; else if(errorThrown == null || typeof(errorThrown) == "string") errorMessage = errorThrown; else errorMessage = errorThrown.message;
			if(m3.helper.StringHelper.isBlank(errorMessage)) errorMessage = "Error, but no error msg from server";
			m3.log.Logga.get_DEFAULT().error("Request Error handler: Status " + jqXHR1.status + " | " + errorMessage);
			var exc = new m3.exception.AjaxException(errorMessage,null,jqXHR1.status);
			if(_g.onError != null) _g.onError(exc); else throw exc;
		}};
		$.extend(ajaxOpts,this.baseOpts);
		$.extend(ajaxOpts,opts);
		return $.ajax(ajaxOpts);
	}
	,abort: function() {
	}
	,__class__: m3.comm.BaseRequest
};
m3.comm.JsonRequest = function(requestJson,url,successFcn,errorFcn,accessDeniedFcn) {
	m3.comm.BaseRequest.call(this,JSON.stringify(requestJson),url,successFcn,errorFcn,accessDeniedFcn);
};
$hxClasses["m3.comm.JsonRequest"] = m3.comm.JsonRequest;
m3.comm.JsonRequest.__name__ = ["m3","comm","JsonRequest"];
m3.comm.JsonRequest.__super__ = m3.comm.BaseRequest;
m3.comm.JsonRequest.prototype = $extend(m3.comm.BaseRequest.prototype,{
	__class__: m3.comm.JsonRequest
});
qoid.SubmitRequest = function(channel,msgs,successFcn,errorFcn) {
	this.baseOpts = { dataType : "text"};
	var bundle = new m3.comm.ChannelRequestMessageBundle(channel,msgs);
	var data = m3.serialization.Serializer.get_instance().toJson(bundle);
	m3.comm.JsonRequest.call(this,data,"/api/v1/channel/submit",successFcn,errorFcn);
};
$hxClasses["qoid.SubmitRequest"] = qoid.SubmitRequest;
qoid.SubmitRequest.__name__ = ["qoid","SubmitRequest"];
qoid.SubmitRequest.__super__ = m3.comm.JsonRequest;
qoid.SubmitRequest.prototype = $extend(m3.comm.JsonRequest.prototype,{
	__class__: qoid.SubmitRequest
});
m3.comm.ChannelRequestMessageBundle = function(channel,requests) {
	this.channel = channel;
	this.requests = requests;
};
$hxClasses["m3.comm.ChannelRequestMessageBundle"] = m3.comm.ChannelRequestMessageBundle;
m3.comm.ChannelRequestMessageBundle.__name__ = ["m3","comm","ChannelRequestMessageBundle"];
m3.comm.ChannelRequestMessageBundle.prototype = {
	add: function(request) {
		this.requests.push(request);
	}
	,createAndAdd: function(path,context,parms) {
		var request = new m3.comm.ChannelRequestMessage(path,context,parms);
		this.add(request);
	}
	,__class__: m3.comm.ChannelRequestMessageBundle
};
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
		case "AUDIO":
			obj = m3.serialization.Serializer.get_instance().fromJsonX(fromJson,qoid.model.AudioContent);
			break;
		case "IMAGE":
			obj = m3.serialization.Serializer.get_instance().fromJsonX(fromJson,qoid.model.ImageContent);
			break;
		case "TEXT":
			obj = m3.serialization.Serializer.get_instance().fromJsonX(fromJson,qoid.model.MessageContent);
			break;
		case "URL":
			obj = m3.serialization.Serializer.get_instance().fromJsonX(fromJson,qoid.model.UrlContent);
			break;
		case "VERIFICATION":
			obj = m3.serialization.Serializer.get_instance().fromJsonX(fromJson,qoid.model.VerificationContent);
			break;
		}
		return obj;
	}
	,write: function(value,writer) {
		return m3.serialization.Serializer.get_instance().toJson(value);
	}
	,__class__: qoid.model.ContentHandler
};
qoid.model.Notification = function(kind,type) {
	qoid.model.ModelObjWithIid.call(this);
	this.kind = kind;
	this.data = { };
	this.type = type;
	this.route = new Array();
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
		this.props = m3.serialization.Serializer.get_instance().fromJsonX(this.data,this.type);
	}
	,writeResolve: function() {
		this.data = m3.serialization.Serializer.get_instance().toJson(this.props);
	}
	,__class__: qoid.model.Notification
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
			obj = m3.serialization.Serializer.get_instance().fromJsonX(fromJson,qoid.model.IntroductionRequestNotification);
			break;
		case 1:
			obj = m3.serialization.Serializer.get_instance().fromJsonX(fromJson,qoid.model.VerificationRequestNotification);
			break;
		case 2:
			obj = m3.serialization.Serializer.get_instance().fromJsonX(fromJson,qoid.model.VerificationResponseNotification);
			break;
		}
		return obj;
	}
	,write: function(value,writer) {
		return m3.serialization.Serializer.get_instance().toJson(value);
	}
	,__class__: qoid.model.NotificationHandler
};
qoid.Qoid = function() { };
$hxClasses["qoid.Qoid"] = qoid.Qoid;
qoid.Qoid.__name__ = ["qoid","Qoid"];
qoid.Qoid.set_currentAlias = function(a) {
	qoid.Qoid.currentAlias = a;
	m3.event.EventManager.get_instance().change(qoid.QE.onAliasLoaded,qoid.Qoid.get_currentAlias());
	return qoid.Qoid.get_currentAlias();
};
qoid.Qoid.get_currentAlias = function() {
	return qoid.Qoid.currentAlias;
};
qoid.Qoid.onInitialDataLoadComplete = function(connectionIid) {
	var a = m3.helper.OSetHelper.getElementComplex(qoid.Qoid.aliases,connectionIid,"connectionIid");
	var $it0 = qoid.Qoid.aliases.iterator();
	while( $it0.hasNext() ) {
		var alias = $it0.next();
		if(alias.data.isDefault == true) {
			a = alias;
			break;
		}
	}
	qoid.Qoid.set_currentAlias(a);
};
qoid.Qoid.processProfile = function(rec) {
	var connectionIid = rec.route[0];
	var connection = m3.helper.OSetHelper.getElement(qoid.Qoid.connections,connectionIid);
	var profile = m3.serialization.Serializer.get_instance().fromJsonX(rec.results[0],qoid.model.Profile);
	profile.connectionIid = connectionIid;
	connection.data = profile;
	qoid.Qoid.connections.addOrUpdate(connection);
	qoid.Qoid.profiles.addOrUpdate(profile);
};
qoid.Qoid.getLabelDescendents = function(iid) {
	var labelDescendents = new m3.observable.ObservableSet(qoid.model.Label.identifier);
	var getDescendentIids;
	getDescendentIids = function(iid1,iidList) {
		iidList.splice(0,0,iid1);
		var children = new m3.observable.FilteredSet(qoid.Qoid.labelChildren,function(lc) {
			return lc.parentIid == iid1;
		}).asArray();
		var _g1 = 0;
		var _g = children.length;
		while(_g1 < _g) {
			var i = _g1++;
			getDescendentIids(children[i].childIid,iidList);
		}
	};
	var iid_list = new Array();
	getDescendentIids(iid,iid_list);
	var _g2 = 0;
	while(_g2 < iid_list.length) {
		var iid_ = iid_list[_g2];
		++_g2;
		var label = m3.helper.OSetHelper.getElement(qoid.Qoid.labels,iid_);
		if(label == null) m3.log.Logga.get_DEFAULT().error("LabelChild references missing label: " + iid_); else labelDescendents.add(label);
	}
	return labelDescendents;
};
qoid.Qoid.connectionFromMetaLabel = function(labelIid) {
	var ret = null;
	var $it0 = qoid.Qoid.connections.iterator();
	while( $it0.hasNext() ) {
		var connection = $it0.next();
		if(connection.labelIid == labelIid) {
			ret = connection;
			break;
		}
	}
	return ret;
};
agentui.model.ContentSource = function() { };
$hxClasses["agentui.model.ContentSource"] = agentui.model.ContentSource;
agentui.model.ContentSource.__name__ = ["agentui","model","ContentSource"];
agentui.model.ContentSource.addListener = function(ml,obsc,wc) {
	var l = new agentui.model.ContentSourceListener(ml,obsc,wc,agentui.model.ContentSource.filteredContent);
	agentui.model.ContentSource.listeners.push(l);
};
agentui.model.ContentSource.addContent = function(results,connectionIid) {
	var iids = new Array();
	var connectionIids = new Array();
	var _g = 0;
	while(_g < results.length) {
		var result = results[_g];
		++_g;
		var c = m3.serialization.Serializer.get_instance().fromJsonX(result,qoid.model.Content);
		if(connectionIid != null) {
			c.aliasIid = null;
			c.connectionIid = connectionIid;
		}
		agentui.model.ContentSource.filteredContent.addOrUpdate(c);
		var _g1 = 0;
		var _g2 = c.metaData.verifications;
		while(_g1 < _g2.length) {
			var v = _g2[_g1];
			++_g1;
			var p = m3.helper.OSetHelper.getElementComplex(qoid.Qoid.profiles,v.verifierId,"sharedId");
			if(HxOverrides.indexOf(connectionIids,p.connectionIid,0) == -1) connectionIids.push(p.connectionIid);
			iids.push("'" + v.verificationIid + "'");
		}
	}
	qoid.QoidAPI.getVerificationContent(connectionIids,iids);
};
agentui.model.ContentSource.onLoadFilteredContent = function(data) {
	if(agentui.model.ContentSource.handle == data.handle) agentui.model.ContentSource.addContent(data.results,data.connectionIid); else {
		agentui.model.ContentSource.clearQuery();
		agentui.model.ContentSource.handle = data.handle;
		agentui.model.ContentSource.beforeSetContent();
		agentui.model.ContentSource.addContent(data.results,data.connectionIid);
	}
};
agentui.model.ContentSource.clearQuery = function() {
	if(agentui.model.ContentSource.handle != null) {
		agentui.model.ContentSource.filteredContent.clear();
		agentui.model.ContentSource.handle = null;
	}
};
agentui.model.ContentSource.onAppendFilteredContent = function(data) {
	agentui.model.ContentSource.addContent(data.results,data.connectionIid);
};
agentui.model.ContentSource.onAliasLoaded = function(alias) {
	agentui.model.ContentSource.clearQuery();
};
agentui.model.ContentSource.beforeSetContent = function() {
	var _g = 0;
	var _g1 = agentui.model.ContentSource.listeners;
	while(_g < _g1.length) {
		var l = _g1[_g];
		++_g;
		l.onBeforeSetContent();
	}
};
agentui.model.Filter = function(node) {
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
$hxClasses["agentui.model.Filter"] = agentui.model.Filter;
agentui.model.Filter.__name__ = ["agentui","model","Filter"];
agentui.model.Filter.prototype = {
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
	,__class__: agentui.model.Filter
};
agentui.model.FilterData = function(type) {
	this.type = type;
	this.aliasIid = null;
	this.connectionIids = new Array();
};
$hxClasses["agentui.model.FilterData"] = agentui.model.FilterData;
agentui.model.FilterData.__name__ = ["agentui","model","FilterData"];
agentui.model.FilterData.prototype = {
	__class__: agentui.model.FilterData
};
agentui.model.FilterResponse = function(filterIid,content) {
	this.filterIid = filterIid;
	this.content = content;
};
$hxClasses["agentui.model.FilterResponse"] = agentui.model.FilterResponse;
agentui.model.FilterResponse.__name__ = ["agentui","model","FilterResponse"];
agentui.model.FilterResponse.prototype = {
	__class__: agentui.model.FilterResponse
};
agentui.model.Node = function(type) {
	this.type = "ROOT";
	if(type != null) this.type = type;
};
$hxClasses["agentui.model.Node"] = agentui.model.Node;
agentui.model.Node.__name__ = ["agentui","model","Node"];
agentui.model.Node.prototype = {
	addNode: function(n) {
		this.nodes.push(n);
	}
	,hasChildren: function() {
		return m3.helper.ArrayHelper.hasValues(this.nodes);
	}
	,getQuery: function() {
		return "";
	}
	,__class__: agentui.model.Node
};
agentui.model.And = function() {
	agentui.model.Node.call(this,"AND");
	this.nodes = new Array();
};
$hxClasses["agentui.model.And"] = agentui.model.And;
agentui.model.And.__name__ = ["agentui","model","And"];
agentui.model.And.__super__ = agentui.model.Node;
agentui.model.And.prototype = $extend(agentui.model.Node.prototype,{
	getQuery: function() {
		return " AND ";
	}
	,__class__: agentui.model.And
});
agentui.model.Or = function() {
	agentui.model.Node.call(this,"OR");
	this.nodes = new Array();
};
$hxClasses["agentui.model.Or"] = agentui.model.Or;
agentui.model.Or.__name__ = ["agentui","model","Or"];
agentui.model.Or.__super__ = agentui.model.Node;
agentui.model.Or.prototype = $extend(agentui.model.Node.prototype,{
	getQuery: function() {
		return " OR ";
	}
	,__class__: agentui.model.Or
});
agentui.model.ContentNode = function(type,content) {
	agentui.model.Node.call(this,type);
	this.content = content;
};
$hxClasses["agentui.model.ContentNode"] = agentui.model.ContentNode;
agentui.model.ContentNode.__name__ = ["agentui","model","ContentNode"];
agentui.model.ContentNode.__super__ = agentui.model.Node;
agentui.model.ContentNode.prototype = $extend(agentui.model.Node.prototype,{
	hasChildren: function() {
		return false;
	}
	,__class__: agentui.model.ContentNode
});
agentui.model.LabelNode = function(label,labelPath) {
	agentui.model.ContentNode.call(this,"LABEL",label);
	this.labelPath = labelPath;
};
$hxClasses["agentui.model.LabelNode"] = agentui.model.LabelNode;
agentui.model.LabelNode.__name__ = ["agentui","model","LabelNode"];
agentui.model.LabelNode.__super__ = agentui.model.ContentNode;
agentui.model.LabelNode.prototype = $extend(agentui.model.ContentNode.prototype,{
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
	,__class__: agentui.model.LabelNode
});
agentui.model.ConnectionNode = function(connection) {
	agentui.model.ContentNode.call(this,"CONNECTION",connection);
};
$hxClasses["agentui.model.ConnectionNode"] = agentui.model.ConnectionNode;
agentui.model.ConnectionNode.__name__ = ["agentui","model","ConnectionNode"];
agentui.model.ConnectionNode.__super__ = agentui.model.ContentNode;
agentui.model.ConnectionNode.prototype = $extend(agentui.model.ContentNode.prototype,{
	getQuery: function() {
		return "";
	}
	,__class__: agentui.model.ConnectionNode
});
agentui.widget = {};
agentui.widget.AcceptVerificationResponseDialogHelper = function() { };
$hxClasses["agentui.widget.AcceptVerificationResponseDialogHelper"] = agentui.widget.AcceptVerificationResponseDialogHelper;
agentui.widget.AcceptVerificationResponseDialogHelper.__name__ = ["agentui","widget","AcceptVerificationResponseDialogHelper"];
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
haxe.StackItem = $hxClasses["haxe.StackItem"] = { __ename__ : ["haxe","StackItem"], __constructs__ : ["CFunction","Module","FilePos","Method","LocalFunction"] };
haxe.StackItem.CFunction = ["CFunction",0];
haxe.StackItem.CFunction.toString = $estr;
haxe.StackItem.CFunction.__enum__ = haxe.StackItem;
haxe.StackItem.Module = function(m) { var $x = ["Module",1,m]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; };
haxe.StackItem.FilePos = function(s,file,line) { var $x = ["FilePos",2,s,file,line]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; };
haxe.StackItem.Method = function(classname,method) { var $x = ["Method",3,classname,method]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; };
haxe.StackItem.LocalFunction = function(v) { var $x = ["LocalFunction",4,v]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; };
haxe.StackItem.__empty_constructs__ = [haxe.StackItem.CFunction];
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
agentui.widget.DialogManager = $hx_exports.agentui.widget.DialogManager = function() { };
$hxClasses["agentui.widget.DialogManager"] = agentui.widget.DialogManager;
agentui.widget.DialogManager.__name__ = ["agentui","widget","DialogManager"];
agentui.widget.DialogManager.showDialog = function(dialogFcnName,options) {
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
agentui.widget.DialogManager.showLogin = function() {
	agentui.widget.DialogManager.showDialog("loginDialog");
};
agentui.widget.DialogManager.showCreateAgent = function() {
	agentui.widget.DialogManager.showDialog("createAgentDialog");
};
agentui.widget.DialogManager.requestIntroduction = function(from,to) {
	var options = { };
	options.from = from;
	options.to = to;
	agentui.widget.DialogManager.showDialog("requestIntroductionDialog",options);
};
agentui.widget.DialogManager.showAliasManager = function() {
	agentui.widget.DialogManager.showDialog("aliasManagerDialog");
};
agentui.widget.DialogManager.allowAccess = function(label,connection) {
	var options = { };
	options.label = label;
	options.connection = connection;
	agentui.widget.DialogManager.showDialog("allowAccessDialog",options);
};
agentui.widget.DialogManager.revokeAccess = function(connection) {
	var options = { };
	options.connection = connection;
	agentui.widget.DialogManager.showDialog("revokeAccessDialog",options);
};
agentui.widget.DialogManager.requestVerification = function(content) {
	var options = { };
	options.content = content;
	agentui.widget.DialogManager.showDialog("verificationRequestDialog",options);
};
agentui.widget.DialogManager.respondToIntroduction = function(notification) {
	var options = { };
	options.notification = notification;
	agentui.widget.DialogManager.showDialog("introductionNotificationDialog",options);
};
agentui.widget.DialogManager.respondToVerificationRequest = function(notification) {
	var options = { };
	options.notification = notification;
	agentui.widget.DialogManager.showDialog("respondToVerificationRequestDialog",options);
};
agentui.widget.DialogManager.acceptVerificationResponse = function(notification) {
	var options = { };
	options.notification = notification;
	agentui.widget.DialogManager.showDialog("acceptVerificationResponseDialog",options);
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
agentui.widget.ConnectionAvatarHelper = function() { };
$hxClasses["agentui.widget.ConnectionAvatarHelper"] = agentui.widget.ConnectionAvatarHelper;
agentui.widget.ConnectionAvatarHelper.__name__ = ["agentui","widget","ConnectionAvatarHelper"];
agentui.widget.ConnectionAvatarHelper.getConnection = function(c) {
	return c.connectionAvatar("getConnection");
};
agentui.widget.ConnectionAvatarHelper.getAlias = function(c) {
	return c.connectionAvatar("getAlias");
};
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
agentui.widget.LabelCompHelper = function() { };
$hxClasses["agentui.widget.LabelCompHelper"] = agentui.widget.LabelCompHelper;
agentui.widget.LabelCompHelper.__name__ = ["agentui","widget","LabelCompHelper"];
agentui.widget.LabelCompHelper.getLabel = function(l) {
	return l.labelComp("getLabel");
};
agentui.widget.LabelCompHelper.parentIid = function(l) {
	return l.labelComp("option","parentIid");
};
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
agentui.widget.ChatOrientation = $hxClasses["agentui.widget.ChatOrientation"] = { __ename__ : ["agentui","widget","ChatOrientation"], __constructs__ : ["chatRight","chatLeft"] };
agentui.widget.ChatOrientation.chatRight = ["chatRight",0];
agentui.widget.ChatOrientation.chatRight.toString = $estr;
agentui.widget.ChatOrientation.chatRight.__enum__ = agentui.widget.ChatOrientation;
agentui.widget.ChatOrientation.chatLeft = ["chatLeft",1];
agentui.widget.ChatOrientation.chatLeft.toString = $estr;
agentui.widget.ChatOrientation.chatLeft.__enum__ = agentui.widget.ChatOrientation;
agentui.widget.ChatOrientation.__empty_constructs__ = [agentui.widget.ChatOrientation.chatRight,agentui.widget.ChatOrientation.chatLeft];
agentui.widget.ConnectionCompHelper = function() { };
$hxClasses["agentui.widget.ConnectionCompHelper"] = agentui.widget.ConnectionCompHelper;
agentui.widget.ConnectionCompHelper.__name__ = ["agentui","widget","ConnectionCompHelper"];
agentui.widget.ConnectionCompHelper.connection = function(c) {
	return c.connectionComp("option","connection");
};
agentui.widget.ConnectionCompHelper.update = function(c,connection) {
	return c.connectionComp("update",connection);
};
agentui.widget.ConnectionCompHelper.addNotification = function(c) {
	return c.connectionComp("addNotification");
};
agentui.widget.ConnectionCompHelper.deleteNotification = function(c) {
	return c.connectionComp("deleteNotification");
};
qoid.model.IntroductionState = $hxClasses["qoid.model.IntroductionState"] = { __ename__ : ["qoid","model","IntroductionState"], __constructs__ : ["NotResponded","Accepted","Rejected"] };
qoid.model.IntroductionState.NotResponded = ["NotResponded",0];
qoid.model.IntroductionState.NotResponded.toString = $estr;
qoid.model.IntroductionState.NotResponded.__enum__ = qoid.model.IntroductionState;
qoid.model.IntroductionState.Accepted = ["Accepted",1];
qoid.model.IntroductionState.Accepted.toString = $estr;
qoid.model.IntroductionState.Accepted.__enum__ = qoid.model.IntroductionState;
qoid.model.IntroductionState.Rejected = ["Rejected",2];
qoid.model.IntroductionState.Rejected.toString = $estr;
qoid.model.IntroductionState.Rejected.__enum__ = qoid.model.IntroductionState;
qoid.model.IntroductionState.__empty_constructs__ = [qoid.model.IntroductionState.NotResponded,qoid.model.IntroductionState.Accepted,qoid.model.IntroductionState.Rejected];
agentui.widget.ConnectionListHelper = function() { };
$hxClasses["agentui.widget.ConnectionListHelper"] = agentui.widget.ConnectionListHelper;
agentui.widget.ConnectionListHelper.__name__ = ["agentui","widget","ConnectionListHelper"];
agentui.widget.ConnectionListHelper.filterConnections = function(c,term) {
	c.connectionsList("filterConnections",term);
};
agentui.widget.ContentCompHelper = function() { };
$hxClasses["agentui.widget.ContentCompHelper"] = agentui.widget.ContentCompHelper;
agentui.widget.ContentCompHelper.__name__ = ["agentui","widget","ContentCompHelper"];
agentui.widget.ContentCompHelper.content = function(cc) {
	return cc.contentComp("option","content");
};
agentui.widget.ContentCompHelper.update = function(cc,c) {
	return cc.contentComp("update",c);
};
agentui.widget.UploadCompHelper = function() { };
$hxClasses["agentui.widget.UploadCompHelper"] = agentui.widget.UploadCompHelper;
agentui.widget.UploadCompHelper.__name__ = ["agentui","widget","UploadCompHelper"];
agentui.widget.UploadCompHelper.value = function(m) {
	return m.uploadComp("value");
};
agentui.widget.UploadCompHelper.clear = function(m) {
	m.uploadComp("clear");
};
agentui.widget.UploadCompHelper.setPreviewImage = function(m,src) {
	m.uploadComp("setPreviewImage",src);
};
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
agentui.widget.UrlCompHelper = function() { };
$hxClasses["agentui.widget.UrlCompHelper"] = agentui.widget.UrlCompHelper;
agentui.widget.UrlCompHelper.__name__ = ["agentui","widget","UrlCompHelper"];
agentui.widget.UrlCompHelper.urlInput = function(m) {
	return m.urlComp("valEle");
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
qoid.model.NewUser = function() {
	qoid.model.ModelObj.call(this);
};
$hxClasses["qoid.model.NewUser"] = qoid.model.NewUser;
qoid.model.NewUser.__name__ = ["qoid","model","NewUser"];
qoid.model.NewUser.__super__ = qoid.model.ModelObj;
qoid.model.NewUser.prototype = $extend(qoid.model.ModelObj.prototype,{
	__class__: qoid.model.NewUser
});
agentui.widget.FilterCompHelper = function() { };
$hxClasses["agentui.widget.FilterCompHelper"] = agentui.widget.FilterCompHelper;
agentui.widget.FilterCompHelper.__name__ = ["agentui","widget","FilterCompHelper"];
agentui.widget.FilterCompHelper.fireFilter = function(f) {
	f.filterComp("fireFilter");
};
agentui.widget.LiveBuildToggleHelper = function() { };
$hxClasses["agentui.widget.LiveBuildToggleHelper"] = agentui.widget.LiveBuildToggleHelper;
agentui.widget.LiveBuildToggleHelper.__name__ = ["agentui","widget","LiveBuildToggleHelper"];
agentui.widget.LiveBuildToggleHelper.isLive = function(l) {
	return l.liveBuildToggle("isLive");
};
agentui.widget.LabelsListHelper = function() { };
$hxClasses["agentui.widget.LabelsListHelper"] = agentui.widget.LabelsListHelper;
agentui.widget.LabelsListHelper.__name__ = ["agentui","widget","LabelsListHelper"];
agentui.widget.LabelsListHelper.getSelected = function(l) {
	return l.labelsList("getSelected");
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
qoid.ResponseProcessor = function() { };
$hxClasses["qoid.ResponseProcessor"] = qoid.ResponseProcessor;
qoid.ResponseProcessor.__name__ = ["qoid","ResponseProcessor"];
qoid.ResponseProcessor.processResponse = function(dataArr) {
	Lambda.iter(dataArr,function(data) {
		if(data.success == false) {
			m3.util.JqueryUtil.alert("ERROR:  " + Std.string(data.error.message) + "     Context: " + Std.string(data.context));
			m3.log.Logga.get_DEFAULT().error(data.error.stacktrace);
		} else {
			var context = data.context;
			var result = data.result;
			if(StringTools.startsWith(context,"initialDataLoad")) {
				if(result != null) {
					if(result.standing == true) qoid.ResponseProcessor.updateModelObject(result.type,result.action,result.results); else qoid.Synchronizer.processResponse(data);
				}
			} else if(context == "verificationContent") qoid.ResponseProcessor.updateModelObject(result.type,result.action,result.results); else if(!qoid.Synchronizer.processResponse(data)) {
				if(result != null) {
					var eventId = "on" + m3.helper.StringHelper.capitalizeFirstLetter(context);
					m3.event.EventManager.get_instance().fire(eventId,result);
				}
			}
		}
	});
};
qoid.ResponseProcessor.processModelObject = function(set,type,action,data) {
	var _g = 0;
	var _g1;
	_g1 = js.Boot.__cast(data , Array);
	while(_g < _g1.length) {
		var datum = _g1[_g];
		++_g;
		var obj = m3.serialization.Serializer.get_instance().fromJsonX(datum,type);
		if(action == "delete") set["delete"](obj); else set.addOrUpdate(obj);
	}
};
qoid.ResponseProcessor.updateModelObject = function(type,action,data) {
	var type1 = type.toLowerCase();
	switch(type1) {
	case "alias":
		qoid.ResponseProcessor.processModelObject(qoid.Qoid.aliases,qoid.model.Alias,action,data);
		break;
	case "connection":
		qoid.ResponseProcessor.processModelObject(qoid.Qoid.connections,qoid.model.Connection,action,data);
		break;
	case "content":
		qoid.ResponseProcessor.processModelObject(qoid.Qoid.verificationContent,qoid.model.Content,action,data);
		break;
	case "introduction":
		qoid.ResponseProcessor.processModelObject(qoid.Qoid.introductions,qoid.model.Introduction,action,data);
		break;
	case "label":
		qoid.ResponseProcessor.processModelObject(qoid.Qoid.labels,qoid.model.Label,action,data);
		break;
	case "labelacl":
		qoid.ResponseProcessor.processModelObject(qoid.Qoid.labelAcls,qoid.model.LabelAcl,action,data);
		break;
	case "labelchild":
		qoid.ResponseProcessor.processModelObject(qoid.Qoid.labelChildren,qoid.model.LabelChild,action,data);
		break;
	case "labeledcontent":
		qoid.ResponseProcessor.processModelObject(qoid.Qoid.labeledContent,qoid.model.LabeledContent,action,data);
		break;
	case "notification":
		qoid.ResponseProcessor.processModelObject(qoid.Qoid.notifications,qoid.model.Notification,action,data);
		break;
	case "profile":
		qoid.ResponseProcessor.processModelObject(qoid.Qoid.profiles,qoid.model.Profile,action,data);
		break;
	default:
		m3.log.Logga.get_DEFAULT().error("Unknown type: " + type1);
	}
};
qoid.model.Introduction = function() {
	qoid.model.ModelObjWithIid.call(this);
};
$hxClasses["qoid.model.Introduction"] = qoid.model.Introduction;
qoid.model.Introduction.__name__ = ["qoid","model","Introduction"];
qoid.model.Introduction.__super__ = qoid.model.ModelObjWithIid;
qoid.model.Introduction.prototype = $extend(qoid.model.ModelObjWithIid.prototype,{
	__class__: qoid.model.Introduction
});
qoid.Synchronizer = function(context,numResponsesExpected,oncomplete) {
	this.context = context;
	this.numResponsesExpected = numResponsesExpected;
	this.oncomplete = oncomplete;
	this.parms = new qoid.SynchronizationParms();
	qoid.Synchronizer.synchronizers.set(context,this);
};
$hxClasses["qoid.Synchronizer"] = qoid.Synchronizer;
qoid.Synchronizer.__name__ = ["qoid","Synchronizer"];
qoid.Synchronizer.processResponse = function(data) {
	var context = data.context.split("-")[0];
	var synchronizer = qoid.Synchronizer.synchronizers.get(context);
	if(synchronizer != null) synchronizer.dataReceived(context,data.result);
	return synchronizer != null;
};
qoid.Synchronizer.remove = function(iid) {
	qoid.Synchronizer.synchronizers.remove(iid);
};
qoid.Synchronizer.prototype = {
	processDataReceived: function(list,type,data) {
		var _g = 0;
		var _g1;
		_g1 = js.Boot.__cast(data , Array);
		while(_g < _g1.length) {
			var datum = _g1[_g];
			++_g;
			list.push(m3.serialization.Serializer.get_instance().fromJsonX(datum,type));
		}
	}
	,dataReceived: function(c,dataObj) {
		var data = dataObj.results;
		var type = dataObj.type.toLowerCase();
		if(data != null) switch(type) {
		case "alias":
			this.processDataReceived(this.parms.aliases,qoid.model.Alias,data);
			break;
		case "connection":
			this.processDataReceived(this.parms.connections,qoid.model.Connection,data);
			break;
		case "introduction":
			this.processDataReceived(this.parms.introductions,qoid.model.Introduction,data);
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
		case "notification":
			this.processDataReceived(this.parms.notifications,qoid.model.Notification,data);
			break;
		case "profile":
			this.processDataReceived(this.parms.profiles,qoid.model.Profile,data);
			break;
		default:
			m3.log.Logga.get_DEFAULT().error("Unknown data type: " + Std.string(dataObj.type));
		}
		this.numResponsesExpected -= 1;
		if(this.numResponsesExpected == 0) {
			this.oncomplete(this.parms);
			qoid.Synchronizer.remove(this.context);
		}
	}
	,__class__: qoid.Synchronizer
};
m3.comm.LongPollingRequest = function(channel,successFcn,errorFcn,ajaxOpts,baseUrl) {
	this.timeout = 30000;
	this.delayNextPoll = false;
	this.running = true;
	var _g = this;
	this.channel = channel;
	if(baseUrl == null) this.baseUrl = "/api/channel/poll"; else this.baseUrl = baseUrl;
	this.baseOpts = { complete : function(jqXHR,textStatus) {
		_g.poll();
	}};
	if(ajaxOpts != null) $.extend(this.baseOpts,ajaxOpts);
	var onSuccess = function(data) {
		if(_g.running) try {
			successFcn(data);
		} catch( e ) {
			if( js.Boot.__instanceof(e,m3.exception.Exception) ) {
				m3.log.Logga.get_DEFAULT().error("Error while polling",e);
			} else throw(e);
		}
	};
	var onError = function(exc) {
		_g.delayNextPoll = true;
		m3.log.Logga.get_DEFAULT().error("Error executing ajax call | Response Code: " + Std.string(_g.jqXHR.status) + " | " + Std.string(_g.jqXHR.message));
		if(errorFcn != null) errorFcn(exc);
	};
	m3.comm.BaseRequest.call(this,"",this.getUrl(),onSuccess,onError);
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
		m3.log.Logga.get_DEFAULT().debug("Long Polling is running? " + Std.string(this.running));
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
			m3.log.Logga.get_DEFAULT().error("error on poll abort | " + Std.string(err));
		}
	}
	,getUrl: function() {
		return this.baseUrl + "?timeoutMillis=" + Std.string(this.timeout);
	}
	,poll: function() {
		if(this.running) {
			if(this.delayNextPoll == true) {
				this.delayNextPoll = false;
				haxe.Timer.delay($bind(this,this.poll),this.timeout / 2 | 0);
			} else {
				this.baseOpts.url = this.getUrl();
				this.baseOpts.timeout = this.timeout + 1000;
				this.jqXHR = m3.comm.BaseRequest.prototype.start.call(this);
			}
		}
	}
	,__class__: m3.comm.LongPollingRequest
});
qoid.SynchronizationParms = function() {
	this.aliases = new Array();
	this.connections = new Array();
	this.introductions = new Array();
	this.labels = new Array();
	this.labelAcls = new Array();
	this.labelChildren = new Array();
	this.labeledContent = new Array();
	this.notifications = new Array();
	this.profiles = new Array();
};
$hxClasses["qoid.SynchronizationParms"] = qoid.SynchronizationParms;
qoid.SynchronizationParms.__name__ = ["qoid","SynchronizationParms"];
qoid.SynchronizationParms.prototype = {
	__class__: qoid.SynchronizationParms
};
js.Lib = function() { };
$hxClasses["js.Lib"] = js.Lib;
js.Lib.__name__ = ["js","Lib"];
js.Lib.alert = function(v) {
	alert(js.Boot.__string_rec(v,""));
};
qoid.model.ContentFactory = function() { };
$hxClasses["qoid.model.ContentFactory"] = qoid.model.ContentFactory;
qoid.model.ContentFactory.__name__ = ["qoid","model","ContentFactory"];
qoid.model.ContentFactory.create = function(contentType,data) {
	var ret = null;
	switch(contentType) {
	case "AUDIO":
		var ac = new qoid.model.AudioContent();
		ac.props.audioSrc = js.Boot.__cast(data , String);
		ret = ac;
		break;
	case "IMAGE":
		var ic = new qoid.model.ImageContent();
		ic.props.imgSrc = js.Boot.__cast(data , String);
		ret = ic;
		break;
	case "TEXT":
		var mc = new qoid.model.MessageContent();
		mc.props.text = js.Boot.__cast(data , String);
		ret = mc;
		break;
	case "URL":
		var uc = new qoid.model.UrlContent();
		uc.props.url = js.Boot.__cast(data , String);
		ret = uc;
		break;
	case "VERIFICATION":
		var uc1 = new qoid.model.VerificationContent();
		uc1.props.text = js.Boot.__cast(data , String);
		ret = uc1;
		break;
	}
	return ret;
};
qoid.model.AudioContent = function() {
	qoid.model.Content.call(this,"AUDIO",qoid.model.AudioContentData);
};
$hxClasses["qoid.model.AudioContent"] = qoid.model.AudioContent;
qoid.model.AudioContent.__name__ = ["qoid","model","AudioContent"];
qoid.model.AudioContent.__super__ = qoid.model.Content;
qoid.model.AudioContent.prototype = $extend(qoid.model.Content.prototype,{
	__class__: qoid.model.AudioContent
});
qoid.model.ContentData = function() {
};
$hxClasses["qoid.model.ContentData"] = qoid.model.ContentData;
qoid.model.ContentData.__name__ = ["qoid","model","ContentData"];
qoid.model.ContentData.prototype = {
	__class__: qoid.model.ContentData
};
qoid.model.AudioContentData = function() {
	qoid.model.ContentData.call(this);
};
$hxClasses["qoid.model.AudioContentData"] = qoid.model.AudioContentData;
qoid.model.AudioContentData.__name__ = ["qoid","model","AudioContentData"];
qoid.model.AudioContentData.__super__ = qoid.model.ContentData;
qoid.model.AudioContentData.prototype = $extend(qoid.model.ContentData.prototype,{
	__class__: qoid.model.AudioContentData
});
qoid.model.ContentMetaData = function() {
	this.verifications = new Array();
};
$hxClasses["qoid.model.ContentMetaData"] = qoid.model.ContentMetaData;
qoid.model.ContentMetaData.__name__ = ["qoid","model","ContentMetaData"];
qoid.model.ContentMetaData.prototype = {
	__class__: qoid.model.ContentMetaData
};
qoid.model.ImageContent = function() {
	qoid.model.Content.call(this,"IMAGE",qoid.model.ImageContentData);
};
$hxClasses["qoid.model.ImageContent"] = qoid.model.ImageContent;
qoid.model.ImageContent.__name__ = ["qoid","model","ImageContent"];
qoid.model.ImageContent.__super__ = qoid.model.Content;
qoid.model.ImageContent.prototype = $extend(qoid.model.Content.prototype,{
	__class__: qoid.model.ImageContent
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
qoid.model.MessageContent = function() {
	qoid.model.Content.call(this,"TEXT",qoid.model.MessageContentData);
};
$hxClasses["qoid.model.MessageContent"] = qoid.model.MessageContent;
qoid.model.MessageContent.__name__ = ["qoid","model","MessageContent"];
qoid.model.MessageContent.__super__ = qoid.model.Content;
qoid.model.MessageContent.prototype = $extend(qoid.model.Content.prototype,{
	__class__: qoid.model.MessageContent
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
qoid.model.UrlContent = function() {
	qoid.model.Content.call(this,"URL",qoid.model.UrlContentData);
};
$hxClasses["qoid.model.UrlContent"] = qoid.model.UrlContent;
qoid.model.UrlContent.__name__ = ["qoid","model","UrlContent"];
qoid.model.UrlContent.__super__ = qoid.model.Content;
qoid.model.UrlContent.prototype = $extend(qoid.model.Content.prototype,{
	__class__: qoid.model.UrlContent
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
qoid.model.VerificationContent = function() {
	qoid.model.Content.call(this,"VERIFICATION",qoid.model.VerificationContentData);
};
$hxClasses["qoid.model.VerificationContent"] = qoid.model.VerificationContent;
qoid.model.VerificationContent.__name__ = ["qoid","model","VerificationContent"];
qoid.model.VerificationContent.__super__ = qoid.model.Content;
qoid.model.VerificationContent.prototype = $extend(qoid.model.Content.prototype,{
	__class__: qoid.model.VerificationContent
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
qoid.model.IntroductionRequest = function() {
	qoid.model.ModelObjWithIid.call(this);
};
$hxClasses["qoid.model.IntroductionRequest"] = qoid.model.IntroductionRequest;
qoid.model.IntroductionRequest.__name__ = ["qoid","model","IntroductionRequest"];
qoid.model.IntroductionRequest.__super__ = qoid.model.ModelObjWithIid;
qoid.model.IntroductionRequest.prototype = $extend(qoid.model.ModelObjWithIid.prototype,{
	__class__: qoid.model.IntroductionRequest
});
agentui.widget.RespondToVerificationRequestDialogHelper = function() { };
$hxClasses["agentui.widget.RespondToVerificationRequestDialogHelper"] = agentui.widget.RespondToVerificationRequestDialogHelper;
agentui.widget.RespondToVerificationRequestDialogHelper.__name__ = ["agentui","widget","RespondToVerificationRequestDialogHelper"];
qoid.model.VerificationResponse = function(notificationIid,verificationContent) {
	this.notificationIid = notificationIid;
	this.verificationContent = verificationContent;
};
$hxClasses["qoid.model.VerificationResponse"] = qoid.model.VerificationResponse;
qoid.model.VerificationResponse.__name__ = ["qoid","model","VerificationResponse"];
qoid.model.VerificationResponse.prototype = {
	__class__: qoid.model.VerificationResponse
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
agentui.widget.score = {};
agentui.widget.score.ContentTimeLine = function(paper,profile,startTime,endTime,initialWidth) {
	this.paper = paper;
	this.profile = profile;
	this.startTime = startTime;
	this.endTime = endTime;
	this.initialWidth = initialWidth;
	this.contents = new Array();
	this.contentElements = new Array();
	if(agentui.widget.score.ContentTimeLine.next_y_pos > agentui.widget.score.ContentTimeLine.initial_y_pos) agentui.widget.score.ContentTimeLine.next_y_pos += agentui.widget.score.ContentTimeLine.height + 20;
	agentui.widget.score.ContentTimeLine.next_y_pos += 10;
	this.time_line_x = agentui.widget.score.ContentTimeLine.next_x_pos;
	this.time_line_y = agentui.widget.score.ContentTimeLine.next_y_pos;
	this.connectionElement = this.createConnectionElement();
	var e123_0 = this.connectionElement;
	var me123 = paper;
	this.timeLineElement = me123.group.apply(me123, e123);
};
$hxClasses["agentui.widget.score.ContentTimeLine"] = agentui.widget.score.ContentTimeLine;
agentui.widget.score.ContentTimeLine.__name__ = ["agentui","widget","score","ContentTimeLine"];
agentui.widget.score.ContentTimeLine.resetPositions = function() {
	agentui.widget.score.ContentTimeLine.next_y_pos = agentui.widget.score.ContentTimeLine.initial_y_pos;
	agentui.widget.score.ContentTimeLine.next_x_pos = 10;
};
agentui.widget.score.ContentTimeLine.prototype = {
	reposition: function(startTime,endTime) {
		if(this.startTime == startTime && this.endTime == endTime) return;
		this.startTime = startTime;
		this.endTime = endTime;
		var _g1 = 0;
		var _g = this.contentElements.length;
		while(_g1 < _g) {
			var i = _g1++;
			var ele = this.contentElements[i];
			var content = this.contents[i];
			var x_start = ele.attr("x");
			var x_end = (endTime - content.created.getTime()) / (endTime - startTime) * this.initialWidth + this.time_line_x + agentui.widget.score.ContentTimeLine.width;
		}
	}
	,removeElements: function() {
		this.connectionElement.remove();
		var iter = HxOverrides.iter(this.contentElements);
		while(iter.hasNext()) iter.next().remove();
	}
	,createConnectionElement: function() {
		var line = this.paper.line(this.time_line_x,this.time_line_y + agentui.widget.score.ContentTimeLine.height / 2,this.initialWidth,this.time_line_y + agentui.widget.score.ContentTimeLine.height / 2).attr({ 'class' : "contentLine"});
		var ellipse = this.paper.ellipse(this.time_line_x + agentui.widget.score.ContentTimeLine.width / 2,this.time_line_y + agentui.widget.score.ContentTimeLine.height / 2,agentui.widget.score.ContentTimeLine.width / 2,agentui.widget.score.ContentTimeLine.height / 2);
		ellipse.attr({ fill : "#fff", stroke : "#000", strokeWidth : "1px"});
		var imgSrc;
		try {
			imgSrc = this.profile.imgSrc;
		} catch( __e ) {
			imgSrc = "media/default_avatar.jpg";
		}
		var img = this.paper.image(imgSrc,this.time_line_x,this.time_line_y,agentui.widget.score.ContentTimeLine.width,agentui.widget.score.ContentTimeLine.height);
		img.attr({ mask : ellipse});
		var border_ellipse = this.paper.ellipse(this.time_line_x + agentui.widget.score.ContentTimeLine.width / 2,this.time_line_y + agentui.widget.score.ContentTimeLine.height / 2,agentui.widget.score.ContentTimeLine.width / 2,agentui.widget.score.ContentTimeLine.height / 2);
		var filter = this.paper.filter((function($this) {
			var $r;
			var dx1 = 4;
			var dy1 = 4;
			var blur1 = 4;
			var color1 = "#000000";
			$r = Snap.filter.shadow(dx1, dy1, blur1, color1);
			return $r;
		}(this)));
		border_ellipse.attr({ fill : "none", stroke : "#5c9ccc", strokeWidth : "1px", filter : filter});
		var e123_0 = line;
		var e123_1 = img;
		var e123_2 = border_ellipse;
		var me123 = this.paper;
		return me123.group.apply(me123, e123);
	}
	,addContent: function(content) {
		this.contents.push(content);
		this.createContentElement(content);
	}
	,createContentElement: function(content) {
		var radius = 10;
		var gap = 10;
		var x = (this.endTime - content.created.getTime()) / (this.endTime - this.startTime) * this.initialWidth + this.time_line_x + agentui.widget.score.ContentTimeLine.width;
		var y = this.time_line_y + agentui.widget.score.ContentTimeLine.height / 2;
		var ele;
		if(content.contentType == "TEXT") this.addContentElement(content,this.createTextElement(js.Boot.__cast(content , qoid.model.MessageContent),x,y,40,40)); else if(content.contentType == "IMAGE") this.addContentElement(content,this.createImageElement(js.Boot.__cast(content , qoid.model.ImageContent),x,y,40,40)); else if(content.contentType == "URL") this.addContentElement(content,this.createLinkElement(js.Boot.__cast(content , qoid.model.UrlContent),x,y,20)); else if(content.contentType == "AUDIO") this.addContentElement(content,this.createAudioElement(js.Boot.__cast(content , qoid.model.AudioContent),x,y,20,20));
	}
	,cloneElement: function(ele) {
		var clone = ele.clone();
		clone.attr({ contentType : ele.attr("contentType")});
		clone.id = ele.id + "-clone";
		clone.attr({ id : clone.id});
		return clone;
	}
	,addContentElement: function(content,ele) {
		var _g = this;
		ele = ele.click(function(evt) {
			var clone = _g.cloneElement(ele);
			var after_anim = function() {
				var bbox = clone.getBBox();
				var cx = bbox.x + bbox.width / 2;
				var cy = bbox.y + bbox.height / 2;
				var g_id = clone.attr("id");
				var g_type = clone.attr("contentType");
				clone.remove();
				var ele1 = null;
				switch(g_type) {
				case "AUDIO":
					ele1 = _g.paper.ellipse(cx,cy,bbox.width / 2,bbox.height / 2).attr({ 'class' : "audioEllipse"});
					break;
				case "IMAGE":
					ele1 = _g.paper.image((js.Boot.__cast(content , qoid.model.ImageContent)).props.imgSrc,bbox.x,bbox.y,bbox.width,bbox.height);
					break;
				case "URL":
					ele1 = agentui.widget.score.Shapes.createHexagon(_g.paper,cx,cy,bbox.width / 2).attr({ 'class' : "urlContent"});
					break;
				case "TEXT":
					ele1 = _g.paper.rect(bbox.x,bbox.y,bbox.width,bbox.height,5,5).attr({ 'class' : "messageContentLarge"});
					break;
				default:
					m3.log.Logga.get_DEFAULT().warn("Unknown Content Type: " + g_type);
				}
				var g;
				var e123_0 = ele1;
				var me123 = _g.paper;
				g = me123.group.apply(me123, e123);
				g.attr({ contentType : g_type});
				g.attr({ id : g_id});
				g.id = g_id;
				g.click(function(evt1) {
					g.remove();
				});
				switch(g_type) {
				case "AUDIO":
					agentui.widget.score.ForeignObject.appendAudioContent(g_id,bbox,(js.Boot.__cast(content , qoid.model.AudioContent)).props);
					break;
				case "URL":
					agentui.widget.score.ForeignObject.appendUrlContent(g_id,bbox,(js.Boot.__cast(content , qoid.model.UrlContent)).props);
					break;
				case "TEXT":
					agentui.widget.score.ForeignObject.appendMessageContent(g_id,bbox,(js.Boot.__cast(content , qoid.model.MessageContent)).props);
					break;
				}
			};
			clone.animate({ transform : "t10,10 s5"},200,"",function() {
				clone.animate({ transform : "t10,10 s4"},100,"",after_anim);
			});
		});
		this.contentElements.push(ele);
		this.timeLineElement.append(ele);
	}
	,splitText: function(text,max_chars,max_lines) {
		if(max_lines == null) max_lines = 0;
		var words = text.split(" ");
		var lines = new Array();
		var line_no = 0;
		lines[line_no] = "";
		var _g1 = 0;
		var _g = words.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(lines[line_no].length + words[i].length > max_chars) {
				line_no += 1;
				if(line_no == max_lines) break;
				lines[line_no] = "";
			} else lines[line_no] += " ";
			lines[line_no] += words[i];
		}
		return lines;
	}
	,createTextElement: function(content,x,y,ele_width,ele_height) {
		var rect = this.paper.rect(x - ele_width / 2,y - ele_height / 2,ele_width,ele_height,3,3).attr({ 'class' : "messageContent"});
		var bbox = { cx : x, cy : y, width : ele_height, height : ele_height};
		var icon = agentui.widget.score.Icons.messageIcon(bbox);
		var g;
		var e123_0 = rect;
		var e123_1 = icon;
		var me123 = this.paper;
		g = me123.group.apply(me123, e123);
		g.attr("contentType","TEXT");
		return g;
	}
	,createImageElement: function(content,x,y,ele_width,ele_height) {
		var rect = this.paper.rect(x - ele_width / 2,y - ele_height / 2,ele_width,ele_height,3,3).attr({ 'class' : "imageContent"});
		var bbox = { cx : x, cy : y, width : ele_height, height : ele_height};
		var icon = agentui.widget.score.Icons.imageIcon(bbox);
		var g;
		var e123_0 = rect;
		var e123_1 = icon;
		var me123 = this.paper;
		g = me123.group.apply(me123, e123);
		g.attr("contentType","IMAGE");
		return g;
	}
	,createLinkElement: function(content,x,y,radius) {
		var hex = agentui.widget.score.Shapes.createHexagon(this.paper,x,y,radius).attr({ 'class' : "urlContent"});
		var icon = agentui.widget.score.Icons.linkIcon(hex.getBBox());
		var g;
		var e123_0 = hex;
		var e123_1 = icon;
		var me123 = this.paper;
		g = me123.group.apply(me123, e123);
		g.attr("contentType","URL");
		return g;
	}
	,createAudioElement: function(content,x,y,rx,ry) {
		var ellipse = this.paper.ellipse(x,y,rx,ry).attr({ 'class' : "audioEllipse"});
		var icon = agentui.widget.score.Icons.audioIcon(ellipse.getBBox());
		var g;
		var e123_0 = ellipse;
		var e123_1 = icon;
		var me123 = this.paper;
		g = me123.group.apply(me123, e123);
		g.attr("contentType","AUDIO");
		return g;
	}
	,__class__: agentui.widget.score.ContentTimeLine
};
agentui.widget.score.ForeignObject = function() { };
$hxClasses["agentui.widget.score.ForeignObject"] = agentui.widget.score.ForeignObject;
agentui.widget.score.ForeignObject.__name__ = ["agentui","widget","score","ForeignObject"];
agentui.widget.score.ForeignObject.createForeignObject = function(ele_id,bbox) {
	var klone = d3.select("#" + ele_id);
	var fo = klone.append("foreignObject").attr("width",Std.string(bbox.width - 21)).attr("height",bbox.height).attr("x",Std.string(bbox.x)).attr("y",Std.string(bbox.y)).append("xhtml:body");
	return fo;
};
agentui.widget.score.ForeignObject.appendMessageContent = function(ele_id,bbox,content) {
	var fo = agentui.widget.score.ForeignObject.createForeignObject(ele_id,bbox);
	fo.append("div").attr("class","messageContent-large-text").style("width",Std.string(bbox.width - 49) + "px").style("height",Std.string(bbox.height) + "px").html(content.text);
};
agentui.widget.score.ForeignObject.appendUrlContent = function(ele_id,bbox,content) {
	bbox.y = bbox.y + bbox.height / 2 - 12;
	bbox.x += 12;
	var fo = agentui.widget.score.ForeignObject.createForeignObject(ele_id,bbox);
	var div = fo.append("div").style("width",Std.string(bbox.width - 49) + "px").style("font-size","12px");
	div.append("a").attr("href",content.url).attr("target","_blank").html(content.text).on("click",function() {
		d3.event.stopPropagation();
	});
};
agentui.widget.score.ForeignObject.appendImageContent = function(ele_id,bbox,content) {
	bbox.y = bbox.y + bbox.height / 2;
	var fo = agentui.widget.score.ForeignObject.createForeignObject(ele_id,bbox);
	var div = fo.append("div");
	div.append("div").attr("class","imageCaption").html(content.caption);
	div.append("img").attr("src",content.imgSrc).style("width",Std.string(bbox.width - 49) + "px").style("height",Std.string(bbox.height) + "px");
};
agentui.widget.score.ForeignObject.appendAudioContent = function(ele_id,bbox,content) {
	bbox.y = bbox.y + bbox.height / 2 - 12;
	bbox.x = bbox.x + bbox.width / 3;
	var fo = agentui.widget.score.ForeignObject.createForeignObject(ele_id,bbox);
	var div = fo.append("div");
	div.append("div").attr("class","audioTitle").style("width",Std.string(bbox.width - 49) + "px").style("font-size","12px").html(content.title);
	var audioDiv = div.append("div").style("width",Std.string(bbox.width - 49) + "px");
	audioDiv.append("audio").attr("src",content.audioSrc).attr("controls","controls").style("width","230px").style("height","50px").on("click",function() {
		d3.event.stopPropagation();
	});
};
agentui.widget.score.Icons = function() { };
$hxClasses["agentui.widget.score.Icons"] = agentui.widget.score.Icons;
agentui.widget.score.Icons.__name__ = ["agentui","widget","score","Icons"];
agentui.widget.score.Icons.createIcon = function(iconPath,className,bbox) {
	var paper = new Snap("#score-comp-svg");
	var ret = paper.path(iconPath);
	ret.attr("class",className);
	if(bbox != null) {
		var bbox_p = ret.getBBox();
		ret.transform("t" + Std.string(bbox.cx - bbox_p.width / 2 - bbox_p.x) + " " + Std.string(bbox.cy - bbox_p.height / 2 - bbox_p.y));
	}
	return ret;
};
agentui.widget.score.Icons.audioIcon = function(bbox) {
	var audioPath = "M4.998,12.127v7.896h4.495l6.729,5.526l0.004-18.948l-6.73,5.526H4.998z M18.806,11.219c-0.393-0.389-1.024-0.389-1.415,0.002c-0.39,0.391-0.39,1.024,0.002,1.416v-0.002c0.863,0.864,1.395,2.049,1.395,3.366c0,1.316-0.531,2.497-1.393,3.361c-0.394,0.389-0.394,1.022-0.002,1.415c0.195,0.195,0.451,0.293,0.707,0.293c0.257,0,0.513-0.098,0.708-0.293c1.222-1.22,1.98-2.915,1.979-4.776C20.788,14.136,20.027,12.439,18.806,11.219z M21.101,8.925c-0.393-0.391-1.024-0.391-1.413,0c-0.392,0.391-0.392,1.025,0,1.414c1.45,1.451,2.344,3.447,2.344,5.661c0,2.212-0.894,4.207-2.342,5.659c-0.392,0.39-0.392,1.023,0,1.414c0.195,0.195,0.451,0.293,0.708,0.293c0.256,0,0.512-0.098,0.707-0.293c1.808-1.809,2.929-4.315,2.927-7.073C24.033,13.24,22.912,10.732,21.101,8.925z M23.28,6.746c-0.393-0.391-1.025-0.389-1.414,0.002c-0.391,0.389-0.391,1.023,0.002,1.413h-0.002c2.009,2.009,3.248,4.773,3.248,7.839c0,3.063-1.239,5.828-3.246,7.838c-0.391,0.39-0.391,1.023,0.002,1.415c0.194,0.194,0.45,0.291,0.706,0.291s0.513-0.098,0.708-0.293c2.363-2.366,3.831-5.643,3.829-9.251C27.115,12.389,25.647,9.111,23.28,6.746z";
	return agentui.widget.score.Icons.createIcon(audioPath,"audioIcon",bbox);
};
agentui.widget.score.Icons.messageIcon = function(bbox) {
	var messagePath = "M16,5.333c-7.732,0-14,4.701-14,10.5c0,1.982,0.741,3.833,2.016,5.414L2,25.667l5.613-1.441c2.339,1.317,5.237,2.107,8.387,2.107c7.732,0,14-4.701,14-10.5C30,10.034,23.732,5.333,16,5.333z";
	return agentui.widget.score.Icons.createIcon(messagePath,"messageIcon",bbox);
};
agentui.widget.score.Icons.linkIcon = function(bbox) {
	var linkPath = "M16.45,18.085l-2.47,2.471c0.054,1.023-0.297,2.062-1.078,2.846c-1.465,1.459-3.837,1.459-5.302-0.002c-1.461-1.465-1.46-3.836-0.001-5.301c0.783-0.781,1.824-1.131,2.847-1.078l2.469-2.469c-2.463-1.057-5.425-0.586-7.438,1.426c-2.634,2.637-2.636,6.907,0,9.545c2.638,2.637,6.909,2.635,9.545,0l0.001,0.002C17.033,23.511,17.506,20.548,16.45,18.085zM14.552,12.915l2.467-2.469c-0.053-1.023,0.297-2.062,1.078-2.848C19.564,6.139,21.934,6.137,23.4,7.6c1.462,1.465,1.462,3.837,0,5.301c-0.783,0.783-1.822,1.132-2.846,1.079l-2.469,2.468c2.463,1.057,5.424,0.584,7.438-1.424c2.634-2.639,2.633-6.91,0-9.546c-2.639-2.636-6.91-2.637-9.545-0.001C13.967,7.489,13.495,10.451,14.552,12.915zM18.152,10.727l-7.424,7.426c-0.585,0.584-0.587,1.535,0,2.121c0.585,0.584,1.536,0.584,2.121-0.002l7.425-7.424c0.584-0.586,0.584-1.535,0-2.121C19.687,10.141,18.736,10.142,18.152,10.727z";
	return agentui.widget.score.Icons.createIcon(linkPath,"linkIcon",bbox);
};
agentui.widget.score.Icons.imageIcon = function(bbox) {
	var imagePath = "M2.5,4.833v22.334h27V4.833H2.5zM25.25,25.25H6.75V6.75h18.5V25.25zM11.25,14c1.426,0,2.583-1.157,2.583-2.583c0-1.427-1.157-2.583-2.583-2.583c-1.427,0-2.583,1.157-2.583,2.583C8.667,12.843,9.823,14,11.25,14zM24.251,16.25l-4.917-4.917l-6.917,6.917L10.5,16.333l-2.752,2.752v5.165h16.503V16.25z";
	return agentui.widget.score.Icons.createIcon(imagePath,"imageIcon",bbox);
};
agentui.widget.score.TimeMarker = function(uberGroup,paper,width,start,end) {
	this.paper = paper;
	this.width = width;
	this.group = ((function($this) {
		var $r;
		var e123 = [];
		var me123 = paper;
		$r = me123.group.apply(me123, e123);
		return $r;
	}(this))).attr("id","time-marker");
	uberGroup.append(this.group);
	this.start = start.getTime();
	this.end = end.getTime();
	this.drawTimeLine();
};
$hxClasses["agentui.widget.score.TimeMarker"] = agentui.widget.score.TimeMarker;
agentui.widget.score.TimeMarker.__name__ = ["agentui","widget","score","TimeMarker"];
agentui.widget.score.TimeMarker.prototype = {
	setStart: function(date) {
		this.start = date.getTime();
		this.drawTimeLine();
	}
	,setEnd: function(date) {
		this.end = date.getTime();
		this.drawTimeLine();
	}
	,drawTimeLine: function() {
		var margin = 7;
		var y = 3 * margin;
		var attrs = { strokeOpacity : 0.6, stroke : "#cccccc", strokeWidth : 1};
		var eles = this.group.selectAll("*");
		eles.forEach(function(ele) {
			ele.remove();
		},{ });
		this.line = this.paper.line(margin,y,this.width - margin,y).attr(attrs);
		this.group.append(this.line);
		var interval = this.end - this.start;
		var interval1 = (this.width - 2 * margin) / 24;
		var x = margin;
		var _g = 0;
		while(_g < 25) {
			var i = _g++;
			switch(i) {
			case 0:case 12:case 24:
				this.group.append(this.paper.line(x,y - margin,x,y + margin).attr(attrs));
				x += interval1;
				break;
			case 3:case 15:
				this.group.append(this.paper.line(x,y,x,y + margin + 2).attr(attrs));
				x += interval1;
				break;
			case 6:case 18:
				this.group.append(this.paper.line(x,y,x,y + margin + 2).attr(attrs));
				x += interval1;
				break;
			case 9:case 21:
				this.group.append(this.paper.line(x,y,x,y + margin + 2).attr(attrs));
				x += interval1;
				break;
			default:
				this.group.append(this.paper.line(x,y,x,y + margin).attr(attrs));
				x += interval1;
			}
		}
	}
	,__class__: agentui.widget.score.TimeMarker
};
agentui.widget.score.Shapes = function() { };
$hxClasses["agentui.widget.score.Shapes"] = agentui.widget.score.Shapes;
agentui.widget.score.Shapes.__name__ = ["agentui","widget","score","Shapes"];
agentui.widget.score.Shapes.createHexagon = function(paper,cx,cy,r) {
	var theta = 0.523598775;
	var hexagon = paper.polygon([cx - r * Math.sin(theta),cy - r * Math.cos(theta),cx - r,cy,cx - r * Math.sin(theta),cy + r * Math.cos(theta),cx + r * Math.sin(theta),cy + r * Math.cos(theta),cx + r,cy,cx + r * Math.sin(theta),cy - r * Math.cos(theta)]);
	hexagon.attr("cx",cx);
	hexagon.attr("cy",cy);
	hexagon.attr("r",r);
	return hexagon;
};
haxe.macro = {};
haxe.macro.Constant = $hxClasses["haxe.macro.Constant"] = { __ename__ : ["haxe","macro","Constant"], __constructs__ : ["CInt","CFloat","CString","CIdent","CRegexp"] };
haxe.macro.Constant.CInt = function(v) { var $x = ["CInt",0,v]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; };
haxe.macro.Constant.CFloat = function(f) { var $x = ["CFloat",1,f]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; };
haxe.macro.Constant.CString = function(s) { var $x = ["CString",2,s]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; };
haxe.macro.Constant.CIdent = function(s) { var $x = ["CIdent",3,s]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; };
haxe.macro.Constant.CRegexp = function(r,opt) { var $x = ["CRegexp",4,r,opt]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; };
haxe.macro.Constant.__empty_constructs__ = [];
haxe.macro.Binop = $hxClasses["haxe.macro.Binop"] = { __ename__ : ["haxe","macro","Binop"], __constructs__ : ["OpAdd","OpMult","OpDiv","OpSub","OpAssign","OpEq","OpNotEq","OpGt","OpGte","OpLt","OpLte","OpAnd","OpOr","OpXor","OpBoolAnd","OpBoolOr","OpShl","OpShr","OpUShr","OpMod","OpAssignOp","OpInterval","OpArrow"] };
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
haxe.macro.Binop.OpAssignOp = function(op) { var $x = ["OpAssignOp",20,op]; $x.__enum__ = haxe.macro.Binop; $x.toString = $estr; return $x; };
haxe.macro.Binop.OpInterval = ["OpInterval",21];
haxe.macro.Binop.OpInterval.toString = $estr;
haxe.macro.Binop.OpInterval.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpArrow = ["OpArrow",22];
haxe.macro.Binop.OpArrow.toString = $estr;
haxe.macro.Binop.OpArrow.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.__empty_constructs__ = [haxe.macro.Binop.OpAdd,haxe.macro.Binop.OpMult,haxe.macro.Binop.OpDiv,haxe.macro.Binop.OpSub,haxe.macro.Binop.OpAssign,haxe.macro.Binop.OpEq,haxe.macro.Binop.OpNotEq,haxe.macro.Binop.OpGt,haxe.macro.Binop.OpGte,haxe.macro.Binop.OpLt,haxe.macro.Binop.OpLte,haxe.macro.Binop.OpAnd,haxe.macro.Binop.OpOr,haxe.macro.Binop.OpXor,haxe.macro.Binop.OpBoolAnd,haxe.macro.Binop.OpBoolOr,haxe.macro.Binop.OpShl,haxe.macro.Binop.OpShr,haxe.macro.Binop.OpUShr,haxe.macro.Binop.OpMod,haxe.macro.Binop.OpInterval,haxe.macro.Binop.OpArrow];
haxe.macro.Unop = $hxClasses["haxe.macro.Unop"] = { __ename__ : ["haxe","macro","Unop"], __constructs__ : ["OpIncrement","OpDecrement","OpNot","OpNeg","OpNegBits"] };
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
haxe.macro.Unop.__empty_constructs__ = [haxe.macro.Unop.OpIncrement,haxe.macro.Unop.OpDecrement,haxe.macro.Unop.OpNot,haxe.macro.Unop.OpNeg,haxe.macro.Unop.OpNegBits];
haxe.macro.ExprDef = $hxClasses["haxe.macro.ExprDef"] = { __ename__ : ["haxe","macro","ExprDef"], __constructs__ : ["EConst","EArray","EBinop","EField","EParenthesis","EObjectDecl","EArrayDecl","ECall","ENew","EUnop","EVars","EFunction","EBlock","EFor","EIn","EIf","EWhile","ESwitch","ETry","EReturn","EBreak","EContinue","EUntyped","EThrow","ECast","EDisplay","EDisplayNew","ETernary","ECheckType","EMeta"] };
haxe.macro.ExprDef.EConst = function(c) { var $x = ["EConst",0,c]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EArray = function(e1,e2) { var $x = ["EArray",1,e1,e2]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EBinop = function(op,e1,e2) { var $x = ["EBinop",2,op,e1,e2]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EField = function(e,field) { var $x = ["EField",3,e,field]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EParenthesis = function(e) { var $x = ["EParenthesis",4,e]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EObjectDecl = function(fields) { var $x = ["EObjectDecl",5,fields]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EArrayDecl = function(values) { var $x = ["EArrayDecl",6,values]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.ECall = function(e,params) { var $x = ["ECall",7,e,params]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.ENew = function(t,params) { var $x = ["ENew",8,t,params]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EUnop = function(op,postFix,e) { var $x = ["EUnop",9,op,postFix,e]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EVars = function(vars) { var $x = ["EVars",10,vars]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EFunction = function(name,f) { var $x = ["EFunction",11,name,f]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EBlock = function(exprs) { var $x = ["EBlock",12,exprs]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EFor = function(it,expr) { var $x = ["EFor",13,it,expr]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EIn = function(e1,e2) { var $x = ["EIn",14,e1,e2]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EIf = function(econd,eif,eelse) { var $x = ["EIf",15,econd,eif,eelse]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EWhile = function(econd,e,normalWhile) { var $x = ["EWhile",16,econd,e,normalWhile]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.ESwitch = function(e,cases,edef) { var $x = ["ESwitch",17,e,cases,edef]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.ETry = function(e,catches) { var $x = ["ETry",18,e,catches]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EReturn = function(e) { var $x = ["EReturn",19,e]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EBreak = ["EBreak",20];
haxe.macro.ExprDef.EBreak.toString = $estr;
haxe.macro.ExprDef.EBreak.__enum__ = haxe.macro.ExprDef;
haxe.macro.ExprDef.EContinue = ["EContinue",21];
haxe.macro.ExprDef.EContinue.toString = $estr;
haxe.macro.ExprDef.EContinue.__enum__ = haxe.macro.ExprDef;
haxe.macro.ExprDef.EUntyped = function(e) { var $x = ["EUntyped",22,e]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EThrow = function(e) { var $x = ["EThrow",23,e]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.ECast = function(e,t) { var $x = ["ECast",24,e,t]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EDisplay = function(e,isCall) { var $x = ["EDisplay",25,e,isCall]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EDisplayNew = function(t) { var $x = ["EDisplayNew",26,t]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.ETernary = function(econd,eif,eelse) { var $x = ["ETernary",27,econd,eif,eelse]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.ECheckType = function(e,t) { var $x = ["ECheckType",28,e,t]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EMeta = function(s,e) { var $x = ["EMeta",29,s,e]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.__empty_constructs__ = [haxe.macro.ExprDef.EBreak,haxe.macro.ExprDef.EContinue];
haxe.macro.ComplexType = $hxClasses["haxe.macro.ComplexType"] = { __ename__ : ["haxe","macro","ComplexType"], __constructs__ : ["TPath","TFunction","TAnonymous","TParent","TExtend","TOptional"] };
haxe.macro.ComplexType.TPath = function(p) { var $x = ["TPath",0,p]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; };
haxe.macro.ComplexType.TFunction = function(args,ret) { var $x = ["TFunction",1,args,ret]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; };
haxe.macro.ComplexType.TAnonymous = function(fields) { var $x = ["TAnonymous",2,fields]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; };
haxe.macro.ComplexType.TParent = function(t) { var $x = ["TParent",3,t]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; };
haxe.macro.ComplexType.TExtend = function(p,fields) { var $x = ["TExtend",4,p,fields]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; };
haxe.macro.ComplexType.TOptional = function(t) { var $x = ["TOptional",5,t]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; };
haxe.macro.ComplexType.__empty_constructs__ = [];
haxe.macro.TypeParam = $hxClasses["haxe.macro.TypeParam"] = { __ename__ : ["haxe","macro","TypeParam"], __constructs__ : ["TPType","TPExpr"] };
haxe.macro.TypeParam.TPType = function(t) { var $x = ["TPType",0,t]; $x.__enum__ = haxe.macro.TypeParam; $x.toString = $estr; return $x; };
haxe.macro.TypeParam.TPExpr = function(e) { var $x = ["TPExpr",1,e]; $x.__enum__ = haxe.macro.TypeParam; $x.toString = $estr; return $x; };
haxe.macro.TypeParam.__empty_constructs__ = [];
haxe.rtti = {};
haxe.rtti.CType = $hxClasses["haxe.rtti.CType"] = { __ename__ : ["haxe","rtti","CType"], __constructs__ : ["CUnknown","CEnum","CClass","CTypedef","CFunction","CAnonymous","CDynamic","CAbstract"] };
haxe.rtti.CType.CUnknown = ["CUnknown",0];
haxe.rtti.CType.CUnknown.toString = $estr;
haxe.rtti.CType.CUnknown.__enum__ = haxe.rtti.CType;
haxe.rtti.CType.CEnum = function(name,params) { var $x = ["CEnum",1,name,params]; $x.__enum__ = haxe.rtti.CType; $x.toString = $estr; return $x; };
haxe.rtti.CType.CClass = function(name,params) { var $x = ["CClass",2,name,params]; $x.__enum__ = haxe.rtti.CType; $x.toString = $estr; return $x; };
haxe.rtti.CType.CTypedef = function(name,params) { var $x = ["CTypedef",3,name,params]; $x.__enum__ = haxe.rtti.CType; $x.toString = $estr; return $x; };
haxe.rtti.CType.CFunction = function(args,ret) { var $x = ["CFunction",4,args,ret]; $x.__enum__ = haxe.rtti.CType; $x.toString = $estr; return $x; };
haxe.rtti.CType.CAnonymous = function(fields) { var $x = ["CAnonymous",5,fields]; $x.__enum__ = haxe.rtti.CType; $x.toString = $estr; return $x; };
haxe.rtti.CType.CDynamic = function(t) { var $x = ["CDynamic",6,t]; $x.__enum__ = haxe.rtti.CType; $x.toString = $estr; return $x; };
haxe.rtti.CType.CAbstract = function(name,params) { var $x = ["CAbstract",7,name,params]; $x.__enum__ = haxe.rtti.CType; $x.toString = $estr; return $x; };
haxe.rtti.CType.__empty_constructs__ = [haxe.rtti.CType.CUnknown];
haxe.rtti.Rights = $hxClasses["haxe.rtti.Rights"] = { __ename__ : ["haxe","rtti","Rights"], __constructs__ : ["RNormal","RNo","RCall","RMethod","RDynamic","RInline"] };
haxe.rtti.Rights.RNormal = ["RNormal",0];
haxe.rtti.Rights.RNormal.toString = $estr;
haxe.rtti.Rights.RNormal.__enum__ = haxe.rtti.Rights;
haxe.rtti.Rights.RNo = ["RNo",1];
haxe.rtti.Rights.RNo.toString = $estr;
haxe.rtti.Rights.RNo.__enum__ = haxe.rtti.Rights;
haxe.rtti.Rights.RCall = function(m) { var $x = ["RCall",2,m]; $x.__enum__ = haxe.rtti.Rights; $x.toString = $estr; return $x; };
haxe.rtti.Rights.RMethod = ["RMethod",3];
haxe.rtti.Rights.RMethod.toString = $estr;
haxe.rtti.Rights.RMethod.__enum__ = haxe.rtti.Rights;
haxe.rtti.Rights.RDynamic = ["RDynamic",4];
haxe.rtti.Rights.RDynamic.toString = $estr;
haxe.rtti.Rights.RDynamic.__enum__ = haxe.rtti.Rights;
haxe.rtti.Rights.RInline = ["RInline",5];
haxe.rtti.Rights.RInline.toString = $estr;
haxe.rtti.Rights.RInline.__enum__ = haxe.rtti.Rights;
haxe.rtti.Rights.__empty_constructs__ = [haxe.rtti.Rights.RNormal,haxe.rtti.Rights.RNo,haxe.rtti.Rights.RMethod,haxe.rtti.Rights.RDynamic,haxe.rtti.Rights.RInline];
haxe.rtti.TypeTree = $hxClasses["haxe.rtti.TypeTree"] = { __ename__ : ["haxe","rtti","TypeTree"], __constructs__ : ["TPackage","TClassdecl","TEnumdecl","TTypedecl","TAbstractdecl"] };
haxe.rtti.TypeTree.TPackage = function(name,full,subs) { var $x = ["TPackage",0,name,full,subs]; $x.__enum__ = haxe.rtti.TypeTree; $x.toString = $estr; return $x; };
haxe.rtti.TypeTree.TClassdecl = function(c) { var $x = ["TClassdecl",1,c]; $x.__enum__ = haxe.rtti.TypeTree; $x.toString = $estr; return $x; };
haxe.rtti.TypeTree.TEnumdecl = function(e) { var $x = ["TEnumdecl",2,e]; $x.__enum__ = haxe.rtti.TypeTree; $x.toString = $estr; return $x; };
haxe.rtti.TypeTree.TTypedecl = function(t) { var $x = ["TTypedecl",3,t]; $x.__enum__ = haxe.rtti.TypeTree; $x.toString = $estr; return $x; };
haxe.rtti.TypeTree.TAbstractdecl = function(a) { var $x = ["TAbstractdecl",4,a]; $x.__enum__ = haxe.rtti.TypeTree; $x.toString = $estr; return $x; };
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
js.d3 = {};
js.d3._D3 = {};
js.d3._D3.InitPriority = function() { };
$hxClasses["js.d3._D3.InitPriority"] = js.d3._D3.InitPriority;
js.d3._D3.InitPriority.__name__ = ["js","d3","_D3","InitPriority"];
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
m3.comm.ChannelRequest = function() { };
$hxClasses["m3.comm.ChannelRequest"] = m3.comm.ChannelRequest;
m3.comm.ChannelRequest.__name__ = ["m3","comm","ChannelRequest"];
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
qoid.AuthenticationResponse = function() { };
$hxClasses["qoid.AuthenticationResponse"] = qoid.AuthenticationResponse;
qoid.AuthenticationResponse.__name__ = ["qoid","AuthenticationResponse"];
qoid.AuthenticationResponse.prototype = {
	__class__: qoid.AuthenticationResponse
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
qoid.model.NotificationKind = $hxClasses["qoid.model.NotificationKind"] = { __ename__ : ["qoid","model","NotificationKind"], __constructs__ : ["IntroductionRequest","VerificationRequest","VerificationResponse"] };
qoid.model.NotificationKind.IntroductionRequest = ["IntroductionRequest",0];
qoid.model.NotificationKind.IntroductionRequest.toString = $estr;
qoid.model.NotificationKind.IntroductionRequest.__enum__ = qoid.model.NotificationKind;
qoid.model.NotificationKind.VerificationRequest = ["VerificationRequest",1];
qoid.model.NotificationKind.VerificationRequest.toString = $estr;
qoid.model.NotificationKind.VerificationRequest.__enum__ = qoid.model.NotificationKind;
qoid.model.NotificationKind.VerificationResponse = ["VerificationResponse",2];
qoid.model.NotificationKind.VerificationResponse.toString = $estr;
qoid.model.NotificationKind.VerificationResponse.__enum__ = qoid.model.NotificationKind;
qoid.model.NotificationKind.__empty_constructs__ = [qoid.model.NotificationKind.IntroductionRequest,qoid.model.NotificationKind.VerificationRequest,qoid.model.NotificationKind.VerificationResponse];
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
			return m3.serialization.Serializer.get_instance().fromJsonX(fromJson,qoid.model.Content);
		} catch( e ) {
			m3.log.Logga.get_DEFAULT().error(e);
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
qoid.model.Verification = function() { };
$hxClasses["qoid.model.Verification"] = qoid.model.Verification;
qoid.model.Verification.__name__ = ["qoid","model","Verification"];
qoid.model.Verification.prototype = {
	__class__: qoid.model.Verification
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
agentui.model.EM.delegate = m3.event.EventManager.get_instance();
qoid.QoidAPI.channels = new Array();
qoid.QoidAPI.set_activeChannel(null);
qoid.QoidAPI.longPolls = new haxe.ds.StringMap();
qoid.Qoid.introductions = new m3.observable.ObservableSet(qoid.model.ModelObjWithIid.identifier);
qoid.Qoid.notifications = new m3.observable.ObservableSet(qoid.model.ModelObjWithIid.identifier);
qoid.Qoid.aliases = new m3.observable.ObservableSet(qoid.model.ModelObjWithIid.identifier);
qoid.Qoid.aliases.listen(function(a,evt) {
	if(evt.isAddOrUpdate()) {
		var p = m3.helper.OSetHelper.getElementComplex(qoid.Qoid.profiles,a.iid,"aliasIid");
		if(p != null) a.profile = p;
		if(evt.isAdd()) m3.event.EventManager.get_instance().change(qoid.QE.onAliasCreated,a); else m3.event.EventManager.get_instance().change(qoid.QE.onAliasUpdated,a);
	}
});
qoid.Qoid.labels = new m3.observable.ObservableSet(qoid.model.Label.identifier);
qoid.Qoid.connections = new m3.observable.ObservableSet(qoid.model.Connection.identifier);
qoid.Qoid.connections.listen(function(c,evt1) {
	if(evt1.isAdd()) qoid.QoidAPI.getProfile(c.iid);
});
qoid.Qoid.groupedConnections = new m3.observable.GroupedSet(qoid.Qoid.connections,function(c1) {
	return c1.aliasIid;
});
qoid.Qoid.labelAcls = new m3.observable.ObservableSet(qoid.model.LabelAcl.identifier);
qoid.Qoid.groupedLabelAcls = new m3.observable.GroupedSet(qoid.Qoid.labelAcls,function(l) {
	return l.connectionIid;
});
qoid.Qoid.labelChildren = new m3.observable.ObservableSet(qoid.model.LabelChild.identifier);
qoid.Qoid.groupedLabelChildren = new m3.observable.GroupedSet(qoid.Qoid.labelChildren,function(lc) {
	return lc.parentIid;
});
qoid.Qoid.labeledContent = new m3.observable.ObservableSet(qoid.model.LabeledContent.identifier);
qoid.Qoid.groupedLabeledContent = new m3.observable.GroupedSet(qoid.Qoid.labeledContent,function(lc1) {
	return lc1.contentIid;
});
qoid.Qoid.profiles = new m3.observable.ObservableSet(qoid.model.Profile.identifier);
qoid.Qoid.profiles.listen(function(p1,evt2) {
	if(evt2.isAddOrUpdate()) {
		var alias = m3.helper.OSetHelper.getElement(qoid.Qoid.aliases,p1.aliasIid);
		if(alias != null) {
			alias.profile = p1;
			qoid.Qoid.aliases.addOrUpdate(alias);
		}
	}
});
qoid.Qoid.verificationContent = new m3.observable.ObservableSet(qoid.model.ModelObjWithIid.identifier);
m3.serialization.Serializer.get_instance().addHandler(qoid.model.Content,new qoid.model.ContentHandler());
m3.serialization.Serializer.get_instance().addHandler(qoid.model.Notification,new qoid.model.NotificationHandler());
m3.event.EventManager.get_instance().on("onConnectionProfile",qoid.Qoid.processProfile);
agentui.model.ContentSource.filteredContent = new m3.observable.ObservableSet(qoid.model.ModelObjWithIid.identifier);
agentui.model.ContentSource.listeners = new Array();
agentui.model.EM.addListener(qoid.QE.onAliasLoaded,agentui.model.ContentSource.onAliasLoaded,"ContentSource-AliasLoaded");
agentui.model.EM.addListener(agentui.model.EMEvent.LoadFilteredContent,agentui.model.ContentSource.onLoadFilteredContent,"ContentSource-LoadFilteredContent");
agentui.model.EM.addListener(agentui.model.EMEvent.AppendFilteredContent,agentui.model.ContentSource.onAppendFilteredContent,"ContentSource-AppendFilteredContent");
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
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of AndOrToggle must be a div element");
		selfElement.addClass("andOrToggle");
		var or = new $("<div class='ui-widget-content ui-state-active ui-corner-top any'>Any</div>");
		var and = new $("<div class='ui-widget-content ui-corner-bottom all'>All</div>");
		selfElement.append(or).append(and);
		var children = selfElement.children();
		children.hover(function(evt) {
			$(this).addClass("ui-state-hover");
		},function(evt1) {
			$(this).removeClass("ui-state-hover");
		}).click(function(evt2) {
			children.toggleClass("ui-state-active");
			self._fireFilter();
		});
		selfElement.data("getNode",function() {
			var root;
			if(or.hasClass("ui-state-active")) root = new agentui.model.Or(); else root = new agentui.model.And();
			return root;
		});
	}, _fireFilter : function() {
		var selfElement1 = this.element;
		var filter;
		filter = js.Boot.__cast(selfElement1.closest("#filter") , $);
		filter.filterComp("fireFilter");
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.andOrToggle",defineWidget());
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of FilterCombination must be a div element");
		selfElement.data("getNode",function() {
			var root = (selfElement.children(".andOrToggle").data("getNode"))();
			var filterables = selfElement.children(".filterable");
			filterables.each(function(idx,el) {
				var filterable = new $(el);
				var node = (filterable.data("getNode"))();
				root.addNode(node);
			});
			return root;
		});
		self._filterables = new m3.observable.ObservableSet(function(fc) {
			return fc.attr("id");
		});
		self._filterables.listen(function(fc1,evt) {
			if(evt.isAdd()) self._add(fc1); else if(evt.isUpdate()) {
				fc1.css("position","absolute").css({ left : "", top : ""});
				self._layout();
			} else if(evt.isDelete()) self._remove(fc1);
		});
		selfElement.on("dragstop",function(dragstopEvt,dragstopUi) {
			m3.log.Logga.get_DEFAULT().debug("dragstop on filtercombo");
			if(self.options.dragstop != null) self.options.dragstop(dragstopEvt,dragstopUi);
		});
		selfElement.addClass("ui-state-highlight connectionDT labelDT filterable dropCombiner filterCombination filterTrashable container shadow" + m3.widget.Widgets.getWidgetClasses());
		self._id = selfElement.attr("id");
		if(m3.helper.StringHelper.isBlank(self._id)) {
			self._id = m3.util.UidGenerator.create(8);
			selfElement.attr("id",self._id);
		}
		selfElement.position({ my : "bottom right", at : "left top", of : self.options.event, collision : "flipfit", within : "#filter"});
		selfElement.data("clone",function(filterableComp,isDragByHelper,containment) {
			if(containment == null) containment = false;
			if(isDragByHelper == null) isDragByHelper = false;
			var fc2;
			fc2 = js.Boot.__cast(filterableComp , $);
			return fc2;
		});
		var toggle = new $("<div class='andOrToggle'></div>").andOrToggle();
		selfElement.append(toggle);
		(js.Boot.__cast(selfElement , $)).draggable({ distance : 10, scroll : false});
		(js.Boot.__cast(selfElement , $)).droppable({ accept : function(d) {
			return self.options.type == "LABEL" && d["is"](".label") || self.options.type == "CONNECTION" && d["is"](".connectionAvatar");
		}, activeClass : "ui-state-hover", hoverClass : "ui-state-active", greedy : true, drop : function(event,_ui) {
			var clone = (_ui.draggable.data("clone"))(_ui.draggable,false,"window");
			clone.addClass("filterTrashable " + Std.string(_ui.draggable.data("dropTargetClass"))).appendTo(selfElement).css("position","absolute").css({ left : "", top : ""});
			self.addFilterable(clone);
			selfElement.position({ collision : "flipfit", within : "#filter"});
		}, tolerance : "pointer"});
	}, position : function() {
		var self1 = this;
		var selfElement1 = this.element;
		selfElement1.position({ my : "center", at : "center", of : self1.options.event, collision : "flipfit", within : "#filter"});
	}, addFilterable : function(filterable1) {
		var self2 = this;
		self2._filterables.add(filterable1);
		if(self2._filterables.size() > 1) self2._fireFilter();
	}, removeFilterable : function(filterable2) {
		var self3 = this;
		self3._filterables["delete"](filterable2);
	}, _add : function(filterable3) {
		var self4 = this;
		var selfElement2 = this.element;
		filterable3.appendTo(selfElement2).addClass("inFilterCombination").css("position","absolute").css({ left : "", top : ""}).on("dragstop",function(evt1) {
			if(!filterable3.parent("#" + self4._id).exists()) self4.removeFilterable(filterable3);
		});
		self4._layout();
	}, _remove : function(filterable4) {
		var self5 = this;
		var selfElement3 = this.element;
		filterable4.removeClass("inFilterCombination");
		var iter = self5._filterables.iterator();
		if(iter.hasNext()) {
			var filterable5 = iter.next();
			if(iter.hasNext()) self5._layout(); else {
				var position = filterable5.offset();
				filterable5.appendTo(selfElement3.parent()).offset(position);
				selfElement3.remove();
				self5.destroy();
			}
		} else {
			self5.destroy();
			selfElement3.remove();
		}
	}, _layout : function() {
		var self6 = this;
		var selfElement4 = this.element;
		var filterableConns = new m3.observable.FilteredSet(self6._filterables,function(fc3) {
			return fc3.hasClass("connectionAvatar");
		});
		var filterableLabels = new m3.observable.FilteredSet(self6._filterables,function(fc4) {
			return fc4.hasClass("label");
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
		selfElement4.css({ width : 35 * connPairs + 135 * labelPairs + "px", 'min-width' : 35 * connPairs + 135 * labelPairs + "px"});
	}, _fireFilter : function() {
		var selfElement5 = this.element;
		var filter;
		filter = js.Boot.__cast(selfElement5.parent("#filter") , $);
		filter.filterComp("fireFilter");
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.filterCombination",defineWidget());
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
	}}, getConnection : function() {
		var self = this;
		return m3.helper.OSetHelper.getElement(qoid.Qoid.connections,self.options.connectionIid);
	}, getAlias : function() {
		var self1 = this;
		return m3.helper.OSetHelper.getElement(qoid.Qoid.aliases,self1.options.aliasIid);
	}, _create : function() {
		var self2 = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of ConnectionAvatar must be a div element");
		var id;
		id = "connavatar_" + (self2.options.aliasIid == null?self2.options.connectionIid:self2.options.aliasIid);
		selfElement.attr("id",id);
		selfElement.addClass(m3.widget.Widgets.getWidgetClasses() + " connectionAvatar filterable");
		if(self2.options.aliasIid != null) selfElement.addClass("aliasAvatar");
		var img = new $("<img class='shadow'/>");
		selfElement.append(img);
		self2._updateWidgets(new qoid.model.Profile());
		if(self2.options.connectionIid != null) {
			self2.filteredSetConnection = new m3.observable.FilteredSet(qoid.Qoid.connections,function(c) {
				return c.iid == self2.options.connectionIid;
			});
			self2._onUpdateConnection = function(c1,evt) {
				if(evt.isAddOrUpdate()) self2._updateWidgets(c1.data); else if(evt.isDelete()) {
					self2.destroy();
					selfElement.remove();
				}
			};
			self2.filteredSetConnection.listen(self2._onUpdateConnection);
		} else if(self2.options.aliasIid != null) {
			self2.filteredSetAlias = new m3.observable.FilteredSet(qoid.Qoid.aliases,function(a) {
				return a.iid == self2.options.aliasIid;
			});
			self2._onUpdateAlias = function(a1,evt1) {
				if(evt1.isAddOrUpdate()) self2._updateWidgets(a1.profile); else if(evt1.isDelete()) {
					self2.destroy();
					selfElement.remove();
				}
			};
			self2.filteredSetAlias.listen(self2._onUpdateAlias);
		} else m3.log.Logga.get_DEFAULT().warn("Both connectionIid and aliasIid are not set for Avatar");
		(js.Boot.__cast(selfElement , $)).tooltip();
		if(!self2.options.dndEnabled) img.mousedown(function(evt2) {
			return false;;
		}); else {
			selfElement.addClass("filterable");
			selfElement.data("clone",self2.options.cloneFcn);
			selfElement.data("dropTargetClass",self2.options.dropTargetClass);
			selfElement.data("getNode",function() {
				if(self2.options.connectionIid != null) return new agentui.model.ConnectionNode(self2.getConnection()); else return null;
			});
			selfElement.on("dragstop",function(dragstopEvt,dragstopUi) {
				if(self2.options.dragstop != null) self2.options.dragstop(dragstopEvt,dragstopUi);
			});
			var helper = "clone";
			if(!self2.options.isDragByHelper) helper = "original"; else if(self2.options.helperFcn != null && Reflect.isFunction(self2.options.helperFcn)) helper = self2.options.helperFcn;
			(js.Boot.__cast(selfElement , $)).draggable({ containment : self2.options.containment, helper : helper, distance : 10, revertDuration : 200, scroll : false, start : function(evt3,_ui) {
				(js.Boot.__cast(selfElement , $)).draggable("option","revert",false);
			}});
			(js.Boot.__cast(selfElement , $)).droppable({ accept : function(d) {
				return !$(this).parent()["is"](".filterCombination") && (d["is"](".labelComp") || $(this).parent()["is"](".dropCombiner") && d["is"](".connectionAvatar"));
			}, activeClass : "ui-state-hover", hoverClass : "ui-state-active", greedy : true, drop : function(event,_ui1) {
				if(_ui1.draggable["is"](".labelComp")) {
					var labelComp;
					labelComp = js.Boot.__cast(_ui1.draggable , $);
					var connection = m3.helper.OSetHelper.getElement(qoid.Qoid.connections,self2.options.connectionIid);
					agentui.widget.DialogManager.allowAccess(labelComp.labelComp("getLabel"),connection);
				} else {
					var filterCombiner = new $("<div></div>");
					filterCombiner.appendTo($(this).parent());
					filterCombiner.filterCombination({ event : event, type : "CONNECTION", dragstop : self2.options.dragstop});
					filterCombiner.filterCombination("addFilterable",$(this));
					var clone2 = (_ui1.draggable.data("clone"))(_ui1.draggable,false,"#filter");
					clone2.addClass("filterTrashable " + Std.string(_ui1.draggable.data("dropTargetClass")));
					filterCombiner.filterCombination("addFilterable",clone2);
					filterCombiner.filterCombination("position");
				}
			}, tolerance : "pointer"});
		}
	}, _updateWidgets : function(profile) {
		var self3 = this;
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
		var self4 = this;
		if(self4.filteredSetConnection != null) self4.filteredSetConnection.removeListener(self4._onUpdateConnection); else if(self4.filteredSetAlias != null) self4.filteredSetAlias.removeListener(self4._onUpdateAlias);
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.connectionAvatar",defineWidget());
var defineWidget = function() {
	return { initialized : false, _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of AcceptVerificationResponseDialog must be a div element");
		selfElement.addClass("acceptVerificationResponseDialog notification-ui container boxsizingBorder");
		var conn = m3.helper.OSetHelper.getElement(qoid.Qoid.connections,self.options.notification.createdByConnectionIid);
		var intro_table = new $("<table id='intro-table'><tr><td></td><td></td><td></td></tr></table>").appendTo(selfElement);
		var avatar = new $("<div class='avatar introduction-avatar'></div>").connectionAvatar({ connectionIid : conn.iid, dndEnabled : false, isDragByHelper : true, containment : false}).appendTo(intro_table.find("td:nth-child(1)"));
		var invitationText = new $("<div class='invitationText'></div>").appendTo(intro_table.find("td:nth-child(2)"));
		var title = new $("<div class='intro-title'>Verification Response</div>").appendTo(invitationText);
		var from = new $("<div class='notification-line'><b>From:</b> " + conn.data.name + "</div>").appendTo(invitationText);
		var date = new $("<div class='notification-line'><b>Date:</b> " + Std.string(new Date()) + "</div>").appendTo(invitationText);
		var message = new $("<div class='notification-line'><b>Comments:</b> " + Std.string(self.options.notification.props.verificationContentData.text) + "</div>").appendTo(invitationText);
	}, acceptVerification : function() {
		var self1 = this;
		var selfElement1 = this.element;
		agentui.model.EM.listenOnce(agentui.model.EMEvent.AcceptVerification_RESPONSE,function(e) {
			self1.destroy();
			selfElement1.remove();
		});
		agentui.model.EM.change(agentui.model.EMEvent.AcceptVerification,self1.options.notification.iid);
	}, rejectVerification : function() {
		var self2 = this;
		var selfElement2 = this.element;
		agentui.model.EM.listenOnce(agentui.model.EMEvent.RejectVerification_RESPONSE,function(e1) {
			self2.destroy();
			selfElement2.remove();
		});
		agentui.model.EM.change(agentui.model.EMEvent.RejectVerification,self2.options.notification.iid);
	}, _buildDialog : function() {
		var self3 = this;
		var selfElement3 = this.element;
		self3.initialized = true;
		var dlgOptions = { autoOpen : false, title : "Accept Verification Response", height : 400, width : 600, modal : true, buttons : { Accept : function() {
			self3.acceptVerification();
		}, Reject : function() {
			self3.rejectVerification();
		}}, close : function(evt,ui) {
			selfElement3.find(".placeholder").removeClass("ui-state-error");
		}};
		selfElement3.dialog(dlgOptions);
	}, open : function() {
		var self4 = this;
		var selfElement4 = this.element;
		if(!self4.initialized) self4._buildDialog();
		selfElement4.dialog("open");
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.acceptVerificationResponseDialog",defineWidget());
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
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of AliasComp must be a div element");
		selfElement.addClass("ocontainer shadow ");
		self.container = new $("<div class='container'></div>");
		selfElement.append(self.container);
		self.avatar = new $("<div></div>").appendTo(self.container);
		self.userIdTxt = new $("<div class='userIdTxt'></div>");
		self.container.append(self.userIdTxt);
		self.userIdTxt.html("...");
		self._setAlias(new qoid.model.Alias());
		var changeDiv = new $("<div class='ui-helper-clearfix'></div>");
		self.container.append(changeDiv);
		self.switchAliasLink = new $("<a class='aliasToggle'>Aliases</a>");
		changeDiv.append(self.switchAliasLink);
		self.switchAliasLink.click(function(evt) {
			var aliasMenu = self._createAliasMenu();
			aliasMenu.show();
			aliasMenu.position({ my : "left top", at : "right-6px center", of : selfElement});
			evt.preventDefault();
			evt.stopPropagation();
			return false;
		});
		agentui.model.EM.addListener(qoid.QE.onAliasLoaded,function(alias) {
			self._setAlias(alias);
		},"AliasComp-Alias");
		(js.Boot.__cast(self.container , $)).droppable({ accept : function(d) {
			return d["is"](".connectionAvatar");
		}, activeClass : "ui-state-hover", hoverClass : "ui-state-active", drop : function(event,_ui) {
			var dragstop = function(dragstopEvt,dragstopUi) {
				if(!self.container.intersects(dragstopUi.helper)) {
					dragstopUi.helper.remove();
					selfElement.removeClass("targetChange");
					m3.util.JqueryUtil.deleteEffects(dragstopEvt);
					self._setAlias(qoid.Qoid.get_currentAlias());
				}
			};
			selfElement.addClass("targetChange");
			var clone = (_ui.draggable.data("clone"))(_ui.draggable,false,false,dragstop);
			clone.addClass("small");
			clone.insertBefore(new $(".ui-helper-clearfix",self.container));
			self._setTarget(agentui.widget.ConnectionAvatarHelper.getConnection(clone));
		}});
		self._onupdate = function(alias1,t) {
			if(t.isAddOrUpdate()) self._updateAliasWidgets(alias1); else if(t.isDelete()) {
				self.destroy();
				selfElement.remove();
			}
		};
		self._onupdateProfile = function(p,t1) {
			var alias2 = m3.helper.OSetHelper.getElement(qoid.Qoid.aliases,p.aliasIid);
			self._updateAliasWidgets(alias2);
		};
	}, _createAliasMenu : function() {
		var self1 = this;
		new $("#userAliasMenu").remove();
		var menu = new $("<ul id='userAliasMenu'></ul>");
		menu.appendTo(self1.container);
		var menuOptions = [];
		var menuOption;
		var aliases = new m3.observable.SortedSet(qoid.Qoid.aliases,function(a) {
			return a.profile.name.toLowerCase();
		});
		var $it0 = aliases.iterator();
		while( $it0.hasNext() ) {
			var alias3 = $it0.next();
			var alias4 = [alias3];
			menuOption = { label : alias4[0].profile.name, icon : "ui-icon-person", action : (function(alias4) {
				return function(evt1,m) {
					if(qoid.model.Alias.identifier(qoid.Qoid.get_currentAlias()) == qoid.model.Alias.identifier(alias4[0])) menu.hide(); else {
						qoid.Qoid.set_currentAlias(alias4[0]);
						agentui.model.EM.change(qoid.QE.onAliasLoaded,alias4[0]);
					}
				};
			})(alias4)};
			menuOptions.push(menuOption);
		}
		menuOption = { label : "Manage Aliases...", icon : "ui-icon-circle-plus", action : function(evt2,m1) {
			agentui.widget.DialogManager.showAliasManager();
		}};
		menuOptions.push(menuOption);
		menu.m3menu({ menuOptions : menuOptions}).hide();
		return menu;
	}, _updateAliasWidgets : function(alias5) {
		var self2 = this;
		var avatar = new $("<div class='avatar' style='position:relative;left:50px;'></div>").connectionAvatar({ aliasIid : alias5.iid, dndEnabled : true, isDragByHelper : true, containment : false});
		self2.avatar.replaceWith(avatar);
		self2.avatar = avatar;
		new $(".userIdTxt").html(alias5.profile.name);
	}, _setAlias : function(alias6) {
		var self3 = this;
		var selfElement1 = this.element;
		self3._updateAliasWidgets(alias6);
		if(self3.aliasSet != null) self3.aliasSet.removeListener(self3._onupdate);
		self3.aliasSet = new m3.observable.FilteredSet(qoid.Qoid.aliases,function(a1) {
			return a1.iid == alias6.iid;
		});
		self3.aliasSet.listen(self3._onupdate);
		if(self3.profileSet != null) self3.profileSet.removeListener(self3._onupdateProfile);
		self3.profileSet = new m3.observable.FilteredSet(qoid.Qoid.profiles,function(p1) {
			return p1.aliasIid == alias6.iid;
		});
		self3.profileSet.listen(self3._onupdateProfile);
	}, _setTarget : function(conn) {
		var self4 = this;
		self4.switchAliasLink.hide();
		self4.userIdTxt.html(conn.data.name);
		agentui.model.EM.change(agentui.model.EMEvent.TargetChange,conn);
	}, destroy : function() {
		var self5 = this;
		if(self5.aliasSet != null) self5.aliasSet.removeListener(self5._onupdate);
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.AliasComp",defineWidget());
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
if(!Array.indexOf){Array.prototype.indexOf = function(obj){for(var i=0; i<this.length; i++){if(this[i]==obj){return i;}}return -1;}}
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of UploadComp must be a div element");
		selfElement.addClass("uploadComp container " + m3.widget.Widgets.getWidgetClasses());
		self._createFileUploadComponent();
		selfElement.on("dragleave",function(evt,d) {
			m3.log.Logga.get_DEFAULT().debug("dragleave");
			var target = evt.target;
			if(target != null && target == selfElement[0]) $(this).removeClass("drop");
			evt.preventDefault();
			evt.stopPropagation();
		});
		selfElement.on("dragenter",function(evt1,d1) {
			m3.log.Logga.get_DEFAULT().debug("dragenter");
			$(this).addClass("over");
			evt1.preventDefault();
			evt1.stopPropagation();
		});
		selfElement.on("dragover",function(evt2,d2) {
			m3.log.Logga.get_DEFAULT().debug("dragover");
			evt2.preventDefault();
			evt2.stopPropagation();
		});
		selfElement.on("drop",function(evt3,d3) {
			m3.log.Logga.get_DEFAULT().debug("drop");
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
		if(self2.options.contentType == "IMAGE" && !new EReg("image","i").match(file.type)) {
			m3.util.JqueryUtil.alert("Please select an image file.");
			return;
		}
		if(self2.options.contentType == "AUDIO" && !new EReg("audio","i").match(file.type)) {
			m3.util.JqueryUtil.alert("Please select an audio file.");
			return;
		}
		m3.log.Logga.get_DEFAULT().debug("upload " + Std.string(file.name));
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
		m3.log.Logga.get_DEFAULT().debug("traverse the files");
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
var defineWidget = function() {
	return { initialized : false, _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of AliasManagerDialog must be a div element");
		selfElement.addClass("_aliasManagerDialog").hide();
		self.leftDiv = new $("<div class='fleft boxsizingBorder' id='leftDiv'></div>").appendTo(selfElement);
		self.rightDiv = new $("<div class='fright ui-corner-all'  id='rightDiv'></div>").appendTo(selfElement);
		self.rightDiv.append("<h2>Aliases</h2>");
		var alii_div = new $("<div class='alii'><div>").appendTo(self.rightDiv);
		self.aliasMap = new m3.observable.MappedSet(qoid.Qoid.aliases,function(a) {
			return new $("<div class='clickable alias_link' id='a_" + a.iid + "'></div>").appendTo(alii_div).click(function(evt) {
				self._showAliasDetail(a);
			}).append(a.profile.name);
		});
		self.aliasMap.mapListen(function(a1,w,evt1) {
			if(evt1.isAddOrUpdate()) w.html(a1.profile.name); else if(evt1.isDelete()) self._onAliasDeleted(a1,w);
		});
		self.newAliasButton = new $("<button id='new_alias_button'>New Alias</button>").button().click(function(evt2) {
			self._showAliasEditor(null);
		}).appendTo(self.rightDiv);
		self._showAliasDetail(qoid.Qoid.get_currentAlias());
	}, _onAliasDeleted : function(alias,w1) {
		var self1 = this;
		w1.remove();
		new $(".alias_link")[0].click();
	}, _showAliasDetail : function(alias1) {
		var self2 = this;
		var selfElement1 = this.element;
		self2.leftDiv.empty();
		var imgSrc = "media/default_avatar.jpg";
		var loadAliasBtn = new $("<button class='fleft'>Use This Alias</button>").appendTo(self2.leftDiv).button().click(function(evt3) {
			qoid.Qoid.set_currentAlias(alias1);
			agentui.model.EM.change(qoid.QE.onAliasLoaded,alias1);
			m3.jq.JQDialogHelper.close(selfElement1);
		});
		self2.leftDiv.append("<br class='clear'/><br/>");
		if(m3.helper.StringHelper.isNotBlank((function($this) {
			var $r;
			try {
				$r = alias1.profile.imgSrc;
			} catch( __e ) {
				$r = "";
			}
			return $r;
		}(this)))) imgSrc = alias1.profile.imgSrc;
		self2.leftDiv.append(new $("<img alt='alias' src='" + imgSrc + "' class='userImg shadow'/>"));
		self2.leftDiv.append(new $("<h2>" + alias1.profile.name + "</h2>"));
		var btnDiv = new $("<div></div>").appendTo(self2.leftDiv);
		var setDefaultBtn = new $("<button>Set Default</button>").appendTo(btnDiv).button().click(function(evt4) {
			alias1.data.isDefault = true;
			agentui.model.EM.change(agentui.model.EMEvent.UpdateAlias,alias1);
		});
		var editBtn = new $("<button>Edit</button>").appendTo(btnDiv).button().click(function(evt5) {
			self2._showAliasEditor(alias1);
		});
		var deleteBtn = new $("<button>Delete</button>").appendTo(btnDiv).button().click(function(evt6) {
			agentui.model.EM.change(agentui.model.EMEvent.DeleteAlias,alias1);
		});
		self2.newAliasButton.show();
	}, _showAliasEditor : function(alias2) {
		var self3 = this;
		var selfElement2 = this.element;
		self3.leftDiv.empty();
		var imgSrc1 = "media/default_avatar.jpg";
		self3.leftDiv.append("<div id='alias_name_label'>Alias Name:</div>");
		var aliasName = new $("<input class='ui-corner-all ui-state-active ui-widget-content' id='alias_name_input'/>").appendTo(self3.leftDiv);
		if(alias2 != null) aliasName.val(alias2.profile.name);
		self3.leftDiv.append("<br/><br/>");
		var aliasImg = null;
		self3.leftDiv.append(new $("<div id='profile_picture_label'>Profile Picture: </div>").append(new $("<a id='change_profile_picture'>Change</a>").click(function(evt7) {
			var dlg = new $("<div id='profilePictureUploader'></div>");
			dlg.appendTo(selfElement2);
			var uploadComp = new $("<div class='boxsizingBorder' style='height: 150px;'></div>");
			uploadComp.appendTo(dlg);
			uploadComp.uploadComp({ onload : function(bytes) {
				m3.jq.M3DialogHelper.close(dlg);
				aliasImg.attr("src",bytes);
			}});
			dlg.m3dialog({ width : 600, height : 305, title : "Profile Image Uploader", buttons : { Cancel : function() {
				m3.jq.M3DialogHelper.close($(this));
			}}});
		})));
		if(m3.helper.StringHelper.isNotBlank((function($this) {
			var $r;
			try {
				$r = alias2.profile.imgSrc;
			} catch( __e1 ) {
				$r = "";
			}
			return $r;
		}(this)))) imgSrc1 = alias2.profile.imgSrc;
		aliasImg = new $("<img alt='alias' src='" + imgSrc1 + "' class='userImg shadow'/>");
		self3.leftDiv.append(aliasImg);
		self3.leftDiv.append("<br/><br/>");
		var btnDiv1 = new $("<div></div>").appendTo(self3.leftDiv);
		var updateBtn = new $("<button>" + (alias2 != null?"Update":"Create") + "</button>").appendTo(btnDiv1).button().click(function(evt8) {
			var name = aliasName.val();
			if(m3.helper.StringHelper.isBlank(name)) {
				m3.util.JqueryUtil.alert("Alias name cannot be blank.","Error");
				return;
			}
			var profilePic = aliasImg.attr("src");
			if(m3.helper.StringHelper.startsWithAny(profilePic,["media"])) profilePic = "";
			var applyDlg;
			if(alias2 == null) {
				alias2 = new qoid.model.Alias();
				alias2.profile.name = name;
				alias2.profile.imgSrc = profilePic;
				alias2.labelIid = qoid.Qoid.get_currentAlias().labelIid;
				applyDlg = function() {
					agentui.model.EM.listenOnce(qoid.QE.onAliasCreated,function(alias3) {
						haxe.Timer.delay(function() {
							self3._showAliasDetail(alias3);
						},100);
					});
					qoid.QoidAPI.createAlias(alias2.profile.name,alias2.profile.imgSrc);
				};
			} else {
				alias2.profile.name = name;
				alias2.profile.imgSrc = profilePic;
				applyDlg = function() {
					agentui.model.EM.listenOnce(qoid.QE.onAliasUpdated,function(alias4) {
						self3._showAliasDetail(alias4);
					});
					agentui.model.EM.change(agentui.model.EMEvent.UpdateAlias,alias2);
				};
			}
			applyDlg();
		});
		var cancelBtn = new $("<button>Cancel</button>").appendTo(btnDiv1).button().click(function(evt9) {
			self3._showAliasDetail(alias2);
		});
		self3.newAliasButton.hide();
	}, _buildDialog : function() {
		var self4 = this;
		var selfElement3 = this.element;
		self4.initialized = true;
		var dlgOptions = { autoOpen : false, title : "Alias Manager", height : 440, width : 550, buttons : { }, close : function(evt10,ui) {
			selfElement3.find(".placeholder").removeClass("ui-state-error");
		}};
		selfElement3.dialog(dlgOptions);
	}, open : function() {
		var self5 = this;
		var selfElement4 = this.element;
		if(!self5.initialized) self5._buildDialog();
		m3.jq.JQDialogHelper.open(selfElement4);
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.aliasManagerDialog",defineWidget());
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
			var label = m3.helper.OSetHelper.getElement(qoid.Qoid.labels,iid);
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
		self2.filteredSet = new m3.observable.FilteredSet(qoid.Qoid.labels,function(label2) {
			return label2.iid == self2.options.labelIid;
		});
		self2.filteredSet.listen(self2._onupdate);
	}, _create : function() {
		var self3 = this;
		var selfElement1 = this.element;
		if(!selfElement1["is"]("div")) throw new m3.exception.Exception("Root of LabelComp must be a div element");
		self3.label = m3.helper.OSetHelper.getElement(qoid.Qoid.labels,self3.options.labelIid);
		if(self3.label == null) {
			self3.label = new qoid.model.Label("-->*<--");
			self3.label.iid = self3.options.labelIid;
			qoid.Qoid.labels.add(self3.label);
		}
		selfElement1.addClass("label labelComp ").attr("id",StringTools.htmlEscape(self3.label.name) + "_" + m3.util.UidGenerator.create(8));
		var labelTail = new $("<div class='labelTail'></div>");
		labelTail.css("border-right-color",self3.label.data.color);
		selfElement1.append(labelTail);
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
				return new agentui.model.LabelNode(self3.label,self3.getLabelPathNames());
			});
			var helper = "clone";
			if(!self3.options.isDragByHelper) helper = "original"; else if(self3.options.helperFcn != null && Reflect.isFunction(self3.options.helperFcn)) helper = self3.options.helperFcn;
			selfElement1.on("dragstop",function(dragstopEvt,_ui) {
				m3.log.Logga.get_DEFAULT().debug("dragstop on label | " + self3.label.name);
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
				var eld = new qoid.model.EditLabelData(agentui.widget.LabelCompHelper.getLabel(labelComp1),agentui.widget.LabelCompHelper.parentIid(labelComp1),self3.getLabel().iid);
				if(event4.ctrlKey) agentui.model.EM.change(agentui.model.EMEvent.CopyLabel,eld); else agentui.model.EM.change(agentui.model.EMEvent.MoveLabel,eld);
			};
			(js.Boot.__cast(selfElement1 , $)).droppable({ accept : function(d) {
				return !$(this).parent()["is"](".filterCombination") && d["is"](".label") && ($(this).parent()["is"](".dropCombiner") || $(this).parent()["is"](".labelTreeBranch"));
			}, activeClass : "ui-state-hover", hoverClass : "ui-state-active", greedy : true, drop : function(event5,_ui6) {
				if($(this).parent()["is"](".labelTreeBranch")) copyOrMoveLabel(event5,_ui6); else {
					var filterCombiner = new $("<div></div>");
					filterCombiner.appendTo($(this).parent());
					filterCombiner.filterCombination({ event : event5, type : "LABEL", dragstop : self3.options.dragstop});
					filterCombiner.filterCombination("addFilterable",$(this));
					var clone1 = (_ui6.draggable.data("clone"))(_ui6.draggable,false,"window");
					clone1.addClass("filterTrashable " + Std.string(_ui6.draggable.data("dropTargetClass")));
					filterCombiner.filterCombination("addFilterable",clone1);
					filterCombiner.filterCombination("position");
				}
			}, tolerance : "pointer"});
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
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of AllowAccessDialog must be a div element");
		selfElement.addClass("allowAccessDialog").hide();
	}, _buildDialog : function() {
		var self1 = this;
		var selfElement1 = this.element;
		selfElement1.append("<div>Would you like to allow</div>");
		new $("<div></div>").connectionAvatar({ dndEnabled : false, connectionIid : self1.options.connection.iid}).appendTo(selfElement1);
		selfElement1.append("<div>" + self1.options.connection.data.name + "</div>");
		selfElement1.append("<div>&nbsp;</div>");
		selfElement1.append("<div>to access the label:</div>");
		selfElement1.append("<div>&nbsp;</div>");
		new $("<div></div>").labelComp({ dndEnabled : false, labelIid : self1.options.label.iid}).appendTo(selfElement1);
		selfElement1.append("<div>&nbsp;&nbsp;?&nbsp;&nbsp;</div>");
		var dlgOptions = { autoOpen : false, title : "Allow Access", height : 340, width : 300, modal : true, buttons : { Allow : function() {
			self1._allowAccess();
		}, Cancel : function() {
			$(this).dialog("close");
		}}};
		selfElement1.dialog(dlgOptions);
	}, _allowAccess : function() {
		var self2 = this;
		var selfElement2 = this.element;
		agentui.model.EM.listenOnce(agentui.model.EMEvent.AccessGranted,function(n) {
			m3.jq.JQDialogHelper.close(selfElement2);
		});
		var parms = { connectionIid : self2.options.connection.iid, labelIid : self2.options.label.iid};
		agentui.model.EM.change(agentui.model.EMEvent.GrantAccess,parms);
	}, open : function() {
		var self3 = this;
		var selfElement3 = this.element;
		if(selfElement3.exists()) {
			selfElement3.empty();
			self3._create();
		}
		self3._buildDialog();
		selfElement3.dialog("open");
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.allowAccessDialog",defineWidget());
var defineWidget = function() {
	return { options : { message : null, orientation : null}, _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of ChatMessageComp must be a div element");
		selfElement.addClass("chatMessageComp ui-helper-clearfix " + Std.string(self.options.orientation) + m3.widget.Widgets.getWidgetClasses());
		new $("<div>" + self.options.message.props.text + "</div>").appendTo(selfElement);
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.chatMessageComp",defineWidget());
var defineWidget = function() {
	return { options : { connection : null, messages : null}, _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of ChatComp must be a div element");
		selfElement.addClass("chatComp " + m3.widget.Widgets.getWidgetClasses());
		var chatMsgs = new $("<div class='chatMsgs'></div>").appendTo(selfElement);
		var chatInput = new $("<div class='chatInput'></div>").appendTo(selfElement);
		var input = new $("<input class='ui-corner-all ui-widget-content boxsizingBorder' />").appendTo(chatInput);
		self.chatMessages = new m3.observable.MappedSet(self.options.messages,function(msg) {
			return new $("<div></div>").chatMessageComp({ message : msg, orientation : agentui.widget.ChatOrientation.chatRight});
		});
		self.chatMessages.listen(function(chatMessageComp,evt) {
			if(evt.isAdd()) {
				chatMsgs.append(chatMessageComp);
				chatMsgs.scrollTop(chatMsgs.height());
			} else if(evt.isUpdate()) chatMessageComp.chatMessageComp("update"); else if(evt.isDelete()) chatMessageComp.remove();
		});
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.chatComp",defineWidget());
var defineWidget = function() {
	return { options : { connection : null, classes : null}, _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of ConnectionComp must be a div element");
		selfElement.dblclick(function(evt) {
			var it = self.notifications.iterator();
			if(it.hasNext()) {
				var notification = it.next();
				var _g = notification.kind;
				switch(_g[1]) {
				case 0:
					agentui.widget.DialogManager.respondToIntroduction(js.Boot.__cast(notification , qoid.model.IntroductionRequestNotification));
					break;
				case 1:
					agentui.widget.DialogManager.respondToVerificationRequest(js.Boot.__cast(notification , qoid.model.VerificationRequestNotification));
					break;
				case 2:
					agentui.widget.DialogManager.acceptVerificationResponse(js.Boot.__cast(notification , qoid.model.VerificationResponseNotification));
					break;
				}
			}
		});
		self.filteredSetConnection = new m3.observable.FilteredSet(qoid.Qoid.connections,function(c) {
			return c.iid == self.options.connection.iid;
		});
		self._onUpdateConnection = function(c1,evt1) {
			if(evt1.isDelete()) {
				self.destroy();
				selfElement.remove();
			}
		};
		self.filteredSetConnection.listen(self._onUpdateConnection);
		selfElement.addClass(m3.widget.Widgets.getWidgetClasses() + " connection container boxsizingBorder");
		self._avatar = new $("<div class='avatar'></div>").connectionAvatar({ connectionIid : self.options.connection.iid, dndEnabled : true, isDragByHelper : true, containment : false});
		self._notifications = new $(".notifications",selfElement);
		if(!self._notifications.exists()) self._notifications = new $("<div class='notifications'>0</div>");
		self._notifications.appendTo(selfElement);
		selfElement.append(self._avatar);
		selfElement.append("<div class='name'>" + self.options.connection.data.name + "</div>");
		selfElement.append("<div class='clear'></div>");
		(js.Boot.__cast(selfElement , $)).droppable({ accept : function(d) {
			return d["is"](".connectionAvatar");
		}, activeClass : "ui-state-hover", hoverClass : "ui-state-active", greedy : true, drop : function(event,_ui) {
			var dropper = agentui.widget.ConnectionAvatarHelper.getConnection(js.Boot.__cast(_ui.draggable , $));
			var droppee = self.options.connection;
			if(!dropper.equals(droppee)) {
				var intro = null;
				var $it1 = qoid.Qoid.introductions.iterator();
				while( $it1.hasNext() ) {
					var i = $it1.next();
					if(i.aConnectionIid == dropper.iid && i.bConnectionIid == droppee.iid || i.bConnectionIid == dropper.iid && i.aConnectionIid == droppee.iid) {
						intro = i;
						break;
					}
				}
				if(intro != null) {
					if(intro.bState == qoid.model.IntroductionState.NotResponded || intro.aState == qoid.model.IntroductionState.NotResponded) m3.util.JqueryUtil.alert("There is already a pending introduction between these two aliases"); else if(intro.bState == qoid.model.IntroductionState.Accepted && intro.aState == qoid.model.IntroductionState.Accepted) m3.util.JqueryUtil.alert("These two aliases are already connected");
				} else agentui.widget.DialogManager.requestIntroduction(dropper,droppee);
			}
		}, tolerance : "pointer"});
		self.notifications = new m3.observable.FilteredSet(qoid.Qoid.notifications,function(n) {
			return n.createdByConnectionIid == self.options.connection.iid;
		});
		self.notifications.listen(function(i1,evt2) {
			if(evt2.isAdd()) self.addNotification(); else if(evt2.isDelete()) self.deleteNotification();
		});
	}, update : function(conn) {
		var self1 = this;
		var selfElement1 = this.element;
		self1.options.connection = conn;
		selfElement1.children(".name").text((function($this) {
			var $r;
			try {
				$r = self1.options.connection.data.name;
			} catch( __e ) {
				$r = "";
			}
			return $r;
		}(this)));
	}, _updateNotificationCount : function(delta) {
		var self2 = this;
		var count = Std.parseInt(self2._notifications.html()) + delta;
		if(count < 0) count = 0;
		self2._notifications.html(count == null?"null":"" + count);
		var visibility;
		if(count == 0) visibility = "hidden"; else visibility = "visible";
		self2._notifications.css("visibility",visibility);
	}, addNotification : function() {
		var self3 = this;
		self3._updateNotificationCount(1);
	}, deleteNotification : function() {
		var self4 = this;
		self4._updateNotificationCount(-1);
	}, destroy : function() {
		var self5 = this;
		$.Widget.prototype.destroy.call(this);
		if(self5.filteredSetConnection != null) self5.filteredSetConnection.removeListener(self5._onUpdateConnection);
	}};
};
$.widget("ui.connectionComp",defineWidget());
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of ConnectionsList must be a div element");
		selfElement.addClass(m3.widget.Widgets.getWidgetClasses() + " connectionsList");
		var spacer = new $("<div id=\"connectionsList-spacer\" class=\"sideRightSpacer spacer clear\"></div>").appendTo(selfElement);
		var menu = new $("<ul id='label-action-menu'></ul>");
		menu.appendTo(selfElement);
		menu.m3menu({ classes : "container shadow", menuOptions : [{ label : "Revoke Access...", icon : "ui-icon-circle-plus", action : function(evt,m) {
			agentui.widget.DialogManager.revokeAccess(agentui.widget.ConnectionCompHelper.connection(self.selectedConnectionComp));
		}},{ label : "Delete Connection", icon : "ui-icon-circle-minus", action : function(evt1,m1) {
			if(self.selectedConnectionComp != null) m3.util.JqueryUtil.confirm("Delete Connection","Are you sure you want to delete this connection?",function() {
				agentui.model.EM.change(agentui.model.EMEvent.DeleteConnection,agentui.widget.ConnectionCompHelper.connection(self.selectedConnectionComp));
			});
		}}], width : 225}).hide();
		selfElement.bind("contextmenu",function(evt2) {
			menu.show();
			menu.position({ my : "left top", of : evt2});
			var target = new $(evt2.target);
			if(!target.hasClass("connection")) {
				var parents = target.parents(".connection");
				if(parents.length > 0) target = new $(parents[0]); else target = null;
			}
			if(target != null) self.selectedConnectionComp = new $(target); else self.selectedConnectionComp = null;
			evt2.preventDefault();
			evt2.stopPropagation();
			return false;
		});
		self._mapListener = function(conn,connComp,evt3) {
			if(evt3.isAdd()) spacer.before(connComp); else if(evt3.isUpdate()) agentui.widget.ConnectionCompHelper.update(connComp,conn); else if(evt3.isDelete()) connComp.remove();
			agentui.model.EM.change(agentui.model.EMEvent.FitWindow);
		};
		agentui.model.EM.addListener(qoid.QE.onAliasLoaded,function(a) {
			var connections;
			var this1 = qoid.Qoid.groupedConnections.delegate();
			connections = this1.get(a.iid);
			if(connections == null) connections = qoid.Qoid.groupedConnections.addEmptyGroup(a.iid);
			self._setConnections(connections);
		});
	}, _setConnections : function(connections1) {
		var self1 = this;
		var selfElement1 = this.element;
		selfElement1.children(".connection").remove();
		if(self1.connectionsMap != null) self1.connectionsMap.removeListeners(self1._mapListener);
		self1.connectionsMap = new m3.observable.MappedSet(connections1,function(conn1) {
			return new $("<div></div>").connectionComp({ connection : conn1});
		});
		self1.connectionsMap.mapListen(self1._mapListener);
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}, filterConnections : function(term) {
		term = term.toLowerCase();
		var self2 = this;
		var iter = self2.connectionsMap.iterator();
		while(iter.hasNext()) {
			var c = iter.next();
			if(term == "" || agentui.widget.ConnectionCompHelper.connection(c).data.name.toLowerCase().indexOf(term) != -1) c.show(); else c.hide();
		}
	}};
};
$.widget("ui.connectionsList",defineWidget());
var defineWidget = function() {
	return { options : { createFcn : null, modal : false, positionalElement : null}, _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of Popup must be a div element");
		selfElement.addClass("ocontainer shadow popup");
		if(!self.options.modal) new $("body").one("click",function(evt) {
			selfElement.remove();
			self.destroy();
		});
		self.options.createFcn(selfElement);
		selfElement.position({ my : "left", at : "right", of : self.options.positionalElement});
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.popup",defineWidget());
var defineWidget = function() {
	return { _create : function() {
		$.API_KEY = "2e63db21c89b06a54fd2eac5fd96e488";
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of UrlComp must be a div element");
		selfElement.addClass("urlComp container " + m3.widget.Widgets.getWidgetClasses());
		new $("<label class='fleft ui-helper-clearfix' style='margin-left: 5px;'>Enter URL</label>").appendTo(selfElement);
		self.urlInput = new $("<input id='' class='clear textInput boxsizingBorder' style='float: left;margin-top: 5px;'/>").appendTo(selfElement);
	}, _post : function() {
		var self1 = this;
		var selfElement1 = this.element;
		m3.log.Logga.get_DEFAULT().debug("post " + self1.urlInput.val());
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}, valEle : function() {
		var self2 = this;
		return self2.urlInput;
	}};
};
$.widget("ui.urlComp",defineWidget());
var defineWidget = function() {
	return { _getDragStop : function() {
		var self = this;
		return function(dragstopEvt,dragstopUi) {
			if(!self.tags.intersects(dragstopUi.helper)) {
				dragstopUi.helper.remove();
				m3.util.JqueryUtil.deleteEffects(dragstopEvt);
			}
		};
	}, _addToTagsContainer : function(_ui) {
		var self1 = this;
		var selfElement = this.element;
		var clone = (_ui.draggable.data("clone"))(_ui.draggable,false,false,self1._getDragStop());
		clone.addClass("small");
		var cloneOffset = clone.offset();
		self1.tags.append(clone);
		clone.css({ position : "absolute"});
		if(cloneOffset.top != 0) clone.offset(cloneOffset); else clone.position({ my : "left top", at : "left top", of : _ui.helper, collision : "flipfit", within : self1.tags});
	}, _initLabels : function(of) {
		var self2 = this;
		var selfElement1 = this.element;
		var edit_post_comps_tags = new $("#edit_post_comps_tags",selfElement1);
		if((function($this) {
			var $r;
			var this1 = qoid.Qoid.groupedLabeledContent.delegate();
			$r = this1.get(self2.options.content.iid);
			return $r;
		}(this)) == null) qoid.Qoid.groupedLabeledContent.addEmptyGroup(self2.options.content.iid);
		self2.onchangeLabelChildren = function(jq,evt) {
			if(evt.isAdd()) edit_post_comps_tags.append(jq); else if(evt.isUpdate()) throw new m3.exception.Exception("this should never happen"); else if(evt.isDelete()) jq.remove();
		};
		self2.mappedLabels = new m3.observable.MappedSet((function($this) {
			var $r;
			var this2 = qoid.Qoid.groupedLabeledContent.delegate();
			$r = this2.get(self2.options.content.iid);
			return $r;
		}(this)),function(lc) {
			var connection = qoid.Qoid.connectionFromMetaLabel(lc.labelIid);
			if(connection != null) {
				var ca = new $("<div></div>").connectionAvatar({ connectionIid : connection.iid, dndEnabled : true, isDragByHelper : false, containment : false, dragstop : self2._getDragStop()}).appendTo(edit_post_comps_tags).css("position","absolute");
				ca.position({ my : "left", at : "right", of : of, collision : "flipfit", within : self2.tags});
				of = ca;
				return ca;
			} else {
				var lc1 = new $("<div></div>").labelComp({ labelIid : lc.labelIid, dndEnabled : true, isDragByHelper : false, containment : false, dragstop : self2._getDragStop()});
				lc1.css("position","absolute").addClass("small");
				lc1.position({ my : "top", at : "bottom", of : of, collision : "flipfit", within : self2.tags});
				of = lc1;
				return lc1;
			}
		});
		self2.mappedLabels.listen(self2.onchangeLabelChildren);
	}, _createButtonBlock : function(self3,selfElement2) {
		var close = function() {
			selfElement2.remove();
			self3.destroy();
			agentui.model.EM.change(agentui.model.EMEvent.FitWindow);
		};
		var buttonBlock = new $("<div></div>").css("text-align","right").appendTo(selfElement2);
		new $("<button title='Update Post'></button>").appendTo(buttonBlock).button({ text : false, icons : { primary : "ui-icon-disk"}}).css("width","23px").click(function(evt1) {
			var ecd = self3._updateContent();
			agentui.model.EM.change(agentui.model.EMEvent.UpdateContent,ecd);
			close();
		});
		new $("<button title='Close'></button>").appendTo(buttonBlock).button({ text : false, icons : { primary : "ui-icon-closethick"}}).css("width","23px").click(function(evt2) {
			agentui.model.EM.change(agentui.model.EMEvent.EditContentClosed,self3.options.content);
			close();
		});
	}, _updateContent : function() {
		var self4 = this;
		var selfElement3 = this.element;
		var _g = self4.options.content.contentType;
		switch(_g) {
		case "TEXT":
			(js.Boot.__cast(self4.options.content , qoid.model.MessageContent)).props.text = self4.valueElement.val();
			break;
		case "URL":
			(js.Boot.__cast(self4.options.content , qoid.model.UrlContent)).props.url = self4.valueElement.val();
			break;
		case "IMAGE":
			(js.Boot.__cast(self4.options.content , qoid.model.ImageContent)).props.imgSrc = agentui.widget.UploadCompHelper.value(self4.uploadComp);
			break;
		case "AUDIO":
			(js.Boot.__cast(self4.options.content , qoid.model.AudioContent)).props.audioSrc = agentui.widget.UploadCompHelper.value(self4.uploadComp);
			break;
		case "VERIFICATION":
			throw new m3.exception.Exception("VerificationContent should not be displayed");
			break;
		}
		var ecd1 = new qoid.model.EditContentData(self4.options.content);
		self4.tags.children(".label").each(function(i,dom) {
			var labelComp = new $(dom);
			ecd1.labelIids.push(agentui.widget.LabelCompHelper.getLabel(labelComp).iid);
		});
		self4.tags.children(".connectionAvatar").each(function(i1,dom1) {
			var conn = new $(dom1);
			ecd1.labelIids.push(agentui.widget.ConnectionAvatarHelper.getConnection(conn).labelIid);
		});
		return ecd1;
	}, _create : function() {
		var self5 = this;
		var selfElement4 = this.element;
		if(!selfElement4["is"]("div")) throw new m3.exception.Exception("Root of EditPostComp must be a div element");
		selfElement4.addClass("post container shadow " + m3.widget.Widgets.getWidgetClasses());
		self5._createButtonBlock(self5,selfElement4);
		var section = new $("<section id='postSection'></section>").appendTo(selfElement4);
		var tab_class = "";
		if(self5.options.content.contentType == "TEXT") {
			var textInput = new $("<div class='postContainer boxsizingBorder'></div>");
			textInput.appendTo(section);
			self5.valueElement = new $("<textarea class='boxsizingBorder container' style='resize: none;'></textarea>").appendTo(textInput).attr("id","textInput_ta");
			self5.valueElement.val((js.Boot.__cast(self5.options.content , qoid.model.MessageContent)).props.text);
			tab_class = "ui-icon-document";
		} else if(self5.options.content.contentType == "URL") {
			var urlComp = new $("<div class='postContainer boxsizingBorder'></div>").urlComp();
			self5.valueElement = agentui.widget.UrlCompHelper.urlInput(urlComp);
			urlComp.appendTo(section);
			agentui.widget.UrlCompHelper.urlInput(urlComp).val((js.Boot.__cast(self5.options.content , qoid.model.UrlContent)).props.url);
			tab_class = "ui-icon-link";
		} else if(self5.options.content.contentType == "IMAGE") {
			var options = { contentType : "IMAGE"};
			var imageInput = new $("<div class='postContainer boxsizingBorder'></div>").uploadComp(options);
			self5.uploadComp = imageInput;
			imageInput.appendTo(section);
			agentui.widget.UploadCompHelper.setPreviewImage(imageInput,(js.Boot.__cast(self5.options.content , qoid.model.ImageContent)).props.imgSrc);
			tab_class = "ui-icon-image";
		} else if(self5.options.content.contentType == "AUDIO") {
			var options1 = { contentType : "AUDIO"};
			var audioInput = new $("<div class='postContainer boxsizingBorder'></div>").uploadComp(options1);
			self5.uploadComp = audioInput;
			audioInput.appendTo(section);
			agentui.widget.UploadCompHelper.setPreviewImage(audioInput,(js.Boot.__cast(self5.options.content , qoid.model.AudioContent)).props.audioSrc);
			tab_class = "ui-icon-volume-on";
		}
		var tabs = new $("<aside class='tabs'></aside>").appendTo(section);
		var tab = new $("<span class='ui-icon " + tab_class + " ui-icon-document active ui-corner-left active'></span>").appendTo(tabs);
		var isDuplicate = function(selector,ele,container,getUid) {
			var is_duplicate = false;
			if(ele["is"](selector)) {
				var new_uid = getUid(ele);
				container.children(selector).each(function(i2,dom2) {
					var uid = getUid(new $(dom2));
					if(new_uid == uid) is_duplicate = true;
				});
			}
			return is_duplicate;
		};
		var tags = new $("<aside id='edit_post_comps_tags' class='tags container boxsizingBorder'></aside>");
		tags.appendTo(section);
		tags.droppable({ accept : function(d) {
			return d["is"](".filterable") && !d["is"](".aliasAvatar");
		}, activeClass : "ui-state-hover", hoverClass : "ui-state-active", drop : function(event,_ui1) {
			if(isDuplicate(".connectionAvatar",_ui1.draggable,tags,function(ele1) {
				return agentui.widget.ConnectionAvatarHelper.getConnection(new $(ele1)).iid;
			}) || isDuplicate(".labelComp",_ui1.draggable,tags,function(ele2) {
				return agentui.widget.LabelCompHelper.getLabel(new $(ele2)).iid;
			})) {
				if(_ui1.draggable.parent().attr("id") != "edit_post_comps_tags") _ui1.draggable.draggable("option","revert",true);
				return;
			}
			self5._addToTagsContainer(_ui1);
		}});
		self5.tags = tags;
		self5._initLabels(null);
	}, destroy : function() {
		var self6 = this;
		self6.mappedLabels.removeListener(self6.onchangeLabelChildren);
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.editPostComp",defineWidget());
var defineWidget = function() {
	return { _showVerifications : function(ref) {
		var self = this;
		var selfElement = this.element;
		var vdata = new Array();
		var vs = self.options.content.metaData.verifications;
		var _g = 0;
		while(_g < vs.length) {
			var v = vs[_g];
			++_g;
			var p = m3.helper.OSetHelper.getElementComplex(qoid.Qoid.profiles,v.verifierId,"sharedId");
			var msg = m3.helper.OSetHelper.getElement(qoid.Qoid.verificationContent,v.verificationIid);
			var text;
			if(msg == null) text = "Unable to retrieve verification content."; else text = msg.props.text;
			vdata.push({ profile : p, message : text});
		}
		var popup = new $("<div style='position: absolute;width:300px;'></div>");
		popup.appendTo(selfElement);
		popup = popup.popup({ createFcn : function(el) {
			new $("<div class='ccv_header'>This content was verified by:</div>").appendTo(el);
			var container = new $("<div class='icontainer cc_table'></div>").appendTo(el);
			var _g1 = 0;
			while(_g1 < vdata.length) {
				var vd = vdata[_g1];
				++_g1;
				var vcontainer = new $("<div class='cc_row'></div>").appendTo(container);
				var vcell = new $("<div class='cc_cell'></div>").appendTo(vcontainer);
				new $("<div class='cc_cell'></div>").connectionAvatar({ dndEnabled : false, connectionIid : vd.profile.connectionIid}).appendTo(vcell);
				new $("<div>" + vd.profile.name + "</div>").appendTo(vcell);
				new $("<div class='cc_cell'>" + vd.message + "</div>").appendTo(vcontainer);
			}
		}, positionalElement : ref});
	}, _createWidgets : function(selfElement1,self1) {
		selfElement1.empty();
		var content = self1.options.content;
		var postWr = new $("<section class='postWr'></section>");
		selfElement1.append(postWr);
		var postContentWr = new $("<div class='postContentWr'></div>");
		postWr.append(postContentWr);
		var postContent = new $("<div class='postContent'></div>");
		postContentWr.append(postContent);
		var contentInfo = new $("<div class='content-timestamp'></div>");
		postContent.append(contentInfo);
		contentInfo.append(HxOverrides.dateStr(content.created) + "&nbsp;&nbsp;&nbsp;");
		if(content.metaData.verifications.length > 0) {
			var verified = new $("<img class='verified vimage' title='V for Verified' src='media/check.png'/>");
			verified.click(function(evt) {
				self1._showVerifications(verified);
				evt.preventDefault();
				evt.stopPropagation();
				return false;
			});
			contentInfo.append(verified);
		}
		var _g2 = content.contentType;
		switch(_g2) {
		case "AUDIO":
			var audio;
			audio = js.Boot.__cast(content , qoid.model.AudioContent);
			postContent.append(audio.props.title + "<br/>");
			var audioControls = new $("<audio controls></audio>");
			postContent.append(audioControls);
			audioControls.append("<source src='" + audio.props.audioSrc + "' type='" + audio.props.audioType + "'>Your browser does not support the audio element.");
			break;
		case "IMAGE":
			var img;
			img = js.Boot.__cast(content , qoid.model.ImageContent);
			postContent.append("<img alt='" + img.props.caption + "' src='" + img.props.imgSrc + "'/>");
			break;
		case "URL":
			var urlContent;
			urlContent = js.Boot.__cast(content , qoid.model.UrlContent);
			postContent.append("<img src='http://picoshot.com/t.php?picurl=" + urlContent.props.url + "'>");
			break;
		case "TEXT":
			var textContent;
			textContent = js.Boot.__cast(content , qoid.model.MessageContent);
			postContent.append("<div class='content-text'><pre class='text-content'>" + textContent.props.text + "</pre></div>");
			break;
		case "VERIFICATION":
			throw new m3.exception.Exception("VerificationContent should not be displayed");
			break;
		}
		self1.buttonBlock = new $("<div class='button-block' ></div>").css("text-align","left").hide().appendTo(postContent);
		var mb = new $("<button title='Options'></button>").appendTo(self1.buttonBlock).button({ text : false, icons : { primary : "ui-icon-circle-triangle-s"}}).css("width","23px");
		mb.click(function(evt1) {
			var menu = self1._createContentMenu();
			menu.show();
			menu.position({ my : "left top", at : "right-6px center", of : mb});
			evt1.preventDefault();
			evt1.stopPropagation();
			return false;
		});
		var postCreator = new $("<aside class='postCreator'></aside>").appendTo(postWr);
		var aliasIid = null;
		var connectionIid = null;
		if((function($this) {
			var $r;
			var this1 = qoid.Qoid.aliases.delegate();
			$r = this1.get(self1.options.content.aliasIid);
			return $r;
		}(this)) != null) aliasIid = self1.options.content.aliasIid; else if((function($this) {
			var $r;
			var this2 = qoid.Qoid.connections.delegate();
			$r = this2.get(self1.options.content.connectionIid);
			return $r;
		}(this)) != null) connectionIid = self1.options.content.connectionIid;
		new $("<div></div>").connectionAvatar({ dndEnabled : false, aliasIid : aliasIid, connectionIid : connectionIid}).appendTo(postCreator);
		var postLabels = new $("<aside class='postLabels'></div>").appendTo(postWr);
		var postConnections = new $("<aside class='postConnections'></aside>").appendTo(postWr);
		if((function($this) {
			var $r;
			var this3 = qoid.Qoid.groupedLabeledContent.delegate();
			$r = this3.get(self1.options.content.iid);
			return $r;
		}(this)) == null) qoid.Qoid.groupedLabeledContent.addEmptyGroup(self1.options.content.iid);
		self1.onchangeLabelChildren = function(ele,evt2) {
			if(evt2.isAdd()) {
				if(ele["is"](".connectionAvatar")) postConnections.append(ele); else postLabels.append(ele);
			} else if(evt2.isUpdate()) throw new m3.exception.Exception("this should never happen"); else if(evt2.isDelete()) ele.remove();
		};
		self1.mappedLabels = new m3.observable.MappedSet((function($this) {
			var $r;
			var this4 = qoid.Qoid.groupedLabeledContent.delegate();
			$r = this4.get(self1.options.content.iid);
			return $r;
		}(this)),function(lc) {
			var connection = qoid.Qoid.connectionFromMetaLabel(lc.labelIid);
			if(connection != null) return new $("<div></div>").connectionAvatar({ dndEnabled : false, connectionIid : connection.iid}); else return new $("<div class='small'></div>").labelComp({ dndEnabled : false, labelIid : lc.labelIid});
		});
		self1.mappedLabels.listen(self1.onchangeLabelChildren);
	}, _create : function() {
		var self2 = this;
		var selfElement2 = this.element;
		if(!selfElement2["is"]("div")) throw new m3.exception.Exception("Root of ContentComp must be a div element");
		selfElement2.addClass("contentComp post container shadow " + m3.widget.Widgets.getWidgetClasses());
		selfElement2.click(function(evt3) {
			if(!selfElement2.hasClass("postActive")) {
				new $(".postActive .button-block").toggle();
				new $(".postActive").toggleClass("postActive");
			}
			self2.toggleActive();
		});
		self2._createWidgets(selfElement2,self2);
		agentui.model.EM.addListener(agentui.model.EMEvent.EditContentClosed,function(content1) {
			if(content1.iid == self2.options.content.iid) selfElement2.show();
		});
	}, _createContentMenu : function() {
		var self3 = this;
		var selfElement3 = this.element;
		if(self3.menu == null) {
			var menu1 = new $("<ul id='contentCompMenu-" + self3.options.content.iid + "'></ul>");
			menu1.appendTo(selfElement3);
			var menuOptions = [];
			var menuOption;
			menuOption = { label : "Edit...", icon : "ui-icon-pencil", action : function(evt4,m) {
				evt4.stopPropagation();
				var comp = new $("<div id='edit-post-comp'></div>");
				comp.insertBefore(selfElement3);
				comp.width(selfElement3.width());
				comp.height(selfElement3.height());
				selfElement3.hide();
				var editPostComp = new $(comp).editPostComp({ content : self3.options.content});
			}};
			menuOptions.push(menuOption);
			menuOption = { label : "Delete...", icon : "ui-icon-circle-close", action : function(evt5,m1) {
				evt5.stopPropagation();
				m3.util.JqueryUtil.confirm("Delete Post","Are you sure you want to delete this content?",function() {
					var ecd = new qoid.model.EditContentData(self3.options.content);
					agentui.model.EM.change(agentui.model.EMEvent.DeleteContent,ecd);
				});
			}};
			menuOptions.push(menuOption);
			menuOption = { label : "Request Verification...", icon : "ui-icon-circle-triangle-n", action : function(evt6,m2) {
				evt6.preventDefault();
				evt6.stopPropagation();
				self3.menu.hide();
				agentui.widget.DialogManager.requestVerification(self3.options.content);
			}};
			menuOptions.push(menuOption);
			menu1.m3menu({ menuOptions : menuOptions}).hide();
			self3.menu = menu1;
		}
		return self3.menu;
	}, update : function(content2) {
		var self4 = this;
		var selfElement4 = this.element;
		var showButtonBlock = self4.buttonBlock.isVisible();
		self4.options.content = content2;
		self4._createWidgets(selfElement4,self4);
		if(showButtonBlock) self4.buttonBlock.show();
		selfElement4.show();
	}, toggleActive : function() {
		var self5 = this;
		var selfElement5 = this.element;
		selfElement5.toggleClass("postActive");
		self5.buttonBlock.toggle();
	}, destroy : function() {
		var self6 = this;
		self6.mappedLabels.removeListener(self6.onchangeLabelChildren);
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.contentComp",defineWidget());
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of ContentFeed must be a div element");
		selfElement.addClass("container " + m3.widget.Widgets.getWidgetClasses()).css("padding","10px");
		selfElement.append("<div id='middleContainerSpacer' class='spacer'></div>");
		var mapListener = function(content,contentComp,evt) {
			if(evt.isAdd()) {
				var contentComps = new $(".contentComp");
				if(contentComps.length == 0) new $("#postInput").after(contentComp); else {
					var comps = new $(".contentComp");
					var inserted = false;
					comps.each(function(i,dom) {
						var cc = new $(dom);
						var cmp = m3.helper.StringHelper.compare(agentui.widget.ContentCompHelper.content(contentComp).getTimestamp(),agentui.widget.ContentCompHelper.content(cc).getTimestamp());
						if(cmp > 0) {
							cc.before(contentComp);
							inserted = true;
							return false;
						} else return true;
					});
					if(!inserted) comps.last().after(contentComp);
				}
				agentui.model.EM.change(agentui.model.EMEvent.FitWindow);
			} else if(evt.isUpdate()) agentui.widget.ContentCompHelper.update(contentComp,content); else if(evt.isDelete()) contentComp.remove();
		};
		var beforeSetContent = function() {
			selfElement.find(".contentComp").remove();
		};
		var widgetCreator = function(content1) {
			return new $("<div></div>").contentComp({ content : content1});
		};
		agentui.model.ContentSource.addListener(mapListener,beforeSetContent,widgetCreator);
	}, destroy : function() {
		var self1 = this;
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.contentFeed",defineWidget());
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
		var newUser = new qoid.model.NewUser();
		newUser.name = self1.input_n.val();
		newUser.pwd = self1.input_pw.val();
		if(m3.helper.StringHelper.isBlank(newUser.name)) {
			self1.placeholder_n.addClass("ui-state-error");
			return;
		}
		if(m3.helper.StringHelper.isBlank(newUser.pwd)) {
			self1.placeholder_pw.addClass("ui-state-error");
			return;
		}
		selfElement1.find(".ui-state-error").removeClass("ui-state-error");
		agentui.model.EM.change(agentui.model.EMEvent.CreateAgent,newUser);
		agentui.model.EM.listenOnce(qoid.QE.onAgentCreated,function(n) {
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
			agentui.widget.DialogManager.showLogin();
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
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of LiveBuildToggle must be a div element");
		selfElement.addClass("liveBuildToggle");
		var build = new $("<div class='ui-widget-content ui-state-active ui-corner-left build'>Build</div>");
		var live = new $("<div class='ui-widget-content ui-corner-right live'>Live</div>");
		selfElement.append(build).append(live);
		var children = selfElement.children();
		children.hover(function(evt) {
			$(this).addClass("ui-state-hover");
		},function(evt1) {
			$(this).removeClass("ui-state-hover");
		}).click(function(evt2) {
			children.toggleClass("ui-state-active");
			self._fireFilter();
		});
	}, isLive : function() {
		var selfElement1 = this.element;
		return selfElement1.children(".live").hasClass("ui-state-active");
	}, _fireFilter : function() {
		var selfElement2 = this.element;
		var filter;
		filter = js.Boot.__cast(selfElement2.closest("#filter") , $);
		agentui.widget.FilterCompHelper.fireFilter(filter);
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.liveBuildToggle",defineWidget());
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of FilterComp must be a div element");
		selfElement.addClass("connectionDT labelDT dropCombiner " + m3.widget.Widgets.getWidgetClasses());
		var toggle = new $("<div class='rootToggle andOrToggle'></div>").andOrToggle();
		selfElement.append(toggle);
		var liveToggle = new $("<div class='liveBuildToggle'></div>").liveBuildToggle();
		selfElement.append(liveToggle);
		(js.Boot.__cast(selfElement , $)).droppable({ accept : function(d) {
			return d["is"](".filterable");
		}, activeClass : "ui-state-hover", hoverClass : "ui-state-active", drop : function(event,_ui) {
			var dragstop = function(dragstopEvt,dragstopUi) {
				if(!selfElement.intersects(dragstopUi.helper)) {
					dragstopUi.helper.remove();
					m3.util.JqueryUtil.deleteEffects(dragstopEvt);
					self.fireFilter();
				}
			};
			var clone = (_ui.draggable.data("clone"))(_ui.draggable,false,false,dragstop);
			clone.addClass("filterTrashable " + Std.string(_ui.draggable.data("dropTargetClass")));
			var cloneOffset = clone.offset();
			$(this).append(clone);
			clone.css({ position : "absolute"});
			if(cloneOffset.top != 0) clone.offset(cloneOffset); else clone.position({ my : "left top", at : "left top", of : _ui.helper, collision : "flipfit", within : "#filter"});
			self.fireFilter();
		}});
		agentui.model.EM.addListener(qoid.QE.onAliasLoaded,function(alias) {
			self.clearFilter();
		},"FilterComp-AliasLoaded");
	}, clearFilter : function() {
		var selfElement1 = this.element;
		var filterables = selfElement1.children(".filterable");
		filterables.each(function(idx,ele) {
			var jq = new $(ele);
			jq.remove();
		});
	}, fireFilter : function() {
		var self1 = this;
		var selfElement2 = this.element;
		var liveToggle1;
		liveToggle1 = js.Boot.__cast(selfElement2.children(".liveBuildToggle") , $);
		var root = (selfElement2.children(".rootToggle").data("getNode"))();
		root.type = "ROOT";
		var filterables1 = selfElement2.children(".filterable");
		if(filterables1.length == 0) agentui.model.EM.change(qoid.QE.onAliasLoaded,qoid.Qoid.get_currentAlias()); else {
			filterables1.each(function(idx1,el) {
				var jqEle = new $(el);
				if(!jqEle["is"](".connectionAvatar")) {
					var filterable = new $(el);
					var node = (filterable.data("getNode"))();
					root.addNode(node);
				}
			});
			var connectionIids = new Array();
			var aliasIid = null;
			var connComps = selfElement2.children(".connectionAvatar");
			connComps.each(function(idx2,el1) {
				var avatar = new $(el1);
				var conn = agentui.widget.ConnectionAvatarHelper.getConnection(avatar);
				if(conn != null) connectionIids.push(conn.iid); else {
					var alias1 = agentui.widget.ConnectionAvatarHelper.getAlias(avatar);
					aliasIid = alias1.iid;
				}
			});
			var filterData = new agentui.model.FilterData("content");
			filterData.filter = new agentui.model.Filter(root);
			filterData.connectionIids = connectionIids;
			filterData.aliasIid = aliasIid;
			if(!agentui.widget.LiveBuildToggleHelper.isLive(liveToggle1)) agentui.model.EM.change(agentui.model.EMEvent.FILTER_CHANGE,filterData); else agentui.model.EM.change(agentui.model.EMEvent.FILTER_RUN,filterData);
		}
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.filterComp",defineWidget());
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of IntroductionNotificationComp must be a div element");
		selfElement.addClass("introductionNotificationComp notification-ui container boxsizingBorder");
		var conn = m3.helper.OSetHelper.getElement(qoid.Qoid.connections,self.options.notification.createdByConnectionIid);
		var intro_table = new $("<table id='intro-table'><tr><td></td><td></td><td></td></tr></table>").appendTo(selfElement);
		var avatar = new $("<div class='avatar introduction-avatar'></div>").connectionAvatar({ connectionIid : conn.iid, dndEnabled : false, isDragByHelper : true, containment : false}).appendTo(intro_table.find("td:nth-child(1)"));
		var invitationText = new $("<div class='invitationText'></div>").appendTo(intro_table.find("td:nth-child(2)"));
		var title = new $("<div class='intro-title'>Introduction Request</div>").appendTo(invitationText);
		var from = new $("<div><b>From:</b> " + conn.data.name + "</div>").appendTo(invitationText);
		var date = new $("<div><b>Date:</b> " + Std.string(new Date()) + "</div>").appendTo(invitationText);
		var message = new $("<div class='invitation-message'>" + self.options.notification.props.message + "</div>").appendTo(invitationText);
		intro_table.find("td:nth-child(3)").append("<div>" + self.options.notification.props.profile.name + "</div><div><img class='intro-profile-img container' src='" + self.options.notification.props.profile.imgSrc + "'/></div>");
	}, initialized : false, _respondToIntroduction : function(accepted) {
		var self1 = this;
		var selfElement1 = this.element;
		agentui.model.EM.listenOnce(agentui.model.EMEvent.RespondToIntroduction_RESPONSE,function(e) {
			self1.destroy();
			selfElement1.remove();
		});
		var confirmation = new agentui.api.IntroResponseMessage(self1.options.notification.iid,accepted);
		agentui.model.EM.change(agentui.model.EMEvent.RespondToIntroduction,confirmation);
	}, _buildDialog : function() {
		var self2 = this;
		var selfElement2 = this.element;
		self2.initialized = true;
		var dlgOptions = { autoOpen : false, title : "Respond To Introduction", height : 400, width : 600, modal : true, buttons : { Accept : function() {
			self2._respondToIntroduction(true);
		}, Reject : function() {
			self2._respondToIntroduction(false);
		}}, close : function(evt,ui) {
			selfElement2.find(".placeholder").removeClass("ui-state-error");
		}};
		selfElement2.dialog(dlgOptions);
	}, open : function() {
		var self3 = this;
		var selfElement3 = this.element;
		if(!self3.initialized) self3._buildDialog();
		selfElement3.dialog("open");
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.introductionNotificationDialog",defineWidget());
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of InviteComp must be a div element");
		selfElement.addClass("inviteComp ui-helper-clearfix " + m3.widget.Widgets.getWidgetClasses());
		var input = new $("<input id=\"sideRightInviteInput\" style=\"display: none;\" class=\"ui-widget-content boxsizingBorder textInput\"/>");
		var input_placeHolder = new $("<input id=\"sideRightInviteInput_PH\" class=\"placeholder ui-widget-content boxsizingBorder textInput\" value=\"Enter Email Address\"/>");
		var btn = new $("<button class='fright'>Invite</button>").button();
		selfElement.append(input).append(input_placeHolder).append(btn);
		input_placeHolder.focus(function(evt) {
			input_placeHolder.hide();
			input.show().focus();
		});
		input.blur(function(evt1) {
			if(m3.helper.StringHelper.isBlank(input.val())) {
				input_placeHolder.show();
				input.hide();
			}
		});
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.inviteComp",defineWidget());
var defineWidget = function() {
	return { getSelected : function() {
		var self = this;
		return self.selectedLabelComp;
	}, _showNewLabelPopup : function(reference,isUpdate) {
		var self1 = this;
		var selfElement = this.element;
		var popup = new $("<div style='position: absolute;width:300px;'></div>");
		popup.appendTo(selfElement);
		popup = popup.popup({ createFcn : function(el) {
			var createLabel = null;
			var updateLabel = null;
			var stopFcn = function(evt) {
				evt.stopPropagation();
			};
			var enterFcn = function(evt1) {
				if(evt1.keyCode == 13) {
					if(isUpdate) updateLabel(); else createLabel();
				}
			};
			var container = new $("<div class='icontainer'></div>").appendTo(el);
			container.click(stopFcn).keypress(enterFcn);
			var parent = null;
			if(!isUpdate) {
				container.append("<label for='labelParent'>Parent: </label> ");
				parent = new $("<select id='labelParent' class='ui-corner-left ui-widget-content' style='width: 191px;'><option value='" + qoid.Qoid.get_currentAlias().labelIid + "'>No Parent</option></select>").appendTo(container);
				parent.click(stopFcn);
				var aliasLabels = qoid.Qoid.getLabelDescendents(qoid.Qoid.get_currentAlias().labelIid);
				var iter = aliasLabels.iterator();
				while(iter.hasNext()) {
					var label = iter.next();
					if(label.iid != qoid.Qoid.get_currentAlias().labelIid) {
						var option = "<option value='" + label.iid + "'";
						if(self1.selectedLabelComp != null && agentui.widget.LabelCompHelper.getLabel(self1.selectedLabelComp).iid == label.iid) option += " SELECTED";
						option += ">" + label.name + "</option>";
						parent.append(option);
					}
				}
			}
			container.append("<br/><label for='labelName'>Name: </label> ");
			var input = new $("<input id='labelName' class='ui-corner-all ui-widget-content' value='New Label'/>").appendTo(container);
			input.keypress(enterFcn).click(function(evt2) {
				evt2.stopPropagation();
				if($(this).val() == "New Label") $(this).val("");
			}).focus();
			var buttonText = "Add Label";
			if(isUpdate) {
				buttonText = "Update Label";
				input.val(agentui.widget.LabelCompHelper.getLabel(self1.selectedLabelComp).name);
			}
			container.append("<br/>");
			new $("<button class='fright ui-helper-clearfix' style='font-size: .8em;'>" + buttonText + "</button>").button().appendTo(container).click(function(evt3) {
				if(isUpdate) updateLabel(); else createLabel();
			});
			createLabel = function() {
				if(input.val().length == 0) return;
				m3.log.Logga.get_DEFAULT().info("Create new label | " + input.val());
				var label1 = new qoid.model.Label();
				label1.name = input.val();
				var eventData = new qoid.model.EditLabelData(label1,parent.val());
				agentui.model.EM.change(agentui.model.EMEvent.CreateLabel,eventData);
				new $("body").click();
			};
			updateLabel = function() {
				if(input.val().length == 0) return;
				var label2 = agentui.widget.LabelCompHelper.getLabel(self1.selectedLabelComp);
				m3.log.Logga.get_DEFAULT().info("Update label | " + label2.iid);
				label2.name = input.val();
				var eventData1 = new qoid.model.EditLabelData(label2);
				agentui.model.EM.change(agentui.model.EMEvent.UpdateLabel,eventData1);
				new $("body").click();
			};
		}, positionalElement : reference});
	}, _create : function() {
		var self2 = this;
		var selfElement1 = this.element;
		if(!selfElement1["is"]("div")) throw new m3.exception.Exception("Root of LabelsList must be a div element");
		selfElement1.addClass("icontainer labelsList " + m3.widget.Widgets.getWidgetClasses());
		self2.selectedLabelComp = null;
		agentui.model.EM.addListener(qoid.QE.onAliasLoaded,function(alias) {
			self2.selectedLabelComp = null;
			selfElement1.children(".labelTree").remove();
			var labelTree = new $("<div id='labels' class='labelDT'></div>").labelTree({ parentIid : alias.labelIid, labelPath : [alias.labelIid]});
			selfElement1.prepend(labelTree);
		},"LabelsList-Alias");
		var newLabelButton = new $("<button class='newLabelButton'>New Label</button>");
		selfElement1.append(newLabelButton).append("<div class='clear'></div>");
		newLabelButton.button().click(function(evt4) {
			evt4.stopPropagation();
			self2.selectedLabelComp = null;
			self2._showNewLabelPopup(newLabelButton,false);
		});
		var menu = new $("<ul id='label-action-menu'></ul>");
		menu.appendTo(selfElement1);
		menu.m3menu({ classes : "container shadow", menuOptions : [{ label : "New Child Label", icon : "ui-icon-circle-plus", action : function(evt5,m) {
			evt5.stopPropagation();
			var reference1 = self2.selectedLabelComp;
			if(reference1 == null) reference1 = new $(evt5.target);
			self2._showNewLabelPopup(reference1,false);
			menu.hide();
			return false;
		}},{ label : "Edit Label", icon : "ui-icon-pencil", action : function(evt6,m1) {
			evt6.stopPropagation();
			var reference2 = self2.selectedLabelComp;
			if(reference2 == null) reference2 = new $(evt6.target);
			self2._showNewLabelPopup(reference2,true);
			menu.hide();
			return false;
		}},{ label : "Delete Label", icon : "ui-icon-circle-minus", action : function(evt7,m2) {
			if(self2.selectedLabelComp != null) m3.util.JqueryUtil.confirm("Delete Label","Are you sure you want to delete this label?",function() {
				agentui.model.EM.change(agentui.model.EMEvent.DeleteLabel,new qoid.model.EditLabelData(agentui.widget.LabelCompHelper.getLabel(self2.selectedLabelComp),agentui.widget.LabelCompHelper.parentIid(self2.selectedLabelComp)));
			});
		}}], width : 225}).hide();
		selfElement1.bind("contextmenu",function(evt8) {
			menu.show();
			menu.position({ my : "left top", of : evt8});
			var target = new $(evt8.target);
			if(!target.hasClass("labelComp")) {
				var parents = target.parents(".labelComp");
				if(parents.length > 0) target = new $(parents[0]); else target = null;
			}
			if(target != null) self2.selectedLabelComp = new $(target); else self2.selectedLabelComp = null;
			evt8.preventDefault();
			evt8.stopPropagation();
			return false;
		});
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.labelsList",defineWidget());
var defineWidget = function() {
	return { options : { parentIid : null, labelIid : null, labelPath : []}, _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of LabelTreeBranch must be a div element");
		selfElement.addClass("labelTreeBranch ");
		var expander = new $("<div class='labelTreeExpander' style='visibility:hidden;'><b>+</b></div>");
		selfElement.append(expander);
		var label = new $("<div></div>").labelComp({ parentIid : self.options.parentIid, labelIid : self.options.labelIid, labelPath : self.options.labelPath, isDragByHelper : true, containment : false, dragstop : null});
		selfElement.append(label);
		selfElement.hover(function() {
			if(m3.helper.OSetHelper.hasValues(self.children)) expander.css("visibility","visible");
		},function() {
			expander.css("visibility","hidden");
		});
		if((function($this) {
			var $r;
			var this1 = qoid.Qoid.groupedLabelChildren.delegate();
			$r = this1.get(self.options.labelIid);
			return $r;
		}(this)) == null) qoid.Qoid.groupedLabelChildren.addEmptyGroup(self.options.labelIid);
		var this2 = qoid.Qoid.groupedLabelChildren.delegate();
		self.children = this2.get(self.options.labelIid);
		var labelChildren = new $("<div class='labelChildren' style='display: none;'></div>");
		labelChildren.labelTree({ parentIid : self.options.labelIid, labelPath : self.options.labelPath});
		self.children.listen(function(lc,evt) {
			if(evt.isAdd()) {
				var ll = new $("#labelsList");
				var sel = ll.labelsList("getSelected");
				if(sel != null && sel.labelComp("getLabel").iid == lc.parentIid) {
					if(m3.helper.OSetHelper.hasValues(self.children)) {
						labelChildren.show();
						labelChildren.addClass("labelTreeFullWidth");
					}
				}
			}
		});
		selfElement.append(labelChildren);
		label.add(expander).click(function(evt1) {
			if(m3.helper.OSetHelper.hasValues(self.children)) {
				labelChildren.toggle();
				labelChildren.toggleClass("labelTreeFullWidth");
			} else labelChildren.hide();
			if(labelChildren.css("display") == "none") expander.html("<b>+</b>"); else expander.html("<b>-</b>");
			agentui.model.EM.change(agentui.model.EMEvent.FitWindow);
		});
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.labelTreeBranch",defineWidget());
var defineWidget = function() {
	return { options : { parentIid : null, itemsClass : null, labelPath : []}, _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of LabelTree must be a div element");
		selfElement.addClass("labelTree boxsizingBorder " + m3.widget.Widgets.getWidgetClasses());
		if((function($this) {
			var $r;
			var this1 = qoid.Qoid.groupedLabelChildren.delegate();
			$r = this1.get(self.options.parentIid);
			return $r;
		}(this)) == null) qoid.Qoid.groupedLabelChildren.addEmptyGroup(self.options.parentIid);
		self.onchangeLabelChildren = function(labelTreeBranch,evt) {
			if(evt.isAdd()) selfElement.append(labelTreeBranch); else if(evt.isUpdate()) throw new m3.exception.Exception("this should never happen"); else if(evt.isDelete()) labelTreeBranch.remove();
		};
		self.mappedLabels = new m3.observable.MappedSet((function($this) {
			var $r;
			var this2 = qoid.Qoid.groupedLabelChildren.delegate();
			$r = this2.get(self.options.parentIid);
			return $r;
		}(this)),function(labelChild) {
			var labelPath = self.options.labelPath.slice();
			labelPath.push(labelChild.childIid);
			return new $("<div></div>").labelTreeBranch({ parentIid : self.options.parentIid, labelIid : labelChild.childIid, labelPath : labelPath});
		});
		self.mappedLabels.visualId = self.options.parentIid + "_map";
		self.mappedLabels.listen(self.onchangeLabelChildren);
	}, destroy : function() {
		var self1 = this;
		self1.mappedLabels.removeListener(self1.onchangeLabelChildren);
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.labelTree",defineWidget());
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
		self.input_un.val("");
		self.input_pw.val("ohyea");
		inputs.children("input").keypress(function(evt) {
			if(evt.keyCode == 13) self._login();
		});
		m3.jq.PlaceHolderUtil.setFocusBehavior(self.input_un,self.placeholder_un);
		m3.jq.PlaceHolderUtil.setFocusBehavior(self.input_pw,self.placeholder_pw);
		agentui.model.EM.addListener(qoid.QE.onInitialDataload,function(n) {
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
		qoid.QoidAPI.login(login.agentId,login.password);
	}, _buildDialog : function() {
		var self2 = this;
		var selfElement2 = this.element;
		self2.initialized = true;
		var dlgOptions = { autoOpen : false, title : "Login", height : 280, width : 400, modal : true, buttons : { Login : function() {
			self2._login();
		}, 'I\'m New...' : function() {
			agentui.widget.DialogManager.showCreateAgent();
		}}, beforeClose : function(evt1,ui) {
			if(qoid.Qoid.get_currentAlias() == null) {
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
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of MessagingComp must be a div element");
		var tabs = selfElement.tabs({ activate : function(evt,ui) {
			ui.newPanel.find(".chatMsgs").each(function() {
				$(this).scrollTop($(this).height());
			});
		}}).find(".ui-tabs-nav");
		(js.Boot.__cast(tabs , $)).sortable({ axis : "x", stop : function(evt1,ui1) {
			selfElement.tabs("refresh");
		}});
		selfElement.addClass("messagingComp icontainer " + m3.widget.Widgets.getWidgetClasses());
		var ul = new $("<ul></ul>").appendTo(selfElement);
		(js.Boot.__cast(selfElement , $)).droppable({ accept : function(d) {
			return d["is"](".connectionAvatar");
		}, activeClass : "ui-state-hover", hoverClass : "ui-state-active", greedy : true, drop : function(event,_ui) {
			var connection = (js.Boot.__cast(_ui.draggable , $)).connectionAvatar("option","connection");
			var id = "chat-" + connection.iid;
			var li = new $("<li><a href='#" + id + "'><img src='" + (function($this) {
				var $r;
				try {
					$r = connection.data.imgSrc;
				} catch( __e ) {
					$r = "";
				}
				return $r;
			}(this)) + "'></a></li>").appendTo(ul);
			var chatComp = new $("<div id='" + id + "'></div>").chatComp({ connection : connection, messages : new m3.observable.ObservableSet(qoid.model.ModelObjWithIid.identifier)});
			chatComp.appendTo(selfElement);
			selfElement.tabs("refresh");
		}, tolerance : "pointer"});
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.messagingComp",defineWidget());
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of PostComp must be a div element");
		selfElement.addClass("postComp container shadow " + m3.widget.Widgets.getWidgetClasses());
		var section = new $("<section id='postSection'></section>").appendTo(selfElement);
		var addConnectionsAndLabels = null;
		var doTextPost = function(evt,contentType,value) {
			m3.log.Logga.get_DEFAULT().debug("Post new text content");
			evt.preventDefault();
			var ccd = new qoid.model.EditContentData(qoid.model.ContentFactory.create(contentType,value));
			addConnectionsAndLabels(ccd);
			agentui.model.EM.change(agentui.model.EMEvent.CreateContent,ccd);
		};
		var doTextPostForElement = function(evt1,contentType1,ele) {
			doTextPost(evt1,contentType1,ele.val());
			ele.val("");
		};
		var textInput = new $("<div class='postContainer'></div>").appendTo(section);
		var ta = new $("<textarea class='boxsizingBorder container' style='resize: none;'></textarea>").appendTo(textInput).attr("id","textInput_ta").keypress(function(evt2) {
			if(!(evt2.altKey || evt2.shiftKey || evt2.ctrlKey) && evt2.charCode == 13) doTextPostForElement(evt2,"TEXT",new $(evt2.target));
		});
		var urlComp = new $("<div class='postContainer boxsizingBorder'></div>").urlComp();
		urlComp.appendTo(section).keypress(function(evt3) {
			if(!(evt3.altKey || evt3.shiftKey || evt3.ctrlKey) && evt3.charCode == 13) doTextPostForElement(evt3,"URL",new $(evt3.target));
		});
		var options = { contentType : "IMAGE"};
		var imageInput = new $("<div class='postContainer boxsizingBorder'></div>").uploadComp(options);
		imageInput.appendTo(section);
		options.contentType = "AUDIO";
		var audioInput = new $("<div class='postContainer boxsizingBorder'></div>").uploadComp(options);
		audioInput.appendTo(section);
		var tabs = new $("<aside class='tabs'></aside>").appendTo(section);
		var textTab = new $("<span class='ui-icon ui-icon-document active ui-corner-left'></span>").appendTo(tabs).click(function(evt4) {
			tabs.children(".active").removeClass("active");
			$(this).addClass("active");
			textInput.show();
			urlComp.hide();
			imageInput.hide();
			audioInput.hide();
		});
		var urlTab = new $("<span class='ui-icon ui-icon-link ui-corner-left'></span>").appendTo(tabs).click(function(evt5) {
			tabs.children(".active").removeClass("active");
			$(this).addClass("active");
			textInput.hide();
			urlComp.show();
			imageInput.hide();
			audioInput.hide();
		});
		var imgTab = new $("<span class='ui-icon ui-icon-image ui-corner-left'></span>").appendTo(tabs).click(function(evt6) {
			tabs.children(".active").removeClass("active");
			$(this).addClass("active");
			textInput.hide();
			urlComp.hide();
			imageInput.show();
			audioInput.hide();
		});
		var audioTab = new $("<span class='ui-icon ui-icon-volume-on ui-corner-left'></span>").appendTo(tabs).click(function(evt7) {
			tabs.children(".active").removeClass("active");
			$(this).addClass("active");
			textInput.hide();
			urlComp.hide();
			imageInput.hide();
			audioInput.show();
		});
		urlComp.hide();
		imageInput.hide();
		audioInput.hide();
		var isDuplicate = function(selector,ele1,container,getUid) {
			var is_duplicate = false;
			if(ele1["is"](selector)) {
				var new_uid = getUid(ele1);
				container.children(selector).each(function(i,dom) {
					var uid = getUid(new $(dom));
					if(new_uid == uid) is_duplicate = true;
				});
			}
			return is_duplicate;
		};
		var tags = new $("<aside id='post_comps_tags' class='tags container boxsizingBorder'></aside>");
		tags.appendTo(section);
		tags.droppable({ accept : function(d) {
			return d["is"](".filterable") && !d["is"](".aliasAvatar");
		}, activeClass : "ui-state-hover", hoverClass : "ui-state-active", drop : function(event,_ui) {
			if(isDuplicate(".connectionAvatar",_ui.draggable,tags,function(ele2) {
				return agentui.widget.ConnectionAvatarHelper.getConnection(new $(ele2)).iid;
			}) || isDuplicate(".labelComp",_ui.draggable,tags,function(ele3) {
				return agentui.widget.LabelCompHelper.getLabel(new $(ele3)).iid;
			})) {
				if(_ui.draggable.parent().attr("id") != "post_comps_tags") _ui.draggable.draggable("option","revert",true);
				return;
			}
			var dragstop = function(dragstopEvt,dragstopUi) {
				if(!tags.intersects(dragstopUi.helper)) {
					dragstopUi.helper.remove();
					m3.util.JqueryUtil.deleteEffects(dragstopEvt);
				}
			};
			var clone = (_ui.draggable.data("clone"))(_ui.draggable,false,false,dragstop);
			clone.addClass("small");
			var cloneOffset = clone.offset();
			$(this).append(clone);
			clone.css({ position : "absolute"});
			if(cloneOffset.top != 0) clone.offset(cloneOffset); else clone.position({ my : "left top", at : "left top", of : _ui.helper, collision : "flipfit", within : ".tags"});
		}});
		addConnectionsAndLabels = function(ccd1) {
			tags.children(".label").each(function(i1,dom1) {
				var labelComp = new $(dom1);
				ccd1.labelIids.push(agentui.widget.LabelCompHelper.getLabel(labelComp).iid);
			});
			tags.children(".connectionAvatar").each(function(i2,dom2) {
				var avatar = new $(dom2);
				var connection = agentui.widget.ConnectionAvatarHelper.getConnection(avatar);
				ccd1.labelIids.push(connection.labelIid);
			});
		};
		var postButton = new $("<button>Post</button>").appendTo(selfElement).button().click(function(evt8) {
			if(tags.children(".label").length == 0) {
				m3.util.JqueryUtil.alert("Labels are required.  Please add at least one label to this content.");
				return;
			}
			if(textInput.isVisible()) {
				var ta1 = new $("#textInput_ta");
				doTextPostForElement(evt8,"TEXT",ta1);
			} else if(urlComp.isVisible()) doTextPostForElement(evt8,"URL",agentui.widget.UrlCompHelper.urlInput(urlComp)); else {
				doTextPost(evt8,"IMAGE",agentui.widget.UploadCompHelper.value(imageInput));
				agentui.widget.UploadCompHelper.clear(imageInput);
			}
			tags.children(".label").remove();
			tags.children(".connectionAvatar").remove();
		});
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.postComp",defineWidget());
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of RequestIntroductionDialog must be a div element");
		selfElement.addClass("requestIntroductionDialog").hide();
		var connections = new $("<div></div>").appendTo(selfElement);
		connections.append("<div class='labelDiv' style='display:inline'>Introduce&nbsp;&nbsp;</div>");
		self._appendConnectionAvatar(self.options.to,connections);
		connections.append("<div class='labelDiv' style='display:inline'>&nbsp;to&nbsp;</div>");
		self._appendConnectionAvatar(self.options.from,connections);
		connections.append("<div class='labelDiv'>&nbsp;</div>");
		var toName = self.options.to.data.name;
		var fromName = self.options.from.data.name;
		var ridTitle = new $("<div class='rid_row'></div>").appendTo(selfElement);
		var introDiv = new $("<div class='rid_cell' style='text-align:left;'>Introduction Message for " + toName + "</div>").appendTo(ridTitle);
		var sameDiv = new $("<div class='rid_cell' id='same_messsage_div' style='text-align:right;'>Same Message for " + fromName + "</div>").appendTo(ridTitle);
		var cb = new $("<input type='checkbox' id='same_messsage' checked='checked'>").prependTo(sameDiv).change(function(evt) {
			var tgt = new $(evt.target);
			var from_text = new $("#from_text");
			var to_text = new $("#to_text");
			to_text.prop("readonly",tgt.prop("checked"));
			if(tgt.prop("checked")) to_text.val(from_text.val());
		});
		cb.prop("checked",true);
		var ridTa = new $("<div class='rid_row'></div>").appendTo(selfElement);
		var from_text_changed = function(evt1) {
			var same_messsage = new $("#same_messsage");
			if(same_messsage.prop("checked")) {
				var from_text1 = new $("#from_text");
				var to_text1 = new $("#to_text");
				to_text1.val(from_text1.val());
			}
		};
		var divTa1 = new $("<div class='rid_cell' style='height:140px;'></div>").appendTo(ridTa);
		var from_text2 = new $("<textarea class='boxsizingBorder container rid_ta'></textarea>").appendTo(divTa1).attr("id","from_text").keyup(from_text_changed).val("Hi " + toName + " & " + fromName + ",\nHere's an introduction for the two of you to connect.\nwith love,\n" + qoid.Qoid.get_currentAlias().profile.name);
		var divTa2 = new $("<div class='rid_cell' style='height:140px;text-align:right;padding-left: 7px;'></div>").appendTo(ridTa);
		var to_text2 = new $("<textarea class='boxsizingBorder container rid_ta' readonly='readonly'></textarea>").appendTo(divTa2).attr("id","to_text").val(from_text2.val());
	}, _appendConnectionAvatar : function(connection,parent) {
		var avatar = new $("<div class='avatar'></div>").connectionAvatar({ connectionIid : connection.iid, dndEnabled : false, isDragByHelper : true, containment : false}).appendTo(parent).css("display","inline");
		parent.append("<div class='labelDiv' style='display:inline'>" + connection.data.name + "</div>");
	}, initialized : false, _sendRequest : function() {
		var self1 = this;
		var selfElement1 = this.element;
		var alias = qoid.Qoid.get_currentAlias().profile.name;
		var intro = new qoid.model.IntroductionRequest();
		intro.aConnectionIid = self1.options.to.iid;
		intro.bConnectionIid = self1.options.from.iid;
		intro.aMessage = new $("#to_text").val();
		intro.bMessage = new $("#from_text").val();
		agentui.model.EM.addListener(agentui.model.EMEvent.INTRODUCTION_RESPONSE,function(n) {
			selfElement1.dialog("close");
		},"RequestIntroductionDialog-Introduction-Response");
		agentui.model.EM.change(agentui.model.EMEvent.INTRODUCTION_REQUEST,intro);
	}, _buildDialog : function() {
		var self2 = this;
		var selfElement2 = this.element;
		if(self2.initialized) return;
		self2.initialized = true;
		var dlgOptions = { autoOpen : false, title : "Introduction Request", height : 400, width : 600, buttons : { Send : function() {
			self2._sendRequest();
		}, Cancel : function() {
			$(this).dialog("close");
		}}, close : function(evt2,ui) {
			selfElement2.find(".placeholder").removeClass("ui-state-error");
		}};
		selfElement2.dialog(dlgOptions);
	}, open : function() {
		var self3 = this;
		var selfElement3 = this.element;
		if(selfElement3.exists()) {
			selfElement3.empty();
			self3._create();
		}
		self3._buildDialog();
		selfElement3.dialog("open");
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.requestIntroductionDialog",defineWidget());
var defineWidget = function() {
	return { initialized : false, _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of RespondToVerificationRequestDialog must be a div element");
		selfElement.addClass("respondToVerificationRequestDialog notification-ui container boxsizingBorder");
		var conn = m3.helper.OSetHelper.getElement(qoid.Qoid.connections,self.options.notification.createdByConnectionIid);
		var intro_table = new $("<table id='intro-table'><tr><td></td><td></td><td></td></tr></table>").appendTo(selfElement);
		var avatar = new $("<div class='avatar introduction-avatar'></div>").connectionAvatar({ connectionIid : conn.iid, dndEnabled : false, isDragByHelper : true, containment : false}).appendTo(intro_table.find("td:nth-child(1)"));
		var invitationText = new $("<div class='invitationText'></div>").appendTo(intro_table.find("td:nth-child(2)"));
		var title = new $("<div class='intro-title'>Verification Request</div>").appendTo(invitationText);
		var from = new $("<div class='notification-line'><b>From:</b> " + conn.data.name + "</div>").appendTo(invitationText);
		var date = new $("<div class='notification-line'><b>Date:</b> " + Std.string(new Date()) + "</div>").appendTo(invitationText);
		var message = new $("<div class='notification-line'><b>Message:</b> " + self.options.notification.props.message + "</div>").appendTo(invitationText);
		new $("<div class='notification-line' style='margin-top:7px;'><b>Content:</b></div>").appendTo(invitationText);
		var content = self.options.notification.props.getContent();
		var contentDiv = new $("<div class='container content-div'></div>").appendTo(invitationText);
		var _g = content.contentType;
		switch(_g) {
		case "AUDIO":
			var audio;
			audio = js.Boot.__cast(content , qoid.model.AudioContent);
			contentDiv.append(audio.props.title + "<br/>");
			var audioControls = new $("<audio controls></audio>");
			contentDiv.append(audioControls);
			audioControls.append("<source src='" + audio.props.audioSrc + "' type='" + audio.props.audioType + "'>Your browser does not support the audio element.");
			break;
		case "IMAGE":
			var img;
			img = js.Boot.__cast(content , qoid.model.ImageContent);
			contentDiv.append("<img alt='" + img.props.caption + "' src='" + img.props.imgSrc + "'/>");
			break;
		case "URL":
			var urlContent;
			urlContent = js.Boot.__cast(content , qoid.model.UrlContent);
			contentDiv.append("<img src='http://picoshot.com/t.php?picurl=" + urlContent.props.url + "'>");
			break;
		case "TEXT":
			var textContent;
			textContent = js.Boot.__cast(content , qoid.model.MessageContent);
			contentDiv.append("<div class='content-text'><pre class='text-content'>" + textContent.props.text + "</pre></div>");
			break;
		case "VERIFICATION":
			throw new m3.exception.Exception("VerificationContent should not be displayed");
			break;
		}
		new $("<div class='notification-line'><b>Comments:</b> <input type='text' id='responseText'/></div>").appendTo(invitationText);
	}, acceptVerification : function() {
		var self1 = this;
		var selfElement1 = this.element;
		var text = new $("#responseText").val();
		if(m3.helper.StringHelper.isBlank(text)) text = "The claim is true";
		var msg = new qoid.model.VerificationResponse(self1.options.notification.iid,text);
		agentui.model.EM.listenOnce(agentui.model.EMEvent.RespondToVerification_RESPONSE,function(e) {
			self1.destroy();
			selfElement1.remove();
		});
		agentui.model.EM.change(agentui.model.EMEvent.RespondToVerification,msg);
	}, rejectVerification : function() {
		var self2 = this;
		var selfElement2 = this.element;
		agentui.model.EM.listenOnce(agentui.model.EMEvent.RejectVerificationRequest_RESPONSE,function(e1) {
			self2.destroy();
			selfElement2.remove();
		});
		agentui.model.EM.change(agentui.model.EMEvent.RejectVerificationRequest,self2.options.notification.iid);
	}, _buildDialog : function() {
		var self3 = this;
		var selfElement3 = this.element;
		self3.initialized = true;
		var dlgOptions = { autoOpen : false, title : "Respond To Verification Request", height : 400, width : 600, modal : true, buttons : { Accept : function() {
			self3.acceptVerification();
		}, Reject : function() {
			self3.rejectVerification();
		}}, close : function(evt,ui) {
			selfElement3.find(".placeholder").removeClass("ui-state-error");
		}};
		selfElement3.dialog(dlgOptions);
	}, open : function() {
		var self4 = this;
		var selfElement4 = this.element;
		if(!self4.initialized) self4._buildDialog();
		selfElement4.dialog("open");
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.respondToVerificationRequestDialog",defineWidget());
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of RestoreWidget must be a div element");
		selfElement.addClass("RestoreWidget");
		self.container = new $("<div class=''></div>");
		selfElement.append(self.container);
		self.inputContainer = new $("<div class='' style='margin-top: 15px;'></div>");
		selfElement.append(self.inputContainer);
		new $("<button>Backup</button>").button().click(function(evt) {
			self.inputContainer.empty();
			self.inputContainer.append("<h3>Backup Options</h3>").append("<label>Name of Backup</label>");
			var name = new $("<input style='width: 80%;' class='ui-corner-all ui-widget-content'/>").appendTo(self.inputContainer);
			var submit = new $("<button>Submit Backup</button>").appendTo(self.inputContainer).click(function(evt1) {
				if(confirm("Perform Backup?")) {
					(js.Boot.__cast(selfElement , $)).m3dialog("close");
					agentui.model.EM.change(agentui.model.EMEvent.BACKUP);
				}
			});
		}).appendTo(self.container);
		new $("<button>Restore</button>").button().click(function(evt2) {
			if(confirm("Restore from backup?")) {
				(js.Boot.__cast(selfElement , $)).m3dialog("close");
				agentui.model.EM.change(agentui.model.EMEvent.RESTORE);
			}
		}).appendTo(self.container);
		(js.Boot.__cast(selfElement , $)).m3dialog({ autoOpen : false, title : "Data Backup & Restore"});
	}, open : function() {
		var selfElement1 = this.element;
		selfElement1.m3dialog("open");
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.restoreWidget",defineWidget());
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of RevokeAccessDialog must be a div element");
		selfElement.addClass("revokeAccessDialog").hide();
	}, _buildDialog : function() {
		var self1 = this;
		var selfElement1 = this.element;
		var lacls;
		var this1 = qoid.Qoid.groupedLabelAcls.delegate();
		lacls = this1.get(self1.options.connection.iid);
		if(lacls == null) lacls = qoid.Qoid.groupedLabelAcls.addEmptyGroup(self1.options.connection.iid);
		selfElement1.append("<div style='margin-bottom:4px;'>To revoke access, check the label.</div>");
		var $it2 = lacls.iterator();
		while( $it2.hasNext() ) {
			var labelAcl = $it2.next();
			var laclDiv = new $("<div></div>").appendTo(selfElement1);
			new $("<input type=\"checkbox\" style=\"position:relative;top:-18px;\" id=\"cb-" + labelAcl.iid + "\"/>").appendTo(laclDiv);
			new $("<div></div>").labelComp({ dndEnabled : false, labelIid : labelAcl.labelIid}).appendTo(laclDiv);
		}
		var dlgOptions = { autoOpen : false, title : "Revoke Access", height : 290, width : 400, modal : true, buttons : { 'Revoke Access' : function() {
			self1._revokeAccess();
			$(this).dialog("close");
		}, Cancel : function() {
			$(this).dialog("close");
		}}};
		selfElement1.dialog(dlgOptions);
	}, _revokeAccess : function() {
		var self2 = this;
		var selfElement2 = this.element;
		var se = new Array();
		selfElement2.find("input[type=checkbox]").each(function(indexInArray,ele) {
			var cb = new $(ele);
			if(cb.prop("checked") == true) {
				var id = cb.attr("id").split("-")[1];
				se.push(m3.helper.OSetHelper.getElement(qoid.Qoid.labelAcls,id));
			}
		});
		if(se.length > 0) agentui.model.EM.change(agentui.model.EMEvent.RevokeAccess,se);
	}, open : function() {
		var self3 = this;
		var selfElement3 = this.element;
		if(selfElement3.exists()) {
			selfElement3.empty();
			self3._create();
		}
		self3._buildDialog();
		selfElement3.dialog("open");
		selfElement3.dialog("widget").attr("id","revokeAccessDialog");
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.revokeAccessDialog",defineWidget());
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of VerificationRequestDialog must be a div element");
		selfElement.addClass("verificationRequestDialog").hide();
		var uberDiv = new $("<div style='text-align:left'></div>");
		selfElement.append(uberDiv);
		uberDiv.append("<h3>Request Verification From:</h3>");
		var connectionContainer = new $("<div class='container' style='width:450px;height:135px;overflow:auto;'></div>");
		uberDiv.append(connectionContainer);
		var $it3 = ((function($this) {
			var $r;
			var this1 = qoid.Qoid.groupedConnections.delegate();
			$r = this1.get(qoid.Qoid.get_currentAlias().iid);
			return $r;
		}(this))).iterator();
		while( $it3.hasNext() ) {
			var conn = $it3.next();
			var div = new $("<div></div>");
			div.append("<input type='checkbox' class='conn_cb' id='cb_" + conn.iid + "'/>");
			self._appendConnectionAvatar(conn,div);
			connectionContainer.append(div);
		}
		uberDiv.append("<h3>Message:</h3>");
		uberDiv.append("<textarea id='vr_message' style='width:450px;'></textarea>");
	}, _appendConnectionAvatar : function(connection,parent) {
		var avatar = new $("<div class='avatar'></div>").connectionAvatar({ connectionIid : connection.iid, dndEnabled : false, isDragByHelper : true, containment : false}).appendTo(parent).css("display","inline");
		parent.append("<div class='labelDiv' style='display:inline'>" + connection.data.name + "</div>");
	}, initialized : false, _sendRequest : function() {
		var self1 = this;
		var selfElement1 = this.element;
		var connectionIids = new Array();
		new $(".conn_cb").each(function(i,dom) {
			var cb = new $(dom);
			if(cb.prop("checked")) connectionIids.push(cb.attr("id").split("_")[1]);
		});
		var vr = new qoid.model.VerificationRequest(self1.options.content.iid,connectionIids,new $("#vr_message").val());
		agentui.model.EM.listenOnce(agentui.model.EMEvent.VerificationRequest_RESPONSE,function(n) {
			selfElement1.dialog("close");
		});
		agentui.model.EM.change(agentui.model.EMEvent.VerificationRequest,vr);
	}, _buildDialog : function() {
		var self2 = this;
		var selfElement2 = this.element;
		if(self2.initialized) return;
		self2.initialized = true;
		var dlgOptions = { autoOpen : false, title : "Verification Request", height : 400, width : 600, buttons : { Send : function() {
			self2._sendRequest();
		}, Cancel : function() {
			$(this).dialog("close");
		}}, close : function(evt,ui) {
			selfElement2.find(".placeholder").removeClass("ui-state-error");
		}};
		selfElement2.dialog(dlgOptions);
	}, open : function() {
		var self3 = this;
		var selfElement3 = this.element;
		if(selfElement3.exists()) {
			selfElement3.empty();
			self3._create();
		}
		self3._buildDialog();
		selfElement3.dialog("open");
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.verificationRequestDialog",defineWidget());
var defineWidget = function() {
	return { _updateTimeLines : function() {
		var self = this;
		var $it4 = self.contentTimeLines.iterator();
		while( $it4.hasNext() ) {
			var timeline = $it4.next();
			timeline.reposition(self.startTime.getTime(),self.endTime.getTime());
		}
	}, _getProfile : function(content) {
		var alias = m3.helper.OSetHelper.getElement(qoid.Qoid.aliases,content.aliasIid);
		if(alias != null) return alias.profile;
		var connection = m3.helper.OSetHelper.getElement(qoid.Qoid.connections,content.connectionIid);
		if(connection != null) return connection.data;
		return new qoid.model.Profile();
	}, _addContent : function(content1) {
		try {
			var self1 = this;
			var updateTimelines = false;
			if(self1.startTime.getTime() > content1.created.getTime()) {
				self1.startTime = content1.created;
				updateTimelines = true;
			}
			if(self1.endTime.getTime() < content1.created.getTime()) {
				self1.endTime = content1.created;
				updateTimelines = true;
			}
			if(updateTimelines) self1._updateTimeLines();
			if(self1.contentTimeLines.get(content1.aliasIid) == null) {
				var timeLine = new agentui.widget.score.ContentTimeLine(self1.paper,self1._getProfile(content1),self1.startTime.getTime(),self1.endTime.getTime(),self1.viewBoxWidth);
				self1.contentTimeLines.set(content1.aliasIid,timeLine);
			}
			self1.contentTimeLines.get(content1.aliasIid).addContent(content1);
			self1.uberGroup.append(self1.contentTimeLines.get(content1.aliasIid).timeLineElement);
		} catch( e ) {
			m3.log.Logga.get_DEFAULT().error("error calling _addContent",e);
		}
	}, _deleteContent : function(content2) {
		var self2 = this;
		var ctl = self2.contentTimeLines.get(content2.aliasIid);
		if(ctl != null) {
			ctl.removeElements();
			self2.contentTimeLines.remove(content2.aliasIid);
			if(!self2.contentTimeLines.iterator().hasNext()) agentui.widget.score.ContentTimeLine.resetPositions();
		}
	}, _updateContent : function(content3) {
	}, _create : function() {
		var self3 = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of ScoreComp must be a div element");
		selfElement.addClass("container shadow scoreComp");
		var mapListener = function(content4,ele,evt) {
			if(evt.isAdd()) self3._addContent(content4); else if(evt.isUpdate()) self3._updateContent(content4); else if(evt.isDelete()) self3._deleteContent(content4);
		};
		var beforeSetContent = function() {
			new $("#score-comp-svg").empty();
			self3.contentTimeLines = new haxe.ds.StringMap();
			self3.viewBoxWidth = 1000;
			self3.paper = new Snap("#score-comp-svg");
			self3.uberGroup = ((function($this) {
				var $r;
				var e123 = [];
				var me123 = self3.paper;
				$r = me123.group.apply(me123, e123);
				return $r;
			}(this))).attr("id","uber-group").attr("transform","matrix(1 0 0 1 0 0)");
			self3.startTime = null;
			self3.endTime = null;
			if(self3.startTime == null) {
				var t = new Date().getTime() - 7200000.;
				var d = new Date();
				d.setTime(t);
				self3.startTime = d;
				var t1 = self3.startTime.getTime() + 7200000.;
				var d1 = new Date();
				d1.setTime(t1);
				self3.endTime = d1;
			} else {
				var t2 = self3.startTime.getTime() - 7200000.;
				var d2 = new Date();
				d2.setTime(t2);
				self3.startTime = d2;
				var t3 = self3.endTime.getTime() + 7200000.;
				var d3 = new Date();
				d3.setTime(t3);
				self3.endTime = d3;
			}
			self3.timeMarker = new agentui.widget.score.TimeMarker(self3.uberGroup,self3.paper,self3.viewBoxWidth,self3.startTime,self3.endTime);
		};
		var widgetCreator = function(content5) {
			return null;
		};
		agentui.model.ContentSource.addListener(mapListener,beforeSetContent,widgetCreator);
	}, destroy : function() {
		var self4 = this;
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.scoreComp",defineWidget());
var q = window.jQuery;
js.JQuery = q;
agentui.api.VerificationRequestMessage.__rtti = "<class path=\"agentui.api.VerificationRequestMessage\" params=\"\" module=\"agentui.api.CrudMessage\">\n\t<contentIid public=\"1\"><c path=\"String\"/></contentIid>\n\t<connectionIids public=\"1\"><c path=\"Array\"><c path=\"String\"/></c></connectionIids>\n\t<message public=\"1\"><c path=\"String\"/></message>\n\t<new public=\"1\" set=\"method\" line=\"11\"><f a=\"vr\">\n\t<c path=\"qoid.model.VerificationRequest\"/>\n\t<x path=\"Void\"/>\n</f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
agentui.api.VerificationResponseMessage.__rtti = "<class path=\"agentui.api.VerificationResponseMessage\" params=\"\" module=\"agentui.api.CrudMessage\">\n\t<notificationIid public=\"1\"><c path=\"String\"/></notificationIid>\n\t<verificationContent public=\"1\"><c path=\"String\"/></verificationContent>\n\t<new public=\"1\" set=\"method\" line=\"23\"><f a=\"vr\">\n\t<c path=\"qoid.model.VerificationResponse\"/>\n\t<x path=\"Void\"/>\n</f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
agentui.api.AcceptVerificationMessage.__rtti = "<class path=\"agentui.api.AcceptVerificationMessage\" params=\"\" module=\"agentui.api.CrudMessage\">\n\t<notificationIid public=\"1\"><c path=\"String\"/></notificationIid>\n\t<new public=\"1\" set=\"method\" line=\"33\"><f a=\"notificationIid\">\n\t<c path=\"String\"/>\n\t<x path=\"Void\"/>\n</f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
agentui.api.IntroResponseMessage.__rtti = "<class path=\"agentui.api.IntroResponseMessage\" params=\"\" module=\"agentui.api.CrudMessage\">\n\t<notificationIid public=\"1\"><c path=\"String\"/></notificationIid>\n\t<accepted public=\"1\"><x path=\"Bool\"/></accepted>\n\t<new public=\"1\" set=\"method\" line=\"43\"><f a=\"notificationIid:accepted\">\n\t<c path=\"String\"/>\n\t<x path=\"Bool\"/>\n\t<x path=\"Void\"/>\n</f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
qoid.model.ModelObj.__rtti = "<class path=\"qoid.model.ModelObj\" params=\"\">\n\t<objectType public=\"1\" set=\"method\" line=\"24\"><f a=\"\"><c path=\"String\"/></f></objectType>\n\t<new public=\"1\" set=\"method\" line=\"21\"><f a=\"\"><x path=\"Void\"/></f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
qoid.model.ModelObjWithIid.__rtti = "<class path=\"qoid.model.ModelObjWithIid\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ModelObj\"/>\n\t<identifier public=\"1\" set=\"method\" line=\"45\" static=\"1\"><f a=\"t\">\n\t<c path=\"qoid.model.ModelObjWithIid\"/>\n\t<c path=\"String\"/>\n</f></identifier>\n\t<iid public=\"1\"><c path=\"String\"/></iid>\n\t<created public=\"1\"><c path=\"Date\"/></created>\n\t<modified public=\"1\"><c path=\"Date\"/></modified>\n\t<createdByConnectionIid public=\"1\"><c path=\"String\"/></createdByConnectionIid>\n\t<modifiedByConnectionIid public=\"1\"><c path=\"String\"/></modifiedByConnectionIid>\n\t<new public=\"1\" set=\"method\" line=\"38\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
m3.observable.OSet.__rtti = "<class path=\"m3.observable.OSet\" params=\"T\" interface=\"1\">\n\t<identifier public=\"1\" set=\"method\"><f a=\"\"><f a=\"\">\n\t<c path=\"m3.observable.OSet.T\"/>\n\t<c path=\"String\"/>\n</f></f></identifier>\n\t<listen public=\"1\" set=\"method\"><f a=\"l:?autoFire\">\n\t<f a=\":\">\n\t\t<c path=\"m3.observable.OSet.T\"/>\n\t\t<c path=\"m3.observable.EventType\"/>\n\t\t<x path=\"Void\"/>\n\t</f>\n\t<x path=\"Bool\"/>\n\t<x path=\"Void\"/>\n</f></listen>\n\t<removeListener public=\"1\" set=\"method\"><f a=\"l\">\n\t<f a=\":\">\n\t\t<c path=\"m3.observable.OSet.T\"/>\n\t\t<c path=\"m3.observable.EventType\"/>\n\t\t<x path=\"Void\"/>\n\t</f>\n\t<x path=\"Void\"/>\n</f></removeListener>\n\t<iterator public=\"1\" set=\"method\"><f a=\"\"><t path=\"Iterator\"><c path=\"m3.observable.OSet.T\"/></t></f></iterator>\n\t<delegate public=\"1\" set=\"method\"><f a=\"\"><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"m3.observable.OSet.T\"/>\n</x></f></delegate>\n\t<getVisualId public=\"1\" set=\"method\"><f a=\"\"><c path=\"String\"/></f></getVisualId>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
m3.observable.AbstractSet.__rtti = "<class path=\"m3.observable.AbstractSet\" params=\"T\" module=\"m3.observable.OSet\">\n\t<implements path=\"m3.observable.OSet\"><c path=\"m3.observable.AbstractSet.T\"/></implements>\n\t<_eventManager public=\"1\"><c path=\"m3.observable.EventManager\"><c path=\"m3.observable.AbstractSet.T\"/></c></_eventManager>\n\t<visualId public=\"1\"><c path=\"String\"/></visualId>\n\t<listen public=\"1\" set=\"method\" line=\"129\"><f a=\"l:?autoFire\" v=\":true\">\n\t<f a=\":\">\n\t\t<c path=\"m3.observable.AbstractSet.T\"/>\n\t\t<c path=\"m3.observable.EventType\"/>\n\t\t<x path=\"Void\"/>\n\t</f>\n\t<x path=\"Bool\"/>\n\t<x path=\"Void\"/>\n</f></listen>\n\t<removeListener public=\"1\" set=\"method\" line=\"133\"><f a=\"l\">\n\t<f a=\":\">\n\t\t<c path=\"m3.observable.AbstractSet.T\"/>\n\t\t<c path=\"m3.observable.EventType\"/>\n\t\t<x path=\"Void\"/>\n\t</f>\n\t<x path=\"Void\"/>\n</f></removeListener>\n\t<filter public=\"1\" set=\"method\" line=\"137\"><f a=\"f\">\n\t<f a=\"\">\n\t\t<c path=\"m3.observable.AbstractSet.T\"/>\n\t\t<x path=\"Bool\"/>\n\t</f>\n\t<c path=\"m3.observable.OSet\"><c path=\"m3.observable.AbstractSet.T\"/></c>\n</f></filter>\n\t<map public=\"1\" params=\"U\" set=\"method\" line=\"141\"><f a=\"f\">\n\t<f a=\"\">\n\t\t<c path=\"m3.observable.AbstractSet.T\"/>\n\t\t<c path=\"map.U\"/>\n\t</f>\n\t<c path=\"m3.observable.OSet\"><c path=\"map.U\"/></c>\n</f></map>\n\t<fire set=\"method\" line=\"145\"><f a=\"t:type\">\n\t<c path=\"m3.observable.AbstractSet.T\"/>\n\t<c path=\"m3.observable.EventType\"/>\n\t<x path=\"Void\"/>\n</f></fire>\n\t<getVisualId public=\"1\" set=\"method\" line=\"149\"><f a=\"\"><c path=\"String\"/></f></getVisualId>\n\t<identifier public=\"1\" set=\"method\" line=\"153\"><f a=\"\"><f a=\"\">\n\t<c path=\"m3.observable.AbstractSet.T\"/>\n\t<c path=\"String\"/>\n</f></f></identifier>\n\t<iterator public=\"1\" set=\"method\" line=\"157\"><f a=\"\"><t path=\"Iterator\"><c path=\"m3.observable.AbstractSet.T\"/></t></f></iterator>\n\t<delegate public=\"1\" set=\"method\" line=\"161\"><f a=\"\"><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"m3.observable.AbstractSet.T\"/>\n</x></f></delegate>\n\t<new set=\"method\" line=\"125\"><f a=\"\"><x path=\"Void\"/></f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
m3.observable.ObservableSet.__rtti = "<class path=\"m3.observable.ObservableSet\" params=\"T\" module=\"m3.observable.OSet\">\n\t<extends path=\"m3.observable.AbstractSet\"><c path=\"m3.observable.ObservableSet.T\"/></extends>\n\t<_delegate><c path=\"m3.util.SizedMap\"><c path=\"m3.observable.ObservableSet.T\"/></c></_delegate>\n\t<_identifier><f a=\"\">\n\t<c path=\"m3.observable.ObservableSet.T\"/>\n\t<c path=\"String\"/>\n</f></_identifier>\n\t<add public=\"1\" set=\"method\" line=\"181\"><f a=\"t\">\n\t<c path=\"m3.observable.ObservableSet.T\"/>\n\t<x path=\"Void\"/>\n</f></add>\n\t<addAll public=\"1\" set=\"method\" line=\"185\"><f a=\"tArr\">\n\t<c path=\"Array\"><c path=\"m3.observable.ObservableSet.T\"/></c>\n\t<x path=\"Void\"/>\n</f></addAll>\n\t<iterator public=\"1\" set=\"method\" line=\"193\" override=\"1\"><f a=\"\"><t path=\"Iterator\"><c path=\"m3.observable.ObservableSet.T\"/></t></f></iterator>\n\t<isEmpty public=\"1\" set=\"method\" line=\"197\"><f a=\"\"><x path=\"Bool\"/></f></isEmpty>\n\t<addOrUpdate public=\"1\" set=\"method\" line=\"201\"><f a=\"t\">\n\t<c path=\"m3.observable.ObservableSet.T\"/>\n\t<x path=\"Void\"/>\n</f></addOrUpdate>\n\t<delegate public=\"1\" set=\"method\" line=\"213\" override=\"1\"><f a=\"\"><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"m3.observable.ObservableSet.T\"/>\n</x></f></delegate>\n\t<update public=\"1\" set=\"method\" line=\"217\"><f a=\"t\">\n\t<c path=\"m3.observable.ObservableSet.T\"/>\n\t<x path=\"Void\"/>\n</f></update>\n\t<delete public=\"1\" set=\"method\" line=\"221\"><f a=\"t\">\n\t<c path=\"m3.observable.ObservableSet.T\"/>\n\t<x path=\"Void\"/>\n</f></delete>\n\t<identifier public=\"1\" set=\"method\" line=\"229\" override=\"1\"><f a=\"\"><f a=\"\">\n\t<c path=\"m3.observable.ObservableSet.T\"/>\n\t<c path=\"String\"/>\n</f></f></identifier>\n\t<clear public=\"1\" set=\"method\" line=\"233\"><f a=\"\"><x path=\"Void\"/></f></clear>\n\t<size public=\"1\" set=\"method\" line=\"238\"><f a=\"\"><x path=\"Int\"/></f></size>\n\t<asArray public=\"1\" set=\"method\" line=\"242\"><f a=\"\"><c path=\"Array\"><c path=\"m3.observable.ObservableSet.T\"/></c></f></asArray>\n\t<new public=\"1\" set=\"method\" line=\"172\"><f a=\"identifier:?tArr\" v=\":null\">\n\t<f a=\"\">\n\t\t<c path=\"m3.observable.ObservableSet.T\"/>\n\t\t<c path=\"String\"/>\n\t</f>\n\t<c path=\"Array\"><c path=\"m3.observable.ObservableSet.T\"/></c>\n\t<x path=\"Void\"/>\n</f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
m3.observable.EventManager.__rtti = "<class path=\"m3.observable.EventManager\" params=\"T\" module=\"m3.observable.OSet\">\n\t<_listeners><c path=\"Array\"><f a=\":\">\n\t<c path=\"m3.observable.EventManager.T\"/>\n\t<c path=\"m3.observable.EventType\"/>\n\t<x path=\"Void\"/>\n</f></c></_listeners>\n\t<_set><c path=\"m3.observable.OSet\"><c path=\"m3.observable.EventManager.T\"/></c></_set>\n\t<add public=\"1\" set=\"method\" line=\"47\"><f a=\"l:autoFire\">\n\t<f a=\":\">\n\t\t<c path=\"m3.observable.EventManager.T\"/>\n\t\t<c path=\"m3.observable.EventType\"/>\n\t\t<x path=\"Void\"/>\n\t</f>\n\t<x path=\"Bool\"/>\n\t<x path=\"Void\"/>\n</f></add>\n\t<remove public=\"1\" set=\"method\" line=\"56\"><f a=\"l\">\n\t<f a=\":\">\n\t\t<c path=\"m3.observable.EventManager.T\"/>\n\t\t<c path=\"m3.observable.EventType\"/>\n\t\t<x path=\"Void\"/>\n\t</f>\n\t<x path=\"Void\"/>\n</f></remove>\n\t<fire public=\"1\" set=\"method\" line=\"59\"><f a=\"t:type\">\n\t<c path=\"m3.observable.EventManager.T\"/>\n\t<c path=\"m3.observable.EventType\"/>\n\t<x path=\"Void\"/>\n</f></fire>\n\t<listenerCount public=\"1\" set=\"method\" line=\"70\"><f a=\"\"><x path=\"Int\"/></f></listenerCount>\n\t<new public=\"1\" set=\"method\" line=\"43\"><f a=\"set\">\n\t<c path=\"m3.observable.OSet\"><c path=\"m3.observable.EventManager.T\"/></c>\n\t<x path=\"Void\"/>\n</f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
qoid.QE.onAgentCreated = "QE-onAgentCreated";
qoid.QE.onInitialDataload = "QE-onInitialDataload";
qoid.QE.onUserLogin = "QE-onUserLogin";
qoid.QE.onAliasCreated = "QE-onAliasCreated";
qoid.QE.onAliasUpdated = "QE-onAliasUpdated";
qoid.QE.onAliasLoaded = "QE-onAliasLoaded";
agentui.model.EMEvent.FILTER_RUN = "FILTER_RUN";
agentui.model.EMEvent.FILTER_CHANGE = "FILTER_CHANGE";
agentui.model.EMEvent.LoadFilteredContent = "LoadFilteredContent";
agentui.model.EMEvent.AppendFilteredContent = "AppendFilteredContent";
agentui.model.EMEvent.EditContentClosed = "EditContentClosed";
agentui.model.EMEvent.CreateAgent = "CreateAgent";
agentui.model.EMEvent.FitWindow = "FitWindow";
agentui.model.EMEvent.UserLogout = "UserLogout";
agentui.model.EMEvent.UpdateAlias = "UpdateAlias";
agentui.model.EMEvent.DeleteAlias = "DeleteAlias";
agentui.model.EMEvent.CreateContent = "CreateContent";
agentui.model.EMEvent.DeleteContent = "DeleteContent";
agentui.model.EMEvent.UpdateContent = "UpdateContent";
agentui.model.EMEvent.CreateLabel = "CreateLabel";
agentui.model.EMEvent.UpdateLabel = "UpdateLabel";
agentui.model.EMEvent.MoveLabel = "MoveLabel";
agentui.model.EMEvent.CopyLabel = "CopyLabel";
agentui.model.EMEvent.DeleteLabel = "DeleteLabel";
agentui.model.EMEvent.GrantAccess = "GrantAccess";
agentui.model.EMEvent.AccessGranted = "AccessGranted";
agentui.model.EMEvent.RevokeAccess = "RevokeAccess";
agentui.model.EMEvent.DeleteConnection = "DeleteConnection";
agentui.model.EMEvent.INTRODUCTION_REQUEST = "INTRODUCTION_REQUEST";
agentui.model.EMEvent.INTRODUCTION_RESPONSE = "INTRODUCTION_RESPONSE";
agentui.model.EMEvent.RespondToIntroduction = "RespondToIntroduction";
agentui.model.EMEvent.RespondToIntroduction_RESPONSE = "RespondToIntroduction_RESPONSE";
agentui.model.EMEvent.TargetChange = "TargetChange";
agentui.model.EMEvent.VerificationRequest = "VerificationRequest";
agentui.model.EMEvent.VerificationRequest_RESPONSE = "VerificationRequest_RESPONSE";
agentui.model.EMEvent.RespondToVerification = "RespondToVerification";
agentui.model.EMEvent.RespondToVerification_RESPONSE = "RespondToVerification_RESPONSE";
agentui.model.EMEvent.RejectVerificationRequest = "RejectVerificationRequest";
agentui.model.EMEvent.RejectVerificationRequest_RESPONSE = "RejectVerificationRequest_RESPONSE";
agentui.model.EMEvent.AcceptVerification = "AcceptVerification";
agentui.model.EMEvent.AcceptVerification_RESPONSE = "AcceptVerification_RESPONSE";
agentui.model.EMEvent.RejectVerification = "RejectVerification";
agentui.model.EMEvent.RejectVerification_RESPONSE = "RejectVerification_RESPONSE";
agentui.model.EMEvent.BACKUP = "BACKUP";
agentui.model.EMEvent.RESTORE = "RESTORE";
agentui.model.EMEvent.RESTORES_REQUEST = "RESTORES_REQUEST";
agentui.model.EMEvent.AVAILABLE_BACKUPS = "AVAILABLE_BACKUPS";
qoid.model.Content.__rtti = "<class path=\"qoid.model.Content\" params=\"T\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ModelObjWithIid\"/>\n\t<contentType public=\"1\"><c path=\"String\"/></contentType>\n\t<aliasIid public=\"1\">\n\t\t<c path=\"String\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</aliasIid>\n\t<connectionIid public=\"1\">\n\t\t<c path=\"String\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</connectionIid>\n\t<metaData public=\"1\">\n\t\t<c path=\"qoid.model.ContentMetaData\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</metaData>\n\t<data><d/></data>\n\t<props public=\"1\">\n\t\t<c path=\"qoid.model.Content.T\"/>\n\t\t<meta><m n=\":transient\"/></meta>\n\t</props>\n\t<type>\n\t\t<x path=\"Class\"><c path=\"qoid.model.Content.T\"/></x>\n\t\t<meta><m n=\":transient\"/></meta>\n\t</type>\n\t<setData public=\"1\" set=\"method\" line=\"307\"><f a=\"data\">\n\t<d/>\n\t<x path=\"Void\"/>\n</f></setData>\n\t<readResolve set=\"method\" line=\"311\"><f a=\"\"><x path=\"Void\"/></f></readResolve>\n\t<writeResolve set=\"method\" line=\"315\"><f a=\"\"><x path=\"Void\"/></f></writeResolve>\n\t<getTimestamp public=\"1\" set=\"method\" line=\"319\"><f a=\"\"><c path=\"String\"/></f></getTimestamp>\n\t<objectType public=\"1\" set=\"method\" line=\"323\" override=\"1\"><f a=\"\"><c path=\"String\"/></f></objectType>\n\t<new public=\"1\" set=\"method\" line=\"296\"><f a=\"contentType:type\">\n\t<t path=\"qoid.model.ContentType\"/>\n\t<x path=\"Class\"><c path=\"qoid.model.Content.T\"/></x>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
qoid.model.Label.__rtti = "<class path=\"qoid.model.Label\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ModelObjWithIid\"/>\n\t<identifier public=\"1\" set=\"method\" line=\"112\" static=\"1\"><f a=\"l\">\n\t<c path=\"qoid.model.Label\"/>\n\t<c path=\"String\"/>\n</f></identifier>\n\t<name public=\"1\"><c path=\"String\"/></name>\n\t<data public=\"1\">\n\t\t<c path=\"qoid.model.LabelData\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</data>\n\t<labelChildren public=\"1\">\n\t\t<c path=\"m3.observable.OSet\"><c path=\"qoid.model.LabelChild\"/></c>\n\t\t<meta><m n=\":transient\"/></meta>\n\t</labelChildren>\n\t<new public=\"1\" set=\"method\" line=\"106\"><f a=\"?name\" v=\"null\">\n\t<c path=\"String\"/>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
qoid.model.Connection.__rtti = "<class path=\"qoid.model.Connection\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ModelObjWithIid\"/>\n\t<identifier public=\"1\" set=\"method\" line=\"160\" static=\"1\"><f a=\"c\">\n\t<c path=\"qoid.model.Connection\"/>\n\t<c path=\"String\"/>\n</f></identifier>\n\t<aliasIid public=\"1\"><c path=\"String\"/></aliasIid>\n\t<labelIid public=\"1\"><c path=\"String\"/></labelIid>\n\t<localPeerId public=\"1\"><c path=\"String\"/></localPeerId>\n\t<remotePeerId public=\"1\"><c path=\"String\"/></remotePeerId>\n\t<data public=\"1\">\n\t\t<c path=\"qoid.model.Profile\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</data>\n\t<equals public=\"1\" set=\"method\" line=\"169\"><f a=\"c\">\n\t<c path=\"qoid.model.Connection\"/>\n\t<x path=\"Bool\"/>\n</f></equals>\n\t<new public=\"1\" set=\"method\" line=\"164\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.QoidAPI.AGENT_CREATE = "/api/v1/agent/create";
qoid.QoidAPI.LOGIN = "/api/v1/login";
qoid.QoidAPI.LOGOUT = "/api/v1/logout";
qoid.QoidAPI.SPAWN = "/api/v1/session/spawn";
qoid.QoidAPI.ALIAS_CREATE = "/api/v1/alias/create";
qoid.QoidAPI.ALIAS_UPDATE = "/api/v1/alias/update";
qoid.QoidAPI.ALIAS_DELETE = "/api/v1/alias/delete";
qoid.QoidAPI.ALIAS_LOGIN_CREATE = "/api/v1/alias/login/create";
qoid.QoidAPI.ALIAS_LOGIN_UPDATE = "/api/v1/alias/login/update";
qoid.QoidAPI.ALIAS_LOGIN_DELETE = "/api/v1/alias/login/delete";
qoid.QoidAPI.ALIAS_PROFILE_UPDATE = "/api/v1/alias/profile/update";
qoid.QoidAPI.CONNECTION_DELETE = "/api/v1/connection/delete";
qoid.QoidAPI.CONTENT_CREATE = "/api/v1/content/create";
qoid.QoidAPI.CONTENT_UPDATE = "/api/v1/content/update";
qoid.QoidAPI.CONTENT_DELETE = "/api/v1/content/delete";
qoid.QoidAPI.CONTENT_LABEL_ADD = "/api/v1/content/label/add";
qoid.QoidAPI.CONTENT_LABEL_REMOVE = "/api/v1/content/label/remove";
qoid.QoidAPI.LABEL_CREATE = "/api/v1/label/create";
qoid.QoidAPI.LABEL_UPDATE = "/api/v1/label/update";
qoid.QoidAPI.LABEL_DELETE = "/api/v1/label/remove";
qoid.QoidAPI.LABEL_MOVE = "/api/v1/label/move";
qoid.QoidAPI.LABEL_COPY = "/api/v1/label/copy";
qoid.QoidAPI.LABEL_ACCESS_GRANT = "/api/v1/label/access/grant";
qoid.QoidAPI.LABEL_ACCESS_REVOKE = "/api/v1/label/access/revoke";
qoid.QoidAPI.LABEL_ACCESS_UPDATE = "/api/v1/label/access/update";
qoid.QoidAPI.NOTIFICATION_CREATE = "/api/v1/notification/create";
qoid.QoidAPI.NOTIFICATION_CONSUME = "/api/v1/notification/consume";
qoid.QoidAPI.NOTIFICATION_DELETE = "/api/v1/notification/delete";
qoid.QoidAPI.INTRODUCTION_INITIATE = "/api/v1/introduction/initiate";
qoid.QoidAPI.INTRODUCTION_ACCEPT = "/api/v1/introduction/accept";
qoid.QoidAPI.QUERY = "/api/v1/query";
qoid.QoidAPI.QUERY_CANCEL = "/api/v1/query/cancel";
m3.comm.ChannelRequestMessage.__rtti = "<class path=\"m3.comm.ChannelRequestMessage\" params=\"\" module=\"m3.comm.ChannelRequest\">\n\t<path><c path=\"String\"/></path>\n\t<context><c path=\"String\"/></context>\n\t<parms><d/></parms>\n\t<new public=\"1\" set=\"method\" line=\"11\"><f a=\"path:context:parms\">\n\t<c path=\"String\"/>\n\t<c path=\"String\"/>\n\t<d/>\n\t<x path=\"Void\"/>\n</f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
m3.comm.ChannelRequestMessageBundle.__rtti = "<class path=\"m3.comm.ChannelRequestMessageBundle\" params=\"\" module=\"m3.comm.ChannelRequest\">\n\t<channel><c path=\"String\"/></channel>\n\t<requests><c path=\"Array\"><c path=\"m3.comm.ChannelRequestMessage\"/></c></requests>\n\t<add public=\"1\" set=\"method\" line=\"29\"><f a=\"request\">\n\t<c path=\"m3.comm.ChannelRequestMessage\"/>\n\t<x path=\"Void\"/>\n</f></add>\n\t<createAndAdd public=\"1\" set=\"method\" line=\"33\"><f a=\"path:context:parms\">\n\t<c path=\"String\"/>\n\t<c path=\"String\"/>\n\t<d/>\n\t<x path=\"Void\"/>\n</f></createAndAdd>\n\t<new public=\"1\" set=\"method\" line=\"24\"><f a=\"channel:requests\">\n\t<c path=\"String\"/>\n\t<c path=\"Array\"><c path=\"m3.comm.ChannelRequestMessage\"/></c>\n\t<x path=\"Void\"/>\n</f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
m3.observable.GroupedSet.__rtti = "<class path=\"m3.observable.GroupedSet\" params=\"T\" module=\"m3.observable.OSet\">\n\t<extends path=\"m3.observable.AbstractSet\"><c path=\"m3.observable.OSet\"><c path=\"m3.observable.GroupedSet.T\"/></c></extends>\n\t<_source><c path=\"m3.observable.OSet\"><c path=\"m3.observable.GroupedSet.T\"/></c></_source>\n\t<_groupingFn><f a=\"\">\n\t<c path=\"m3.observable.GroupedSet.T\"/>\n\t<c path=\"String\"/>\n</f></_groupingFn>\n\t<_groupedSets><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"m3.observable.ObservableSet\"><c path=\"m3.observable.GroupedSet.T\"/></c>\n</x></_groupedSets>\n\t<_identityToGrouping><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"String\"/>\n</x></_identityToGrouping>\n\t<delete set=\"method\" line=\"437\"><f a=\"t:?deleteEmptySet\" v=\":true\">\n\t<c path=\"m3.observable.GroupedSet.T\"/>\n\t<x path=\"Bool\"/>\n\t<x path=\"Void\"/>\n</f></delete>\n\t<add set=\"method\" line=\"460\"><f a=\"t\">\n\t<c path=\"m3.observable.GroupedSet.T\"/>\n\t<x path=\"Void\"/>\n</f></add>\n\t<addEmptyGroup public=\"1\" set=\"method\" line=\"479\"><f a=\"key\">\n\t<c path=\"String\"/>\n\t<c path=\"m3.observable.ObservableSet\"><c path=\"m3.observable.GroupedSet.T\"/></c>\n</f></addEmptyGroup>\n\t<identifier public=\"1\" set=\"method\" line=\"488\" override=\"1\"><f a=\"\"><f a=\"\">\n\t<c path=\"m3.observable.OSet\"><c path=\"m3.observable.GroupedSet.T\"/></c>\n\t<c path=\"String\"/>\n</f></f></identifier>\n\t<identify set=\"method\" line=\"492\"><f a=\"set\">\n\t<c path=\"m3.observable.OSet\"><c path=\"m3.observable.GroupedSet.T\"/></c>\n\t<c path=\"String\"/>\n</f></identify>\n\t<iterator public=\"1\" set=\"method\" line=\"503\" override=\"1\"><f a=\"\"><t path=\"Iterator\"><c path=\"m3.observable.OSet\"><c path=\"m3.observable.GroupedSet.T\"/></c></t></f></iterator>\n\t<delegate public=\"1\" set=\"method\" line=\"507\" override=\"1\"><f a=\"\"><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"m3.observable.OSet\"><c path=\"m3.observable.GroupedSet.T\"/></c>\n</x></f></delegate>\n\t<new public=\"1\" set=\"method\" line=\"417\"><f a=\"source:groupingFn\">\n\t<c path=\"m3.observable.OSet\"><c path=\"m3.observable.GroupedSet.T\"/></c>\n\t<f a=\"\">\n\t\t<c path=\"m3.observable.GroupedSet.T\"/>\n\t\t<c path=\"String\"/>\n\t</f>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
qoid.model.LabelAcl.__rtti = "<class path=\"qoid.model.LabelAcl\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ModelObjWithIid\"/>\n\t<identifier public=\"1\" set=\"method\" line=\"148\" static=\"1\"><f a=\"l\">\n\t<c path=\"qoid.model.LabelAcl\"/>\n\t<c path=\"String\"/>\n</f></identifier>\n\t<connectionIid public=\"1\"><c path=\"String\"/></connectionIid>\n\t<labelIid public=\"1\"><c path=\"String\"/></labelIid>\n\t<role public=\"1\"><c path=\"String\"/></role>\n\t<maxDegreesOfVisibility public=\"1\"><x path=\"Int\"/></maxDegreesOfVisibility>\n\t<new public=\"1\" set=\"method\" line=\"142\"><f a=\"?connectionIid:?labelIid\" v=\"null:null\">\n\t<c path=\"String\"/>\n\t<c path=\"String\"/>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
qoid.model.LabelChild.__rtti = "<class path=\"qoid.model.LabelChild\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ModelObjWithIid\"/>\n\t<identifier public=\"1\" set=\"method\" line=\"131\" static=\"1\"><f a=\"l\">\n\t<c path=\"qoid.model.LabelChild\"/>\n\t<c path=\"String\"/>\n</f></identifier>\n\t<parentIid public=\"1\"><c path=\"String\"/></parentIid>\n\t<childIid public=\"1\"><c path=\"String\"/></childIid>\n\t<data public=\"1\">\n\t\t<d/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</data>\n\t<new public=\"1\" set=\"method\" line=\"122\"><f a=\"?parentIid:?childIid\" v=\"null:null\">\n\t<c path=\"String\"/>\n\t<c path=\"String\"/>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
qoid.model.LabeledContent.__rtti = "<class path=\"qoid.model.LabeledContent\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ModelObjWithIid\"/>\n\t<identifier public=\"1\" set=\"method\" line=\"244\" static=\"1\"><f a=\"l\">\n\t<c path=\"qoid.model.LabeledContent\"/>\n\t<c path=\"String\"/>\n</f></identifier>\n\t<contentIid public=\"1\"><c path=\"String\"/></contentIid>\n\t<labelIid public=\"1\"><c path=\"String\"/></labelIid>\n\t<data public=\"1\">\n\t\t<d/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</data>\n\t<new public=\"1\" set=\"method\" line=\"248\"><f a=\"contentIid:labelIid\">\n\t<c path=\"String\"/>\n\t<c path=\"String\"/>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
qoid.model.Profile.__rtti = "<class path=\"qoid.model.Profile\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ModelObjWithIid\"/>\n\t<identifier public=\"1\" set=\"method\" line=\"63\" static=\"1\"><f a=\"profile\">\n\t<c path=\"qoid.model.Profile\"/>\n\t<c path=\"String\"/>\n</f></identifier>\n\t<sharedId public=\"1\"><c path=\"String\"/></sharedId>\n\t<aliasIid public=\"1\"><c path=\"String\"/></aliasIid>\n\t<name public=\"1\"><c path=\"String\"/></name>\n\t<imgSrc public=\"1\">\n\t\t<c path=\"String\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</imgSrc>\n\t<connectionIid public=\"1\">\n\t\t<c path=\"String\"/>\n\t\t<meta><m n=\":transient\"/></meta>\n\t</connectionIid>\n\t<new public=\"1\" set=\"method\" line=\"57\"><f a=\"?name:?imgSrc:?aliasIid\" v=\"null:null:null\">\n\t<c path=\"String\"/>\n\t<c path=\"String\"/>\n\t<c path=\"String\"/>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
qoid.model.Notification.__rtti = "<class path=\"qoid.model.Notification\" params=\"T\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ModelObjWithIid\"/>\n\t<consumed public=\"1\"><x path=\"Bool\"/></consumed>\n\t<kind public=\"1\"><e path=\"qoid.model.NotificationKind\"/></kind>\n\t<route public=\"1\"><c path=\"Array\"><c path=\"String\"/></c></route>\n\t<data><d/></data>\n\t<props public=\"1\">\n\t\t<c path=\"qoid.model.Notification.T\"/>\n\t\t<meta><m n=\":transient\"/></meta>\n\t</props>\n\t<type>\n\t\t<x path=\"Class\"><c path=\"qoid.model.Notification.T\"/></x>\n\t\t<meta><m n=\":transient\"/></meta>\n\t</type>\n\t<objectType public=\"1\" set=\"method\" line=\"447\" override=\"1\"><f a=\"\"><c path=\"String\"/></f></objectType>\n\t<readResolve set=\"method\" line=\"460\"><f a=\"\"><x path=\"Void\"/></f></readResolve>\n\t<writeResolve set=\"method\" line=\"464\"><f a=\"\"><x path=\"Void\"/></f></writeResolve>\n\t<new public=\"1\" set=\"method\" line=\"451\"><f a=\"kind:type\">\n\t<e path=\"qoid.model.NotificationKind\"/>\n\t<x path=\"Class\"><c path=\"qoid.model.Notification.T\"/></x>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
m3.observable.FilteredSet.__rtti = "<class path=\"m3.observable.FilteredSet\" params=\"T\" module=\"m3.observable.OSet\">\n\t<extends path=\"m3.observable.AbstractSet\"><c path=\"m3.observable.FilteredSet.T\"/></extends>\n\t<_filteredSet><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"m3.observable.FilteredSet.T\"/>\n</x></_filteredSet>\n\t<_source><c path=\"m3.observable.OSet\"><c path=\"m3.observable.FilteredSet.T\"/></c></_source>\n\t<_filter><f a=\"\">\n\t<c path=\"m3.observable.FilteredSet.T\"/>\n\t<x path=\"Bool\"/>\n</f></_filter>\n\t<delegate public=\"1\" set=\"method\" line=\"366\" override=\"1\"><f a=\"\"><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"m3.observable.FilteredSet.T\"/>\n</x></f></delegate>\n\t<apply set=\"method\" line=\"370\"><f a=\"t\">\n\t<c path=\"m3.observable.FilteredSet.T\"/>\n\t<x path=\"Void\"/>\n</f></apply>\n\t<refilter public=\"1\" set=\"method\" line=\"387\"><f a=\"\"><x path=\"Void\"/></f></refilter>\n\t<identifier public=\"1\" set=\"method\" line=\"391\" override=\"1\"><f a=\"\"><f a=\"\">\n\t<c path=\"m3.observable.FilteredSet.T\"/>\n\t<c path=\"String\"/>\n</f></f></identifier>\n\t<iterator public=\"1\" set=\"method\" line=\"395\" override=\"1\"><f a=\"\"><t path=\"Iterator\"><c path=\"m3.observable.FilteredSet.T\"/></t></f></iterator>\n\t<asArray public=\"1\" set=\"method\" line=\"399\"><f a=\"\"><c path=\"Array\"><c path=\"m3.observable.FilteredSet.T\"/></c></f></asArray>\n\t<new public=\"1\" set=\"method\" line=\"342\"><f a=\"source:filter\">\n\t<c path=\"m3.observable.OSet\"><c path=\"m3.observable.FilteredSet.T\"/></c>\n\t<f a=\"\">\n\t\t<c path=\"m3.observable.FilteredSet.T\"/>\n\t\t<x path=\"Bool\"/>\n\t</f>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
qoid.model.Alias.__rtti = "<class path=\"qoid.model.Alias\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ModelObjWithIid\"/>\n\t<identifier public=\"1\" set=\"method\" line=\"88\" static=\"1\"><f a=\"alias\">\n\t<c path=\"qoid.model.Alias\"/>\n\t<c path=\"String\"/>\n</f></identifier>\n\t<labelIid public=\"1\"><c path=\"String\"/></labelIid>\n\t<connectionIid public=\"1\"><c path=\"String\"/></connectionIid>\n\t<profile public=\"1\">\n\t\t<c path=\"qoid.model.Profile\"/>\n\t\t<meta><m n=\":transient\"/></meta>\n\t</profile>\n\t<data public=\"1\">\n\t\t<c path=\"qoid.model.AliasData\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</data>\n\t<new public=\"1\" set=\"method\" line=\"82\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.AliasData.__rtti = "<class path=\"qoid.model.AliasData\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ModelObj\"/>\n\t<isDefault public=\"1\">\n\t\t<x path=\"Bool\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</isDefault>\n\t<new public=\"1\" set=\"method\" line=\"70\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
m3.observable.SortedSet.__rtti = "<class path=\"m3.observable.SortedSet\" params=\"T\" module=\"m3.observable.OSet\">\n\t<extends path=\"m3.observable.AbstractSet\"><c path=\"m3.observable.SortedSet.T\"/></extends>\n\t<_source><c path=\"m3.observable.OSet\"><c path=\"m3.observable.SortedSet.T\"/></c></_source>\n\t<_sortByFn><f a=\"\">\n\t<c path=\"m3.observable.SortedSet.T\"/>\n\t<c path=\"String\"/>\n</f></_sortByFn>\n\t<_sorted><c path=\"Array\"><c path=\"m3.observable.SortedSet.T\"/></c></_sorted>\n\t<_dirty><x path=\"Bool\"/></_dirty>\n\t<_comparisonFn><f a=\":\">\n\t<c path=\"m3.observable.SortedSet.T\"/>\n\t<c path=\"m3.observable.SortedSet.T\"/>\n\t<x path=\"Int\"/>\n</f></_comparisonFn>\n\t<sorted public=\"1\" set=\"method\" line=\"562\"><f a=\"\"><c path=\"Array\"><c path=\"m3.observable.SortedSet.T\"/></c></f></sorted>\n\t<indexOf set=\"method\" line=\"570\"><f a=\"t\">\n\t<c path=\"m3.observable.SortedSet.T\"/>\n\t<x path=\"Int\"/>\n</f></indexOf>\n\t<binarySearch set=\"method\" line=\"575\"><f a=\"value:sortBy:startIndex:endIndex\">\n\t<c path=\"m3.observable.SortedSet.T\"/>\n\t<c path=\"String\"/>\n\t<x path=\"Int\"/>\n\t<x path=\"Int\"/>\n\t<x path=\"Int\"/>\n</f></binarySearch>\n\t<delete set=\"method\" line=\"593\"><f a=\"t\">\n\t<c path=\"m3.observable.SortedSet.T\"/>\n\t<x path=\"Void\"/>\n</f></delete>\n\t<add set=\"method\" line=\"597\"><f a=\"t\">\n\t<c path=\"m3.observable.SortedSet.T\"/>\n\t<x path=\"Void\"/>\n</f></add>\n\t<identifier public=\"1\" set=\"method\" line=\"603\" override=\"1\"><f a=\"\"><f a=\"\">\n\t<c path=\"m3.observable.SortedSet.T\"/>\n\t<c path=\"String\"/>\n</f></f></identifier>\n\t<iterator public=\"1\" set=\"method\" line=\"607\" override=\"1\"><f a=\"\"><t path=\"Iterator\"><c path=\"m3.observable.SortedSet.T\"/></t></f></iterator>\n\t<delegate public=\"1\" set=\"method\" line=\"611\" override=\"1\"><f a=\"\"><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"m3.observable.SortedSet.T\"/>\n</x></f></delegate>\n\t<new public=\"1\" set=\"method\" line=\"520\"><f a=\"source:?sortByFn\" v=\":null\">\n\t<c path=\"m3.observable.OSet\"><c path=\"m3.observable.SortedSet.T\"/></c>\n\t<f a=\"\">\n\t\t<c path=\"m3.observable.SortedSet.T\"/>\n\t\t<c path=\"String\"/>\n\t</f>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
m3.observable.MappedSet.__rtti = "<class path=\"m3.observable.MappedSet\" params=\"T:U\" module=\"m3.observable.OSet\">\n\t<extends path=\"m3.observable.AbstractSet\"><c path=\"m3.observable.MappedSet.U\"/></extends>\n\t<_source><c path=\"m3.observable.OSet\"><c path=\"m3.observable.MappedSet.T\"/></c></_source>\n\t<_mapper><f a=\"\">\n\t<c path=\"m3.observable.MappedSet.T\"/>\n\t<c path=\"m3.observable.MappedSet.U\"/>\n</f></_mapper>\n\t<_mappedSet><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"m3.observable.MappedSet.U\"/>\n</x></_mappedSet>\n\t<_remapOnUpdate><x path=\"Bool\"/></_remapOnUpdate>\n\t<_mapListeners><c path=\"Array\"><f a=\"::\">\n\t<c path=\"m3.observable.MappedSet.T\"/>\n\t<c path=\"m3.observable.MappedSet.U\"/>\n\t<c path=\"m3.observable.EventType\"/>\n\t<x path=\"Void\"/>\n</f></c></_mapListeners>\n\t<_sourceListener set=\"method\" line=\"270\"><f a=\"t:type\">\n\t<c path=\"m3.observable.MappedSet.T\"/>\n\t<c path=\"m3.observable.EventType\"/>\n\t<x path=\"Void\"/>\n</f></_sourceListener>\n\t<identifier public=\"1\" set=\"method\" line=\"296\" override=\"1\"><f a=\"\"><f a=\"\">\n\t<c path=\"m3.observable.MappedSet.U\"/>\n\t<c path=\"String\"/>\n</f></f></identifier>\n\t<delegate public=\"1\" set=\"method\" line=\"300\" override=\"1\"><f a=\"\"><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"m3.observable.MappedSet.U\"/>\n</x></f></delegate>\n\t<identify set=\"method\" line=\"304\"><f a=\"u\">\n\t<c path=\"m3.observable.MappedSet.U\"/>\n\t<c path=\"String\"/>\n</f></identify>\n\t<iterator public=\"1\" set=\"method\" line=\"315\" override=\"1\"><f a=\"\"><t path=\"Iterator\"><c path=\"m3.observable.MappedSet.U\"/></t></f></iterator>\n\t<mapListen public=\"1\" set=\"method\" line=\"319\"><f a=\"f\">\n\t<f a=\"::\">\n\t\t<c path=\"m3.observable.MappedSet.T\"/>\n\t\t<c path=\"m3.observable.MappedSet.U\"/>\n\t\t<c path=\"m3.observable.EventType\"/>\n\t\t<x path=\"Void\"/>\n\t</f>\n\t<x path=\"Void\"/>\n</f></mapListen>\n\t<removeListeners public=\"1\" set=\"method\" line=\"330\"><f a=\"mapListener\">\n\t<f a=\"::\">\n\t\t<c path=\"m3.observable.MappedSet.T\"/>\n\t\t<c path=\"m3.observable.MappedSet.U\"/>\n\t\t<c path=\"m3.observable.EventType\"/>\n\t\t<x path=\"Void\"/>\n\t</f>\n\t<x path=\"Void\"/>\n</f></removeListeners>\n\t<new public=\"1\" set=\"method\" line=\"260\"><f a=\"source:mapper:?remapOnUpdate\" v=\"::false\">\n\t<c path=\"m3.observable.OSet\"><c path=\"m3.observable.MappedSet.T\"/></c>\n\t<f a=\"\">\n\t\t<c path=\"m3.observable.MappedSet.T\"/>\n\t\t<c path=\"m3.observable.MappedSet.U\"/>\n\t</f>\n\t<x path=\"Bool\"/>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
qoid.model.LabelData.__rtti = "<class path=\"qoid.model.LabelData\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ModelObj\"/>\n\t<color public=\"1\"><c path=\"String\"/></color>\n\t<new public=\"1\" set=\"method\" line=\"95\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
m3.util.ColorProvider._INDEX = 0;
qoid.model.NewUser.__rtti = "<class path=\"qoid.model.NewUser\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ModelObj\"/>\n\t<name public=\"1\"><c path=\"String\"/></name>\n\t<userName public=\"1\"><c path=\"String\"/></userName>\n\t<email public=\"1\"><c path=\"String\"/></email>\n\t<pwd public=\"1\"><c path=\"String\"/></pwd>\n\t<new public=\"1\" set=\"method\" line=\"569\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.Login.__rtti = "<class path=\"qoid.model.Login\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ModelObj\"/>\n\t<agentId public=\"1\"><c path=\"String\"/></agentId>\n\t<password public=\"1\"><c path=\"String\"/></password>\n\t<new public=\"1\" set=\"method\" line=\"556\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.Introduction.__rtti = "<class path=\"qoid.model.Introduction\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ModelObjWithIid\"/>\n\t<aConnectionIid public=\"1\"><c path=\"String\"/></aConnectionIid>\n\t<bConnectionIid public=\"1\"><c path=\"String\"/></bConnectionIid>\n\t<aState public=\"1\"><e path=\"qoid.model.IntroductionState\"/></aState>\n\t<bState public=\"1\"><e path=\"qoid.model.IntroductionState\"/></bState>\n\t<recordVersion public=\"1\"><x path=\"Int\"/></recordVersion>\n\t<new public=\"1\" set=\"method\" line=\"484\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.Synchronizer.synchronizers = new haxe.ds.StringMap();
qoid.model.AudioContent.__rtti = "<class path=\"qoid.model.AudioContent\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.Content\"><c path=\"qoid.model.AudioContentData\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"354\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.ContentData.__rtti = "<class path=\"qoid.model.ContentData\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<new public=\"1\" set=\"method\" line=\"257\"><f a=\"\"><x path=\"Void\"/></f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
qoid.model.AudioContentData.__rtti = "<class path=\"qoid.model.AudioContentData\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ContentData\"/>\n\t<audioSrc public=\"1\"><c path=\"String\"/></audioSrc>\n\t<audioType public=\"1\">\n\t\t<c path=\"String\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</audioType>\n\t<title public=\"1\">\n\t\t<c path=\"String\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</title>\n\t<new public=\"1\" set=\"method\" line=\"348\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.ContentMetaData.__rtti = "<class path=\"qoid.model.ContentMetaData\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<verifications public=\"1\">\n\t\t<c path=\"Array\"><c path=\"qoid.model.ContentVerification\"/></c>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</verifications>\n\t<verifiedContent public=\"1\">\n\t\t<c path=\"qoid.model.VerifiedContentMetaData\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</verifiedContent>\n\t<new public=\"1\" set=\"method\" line=\"280\"><f a=\"\"><x path=\"Void\"/></f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
qoid.model.ImageContent.__rtti = "<class path=\"qoid.model.ImageContent\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.Content\"><c path=\"qoid.model.ImageContentData\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"338\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.ImageContentData.__rtti = "<class path=\"qoid.model.ImageContentData\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ContentData\"/>\n\t<imgSrc public=\"1\"><c path=\"String\"/></imgSrc>\n\t<caption public=\"1\">\n\t\t<c path=\"String\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</caption>\n\t<new public=\"1\" set=\"method\" line=\"332\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.MessageContent.__rtti = "<class path=\"qoid.model.MessageContent\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.Content\"><c path=\"qoid.model.MessageContentData\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"368\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.MessageContentData.__rtti = "<class path=\"qoid.model.MessageContentData\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ContentData\"/>\n\t<text public=\"1\"><c path=\"String\"/></text>\n\t<new public=\"1\" set=\"method\" line=\"362\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.UrlContent.__rtti = "<class path=\"qoid.model.UrlContent\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.Content\"><c path=\"qoid.model.UrlContentData\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"383\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.UrlContentData.__rtti = "<class path=\"qoid.model.UrlContentData\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ContentData\"/>\n\t<url public=\"1\"><c path=\"String\"/></url>\n\t<text public=\"1\">\n\t\t<c path=\"String\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</text>\n\t<new public=\"1\" set=\"method\" line=\"377\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.VerificationContent.__rtti = "<class path=\"qoid.model.VerificationContent\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.Content\"><c path=\"qoid.model.VerificationContentData\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"398\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.VerificationContentData.__rtti = "<class path=\"qoid.model.VerificationContentData\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ContentData\"/>\n\t<text public=\"1\"><c path=\"String\"/></text>\n\t<created public=\"1\"><c path=\"Date\"/></created>\n\t<modified public=\"1\"><c path=\"Date\"/></modified>\n\t<new public=\"1\" set=\"method\" line=\"392\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.IntroductionRequest.__rtti = "<class path=\"qoid.model.IntroductionRequest\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.ModelObjWithIid\"/>\n\t<aConnectionIid public=\"1\"><c path=\"String\"/></aConnectionIid>\n\t<bConnectionIid public=\"1\"><c path=\"String\"/></bConnectionIid>\n\t<aMessage public=\"1\"><c path=\"String\"/></aMessage>\n\t<bMessage public=\"1\"><c path=\"String\"/></bMessage>\n\t<new public=\"1\" set=\"method\" line=\"477\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
agentui.widget.score.ContentTimeLine.initial_y_pos = 60;
agentui.widget.score.ContentTimeLine.next_y_pos = agentui.widget.score.ContentTimeLine.initial_y_pos;
agentui.widget.score.ContentTimeLine.next_x_pos = 10;
agentui.widget.score.ContentTimeLine.width = 60;
agentui.widget.score.ContentTimeLine.height = 70;
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
js.d3._D3.InitPriority.important = "important";
m3.observable.EventType.Add = new m3.observable.EventType("Add",true,false,false);
m3.observable.EventType.Update = new m3.observable.EventType("Update",false,true,false);
m3.observable.EventType.Delete = new m3.observable.EventType("Delete",false,false,false);
m3.observable.EventType.Clear = new m3.observable.EventType("Clear",false,false,true);
qoid.model.ContentVerification.__rtti = "<class path=\"qoid.model.ContentVerification\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<verifierId public=\"1\"><c path=\"String\"/></verifierId>\n\t<verificationIid public=\"1\"><c path=\"String\"/></verificationIid>\n\t<hash public=\"1\"><d/></hash>\n\t<hashAlgorithm public=\"1\"><c path=\"String\"/></hashAlgorithm>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
qoid.model.VerifiedContentMetaData.__rtti = "<class path=\"qoid.model.VerifiedContentMetaData\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<hash public=\"1\"><d/></hash>\n\t<hashAlgorithm public=\"1\"><c path=\"String\"/></hashAlgorithm>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
qoid.model.IntroductionRequestNotification.__rtti = "<class path=\"qoid.model.IntroductionRequestNotification\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.Notification\"><c path=\"qoid.model.IntroductionRequestData\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"494\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.IntroductionRequestData.__rtti = "<class path=\"qoid.model.IntroductionRequestData\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<introductionIid public=\"1\"><c path=\"String\"/></introductionIid>\n\t<message public=\"1\"><c path=\"String\"/></message>\n\t<profile public=\"1\"><c path=\"qoid.model.Profile\"/></profile>\n\t<accepted public=\"1\">\n\t\t<x path=\"Bool\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</accepted>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
qoid.model.VerificationRequestNotification.__rtti = "<class path=\"qoid.model.VerificationRequestNotification\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.Notification\"><c path=\"qoid.model.VerificationRequestData\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"507\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.VerificationRequestData.__rtti = "<class path=\"qoid.model.VerificationRequestData\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<contentIid public=\"1\"><c path=\"String\"/></contentIid>\n\t<contentType public=\"1\"><c path=\"String\"/></contentType>\n\t<contentData public=\"1\"><d/></contentData>\n\t<message public=\"1\"><c path=\"String\"/></message>\n\t<getContent public=\"1\" set=\"method\" line=\"519\">\n\t\t<f a=\"\"><c path=\"qoid.model.Content\"><d/></c></f>\n\t\t<meta><m n=\":transient\"/></meta>\n\t</getContent>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
qoid.model.VerificationResponseNotification.__rtti = "<class path=\"qoid.model.VerificationResponseNotification\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<extends path=\"qoid.model.Notification\"><c path=\"qoid.model.VerificationResponseData\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"539\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
qoid.model.VerificationResponseData.__rtti = "<class path=\"qoid.model.VerificationResponseData\" params=\"\" module=\"qoid.model.ModelObj\">\n\t<contentIid public=\"1\"><c path=\"String\"/></contentIid>\n\t<verificationContentIid public=\"1\"><c path=\"String\"/></verificationContentIid>\n\t<verificationContentData public=\"1\"><d/></verificationContentData>\n\t<verifierId public=\"1\"><c path=\"String\"/></verifierId>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
agentui.AgentUi.main();
})(typeof window != "undefined" ? window : exports);
