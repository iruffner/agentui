(function ($hx_exports) { "use strict";
$hx_exports.m3 = $hx_exports.m3 || {};
$hx_exports.m3.helper = $hx_exports.m3.helper || {};
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
var EReg = function() { };
$hxClasses["EReg"] = EReg;
EReg.__name__ = ["EReg"];
EReg.prototype = {
	split: function(s) {
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
Lambda.list = function(it) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var i = $it0.next();
		l.add(i);
	}
	return l;
};
Lambda.map = function(it,f) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(f(x));
	}
	return l;
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
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
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
var haxe = {};
haxe.StackItem = $hxClasses["haxe.StackItem"] = { __ename__ : ["haxe","StackItem"], __constructs__ : ["CFunction","Module","FilePos","Method","LocalFunction"] };
haxe.StackItem.CFunction = ["CFunction",0];
haxe.StackItem.CFunction.toString = $estr;
haxe.StackItem.CFunction.__enum__ = haxe.StackItem;
haxe.StackItem.Module = function(m) { var $x = ["Module",1,m]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; };
haxe.StackItem.FilePos = function(s,file,line) { var $x = ["FilePos",2,s,file,line]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; };
haxe.StackItem.Method = function(classname,method) { var $x = ["Method",3,classname,method]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; };
haxe.StackItem.LocalFunction = function(v) { var $x = ["LocalFunction",4,v]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; };
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
m3.log = {};
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
m3.test = {};
m3.test.Assert = function(message,cause) {
	m3.exception.Exception.call(this,message,cause);
};
$hxClasses["m3.test.Assert"] = m3.test.Assert;
m3.test.Assert.__name__ = ["m3","test","Assert"];
m3.test.Assert.isTrue = function(b) {
	if(!b) throw new m3.test.Assert("isTrue(" + (b == null?"null":"" + b) + ")");
};
m3.test.Assert.isFalse = function(b) {
	if(b) throw new m3.test.Assert("isFalse(" + (b == null?"null":"" + b) + ")");
};
m3.test.Assert.areEqual = function(left,right) {
	if(left != right) {
		var msg = "FAIL!!  areEqual(\n" + Std.string(left) + ", \n" + Std.string(right) + "\n)";
		console.log(msg);
		throw new m3.test.Assert(msg);
	}
};
m3.test.Assert.fail = function(msg) {
	throw msg;
};
m3.test.Assert.__super__ = m3.exception.Exception;
m3.test.Assert.prototype = $extend(m3.exception.Exception.prototype,{
	__class__: m3.test.Assert
});
m3.test.DeepCompareTest = function() { };
$hxClasses["m3.test.DeepCompareTest"] = m3.test.DeepCompareTest;
m3.test.DeepCompareTest.__name__ = ["m3","test","DeepCompareTest"];
m3.test.DeepCompareTest.prototype = {
	testInts: function() {
		m3.util.DeepCompare.assert(1,1);
	}
	,testStrings: function() {
		m3.util.DeepCompare.assert("a","a");
	}
	,testFailure: function() {
		var left = { a : 1, b : "xyz"};
		var right = { a : 1, b : "xyz", c : 5};
		try {
			m3.util.DeepCompare.assert(left,right);
			m3.test.Assert.fail("we should have blown up");
		} catch( e ) {
		}
	}
	,testArrayFailure: function() {
		var left = [1,2,3];
		var right = [1,2,3,4];
		try {
			m3.util.DeepCompare.assert(left,right);
			m3.test.Assert.fail("we should have blown up");
		} catch( e ) {
			console.log("we blewup as we should have");
			console.log(e);
		}
	}
	,testDeepCompareFailureMessage: function() {
		try {
			m3.util.DeepCompare.assert({ a : { b : { c : [1,2,3]}}},{ a : { b : { c : [1,2,3,4]}}});
			m3.test.Assert.fail("we should have blown up");
		} catch( e ) {
			console.log("we blewup as we should have");
			console.log(e);
		}
		try {
			m3.util.DeepCompare.assert({ a : { b : { c : [1,2,3]}}},{ a : { b : { c : [1,2,99]}}});
			m3.test.Assert.fail("we should have blown up");
		} catch( e1 ) {
			console.log("we blewup as we should have");
			console.log(e1);
		}
	}
	,testArraySuccess: function() {
		var left = [1,2,3];
		var right = [1,2,3];
		m3.util.DeepCompare.assert(left,right);
	}
	,__class__: m3.test.DeepCompareTest
};
m3.test.MTest = function() { };
$hxClasses["m3.test.MTest"] = m3.test.MTest;
m3.test.MTest.__name__ = ["m3","test","MTest"];
m3.test.MTest.prototype = {
	fn1: function() {
		var input = [1,2,3,4];
		var expected = [10,20,30,40];
		var actual = Lambda.array(input.map(function(it) {
			return it * 10;
		}));
		m3.test.Assert.areEqual("" + Std.string(actual),"" + Std.string(expected));
		m3.test.Assert.areEqual(actual.length,expected.length);
		console.log("  actual = " + Std.string(actual));
		console.log("expected = " + Std.string(expected));
		var _g1 = 0;
		var _g = actual.length;
		while(_g1 < _g) {
			var i = _g1++;
			m3.test.Assert.areEqual(actual[i],expected[i]);
		}
	}
	,getXSimpleDefaults: function() {
		var x = null;
		m3.test.Assert.areEqual((function($this) {
			var $r;
			try {
				$r = 25;
			} catch( __e ) {
				$r = 10;
			}
			return $r;
		}(this)),25);
		m3.test.Assert.areEqual((function($this) {
			var $r;
			try {
				$r = x.length;
			} catch( __e1 ) {
				$r = 10;
			}
			return $r;
		}(this)),10);
	}
	,getXComplexDefault: function() {
		var a = new m3.test.A();
		var aa = a;
		a.setB(null);
		m3.test.Assert.areEqual((function($this) {
			var $r;
			try {
				$r = a;
			} catch( __e ) {
				$r = aa;
			}
			return $r;
		}(this)),aa);
	}
	,notNullXSimpleVarTest: function() {
		var x = null;
		m3.test.Assert.isFalse((function($this) {
			var $r;
			try {
				$r = (function($this) {
					var $r;
					x.length;
					$r = true;
					return $r;
				}($this));
			} catch( e ) {
				$r = false;
			}
			return $r;
		}(this)));
		m3.test.Assert.isFalse((function($this) {
			var $r;
			try {
				$r = x;
			} catch( __e ) {
				$r = null;
			}
			return $r;
		}(this)) != null);
		m3.test.Assert.isTrue((function($this) {
			var $r;
			try {
				$r = "hello world";
			} catch( __e1 ) {
				$r = null;
			}
			return $r;
		}(this)) != null);
	}
	,notNullXComplexObjectTest: function() {
		var a = new m3.test.A();
		a.setB(null);
		m3.test.Assert.isFalse((function($this) {
			var $r;
			try {
				$r = a.getB().getC().getStringValue();
			} catch( __e ) {
				$r = null;
			}
			return $r;
		}(this)) != null);
	}
	,__class__: m3.test.MTest
};
m3.test.A = function() {
	this.b = new m3.test.B();
};
$hxClasses["m3.test.A"] = m3.test.A;
m3.test.A.__name__ = ["m3","test","A"];
m3.test.A.prototype = {
	getB: function() {
		return this.b;
	}
	,setB: function(bb) {
		this.b = bb;
	}
	,__class__: m3.test.A
};
m3.test.B = function() {
	this.c = new m3.test.C();
};
$hxClasses["m3.test.B"] = m3.test.B;
m3.test.B.__name__ = ["m3","test","B"];
m3.test.B.prototype = {
	getC: function() {
		return this.c;
	}
	,setC: function(cc) {
		this.c = cc;
	}
	,__class__: m3.test.B
};
m3.test.C = function() {
	this.stringValue = "class C!";
};
$hxClasses["m3.test.C"] = m3.test.C;
m3.test.C.__name__ = ["m3","test","C"];
m3.test.C.prototype = {
	getStringValue: function() {
		return this.stringValue;
	}
	,__class__: m3.test.C
};
m3.test.OSetTest = function() { };
$hxClasses["m3.test.OSetTest"] = m3.test.OSetTest;
m3.test.OSetTest.__name__ = ["m3","test","OSetTest"];
m3.test.OSetTest.prototype = {
	addWithFilterTest: function() {
		var set = new m3.observable.ObservableSet(function(it) {
			return it;
		});
		var fs = set.filter(function(it1) {
			return it1.length > 4;
		});
		var setT = null;
		var setType = null;
		set.listen(function(t,type) {
			setT = t;
			setType = type;
		});
		var fsT = null;
		var fsType = null;
		fs.listen(function(t1,type1) {
			fsT = t1;
			fsType = type1;
		});
		set.add("a");
		m3.test.Assert.areEqual(setT,"a");
		m3.test.Assert.areEqual(setType,m3.observable.EventType.Add);
		m3.test.Assert.areEqual(fsT,null);
		m3.test.Assert.areEqual(fsType,null);
		set.add("bb");
		m3.test.Assert.areEqual(setT,"bb");
		m3.test.Assert.areEqual(setType,m3.observable.EventType.Add);
		m3.test.Assert.areEqual(fsT,null);
		m3.test.Assert.areEqual(fsType,null);
		set.add("ccc");
		m3.test.Assert.areEqual(setT,"ccc");
		m3.test.Assert.areEqual(setType,m3.observable.EventType.Add);
		m3.test.Assert.areEqual(fsT,null);
		m3.test.Assert.areEqual(fsType,null);
		set.add("ddddd");
		m3.test.Assert.areEqual(setT,"ddddd");
		m3.test.Assert.areEqual(setType,m3.observable.EventType.Add);
		m3.test.Assert.areEqual(fsT,"ddddd");
		m3.test.Assert.areEqual(fsType,m3.observable.EventType.Add);
	}
	,deleteTest: function() {
		var set = new m3.observable.ObservableSet(function(it) {
			return it;
		});
		var fs = set.filter(function(it1) {
			return it1.length > 4;
		});
		var setT = null;
		var setType = null;
		set.listen(function(t,type) {
			setT = t;
			setType = type;
		});
		var fsT = null;
		var fsType = null;
		fs.listen(function(t1,type1) {
			fsT = t1;
			fsType = type1;
		});
		set.add("ggggggg");
		m3.test.Assert.areEqual(setT,"ggggggg");
		m3.test.Assert.areEqual(setType,m3.observable.EventType.Add);
		m3.test.Assert.areEqual(fsT,"ggggggg");
		m3.test.Assert.areEqual(fsType,m3.observable.EventType.Add);
		set["delete"]("ggggggg");
		m3.test.Assert.areEqual(setT,"ggggggg");
		m3.test.Assert.areEqual(setType,m3.observable.EventType.Delete);
		m3.test.Assert.areEqual(fsT,"ggggggg");
		m3.test.Assert.areEqual(fsType,m3.observable.EventType.Delete);
	}
	,updateTest: function() {
		var set = new m3.observable.ObservableSet(function(it) {
			return it;
		});
		var fs = set.filter(function(it1) {
			return it1.length > 4;
		});
		var setT = null;
		var setType = null;
		set.listen(function(t,type) {
			setT = t;
			setType = type;
		});
		var fsT = null;
		var fsType = null;
		fs.listen(function(t1,type1) {
			fsT = t1;
			fsType = type1;
		});
		set.add("ffffff");
		m3.test.Assert.areEqual(setT,"ffffff");
		m3.test.Assert.areEqual(setType,m3.observable.EventType.Add);
		m3.test.Assert.areEqual(fsT,"ffffff");
		m3.test.Assert.areEqual(fsType,m3.observable.EventType.Add);
		set.update("ffffff");
		m3.test.Assert.areEqual(setT,"ffffff");
		m3.test.Assert.areEqual(setType,m3.observable.EventType.Update);
		m3.test.Assert.areEqual(fsT,"ffffff");
		m3.test.Assert.areEqual(fsType,m3.observable.EventType.Update);
	}
	,groupedSetTest: function() {
		var menuItems = new m3.observable.ObservableSet(function(it) {
			return it.uid;
		});
		var groupedItems = new m3.observable.GroupedSet(menuItems,function(it1) {
			return it1.category;
		});
		menuItems.add({ uid : "a", category : "coolness", description : "loads of coolness"});
		menuItems.add({ uid : "b", category : "coolness", description : "extra coolness"});
		m3.test.Assert.isTrue((function($this) {
			var $r;
			var this1 = groupedItems.delegate();
			$r = this1.exists("coolness");
			return $r;
		}(this)));
		menuItems.add({ uid : "c", category : "meganess", description : "when you need more -ness go mega"});
		m3.test.Assert.isTrue((function($this) {
			var $r;
			var this2 = groupedItems.delegate();
			$r = this2.exists("coolness");
			return $r;
		}(this)));
		m3.test.Assert.isTrue((function($this) {
			var $r;
			var this3 = groupedItems.delegate();
			$r = this3.exists("meganess");
			return $r;
		}(this)));
	}
	,sortSetTests: function() {
		var menuItems = new m3.observable.ObservableSet(function(it) {
			return it.uid;
		});
		var sortedItems = new m3.observable.SortedSet(menuItems,null);
		var a = { uid : "a", category : "coolness", description : "loads of coolness"};
		var b = { uid : "c", category : "meganess", description : "when you need more -ness go mega"};
		var c = { uid : "b", category : "coolness", description : "extra coolness"};
		menuItems.add(a);
		menuItems.add(c);
		menuItems.add(b);
		m3.util.DeepCompare.assert(Lambda.list(["a","b","c"]),Lambda.map(sortedItems,function(mi) {
			return mi.uid;
		}));
		menuItems["delete"](b);
		var d = { uid : "a", category : "ultra mega coolness", description : "say what!?! coolness"};
		menuItems.update(d);
		var newA;
		var this1 = sortedItems.delegate();
		newA = this1.get("a");
		m3.util.DeepCompare.assert(d,newA);
	}
	,testAddAndRemoveListeners: function() {
		var menuItems = new m3.observable.ObservableSet(function(it) {
			return it.uid;
		});
		var listener = function(m,event_type) {
		};
		menuItems.listen(listener);
		m3.test.Assert.areEqual(menuItems._eventManager.listenerCount(),1);
		menuItems.removeListener(listener);
		m3.test.Assert.areEqual(menuItems._eventManager.listenerCount(),0);
	}
	,__class__: m3.test.OSetTest
};
m3.test.Enum1 = $hxClasses["m3.test.Enum1"] = { __ename__ : ["m3","test","Enum1"], __constructs__ : ["ev1","ev2"] };
m3.test.Enum1.ev1 = ["ev1",0];
m3.test.Enum1.ev1.toString = $estr;
m3.test.Enum1.ev1.__enum__ = m3.test.Enum1;
m3.test.Enum1.ev2 = ["ev2",1];
m3.test.Enum1.ev2.toString = $estr;
m3.test.Enum1.ev2.__enum__ = m3.test.Enum1;
m3.test.Enum1.__empty_constructs__ = [m3.test.Enum1.ev1,m3.test.Enum1.ev2];
m3.test.Subclass = function() {
	this.f1 = 21;
};
$hxClasses["m3.test.Subclass"] = m3.test.Subclass;
m3.test.Subclass.__name__ = ["m3","test","Subclass"];
m3.test.Subclass.prototype = {
	__class__: m3.test.Subclass
};
m3.test.AbstractClass = function() {
};
$hxClasses["m3.test.AbstractClass"] = m3.test.AbstractClass;
m3.test.AbstractClass.__name__ = ["m3","test","AbstractClass"];
m3.test.AbstractClass.prototype = {
	__class__: m3.test.AbstractClass
};
m3.test.Concrete1 = function() {
	m3.test.AbstractClass.call(this);
};
$hxClasses["m3.test.Concrete1"] = m3.test.Concrete1;
m3.test.Concrete1.__name__ = ["m3","test","Concrete1"];
m3.test.Concrete1.__super__ = m3.test.AbstractClass;
m3.test.Concrete1.prototype = $extend(m3.test.AbstractClass.prototype,{
	__class__: m3.test.Concrete1
});
m3.test.Concrete2 = function() {
	m3.test.AbstractClass.call(this);
};
$hxClasses["m3.test.Concrete2"] = m3.test.Concrete2;
m3.test.Concrete2.__name__ = ["m3","test","Concrete2"];
m3.test.Concrete2.__super__ = m3.test.AbstractClass;
m3.test.Concrete2.prototype = $extend(m3.test.AbstractClass.prototype,{
	__class__: m3.test.Concrete2
});
m3.test.HasArrayOfDynamic = function() {
	this.arrayOfDynamic = new Array();
};
$hxClasses["m3.test.HasArrayOfDynamic"] = m3.test.HasArrayOfDynamic;
m3.test.HasArrayOfDynamic.__name__ = ["m3","test","HasArrayOfDynamic"];
m3.test.HasArrayOfDynamic.prototype = {
	__class__: m3.test.HasArrayOfDynamic
};
m3.test.HasFunction = function() {
};
$hxClasses["m3.test.HasFunction"] = m3.test.HasFunction;
m3.test.HasFunction.__name__ = ["m3","test","HasFunction"];
m3.test.HasFunction.prototype = {
	__class__: m3.test.HasFunction
};
m3.test.HasOptionalFunction = function() {
};
$hxClasses["m3.test.HasOptionalFunction"] = m3.test.HasOptionalFunction;
m3.test.HasOptionalFunction.__name__ = ["m3","test","HasOptionalFunction"];
m3.test.HasOptionalFunction.prototype = {
	__class__: m3.test.HasOptionalFunction
};
m3.test.AbstractClassHandler = function(serializer) {
	this._serializer = serializer;
};
$hxClasses["m3.test.AbstractClassHandler"] = m3.test.AbstractClassHandler;
m3.test.AbstractClassHandler.__name__ = ["m3","test","AbstractClassHandler"];
m3.test.AbstractClassHandler.__interfaces__ = [m3.serialization.TypeHandler];
m3.test.AbstractClassHandler.prototype = {
	read: function(fromJson,reader,instance) {
		var handler;
		if(Object.prototype.hasOwnProperty.call(fromJson,"name1")) handler = this._serializer.getHandlerViaClass(m3.test.Concrete1); else handler = this._serializer.getHandlerViaClass(m3.test.Concrete2);
		return handler.read(fromJson,reader,instance);
	}
	,write: function(value,writer) {
		var handler = this._serializer.getHandlerViaClass(Type.getClass(value));
		return handler.write(value,writer);
	}
	,__class__: m3.test.AbstractClassHandler
};
m3.test.HasAbstractClass = function() {
};
$hxClasses["m3.test.HasAbstractClass"] = m3.test.HasAbstractClass;
m3.test.HasAbstractClass.__name__ = ["m3","test","HasAbstractClass"];
m3.test.HasAbstractClass.prototype = {
	__class__: m3.test.HasAbstractClass
};
m3.test.SerializeMe = function() {
	this.subClass1 = new m3.test.Subclass();
	this.lotsOfStrings = new Array();
	this.lotsOfSubclasses = new Array();
	this.lotsOfSubclasses.push(new m3.test.Subclass());
};
$hxClasses["m3.test.SerializeMe"] = m3.test.SerializeMe;
m3.test.SerializeMe.__name__ = ["m3","test","SerializeMe"];
m3.test.SerializeMe.prototype = {
	__class__: m3.test.SerializeMe
};
m3.test.ArrayOfArrays = function() {
	m3.test.AbstractClass.call(this);
	this.theArrayOfArrays = new Array();
};
$hxClasses["m3.test.ArrayOfArrays"] = m3.test.ArrayOfArrays;
m3.test.ArrayOfArrays.__name__ = ["m3","test","ArrayOfArrays"];
m3.test.ArrayOfArrays.__super__ = m3.test.AbstractClass;
m3.test.ArrayOfArrays.prototype = $extend(m3.test.AbstractClass.prototype,{
	__class__: m3.test.ArrayOfArrays
});
m3.test.Dynamite = function() {
};
$hxClasses["m3.test.Dynamite"] = m3.test.Dynamite;
m3.test.Dynamite.__name__ = ["m3","test","Dynamite"];
m3.test.Dynamite.prototype = {
	__class__: m3.test.Dynamite
};
m3.test.HasTypeDef = function() {
};
$hxClasses["m3.test.HasTypeDef"] = m3.test.HasTypeDef;
m3.test.HasTypeDef.__name__ = ["m3","test","HasTypeDef"];
m3.test.HasTypeDef.prototype = {
	__class__: m3.test.HasTypeDef
};
m3.test.BaseClass = function() { };
$hxClasses["m3.test.BaseClass"] = m3.test.BaseClass;
m3.test.BaseClass.__name__ = ["m3","test","BaseClass"];
m3.test.BaseClass.prototype = {
	__class__: m3.test.BaseClass
};
m3.test.ConcreteClass = function() {
};
$hxClasses["m3.test.ConcreteClass"] = m3.test.ConcreteClass;
m3.test.ConcreteClass.__name__ = ["m3","test","ConcreteClass"];
m3.test.ConcreteClass.__super__ = m3.test.BaseClass;
m3.test.ConcreteClass.prototype = $extend(m3.test.BaseClass.prototype,{
	__class__: m3.test.ConcreteClass
});
m3.test.SerializationTest = function() {
};
$hxClasses["m3.test.SerializationTest"] = m3.test.SerializationTest;
m3.test.SerializationTest.__name__ = ["m3","test","SerializationTest"];
m3.test.SerializationTest.prototype = {
	arrayOfDynamicTest: function() {
		var serializer = new m3.serialization.Serializer();
		var json = JSON.parse("{ \"arrayOfDynamic\": [{\"name\": \"name\", \"name1\": \"name1\"}] }");
		var reader = serializer.fromJson(json,m3.test.HasArrayOfDynamic);
		m3.test.Assert.areEqual(reader.instance.arrayOfDynamic,json.arrayOfDynamic);
		var json1 = { arrayOfDynamic : { name : "name", name1 : "name1"}};
		try {
			var reader1 = serializer.fromJson(json1,m3.test.HasArrayOfDynamic);
			m3.test.Assert.fail("we should have blown up since we passed in an object and not an array");
		} catch( e ) {
			console.log("we blew up like we should have");
		}
	}
	,abstractTest: function() {
		var serializer = new m3.serialization.Serializer();
		serializer.addHandler(m3.test.AbstractClass,new m3.test.AbstractClassHandler(serializer));
		var json = { ac : { name : "name", name1 : "name1"}};
		var reader = serializer.fromJson(json,m3.test.HasAbstractClass);
		var str = JSON.stringify(serializer.toJson(reader.instance));
		var expected = "{\"ac\":{\"name\":\"name\",\"name1\":\"name1\"}}";
		m3.test.Assert.areEqual(str,expected);
		var json1 = { ac : { name : "name", name2 : "name2"}};
		var reader1 = serializer.fromJson(json1,m3.test.HasAbstractClass);
		var str1 = JSON.stringify(serializer.toJson(reader1.instance));
		var expected1 = "{\"ac\":{\"name\":\"name\",\"name2\":\"name2\"}}";
		m3.test.Assert.areEqual(str1,expected1);
	}
	,typeDefTest: function() {
		var serializer = new m3.serialization.Serializer();
		var json = { mtd : { a : "world", b : 32}};
		var reader = serializer.fromJson(json,m3.test.HasTypeDef);
		var str = JSON.stringify(serializer.toJson(reader.instance));
		var expected = "{\"mtd\":{\"a\":\"world\",\"b\":32}}";
		m3.test.Assert.areEqual(str,expected);
	}
	,dynamiteTest: function() {
		var serializer = new m3.serialization.Serializer();
		var json = { dynamite : { hello : "world"}};
		var reader = serializer.fromJson(json,m3.test.Dynamite);
		var str = JSON.stringify(serializer.toJson(reader.instance));
		var expected = "{\"dynamite\":{\"hello\":\"world\"}}";
		m3.test.Assert.areEqual(str,expected);
	}
	,simpleSerialization: function() {
		var serializer = new m3.serialization.Serializer();
		var json = { bool1 : true, int1 : 1, float1 : 1.2, string1 : "abc", subClass1 : { f1 : 1234}, enum1 : "ev1", lotsOfStrings : ["a","b","c"], lotsOfSubclasses : [{ f1 : 4567}], arrayInArrayInArrayOfStrings : [[["a","b","c"],["d","e","f"]]]};
		var reader = serializer.fromJson(json,m3.test.SerializeMe);
		var str = JSON.stringify(serializer.toJson(reader.instance));
		var expected = "{\"bool1\":true,\"int1\":1,\"float1\":1.2,\"string1\":\"abc\",\"subClass1\":{\"f1\":1234},\"enum1\":\"ev1\",\"lotsOfStrings\":[\"a\",\"b\",\"c\"],\"arrayInArrayInArrayOfStrings\":[[[\"a\",\"b\",\"c\"],[\"d\",\"e\",\"f\"]]],\"lotsOfSubclasses\":[{\"f1\":4567}]}";
		m3.test.Assert.areEqual(str,expected);
	}
	,liftLoneValueIntoSingleValueArray: function() {
		var serializer = new m3.serialization.Serializer();
		var json = { bool1 : true, int1 : 1, float1 : 1.2, string1 : "abc", subClass1 : { f1 : 1234}, enum1 : "ev1", lotsOfStrings : "single Value", lotsOfSubclasses : { f1 : 4567}, arrayInArrayInArrayOfStrings : [[["a","b","c"],["d","e","f"]]]};
		var reader = serializer.fromJson(json,m3.test.SerializeMe);
		var str = JSON.stringify(serializer.toJson(reader.instance));
		var expected = "{\"bool1\":true,\"int1\":1,\"float1\":1.2,\"string1\":\"abc\",\"subClass1\":{\"f1\":1234},\"enum1\":\"ev1\",\"lotsOfStrings\":[\"single Value\"],\"arrayInArrayInArrayOfStrings\":[[[\"a\",\"b\",\"c\"],[\"d\",\"e\",\"f\"]]],\"lotsOfSubclasses\":[{\"f1\":4567}]}";
		m3.test.Assert.areEqual(str,expected);
	}
	,extraFieldInJsonFailure: function() {
		var serializer = new m3.serialization.Serializer();
		var json = { bool1 : true, int1 : 1, float1 : 1.2, string1 : "abc", subClass1 : { f1 : 1234}, enum1 : "ev1", lotsOfStrings : ["a","b","c"], lotsOfSubclasses : [{ f1 : 4567, bigFatExtraUglyField : 123}], arrayInArrayInArrayOfStrings : [[["a","b","c"],["d","e","f"]]]};
		try {
			serializer.fromJson(json,m3.test.SerializeMe);
			m3.test.Assert.fail("we should have blown up with a field not found exception");
		} catch( e ) {
			if( js.Boot.__instanceof(e,m3.serialization.JsonException) ) {
				console.log("extraFieldInJsonFailure() we blew up like we should have -- " + Std.string(e.messageList()));
				m3.test.Assert.isTrue(true);
			} else throw(e);
		}
	}
	,fieldMissingFromJson: function() {
		var serializer = new m3.serialization.Serializer();
		var json = { int1 : 1, float1 : 1.2, string1 : "abc", subClass1 : { f1 : 1234}, enum1 : "ev1", lotsOfStrings : ["a","b","c"], lotsOfSubclasses : [{ f1 : 4567, bigFatExtraUglyField : 123}], arrayInArrayInArrayOfStrings : [[["a","b","c"],["d","e","f"]]]};
		try {
			serializer.fromJson(json,m3.test.SerializeMe);
			m3.test.Assert.fail("we should have blown up with a field not found exception");
		} catch( e ) {
			if( js.Boot.__instanceof(e,m3.serialization.JsonException) ) {
				console.log("fieldMissingFromJson() we blew up like we should have -- " + Std.string(e.messageList()));
				m3.test.Assert.isTrue(true);
			} else throw(e);
		}
	}
	,transientFieldsAreNotRequired: function() {
		var serializer = new m3.serialization.Serializer();
		var json = { bool1 : true, int1 : 1, float1 : 1.2, string1 : "abc", subClass1 : { f1 : 1234}, enum1 : "ev1", lotsOfStrings : ["a","b","c"], lotsOfSubclasses : [{ f1 : 4567, bigFatExtraUglyField : 123}], arrayInArrayInArrayOfStrings : [[["a","b","c"],["d","e","f"]]]};
		try {
			serializer.fromJson(json,m3.test.SerializeMe);
			m3.test.Assert.fail("we should have blown up with a field not found exception");
		} catch( e ) {
			if( js.Boot.__instanceof(e,m3.serialization.JsonException) ) {
				console.log("fieldMissingFromJson() we blew up like we should have -- " + Std.string(e.messageList()));
				m3.test.Assert.isTrue(true);
			} else throw(e);
		}
	}
	,serializingFunctionText: function() {
		var serializer = new m3.serialization.Serializer();
		var json0 = { fn : "asdf asdf saf as fsaf sadfsdafa"};
		try {
			serializer.fromJson(json0,m3.test.HasFunction);
			m3.test.Assert.fail("we should have blown up");
		} catch( e ) {
			if( js.Boot.__instanceof(e,m3.serialization.JsonException) ) {
				console.log("YAY we blew up like we should have");
			} else throw(e);
		}
		var json1 = { fn : "return arg;"};
		var hf = serializer.fromJson(json1,m3.test.HasFunction).instance;
		m3.test.Assert.isTrue(hf.fn != null);
		var json11 = { fn : null};
		try {
			serializer.fromJson(json11,m3.test.HasFunction);
			m3.test.Assert.fail("we should have blown up");
		} catch( e1 ) {
			if( js.Boot.__instanceof(e1,m3.serialization.JsonException) ) {
				console.log("YAY we blew up like we should have");
			} else throw(e1);
		}
		var json12 = { fn : ""};
		var hf1 = serializer.fromJson(json12,m3.test.HasOptionalFunction).instance;
		m3.test.Assert.isTrue(hf1.fn == null);
		var json13 = { fn : null};
		var hf2 = serializer.fromJson(json13,m3.test.HasOptionalFunction).instance;
		m3.test.Assert.isTrue(hf2.fn == null);
		var json14 = { fn : ""};
		var hf3 = serializer.fromJson(json14,m3.test.HasOptionalFunction).instance;
		m3.test.Assert.isTrue(hf3.fn == null);
	}
	,serializingBaseAndConcrete: function() {
		var serializer = new m3.serialization.Serializer();
		var cc0 = new m3.test.ConcreteClass();
		cc0.name = "nn";
		cc0.title = "tt";
		var json0 = serializer.toJson(cc0);
		var jsonStr0 = JSON.stringify(json0);
		var cc1 = serializer.fromJson(json0,m3.test.ConcreteClass).instance;
		var json1 = serializer.toJson(cc1);
		var jsonStr1 = JSON.stringify(json1);
		m3.test.Assert.areEqual(jsonStr0,jsonStr1);
	}
	,arrayOfArray: function() {
		var serializer = new m3.serialization.Serializer();
		var a0 = new m3.test.ArrayOfArrays();
		a0.theArrayOfArrays[0] = [0,1,2];
		var json0 = serializer.toJson(a0);
		var jsonStr0 = JSON.stringify(json0);
		var a1 = serializer.fromJson(json0,m3.test.ArrayOfArrays).instance;
		var json1 = serializer.toJson(a1);
		var jsonStr1 = JSON.stringify(json1);
		m3.test.Assert.areEqual(jsonStr0,jsonStr1);
	}
	,__class__: m3.test.SerializationTest
};
m3.test.StringHelperTest = function() { };
$hxClasses["m3.test.StringHelperTest"] = m3.test.StringHelperTest;
m3.test.StringHelperTest.__name__ = ["m3","test","StringHelperTest"];
m3.test.StringHelperTest.prototype = {
	padLeftTests: function() {
		var expected = "<<<<test";
		var actual = m3.helper.StringHelper.padLeft("test",8,"<");
		m3.test.Assert.areEqual(expected,actual);
		var expected1 = "----test";
		var actual1 = m3.helper.StringHelper.padLeft("test",8,"-");
		m3.test.Assert.areEqual(expected1,actual1);
		var expected2 = "----";
		var actual2 = m3.helper.StringHelper.padLeft(null,4,"-");
		m3.test.Assert.areEqual(expected2,actual2);
	}
	,padRightTests: function() {
		var expected = "test----";
		var actual = m3.helper.StringHelper.padRight("test",8,"-");
		m3.test.Assert.areEqual(expected,actual);
		var expected1 = "test";
		var actual1 = m3.helper.StringHelper.padRight("test",4,"<");
		m3.test.Assert.areEqual(expected1,actual1);
		var expected2 = "<<<<";
		var actual2 = m3.helper.StringHelper.padRight(null,4,"<");
		m3.test.Assert.areEqual(expected2,actual2);
	}
	,trimLeftTests: function() {
		var expected = "";
		var actual = m3.helper.StringHelper.trimLeft(null);
		m3.test.Assert.areEqual(expected,actual);
		var expected1 = "good to go!";
		var actual1 = m3.helper.StringHelper.trimLeft("\n\tgood to go!");
		m3.test.Assert.areEqual(expected1,actual1);
		var expected11 = "good to go!\n\t";
		var actual11 = m3.helper.StringHelper.trimLeft("\n\t\n\tgood to go!\n\t");
		m3.test.Assert.areEqual(expected11,actual11);
		var expected2 = "good to do!";
		var actual2 = m3.helper.StringHelper.trimLeft("good to do!",20);
		m3.test.Assert.areEqual(expected2,actual2);
		var expected3 = "d to go!";
		var actual3 = m3.helper.StringHelper.trimLeft("good to go!",2,"go");
		m3.test.Assert.areEqual(expected3,actual3);
		var expected4 = "good to go!";
		var actual4 = m3.helper.StringHelper.trimLeft("good to go!",null,"o");
		m3.test.Assert.areEqual(expected4,actual4);
		var expected5 = "dy is good!";
		var actual5 = m3.helper.StringHelper.trimLeft("body is good!",null,"bo");
		m3.test.Assert.areEqual(expected5,actual5);
	}
	,trimRightTests: function() {
		var expected = "";
		var actual = m3.helper.StringHelper.trimRight(null);
		m3.test.Assert.areEqual(expected,actual);
		var expected1 = "good to go!";
		var actual1 = m3.helper.StringHelper.trimRight("good to go!\n\t");
		m3.test.Assert.areEqual(expected1,actual1);
		var expected11 = "\n\t\n\tgood to go!";
		var actual11 = m3.helper.StringHelper.trimRight("\n\t\n\tgood to go!\n\t");
		m3.test.Assert.areEqual(expected11,actual11);
		var expected2 = "good to do!";
		var actual2 = m3.helper.StringHelper.trimRight("good to do!",20);
		m3.test.Assert.areEqual(expected2,actual2);
		var expected3 = "good to ";
		var actual3 = m3.helper.StringHelper.trimRight("good to go!",2,"go!");
		m3.test.Assert.areEqual(expected3,actual3);
		var expected4 = "good to go!";
		var actual4 = m3.helper.StringHelper.trimRight("good to go!",null,"o");
		m3.test.Assert.areEqual(expected4,actual4);
		var expected5 = "body is";
		var actual5 = m3.helper.StringHelper.trimRight("body is good!",null," good!");
		m3.test.Assert.areEqual(expected5,actual5);
	}
	,__class__: m3.test.StringHelperTest
};
m3.test.TestRunnerBase = function() {
	var _g = this;
	this._unitTestClasses = [];
	Lambda.iter(this.getM3TestClasses(),function(clazz) {
		try {
			_g._unitTestClasses.push(new m3.test.TestClass(clazz));
		} catch( e ) {
			m3.test.Logger.console.error("error creating TestClass for " + m3.serialization.TypeTools.classname(clazz));
			m3.test.Logger.console.error(e);
		}
	});
	Lambda.iter(this.getUnitTestClasses(),function(clazz1) {
		try {
			_g._unitTestClasses.push(new m3.test.TestClass(clazz1));
		} catch( e1 ) {
			m3.test.Logger.console.error("error creating TestClass for " + m3.serialization.TypeTools.classname(clazz1));
			m3.test.Logger.console.error(e1);
		}
	});
	this.logger = { };
};
$hxClasses["m3.test.TestRunnerBase"] = m3.test.TestRunnerBase;
m3.test.TestRunnerBase.__name__ = ["m3","test","TestRunnerBase"];
m3.test.TestRunnerBase.prototype = {
	getUnitTestClasses: function() {
		var tests = [];
		return tests;
	}
	,getM3TestClasses: function() {
		var tests = [m3.test.DeepCompareTest,m3.test.MTest,m3.test.OSetTest,m3.test.SerializationTest,m3.test.StringHelperTest,m3.test.UidGenTest];
		return tests;
	}
	,appendCell: function(html,row,attrs) {
		var cell = new $("<td></td>");
		cell.append(html);
		if(attrs != null) {
			var $it0 = attrs.keys();
			while( $it0.hasNext() ) {
				var key = $it0.next();
				cell.attr(key,attrs.get(key));
			}
		}
		row.append(cell);
	}
	,start: function() {
		var _g3 = this;
		var div = new $("#tests_go_here");
		var testTable = new $("<table id=\"tests_go_here_table\" cellspacing=\"5\" cellpadding=\"5\" ></table>");
		testTable.append(new $("<thead><tr></tr></thead>"));
		var tbody = new $("<tbody></tbody>");
		testTable.append(tbody);
		div.append(testTable);
		var _g1 = 0;
		var _g = this._unitTestClasses.length;
		while(_g1 < _g) {
			var i = _g1++;
			var tw = this._unitTestClasses[i];
			var titleRow = new $("<tr></tr>");
			this.appendCell("<h2>" + tw.getName() + "</h2>",titleRow,(function($this) {
				var $r;
				var _g2 = new haxe.ds.StringMap();
				_g2.set("colspan","5");
				_g2.set("align","left");
				$r = _g2;
				return $r;
			}(this)));
			tbody.append(titleRow);
			Lambda.iter(tw.getTests(),function(testMethod) {
				testMethod.resultsDiv = new $("<span>not run</span>");
				testMethod.logDiv = new $("<div style='width: 800px; border: 1px solid black; min-height: 50px; overflow: auto; max-height: 500px; display: none; margin: auto; text-align: left;'></div>");
				var toggler = new $("<span>Toggle Logs</span>");
				toggler.click(function(evt) {
					testMethod.logDiv.toggle();
				});
				var button = new $("<button>run</button>");
				button.click(function(evt1) {
					testMethod.runTest();
				});
				var row = new $("<tr></tr>");
				tbody.append(row);
				_g3.appendCell("<b>" + testMethod.name + "</b>",row);
				_g3.appendCell(button,row);
				_g3.appendCell(testMethod.resultsDiv,row);
				_g3.appendCell(toggler,row);
				_g3.appendCell(testMethod.logDiv,row);
			});
			var row1 = new $("<tr></tr>");
			this.appendCell("<hr/>",row1,(function($this) {
				var $r;
				var _g31 = new haxe.ds.StringMap();
				_g31.set("colspan","5");
				$r = _g31;
				return $r;
			}(this)));
			tbody.append(row1);
		}
		this.runTests();
		console.log("tests ran woot woot");
	}
	,runTests: function() {
		Lambda.iter(this._unitTestClasses,function(t) {
			t.runTests();
		});
	}
	,__class__: m3.test.TestRunnerBase
};
m3.test.TestStatus = function() { };
$hxClasses["m3.test.TestStatus"] = m3.test.TestStatus;
m3.test.TestStatus.__name__ = ["m3","test","TestStatus"];
m3.test.TestResults = function(status,messages) {
	this.status = status;
	this.messages = messages;
};
$hxClasses["m3.test.TestResults"] = m3.test.TestResults;
m3.test.TestResults.__name__ = ["m3","test","TestResults"];
m3.test.TestResults.prototype = {
	__class__: m3.test.TestResults
};
m3.test.TestMethod = function(tc,name) {
	this.testClass = tc;
	this.name = name;
};
$hxClasses["m3.test.TestMethod"] = m3.test.TestMethod;
m3.test.TestMethod.__name__ = ["m3","test","TestMethod"];
m3.test.TestMethod.prototype = {
	runTest: function() {
		var _g = this;
		var fn = function() {
			var testInstance = _g.testClass.setup();
			var results = _g.runTestImpl();
			_g.resultsDiv.text(results.status);
			_g.logDiv.empty();
			Lambda.iter(results.messages,function(msg) {
				_g.logDiv.append(msg).append("<br/>");
			});
		};
		haxe.Timer.delay(fn,0);
	}
	,runTestImpl: function() {
		var results = new m3.test.TestResults(m3.test.TestStatus.Running,new Array());
		try {
			results.messages.push("START -- " + Std.string(new Date()));
			var instance = this.testClass.setup();
			try {
				this.testClass.runMethod(instance,this.name);
				results.status = m3.test.TestStatus.Pass;
				results.messages.push("PASS");
			} catch( e ) {
				if( js.Boot.__instanceof(e,m3.test.Assert) ) {
					m3.test.Logger.exception(e);
					results.status = m3.test.TestStatus.Fail;
					results.messages.push("FAIL -- " + e.message);
					results.messages.push(e.stackTrace());
				} else throw(e);
			}
			this.testClass.teardown(instance);
		} catch( $e0 ) {
			if( js.Boot.__instanceof($e0,m3.exception.Exception) ) {
				var e1 = $e0;
				results.status = m3.test.TestStatus.Error;
				results.messages.push("ERROR -- " + e1.message);
				try {
					results.messages.push(e1.stackTrace());
				} catch( er ) {
					console.log("Couldn't push stacktrace");
				}
				results.error = e1;
				m3.test.Logger.console.error(e1);
			} else {
			var e2 = $e0;
			results.status = m3.test.TestStatus.Error;
			results.messages.push("ERROR -- " + Std.string(e2));
			results.messages.push("  " + Std.string(e2.stack));
			results.error = e2;
			m3.test.Logger.console.error(e2.stack);
			m3.test.Logger.exception(e2);
			}
		}
		return results;
	}
	,__class__: m3.test.TestMethod
};
m3.test.TestClass = function(clazz) {
	var _g = this;
	this._clazz = clazz;
	this._classname = m3.serialization.TypeTools.classname(this._clazz);
	this._setupMethods = [];
	this._teardownMethods = [];
	this._tests = [];
	var rtti = this._clazz.__rtti;
	if(rtti == null) {
		var msg = "no rtti found for " + this._classname;
		console.log(msg);
		throw new m3.exception.Exception(msg);
	}
	var x = Xml.parse(rtti).firstElement();
	var typeTree = new haxe.rtti.XmlParser().processElement(x);
	switch(typeTree[1]) {
	case 1:
		var c = typeTree[2];
		this._classDef = c;
		break;
	default:
		throw new m3.exception.Exception("expected a class got " + Std.string(typeTree));
	}
	var tests = [];
	var $it0 = this._classDef.fields.iterator();
	while( $it0.hasNext() ) {
		var f = $it0.next();
		var fieldXml = x.elementsNamed(f.name).next();
		if(fieldXml.get("set") == "method") {
			var $it1 = fieldXml.elementsNamed("meta");
			while( $it1.hasNext() ) {
				var meta = $it1.next();
				var $it2 = meta.elementsNamed("m");
				while( $it2.hasNext() ) {
					var m = $it2.next();
					var _g1 = m.get("n");
					switch(_g1) {
					case "setup":
						this._setupMethods.push(f.name);
						break;
					case "teardown":
						this._teardownMethods.push(f.name);
						break;
					case "test":
						tests.push(f.name);
						break;
					}
				}
			}
		}
	}
	this._tests = [];
	Lambda.iter(tests,function(t) {
		_g._tests.push(new m3.test.TestMethod(_g,t));
	});
};
$hxClasses["m3.test.TestClass"] = m3.test.TestClass;
m3.test.TestClass.__name__ = ["m3","test","TestClass"];
m3.test.TestClass.prototype = {
	getName: function() {
		return this._classname;
	}
	,getTests: function() {
		return this._tests;
	}
	,runTests: function() {
		Lambda.iter(this._tests,function(t) {
			t.runTest();
		});
	}
	,runMethods: function(obj,methods) {
		var _g = this;
		Lambda.iter(methods,function(m) {
			_g.runMethod(obj,m);
		});
	}
	,setup: function() {
		var testInstance = Type.createInstance(this._clazz,[]);
		this.runMethods(testInstance,this._setupMethods);
		return testInstance;
	}
	,teardown: function(testInstance) {
		this.runMethods(testInstance,this._teardownMethods);
	}
	,runMethod: function(obj,method) {
		Reflect.callMethod(obj,Reflect.field(obj,method),[]);
	}
	,__class__: m3.test.TestClass
};
m3.test.Logger = function() { };
$hxClasses["m3.test.Logger"] = m3.test.Logger;
m3.test.Logger.__name__ = ["m3","test","Logger"];
m3.test.Logger.exception = function(error) {
	m3.test.Logger.console.error(error);
};
m3.test.UidGenTest = function() { };
$hxClasses["m3.test.UidGenTest"] = m3.test.UidGenTest;
m3.test.UidGenTest.__name__ = ["m3","test","UidGenTest"];
m3.test.UidGenTest.prototype = {
	test: function() {
		var uid = m3.util.UidGenerator.create(24);
		m3.test.Assert.areEqual(uid.length,24);
	}
	,__class__: m3.test.UidGenTest
};
m3.util = {};
m3.util.TypeComparator = function() { };
$hxClasses["m3.util.TypeComparator"] = m3.util.TypeComparator;
m3.util.TypeComparator.__name__ = ["m3","util","TypeComparator"];
m3.util.TypeComparator.prototype = {
	__class__: m3.util.TypeComparator
};
m3.util.ArrayComparator = function() {
};
$hxClasses["m3.util.ArrayComparator"] = m3.util.ArrayComparator;
m3.util.ArrayComparator.__name__ = ["m3","util","ArrayComparator"];
m3.util.ArrayComparator.__interfaces__ = [m3.util.TypeComparator];
m3.util.ArrayComparator.prototype = {
	canCompare: function(vt) {
		return "Array" == m3.serialization.ValueTypeTools.getClassname(vt);
	}
	,equivalent: function(path,left,right) {
		var l = left;
		var r = right;
		if(l.length != r.length) throw new m3.exception.Exception("array length mismatch " + l.length + " != " + r.length);
		var _g1 = 0;
		var _g = l.length;
		while(_g1 < _g) {
			var i = [_g1++];
			path.arrayAccess(i[0],(function(i) {
				return function() {
					m3.util.DeepCompare.assertImpl(path,l[i[0]],r[i[0]]);
				};
			})(i));
		}
		return true;
	}
	,__class__: m3.util.ArrayComparator
};
m3.util.ClassComparator = function(clazz) {
	this.classname = m3.serialization.TypeTools.classname(clazz);
};
$hxClasses["m3.util.ClassComparator"] = m3.util.ClassComparator;
m3.util.ClassComparator.__name__ = ["m3","util","ClassComparator"];
m3.util.ClassComparator.__interfaces__ = [m3.util.TypeComparator];
m3.util.ClassComparator.prototype = {
	canCompare: function(vt) {
		return this.classname == m3.serialization.ValueTypeTools.getClassname(vt);
	}
	,equivalent: function(path,left,right) {
		return left == right;
	}
	,__class__: m3.util.ClassComparator
};
m3.util.BasicComparator = function(valueType) {
	this.valueType = valueType;
};
$hxClasses["m3.util.BasicComparator"] = m3.util.BasicComparator;
m3.util.BasicComparator.__name__ = ["m3","util","BasicComparator"];
m3.util.BasicComparator.__interfaces__ = [m3.util.TypeComparator];
m3.util.BasicComparator.prototype = {
	canCompare: function(vt) {
		return this.valueType == vt;
	}
	,equivalent: function(path,left,right) {
		return left == right;
	}
	,__class__: m3.util.BasicComparator
};
m3.util.ObjectComparator = function(valueTypeName) {
	this.valueTypeName = valueTypeName;
};
$hxClasses["m3.util.ObjectComparator"] = m3.util.ObjectComparator;
m3.util.ObjectComparator.__name__ = ["m3","util","ObjectComparator"];
m3.util.ObjectComparator.__interfaces__ = [m3.util.TypeComparator];
m3.util.ObjectComparator.compareFieldNames = function(left,right) {
	var sorter = function(l,r) {
		if(l == r) return 0; else if(l < r) return -1; else return 1;
	};
	left.sort(sorter);
	right.sort(sorter);
	if(left.length != right.length) throw new m3.exception.Exception("different field names -- " + Std.string(left) + " -- " + Std.string(right));
	m3.util.LambdaX.iteri(left,function(l1,i) {
		var r1 = right[i];
		if(l1 != r1) throw new m3.exception.Exception("different field names -- " + Std.string(left) + " -- " + Std.string(right));
	});
	return left;
};
m3.util.ObjectComparator.prototype = {
	canCompare: function(vt) {
		return m3.serialization.ValueTypeTools.getName(vt) == this.valueTypeName;
	}
	,equivalent: function(path,left,right) {
		var fields = m3.util.ObjectComparator.compareFieldNames(Reflect.fields(left),Reflect.fields(right));
		Lambda.iter(fields,function(field) {
			var l = Reflect.field(left,field);
			var r = Reflect.field(right,field);
			path.fieldAccess(field,function() {
				try {
					m3.util.DeepCompare.assertImpl(path,l,r);
				} catch( $e0 ) {
					if( js.Boot.__instanceof($e0,m3.util.CompareFailure) ) {
						var e = $e0;
						throw e;
					} else if( js.Boot.__instanceof($e0,m3.exception.Exception) ) {
						var e1 = $e0;
						throw new m3.util.CompareFailure(path,e1.message,e1);
					} else throw($e0);
				}
			});
		});
		return true;
	}
	,__class__: m3.util.ObjectComparator
};
m3.util.EnumComparator = function() {
};
$hxClasses["m3.util.EnumComparator"] = m3.util.EnumComparator;
m3.util.EnumComparator.__name__ = ["m3","util","EnumComparator"];
m3.util.EnumComparator.__interfaces__ = [m3.util.TypeComparator];
m3.util.EnumComparator.prototype = {
	canCompare: function(vt) {
		return m3.serialization.ValueTypeTools.getName(vt) == "TEnum";
	}
	,equivalent: function(path,left,right) {
		return Type.enumEq(left,right);
	}
	,__class__: m3.util.EnumComparator
};
m3.util.DeepCompare = function() { };
$hxClasses["m3.util.DeepCompare"] = m3.util.DeepCompare;
m3.util.DeepCompare.__name__ = ["m3","util","DeepCompare"];
m3.util.DeepCompare.assert = function(left,right) {
	m3.util.DeepCompare.assertImpl(new m3.util.VariablePath(),left,right);
};
m3.util.DeepCompare.assertImpl = function(path,left,right) {
	try {
		var leftType = Type["typeof"](left);
		var rightType = Type["typeof"](right);
		var lc = m3.serialization.ValueTypeTools.getClassname(leftType);
		var rc = m3.serialization.ValueTypeTools.getClassname(rightType);
		if(lc != rc) throw new m3.exception.Exception("types differ " + lc + " != " + rc);
		var comparator = m3.util.DeepCompare.findComparator(leftType);
		var equiv = comparator.equivalent(path,left,right);
		if(!equiv) throw new m3.exception.Exception("values differ " + Std.string(left) + " != " + Std.string(right));
	} catch( $e0 ) {
		if( js.Boot.__instanceof($e0,m3.util.CompareFailure) ) {
			var e = $e0;
			throw e;
		} else if( js.Boot.__instanceof($e0,m3.exception.Exception) ) {
			var e1 = $e0;
			throw new m3.util.CompareFailure(path,e1.message,e1);
		} else throw($e0);
	}
};
m3.util.DeepCompare.findComparator = function(type) {
	var _g1 = 0;
	var _g = m3.util.DeepCompare._typeComparators.length - 1;
	while(_g1 < _g) {
		var i = _g1++;
		if(m3.util.DeepCompare._typeComparators[i].canCompare(type)) return m3.util.DeepCompare._typeComparators[i];
	}
	throw new m3.exception.Exception("unable to find comparator for " + Std.string(type));
};
m3.util.VariablePath = function() {
	this._paths = ["root"];
};
$hxClasses["m3.util.VariablePath"] = m3.util.VariablePath;
m3.util.VariablePath.__name__ = ["m3","util","VariablePath"];
m3.util.VariablePath.prototype = {
	arrayAccess: function(index,fn) {
		return this.access("[" + index + "]",fn);
	}
	,fieldAccess: function(name,fn) {
		return this.access("." + name,fn);
	}
	,access: function(name,fn) {
		if(this._paths.length > 99) throw new m3.exception.Exception("stack blowup -- " + this.get());
		this._paths.push(name);
		try {
			var result = fn();
			this._paths.pop();
			return result;
		} catch( e ) {
			this._paths.pop();
			throw e;
		}
	}
	,get: function() {
		return this._paths.join("");
	}
	,clone: function() {
		var c = new m3.util.VariablePath();
		Lambda.iter(this._paths,function(i) {
			c._paths.push(i);
		});
		return c;
	}
	,__class__: m3.util.VariablePath
};
m3.util.CompareFailure = function(path,message,cause) {
	m3.exception.Exception.call(this,path.get() + " -- " + message,cause);
	this.path = path.clone();
};
$hxClasses["m3.util.CompareFailure"] = m3.util.CompareFailure;
m3.util.CompareFailure.__name__ = ["m3","util","CompareFailure"];
m3.util.CompareFailure.__super__ = m3.exception.Exception;
m3.util.CompareFailure.prototype = $extend(m3.exception.Exception.prototype,{
	__class__: m3.util.CompareFailure
});
m3.util.LambdaX = function() { };
$hxClasses["m3.util.LambdaX"] = m3.util.LambdaX;
m3.util.LambdaX.__name__ = ["m3","util","LambdaX"];
m3.util.LambdaX.iteri = function(it,f) {
	var i = 0;
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		f(x,i);
		i += 1;
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
var qoid = {};
qoid.test = {};
qoid.test.QoidApiTest = function() {
};
$hxClasses["qoid.test.QoidApiTest"] = qoid.test.QoidApiTest;
qoid.test.QoidApiTest.__name__ = ["qoid","test","QoidApiTest"];
qoid.test.QoidApiTest.prototype = {
	setup: function() {
	}
	,teardown: function() {
	}
	,example1: function() {
		m3.test.Assert.areEqual("a","a");
	}
	,__class__: qoid.test.QoidApiTest
};
qoid.test.TestRunner = function() {
	m3.test.TestRunnerBase.call(this);
};
$hxClasses["qoid.test.TestRunner"] = qoid.test.TestRunner;
qoid.test.TestRunner.__name__ = ["qoid","test","TestRunner"];
qoid.test.TestRunner.main = function() {
	new $("document").ready(function(event) {
		new qoid.test.TestRunner().start();
	});
};
qoid.test.TestRunner.__super__ = m3.test.TestRunnerBase;
qoid.test.TestRunner.prototype = $extend(m3.test.TestRunnerBase.prototype,{
	getUnitTestClasses: function() {
		var tests = m3.test.TestRunnerBase.prototype.getUnitTestClasses.call(this);
		tests.push(new qoid.test.QoidApiTest());
		return tests;
	}
	,__class__: qoid.test.TestRunner
});
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
m3.test.DeepCompareTest.__meta__ = { fields : { testInts : { test : null}, testStrings : { test : null}, testFailure : { test : null}, testArrayFailure : { test : null}, testDeepCompareFailureMessage : { test : null}, testArraySuccess : { test : null}}};
m3.test.DeepCompareTest.__rtti = "<class path=\"m3.test.DeepCompareTest\" params=\"\">\n\t<testInts set=\"method\" line=\"11\">\n\t\t<f a=\"\"><x path=\"Void\"/></f>\n\t\t<meta><m n=\"test\"/></meta>\n\t</testInts>\n\t<testStrings set=\"method\" line=\"16\">\n\t\t<f a=\"\"><x path=\"Void\"/></f>\n\t\t<meta><m n=\"test\"/></meta>\n\t</testStrings>\n\t<testFailure set=\"method\" line=\"21\">\n\t\t<f a=\"\"><x path=\"Void\"/></f>\n\t\t<meta><m n=\"test\"/></meta>\n\t</testFailure>\n\t<testArrayFailure set=\"method\" line=\"43\">\n\t\t<f a=\"\"><x path=\"Void\"/></f>\n\t\t<meta><m n=\"test\"/></meta>\n\t</testArrayFailure>\n\t<testDeepCompareFailureMessage set=\"method\" line=\"57\">\n\t\t<f a=\"\"><x path=\"Void\"/></f>\n\t\t<meta><m n=\"test\"/></meta>\n\t</testDeepCompareFailureMessage>\n\t<testArraySuccess set=\"method\" line=\"83\">\n\t\t<f a=\"\"><x path=\"Void\"/></f>\n\t\t<meta><m n=\"test\"/></meta>\n\t</testArraySuccess>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
m3.test.MTest.__meta__ = { fields : { fn1 : { test : null}, getXSimpleDefaults : { test : null}, getXComplexDefault : { test : null}, notNullXSimpleVarTest : { test : null}, notNullXComplexObjectTest : { test : null}}};
m3.test.MTest.__rtti = "<class path=\"m3.test.MTest\" params=\"\">\n\t<fn1 set=\"method\" line=\"11\">\n\t\t<f a=\"\"><x path=\"Void\"/></f>\n\t\t<meta><m n=\"test\"/></meta>\n\t</fn1>\n\t<getXSimpleDefaults set=\"method\" line=\"32\">\n\t\t<f a=\"\"><x path=\"Void\"/></f>\n\t\t<meta><m n=\"test\"/></meta>\n\t</getXSimpleDefaults>\n\t<getXComplexDefault set=\"method\" line=\"42\">\n\t\t<f a=\"\"><x path=\"Void\"/></f>\n\t\t<meta><m n=\"test\"/></meta>\n\t</getXComplexDefault>\n\t<notNullXSimpleVarTest set=\"method\" line=\"52\">\n\t\t<f a=\"\"><x path=\"Void\"/></f>\n\t\t<meta><m n=\"test\"/></meta>\n\t</notNullXSimpleVarTest>\n\t<notNullXComplexObjectTest set=\"method\" line=\"63\">\n\t\t<f a=\"\"><x path=\"Void\"/></f>\n\t\t<meta><m n=\"test\"/></meta>\n\t</notNullXComplexObjectTest>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
m3.test.OSetTest.__meta__ = { fields : { addWithFilterTest : { test : null}, deleteTest : { test : null}, updateTest : { test : null}, groupedSetTest : { test : null}, sortSetTests : { test : null}, testAddAndRemoveListeners : { test : null}}};
m3.test.OSetTest.__rtti = "<class path=\"m3.test.OSetTest\" params=\"\">\n\t<addWithFilterTest set=\"method\" line=\"13\">\n\t\t<f a=\"\"><x path=\"Void\"/></f>\n\t\t<meta><m n=\"test\"/></meta>\n\t</addWithFilterTest>\n\t<deleteTest set=\"method\" line=\"61\">\n\t\t<f a=\"\"><x path=\"Void\"/></f>\n\t\t<meta><m n=\"test\"/></meta>\n\t</deleteTest>\n\t<updateTest set=\"method\" line=\"96\">\n\t\t<f a=\"\"><x path=\"Void\"/></f>\n\t\t<meta><m n=\"test\"/></meta>\n\t</updateTest>\n\t<groupedSetTest set=\"method\" line=\"133\">\n\t\t<f a=\"\"><x path=\"Void\"/></f>\n\t\t<meta><m n=\"test\"/></meta>\n\t</groupedSetTest>\n\t<sortSetTests set=\"method\" line=\"164\">\n\t\t<f a=\"\"><x path=\"Void\"/></f>\n\t\t<meta><m n=\"test\"/></meta>\n\t</sortSetTests>\n\t<testAddAndRemoveListeners set=\"method\" line=\"216\">\n\t\t<f a=\"\"><x path=\"Void\"/></f>\n\t\t<meta><m n=\"test\"/></meta>\n\t</testAddAndRemoveListeners>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
m3.test.Subclass.__rtti = "<class path=\"m3.test.Subclass\" params=\"\" module=\"m3.test.SerializationTest\">\n\t<f1 public=\"1\" line=\"20\"><x path=\"Int\"/></f1>\n\t<new public=\"1\" set=\"method\" line=\"21\"><f a=\"\"><x path=\"Void\"/></f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
m3.test.AbstractClass.__rtti = "<class path=\"m3.test.AbstractClass\" params=\"\" module=\"m3.test.SerializationTest\">\n\t<name public=\"1\"><c path=\"String\"/></name>\n\t<new public=\"1\" set=\"method\" line=\"26\"><f a=\"\"><x path=\"Void\"/></f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
m3.test.Concrete1.__rtti = "<class path=\"m3.test.Concrete1\" params=\"\" module=\"m3.test.SerializationTest\">\n\t<extends path=\"m3.test.AbstractClass\"/>\n\t<name1 public=\"1\"><c path=\"String\"/></name1>\n\t<new public=\"1\" set=\"method\" line=\"31\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
m3.test.Concrete2.__rtti = "<class path=\"m3.test.Concrete2\" params=\"\" module=\"m3.test.SerializationTest\">\n\t<extends path=\"m3.test.AbstractClass\"/>\n\t<name2 public=\"1\"><c path=\"String\"/></name2>\n\t<new public=\"1\" set=\"method\" line=\"38\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
m3.test.HasArrayOfDynamic.__rtti = "<class path=\"m3.test.HasArrayOfDynamic\" params=\"\" module=\"m3.test.SerializationTest\">\n\t<arrayOfDynamic public=\"1\"><c path=\"Array\"><d/></c></arrayOfDynamic>\n\t<new public=\"1\" set=\"method\" line=\"45\"><f a=\"\"><x path=\"Void\"/></f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
m3.test.HasFunction.__rtti = "<class path=\"m3.test.HasFunction\" params=\"\" module=\"m3.test.SerializationTest\">\n\t<fn public=\"1\"><f a=\"\">\n\t<d/>\n\t<c path=\"String\"/>\n</f></fn>\n\t<new public=\"1\" set=\"method\" line=\"52\"><f a=\"\"><x path=\"Void\"/></f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
m3.test.HasOptionalFunction.__rtti = "<class path=\"m3.test.HasOptionalFunction\" params=\"\" module=\"m3.test.SerializationTest\">\n\t<fn public=\"1\">\n\t\t<f a=\"\">\n\t\t\t<d/>\n\t\t\t<c path=\"String\"/>\n\t\t</f>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</fn>\n\t<new public=\"1\" set=\"method\" line=\"58\"><f a=\"\"><x path=\"Void\"/></f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
m3.test.HasAbstractClass.__rtti = "<class path=\"m3.test.HasAbstractClass\" params=\"\" module=\"m3.test.SerializationTest\">\n\t<ac><c path=\"m3.test.AbstractClass\"/></ac>\n\t<new public=\"1\" set=\"method\" line=\"89\"><f a=\"\"><x path=\"Void\"/></f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
m3.test.SerializeMe.__rtti = "<class path=\"m3.test.SerializeMe\" params=\"\" module=\"m3.test.SerializationTest\">\n\t<aTransientField public=\"1\">\n\t\t<c path=\"String\"/>\n\t\t<meta><m n=\":transient\"/></meta>\n\t</aTransientField>\n\t<anOptionalField public=\"1\">\n\t\t<c path=\"String\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</anOptionalField>\n\t<bool1 public=\"1\"><x path=\"Bool\"/></bool1>\n\t<int1 public=\"1\"><x path=\"Int\"/></int1>\n\t<float1 public=\"1\"><x path=\"Float\"/></float1>\n\t<string1 public=\"1\"><c path=\"String\"/></string1>\n\t<subClass1 public=\"1\"><c path=\"m3.test.Subclass\"/></subClass1>\n\t<enum1 public=\"1\"><e path=\"m3.test.Enum1\"/></enum1>\n\t<lotsOfStrings public=\"1\"><c path=\"Array\"><c path=\"String\"/></c></lotsOfStrings>\n\t<arrayInArrayInArrayOfStrings public=\"1\"><c path=\"Array\"><c path=\"Array\"><c path=\"Array\"><c path=\"String\"/></c></c></c></arrayInArrayInArrayOfStrings>\n\t<lotsOfSubclasses public=\"1\"><c path=\"Array\"><c path=\"m3.test.Subclass\"/></c></lotsOfSubclasses>\n\t<new public=\"1\" set=\"method\" line=\"107\"><f a=\"\"><x path=\"Void\"/></f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
m3.test.ArrayOfArrays.__rtti = "<class path=\"m3.test.ArrayOfArrays\" params=\"\" module=\"m3.test.SerializationTest\">\n\t<extends path=\"m3.test.AbstractClass\"/>\n\t<theArrayOfArrays public=\"1\"><c path=\"Array\"><c path=\"Array\"><x path=\"Int\"/></c></c></theArrayOfArrays>\n\t<new public=\"1\" set=\"method\" line=\"118\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
m3.test.Dynamite.__rtti = "<class path=\"m3.test.Dynamite\" params=\"\" module=\"m3.test.SerializationTest\">\n\t<dynamite public=\"1\"><d/></dynamite>\n\t<new public=\"1\" set=\"method\" line=\"126\"><f a=\"\"><x path=\"Void\"/></f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
m3.test.HasTypeDef.__rtti = "<class path=\"m3.test.HasTypeDef\" params=\"\" module=\"m3.test.SerializationTest\">\n\t<mtd public=\"1\"><t path=\"m3.test.MyTypeDef\"/></mtd>\n\t<new public=\"1\" set=\"method\" line=\"136\"><f a=\"\"><x path=\"Void\"/></f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
m3.test.BaseClass.__rtti = "<class path=\"m3.test.BaseClass\" params=\"\" module=\"m3.test.SerializationTest\">\n\t<name public=\"1\"><c path=\"String\"/></name>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
m3.test.ConcreteClass.__rtti = "<class path=\"m3.test.ConcreteClass\" params=\"\" module=\"m3.test.SerializationTest\">\n\t<extends path=\"m3.test.BaseClass\"/>\n\t<title public=\"1\"><c path=\"String\"/></title>\n\t<new public=\"1\" set=\"method\" line=\"146\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
m3.test.SerializationTest.__meta__ = { fields : { arrayOfDynamicTest : { test : null}, abstractTest : { test : null}, typeDefTest : { test : null}, dynamiteTest : { test : null}, simpleSerialization : { test : null}, liftLoneValueIntoSingleValueArray : { test : null}, extraFieldInJsonFailure : { test : null}, fieldMissingFromJson : { test : null}, transientFieldsAreNotRequired : { test : null}, serializingFunctionText : { test : null}, serializingBaseAndConcrete : { test : null}, arrayOfArray : { test : null}}};
m3.test.SerializationTest.__rtti = "<class path=\"m3.test.SerializationTest\" params=\"\">\n\t<arrayOfDynamicTest set=\"method\" line=\"154\">\n\t\t<f a=\"\"><x path=\"Void\"/></f>\n\t\t<meta><m n=\"test\"/></meta>\n\t</arrayOfDynamicTest>\n\t<abstractTest public=\"1\" set=\"method\" line=\"179\">\n\t\t<f a=\"\"><x path=\"Void\"/></f>\n\t\t<meta><m n=\"test\"/></meta>\n\t</abstractTest>\n\t<typeDefTest public=\"1\" set=\"method\" line=\"209\">\n\t\t<f a=\"\"><x path=\"Void\"/></f>\n\t\t<meta><m n=\"test\"/></meta>\n\t</typeDefTest>\n\t<dynamiteTest public=\"1\" set=\"method\" line=\"224\">\n\t\t<f a=\"\"><x path=\"Void\"/></f>\n\t\t<meta><m n=\"test\"/></meta>\n\t</dynamiteTest>\n\t<simpleSerialization public=\"1\" set=\"method\" line=\"239\">\n\t\t<f a=\"\"><x path=\"Void\"/></f>\n\t\t<meta><m n=\"test\"/></meta>\n\t</simpleSerialization>\n\t<liftLoneValueIntoSingleValueArray public=\"1\" set=\"method\" line=\"261\">\n\t\t<f a=\"\"><x path=\"Void\"/></f>\n\t\t<meta><m n=\"test\"/></meta>\n\t</liftLoneValueIntoSingleValueArray>\n\t<extraFieldInJsonFailure public=\"1\" set=\"method\" line=\"284\">\n\t\t<f a=\"\"><x path=\"Void\"/></f>\n\t\t<meta><m n=\"test\"/></meta>\n\t</extraFieldInJsonFailure>\n\t<fieldMissingFromJson public=\"1\" set=\"method\" line=\"307\">\n\t\t<f a=\"\"><x path=\"Void\"/></f>\n\t\t<meta><m n=\"test\"/></meta>\n\t</fieldMissingFromJson>\n\t<transientFieldsAreNotRequired public=\"1\" set=\"method\" line=\"330\">\n\t\t<f a=\"\"><x path=\"Void\"/></f>\n\t\t<meta><m n=\"test\"/></meta>\n\t</transientFieldsAreNotRequired>\n\t<serializingFunctionText public=\"1\" set=\"method\" line=\"354\">\n\t\t<f a=\"\"><x path=\"Void\"/></f>\n\t\t<meta><m n=\"test\"/></meta>\n\t</serializingFunctionText>\n\t<serializingBaseAndConcrete public=\"1\" set=\"method\" line=\"410\">\n\t\t<f a=\"\"><x path=\"Void\"/></f>\n\t\t<meta><m n=\"test\"/></meta>\n\t</serializingBaseAndConcrete>\n\t<arrayOfArray public=\"1\" set=\"method\" line=\"433\">\n\t\t<f a=\"\"><x path=\"Void\"/></f>\n\t\t<meta><m n=\"test\"/></meta>\n\t</arrayOfArray>\n\t<new set=\"method\" line=\"151\"><f a=\"\"><x path=\"Void\"/></f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
m3.test.StringHelperTest.__meta__ = { fields : { padLeftTests : { test : null}, padRightTests : { test : null}, trimLeftTests : { test : null}, trimRightTests : { test : null}}};
m3.test.StringHelperTest.__rtti = "<class path=\"m3.test.StringHelperTest\" params=\"\">\n\t<padLeftTests set=\"method\" line=\"9\">\n\t\t<f a=\"\"><x path=\"Void\"/></f>\n\t\t<meta><m n=\"test\"/></meta>\n\t</padLeftTests>\n\t<padRightTests set=\"method\" line=\"24\">\n\t\t<f a=\"\"><x path=\"Void\"/></f>\n\t\t<meta><m n=\"test\"/></meta>\n\t</padRightTests>\n\t<trimLeftTests set=\"method\" line=\"39\">\n\t\t<f a=\"\"><x path=\"Void\"/></f>\n\t\t<meta><m n=\"test\"/></meta>\n\t</trimLeftTests>\n\t<trimRightTests set=\"method\" line=\"70\">\n\t\t<f a=\"\"><x path=\"Void\"/></f>\n\t\t<meta><m n=\"test\"/></meta>\n\t</trimRightTests>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
m3.test.TestStatus.Running = "Running";
m3.test.TestStatus.Pass = "Pass";
m3.test.TestStatus.Fail = "Fail";
m3.test.TestStatus.Error = "Error";
m3.test.Logger.console = window.console;
m3.test.UidGenTest.__meta__ = { fields : { test : { test : null}}};
m3.test.UidGenTest.__rtti = "<class path=\"m3.test.UidGenTest\" params=\"\">\n\t<test set=\"method\" line=\"8\">\n\t\t<f a=\"\"><x path=\"Void\"/></f>\n\t\t<meta><m n=\"test\"/></meta>\n\t</test>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
m3.util.DeepCompare._typeComparators = [new m3.util.ArrayComparator(),new m3.util.ClassComparator(String),new m3.util.BasicComparator(ValueType.TBool),new m3.util.ObjectComparator("TClass"),new m3.util.EnumComparator(),new m3.util.BasicComparator(ValueType.TFloat),new m3.util.BasicComparator(ValueType.TFunction),new m3.util.BasicComparator(ValueType.TInt),new m3.util.BasicComparator(ValueType.TNull),new m3.util.ObjectComparator("TObject"),new m3.util.ObjectComparator("TUnknown")];
qoid.test.QoidApiTest.__meta__ = { fields : { setup : { setup : null}, teardown : { teardown : null}, example1 : { test : null}}};
qoid.test.QoidApiTest.__rtti = "<class path=\"qoid.test.QoidApiTest\" params=\"\">\n\t<setup set=\"method\" line=\"11\">\n\t\t<f a=\"\"><x path=\"Void\"/></f>\n\t\t<meta><m n=\"setup\"/></meta>\n\t</setup>\n\t<teardown set=\"method\" line=\"15\">\n\t\t<f a=\"\"><x path=\"Void\"/></f>\n\t\t<meta><m n=\"teardown\"/></meta>\n\t</teardown>\n\t<example1 set=\"method\" line=\"19\">\n\t\t<f a=\"\"><x path=\"Void\"/></f>\n\t\t<meta><m n=\"test\"/></meta>\n\t</example1>\n\t<new public=\"1\" set=\"method\" line=\"8\"><f a=\"\"><x path=\"Void\"/></f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
qoid.test.TestRunner.main();
})(typeof window != "undefined" ? window : exports);

//# sourceMappingURL=runner.js.map