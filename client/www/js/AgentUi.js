(function () { "use strict";
var $hxClasses = {},$estr = function() { return js.Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function inherit() {}; inherit.prototype = from; var proto = new inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var DateTools = function() { }
$hxClasses["DateTools"] = DateTools;
DateTools.__name__ = ["DateTools"];
DateTools.__format_get = function(d,e) {
	return (function($this) {
		var $r;
		switch(e) {
		case "%":
			$r = "%";
			break;
		case "C":
			$r = StringTools.lpad(Std.string(d.getFullYear() / 100 | 0),"0",2);
			break;
		case "d":
			$r = StringTools.lpad(Std.string(d.getDate()),"0",2);
			break;
		case "D":
			$r = DateTools.__format(d,"%m/%d/%y");
			break;
		case "e":
			$r = Std.string(d.getDate());
			break;
		case "H":case "k":
			$r = StringTools.lpad(Std.string(d.getHours()),e == "H"?"0":" ",2);
			break;
		case "I":case "l":
			$r = (function($this) {
				var $r;
				var hour = d.getHours() % 12;
				$r = StringTools.lpad(Std.string(hour == 0?12:hour),e == "I"?"0":" ",2);
				return $r;
			}($this));
			break;
		case "m":
			$r = StringTools.lpad(Std.string(d.getMonth() + 1),"0",2);
			break;
		case "M":
			$r = StringTools.lpad(Std.string(d.getMinutes()),"0",2);
			break;
		case "n":
			$r = "\n";
			break;
		case "p":
			$r = d.getHours() > 11?"PM":"AM";
			break;
		case "r":
			$r = DateTools.__format(d,"%I:%M:%S %p");
			break;
		case "R":
			$r = DateTools.__format(d,"%H:%M");
			break;
		case "s":
			$r = Std.string(d.getTime() / 1000 | 0);
			break;
		case "S":
			$r = StringTools.lpad(Std.string(d.getSeconds()),"0",2);
			break;
		case "t":
			$r = "\t";
			break;
		case "T":
			$r = DateTools.__format(d,"%H:%M:%S");
			break;
		case "u":
			$r = (function($this) {
				var $r;
				var t = d.getDay();
				$r = t == 0?"7":Std.string(t);
				return $r;
			}($this));
			break;
		case "w":
			$r = Std.string(d.getDay());
			break;
		case "y":
			$r = StringTools.lpad(Std.string(d.getFullYear() % 100),"0",2);
			break;
		case "Y":
			$r = Std.string(d.getFullYear());
			break;
		default:
			$r = (function($this) {
				var $r;
				throw "Date.format %" + e + "- not implemented yet.";
				return $r;
			}($this));
		}
		return $r;
	}(this));
}
DateTools.__format = function(d,f) {
	var r = new StringBuf();
	var p = 0;
	while(true) {
		var np = f.indexOf("%",p);
		if(np < 0) break;
		r.addSub(f,p,np - p);
		r.b += Std.string(DateTools.__format_get(d,HxOverrides.substr(f,np + 1,1)));
		p = np + 2;
	}
	r.addSub(f,p,f.length - p);
	return r.b;
}
DateTools.format = function(d,f) {
	return DateTools.__format(d,f);
}
DateTools.delta = function(d,t) {
	return (function($this) {
		var $r;
		var d1 = new Date();
		d1.setTime(d.getTime() + t);
		$r = d1;
		return $r;
	}(this));
}
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
$hxClasses["EReg"] = EReg;
EReg.__name__ = ["EReg"];
EReg.prototype = {
	replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,split: function(s) {
		var d = "#__delim__#";
		return s.replace(this.r,d).split(d);
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
	,__class__: EReg
}
var HxOverrides = function() { }
$hxClasses["HxOverrides"] = HxOverrides;
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
var Lambda = function() { }
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
}
Lambda.iter = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		f(x);
	}
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
var List = function() {
	this.length = 0;
};
$hxClasses["List"] = List;
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
	,toString: function() {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		s.b += "{";
		while(l != null) {
			if(first) first = false; else s.b += ", ";
			s.b += Std.string(Std.string(l[0]));
			l = l[1];
		}
		s.b += "}";
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
	,isEmpty: function() {
		return this.h == null;
	}
	,last: function() {
		return this.q == null?null:this.q[0];
	}
	,first: function() {
		return this.h == null?null:this.h[0];
	}
	,add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,__class__: List
}
var IMap = function() { }
$hxClasses["IMap"] = IMap;
IMap.__name__ = ["IMap"];
var Reflect = function() { }
$hxClasses["Reflect"] = Reflect;
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
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) a.push(f);
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
Reflect.isEnumValue = function(v) {
	return v != null && v.__enum__ != null;
}
var Std = function() { }
$hxClasses["Std"] = Std;
Std.__name__ = ["Std"];
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
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
	return x <= 0?0:Math.floor(Math.random() * x);
}
var StringBuf = function() {
	this.b = "";
};
$hxClasses["StringBuf"] = StringBuf;
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	addSub: function(s,pos,len) {
		this.b += len == null?HxOverrides.substr(s,pos,null):HxOverrides.substr(s,pos,len);
	}
	,__class__: StringBuf
}
var StringTools = function() { }
$hxClasses["StringTools"] = StringTools;
StringTools.__name__ = ["StringTools"];
StringTools.urlEncode = function(s) {
	return encodeURIComponent(s);
}
StringTools.urlDecode = function(s) {
	return decodeURIComponent(s.split("+").join(" "));
}
StringTools.htmlEscape = function(s,quotes) {
	s = s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
	return quotes?s.split("\"").join("&quot;").split("'").join("&#039;"):s;
}
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	return slen >= elen && HxOverrides.substr(s,slen - elen,elen) == end;
}
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c > 8 && c < 14 || c == 32;
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
StringTools.lpad = function(s,c,l) {
	if(c.length <= 0) return s;
	while(s.length < l) s = c + s;
	return s;
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
var Type = function() { }
$hxClasses["Type"] = Type;
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null;
	return o.__class__;
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
var XmlType = $hxClasses["XmlType"] = { __ename__ : ["XmlType"], __constructs__ : [] }
var Xml = function() {
};
$hxClasses["Xml"] = Xml;
Xml.__name__ = ["Xml"];
Xml.parse = function(str) {
	return haxe.xml.Parser.parse(str);
}
Xml.createElement = function(name) {
	var r = new Xml();
	r.nodeType = Xml.Element;
	r._children = new Array();
	r._attributes = new haxe.ds.StringMap();
	r.set_nodeName(name);
	return r;
}
Xml.createPCData = function(data) {
	var r = new Xml();
	r.nodeType = Xml.PCData;
	r.set_nodeValue(data);
	return r;
}
Xml.createCData = function(data) {
	var r = new Xml();
	r.nodeType = Xml.CData;
	r.set_nodeValue(data);
	return r;
}
Xml.createComment = function(data) {
	var r = new Xml();
	r.nodeType = Xml.Comment;
	r.set_nodeValue(data);
	return r;
}
Xml.createDocType = function(data) {
	var r = new Xml();
	r.nodeType = Xml.DocType;
	r.set_nodeValue(data);
	return r;
}
Xml.createProcessingInstruction = function(data) {
	var r = new Xml();
	r.nodeType = Xml.ProcessingInstruction;
	r.set_nodeValue(data);
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
				s.b += Std.string(k);
				s.b += "=\"";
				s.b += Std.string(this._attributes.get(k));
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
			s.b += Std.string(x.toString());
		}
		if(this.nodeType == Xml.Element) {
			s.b += "</";
			s.b += Std.string(this._nodeName);
			s.b += ">";
		}
		return s.b;
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
	,exists: function(att) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._attributes.exists(att);
	}
	,set: function(att,value) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		this._attributes.set(att,value);
	}
	,get: function(att) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._attributes.get(att);
	}
	,set_nodeValue: function(v) {
		if(this.nodeType == Xml.Element || this.nodeType == Xml.Document) throw "bad nodeType";
		return this._nodeValue = v;
	}
	,get_nodeValue: function() {
		if(this.nodeType == Xml.Element || this.nodeType == Xml.Document) throw "bad nodeType";
		return this._nodeValue;
	}
	,set_nodeName: function(n) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._nodeName = n;
	}
	,get_nodeName: function() {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._nodeName;
	}
	,__class__: Xml
}
var haxe = {}
haxe.StackItem = $hxClasses["haxe.StackItem"] = { __ename__ : ["haxe","StackItem"], __constructs__ : ["CFunction","Module","FilePos","Method","Lambda"] }
haxe.StackItem.CFunction = ["CFunction",0];
haxe.StackItem.CFunction.toString = $estr;
haxe.StackItem.CFunction.__enum__ = haxe.StackItem;
haxe.StackItem.Module = function(m) { var $x = ["Module",1,m]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.FilePos = function(s,file,line) { var $x = ["FilePos",2,s,file,line]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.Method = function(classname,method) { var $x = ["Method",3,classname,method]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.Lambda = function(v) { var $x = ["Lambda",4,v]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.CallStack = function() { }
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
}
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
}
haxe.Json = function() {
};
$hxClasses["haxe.Json"] = haxe.Json;
haxe.Json.__name__ = ["haxe","Json"];
haxe.Json.stringify = function(value,replacer) {
	return new haxe.Json().toString(value,replacer);
}
haxe.Json.prototype = {
	quote: function(s) {
		this.buf.b += "\"";
		var i = 0;
		while(true) {
			var c = s.charCodeAt(i++);
			if(c != c) break;
			switch(c) {
			case 34:
				this.buf.b += "\\\"";
				break;
			case 92:
				this.buf.b += "\\\\";
				break;
			case 10:
				this.buf.b += "\\n";
				break;
			case 13:
				this.buf.b += "\\r";
				break;
			case 9:
				this.buf.b += "\\t";
				break;
			case 8:
				this.buf.b += "\\b";
				break;
			case 12:
				this.buf.b += "\\f";
				break;
			default:
				this.buf.b += String.fromCharCode(c);
			}
		}
		this.buf.b += "\"";
	}
	,toStringRec: function(k,v) {
		if(this.replacer != null) v = this.replacer(k,v);
		var _g = Type["typeof"](v);
		var $e = (_g);
		switch( $e[1] ) {
		case 8:
			this.buf.b += "\"???\"";
			break;
		case 4:
			this.objString(v);
			break;
		case 1:
			var v1 = v;
			this.buf.b += Std.string(v1);
			break;
		case 2:
			this.buf.b += Std.string(Math.isFinite(v)?v:"null");
			break;
		case 5:
			this.buf.b += "\"<fun>\"";
			break;
		case 6:
			var c = $e[2];
			if(c == String) this.quote(v); else if(c == Array) {
				var v1 = v;
				this.buf.b += "[";
				var len = v1.length;
				if(len > 0) {
					this.toStringRec(0,v1[0]);
					var i = 1;
					while(i < len) {
						this.buf.b += ",";
						this.toStringRec(i,v1[i++]);
					}
				}
				this.buf.b += "]";
			} else if(c == haxe.ds.StringMap) {
				var v1 = v;
				var o = { };
				var $it0 = v1.keys();
				while( $it0.hasNext() ) {
					var k1 = $it0.next();
					o[k1] = v1.get(k1);
				}
				this.objString(o);
			} else this.objString(v);
			break;
		case 7:
			var i = Type.enumIndex(v);
			var v1 = i;
			this.buf.b += Std.string(v1);
			break;
		case 3:
			var v1 = v;
			this.buf.b += Std.string(v1);
			break;
		case 0:
			this.buf.b += "null";
			break;
		}
	}
	,objString: function(v) {
		this.fieldsString(v,Reflect.fields(v));
	}
	,fieldsString: function(v,fields) {
		var first = true;
		this.buf.b += "{";
		var _g = 0;
		while(_g < fields.length) {
			var f = fields[_g];
			++_g;
			var value = Reflect.field(v,f);
			if(Reflect.isFunction(value)) continue;
			if(first) first = false; else this.buf.b += ",";
			this.quote(f);
			this.buf.b += ":";
			this.toStringRec(f,value);
		}
		this.buf.b += "}";
	}
	,toString: function(v,replacer) {
		this.buf = new StringBuf();
		this.replacer = replacer;
		this.toStringRec("",v);
		return this.buf.b;
	}
	,__class__: haxe.Json
}
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
}
haxe.Timer.prototype = {
	run: function() {
		console.log("run");
	}
	,stop: function() {
		if(this.id == null) return;
		clearInterval(this.id);
		this.id = null;
	}
	,__class__: haxe.Timer
}
haxe.ds = {}
haxe.ds.BalancedTree = function() {
};
$hxClasses["haxe.ds.BalancedTree"] = haxe.ds.BalancedTree;
haxe.ds.BalancedTree.__name__ = ["haxe","ds","BalancedTree"];
haxe.ds.BalancedTree.prototype = {
	compare: function(k1,k2) {
		return Reflect.compare(k1,k2);
	}
	,balance: function(l,k,v,r) {
		var hl = l == null?0:l._height;
		var hr = r == null?0:r._height;
		return hl > hr + 2?(function($this) {
			var $r;
			var _this = l.left;
			$r = _this == null?0:_this._height;
			return $r;
		}(this)) >= (function($this) {
			var $r;
			var _this = l.right;
			$r = _this == null?0:_this._height;
			return $r;
		}(this))?new haxe.ds.TreeNode(l.left,l.key,l.value,new haxe.ds.TreeNode(l.right,k,v,r)):new haxe.ds.TreeNode(new haxe.ds.TreeNode(l.left,l.key,l.value,l.right.left),l.right.key,l.right.value,new haxe.ds.TreeNode(l.right.right,k,v,r)):hr > hl + 2?(function($this) {
			var $r;
			var _this = r.right;
			$r = _this == null?0:_this._height;
			return $r;
		}(this)) > (function($this) {
			var $r;
			var _this = r.left;
			$r = _this == null?0:_this._height;
			return $r;
		}(this))?new haxe.ds.TreeNode(new haxe.ds.TreeNode(l,k,v,r.left),r.key,r.value,r.right):new haxe.ds.TreeNode(new haxe.ds.TreeNode(l,k,v,r.left.left),r.left.key,r.left.value,new haxe.ds.TreeNode(r.left.right,r.key,r.value,r.right)):new haxe.ds.TreeNode(l,k,v,r,(hl > hr?hl:hr) + 1);
	}
	,setLoop: function(k,v,node) {
		if(node == null) return new haxe.ds.TreeNode(null,k,v,null);
		var c = this.compare(k,node.key);
		return c == 0?new haxe.ds.TreeNode(node.left,k,v,node.right,node == null?0:node._height):c < 0?(function($this) {
			var $r;
			var nl = $this.setLoop(k,v,node.left);
			$r = $this.balance(nl,node.key,node.value,node.right);
			return $r;
		}(this)):(function($this) {
			var $r;
			var nr = $this.setLoop(k,v,node.right);
			$r = $this.balance(node.left,node.key,node.value,nr);
			return $r;
		}(this));
	}
	,get: function(k) {
		var node = this.root;
		while(node != null) {
			var c = this.compare(k,node.key);
			if(c == 0) return node.value;
			if(c < 0) node = node.left; else node = node.right;
		}
		return null;
	}
	,set: function(k,v) {
		this.root = this.setLoop(k,v,this.root);
	}
	,__class__: haxe.ds.BalancedTree
}
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
		var _this = $this.right;
		$r = _this == null?0:_this._height;
		return $r;
	}(this))?(function($this) {
		var $r;
		var _this = $this.left;
		$r = _this == null?0:_this._height;
		return $r;
	}(this)):(function($this) {
		var $r;
		var _this = $this.right;
		$r = _this == null?0:_this._height;
		return $r;
	}(this))) + 1; else this._height = h;
};
$hxClasses["haxe.ds.TreeNode"] = haxe.ds.TreeNode;
haxe.ds.TreeNode.__name__ = ["haxe","ds","TreeNode"];
haxe.ds.TreeNode.prototype = {
	__class__: haxe.ds.TreeNode
}
haxe.ds.EnumValueMap = function() {
	haxe.ds.BalancedTree.call(this);
};
$hxClasses["haxe.ds.EnumValueMap"] = haxe.ds.EnumValueMap;
haxe.ds.EnumValueMap.__name__ = ["haxe","ds","EnumValueMap"];
haxe.ds.EnumValueMap.__interfaces__ = [IMap];
haxe.ds.EnumValueMap.__super__ = haxe.ds.BalancedTree;
haxe.ds.EnumValueMap.prototype = $extend(haxe.ds.BalancedTree.prototype,{
	compareArgs: function(a1,a2) {
		var ld = a1.length - a2.length;
		if(ld != 0) return ld;
		var _g1 = 0, _g = a1.length;
		while(_g1 < _g) {
			var i = _g1++;
			var v1 = a1[i], v2 = a2[i];
			var d = Reflect.isEnumValue(v1) && Reflect.isEnumValue(v2)?this.compare(v1,v2):Reflect.compare(v1,v2);
			if(d != 0) return d;
		}
		return 0;
	}
	,compare: function(k1,k2) {
		var d = k1[1] - k2[1];
		if(d != 0) return d;
		var p1 = k1.slice(2);
		var p2 = k2.slice(2);
		if(p1.length == 0 && p2.length == 0) return 0;
		return this.compareArgs(p1,p2);
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
	toString: function() {
		var s = new StringBuf();
		s.b += "{";
		var it = this.keys();
		while( it.hasNext() ) {
			var i = it.next();
			s.b += Std.string(i);
			s.b += " => ";
			s.b += Std.string(Std.string(this.get(i)));
			if(it.hasNext()) s.b += ", ";
		}
		s.b += "}";
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
	,__class__: haxe.ds.StringMap
}
haxe.macro = {}
haxe.macro.Constant = $hxClasses["haxe.macro.Constant"] = { __ename__ : ["haxe","macro","Constant"], __constructs__ : ["CInt","CFloat","CString","CIdent","CRegexp"] }
haxe.macro.Constant.CInt = function(v) { var $x = ["CInt",0,v]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; }
haxe.macro.Constant.CFloat = function(f) { var $x = ["CFloat",1,f]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; }
haxe.macro.Constant.CString = function(s) { var $x = ["CString",2,s]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; }
haxe.macro.Constant.CIdent = function(s) { var $x = ["CIdent",3,s]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; }
haxe.macro.Constant.CRegexp = function(r,opt) { var $x = ["CRegexp",4,r,opt]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; }
haxe.macro.Binop = $hxClasses["haxe.macro.Binop"] = { __ename__ : ["haxe","macro","Binop"], __constructs__ : ["OpAdd","OpMult","OpDiv","OpSub","OpAssign","OpEq","OpNotEq","OpGt","OpGte","OpLt","OpLte","OpAnd","OpOr","OpXor","OpBoolAnd","OpBoolOr","OpShl","OpShr","OpUShr","OpMod","OpAssignOp","OpInterval","OpArrow"] }
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
haxe.macro.Binop.OpArrow = ["OpArrow",22];
haxe.macro.Binop.OpArrow.toString = $estr;
haxe.macro.Binop.OpArrow.__enum__ = haxe.macro.Binop;
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
haxe.macro.ExprDef = $hxClasses["haxe.macro.ExprDef"] = { __ename__ : ["haxe","macro","ExprDef"], __constructs__ : ["EConst","EArray","EBinop","EField","EParenthesis","EObjectDecl","EArrayDecl","ECall","ENew","EUnop","EVars","EFunction","EBlock","EFor","EIn","EIf","EWhile","ESwitch","ETry","EReturn","EBreak","EContinue","EUntyped","EThrow","ECast","EDisplay","EDisplayNew","ETernary","ECheckType","EMeta"] }
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
haxe.macro.ExprDef.EMeta = function(s,e) { var $x = ["EMeta",29,s,e]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
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
haxe.rtti = {}
haxe.rtti.CType = $hxClasses["haxe.rtti.CType"] = { __ename__ : ["haxe","rtti","CType"], __constructs__ : ["CUnknown","CEnum","CClass","CTypedef","CFunction","CAnonymous","CDynamic","CAbstract"] }
haxe.rtti.CType.CUnknown = ["CUnknown",0];
haxe.rtti.CType.CUnknown.toString = $estr;
haxe.rtti.CType.CUnknown.__enum__ = haxe.rtti.CType;
haxe.rtti.CType.CEnum = function(name,params) { var $x = ["CEnum",1,name,params]; $x.__enum__ = haxe.rtti.CType; $x.toString = $estr; return $x; }
haxe.rtti.CType.CClass = function(name,params) { var $x = ["CClass",2,name,params]; $x.__enum__ = haxe.rtti.CType; $x.toString = $estr; return $x; }
haxe.rtti.CType.CTypedef = function(name,params) { var $x = ["CTypedef",3,name,params]; $x.__enum__ = haxe.rtti.CType; $x.toString = $estr; return $x; }
haxe.rtti.CType.CFunction = function(args,ret) { var $x = ["CFunction",4,args,ret]; $x.__enum__ = haxe.rtti.CType; $x.toString = $estr; return $x; }
haxe.rtti.CType.CAnonymous = function(fields) { var $x = ["CAnonymous",5,fields]; $x.__enum__ = haxe.rtti.CType; $x.toString = $estr; return $x; }
haxe.rtti.CType.CDynamic = function(t) { var $x = ["CDynamic",6,t]; $x.__enum__ = haxe.rtti.CType; $x.toString = $estr; return $x; }
haxe.rtti.CType.CAbstract = function(name,params) { var $x = ["CAbstract",7,name,params]; $x.__enum__ = haxe.rtti.CType; $x.toString = $estr; return $x; }
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
haxe.rtti.TypeTree = $hxClasses["haxe.rtti.TypeTree"] = { __ename__ : ["haxe","rtti","TypeTree"], __constructs__ : ["TPackage","TClassdecl","TEnumdecl","TTypedecl","TAbstractdecl"] }
haxe.rtti.TypeTree.TPackage = function(name,full,subs) { var $x = ["TPackage",0,name,full,subs]; $x.__enum__ = haxe.rtti.TypeTree; $x.toString = $estr; return $x; }
haxe.rtti.TypeTree.TClassdecl = function(c) { var $x = ["TClassdecl",1,c]; $x.__enum__ = haxe.rtti.TypeTree; $x.toString = $estr; return $x; }
haxe.rtti.TypeTree.TEnumdecl = function(e) { var $x = ["TEnumdecl",2,e]; $x.__enum__ = haxe.rtti.TypeTree; $x.toString = $estr; return $x; }
haxe.rtti.TypeTree.TTypedecl = function(t) { var $x = ["TTypedecl",3,t]; $x.__enum__ = haxe.rtti.TypeTree; $x.toString = $estr; return $x; }
haxe.rtti.TypeTree.TAbstractdecl = function(a) { var $x = ["TAbstractdecl",4,a]; $x.__enum__ = haxe.rtti.TypeTree; $x.toString = $estr; return $x; }
haxe.rtti.XmlParser = function() {
	this.root = new Array();
};
$hxClasses["haxe.rtti.XmlParser"] = haxe.rtti.XmlParser;
haxe.rtti.XmlParser.__name__ = ["haxe","rtti","XmlParser"];
haxe.rtti.XmlParser.prototype = {
	defplat: function() {
		var l = new List();
		if(this.curplatform != null) l.add(this.curplatform);
		return l;
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
	,xtype: function(x) {
		return (function($this) {
			var $r;
			var _g = x.get_name();
			$r = (function($this) {
				var $r;
				switch(_g) {
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
				case "x":
					$r = haxe.rtti.CType.CAbstract($this.mkPath(x.att.resolve("path")),$this.xtypeparams(x));
					break;
				case "f":
					$r = (function($this) {
						var $r;
						var args = new List();
						var aname = x.att.resolve("a").split(":");
						var eargs = HxOverrides.iter(aname);
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
						var $it1 = x.get_elements();
						while( $it1.hasNext() ) {
							var f = $it1.next();
							var f1 = $this.xclassfield(f,true);
							f1.platforms = new List();
							fields.add(f1);
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
			}($this));
			return $r;
		}(this));
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
	,xabstract: function(x) {
		var doc = null;
		var meta = [], subs = [], supers = [];
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
					subs.push(this.xtype(t));
				}
				break;
			case "from":
				var $it2 = c.get_elements();
				while( $it2.hasNext() ) {
					var t = $it2.next();
					supers.push(this.xtype(t));
				}
				break;
			default:
				this.xerror(c);
			}
		}
		return { file : x.has.resolve("file")?x.att.resolve("file"):null, path : this.mkPath(x.att.resolve("path")), module : x.has.resolve("module")?this.mkPath(x.att.resolve("module")):null, doc : doc, isPrivate : x.x.exists("private"), params : this.mkTypeParams(x.att.resolve("params")), platforms : this.defplat(), meta : meta, subs : subs, supers : supers};
	}
	,xenumfield: function(x) {
		var args = null;
		var xdoc = x.x.elementsNamed("haxe_doc").next();
		var meta = x.hasNode.resolve("meta")?this.xmeta(x.node.resolve("meta")):[];
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
	,xclassfield: function(x,defPublic) {
		var e = x.get_elements();
		var t = this.xtype(e.next());
		var doc = null;
		var meta = [];
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
			default:
				this.xerror(c);
			}
		}
		return { name : x.get_name(), type : t, isPublic : x.x.exists("public") || defPublic, isOverride : x.x.exists("override"), line : x.has.resolve("line")?Std.parseInt(x.att.resolve("line")):null, doc : doc, get : x.has.resolve("get")?this.mkRights(x.att.resolve("get")):haxe.rtti.Rights.RNormal, set : x.has.resolve("set")?this.mkRights(x.att.resolve("set")):haxe.rtti.Rights.RNormal, params : x.has.resolve("params")?this.mkTypeParams(x.att.resolve("params")):null, platforms : this.defplat(), meta : meta};
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
	,processElement: function(x) {
		var c = new haxe.xml.Fast(x);
		return (function($this) {
			var $r;
			var _g = c.get_name();
			$r = (function($this) {
				var $r;
				switch(_g) {
				case "class":
					$r = haxe.rtti.TypeTree.TClassdecl($this.xclass(c));
					break;
				case "enum":
					$r = haxe.rtti.TypeTree.TEnumdecl($this.xenum(c));
					break;
				case "typedef":
					$r = haxe.rtti.TypeTree.TTypedecl($this.xtypedef(c));
					break;
				case "abstract":
					$r = haxe.rtti.TypeTree.TAbstractdecl($this.xabstract(c));
					break;
				default:
					$r = $this.xerror(c);
				}
				return $r;
			}($this));
			return $r;
		}(this));
	}
	,xerror: function(c) {
		return (function($this) {
			var $r;
			throw "Invalid " + c.get_name();
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
	,__class__: haxe.rtti.XmlParser
}
haxe.xml = {}
haxe.xml._Fast = {}
haxe.xml._Fast.NodeAccess = function(x) {
	this.__x = x;
};
$hxClasses["haxe.xml._Fast.NodeAccess"] = haxe.xml._Fast.NodeAccess;
haxe.xml._Fast.NodeAccess.__name__ = ["haxe","xml","_Fast","NodeAccess"];
haxe.xml._Fast.NodeAccess.prototype = {
	resolve: function(name) {
		var x = this.__x.elementsNamed(name).next();
		if(x == null) {
			var xname = this.__x.nodeType == Xml.Document?"Document":this.__x.get_nodeName();
			throw xname + " is missing element " + name;
		}
		return new haxe.xml.Fast(x);
	}
	,__class__: haxe.xml._Fast.NodeAccess
}
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
}
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
}
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
}
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
}
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
	get_elements: function() {
		var it = this.x.elements();
		return { hasNext : $bind(it,it.hasNext), next : function() {
			var x = it.next();
			if(x == null) return null;
			return new haxe.xml.Fast(x);
		}};
	}
	,get_innerHTML: function() {
		var s = new StringBuf();
		var $it0 = this.x.iterator();
		while( $it0.hasNext() ) {
			var x = $it0.next();
			s.b += Std.string(x.toString());
		}
		return s.b;
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
	,get_name: function() {
		return this.x.nodeType == Xml.Document?"Document":this.x.get_nodeName();
	}
	,__class__: haxe.xml.Fast
}
haxe.xml.Parser = function() { }
$hxClasses["haxe.xml.Parser"] = haxe.xml.Parser;
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
					var i = s.charCodeAt(1) == 120?Std.parseInt("0" + HxOverrides.substr(s,1,s.length - 1)):Std.parseInt(HxOverrides.substr(s,1,s.length - 1));
					buf.b += Std.string(String.fromCharCode(i));
				} else if(!haxe.xml.Parser.escapes.exists(s)) buf.b += Std.string("&" + s + ";"); else buf.b += Std.string(haxe.xml.Parser.escapes.get(s));
				start = p + 1;
				state = next;
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
		if(p != start || nsubs == 0) parent.addChild(Xml.createPCData(buf.b + HxOverrides.substr(str,start,p - start)));
		return p;
	}
	throw "Unexpected end";
}
var js = {}
js.Boot = function() { }
$hxClasses["js.Boot"] = js.Boot;
js.Boot.__name__ = ["js","Boot"];
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
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) {
					if(cl == Array) return o.__enum__ == null;
					return true;
				}
				if(js.Boot.__interfLoop(o.__class__,cl)) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
}
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
}
js.Browser = function() { }
$hxClasses["js.Browser"] = js.Browser;
js.Browser.__name__ = ["js","Browser"];
js.Cookie = function() { }
$hxClasses["js.Cookie"] = js.Cookie;
js.Cookie.__name__ = ["js","Cookie"];
js.Cookie.set = function(name,value,expireDelay,path,domain) {
	var s = name + "=" + StringTools.urlEncode(value);
	if(expireDelay != null) {
		var d = DateTools.delta(new Date(),expireDelay * 1000);
		s += ";expires=" + d.toGMTString();
	}
	if(path != null) s += ";path=" + path;
	if(domain != null) s += ";domain=" + domain;
	js.Browser.document.cookie = s;
}
js.Cookie.all = function() {
	var h = new haxe.ds.StringMap();
	var a = js.Browser.document.cookie.split(";");
	var _g = 0;
	while(_g < a.length) {
		var e = a[_g];
		++_g;
		e = StringTools.ltrim(e);
		var t = e.split("=");
		if(t.length < 2) continue;
		h.set(t[0],StringTools.urlDecode(t[1]));
	}
	return h;
}
js.Cookie.get = function(name) {
	return js.Cookie.all().get(name);
}
js.Lib = function() { }
$hxClasses["js.Lib"] = js.Lib;
js.Lib.__name__ = ["js","Lib"];
js.Lib.alert = function(v) {
	alert(js.Boot.__string_rec(v,""));
}
js.d3 = {}
js.d3._D3 = {}
js.d3._D3.InitPriority = function() { }
$hxClasses["js.d3._D3.InitPriority"] = js.d3._D3.InitPriority;
js.d3._D3.InitPriority.__name__ = ["js","d3","_D3","InitPriority"];
var m3 = {}
m3.CrossMojo = function() { }
$hxClasses["m3.CrossMojo"] = m3.CrossMojo;
m3.CrossMojo.__name__ = ["m3","CrossMojo"];
m3.CrossMojo.jq = function(selector,arg2) {
	var v;
	if(arg2 == null) v = $(selector); else v = $(selector, arg2);
	return v;
}
m3.CrossMojo.windowConsole = function() {
	return window.console;
}
m3.CrossMojo.confirm = function() {
	return confirm;
}
m3.CrossMojo.pushState = function(data,title,url) {
	History.pushState(data, title, url);
}
m3.CrossMojo.prettyPrintString = function(json) {
	return JSON.stringify(JSON.parse(json), undefined, 2);
}
m3.CrossMojo.prettyPrint = function(json) {
	return JSON.stringify(json, undefined, 2);
}
m3.exception = {}
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
	messageList: function() {
		return this.chain().map(function(e) {
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
	,__class__: m3.exception.Exception
}
m3.exception.AjaxException = function(message,cause) {
	m3.exception.Exception.call(this,message,cause);
};
$hxClasses["m3.exception.AjaxException"] = m3.exception.AjaxException;
m3.exception.AjaxException.__name__ = ["m3","exception","AjaxException"];
m3.exception.AjaxException.__super__ = m3.exception.Exception;
m3.exception.AjaxException.prototype = $extend(m3.exception.Exception.prototype,{
	__class__: m3.exception.AjaxException
});
m3.helper = {}
m3.helper.ArrayHelper = function() { }
$hxClasses["m3.helper.ArrayHelper"] = m3.helper.ArrayHelper;
$hxExpose(m3.helper.ArrayHelper, "m3.helper.ArrayHelper");
m3.helper.ArrayHelper.__name__ = ["m3","helper","ArrayHelper"];
m3.helper.ArrayHelper.indexOf = function(array,t) {
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
m3.helper.ArrayHelper.indexOfComplex = function(array,value,propOrFcn,startingIndex) {
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
m3.helper.ArrayHelper.indexOfComplexInSubArray = function(array,value,subArrayProp,startingIndex) {
	if(startingIndex == null) startingIndex = 0;
	if(array == null) return -1;
	var result = -1;
	var _g1 = startingIndex, _g = array.length;
	while(_g1 < _g) {
		var idx_ = _g1++;
		var subArray = Reflect.field(array[idx_],subArrayProp);
		if(m3.helper.ArrayHelper.contains(subArray,value)) {
			result = idx_;
			break;
		}
	}
	return result;
}
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
				var _g1 = 1, _g = comparison.length;
				while(_g1 < _g) {
					var c_ = _g1++;
					var comparisonValue;
					if(js.Boot.__instanceof(comparison[c_].propOrFcn,String)) comparisonValue = Reflect.field(candidate,comparison[c_].propOrFcn); else comparisonValue = comparison[c_].propOrFcn(candidate);
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
}
m3.helper.ArrayHelper.getElementComplex = function(array,value,propOrFcn,startingIndex) {
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
m3.helper.ArrayHelper.getElementComplexInSubArray = function(array,value,subArrayProp,startingIndex) {
	if(startingIndex == null) startingIndex = 0;
	if(array == null) return null;
	var result = null;
	var _g1 = startingIndex, _g = array.length;
	while(_g1 < _g) {
		var idx_ = _g1++;
		var subArray = Reflect.field(array[idx_],subArrayProp);
		if(m3.helper.ArrayHelper.contains(subArray,value)) {
			result = array[idx_];
			break;
		}
	}
	return result;
}
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
				var _g1 = 1, _g = comparison.length;
				while(_g1 < _g) {
					var c_ = _g1++;
					var comparisonValue;
					if(js.Boot.__instanceof(comparison[c_].propOrFcn,String)) comparisonValue = Reflect.field(candidate,comparison[c_].propOrFcn); else comparisonValue = comparison[c_].propOrFcn(candidate);
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
}
m3.helper.ArrayHelper.contains = function(array,value) {
	if(array == null) return false;
	var contains = Lambda.indexOf(array,value);
	return contains > -1;
}
m3.helper.ArrayHelper.containsAny = function(array,valueArray) {
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
m3.helper.ArrayHelper.containsAll = function(array,valueArray) {
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
m3.helper.ArrayHelper.containsComplex = function(array,value,propOrFcn,startingIndex) {
	if(startingIndex == null) startingIndex = 0;
	if(array == null) return false;
	var contains = m3.helper.ArrayHelper.indexOfComplex(array,value,propOrFcn,startingIndex);
	return contains > -1;
}
m3.helper.ArrayHelper.containsComplexInSubArray = function(array,value,subArrayProp,startingIndex) {
	if(startingIndex == null) startingIndex = 0;
	if(array == null) return false;
	var contains = m3.helper.ArrayHelper.indexOfComplexInSubArray(array,value,subArrayProp,startingIndex);
	return contains > -1;
}
m3.helper.ArrayHelper.containsArrayComparison = function(array,comparison,startingIndex) {
	if(startingIndex == null) startingIndex = 0;
	if(array == null) return false;
	var contains = m3.helper.ArrayHelper.indexOfArrayComparison(array,comparison,startingIndex);
	return contains > -1;
}
m3.helper.ArrayHelper.hasValues = function(array) {
	return array != null && array.length > 0;
}
m3.helper.ArrayHelper.joinX = function(array,sep) {
	if(array == null) return null;
	var s = "";
	var _g1 = 0, _g = array.length;
	while(_g1 < _g) {
		var str_ = _g1++;
		var tmp = array[str_];
		if(m3.helper.StringHelper.isNotBlank(tmp)) tmp = StringTools.trim(tmp);
		if(m3.helper.StringHelper.isNotBlank(tmp) && str_ > 0 && s.length > 0) s += sep;
		s += array[str_];
	}
	return s;
}
m3.helper.DateHelper = function() { }
$hxClasses["m3.helper.DateHelper"] = m3.helper.DateHelper;
m3.helper.DateHelper.__name__ = ["m3","helper","DateHelper"];
m3.helper.DateHelper.inThePast = function(d) {
	return d.getTime() < new Date().getTime();
}
m3.helper.DateHelper.inTheFuture = function(d) {
	return d.getTime() > new Date().getTime();
}
m3.helper.DateHelper.isValid = function(d) {
	return d != null && !Math.isNaN(d.getTime());
}
m3.helper.DateHelper.isBefore = function(d1,d2) {
	return d1.getTime() < d2.getTime();
}
m3.helper.DateHelper.isAfter = function(d1,d2) {
	return !m3.helper.DateHelper.isBefore(d1,d2);
}
m3.helper.OSetHelper = function() { }
$hxClasses["m3.helper.OSetHelper"] = m3.helper.OSetHelper;
m3.helper.OSetHelper.__name__ = ["m3","helper","OSetHelper"];
m3.helper.OSetHelper.getElement = function(oset,value,startingIndex) {
	if(startingIndex == null) startingIndex = 0;
	return m3.helper.OSetHelper.getElementComplex(oset,value,null,startingIndex);
}
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
		if(js.Boot.__instanceof(propOrFcn,String)) comparisonValue = Reflect.field(comparisonT,propOrFcn); else comparisonValue = propOrFcn(comparisonT);
		if(value == comparisonValue) {
			result = comparisonT;
			break;
		}
	}
	return result;
}
m3.helper.OSetHelper.hasValues = function(oset) {
	return oset != null && oset.iterator().hasNext();
}
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
}
m3.helper.OSetHelper.strIdentifier = function(str) {
	return str;
}
m3.helper.StringHelper = function() { }
$hxClasses["m3.helper.StringHelper"] = m3.helper.StringHelper;
m3.helper.StringHelper.__name__ = ["m3","helper","StringHelper"];
m3.helper.StringHelper.compare = function(left,right) {
	if(left < right) return -1; else if(left > right) return 1; else return 0;
}
m3.helper.StringHelper.extractLast = function(term,splitValue) {
	if(splitValue == null) splitValue = ",";
	if(term == null) return term;
	var lastTerm = null;
	if(js.Boot.__instanceof(splitValue,EReg)) lastTerm = (js.Boot.__cast(splitValue , EReg)).split(term).pop(); else lastTerm = term.split(splitValue).pop();
	return lastTerm;
}
m3.helper.StringHelper.replaceAll = function(original,sub,by) {
	if(original == null) return original;
	if(!js.Boot.__instanceof(original,String)) original = Std.string(original);
	while(original.indexOf(sub) >= 0) if(js.Boot.__instanceof(sub,EReg)) original = (js.Boot.__cast(sub , EReg)).replace(original,by); else original = StringTools.replace(original,sub,by);
	return original;
}
m3.helper.StringHelper.replaceLast = function(original,newLastTerm,splitValue) {
	if(splitValue == null) splitValue = ".";
	if(m3.helper.StringHelper.isBlank(original)) return original;
	var pathSplit = original.split(splitValue);
	pathSplit.pop();
	pathSplit.push(newLastTerm);
	return pathSplit.join(".");
}
m3.helper.StringHelper.capitalizeFirstLetter = function(str) {
	if(m3.helper.StringHelper.isBlank(str)) return str;
	return HxOverrides.substr(str,0,1).toUpperCase() + HxOverrides.substr(str,1,str.length);
}
m3.helper.StringHelper.camelCase = function(str) {
	if(m3.helper.StringHelper.isBlank(str)) return str;
	return HxOverrides.substr(str,0,1).toLowerCase() + HxOverrides.substr(str,1,str.length);
}
m3.helper.StringHelper.isBlank = function(str) {
	return str == null || $.trim(str) == "";
}
m3.helper.StringHelper.isNotBlank = function(str) {
	return !m3.helper.StringHelper.isBlank(str);
}
m3.helper.StringHelper.indentLeft = function(baseString,chars,padChar) {
	if(baseString == null) baseString = "";
	var padding = "";
	var _g = 0;
	while(_g < chars) {
		var i_ = _g++;
		padding += padChar;
	}
	return padding + baseString;
}
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
}
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
}
m3.helper.StringHelper.trimLeft = function(s,minChars,trimChars) {
	if(trimChars == null) trimChars = " \n\t";
	if(minChars == null) minChars = 0;
	if(s == null) s = "";
	if(s.length < minChars) return s;
	var i = 0;
	while(i <= s.length && trimChars.indexOf(HxOverrides.substr(s,i,1)) >= 0) i += 1;
	if(s.length - i < minChars) i = s.length - minChars;
	return HxOverrides.substr(s,i,null);
}
m3.helper.StringHelper.trimRight = function(s,minChars,trimChars) {
	if(trimChars == null) trimChars = " \n\t";
	if(minChars == null) minChars = 0;
	if(s == null) s = "";
	if(s.length < minChars) return s;
	var i = s.length;
	while(i > 0 && trimChars.indexOf(HxOverrides.substr(s,i - 1,1)) >= 0) i -= 1;
	if(s.length - i < minChars) i = minChars;
	return HxOverrides.substr(s,0,i);
}
m3.helper.StringHelper.contains = function(baseString,str) {
	if(m3.helper.StringHelper.isBlank(baseString)) return false;
	return baseString.indexOf(str) > -1;
}
m3.helper.StringHelper.containsAny = function(baseString,sarray) {
	if(m3.helper.StringHelper.isBlank(baseString)) return false; else {
		var _g1 = 0, _g = sarray.length;
		while(_g1 < _g) {
			var s_ = _g1++;
			if(m3.helper.StringHelper.contains(baseString,sarray[s_])) return true;
		}
	}
	return false;
}
m3.helper.StringHelper.startsWithAny = function(baseString,sarray) {
	if(m3.helper.StringHelper.isBlank(baseString)) return false; else {
		var _g1 = 0, _g = sarray.length;
		while(_g1 < _g) {
			var s_ = _g1++;
			if(HxOverrides.substr(baseString,0,sarray[s_].length) == sarray[s_]) return true;
		}
	}
	return false;
}
m3.helper.StringHelper.endsWithAny = function(baseString,sarray) {
	if(m3.helper.StringHelper.isBlank(baseString)) return false; else {
		var _g1 = 0, _g = sarray.length;
		while(_g1 < _g) {
			var s_ = _g1++;
			if(StringTools.endsWith(baseString,sarray[s_])) return true;
		}
	}
	return false;
}
m3.helper.StringHelper.splitByReg = function(baseString,reg) {
	var result = null;
	if(baseString != null && reg != null) result = reg.split(baseString);
	return result;
}
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
		} catch( err ) {
		}
	}
	if(!m3.helper.DateHelper.isValid(date)) date == null;
	return date;
}
m3.helper.StringHelper.boolAsYesNo = function(bool) {
	if(bool) return "Yes"; else return "No";
}
m3.helper.StringHelper.toBool = function(str) {
	if(str == null) return false;
	return str.toLowerCase() == "true";
}
m3.jq = {}
m3.jq.JQDialogHelper = function() { }
$hxClasses["m3.jq.JQDialogHelper"] = m3.jq.JQDialogHelper;
m3.jq.JQDialogHelper.__name__ = ["m3","jq","JQDialogHelper"];
m3.jq.JQDialogHelper.close = function(d) {
	d.dialog("close");
}
m3.jq.JQDialogHelper.open = function(d) {
	d.dialog("open");
}
m3.jq.JQMenuHelper = function() { }
$hxClasses["m3.jq.JQMenuHelper"] = m3.jq.JQMenuHelper;
m3.jq.JQMenuHelper.__name__ = ["m3","jq","JQMenuHelper"];
m3.jq.JQMenuHelper.blur = function(m) {
	m.menu("blur");
}
m3.jq.JQMenuHelper.collapseAll = function(m) {
	m.menu("collapseAll");
}
m3.jq.JQMenuHelper.refresh = function(m) {
	m.menu("refresh");
}
m3.jq.M3DialogHelper = function() { }
$hxClasses["m3.jq.M3DialogHelper"] = m3.jq.M3DialogHelper;
m3.jq.M3DialogHelper.__name__ = ["m3","jq","M3DialogHelper"];
m3.jq.M3DialogHelper.close = function(dlg) {
	dlg.m3dialog("close");
}
m3.jq.M3DialogHelper.open = function(dlg) {
	dlg.m3dialog("open");
}
m3.log = {}
m3.log.Logga = function(logLevel) {
	this.initialized = false;
	this.loggerLevel = logLevel;
};
$hxClasses["m3.log.Logga"] = m3.log.Logga;
m3.log.Logga.__name__ = ["m3","log","Logga"];
m3.log.Logga.get_DEFAULT = function() {
	if(m3.log.Logga.DEFAULT == null) m3.log.Logga.DEFAULT = new m3.log.RemoteLogga(m3.log.LogLevel.DEBUG,m3.log.LogLevel.DEBUG);
	return m3.log.Logga.DEFAULT;
}
m3.log.Logga.getExceptionInst = function(err) {
	if(js.Boot.__instanceof(err,m3.exception.Exception)) return err; else return new m3.exception.Exception(err);
}
m3.log.Logga.prototype = {
	error: function(statement,exception) {
		this.log(statement,m3.log.LogLevel.ERROR,exception);
	}
	,warn: function(statement,exception) {
		this.log(statement,m3.log.LogLevel.WARN,exception);
	}
	,info: function(statement,exception) {
		this.log(statement,m3.log.LogLevel.INFO,exception);
	}
	,debug: function(statement,exception) {
		this.log(statement,m3.log.LogLevel.DEBUG,exception);
	}
	,trace: function(statement,exception) {
		this.log(statement,m3.log.LogLevel.TRACE,exception);
	}
	,setLogLevel: function(logLevel) {
		this.loggerLevel = logLevel;
	}
	,logsAtLevel: function(level) {
		return this.loggerLevel[1] <= level[1];
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
		} catch( err ) {
			if(this.console != null && Reflect.hasField(this.console,"error")) this.console.error(err);
		}
	}
	,setStatementPrefix: function(prefix) {
		this.statementPrefix = prefix;
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
	,_getLogger: function() {
		this.console = js.Browser.window.console;
		this.initialized = true;
	}
	,__class__: m3.log.Logga
}
m3.log.LogLevel = $hxClasses["m3.log.LogLevel"] = { __ename__ : ["m3","log","LogLevel"], __constructs__ : ["TRACE","DEBUG","INFO","WARN","ERROR"] }
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
m3.log.RemoteLogga = function(consoleLevel,remoteLevel) {
	m3.log.Logga.call(this,consoleLevel);
	this.remoteLogLevel = remoteLevel;
	this.logs = [];
	this.sessionUid = m3.util.UidGenerator.create(32);
	this.log("SessionUid: " + this.sessionUid);
};
$hxClasses["m3.log.RemoteLogga"] = m3.log.RemoteLogga;
m3.log.RemoteLogga.__name__ = ["m3","log","RemoteLogga"];
m3.log.RemoteLogga.__super__ = m3.log.Logga;
m3.log.RemoteLogga.prototype = $extend(m3.log.Logga.prototype,{
	unpause: function() {
		if(this.timer != null) this.timer.unpause();
	}
	,pause: function() {
		if(this.timer != null) this.timer.pause();
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
	,remoteLogsAtLevel: function(level) {
		return this.remoteLogLevel[1] <= level[1];
	}
	,log: function(statement,level,exception) {
		if(level == null) level = m3.log.LogLevel.INFO;
		m3.log.Logga.prototype.log.call(this,statement,level,exception);
		if(this.remoteLogsAtLevel(level)) {
			try {
				if(exception != null && $bind(exception,exception.stackTrace) != null && Reflect.isFunction($bind(exception,exception.stackTrace))) statement += "\n" + exception.stackTrace();
			} catch( err ) {
			}
			this.logs.push({ sessionUid : this.sessionUid, at : DateTools.format(new Date(),"%Y-%m-%d %T"), message : statement, severity : level[0], category : "ui"});
		}
	}
	,__class__: m3.log.RemoteLogga
});
m3.util = {}
m3.util.UidGenerator = function() { }
$hxClasses["m3.util.UidGenerator"] = m3.util.UidGenerator;
m3.util.UidGenerator.__name__ = ["m3","util","UidGenerator"];
m3.util.UidGenerator.create = function(length) {
	if(length == null) length = 20;
	var str = new Array();
	var charsLength = m3.util.UidGenerator.chars.length;
	while(str.length == 0) {
		var ch = m3.util.UidGenerator.randomChar();
		if(m3.util.UidGenerator.isLetter(ch)) str.push(ch);
	}
	while(str.length < length) {
		var ch = m3.util.UidGenerator.randomChar();
		str.push(ch);
	}
	return str.join("");
}
m3.util.UidGenerator.isLetter = function($char) {
	var _g1 = 0, _g = m3.util.UidGenerator.chars.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(m3.util.UidGenerator.chars.charAt(i) == $char) return true;
	}
	return false;
}
m3.util.UidGenerator.randomNum = function() {
	var max = m3.util.UidGenerator.chars.length - 1;
	var min = 0;
	return min + Math.round(Math.random() * (max - min) + 1);
}
m3.util.UidGenerator.randomIndex = function(str) {
	var max = str.length - 1;
	var min = 0;
	return min + Math.round(Math.random() * (max - min) + 1);
}
m3.util.UidGenerator.randomChar = function() {
	var i = 0;
	while((i = m3.util.UidGenerator.randomIndex(m3.util.UidGenerator.chars)) >= m3.util.UidGenerator.chars.length) continue;
	return m3.util.UidGenerator.chars.charAt(i);
}
m3.util.UidGenerator.randomNumChar = function() {
	var i = 0;
	while((i = m3.util.UidGenerator.randomIndex(m3.util.UidGenerator.nums)) >= m3.util.UidGenerator.nums.length) continue;
	return Std.parseInt(m3.util.UidGenerator.nums.charAt(i));
}
m3.jq.PlaceHolderUtil = function() { }
$hxClasses["m3.jq.PlaceHolderUtil"] = m3.jq.PlaceHolderUtil;
m3.jq.PlaceHolderUtil.__name__ = ["m3","jq","PlaceHolderUtil"];
m3.jq.PlaceHolderUtil.setFocusBehavior = function(input,placeholder) {
	placeholder.focus(function(evt) {
		placeholder.hide();
		input.show().focus();
	});
	input.blur(function(evt) {
		if(m3.helper.StringHelper.isBlank(input.val())) {
			placeholder.show();
			input.hide();
		}
	});
}
m3.log._RemoteLogga = {}
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
	unpause: function() {
		m3.log.Logga.get_DEFAULT().debug("unpausing remote logga");
		this.paused = false;
	}
	,pause: function() {
		m3.log.Logga.get_DEFAULT().debug("pausing remote logga");
		this.paused = true;
	}
	,run: function() {
		if(this.paused) return;
		var logs = this.getLogs();
		if(m3.helper.ArrayHelper.hasValues(logs)) this.remoteLogFcn(logs); else m3.log.Logga.get_DEFAULT().debug("no remote logs to send");
	}
	,__class__: m3.log._RemoteLogga.RemoteLoggingTimer
});
m3.observable = {}
m3.observable.OSet = function() { }
$hxClasses["m3.observable.OSet"] = m3.observable.OSet;
m3.observable.OSet.__name__ = ["m3","observable","OSet"];
m3.observable.OSet.prototype = {
	__class__: m3.observable.OSet
}
m3.observable.EventManager = function(set) {
	this._set = set;
	this._listeners = [];
};
$hxClasses["m3.observable.EventManager"] = m3.observable.EventManager;
m3.observable.EventManager.__name__ = ["m3","observable","EventManager"];
m3.observable.EventManager.prototype = {
	listenerCount: function() {
		return this._listeners.length;
	}
	,fire: function(t,type) {
		Lambda.iter(this._listeners,function(it) {
			return it(t,type);
		});
	}
	,remove: function(l) {
		HxOverrides.remove(this._listeners,l);
	}
	,add: function(l) {
		Lambda.iter(this._set,function(it) {
			return l(it,m3.observable.EventType.Add);
		});
		this._listeners.push(l);
	}
	,__class__: m3.observable.EventManager
}
m3.observable.EventType = function(name,add,update) {
	this._name = name;
	this._add = add;
	this._update = update;
};
$hxClasses["m3.observable.EventType"] = m3.observable.EventType;
m3.observable.EventType.__name__ = ["m3","observable","EventType"];
m3.observable.EventType.prototype = {
	isDelete: function() {
		return !(this._add || this._update);
	}
	,isAddOrUpdate: function() {
		return this._add || this._update;
	}
	,isUpdate: function() {
		return this._update;
	}
	,isAdd: function() {
		return this._add;
	}
	,name: function() {
		return this._name;
	}
	,__class__: m3.observable.EventType
}
m3.observable.AbstractSet = function() {
	this._eventManager = new m3.observable.EventManager(this);
};
$hxClasses["m3.observable.AbstractSet"] = m3.observable.AbstractSet;
m3.observable.AbstractSet.__name__ = ["m3","observable","AbstractSet"];
m3.observable.AbstractSet.__interfaces__ = [m3.observable.OSet];
m3.observable.AbstractSet.prototype = {
	delegate: function() {
		return (function($this) {
			var $r;
			throw new m3.exception.Exception("implement me");
			return $r;
		}(this));
	}
	,iterator: function() {
		return (function($this) {
			var $r;
			throw new m3.exception.Exception("implement me");
			return $r;
		}(this));
	}
	,identifier: function() {
		return (function($this) {
			var $r;
			throw new m3.exception.Exception("implement me");
			return $r;
		}(this));
	}
	,getVisualId: function() {
		return this.visualId;
	}
	,fire: function(t,type) {
		this._eventManager.fire(t,type);
	}
	,map: function(f) {
		return new m3.observable.MappedSet(this,f);
	}
	,filter: function(f) {
		return new m3.observable.FilteredSet(this,f);
	}
	,removeListener: function(l) {
		this._eventManager.remove(l);
	}
	,listen: function(l) {
		this._eventManager.add(l);
	}
	,__class__: m3.observable.AbstractSet
}
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
	asArray: function() {
		var a = new Array();
		var iter = this.iterator();
		while(iter.hasNext()) a.push(iter.next());
		return a;
	}
	,size: function() {
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
			this.fire(t,m3.observable.EventType.Delete);
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
		if(this._delegate.exists(key)) type = m3.observable.EventType.Update; else type = m3.observable.EventType.Add;
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
	removeListeners: function(mapListener) {
		HxOverrides.remove(this._mapListeners,mapListener);
		this._source.removeListener($bind(this,this._sourceListener));
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
	,iterator: function() {
		return this._mappedSet.iterator();
	}
	,identify: function(u) {
		var keys = this._mappedSet.keys();
		while(keys.hasNext()) {
			var key = keys.next();
			if(this._mappedSet.get(key) == u) return key;
		}
		throw new m3.exception.Exception("unable to find identity for " + Std.string(u));
	}
	,delegate: function() {
		return this._mappedSet;
	}
	,identifier: function() {
		return $bind(this,this.identify);
	}
	,_sourceListener: function(t,type) {
		var key = (this._source.identifier())(t);
		var mappedValue;
		if(type.isAdd() || this._remapOnUpdate && type.isUpdate()) {
			mappedValue = this._mapper(t);
			this._mappedSet.set(key,mappedValue);
		} else if(type.isUpdate()) mappedValue = this._mappedSet.get(key); else {
			mappedValue = this._mappedSet.get(key);
			this._mappedSet.remove(key);
		}
		this.fire(mappedValue,type);
		Lambda.iter(this._mapListeners,function(it) {
			return it(t,mappedValue,type);
		});
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
		}
	});
};
$hxClasses["m3.observable.FilteredSet"] = m3.observable.FilteredSet;
m3.observable.FilteredSet.__name__ = ["m3","observable","FilteredSet"];
m3.observable.FilteredSet.__super__ = m3.observable.AbstractSet;
m3.observable.FilteredSet.prototype = $extend(m3.observable.AbstractSet.prototype,{
	asArray: function() {
		var a = new Array();
		var iter = this.iterator();
		while(iter.hasNext()) a.push(iter.next());
		return a;
	}
	,iterator: function() {
		return this._filteredSet.iterator();
	}
	,identifier: function() {
		return this._source.identifier();
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
				this.fire(t,m3.observable.EventType.Add);
			} else {
				this._filteredSet.remove(key);
				this.fire(t,m3.observable.EventType.Delete);
			}
		} else if(exists) this.fire(t,m3.observable.EventType.Update);
	}
	,delegate: function() {
		return this._filteredSet;
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
				_g["delete"](t);
				_g.add(t);
			}
		} else _g["delete"](t);
	});
};
$hxClasses["m3.observable.GroupedSet"] = m3.observable.GroupedSet;
m3.observable.GroupedSet.__name__ = ["m3","observable","GroupedSet"];
m3.observable.GroupedSet.__super__ = m3.observable.AbstractSet;
m3.observable.GroupedSet.prototype = $extend(m3.observable.AbstractSet.prototype,{
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
		throw new m3.exception.Exception("unable to find identity for " + Std.string(set));
	}
	,identifier: function() {
		return $bind(this,this.identify);
	}
	,addEmptyGroup: function(key) {
		if(this._groupedSets.get(key) == null) {
			var groupedSet = new m3.observable.ObservableSet(this._source.identifier());
			groupedSet.visualId = key;
			this._groupedSets.set(key,groupedSet);
		}
		return this._groupedSets.get(key);
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
					this.fire(groupedSet,m3.observable.EventType.Delete);
				} else this.fire(groupedSet,m3.observable.EventType.Update);
			} else {
			}
		} else {
		}
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
		} else _g.add(t);
	});
};
$hxClasses["m3.observable.SortedSet"] = m3.observable.SortedSet;
m3.observable.SortedSet.__name__ = ["m3","observable","SortedSet"];
m3.observable.SortedSet.__super__ = m3.observable.AbstractSet;
m3.observable.SortedSet.prototype = $extend(m3.observable.AbstractSet.prototype,{
	delegate: function() {
		throw new m3.exception.Exception("not implemented");
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
		this.fire(t,m3.observable.EventType.Add);
	}
	,'delete': function(t) {
		HxOverrides.remove(this._sorted,t);
		this.fire(t,m3.observable.EventType.Delete);
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
	,__class__: m3.observable.SortedSet
});
m3.serialization = {}
m3.serialization.Serializer = function() {
	this._handlersMap = new haxe.ds.StringMap();
	this.addHandlerViaName("Array<Dynamic>",new m3.serialization.DynamicArrayHandler());
};
$hxClasses["m3.serialization.Serializer"] = m3.serialization.Serializer;
m3.serialization.Serializer.__name__ = ["m3","serialization","Serializer"];
m3.serialization.Serializer.prototype = {
	createHandler: function(type) {
		return (function($this) {
			var $r;
			var $e = (type);
			switch( $e[1] ) {
			case 1:
				var parms = $e[3], path = $e[2];
				$r = path == "Bool"?new m3.serialization.BoolHandler():new m3.serialization.EnumHandler(path,parms);
				break;
			case 2:
				var parms = $e[3], path = $e[2];
				$r = (function($this) {
					var $r;
					switch(path) {
					case "Bool":
						$r = new m3.serialization.BoolHandler();
						break;
					case "Float":
						$r = new m3.serialization.FloatHandler();
						break;
					case "String":
						$r = new m3.serialization.StringHandler();
						break;
					case "Int":
						$r = new m3.serialization.IntHandler();
						break;
					case "Array":
						$r = new m3.serialization.ArrayHandler(parms,$this);
						break;
					case "Date":
						$r = new m3.serialization.DateHandler();
						break;
					default:
						$r = new m3.serialization.ClassHandler(Type.resolveClass(m3.serialization.CTypeTools.classname(type)),m3.serialization.CTypeTools.typename(type),$this);
					}
					return $r;
				}($this));
				break;
			case 7:
				var parms = $e[3], path = $e[2];
				$r = (function($this) {
					var $r;
					switch(path) {
					case "Bool":
						$r = new m3.serialization.BoolHandler();
						break;
					case "Float":
						$r = new m3.serialization.FloatHandler();
						break;
					case "String":
						$r = new m3.serialization.StringHandler();
						break;
					case "Int":
						$r = new m3.serialization.IntHandler();
						break;
					case "Array":
						$r = new m3.serialization.ArrayHandler(parms,$this);
						break;
					case "Date":
						$r = new m3.serialization.DateHandler();
						break;
					default:
						$r = new m3.serialization.ClassHandler(Type.resolveClass(m3.serialization.CTypeTools.classname(type)),m3.serialization.CTypeTools.typename(type),$this);
					}
					return $r;
				}($this));
				break;
			case 6:
				$r = new m3.serialization.DynamicHandler();
				break;
			case 4:
				var ret = $e[3], args = $e[2];
				$r = new m3.serialization.FunctionHandler();
				break;
			default:
				$r = (function($this) {
					var $r;
					throw new m3.serialization.JsonException("don't know how to handle " + Std.string(type));
					return $r;
				}($this));
			}
			return $r;
		}(this));
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
	,getHandlerViaClass: function(clazz) {
		var typename = m3.serialization.TypeTools.classname(clazz);
		return this.getHandler(haxe.rtti.CType.CClass(typename,new List()));
	}
	,createWriter: function() {
		return new m3.serialization.JsonWriter(this);
	}
	,createReader: function(strict) {
		if(strict == null) strict = true;
		return new m3.serialization.JsonReader(this,strict);
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
	,__class__: m3.serialization.Serializer
}
m3.serialization.TypeHandler = function() { }
$hxClasses["m3.serialization.TypeHandler"] = m3.serialization.TypeHandler;
m3.serialization.TypeHandler.__name__ = ["m3","serialization","TypeHandler"];
m3.serialization.TypeHandler.prototype = {
	__class__: m3.serialization.TypeHandler
}
m3.serialization.ArrayHandler = function(parms,serializer) {
	this._parms = parms;
	this._serializer = serializer;
	this._elementHandler = this._serializer.getHandler(this._parms.first());
};
$hxClasses["m3.serialization.ArrayHandler"] = m3.serialization.ArrayHandler;
m3.serialization.ArrayHandler.__name__ = ["m3","serialization","ArrayHandler"];
m3.serialization.ArrayHandler.__interfaces__ = [m3.serialization.TypeHandler];
m3.serialization.ArrayHandler.prototype = {
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
			var arr;
			if(js.Boot.__instanceof(fromJson,Array)) arr = fromJson; else arr = [fromJson];
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
	,__class__: m3.serialization.ArrayHandler
}
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
	write: function(value,writer) {
		return Std.string(value);
	}
	,read: function(fromJson,reader,instance) {
		if(instance != null) reader.error("enum type can not populate a passed in instance");
		var type = Type.getClass(fromJson);
		var result = (function($this) {
			var $r;
			switch(type) {
			case String:
				$r = Type.createEnum($this._enum,fromJson);
				break;
			case Int:
				$r = Type.createEnumIndex($this._enum,fromJson);
				break;
			default:
				$r = (function($this) {
					var $r;
					reader.error(Std.string(fromJson) + " is a(n) " + Std.string(type) + " not a String");
					$r = null;
					return $r;
				}($this));
			}
			return $r;
		}(this));
		return result;
	}
	,__class__: m3.serialization.EnumHandler
}
m3.serialization.ValueTypeHandler = function(valueType) {
	this._valueType = valueType;
};
$hxClasses["m3.serialization.ValueTypeHandler"] = m3.serialization.ValueTypeHandler;
m3.serialization.ValueTypeHandler.__name__ = ["m3","serialization","ValueTypeHandler"];
m3.serialization.ValueTypeHandler.__interfaces__ = [m3.serialization.TypeHandler];
m3.serialization.ValueTypeHandler.prototype = {
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
	,__class__: m3.serialization.ValueTypeHandler
}
m3.serialization.DynamicArrayHandler = function() {
};
$hxClasses["m3.serialization.DynamicArrayHandler"] = m3.serialization.DynamicArrayHandler;
m3.serialization.DynamicArrayHandler.__name__ = ["m3","serialization","DynamicArrayHandler"];
m3.serialization.DynamicArrayHandler.__interfaces__ = [m3.serialization.TypeHandler];
m3.serialization.DynamicArrayHandler.prototype = {
	write: function(value,writer) {
		return value;
	}
	,read: function(fromJson,reader,instance) {
		var classname = m3.serialization.ValueTypeTools.getClassname(Type["typeof"](fromJson));
		if(classname == "Array") return fromJson; else return reader.error("expected an array got a " + classname);
	}
	,__class__: m3.serialization.DynamicArrayHandler
}
m3.serialization.DynamicHandler = function() {
};
$hxClasses["m3.serialization.DynamicHandler"] = m3.serialization.DynamicHandler;
m3.serialization.DynamicHandler.__name__ = ["m3","serialization","DynamicHandler"];
m3.serialization.DynamicHandler.__interfaces__ = [m3.serialization.TypeHandler];
m3.serialization.DynamicHandler.prototype = {
	write: function(value,writer) {
		return value;
	}
	,read: function(fromJson,reader,instance) {
		return fromJson;
	}
	,__class__: m3.serialization.DynamicHandler
}
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
	,__class__: m3.serialization.StringHandler
}
m3.serialization.DateHandler = function() {
};
$hxClasses["m3.serialization.DateHandler"] = m3.serialization.DateHandler;
m3.serialization.DateHandler.__name__ = ["m3","serialization","DateHandler"];
m3.serialization.DateHandler.__interfaces__ = [m3.serialization.TypeHandler];
m3.serialization.DateHandler.prototype = {
	write: function(value,writer) {
		return HxOverrides.dateStr(js.Boot.__cast(value , Date));
	}
	,read: function(fromJson,reader,instance) {
		return (function($this) {
			var $r;
			var s = fromJson;
			$r = HxOverrides.strDate(s);
			return $r;
		}(this));
	}
	,__class__: m3.serialization.DateHandler
}
m3.serialization.FunctionHandler = function() {
};
$hxClasses["m3.serialization.FunctionHandler"] = m3.serialization.FunctionHandler;
m3.serialization.FunctionHandler.__name__ = ["m3","serialization","FunctionHandler"];
m3.serialization.FunctionHandler.__interfaces__ = [m3.serialization.TypeHandler];
m3.serialization.FunctionHandler.prototype = {
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
	,__class__: m3.serialization.FunctionHandler
}
m3.serialization.Field = function() {
	this.required = true;
};
$hxClasses["m3.serialization.Field"] = m3.serialization.Field;
m3.serialization.Field.__name__ = ["m3","serialization","Field"];
m3.serialization.Field.prototype = {
	__class__: m3.serialization.Field
}
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
				throw new m3.serialization.JsonException("expected a class got " + Std.string(typeTree));
				return $r;
			}($this));
		}
		return $r;
	}(this));
	this._fields = new Array();
	var superClass = Type.getSuperClass(clazz);
	if(superClass != null) {
		var superClassHandler = new m3.serialization.ClassHandler(superClass,Type.getClassName(superClass),serializer);
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
		var field = new m3.serialization.Field();
		var $transient = false;
		var fieldXml = x.elementsNamed(f.name).next();
		var set = fieldXml.get("set");
		var $it1 = fieldXml.elementsNamed("meta");
		while( $it1.hasNext() ) {
			var meta = $it1.next();
			var $it2 = meta.elementsNamed("m");
			while( $it2.hasNext() ) {
				var m = $it2.next();
				var _g = m.get("n");
				switch(_g) {
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
			switch( (f.type)[1] ) {
			case 2:
			case 1:
			case 6:
			case 4:
			case 7:
				field.name = f.name;
				field.type = f.type;
				field.typename = m3.serialization.CTypeTools.typename(f.type);
				field.handler = this._serializer.getHandler(field.type);
				this._fields.push(field);
				break;
			case 3:
				field.name = f.name;
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
	var _g = 0, _g1 = this._fields;
	while(_g < _g1.length) {
		var f = _g1[_g];
		++_g;
		this._fieldsByName.set(f.name,f);
	}
};
$hxClasses["m3.serialization.ClassHandler"] = m3.serialization.ClassHandler;
m3.serialization.ClassHandler.__name__ = ["m3","serialization","ClassHandler"];
m3.serialization.ClassHandler.__interfaces__ = [m3.serialization.TypeHandler];
m3.serialization.ClassHandler.prototype = {
	write: function(instanceValue,writer) {
		var instance = { };
		if(instanceValue.writeResolve != null && Reflect.isFunction(instanceValue.writeResolve)) instanceValue.writeResolve();
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
					throw new m3.serialization.JsonException("error writing field " + f.name + "\n" + msg);
				} else if( js.Boot.__instanceof($e0,m3.exception.Exception) ) {
					var e = $e0;
					throw new m3.serialization.JsonException("error writing field " + f.name,e);
				} else {
				var e = $e0;
				throw new m3.serialization.JsonException("error writing field " + f.name,e);
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
				if(m3.helper.ArrayHelper.contains(jsonFieldNames,f.name)) found = true;
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
				} else if( js.Boot.__instanceof($e0,m3.exception.Exception) ) {
					var e = $e0;
					reader.error("error reading field " + fieldName,e);
				} else {
				var e = $e0;
				reader.error("error reading field " + fieldName,e);
				}
			}
			reader.stack.pop();
		}
		if(instance.readResolve != null && Reflect.isFunction(instance.readResolve)) instance.readResolve();
		return instance;
	}
	,createInstance: function() {
		return Type.createInstance(this._clazz,[]);
	}
	,__class__: m3.serialization.ClassHandler
}
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
	error: function(msg,cause) {
		if(this.strict) throw new m3.serialization.JsonException(msg,cause); else return null;
	}
	,read: function(fromJson,clazz,instance) {
		var handler = this._serializer.getHandlerViaClass(clazz);
		this.instance = handler.read(fromJson,this,instance);
	}
	,__class__: m3.serialization.JsonReader
}
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
}
m3.serialization.TypeTools = function() { }
$hxClasses["m3.serialization.TypeTools"] = m3.serialization.TypeTools;
m3.serialization.TypeTools.__name__ = ["m3","serialization","TypeTools"];
m3.serialization.TypeTools.classname = function(clazz) {
	try {
		return Type.getClassName(clazz);
	} catch( err ) {
		throw new m3.exception.Exception(Std.string(err));
	}
}
m3.serialization.TypeTools.clazz = function(d) {
	var c = Type.getClass(d);
	if(c == null) console.log("tried to get class for type -- " + Std.string(Type["typeof"](d)) + " -- " + Std.string(d));
	return c;
}
m3.serialization.CTypeTools = function() { }
$hxClasses["m3.serialization.CTypeTools"] = m3.serialization.CTypeTools;
m3.serialization.CTypeTools.__name__ = ["m3","serialization","CTypeTools"];
m3.serialization.CTypeTools.classname = function(type) {
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
				throw new m3.exception.Exception("don't know how to handle " + Std.string(type));
				return $r;
			}($this));
		}
		return $r;
	}(this));
}
m3.serialization.CTypeTools.typename = function(type) {
	return (function($this) {
		var $r;
		var $e = (type);
		switch( $e[1] ) {
		case 2:
			var parms = $e[3], path = $e[2];
			$r = m3.serialization.CTypeTools.makeTypename(path,parms);
			break;
		case 1:
			var parms = $e[3], path = $e[2];
			$r = m3.serialization.CTypeTools.makeTypename(path,parms);
			break;
		case 7:
			var parms = $e[3], path = $e[2];
			$r = m3.serialization.CTypeTools.makeTypename(path,parms);
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
				throw new m3.exception.Exception("don't know how to handle " + Std.string(type));
				return $r;
			}($this));
		}
		return $r;
	}(this));
}
m3.serialization.CTypeTools.makeTypename = function(path,parms) {
	return parms.isEmpty()?path:path + "<" + Lambda.array(parms.map(function(ct) {
		return m3.serialization.CTypeTools.typename(ct);
	})).join(",") + ">";
}
m3.serialization.ValueTypeTools = function() { }
$hxClasses["m3.serialization.ValueTypeTools"] = m3.serialization.ValueTypeTools;
m3.serialization.ValueTypeTools.__name__ = ["m3","serialization","ValueTypeTools"];
m3.serialization.ValueTypeTools.getClassname = function(type) {
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
		}
		return $r;
	}(this));
}
m3.serialization.ValueTypeTools.getName = function(type) {
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
		}
		return $r;
	}(this));
}
m3.util.FixedSizeArray = function(maxSize) {
	this._maxSize = maxSize;
	this._delegate = new Array();
};
$hxClasses["m3.util.FixedSizeArray"] = m3.util.FixedSizeArray;
m3.util.FixedSizeArray.__name__ = ["m3","util","FixedSizeArray"];
m3.util.FixedSizeArray.prototype = {
	contains: function(t) {
		return m3.helper.ArrayHelper.contains(this._delegate,t);
	}
	,push: function(t) {
		if(this._delegate.length >= this._maxSize) this._delegate.shift();
		this._delegate.push(t);
	}
	,__class__: m3.util.FixedSizeArray
}
m3.util.ColorProvider = function() { }
$hxClasses["m3.util.ColorProvider"] = m3.util.ColorProvider;
m3.util.ColorProvider.__name__ = ["m3","util","ColorProvider"];
m3.util.ColorProvider.getNextColor = function() {
	if(m3.util.ColorProvider._INDEX >= m3.util.ColorProvider._COLORS.length) m3.util.ColorProvider._INDEX = 0;
	return m3.util.ColorProvider._COLORS[m3.util.ColorProvider._INDEX++];
}
m3.util.ColorProvider.getRandomColor = function() {
	var index;
	do index = Std.random(m3.util.ColorProvider._COLORS.length); while(m3.util.ColorProvider._LAST_COLORS_USED.contains(index));
	m3.util.ColorProvider._LAST_COLORS_USED.push(index);
	return m3.util.ColorProvider._COLORS[index];
}
m3.util.HtmlUtil = function() { }
$hxClasses["m3.util.HtmlUtil"] = m3.util.HtmlUtil;
m3.util.HtmlUtil.__name__ = ["m3","util","HtmlUtil"];
m3.util.HtmlUtil.readCookie = function(name) {
	return js.Cookie.get(name);
}
m3.util.HtmlUtil.setCookie = function(name,value) {
	js.Cookie.set(name,value);
}
m3.util.HtmlUtil.getUrlVars = function() {
	var vars = { };
	var hash;
	var hashes = HxOverrides.substr(js.Browser.window.location.search,1,null).split("&");
	var _g1 = 0, _g = hashes.length;
	while(_g1 < _g) {
		var i_ = _g1++;
		hash = hashes[i_].split("=");
		vars[hash[0]] = hash[1];
	}
	return vars;
}
m3.util.HtmlUtil.getAndroidVersion = function() {
	var ua = js.Browser.navigator.userAgent;
	var regex = new EReg("Android\\s([0-9\\.]*)","");
	var match = regex.match(ua);
	var version = match?regex.matched(1):null;
	if(m3.helper.StringHelper.isNotBlank(version)) try {
		return Std.parseFloat(version);
	} catch( err ) {
		m3.log.Logga.get_DEFAULT().error("Error parsing android version | " + version);
	}
	return null;
}
m3.util.JqueryUtil = function() { }
$hxClasses["m3.util.JqueryUtil"] = m3.util.JqueryUtil;
$hxExpose(m3.util.JqueryUtil, "m3.util.JqueryUtil");
m3.util.JqueryUtil.__name__ = ["m3","util","JqueryUtil"];
m3.util.JqueryUtil.isAttached = function(elem) {
	return elem.parents("body").length > 0;
}
m3.util.JqueryUtil.labelSelect = function(elem,str) {
	try {
		m3.CrossMojo.jq("option",elem).filter(function() {
			return $(this).text() == str;
		})[0].selected = true;
	} catch( err ) {
	}
}
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
}
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
}
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
}
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
}
m3.util.JqueryUtil.getWindowWidth = function() {
	return new $(js.Browser.window).width();
}
m3.util.JqueryUtil.getWindowHeight = function() {
	return new $(js.Browser.window).height();
}
m3.util.JqueryUtil.getDocumentWidth = function() {
	return new $(js.Browser.document).width();
}
m3.util.JqueryUtil.getDocumentHeight = function() {
	return new $(js.Browser.document).height();
}
m3.util.JqueryUtil.getEmptyDiv = function() {
	return new $("<div></div>");
}
m3.util.JqueryUtil.getEmptyTable = function() {
	return new $("<table style='margin:auto; text-align: center; width: 100%;'></table>");
}
m3.util.JqueryUtil.getEmptyRow = function() {
	return new $("<tr></tr>");
}
m3.util.JqueryUtil.getEmptyCell = function() {
	return new $("<td></td>");
}
m3.util.M = function() { }
$hxClasses["m3.util.M"] = m3.util.M;
m3.util.M.__name__ = ["m3","util","M"];
m3.util.M.makeSafeGetExpression = function(e,default0,pos) {
	if(default0 == null) default0 = m3.util.M.expr(haxe.macro.ExprDef.EConst(haxe.macro.Constant.CIdent("null")),pos);
	var dynamicType = haxe.macro.ComplexType.TPath({ sub : null, name : "Dynamic", pack : [], params : []});
	var catches = [{ type : dynamicType, name : "__e", expr : default0}];
	var result = haxe.macro.ExprDef.ETry(e,catches);
	return { expr : result, pos : pos};
}
m3.util.M.exprBlock = function(exprDefs,pos) {
	return { expr : haxe.macro.ExprDef.EBlock(m3.util.M.exprs(exprDefs,pos)), pos : pos};
}
m3.util.M.expr = function(exprDef,pos) {
	return { expr : exprDef, pos : pos};
}
m3.util.M.exprs = function(exprDefs,pos) {
	var arr = [];
	Lambda.iter(exprDefs,function(ed) {
		arr.push({ expr : ed, pos : pos});
	});
	return arr;
}
m3.util.SizedMap = function() {
	haxe.ds.StringMap.call(this);
	this.size = 0;
};
$hxClasses["m3.util.SizedMap"] = m3.util.SizedMap;
m3.util.SizedMap.__name__ = ["m3","util","SizedMap"];
m3.util.SizedMap.__super__ = haxe.ds.StringMap;
m3.util.SizedMap.prototype = $extend(haxe.ds.StringMap.prototype,{
	remove: function(key) {
		if(this.exists(key)) this.size--;
		return haxe.ds.StringMap.prototype.remove.call(this,key);
	}
	,set: function(key,val) {
		if(!this.exists(key)) this.size++;
		haxe.ds.StringMap.prototype.set.call(this,key,val);
	}
	,__class__: m3.util.SizedMap
});
m3.widget = {}
m3.widget.Widgets = function() { }
$hxClasses["m3.widget.Widgets"] = m3.widget.Widgets;
m3.widget.Widgets.__name__ = ["m3","widget","Widgets"];
m3.widget.Widgets.getSelf = function() {
	return this;
}
m3.widget.Widgets.getSelfElement = function() {
	return this.element;
}
m3.widget.Widgets.getWidgetClasses = function() {
	return " ui-widget";
}
var ui = {}
ui.AgentUi = function() { }
$hxClasses["ui.AgentUi"] = ui.AgentUi;
$hxExpose(ui.AgentUi, "ui.AgentUi");
ui.AgentUi.__name__ = ["ui","AgentUi"];
ui.AgentUi.main = function() {
	ui.AppContext.init();
	ui.AgentUi.PROTOCOL = new ui.api.BennuHandler();
	ui.AgentUi.HOT_KEY_ACTIONS = new Array();
}
ui.AgentUi.start = function() {
	var urlVars = m3.util.HtmlUtil.getUrlVars();
	if(m3.helper.StringHelper.isNotBlank(urlVars.demo) && (urlVars.demo == "yes" || urlVars.demo == "true")) ui.AppContext.DEMO = true;
	var z = new $("<div></div>");
	var r = new $("<div></div>");
	ui.AgentUi.HOT_KEY_ACTIONS.push(function(evt) {
		if(evt.altKey && evt.shiftKey && evt.keyCode == 78) {
		} else if(evt.altKey && evt.shiftKey && evt.keyCode == 77) {
		} else if(evt.altKey && evt.shiftKey && evt.keyCode == 90) {
			ui.AppContext.LOGGER.debug("ALT + SHIFT + Z");
			if(ui.AppContext.DEMO) z.zWidget("open");
		} else if(evt.altKey && evt.shiftKey && evt.keyCode == 82) {
			ui.AppContext.LOGGER.debug("ALT + SHIFT + R");
			r.restoreWidget("open");
		}
	});
	new $("body").keyup(function(evt1) {
		if(m3.helper.ArrayHelper.hasValues(ui.AgentUi.HOT_KEY_ACTIONS)) Lambda.iter(ui.AgentUi.HOT_KEY_ACTIONS,function(act) {
			act(evt1);
		});
	});
	new $("#sideRightSearchInput").keyup(function(evt) {
		var search = new $(evt.target);
		var cl = new $("#connections");
		ui.widget.ConnectionListHelper.filterConnections(cl,search.val());
	});
	new $("#middleContainer #content #tabs").tabs({ beforeActivate : function(evt,ui1) {
		var max_height = Math.max(new $("#tabs-feed").height(),new $("#tabs-score").height());
		ui1.newPanel.height(max_height);
	}});
	new $("#sideRight #chat").messagingComp();
	new $("#connections").connectionsList();
	new $("#labelsList").labelsList();
	new $("#filter").filterComp(null);
	new $("#feed").contentFeed({ });
	new $("#userId").userComp();
	new $("#postInput").postComp();
	new $("#sideRight #sideRightInvite").inviteComp();
	new $("#score-div").scoreComp({ content : ui.AppContext.CONTENT});
	new $("body").click(function(evt) {
		new $(".nonmodalPopup").hide();
	});
	if(ui.AppContext.DEMO) {
		z.appendTo(new $(js.Browser.document.body));
		z.zWidget();
	}
	r.appendTo(new $(js.Browser.document.body));
	r.restoreWidget();
	ui.widget.DialogManager.showLogin();
}
ui.AppContext = function() { }
$hxClasses["ui.AppContext"] = ui.AppContext;
ui.AppContext.__name__ = ["ui","AppContext"];
ui.AppContext.init = function() {
	ui.AppContext.AGENT = null;
	ui.AppContext.LOGGER = new m3.log.Logga(m3.log.LogLevel.DEBUG);
	ui.AppContext.INTRODUCTIONS = new m3.observable.ObservableSet(ui.model.ModelObjWithIid.identifier);
	ui.AppContext.MASTER_NOTIFICATIONS = new m3.observable.ObservableSet(ui.model.ModelObjWithIid.identifier);
	ui.AppContext.NOTIFICATIONS = new m3.observable.FilteredSet(ui.AppContext.MASTER_NOTIFICATIONS,function(a) {
		return !a.deleted && !a.consumed;
	});
	ui.AppContext.MASTER_ALIASES = new m3.observable.ObservableSet(ui.model.ModelObjWithIid.identifier);
	ui.AppContext.ALIASES = new m3.observable.FilteredSet(ui.AppContext.MASTER_ALIASES,function(a) {
		return !a.deleted;
	});
	ui.AppContext.MASTER_CONTENT = new m3.observable.ObservableSet(ui.model.ModelObjWithIid.identifier);
	ui.AppContext.CONTENT = new m3.observable.FilteredSet(ui.AppContext.MASTER_CONTENT,function(c) {
		return !c.deleted;
	});
	ui.AppContext.GROUPED_CONTENT = new m3.observable.GroupedSet(ui.AppContext.CONTENT,function(c) {
		return c.aliasIid;
	});
	ui.AppContext.MASTER_LABELS = new m3.observable.ObservableSet(ui.model.Label.identifier);
	ui.AppContext.LABELS = new m3.observable.FilteredSet(ui.AppContext.MASTER_LABELS,function(c) {
		return !c.deleted;
	});
	ui.AppContext.MASTER_CONNECTIONS = new m3.observable.ObservableSet(ui.model.Connection.identifier);
	ui.AppContext.CONNECTIONS = new m3.observable.FilteredSet(ui.AppContext.MASTER_CONNECTIONS,function(c) {
		return !c.deleted;
	});
	ui.AppContext.MASTER_LABELCHILDREN = new m3.observable.ObservableSet(ui.model.LabelChild.identifier);
	ui.AppContext.LABELCHILDREN = new m3.observable.FilteredSet(ui.AppContext.MASTER_LABELCHILDREN,function(c) {
		return !c.deleted;
	});
	ui.AppContext.GROUPED_LABELCHILDREN = new m3.observable.GroupedSet(ui.AppContext.LABELCHILDREN,function(lc) {
		return lc.parentIid;
	});
	ui.AppContext.MASTER_LABELEDCONTENT = new m3.observable.ObservableSet(ui.model.LabeledContent.identifier);
	ui.AppContext.LABELEDCONTENT = new m3.observable.FilteredSet(ui.AppContext.MASTER_LABELEDCONTENT,function(c) {
		return !c.deleted;
	});
	ui.AppContext.GROUPED_LABELEDCONTENT = new m3.observable.GroupedSet(ui.AppContext.LABELEDCONTENT,function(lc) {
		return lc.contentIid;
	});
	ui.AppContext.SERIALIZER = new m3.serialization.Serializer();
	ui.AppContext.SERIALIZER.addHandler(ui.model.Content,new ui.model.ContentHandler());
	ui.AppContext.registerGlobalListeners();
}
ui.AppContext.registerGlobalListeners = function() {
	new $(js.Browser.window).on("unload",function(evt) {
		ui.model.EM.change(ui.model.EMEvent.PAGE_CLOSE);
	});
	var fitWindowListener = new ui.model.EMListener(function(n) {
		fitWindow();
	},"FitWindowListener");
	var fireFitWindow = new ui.model.EMListener(function(n) {
		ui.model.EM.change(ui.model.EMEvent.FitWindow);
	},"FireFitWindowListener");
	var processContent = new ui.model.EMListener(function(arrOfContent) {
		if(m3.helper.ArrayHelper.hasValues(arrOfContent)) ui.AppContext.MASTER_CONTENT.addAll(arrOfContent);
		ui.model.EM.change(ui.model.EMEvent.FitWindow);
	},"ContentProcessor");
	ui.model.EM.addListener(ui.model.EMEvent.MoreContent,processContent);
	ui.model.EM.addListener(ui.model.EMEvent.EndOfContent,processContent);
	ui.model.EM.addListener(ui.model.EMEvent.FILTER_RUN,new ui.model.EMListener(function(n) {
		ui.AppContext.MASTER_CONTENT.clear();
		ui.model.EM.change(ui.model.EMEvent.FitWindow);
	}));
	ui.model.EM.addListener(ui.model.EMEvent.AGENT,new ui.model.EMListener(function(agent) {
		ui.AppContext.AGENT = agent;
		ui.model.EM.change(ui.model.EMEvent.AliasLoaded,ui.AppContext.currentAlias);
	},"AgentUi-AGENT"));
	ui.model.EM.addListener(ui.model.EMEvent.USER_LOGIN,fireFitWindow);
	ui.model.EM.addListener(ui.model.EMEvent.CreateAgent,fireFitWindow);
	ui.model.EM.addListener(ui.model.EMEvent.FitWindow,fitWindowListener);
}
ui.AppContext.getDescendentLabelChildren = function(iid) {
	var lcs = new Array();
	var getDescendents;
	getDescendents = function(iid1,lcList) {
		var children = new m3.observable.FilteredSet(ui.AppContext.LABELCHILDREN,function(lc) {
			return lc.parentIid == iid1;
		}).asArray();
		var _g1 = 0, _g = children.length;
		while(_g1 < _g) {
			var i = _g1++;
			lcList.push(children[i]);
			getDescendents(children[i].childIid,lcList);
		}
	};
	getDescendents(iid,lcs);
	return lcs;
}
ui.AppContext.getLabelDescendents = function(iid) {
	var labelDescendents = new m3.observable.ObservableSet(ui.model.Label.identifier);
	var getDescendentIids;
	getDescendentIids = function(iid1,iidList) {
		iidList.splice(0,0,iid1);
		var children = new m3.observable.FilteredSet(ui.AppContext.LABELCHILDREN,function(lc) {
			return lc.parentIid == iid1;
		}).asArray();
		var _g1 = 0, _g = children.length;
		while(_g1 < _g) {
			var i = _g1++;
			getDescendentIids(children[i].childIid,iidList);
		}
	};
	var iid_list = new Array();
	getDescendentIids(iid,iid_list);
	var _g = 0;
	while(_g < iid_list.length) {
		var iid_ = iid_list[_g];
		++_g;
		var label = m3.helper.OSetHelper.getElement(ui.AppContext.LABELS,iid_);
		if(label == null) ui.AppContext.LOGGER.error("LabelChild references missing label: " + iid_); else if(!label.deleted) labelDescendents.add(label);
	}
	return labelDescendents;
}
ui.SystemStatus = function() {
	this.lastPong = new Date();
	this.timer = new haxe.Timer(7000);
	this.timer.run = $bind(this,this.onTimer);
};
$hxClasses["ui.SystemStatus"] = ui.SystemStatus;
ui.SystemStatus.__name__ = ["ui","SystemStatus"];
ui.SystemStatus.instance = function() {
	if(ui.SystemStatus._instance == null) ui.SystemStatus._instance = new ui.SystemStatus();
	return ui.SystemStatus._instance;
}
ui.SystemStatus.prototype = {
	onMessage: function() {
		this.lastPong = new Date();
		new $("#disconnected-indicator").attr("src","svg/notification-network-ethernet-connected.svg");
	}
	,onTimer: function() {
		var src = "svg/notification-network-ethernet-connected.svg";
		if(new Date().getTime() - this.lastPong.getTime() > 7000) src = "svg/notification-network-ethernet-disconnected.svg";
		new $("#disconnected-indicator").attr("src",src);
	}
	,__class__: ui.SystemStatus
}
ui.api = {}
ui.api.ProtocolHandler = function() { }
$hxClasses["ui.api.ProtocolHandler"] = ui.api.ProtocolHandler;
ui.api.ProtocolHandler.__name__ = ["ui","api","ProtocolHandler"];
ui.api.ProtocolHandler.prototype = {
	__class__: ui.api.ProtocolHandler
}
ui.api.BennuHandler = function() {
	this.eventDelegate = new ui.api.EventDelegate(this);
};
$hxClasses["ui.api.BennuHandler"] = ui.api.BennuHandler;
ui.api.BennuHandler.__name__ = ["ui","api","BennuHandler"];
ui.api.BennuHandler.__interfaces__ = [ui.api.ProtocolHandler];
ui.api.BennuHandler.prototype = {
	_startPolling: function() {
		var timeout = 10000;
		var ajaxOptions = { contentType : "", type : "GET"};
		this.listeningChannel = new ui.api.LongPollingRequest("",ui.api.ResponseProcessor.processResponse,ajaxOptions);
		this.listeningChannel.timeout = timeout;
		this.listeningChannel.start();
	}
	,onCreateSubmitChannel: function(data,textStatus,jqXHR) {
		ui.AppContext.SUBMIT_CHANNEL = data.id;
		this._startPolling();
		var context = ui.api.Synchronizer.createContext(9,"initialDataLoad");
		var requests = [new ui.api.ChannelRequestMessage(ui.api.BennuHandler.QUERY,context + "agent",new ui.api.QueryMessage("agent","iid='" + this.loggedInAgentId + "'")),new ui.api.ChannelRequestMessage(ui.api.BennuHandler.QUERY,context + "aliases",new ui.api.QueryMessage("alias")),new ui.api.ChannelRequestMessage(ui.api.BennuHandler.QUERY,context + "introductions",new ui.api.QueryMessage("introduction")),new ui.api.ChannelRequestMessage(ui.api.BennuHandler.QUERY,context + "connections",new ui.api.QueryMessage("connection")),new ui.api.ChannelRequestMessage(ui.api.BennuHandler.QUERY,context + "notifications",new ui.api.QueryMessage("notification")),new ui.api.ChannelRequestMessage(ui.api.BennuHandler.QUERY,context + "labels",new ui.api.QueryMessage("label")),new ui.api.ChannelRequestMessage(ui.api.BennuHandler.QUERY,context + "contents",new ui.api.QueryMessage("content")),new ui.api.ChannelRequestMessage(ui.api.BennuHandler.QUERY,context + "labeledContents",new ui.api.QueryMessage("labeledContent")),new ui.api.ChannelRequestMessage(ui.api.BennuHandler.QUERY,context + "labelChildren",new ui.api.QueryMessage("labelChild"))];
		new ui.api.SubmitRequest(requests,this.loggedInAgentId).start();
		var types = ["alias","connection","content","introduction","label","labelchild","labeledcontent"];
		requests = [new ui.api.ChannelRequestMessage(ui.api.BennuHandler.REGISTER,"register-changes",new ui.api.RegisterMessage(types))];
		new ui.api.SubmitRequest(requests,this.loggedInAgentId).start();
		types = ["notification"];
		requests = [new ui.api.ChannelRequestMessage(ui.api.BennuHandler.REGISTER,"register-changes",new ui.api.RegisterMessage(types))];
		new ui.api.SubmitRequest(requests,this.loggedInAgentId).start();
	}
	,deleteLabel: function(data) {
		var labelChildren = new m3.observable.FilteredSet(ui.AppContext.LABELCHILDREN,function(lc) {
			return lc.parentIid == data.parentIid && lc.childIid == data.label.iid;
		}).asArray();
		var context = ui.api.Synchronizer.createContext(labelChildren.length,"labelDeleted");
		var requests = new Array();
		var _g = 0;
		while(_g < labelChildren.length) {
			var lc = labelChildren[_g];
			++_g;
			lc.deleted = true;
			requests.push(new ui.api.ChannelRequestMessage(ui.api.BennuHandler.DELETE,context + "labelChild",ui.api.DeleteMessage.create(lc)));
		}
		new ui.api.SubmitRequest(requests).start();
	}
	,copyLabel: function(data) {
		var lcToAdd = this.getExistingLabelChild(data.newParentId,data.label.iid);
		if(lcToAdd == null) lcToAdd = new ui.model.LabelChild(data.newParentId,data.label.iid); else lcToAdd.deleted = false;
		var context = ui.api.Synchronizer.createContext(1,"labelCopied");
		var req = new ui.api.SubmitRequest([new ui.api.ChannelRequestMessage(ui.api.BennuHandler.UPSERT,context + "labelChild",ui.api.CrudMessage.create(lcToAdd))]);
		req.start();
	}
	,moveLabel: function(data) {
		var lcs = new m3.observable.FilteredSet(ui.AppContext.LABELCHILDREN,function(lc) {
			return lc.parentIid == data.parentIid && lc.childIid == data.label.iid;
		});
		var lcToRemove = this.getExistingLabelChild(data.parentIid,data.label.iid);
		var lcToAdd = this.getExistingLabelChild(data.newParentId,data.label.iid);
		if(lcToAdd == null) lcToAdd = new ui.model.LabelChild(data.newParentId,data.label.iid); else lcToAdd.deleted = false;
		var context = ui.api.Synchronizer.createContext(2,"labelMoved");
		var req = new ui.api.SubmitRequest([new ui.api.ChannelRequestMessage(ui.api.BennuHandler.DELETE,context + "labelChild",ui.api.DeleteMessage.create(lcToRemove)),new ui.api.ChannelRequestMessage(ui.api.BennuHandler.UPSERT,context + "labelChild",ui.api.CrudMessage.create(lcToAdd))]);
		req.start();
	}
	,getExistingLabelChild: function(parentIid,childIid) {
		var lcs = new m3.observable.FilteredSet(ui.AppContext.MASTER_LABELCHILDREN,function(lc) {
			return lc.parentIid == parentIid && lc.childIid == childIid;
		});
		return lcs.iterator().next();
	}
	,updateLabel: function(data) {
		var context = ui.api.Synchronizer.createContext(1,"labelUpdated");
		var req = new ui.api.SubmitRequest([new ui.api.ChannelRequestMessage(ui.api.BennuHandler.UPSERT,context + "label",ui.api.CrudMessage.create(data.label))]);
		req.start();
	}
	,createLabel: function(data) {
		var lc = new ui.model.LabelChild(data.parentIid,data.label.iid);
		var context = ui.api.Synchronizer.createContext(2,"labelCreated");
		var req = new ui.api.SubmitRequest([new ui.api.ChannelRequestMessage(ui.api.BennuHandler.UPSERT,context + "label",ui.api.CrudMessage.create(data.label)),new ui.api.ChannelRequestMessage(ui.api.BennuHandler.UPSERT,context + "labelChild",ui.api.CrudMessage.create(lc))]);
		req.start();
	}
	,deleteContent: function(data) {
		var context = ui.api.Synchronizer.createContext(1 + data.labels.length,"contentDeleted");
		var requests = new Array();
		data.content.deleted = true;
		requests.push(new ui.api.ChannelRequestMessage(ui.api.BennuHandler.DELETE,context + "content",ui.api.CrudMessage.create(data.content)));
		var $it0 = ui.AppContext.GROUPED_LABELEDCONTENT.delegate().get(data.content.iid).iterator();
		while( $it0.hasNext() ) {
			var lc = $it0.next();
			lc.deleted = true;
			requests.push(new ui.api.ChannelRequestMessage(ui.api.BennuHandler.DELETE,context + "labeledContent",ui.api.DeleteMessage.create(lc)));
		}
		new ui.api.SubmitRequest(requests).start();
	}
	,updateContent: function(data) {
		var currentLabels = ui.AppContext.GROUPED_LABELEDCONTENT.delegate().get(data.content.iid);
		var labelsToDelete = new Array();
		var $it0 = currentLabels.iterator();
		while( $it0.hasNext() ) {
			var labeledContent = $it0.next();
			var found = false;
			var _g = 0, _g1 = data.labels;
			while(_g < _g1.length) {
				var label = _g1[_g];
				++_g;
				if(label.iid == labeledContent.labelIid) {
					found = true;
					break;
				}
			}
			if(!found) labelsToDelete.push(labeledContent);
		}
		var labelsToAdd = new Array();
		var _g = 0, _g1 = data.labels;
		while(_g < _g1.length) {
			var label = _g1[_g];
			++_g;
			var found = false;
			var $it1 = currentLabels.iterator();
			while( $it1.hasNext() ) {
				var labeledContent = $it1.next();
				if(label.iid == labeledContent.labelIid) {
					found = true;
					break;
				}
			}
			if(!found) labelsToAdd.push(new ui.model.LabeledContent(data.content.iid,label.iid));
		}
		var context = ui.api.Synchronizer.createContext(1 + labelsToAdd.length + labelsToDelete.length,"contentUpdated");
		var requests = new Array();
		requests.push(new ui.api.ChannelRequestMessage(ui.api.BennuHandler.UPSERT,context + "content",ui.api.CrudMessage.create(data.content)));
		var _g = 0;
		while(_g < labelsToDelete.length) {
			var lc = labelsToDelete[_g];
			++_g;
			lc.deleted = true;
			requests.push(new ui.api.ChannelRequestMessage(ui.api.BennuHandler.DELETE,context + "labeledContent",ui.api.DeleteMessage.create(lc)));
		}
		var _g = 0;
		while(_g < labelsToAdd.length) {
			var lc = labelsToAdd[_g];
			++_g;
			requests.push(new ui.api.ChannelRequestMessage(ui.api.BennuHandler.UPSERT,context + "labeledContent",ui.api.CrudMessage.create(lc)));
		}
		new ui.api.SubmitRequest(requests).start();
	}
	,createContent: function(data) {
		var context = ui.api.Synchronizer.createContext(1 + data.labels.length,"contentCreated");
		var requests = new Array();
		requests.push(new ui.api.ChannelRequestMessage(ui.api.BennuHandler.UPSERT,context + "content",ui.api.CrudMessage.create(data.content)));
		var _g = 0, _g1 = data.labels;
		while(_g < _g1.length) {
			var label = _g1[_g];
			++_g;
			var labeledContent = new ui.model.LabeledContent(data.content.iid,label.iid);
			requests.push(new ui.api.ChannelRequestMessage(ui.api.BennuHandler.UPSERT,context + "labeledContent",ui.api.CrudMessage.create(labeledContent)));
		}
		new ui.api.SubmitRequest(requests).start();
	}
	,deleteAlias: function(alias) {
		alias.deleted = true;
		var context = ui.api.Synchronizer.createContext(1,"aliasDeleted");
		new ui.api.SubmitRequest([new ui.api.ChannelRequestMessage(ui.api.BennuHandler.DELETE,context + "alias",ui.api.DeleteMessage.create(alias))]).start();
		var data = new ui.model.EditLabelData(ui.AppContext.LABELS.delegate().get(alias.rootLabelIid),ui.AppContext.UBER_LABEL.iid);
		this.deleteLabel(data);
	}
	,updateAlias: function(alias) {
		var context = ui.api.Synchronizer.createContext(1,"aliasUpdated");
		var req = new ui.api.SubmitRequest([new ui.api.ChannelRequestMessage(ui.api.BennuHandler.UPSERT,context + "alias",ui.api.CrudMessage.create(alias))]);
		req.start();
	}
	,createAlias: function(alias) {
		var label = new ui.model.Label(alias.name);
		label.data.color = "#000000";
		var lc = new ui.model.LabelChild(ui.AppContext.UBER_LABEL.iid,label.iid);
		alias.rootLabelIid = label.iid;
		var context = ui.api.Synchronizer.createContext(3,"aliasCreated");
		var req = new ui.api.SubmitRequest([new ui.api.ChannelRequestMessage(ui.api.BennuHandler.UPSERT,context + "alias",ui.api.CrudMessage.create(alias)),new ui.api.ChannelRequestMessage(ui.api.BennuHandler.UPSERT,context + "label",ui.api.CrudMessage.create(label)),new ui.api.ChannelRequestMessage(ui.api.BennuHandler.UPSERT,context + "labelChild",ui.api.CrudMessage.create(lc))]);
		req.start();
	}
	,nextPage: function(nextPageURI) {
		throw new m3.exception.Exception("E_NOTIMPLEMENTED");
	}
	,stopCurrentFilter: function(onSuccessOrError,async) {
		if(async == null) async = true;
		throw new m3.exception.Exception("E_NOTIMPLEMENTED");
	}
	,filter: function(filter) {
		throw new m3.exception.Exception("E_NOTIMPLEMENTED");
	}
	,restores: function() {
		throw new m3.exception.Exception("E_NOTIMPLEMENTED");
	}
	,restore: function() {
		throw new m3.exception.Exception("E_NOTIMPLEMENTED");
	}
	,backup: function() {
		throw new m3.exception.Exception("E_NOTIMPLEMENTED");
	}
	,confirmIntroduction: function(confirmation) {
		var context = ui.api.Synchronizer.createContext(1,"confirmIntroduction");
		var req = new ui.api.SubmitRequest([new ui.api.ChannelRequestMessage(ui.api.BennuHandler.INTRO_RESPONSE,context + "introduction",ui.api.CrudMessage.create(confirmation))]);
		req.start();
	}
	,beginIntroduction: function(intro) {
		var context = ui.api.Synchronizer.createContext(1,"beginIntroduction");
		var req = new ui.api.SubmitRequest([new ui.api.ChannelRequestMessage(ui.api.BennuHandler.INTRODUCE,context + "introduction",ui.api.CrudMessage.create(intro))]);
		req.start();
	}
	,createAgent: function(newUser) {
		var req = new ui.api.BennuRequest("/api/agent/create/" + newUser.name,"",function(data,textStatus,jqXHR) {
			js.Lib.alert(data);
			ui.model.EM.change(ui.model.EMEvent.USER_SIGNUP,"");
		});
		req.start();
	}
	,getAgent: function(login) {
		this.loggedInAgentId = login.agentId;
		new ui.api.BennuRequest("/api/channel/create/" + login.agentId,"",$bind(this,this.onCreateSubmitChannel)).start();
	}
	,__class__: ui.api.BennuHandler
}
ui.api.ChannelMessage = function() { }
$hxClasses["ui.api.ChannelMessage"] = ui.api.ChannelMessage;
ui.api.ChannelMessage.__name__ = ["ui","api","ChannelMessage"];
ui.api.BennuMessage = function(type) {
	this.type = type;
};
$hxClasses["ui.api.BennuMessage"] = ui.api.BennuMessage;
ui.api.BennuMessage.__name__ = ["ui","api","BennuMessage"];
ui.api.BennuMessage.__interfaces__ = [ui.api.ChannelMessage];
ui.api.BennuMessage.prototype = {
	__class__: ui.api.BennuMessage
}
ui.api.DeleteMessage = function(type,primaryKey) {
	ui.api.BennuMessage.call(this,type);
	this.primaryKey = primaryKey;
};
$hxClasses["ui.api.DeleteMessage"] = ui.api.DeleteMessage;
ui.api.DeleteMessage.__name__ = ["ui","api","DeleteMessage"];
ui.api.DeleteMessage.create = function(object) {
	return new ui.api.DeleteMessage(object.objectType(),object.iid);
}
ui.api.DeleteMessage.__super__ = ui.api.BennuMessage;
ui.api.DeleteMessage.prototype = $extend(ui.api.BennuMessage.prototype,{
	__class__: ui.api.DeleteMessage
});
ui.api.CrudMessage = function(type,instance) {
	ui.api.BennuMessage.call(this,type);
	this.instance = instance;
};
$hxClasses["ui.api.CrudMessage"] = ui.api.CrudMessage;
ui.api.CrudMessage.__name__ = ["ui","api","CrudMessage"];
ui.api.CrudMessage.create = function(object) {
	var instance = ui.AppContext.SERIALIZER.toJson(object);
	return new ui.api.CrudMessage(object.objectType(),instance);
}
ui.api.CrudMessage.__super__ = ui.api.BennuMessage;
ui.api.CrudMessage.prototype = $extend(ui.api.BennuMessage.prototype,{
	__class__: ui.api.CrudMessage
});
ui.api.QueryMessage = function(type,q) {
	if(q == null) q = "1=1";
	ui.api.BennuMessage.call(this,type);
	this.q = q;
};
$hxClasses["ui.api.QueryMessage"] = ui.api.QueryMessage;
ui.api.QueryMessage.__name__ = ["ui","api","QueryMessage"];
ui.api.QueryMessage.__super__ = ui.api.BennuMessage;
ui.api.QueryMessage.prototype = $extend(ui.api.BennuMessage.prototype,{
	__class__: ui.api.QueryMessage
});
ui.api.RegisterMessage = function(types) {
	this.types = types;
};
$hxClasses["ui.api.RegisterMessage"] = ui.api.RegisterMessage;
ui.api.RegisterMessage.__name__ = ["ui","api","RegisterMessage"];
ui.api.RegisterMessage.__interfaces__ = [ui.api.ChannelMessage];
ui.api.RegisterMessage.prototype = {
	__class__: ui.api.RegisterMessage
}
ui.api.ChannelRequestMessage = function(path,context,msg) {
	this.path = path;
	this.context = context;
	this.parms = ui.AppContext.SERIALIZER.toJson(msg);
};
$hxClasses["ui.api.ChannelRequestMessage"] = ui.api.ChannelRequestMessage;
ui.api.ChannelRequestMessage.__name__ = ["ui","api","ChannelRequestMessage"];
ui.api.ChannelRequestMessage.prototype = {
	__class__: ui.api.ChannelRequestMessage
}
ui.api.ChannelRequestMessageBundle = function(requests_,agentId) {
	this.agentId = agentId;
	if(this.agentId == null) this.agentId = ui.AppContext.AGENT.iid;
	this.channel = ui.AppContext.SUBMIT_CHANNEL;
	if(requests_ == null) this.requests = new Array(); else this.requests = requests_;
};
$hxClasses["ui.api.ChannelRequestMessageBundle"] = ui.api.ChannelRequestMessageBundle;
ui.api.ChannelRequestMessageBundle.__name__ = ["ui","api","ChannelRequestMessageBundle"];
ui.api.ChannelRequestMessageBundle.prototype = {
	addRequest: function(path,context,parms) {
		var request = new ui.api.ChannelRequestMessage(path,context,parms);
		this.addChannelRequest(request);
	}
	,addChannelRequest: function(request) {
		this.requests.push(request);
	}
	,__class__: ui.api.ChannelRequestMessageBundle
}
ui.api.DeregisterChannelListenerData = function(handle) {
	this.handle = handle;
};
$hxClasses["ui.api.DeregisterChannelListenerData"] = ui.api.DeregisterChannelListenerData;
ui.api.DeregisterChannelListenerData.__name__ = ["ui","api","DeregisterChannelListenerData"];
ui.api.DeregisterChannelListenerData.prototype = {
	__class__: ui.api.DeregisterChannelListenerData
}
ui.api.EventDelegate = function(protocolHandler) {
	this.filterIsRunning = false;
	this.protocolHandler = protocolHandler;
	this._setUpEventListeners();
};
$hxClasses["ui.api.EventDelegate"] = ui.api.EventDelegate;
ui.api.EventDelegate.__name__ = ["ui","api","EventDelegate"];
ui.api.EventDelegate.prototype = {
	_setUpEventListeners: function() {
		var _g = this;
		ui.model.EM.addListener(ui.model.EMEvent.FILTER_RUN,new ui.model.EMListener(function(filter) {
			if(_g.filterIsRunning) _g.protocolHandler.stopCurrentFilter(function() {
				_g.protocolHandler.filter(filter);
			}); else _g.protocolHandler.filter(filter);
			_g.filterIsRunning = true;
		}));
		ui.model.EM.addListener(ui.model.EMEvent.PAGE_CLOSE,new ui.model.EMListener(function(n) {
			if(_g.filterIsRunning) _g.protocolHandler.stopCurrentFilter($.noop,false);
		}));
		ui.model.EM.addListener(ui.model.EMEvent.EndOfContent,new ui.model.EMListener(function(nextPageURI) {
			_g.filterIsRunning = false;
		}));
		ui.model.EM.addListener(ui.model.EMEvent.NextContent,new ui.model.EMListener(function(nextPageURI) {
			_g.protocolHandler.nextPage(nextPageURI);
		}));
		ui.model.EM.addListener(ui.model.EMEvent.CreateAlias,new ui.model.EMListener(function(alias) {
			_g.protocolHandler.createAlias(alias);
		}));
		ui.model.EM.addListener(ui.model.EMEvent.DeleteAlias,new ui.model.EMListener(function(alias) {
			_g.protocolHandler.deleteAlias(alias);
		}));
		ui.model.EM.addListener(ui.model.EMEvent.UpdateAlias,new ui.model.EMListener(function(alias) {
			_g.protocolHandler.updateAlias(alias);
		}));
		ui.model.EM.addListener(ui.model.EMEvent.USER_LOGIN,new ui.model.EMListener(function(login) {
			_g.protocolHandler.getAgent(login);
		}));
		ui.model.EM.addListener(ui.model.EMEvent.CreateAgent,new ui.model.EMListener(function(user) {
			_g.protocolHandler.createAgent(user);
		}));
		ui.model.EM.addListener(ui.model.EMEvent.CreateContent,new ui.model.EMListener(function(data) {
			_g.protocolHandler.createContent(data);
		}));
		ui.model.EM.addListener(ui.model.EMEvent.UpdateContent,new ui.model.EMListener(function(data) {
			_g.protocolHandler.updateContent(data);
		}));
		ui.model.EM.addListener(ui.model.EMEvent.CreateLabel,new ui.model.EMListener(function(data) {
			_g.protocolHandler.createLabel(data);
		}));
		ui.model.EM.addListener(ui.model.EMEvent.UpdateLabel,new ui.model.EMListener(function(data) {
			_g.protocolHandler.updateLabel(data);
		}));
		ui.model.EM.addListener(ui.model.EMEvent.MoveLabel,new ui.model.EMListener(function(data) {
			_g.protocolHandler.moveLabel(data);
		}));
		ui.model.EM.addListener(ui.model.EMEvent.CopyLabel,new ui.model.EMListener(function(data) {
			_g.protocolHandler.copyLabel(data);
		}));
		ui.model.EM.addListener(ui.model.EMEvent.DeleteLabel,new ui.model.EMListener(function(data) {
			_g.protocolHandler.deleteLabel(data);
		}));
		ui.model.EM.addListener(ui.model.EMEvent.INTRODUCTION_REQUEST,new ui.model.EMListener(function(intro) {
			_g.protocolHandler.beginIntroduction(intro);
		}));
		ui.model.EM.addListener(ui.model.EMEvent.TARGET_CHANGE,new ui.model.EMListener(function(conn) {
		}));
		ui.model.EM.addListener(ui.model.EMEvent.BACKUP,new ui.model.EMListener(function(n) {
			_g.protocolHandler.backup();
		}));
		ui.model.EM.addListener(ui.model.EMEvent.RESTORE,new ui.model.EMListener(function(n) {
			_g.protocolHandler.restore();
		}));
	}
	,__class__: ui.api.EventDelegate
}
ui.api.HasContent = function() { }
$hxClasses["ui.api.HasContent"] = ui.api.HasContent;
ui.api.HasContent.__name__ = ["ui","api","HasContent"];
ui.api.HasContent.prototype = {
	__class__: ui.api.HasContent
}
ui.api.ProtocolMessage = function(msgType,type) {
	this.msgType = msgType;
	this.type = type;
	this.contentImpl = Type.createInstance(type,[]);
};
$hxClasses["ui.api.ProtocolMessage"] = ui.api.ProtocolMessage;
ui.api.ProtocolMessage.__name__ = ["ui","api","ProtocolMessage"];
ui.api.ProtocolMessage.prototype = {
	writeResolve: function() {
		this.content = ui.AppContext.SERIALIZER.toJson(this.contentImpl);
	}
	,readResolve: function() {
		this.contentImpl = ui.AppContext.SERIALIZER.fromJsonX(this.content,this.type);
	}
	,__class__: ui.api.ProtocolMessage
}
ui.api.Payload = function() {
};
$hxClasses["ui.api.Payload"] = ui.api.Payload;
ui.api.Payload.__name__ = ["ui","api","Payload"];
ui.api.Payload.prototype = {
	__class__: ui.api.Payload
}
ui.api.PayloadWithSessionURI = function() {
	ui.api.Payload.call(this);
};
$hxClasses["ui.api.PayloadWithSessionURI"] = ui.api.PayloadWithSessionURI;
ui.api.PayloadWithSessionURI.__name__ = ["ui","api","PayloadWithSessionURI"];
ui.api.PayloadWithSessionURI.__super__ = ui.api.Payload;
ui.api.PayloadWithSessionURI.prototype = $extend(ui.api.Payload.prototype,{
	__class__: ui.api.PayloadWithSessionURI
});
ui.api.PayloadWithReason = function() {
	ui.api.Payload.call(this);
};
$hxClasses["ui.api.PayloadWithReason"] = ui.api.PayloadWithReason;
ui.api.PayloadWithReason.__name__ = ["ui","api","PayloadWithReason"];
ui.api.PayloadWithReason.__super__ = ui.api.Payload;
ui.api.PayloadWithReason.prototype = $extend(ui.api.Payload.prototype,{
	__class__: ui.api.PayloadWithReason
});
ui.api.ErrorPayload = function() {
	ui.api.PayloadWithSessionURI.call(this);
};
$hxClasses["ui.api.ErrorPayload"] = ui.api.ErrorPayload;
ui.api.ErrorPayload.__name__ = ["ui","api","ErrorPayload"];
ui.api.ErrorPayload.__super__ = ui.api.PayloadWithSessionURI;
ui.api.ErrorPayload.prototype = $extend(ui.api.PayloadWithSessionURI.prototype,{
	__class__: ui.api.ErrorPayload
});
ui.api.ConfirmUserToken = function() {
	ui.api.ProtocolMessage.call(this,ui.api.MsgType.confirmEmailToken,ui.api.ConfirmUserTokenData);
};
$hxClasses["ui.api.ConfirmUserToken"] = ui.api.ConfirmUserToken;
ui.api.ConfirmUserToken.__name__ = ["ui","api","ConfirmUserToken"];
ui.api.ConfirmUserToken.__super__ = ui.api.ProtocolMessage;
ui.api.ConfirmUserToken.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	__class__: ui.api.ConfirmUserToken
});
ui.api.ConfirmUserTokenData = function() {
	ui.api.Payload.call(this);
};
$hxClasses["ui.api.ConfirmUserTokenData"] = ui.api.ConfirmUserTokenData;
ui.api.ConfirmUserTokenData.__name__ = ["ui","api","ConfirmUserTokenData"];
ui.api.ConfirmUserTokenData.__super__ = ui.api.Payload;
ui.api.ConfirmUserTokenData.prototype = $extend(ui.api.Payload.prototype,{
	__class__: ui.api.ConfirmUserTokenData
});
ui.api.InitializeSessionRequest = function() {
	ui.api.ProtocolMessage.call(this,ui.api.MsgType.initializeSessionRequest,ui.api.InitializeSessionRequestData);
};
$hxClasses["ui.api.InitializeSessionRequest"] = ui.api.InitializeSessionRequest;
ui.api.InitializeSessionRequest.__name__ = ["ui","api","InitializeSessionRequest"];
ui.api.InitializeSessionRequest.__super__ = ui.api.ProtocolMessage;
ui.api.InitializeSessionRequest.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	__class__: ui.api.InitializeSessionRequest
});
ui.api.InitializeSessionRequestData = function() {
	ui.api.Payload.call(this);
};
$hxClasses["ui.api.InitializeSessionRequestData"] = ui.api.InitializeSessionRequestData;
ui.api.InitializeSessionRequestData.__name__ = ["ui","api","InitializeSessionRequestData"];
ui.api.InitializeSessionRequestData.__super__ = ui.api.Payload;
ui.api.InitializeSessionRequestData.prototype = $extend(ui.api.Payload.prototype,{
	__class__: ui.api.InitializeSessionRequestData
});
ui.api.InitializeSessionResponse = function() {
	ui.api.ProtocolMessage.call(this,ui.api.MsgType.initializeSessionResponse,ui.api.InitializeSessionResponseData);
};
$hxClasses["ui.api.InitializeSessionResponse"] = ui.api.InitializeSessionResponse;
ui.api.InitializeSessionResponse.__name__ = ["ui","api","InitializeSessionResponse"];
ui.api.InitializeSessionResponse.__super__ = ui.api.ProtocolMessage;
ui.api.InitializeSessionResponse.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	__class__: ui.api.InitializeSessionResponse
});
ui.api.InitializeSessionResponseData = function() {
	ui.api.Payload.call(this);
};
$hxClasses["ui.api.InitializeSessionResponseData"] = ui.api.InitializeSessionResponseData;
ui.api.InitializeSessionResponseData.__name__ = ["ui","api","InitializeSessionResponseData"];
ui.api.InitializeSessionResponseData.__super__ = ui.api.Payload;
ui.api.InitializeSessionResponseData.prototype = $extend(ui.api.Payload.prototype,{
	get_labels: function() {
		if(m3.helper.ArrayHelper.hasValues(this.listOfLabels)) {
			var labels = [];
			var i;
			var _g1 = 0, _g = this.listOfLabels.length;
			while(_g1 < _g) {
				var i1 = _g1++;
				labels = labels.concat(ui.helper.PrologHelper.tagTreeFromString(this.listOfLabels[i1]));
			}
			return labels;
		} else return null;
	}
	,__class__: ui.api.InitializeSessionResponseData
});
ui.api.InitializeSessionError = function() {
	ui.api.ProtocolMessage.call(this,ui.api.MsgType.initializeSessionError,ui.api.PayloadWithReason);
};
$hxClasses["ui.api.InitializeSessionError"] = ui.api.InitializeSessionError;
ui.api.InitializeSessionError.__name__ = ["ui","api","InitializeSessionError"];
ui.api.InitializeSessionError.__super__ = ui.api.ProtocolMessage;
ui.api.InitializeSessionError.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	__class__: ui.api.InitializeSessionError
});
ui.api.CloseSessionRequest = function() {
	ui.api.ProtocolMessage.call(this,ui.api.MsgType.closeSessionRequest,ui.api.PayloadWithSessionURI);
};
$hxClasses["ui.api.CloseSessionRequest"] = ui.api.CloseSessionRequest;
ui.api.CloseSessionRequest.__name__ = ["ui","api","CloseSessionRequest"];
ui.api.CloseSessionRequest.__super__ = ui.api.ProtocolMessage;
ui.api.CloseSessionRequest.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	__class__: ui.api.CloseSessionRequest
});
ui.api.CloseSessionResponse = function() {
	ui.api.ProtocolMessage.call(this,ui.api.MsgType.closeSessionResponse,ui.api.PayloadWithSessionURI);
};
$hxClasses["ui.api.CloseSessionResponse"] = ui.api.CloseSessionResponse;
ui.api.CloseSessionResponse.__name__ = ["ui","api","CloseSessionResponse"];
ui.api.CloseSessionResponse.__super__ = ui.api.ProtocolMessage;
ui.api.CloseSessionResponse.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	__class__: ui.api.CloseSessionResponse
});
ui.api.FeedExpr = function() {
	ui.api.ProtocolMessage.call(this,ui.api.MsgType.feedExpr,ui.api.FeedExprData);
};
$hxClasses["ui.api.FeedExpr"] = ui.api.FeedExpr;
ui.api.FeedExpr.__name__ = ["ui","api","FeedExpr"];
ui.api.FeedExpr.__super__ = ui.api.ProtocolMessage;
ui.api.FeedExpr.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	__class__: ui.api.FeedExpr
});
ui.api.FeedExprData = function() {
	ui.api.Payload.call(this);
};
$hxClasses["ui.api.FeedExprData"] = ui.api.FeedExprData;
ui.api.FeedExprData.__name__ = ["ui","api","FeedExprData"];
ui.api.FeedExprData.__super__ = ui.api.Payload;
ui.api.FeedExprData.prototype = $extend(ui.api.Payload.prototype,{
	__class__: ui.api.FeedExprData
});
ui.api.BackupRequest = function() {
	ui.api.ProtocolMessage.call(this,ui.api.MsgType.backupRequest,ui.api.BackupData);
};
$hxClasses["ui.api.BackupRequest"] = ui.api.BackupRequest;
ui.api.BackupRequest.__name__ = ["ui","api","BackupRequest"];
ui.api.BackupRequest.__super__ = ui.api.ProtocolMessage;
ui.api.BackupRequest.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	__class__: ui.api.BackupRequest
});
ui.api.BackupData = function() {
	ui.api.PayloadWithSessionURI.call(this);
};
$hxClasses["ui.api.BackupData"] = ui.api.BackupData;
ui.api.BackupData.__name__ = ["ui","api","BackupData"];
ui.api.BackupData.__super__ = ui.api.PayloadWithSessionURI;
ui.api.BackupData.prototype = $extend(ui.api.PayloadWithSessionURI.prototype,{
	__class__: ui.api.BackupData
});
ui.api.RestoreRequest = function() {
	ui.api.ProtocolMessage.call(this,ui.api.MsgType.restoreRequest,ui.api.BackupData);
};
$hxClasses["ui.api.RestoreRequest"] = ui.api.RestoreRequest;
ui.api.RestoreRequest.__name__ = ["ui","api","RestoreRequest"];
ui.api.RestoreRequest.__super__ = ui.api.ProtocolMessage;
ui.api.RestoreRequest.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	__class__: ui.api.RestoreRequest
});
ui.api.RestoresRequest = function() {
	ui.api.ProtocolMessage.call(this,ui.api.MsgType.restoresRequest,ui.api.PayloadWithSessionURI);
};
$hxClasses["ui.api.RestoresRequest"] = ui.api.RestoresRequest;
ui.api.RestoresRequest.__name__ = ["ui","api","RestoresRequest"];
ui.api.RestoresRequest.__super__ = ui.api.ProtocolMessage;
ui.api.RestoresRequest.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	__class__: ui.api.RestoresRequest
});
ui.api.RestoresResponse = function() {
	ui.api.ProtocolMessage.call(this,ui.api.MsgType.restoresResponse,ui.api.RestoresData);
};
$hxClasses["ui.api.RestoresResponse"] = ui.api.RestoresResponse;
ui.api.RestoresResponse.__name__ = ["ui","api","RestoresResponse"];
ui.api.RestoresResponse.__super__ = ui.api.ProtocolMessage;
ui.api.RestoresResponse.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	__class__: ui.api.RestoresResponse
});
ui.api.RestoresData = function() {
	ui.api.Payload.call(this);
};
$hxClasses["ui.api.RestoresData"] = ui.api.RestoresData;
ui.api.RestoresData.__name__ = ["ui","api","RestoresData"];
ui.api.RestoresData.__super__ = ui.api.Payload;
ui.api.RestoresData.prototype = $extend(ui.api.Payload.prototype,{
	__class__: ui.api.RestoresData
});
ui.api.MsgType = $hxClasses["ui.api.MsgType"] = { __ename__ : ["ui","api","MsgType"], __constructs__ : ["initializeSessionRequest","initializeSessionResponse","initializeSessionError","closeSessionRequest","closeSessionResponse","confirmEmailToken","feedExpr","beginIntroductionRequest","beginIntroductionResponse","introductionNotification","introductionConfirmationRequest","introductionConfirmationResponse","connectNotification","backupRequest","backupResponse","restoresRequest","restoresResponse","restoreRequest","restoreResponse","crudMessage"] }
ui.api.MsgType.initializeSessionRequest = ["initializeSessionRequest",0];
ui.api.MsgType.initializeSessionRequest.toString = $estr;
ui.api.MsgType.initializeSessionRequest.__enum__ = ui.api.MsgType;
ui.api.MsgType.initializeSessionResponse = ["initializeSessionResponse",1];
ui.api.MsgType.initializeSessionResponse.toString = $estr;
ui.api.MsgType.initializeSessionResponse.__enum__ = ui.api.MsgType;
ui.api.MsgType.initializeSessionError = ["initializeSessionError",2];
ui.api.MsgType.initializeSessionError.toString = $estr;
ui.api.MsgType.initializeSessionError.__enum__ = ui.api.MsgType;
ui.api.MsgType.closeSessionRequest = ["closeSessionRequest",3];
ui.api.MsgType.closeSessionRequest.toString = $estr;
ui.api.MsgType.closeSessionRequest.__enum__ = ui.api.MsgType;
ui.api.MsgType.closeSessionResponse = ["closeSessionResponse",4];
ui.api.MsgType.closeSessionResponse.toString = $estr;
ui.api.MsgType.closeSessionResponse.__enum__ = ui.api.MsgType;
ui.api.MsgType.confirmEmailToken = ["confirmEmailToken",5];
ui.api.MsgType.confirmEmailToken.toString = $estr;
ui.api.MsgType.confirmEmailToken.__enum__ = ui.api.MsgType;
ui.api.MsgType.feedExpr = ["feedExpr",6];
ui.api.MsgType.feedExpr.toString = $estr;
ui.api.MsgType.feedExpr.__enum__ = ui.api.MsgType;
ui.api.MsgType.beginIntroductionRequest = ["beginIntroductionRequest",7];
ui.api.MsgType.beginIntroductionRequest.toString = $estr;
ui.api.MsgType.beginIntroductionRequest.__enum__ = ui.api.MsgType;
ui.api.MsgType.beginIntroductionResponse = ["beginIntroductionResponse",8];
ui.api.MsgType.beginIntroductionResponse.toString = $estr;
ui.api.MsgType.beginIntroductionResponse.__enum__ = ui.api.MsgType;
ui.api.MsgType.introductionNotification = ["introductionNotification",9];
ui.api.MsgType.introductionNotification.toString = $estr;
ui.api.MsgType.introductionNotification.__enum__ = ui.api.MsgType;
ui.api.MsgType.introductionConfirmationRequest = ["introductionConfirmationRequest",10];
ui.api.MsgType.introductionConfirmationRequest.toString = $estr;
ui.api.MsgType.introductionConfirmationRequest.__enum__ = ui.api.MsgType;
ui.api.MsgType.introductionConfirmationResponse = ["introductionConfirmationResponse",11];
ui.api.MsgType.introductionConfirmationResponse.toString = $estr;
ui.api.MsgType.introductionConfirmationResponse.__enum__ = ui.api.MsgType;
ui.api.MsgType.connectNotification = ["connectNotification",12];
ui.api.MsgType.connectNotification.toString = $estr;
ui.api.MsgType.connectNotification.__enum__ = ui.api.MsgType;
ui.api.MsgType.backupRequest = ["backupRequest",13];
ui.api.MsgType.backupRequest.toString = $estr;
ui.api.MsgType.backupRequest.__enum__ = ui.api.MsgType;
ui.api.MsgType.backupResponse = ["backupResponse",14];
ui.api.MsgType.backupResponse.toString = $estr;
ui.api.MsgType.backupResponse.__enum__ = ui.api.MsgType;
ui.api.MsgType.restoresRequest = ["restoresRequest",15];
ui.api.MsgType.restoresRequest.toString = $estr;
ui.api.MsgType.restoresRequest.__enum__ = ui.api.MsgType;
ui.api.MsgType.restoresResponse = ["restoresResponse",16];
ui.api.MsgType.restoresResponse.toString = $estr;
ui.api.MsgType.restoresResponse.__enum__ = ui.api.MsgType;
ui.api.MsgType.restoreRequest = ["restoreRequest",17];
ui.api.MsgType.restoreRequest.toString = $estr;
ui.api.MsgType.restoreRequest.__enum__ = ui.api.MsgType;
ui.api.MsgType.restoreResponse = ["restoreResponse",18];
ui.api.MsgType.restoreResponse.toString = $estr;
ui.api.MsgType.restoreResponse.__enum__ = ui.api.MsgType;
ui.api.MsgType.crudMessage = ["crudMessage",19];
ui.api.MsgType.crudMessage.toString = $estr;
ui.api.MsgType.crudMessage.__enum__ = ui.api.MsgType;
ui.api.Reason = $hxClasses["ui.api.Reason"] = { __ename__ : ["ui","api","Reason"], __constructs__ : [] }
ui.api.Requester = function() { }
$hxClasses["ui.api.Requester"] = ui.api.Requester;
ui.api.Requester.__name__ = ["ui","api","Requester"];
ui.api.Requester.prototype = {
	__class__: ui.api.Requester
}
ui.api.BaseRequest = function(requestData,successFcn,errorFcn) {
	this.requestData = requestData;
	this.onSuccess = successFcn;
	this.onError = errorFcn;
};
$hxClasses["ui.api.BaseRequest"] = ui.api.BaseRequest;
ui.api.BaseRequest.__name__ = ["ui","api","BaseRequest"];
ui.api.BaseRequest.prototype = {
	abort: function() {
	}
	,start: function(opts) {
		var _g = this;
		var ajaxOpts = { dataType : "json", contentType : "application/json", data : this.requestData, type : "POST", success : function(data,textStatus,jqXHR) {
			ui.SystemStatus.instance().onMessage();
			_g.onSuccess(data,textStatus,jqXHR);
		}, error : function(jqXHR,textStatus,errorThrown) {
			var error_message = "";
			if(errorThrown == null || js.Boot.__instanceof(errorThrown,String)) {
				error_message = errorThrown;
				if(jqXHR.message != null) error_message = jqXHR.message; else if(jqXHR.responseText != null && jqXHR.responseText.charAt(0) != "<") error_message = jqXHR.responseText;
			} else error_message = textStatus + ":  " + Std.string(errorThrown.message);
			if(_g.onError != null) _g.onError(jqXHR,textStatus,errorThrown); else {
				m3.util.JqueryUtil.alert("There was an error making your request:  " + error_message);
				throw new m3.exception.Exception("Error executing ajax call | Response Code: " + jqXHR.status + " | " + error_message);
			}
		}};
		$.extend(ajaxOpts,this.baseOpts);
		if(opts != null) $.extend(ajaxOpts,opts);
		return $.ajax(ajaxOpts);
	}
	,__class__: ui.api.BaseRequest
}
ui.api.BennuRequest = function(path,data,successFcn) {
	this.baseOpts = { async : true, url : ui.AgentUi.URL + path};
	ui.api.BaseRequest.call(this,data,successFcn);
};
$hxClasses["ui.api.BennuRequest"] = ui.api.BennuRequest;
ui.api.BennuRequest.__name__ = ["ui","api","BennuRequest"];
ui.api.BennuRequest.__interfaces__ = [ui.api.Requester];
ui.api.BennuRequest.__super__ = ui.api.BaseRequest;
ui.api.BennuRequest.prototype = $extend(ui.api.BaseRequest.prototype,{
	__class__: ui.api.BennuRequest
});
ui.api.SubmitRequest = function(msgs,agentId,successFcn) {
	this.baseOpts = { dataType : "text", async : true, url : ui.AgentUi.URL + "/api/channel/submit"};
	if(successFcn == null) successFcn = function(data,textStatus,jqXHR) {
	};
	var bundle = new ui.api.ChannelRequestMessageBundle(msgs,agentId);
	var data = ui.AppContext.SERIALIZER.toJsonString(bundle);
	ui.api.BaseRequest.call(this,data,successFcn);
};
$hxClasses["ui.api.SubmitRequest"] = ui.api.SubmitRequest;
ui.api.SubmitRequest.__name__ = ["ui","api","SubmitRequest"];
ui.api.SubmitRequest.__interfaces__ = [ui.api.Requester];
ui.api.SubmitRequest.__super__ = ui.api.BaseRequest;
ui.api.SubmitRequest.prototype = $extend(ui.api.BaseRequest.prototype,{
	__class__: ui.api.SubmitRequest
});
ui.api.CrudRequest = function(object,path,successFcn) {
	var crudMessage = ui.api.CrudMessage.create(object);
	this.baseOpts = { async : true, url : ui.AgentUi.URL + path};
	ui.api.BaseRequest.call(this,ui.AppContext.SERIALIZER.toJsonString(crudMessage),successFcn);
};
$hxClasses["ui.api.CrudRequest"] = ui.api.CrudRequest;
ui.api.CrudRequest.__name__ = ["ui","api","CrudRequest"];
ui.api.CrudRequest.__interfaces__ = [ui.api.Requester];
ui.api.CrudRequest.__super__ = ui.api.BaseRequest;
ui.api.CrudRequest.prototype = $extend(ui.api.BaseRequest.prototype,{
	__class__: ui.api.CrudRequest
});
ui.api.UpsertRequest = function(object,successFcn) {
	ui.api.CrudRequest.call(this,object,"/api/upsert",successFcn);
};
$hxClasses["ui.api.UpsertRequest"] = ui.api.UpsertRequest;
ui.api.UpsertRequest.__name__ = ["ui","api","UpsertRequest"];
ui.api.UpsertRequest.__super__ = ui.api.CrudRequest;
ui.api.UpsertRequest.prototype = $extend(ui.api.CrudRequest.prototype,{
	__class__: ui.api.UpsertRequest
});
ui.api.DeleteRequest = function(object,successFcn) {
	ui.api.CrudRequest.call(this,object,"/api/delete",successFcn);
};
$hxClasses["ui.api.DeleteRequest"] = ui.api.DeleteRequest;
ui.api.DeleteRequest.__name__ = ["ui","api","DeleteRequest"];
ui.api.DeleteRequest.__super__ = ui.api.CrudRequest;
ui.api.DeleteRequest.prototype = $extend(ui.api.CrudRequest.prototype,{
	__class__: ui.api.DeleteRequest
});
ui.api.QueryRequest = function(type,where,successFcn) {
	var queryMessage = new ui.api.QueryMessage(type,where);
	this.baseOpts = { async : true, url : ui.AgentUi.URL + "/api/query"};
	ui.api.BaseRequest.call(this,ui.AppContext.SERIALIZER.toJsonString(queryMessage),successFcn);
};
$hxClasses["ui.api.QueryRequest"] = ui.api.QueryRequest;
ui.api.QueryRequest.__name__ = ["ui","api","QueryRequest"];
ui.api.QueryRequest.__interfaces__ = [ui.api.Requester];
ui.api.QueryRequest.__super__ = ui.api.BaseRequest;
ui.api.QueryRequest.prototype = $extend(ui.api.BaseRequest.prototype,{
	__class__: ui.api.QueryRequest
});
ui.api.LongPollingRequest = function(requestToRepeat,successFcn,ajaxOpts) {
	this.timeout = 30000;
	this.running = true;
	var _g = this;
	this.baseOpts = { complete : function(jqXHR,textStatus) {
		_g.poll();
	}};
	if(ajaxOpts != null) $.extend(this.baseOpts,ajaxOpts);
	var wrappedSuccessFcn = function(data,textStatus,jqXHR) {
		ui.SystemStatus.instance().onMessage();
		if(_g.running) successFcn(data,textStatus,jqXHR);
	};
	var errorFcn = function(jqXHR,textStatus,errorThrown) {
		ui.AppContext.LOGGER.error("Error executing ajax call | Response Code: " + jqXHR.status + " | " + jqXHR.message);
	};
	ui.api.BaseRequest.call(this,requestToRepeat,wrappedSuccessFcn,errorFcn);
	this.setupHotKey();
};
$hxClasses["ui.api.LongPollingRequest"] = ui.api.LongPollingRequest;
ui.api.LongPollingRequest.__name__ = ["ui","api","LongPollingRequest"];
ui.api.LongPollingRequest.__interfaces__ = [ui.api.Requester];
ui.api.LongPollingRequest.__super__ = ui.api.BaseRequest;
ui.api.LongPollingRequest.prototype = $extend(ui.api.BaseRequest.prototype,{
	poll: function() {
		if(this.running) {
			this.baseOpts.url = ui.AgentUi.URL + "/api/channel/poll?channel=" + ui.AppContext.SUBMIT_CHANNEL + "&timeoutMillis=" + Std.string(this.timeout);
			this.baseOpts.timeout = this.timeout + 1000;
			this.jqXHR = ui.api.BaseRequest.prototype.start.call(this);
		}
	}
	,abort: function() {
		this.running = false;
		if(this.jqXHR != null) try {
			this.jqXHR.abort();
			this.jqXHR = null;
		} catch( err ) {
			ui.AppContext.LOGGER.error("error on poll abort | " + Std.string(err));
		}
	}
	,start: function(opts) {
		this.poll();
		return this.jqXHR;
	}
	,setupHotKey: function() {
		var _g = this;
		ui.AgentUi.HOT_KEY_ACTIONS.push(function(evt) {
			if(evt.altKey && evt.shiftKey && evt.keyCode == 80) {
				_g.running = !_g.running;
				ui.AppContext.LOGGER.debug("Long Polling is running? " + Std.string(_g.running));
				_g.poll();
			}
		});
	}
	,__class__: ui.api.LongPollingRequest
});
ui.api.ResponseProcessor = function() { }
$hxClasses["ui.api.ResponseProcessor"] = ui.api.ResponseProcessor;
ui.api.ResponseProcessor.__name__ = ["ui","api","ResponseProcessor"];
ui.api.ResponseProcessor.processResponse = function(dataArr,textStatus,jqXHR) {
	if(dataArr == null || dataArr.length == 0) return;
	Lambda.iter(dataArr,function(data) {
		if(data.success == false) {
			m3.util.JqueryUtil.alert("ERROR:  " + Std.string(data.error.message) + "     Context: " + Std.string(data.context));
			ui.AppContext.LOGGER.error(data.error.stacktrace);
		} else if(data.type != null) ui.api.ResponseProcessor.updateModelObject(data.instance,data.type); else if(js.Boot.__instanceof(data.result,String)) ui.AppContext.LOGGER.warn(data); else {
			var context = data.context.split("-");
			if(context != null && context[2] == "initialDataLoad") {
				var synchronizer = ui.api.Synchronizer.synchronizers.get(context[0]);
				if(synchronizer == null) synchronizer = ui.api.Synchronizer.add(data.context);
				synchronizer.dataReceived(data.result,context[3]);
			}
		}
	});
}
ui.api.ResponseProcessor.updateModelObject = function(instance,type) {
	type = type.toLowerCase();
	switch(type) {
	case "alias":
		ui.AppContext.MASTER_ALIASES.addOrUpdate(ui.AppContext.SERIALIZER.fromJsonX(instance,ui.model.Alias));
		break;
	case "content":
		ui.AppContext.MASTER_CONTENT.addOrUpdate(ui.AppContext.SERIALIZER.fromJsonX(instance,ui.model.Content));
		break;
	case "label":
		ui.AppContext.MASTER_LABELS.addOrUpdate(ui.AppContext.SERIALIZER.fromJsonX(instance,ui.model.Label));
		break;
	case "labelchild":
		ui.AppContext.MASTER_LABELCHILDREN.addOrUpdate(ui.AppContext.SERIALIZER.fromJsonX(instance,ui.model.LabelChild));
		break;
	case "labeledcontent":
		ui.AppContext.MASTER_LABELEDCONTENT.addOrUpdate(ui.AppContext.SERIALIZER.fromJsonX(instance,ui.model.LabeledContent));
		break;
	default:
		ui.AppContext.LOGGER.error("Unknown type: " + type);
	}
}
ui.api.ResponseProcessor.initialDataLoad = function(data) {
	if(data.agent != null) ui.AppContext.AGENT = data.agent; else {
		ui.AppContext.AGENT = new ui.model.Agent();
		ui.AppContext.AGENT.iid = ui.AppContext.AGENT.name = data.aliases[0].agentId;
	}
	if(m3.helper.StringHelper.isBlank(ui.AppContext.AGENT.data.name)) ui.AppContext.AGENT.data = new ui.model.UserData(ui.AppContext.AGENT.name,"media/test/koi.jpg");
	ui.AppContext.MASTER_ALIASES.addAll(data.aliases);
	ui.AppContext.MASTER_LABELS.addAll(data.labels);
	ui.AppContext.MASTER_CONTENT.addAll(data.content);
	ui.AppContext.MASTER_LABELEDCONTENT.addAll(data.labeledContent);
	ui.AppContext.MASTER_LABELCHILDREN.addAll(data.labelChildren);
	var initialAlias = null;
	var $it0 = ui.AppContext.ALIASES.iterator();
	while( $it0.hasNext() ) {
		var alias = $it0.next();
		if(alias.data.isDefault) {
			initialAlias = alias;
			break;
		}
	}
	if(initialAlias == null) initialAlias = ui.AppContext.ALIASES.iterator().next();
	ui.AppContext.currentAlias = initialAlias;
	var fs = new m3.observable.FilteredSet(ui.AppContext.MASTER_LABELS,function(c) {
		return c.name == "uber label";
	});
	ui.AppContext.UBER_LABEL = fs.iterator().next();
	ui.model.EM.change(ui.model.EMEvent.AGENT,ui.AppContext.AGENT);
	ui.model.EM.change(ui.model.EMEvent.FitWindow);
}
ui.api.SynchronizationParms = function() {
	this.agent = null;
	this.aliases = new Array();
	this.labels = new Array();
	this.labelChildren = new Array();
	this.content = new Array();
	this.labeledContent = new Array();
};
$hxClasses["ui.api.SynchronizationParms"] = ui.api.SynchronizationParms;
ui.api.SynchronizationParms.__name__ = ["ui","api","SynchronizationParms"];
ui.api.SynchronizationParms.prototype = {
	__class__: ui.api.SynchronizationParms
}
ui.api.Synchronizer = function(iid,numResponsesExpected,oncomplete) {
	this.iid = iid;
	this.numResponsesExpected = numResponsesExpected;
	this.oncomplete = oncomplete;
	this.parms = new ui.api.SynchronizationParms();
};
$hxClasses["ui.api.Synchronizer"] = ui.api.Synchronizer;
ui.api.Synchronizer.__name__ = ["ui","api","Synchronizer"];
ui.api.Synchronizer.createContext = function(numResponsesExpected,oncomplete) {
	return m3.util.UidGenerator.create(32) + "-" + Std.string(numResponsesExpected) + "-" + oncomplete + "-";
}
ui.api.Synchronizer.add = function(context) {
	var parts = context.split("-");
	var synchronizer = new ui.api.Synchronizer(parts[0],Std.parseInt(parts[1]),parts[2]);
	ui.api.Synchronizer.synchronizers.set(synchronizer.iid,synchronizer);
	return synchronizer;
}
ui.api.Synchronizer.remove = function(iid) {
	ui.api.Synchronizer.synchronizers.remove(iid);
}
ui.api.Synchronizer.prototype = {
	dataReceived: function(data,responseType) {
		if(data.primaryKey != null) switch(responseType) {
		case "alias":
			var alias = m3.helper.OSetHelper.getElement(ui.AppContext.MASTER_ALIASES,data.primaryKey);
			if(alias != null) this.parms.aliases.push(alias);
			break;
		case "content":
			var content = m3.helper.OSetHelper.getElement(ui.AppContext.CONTENT,data.primaryKey);
			if(content != null) this.parms.content.push(content);
			break;
		case "label":
			var label = m3.helper.OSetHelper.getElement(ui.AppContext.LABELS,data.primaryKey);
			if(label != null) this.parms.labels.push(label);
			break;
		case "labelChild":
			var lc = m3.helper.OSetHelper.getElement(ui.AppContext.LABELCHILDREN,data.primaryKey);
			if(lc != null) this.parms.labelChildren.push(lc);
			break;
		case "labeledContent":
			var lc = m3.helper.OSetHelper.getElement(ui.AppContext.LABELEDCONTENT,data.primaryKey);
			if(lc != null) this.parms.labeledContent.push(lc);
			break;
		} else switch(responseType) {
		case "agent":
			if(data.length > 0) {
				if(data[0].data.name == null) data[0].data.name = "";
				this.parms.agent = ui.AppContext.SERIALIZER.fromJsonX(data[0],ui.model.Agent);
			}
			break;
		case "alias":
			this.parms.aliases.push(ui.AppContext.SERIALIZER.fromJsonX(data.instance,ui.model.Alias));
			break;
		case "aliases":
			var _g = 0, _g1 = js.Boot.__cast(data , Array);
			while(_g < _g1.length) {
				var alias_ = _g1[_g];
				++_g;
				this.parms.aliases.push(ui.AppContext.SERIALIZER.fromJsonX(alias_,ui.model.Alias));
			}
			break;
		case "content":
			this.parms.content.push(ui.AppContext.SERIALIZER.fromJsonX(data.instance,ui.model.Content));
			break;
		case "contents":
			var _g = 0, _g1 = js.Boot.__cast(data , Array);
			while(_g < _g1.length) {
				var content_ = _g1[_g];
				++_g;
				this.parms.content.push(ui.AppContext.SERIALIZER.fromJsonX(content_,ui.model.Content));
			}
			break;
		case "label":
			this.parms.labels.push(ui.AppContext.SERIALIZER.fromJsonX(data.instance,ui.model.Label));
			break;
		case "labels":
			var _g = 0, _g1 = js.Boot.__cast(data , Array);
			while(_g < _g1.length) {
				var label_ = _g1[_g];
				++_g;
				this.parms.labels.push(ui.AppContext.SERIALIZER.fromJsonX(label_,ui.model.Label));
			}
			break;
		case "labelChild":
			this.parms.labelChildren.push(ui.AppContext.SERIALIZER.fromJsonX(data.instance,ui.model.LabelChild));
			break;
		case "labelChildren":
			var _g = 0, _g1 = js.Boot.__cast(data , Array);
			while(_g < _g1.length) {
				var labelChild_ = _g1[_g];
				++_g;
				this.parms.labelChildren.push(ui.AppContext.SERIALIZER.fromJsonX(labelChild_,ui.model.LabelChild));
			}
			break;
		case "labeledContent":
			this.parms.labeledContent.push(ui.AppContext.SERIALIZER.fromJsonX(data.instance,ui.model.LabeledContent));
			break;
		case "labeledContents":
			var _g = 0, _g1 = js.Boot.__cast(data , Array);
			while(_g < _g1.length) {
				var labeledContent_ = _g1[_g];
				++_g;
				this.parms.labeledContent.push(ui.AppContext.SERIALIZER.fromJsonX(labeledContent_,ui.model.LabeledContent));
			}
			break;
		}
		this.numResponsesExpected -= 1;
		if(this.numResponsesExpected == 0) {
			var func = Reflect.field(ui.api.ResponseProcessor,this.oncomplete);
			func.apply(ui.api.ResponseProcessor,[this.parms]);
			ui.api.Synchronizer.remove(this.iid);
		}
	}
	,__class__: ui.api.Synchronizer
}
ui.helper = {}
ui.helper.LabelStringParser = function(str) {
	this.original = str;
	this.processingString = str;
};
$hxClasses["ui.helper.LabelStringParser"] = ui.helper.LabelStringParser;
ui.helper.LabelStringParser.__name__ = ["ui","helper","LabelStringParser"];
ui.helper.LabelStringParser.prototype = {
	restore: function(str) {
		this.processingString = str + this.processingString;
	}
	,nextTerm: function(trim) {
		if(trim == null) trim = true;
		if(m3.helper.StringHelper.isBlank(this.processingString)) return null;
		var tmp = "";
		var _g1 = 0, _g = this.processingString.length;
		while(_g1 < _g) {
			var char_ = _g1++;
			var nextChar = this.processingString.substring(0,1);
			if(m3.helper.StringHelper.containsAny(nextChar,["(",",",")"])) {
				if(m3.helper.StringHelper.isBlank(tmp)) tmp = this.consume(1);
				break;
			} else tmp += this.consume(1);
		}
		return StringTools.trim(tmp);
	}
	,consume: function(chars,skipLeadingWhiteSpace) {
		if(skipLeadingWhiteSpace == null) skipLeadingWhiteSpace = false;
		if(m3.helper.StringHelper.isBlank(this.processingString)) return null;
		if(skipLeadingWhiteSpace) this.processingString = StringTools.ltrim(this.processingString);
		var consumedVal = this.processingString.substring(0,chars);
		this.processingString = this.processingString.substring(chars);
		return consumedVal;
	}
	,__class__: ui.helper.LabelStringParser
}
ui.helper.ModelHelper = function() { }
$hxClasses["ui.helper.ModelHelper"] = ui.helper.ModelHelper;
ui.helper.ModelHelper.__name__ = ["ui","helper","ModelHelper"];
ui.helper.ModelHelper.asConnection = function(alias) {
	var conn = new ui.model.Connection();
	conn.data = new ui.model.UserData(alias.name,(function($this) {
		var $r;
		try {
			$r = alias.data.imgSrc;
		} catch( __e ) {
			$r = "";
		}
		return $r;
	}(this)));
	return conn;
}
ui.helper.PrologHelper = function() { }
$hxClasses["ui.helper.PrologHelper"] = ui.helper.PrologHelper;
ui.helper.PrologHelper.__name__ = ["ui","helper","PrologHelper"];
ui.helper.PrologHelper.tagTreeAsStrings = function(labels) {
	var sarray = new Array();
	return sarray;
}
ui.helper.PrologHelper._processTagChildren = function(original,set) {
	var str = "";
	return str;
}
ui.helper.PrologHelper.tagTreeFromString = function(str) {
	var larray = new Array();
	var parser = new ui.helper.LabelStringParser(str);
	var term = parser.nextTerm();
	if(term != "and") parser.restore(term);
	larray = ui.helper.PrologHelper._processDataLogChildren(null,parser);
	return larray;
}
ui.helper.PrologHelper._processDataLogChildren = function(parentLabel,parser) {
	var larray = new Array();
	return larray;
}
ui.helper.PrologHelper.labelsToProlog = function(contentTags) {
	var sarray = [];
	return (sarray.length > 1?"each(":"") + sarray.join(",") + (sarray.length > 1?")":"");
}
ui.helper.PrologHelper.connectionsToProlog = function(connections) {
	var sarray = [];
	Lambda.iter(connections,function(c) {
		var s = "";
		sarray.push(ui.AppContext.SERIALIZER.toJsonString(c));
	});
	var str = sarray.join(",");
	return "all(" + (m3.helper.StringHelper.isBlank(str)?"_":"[" + str + "]") + ")";
}
ui.model = {}
ui.model.EM = function() { }
$hxClasses["ui.model.EM"] = ui.model.EM;
ui.model.EM.__name__ = ["ui","model","EM"];
ui.model.EM.addListener = function(id,listener) {
	var map = ui.model.EM.hash.get(id);
	if(map == null) {
		map = new haxe.ds.StringMap();
		ui.model.EM.hash.set(id,map);
	}
	map.set(listener.get_uid(),listener);
	return listener.get_uid();
}
ui.model.EM.listenOnce = function(id,listener) {
	var map = ui.model.EM.hash.get(id);
	ui.model.EM.oneTimers.push(listener.get_uid());
	return ui.model.EM.addListener(id,listener);
}
ui.model.EM.removeListener = function(id,listenerUid) {
	var map = ui.model.EM.hash.get(id);
	if(map != null) map.remove(listenerUid);
}
ui.model.EM.change = function(id,t) {
	ui.AppContext.LOGGER.debug("EVENTMODEL: Change to " + Std.string(id));
	var map = ui.model.EM.hash.get(id);
	if(map == null) {
		ui.AppContext.LOGGER.warn("No listeners for event " + Std.string(id));
		return;
	}
	var iter = map.iterator();
	while(iter.hasNext()) {
		var listener = iter.next();
		ui.AppContext.LOGGER.debug("Notifying " + listener.get_name() + " of " + Std.string(id) + " event");
		try {
			listener.change(t);
			if(HxOverrides.remove(ui.model.EM.oneTimers,listener.get_uid())) map.remove(listener.get_uid());
		} catch( err ) {
			ui.AppContext.LOGGER.error("Error executing " + listener.get_name() + " of " + Std.string(id) + " event",m3.log.Logga.getExceptionInst(err));
		}
	}
}
ui.model.EMListener = function(fcn,name) {
	this.fcn = fcn;
	this.uid = m3.util.UidGenerator.create(20);
	this.name = name == null?this.get_uid():name;
};
$hxClasses["ui.model.EMListener"] = ui.model.EMListener;
ui.model.EMListener.__name__ = ["ui","model","EMListener"];
ui.model.EMListener.prototype = {
	get_name: function() {
		return this.name;
	}
	,get_uid: function() {
		return this.uid;
	}
	,change: function(t) {
		this.fcn(t);
	}
	,__class__: ui.model.EMListener
}
ui.model.Nothing = function() { }
$hxClasses["ui.model.Nothing"] = ui.model.Nothing;
ui.model.Nothing.__name__ = ["ui","model","Nothing"];
ui.model.EMEvent = $hxClasses["ui.model.EMEvent"] = { __ename__ : ["ui","model","EMEvent"], __constructs__ : ["TEST","FILTER_RUN","FILTER_CHANGE","MoreContent","NextContent","EndOfContent","EditContentClosed","USER_LOGIN","CreateAgent","USER_SIGNUP","AGENT","FitWindow","PAGE_CLOSE","AliasLoaded","CreateAlias","UpdateAlias","DeleteAlias","CreateContent","DeleteContent","UpdateContent","CreateLabel","UpdateLabel","MoveLabel","CopyLabel","DeleteLabel","INTRODUCTION_REQUEST","INTRODUCTION_RESPONSE","RespondToIntroduction","RespondToIntroduction_RESPONSE","INTRODUCTION_NOTIFICATION","DELETE_NOTIFICATION","NewConnection","ConnectionUpdate","TARGET_CHANGE","BACKUP","RESTORE","RESTORES_REQUEST","AVAILABLE_BACKUPS"] }
ui.model.EMEvent.TEST = ["TEST",0];
ui.model.EMEvent.TEST.toString = $estr;
ui.model.EMEvent.TEST.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.FILTER_RUN = ["FILTER_RUN",1];
ui.model.EMEvent.FILTER_RUN.toString = $estr;
ui.model.EMEvent.FILTER_RUN.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.FILTER_CHANGE = ["FILTER_CHANGE",2];
ui.model.EMEvent.FILTER_CHANGE.toString = $estr;
ui.model.EMEvent.FILTER_CHANGE.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.MoreContent = ["MoreContent",3];
ui.model.EMEvent.MoreContent.toString = $estr;
ui.model.EMEvent.MoreContent.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.NextContent = ["NextContent",4];
ui.model.EMEvent.NextContent.toString = $estr;
ui.model.EMEvent.NextContent.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.EndOfContent = ["EndOfContent",5];
ui.model.EMEvent.EndOfContent.toString = $estr;
ui.model.EMEvent.EndOfContent.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.EditContentClosed = ["EditContentClosed",6];
ui.model.EMEvent.EditContentClosed.toString = $estr;
ui.model.EMEvent.EditContentClosed.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.USER_LOGIN = ["USER_LOGIN",7];
ui.model.EMEvent.USER_LOGIN.toString = $estr;
ui.model.EMEvent.USER_LOGIN.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.CreateAgent = ["CreateAgent",8];
ui.model.EMEvent.CreateAgent.toString = $estr;
ui.model.EMEvent.CreateAgent.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.USER_SIGNUP = ["USER_SIGNUP",9];
ui.model.EMEvent.USER_SIGNUP.toString = $estr;
ui.model.EMEvent.USER_SIGNUP.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.AGENT = ["AGENT",10];
ui.model.EMEvent.AGENT.toString = $estr;
ui.model.EMEvent.AGENT.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.FitWindow = ["FitWindow",11];
ui.model.EMEvent.FitWindow.toString = $estr;
ui.model.EMEvent.FitWindow.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.PAGE_CLOSE = ["PAGE_CLOSE",12];
ui.model.EMEvent.PAGE_CLOSE.toString = $estr;
ui.model.EMEvent.PAGE_CLOSE.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.AliasLoaded = ["AliasLoaded",13];
ui.model.EMEvent.AliasLoaded.toString = $estr;
ui.model.EMEvent.AliasLoaded.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.CreateAlias = ["CreateAlias",14];
ui.model.EMEvent.CreateAlias.toString = $estr;
ui.model.EMEvent.CreateAlias.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.UpdateAlias = ["UpdateAlias",15];
ui.model.EMEvent.UpdateAlias.toString = $estr;
ui.model.EMEvent.UpdateAlias.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.DeleteAlias = ["DeleteAlias",16];
ui.model.EMEvent.DeleteAlias.toString = $estr;
ui.model.EMEvent.DeleteAlias.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.CreateContent = ["CreateContent",17];
ui.model.EMEvent.CreateContent.toString = $estr;
ui.model.EMEvent.CreateContent.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.DeleteContent = ["DeleteContent",18];
ui.model.EMEvent.DeleteContent.toString = $estr;
ui.model.EMEvent.DeleteContent.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.UpdateContent = ["UpdateContent",19];
ui.model.EMEvent.UpdateContent.toString = $estr;
ui.model.EMEvent.UpdateContent.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.CreateLabel = ["CreateLabel",20];
ui.model.EMEvent.CreateLabel.toString = $estr;
ui.model.EMEvent.CreateLabel.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.UpdateLabel = ["UpdateLabel",21];
ui.model.EMEvent.UpdateLabel.toString = $estr;
ui.model.EMEvent.UpdateLabel.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.MoveLabel = ["MoveLabel",22];
ui.model.EMEvent.MoveLabel.toString = $estr;
ui.model.EMEvent.MoveLabel.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.CopyLabel = ["CopyLabel",23];
ui.model.EMEvent.CopyLabel.toString = $estr;
ui.model.EMEvent.CopyLabel.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.DeleteLabel = ["DeleteLabel",24];
ui.model.EMEvent.DeleteLabel.toString = $estr;
ui.model.EMEvent.DeleteLabel.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.INTRODUCTION_REQUEST = ["INTRODUCTION_REQUEST",25];
ui.model.EMEvent.INTRODUCTION_REQUEST.toString = $estr;
ui.model.EMEvent.INTRODUCTION_REQUEST.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.INTRODUCTION_RESPONSE = ["INTRODUCTION_RESPONSE",26];
ui.model.EMEvent.INTRODUCTION_RESPONSE.toString = $estr;
ui.model.EMEvent.INTRODUCTION_RESPONSE.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.RespondToIntroduction = ["RespondToIntroduction",27];
ui.model.EMEvent.RespondToIntroduction.toString = $estr;
ui.model.EMEvent.RespondToIntroduction.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.RespondToIntroduction_RESPONSE = ["RespondToIntroduction_RESPONSE",28];
ui.model.EMEvent.RespondToIntroduction_RESPONSE.toString = $estr;
ui.model.EMEvent.RespondToIntroduction_RESPONSE.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.INTRODUCTION_NOTIFICATION = ["INTRODUCTION_NOTIFICATION",29];
ui.model.EMEvent.INTRODUCTION_NOTIFICATION.toString = $estr;
ui.model.EMEvent.INTRODUCTION_NOTIFICATION.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.DELETE_NOTIFICATION = ["DELETE_NOTIFICATION",30];
ui.model.EMEvent.DELETE_NOTIFICATION.toString = $estr;
ui.model.EMEvent.DELETE_NOTIFICATION.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.NewConnection = ["NewConnection",31];
ui.model.EMEvent.NewConnection.toString = $estr;
ui.model.EMEvent.NewConnection.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.ConnectionUpdate = ["ConnectionUpdate",32];
ui.model.EMEvent.ConnectionUpdate.toString = $estr;
ui.model.EMEvent.ConnectionUpdate.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.TARGET_CHANGE = ["TARGET_CHANGE",33];
ui.model.EMEvent.TARGET_CHANGE.toString = $estr;
ui.model.EMEvent.TARGET_CHANGE.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.BACKUP = ["BACKUP",34];
ui.model.EMEvent.BACKUP.toString = $estr;
ui.model.EMEvent.BACKUP.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.RESTORE = ["RESTORE",35];
ui.model.EMEvent.RESTORE.toString = $estr;
ui.model.EMEvent.RESTORE.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.RESTORES_REQUEST = ["RESTORES_REQUEST",36];
ui.model.EMEvent.RESTORES_REQUEST.toString = $estr;
ui.model.EMEvent.RESTORES_REQUEST.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.AVAILABLE_BACKUPS = ["AVAILABLE_BACKUPS",37];
ui.model.EMEvent.AVAILABLE_BACKUPS.toString = $estr;
ui.model.EMEvent.AVAILABLE_BACKUPS.__enum__ = ui.model.EMEvent;
ui.model.Filter = function(node) {
	this.rootNode = node;
	this.connectionNodes = new Array();
	this.labelNodes = new Array();
	if(node.hasChildren()) {
		var _g1 = 0, _g = node.nodes.length;
		while(_g1 < _g) {
			var ch_ = _g1++;
			if(node.nodes[ch_].type == "CONNECTION") this.connectionNodes.push(node.nodes[ch_]); else if(node.nodes[ch_].type == "LABEL") this.labelNodes.push(node.nodes[ch_]); else throw new m3.exception.Exception("dont know how to handle node of type " + node.nodes[ch_].type);
		}
	}
};
$hxClasses["ui.model.Filter"] = ui.model.Filter;
ui.model.Filter.__name__ = ["ui","model","Filter"];
ui.model.Filter.prototype = {
	_prologify: function(nodes) {
		var str = "";
		if(m3.helper.ArrayHelper.hasValues(nodes)) {
			str += "(";
			var iteration = 0;
			var _g1 = 0, _g = nodes.length;
			while(_g1 < _g) {
				var ln_ = _g1++;
				if(iteration++ > 0) str += ",";
				str += nodes[ln_].getProlog();
				if(nodes[ln_].hasChildren()) str += this._prologify(nodes[ln_].nodes);
			}
			str += ")";
		}
		return str;
	}
	,labelsProlog: function() {
		var s = this._prologify(this.labelNodes);
		if(m3.helper.StringHelper.isBlank(s)) s = "()";
		return this.rootNode.getProlog() + s;
	}
	,toProlog: function() {
		var queries = [this._prologify(this.labelNodes),this._prologify(this.connectionNodes)];
		var query = m3.helper.ArrayHelper.joinX(queries,",");
		return query;
	}
	,__class__: ui.model.Filter
}
ui.model.ModelObj = function() {
};
$hxClasses["ui.model.ModelObj"] = ui.model.ModelObj;
ui.model.ModelObj.__name__ = ["ui","model","ModelObj"];
ui.model.ModelObj.prototype = {
	objectType: function() {
		var className = m3.serialization.TypeTools.classname(m3.serialization.TypeTools.clazz(this)).toLowerCase();
		var parts = className.split(".");
		return parts[parts.length - 1];
	}
	,__class__: ui.model.ModelObj
}
ui.model.ModelObjWithIid = function() {
	ui.model.ModelObj.call(this);
	this.iid = m3.util.UidGenerator.create(32);
	this.deleted = false;
	this.agentId = ui.AppContext.AGENT == null?null:ui.AppContext.AGENT.iid;
};
$hxClasses["ui.model.ModelObjWithIid"] = ui.model.ModelObjWithIid;
ui.model.ModelObjWithIid.__name__ = ["ui","model","ModelObjWithIid"];
ui.model.ModelObjWithIid.identifier = function(t) {
	return t.iid;
}
ui.model.ModelObjWithIid.__super__ = ui.model.ModelObj;
ui.model.ModelObjWithIid.prototype = $extend(ui.model.ModelObj.prototype,{
	__class__: ui.model.ModelObjWithIid
});
ui.model.Agent = function() {
	ui.model.ModelObj.call(this);
	this.data = new ui.model.UserData();
};
$hxClasses["ui.model.Agent"] = ui.model.Agent;
ui.model.Agent.__name__ = ["ui","model","Agent"];
ui.model.Agent.__super__ = ui.model.ModelObj;
ui.model.Agent.prototype = $extend(ui.model.ModelObj.prototype,{
	__class__: ui.model.Agent
});
ui.model.UserData = function(name,imgSrc) {
	if(imgSrc == null) imgSrc = "";
	if(name == null) name = "";
	ui.model.ModelObj.call(this);
	this.name = name;
	this.imgSrc = imgSrc;
	this.isDefault = false;
	this.email = "";
};
$hxClasses["ui.model.UserData"] = ui.model.UserData;
ui.model.UserData.__name__ = ["ui","model","UserData"];
ui.model.UserData.__super__ = ui.model.ModelObj;
ui.model.UserData.prototype = $extend(ui.model.ModelObj.prototype,{
	__class__: ui.model.UserData
});
ui.model.Alias = function(name) {
	ui.model.ModelObjWithIid.call(this);
	this.name = name;
	this.data = new ui.model.UserData();
};
$hxClasses["ui.model.Alias"] = ui.model.Alias;
ui.model.Alias.__name__ = ["ui","model","Alias"];
ui.model.Alias.identifier = function(alias) {
	return alias.iid;
}
ui.model.Alias.__super__ = ui.model.ModelObjWithIid;
ui.model.Alias.prototype = $extend(ui.model.ModelObjWithIid.prototype,{
	__class__: ui.model.Alias
});
ui.model.LabelData = function() {
	ui.model.ModelObj.call(this);
	this.color = m3.util.ColorProvider.getNextColor();
};
$hxClasses["ui.model.LabelData"] = ui.model.LabelData;
ui.model.LabelData.__name__ = ["ui","model","LabelData"];
ui.model.LabelData.__super__ = ui.model.ModelObj;
ui.model.LabelData.prototype = $extend(ui.model.ModelObj.prototype,{
	__class__: ui.model.LabelData
});
ui.model.Label = function(name) {
	ui.model.ModelObjWithIid.call(this);
	this.name = name;
	this.data = new ui.model.LabelData();
};
$hxClasses["ui.model.Label"] = ui.model.Label;
ui.model.Label.__name__ = ["ui","model","Label"];
ui.model.Label.identifier = function(l) {
	return l.iid;
}
ui.model.Label.__super__ = ui.model.ModelObjWithIid;
ui.model.Label.prototype = $extend(ui.model.ModelObjWithIid.prototype,{
	__class__: ui.model.Label
});
ui.model.LabelChild = function(parentIid,childIid) {
	if(parentIid != null && childIid != null && parentIid == childIid) throw new m3.exception.Exception("parentIid and childIid of LabelChild must be different");
	ui.model.ModelObjWithIid.call(this);
	this.parentIid = parentIid;
	this.childIid = childIid;
};
$hxClasses["ui.model.LabelChild"] = ui.model.LabelChild;
ui.model.LabelChild.__name__ = ["ui","model","LabelChild"];
ui.model.LabelChild.identifier = function(l) {
	return l.iid;
}
ui.model.LabelChild.__super__ = ui.model.ModelObjWithIid;
ui.model.LabelChild.prototype = $extend(ui.model.ModelObjWithIid.prototype,{
	__class__: ui.model.LabelChild
});
ui.model.LabelAcl = function(connectionIid,labelIid) {
	ui.model.ModelObjWithIid.call(this);
	this.connectionIid = connectionIid;
	this.labelIid = labelIid;
};
$hxClasses["ui.model.LabelAcl"] = ui.model.LabelAcl;
ui.model.LabelAcl.__name__ = ["ui","model","LabelAcl"];
ui.model.LabelAcl.identifier = function(l) {
	return l.iid;
}
ui.model.LabelAcl.__super__ = ui.model.ModelObjWithIid;
ui.model.LabelAcl.prototype = $extend(ui.model.ModelObjWithIid.prototype,{
	__class__: ui.model.LabelAcl
});
ui.model.Connection = function(profile) {
	ui.model.ModelObjWithIid.call(this);
};
$hxClasses["ui.model.Connection"] = ui.model.Connection;
ui.model.Connection.__name__ = ["ui","model","Connection"];
ui.model.Connection.identifier = function(c) {
	return c.iid;
}
ui.model.Connection.__super__ = ui.model.ModelObjWithIid;
ui.model.Connection.prototype = $extend(ui.model.ModelObjWithIid.prototype,{
	name: function() {
		return this.data.name;
	}
	,equals: function(c) {
		return this.iid == c.iid;
	}
	,__class__: ui.model.Connection
});
ui.model.ContentType = $hxClasses["ui.model.ContentType"] = { __ename__ : ["ui","model","ContentType"], __constructs__ : ["AUDIO","IMAGE","URL","TEXT"] }
ui.model.ContentType.AUDIO = ["AUDIO",0];
ui.model.ContentType.AUDIO.toString = $estr;
ui.model.ContentType.AUDIO.__enum__ = ui.model.ContentType;
ui.model.ContentType.IMAGE = ["IMAGE",1];
ui.model.ContentType.IMAGE.toString = $estr;
ui.model.ContentType.IMAGE.__enum__ = ui.model.ContentType;
ui.model.ContentType.URL = ["URL",2];
ui.model.ContentType.URL.toString = $estr;
ui.model.ContentType.URL.__enum__ = ui.model.ContentType;
ui.model.ContentType.TEXT = ["TEXT",3];
ui.model.ContentType.TEXT.toString = $estr;
ui.model.ContentType.TEXT.__enum__ = ui.model.ContentType;
ui.model.ContentHandler = function() {
};
$hxClasses["ui.model.ContentHandler"] = ui.model.ContentHandler;
ui.model.ContentHandler.__name__ = ["ui","model","ContentHandler"];
ui.model.ContentHandler.__interfaces__ = [m3.serialization.TypeHandler];
ui.model.ContentHandler.prototype = {
	write: function(value,writer) {
		return ui.AppContext.SERIALIZER.toJson(value);
	}
	,read: function(fromJson,reader,instance) {
		var obj = null;
		var _g = Type.createEnum(ui.model.ContentType,fromJson.contentType,null);
		switch( (_g)[1] ) {
		case 0:
			obj = ui.AppContext.SERIALIZER.fromJsonX(fromJson,ui.model.AudioContent);
			break;
		case 1:
			obj = ui.AppContext.SERIALIZER.fromJsonX(fromJson,ui.model.ImageContent);
			break;
		case 3:
			obj = ui.AppContext.SERIALIZER.fromJsonX(fromJson,ui.model.MessageContent);
			break;
		case 2:
			obj = ui.AppContext.SERIALIZER.fromJsonX(fromJson,ui.model.UrlContent);
			break;
		}
		return obj;
	}
	,__class__: ui.model.ContentHandler
}
ui.model.ContentFactory = function() { }
$hxClasses["ui.model.ContentFactory"] = ui.model.ContentFactory;
ui.model.ContentFactory.__name__ = ["ui","model","ContentFactory"];
ui.model.ContentFactory.create = function(contentType,data) {
	var ret = null;
	switch( (contentType)[1] ) {
	case 0:
		var ac = new ui.model.AudioContent();
		ac.props.audioSrc = js.Boot.__cast(data , String);
		ret = ac;
		break;
	case 1:
		var ic = new ui.model.ImageContent();
		ic.props.imgSrc = js.Boot.__cast(data , String);
		ret = ic;
		break;
	case 3:
		var mc = new ui.model.MessageContent();
		mc.props.text = js.Boot.__cast(data , String);
		ret = mc;
		break;
	case 2:
		var uc = new ui.model.UrlContent();
		uc.props.url = js.Boot.__cast(data , String);
		ret = uc;
		break;
	}
	return ret;
}
ui.model.LabeledContent = function(contentIid,labelIid) {
	ui.model.ModelObjWithIid.call(this);
	this.contentIid = contentIid;
	this.labelIid = labelIid;
};
$hxClasses["ui.model.LabeledContent"] = ui.model.LabeledContent;
ui.model.LabeledContent.__name__ = ["ui","model","LabeledContent"];
ui.model.LabeledContent.identifier = function(l) {
	return l.iid;
}
ui.model.LabeledContent.__super__ = ui.model.ModelObjWithIid;
ui.model.LabeledContent.prototype = $extend(ui.model.ModelObjWithIid.prototype,{
	__class__: ui.model.LabeledContent
});
ui.model.ContentData = function() {
	this.created = new Date();
	this.modified = new Date();
};
$hxClasses["ui.model.ContentData"] = ui.model.ContentData;
ui.model.ContentData.__name__ = ["ui","model","ContentData"];
ui.model.ContentData.prototype = {
	__class__: ui.model.ContentData
}
ui.model.Content = function(contentType,type) {
	ui.model.ModelObjWithIid.call(this);
	this.contentType = contentType;
	this.aliasIid = ui.AppContext.currentAlias == null?null:ui.AppContext.currentAlias.iid;
	this.data = { };
	this.type = type;
	this.props = Type.createInstance(type,[]);
};
$hxClasses["ui.model.Content"] = ui.model.Content;
ui.model.Content.__name__ = ["ui","model","Content"];
ui.model.Content.__super__ = ui.model.ModelObjWithIid;
ui.model.Content.prototype = $extend(ui.model.ModelObjWithIid.prototype,{
	objectType: function() {
		return "content";
	}
	,getTimestamp: function() {
		return DateTools.format(this.get_created(),"%Y-%m-%d %T");
	}
	,writeResolve: function() {
		this.data = ui.AppContext.SERIALIZER.toJson(this.props);
	}
	,readResolve: function() {
		this.props = ui.AppContext.SERIALIZER.fromJsonX(this.data,this.type);
	}
	,setData: function(data) {
		this.data = data;
	}
	,get_modified: function() {
		return this.props.modified;
	}
	,get_created: function() {
		return this.props.created;
	}
	,__class__: ui.model.Content
});
ui.model.ImageContentData = function() {
	ui.model.ContentData.call(this);
};
$hxClasses["ui.model.ImageContentData"] = ui.model.ImageContentData;
ui.model.ImageContentData.__name__ = ["ui","model","ImageContentData"];
ui.model.ImageContentData.__super__ = ui.model.ContentData;
ui.model.ImageContentData.prototype = $extend(ui.model.ContentData.prototype,{
	__class__: ui.model.ImageContentData
});
ui.model.ImageContent = function() {
	ui.model.Content.call(this,ui.model.ContentType.IMAGE,ui.model.ImageContentData);
};
$hxClasses["ui.model.ImageContent"] = ui.model.ImageContent;
ui.model.ImageContent.__name__ = ["ui","model","ImageContent"];
ui.model.ImageContent.__super__ = ui.model.Content;
ui.model.ImageContent.prototype = $extend(ui.model.Content.prototype,{
	__class__: ui.model.ImageContent
});
ui.model.AudioContentData = function() {
	ui.model.ContentData.call(this);
};
$hxClasses["ui.model.AudioContentData"] = ui.model.AudioContentData;
ui.model.AudioContentData.__name__ = ["ui","model","AudioContentData"];
ui.model.AudioContentData.__super__ = ui.model.ContentData;
ui.model.AudioContentData.prototype = $extend(ui.model.ContentData.prototype,{
	__class__: ui.model.AudioContentData
});
ui.model.AudioContent = function() {
	ui.model.Content.call(this,ui.model.ContentType.AUDIO,ui.model.AudioContentData);
};
$hxClasses["ui.model.AudioContent"] = ui.model.AudioContent;
ui.model.AudioContent.__name__ = ["ui","model","AudioContent"];
ui.model.AudioContent.__super__ = ui.model.Content;
ui.model.AudioContent.prototype = $extend(ui.model.Content.prototype,{
	__class__: ui.model.AudioContent
});
ui.model.MessageContentData = function() {
	ui.model.ContentData.call(this);
};
$hxClasses["ui.model.MessageContentData"] = ui.model.MessageContentData;
ui.model.MessageContentData.__name__ = ["ui","model","MessageContentData"];
ui.model.MessageContentData.__super__ = ui.model.ContentData;
ui.model.MessageContentData.prototype = $extend(ui.model.ContentData.prototype,{
	__class__: ui.model.MessageContentData
});
ui.model.MessageContent = function() {
	ui.model.Content.call(this,ui.model.ContentType.TEXT,ui.model.MessageContentData);
};
$hxClasses["ui.model.MessageContent"] = ui.model.MessageContent;
ui.model.MessageContent.__name__ = ["ui","model","MessageContent"];
ui.model.MessageContent.__super__ = ui.model.Content;
ui.model.MessageContent.prototype = $extend(ui.model.Content.prototype,{
	__class__: ui.model.MessageContent
});
ui.model.UrlContentData = function() {
	ui.model.ContentData.call(this);
};
$hxClasses["ui.model.UrlContentData"] = ui.model.UrlContentData;
ui.model.UrlContentData.__name__ = ["ui","model","UrlContentData"];
ui.model.UrlContentData.__super__ = ui.model.ContentData;
ui.model.UrlContentData.prototype = $extend(ui.model.ContentData.prototype,{
	__class__: ui.model.UrlContentData
});
ui.model.UrlContent = function() {
	ui.model.Content.call(this,ui.model.ContentType.URL,ui.model.UrlContentData);
};
$hxClasses["ui.model.UrlContent"] = ui.model.UrlContent;
ui.model.UrlContent.__name__ = ["ui","model","UrlContent"];
ui.model.UrlContent.__super__ = ui.model.Content;
ui.model.UrlContent.prototype = $extend(ui.model.Content.prototype,{
	__class__: ui.model.UrlContent
});
ui.model.NotificationHandler = function() {
};
$hxClasses["ui.model.NotificationHandler"] = ui.model.NotificationHandler;
ui.model.NotificationHandler.__name__ = ["ui","model","NotificationHandler"];
ui.model.NotificationHandler.__interfaces__ = [m3.serialization.TypeHandler];
ui.model.NotificationHandler.prototype = {
	write: function(value,writer) {
		return ui.AppContext.SERIALIZER.toJson(value);
	}
	,read: function(fromJson,reader,instance) {
		var obj = null;
		var _g = Type.createEnum(ui.model.NotificationKind,fromJson.kind,null);
		switch( (_g)[1] ) {
		case 0:
			obj = null;
			break;
		case 1:
			obj = null;
			break;
		case 2:
			obj = ui.AppContext.SERIALIZER.fromJsonX(fromJson,ui.model.IntroductionRequestClass);
			break;
		case 3:
			obj = ui.AppContext.SERIALIZER.fromJsonX(fromJson,ui.model.IntroductionResponseClass);
			break;
		}
		return obj;
	}
	,__class__: ui.model.NotificationHandler
}
ui.model.NotificationKind = $hxClasses["ui.model.NotificationKind"] = { __ename__ : ["ui","model","NotificationKind"], __constructs__ : ["Ping","Pong","IntroductionRequest","IntroductionResponse"] }
ui.model.NotificationKind.Ping = ["Ping",0];
ui.model.NotificationKind.Ping.toString = $estr;
ui.model.NotificationKind.Ping.__enum__ = ui.model.NotificationKind;
ui.model.NotificationKind.Pong = ["Pong",1];
ui.model.NotificationKind.Pong.toString = $estr;
ui.model.NotificationKind.Pong.__enum__ = ui.model.NotificationKind;
ui.model.NotificationKind.IntroductionRequest = ["IntroductionRequest",2];
ui.model.NotificationKind.IntroductionRequest.toString = $estr;
ui.model.NotificationKind.IntroductionRequest.__enum__ = ui.model.NotificationKind;
ui.model.NotificationKind.IntroductionResponse = ["IntroductionResponse",3];
ui.model.NotificationKind.IntroductionResponse.toString = $estr;
ui.model.NotificationKind.IntroductionResponse.__enum__ = ui.model.NotificationKind;
ui.model.Notification = function(kind,type) {
	ui.model.ModelObjWithIid.call(this);
	this.kind = kind;
	this.data = { };
	this.type = type;
	this.props = Type.createInstance(type,[]);
};
$hxClasses["ui.model.Notification"] = ui.model.Notification;
ui.model.Notification.__name__ = ["ui","model","Notification"];
ui.model.Notification.__super__ = ui.model.ModelObjWithIid;
ui.model.Notification.prototype = $extend(ui.model.ModelObjWithIid.prototype,{
	writeResolve: function() {
		this.data = ui.AppContext.SERIALIZER.toJson(this.props);
	}
	,readResolve: function() {
		this.props = ui.AppContext.SERIALIZER.fromJsonX(this.data,this.type);
	}
	,__class__: ui.model.Notification
});
ui.model.IntroductionState = $hxClasses["ui.model.IntroductionState"] = { __ename__ : ["ui","model","IntroductionState"], __constructs__ : ["NotResponded","Accepted","Rejected"] }
ui.model.IntroductionState.NotResponded = ["NotResponded",0];
ui.model.IntroductionState.NotResponded.toString = $estr;
ui.model.IntroductionState.NotResponded.__enum__ = ui.model.IntroductionState;
ui.model.IntroductionState.Accepted = ["Accepted",1];
ui.model.IntroductionState.Accepted.toString = $estr;
ui.model.IntroductionState.Accepted.__enum__ = ui.model.IntroductionState;
ui.model.IntroductionState.Rejected = ["Rejected",2];
ui.model.IntroductionState.Rejected.toString = $estr;
ui.model.IntroductionState.Rejected.__enum__ = ui.model.IntroductionState;
ui.model.Introduction = function() {
	ui.model.ModelObjWithIid.call(this);
};
$hxClasses["ui.model.Introduction"] = ui.model.Introduction;
ui.model.Introduction.__name__ = ["ui","model","Introduction"];
ui.model.Introduction.__super__ = ui.model.ModelObjWithIid;
ui.model.Introduction.prototype = $extend(ui.model.ModelObjWithIid.prototype,{
	__class__: ui.model.Introduction
});
ui.model.IntroductionRequestClass = function() {
	ui.model.Notification.call(this,ui.model.NotificationKind.IntroductionRequest,ui.model.IntroductionRequestData);
};
$hxClasses["ui.model.IntroductionRequestClass"] = ui.model.IntroductionRequestClass;
ui.model.IntroductionRequestClass.__name__ = ["ui","model","IntroductionRequestClass"];
ui.model.IntroductionRequestClass.__super__ = ui.model.Notification;
ui.model.IntroductionRequestClass.prototype = $extend(ui.model.Notification.prototype,{
	__class__: ui.model.IntroductionRequestClass
});
ui.model.IntroductionRequestData = function() { }
$hxClasses["ui.model.IntroductionRequestData"] = ui.model.IntroductionRequestData;
ui.model.IntroductionRequestData.__name__ = ["ui","model","IntroductionRequestData"];
ui.model.IntroductionRequestData.prototype = {
	__class__: ui.model.IntroductionRequestData
}
ui.model.IntroductionResponseClass = function(introductionIid,accepted) {
	ui.model.Notification.call(this,ui.model.NotificationKind.IntroductionResponse,ui.model.IntroductionResponseData);
	this.props.introductionIid = introductionIid;
	this.props.accepted = accepted;
};
$hxClasses["ui.model.IntroductionResponseClass"] = ui.model.IntroductionResponseClass;
ui.model.IntroductionResponseClass.__name__ = ["ui","model","IntroductionResponseClass"];
ui.model.IntroductionResponseClass.__super__ = ui.model.Notification;
ui.model.IntroductionResponseClass.prototype = $extend(ui.model.Notification.prototype,{
	__class__: ui.model.IntroductionResponseClass
});
ui.model.IntroductionResponseData = function() { }
$hxClasses["ui.model.IntroductionResponseData"] = ui.model.IntroductionResponseData;
ui.model.IntroductionResponseData.__name__ = ["ui","model","IntroductionResponseData"];
ui.model.IntroductionResponseData.prototype = {
	__class__: ui.model.IntroductionResponseData
}
ui.model.Login = function() {
	ui.model.ModelObj.call(this);
};
$hxClasses["ui.model.Login"] = ui.model.Login;
ui.model.Login.__name__ = ["ui","model","Login"];
ui.model.Login.__super__ = ui.model.ModelObj;
ui.model.Login.prototype = $extend(ui.model.ModelObj.prototype,{
	__class__: ui.model.Login
});
ui.model.NewUser = function() {
	ui.model.ModelObj.call(this);
};
$hxClasses["ui.model.NewUser"] = ui.model.NewUser;
ui.model.NewUser.__name__ = ["ui","model","NewUser"];
ui.model.NewUser.__super__ = ui.model.ModelObj;
ui.model.NewUser.prototype = $extend(ui.model.ModelObj.prototype,{
	__class__: ui.model.NewUser
});
ui.model.EditLabelData = function(label,parentIid,newParentId) {
	this.label = label;
	this.parentIid = parentIid;
	this.newParentId = newParentId;
};
$hxClasses["ui.model.EditLabelData"] = ui.model.EditLabelData;
ui.model.EditLabelData.__name__ = ["ui","model","EditLabelData"];
ui.model.EditLabelData.prototype = {
	__class__: ui.model.EditLabelData
}
ui.model.EditContentData = function(content,labels) {
	this.content = content;
	if(labels == null) labels = new Array();
	this.labels = labels;
};
$hxClasses["ui.model.EditContentData"] = ui.model.EditContentData;
ui.model.EditContentData.__name__ = ["ui","model","EditContentData"];
ui.model.EditContentData.prototype = {
	__class__: ui.model.EditContentData
}
ui.model.Node = function() {
	this.type = "ROOT";
};
$hxClasses["ui.model.Node"] = ui.model.Node;
ui.model.Node.__name__ = ["ui","model","Node"];
ui.model.Node.prototype = {
	getProlog: function() {
		throw new m3.exception.Exception("override me");
		return null;
	}
	,hasChildren: function() {
		return m3.helper.ArrayHelper.hasValues(this.nodes);
	}
	,addNode: function(n) {
		this.nodes.push(n);
	}
	,__class__: ui.model.Node
}
ui.model.And = function() {
	this.nodes = new Array();
};
$hxClasses["ui.model.And"] = ui.model.And;
ui.model.And.__name__ = ["ui","model","And"];
ui.model.And.__super__ = ui.model.Node;
ui.model.And.prototype = $extend(ui.model.Node.prototype,{
	getProlog: function() {
		return "all";
	}
	,__class__: ui.model.And
});
ui.model.Or = function() {
	this.nodes = new Array();
};
$hxClasses["ui.model.Or"] = ui.model.Or;
ui.model.Or.__name__ = ["ui","model","Or"];
ui.model.Or.__super__ = ui.model.Node;
ui.model.Or.prototype = $extend(ui.model.Node.prototype,{
	getProlog: function() {
		return "any";
	}
	,__class__: ui.model.Or
});
ui.model.ContentNode = function() {
};
$hxClasses["ui.model.ContentNode"] = ui.model.ContentNode;
ui.model.ContentNode.__name__ = ["ui","model","ContentNode"];
ui.model.ContentNode.__super__ = ui.model.Node;
ui.model.ContentNode.prototype = $extend(ui.model.Node.prototype,{
	hasChildren: function() {
		return false;
	}
	,__class__: ui.model.ContentNode
});
ui.model.LabelNode = function() {
	ui.model.ContentNode.call(this);
};
$hxClasses["ui.model.LabelNode"] = ui.model.LabelNode;
ui.model.LabelNode.__name__ = ["ui","model","LabelNode"];
ui.model.LabelNode.__super__ = ui.model.ContentNode;
ui.model.LabelNode.prototype = $extend(ui.model.ContentNode.prototype,{
	getProlog: function() {
		return ui.helper.PrologHelper.labelsToProlog(new m3.observable.ObservableSet(ui.model.Label.identifier,[this.content]));
	}
	,__class__: ui.model.LabelNode
});
ui.model.ConnectionNode = function() {
	ui.model.ContentNode.call(this);
};
$hxClasses["ui.model.ConnectionNode"] = ui.model.ConnectionNode;
ui.model.ConnectionNode.__name__ = ["ui","model","ConnectionNode"];
ui.model.ConnectionNode.__super__ = ui.model.ContentNode;
ui.model.ConnectionNode.prototype = $extend(ui.model.ContentNode.prototype,{
	getProlog: function() {
		return ui.helper.PrologHelper.connectionsToProlog(new m3.observable.ObservableSet(ui.model.Connection.identifier,[this.content]));
	}
	,__class__: ui.model.ConnectionNode
});
ui.widget = {}
ui.widget.ChatOrientation = $hxClasses["ui.widget.ChatOrientation"] = { __ename__ : ["ui","widget","ChatOrientation"], __constructs__ : ["chatRight","chatLeft"] }
ui.widget.ChatOrientation.chatRight = ["chatRight",0];
ui.widget.ChatOrientation.chatRight.toString = $estr;
ui.widget.ChatOrientation.chatRight.__enum__ = ui.widget.ChatOrientation;
ui.widget.ChatOrientation.chatLeft = ["chatLeft",1];
ui.widget.ChatOrientation.chatLeft.toString = $estr;
ui.widget.ChatOrientation.chatLeft.__enum__ = ui.widget.ChatOrientation;
ui.widget.ConnectionAvatarHelper = function() { }
$hxClasses["ui.widget.ConnectionAvatarHelper"] = ui.widget.ConnectionAvatarHelper;
ui.widget.ConnectionAvatarHelper.__name__ = ["ui","widget","ConnectionAvatarHelper"];
ui.widget.ConnectionAvatarHelper.getConnection = function(c) {
	return c.connectionAvatar("option","connection");
}
ui.widget.ConnectionAvatarHelper.update = function(c,connection) {
	return c.connectionAvatar("update",connection);
}
ui.widget.ConnectionCompHelper = function() { }
$hxClasses["ui.widget.ConnectionCompHelper"] = ui.widget.ConnectionCompHelper;
ui.widget.ConnectionCompHelper.__name__ = ["ui","widget","ConnectionCompHelper"];
ui.widget.ConnectionCompHelper.connection = function(c) {
	return c.connectionComp("option","connection");
}
ui.widget.ConnectionCompHelper.update = function(c,connection) {
	return c.connectionComp("update",connection);
}
ui.widget.ConnectionCompHelper.addNotification = function(c) {
	return c.connectionComp("addNotification");
}
ui.widget.ConnectionCompHelper.deleteNotification = function(c) {
	return c.connectionComp("deleteNotification");
}
ui.widget.DialogManager = function() { }
$hxClasses["ui.widget.DialogManager"] = ui.widget.DialogManager;
$hxExpose(ui.widget.DialogManager, "ui.widget.DialogManager");
ui.widget.DialogManager.__name__ = ["ui","widget","DialogManager"];
ui.widget.DialogManager.showDialog = function(dialogFcnName,options) {
	if(options == null) options = { };
	var selector = "." + dialogFcnName;
	var dialog = new $(selector);
	if(!dialog.exists()) {
		dialog = new $("<div></div>");
		dialog.appendTo(js.Browser.document.body);
		var dlg = (Reflect.field($.ui,dialogFcnName))(options);
		dlg.open();
	} else {
		var field = Reflect.field(dialog,dialogFcnName);
		var _g = 0, _g1 = Reflect.fields(options);
		while(_g < _g1.length) {
			var key = _g1[_g];
			++_g;
			var value = Reflect.field(options,key);
			field.apply(dialog,["option",key,value]);
		}
		field.apply(dialog,["open"]);
	}
}
ui.widget.DialogManager.showLogin = function() {
	ui.widget.DialogManager.showDialog("loginDialog");
}
ui.widget.DialogManager.showNewUser = function() {
	ui.widget.DialogManager.showDialog("newUserDialog");
}
ui.widget.DialogManager.showNewAlias = function() {
	ui.widget.DialogManager.showDialog("newAliasDialog");
}
ui.widget.DialogManager.requestIntroduction = function(from,to) {
	var options = { };
	options.from = from;
	options.to = to;
	ui.widget.DialogManager.showDialog("requestIntroductionDialog",options);
}
ui.widget.DialogManager.showAliasManager = function() {
	ui.widget.DialogManager.showDialog("aliasManagerDialog");
}
ui.widget.ConnectionListHelper = function() { }
$hxClasses["ui.widget.ConnectionListHelper"] = ui.widget.ConnectionListHelper;
ui.widget.ConnectionListHelper.__name__ = ["ui","widget","ConnectionListHelper"];
ui.widget.ConnectionListHelper.filterConnections = function(c,term) {
	c.connectionsList("filterConnections",term);
}
ui.widget.ContentCompHelper = function() { }
$hxClasses["ui.widget.ContentCompHelper"] = ui.widget.ContentCompHelper;
ui.widget.ContentCompHelper.__name__ = ["ui","widget","ContentCompHelper"];
ui.widget.ContentCompHelper.content = function(cc) {
	return cc.contentComp("option","content");
}
ui.widget.ContentCompHelper.update = function(cc,c) {
	return cc.contentComp("update",c);
}
ui.widget.LabelCompHelper = function() { }
$hxClasses["ui.widget.LabelCompHelper"] = ui.widget.LabelCompHelper;
ui.widget.LabelCompHelper.__name__ = ["ui","widget","LabelCompHelper"];
ui.widget.LabelCompHelper.getLabel = function(l) {
	return l.labelComp("getLabel");
}
ui.widget.LabelCompHelper.parentIid = function(l) {
	return l.labelComp("option","parentIid");
}
ui.widget.UploadCompHelper = function() { }
$hxClasses["ui.widget.UploadCompHelper"] = ui.widget.UploadCompHelper;
ui.widget.UploadCompHelper.__name__ = ["ui","widget","UploadCompHelper"];
ui.widget.UploadCompHelper.value = function(m) {
	return m.uploadComp("value");
}
ui.widget.UploadCompHelper.clear = function(m) {
	m.uploadComp("clear");
}
ui.widget.UploadCompHelper.setPreviewImage = function(m,src) {
	m.uploadComp("setPreviewImage",src);
}
ui.widget.UrlCompHelper = function() { }
$hxClasses["ui.widget.UrlCompHelper"] = ui.widget.UrlCompHelper;
ui.widget.UrlCompHelper.__name__ = ["ui","widget","UrlCompHelper"];
ui.widget.UrlCompHelper.urlInput = function(m) {
	return m.urlComp("valEle");
}
ui.widget.FilterCompHelper = function() { }
$hxClasses["ui.widget.FilterCompHelper"] = ui.widget.FilterCompHelper;
ui.widget.FilterCompHelper.__name__ = ["ui","widget","FilterCompHelper"];
ui.widget.FilterCompHelper.fireFilter = function(f) {
	f.filterComp("fireFilter");
}
ui.widget.LiveBuildToggleHelper = function() { }
$hxClasses["ui.widget.LiveBuildToggleHelper"] = ui.widget.LiveBuildToggleHelper;
ui.widget.LiveBuildToggleHelper.__name__ = ["ui","widget","LiveBuildToggleHelper"];
ui.widget.LiveBuildToggleHelper.isLive = function(l) {
	return l.liveBuildToggle("isLive");
}
ui.widget.IntroductionNotificationCompHelper = function() { }
$hxClasses["ui.widget.IntroductionNotificationCompHelper"] = ui.widget.IntroductionNotificationCompHelper;
ui.widget.IntroductionNotificationCompHelper.__name__ = ["ui","widget","IntroductionNotificationCompHelper"];
ui.widget.LabelsListHelper = function() { }
$hxClasses["ui.widget.LabelsListHelper"] = ui.widget.LabelsListHelper;
ui.widget.LabelsListHelper.__name__ = ["ui","widget","LabelsListHelper"];
ui.widget.LabelsListHelper.getSelected = function(l) {
	return l.labelsList("getSelected");
}
ui.widget.score = {}
ui.widget.score.ContentTimeLine = function(paper,connection,startTime,endTime,initialWidth) {
	this.paper = paper;
	this.connection = connection;
	this.startTime = startTime;
	this.endTime = endTime;
	this.initialWidth = initialWidth;
	this.contents = new Array();
	this.contentElements = new Array();
	if(ui.widget.score.ContentTimeLine.next_y_pos > ui.widget.score.ContentTimeLine.initial_y_pos) ui.widget.score.ContentTimeLine.next_y_pos += ui.widget.score.ContentTimeLine.height + 20;
	ui.widget.score.ContentTimeLine.next_y_pos += 10;
	this.time_line_x = ui.widget.score.ContentTimeLine.next_x_pos;
	this.time_line_y = ui.widget.score.ContentTimeLine.next_y_pos;
	this.connectionElement = this.createConnectionElement();
	this.timeLineElement = (function($this) {
		var $r;
		var e123 = [$this.connectionElement];
		var me123 = paper;
		$r = me123.group.apply(me123, e123);
		return $r;
	}(this));
};
$hxClasses["ui.widget.score.ContentTimeLine"] = ui.widget.score.ContentTimeLine;
ui.widget.score.ContentTimeLine.__name__ = ["ui","widget","score","ContentTimeLine"];
ui.widget.score.ContentTimeLine.resetPositions = function() {
	ui.widget.score.ContentTimeLine.next_y_pos = ui.widget.score.ContentTimeLine.initial_y_pos;
	ui.widget.score.ContentTimeLine.next_x_pos = 10;
}
ui.widget.score.ContentTimeLine.prototype = {
	createAudioElement: function(content,x,y,rx,ry) {
		var ellipse = this.paper.ellipse(x,y,rx,ry).attr({ 'class' : "audioEllipse"});
		var icon = ui.widget.score.Icons.audioIcon(ellipse.getBBox());
		return (function($this) {
			var $r;
			var e123 = [ellipse,icon];
			var me123 = $this.paper;
			$r = me123.group.apply(me123, e123);
			return $r;
		}(this));
	}
	,createLinkElement: function(content,x,y,radius) {
		var hex = ui.widget.score.Shapes.createHexagon(this.paper,x,y,radius).attr({ 'class' : "urlContent"});
		var icon = ui.widget.score.Icons.linkIcon(hex.getBBox());
		return (function($this) {
			var $r;
			var e123 = [hex,icon];
			var me123 = $this.paper;
			$r = me123.group.apply(me123, e123);
			return $r;
		}(this));
	}
	,createImageElement: function(content,x,y,ele_width,ele_height) {
		var rect = this.paper.rect(x - ele_width / 2,y - ele_height / 2,ele_width,ele_height,3,3).attr({ 'class' : "imageContent"});
		var bbox = { cx : x, cy : y, width : ele_height, height : ele_height};
		var icon = ui.widget.score.Icons.imageIcon(bbox);
		return (function($this) {
			var $r;
			var e123 = [rect,icon];
			var me123 = $this.paper;
			$r = me123.group.apply(me123, e123);
			return $r;
		}(this));
	}
	,createTextElement: function(content,x,y,ele_width,ele_height) {
		var rect = this.paper.rect(x - ele_width / 2,y - ele_height / 2,ele_width,ele_height,3,3).attr({ 'class' : "messageContent"});
		var bbox = { cx : x, cy : y, width : ele_height, height : ele_height};
		var icon = ui.widget.score.Icons.messageIcon(bbox);
		return (function($this) {
			var $r;
			var e123 = [rect,icon];
			var me123 = $this.paper;
			$r = me123.group.apply(me123, e123);
			return $r;
		}(this));
	}
	,splitText: function(text,max_chars,max_lines) {
		if(max_lines == null) max_lines = 0;
		var words = text.split(" ");
		var lines = new Array();
		var line_no = 0;
		lines[line_no] = "";
		var _g1 = 0, _g = words.length;
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
					ele1 = _g.paper.image((js.Boot.__cast(content , ui.model.ImageContent)).props.imgSrc,bbox.x,bbox.y,bbox.width,bbox.height).attr({ preserveAspectRatio : "true"});
					break;
				case "URL":
					ele1 = ui.widget.score.Shapes.createHexagon(_g.paper,cx,cy,bbox.width / 2).attr({ 'class' : "urlContent"});
					break;
				case "TEXT":
					ele1 = _g.paper.rect(bbox.x,bbox.y,bbox.width,bbox.height,5,5).attr({ 'class' : "messageContentLarge"});
					break;
				}
				var g = (function($this) {
					var $r;
					var e123 = [ele1];
					var me123 = _g.paper;
					$r = me123.group.apply(me123, e123);
					return $r;
				}(this));
				g.attr({ contentType : g_type});
				g.attr({ id : g_id});
				g.click(function(evt1) {
					g.remove();
				});
				switch(g_type) {
				case "AUDIO":
					ui.widget.score.ForeignObject.appendAudioContent(g_id,bbox,(js.Boot.__cast(content , ui.model.AudioContent)).props);
					break;
				case "URL":
					ui.widget.score.ForeignObject.appendUrlContent(g_id,bbox,(js.Boot.__cast(content , ui.model.UrlContent)).props);
					break;
				case "TEXT":
					ui.widget.score.ForeignObject.appendMessageContent(g_id,bbox,(js.Boot.__cast(content , ui.model.MessageContent)).props);
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
	,cloneElement: function(ele) {
		var clone = ele.clone();
		clone.attr({ contentType : ele.attr("contentType")});
		clone.attr({ id : Std.string(ele.attr("id")) + "-clone"});
		return clone;
	}
	,createContentElement: function(content) {
		var radius = 10;
		var gap = 10;
		var x = (this.endTime - content.get_created().getTime()) / (this.endTime - this.startTime) * this.initialWidth + this.time_line_x + ui.widget.score.ContentTimeLine.width;
		var y = this.time_line_y + ui.widget.score.ContentTimeLine.height / 2;
		var ele;
		if(content.contentType == ui.model.ContentType.TEXT) this.addContentElement(content,this.createTextElement(js.Boot.__cast(content , ui.model.MessageContent),x,y,40,40)); else if(content.contentType == ui.model.ContentType.IMAGE) this.addContentElement(content,this.createImageElement(js.Boot.__cast(content , ui.model.ImageContent),x,y,40,40)); else if(content.contentType == ui.model.ContentType.URL) this.addContentElement(content,this.createLinkElement(js.Boot.__cast(content , ui.model.UrlContent),x,y,20)); else if(content.contentType == ui.model.ContentType.AUDIO) this.addContentElement(content,this.createAudioElement(js.Boot.__cast(content , ui.model.AudioContent),x,y,20,20));
	}
	,addContent: function(content) {
		this.contents.push(content);
		this.createContentElement(content);
	}
	,createConnectionElement: function() {
		var line = this.paper.line(this.time_line_x,this.time_line_y + ui.widget.score.ContentTimeLine.height / 2,this.initialWidth,this.time_line_y + ui.widget.score.ContentTimeLine.height / 2).attr({ 'class' : "contentLine"});
		var ellipse = this.paper.ellipse(this.time_line_x + ui.widget.score.ContentTimeLine.width / 2,this.time_line_y + ui.widget.score.ContentTimeLine.height / 2,ui.widget.score.ContentTimeLine.width / 2,ui.widget.score.ContentTimeLine.height / 2);
		ellipse.attr({ fill : "#fff", stroke : "#000", strokeWidth : "1px"});
		var imgSrc = (function($this) {
			var $r;
			try {
				$r = $this.connection.data.imgSrc;
			} catch( __e ) {
				$r = "media/default_avatar.jpg";
			}
			return $r;
		}(this));
		var img = this.paper.image(imgSrc,this.time_line_x,this.time_line_y,ui.widget.score.ContentTimeLine.width,ui.widget.score.ContentTimeLine.height).attr({ preserveAspectRatio : "true"});
		img.attr({ mask : ellipse});
		var border_ellipse = this.paper.ellipse(this.time_line_x + ui.widget.score.ContentTimeLine.width / 2,this.time_line_y + ui.widget.score.ContentTimeLine.height / 2,ui.widget.score.ContentTimeLine.width / 2,ui.widget.score.ContentTimeLine.height / 2);
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
		return (function($this) {
			var $r;
			var e123 = [line,img,border_ellipse];
			var me123 = $this.paper;
			$r = me123.group.apply(me123, e123);
			return $r;
		}(this));
	}
	,removeElements: function() {
		this.connectionElement.remove();
		var iter = HxOverrides.iter(this.contentElements);
		while(iter.hasNext()) iter.next().remove();
	}
	,__class__: ui.widget.score.ContentTimeLine
}
ui.widget.score.ForeignObject = function() { }
$hxClasses["ui.widget.score.ForeignObject"] = ui.widget.score.ForeignObject;
ui.widget.score.ForeignObject.__name__ = ["ui","widget","score","ForeignObject"];
ui.widget.score.ForeignObject.createForeignObject = function(ele_id,bbox) {
	var klone = d3.select("#" + ele_id);
	var fo = klone.append("foreignObject").attr("width",Std.string(bbox.width - 21)).attr("height",bbox.height).attr("x",Std.string(bbox.x)).attr("y",Std.string(bbox.y)).append("xhtml:body");
	return fo;
}
ui.widget.score.ForeignObject.appendMessageContent = function(ele_id,bbox,content) {
	var fo = ui.widget.score.ForeignObject.createForeignObject(ele_id,bbox);
	fo.append("div").attr("class","messageContent-large-text").style("width",Std.string(bbox.width - 49) + "px").style("height",Std.string(bbox.height) + "px").html(content.text);
}
ui.widget.score.ForeignObject.appendUrlContent = function(ele_id,bbox,content) {
	bbox.y = bbox.y + bbox.height / 2 - 12;
	bbox.x += 12;
	var fo = ui.widget.score.ForeignObject.createForeignObject(ele_id,bbox);
	var div = fo.append("div").style("width",Std.string(bbox.width - 49) + "px").style("font-size","12px");
	div.append("a").attr("href",content.url).attr("target","_blank").html(content.text).on("click",function() {
		d3.event.stopPropagation();
	});
}
ui.widget.score.ForeignObject.appendImageContent = function(ele_id,bbox,content) {
	bbox.y = bbox.y + bbox.height / 2;
	var fo = ui.widget.score.ForeignObject.createForeignObject(ele_id,bbox);
	var div = fo.append("div");
	div.append("div").attr("class","imageCaption").html(content.caption);
	div.append("img").attr("src",content.imgSrc).style("width",Std.string(bbox.width - 49) + "px").style("height",Std.string(bbox.height) + "px");
}
ui.widget.score.ForeignObject.appendAudioContent = function(ele_id,bbox,content) {
	bbox.y = bbox.y + bbox.height / 2 - 12;
	bbox.x = bbox.x + bbox.width / 3;
	var fo = ui.widget.score.ForeignObject.createForeignObject(ele_id,bbox);
	var div = fo.append("div");
	div.append("div").attr("class","audioTitle").style("width",Std.string(bbox.width - 49) + "px").style("font-size","12px").html(content.title);
	var audioDiv = div.append("div").style("width",Std.string(bbox.width - 49) + "px");
	audioDiv.append("audio").attr("src",content.audioSrc).attr("controls","controls").style("width","230px").style("height","50px").on("click",function() {
		d3.event.stopPropagation();
	});
}
ui.widget.score.Icons = function() { }
$hxClasses["ui.widget.score.Icons"] = ui.widget.score.Icons;
ui.widget.score.Icons.__name__ = ["ui","widget","score","Icons"];
ui.widget.score.Icons.createIcon = function(iconPath,className,bbox) {
	var paper = new Snap("#score-comp-svg");
	var ret = paper.path(iconPath);
	ret.attr("class",className);
	if(bbox != null) {
		var bbox_p = ret.getBBox();
		ret.transform("t" + Std.string(bbox.cx - bbox_p.width / 2 - bbox_p.x) + " " + Std.string(bbox.cy - bbox_p.height / 2 - bbox_p.y));
	}
	return ret;
}
ui.widget.score.Icons.audioIcon = function(bbox) {
	var audioPath = "M4.998,12.127v7.896h4.495l6.729,5.526l0.004-18.948l-6.73,5.526H4.998z M18.806,11.219c-0.393-0.389-1.024-0.389-1.415,0.002c-0.39,0.391-0.39,1.024,0.002,1.416v-0.002c0.863,0.864,1.395,2.049,1.395,3.366c0,1.316-0.531,2.497-1.393,3.361c-0.394,0.389-0.394,1.022-0.002,1.415c0.195,0.195,0.451,0.293,0.707,0.293c0.257,0,0.513-0.098,0.708-0.293c1.222-1.22,1.98-2.915,1.979-4.776C20.788,14.136,20.027,12.439,18.806,11.219z M21.101,8.925c-0.393-0.391-1.024-0.391-1.413,0c-0.392,0.391-0.392,1.025,0,1.414c1.45,1.451,2.344,3.447,2.344,5.661c0,2.212-0.894,4.207-2.342,5.659c-0.392,0.39-0.392,1.023,0,1.414c0.195,0.195,0.451,0.293,0.708,0.293c0.256,0,0.512-0.098,0.707-0.293c1.808-1.809,2.929-4.315,2.927-7.073C24.033,13.24,22.912,10.732,21.101,8.925z M23.28,6.746c-0.393-0.391-1.025-0.389-1.414,0.002c-0.391,0.389-0.391,1.023,0.002,1.413h-0.002c2.009,2.009,3.248,4.773,3.248,7.839c0,3.063-1.239,5.828-3.246,7.838c-0.391,0.39-0.391,1.023,0.002,1.415c0.194,0.194,0.45,0.291,0.706,0.291s0.513-0.098,0.708-0.293c2.363-2.366,3.831-5.643,3.829-9.251C27.115,12.389,25.647,9.111,23.28,6.746z";
	return ui.widget.score.Icons.createIcon(audioPath,"audioIcon",bbox);
}
ui.widget.score.Icons.messageIcon = function(bbox) {
	var messagePath = "M16,5.333c-7.732,0-14,4.701-14,10.5c0,1.982,0.741,3.833,2.016,5.414L2,25.667l5.613-1.441c2.339,1.317,5.237,2.107,8.387,2.107c7.732,0,14-4.701,14-10.5C30,10.034,23.732,5.333,16,5.333z";
	return ui.widget.score.Icons.createIcon(messagePath,"messageIcon",bbox);
}
ui.widget.score.Icons.linkIcon = function(bbox) {
	var linkPath = "M16.45,18.085l-2.47,2.471c0.054,1.023-0.297,2.062-1.078,2.846c-1.465,1.459-3.837,1.459-5.302-0.002c-1.461-1.465-1.46-3.836-0.001-5.301c0.783-0.781,1.824-1.131,2.847-1.078l2.469-2.469c-2.463-1.057-5.425-0.586-7.438,1.426c-2.634,2.637-2.636,6.907,0,9.545c2.638,2.637,6.909,2.635,9.545,0l0.001,0.002C17.033,23.511,17.506,20.548,16.45,18.085zM14.552,12.915l2.467-2.469c-0.053-1.023,0.297-2.062,1.078-2.848C19.564,6.139,21.934,6.137,23.4,7.6c1.462,1.465,1.462,3.837,0,5.301c-0.783,0.783-1.822,1.132-2.846,1.079l-2.469,2.468c2.463,1.057,5.424,0.584,7.438-1.424c2.634-2.639,2.633-6.91,0-9.546c-2.639-2.636-6.91-2.637-9.545-0.001C13.967,7.489,13.495,10.451,14.552,12.915zM18.152,10.727l-7.424,7.426c-0.585,0.584-0.587,1.535,0,2.121c0.585,0.584,1.536,0.584,2.121-0.002l7.425-7.424c0.584-0.586,0.584-1.535,0-2.121C19.687,10.141,18.736,10.142,18.152,10.727z";
	return ui.widget.score.Icons.createIcon(linkPath,"linkIcon",bbox);
}
ui.widget.score.Icons.imageIcon = function(bbox) {
	var imagePath = "M2.5,4.833v22.334h27V4.833H2.5zM25.25,25.25H6.75V6.75h18.5V25.25zM11.25,14c1.426,0,2.583-1.157,2.583-2.583c0-1.427-1.157-2.583-2.583-2.583c-1.427,0-2.583,1.157-2.583,2.583C8.667,12.843,9.823,14,11.25,14zM24.251,16.25l-4.917-4.917l-6.917,6.917L10.5,16.333l-2.752,2.752v5.165h16.503V16.25z";
	return ui.widget.score.Icons.createIcon(imagePath,"imageIcon",bbox);
}
ui.widget.score.TimeMarker = function(uberGroup,paper,width) {
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
	this.drawTimeLine();
};
$hxClasses["ui.widget.score.TimeMarker"] = ui.widget.score.TimeMarker;
ui.widget.score.TimeMarker.__name__ = ["ui","widget","score","TimeMarker"];
ui.widget.score.TimeMarker.prototype = {
	drawTimeLine: function() {
		var margin = 7;
		var y = 3 * margin;
		var attrs = { strokeOpacity : 0.6, stroke : "#cccccc", strokeWidth : 1};
		this.line = this.paper.line(margin,y,this.width - margin,y).attr(attrs);
		this.group.append(this.line);
		var interval = (this.width - 2 * margin) / 24;
		var x = margin;
		var _g = 0;
		while(_g < 25) {
			var i = _g++;
			switch(i) {
			case 0:case 12:case 24:
				this.group.append(this.paper.line(x,y - margin,x,y + margin).attr(attrs));
				if(i == 0) this.group.append(this.paper.text(x + 3,y - margin + 1,"2013").attr({ fontSize : "8px"})); else if(i == 12) this.group.append(this.paper.text(x + 3,y - margin + 1,"2012").attr({ fontSize : "8px"}));
				if(i == 0 || i == 12) this.group.append(this.paper.text(x + 10,y + margin,"Dec").transform("rotate(30," + x + "," + y + ")").attr({ fontSize : "8px"}));
				x += interval;
				break;
			case 3:case 15:
				this.group.append(this.paper.line(x,y,x,y + margin + 2).attr(attrs));
				this.group.append(this.paper.text(x + 10,y + margin,"Sep").transform("rotate(30," + x + "," + y + ")").attr({ fontSize : "8px"}));
				x += interval;
				break;
			case 6:case 18:
				this.group.append(this.paper.line(x,y,x,y + margin + 2).attr(attrs));
				this.group.append(this.paper.text(x + 10,y + margin,"Jun").transform("rotate(30," + x + "," + y + ")").attr({ fontSize : "8px"}));
				x += interval;
				break;
			case 9:case 21:
				this.group.append(this.paper.line(x,y,x,y + margin + 2).attr(attrs));
				this.group.append(this.paper.text(x + 10,y + margin,"Mar").transform("rotate(30," + x + "," + y + ")").attr({ fontSize : "8px"}));
				x += interval;
				break;
			default:
				this.group.append(this.paper.line(x,y,x,y + margin).attr(attrs));
				x += interval;
			}
		}
	}
	,__class__: ui.widget.score.TimeMarker
}
ui.widget.score.Shapes = function() { }
$hxClasses["ui.widget.score.Shapes"] = ui.widget.score.Shapes;
ui.widget.score.Shapes.__name__ = ["ui","widget","score","Shapes"];
ui.widget.score.Shapes.createHexagon = function(paper,cx,cy,r) {
	var theta = 0.523598775;
	var hexagon = paper.polygon([cx - r * Math.sin(theta),cy - r * Math.cos(theta),cx - r,cy,cx - r * Math.sin(theta),cy + r * Math.cos(theta),cx + r * Math.sin(theta),cy + r * Math.cos(theta),cx + r,cy,cx + r * Math.sin(theta),cy - r * Math.cos(theta)]);
	hexagon.attr("cx",cx);
	hexagon.attr("cy",cy);
	hexagon.attr("r",r);
	return hexagon;
}
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; };
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; };
if(Array.prototype.indexOf) HxOverrides.remove = function(a,o) {
	var i = a.indexOf(o);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
};
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
Xml.Element = "element";
Xml.PCData = "pcdata";
Xml.CData = "cdata";
Xml.Comment = "comment";
Xml.DocType = "doctype";
Xml.ProcessingInstruction = "processingInstruction";
Xml.Document = "document";
if(typeof(JSON) != "undefined") haxe.Json = JSON;
var q = window.jQuery;
js.JQuery = q;
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
	var t_x = [tAxis.left,tAxis.left + $(this).outerWidth()];
	var t_y = [tAxis.top,tAxis.top + $(this).outerHeight()];
	var thisPos = el.offset();
	var i_x = [thisPos.left,thisPos.left + el.outerWidth()];
	var i_y = [thisPos.top,thisPos.top + el.outerHeight()];
	var intersects = false;
	if(t_x[0] < i_x[1] && t_x[1] > i_x[0] && t_y[0] < i_y[1] && t_y[1] > i_y[0]) intersects = true;
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
		self.maxIconWrapper = new $("<a href='#' class='ui-dialog-titlebar-close ui-corner-all' style='margin-right: 18px;' role='button'>");
		var maxIcon = new $("<span class='ui-icon ui-icon-extlink'>maximize</span>");
		hovers = hovers.add(self.maxIconWrapper);
		self.maxIconWrapper.append(maxIcon);
		closeBtn.before(self.maxIconWrapper);
		self.maxIconWrapper.click(function(evt) {
			self.maximize();
		});
		self.restoreIconWrapper = new $("<a href='#' class='ui-dialog-titlebar-close ui-corner-all' style='margin-right: 18px; display: none;' role='button'>");
		var restoreIcon = new $("<span class='ui-icon ui-icon-newwin'>restore</span>");
		hovers = hovers.add(self.restoreIconWrapper);
		self.restoreIconWrapper.append(restoreIcon);
		closeBtn.before(self.restoreIconWrapper);
		self.restoreIconWrapper.click(function(evt) {
			self.restore();
		});
		hovers.hover(function(evt) {
			$(this).addClass("ui-state-hover");
		},function(evt) {
			$(this).removeClass("ui-state-hover");
		});
	}, restore : function() {
		var self = this;
		var selfElement = this.element;
		selfElement.m3dialog("option","height",self.originalSize.height);
		selfElement.m3dialog("option","width",self.originalSize.width);
		selfElement.parent().position({ my : "middle", at : "middle", of : js.Browser.window});
		self.restoreIconWrapper.hide();
		self.maxIconWrapper.show();
		self.options.onMaxToggle();
	}, maximize : function() {
		var self = this;
		var selfElement = this.element;
		self.originalSize = { height : selfElement.parent().height(), width : selfElement.parent().width()};
		var window = new $(js.Browser.window);
		var windowDimensions = { height : window.height(), width : window.width()};
		selfElement.m3dialog("option","height",windowDimensions.height * .85);
		selfElement.m3dialog("option","width",windowDimensions.width * .85);
		selfElement.parent().position({ my : "middle", at : "middle", of : window});
		self.maxIconWrapper.hide();
		self.restoreIconWrapper.show();
		self.options.onMaxToggle();
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
		var _g = 0, _g1 = self.options.menuOptions;
		while(_g < _g1.length) {
			var menuOption = [_g1[_g]];
			++_g;
			var icon = m3.helper.StringHelper.isNotBlank(menuOption[0].icon)?"<span class='ui-icon " + menuOption[0].icon + "'></span>":"";
			new $("<li><a href='#'>" + icon + menuOption[0].label + "</a></li>").appendTo(selfElement).click((function(menuOption) {
				return function(evt) {
					menuOption[0].action(evt,selfElement);
				};
			})(menuOption));
		}
		selfElement.on("contextmenu",function(evt) {
			return false;
		});
		this._super("create");
	}, _closeOnDocumentClick : function(evt) {
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
ui.model.EM.hash = new haxe.ds.EnumValueMap();
ui.model.EM.oneTimers = new Array();
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of UploadComp must be a div element");
		selfElement.addClass("uploadComp container " + m3.widget.Widgets.getWidgetClasses());
		self._createFileUploadComponent();
		selfElement.on("dragleave",function(evt,d) {
			ui.AppContext.LOGGER.debug("dragleave");
			var target = evt.target;
			if(target != null && target == selfElement[0]) $(this).removeClass("drop");
			evt.preventDefault();
			evt.stopPropagation();
		});
		selfElement.on("dragenter",function(evt,d) {
			ui.AppContext.LOGGER.debug("dragenter");
			$(this).addClass("over");
			evt.preventDefault();
			evt.stopPropagation();
		});
		selfElement.on("dragover",function(evt,d) {
			ui.AppContext.LOGGER.debug("dragover");
			evt.preventDefault();
			evt.stopPropagation();
		});
		selfElement.on("drop",function(evt,d) {
			ui.AppContext.LOGGER.debug("drop");
			self._traverseFiles(evt.originalEvent.dataTransfer.files);
			$(this).removeClass("drop");
			evt.preventDefault();
			evt.stopPropagation();
		});
	}, _createFileUploadComponent : function() {
		var self1 = this;
		var selfElement = this.element;
		if(self1.inner_element_id != null) new $("#" + self1.inner_element_id).remove();
		self1.inner_element_id = "files-upload-" + StringTools.hex(Std.random(999999));
		var filesUpload = new $("<input id='" + self1.inner_element_id + "' class='files-upload' type='file'/>").prependTo(selfElement);
		filesUpload.change(function(evt) {
			self1._traverseFiles(this.files);
		});
	}, _uploadFile : function(file) {
		var self2 = this;
		var selfElement = this.element;
		if(typeof FileReader === 'undefined') {
			m3.util.JqueryUtil.alert("FileUpload is not supported by your browser");
			return;
		}
		if(self2.options.contentType == ui.model.ContentType.IMAGE && !new EReg("image","i").match(file.type)) {
			m3.util.JqueryUtil.alert("Please select an image file.");
			return;
		}
		if(self2.options.contentType == ui.model.ContentType.AUDIO && !new EReg("audio","i").match(file.type)) {
			m3.util.JqueryUtil.alert("Please select an audio file.");
			return;
		}
		ui.AppContext.LOGGER.debug("upload " + Std.string(file.name));
		var reader = new FileReader();
		reader.onload = function(evt) {
			self2.setPreviewImage(evt.target.result);
			if(self2.options.onload != null) self2.options.onload(evt.target.result);
		};
		reader.readAsDataURL(file);
	}, setPreviewImage : function(src) {
		var self = this;
		if(self.previewImg == null) {
			var selfElement = this.element;
			self.previewImg = new $("<img class='file_about_to_be_uploaded'/>").appendTo(selfElement);
		}
		self.previewImg.attr("src",src);
	}, _traverseFiles : function(files) {
		ui.AppContext.LOGGER.debug("traverse the files");
		var self = this;
		if(m3.helper.ArrayHelper.hasValues(files)) {
			var _g = 0;
			while(_g < 1) {
				var i = _g++;
				self._uploadFile(files[i]);
			}
		} else {
		}
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}, value : function() {
		var self = this;
		return self.previewImg.attr("src");
	}, clear : function() {
		var self = this;
		self.previewImg.remove();
		self.previewImg = null;
		self._createFileUploadComponent();
	}};
};
$.widget("ui.uploadComp",defineWidget());
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of AliasManagerDialog must be a div element");
		selfElement.addClass("_aliasManagerDialog").hide();
		self._showAliasDetail(null);
	}, initialized : false, _showAliasDetail : function(alias) {
		var self1 = this;
		var selfElement1 = this.element;
		selfElement1.empty();
		var leftDiv = new $("<div class='fleft boxsizingBorder' style='min-width: 70%; min-height: 100%; padding-top: 15px;'></div>").appendTo(selfElement1);
		var rightDiv = new $("<div class='fright ui-corner-all' style='min-width: 25%; background-color: lightblue; min-height: 100%;'></div>").appendTo(selfElement1);
		var imgSrc = "media/default_avatar.jpg";
		if(alias != null) {
			var loadAliasBtn = new $("<button class='fleft'>Use This Alias</button>").appendTo(leftDiv).button().click(function(evt) {
				ui.AppContext.currentAlias = alias;
				ui.model.EM.change(ui.model.EMEvent.AliasLoaded,alias);
				m3.jq.JQDialogHelper.close(selfElement1);
			});
			leftDiv.append("<br class='clear'/><br/>");
			if(m3.helper.StringHelper.isNotBlank((function($this) {
				var $r;
				try {
					$r = alias.data.imgSrc;
				} catch( __e ) {
					$r = "";
				}
				return $r;
			}(this)))) imgSrc = alias.data.imgSrc;
			leftDiv.append(new $("<img alt='alias' src='" + imgSrc + "' class='userImg shadow'/>"));
			leftDiv.append(new $("<h2>" + alias.name + "</h2>"));
			var btnDiv = new $("<div></div>").appendTo(leftDiv);
			var setDefaultBtn = new $("<button>Set Default</button>").appendTo(btnDiv).button().click(function(evt) {
				alias.data.isDefault = true;
				ui.model.EM.change(ui.model.EMEvent.UpdateAlias,alias);
			});
			var editBtn = new $("<button>Edit</button>").appendTo(btnDiv).button().click(function(evt) {
				self1._showAliasEditor(alias);
			});
			var deleteBtn = new $("<button>Delete</button>").appendTo(btnDiv).button().click(function(evt) {
				ui.model.EM.change(ui.model.EMEvent.DeleteAlias,alias);
			});
		} else {
			if(m3.helper.StringHelper.isNotBlank((function($this) {
				var $r;
				try {
					$r = ui.AppContext.AGENT.data.imgSrc;
				} catch( __e ) {
					$r = "";
				}
				return $r;
			}(this)))) imgSrc = ui.AppContext.AGENT.data.imgSrc;
			leftDiv.append(new $("<img alt='alias' src='" + imgSrc + "' class='userImg shadow'/>"));
			leftDiv.append(new $("<h2>" + ui.AppContext.AGENT.data.name + "</h2>"));
		}
		rightDiv.append("<h2>Agent</h2>");
		var span = new $("<span class='clickable'></span>").appendTo(rightDiv).click(function(evt) {
			self1._showAliasDetail(null);
		}).append((function($this) {
			var $r;
			try {
				$r = ui.AppContext.AGENT.data.name;
			} catch( __e ) {
				$r = "";
			}
			return $r;
		}(this)));
		rightDiv.append("<br/>");
		rightDiv.append("<h2>Aliases</h2>");
		Lambda.iter(ui.AppContext.ALIASES,function(a) {
			var span1 = new $("<span class='clickable'></span>").appendTo(rightDiv).click(function(evt) {
				self1._showAliasDetail(a);
			}).append(a.name);
			rightDiv.append("<br/>");
		});
		new $("<button style='margin-top: 30px;'>New Alias</button>").button().click(function(evt) {
			self1._showAliasEditor(null);
		}).appendTo(rightDiv);
	}, _showAliasEditor : function(alias1) {
		var self2 = this;
		var selfElement2 = this.element;
		selfElement2.empty();
		var leftDiv = new $("<div class='fleft boxsizingBorder' style='min-width: 70%; min-height: 100%; padding-top: 15px;'></div>").appendTo(selfElement2);
		var rightDiv1 = new $("<div class='fright ui-corner-all' style='min-width: 25%; background-color: lightblue; min-height: 100%;'></div>").appendTo(selfElement2);
		var imgSrc = "media/default_avatar.jpg";
		leftDiv.append("<div style='text-align: left;font-weight: bold;font-size: 1.2em;'>Alias Name:</div>");
		var aliasName = new $("<input class='ui-corner-all ui-state-active ui-widget-content' style='width: 80%;padding: .2em .4em;'/>").appendTo(leftDiv);
		if(alias1 != null) aliasName.val(alias1.name);
		leftDiv.append("<br/><br/>");
		var aliasImg = null;
		leftDiv.append(new $("<div style='text-align: left;font-weight: bold;font-size: 1.2em;'>Profile Picture: </div>").append(new $("<a style='font-weight: 1em;font-weight: normal; cursor: pointer;'>Change</a>").click(function(evt) {
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
				$r = alias1.data.imgSrc;
			} catch( __e ) {
				$r = "";
			}
			return $r;
		}(this)))) imgSrc = alias1.data.imgSrc;
		aliasImg = new $("<img alt='alias' src='" + imgSrc + "' class='userImg shadow'/>");
		leftDiv.append(aliasImg);
		leftDiv.append("<br/><br/>");
		var btnDiv = new $("<div></div>").appendTo(leftDiv);
		var updateBtn = new $("<button>" + (alias1 != null?"Update":"Create") + "</button>").appendTo(btnDiv).button().click(function(evt) {
			var name = aliasName.val();
			if(m3.helper.StringHelper.isBlank(name)) {
				m3.util.JqueryUtil.alert("Alias name cannot be blank.","Error");
				return;
			}
			var profilePic = aliasImg.attr("src");
			if(m3.helper.StringHelper.startsWithAny(profilePic,["media"])) profilePic = "";
			var applyDlg = alias1 == null?(function($this) {
				var $r;
				alias1 = new ui.model.Alias();
				alias1.data = new ui.model.UserData();
				$r = function() {
					ui.model.EM.change(ui.model.EMEvent.CreateAlias,alias1);
				};
				return $r;
			}(this)):function() {
				ui.model.EM.change(ui.model.EMEvent.UpdateAlias,alias1);
			};
			alias1.name = name;
			alias1.data.imgSrc = profilePic;
			applyDlg();
			self2._showAliasDetail(alias1);
		});
		var cancelBtn = new $("<button>Cancel</button>").appendTo(btnDiv).button().click(function(evt) {
			self2._showAliasDetail(alias1);
		});
		rightDiv1.append("<h2>Agent</h2>");
		var span = new $("<span class='clickable'></span>").appendTo(rightDiv1).click(function(evt) {
			self2._showAliasDetail(null);
		}).append((function($this) {
			var $r;
			try {
				$r = ui.AppContext.AGENT.data.name;
			} catch( __e ) {
				$r = "";
			}
			return $r;
		}(this)));
		rightDiv1.append("<br/>");
		rightDiv1.append("<h2>Aliases</h2>");
		Lambda.iter(ui.AppContext.ALIASES,function(a1) {
			var span1 = new $("<span class='clickable'></span>").appendTo(rightDiv1).click(function(evt) {
				self2._showAliasDetail(a1);
			}).append(a1.name);
			rightDiv1.append("<br/>");
		});
		new $("<button style='margin-top: 30px;'>New Alias</button>").button().click(function(evt) {
		}).appendTo(rightDiv1);
	}, _createAliasManager : function() {
		var self = this;
		var selfElement = this.element;
		var alias = new ui.model.Alias();
		alias.name = self.aliasName.val();
		alias.data.name = self.username.val();
		if(m3.helper.StringHelper.isBlank(alias.data.name) || m3.helper.StringHelper.isBlank(alias.name)) return;
		selfElement.find(".ui-state-error").removeClass("ui-state-error");
		ui.model.EM.change(ui.model.EMEvent.CreateAlias,alias);
	}, _buildDialog : function() {
		var self = this;
		var selfElement3 = this.element;
		self.initialized = true;
		var dlgOptions = { autoOpen : false, title : "Alias Manager", height : 440, width : 480, buttons : { }, close : function(evt,ui) {
			selfElement3.find(".placeholder").removeClass("ui-state-error");
		}};
		selfElement3.dialog(dlgOptions);
	}, open : function() {
		var self = this;
		var selfElement = this.element;
		if(!self.initialized) self._buildDialog();
		m3.jq.JQDialogHelper.open(selfElement);
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.aliasManagerDialog",defineWidget());
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
		},function(evt) {
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
		var filter = js.Boot.__cast(selfElement.closest("#filter") , $);
		filter.filterComp("fireFilter");
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.andOrToggle",defineWidget());
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
			return new $("<div></div>").chatMessageComp({ message : msg, orientation : ui.widget.ChatOrientation.chatRight});
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
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of FilterCombination must be a div element");
		selfElement.data("getNode",function() {
			var root = (selfElement.children(".andOrToggle").data("getNode"))();
			root.type = self.options.type;
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
		self._filterables.listen(function(fc,evt) {
			if(evt.isAdd()) self._add(fc); else if(evt.isUpdate()) {
				fc.css("position","absolute").css({ left : "", top : ""});
				self._layout();
			} else if(evt.isDelete()) self._remove(fc);
		});
		selfElement.on("dragstop",function(dragstopEvt,dragstopUi) {
			ui.AppContext.LOGGER.debug("dragstop on filtercombo");
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
			var fc = js.Boot.__cast(filterableComp , $);
			return fc;
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
	}, _add : function(filterable1) {
		var self1 = this;
		var selfElement = this.element;
		filterable1.appendTo(selfElement).addClass("inFilterCombination").css("position","absolute").css({ left : "", top : ""}).on("dragstop",function(evt) {
			if(!filterable1.parent("#" + self1._id).exists()) self1.removeFilterable(filterable1);
		});
		self1._layout();
	}, _remove : function(filterable) {
		var self = this;
		var selfElement = this.element;
		filterable.removeClass("inFilterCombination");
		var iter = self._filterables.iterator();
		if(iter.hasNext()) {
			var filterable1 = iter.next();
			if(iter.hasNext()) self._layout(); else {
				var position = filterable1.offset();
				filterable1.appendTo(selfElement.parent()).offset(position);
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
		var filterableConns = new m3.observable.FilteredSet(self._filterables,function(fc) {
			return fc.hasClass("connectionAvatar");
		});
		var filterableLabels = new m3.observable.FilteredSet(self._filterables,function(fc) {
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
		var filter = js.Boot.__cast(selfElement.parent("#filter") , $);
		filter.filterComp("fireFilter");
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.filterCombination",defineWidget());
var defineWidget = function() {
	return { options : { connection : null, isDragByHelper : true, containment : false, dndEnabled : true, classes : null, dragstop : null, cloneFcn : function(filterableComp,isDragByHelper,containment,dragstop) {
		if(containment == null) containment = false;
		if(isDragByHelper == null) isDragByHelper = false;
		var connectionAvatar = js.Boot.__cast(filterableComp , $);
		if(connectionAvatar.hasClass("clone")) return connectionAvatar;
		var clone = new $("<div class='clone'></div>");
		clone.connectionAvatar({ connection : connectionAvatar.connectionAvatar("option","connection"), isDragByHelper : isDragByHelper, containment : containment, dragstop : dragstop, classes : connectionAvatar.connectionAvatar("option","classes"), cloneFcn : connectionAvatar.connectionAvatar("option","cloneFcn"), dropTargetClass : connectionAvatar.connectionAvatar("option","dropTargetClass"), helperFcn : connectionAvatar.connectionAvatar("option","helperFcn")});
		return clone;
	}, dropTargetClass : "connectionDT", helperFcn : function() {
		var clone = $(this).clone();
		return clone.children("img").addClass("connectionDraggingImg");
	}}, _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of ConnectionAvatar must be a div element");
		selfElement.attr("id","connavatar_" + StringTools.htmlEscape(self.options.connection.name()));
		selfElement.addClass(m3.widget.Widgets.getWidgetClasses() + " connectionAvatar filterable").attr("title",self.options.connection.name());
		var imgSrc = "media/default_avatar.jpg";
		if(m3.helper.StringHelper.isNotBlank((function($this) {
			var $r;
			try {
				$r = self.options.connection.data.imgSrc;
			} catch( __e ) {
				$r = "";
			}
			return $r;
		}(this)))) imgSrc = self.options.connection.data.imgSrc;
		var img = new $("<img src='" + imgSrc + "' class='shadow'/>");
		selfElement.append(img);
		(js.Boot.__cast(selfElement , $)).tooltip();
		if(!self.options.dndEnabled) img.mousedown(function(evt) {
			return false;;
		}); else {
			selfElement.addClass("filterable");
			selfElement.data("clone",self.options.cloneFcn);
			selfElement.data("dropTargetClass",self.options.dropTargetClass);
			selfElement.data("getNode",function() {
				var node = new ui.model.ConnectionNode();
				node.type = "CONNECTION";
				node.content = self.options.connection;
				return node;
			});
			selfElement.on("dragstop",function(dragstopEvt,dragstopUi) {
				if(self.options.dragstop != null) self.options.dragstop(dragstopEvt,dragstopUi);
			});
			var helper = "clone";
			if(!self.options.isDragByHelper) helper = "original"; else if(self.options.helperFcn != null && Reflect.isFunction(self.options.helperFcn)) helper = self.options.helperFcn;
			(js.Boot.__cast(selfElement , $)).draggable({ containment : self.options.containment, helper : helper, distance : 10, revertDuration : 200, scroll : false, start : function(evt,_ui) {
				(js.Boot.__cast(selfElement , $)).draggable("option","revert",false);
			}});
			(js.Boot.__cast(selfElement , $)).droppable({ accept : function(d) {
				return !$(this).parent()["is"](".filterCombination") && $(this).parent()["is"](".dropCombiner") && d["is"](".connectionAvatar");
			}, activeClass : "ui-state-hover", hoverClass : "ui-state-active", greedy : true, drop : function(event,_ui) {
				var filterCombiner = new $("<div></div>");
				filterCombiner.appendTo($(this).parent());
				filterCombiner.filterCombination({ event : event, type : "CONNECTION", dragstop : self.options.dragstop});
				filterCombiner.filterCombination("addFilterable",$(this));
				var clone = (_ui.draggable.data("clone"))(_ui.draggable,false,"#filter");
				clone.addClass("filterTrashable " + Std.string(_ui.draggable.data("dropTargetClass")));
				filterCombiner.filterCombination("addFilterable",clone);
				filterCombiner.filterCombination("position");
			}, tolerance : "pointer"});
		}
	}, update : function(conn) {
		var self = this;
		var selfElement = this.element;
		self.options.connection = conn;
		var imgSrc = "media/default_avatar.jpg";
		if(m3.helper.StringHelper.isNotBlank((function($this) {
			var $r;
			try {
				$r = self.options.connection.data.imgSrc;
			} catch( __e ) {
				$r = "";
			}
			return $r;
		}(this)))) imgSrc = self.options.connection.data.imgSrc;
		selfElement.children("img").attr("src",imgSrc);
		selfElement.attr("title",(function($this) {
			var $r;
			try {
				$r = self.options.connection.data.name;
			} catch( __e ) {
				$r = "";
			}
			return $r;
		}(this)));
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.connectionAvatar",defineWidget());
var defineWidget = function() {
	return { options : { connection : null, classes : null}, _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of ConnectionComp must be a div element");
		selfElement.addClass(m3.widget.Widgets.getWidgetClasses() + " connection container boxsizingBorder");
		self._avatar = new $("<div class='avatar'></div>").connectionAvatar({ connection : self.options.connection, dndEnabled : true, isDragByHelper : true, containment : false});
		var notificationDiv = new $(".notifications",selfElement);
		if(!notificationDiv.exists()) notificationDiv = new $("<div class='notifications'>0</div>");
		notificationDiv.appendTo(selfElement);
		selfElement.append(self._avatar);
		selfElement.append("<div class='name'>" + self.options.connection.name() + "</div>");
		selfElement.append("<div class='clear'></div>");
		(js.Boot.__cast(selfElement , $)).droppable({ accept : function(d) {
			return d["is"](".connectionAvatar");
		}, activeClass : "ui-state-hover", hoverClass : "ui-state-active", greedy : true, drop : function(event,_ui) {
			var dropper = ui.widget.ConnectionAvatarHelper.getConnection(js.Boot.__cast(_ui.draggable , $));
			var droppee = self.options.connection;
			if(!dropper.equals(droppee)) ui.widget.DialogManager.requestIntroduction(dropper,droppee);
		}, tolerance : "pointer"});
		var set = new m3.observable.FilteredSet(ui.AppContext.INTRODUCTIONS,function(i) {
			return i.aConnectionIid == self.options.connection.iid || i.bConnectionIid == self.options.connection.iid;
		});
		set.listen(function(i,evt) {
			if(evt.isAdd()) self.addNotification(); else if(evt.isDelete()) self.deleteNotification();
		});
	}, update : function(conn) {
		var self = this;
		var selfElement = this.element;
		self.options.connection = conn;
		selfElement.children(".name").text((function($this) {
			var $r;
			try {
				$r = self.options.connection.data.name;
			} catch( __e ) {
				$r = "";
			}
			return $r;
		}(this)));
		ui.widget.ConnectionAvatarHelper.update(self._avatar,conn);
	}, addNotification : function() {
		var self = this;
		var selfElement = this.element;
		var notificationDiv = new $(".notifications",selfElement);
		var count = Std.parseInt(notificationDiv.html());
		count += 1;
		notificationDiv.html(Std.string(count));
		notificationDiv.css("visibility","visible");
	}, deleteNotification : function() {
		var self = this;
		var selfElement = this.element;
		var notificationDiv = new $(".notifications",selfElement);
		var count = Std.parseInt(notificationDiv.html());
		if(count <= 1) {
			notificationDiv.html("0");
			notificationDiv.css("visibility","hidden");
		} else {
			count -= 1;
			notificationDiv.html(Std.string(count));
		}
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.connectionComp",defineWidget());
var defineWidget = function() {
	return { options : { itemsClass : null}, _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of ConnectionsList must be a div element");
		selfElement.addClass(m3.widget.Widgets.getWidgetClasses());
		ui.model.EM.addListener(ui.model.EMEvent.AliasLoaded,new ui.model.EMListener(function(alias) {
			ui.AppContext.LOGGER.warn("fix me self._setConnections(alias.connectionSet)");
		},"ConnectionsList-Alias"));
		ui.model.EM.addListener(ui.model.EMEvent.TARGET_CHANGE,new ui.model.EMListener(function(conn) {
			if(conn != null) ui.AppContext.LOGGER.warn("fix me self._setConnections(conn.connectionSet)"); else ui.AppContext.LOGGER.warn("fix me self._setConnections(alias.connectionSet)");
		},"ConnectionsList-TargetChange"));
	}, _mapListener : function(conn,connComp,evt) {
		if(evt.isAdd()) {
			var spacer = new $("#sideRightSpacer");
			spacer.before(connComp);
		} else if(evt.isUpdate()) ui.widget.ConnectionCompHelper.update(connComp,conn); else if(evt.isDelete()) connComp.remove();
		ui.model.EM.change(ui.model.EMEvent.FitWindow);
	}, _setConnections : function(connections) {
		var self = this;
		var selfElement = this.element;
		selfElement.children(".connection").remove();
		if(self.connectionsMap != null) self.connectionsMap.removeListeners(self._mapListener);
		self.connectionsMap = new m3.observable.MappedSet(connections,function(conn) {
			return new $("<div></div>").connectionComp({ connection : conn});
		});
		self.connectionsMap.mapListen(self._mapListener);
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}, filterConnections : function(term) {
		term = term.toLowerCase();
		var self = this;
		var iter = self.connectionsMap.iterator();
		while(iter.hasNext()) {
			var c = iter.next();
			if(term == "" || ui.widget.ConnectionCompHelper.connection(c).name().toLowerCase().indexOf(term) != -1) c.show(); else c.hide();
		}
	}};
};
$.widget("ui.connectionsList",defineWidget());
var defineWidget = function() {
	return { options : { labelIid : null, isDragByHelper : true, containment : false, dndEnabled : true, classes : null, dropTargetClass : "labelDT", dragstop : null, cloneFcn : function(filterableComp,isDragByHelper,containment,dragstop) {
		if(containment == null) containment = false;
		if(isDragByHelper == null) isDragByHelper = false;
		var labelComp = js.Boot.__cast(filterableComp , $);
		if(labelComp.hasClass("clone")) return labelComp;
		var clone = new $("<div class='clone'></div>");
		clone.labelComp({ labelIid : labelComp.labelComp("option","labelIid"), parentIid : labelComp.labelComp("option","parentIid"), isDragByHelper : isDragByHelper, containment : containment, dragstop : dragstop, classes : labelComp.labelComp("option","classes"), cloneFcn : labelComp.labelComp("option","cloneFcn"), dropTargetClass : labelComp.labelComp("option","dropTargetClass")});
		return clone;
	}}, getLabel : function() {
		var self = this;
		return self.label;
	}, _registerListeners : function() {
		var self1 = this;
		var selfElement = this.element;
		self1._onupdate = function(label,t) {
			if(t.isAddOrUpdate()) {
				if(label.deleted) {
					self1.destroy();
					selfElement.remove();
				} else {
					self1.label = label;
					selfElement.find(".labelBody").text(label.name);
					selfElement.find(".labelTail").css("border-right-color",label.data.color);
					selfElement.find(".labelBox").css("background",label.data.color);
				}
			} else if(t.isDelete()) {
				self1.destroy();
				selfElement.remove();
			}
		};
		self1.filteredSet = new m3.observable.FilteredSet(ui.AppContext.LABELS,function(label) {
			return label.iid == self1.options.labelIid;
		});
		self1.filteredSet.listen(self1._onupdate);
	}, _create : function() {
		var self2 = this;
		var selfElement1 = this.element;
		if(!selfElement1["is"]("div")) throw new m3.exception.Exception("Root of LabelComp must be a div element");
		self2.label = m3.helper.OSetHelper.getElement(ui.AppContext.LABELS,self2.options.labelIid);
		if(self2.label == null) {
			self2.label = new ui.model.Label("-->8<--");
			self2.label.iid = self2.options.labelIid;
			ui.AppContext.MASTER_LABELS.add(self2.label);
		}
		selfElement1.addClass("label labelComp ").attr("id",StringTools.htmlEscape(self2.label.name) + "_" + m3.util.UidGenerator.create(8));
		var labelTail = new $("<div class='labelTail'></div>");
		labelTail.css("border-right-color",self2.label.data.color);
		selfElement1.append(labelTail);
		var labelBox = new $("<div class='labelBox shadowRight'></div>");
		labelBox.css("background",self2.label.data.color);
		var labelBody = new $("<div class='labelBody'></div>");
		var labelText = new $("<div>" + self2.label.name + "</div>");
		labelBody.append(labelText);
		labelBox.append(labelBody);
		selfElement1.append(labelBox).append("<div class='clear'></div>");
		selfElement1.addClass("filterable");
		self2._registerListeners();
		if(self2.options.dndEnabled) {
			selfElement1.data("clone",self2.options.cloneFcn);
			selfElement1.data("dropTargetClass",self2.options.dropTargetClass);
			selfElement1.data("getNode",function() {
				var node = new ui.model.LabelNode();
				node.type = "LABEL";
				node.content = self2.label;
				return node;
			});
			var helper = "clone";
			if(!self2.options.isDragByHelper) helper = "original"; else if(self2.options.helperFcn != null && Reflect.isFunction(self2.options.helperFcn)) helper = self2.options.helperFcn;
			selfElement1.on("dragstop",function(dragstopEvt,_ui) {
				ui.AppContext.LOGGER.debug("dragstop on label | " + self2.label.name);
				if(self2.options.dragstop != null) self2.options.dragstop(dragstopEvt,_ui);
				new $(js.Browser.document).off("keydown keyup");
				_ui.helper.find("#copyIndicator").remove();
			});
			var showOrHideCopyIndicator = function(event,_ui) {
				var ci = _ui.helper.find("#copyIndicator");
				if(event.ctrlKey) {
					if(ci.length == 0) new $("<img src='svg/add.svg' id='copyIndicator'/>").appendTo(_ui.helper); else ci.show();
				} else ci.hide();
			};
			selfElement1.on("dragstart",function(event,_ui1) {
				new $(js.Browser.document).on("keydown keyup",function(event1) {
					showOrHideCopyIndicator(event1,_ui1);
				});
			});
			selfElement1.on("drag",function(event,_ui) {
				showOrHideCopyIndicator(event,_ui);
			});
			(js.Boot.__cast(selfElement1 , $)).draggable({ containment : self2.options.containment, helper : helper, distance : 10, scroll : false, revertDuration : 200, start : function(evt,_ui) {
				(js.Boot.__cast(selfElement1 , $)).draggable("option","revert",false);
			}});
			var copyOrMoveLabel = function(event,_ui) {
				var labelComp = js.Boot.__cast(_ui.draggable , $);
				var eld = new ui.model.EditLabelData(ui.widget.LabelCompHelper.getLabel(labelComp),ui.widget.LabelCompHelper.parentIid(labelComp),self2.getLabel().iid);
				if(event.ctrlKey) ui.model.EM.change(ui.model.EMEvent.CopyLabel,eld); else ui.model.EM.change(ui.model.EMEvent.MoveLabel,eld);
			};
			(js.Boot.__cast(selfElement1 , $)).droppable({ accept : function(d) {
				return !$(this).parent()["is"](".filterCombination") && d["is"](".label") && ($(this).parent()["is"](".dropCombiner") || $(this).parent()["is"](".labelTreeBranch"));
			}, activeClass : "ui-state-hover", hoverClass : "ui-state-active", greedy : true, drop : function(event,_ui) {
				if($(this).parent()["is"](".labelTreeBranch")) copyOrMoveLabel(event,_ui); else {
					var filterCombiner = new $("<div></div>");
					filterCombiner.appendTo($(this).parent());
					filterCombiner.filterCombination({ event : event, type : "LABEL", dragstop : self2.options.dragstop});
					filterCombiner.filterCombination("addFilterable",$(this));
					var clone = (_ui.draggable.data("clone"))(_ui.draggable,false,"window");
					clone.addClass("filterTrashable " + Std.string(_ui.draggable.data("dropTargetClass")));
					filterCombiner.filterCombination("addFilterable",clone);
					filterCombiner.filterCombination("position");
				}
			}, tolerance : "pointer"});
		}
	}, destroy : function() {
		var self = this;
		self.filteredSet.removeListener(self._onupdate);
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.labelComp",defineWidget());
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
		var self = this;
		var selfElement = this.element;
		ui.AppContext.LOGGER.debug("post " + self.urlInput.val());
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}, valEle : function() {
		var self = this;
		return self.urlInput;
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
		var self = this;
		var selfElement = this.element;
		var clone = (_ui.draggable.data("clone"))(_ui.draggable,false,false,self._getDragStop());
		clone.addClass("small");
		var cloneOffset = clone.offset();
		self.tags.append(clone);
		clone.css({ position : "absolute"});
		if(cloneOffset.top != 0) clone.offset(cloneOffset); else clone.position({ my : "left top", at : "left top", of : _ui.helper, collision : "flipfit", within : self.tags});
	}, _initConections : function() {
		var self = this;
		var selfElement = this.element;
		return null;
	}, _initLabels : function(of) {
		var self1 = this;
		var selfElement = this.element;
		var edit_post_comps_tags = new $("#edit_post_comps_tags",selfElement);
		if(ui.AppContext.GROUPED_LABELEDCONTENT.delegate().get(self1.options.content.iid) == null) ui.AppContext.GROUPED_LABELEDCONTENT.addEmptyGroup(self1.options.content.iid);
		self1.onchangeLabelChildren = function(labelComp,evt) {
			if(evt.isAdd()) edit_post_comps_tags.append(labelComp); else if(evt.isUpdate()) throw new m3.exception.Exception("this should never happen"); else if(evt.isDelete()) labelComp.remove();
		};
		self1.mappedLabels = new m3.observable.MappedSet(ui.AppContext.GROUPED_LABELEDCONTENT.delegate().get(self1.options.content.iid),function(lc) {
			var lc1 = new $("<div></div>").labelComp({ labelIid : lc.labelIid, dndEnabled : true, isDragByHelper : false, containment : false, dragstop : self1._getDragStop()});
			lc1.css("position","absolute").addClass("small");
			lc1.position({ my : "top", at : "bottom", of : of, collision : "flipfit", within : self1.tags});
			of = lc1;
			return lc1;
		});
		self1.mappedLabels.listen(self1.onchangeLabelChildren);
	}, _createButtonBlock : function(self2,selfElement1) {
		var close = function() {
			selfElement1.remove();
			self2.destroy();
			ui.model.EM.change(ui.model.EMEvent.FitWindow);
		};
		var buttonBlock = new $("<div></div>").css("text-align","right").appendTo(selfElement1);
		new $("<button title='Remove Post'></button>").appendTo(buttonBlock).button({ text : false, icons : { primary : "ui-icon-circle-close"}}).css("width","23px").click(function(evt) {
			evt.stopPropagation();
			m3.util.JqueryUtil.confirm("Delete Post","Are you sure you want to remove this post?",function() {
				close();
				ui.model.EM.change(ui.model.EMEvent.DeleteContent,self2.options.content);
			});
		});
		new $("<button title='Update Post'></button>").appendTo(buttonBlock).button({ text : false, icons : { primary : "ui-icon-disk"}}).css("width","23px").click(function(evt) {
			var ecd = self2._updateContent();
			ui.model.EM.change(ui.model.EMEvent.UpdateContent,ecd);
			close();
		});
		new $("<button title='Close'></button>").appendTo(buttonBlock).button({ text : false, icons : { primary : "ui-icon-closethick"}}).css("width","23px").click(function(evt) {
			ui.model.EM.change(ui.model.EMEvent.EditContentClosed,self2.options.content);
			close();
		});
	}, _updateContent : function() {
		var self = this;
		var selfElement = this.element;
		switch( (self.options.content.contentType)[1] ) {
		case 3:
			(js.Boot.__cast(self.options.content , ui.model.MessageContent)).props.text = self.valueElement.val();
			break;
		case 2:
			(js.Boot.__cast(self.options.content , ui.model.UrlContent)).props.url = self.valueElement.val();
			break;
		case 1:
			(js.Boot.__cast(self.options.content , ui.model.ImageContent)).props.imgSrc = ui.widget.UploadCompHelper.value(self.uploadComp);
			break;
		case 0:
			(js.Boot.__cast(self.options.content , ui.model.AudioContent)).props.audioSrc = ui.widget.UploadCompHelper.value(self.uploadComp);
			break;
		}
		var ecd1 = new ui.model.EditContentData(self.options.content);
		self.tags.children(".label").each(function(i,dom) {
			var labelComp = new $(dom);
			ecd1.labels.push(ui.widget.LabelCompHelper.getLabel(labelComp));
		});
		return ecd1;
	}, _create : function() {
		var self3 = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of EditPostComp must be a div element");
		selfElement.addClass("post container shadow " + m3.widget.Widgets.getWidgetClasses());
		self3._createButtonBlock(self3,selfElement);
		var section = new $("<section id='postSection'></section>").appendTo(selfElement);
		var tab_class = "";
		if(self3.options.content.contentType == ui.model.ContentType.TEXT) {
			var textInput = new $("<div class='postContainer boxsizingBorder'></div>");
			textInput.appendTo(section);
			self3.valueElement = new $("<textarea class='boxsizingBorder container' style='resize: none;'></textarea>").appendTo(textInput).attr("id","textInput_ta");
			self3.valueElement.val((js.Boot.__cast(self3.options.content , ui.model.MessageContent)).props.text);
			tab_class = "ui-icon-document";
		} else if(self3.options.content.contentType == ui.model.ContentType.URL) {
			var urlComp = new $("<div class='postContainer boxsizingBorder'></div>").urlComp();
			self3.valueElement = ui.widget.UrlCompHelper.urlInput(urlComp);
			urlComp.appendTo(section);
			ui.widget.UrlCompHelper.urlInput(urlComp).val((js.Boot.__cast(self3.options.content , ui.model.UrlContent)).props.url);
			tab_class = "ui-icon-link";
		} else if(self3.options.content.contentType == ui.model.ContentType.IMAGE) {
			var options = { contentType : ui.model.ContentType.IMAGE};
			var imageInput = new $("<div class='postContainer boxsizingBorder'></div>").uploadComp(options);
			self3.uploadComp = imageInput;
			imageInput.appendTo(section);
			ui.widget.UploadCompHelper.setPreviewImage(imageInput,(js.Boot.__cast(self3.options.content , ui.model.ImageContent)).props.imgSrc);
			tab_class = "ui-icon-image";
		} else if(self3.options.content.contentType == ui.model.ContentType.AUDIO) {
			var options = { contentType : ui.model.ContentType.AUDIO};
			var audioInput = new $("<div class='postContainer boxsizingBorder'></div>").uploadComp(options);
			self3.uploadComp = audioInput;
			audioInput.appendTo(section);
			ui.widget.UploadCompHelper.setPreviewImage(audioInput,(js.Boot.__cast(self3.options.content , ui.model.AudioContent)).props.audioSrc);
			tab_class = "ui-icon-volume-on";
		}
		var tabs = new $("<aside class='tabs'></aside>").appendTo(section);
		var tab = new $("<span class='ui-icon " + tab_class + " ui-icon-document active ui-corner-left active'></span>").appendTo(tabs);
		var isDuplicate = function(selector,ele,container,getUid) {
			var is_duplicate = false;
			if(ele["is"](selector)) {
				var new_uid = getUid(ele);
				container.children(selector).each(function(i,dom) {
					var uid = getUid(new $(dom));
					if(new_uid == uid) is_duplicate = true;
				});
			}
			return is_duplicate;
		};
		var tags = new $("<aside id='edit_post_comps_tags' class='tags container boxsizingBorder'></aside>");
		tags.appendTo(section);
		tags.droppable({ accept : function(d) {
			return d["is"](".filterable");
		}, activeClass : "ui-state-hover", hoverClass : "ui-state-active", drop : function(event,_ui) {
			if(isDuplicate(".connectionAvatar",_ui.draggable,tags,function(ele) {
				return ui.widget.ConnectionAvatarHelper.getConnection(new $(ele)).iid;
			}) || isDuplicate(".labelComp",_ui.draggable,tags,function(ele) {
				return ui.widget.LabelCompHelper.getLabel(new $(ele)).iid;
			})) {
				if(_ui.draggable.parent().attr("id") != "edit_post_comps_tags") _ui.draggable.draggable("option","revert",true);
				return;
			}
			self3._addToTagsContainer(_ui);
		}});
		self3.tags = tags;
		var jq = self3._initConections();
		self3._initLabels(jq);
	}, destroy : function() {
		var self = this;
		self.mappedLabels.removeListener(self.onchangeLabelChildren);
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.editPostComp",defineWidget());
var defineWidget = function() {
	return { _createWidgets : function(selfElement,self) {
		selfElement.empty();
		var content = self.options.content;
		var postWr = new $("<section class='postWr'></section>");
		selfElement.append(postWr);
		var postContentWr = new $("<div class='postContentWr'></div>");
		postWr.append(postContentWr);
		var postContent = new $("<div class='postContent'></div>");
		postContentWr.append(postContent);
		postContent.append("<div class='content-timestamp'>" + Std.string(content.get_created()) + "</div>");
		switch( (content.contentType)[1] ) {
		case 0:
			var audio = js.Boot.__cast(content , ui.model.AudioContent);
			postContent.append(audio.props.title + "<br/>");
			var audioControls = new $("<audio controls></audio>");
			postContent.append(audioControls);
			audioControls.append("<source src='" + audio.props.audioSrc + "' type='" + audio.props.audioType + "'>Your browser does not support the audio element.");
			break;
		case 1:
			var img = js.Boot.__cast(content , ui.model.ImageContent);
			postContent.append("<img alt='" + img.props.caption + "' src='" + img.props.imgSrc + "'/>");
			break;
		case 2:
			var urlContent = js.Boot.__cast(content , ui.model.UrlContent);
			postContent.append("<img src='http://picoshot.com/t.php?picurl=" + urlContent.props.url + "'>");
			break;
		case 3:
			var textContent = js.Boot.__cast(content , ui.model.MessageContent);
			postContent.append("<div class='content-text'><pre class='text-content'>" + textContent.props.text + "</pre></div>");
			break;
		}
		self.buttonBlock = new $("<div class='button-block' ></div>").css("text-align","left").hide().appendTo(postContent);
		new $("<button title='Edit Post'></button>").appendTo(self.buttonBlock).button({ text : false, icons : { primary : "ui-icon-pencil"}}).css("width","23px").click(function(evt) {
			evt.stopPropagation();
			var comp = new $("<div id='edit-post-comp'></div>");
			comp.insertBefore(selfElement);
			comp.width(selfElement.width());
			comp.height(selfElement.height());
			selfElement.hide();
			var editPostComp = new $(comp).editPostComp({ content : self.options.content});
		});
		var postCreator = new $("<aside class='postCreator'></aside>").appendTo(postWr);
		var alias = ui.AppContext.ALIASES.delegate().get(self.options.content.aliasIid);
		new $("<div></div>").connectionAvatar({ dndEnabled : false, connection : ui.helper.ModelHelper.asConnection(alias)}).appendTo(postCreator);
		var postLabels = new $("<aside class='postLabels'></div>").appendTo(postWr);
		if(ui.AppContext.GROUPED_LABELEDCONTENT.delegate().get(self.options.content.iid) == null) ui.AppContext.GROUPED_LABELEDCONTENT.addEmptyGroup(self.options.content.iid);
		self.onchangeLabelChildren = function(labelComp,evt) {
			if(evt.isAdd()) postLabels.append(labelComp); else if(evt.isUpdate()) throw new m3.exception.Exception("this should never happen"); else if(evt.isDelete()) labelComp.remove();
		};
		self.mappedLabels = new m3.observable.MappedSet(ui.AppContext.GROUPED_LABELEDCONTENT.delegate().get(self.options.content.iid),function(lc) {
			return new $("<div class='small'></div>").labelComp({ dndEnabled : false, labelIid : lc.labelIid});
		});
		self.mappedLabels.listen(self.onchangeLabelChildren);
	}, _create : function() {
		var self1 = this;
		var selfElement1 = this.element;
		if(!selfElement1["is"]("div")) throw new m3.exception.Exception("Root of ContentComp must be a div element");
		selfElement1.addClass("contentComp post container shadow " + m3.widget.Widgets.getWidgetClasses());
		selfElement1.click(function(evt) {
			if(!selfElement1.hasClass("postActive")) {
				new $(".postActive .button-block").toggle();
				new $(".postActive").toggleClass("postActive");
			}
			self1.toggleActive();
		});
		self1._createWidgets(selfElement1,self1);
		ui.model.EM.addListener(ui.model.EMEvent.EditContentClosed,new ui.model.EMListener(function(content) {
			if(content.iid == self1.options.content.iid) selfElement1.show();
		}));
	}, update : function(content) {
		var self = this;
		var selfElement = this.element;
		var showButtonBlock = self.buttonBlock.isVisible();
		self.options.content = content;
		self._createWidgets(selfElement,self);
		if(showButtonBlock) self.buttonBlock.show();
		selfElement.show();
	}, toggleActive : function() {
		var self = this;
		var selfElement = this.element;
		selfElement.toggleClass("postActive");
		self.buttonBlock.toggle();
	}, destroy : function() {
		var self = this;
		self.mappedLabels.removeListener(self.onchangeLabelChildren);
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
		self.mapListener = function(content,contentComp,evt) {
			if(evt.isAdd()) {
				var contentComps = new $(".contentComp");
				if(contentComps.length == 0) new $("#postInput").after(contentComp); else {
					var comps = new $(".contentComp");
					var inserted = false;
					comps.each(function(i,dom) {
						var cc = new $(dom);
						var cmp = m3.helper.StringHelper.compare(ui.widget.ContentCompHelper.content(contentComp).getTimestamp(),ui.widget.ContentCompHelper.content(cc).getTimestamp());
						if(cmp > 0) {
							cc.before(contentComp);
							inserted = true;
							return false;
						} else return true;
					});
					if(!inserted) comps.last().after(contentComp);
				}
				ui.model.EM.change(ui.model.EMEvent.FitWindow);
			} else if(evt.isUpdate()) ui.widget.ContentCompHelper.update(contentComp,content); else if(evt.isDelete()) contentComp.remove();
		};
		ui.model.EM.addListener(ui.model.EMEvent.AGENT,new ui.model.EMListener(function(agent) {
			self._resetContents(ui.AppContext.currentAlias.iid);
		},"ContentFeed-AGENT"));
		ui.model.EM.addListener(ui.model.EMEvent.AliasLoaded,new ui.model.EMListener(function(alias) {
			self._resetContents(alias.iid);
		},"ContentFeed-AliasLoaded"));
	}, _resetContents : function(aliasIid) {
		var self = this;
		var selfElement = this.element;
		if(self.content != null) self.content.removeListeners(self.mapListener);
		selfElement.find(".contentComp").remove();
		var content;
		if(ui.AppContext.ALIASES.delegate().get(aliasIid).rootLabelIid == ui.AppContext.UBER_LABEL.iid) content = ui.AppContext.CONTENT; else {
			content = ui.AppContext.GROUPED_CONTENT.delegate().get(aliasIid);
			if(content == null) content = ui.AppContext.GROUPED_CONTENT.addEmptyGroup(aliasIid);
		}
		self.content = new m3.observable.MappedSet(content,function(content1) {
			return new $("<div></div>").contentComp({ content : content1});
		});
		self.content.mapListen(self.mapListener);
	}, destroy : function() {
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
		selfElement.addClass("newUserDialog").hide();
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
		ui.model.EM.addListener(ui.model.EMEvent.AGENT,new ui.model.EMListener(function(agent) {
			self._setAgent(agent);
		},"CreateAgentDialog-Agent"));
	}, initialized : false, _createNewUser : function() {
		var self = this;
		var selfElement1 = this.element;
		var valid = true;
		var newUser = new ui.model.NewUser();
		newUser.name = self.input_n.val();
		if(m3.helper.StringHelper.isBlank(newUser.name)) {
			self.placeholder_n.addClass("ui-state-error");
			valid = false;
		}
		if(!valid) return;
		selfElement1.find(".ui-state-error").removeClass("ui-state-error");
		ui.model.EM.change(ui.model.EMEvent.CreateAgent,newUser);
		ui.model.EM.addListener(ui.model.EMEvent.USER_SIGNUP,new ui.model.EMListener(function(n) {
			selfElement1.dialog("close");
		},"CreateAgentDialog-UserSignup"));
	}, _buildDialog : function() {
		var self1 = this;
		var selfElement2 = this.element;
		self1.initialized = true;
		var dlgOptions = { autoOpen : false, title : "Create New Agent", height : 320, width : 400, modal : true, buttons : { 'Create My Agent' : function() {
			self1._registered = true;
			self1._createNewUser();
		}, Cancel : function() {
			self1._cancelled = true;
			$(this).dialog("close");
		}}, close : function(evt,ui1) {
			selfElement2.find(".placeholder").removeClass("ui-state-error");
			if(self1._cancelled || !self1._registered && self1.user == null) ui.widget.DialogManager.showLogin();
		}};
		selfElement2.dialog(dlgOptions);
	}, _setAgent : function(user) {
		var self = this;
		self.user = user;
	}, open : function() {
		var self = this;
		var selfElement = this.element;
		self._cancelled = false;
		if(!self.initialized) self._buildDialog();
		selfElement.children("#n_label").focus();
		self.input_n.blur();
		selfElement.dialog("open");
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.newUserDialog",defineWidget());
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
		},function(evt) {
			$(this).removeClass("ui-state-hover");
		}).click(function(evt) {
			children.toggleClass("ui-state-active");
			self._fireFilter();
		});
	}, isLive : function() {
		var selfElement = this.element;
		return selfElement.children(".live").hasClass("ui-state-active");
	}, _fireFilter : function() {
		var selfElement = this.element;
		var filter = js.Boot.__cast(selfElement.closest("#filter") , $);
		ui.widget.FilterCompHelper.fireFilter(filter);
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.liveBuildToggle",defineWidget());
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of IntroductionNotificationComp must be a div element");
		selfElement.addClass("introductionNotificationComp container boxsizingBorder");
		var data = self.options.notification.props;
		var intro = m3.helper.OSetHelper.getElement(ui.AppContext.INTRODUCTIONS,data.introductionIid);
		var conn = m3.helper.OSetHelper.getElement(ui.AppContext.MASTER_CONNECTIONS,intro.aConnectionIid);
		ui.AppContext.LOGGER.warn("fix me -- AppContext.CONNECTIONS.getElement(Connection.identifier(conn));");
		var connFromAlias = null;
		if(connFromAlias != null) conn.data = connFromAlias.data;
		self.listenerUid = ui.model.EM.addListener(ui.model.EMEvent.RespondToIntroduction_RESPONSE,new ui.model.EMListener(function(e) {
			m3.util.JqueryUtil.alert("Your response has been received.","Introduction",function() {
				ui.model.EM.change(ui.model.EMEvent.DELETE_NOTIFICATION,self.options.notification);
				self.destroy();
				selfElement.remove();
			});
		}));
		var intro_table = new $("<table id='intro-table'><tr><td></td><td></td><td></td></tr></table>").appendTo(selfElement);
		var avatar = new $("<div class='avatar introduction-avatar'></div>").connectionAvatar({ connection : conn, dndEnabled : false, isDragByHelper : true, containment : false}).appendTo(intro_table.find("td:nth-child(1)"));
		var invitationConfirmation = function(accepted) {
			var confirmation = new ui.model.IntroductionResponseClass(data.introductionIid,accepted);
			ui.model.EM.change(ui.model.EMEvent.RespondToIntroduction,confirmation);
		};
		var invitationText = new $("<div class='invitationText'></div>").appendTo(intro_table.find("td:nth-child(2)"));
		var title = new $("<div class='intro-title'>Introduction Request</div>").appendTo(invitationText);
		var from = new $("<div class='content-timestamp'><b>From:</b> " + conn.data.name + "</div>").appendTo(invitationText);
		var date = new $("<div class='content-timestamp'><b>Date:</b> " + Std.string(new Date()) + "</div>").appendTo(invitationText);
		var message = new $("<div class='invitation-message'>" + data.message + "</div>").appendTo(invitationText);
		var accept = new $("<button>Accept</button>").appendTo(invitationText).button().click(function(evt) {
			invitationConfirmation(true);
		});
		var reject = new $("<button>Reject</button>").appendTo(invitationText).button().click(function(evt) {
			invitationConfirmation(false);
		});
		intro_table.find("td:nth-child(3)").append("<div>" + conn.data.name + "</div><div><img class='intro-profile-img container' src='" + conn.data.imgSrc + "'/></div>");
	}, destroy : function() {
		var self = this;
		ui.model.EM.removeListener(ui.model.EMEvent.RespondToIntroduction_RESPONSE,self.listenerUid);
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.introductionNotificationComp",defineWidget());
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
			if($(this).children(".connectionAvatar").length == 0) {
				if(_ui.draggable.hasClass("connectionAvatar")) {
					var connection = ui.widget.ConnectionAvatarHelper.getConnection(js.Boot.__cast(_ui.draggable , $));
					var set = new m3.observable.FilteredSet(ui.AppContext.NOTIFICATIONS,function(n) {
						return n.kind == ui.model.NotificationKind.IntroductionRequest;
					});
					if(m3.helper.OSetHelper.hasValues(set)) {
						var iter = set.iterator();
						var introComp = new $("<div></div>").introductionNotificationComp({ notification : js.Boot.__cast(iter.next() , ui.model.IntroductionRequestClass)});
						introComp.insertAfter(new $("#filter"));
						return;
					}
				}
			}
			var clone = (_ui.draggable.data("clone"))(_ui.draggable,false,false,dragstop);
			clone.addClass("filterTrashable " + Std.string(_ui.draggable.data("dropTargetClass")));
			var cloneOffset = clone.offset();
			$(this).append(clone);
			clone.css({ position : "absolute"});
			if(cloneOffset.top != 0) clone.offset(cloneOffset); else clone.position({ my : "left top", at : "left top", of : _ui.helper, collision : "flipfit", within : "#filter"});
			self.fireFilter();
		}});
	}, fireFilter : function() {
		var self = this;
		var selfElement = this.element;
		var liveToggle = js.Boot.__cast(selfElement.children(".liveBuildToggle") , $);
		var root = (selfElement.children(".rootToggle").data("getNode"))();
		root.type = "ROOT";
		var filterables = selfElement.children(".filterable");
		filterables.each(function(idx,el) {
			var filterable = new $(el);
			var node = (filterable.data("getNode"))();
			root.addNode(node);
		});
		if(!ui.widget.LiveBuildToggleHelper.isLive(liveToggle)) ui.model.EM.change(ui.model.EMEvent.FILTER_CHANGE,new ui.model.Filter(root)); else ui.model.EM.change(ui.model.EMEvent.FILTER_RUN,new ui.model.Filter(root));
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.filterComp",defineWidget());
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
		input.blur(function(evt) {
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
			var enterFcn = function(evt) {
				if(evt.keyCode == 13) {
					if(isUpdate) updateLabel(); else createLabel();
				}
			};
			var container = new $("<div class='icontainer'></div>").appendTo(el);
			container.click(stopFcn).keypress(enterFcn);
			var parent = null;
			if(!isUpdate) {
				container.append("<label for='labelParent'>Parent: </label> ");
				parent = new $("<select id='labelParent' class='ui-corner-left ui-widget-content' style='width: 191px;'><option value='" + ui.AppContext.currentAlias.rootLabelIid + "'>No Parent</option></select>").appendTo(container);
				parent.click(stopFcn);
				var aliasLabels = ui.AppContext.getLabelDescendents(ui.AppContext.currentAlias.rootLabelIid);
				var iter = aliasLabels.iterator();
				while(iter.hasNext()) {
					var label = iter.next();
					if(label.iid != ui.AppContext.currentAlias.rootLabelIid) {
						var option = "<option value='" + label.iid + "'";
						if(self1.selectedLabelComp != null && ui.widget.LabelCompHelper.getLabel(self1.selectedLabelComp).iid == label.iid) option += " SELECTED";
						option += ">" + label.name + "</option>";
						parent.append(option);
					}
				}
			}
			container.append("<br/><label for='labelName'>Name: </label> ");
			var input = new $("<input id='labelName' class='ui-corner-all ui-widget-content' value='New Label'/>").appendTo(container);
			input.keypress(enterFcn).click(function(evt) {
				evt.stopPropagation();
				if($(this).val() == "New Label") $(this).val("");
			}).focus();
			var buttonText = "Add Label";
			if(isUpdate) {
				buttonText = "Update Label";
				input.val(ui.widget.LabelCompHelper.getLabel(self1.selectedLabelComp).name);
			}
			container.append("<br/>");
			new $("<button class='fright ui-helper-clearfix' style='font-size: .8em;'>" + buttonText + "</button>").button().appendTo(container).click(function(evt) {
				if(isUpdate) updateLabel(); else createLabel();
			});
			createLabel = function() {
				if(input.val().length == 0) return;
				ui.AppContext.LOGGER.info("Create new label | " + input.val());
				var label = new ui.model.Label();
				label.name = input.val();
				var eventData = new ui.model.EditLabelData(label,parent.val());
				ui.model.EM.change(ui.model.EMEvent.CreateLabel,eventData);
				new $("body").click();
			};
			updateLabel = function() {
				if(input.val().length == 0) return;
				var label = ui.widget.LabelCompHelper.getLabel(self1.selectedLabelComp);
				ui.AppContext.LOGGER.info("Update label | " + label.iid);
				label.name = input.val();
				var eventData = new ui.model.EditLabelData(label);
				ui.model.EM.change(ui.model.EMEvent.UpdateLabel,eventData);
				new $("body").click();
			};
		}, positionalElement : reference});
	}, _create : function() {
		var self2 = this;
		var selfElement1 = this.element;
		if(!selfElement1["is"]("div")) throw new m3.exception.Exception("Root of LabelsList must be a div element");
		selfElement1.addClass("icontainer labelsList " + m3.widget.Widgets.getWidgetClasses());
		self2.selectedLabelComp = null;
		ui.model.EM.addListener(ui.model.EMEvent.AliasLoaded,new ui.model.EMListener(function(alias) {
			self2.selectedLabelComp = null;
			selfElement1.children(".labelTree").remove();
			var labelTree = new $("<div id='labels' class='labelDT'></div>").labelTree({ parentIid : alias.rootLabelIid});
			selfElement1.prepend(labelTree);
		},"LabelsList-Alias"));
		var newLabelButton = new $("<button class='newLabelButton'>New Label</button>");
		selfElement1.append(newLabelButton).append("<div class='clear'></div>");
		newLabelButton.button().click(function(evt) {
			evt.stopPropagation();
			self2.selectedLabelComp = null;
			self2._showNewLabelPopup(newLabelButton,false);
		});
		var menu = new $("<ul id='label-action-menu'></ul>");
		menu.appendTo(selfElement1);
		menu.m3menu({ classes : "container shadow", menuOptions : [{ label : "New Child Label", icon : "ui-icon-circle-plus", action : function(evt,m) {
			evt.stopPropagation();
			var reference = self2.selectedLabelComp;
			if(reference == null) reference = new $(evt.target);
			self2._showNewLabelPopup(reference,false);
			menu.hide();
			return false;
		}},{ label : "Edit Label", icon : "ui-icon-pencil", action : function(evt,m) {
			evt.stopPropagation();
			var reference = self2.selectedLabelComp;
			if(reference == null) reference = new $(evt.target);
			self2._showNewLabelPopup(reference,true);
			menu.hide();
			return false;
		}},{ label : "Delete Label", icon : "ui-icon-circle-minus", action : function(evt,m) {
			if(self2.selectedLabelComp != null) m3.util.JqueryUtil.confirm("Delete Label","Are you sure you want to delete this label?",function() {
				ui.model.EM.change(ui.model.EMEvent.DeleteLabel,new ui.model.EditLabelData(ui.widget.LabelCompHelper.getLabel(self2.selectedLabelComp),ui.widget.LabelCompHelper.parentIid(self2.selectedLabelComp)));
			});
		}}], width : 225}).hide();
		selfElement1.bind("contextmenu",function(evt) {
			menu.show();
			menu.position({ my : "left top", of : evt});
			var target = new $(evt.target);
			if(!target.hasClass("labelComp")) {
				var parents = target.parents(".labelComp");
				if(parents.length > 0) target = new $(parents[0]); else target = null;
			}
			if(target != null) self2.selectedLabelComp = new $(target); else self2.selectedLabelComp = null;
			evt.preventDefault();
			evt.stopPropagation();
			return false;
		});
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.labelsList",defineWidget());
var defineWidget = function() {
	return { options : { parentIid : null, labelIid : null}, _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of LabelTreeBranch must be a div element");
		selfElement.addClass("labelTreeBranch ");
		var expander = new $("<div class='labelTreeExpander' style='visibility:hidden;'><b>+</b></div>");
		selfElement.append(expander);
		var label = new $("<div></div>").labelComp({ parentIid : self.options.parentIid, labelIid : self.options.labelIid, isDragByHelper : true, containment : false, dragstop : null});
		selfElement.append(label);
		selfElement.hover(function() {
			if(m3.helper.OSetHelper.hasValues(self.children)) expander.css("visibility","visible");
		},function() {
			expander.css("visibility","hidden");
		});
		if(ui.AppContext.GROUPED_LABELCHILDREN.delegate().get(self.options.labelIid) == null) ui.AppContext.GROUPED_LABELCHILDREN.addEmptyGroup(self.options.labelIid);
		self.children = ui.AppContext.GROUPED_LABELCHILDREN.delegate().get(self.options.labelIid);
		var labelChildren = new $("<div class='labelChildren' style='display: none;'></div>");
		labelChildren.labelTree({ parentIid : self.options.labelIid});
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
		label.add(expander).click(function(evt) {
			if(m3.helper.OSetHelper.hasValues(self.children)) {
				labelChildren.toggle();
				labelChildren.toggleClass("labelTreeFullWidth");
			} else labelChildren.hide();
			if(labelChildren.css("display") == "none") expander.html("<b>+</b>"); else expander.html("<b>-</b>");
			ui.model.EM.change(ui.model.EMEvent.FitWindow);
		});
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.labelTreeBranch",defineWidget());
var defineWidget = function() {
	return { options : { parentIid : null, itemsClass : null}, _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of LabelTree must be a div element");
		selfElement.addClass("labelTree boxsizingBorder " + m3.widget.Widgets.getWidgetClasses());
		if(ui.AppContext.GROUPED_LABELCHILDREN.delegate().get(self.options.parentIid) == null) ui.AppContext.GROUPED_LABELCHILDREN.addEmptyGroup(self.options.parentIid);
		self.onchangeLabelChildren = function(labelTreeBranch,evt) {
			ui.AppContext.LOGGER.debug(self.mappedLabels.visualId + " | LabelTree | " + evt.name() + " | New Branch");
			if(evt.isAdd()) selfElement.append(labelTreeBranch); else if(evt.isUpdate()) throw new m3.exception.Exception("this should never happen"); else if(evt.isDelete()) labelTreeBranch.remove();
		};
		self.mappedLabels = new m3.observable.MappedSet(ui.AppContext.GROUPED_LABELCHILDREN.delegate().get(self.options.parentIid),function(labelChild) {
			return new $("<div></div>").labelTreeBranch({ parentIid : self.options.parentIid, labelIid : labelChild.childIid});
		});
		self.mappedLabels.visualId = self.options.parentIid + "_map";
		self.mappedLabels.listen(self.onchangeLabelChildren);
	}, destroy : function() {
		var self = this;
		self.mappedLabels.removeListener(self.onchangeLabelChildren);
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
		ui.model.EM.addListener(ui.model.EMEvent.AGENT,new ui.model.EMListener(function(agent) {
			selfElement.dialog("close");
		},"Login-AGENT"));
	}, initialized : false, _login : function() {
		var self = this;
		var selfElement = this.element;
		var valid = true;
		var login = new ui.model.Login();
		login.agentId = self.input_un.val();
		if(m3.helper.StringHelper.isBlank(login.agentId)) {
			self.placeholder_un.addClass("ui-state-error");
			valid = false;
		}
		login.password = self.input_pw.val();
		if(m3.helper.StringHelper.isBlank(login.password)) {
			self.placeholder_pw.addClass("ui-state-error");
			valid = false;
		}
		if(!valid) return;
		selfElement.find(".ui-state-error").removeClass("ui-state-error");
		ui.model.EM.change(ui.model.EMEvent.USER_LOGIN,login);
	}, _buildDialog : function() {
		var self1 = this;
		var selfElement = this.element;
		self1.initialized = true;
		var dlgOptions = { autoOpen : false, title : "Login", height : 280, width : 400, modal : true, buttons : { Login : function() {
			self1._login();
		}, 'I\'m New...' : function() {
			ui.widget.DialogManager.showNewUser();
		}}, beforeClose : function(evt,ui1) {
			if(ui.AppContext.AGENT == null) {
				m3.util.JqueryUtil.alert("A valid login is required to use the app");
				return false;
			}
			return true;
		}};
		selfElement.dialog(dlgOptions);
	}, open : function() {
		var self = this;
		var selfElement = this.element;
		if(!self.initialized) self._buildDialog();
		selfElement.children("#un_label").focus();
		self.input_un.blur();
		self.input_pw.blur();
		selfElement.dialog("open");
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
		(js.Boot.__cast(tabs , $)).sortable({ axis : "x", stop : function(evt,ui1) {
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
			var chatComp = new $("<div id='" + id + "'></div>").chatComp({ connection : connection, messages : new m3.observable.ObservableSet(ui.model.ModelObjWithIid.identifier)});
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
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of NewAliasDialog must be a div element");
		selfElement.addClass("_newAliasDialog").hide();
		var labels = new $("<div class='fleft'></div>").appendTo(selfElement);
		var inputs = new $("<div class='fleft'></div>").appendTo(selfElement);
		labels.append("<div class='labelDiv' style='margin-top: 3px; margin-right: 6px;'><label id='n_label' for='newu_n'>Alias Name:</label></div>");
		labels.append("<div class='labelDiv' style='margin-top: 3px; margin-right: 6px;'><label id='n_label' for='newu_n'>User Name:</label></div>");
		self.aliasName = new $("<input id='newu_n' class='ui-corner-all ui-state-active ui-widget-content'>").appendTo(inputs);
		inputs.append("<br/>");
		self.username = new $("<input id='username' class='ui-corner-all ui-state-active ui-widget-content'>").appendTo(inputs);
		inputs.children("input").keypress(function(evt) {
			if(evt.keyCode == 13) self._createNewAlias();
		});
	}, initialized : false, _createNewAlias : function() {
		var self = this;
		var selfElement = this.element;
		var alias = new ui.model.Alias();
		alias.name = self.aliasName.val();
		alias.data.name = self.username.val();
		if(m3.helper.StringHelper.isBlank(alias.data.name) || m3.helper.StringHelper.isBlank(alias.name)) return;
		selfElement.find(".ui-state-error").removeClass("ui-state-error");
		ui.model.EM.change(ui.model.EMEvent.CreateAlias,alias);
	}, _buildDialog : function() {
		var self1 = this;
		var selfElement1 = this.element;
		self1.initialized = true;
		var dlgOptions = { autoOpen : false, title : "Create New Alias", height : 190, width : 340, buttons : { 'Create New Alias' : function() {
			self1._createNewAlias();
		}, Cancel : function() {
			$(this).dialog("close");
		}}, close : function(evt,ui) {
			selfElement1.find(".placeholder").removeClass("ui-state-error");
		}};
		selfElement1.dialog(dlgOptions);
	}, open : function() {
		var self = this;
		var selfElement = this.element;
		if(!self.initialized) self._buildDialog();
		m3.jq.JQDialogHelper.open(selfElement);
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.newAliasDialog",defineWidget());
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of PostComp must be a div element");
		selfElement.addClass("postComp container shadow " + m3.widget.Widgets.getWidgetClasses());
		var section = new $("<section id='postSection'></section>").appendTo(selfElement);
		var addConnectionsAndLabels = null;
		var doTextPost = function(evt,contentType,value) {
			ui.AppContext.LOGGER.debug("Post new text content");
			evt.preventDefault();
			var ccd = new ui.model.EditContentData(ui.model.ContentFactory.create(contentType,value));
			addConnectionsAndLabels(ccd);
			ui.model.EM.change(ui.model.EMEvent.CreateContent,ccd);
		};
		var doTextPostForElement = function(evt,contentType,ele) {
			doTextPost(evt,contentType,ele.val());
			ele.val("");
		};
		var textInput = new $("<div class='postContainer'></div>").appendTo(section);
		var ta = new $("<textarea class='boxsizingBorder container' style='resize: none;'></textarea>").appendTo(textInput).attr("id","textInput_ta").keypress(function(evt) {
			if(!(evt.altKey || evt.shiftKey || evt.ctrlKey) && evt.charCode == 13) doTextPostForElement(evt,ui.model.ContentType.TEXT,new $(evt.target));
		});
		var urlComp = new $("<div class='postContainer boxsizingBorder'></div>").urlComp();
		urlComp.appendTo(section).keypress(function(evt) {
			if(!(evt.altKey || evt.shiftKey || evt.ctrlKey) && evt.charCode == 13) doTextPostForElement(evt,ui.model.ContentType.URL,new $(evt.target));
		});
		var options = { contentType : ui.model.ContentType.IMAGE};
		var imageInput = new $("<div class='postContainer boxsizingBorder'></div>").uploadComp(options);
		imageInput.appendTo(section);
		options.contentType = ui.model.ContentType.AUDIO;
		var audioInput = new $("<div class='postContainer boxsizingBorder'></div>").uploadComp(options);
		audioInput.appendTo(section);
		var tabs = new $("<aside class='tabs'></aside>").appendTo(section);
		var textTab = new $("<span class='ui-icon ui-icon-document active ui-corner-left'></span>").appendTo(tabs).click(function(evt) {
			tabs.children(".active").removeClass("active");
			$(this).addClass("active");
			textInput.show();
			urlComp.hide();
			imageInput.hide();
			audioInput.hide();
		});
		var urlTab = new $("<span class='ui-icon ui-icon-link ui-corner-left'></span>").appendTo(tabs).click(function(evt) {
			tabs.children(".active").removeClass("active");
			$(this).addClass("active");
			textInput.hide();
			urlComp.show();
			imageInput.hide();
			audioInput.hide();
		});
		var imgTab = new $("<span class='ui-icon ui-icon-image ui-corner-left'></span>").appendTo(tabs).click(function(evt) {
			tabs.children(".active").removeClass("active");
			$(this).addClass("active");
			textInput.hide();
			urlComp.hide();
			imageInput.show();
			audioInput.hide();
		});
		var audioTab = new $("<span class='ui-icon ui-icon-volume-on ui-corner-left'></span>").appendTo(tabs).click(function(evt) {
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
		var isDuplicate = function(selector,ele,container,getUid) {
			var is_duplicate = false;
			if(ele["is"](selector)) {
				var new_uid = getUid(ele);
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
			return d["is"](".filterable");
		}, activeClass : "ui-state-hover", hoverClass : "ui-state-active", drop : function(event,_ui) {
			if(isDuplicate(".connectionAvatar",_ui.draggable,tags,function(ele) {
				return ui.widget.ConnectionAvatarHelper.getConnection(new $(ele)).iid;
			}) || isDuplicate(".labelComp",_ui.draggable,tags,function(ele) {
				return ui.widget.LabelCompHelper.getLabel(new $(ele)).iid;
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
			tags.children(".label").each(function(i,dom) {
				var labelComp = new $(dom);
				ccd1.labels.push(ui.widget.LabelCompHelper.getLabel(labelComp));
			});
			tags.children(".connectionAvatar").each(function(i,dom) {
				var conn = new $(dom);
				ui.AppContext.LOGGER.warn("fix me:  content.connectionSet.add(conn.getConnection())");
			});
		};
		var postButton = new $("<button>Post</button>").appendTo(selfElement).button().click(function(evt) {
			if(textInput.isVisible()) {
				var ta1 = new $("#textInput_ta");
				doTextPostForElement(evt,ui.model.ContentType.TEXT,ta1);
			} else if(urlComp.isVisible()) doTextPostForElement(evt,ui.model.ContentType.URL,ui.widget.UrlCompHelper.urlInput(urlComp)); else {
				doTextPost(evt,ui.model.ContentType.IMAGE,ui.widget.UploadCompHelper.value(imageInput));
				ui.widget.UploadCompHelper.clear(imageInput);
			}
			tags.children(".label").remove();
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
		var toName = self.options.to.name();
		var fromName = self.options.from.name();
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
		var from_text_changed = function(evt) {
			var same_messsage = new $("#same_messsage");
			if(same_messsage.prop("checked")) {
				var from_text = new $("#from_text");
				var to_text = new $("#to_text");
				to_text.val(from_text.val());
			}
		};
		var divTa1 = new $("<div class='rid_cell' style='height:140px;'></div>").appendTo(ridTa);
		var from_text = new $("<textarea class='boxsizingBorder container rid_ta'></textarea>").appendTo(divTa1).attr("id","from_text").keyup(from_text_changed).val("Hi " + toName + " & " + fromName + ",\nHere's an introduction for the two of you to connect.\nwith love,\n" + ui.AppContext.AGENT.data.name);
		var divTa2 = new $("<div class='rid_cell' style='height:140px;text-align:right;padding-left: 7px;'></div>").appendTo(ridTa);
		var to_text = new $("<textarea class='boxsizingBorder container rid_ta' readonly='readonly'></textarea>").appendTo(divTa2).attr("id","to_text").val(from_text.val());
	}, _appendConnectionAvatar : function(connection,parent) {
		var avatar = new $("<div class='avatar'></div>").connectionAvatar({ connection : connection, dndEnabled : false, isDragByHelper : true, containment : false}).appendTo(parent).css("display","inline");
		parent.append("<div class='labelDiv' style='display:inline'>" + connection.name() + "</div>");
	}, initialized : false, _sendRequest : function() {
		var self = this;
		var selfElement1 = this.element;
		var alias = ui.AppContext.currentAlias.name;
		var intro = new ui.model.Introduction();
		intro.aConnectionIid = self.options.to.iid;
		intro.bConnectionIid = self.options.from.iid;
		intro.aMessage = new $("#to_text").val();
		intro.bMessage = new $("#from_text").val();
		ui.model.EM.addListener(ui.model.EMEvent.INTRODUCTION_RESPONSE,new ui.model.EMListener(function(n) {
			selfElement1.dialog("close");
		},"RequestIntroductionDialog-Introduction-Response"));
		ui.model.EM.change(ui.model.EMEvent.INTRODUCTION_REQUEST,intro);
	}, _buildDialog : function() {
		var self1 = this;
		var selfElement2 = this.element;
		if(self1.initialized) return;
		self1.initialized = true;
		var dlgOptions = { autoOpen : false, title : "Introduction Request", height : 400, width : 600, buttons : { Send : function() {
			self1._sendRequest();
		}, Cancel : function() {
			$(this).dialog("close");
		}}, close : function(evt,ui) {
			selfElement2.find(".placeholder").removeClass("ui-state-error");
		}};
		selfElement2.dialog(dlgOptions);
	}, open : function() {
		var self = this;
		var selfElement = this.element;
		if(selfElement.exists()) {
			selfElement.empty();
			self._create();
		}
		self._buildDialog();
		selfElement.dialog("open");
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.requestIntroductionDialog",defineWidget());
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
					ui.model.EM.change(ui.model.EMEvent.BACKUP);
				}
			});
		}).appendTo(self.container);
		new $("<button>Restore</button>").button().click(function(evt) {
			if(confirm("Restore from backup?")) {
				(js.Boot.__cast(selfElement , $)).m3dialog("close");
				ui.model.EM.change(ui.model.EMEvent.RESTORE);
			}
		}).appendTo(self.container);
		(js.Boot.__cast(selfElement , $)).m3dialog({ autoOpen : false, title : "Data Backup & Restore"});
	}, open : function() {
		var selfElement = this.element;
		selfElement.m3dialog("open");
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.restoreWidget",defineWidget());
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of UserComp must be a div element");
		selfElement.addClass("ocontainer shadow ");
		self.container = new $("<div class='container'></div>");
		selfElement.append(self.container);
		self._setUser();
		ui.model.EM.addListener(ui.model.EMEvent.AliasLoaded,new ui.model.EMListener(function(alias) {
			self._setUser();
		},"UserComp-Alias"));
		(js.Boot.__cast(self.container , $)).droppable({ accept : function(d) {
			return d["is"](".connectionAvatar");
		}, activeClass : "ui-state-hover", hoverClass : "ui-state-active", drop : function(event,_ui) {
			var dragstop = function(dragstopEvt,dragstopUi) {
				if(!self.container.intersects(dragstopUi.helper)) {
					dragstopUi.helper.remove();
					selfElement.removeClass("targetChange");
					m3.util.JqueryUtil.deleteEffects(dragstopEvt);
					ui.AppContext.TARGET = null;
					self._setUser();
				}
			};
			selfElement.addClass("targetChange");
			var clone = (_ui.draggable.data("clone"))(_ui.draggable,false,false,dragstop);
			clone.addClass("small");
			clone.insertBefore(new $(".ui-helper-clearfix",self.container));
			self._setTarget(ui.widget.ConnectionAvatarHelper.getConnection(clone));
		}});
	}, _createAliasMenu : function(self,aliases) {
		var menu = new $("<ul id='userAliasMenu'></ul>");
		menu.appendTo(self.container);
		var menuOptions = [];
		var menuOption;
		var $it0 = aliases.iterator();
		while( $it0.hasNext() ) {
			var alias = $it0.next();
			var alias1 = [alias];
			menuOption = { label : alias1[0].name, icon : "ui-icon-person", action : (function(alias1) {
				return function(evt,m) {
					if(ui.model.Alias.identifier(ui.AppContext.currentAlias) == ui.model.Alias.identifier(alias1[0])) menu.hide(); else {
						ui.AppContext.currentAlias = alias1[0];
						ui.model.EM.change(ui.model.EMEvent.AliasLoaded,alias1[0]);
					}
				};
			})(alias1)};
			menuOptions.push(menuOption);
		}
		menuOption = { label : "Manage Aliases...", icon : "ui-icon-circle-plus", action : function(evt,m) {
			ui.widget.DialogManager.showAliasManager();
		}};
		menuOptions.push(menuOption);
		menu.m3menu({ menuOptions : menuOptions}).hide();
		return menu;
	}, _setUser : function() {
		var self = this;
		var selfElement1 = this.element;
		self.container.empty();
		var imgSrc = "media/test/koi.jpg";
		if(m3.helper.StringHelper.isNotBlank((function($this) {
			var $r;
			try {
				$r = ui.AppContext.currentAlias.data.imgSrc;
			} catch( __e ) {
				$r = "";
			}
			return $r;
		}(this)))) imgSrc = ui.AppContext.currentAlias.data.imgSrc;
		self.userImg = new $("<img alt='user' src='" + imgSrc + "' class='userImg shadow'/>");
		self.container.append(self.userImg);
		self.userIdTxt = new $("<div class='userIdTxt'></div>");
		self.container.append(self.userIdTxt);
		var name = (function($this) {
			var $r;
			try {
				$r = ui.AppContext.AGENT.data.name;
			} catch( __e ) {
				$r = "";
			}
			return $r;
		}(this));
		var aliasLabel = (function($this) {
			var $r;
			try {
				$r = ui.AppContext.currentAlias.name;
			} catch( __e ) {
				$r = "";
			}
			return $r;
		}(this));
		if(m3.helper.StringHelper.isBlank(aliasLabel)) aliasLabel = "";
		self.userIdTxt.append("<strong>" + name + "</strong>").append("<br/>").append("<font style='font-size:12px'>" + aliasLabel + "</font>");
		var changeDiv = new $("<div class='ui-helper-clearfix'></div>");
		self.container.append(changeDiv);
		self.switchAliasLink = new $("<a class='aliasToggle'>Aliases</a>");
		changeDiv.append(self.switchAliasLink);
		var aliasMenu = self._createAliasMenu(self,ui.AppContext.ALIASES);
		self.switchAliasLink.click(function(evt) {
			aliasMenu.show();
			aliasMenu.position({ my : "left top", at : "right-6px center", of : selfElement1});
			evt.preventDefault();
			evt.stopPropagation();
			return false;
		});
	}, _setTarget : function(conn) {
		var self = this;
		self.switchAliasLink.hide();
		self.userIdTxt.empty().append("<strong>" + conn.name() + "</strong>");
		ui.AppContext.TARGET = conn;
		ui.model.EM.change(ui.model.EMEvent.TARGET_CHANGE,conn);
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.userComp",defineWidget());
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of ZWidget must be a div element");
		selfElement.addClass("zwidget");
		self.container = new $("<div class=''></div>");
		selfElement.append(self.container);
		new $("<button>Introduction Notification</button>").button().click(function(evt) {
		}).appendTo(self.container);
		(js.Boot.__cast(selfElement , $)).m3dialog({ autoOpen : false});
	}, open : function() {
		var selfElement = this.element;
		selfElement.m3dialog("open");
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.zWidget",defineWidget());
var defineWidget = function() {
	return { _addContent : function(content) {
		var self = this;
		ui.AppContext.LOGGER.warn("fix me -- AppContext.CONNECTIONS.getElement(content.creator);");
		var connection = null;
		if(self.contentTimeLines.get(content.aliasIid) == null) {
			var timeLine = new ui.widget.score.ContentTimeLine(self.paper,connection,self.startTime.getTime(),self.endTime.getTime(),self.initialWidth);
			self.contentTimeLines.set(content.aliasIid,timeLine);
		}
		self.contentTimeLines.get(content.aliasIid).addContent(content);
		self.uberGroup.append(self.contentTimeLines.get(content.aliasIid).timeLineElement);
	}, _deleteContent : function(content) {
		var self = this;
		var ctl = self.contentTimeLines.get(content.aliasIid);
		if(ctl != null) {
			ctl.removeElements();
			self.contentTimeLines.remove(content.aliasIid);
			if(!self.contentTimeLines.iterator().hasNext()) ui.widget.score.ContentTimeLine.resetPositions();
		}
	}, _updateContent : function(content) {
	}, _create : function() {
		var self1 = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of ScoreComp must be a div element");
		selfElement.addClass("container shadow scoreComp");
		self1.contentTimeLines = new haxe.ds.StringMap();
		self1.options.content.listen(function(content,evt) {
			if(evt.isAdd()) self1._addContent(content); else if(evt.isUpdate()) self1._updateContent(content); else if(evt.isDelete()) self1._deleteContent(content);
		});
		self1.initialWidth = 1000;
		self1.paper = new Snap("#score-comp-svg");
		self1.uberGroup = ((function($this) {
			var $r;
			var e123 = [];
			var me123 = self1.paper;
			$r = me123.group.apply(me123, e123);
			return $r;
		}(this))).attr("id","uber-group").attr("transform","matrix(1 0 0 1 0 0)");
		self1.startTime = new Date(2012,1,1,0,0,0);
		self1.endTime = new Date(2013,12,31,0,0,0);
		self1.timeMarker = new ui.widget.score.TimeMarker(self1.uberGroup,self1.paper,self1.initialWidth);
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.scoreComp",defineWidget());
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
js.Browser.window = typeof window != "undefined" ? window : null;
js.Browser.document = typeof window != "undefined" ? window.document : null;
js.Browser.navigator = typeof window != "undefined" ? window.navigator : null;
js.d3._D3.InitPriority.important = "important";
m3.util.UidGenerator.chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabsdefghijklmnopqrstuvwxyz0123456789";
m3.util.UidGenerator.nums = "0123456789";
m3.observable.OSet.__rtti = "<class path=\"m3.observable.OSet\" params=\"T\" interface=\"1\">\n\t<identifier public=\"1\" set=\"method\"><f a=\"\"><f a=\"\">\n\t<c path=\"m3.observable.OSet.T\"/>\n\t<c path=\"String\"/>\n</f></f></identifier>\n\t<listen public=\"1\" set=\"method\"><f a=\"l\">\n\t<f a=\":\">\n\t\t<c path=\"m3.observable.OSet.T\"/>\n\t\t<c path=\"m3.observable.EventType\"/>\n\t\t<x path=\"Void\"/>\n\t</f>\n\t<x path=\"Void\"/>\n</f></listen>\n\t<removeListener public=\"1\" set=\"method\"><f a=\"l\">\n\t<f a=\":\">\n\t\t<c path=\"m3.observable.OSet.T\"/>\n\t\t<c path=\"m3.observable.EventType\"/>\n\t\t<x path=\"Void\"/>\n\t</f>\n\t<x path=\"Void\"/>\n</f></removeListener>\n\t<iterator public=\"1\" set=\"method\"><f a=\"\"><t path=\"Iterator\"><c path=\"m3.observable.OSet.T\"/></t></f></iterator>\n\t<delegate public=\"1\" set=\"method\"><f a=\"\"><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"m3.observable.OSet.T\"/>\n</x></f></delegate>\n\t<getVisualId public=\"1\" set=\"method\"><f a=\"\"><c path=\"String\"/></f></getVisualId>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
m3.observable.EventManager.__rtti = "<class path=\"m3.observable.EventManager\" params=\"T\" module=\"m3.observable.OSet\">\n\t<_listeners><c path=\"Array\"><f a=\":\">\n\t<c path=\"m3.observable.EventManager.T\"/>\n\t<c path=\"m3.observable.EventType\"/>\n\t<x path=\"Void\"/>\n</f></c></_listeners>\n\t<_set><c path=\"m3.observable.OSet\"><c path=\"m3.observable.EventManager.T\"/></c></_set>\n\t<add public=\"1\" set=\"method\" line=\"46\"><f a=\"l\">\n\t<f a=\":\">\n\t\t<c path=\"m3.observable.EventManager.T\"/>\n\t\t<c path=\"m3.observable.EventType\"/>\n\t\t<x path=\"Void\"/>\n\t</f>\n\t<x path=\"Void\"/>\n</f></add>\n\t<remove public=\"1\" set=\"method\" line=\"54\"><f a=\"l\">\n\t<f a=\":\">\n\t\t<c path=\"m3.observable.EventManager.T\"/>\n\t\t<c path=\"m3.observable.EventType\"/>\n\t\t<x path=\"Void\"/>\n\t</f>\n\t<x path=\"Void\"/>\n</f></remove>\n\t<fire public=\"1\" set=\"method\" line=\"57\"><f a=\"t:type\">\n\t<c path=\"m3.observable.EventManager.T\"/>\n\t<c path=\"m3.observable.EventType\"/>\n\t<x path=\"Void\"/>\n</f></fire>\n\t<listenerCount public=\"1\" set=\"method\" line=\"64\"><f a=\"\"><x path=\"Int\"/></f></listenerCount>\n\t<new public=\"1\" set=\"method\" line=\"42\"><f a=\"set\">\n\t<c path=\"m3.observable.OSet\"><c path=\"m3.observable.EventManager.T\"/></c>\n\t<x path=\"Void\"/>\n</f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
m3.observable.EventType.Add = new m3.observable.EventType("Add",true,false);
m3.observable.EventType.Update = new m3.observable.EventType("Update",false,true);
m3.observable.EventType.Delete = new m3.observable.EventType("Delete",false,false);
m3.observable.AbstractSet.__rtti = "<class path=\"m3.observable.AbstractSet\" params=\"T\" module=\"m3.observable.OSet\">\n\t<implements path=\"m3.observable.OSet\"><c path=\"m3.observable.AbstractSet.T\"/></implements>\n\t<_eventManager public=\"1\"><c path=\"m3.observable.EventManager\"><c path=\"m3.observable.AbstractSet.T\"/></c></_eventManager>\n\t<visualId public=\"1\"><c path=\"String\"/></visualId>\n\t<listen public=\"1\" set=\"method\" line=\"116\"><f a=\"l\">\n\t<f a=\":\">\n\t\t<c path=\"m3.observable.AbstractSet.T\"/>\n\t\t<c path=\"m3.observable.EventType\"/>\n\t\t<x path=\"Void\"/>\n\t</f>\n\t<x path=\"Void\"/>\n</f></listen>\n\t<removeListener public=\"1\" set=\"method\" line=\"120\"><f a=\"l\">\n\t<f a=\":\">\n\t\t<c path=\"m3.observable.AbstractSet.T\"/>\n\t\t<c path=\"m3.observable.EventType\"/>\n\t\t<x path=\"Void\"/>\n\t</f>\n\t<x path=\"Void\"/>\n</f></removeListener>\n\t<filter public=\"1\" set=\"method\" line=\"124\"><f a=\"f\">\n\t<f a=\"\">\n\t\t<c path=\"m3.observable.AbstractSet.T\"/>\n\t\t<x path=\"Bool\"/>\n\t</f>\n\t<c path=\"m3.observable.OSet\"><c path=\"m3.observable.AbstractSet.T\"/></c>\n</f></filter>\n\t<map public=\"1\" params=\"U\" set=\"method\" line=\"128\"><f a=\"f\">\n\t<f a=\"\">\n\t\t<c path=\"m3.observable.AbstractSet.T\"/>\n\t\t<c path=\"map.U\"/>\n\t</f>\n\t<c path=\"m3.observable.OSet\"><c path=\"map.U\"/></c>\n</f></map>\n\t<fire set=\"method\" line=\"132\"><f a=\"t:type\">\n\t<c path=\"m3.observable.AbstractSet.T\"/>\n\t<c path=\"m3.observable.EventType\"/>\n\t<x path=\"Void\"/>\n</f></fire>\n\t<getVisualId public=\"1\" set=\"method\" line=\"136\"><f a=\"\"><c path=\"String\"/></f></getVisualId>\n\t<identifier public=\"1\" set=\"method\" line=\"140\"><f a=\"\"><f a=\"\">\n\t<c path=\"m3.observable.AbstractSet.T\"/>\n\t<c path=\"String\"/>\n</f></f></identifier>\n\t<iterator public=\"1\" set=\"method\" line=\"144\"><f a=\"\"><t path=\"Iterator\"><c path=\"m3.observable.AbstractSet.T\"/></t></f></iterator>\n\t<delegate public=\"1\" set=\"method\" line=\"148\"><f a=\"\"><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"m3.observable.AbstractSet.T\"/>\n</x></f></delegate>\n\t<new set=\"method\" line=\"112\"><f a=\"\"><x path=\"Void\"/></f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
m3.observable.ObservableSet.__rtti = "<class path=\"m3.observable.ObservableSet\" params=\"T\" module=\"m3.observable.OSet\">\n\t<extends path=\"m3.observable.AbstractSet\"><c path=\"m3.observable.ObservableSet.T\"/></extends>\n\t<_delegate><c path=\"m3.util.SizedMap\"><c path=\"m3.observable.ObservableSet.T\"/></c></_delegate>\n\t<_identifier><f a=\"\">\n\t<c path=\"m3.observable.ObservableSet.T\"/>\n\t<c path=\"String\"/>\n</f></_identifier>\n\t<add public=\"1\" set=\"method\" line=\"168\"><f a=\"t\">\n\t<c path=\"m3.observable.ObservableSet.T\"/>\n\t<x path=\"Void\"/>\n</f></add>\n\t<addAll public=\"1\" set=\"method\" line=\"172\"><f a=\"tArr\">\n\t<c path=\"Array\"><c path=\"m3.observable.ObservableSet.T\"/></c>\n\t<x path=\"Void\"/>\n</f></addAll>\n\t<iterator public=\"1\" set=\"method\" line=\"180\" override=\"1\"><f a=\"\"><t path=\"Iterator\"><c path=\"m3.observable.ObservableSet.T\"/></t></f></iterator>\n\t<isEmpty public=\"1\" set=\"method\" line=\"184\"><f a=\"\"><x path=\"Bool\"/></f></isEmpty>\n\t<addOrUpdate public=\"1\" set=\"method\" line=\"188\"><f a=\"t\">\n\t<c path=\"m3.observable.ObservableSet.T\"/>\n\t<x path=\"Void\"/>\n</f></addOrUpdate>\n\t<delegate public=\"1\" set=\"method\" line=\"200\" override=\"1\"><f a=\"\"><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"m3.observable.ObservableSet.T\"/>\n</x></f></delegate>\n\t<update public=\"1\" set=\"method\" line=\"204\"><f a=\"t\">\n\t<c path=\"m3.observable.ObservableSet.T\"/>\n\t<x path=\"Void\"/>\n</f></update>\n\t<delete public=\"1\" set=\"method\" line=\"208\"><f a=\"t\">\n\t<c path=\"m3.observable.ObservableSet.T\"/>\n\t<x path=\"Void\"/>\n</f></delete>\n\t<identifier public=\"1\" set=\"method\" line=\"216\" override=\"1\"><f a=\"\"><f a=\"\">\n\t<c path=\"m3.observable.ObservableSet.T\"/>\n\t<c path=\"String\"/>\n</f></f></identifier>\n\t<clear public=\"1\" set=\"method\" line=\"220\"><f a=\"\"><x path=\"Void\"/></f></clear>\n\t<size public=\"1\" set=\"method\" line=\"227\"><f a=\"\"><x path=\"Int\"/></f></size>\n\t<asArray public=\"1\" set=\"method\" line=\"231\"><f a=\"\"><c path=\"Array\"><c path=\"m3.observable.ObservableSet.T\"/></c></f></asArray>\n\t<new public=\"1\" set=\"method\" line=\"159\"><f a=\"identifier:?tArr\">\n\t<f a=\"\">\n\t\t<c path=\"m3.observable.ObservableSet.T\"/>\n\t\t<c path=\"String\"/>\n\t</f>\n\t<c path=\"Array\"><c path=\"m3.observable.ObservableSet.T\"/></c>\n\t<x path=\"Void\"/>\n</f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
m3.observable.MappedSet.__rtti = "<class path=\"m3.observable.MappedSet\" params=\"T:U\" module=\"m3.observable.OSet\">\n\t<extends path=\"m3.observable.AbstractSet\"><c path=\"m3.observable.MappedSet.U\"/></extends>\n\t<_source><c path=\"m3.observable.OSet\"><c path=\"m3.observable.MappedSet.T\"/></c></_source>\n\t<_mapper><f a=\"\">\n\t<c path=\"m3.observable.MappedSet.T\"/>\n\t<c path=\"m3.observable.MappedSet.U\"/>\n</f></_mapper>\n\t<_mappedSet><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"m3.observable.MappedSet.U\"/>\n</x></_mappedSet>\n\t<_remapOnUpdate><x path=\"Bool\"/></_remapOnUpdate>\n\t<_mapListeners><c path=\"Array\"><f a=\"::\">\n\t<c path=\"m3.observable.MappedSet.T\"/>\n\t<c path=\"m3.observable.MappedSet.U\"/>\n\t<c path=\"m3.observable.EventType\"/>\n\t<x path=\"Void\"/>\n</f></c></_mapListeners>\n\t<_sourceListener set=\"method\" line=\"259\"><f a=\"t:type\">\n\t<c path=\"m3.observable.MappedSet.T\"/>\n\t<c path=\"m3.observable.EventType\"/>\n\t<x path=\"Void\"/>\n</f></_sourceListener>\n\t<identifier public=\"1\" set=\"method\" line=\"280\" override=\"1\"><f a=\"\"><f a=\"\">\n\t<c path=\"m3.observable.MappedSet.U\"/>\n\t<c path=\"String\"/>\n</f></f></identifier>\n\t<delegate public=\"1\" set=\"method\" line=\"284\" override=\"1\"><f a=\"\"><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"m3.observable.MappedSet.U\"/>\n</x></f></delegate>\n\t<identify set=\"method\" line=\"288\"><f a=\"u\">\n\t<c path=\"m3.observable.MappedSet.U\"/>\n\t<c path=\"String\"/>\n</f></identify>\n\t<iterator public=\"1\" set=\"method\" line=\"299\" override=\"1\"><f a=\"\"><t path=\"Iterator\"><c path=\"m3.observable.MappedSet.U\"/></t></f></iterator>\n\t<mapListen public=\"1\" set=\"method\" line=\"303\"><f a=\"f\">\n\t<f a=\"::\">\n\t\t<c path=\"m3.observable.MappedSet.T\"/>\n\t\t<c path=\"m3.observable.MappedSet.U\"/>\n\t\t<c path=\"m3.observable.EventType\"/>\n\t\t<x path=\"Void\"/>\n\t</f>\n\t<x path=\"Void\"/>\n</f></mapListen>\n\t<removeListeners public=\"1\" set=\"method\" line=\"314\"><f a=\"mapListener\">\n\t<f a=\"::\">\n\t\t<c path=\"m3.observable.MappedSet.T\"/>\n\t\t<c path=\"m3.observable.MappedSet.U\"/>\n\t\t<c path=\"m3.observable.EventType\"/>\n\t\t<x path=\"Void\"/>\n\t</f>\n\t<x path=\"Void\"/>\n</f></removeListeners>\n\t<new public=\"1\" set=\"method\" line=\"249\"><f a=\"source:mapper:?remapOnUpdate\">\n\t<c path=\"m3.observable.OSet\"><c path=\"m3.observable.MappedSet.T\"/></c>\n\t<f a=\"\">\n\t\t<c path=\"m3.observable.MappedSet.T\"/>\n\t\t<c path=\"m3.observable.MappedSet.U\"/>\n\t</f>\n\t<x path=\"Bool\"/>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
m3.observable.FilteredSet.__rtti = "<class path=\"m3.observable.FilteredSet\" params=\"T\" module=\"m3.observable.OSet\">\n\t<extends path=\"m3.observable.AbstractSet\"><c path=\"m3.observable.FilteredSet.T\"/></extends>\n\t<_filteredSet><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"m3.observable.FilteredSet.T\"/>\n</x></_filteredSet>\n\t<_source><c path=\"m3.observable.OSet\"><c path=\"m3.observable.FilteredSet.T\"/></c></_source>\n\t<_filter><f a=\"\">\n\t<c path=\"m3.observable.FilteredSet.T\"/>\n\t<x path=\"Bool\"/>\n</f></_filter>\n\t<delegate public=\"1\" set=\"method\" line=\"347\" override=\"1\"><f a=\"\"><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"m3.observable.FilteredSet.T\"/>\n</x></f></delegate>\n\t<apply set=\"method\" line=\"351\"><f a=\"t\">\n\t<c path=\"m3.observable.FilteredSet.T\"/>\n\t<x path=\"Void\"/>\n</f></apply>\n\t<refilter public=\"1\" set=\"method\" line=\"368\"><f a=\"\"><x path=\"Void\"/></f></refilter>\n\t<identifier public=\"1\" set=\"method\" line=\"372\" override=\"1\"><f a=\"\"><f a=\"\">\n\t<c path=\"m3.observable.FilteredSet.T\"/>\n\t<c path=\"String\"/>\n</f></f></identifier>\n\t<iterator public=\"1\" set=\"method\" line=\"376\" override=\"1\"><f a=\"\"><t path=\"Iterator\"><c path=\"m3.observable.FilteredSet.T\"/></t></f></iterator>\n\t<asArray public=\"1\" set=\"method\" line=\"380\"><f a=\"\"><c path=\"Array\"><c path=\"m3.observable.FilteredSet.T\"/></c></f></asArray>\n\t<new public=\"1\" set=\"method\" line=\"326\"><f a=\"source:filter\">\n\t<c path=\"m3.observable.OSet\"><c path=\"m3.observable.FilteredSet.T\"/></c>\n\t<f a=\"\">\n\t\t<c path=\"m3.observable.FilteredSet.T\"/>\n\t\t<x path=\"Bool\"/>\n\t</f>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
m3.observable.GroupedSet.__rtti = "<class path=\"m3.observable.GroupedSet\" params=\"T\" module=\"m3.observable.OSet\">\n\t<extends path=\"m3.observable.AbstractSet\"><c path=\"m3.observable.OSet\"><c path=\"m3.observable.GroupedSet.T\"/></c></extends>\n\t<_source><c path=\"m3.observable.OSet\"><c path=\"m3.observable.GroupedSet.T\"/></c></_source>\n\t<_groupingFn><f a=\"\">\n\t<c path=\"m3.observable.GroupedSet.T\"/>\n\t<c path=\"String\"/>\n</f></_groupingFn>\n\t<_groupedSets><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"m3.observable.ObservableSet\"><c path=\"m3.observable.GroupedSet.T\"/></c>\n</x></_groupedSets>\n\t<_identityToGrouping><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"String\"/>\n</x></_identityToGrouping>\n\t<delete set=\"method\" line=\"419\"><f a=\"t\">\n\t<c path=\"m3.observable.GroupedSet.T\"/>\n\t<x path=\"Void\"/>\n</f></delete>\n\t<add set=\"method\" line=\"442\"><f a=\"t\">\n\t<c path=\"m3.observable.GroupedSet.T\"/>\n\t<x path=\"Void\"/>\n</f></add>\n\t<addEmptyGroup public=\"1\" set=\"method\" line=\"461\"><f a=\"key\">\n\t<c path=\"String\"/>\n\t<c path=\"m3.observable.ObservableSet\"><c path=\"m3.observable.GroupedSet.T\"/></c>\n</f></addEmptyGroup>\n\t<identifier public=\"1\" set=\"method\" line=\"470\" override=\"1\"><f a=\"\"><f a=\"\">\n\t<c path=\"m3.observable.OSet\"><c path=\"m3.observable.GroupedSet.T\"/></c>\n\t<c path=\"String\"/>\n</f></f></identifier>\n\t<identify set=\"method\" line=\"474\"><f a=\"set\">\n\t<c path=\"m3.observable.OSet\"><c path=\"m3.observable.GroupedSet.T\"/></c>\n\t<c path=\"String\"/>\n</f></identify>\n\t<iterator public=\"1\" set=\"method\" line=\"485\" override=\"1\"><f a=\"\"><t path=\"Iterator\"><c path=\"m3.observable.OSet\"><c path=\"m3.observable.GroupedSet.T\"/></c></t></f></iterator>\n\t<delegate public=\"1\" set=\"method\" line=\"489\" override=\"1\"><f a=\"\"><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"m3.observable.OSet\"><c path=\"m3.observable.GroupedSet.T\"/></c>\n</x></f></delegate>\n\t<new public=\"1\" set=\"method\" line=\"398\"><f a=\"source:groupingFn\">\n\t<c path=\"m3.observable.OSet\"><c path=\"m3.observable.GroupedSet.T\"/></c>\n\t<f a=\"\">\n\t\t<c path=\"m3.observable.GroupedSet.T\"/>\n\t\t<c path=\"String\"/>\n\t</f>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
m3.observable.SortedSet.__rtti = "<class path=\"m3.observable.SortedSet\" params=\"T\" module=\"m3.observable.OSet\">\n\t<extends path=\"m3.observable.AbstractSet\"><c path=\"m3.observable.SortedSet.T\"/></extends>\n\t<_source><c path=\"m3.observable.OSet\"><c path=\"m3.observable.SortedSet.T\"/></c></_source>\n\t<_sortByFn><f a=\"\">\n\t<c path=\"m3.observable.SortedSet.T\"/>\n\t<c path=\"String\"/>\n</f></_sortByFn>\n\t<_sorted><c path=\"Array\"><c path=\"m3.observable.SortedSet.T\"/></c></_sorted>\n\t<_dirty><x path=\"Bool\"/></_dirty>\n\t<_comparisonFn><f a=\":\">\n\t<c path=\"m3.observable.SortedSet.T\"/>\n\t<c path=\"m3.observable.SortedSet.T\"/>\n\t<x path=\"Int\"/>\n</f></_comparisonFn>\n\t<sorted public=\"1\" set=\"method\" line=\"541\"><f a=\"\"><c path=\"Array\"><c path=\"m3.observable.SortedSet.T\"/></c></f></sorted>\n\t<indexOf set=\"method\" line=\"549\"><f a=\"t\">\n\t<c path=\"m3.observable.SortedSet.T\"/>\n\t<x path=\"Int\"/>\n</f></indexOf>\n\t<binarySearch set=\"method\" line=\"554\"><f a=\"value:sortBy:startIndex:endIndex\">\n\t<c path=\"m3.observable.SortedSet.T\"/>\n\t<c path=\"String\"/>\n\t<x path=\"Int\"/>\n\t<x path=\"Int\"/>\n\t<x path=\"Int\"/>\n</f></binarySearch>\n\t<delete set=\"method\" line=\"572\"><f a=\"t\">\n\t<c path=\"m3.observable.SortedSet.T\"/>\n\t<x path=\"Void\"/>\n</f></delete>\n\t<add set=\"method\" line=\"576\"><f a=\"t\">\n\t<c path=\"m3.observable.SortedSet.T\"/>\n\t<x path=\"Void\"/>\n</f></add>\n\t<identifier public=\"1\" set=\"method\" line=\"582\" override=\"1\"><f a=\"\"><f a=\"\">\n\t<c path=\"m3.observable.SortedSet.T\"/>\n\t<c path=\"String\"/>\n</f></f></identifier>\n\t<iterator public=\"1\" set=\"method\" line=\"586\" override=\"1\"><f a=\"\"><t path=\"Iterator\"><c path=\"m3.observable.SortedSet.T\"/></t></f></iterator>\n\t<delegate public=\"1\" set=\"method\" line=\"590\" override=\"1\"><f a=\"\"><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"m3.observable.SortedSet.T\"/>\n</x></f></delegate>\n\t<new public=\"1\" set=\"method\" line=\"502\"><f a=\"source:?sortByFn\">\n\t<c path=\"m3.observable.OSet\"><c path=\"m3.observable.SortedSet.T\"/></c>\n\t<f a=\"\">\n\t\t<c path=\"m3.observable.SortedSet.T\"/>\n\t\t<c path=\"String\"/>\n\t</f>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
m3.util.ColorProvider._INDEX = 0;
ui.AgentUi.URL = "";
ui.AppContext.DEMO = false;
ui.SystemStatus.CONNECTED = "svg/notification-network-ethernet-connected.svg";
ui.SystemStatus.DISCONNECTED = "svg/notification-network-ethernet-disconnected.svg";
ui.api.BennuHandler.UPSERT = "/api/upsert";
ui.api.BennuHandler.DELETE = "/api/delete";
ui.api.BennuHandler.QUERY = "/api/query";
ui.api.BennuHandler.REGISTER = "/api/squery/register";
ui.api.BennuHandler.DEREGISTER = "/api/squery/deregister";
ui.api.BennuHandler.INTRODUCE = "/api/introduction/initiate";
ui.api.BennuHandler.INTRO_RESPONSE = "/api/introduction/respond";
ui.api.BennuMessage.__rtti = "<class path=\"ui.api.BennuMessage\" params=\"\" module=\"ui.api.CrudMessage\">\n\t<implements path=\"ui.api.ChannelMessage\"/>\n\t<type public=\"1\"><c path=\"String\"/></type>\n\t<new public=\"1\" set=\"method\" line=\"13\"><f a=\"type\">\n\t<c path=\"String\"/>\n\t<x path=\"Void\"/>\n</f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
ui.api.DeleteMessage.__rtti = "<class path=\"ui.api.DeleteMessage\" params=\"\" module=\"ui.api.CrudMessage\">\n\t<extends path=\"ui.api.BennuMessage\"/>\n\t<create public=\"1\" set=\"method\" line=\"26\" static=\"1\"><f a=\"object\">\n\t<c path=\"ui.model.ModelObjWithIid\"/>\n\t<c path=\"ui.api.DeleteMessage\"/>\n</f></create>\n\t<primaryKey><c path=\"String\"/></primaryKey>\n\t<new public=\"1\" set=\"method\" line=\"21\"><f a=\"type:primaryKey\">\n\t<c path=\"String\"/>\n\t<c path=\"String\"/>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
ui.api.CrudMessage.__rtti = "<class path=\"ui.api.CrudMessage\" params=\"\">\n\t<extends path=\"ui.api.BennuMessage\"/>\n\t<create public=\"1\" set=\"method\" line=\"39\" static=\"1\"><f a=\"object\">\n\t<c path=\"ui.model.ModelObjWithIid\"/>\n\t<c path=\"ui.api.CrudMessage\"/>\n</f></create>\n\t<instance><d/></instance>\n\t<new public=\"1\" set=\"method\" line=\"34\"><f a=\"type:instance\">\n\t<c path=\"String\"/>\n\t<d/>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
ui.api.QueryMessage.__rtti = "<class path=\"ui.api.QueryMessage\" params=\"\" module=\"ui.api.CrudMessage\">\n\t<extends path=\"ui.api.BennuMessage\"/>\n\t<q><c path=\"String\"/></q>\n\t<new public=\"1\" set=\"method\" line=\"48\"><f a=\"type:?q\">\n\t<c path=\"String\"/>\n\t<c path=\"String\"/>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
ui.api.RegisterMessage.__rtti = "<class path=\"ui.api.RegisterMessage\" params=\"\" module=\"ui.api.CrudMessage\">\n\t<implements path=\"ui.api.ChannelMessage\"/>\n\t<types public=\"1\"><c path=\"Array\"><c path=\"String\"/></c></types>\n\t<new public=\"1\" set=\"method\" line=\"57\"><f a=\"types\">\n\t<c path=\"Array\"><c path=\"String\"/></c>\n\t<x path=\"Void\"/>\n</f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
ui.api.ChannelRequestMessage.__rtti = "<class path=\"ui.api.ChannelRequestMessage\" params=\"\" module=\"ui.api.CrudMessage\">\n\t<path><c path=\"String\"/></path>\n\t<context><c path=\"String\"/></context>\n\t<parms><d/></parms>\n\t<new public=\"1\" set=\"method\" line=\"69\"><f a=\"path:context:msg\">\n\t<c path=\"String\"/>\n\t<c path=\"String\"/>\n\t<c path=\"ui.api.ChannelMessage\"/>\n\t<x path=\"Void\"/>\n</f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
ui.api.ChannelRequestMessageBundle.__rtti = "<class path=\"ui.api.ChannelRequestMessageBundle\" params=\"\" module=\"ui.api.CrudMessage\">\n\t<agentId><c path=\"String\"/></agentId>\n\t<channel><c path=\"String\"/></channel>\n\t<requests><c path=\"Array\"><c path=\"ui.api.ChannelRequestMessage\"/></c></requests>\n\t<addChannelRequest public=\"1\" set=\"method\" line=\"96\"><f a=\"request\">\n\t<c path=\"ui.api.ChannelRequestMessage\"/>\n\t<x path=\"Void\"/>\n</f></addChannelRequest>\n\t<addRequest public=\"1\" set=\"method\" line=\"100\"><f a=\"path:context:parms\">\n\t<c path=\"String\"/>\n\t<c path=\"String\"/>\n\t<c path=\"ui.api.BennuMessage\"/>\n\t<x path=\"Void\"/>\n</f></addRequest>\n\t<new public=\"1\" set=\"method\" line=\"83\"><f a=\"?requests_:?agentId\">\n\t<c path=\"Array\"><c path=\"ui.api.ChannelRequestMessage\"/></c>\n\t<c path=\"String\"/>\n\t<x path=\"Void\"/>\n</f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
ui.api.ProtocolMessage.__rtti = "<class path=\"ui.api.ProtocolMessage\" params=\"T\">\n\t<msgType public=\"1\" set=\"null\"><e path=\"ui.api.MsgType\"/></msgType>\n\t<content>\n\t\t<d/>\n\t\t<meta><m n=\":isVar\"/></meta>\n\t</content>\n\t<contentImpl public=\"1\">\n\t\t<c path=\"ui.api.ProtocolMessage.T\"/>\n\t\t<meta><m n=\":transient\"/></meta>\n\t</contentImpl>\n\t<type>\n\t\t<x path=\"Class\"><c path=\"ui.api.ProtocolMessage.T\"/></x>\n\t\t<meta><m n=\":transient\"/></meta>\n\t</type>\n\t<readResolve set=\"method\" line=\"31\"><f a=\"\"><x path=\"Void\"/></f></readResolve>\n\t<writeResolve set=\"method\" line=\"35\"><f a=\"\"><x path=\"Void\"/></f></writeResolve>\n\t<new public=\"1\" set=\"method\" line=\"25\"><f a=\"msgType:type\">\n\t<e path=\"ui.api.MsgType\"/>\n\t<x path=\"Class\"><c path=\"ui.api.ProtocolMessage.T\"/></x>\n\t<x path=\"Void\"/>\n</f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
ui.api.Payload.__rtti = "<class path=\"ui.api.Payload\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<new public=\"1\" set=\"method\" line=\"42\"><f a=\"\"><x path=\"Void\"/></f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
ui.api.PayloadWithSessionURI.__rtti = "<class path=\"ui.api.PayloadWithSessionURI\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.Payload\"/>\n\t<sessionURI public=\"1\"><c path=\"String\"/></sessionURI>\n\t<new public=\"1\" set=\"method\" line=\"48\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.PayloadWithReason.__rtti = "<class path=\"ui.api.PayloadWithReason\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.Payload\"/>\n\t<reason public=\"1\"><c path=\"String\"/></reason>\n\t<new public=\"1\" set=\"method\" line=\"53\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.ErrorPayload.__rtti = "<class path=\"ui.api.ErrorPayload\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.PayloadWithSessionURI\"/>\n\t<reason public=\"1\"><c path=\"String\"/></reason>\n\t<new public=\"1\" set=\"method\" line=\"57\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.ConfirmUserToken.__rtti = "<class path=\"ui.api.ConfirmUserToken\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.ConfirmUserTokenData\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"62\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.ConfirmUserTokenData.__rtti = "<class path=\"ui.api.ConfirmUserTokenData\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.Payload\"/>\n\t<token public=\"1\"><c path=\"String\"/></token>\n\t<new public=\"1\" set=\"method\" line=\"67\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.InitializeSessionRequest.__rtti = "<class path=\"ui.api.InitializeSessionRequest\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.InitializeSessionRequestData\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"75\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.InitializeSessionRequestData.__rtti = "<class path=\"ui.api.InitializeSessionRequestData\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.Payload\"/>\n\t<agentURI public=\"1\"><c path=\"String\"/></agentURI>\n\t<new public=\"1\" set=\"method\" line=\"80\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.InitializeSessionResponse.__rtti = "<class path=\"ui.api.InitializeSessionResponse\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.InitializeSessionResponseData\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"85\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.InitializeSessionResponseData.__rtti = "<class path=\"ui.api.InitializeSessionResponseData\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.Payload\"/>\n\t<sessionURI public=\"1\"><c path=\"String\"/></sessionURI>\n\t<listOfAliases public=\"1\"><c path=\"Array\"><c path=\"String\"/></c></listOfAliases>\n\t<defaultAlias public=\"1\"><c path=\"String\"/></defaultAlias>\n\t<listOfConnections public=\"1\"><c path=\"Array\"><c path=\"ui.model.Connection\"/></c></listOfConnections>\n\t<lastActiveLabel public=\"1\"><c path=\"String\"/></lastActiveLabel>\n\t<jsonBlob public=\"1\"><c path=\"ui.model.UserData\"/></jsonBlob>\n\t<listOfLabels><c path=\"Array\"><c path=\"String\"/></c></listOfLabels>\n\t<labels public=\"1\" get=\"accessor\" set=\"null\">\n\t\t<c path=\"Array\"><c path=\"ui.model.Label\"/></c>\n\t\t<meta><m n=\":transient\"/></meta>\n\t</labels>\n\t<get_labels set=\"method\" line=\"100\"><f a=\"\"><c path=\"Array\"><c path=\"ui.model.Label\"/></c></f></get_labels>\n\t<new public=\"1\" set=\"method\" line=\"90\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.InitializeSessionError.__rtti = "<class path=\"ui.api.InitializeSessionError\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.PayloadWithReason\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"114\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.CloseSessionRequest.__rtti = "<class path=\"ui.api.CloseSessionRequest\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.PayloadWithSessionURI\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"123\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.CloseSessionResponse.__rtti = "<class path=\"ui.api.CloseSessionResponse\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.PayloadWithSessionURI\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"129\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.FeedExpr.__rtti = "<class path=\"ui.api.FeedExpr\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.FeedExprData\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"135\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.FeedExprData.__rtti = "<class path=\"ui.api.FeedExprData\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.Payload\"/>\n\t<cnxns public=\"1\"><c path=\"Array\"><c path=\"ui.model.Connection\"/></c></cnxns>\n\t<label public=\"1\"><c path=\"String\"/></label>\n\t<new public=\"1\" set=\"method\" line=\"140\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.BackupRequest.__rtti = "<class path=\"ui.api.BackupRequest\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.BackupData\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"151\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.BackupData.__rtti = "<class path=\"ui.api.BackupData\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.PayloadWithSessionURI\"/>\n\t<new public=\"1\" set=\"method\" line=\"155\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.RestoreRequest.__rtti = "<class path=\"ui.api.RestoreRequest\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.BackupData\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"160\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.RestoresRequest.__rtti = "<class path=\"ui.api.RestoresRequest\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.PayloadWithSessionURI\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"166\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.RestoresResponse.__rtti = "<class path=\"ui.api.RestoresResponse\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.RestoresData\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"172\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.RestoresData.__rtti = "<class path=\"ui.api.RestoresData\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.Payload\"/>\n\t<backups public=\"1\"><c path=\"Array\"><c path=\"String\"/></c></backups>\n\t<new public=\"1\" set=\"method\" line=\"177\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.Synchronizer.synchronizers = new haxe.ds.StringMap();
ui.model.ModelObj.__rtti = "<class path=\"ui.model.ModelObj\" params=\"\">\n\t<objectType public=\"1\" set=\"method\" line=\"26\"><f a=\"\"><c path=\"String\"/></f></objectType>\n\t<new public=\"1\" set=\"method\" line=\"23\"><f a=\"\"><x path=\"Void\"/></f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
ui.model.ModelObjWithIid.__rtti = "<class path=\"ui.model.ModelObjWithIid\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.ModelObj\"/>\n\t<identifier public=\"1\" set=\"method\" line=\"46\" static=\"1\"><f a=\"t\">\n\t<c path=\"ui.model.ModelObjWithIid\"/>\n\t<c path=\"String\"/>\n</f></identifier>\n\t<deleted public=\"1\"><x path=\"Bool\"/></deleted>\n\t<agentId public=\"1\"><c path=\"String\"/></agentId>\n\t<iid public=\"1\"><c path=\"String\"/></iid>\n\t<new public=\"1\" set=\"method\" line=\"39\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.model.Agent.__rtti = "<class path=\"ui.model.Agent\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.ModelObj\"/>\n\t<iid public=\"1\"><c path=\"String\"/></iid>\n\t<agentId public=\"1\"><c path=\"String\"/></agentId>\n\t<name public=\"1\"><c path=\"String\"/></name>\n\t<data public=\"1\"><c path=\"ui.model.UserData\"/></data>\n\t<deleted public=\"1\"><x path=\"Bool\"/></deleted>\n\t<new public=\"1\" set=\"method\" line=\"58\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.model.UserData.__rtti = "<class path=\"ui.model.UserData\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.ModelObj\"/>\n\t<name public=\"1\"><c path=\"String\"/></name>\n\t<imgSrc public=\"1\">\n\t\t<c path=\"String\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</imgSrc>\n\t<isDefault public=\"1\">\n\t\t<x path=\"Bool\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</isDefault>\n\t<email public=\"1\">\n\t\t<c path=\"String\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</email>\n\t<new public=\"1\" set=\"method\" line=\"70\"><f a=\"?name:?imgSrc\">\n\t<c path=\"String\"/>\n\t<c path=\"String\"/>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
ui.model.Alias.__rtti = "<class path=\"ui.model.Alias\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.ModelObjWithIid\"/>\n\t<identifier public=\"1\" set=\"method\" line=\"90\" static=\"1\"><f a=\"alias\">\n\t<c path=\"ui.model.Alias\"/>\n\t<c path=\"String\"/>\n</f></identifier>\n\t<rootLabelIid public=\"1\"><c path=\"String\"/></rootLabelIid>\n\t<name public=\"1\"><c path=\"String\"/></name>\n\t<data public=\"1\"><c path=\"ui.model.UserData\"/></data>\n\t<new public=\"1\" set=\"method\" line=\"84\"><f a=\"?name\">\n\t<c path=\"String\"/>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
ui.model.LabelData.__rtti = "<class path=\"ui.model.LabelData\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.ModelObj\"/>\n\t<color public=\"1\"><c path=\"String\"/></color>\n\t<new public=\"1\" set=\"method\" line=\"97\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.model.Label.__rtti = "<class path=\"ui.model.Label\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.ModelObjWithIid\"/>\n\t<identifier public=\"1\" set=\"method\" line=\"114\" static=\"1\"><f a=\"l\">\n\t<c path=\"ui.model.Label\"/>\n\t<c path=\"String\"/>\n</f></identifier>\n\t<name public=\"1\"><c path=\"String\"/></name>\n\t<data public=\"1\"><c path=\"ui.model.LabelData\"/></data>\n\t<labelChildren public=\"1\">\n\t\t<c path=\"m3.observable.OSet\"><c path=\"ui.model.LabelChild\"/></c>\n\t\t<meta><m n=\":transient\"/></meta>\n\t</labelChildren>\n\t<new public=\"1\" set=\"method\" line=\"108\"><f a=\"?name\">\n\t<c path=\"String\"/>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
ui.model.LabelChild.__rtti = "<class path=\"ui.model.LabelChild\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.ModelObjWithIid\"/>\n\t<identifier public=\"1\" set=\"method\" line=\"133\" static=\"1\"><f a=\"l\">\n\t<c path=\"ui.model.LabelChild\"/>\n\t<c path=\"String\"/>\n</f></identifier>\n\t<parentIid public=\"1\"><c path=\"String\"/></parentIid>\n\t<childIid public=\"1\"><c path=\"String\"/></childIid>\n\t<data public=\"1\">\n\t\t<d/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</data>\n\t<new public=\"1\" set=\"method\" line=\"124\"><f a=\"?parentIid:?childIid\">\n\t<c path=\"String\"/>\n\t<c path=\"String\"/>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
ui.model.LabelAcl.__rtti = "<class path=\"ui.model.LabelAcl\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.ModelObjWithIid\"/>\n\t<identifier public=\"1\" set=\"method\" line=\"148\" static=\"1\"><f a=\"l\">\n\t<c path=\"ui.model.LabelAcl\"/>\n\t<c path=\"String\"/>\n</f></identifier>\n\t<connectionIid public=\"1\"><c path=\"String\"/></connectionIid>\n\t<labelIid public=\"1\"><c path=\"String\"/></labelIid>\n\t<new public=\"1\" set=\"method\" line=\"142\"><f a=\"?connectionIid:?labelIid\">\n\t<c path=\"String\"/>\n\t<c path=\"String\"/>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
ui.model.Connection.__rtti = "<class path=\"ui.model.Connection\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.ModelObjWithIid\"/>\n\t<identifier public=\"1\" set=\"method\" line=\"158\" static=\"1\"><f a=\"c\">\n\t<c path=\"ui.model.Connection\"/>\n\t<c path=\"String\"/>\n</f></identifier>\n\t<localPeerId public=\"1\"><c path=\"String\"/></localPeerId>\n\t<remotePeerId public=\"1\"><c path=\"String\"/></remotePeerId>\n\t<data public=\"1\"><c path=\"ui.model.UserData\"/></data>\n\t<equals public=\"1\" set=\"method\" line=\"166\"><f a=\"c\">\n\t<c path=\"ui.model.Connection\"/>\n\t<x path=\"Bool\"/>\n</f></equals>\n\t<name public=\"1\" set=\"method\" line=\"170\"><f a=\"\"><c path=\"String\"/></f></name>\n\t<new public=\"1\" set=\"method\" line=\"162\"><f a=\"?profile\">\n\t<c path=\"ui.model.UserData\"/>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
ui.model.LabeledContent.__rtti = "<class path=\"ui.model.LabeledContent\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.ModelObjWithIid\"/>\n\t<identifier public=\"1\" set=\"method\" line=\"244\" static=\"1\"><f a=\"l\">\n\t<c path=\"ui.model.LabeledContent\"/>\n\t<c path=\"String\"/>\n</f></identifier>\n\t<contentIid public=\"1\"><c path=\"String\"/></contentIid>\n\t<labelIid public=\"1\"><c path=\"String\"/></labelIid>\n\t<data public=\"1\">\n\t\t<d/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</data>\n\t<new public=\"1\" set=\"method\" line=\"248\"><f a=\"contentIid:labelIid\">\n\t<c path=\"String\"/>\n\t<c path=\"String\"/>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
ui.model.ContentData.__rtti = "<class path=\"ui.model.ContentData\" params=\"\" module=\"ui.model.ModelObj\">\n\t<created public=\"1\"><c path=\"Date\"/></created>\n\t<modified public=\"1\"><c path=\"Date\"/></modified>\n\t<new public=\"1\" set=\"method\" line=\"260\"><f a=\"\"><x path=\"Void\"/></f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
ui.model.Content.__rtti = "<class path=\"ui.model.Content\" params=\"T\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.ModelObjWithIid\"/>\n\t<contentType public=\"1\"><e path=\"ui.model.ContentType\"/></contentType>\n\t<aliasIid public=\"1\"><c path=\"String\"/></aliasIid>\n\t<data><d/></data>\n\t<props public=\"1\">\n\t\t<c path=\"ui.model.Content.T\"/>\n\t\t<meta><m n=\":transient\"/></meta>\n\t</props>\n\t<created public=\"1\" get=\"accessor\" set=\"null\">\n\t\t<c path=\"Date\"/>\n\t\t<meta>\n\t\t\t<m n=\":transient\"/>\n\t\t\t<m n=\":isVar\"/>\n\t\t</meta>\n\t</created>\n\t<modified public=\"1\" get=\"accessor\" set=\"null\">\n\t\t<c path=\"Date\"/>\n\t\t<meta>\n\t\t\t<m n=\":transient\"/>\n\t\t\t<m n=\":isVar\"/>\n\t\t</meta>\n\t</modified>\n\t<type>\n\t\t<x path=\"Class\"><c path=\"ui.model.Content.T\"/></x>\n\t\t<meta><m n=\":transient\"/></meta>\n\t</type>\n\t<get_created public=\"1\" set=\"method\" line=\"286\"><f a=\"\"><c path=\"Date\"/></f></get_created>\n\t<get_modified public=\"1\" set=\"method\" line=\"290\"><f a=\"\"><c path=\"Date\"/></f></get_modified>\n\t<setData public=\"1\" set=\"method\" line=\"295\"><f a=\"data\">\n\t<d/>\n\t<x path=\"Void\"/>\n</f></setData>\n\t<readResolve set=\"method\" line=\"299\"><f a=\"\"><x path=\"Void\"/></f></readResolve>\n\t<writeResolve set=\"method\" line=\"303\"><f a=\"\"><x path=\"Void\"/></f></writeResolve>\n\t<getTimestamp public=\"1\" set=\"method\" line=\"307\"><f a=\"\"><c path=\"String\"/></f></getTimestamp>\n\t<objectType public=\"1\" set=\"method\" line=\"311\" override=\"1\"><f a=\"\"><c path=\"String\"/></f></objectType>\n\t<new public=\"1\" set=\"method\" line=\"277\"><f a=\"contentType:type\">\n\t<e path=\"ui.model.ContentType\"/>\n\t<x path=\"Class\"><c path=\"ui.model.Content.T\"/></x>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
ui.model.ImageContentData.__rtti = "<class path=\"ui.model.ImageContentData\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.ContentData\"/>\n\t<imgSrc public=\"1\"><c path=\"String\"/></imgSrc>\n\t<caption public=\"1\">\n\t\t<c path=\"String\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</caption>\n\t<new public=\"1\" set=\"method\" line=\"320\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.model.ImageContent.__rtti = "<class path=\"ui.model.ImageContent\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.Content\"><c path=\"ui.model.ImageContentData\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"326\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.model.AudioContentData.__rtti = "<class path=\"ui.model.AudioContentData\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.ContentData\"/>\n\t<audioSrc public=\"1\"><c path=\"String\"/></audioSrc>\n\t<audioType public=\"1\">\n\t\t<c path=\"String\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</audioType>\n\t<title public=\"1\">\n\t\t<c path=\"String\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</title>\n\t<new public=\"1\" set=\"method\" line=\"336\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.model.AudioContent.__rtti = "<class path=\"ui.model.AudioContent\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.Content\"><c path=\"ui.model.AudioContentData\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"342\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.model.MessageContentData.__rtti = "<class path=\"ui.model.MessageContentData\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.ContentData\"/>\n\t<text public=\"1\"><c path=\"String\"/></text>\n\t<new public=\"1\" set=\"method\" line=\"350\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.model.MessageContent.__rtti = "<class path=\"ui.model.MessageContent\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.Content\"><c path=\"ui.model.MessageContentData\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"356\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.model.UrlContentData.__rtti = "<class path=\"ui.model.UrlContentData\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.ContentData\"/>\n\t<url public=\"1\"><c path=\"String\"/></url>\n\t<text public=\"1\">\n\t\t<c path=\"String\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</text>\n\t<new public=\"1\" set=\"method\" line=\"365\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.model.UrlContent.__rtti = "<class path=\"ui.model.UrlContent\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.Content\"><c path=\"ui.model.UrlContentData\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"371\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.model.Notification.__rtti = "<class path=\"ui.model.Notification\" params=\"T\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.ModelObjWithIid\"/>\n\t<consumed public=\"1\"><x path=\"Bool\"/></consumed>\n\t<fromConnectionIid public=\"1\"><c path=\"String\"/></fromConnectionIid>\n\t<kind public=\"1\"><e path=\"ui.model.NotificationKind\"/></kind>\n\t<data><d/></data>\n\t<props public=\"1\">\n\t\t<c path=\"ui.model.Notification.T\"/>\n\t\t<meta><m n=\":transient\"/></meta>\n\t</props>\n\t<type>\n\t\t<x path=\"Class\"><c path=\"ui.model.Notification.T\"/></x>\n\t\t<meta><m n=\":transient\"/></meta>\n\t</type>\n\t<readResolve set=\"method\" line=\"431\"><f a=\"\"><x path=\"Void\"/></f></readResolve>\n\t<writeResolve set=\"method\" line=\"435\"><f a=\"\"><x path=\"Void\"/></f></writeResolve>\n\t<new public=\"1\" set=\"method\" line=\"423\"><f a=\"kind:type\">\n\t<e path=\"ui.model.NotificationKind\"/>\n\t<x path=\"Class\"><c path=\"ui.model.Notification.T\"/></x>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
ui.model.Introduction.__rtti = "<class path=\"ui.model.Introduction\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.ModelObjWithIid\"/>\n\t<aConnectionIid public=\"1\"><c path=\"String\"/></aConnectionIid>\n\t<aMessage public=\"1\"><c path=\"String\"/></aMessage>\n\t<bConnectionIid public=\"1\"><c path=\"String\"/></bConnectionIid>\n\t<bMessage public=\"1\"><c path=\"String\"/></bMessage>\n\t<new public=\"1\" set=\"method\" line=\"448\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.model.IntroductionRequestClass.__rtti = "<class path=\"ui.model.IntroductionRequestClass\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.Notification\"><c path=\"ui.model.IntroductionRequestData\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"456\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.model.IntroductionResponseClass.__rtti = "<class path=\"ui.model.IntroductionResponseClass\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.Notification\"><c path=\"ui.model.IntroductionResponseData\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"466\"><f a=\"introductionIid:accepted\">\n\t<c path=\"String\"/>\n\t<x path=\"Bool\"/>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
ui.model.Login.__rtti = "<class path=\"ui.model.Login\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.ModelObj\"/>\n\t<agentId public=\"1\"><c path=\"String\"/></agentId>\n\t<password public=\"1\"><c path=\"String\"/></password>\n\t<new public=\"1\" set=\"method\" line=\"481\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.model.NewUser.__rtti = "<class path=\"ui.model.NewUser\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.ModelObj\"/>\n\t<name public=\"1\"><c path=\"String\"/></name>\n\t<userName public=\"1\"><c path=\"String\"/></userName>\n\t<email public=\"1\"><c path=\"String\"/></email>\n\t<pwd public=\"1\"><c path=\"String\"/></pwd>\n\t<new public=\"1\" set=\"method\" line=\"494\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.widget.score.ContentTimeLine.initial_y_pos = 60;
ui.widget.score.ContentTimeLine.next_y_pos = ui.widget.score.ContentTimeLine.initial_y_pos;
ui.widget.score.ContentTimeLine.next_x_pos = 10;
ui.widget.score.ContentTimeLine.width = 60;
ui.widget.score.ContentTimeLine.height = 70;
ui.AgentUi.main();
function $hxExpose(src, path) {
	var o = typeof window != "undefined" ? window : exports;
	var parts = path.split(".");
	for(var ii = 0; ii < parts.length-1; ++ii) {
		var p = parts[ii];
		if(typeof o[p] == "undefined") o[p] = {};
		o = o[p];
	}
	o[parts[parts.length-1]] = src;
}
})();
