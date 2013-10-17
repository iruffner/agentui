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
Lambda.fold = function(it,f,first) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		first = f(x,first);
	}
	return first;
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
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
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
	this.callStack = haxe.CallStack.callStack();
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
m3.jq = {}
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
m3.log = {}
m3.log.Logga = function(logLevel) {
	this.initialized = false;
	this.loggerLevel = logLevel;
};
$hxClasses["m3.log.Logga"] = m3.log.Logga;
m3.log.Logga.__name__ = ["m3","log","Logga"];
m3.log.Logga.get_DEFAULT = function() {
	if(m3.log.Logga.DEFAULT == null) m3.log.Logga.DEFAULT = new m3.log.Logga(m3.log.LogLevel.DEBUG);
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
			if((Type.enumEq(level,m3.log.LogLevel.TRACE) || Type.enumEq(level,m3.log.LogLevel.DEBUG)) && this.console.debug != null) this.console.debug(statement); else if(Type.enumEq(level,m3.log.LogLevel.INFO) && this.console.info != null) this.console.info(statement); else if(Type.enumEq(level,m3.log.LogLevel.WARN) && this.console.warn != null) this.console.warn(statement); else if(Type.enumEq(level,m3.log.LogLevel.ERROR) && this.console.error != null) {
				this.console.error(statement);
				this.console.trace();
			} else this.console.log(statement);
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
	,setStatementPrefix: function(prefix) {
		this.statementPrefix = prefix;
	}
	,_getLogger: function() {
		this.console = window.console;
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
	fire: function(t,type) {
		Lambda.iter(this._listeners,function(it) {
			return it(t,type);
		});
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
		return this._add;
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
m3.observable.MappedSet = function(source,mapper) {
	var _g = this;
	m3.observable.AbstractSet.call(this);
	this._mappedSet = new haxe.ds.StringMap();
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
$hxClasses["m3.observable.MappedSet"] = m3.observable.MappedSet;
m3.observable.MappedSet.__name__ = ["m3","observable","MappedSet"];
m3.observable.MappedSet.__super__ = m3.observable.AbstractSet;
m3.observable.MappedSet.prototype = $extend(m3.observable.AbstractSet.prototype,{
	iterator: function() {
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
	iterator: function() {
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
	,add: function(t) {
		var id = (this._source.identifier())(t);
		var key = this._identityToGrouping.get(id);
		if(key != null) throw new m3.exception.Exception("cannot add it is already in the list" + id + " -- " + key);
		key = this._groupingFn(t);
		this._identityToGrouping.set(id,key);
		var groupedSet = this._groupedSets.get(key);
		if(groupedSet == null) {
			groupedSet = new m3.observable.ObservableSet(this._source.identifier());
			groupedSet.visualId = key;
			this._groupedSets.set(key,groupedSet);
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
		return new m3.serialization.ClassHandler(clazz,m3.serialization.TypeTools.classname(clazz),this);
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
m3.util = {}
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
	ui.AgentUi.LOGGER = new m3.log.Logga(m3.log.LogLevel.DEBUG);
	ui.AgentUi.CONTENT = new m3.observable.ObservableSet(ui.model.ModelObj.identifier);
	ui.AgentUi.PROTOCOL = new ui.api.ProtocolHandler();
	ui.AgentUi.SERIALIZER = new m3.serialization.Serializer();
	ui.AgentUi.HOT_KEY_ACTIONS = new Array();
}
ui.AgentUi.start = function() {
	var urlVars = m3.util.HtmlUtil.getUrlVars();
	if(m3.helper.StringHelper.isNotBlank(urlVars.demo) && (urlVars.demo == "yes" || urlVars.demo == "true")) ui.AgentUi.DEMO = true;
	new $("body").keyup(function(evt) {
		if(m3.helper.ArrayHelper.hasValues(ui.AgentUi.HOT_KEY_ACTIONS)) {
			var _g1 = 0, _g = ui.AgentUi.HOT_KEY_ACTIONS.length;
			while(_g1 < _g) {
				var action_ = _g1++;
				ui.AgentUi.HOT_KEY_ACTIONS[action_](evt);
			}
		}
	});
	new $("#sideRightSearchInput").keyup(function(evt) {
		var search = new $(evt.target);
		var cl = new $("#connections");
		ui.widget.ConnectionListHelper.filterConnections(cl,search.val());
	});
	new $("#middleContainer #content #tabs").tabs();
	new $("#sideRight #chat").messagingComp();
	new $("#connections").connectionsList({ });
	new $("#labelsList").labelsList();
	new $("#filter").filterComp(null);
	new $("#feed").contentFeed({ content : ui.AgentUi.CONTENT});
	new $("#userId").userComp();
	new $("#postInput").postComp();
	new $("#sideRight #sideRightInvite").inviteComp();
	var fitWindowListener = new ui.model.EMListener(function(n) {
		fitWindow();
	},"FitWindowListener");
	var fireFitWindow = new ui.model.EMListener(function(n) {
		ui.model.EM.change(ui.model.EMEvent.FitWindow);
	},"FireFitWindowListener");
	ui.model.EM.addListener(ui.model.EMEvent.MoreContent,fireFitWindow);
	ui.model.EM.addListener(ui.model.EMEvent.USER_LOGIN,fireFitWindow);
	ui.model.EM.addListener(ui.model.EMEvent.USER_CREATE,fireFitWindow);
	ui.model.EM.addListener(ui.model.EMEvent.USER,new ui.model.EMListener(function(user) {
		ui.AgentUi.USER = user;
		ui.model.EM.change(ui.model.EMEvent.AliasLoaded,user.get_currentAlias());
	},"AgentUi-User"));
	ui.model.EM.addListener(ui.model.EMEvent.AliasLoaded,new ui.model.EMListener(function(alias) {
		ui.AgentUi.USER.set_currentAlias(alias);
	},"AgentUi-Alias"));
	ui.model.EM.addListener(ui.model.EMEvent.FitWindow,fitWindowListener);
	new $("body").click(function(evt) {
		new $(".nonmodalPopup").hide();
	});
	if(m3.helper.StringHelper.isNotBlank(urlVars.agentURI)) ui.AgentUi.agentURI = urlVars.agentURI;
	ui.widget.DialogManager.showLogin();
}
ui.api = {}
ui.api.ProtocolHandler = function() {
	this.filterIsRunning = false;
	var _g = this;
	ui.model.EM.addListener(ui.model.EMEvent.FILTER_RUN,new ui.model.EMListener(function(filter) {
		_g.filter(filter);
		_g.filterIsRunning = true;
	}));
	ui.model.EM.addListener(ui.model.EMEvent.EndOfContent,new ui.model.EMListener(function(nextPageURI) {
		_g.filterIsRunning = false;
	}));
	ui.model.EM.addListener(ui.model.EMEvent.NextContent,new ui.model.EMListener(function(nextPageURI) {
		_g.nextPage(nextPageURI);
	}));
	ui.model.EM.addListener(ui.model.EMEvent.LoadAlias,new ui.model.EMListener(function(alias) {
		_g.getAliasInfo(alias);
	}));
	ui.model.EM.addListener(ui.model.EMEvent.AliasCreate,new ui.model.EMListener(function(alias) {
		_g.addAlias(alias);
	}));
	ui.model.EM.addListener(ui.model.EMEvent.USER_LOGIN,new ui.model.EMListener(function(login) {
		_g.getUser(login);
	}));
	ui.model.EM.addListener(ui.model.EMEvent.USER_CREATE,new ui.model.EMListener(function(user) {
		_g.createUser(user);
	}));
	ui.model.EM.addListener(ui.model.EMEvent.USER_UPDATE,new ui.model.EMListener(function(user) {
		_g.updateUser(user);
	}));
	ui.model.EM.addListener(ui.model.EMEvent.USER_VALIDATE,new ui.model.EMListener(function(token) {
		_g.validateUser(token);
	}));
	ui.model.EM.addListener(ui.model.EMEvent.NewContentCreated,new ui.model.EMListener(function(content) {
		_g.post(content);
	}));
	ui.model.EM.addListener(ui.model.EMEvent.CreateLabel,new ui.model.EMListener(function(label) {
		_g.createLabel(label);
	}));
	ui.model.EM.addListener(ui.model.EMEvent.INTRODUCTION_REQUEST,new ui.model.EMListener(function(msg) {
		ui.model.EM.change(ui.model.EMEvent.INTRODUCTION_RESPONSE);
	}));
	this.processHash = new haxe.ds.EnumValueMap();
	this.processHash.set(ui.api.MsgType.evalResponse,function(data) {
		var evalResponse = ui.AgentUi.SERIALIZER.fromJsonX(data,ui.api.EvalResponse);
		ui.model.EM.change(ui.model.EMEvent.MoreContent,evalResponse.contentImpl.pageOfPosts);
	});
	this.processHash.set(ui.api.MsgType.evalComplete,function(data) {
		ui.AgentUi.LOGGER.debug("evalComplete was received from the server");
		var evalComplete = ui.AgentUi.SERIALIZER.fromJsonX(data,ui.api.EvalComplete);
		ui.model.EM.change(ui.model.EMEvent.EndOfContent,evalComplete.contentImpl.pageOfPosts);
	});
	this.processHash.set(ui.api.MsgType.sessionPong,function(data) {
	});
	this.processHash.set(ui.api.MsgType.updateUserResponse,function(data) {
		ui.AgentUi.LOGGER.debug("updateUserResponse was received from the server");
	});
	this.processHash.set(ui.api.MsgType.addAliasLabelsResponse,function(data) {
		ui.AgentUi.LOGGER.debug("addAliasLabelsResponse was received from the server");
	});
	this.processHash.set(ui.api.MsgType.addAgentAliasesResponse,function(data) {
		ui.AgentUi.LOGGER.debug("addAgentAliasesResponse was received from the server");
	});
	this.processHash.set(ui.api.MsgType.addAgentAliasesError,function(data) {
		ui.AgentUi.LOGGER.error("addAgentAliasesError was received from the server");
	});
	this.processHash.set(ui.api.MsgType.removeAgentAliasesResponse,function(data) {
		ui.AgentUi.LOGGER.debug("removeAgentAliasesResponse was received from the server");
	});
	this.processHash.set(ui.api.MsgType.removeAgentAliasesError,function(data) {
		ui.AgentUi.LOGGER.error("removeAgentAliasesError was received from the server");
	});
	this.processHash.set(ui.api.MsgType.setDefaultAliasRequest,function(data) {
		ui.AgentUi.LOGGER.debug("setDefaultAliasRequest was received from the server");
	});
	this.processHash.set(ui.api.MsgType.setDefaultAliasError,function(data) {
		ui.AgentUi.LOGGER.error("setDefaultAliasError was received from the server");
	});
	this.processHash.set(ui.api.MsgType.getAliasConnectionsResponse,function(data) {
		ui.AgentUi.LOGGER.debug("getAliasConnectionsResponse was received from the server");
		var resp = ui.AgentUi.SERIALIZER.fromJsonX(data,ui.api.GetAliasConnectionsResponse);
		ui.AgentUi.USER.get_currentAlias().connectionSet.clear();
		ui.AgentUi.USER.get_currentAlias().connectionSet.addAll(resp.contentImpl.cnxns);
	});
	this.processHash.set(ui.api.MsgType.getAliasConnectionsError,function(data) {
		ui.AgentUi.LOGGER.error("getAliasConnectionsError was received from the server");
	});
	this.processHash.set(ui.api.MsgType.getAliasLabelsResponse,function(data) {
		ui.AgentUi.LOGGER.debug("getAliasLabelsResponse was received from the server");
		var resp = ui.AgentUi.SERIALIZER.fromJsonX(data,ui.api.GetAliasLabelsResponse);
		ui.AgentUi.USER.get_currentAlias().labelSet.clear();
		ui.AgentUi.USER.get_currentAlias().labelSet.addAll(resp.contentImpl.labels.map(function(str) {
			return new ui.model.Label(str);
		}));
	});
	this.processHash.set(ui.api.MsgType.getAliasLabelsError,function(data) {
		ui.AgentUi.LOGGER.error("getAliasLabelsError was received from the server");
	});
};
$hxClasses["ui.api.ProtocolHandler"] = ui.api.ProtocolHandler;
ui.api.ProtocolHandler.__name__ = ["ui","api","ProtocolHandler"];
ui.api.ProtocolHandler.prototype = {
	getAliasLabels: function(alias) {
		var request = new ui.api.BaseAgentAliasRequest(ui.api.MsgType.getAliasLabelsRequest);
		request.contentImpl.aliases = [alias.label];
		try {
			new ui.api.StandardRequest(request,function(data,textStatus,jqXHR) {
				ui.AgentUi.LOGGER.debug("getAliasLabels successfully submitted");
			}).start({ dataType : "text"});
		} catch( err ) {
			var ex = m3.log.Logga.getExceptionInst(err);
			ui.AgentUi.LOGGER.error("Error executing getAliasLabels",ex);
		}
	}
	,getAliasConnections: function(alias) {
		var request = new ui.api.BaseAgentAliasRequest(ui.api.MsgType.getAliasConnectionsRequest);
		request.contentImpl.aliases = [alias.label];
		try {
			new ui.api.StandardRequest(request,function(data,textStatus,jqXHR) {
				ui.AgentUi.LOGGER.debug("getAliasConnections successfully submitted");
			}).start({ dataType : "text"});
		} catch( err ) {
			var ex = m3.log.Logga.getExceptionInst(err);
			ui.AgentUi.LOGGER.error("Error executing getAliasConnections",ex);
		}
	}
	,setDefaultAlias: function(alias) {
		var request = new ui.api.BaseAgentAliasRequest(ui.api.MsgType.setDefaultAliasRequest);
		request.contentImpl.aliases = [alias.label];
		try {
			new ui.api.StandardRequest(request,function(data,textStatus,jqXHR) {
				ui.AgentUi.LOGGER.debug("setDefaultAlias successfully submitted");
			}).start({ dataType : "text"});
		} catch( err ) {
			var ex = m3.log.Logga.getExceptionInst(err);
			ui.AgentUi.LOGGER.error("Error executing setDefaultAlias",ex);
		}
	}
	,removeAlias: function(alias) {
		var request = new ui.api.BaseAgentAliasRequest(ui.api.MsgType.removeAgentAliasesRequest);
		request.contentImpl.aliases = [alias.label];
		try {
			new ui.api.StandardRequest(request,function(data,textStatus,jqXHR) {
				ui.AgentUi.LOGGER.debug("removeAlias successfully submitted");
			}).start({ dataType : "text"});
		} catch( err ) {
			var ex = m3.log.Logga.getExceptionInst(err);
			ui.AgentUi.LOGGER.error("Error executing removeAlias",ex);
		}
	}
	,addAlias: function(alias) {
		var request = new ui.api.BaseAgentAliasRequest(ui.api.MsgType.addAgentAliasesRequest);
		request.contentImpl.aliases = [alias.label];
		try {
			new ui.api.StandardRequest(request,function(data,textStatus,jqXHR) {
				ui.AgentUi.LOGGER.debug("addAlias successfully submitted");
			}).start({ dataType : "text"});
		} catch( err ) {
			var ex = m3.log.Logga.getExceptionInst(err);
			ui.AgentUi.LOGGER.error("Error executing addAlias",ex);
		}
	}
	,createLabel: function(label) {
		var request = new ui.api.AddAliasLabelsRequest();
		ui.AgentUi.USER.get_currentAlias().labelSet.add(label);
		var labelsArray = ui.helper.PrologHelper.tagTreeAsStrings(ui.AgentUi.USER.get_currentAlias().labelSet);
		request.contentImpl.labels = labelsArray;
		request.contentImpl.alias = ui.AgentUi.USER.get_currentAlias().label;
		try {
			new ui.api.StandardRequest(request,function(data,textStatus,jqXHR) {
				ui.AgentUi.LOGGER.debug("label successfully submitted");
			}).start({ dataType : "text"});
		} catch( err ) {
			var ex = m3.log.Logga.getExceptionInst(err);
			ui.AgentUi.LOGGER.error("Error executing label post",ex);
		}
	}
	,post: function(content) {
		var request = new ui.api.EvalSubscribeRequest();
		request.contentImpl.expression = new ui.api.InsertContent();
		var insertData = new ui.api.InsertContentData();
		request.contentImpl.expression.contentImpl = insertData;
		insertData.label = ui.helper.PrologHelper.labelsToProlog(content.labelSet);
		insertData.value = ui.AgentUi.SERIALIZER.toJsonString(content);
		insertData.cnxns = [ui.AgentUi.USER.getSelfConnection()];
		try {
			new ui.api.StandardRequest(request,function(data,textStatus,jqXHR) {
				ui.AgentUi.LOGGER.debug("content successfully submitted");
			}).start({ dataType : "text"});
		} catch( err ) {
			var ex = m3.log.Logga.getExceptionInst(err);
			ui.AgentUi.LOGGER.error("Error executing content post",ex);
		}
	}
	,updateUser: function(user) {
		var request = new ui.api.UpdateUserRequest();
		request.contentImpl.jsonBlob = user.userData;
		try {
			new ui.api.StandardRequest(request,function(data,textStatus,jqXHR) {
				ui.AgentUi.LOGGER.debug("updateUserRequest successfully submitted");
				ui.model.EM.change(ui.model.EMEvent.USER,user);
			}).start({ dataType : "text"});
		} catch( err ) {
			var ex = m3.log.Logga.getExceptionInst(err);
			ui.AgentUi.LOGGER.error("Error executing user creation",ex);
		}
	}
	,validateUser: function(token) {
		var request = new ui.api.ConfirmUserToken();
		request.contentImpl.token = token;
		try {
			new ui.api.StandardRequest(request,function(data,textStatus,jqXHR) {
				if(data.msgType == ui.api.MsgType.createUserResponse) try {
					var response = ui.AgentUi.SERIALIZER.fromJsonX(data,ui.api.CreateUserResponse,false);
					ui.AgentUi.agentURI = response.contentImpl.agentURI;
					ui.model.EM.change(ui.model.EMEvent.USER_VALIDATED);
				} catch( e ) {
					if( js.Boot.__instanceof(e,m3.serialization.JsonException) ) {
						ui.AgentUi.LOGGER.error("Serialization error",e);
					} else throw(e);
				} else {
					ui.AgentUi.LOGGER.error("Unknown user creation error | " + Std.string(data));
					js.Lib.alert("There was an unexpected error creating your agent. Please try again.");
				}
			}).start();
		} catch( err ) {
			var ex = m3.log.Logga.getExceptionInst(err);
			ui.AgentUi.LOGGER.error("Error executing user creation",ex);
		}
	}
	,createUser: function(newUser) {
		var request = new ui.api.CreateUserRequest();
		request.contentImpl.email = newUser.email;
		request.contentImpl.password = newUser.pwd;
		request.contentImpl.jsonBlob = { };
		request.contentImpl.jsonBlob.name = newUser.name;
		try {
			new ui.api.StandardRequest(request,function(data,textStatus,jqXHR) {
				if(data.msgType == ui.api.MsgType.createUserResponse) try {
					var response = ui.AgentUi.SERIALIZER.fromJsonX(data,ui.api.CreateUserResponse,false);
					ui.AgentUi.agentURI = response.contentImpl.agentURI;
					ui.model.EM.change(ui.model.EMEvent.USER_SIGNUP);
				} catch( e ) {
					if( js.Boot.__instanceof(e,m3.serialization.JsonException) ) {
						ui.AgentUi.LOGGER.error("Serialization error",e);
					} else throw(e);
				} else if(data.msgType == ui.api.MsgType.createUserWaiting) try {
					var response = ui.AgentUi.SERIALIZER.fromJsonX(data,ui.api.CreateUserWaiting,false);
					ui.widget.DialogManager.showSignupConfirmation();
					ui.model.EM.change(ui.model.EMEvent.USER_SIGNUP);
				} catch( e ) {
					if( js.Boot.__instanceof(e,m3.serialization.JsonException) ) {
						ui.AgentUi.LOGGER.error("Serialization error",e);
					} else throw(e);
				} else if(data.msgType == ui.api.MsgType.createUserError) {
					var error = ui.AgentUi.SERIALIZER.fromJsonX(data,ui.api.InitializeSessionError);
					js.Lib.alert("User creation error: " + error.contentImpl.reason);
				} else {
					ui.AgentUi.LOGGER.error("Unknown user creation error | " + Std.string(data));
					js.Lib.alert("There was an unexpected error creating your agent. Please try again.");
				}
			}).start();
		} catch( err ) {
			var ex = m3.log.Logga.getExceptionInst(err);
			ui.AgentUi.LOGGER.error("Error executing user creation",ex);
		}
	}
	,_startPolling: function(sessionURI) {
		var _g = this;
		var ping = new ui.api.SessionPingRequest();
		ping.contentImpl = new ui.api.PayloadWithSessionURI();
		ping.contentImpl.sessionURI = sessionURI;
		this.listeningChannel = new ui.api.LongPollingRequest(ping,function(data,textStatus,jqXHR) {
			var msgType = (function($this) {
				var $r;
				try {
					$r = Type.createEnum(ui.api.MsgType,data.msgType);
				} catch( err ) {
					$r = null;
				}
				return $r;
			}(this));
			var processor = _g.processHash.get(msgType);
			if(processor == null) {
				if(data != null) ui.AgentUi.LOGGER.info("no processor for " + data.msgType); else ui.AgentUi.LOGGER.info("no data returned on polling channel response");
				return;
			} else {
				ui.AgentUi.LOGGER.debug("received " + data.msgType);
				processor(data);
			}
		});
		this.listeningChannel.start();
	}
	,getAliasInfo: function(alias) {
		this.getAliasConnections(alias);
		this.getAliasLabels(alias);
	}
	,nextPage: function(nextPageURI) {
		var request = new ui.api.EvalNextPageRequest();
		request.contentImpl.nextPage = nextPageURI;
		try {
			new ui.api.StandardRequest(request,function(data,textStatus,jqXHR) {
				ui.AgentUi.LOGGER.debug("next page request successfully submitted");
			}).start();
		} catch( err ) {
			var ex = m3.log.Logga.getExceptionInst(err);
			ui.AgentUi.LOGGER.error("Error executing next page request",ex);
		}
	}
	,filter: function(filter) {
		ui.AgentUi.CONTENT.clear();
		if(filter.rootNode.hasChildren()) {
			var request = new ui.api.EvalSubscribeRequest();
			var feedExpr = new ui.api.FeedExpr();
			request.contentImpl.expression = feedExpr;
			var data = new ui.api.FeedExprData();
			feedExpr.contentImpl = data;
			data.cnxns = [ui.AgentUi.USER.getSelfConnection()];
			data.label = filter.labelsProlog();
			try {
				new ui.api.StandardRequest(request,function(data1,textStatus,jqXHR) {
					ui.AgentUi.LOGGER.debug("filter successfully submitted");
				}).start({ dataType : "text"});
			} catch( err ) {
				var ex = m3.log.Logga.getExceptionInst(err);
				ui.AgentUi.LOGGER.error("Error executing filter request",ex);
			}
		}
	}
	,getUser: function(login) {
		var _g = this;
		if(ui.AgentUi.DEMO) {
			ui.model.EM.change(ui.model.EMEvent.USER,ui.api.TestDao.getUser(null));
			return;
		}
		var request = new ui.api.InitializeSessionRequest();
		request.contentImpl.agentURI = login.getUri();
		try {
			var loginRequest = new ui.api.StandardRequest(request,function(data,textStatus,jqXHR) {
				if(data.msgType == ui.api.MsgType.initializeSessionResponse) try {
					var response = ui.AgentUi.SERIALIZER.fromJsonX(data,ui.api.InitializeSessionResponse,false);
					var user = new ui.model.User();
					user.aliasSet = new m3.observable.ObservableSet(ui.model.ModelObj.identifier);
					user.aliasSet.visualId = "User Aliases";
					var _g1 = 0, _g11 = response.contentImpl.listOfAliases;
					while(_g1 < _g11.length) {
						var alias_ = _g11[_g1];
						++_g1;
						var alias = new ui.model.Alias();
						alias.label = alias_;
						alias.uid = m3.util.UidGenerator.create(12);
						user.aliasSet.add(alias);
					}
					if(!m3.helper.OSetHelper.hasValues(user.aliasSet)) {
						ui.AgentUi.LOGGER.error("Agent has no Aliases!!");
						user.set_currentAlias(new ui.model.Alias());
						user.get_currentAlias().label = "default";
						user.get_currentAlias().uid = m3.util.UidGenerator.create(12);
						user.aliasSet.add(user.get_currentAlias());
					}
					if(m3.helper.StringHelper.isNotBlank(response.contentImpl.defaultAlias)) user.set_currentAlias(m3.helper.OSetHelper.getElementComplex(user.aliasSet,response.contentImpl.defaultAlias,"label")); else user.set_currentAlias(user.aliasSet.iterator().next());
					user.sessionURI = response.contentImpl.sessionURI;
					user.get_currentAlias().connectionSet = new m3.observable.ObservableSet(ui.model.ModelObj.identifier,response.contentImpl.listOfCnxns);
					user.get_currentAlias().labelSet = new m3.observable.ObservableSet(ui.model.ModelObj.identifier,response.contentImpl.get_labels());
					user.userData = response.contentImpl.jsonBlob;
					_g._startPolling(user.sessionURI);
					if(!ui.AgentUi.DEMO) ui.model.EM.change(ui.model.EMEvent.USER,user);
				} catch( e ) {
					if( js.Boot.__instanceof(e,m3.serialization.JsonException) ) {
						ui.AgentUi.LOGGER.error("Serialization error",e);
					} else throw(e);
				} else if(data.msgType == ui.api.MsgType.initializeSessionError) {
					var error = ui.AgentUi.SERIALIZER.fromJsonX(data,ui.api.InitializeSessionError);
					js.Lib.alert("Login error: " + error.contentImpl.reason);
				} else {
					ui.AgentUi.LOGGER.error("Unknown user login error | " + Std.string(data));
					js.Lib.alert("There was an unexpected error attempting to login. Please try again.");
				}
			});
			loginRequest.start();
		} catch( err ) {
			js.Lib.alert(err);
		}
	}
	,__class__: ui.api.ProtocolHandler
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
		this.content = ui.AgentUi.SERIALIZER.toJson(this.contentImpl);
	}
	,readResolve: function() {
		this.contentImpl = ui.AgentUi.SERIALIZER.fromJsonX(this.content,this.type);
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
	if(ui.AgentUi.USER != null) this.sessionURI = ui.AgentUi.USER.sessionURI;
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
ui.api.CreateUserRequest = function() {
	ui.api.ProtocolMessage.call(this,ui.api.MsgType.createUserRequest,ui.api.UserRequestData);
};
$hxClasses["ui.api.CreateUserRequest"] = ui.api.CreateUserRequest;
ui.api.CreateUserRequest.__name__ = ["ui","api","CreateUserRequest"];
ui.api.CreateUserRequest.__super__ = ui.api.ProtocolMessage;
ui.api.CreateUserRequest.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	__class__: ui.api.CreateUserRequest
});
ui.api.UserRequestData = function() {
	ui.api.Payload.call(this);
};
$hxClasses["ui.api.UserRequestData"] = ui.api.UserRequestData;
ui.api.UserRequestData.__name__ = ["ui","api","UserRequestData"];
ui.api.UserRequestData.__super__ = ui.api.Payload;
ui.api.UserRequestData.prototype = $extend(ui.api.Payload.prototype,{
	__class__: ui.api.UserRequestData
});
ui.api.CreateUserError = function() {
	ui.api.ProtocolMessage.call(this,ui.api.MsgType.createUserError,ui.api.PayloadWithReason);
};
$hxClasses["ui.api.CreateUserError"] = ui.api.CreateUserError;
ui.api.CreateUserError.__name__ = ["ui","api","CreateUserError"];
ui.api.CreateUserError.__super__ = ui.api.ProtocolMessage;
ui.api.CreateUserError.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	__class__: ui.api.CreateUserError
});
ui.api.CreateUserWaiting = function() {
	ui.api.ProtocolMessage.call(this,ui.api.MsgType.createUserWaiting,ui.api.Payload);
};
$hxClasses["ui.api.CreateUserWaiting"] = ui.api.CreateUserWaiting;
ui.api.CreateUserWaiting.__name__ = ["ui","api","CreateUserWaiting"];
ui.api.CreateUserWaiting.__super__ = ui.api.ProtocolMessage;
ui.api.CreateUserWaiting.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	__class__: ui.api.CreateUserWaiting
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
ui.api.CreateUserResponse = function() {
	ui.api.ProtocolMessage.call(this,ui.api.MsgType.createUserResponse,ui.api.CreateUserResponseData);
};
$hxClasses["ui.api.CreateUserResponse"] = ui.api.CreateUserResponse;
ui.api.CreateUserResponse.__name__ = ["ui","api","CreateUserResponse"];
ui.api.CreateUserResponse.__super__ = ui.api.ProtocolMessage;
ui.api.CreateUserResponse.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	__class__: ui.api.CreateUserResponse
});
ui.api.CreateUserResponseData = function() {
	ui.api.Payload.call(this);
};
$hxClasses["ui.api.CreateUserResponseData"] = ui.api.CreateUserResponseData;
ui.api.CreateUserResponseData.__name__ = ["ui","api","CreateUserResponseData"];
ui.api.CreateUserResponseData.__super__ = ui.api.Payload;
ui.api.CreateUserResponseData.prototype = $extend(ui.api.Payload.prototype,{
	__class__: ui.api.CreateUserResponseData
});
ui.api.UpdateUserRequest = function() {
	ui.api.ProtocolMessage.call(this,ui.api.MsgType.updateUserRequest,ui.api.UpdateUserRequestData);
};
$hxClasses["ui.api.UpdateUserRequest"] = ui.api.UpdateUserRequest;
ui.api.UpdateUserRequest.__name__ = ["ui","api","UpdateUserRequest"];
ui.api.UpdateUserRequest.__super__ = ui.api.ProtocolMessage;
ui.api.UpdateUserRequest.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	__class__: ui.api.UpdateUserRequest
});
ui.api.UpdateUserRequestData = function() {
	ui.api.PayloadWithSessionURI.call(this);
};
$hxClasses["ui.api.UpdateUserRequestData"] = ui.api.UpdateUserRequestData;
ui.api.UpdateUserRequestData.__name__ = ["ui","api","UpdateUserRequestData"];
ui.api.UpdateUserRequestData.__super__ = ui.api.PayloadWithSessionURI;
ui.api.UpdateUserRequestData.prototype = $extend(ui.api.PayloadWithSessionURI.prototype,{
	__class__: ui.api.UpdateUserRequestData
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
ui.api.SessionPingRequest = function() {
	ui.api.ProtocolMessage.call(this,ui.api.MsgType.sessionPing,ui.api.PayloadWithSessionURI);
};
$hxClasses["ui.api.SessionPingRequest"] = ui.api.SessionPingRequest;
ui.api.SessionPingRequest.__name__ = ["ui","api","SessionPingRequest"];
ui.api.SessionPingRequest.__super__ = ui.api.ProtocolMessage;
ui.api.SessionPingRequest.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	__class__: ui.api.SessionPingRequest
});
ui.api.SessionPongResponse = function() {
	ui.api.ProtocolMessage.call(this,ui.api.MsgType.sessionPong,ui.api.PayloadWithSessionURI);
};
$hxClasses["ui.api.SessionPongResponse"] = ui.api.SessionPongResponse;
ui.api.SessionPongResponse.__name__ = ["ui","api","SessionPongResponse"];
ui.api.SessionPongResponse.__super__ = ui.api.ProtocolMessage;
ui.api.SessionPongResponse.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	__class__: ui.api.SessionPongResponse
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
ui.api.EvalSubscribeRequest = function() {
	ui.api.ProtocolMessage.call(this,ui.api.MsgType.evalSubscribeRequest,ui.api.EvalRequestData);
};
$hxClasses["ui.api.EvalSubscribeRequest"] = ui.api.EvalSubscribeRequest;
ui.api.EvalSubscribeRequest.__name__ = ["ui","api","EvalSubscribeRequest"];
ui.api.EvalSubscribeRequest.__super__ = ui.api.ProtocolMessage;
ui.api.EvalSubscribeRequest.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	__class__: ui.api.EvalSubscribeRequest
});
ui.api.EvalRequestData = function() {
	ui.api.PayloadWithSessionURI.call(this);
};
$hxClasses["ui.api.EvalRequestData"] = ui.api.EvalRequestData;
ui.api.EvalRequestData.__name__ = ["ui","api","EvalRequestData"];
ui.api.EvalRequestData.__super__ = ui.api.PayloadWithSessionURI;
ui.api.EvalRequestData.prototype = $extend(ui.api.PayloadWithSessionURI.prototype,{
	__class__: ui.api.EvalRequestData
});
ui.api.EvalNextPageRequest = function() {
	ui.api.ProtocolMessage.call(this,ui.api.MsgType.evalSubscribeRequest,ui.api.EvalNextPageRequestData);
};
$hxClasses["ui.api.EvalNextPageRequest"] = ui.api.EvalNextPageRequest;
ui.api.EvalNextPageRequest.__name__ = ["ui","api","EvalNextPageRequest"];
ui.api.EvalNextPageRequest.__super__ = ui.api.ProtocolMessage;
ui.api.EvalNextPageRequest.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	__class__: ui.api.EvalNextPageRequest
});
ui.api.EvalNextPageRequestData = function() {
	ui.api.PayloadWithSessionURI.call(this);
};
$hxClasses["ui.api.EvalNextPageRequestData"] = ui.api.EvalNextPageRequestData;
ui.api.EvalNextPageRequestData.__name__ = ["ui","api","EvalNextPageRequestData"];
ui.api.EvalNextPageRequestData.__super__ = ui.api.PayloadWithSessionURI;
ui.api.EvalNextPageRequestData.prototype = $extend(ui.api.PayloadWithSessionURI.prototype,{
	__class__: ui.api.EvalNextPageRequestData
});
ui.api.EvalResponse = function() {
	ui.api.ProtocolMessage.call(this,ui.api.MsgType.evalResponse,ui.api.EvalResponseData);
};
$hxClasses["ui.api.EvalResponse"] = ui.api.EvalResponse;
ui.api.EvalResponse.__name__ = ["ui","api","EvalResponse"];
ui.api.EvalResponse.__super__ = ui.api.ProtocolMessage;
ui.api.EvalResponse.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	__class__: ui.api.EvalResponse
});
ui.api.EvalComplete = function() {
	ui.api.ProtocolMessage.call(this,ui.api.MsgType.evalComplete,ui.api.EvalResponseData);
};
$hxClasses["ui.api.EvalComplete"] = ui.api.EvalComplete;
ui.api.EvalComplete.__name__ = ["ui","api","EvalComplete"];
ui.api.EvalComplete.__super__ = ui.api.ProtocolMessage;
ui.api.EvalComplete.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	__class__: ui.api.EvalComplete
});
ui.api.EvalResponseData = function() {
	ui.api.PayloadWithSessionURI.call(this);
};
$hxClasses["ui.api.EvalResponseData"] = ui.api.EvalResponseData;
ui.api.EvalResponseData.__name__ = ["ui","api","EvalResponseData"];
ui.api.EvalResponseData.__super__ = ui.api.PayloadWithSessionURI;
ui.api.EvalResponseData.prototype = $extend(ui.api.PayloadWithSessionURI.prototype,{
	__class__: ui.api.EvalResponseData
});
ui.api.EvalError = function() {
	ui.api.ProtocolMessage.call(this,ui.api.MsgType.evalError,ui.api.EvalErrorData);
};
$hxClasses["ui.api.EvalError"] = ui.api.EvalError;
ui.api.EvalError.__name__ = ["ui","api","EvalError"];
ui.api.EvalError.__super__ = ui.api.ProtocolMessage;
ui.api.EvalError.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	__class__: ui.api.EvalError
});
ui.api.EvalErrorData = function() {
	ui.api.PayloadWithSessionURI.call(this);
};
$hxClasses["ui.api.EvalErrorData"] = ui.api.EvalErrorData;
ui.api.EvalErrorData.__name__ = ["ui","api","EvalErrorData"];
ui.api.EvalErrorData.__super__ = ui.api.PayloadWithSessionURI;
ui.api.EvalErrorData.prototype = $extend(ui.api.PayloadWithSessionURI.prototype,{
	__class__: ui.api.EvalErrorData
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
ui.api.StopEvalRequest = function() {
	ui.api.ProtocolMessage.call(this,ui.api.MsgType.stopEvalRequest,ui.api.PayloadWithSessionURI);
};
$hxClasses["ui.api.StopEvalRequest"] = ui.api.StopEvalRequest;
ui.api.StopEvalRequest.__name__ = ["ui","api","StopEvalRequest"];
ui.api.StopEvalRequest.__super__ = ui.api.ProtocolMessage;
ui.api.StopEvalRequest.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	__class__: ui.api.StopEvalRequest
});
ui.api.StopEvalResponse = function() {
	ui.api.ProtocolMessage.call(this,ui.api.MsgType.stopEvalResponse,ui.api.PayloadWithSessionURI);
};
$hxClasses["ui.api.StopEvalResponse"] = ui.api.StopEvalResponse;
ui.api.StopEvalResponse.__name__ = ["ui","api","StopEvalResponse"];
ui.api.StopEvalResponse.__super__ = ui.api.ProtocolMessage;
ui.api.StopEvalResponse.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	__class__: ui.api.StopEvalResponse
});
ui.api.BaseAgentAliasRequest = function(msgType) {
	ui.api.ProtocolMessage.call(this,msgType,ui.api.AgentAliasesRequestData);
};
$hxClasses["ui.api.BaseAgentAliasRequest"] = ui.api.BaseAgentAliasRequest;
ui.api.BaseAgentAliasRequest.__name__ = ["ui","api","BaseAgentAliasRequest"];
ui.api.BaseAgentAliasRequest.__super__ = ui.api.ProtocolMessage;
ui.api.BaseAgentAliasRequest.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	__class__: ui.api.BaseAgentAliasRequest
});
ui.api.AgentAliasesRequestData = function() {
	ui.api.PayloadWithSessionURI.call(this);
};
$hxClasses["ui.api.AgentAliasesRequestData"] = ui.api.AgentAliasesRequestData;
ui.api.AgentAliasesRequestData.__name__ = ["ui","api","AgentAliasesRequestData"];
ui.api.AgentAliasesRequestData.__super__ = ui.api.PayloadWithSessionURI;
ui.api.AgentAliasesRequestData.prototype = $extend(ui.api.PayloadWithSessionURI.prototype,{
	__class__: ui.api.AgentAliasesRequestData
});
ui.api.AddAgentAliasesResponse = function() {
	ui.api.ProtocolMessage.call(this,ui.api.MsgType.addAgentAliasesResponse,ui.api.PayloadWithSessionURI);
};
$hxClasses["ui.api.AddAgentAliasesResponse"] = ui.api.AddAgentAliasesResponse;
ui.api.AddAgentAliasesResponse.__name__ = ["ui","api","AddAgentAliasesResponse"];
ui.api.AddAgentAliasesResponse.__super__ = ui.api.ProtocolMessage;
ui.api.AddAgentAliasesResponse.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	__class__: ui.api.AddAgentAliasesResponse
});
ui.api.AddAgentAliasesError = function() {
	ui.api.ProtocolMessage.call(this,ui.api.MsgType.addAgentAliasesError,ui.api.ErrorPayload);
};
$hxClasses["ui.api.AddAgentAliasesError"] = ui.api.AddAgentAliasesError;
ui.api.AddAgentAliasesError.__name__ = ["ui","api","AddAgentAliasesError"];
ui.api.AddAgentAliasesError.__super__ = ui.api.ProtocolMessage;
ui.api.AddAgentAliasesError.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	__class__: ui.api.AddAgentAliasesError
});
ui.api.RemoveAgentAliasesResponse = function() {
	ui.api.ProtocolMessage.call(this,ui.api.MsgType.removeAgentAliasesResponse,ui.api.PayloadWithSessionURI);
};
$hxClasses["ui.api.RemoveAgentAliasesResponse"] = ui.api.RemoveAgentAliasesResponse;
ui.api.RemoveAgentAliasesResponse.__name__ = ["ui","api","RemoveAgentAliasesResponse"];
ui.api.RemoveAgentAliasesResponse.__super__ = ui.api.ProtocolMessage;
ui.api.RemoveAgentAliasesResponse.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	__class__: ui.api.RemoveAgentAliasesResponse
});
ui.api.RemoveAgentAliasesError = function() {
	ui.api.ProtocolMessage.call(this,ui.api.MsgType.removeAgentAliasesError,ui.api.ErrorPayload);
};
$hxClasses["ui.api.RemoveAgentAliasesError"] = ui.api.RemoveAgentAliasesError;
ui.api.RemoveAgentAliasesError.__name__ = ["ui","api","RemoveAgentAliasesError"];
ui.api.RemoveAgentAliasesError.__super__ = ui.api.ProtocolMessage;
ui.api.RemoveAgentAliasesError.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	__class__: ui.api.RemoveAgentAliasesError
});
ui.api.SetDefaultAliasResponse = function() {
	ui.api.ProtocolMessage.call(this,ui.api.MsgType.setDefaultAliasResponse,ui.api.PayloadWithSessionURI);
};
$hxClasses["ui.api.SetDefaultAliasResponse"] = ui.api.SetDefaultAliasResponse;
ui.api.SetDefaultAliasResponse.__name__ = ["ui","api","SetDefaultAliasResponse"];
ui.api.SetDefaultAliasResponse.__super__ = ui.api.ProtocolMessage;
ui.api.SetDefaultAliasResponse.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	__class__: ui.api.SetDefaultAliasResponse
});
ui.api.SetDefaultAliasError = function() {
	ui.api.ProtocolMessage.call(this,ui.api.MsgType.setDefaultAliasError,ui.api.ErrorPayload);
};
$hxClasses["ui.api.SetDefaultAliasError"] = ui.api.SetDefaultAliasError;
ui.api.SetDefaultAliasError.__name__ = ["ui","api","SetDefaultAliasError"];
ui.api.SetDefaultAliasError.__super__ = ui.api.ProtocolMessage;
ui.api.SetDefaultAliasError.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	__class__: ui.api.SetDefaultAliasError
});
ui.api.GetAliasConnectionsResponse = function() {
	ui.api.ProtocolMessage.call(this,ui.api.MsgType.getAliasConnectionsResponse,ui.api.AliasConnectionsRequestData);
};
$hxClasses["ui.api.GetAliasConnectionsResponse"] = ui.api.GetAliasConnectionsResponse;
ui.api.GetAliasConnectionsResponse.__name__ = ["ui","api","GetAliasConnectionsResponse"];
ui.api.GetAliasConnectionsResponse.__super__ = ui.api.ProtocolMessage;
ui.api.GetAliasConnectionsResponse.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	__class__: ui.api.GetAliasConnectionsResponse
});
ui.api.AliasConnectionsRequestData = function() {
	ui.api.PayloadWithSessionURI.call(this);
};
$hxClasses["ui.api.AliasConnectionsRequestData"] = ui.api.AliasConnectionsRequestData;
ui.api.AliasConnectionsRequestData.__name__ = ["ui","api","AliasConnectionsRequestData"];
ui.api.AliasConnectionsRequestData.__super__ = ui.api.PayloadWithSessionURI;
ui.api.AliasConnectionsRequestData.prototype = $extend(ui.api.PayloadWithSessionURI.prototype,{
	__class__: ui.api.AliasConnectionsRequestData
});
ui.api.GetAliasLabelsResponse = function() {
	ui.api.ProtocolMessage.call(this,ui.api.MsgType.getAliasLabelsResponse,ui.api.AliasLabelsRequestData);
};
$hxClasses["ui.api.GetAliasLabelsResponse"] = ui.api.GetAliasLabelsResponse;
ui.api.GetAliasLabelsResponse.__name__ = ["ui","api","GetAliasLabelsResponse"];
ui.api.GetAliasLabelsResponse.__super__ = ui.api.ProtocolMessage;
ui.api.GetAliasLabelsResponse.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	__class__: ui.api.GetAliasLabelsResponse
});
ui.api.AliasLabelsRequestData = function() {
	ui.api.PayloadWithSessionURI.call(this);
};
$hxClasses["ui.api.AliasLabelsRequestData"] = ui.api.AliasLabelsRequestData;
ui.api.AliasLabelsRequestData.__name__ = ["ui","api","AliasLabelsRequestData"];
ui.api.AliasLabelsRequestData.__super__ = ui.api.PayloadWithSessionURI;
ui.api.AliasLabelsRequestData.prototype = $extend(ui.api.PayloadWithSessionURI.prototype,{
	__class__: ui.api.AliasLabelsRequestData
});
ui.api.AddAliasLabelsRequest = function() {
	ui.api.ProtocolMessage.call(this,ui.api.MsgType.updateAliasLabelsRequest,ui.api.AddAliasLabelsRequestData);
};
$hxClasses["ui.api.AddAliasLabelsRequest"] = ui.api.AddAliasLabelsRequest;
ui.api.AddAliasLabelsRequest.__name__ = ["ui","api","AddAliasLabelsRequest"];
ui.api.AddAliasLabelsRequest.__super__ = ui.api.ProtocolMessage;
ui.api.AddAliasLabelsRequest.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	__class__: ui.api.AddAliasLabelsRequest
});
ui.api.AddAliasLabelsRequestData = function() {
	ui.api.PayloadWithSessionURI.call(this);
};
$hxClasses["ui.api.AddAliasLabelsRequestData"] = ui.api.AddAliasLabelsRequestData;
ui.api.AddAliasLabelsRequestData.__name__ = ["ui","api","AddAliasLabelsRequestData"];
ui.api.AddAliasLabelsRequestData.__super__ = ui.api.PayloadWithSessionURI;
ui.api.AddAliasLabelsRequestData.prototype = $extend(ui.api.PayloadWithSessionURI.prototype,{
	__class__: ui.api.AddAliasLabelsRequestData
});
ui.api.AddAliasLabelsResponse = function() {
	ui.api.ProtocolMessage.call(this,ui.api.MsgType.updateAliasLabelsResponse,ui.api.PayloadWithSessionURI);
};
$hxClasses["ui.api.AddAliasLabelsResponse"] = ui.api.AddAliasLabelsResponse;
ui.api.AddAliasLabelsResponse.__name__ = ["ui","api","AddAliasLabelsResponse"];
ui.api.AddAliasLabelsResponse.__super__ = ui.api.ProtocolMessage;
ui.api.AddAliasLabelsResponse.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	__class__: ui.api.AddAliasLabelsResponse
});
ui.api.InsertContent = function() {
	ui.api.ProtocolMessage.call(this,ui.api.MsgType.insertContent,ui.api.InsertContentData);
};
$hxClasses["ui.api.InsertContent"] = ui.api.InsertContent;
ui.api.InsertContent.__name__ = ["ui","api","InsertContent"];
ui.api.InsertContent.__super__ = ui.api.ProtocolMessage;
ui.api.InsertContent.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	__class__: ui.api.InsertContent
});
ui.api.InsertContentData = function() {
	ui.api.Payload.call(this);
};
$hxClasses["ui.api.InsertContentData"] = ui.api.InsertContentData;
ui.api.InsertContentData.__name__ = ["ui","api","InsertContentData"];
ui.api.InsertContentData.__super__ = ui.api.Payload;
ui.api.InsertContentData.prototype = $extend(ui.api.Payload.prototype,{
	__class__: ui.api.InsertContentData
});
ui.api.BeginIntroductionRequest = function(alias,from,to,fromMessage,toMessage) {
	ui.api.ProtocolMessage.call(this,ui.api.MsgType.beginIntroductionRequest,ui.api.BeginIntroductionRequestData);
	this.contentImpl.alias = alias;
	this.contentImpl.aBiConnection = new ui.model.BiConnection(to,from);
	this.contentImpl.aMessage = fromMessage;
	this.contentImpl.bBiConnection = new ui.model.BiConnection(from,to);
	this.contentImpl.bMessage = toMessage;
};
$hxClasses["ui.api.BeginIntroductionRequest"] = ui.api.BeginIntroductionRequest;
ui.api.BeginIntroductionRequest.__name__ = ["ui","api","BeginIntroductionRequest"];
ui.api.BeginIntroductionRequest.__super__ = ui.api.ProtocolMessage;
ui.api.BeginIntroductionRequest.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	__class__: ui.api.BeginIntroductionRequest
});
ui.api.BeginIntroductionRequestData = function() {
	ui.api.PayloadWithSessionURI.call(this);
};
$hxClasses["ui.api.BeginIntroductionRequestData"] = ui.api.BeginIntroductionRequestData;
ui.api.BeginIntroductionRequestData.__name__ = ["ui","api","BeginIntroductionRequestData"];
ui.api.BeginIntroductionRequestData.__super__ = ui.api.PayloadWithSessionURI;
ui.api.BeginIntroductionRequestData.prototype = $extend(ui.api.PayloadWithSessionURI.prototype,{
	__class__: ui.api.BeginIntroductionRequestData
});
ui.api.MsgType = $hxClasses["ui.api.MsgType"] = { __ename__ : ["ui","api","MsgType"], __constructs__ : ["initializeSessionRequest","initializeSessionResponse","initializeSessionError","sessionPing","sessionPong","closeSessionRequest","closeSessionResponse","evalSubscribeRequest","evalResponse","evalComplete","evalError","stopEvalRequest","stopEvalResponse","createUserRequest","createUserError","createUserWaiting","confirmEmailToken","createUserResponse","updateUserRequest","updateUserResponse","insertContent","feedExpr","addAgentAliasesRequest","addAgentAliasesError","addAgentAliasesResponse","removeAgentAliasesRequest","removeAgentAliasesError","removeAgentAliasesResponse","setDefaultAliasRequest","setDefaultAliasError","setDefaultAliasResponse","getAliasConnectionsRequest","getAliasConnectionsResponse","getAliasConnectionsError","getAliasLabelsRequest","getAliasLabelsResponse","getAliasLabelsError","addAliasLabelsRequest","addAliasLabelsResponse","updateAliasLabelsRequest","updateAliasLabelsResponse","beginIntroductionRequest"] }
ui.api.MsgType.initializeSessionRequest = ["initializeSessionRequest",0];
ui.api.MsgType.initializeSessionRequest.toString = $estr;
ui.api.MsgType.initializeSessionRequest.__enum__ = ui.api.MsgType;
ui.api.MsgType.initializeSessionResponse = ["initializeSessionResponse",1];
ui.api.MsgType.initializeSessionResponse.toString = $estr;
ui.api.MsgType.initializeSessionResponse.__enum__ = ui.api.MsgType;
ui.api.MsgType.initializeSessionError = ["initializeSessionError",2];
ui.api.MsgType.initializeSessionError.toString = $estr;
ui.api.MsgType.initializeSessionError.__enum__ = ui.api.MsgType;
ui.api.MsgType.sessionPing = ["sessionPing",3];
ui.api.MsgType.sessionPing.toString = $estr;
ui.api.MsgType.sessionPing.__enum__ = ui.api.MsgType;
ui.api.MsgType.sessionPong = ["sessionPong",4];
ui.api.MsgType.sessionPong.toString = $estr;
ui.api.MsgType.sessionPong.__enum__ = ui.api.MsgType;
ui.api.MsgType.closeSessionRequest = ["closeSessionRequest",5];
ui.api.MsgType.closeSessionRequest.toString = $estr;
ui.api.MsgType.closeSessionRequest.__enum__ = ui.api.MsgType;
ui.api.MsgType.closeSessionResponse = ["closeSessionResponse",6];
ui.api.MsgType.closeSessionResponse.toString = $estr;
ui.api.MsgType.closeSessionResponse.__enum__ = ui.api.MsgType;
ui.api.MsgType.evalSubscribeRequest = ["evalSubscribeRequest",7];
ui.api.MsgType.evalSubscribeRequest.toString = $estr;
ui.api.MsgType.evalSubscribeRequest.__enum__ = ui.api.MsgType;
ui.api.MsgType.evalResponse = ["evalResponse",8];
ui.api.MsgType.evalResponse.toString = $estr;
ui.api.MsgType.evalResponse.__enum__ = ui.api.MsgType;
ui.api.MsgType.evalComplete = ["evalComplete",9];
ui.api.MsgType.evalComplete.toString = $estr;
ui.api.MsgType.evalComplete.__enum__ = ui.api.MsgType;
ui.api.MsgType.evalError = ["evalError",10];
ui.api.MsgType.evalError.toString = $estr;
ui.api.MsgType.evalError.__enum__ = ui.api.MsgType;
ui.api.MsgType.stopEvalRequest = ["stopEvalRequest",11];
ui.api.MsgType.stopEvalRequest.toString = $estr;
ui.api.MsgType.stopEvalRequest.__enum__ = ui.api.MsgType;
ui.api.MsgType.stopEvalResponse = ["stopEvalResponse",12];
ui.api.MsgType.stopEvalResponse.toString = $estr;
ui.api.MsgType.stopEvalResponse.__enum__ = ui.api.MsgType;
ui.api.MsgType.createUserRequest = ["createUserRequest",13];
ui.api.MsgType.createUserRequest.toString = $estr;
ui.api.MsgType.createUserRequest.__enum__ = ui.api.MsgType;
ui.api.MsgType.createUserError = ["createUserError",14];
ui.api.MsgType.createUserError.toString = $estr;
ui.api.MsgType.createUserError.__enum__ = ui.api.MsgType;
ui.api.MsgType.createUserWaiting = ["createUserWaiting",15];
ui.api.MsgType.createUserWaiting.toString = $estr;
ui.api.MsgType.createUserWaiting.__enum__ = ui.api.MsgType;
ui.api.MsgType.confirmEmailToken = ["confirmEmailToken",16];
ui.api.MsgType.confirmEmailToken.toString = $estr;
ui.api.MsgType.confirmEmailToken.__enum__ = ui.api.MsgType;
ui.api.MsgType.createUserResponse = ["createUserResponse",17];
ui.api.MsgType.createUserResponse.toString = $estr;
ui.api.MsgType.createUserResponse.__enum__ = ui.api.MsgType;
ui.api.MsgType.updateUserRequest = ["updateUserRequest",18];
ui.api.MsgType.updateUserRequest.toString = $estr;
ui.api.MsgType.updateUserRequest.__enum__ = ui.api.MsgType;
ui.api.MsgType.updateUserResponse = ["updateUserResponse",19];
ui.api.MsgType.updateUserResponse.toString = $estr;
ui.api.MsgType.updateUserResponse.__enum__ = ui.api.MsgType;
ui.api.MsgType.insertContent = ["insertContent",20];
ui.api.MsgType.insertContent.toString = $estr;
ui.api.MsgType.insertContent.__enum__ = ui.api.MsgType;
ui.api.MsgType.feedExpr = ["feedExpr",21];
ui.api.MsgType.feedExpr.toString = $estr;
ui.api.MsgType.feedExpr.__enum__ = ui.api.MsgType;
ui.api.MsgType.addAgentAliasesRequest = ["addAgentAliasesRequest",22];
ui.api.MsgType.addAgentAliasesRequest.toString = $estr;
ui.api.MsgType.addAgentAliasesRequest.__enum__ = ui.api.MsgType;
ui.api.MsgType.addAgentAliasesError = ["addAgentAliasesError",23];
ui.api.MsgType.addAgentAliasesError.toString = $estr;
ui.api.MsgType.addAgentAliasesError.__enum__ = ui.api.MsgType;
ui.api.MsgType.addAgentAliasesResponse = ["addAgentAliasesResponse",24];
ui.api.MsgType.addAgentAliasesResponse.toString = $estr;
ui.api.MsgType.addAgentAliasesResponse.__enum__ = ui.api.MsgType;
ui.api.MsgType.removeAgentAliasesRequest = ["removeAgentAliasesRequest",25];
ui.api.MsgType.removeAgentAliasesRequest.toString = $estr;
ui.api.MsgType.removeAgentAliasesRequest.__enum__ = ui.api.MsgType;
ui.api.MsgType.removeAgentAliasesError = ["removeAgentAliasesError",26];
ui.api.MsgType.removeAgentAliasesError.toString = $estr;
ui.api.MsgType.removeAgentAliasesError.__enum__ = ui.api.MsgType;
ui.api.MsgType.removeAgentAliasesResponse = ["removeAgentAliasesResponse",27];
ui.api.MsgType.removeAgentAliasesResponse.toString = $estr;
ui.api.MsgType.removeAgentAliasesResponse.__enum__ = ui.api.MsgType;
ui.api.MsgType.setDefaultAliasRequest = ["setDefaultAliasRequest",28];
ui.api.MsgType.setDefaultAliasRequest.toString = $estr;
ui.api.MsgType.setDefaultAliasRequest.__enum__ = ui.api.MsgType;
ui.api.MsgType.setDefaultAliasError = ["setDefaultAliasError",29];
ui.api.MsgType.setDefaultAliasError.toString = $estr;
ui.api.MsgType.setDefaultAliasError.__enum__ = ui.api.MsgType;
ui.api.MsgType.setDefaultAliasResponse = ["setDefaultAliasResponse",30];
ui.api.MsgType.setDefaultAliasResponse.toString = $estr;
ui.api.MsgType.setDefaultAliasResponse.__enum__ = ui.api.MsgType;
ui.api.MsgType.getAliasConnectionsRequest = ["getAliasConnectionsRequest",31];
ui.api.MsgType.getAliasConnectionsRequest.toString = $estr;
ui.api.MsgType.getAliasConnectionsRequest.__enum__ = ui.api.MsgType;
ui.api.MsgType.getAliasConnectionsResponse = ["getAliasConnectionsResponse",32];
ui.api.MsgType.getAliasConnectionsResponse.toString = $estr;
ui.api.MsgType.getAliasConnectionsResponse.__enum__ = ui.api.MsgType;
ui.api.MsgType.getAliasConnectionsError = ["getAliasConnectionsError",33];
ui.api.MsgType.getAliasConnectionsError.toString = $estr;
ui.api.MsgType.getAliasConnectionsError.__enum__ = ui.api.MsgType;
ui.api.MsgType.getAliasLabelsRequest = ["getAliasLabelsRequest",34];
ui.api.MsgType.getAliasLabelsRequest.toString = $estr;
ui.api.MsgType.getAliasLabelsRequest.__enum__ = ui.api.MsgType;
ui.api.MsgType.getAliasLabelsResponse = ["getAliasLabelsResponse",35];
ui.api.MsgType.getAliasLabelsResponse.toString = $estr;
ui.api.MsgType.getAliasLabelsResponse.__enum__ = ui.api.MsgType;
ui.api.MsgType.getAliasLabelsError = ["getAliasLabelsError",36];
ui.api.MsgType.getAliasLabelsError.toString = $estr;
ui.api.MsgType.getAliasLabelsError.__enum__ = ui.api.MsgType;
ui.api.MsgType.addAliasLabelsRequest = ["addAliasLabelsRequest",37];
ui.api.MsgType.addAliasLabelsRequest.toString = $estr;
ui.api.MsgType.addAliasLabelsRequest.__enum__ = ui.api.MsgType;
ui.api.MsgType.addAliasLabelsResponse = ["addAliasLabelsResponse",38];
ui.api.MsgType.addAliasLabelsResponse.toString = $estr;
ui.api.MsgType.addAliasLabelsResponse.__enum__ = ui.api.MsgType;
ui.api.MsgType.updateAliasLabelsRequest = ["updateAliasLabelsRequest",39];
ui.api.MsgType.updateAliasLabelsRequest.toString = $estr;
ui.api.MsgType.updateAliasLabelsRequest.__enum__ = ui.api.MsgType;
ui.api.MsgType.updateAliasLabelsResponse = ["updateAliasLabelsResponse",40];
ui.api.MsgType.updateAliasLabelsResponse.toString = $estr;
ui.api.MsgType.updateAliasLabelsResponse.__enum__ = ui.api.MsgType;
ui.api.MsgType.beginIntroductionRequest = ["beginIntroductionRequest",41];
ui.api.MsgType.beginIntroductionRequest.toString = $estr;
ui.api.MsgType.beginIntroductionRequest.__enum__ = ui.api.MsgType;
ui.api.Reason = $hxClasses["ui.api.Reason"] = { __ename__ : ["ui","api","Reason"], __constructs__ : [] }
ui.api.Requester = function() { }
$hxClasses["ui.api.Requester"] = ui.api.Requester;
ui.api.Requester.__name__ = ["ui","api","Requester"];
ui.api.Requester.prototype = {
	__class__: ui.api.Requester
}
ui.api.StandardRequest = function(request,successFcn) {
	this.request = request;
	this.successFcn = successFcn;
};
$hxClasses["ui.api.StandardRequest"] = ui.api.StandardRequest;
ui.api.StandardRequest.__name__ = ["ui","api","StandardRequest"];
ui.api.StandardRequest.__interfaces__ = [ui.api.Requester];
ui.api.StandardRequest.prototype = {
	abort: function() {
	}
	,start: function(opts) {
		ui.AgentUi.LOGGER.debug("send " + Std.string(this.request.msgType));
		var ajaxOpts = { async : true, url : ui.AgentUi.URL + "/api", dataType : "json", contentType : "application/json", data : ui.AgentUi.SERIALIZER.toJsonString(this.request), type : "POST", success : this.successFcn, error : function(jqXHR,textStatus,errorThrown) {
			js.Lib.alert("There was an error making your request.\n" + jqXHR.message);
			throw new m3.exception.Exception("Error executing ajax call | Response Code: " + jqXHR.status + " | " + jqXHR.message);
		}};
		if(opts != null) $.extend(ajaxOpts,opts);
		$.ajax(ajaxOpts);
	}
	,__class__: ui.api.StandardRequest
}
ui.api.LongPollingRequest = function(requestToRepeat,successFcn) {
	this.stop = false;
	var _g = this;
	this.request = requestToRepeat;
	this.requestJson = ui.AgentUi.SERIALIZER.toJsonString(this.request);
	this.successFcn = successFcn;
	ui.AgentUi.HOT_KEY_ACTIONS.push(function(evt) {
		if(evt.altKey && evt.shiftKey && evt.keyCode == 80) {
			_g.stop = !_g.stop;
			ui.AgentUi.LOGGER.debug("Long Polling is paused? " + Std.string(_g.stop));
			if(!_g.stop) _g.poll();
		}
	});
};
$hxClasses["ui.api.LongPollingRequest"] = ui.api.LongPollingRequest;
ui.api.LongPollingRequest.__name__ = ["ui","api","LongPollingRequest"];
ui.api.LongPollingRequest.__interfaces__ = [ui.api.Requester];
ui.api.LongPollingRequest.prototype = {
	poll: function() {
		var _g = this;
		if(!this.stop) {
			var ajaxOpts = { url : ui.AgentUi.URL + "/api", dataType : "json", contentType : "application/json", data : this.requestJson, type : "POST", success : function(data,textStatus,jqXHR) {
				if(!_g.stop) _g.successFcn(data,textStatus,jqXHR);
			}, error : function(jqXHR,textStatus,errorThrown) {
				ui.AgentUi.LOGGER.error("Error executing ajax call | Response Code: " + jqXHR.status + " | " + jqXHR.message);
			}, complete : function(jqXHR,textStatus) {
				_g.poll();
			}, timeout : 30000};
			this.jqXHR = $.ajax(ajaxOpts);
		}
	}
	,abort: function() {
		this.stop = true;
		if(this.jqXHR != null) try {
			this.jqXHR.abort();
			this.jqXHR = null;
		} catch( err ) {
			ui.AgentUi.LOGGER.error("error on poll abort | " + Std.string(err));
		}
	}
	,start: function(opts) {
		this.poll();
	}
	,__class__: ui.api.LongPollingRequest
}
ui.api.TestDao = function() { }
$hxClasses["ui.api.TestDao"] = ui.api.TestDao;
ui.api.TestDao.__name__ = ["ui","api","TestDao"];
ui.api.TestDao.buildConnections = function() {
	ui.api.TestDao.connections = new Array();
	var george = new ui.model.Connection("George","Costanza","media/test/george.jpg");
	george.uid = m3.util.UidGenerator.create();
	ui.api.TestDao.connections.push(george);
	var elaine = new ui.model.Connection("Elaine","Benes","media/test/elaine.jpg");
	elaine.uid = m3.util.UidGenerator.create();
	ui.api.TestDao.connections.push(elaine);
	var kramer = new ui.model.Connection("Cosmo","Kramer","media/test/kramer.jpg");
	kramer.uid = m3.util.UidGenerator.create();
	ui.api.TestDao.connections.push(kramer);
	var toms = new ui.model.Connection("Tom's","Restaurant","media/test/toms.jpg");
	toms.uid = m3.util.UidGenerator.create();
	ui.api.TestDao.connections.push(toms);
	var newman = new ui.model.Connection("Newman","","media/test/newman.jpg");
	newman.uid = m3.util.UidGenerator.create();
	ui.api.TestDao.connections.push(newman);
}
ui.api.TestDao.buildLabels = function() {
	ui.api.TestDao.labels = new Array();
	var locations = new ui.model.Label("Locations");
	locations.uid = m3.util.UidGenerator.create();
	ui.api.TestDao.labels.push(locations);
	var home = new ui.model.Label("Home");
	home.uid = m3.util.UidGenerator.create();
	home.parentUid = locations.uid;
	ui.api.TestDao.labels.push(home);
	var city = new ui.model.Label("City");
	city.uid = m3.util.UidGenerator.create();
	city.parentUid = locations.uid;
	ui.api.TestDao.labels.push(city);
	var media = new ui.model.Label("Media");
	media.uid = m3.util.UidGenerator.create();
	ui.api.TestDao.labels.push(media);
	var personal = new ui.model.Label("Personal");
	personal.uid = m3.util.UidGenerator.create();
	personal.parentUid = media.uid;
	ui.api.TestDao.labels.push(personal);
	var work = new ui.model.Label("Work");
	work.uid = m3.util.UidGenerator.create();
	work.parentUid = media.uid;
	ui.api.TestDao.labels.push(work);
	var interests = new ui.model.Label("Interests");
	interests.uid = m3.util.UidGenerator.create();
	ui.api.TestDao.labels.push(interests);
}
ui.api.TestDao.buildAliases = function() {
	ui.api.TestDao.aliases = new Array();
	var alias = new ui.model.Alias();
	alias.uid = m3.util.UidGenerator.create();
	alias.label = "Comedian";
	alias.imgSrc = "media/test/jerry_comedy.jpg";
	ui.api.TestDao.aliases.push(alias);
	alias = new ui.model.Alias();
	alias.uid = m3.util.UidGenerator.create();
	alias.label = "Actor";
	alias.imgSrc = "media/test/jerry_bee.jpg";
	ui.api.TestDao.aliases.push(alias);
	alias = new ui.model.Alias();
	alias.uid = m3.util.UidGenerator.create();
	alias.label = "Private";
	alias.imgSrc = "media/default_avatar.jpg";
	ui.api.TestDao.aliases.push(alias);
}
ui.api.TestDao.addOne = function(available,arr) {
	arr.add(ui.api.TestDao.getRandomFromArray(available).uid);
}
ui.api.TestDao.addTwo = function(available,arr) {
	if(available.length == 1) arr.add(ui.api.TestDao.getRandomFromArray(available).uid); else {
		arr.add(ui.api.TestDao.getRandomFromArray(available).uid);
		arr.add(ui.api.TestDao.getRandomFromArray(available).uid);
	}
}
ui.api.TestDao.addAll = function(available,arr) {
	var _g1 = 0, _g = available.length;
	while(_g1 < _g) {
		var t_ = _g1++;
		arr.add(available[t_].uid);
	}
}
ui.api.TestDao.getRandomFromArray = function(arr) {
	var t = null;
	if(m3.helper.ArrayHelper.hasValues(arr)) t = arr[Std.random(arr.length)];
	return t;
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
ui.api.TestDao.getUser = function(uid) {
	if(!ui.api.TestDao.initialized) ui.api.TestDao.initialize();
	var user = new ui.model.User();
	user.sessionURI = "agent-session://ArtVandelay@session1";
	user.userData = new ui.model.UserData();
	user.userData.name = "Jerry Seinfeld";
	user.uid = m3.util.UidGenerator.create();
	user.userData.imgSrc = "media/test/jerry_default.jpg";
	user.aliasSet = new m3.observable.ObservableSet(ui.model.ModelObj.identifier);
	user.aliasSet.visualId = "TestAlias";
	user.aliasSet.addAll(ui.api.TestDao.aliases);
	var alias = ui.api.TestDao.aliases[0];
	alias.connectionSet = new m3.observable.ObservableSet(ui.model.ModelObj.identifier,ui.api.TestDao.connections);
	alias.connectionSet.visualId = "TestAliasConnections";
	alias.labelSet = new m3.observable.ObservableSet(ui.model.ModelObj.identifier,ui.api.TestDao.labels);
	alias.labelSet.visualId = "TestAliasLabels";
	user.set_currentAlias(alias);
	return user;
}
ui.api.TestDao.getAlias = function(uid) {
	if(!ui.api.TestDao.initialized) ui.api.TestDao.initialize();
	var alias = m3.helper.ArrayHelper.getElementComplex(ui.api.TestDao.aliases,uid,"uid");
	alias.connectionSet = new m3.observable.ObservableSet(ui.model.ModelObj.identifier,ui.api.TestDao.connections);
	alias.connectionSet.visualId = "TestAliasConnections";
	alias.labelSet = new m3.observable.ObservableSet(ui.model.ModelObj.identifier,ui.api.TestDao.labels);
	alias.labelSet.visualId = "TestAliasLabels";
	return alias;
}
ui.exception = {}
ui.exception.InitializeSessionException = function(error,message,cause) {
	m3.exception.Exception.call(this,message,cause);
	this.initSessErr = error;
};
$hxClasses["ui.exception.InitializeSessionException"] = ui.exception.InitializeSessionException;
ui.exception.InitializeSessionException.__name__ = ["ui","exception","InitializeSessionException"];
ui.exception.InitializeSessionException.__super__ = m3.exception.Exception;
ui.exception.InitializeSessionException.prototype = $extend(m3.exception.Exception.prototype,{
	__class__: ui.exception.InitializeSessionException
});
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
	conn.uid = alias.uid;
	conn.imgSrc = alias.imgSrc;
	conn.fname = alias.label;
	return conn;
}
ui.helper.PrologHelper = function() { }
$hxClasses["ui.helper.PrologHelper"] = ui.helper.PrologHelper;
ui.helper.PrologHelper.__name__ = ["ui","helper","PrologHelper"];
ui.helper.PrologHelper.tagTreeAsStrings = function(labels) {
	var sarray = new Array();
	var topLevelLabels = new m3.observable.FilteredSet(labels,function(l) {
		return m3.helper.StringHelper.isBlank(l.parentUid);
	});
	Lambda.iter(topLevelLabels,function(l1) {
		var s = "";
		var children = new m3.observable.FilteredSet(labels,function(f) {
			return f.parentUid == l1.uid;
		});
		if(m3.helper.OSetHelper.hasValues(children)) s += "n" + l1.text + "(" + ui.helper.PrologHelper._processTagChildren(labels,children) + ")"; else s += "l" + l1.text + "(_)";
		sarray.push(s);
	});
	return sarray;
}
ui.helper.PrologHelper._processTagChildren = function(original,set) {
	var str = Lambda.fold(set,function(l,s) {
		if(m3.helper.StringHelper.isNotBlank(s)) s += ",";
		var children = new m3.observable.FilteredSet(original,function(f) {
			return f.parentUid == l.uid;
		});
		if(m3.helper.OSetHelper.hasValues(children)) {
			s += "n" + l.text + "(";
			s += ui.helper.PrologHelper._processTagChildren(original,children);
			s += ")";
		} else s += "l" + l.text + "(_)";
		return s;
	},"");
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
	var term = parser.nextTerm();
	if(term == "(") term = parser.nextTerm();
	while(term != null && term != ")") {
		if(StringTools.startsWith(term,"n")) {
			term = term.substring(1);
			var l = new ui.model.Label(term);
			l.uid = m3.util.UidGenerator.create(10);
			if(parentLabel != null) l.parentUid = parentLabel.uid;
			larray.push(l);
			var children = ui.helper.PrologHelper._processDataLogChildren(l,parser);
			larray = larray.concat(children);
		} else if(m3.helper.StringHelper.isNotBlank(term) && StringTools.startsWith(term,"l")) {
			term = term.substring(1);
			var l = new ui.model.Label(term);
			l.uid = m3.util.UidGenerator.create(10);
			if(parentLabel != null) l.parentUid = parentLabel.uid;
			larray.push(l);
			parser.nextTerm();
			parser.nextTerm();
			parser.nextTerm();
		}
		term = parser.nextTerm();
	}
	return larray;
}
ui.helper.PrologHelper.labelsToProlog = function(contentTags) {
	var sarray = [];
	Lambda.iter(contentTags,function(label) {
		var path = [];
		var traveler = label;
		while(traveler != null) {
			path.push(traveler.text);
			traveler = m3.helper.OSetHelper.getElement(ui.AgentUi.USER.get_currentAlias().labelSet,traveler.parentUid);
		}
		sarray.push("[" + path.join(",") + "]");
	});
	return (sarray.length > 1?"each(":"") + sarray.join(",") + (sarray.length > 1?")":"");
}
ui.helper.PrologHelper.connectionsToProlog = function(connections) {
	var sarray = [];
	Lambda.iter(connections,function(c) {
		var s = "";
		sarray.push(ui.AgentUi.SERIALIZER.toJsonString(c));
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
	ui.AgentUi.LOGGER.debug("EVENTMODEL: Change to " + Std.string(id));
	var map = ui.model.EM.hash.get(id);
	if(map == null) {
		ui.AgentUi.LOGGER.warn("No listeners for event " + Std.string(id));
		return;
	}
	var iter = map.iterator();
	while(iter.hasNext()) {
		var listener = iter.next();
		ui.AgentUi.LOGGER.debug("Notifying " + listener.get_name() + " of " + Std.string(id) + " event");
		listener.change(t);
		if(HxOverrides.remove(ui.model.EM.oneTimers,listener.get_uid())) map.remove(listener.get_uid());
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
ui.model.EMEvent = $hxClasses["ui.model.EMEvent"] = { __ename__ : ["ui","model","EMEvent"], __constructs__ : ["FILTER_RUN","FILTER_CHANGE","MoreContent","NextContent","EndOfContent","NewContentCreated","LoadAlias","AliasLoaded","AliasConnectionsLoaded","AliasLabelsLoaded","AliasCreate","USER_LOGIN","USER_CREATE","USER_UPDATE","USER_SIGNUP","USER_VALIDATE","USER_VALIDATED","USER","FitWindow","CreateLabel","INTRODUCTION_REQUEST","INTRODUCTION_RESPONSE"] }
ui.model.EMEvent.FILTER_RUN = ["FILTER_RUN",0];
ui.model.EMEvent.FILTER_RUN.toString = $estr;
ui.model.EMEvent.FILTER_RUN.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.FILTER_CHANGE = ["FILTER_CHANGE",1];
ui.model.EMEvent.FILTER_CHANGE.toString = $estr;
ui.model.EMEvent.FILTER_CHANGE.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.MoreContent = ["MoreContent",2];
ui.model.EMEvent.MoreContent.toString = $estr;
ui.model.EMEvent.MoreContent.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.NextContent = ["NextContent",3];
ui.model.EMEvent.NextContent.toString = $estr;
ui.model.EMEvent.NextContent.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.EndOfContent = ["EndOfContent",4];
ui.model.EMEvent.EndOfContent.toString = $estr;
ui.model.EMEvent.EndOfContent.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.NewContentCreated = ["NewContentCreated",5];
ui.model.EMEvent.NewContentCreated.toString = $estr;
ui.model.EMEvent.NewContentCreated.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.LoadAlias = ["LoadAlias",6];
ui.model.EMEvent.LoadAlias.toString = $estr;
ui.model.EMEvent.LoadAlias.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.AliasLoaded = ["AliasLoaded",7];
ui.model.EMEvent.AliasLoaded.toString = $estr;
ui.model.EMEvent.AliasLoaded.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.AliasConnectionsLoaded = ["AliasConnectionsLoaded",8];
ui.model.EMEvent.AliasConnectionsLoaded.toString = $estr;
ui.model.EMEvent.AliasConnectionsLoaded.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.AliasLabelsLoaded = ["AliasLabelsLoaded",9];
ui.model.EMEvent.AliasLabelsLoaded.toString = $estr;
ui.model.EMEvent.AliasLabelsLoaded.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.AliasCreate = ["AliasCreate",10];
ui.model.EMEvent.AliasCreate.toString = $estr;
ui.model.EMEvent.AliasCreate.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.USER_LOGIN = ["USER_LOGIN",11];
ui.model.EMEvent.USER_LOGIN.toString = $estr;
ui.model.EMEvent.USER_LOGIN.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.USER_CREATE = ["USER_CREATE",12];
ui.model.EMEvent.USER_CREATE.toString = $estr;
ui.model.EMEvent.USER_CREATE.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.USER_UPDATE = ["USER_UPDATE",13];
ui.model.EMEvent.USER_UPDATE.toString = $estr;
ui.model.EMEvent.USER_UPDATE.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.USER_SIGNUP = ["USER_SIGNUP",14];
ui.model.EMEvent.USER_SIGNUP.toString = $estr;
ui.model.EMEvent.USER_SIGNUP.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.USER_VALIDATE = ["USER_VALIDATE",15];
ui.model.EMEvent.USER_VALIDATE.toString = $estr;
ui.model.EMEvent.USER_VALIDATE.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.USER_VALIDATED = ["USER_VALIDATED",16];
ui.model.EMEvent.USER_VALIDATED.toString = $estr;
ui.model.EMEvent.USER_VALIDATED.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.USER = ["USER",17];
ui.model.EMEvent.USER.toString = $estr;
ui.model.EMEvent.USER.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.FitWindow = ["FitWindow",18];
ui.model.EMEvent.FitWindow.toString = $estr;
ui.model.EMEvent.FitWindow.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.CreateLabel = ["CreateLabel",19];
ui.model.EMEvent.CreateLabel.toString = $estr;
ui.model.EMEvent.CreateLabel.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.INTRODUCTION_REQUEST = ["INTRODUCTION_REQUEST",20];
ui.model.EMEvent.INTRODUCTION_REQUEST.toString = $estr;
ui.model.EMEvent.INTRODUCTION_REQUEST.__enum__ = ui.model.EMEvent;
ui.model.EMEvent.INTRODUCTION_RESPONSE = ["INTRODUCTION_RESPONSE",21];
ui.model.EMEvent.INTRODUCTION_RESPONSE.toString = $estr;
ui.model.EMEvent.INTRODUCTION_RESPONSE.__enum__ = ui.model.EMEvent;
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
			if(nodes.length > 1) str += "(";
			var iteration = 0;
			var _g1 = 0, _g = nodes.length;
			while(_g1 < _g) {
				var ln_ = _g1++;
				if(iteration++ > 0) str += ",";
				str += nodes[ln_].getProlog();
				if(nodes[ln_].hasChildren()) str += this._prologify(nodes[ln_].nodes);
			}
			if(nodes.length > 1) str += ")";
		}
		return str;
	}
	,labelsProlog: function() {
		return this.rootNode.getProlog() + this._prologify(this.labelNodes);
	}
	,toProlog: function() {
		var queries = [this._prologify(this.labelNodes),this._prologify(this.connectionNodes)];
		var query = m3.helper.ArrayHelper.joinX(queries,",");
		return query;
	}
	,__class__: ui.model.Filter
}
ui.model.ModelObj = function() { }
$hxClasses["ui.model.ModelObj"] = ui.model.ModelObj;
ui.model.ModelObj.__name__ = ["ui","model","ModelObj"];
ui.model.ModelObj.identifier = function(t) {
	return t.uid;
}
ui.model.ModelObj.prototype = {
	__class__: ui.model.ModelObj
}
ui.model.Login = function() {
};
$hxClasses["ui.model.Login"] = ui.model.Login;
ui.model.Login.__name__ = ["ui","model","Login"];
ui.model.Login.__super__ = ui.model.ModelObj;
ui.model.Login.prototype = $extend(ui.model.ModelObj.prototype,{
	getUri: function() {
		return (function($this) {
			var $r;
			throw new m3.exception.Exception("don't call me!");
			return $r;
		}(this));
	}
	,__class__: ui.model.Login
});
ui.model.LoginByUn = function() {
	ui.model.Login.call(this);
};
$hxClasses["ui.model.LoginByUn"] = ui.model.LoginByUn;
ui.model.LoginByUn.__name__ = ["ui","model","LoginByUn"];
ui.model.LoginByUn.__super__ = ui.model.Login;
ui.model.LoginByUn.prototype = $extend(ui.model.Login.prototype,{
	getUri: function() {
		return "agent://email/" + this.email + "?password=" + this.password;
	}
	,__class__: ui.model.LoginByUn
});
ui.model.LoginById = function() {
	ui.model.Login.call(this);
};
$hxClasses["ui.model.LoginById"] = ui.model.LoginById;
ui.model.LoginById.__name__ = ["ui","model","LoginById"];
ui.model.LoginById.__super__ = ui.model.Login;
ui.model.LoginById.prototype = $extend(ui.model.Login.prototype,{
	getUri: function() {
		return this.uuid + "?password=" + this.password;
	}
	,__class__: ui.model.LoginById
});
ui.model.NewUser = function() {
};
$hxClasses["ui.model.NewUser"] = ui.model.NewUser;
ui.model.NewUser.__name__ = ["ui","model","NewUser"];
ui.model.NewUser.__super__ = ui.model.ModelObj;
ui.model.NewUser.prototype = $extend(ui.model.ModelObj.prototype,{
	__class__: ui.model.NewUser
});
ui.model.User = function() {
};
$hxClasses["ui.model.User"] = ui.model.User;
ui.model.User.__name__ = ["ui","model","User"];
ui.model.User.__super__ = ui.model.ModelObj;
ui.model.User.prototype = $extend(ui.model.ModelObj.prototype,{
	getSelfConnection: function() {
		var conn = new ui.model.Connection();
		conn.src = this.sessionURI;
		conn.tgt = this.sessionURI;
		conn.label = this.get_currentAlias().label;
		return conn;
	}
	,writeResolve: function() {
		this.aliases = this.aliasSet.asArray();
	}
	,readResolve: function() {
		this.aliasSet = new m3.observable.ObservableSet(ui.model.ModelObj.identifier,this.aliases);
	}
	,hasValidSession: function() {
		ui.AgentUi.LOGGER.warn("implement User.hasValidSession");
		return true;
	}
	,set_currentAlias: function(alias) {
		this.currentAlias = alias;
		return this.get_currentAlias();
	}
	,get_currentAlias: function() {
		if(this.currentAlias == null && this.aliasSet != null) this.set_currentAlias(this.aliasSet.iterator().next()); else if(this.currentAlias == null) {
			this.set_currentAlias(new ui.model.Alias());
			ui.AgentUi.LOGGER.warn("No aliases found for user.");
		}
		return this.currentAlias;
	}
	,__class__: ui.model.User
});
ui.model.UserData = function() {
};
$hxClasses["ui.model.UserData"] = ui.model.UserData;
ui.model.UserData.__name__ = ["ui","model","UserData"];
ui.model.UserData.__super__ = ui.model.ModelObj;
ui.model.UserData.prototype = $extend(ui.model.ModelObj.prototype,{
	__class__: ui.model.UserData
});
ui.model.Alias = function() {
	this.loadedFromDb = false;
};
$hxClasses["ui.model.Alias"] = ui.model.Alias;
ui.model.Alias.__name__ = ["ui","model","Alias"];
ui.model.Alias.__super__ = ui.model.ModelObj;
ui.model.Alias.prototype = $extend(ui.model.ModelObj.prototype,{
	writeResolve: function() {
		this.labels = this.labelSet.asArray();
		this.connections = this.connectionSet.asArray();
	}
	,readResolve: function() {
		this.labelSet = new m3.observable.ObservableSet(ui.model.ModelObj.identifier,this.labels);
		this.connectionSet = new m3.observable.ObservableSet(ui.model.ModelObj.identifier,this.connections);
	}
	,__class__: ui.model.Alias
});
ui.model.Filterable = function() { }
$hxClasses["ui.model.Filterable"] = ui.model.Filterable;
ui.model.Filterable.__name__ = ["ui","model","Filterable"];
ui.model.Label = function(text) {
	this.text = text;
	this.color = m3.util.ColorProvider.getNextColor();
};
$hxClasses["ui.model.Label"] = ui.model.Label;
ui.model.Label.__name__ = ["ui","model","Label"];
ui.model.Label.__interfaces__ = [ui.model.Filterable];
ui.model.Label.__super__ = ui.model.ModelObj;
ui.model.Label.prototype = $extend(ui.model.ModelObj.prototype,{
	__class__: ui.model.Label
});
ui.model.Connection = function(fname,lname,imgSrc) {
	this.fname = fname;
	this.lname = lname;
	this.imgSrc = imgSrc;
};
$hxClasses["ui.model.Connection"] = ui.model.Connection;
ui.model.Connection.__name__ = ["ui","model","Connection"];
ui.model.Connection.__interfaces__ = [ui.model.Filterable];
ui.model.Connection.__super__ = ui.model.ModelObj;
ui.model.Connection.prototype = $extend(ui.model.ModelObj.prototype,{
	name: function() {
		return this.fname + " " + this.lname;
	}
	,__class__: ui.model.Connection
});
ui.model.BiConnection = function(readConnection,writeConnection) {
	this.readConnection = readConnection;
	this.writeConnection = writeConnection;
};
$hxClasses["ui.model.BiConnection"] = ui.model.BiConnection;
ui.model.BiConnection.__name__ = ["ui","model","BiConnection"];
ui.model.BiConnection.__interfaces__ = [ui.model.Filterable];
ui.model.BiConnection.__super__ = ui.model.ModelObj;
ui.model.BiConnection.prototype = $extend(ui.model.ModelObj.prototype,{
	__class__: ui.model.BiConnection
});
ui.model.Content = function() { }
$hxClasses["ui.model.Content"] = ui.model.Content;
ui.model.Content.__name__ = ["ui","model","Content"];
ui.model.Content.__super__ = ui.model.ModelObj;
ui.model.Content.prototype = $extend(ui.model.ModelObj.prototype,{
	writeResolve: function() {
	}
	,readResolve: function() {
	}
	,__class__: ui.model.Content
});
ui.model.ImageContent = function() {
};
$hxClasses["ui.model.ImageContent"] = ui.model.ImageContent;
ui.model.ImageContent.__name__ = ["ui","model","ImageContent"];
ui.model.ImageContent.__super__ = ui.model.Content;
ui.model.ImageContent.prototype = $extend(ui.model.Content.prototype,{
	__class__: ui.model.ImageContent
});
ui.model.AudioContent = function() {
};
$hxClasses["ui.model.AudioContent"] = ui.model.AudioContent;
ui.model.AudioContent.__name__ = ["ui","model","AudioContent"];
ui.model.AudioContent.__super__ = ui.model.Content;
ui.model.AudioContent.prototype = $extend(ui.model.Content.prototype,{
	__class__: ui.model.AudioContent
});
ui.model.MessageContent = function() {
};
$hxClasses["ui.model.MessageContent"] = ui.model.MessageContent;
ui.model.MessageContent.__name__ = ["ui","model","MessageContent"];
ui.model.MessageContent.__super__ = ui.model.Content;
ui.model.MessageContent.prototype = $extend(ui.model.Content.prototype,{
	__class__: ui.model.MessageContent
});
ui.model.UrlContent = function() {
	ui.model.MessageContent.call(this);
};
$hxClasses["ui.model.UrlContent"] = ui.model.UrlContent;
ui.model.UrlContent.__name__ = ["ui","model","UrlContent"];
ui.model.UrlContent.__super__ = ui.model.MessageContent;
ui.model.UrlContent.prototype = $extend(ui.model.MessageContent.prototype,{
	__class__: ui.model.UrlContent
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
		return ui.helper.PrologHelper.labelsToProlog(new m3.observable.ObservableSet(ui.model.ModelObj.identifier,[this.content]));
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
		return ui.helper.PrologHelper.connectionsToProlog(new m3.observable.ObservableSet(ui.model.ModelObj.identifier,[this.content]));
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
ui.widget.ConnectionCompHelper = function() { }
$hxClasses["ui.widget.ConnectionCompHelper"] = ui.widget.ConnectionCompHelper;
ui.widget.ConnectionCompHelper.__name__ = ["ui","widget","ConnectionCompHelper"];
ui.widget.ConnectionCompHelper.connection = function(c) {
	return c.connectionComp("option","connection");
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
ui.widget.DialogManager.showSignupConfirmation = function() {
	ui.widget.DialogManager.showDialog("signupConfirmationDialog");
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
ui.widget.ConnectionListHelper = function() { }
$hxClasses["ui.widget.ConnectionListHelper"] = ui.widget.ConnectionListHelper;
ui.widget.ConnectionListHelper.__name__ = ["ui","widget","ConnectionListHelper"];
ui.widget.ConnectionListHelper.filterConnections = function(c,term) {
	c.connectionsList("filterConnections",term);
}
ui.widget.LabelCompHelper = function() { }
$hxClasses["ui.widget.LabelCompHelper"] = ui.widget.LabelCompHelper;
ui.widget.LabelCompHelper.__name__ = ["ui","widget","LabelCompHelper"];
ui.widget.LabelCompHelper.getLabel = function(l) {
	return l.labelComp("option","label");
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
	return { options : { menuOptions : null, width : 200}, _create : function() {
		var self = this;
		var selfElement = this.element;
		selfElement.addClass("m3menu nonmodalPopup");
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
		this._super("create");
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
		new $("<div>" + self.options.message.text + "</div>").appendTo(selfElement);
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
			return (js.Boot.__cast(fc , $)).attr("id");
		});
		self._filterables.listen(function(fc,evt) {
			if(evt.isAdd()) self._add(fc); else if(evt.isUpdate()) {
			} else if(evt.isDelete()) self._remove(fc);
		});
		selfElement.addClass("ui-state-highlight connectionDT labelDT filterable dropCombiner filterCombination filterTrashable container shadow" + m3.widget.Widgets.getWidgetClasses());
		selfElement.position({ my : "bottom right", at : "left top", of : self.options.event, collision : "flipfit", within : "#filter"});
		selfElement.data("clone",function(filterableComp,isDragByHelper,containment) {
			if(containment == null) containment = false;
			if(isDragByHelper == null) isDragByHelper = false;
			var fc = js.Boot.__cast(filterableComp , $);
			return fc;
		});
		var toggle = new $("<div class='andOrToggle'></div>").andOrToggle();
		selfElement.append(toggle);
		(js.Boot.__cast(selfElement , $)).draggable({ containment : "parent", distance : 10, scroll : false});
		(js.Boot.__cast(selfElement , $)).droppable({ accept : function(d) {
			return self.options.type == "LABEL" && d["is"](".label") || self.options.type == "CONNECTION" && d["is"](".connectionAvatar");
		}, activeClass : "ui-state-hover", hoverClass : "ui-state-active", greedy : true, drop : function(event,_ui) {
			var clone = (_ui.draggable.data("clone"))(_ui.draggable,false,"#filter");
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
	}, _add : function(filterable) {
		var self = this;
		var selfElement = this.element;
		var jq = js.Boot.__cast(filterable , $);
		jq.appendTo(selfElement).css("position","absolute").css({ left : "", top : ""});
		self._layout();
	}, _remove : function(filterable) {
		var self = this;
		var selfElement = this.element;
		var iter = self._filterables.iterator();
		if(iter.hasNext()) {
			var filterable1 = iter.next();
			if(iter.hasNext()) self._layout(); else {
				var jq = js.Boot.__cast(filterable1 , $);
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
	return { options : { connection : null, isDragByHelper : true, containment : false, dndEnabled : true, classes : null, cloneFcn : function(filterableComp,isDragByHelper,containment) {
		if(containment == null) containment = false;
		if(isDragByHelper == null) isDragByHelper = false;
		var connectionAvatar = js.Boot.__cast(filterableComp , $);
		if(connectionAvatar.hasClass("clone")) return connectionAvatar;
		var clone = new $("<div class='clone'></div>");
		clone.connectionAvatar({ connection : connectionAvatar.connectionAvatar("option","connection"), isDragByHelper : isDragByHelper, containment : containment, classes : connectionAvatar.connectionAvatar("option","classes"), cloneFcn : connectionAvatar.connectionAvatar("option","cloneFcn"), dropTargetClass : connectionAvatar.connectionAvatar("option","dropTargetClass"), helperFcn : connectionAvatar.connectionAvatar("option","helperFcn")});
		return clone;
	}, dropTargetClass : "connectionDT", helperFcn : function() {
		var clone = $(this).clone();
		return clone.children("img").addClass("connectionDraggingImg");
	}}, _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of ConnectionAvatar must be a div element");
		selfElement.attr("id","connavatar_" + StringTools.htmlEscape(self.options.connection.lname + self.options.connection.fname));
		selfElement.addClass(m3.widget.Widgets.getWidgetClasses() + " connectionAvatar filterable").attr("title",self.options.connection.name());
		var img = new $("<img src='" + self.options.connection.imgSrc + "' class='shadow'/>");
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
				filterCombiner.filterCombination({ event : event, type : "CONNECTION"});
				filterCombiner.filterCombination("addFilterable",$(this));
				var clone = (_ui.draggable.data("clone"))(_ui.draggable,false,"#filter");
				clone.addClass("filterTrashable " + Std.string(_ui.draggable.data("dropTargetClass")));
				filterCombiner.filterCombination("addFilterable",clone);
				filterCombiner.filterCombination("position");
			}, tolerance : "pointer"});
		}
	}, update : function() {
		var self = this;
		var selfElement = this.element;
		selfElement.children("img").attr("src",self.options.connection.imgSrc);
		selfElement.children("div").text(self.options.connection.name());
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
		selfElement.append(self._avatar);
		selfElement.append("<div class='name'>" + self.options.connection.name() + "</div>");
		(js.Boot.__cast(selfElement , $)).droppable({ accept : function(d) {
			return d["is"](".connectionAvatar");
		}, activeClass : "ui-state-hover", hoverClass : "ui-state-active", greedy : true, drop : function(event,_ui) {
			var dropper = ui.widget.ConnectionAvatarHelper.getConnection(js.Boot.__cast(_ui.draggable , $));
			var droppee = self.options.connection;
			if(dropper.uid != droppee.uid) ui.widget.DialogManager.requestIntroduction(dropper,droppee);
		}, tolerance : "pointer"});
	}, update : function() {
		var self = this;
		var selfElement = this.element;
		selfElement.children("img").attr("src",self.options.connection.imgSrc);
		selfElement.children("div").text(self.options.connection.name());
		self._avatar.connectionAvatar("update");
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
			self._setConnections(alias.connectionSet);
		},"ConnectionsList-Alias"));
	}, _setConnections : function(connections) {
		var self = this;
		var selfElement = this.element;
		selfElement.children(".connection").remove();
		var spacer = selfElement.children("#sideRightSpacer");
		self.connectionsMap = new m3.observable.MappedSet(connections,function(conn) {
			return new $("<div></div>").connectionComp({ connection : conn});
		});
		self.connectionsMap.listen(function(connComp,evt) {
			if(evt.isAdd()) spacer.before(connComp); else if(evt.isUpdate()) connComp.connectionComp("update"); else if(evt.isDelete()) connComp.remove();
		});
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
	return { options : { label : null, isDragByHelper : true, containment : false, dndEnabled : true, classes : null, dropTargetClass : "labelDT", cloneFcn : function(filterableComp,isDragByHelper,containment) {
		if(containment == null) containment = false;
		if(isDragByHelper == null) isDragByHelper = false;
		var labelComp = js.Boot.__cast(filterableComp , $);
		if(labelComp.hasClass("clone")) return labelComp;
		var clone = new $("<div class='clone'></div>");
		clone.labelComp({ label : labelComp.labelComp("option","label"), isDragByHelper : isDragByHelper, containment : containment, classes : labelComp.labelComp("option","classes"), cloneFcn : labelComp.labelComp("option","cloneFcn"), dropTargetClass : labelComp.labelComp("option","dropTargetClass")});
		return clone;
	}}, _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of LabelComp must be a div element");
		selfElement.addClass("label labelComp ").attr("id",StringTools.htmlEscape(self.options.label.text) + "_" + m3.util.UidGenerator.create(8));
		var labelTail = new $("<div class='labelTail'></div>");
		labelTail.css("border-right-color",self.options.label.color);
		selfElement.append(labelTail);
		var labelBox = new $("<div class='labelBox shadowRight'></div>");
		labelBox.css("background",self.options.label.color);
		var labelBody = new $("<div class='labelBody'></div>");
		var labelText = new $("<div>" + self.options.label.text + "</div>");
		labelBody.append(labelText);
		labelBox.append(labelBody);
		selfElement.append(labelBox).append("<div class='clear'></div>");
		selfElement.addClass("filterable");
		if(self.options.dndEnabled) {
			selfElement.data("clone",self.options.cloneFcn);
			selfElement.data("dropTargetClass",self.options.dropTargetClass);
			selfElement.data("getNode",function() {
				var node = new ui.model.LabelNode();
				node.type = "LABEL";
				node.content = self.options.label;
				return node;
			});
			var helper = "clone";
			if(!self.options.isDragByHelper) helper = "original"; else if(self.options.helperFcn != null && Reflect.isFunction(self.options.helperFcn)) helper = self.options.helperFcn;
			(js.Boot.__cast(selfElement , $)).draggable({ containment : self.options.containment, helper : helper, distance : 10, scroll : false, revertDuration : 200, start : function(evt,_ui) {
				(js.Boot.__cast(selfElement , $)).draggable("option","revert",false);
			}});
			(js.Boot.__cast(selfElement , $)).droppable({ accept : function(d) {
				return !$(this).parent()["is"](".filterCombination") && $(this).parent()["is"](".dropCombiner") && d["is"](".label");
			}, activeClass : "ui-state-hover", hoverClass : "ui-state-active", greedy : true, drop : function(event,_ui) {
				var filterCombiner = new $("<div></div>");
				filterCombiner.appendTo($(this).parent());
				filterCombiner.filterCombination({ event : event, type : "LABEL"});
				filterCombiner.filterCombination("addFilterable",$(this));
				var clone = (_ui.draggable.data("clone"))(_ui.draggable,false,"#filter");
				clone.addClass("filterTrashable " + Std.string(_ui.draggable.data("dropTargetClass")));
				filterCombiner.filterCombination("addFilterable",clone);
				filterCombiner.filterCombination("position");
			}, tolerance : "pointer"});
		}
	}, update : function() {
		var self = this;
		var selfElement = this.element;
		selfElement.find(".labelBody").text(self.options.label.text);
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.labelComp",defineWidget());
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of ContentComp must be a div element");
		selfElement.addClass("post container shadow " + m3.widget.Widgets.getWidgetClasses());
		var postWr = new $("<section class='postWr'></section>");
		selfElement.append(postWr);
		var postContentWr = new $("<div class='postContentWr'></div>");
		postWr.append(postContentWr);
		var postContent = new $("<div class='postContent'></div>");
		postContentWr.append(postContent);
		switch( (self.options.content.type)[1] ) {
		case 0:
			var audio = js.Boot.__cast(self.options.content , ui.model.AudioContent);
			postContent.append(audio.title + "<br/>");
			var audioControls = new $("<audio controls></audio>");
			postContent.append(audioControls);
			audioControls.append("<source src='" + audio.audioSrc + "' type='" + audio.audioType + "'>Your browser does not support the audio element.");
			break;
		case 1:
			var img = js.Boot.__cast(self.options.content , ui.model.ImageContent);
			postContent.append("<img alt='" + img.caption + "' src='" + img.imgSrc + "'/>");
			break;
		case 2:
			var urlContent = js.Boot.__cast(self.options.content , ui.model.UrlContent);
			postContent.append("<img alt='preview' src='http://api.thumbalizr.com/?api_key=2e63db21c89b06a54fd2eac5fd96e488&url=" + urlContent.url + "'/>");
			break;
		case 3:
			var textContent = js.Boot.__cast(self.options.content , ui.model.MessageContent);
			postContent.append("<p>" + textContent.text + "</p>");
			break;
		}
		var postCreator = new $("<aside class='postCreator'></aside>").appendTo(postWr);
		var connection = m3.helper.OSetHelper.getElementComplex(ui.AgentUi.USER.get_currentAlias().connectionSet,self.options.content.creator);
		if(connection == null) connection = ui.helper.ModelHelper.asConnection(ui.AgentUi.USER.get_currentAlias());
		new $("<div></div>").connectionAvatar({ dndEnabled : false, connection : connection}).appendTo(postCreator);
		var postLabels = new $("<aside class='postLabels'></div>");
		postWr.append(postLabels);
		var labelIter = self.options.content.labelSet.iterator();
		while(labelIter.hasNext()) {
			var label = labelIter.next();
			new $("<div class='small'></div>").labelComp({ dndEnabled : false, label : label}).appendTo(postLabels);
		}
		var postConnections = new $("<aside class='postConnections'></aside>").appendTo(postWr);
		var connIter = self.options.content.connectionSet.iterator();
		while(connIter.hasNext()) {
			var connection1 = connIter.next();
			new $("<div></div>").connectionAvatar({ dndEnabled : false, connection : connection1}).appendTo(postConnections);
		}
	}, destroy : function() {
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
		self.content = new m3.observable.MappedSet(self.options.content,function(content) {
			return new $("<div></div>").contentComp({ content : content});
		});
		self.content.listen(function(contentComp,evt) {
			if(evt.isAdd()) new $("#postInput").after(contentComp); else if(evt.isUpdate()) contentComp.contentComp("update"); else if(evt.isDelete()) contentComp.remove();
		});
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.contentFeed",defineWidget());
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
		filter.filterComp("fireFilter");
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
			var clone = (_ui.draggable.data("clone"))(_ui.draggable,false,"#filter");
			clone.addClass("filterTrashable " + Std.string(_ui.draggable.data("dropTargetClass")));
			var cloneOffset = clone.offset();
			$(this).append(clone);
			clone.css({ position : "absolute"});
			var isInFilterCombination = _ui.draggable.parent(".filterCombination").length > 0;
			if(isInFilterCombination) {
				var filterCombination = js.Boot.__cast(_ui.draggable.parent() , $);
				filterCombination.filterCombination("removeFilterable",_ui.draggable);
			}
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
		(js.Boot.__cast((js.Boot.__cast(trashDiv , $)).droppable({ accept : function(d) {
			return d["is"](".filterTrashable");
		}, activeClass : "ui-state-hover", hoverClass : "ui-state-active", greedy : true, drop : function(event,_ui) {
			_ui.draggable.remove();
			shrink();
			self.fireFilter();
		}, tolerance : "touch", over : function(event,_ui) {
			grow(300);
		}, out : function(event,_ui) {
			shrink();
		}}) , $)).tooltip().dblclick(function(event) {
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
		var liveToggle = js.Boot.__cast(selfElement.children(".liveBuildToggle") , $);
		var root = (selfElement.children(".rootToggle").data("getNode"))();
		root.type = "ROOT";
		var filterables = selfElement.children(".filterable");
		filterables.each(function(idx,el) {
			var filterable = new $(el);
			var node = (filterable.data("getNode"))();
			root.addNode(node);
		});
		if(!js.Boot.__cast(liveToggle.liveBuildToggle("isLive") , Bool)) ui.model.EM.change(ui.model.EMEvent.FILTER_CHANGE,new ui.model.Filter(root)); else ui.model.EM.change(ui.model.EMEvent.FILTER_RUN,new ui.model.Filter(root));
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
	return { options : { label : null, children : null, classes : null}, _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of LabelTreeBranch must be a div element");
		selfElement.addClass("labelTreeBranch ");
		var expander = new $("<div class='labelTreeExpander' style='visibility:hidden;'>+</div>");
		selfElement.append(expander);
		var label = new $("<div></div>").labelComp({ label : self.options.label, isDragByHelper : true, containment : false});
		selfElement.append(label);
		selfElement.hover(function() {
			if(self.options.children.iterator().hasNext()) expander.css("visibility","visible");
		},function() {
			expander.css("visibility","hidden");
		});
		if(self.options.children != null) {
			var labelChildren = new $("<div class='labelChildren' style='display: none;'></div>");
			labelChildren.labelTree({ labels : self.options.children});
			selfElement.append(labelChildren);
			label.add(expander).click(function(evt) {
				labelChildren.toggle();
				ui.model.EM.change(ui.model.EMEvent.FitWindow);
			});
		}
	}, update : function() {
		var self = this;
		var selfElement = this.element;
		selfElement.find(".labelBody").text(self.options.label.text);
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.labelTreeBranch",defineWidget());
var defineWidget = function() {
	return { options : { labels : null, itemsClass : null}, _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of LabelTree must be a div element");
		selfElement.addClass("labelTree boxsizingBorder " + m3.widget.Widgets.getWidgetClasses());
		self.mappedLabels = new m3.observable.MappedSet(self.options.labels,function(label) {
			var children = new m3.observable.FilteredSet(ui.AgentUi.USER.get_currentAlias().labelSet,function(child) {
				return child.parentUid == label.uid;
			});
			children.visualId = "filteredLabelTree--" + label.text;
			return new $("<div></div>").labelTreeBranch({ label : label, children : children});
		});
		self.mappedLabels.visualId = self.options.labels.getVisualId() + "_map";
		ui.AgentUi.LOGGER.debug("Listen to " + self.mappedLabels.visualId);
		self.mappedLabels.listen(function(labelTreeBranch,evt) {
			ui.AgentUi.LOGGER.debug(self.mappedLabels.visualId + " | LabelTree | " + evt.name() + " | New Branch");
			if(evt.isAdd()) selfElement.append(labelTreeBranch); else if(evt.isUpdate()) labelTreeBranch.labelTreeBranch("update"); else if(evt.isDelete()) labelTreeBranch.remove();
		});
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.labelTree",defineWidget());
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
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of LabelsList must be a div element");
		selfElement.addClass("icontainer labelsList " + m3.widget.Widgets.getWidgetClasses());
		ui.model.EM.addListener(ui.model.EMEvent.AliasLoaded,new ui.model.EMListener(function(alias) {
			self._setLabels(alias.labelSet);
		},"LabelsList-Alias"));
		var newLabelButton = new $("<button class='newLabelButton'>New Label</button>");
		selfElement.append(newLabelButton).append("<div class='clear'></div>");
		newLabelButton.button().click(function(evt) {
			evt.stopPropagation();
			var popup = new $("<div style='position: absolute;width:300px;'></div>");
			popup.appendTo(selfElement);
			popup = popup.popup({ createFcn : function(el) {
				var createLabel = null;
				var stopFcn = function(evt1) {
					evt1.stopPropagation();
				};
				var enterFcn = function(evt1) {
					if(evt1.keyCode == 13) createLabel();
				};
				var container = new $("<div class='icontainer'></div>").appendTo(el);
				container.click(stopFcn).keypress(enterFcn);
				container.append("<label for='labelParent'>Parent: </label> ");
				var parent = new $("<select id='labelParent' class='ui-corner-left ui-widget-content' style='width: 191px;'><option value=''>No Parent</option></select>").appendTo(container);
				parent.click(stopFcn);
				var iter = ui.AgentUi.USER.get_currentAlias().labelSet.iterator();
				while(iter.hasNext()) {
					var label = iter.next();
					parent.append("<option value='" + label.uid + "'>" + label.text + "</option>");
				}
				container.append("<br/><label for='labelName'>Name: </label> ");
				var input = new $("<input id='labelName' class='ui-corner-all ui-widget-content' value='New Label'/>").appendTo(container);
				input.keypress(enterFcn).click(function(evt1) {
					evt1.stopPropagation();
					if($(this).val() == "New Label") $(this).val("");
				}).focus();
				container.append("<br/>");
				new $("<button class='fright ui-helper-clearfix' style='font-size: .8em;'>Add Label</button>").button().appendTo(container).click(function(evt1) {
					createLabel();
				});
				createLabel = function() {
					ui.AgentUi.LOGGER.info("Create new label | " + input.val());
					var label = new ui.model.Label();
					label.parentUid = parent.val();
					label.text = input.val();
					var alnum = new EReg("(^[a-zA-Z0-9]*$)","");
					if(!alnum.match(label.text)) js.Lib.alert("Only alphanumeric labels allowed."); else {
						label.uid = m3.util.UidGenerator.create();
						ui.AgentUi.LOGGER.debug("add to " + self.labels.visualId);
						ui.model.EM.change(ui.model.EMEvent.CreateLabel,label);
						new $("body").click();
					}
				};
			}, positionalElement : newLabelButton});
		});
	}, _setLabels : function(labels) {
		var self = this;
		var selfElement = this.element;
		self.labels = labels;
		selfElement.children(".labelTree").remove();
		var filteredSet = new m3.observable.FilteredSet(labels,function(label) {
			return m3.helper.StringHelper.isBlank(label.parentUid);
		});
		filteredSet.visualId = labels.visualId + "_filter";
		var labelTree = new $("<div id='labels' class='labelDT'></div>").labelTree({ labels : filteredSet});
		selfElement.prepend(labelTree);
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.labelsList",defineWidget());
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of LoginDialog must be a div element");
		self._newUser = false;
		selfElement.addClass("loginDialog").hide();
		var labels = new $("<div class='fleft'></div>").appendTo(selfElement);
		var inputs = new $("<div class='fleft'></div>").appendTo(selfElement);
		if(m3.helper.StringHelper.isBlank(ui.AgentUi.agentURI)) labels.append("<div class='labelDiv'><label id='un_label' for='login_un'>Email</label></div>");
		labels.append("<div class='labelDiv'><label for='login_pw'>Password</label></div>");
		if(m3.helper.StringHelper.isBlank(ui.AgentUi.agentURI)) {
			self.input_un = new $("<input id='login_un' style='display: none;' class='ui-corner-all ui-state-active ui-widget-content'>").appendTo(inputs);
			self.placeholder_un = new $("<input id='login_un_f' class='placeholder ui-corner-all ui-widget-content' value='Please enter Username'>").appendTo(inputs);
			inputs.append("<br/>");
		}
		self.input_pw = new $("<input type='password' id='login_pw' style='display: none;' class='ui-corner-all ui-state-active ui-widget-content'/>").appendTo(inputs);
		self.placeholder_pw = new $("<input id='login_pw_f' class='placeholder ui-corner-all ui-widget-content' value='Please enter Password'/>").appendTo(inputs);
		if(ui.AgentUi.DEMO) {
			self.input_un.val("George.Costanza");
			self.input_pw.val("Bosco");
		}
		inputs.children("input").keypress(function(evt) {
			if(evt.keyCode == 13) self._login();
		});
		if(m3.helper.StringHelper.isBlank(ui.AgentUi.agentURI)) {
			self.placeholder_un.focus(function(evt) {
				self.placeholder_un.hide();
				self.input_un.show().focus();
			});
			self.input_un.blur(function(evt) {
				if(m3.helper.StringHelper.isBlank(self.input_un.val())) {
					self.placeholder_un.show();
					self.input_un.hide();
				}
			});
		}
		self.placeholder_pw.focus(function(evt) {
			self.placeholder_pw.hide();
			self.input_pw.show().focus();
		});
		self.input_pw.blur(function(evt) {
			if(m3.helper.StringHelper.isBlank(self.input_pw.val())) {
				self.placeholder_pw.show();
				self.input_pw.hide();
			}
		});
		ui.model.EM.addListener(ui.model.EMEvent.USER,new ui.model.EMListener(function(user) {
			self._setUser(user);
			if(user == null) self.open(); else selfElement.dialog("close");
		},"Login-User"));
		ui.model.EM.addListener(ui.model.EMEvent.USER_SIGNUP,new ui.model.EMListener(function(user) {
			selfElement.dialog("close");
		},"Login-UserSignup"));
	}, initialized : false, _login : function() {
		var self = this;
		var selfElement = this.element;
		var valid = true;
		var login;
		if(m3.helper.StringHelper.isNotBlank(ui.AgentUi.agentURI)) {
			login = new ui.model.LoginById();
			(js.Boot.__cast(login , ui.model.LoginById)).uuid = ui.AgentUi.agentURI;
		} else {
			login = new ui.model.LoginByUn();
			var l = js.Boot.__cast(login , ui.model.LoginByUn);
			l.email = self.input_un.val();
			if(m3.helper.StringHelper.isBlank(l.email) && m3.helper.StringHelper.isBlank(ui.AgentUi.agentURI)) {
				self.placeholder_un.addClass("ui-state-error");
				valid = false;
			}
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
		var dlgOptions = { autoOpen : false, title : "Login", height : 280, width : 400, buttons : { Login : function() {
			self1._login();
		}, 'I\'m New' : function() {
			self1._newUser = true;
			$(this).dialog("close");
			ui.widget.DialogManager.showNewUser();
		}, Validate : function() {
			self1._newUser = true;
			$(this).dialog("close");
			ui.widget.DialogManager.showSignupConfirmation();
		}}, beforeClose : function(evt,ui1) {
			if(!self1._newUser && (self1.user == null || !self1.user.hasValidSession())) {
				js.Lib.alert("A valid user is required to use the app");
				return false;
			}
			return true;
		}};
		selfElement.dialog(dlgOptions);
	}, _setUser : function(user) {
		var self = this;
		self.user = user;
	}, open : function() {
		var self = this;
		var selfElement = this.element;
		self._newUser = false;
		if(!self.initialized) self._buildDialog();
		selfElement.children("#un_label").focus();
		if(m3.helper.StringHelper.isBlank(ui.AgentUi.agentURI)) self.input_un.blur();
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
			var id = "chat-" + connection.uid;
			var li = new $("<li><a href='#" + id + "'><img src='" + connection.imgSrc + "'></a></li>").appendTo(ul);
			var chatComp = new $("<div id='" + id + "'></div>").chatComp({ connection : connection, messages : new m3.observable.ObservableSet(ui.model.ModelObj.identifier)});
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
		self.input_n = new $("<input id='newu_n' class='ui-corner-all ui-state-active ui-widget-content'>").appendTo(inputs);
		inputs.append("<br/>");
		inputs.children("input").keypress(function(evt) {
			if(evt.keyCode == 13) self._createNewAlias();
		});
		ui.model.EM.addListener(ui.model.EMEvent.USER,new ui.model.EMListener(function(user) {
			self._setUser(user);
		},"NewAliasDialog-User"));
	}, initialized : false, _createNewAlias : function() {
		var self = this;
		var selfElement = this.element;
		var valid = true;
		var alias = new ui.model.Alias();
		alias.label = self.input_n.val();
		if(m3.helper.StringHelper.isBlank(alias.label)) valid = false;
		if(!valid) return;
		selfElement.find(".ui-state-error").removeClass("ui-state-error");
		ui.model.EM.change(ui.model.EMEvent.AliasCreate,alias);
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
	}, _setUser : function(user) {
		var self = this;
		self.user = user;
	}, open : function() {
		var self = this;
		var selfElement = this.element;
		if(!self.initialized) self._buildDialog();
		selfElement.dialog("open");
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.newAliasDialog",defineWidget());
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of NewUserDialog must be a div element");
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
		self.placeholder_n.focus(function(evt) {
			self.placeholder_n.hide();
			self.input_n.show().focus();
		});
		self.input_n.blur(function(evt) {
			if(m3.helper.StringHelper.isBlank(self.input_n.val())) {
				self.placeholder_n.show();
				self.input_n.hide();
			}
		});
		self.placeholder_pw.focus(function(evt) {
			self.placeholder_pw.hide();
			self.input_pw.show().focus();
		});
		self.input_pw.blur(function(evt) {
			if(m3.helper.StringHelper.isBlank(self.input_pw.val())) {
				self.placeholder_pw.show();
				self.input_pw.hide();
			}
		});
		self.placeholder_em.focus(function(evt) {
			self.placeholder_em.hide();
			self.input_em.show().focus();
		});
		self.input_em.blur(function(evt) {
			if(m3.helper.StringHelper.isBlank(self.input_em.val())) {
				self.placeholder_em.show();
				self.input_em.hide();
			}
		});
		ui.model.EM.addListener(ui.model.EMEvent.USER,new ui.model.EMListener(function(user) {
			self._setUser(user);
		},"NewUserDialog-User"));
	}, initialized : false, _createNewUser : function() {
		var self = this;
		var selfElement1 = this.element;
		var valid = true;
		var newUser = new ui.model.NewUser();
		newUser.pwd = self.input_pw.val();
		if(m3.helper.StringHelper.isBlank(newUser.pwd)) {
			self.placeholder_pw.addClass("ui-state-error");
			valid = false;
		}
		newUser.email = self.input_em.val();
		if(m3.helper.StringHelper.isBlank(newUser.email)) {
			self.placeholder_em.addClass("ui-state-error");
			valid = false;
		}
		newUser.name = self.input_n.val();
		if(m3.helper.StringHelper.isBlank(newUser.name)) {
			self.placeholder_n.addClass("ui-state-error");
			valid = false;
		}
		if(!valid) return;
		selfElement1.find(".ui-state-error").removeClass("ui-state-error");
		ui.model.EM.change(ui.model.EMEvent.USER_CREATE,newUser);
		ui.model.EM.addListener(ui.model.EMEvent.USER_SIGNUP,new ui.model.EMListener(function(n) {
			selfElement1.dialog("close");
		},"NewUserDialog-UserSignup"));
	}, _buildDialog : function() {
		var self1 = this;
		var selfElement2 = this.element;
		self1.initialized = true;
		var dlgOptions = { autoOpen : false, title : "Create New Agent", height : 320, width : 400, buttons : { 'Create my Agent' : function() {
			self1._registered = true;
			self1._createNewUser();
		}, Cancel : function() {
			self1._cancelled = true;
			$(this).dialog("close");
		}}, close : function(evt,ui1) {
			selfElement2.find(".placeholder").removeClass("ui-state-error");
			if(self1._cancelled || !self1._registered && (self1.user == null || !self1.user.hasValidSession())) ui.widget.DialogManager.showLogin();
		}};
		selfElement2.dialog(dlgOptions);
	}, _setUser : function(user) {
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
		ui.AgentUi.LOGGER.debug("post " + self.urlInput.val());
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}, valEle : function() {
		var self = this;
		return self.urlInput;
	}};
};
$.widget("ui.urlComp",defineWidget());
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of UploadComp must be a div element");
		selfElement.addClass("uploadComp container " + m3.widget.Widgets.getWidgetClasses());
		self._createFileUploadComponent();
		selfElement.on("dragleave",function(evt,d) {
			ui.AgentUi.LOGGER.debug("dragleave");
			var target = evt.target;
			if(target != null && target == selfElement[0]) $(this).removeClass("drop");
			evt.preventDefault();
			evt.stopPropagation();
		});
		selfElement.on("dragenter",function(evt,d) {
			ui.AgentUi.LOGGER.debug("dragenter");
			$(this).addClass("over");
			evt.preventDefault();
			evt.stopPropagation();
		});
		selfElement.on("dragover",function(evt,d) {
			ui.AgentUi.LOGGER.debug("dragover");
			evt.preventDefault();
			evt.stopPropagation();
		});
		selfElement.on("drop",function(evt,d) {
			ui.AgentUi.LOGGER.debug("drop");
			self._traverseFiles(evt.originalEvent.dataTransfer.files);
			$(this).removeClass("drop");
			evt.preventDefault();
			evt.stopPropagation();
		});
	}, _createFileUploadComponent : function() {
		var self1 = this;
		var selfElement = this.element;
		new $("#files-upload").remove();
		var filesUpload = new $("<input id='files-upload' type='file'/>").prependTo(selfElement);
		filesUpload.change(function(evt) {
			self1._traverseFiles(this.files);
		});
	}, _uploadFile : function(file) {
		if(typeof FileReader === 'undefined') {
			js.Lib.alert("FileUpload is not supported by your browser");
			return;
		}
		if(!new EReg("image","i").match(file.type)) {
			js.Lib.alert("Please select an image file.");
			return;
		}
		var self2 = this;
		var selfElement = this.element;
		ui.AgentUi.LOGGER.debug("upload " + Std.string(file.name));
		if(self2.previewImg == null) self2.previewImg = new $("<img id='file_about_to_be_uploaded'/>").appendTo(selfElement);
		var reader = new FileReader();
		reader.onload = function(evt) {
			self2.previewImg.attr("src",evt.target.result);
		};
		reader.readAsDataURL(file);
	}, _traverseFiles : function(files) {
		ui.AgentUi.LOGGER.debug("traverse the files");
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
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of PostComp must be a div element");
		selfElement.addClass("postComp container shadow " + m3.widget.Widgets.getWidgetClasses());
		var section = new $("<section id='postSection'></section>").appendTo(selfElement);
		var addConnectionsAndLabels = null;
		var doTextPost = function(evt,contentType,value) {
			ui.AgentUi.LOGGER.debug("Post new text content");
			evt.preventDefault();
			var msg = new ui.model.MessageContent();
			msg.type = contentType;
			msg.uid = m3.util.UidGenerator.create();
			msg.text = value;
			msg.connectionSet = new m3.observable.ObservableSet(ui.model.ModelObj.identifier);
			msg.labelSet = new m3.observable.ObservableSet(ui.model.ModelObj.identifier);
			addConnectionsAndLabels(msg);
			ui.model.EM.change(ui.model.EMEvent.NewContentCreated,msg);
		};
		var doTextPostForElement = function(evt,contentType,ele) {
			doTextPost(evt,contentType,ele.val());
			ele.val("");
		};
		var textInput = new $("<div class='postContainer'></div>").appendTo(section);
		var ta = new $("<textarea class='boxsizingBorder container' style='resize: none;'></textarea>").appendTo(textInput).attr("id","textInput_ta").keypress(function(evt) {
			if(!(evt.altKey || evt.shiftKey || evt.ctrlKey) && evt.charCode == 13) doTextPostForElement(evt,ui.model.ContentType.TEXT,new $(evt.target));
		});
		var urlInput = new $("<div class='postContainer boxsizingBorder'></div>").urlComp();
		urlInput.appendTo(section).keypress(function(evt) {
			if(!(evt.altKey || evt.shiftKey || evt.ctrlKey) && evt.charCode == 13) doTextPostForElement(evt,ui.model.ContentType.URL,new $(evt.target));
		});
		var mediaInput = new $("<div class='postContainer boxsizingBorder'></div>").uploadComp({ });
		mediaInput.appendTo(section);
		var label = new $("<aside class='label'><span>Post:</span></aside>").appendTo(section);
		var tabs = new $("<aside class='tabs'></aside>").appendTo(section);
		var textTab = new $("<span class='ui-icon ui-icon-document active ui-corner-left'></span>").appendTo(tabs).click(function(evt) {
			tabs.children(".active").removeClass("active");
			$(this).addClass("active");
			textInput.show();
			urlInput.hide();
			mediaInput.hide();
		});
		var urlTab = new $("<span class='ui-icon ui-icon-link ui-corner-left'></span>").appendTo(tabs).click(function(evt) {
			tabs.children(".active").removeClass("active");
			$(this).addClass("active");
			textInput.hide();
			urlInput.show();
			mediaInput.hide();
		});
		var imgTab = new $("<span class='ui-icon ui-icon-image ui-corner-left'></span>").appendTo(tabs).click(function(evt) {
			tabs.children(".active").removeClass("active");
			$(this).addClass("active");
			textInput.hide();
			urlInput.hide();
			mediaInput.show();
		});
		urlInput.hide();
		mediaInput.hide();
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
				return ui.widget.ConnectionAvatarHelper.getConnection(new $(ele)).uid;
			}) || isDuplicate(".labelComp",_ui.draggable,tags,function(ele) {
				return ui.widget.LabelCompHelper.getLabel(new $(ele)).uid;
			})) {
				if(_ui.draggable.parent().attr("id") != "post_comps_tags") _ui.draggable.draggable("option","revert",true);
				return;
			}
			var clone = (_ui.draggable.data("clone"))(_ui.draggable,false,".tags");
			clone.addClass("small");
			var cloneOffset = clone.offset();
			$(this).append(clone);
			clone.css({ position : "absolute"});
			if(cloneOffset.top != 0) clone.offset(cloneOffset); else clone.position({ my : "left top", at : "left top", of : _ui.helper, collision : "flipfit", within : ".tags"});
		}});
		addConnectionsAndLabels = function(content) {
			tags.children(".label").each(function(i,dom) {
				var labelComp = new $(dom);
				content.labelSet.add(ui.widget.LabelCompHelper.getLabel(labelComp));
			});
			tags.children(".connectionAvatar").each(function(i,dom) {
				var conn = new $(dom);
				content.connectionSet.add(ui.widget.ConnectionAvatarHelper.getConnection(conn));
			});
		};
		var postButton = new $("<button>Post</button>").appendTo(selfElement).button().click(function(evt) {
			if(textInput.isVisible()) {
				var ta1 = new $("#textInput_ta");
				doTextPostForElement(evt,ui.model.ContentType.TEXT,ta1);
			} else if(urlInput.isVisible()) doTextPostForElement(evt,ui.model.ContentType.URL,urlInput.urlComp("valEle")); else {
				doTextPost(evt,ui.model.ContentType.IMAGE,ui.widget.UploadCompHelper.value(mediaInput));
				ui.widget.UploadCompHelper.clear(mediaInput);
			}
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
		var from_text = new $("<textarea class='boxsizingBorder container rid_ta'></textarea>").appendTo(divTa1).attr("id","from_text").keyup(from_text_changed).val("Hi " + toName + " & " + fromName + ",\nHere's an introduction for the two of you to connect.\nwith love,\n" + ui.AgentUi.USER.userData.name);
		var divTa2 = new $("<div class='rid_cell' style='height:140px;text-align:right;padding-left: 7px;'></div>").appendTo(ridTa);
		var to_text = new $("<textarea class='boxsizingBorder container rid_ta' readonly='readonly'></textarea>").appendTo(divTa2).attr("id","to_text").val(from_text.val());
	}, _appendConnectionAvatar : function(connection,parent) {
		var avatar = new $("<div class='avatar'></div>").connectionAvatar({ connection : connection, dndEnabled : false, isDragByHelper : true, containment : false}).appendTo(parent).css("display","inline");
		parent.append("<div class='labelDiv' style='display:inline'>" + connection.name() + "</div>");
	}, initialized : false, _sendRequest : function() {
		var self = this;
		var selfElement1 = this.element;
		var alias = ui.AgentUi.USER.get_currentAlias().label;
		var msg = new ui.api.BeginIntroductionRequest(alias,self.options.to,self.options.from,new $("#to_text").val(),new $("#from_text").val());
		ui.model.EM.addListener(ui.model.EMEvent.INTRODUCTION_RESPONSE,new ui.model.EMListener(function(n) {
			selfElement1.dialog("close");
		},"RequestIntroductionDialog-Introduction-Response"));
		ui.model.EM.change(ui.model.EMEvent.INTRODUCTION_REQUEST,msg);
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
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of SignupConfirmationDialog must be a div element");
		self._cancelled = false;
		selfElement.addClass("signupConfirmationDialog").hide();
		selfElement.append("<p> Your request for a User Agent has been submitted. Upon receiving your confirmation email, you may click the " + "link it contains or paste the token below to validate your email address.");
		self.inputLabel = new $("<div class='labelDiv'><label id='confirmTokenLabel' for='confirmToken'>Your Token</label></div>").appendTo(selfElement);
		self.input = new $("<input id='confirmToken' />").appendTo(selfElement);
		self.input.keypress(function(evt) {
			if(evt.keyCode == 13) self._validateUser();
		});
		ui.model.EM.addListener(ui.model.EMEvent.USER,new ui.model.EMListener(function(user) {
			self._setUser(user);
		},"SignupConfirmationDialog-User"));
	}, initialized : false, _validateUser : function() {
		var self = this;
		var selfElement1 = this.element;
		var valid = true;
		var token = self.input.val();
		if(m3.helper.StringHelper.isBlank(token)) {
			self.inputLabel.addClass("ui-state-error");
			valid = false;
		}
		if(!valid) return;
		selfElement1.find(".ui-state-error").removeClass("ui-state-error");
		ui.model.EM.change(ui.model.EMEvent.USER_VALIDATE,token);
		ui.model.EM.addListener(ui.model.EMEvent.USER_VALIDATED,new ui.model.EMListener(function(n) {
			selfElement1.dialog("close");
		},"SignupConfirmationDialog-UserValidated"));
	}, _buildDialog : function() {
		var self1 = this;
		var selfElement2 = this.element;
		self1.initialized = true;
		var dlgOptions = { autoOpen : false, title : "Email Validation", height : 420, width : 420, buttons : { Validate : function() {
			self1._validateUser();
		}, Cancel : function() {
			self1._cancelled = true;
			$(this).dialog("close");
		}}, close : function(evt,ui1) {
			selfElement2.find(".placeholder").removeClass("ui-state-error");
			if(self1.user == null || !self1.user.hasValidSession()) ui.widget.DialogManager.showLogin();
		}};
		selfElement2.dialog(dlgOptions);
	}, _setUser : function(user) {
		var self = this;
		self.user = user;
	}, open : function() {
		var self = this;
		var selfElement = this.element;
		self._cancelled = false;
		if(!self.initialized) self._buildDialog();
		self.input.focus();
		selfElement.dialog("open");
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.signupConfirmationDialog",defineWidget());
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new m3.exception.Exception("Root of UserComp must be a div element");
		selfElement.addClass("ocontainer shadow ");
		selfElement.append(new $("<div class='container'></div>"));
		self._setUser();
		ui.model.EM.addListener(ui.model.EMEvent.USER,new ui.model.EMListener(function(user) {
			self.user = user;
			self._setUser();
		},"UserComp-User"));
		ui.model.EM.addListener(ui.model.EMEvent.LoadAlias,new ui.model.EMListener(function(alias) {
			self._setUser();
		},"UserComp-Alias"));
	}, _setUser : function() {
		var self = this;
		var selfElement = this.element;
		var user = self.user;
		var container = selfElement.children(".container").empty();
		var imgSrc = "media/default_avatar.jpg";
		if(user != null) {
			if(user.get_currentAlias() != null && m3.helper.StringHelper.isNotBlank(user.get_currentAlias().imgSrc)) imgSrc = user.get_currentAlias().imgSrc; else if(m3.helper.StringHelper.isNotBlank(user.userData.imgSrc)) imgSrc = user.userData.imgSrc;
		}
		var img = new $("<img alt='user' src='" + imgSrc + "' class='shadow'/>");
		container.append(img);
		var menu = new $("<ul id='userCompMenu'></ul>");
		menu.appendTo(container);
		menu.m3menu({ menuOptions : [{ label : "Set Profile Picture", icon : "ui-icon-image", action : function(evt,m) {
			var dlg = new $("<div id='profilePictureUploader'></div>");
			dlg.appendTo(container);
			var uploadComp = new $("<div class='boxsizingBorder' style='height: 150px;'></div>");
			uploadComp.appendTo(dlg);
			uploadComp.uploadComp();
			dlg.m3dialog({ width : 800, height : 305, title : "Profile Picture Uploader", buttons : { Cancel : function() {
				$(this).m3dialog("close");
			}, 'Set Profile Image' : function() {
				ui.AgentUi.USER.userData.imgSrc = ui.widget.UploadCompHelper.value(uploadComp);
				ui.model.EM.change(ui.model.EMEvent.USER_UPDATE,ui.AgentUi.USER);
				$(this).m3dialog("close");
			}}});
		}}], width : 225}).hide();
		img.click(function(evt) {
			new $(".nonmodalPopup").hide();
			menu.show();
			menu.position({ my : "left top", of : evt});
			evt.stopPropagation();
		});
		var userIdTxt = new $("<div class='userIdTxt'></div>");
		container.append(userIdTxt);
		var name = (function($this) {
			var $r;
			try {
				$r = user.userData.name;
			} catch( __e ) {
				$r = "";
			}
			return $r;
		}(this));
		var aliasLabel = (function($this) {
			var $r;
			try {
				$r = user.get_currentAlias().label;
			} catch( __e ) {
				$r = "";
			}
			return $r;
		}(this));
		if(m3.helper.StringHelper.isBlank(aliasLabel)) aliasLabel = "";
		userIdTxt.append("<strong>" + name + "</strong>").append("<br/>").append("<font style='font-size:12px'>" + aliasLabel + "</font>");
		var changeDiv = new $("<div class='ui-helper-clearfix'></div>");
		var change = new $("<a class='aliasToggle'>Change Alias</a>");
		changeDiv.append(change);
		container.append(changeDiv);
		var aliases = new $("<div class='aliases ocontainer nonmodalPopup' style='position: absolute; min-width: 100px;'></div>");
		container.append(aliases);
		var iter = (function($this) {
			var $r;
			try {
				$r = user.aliasSet.iterator();
			} catch( __e ) {
				$r = null;
			}
			return $r;
		}(this));
		if(iter != null) while(iter.hasNext()) {
			var alias1 = [iter.next()];
			var btn = new $("<div id='" + alias1[0].uid + "' class='aliasBtn ui-widget ui-button boxsizingBorder ui-state-default'>" + alias1[0].label + "</div>");
			if(alias1[0].uid == user.get_currentAlias().uid) btn.addClass("ui-state-active");
			aliases.append(btn);
			btn.hover((function() {
				return function() {
					$(this).addClass("ui-state-hover");
				};
			})(),(function() {
				return function() {
					$(this).removeClass("ui-state-hover");
				};
			})()).click((function(alias1) {
				return function(evt) {
					ui.model.EM.change(ui.model.EMEvent.LoadAlias,alias1[0]);
				};
			})(alias1));
		}
		var btn = new $("<div id='newAlias' class='aliasBtn ui-widget ui-button boxsizingBorder ui-state-default'>New Alias</div>");
		aliases.append(btn);
		btn.hover(function() {
			$(this).addClass("ui-state-hover");
		},function() {
			$(this).removeClass("ui-state-hover");
		}).click(function(evt) {
			ui.widget.DialogManager.showNewAlias();
		});
		aliases.position({ my : "left top", at : "right-6px center", of : selfElement});
		aliases.hide();
		change.click(function(evt) {
			aliases.toggle();
			evt.stopPropagation();
		});
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.userComp",defineWidget());
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
m3.observable.OSet.__rtti = "<class path=\"m3.observable.OSet\" params=\"T\" interface=\"1\">\n\t<identifier public=\"1\" set=\"method\"><f a=\"\"><f a=\"\">\n\t<c path=\"m3.observable.OSet.T\"/>\n\t<c path=\"String\"/>\n</f></f></identifier>\n\t<listen public=\"1\" set=\"method\"><f a=\"l\">\n\t<f a=\":\">\n\t\t<c path=\"m3.observable.OSet.T\"/>\n\t\t<c path=\"m3.observable.EventType\"/>\n\t\t<x path=\"Void\"/>\n\t</f>\n\t<x path=\"Void\"/>\n</f></listen>\n\t<iterator public=\"1\" set=\"method\"><f a=\"\"><t path=\"Iterator\"><c path=\"m3.observable.OSet.T\"/></t></f></iterator>\n\t<delegate public=\"1\" set=\"method\"><f a=\"\"><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"m3.observable.OSet.T\"/>\n</x></f></delegate>\n\t<getVisualId public=\"1\" set=\"method\"><f a=\"\"><c path=\"String\"/></f></getVisualId>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
m3.observable.EventManager.__rtti = "<class path=\"m3.observable.EventManager\" params=\"T\" module=\"m3.observable.OSet\">\n\t<_listeners><c path=\"Array\"><f a=\":\">\n\t<c path=\"m3.observable.EventManager.T\"/>\n\t<c path=\"m3.observable.EventType\"/>\n\t<x path=\"Void\"/>\n</f></c></_listeners>\n\t<_set><c path=\"m3.observable.OSet\"><c path=\"m3.observable.EventManager.T\"/></c></_set>\n\t<add public=\"1\" set=\"method\" line=\"44\"><f a=\"l\">\n\t<f a=\":\">\n\t\t<c path=\"m3.observable.EventManager.T\"/>\n\t\t<c path=\"m3.observable.EventType\"/>\n\t\t<x path=\"Void\"/>\n\t</f>\n\t<x path=\"Void\"/>\n</f></add>\n\t<fire public=\"1\" set=\"method\" line=\"52\"><f a=\"t:type\">\n\t<c path=\"m3.observable.EventManager.T\"/>\n\t<c path=\"m3.observable.EventType\"/>\n\t<x path=\"Void\"/>\n</f></fire>\n\t<new public=\"1\" set=\"method\" line=\"40\"><f a=\"set\">\n\t<c path=\"m3.observable.OSet\"><c path=\"m3.observable.EventManager.T\"/></c>\n\t<x path=\"Void\"/>\n</f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
m3.observable.EventType.Add = new m3.observable.EventType("Add",true,false);
m3.observable.EventType.Update = new m3.observable.EventType("Update",false,true);
m3.observable.EventType.Delete = new m3.observable.EventType("Delete",false,false);
m3.observable.AbstractSet.__rtti = "<class path=\"m3.observable.AbstractSet\" params=\"T\" module=\"m3.observable.OSet\">\n\t<implements path=\"m3.observable.OSet\"><c path=\"m3.observable.AbstractSet.T\"/></implements>\n\t<_eventManager><c path=\"m3.observable.EventManager\"><c path=\"m3.observable.AbstractSet.T\"/></c></_eventManager>\n\t<visualId public=\"1\"><c path=\"String\"/></visualId>\n\t<listen public=\"1\" set=\"method\" line=\"108\"><f a=\"l\">\n\t<f a=\":\">\n\t\t<c path=\"m3.observable.AbstractSet.T\"/>\n\t\t<c path=\"m3.observable.EventType\"/>\n\t\t<x path=\"Void\"/>\n\t</f>\n\t<x path=\"Void\"/>\n</f></listen>\n\t<filter public=\"1\" set=\"method\" line=\"112\"><f a=\"f\">\n\t<f a=\"\">\n\t\t<c path=\"m3.observable.AbstractSet.T\"/>\n\t\t<x path=\"Bool\"/>\n\t</f>\n\t<c path=\"m3.observable.OSet\"><c path=\"m3.observable.AbstractSet.T\"/></c>\n</f></filter>\n\t<map public=\"1\" params=\"U\" set=\"method\" line=\"116\"><f a=\"f\">\n\t<f a=\"\">\n\t\t<c path=\"m3.observable.AbstractSet.T\"/>\n\t\t<c path=\"map.U\"/>\n\t</f>\n\t<c path=\"m3.observable.OSet\"><c path=\"map.U\"/></c>\n</f></map>\n\t<fire set=\"method\" line=\"120\"><f a=\"t:type\">\n\t<c path=\"m3.observable.AbstractSet.T\"/>\n\t<c path=\"m3.observable.EventType\"/>\n\t<x path=\"Void\"/>\n</f></fire>\n\t<getVisualId public=\"1\" set=\"method\" line=\"124\"><f a=\"\"><c path=\"String\"/></f></getVisualId>\n\t<identifier public=\"1\" set=\"method\" line=\"128\"><f a=\"\"><f a=\"\">\n\t<c path=\"m3.observable.AbstractSet.T\"/>\n\t<c path=\"String\"/>\n</f></f></identifier>\n\t<iterator public=\"1\" set=\"method\" line=\"132\"><f a=\"\"><t path=\"Iterator\"><c path=\"m3.observable.AbstractSet.T\"/></t></f></iterator>\n\t<delegate public=\"1\" set=\"method\" line=\"136\"><f a=\"\"><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"m3.observable.AbstractSet.T\"/>\n</x></f></delegate>\n\t<new set=\"method\" line=\"104\"><f a=\"\"><x path=\"Void\"/></f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
m3.observable.ObservableSet.__rtti = "<class path=\"m3.observable.ObservableSet\" params=\"T\" module=\"m3.observable.OSet\">\n\t<extends path=\"m3.observable.AbstractSet\"><c path=\"m3.observable.ObservableSet.T\"/></extends>\n\t<_delegate><c path=\"m3.util.SizedMap\"><c path=\"m3.observable.ObservableSet.T\"/></c></_delegate>\n\t<_identifier><f a=\"\">\n\t<c path=\"m3.observable.ObservableSet.T\"/>\n\t<c path=\"String\"/>\n</f></_identifier>\n\t<add public=\"1\" set=\"method\" line=\"156\"><f a=\"t\">\n\t<c path=\"m3.observable.ObservableSet.T\"/>\n\t<x path=\"Void\"/>\n</f></add>\n\t<addAll public=\"1\" set=\"method\" line=\"160\"><f a=\"tArr\">\n\t<c path=\"Array\"><c path=\"m3.observable.ObservableSet.T\"/></c>\n\t<x path=\"Void\"/>\n</f></addAll>\n\t<iterator public=\"1\" set=\"method\" line=\"168\" override=\"1\"><f a=\"\"><t path=\"Iterator\"><c path=\"m3.observable.ObservableSet.T\"/></t></f></iterator>\n\t<isEmpty public=\"1\" set=\"method\" line=\"172\"><f a=\"\"><x path=\"Bool\"/></f></isEmpty>\n\t<addOrUpdate public=\"1\" set=\"method\" line=\"176\"><f a=\"t\">\n\t<c path=\"m3.observable.ObservableSet.T\"/>\n\t<x path=\"Void\"/>\n</f></addOrUpdate>\n\t<delegate public=\"1\" set=\"method\" line=\"188\" override=\"1\"><f a=\"\"><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"m3.observable.ObservableSet.T\"/>\n</x></f></delegate>\n\t<update public=\"1\" set=\"method\" line=\"192\"><f a=\"t\">\n\t<c path=\"m3.observable.ObservableSet.T\"/>\n\t<x path=\"Void\"/>\n</f></update>\n\t<delete public=\"1\" set=\"method\" line=\"196\"><f a=\"t\">\n\t<c path=\"m3.observable.ObservableSet.T\"/>\n\t<x path=\"Void\"/>\n</f></delete>\n\t<identifier public=\"1\" set=\"method\" line=\"204\" override=\"1\"><f a=\"\"><f a=\"\">\n\t<c path=\"m3.observable.ObservableSet.T\"/>\n\t<c path=\"String\"/>\n</f></f></identifier>\n\t<clear public=\"1\" set=\"method\" line=\"208\"><f a=\"\"><x path=\"Void\"/></f></clear>\n\t<size public=\"1\" set=\"method\" line=\"215\"><f a=\"\"><x path=\"Int\"/></f></size>\n\t<asArray public=\"1\" set=\"method\" line=\"219\"><f a=\"\"><c path=\"Array\"><c path=\"m3.observable.ObservableSet.T\"/></c></f></asArray>\n\t<new public=\"1\" set=\"method\" line=\"147\"><f a=\"identifier:?tArr\">\n\t<f a=\"\">\n\t\t<c path=\"m3.observable.ObservableSet.T\"/>\n\t\t<c path=\"String\"/>\n\t</f>\n\t<c path=\"Array\"><c path=\"m3.observable.ObservableSet.T\"/></c>\n\t<x path=\"Void\"/>\n</f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
m3.observable.MappedSet.__rtti = "<class path=\"m3.observable.MappedSet\" params=\"T:U\" module=\"m3.observable.OSet\">\n\t<extends path=\"m3.observable.AbstractSet\"><c path=\"m3.observable.MappedSet.U\"/></extends>\n\t<_source><c path=\"m3.observable.OSet\"><c path=\"m3.observable.MappedSet.T\"/></c></_source>\n\t<_mapper><f a=\"\">\n\t<c path=\"m3.observable.MappedSet.T\"/>\n\t<c path=\"m3.observable.MappedSet.U\"/>\n</f></_mapper>\n\t<_mappedSet><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"m3.observable.MappedSet.U\"/>\n</x></_mappedSet>\n\t<identifier public=\"1\" set=\"method\" line=\"254\" override=\"1\"><f a=\"\"><f a=\"\">\n\t<c path=\"m3.observable.MappedSet.U\"/>\n\t<c path=\"String\"/>\n</f></f></identifier>\n\t<delegate public=\"1\" set=\"method\" line=\"258\" override=\"1\"><f a=\"\"><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"m3.observable.MappedSet.U\"/>\n</x></f></delegate>\n\t<identify set=\"method\" line=\"262\"><f a=\"u\">\n\t<c path=\"m3.observable.MappedSet.U\"/>\n\t<c path=\"String\"/>\n</f></identify>\n\t<iterator public=\"1\" set=\"method\" line=\"273\" override=\"1\"><f a=\"\"><t path=\"Iterator\"><c path=\"m3.observable.MappedSet.U\"/></t></f></iterator>\n\t<new public=\"1\" set=\"method\" line=\"235\"><f a=\"source:mapper\">\n\t<c path=\"m3.observable.OSet\"><c path=\"m3.observable.MappedSet.T\"/></c>\n\t<f a=\"\">\n\t\t<c path=\"m3.observable.MappedSet.T\"/>\n\t\t<c path=\"m3.observable.MappedSet.U\"/>\n\t</f>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
m3.observable.FilteredSet.__rtti = "<class path=\"m3.observable.FilteredSet\" params=\"T\" module=\"m3.observable.OSet\">\n\t<extends path=\"m3.observable.AbstractSet\"><c path=\"m3.observable.FilteredSet.T\"/></extends>\n\t<_filteredSet><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"m3.observable.FilteredSet.T\"/>\n</x></_filteredSet>\n\t<_source><c path=\"m3.observable.OSet\"><c path=\"m3.observable.FilteredSet.T\"/></c></_source>\n\t<_filter><f a=\"\">\n\t<c path=\"m3.observable.FilteredSet.T\"/>\n\t<x path=\"Bool\"/>\n</f></_filter>\n\t<delegate public=\"1\" set=\"method\" line=\"305\" override=\"1\"><f a=\"\"><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"m3.observable.FilteredSet.T\"/>\n</x></f></delegate>\n\t<apply set=\"method\" line=\"309\"><f a=\"t\">\n\t<c path=\"m3.observable.FilteredSet.T\"/>\n\t<x path=\"Void\"/>\n</f></apply>\n\t<refilter public=\"1\" set=\"method\" line=\"326\"><f a=\"\"><x path=\"Void\"/></f></refilter>\n\t<identifier public=\"1\" set=\"method\" line=\"330\" override=\"1\"><f a=\"\"><f a=\"\">\n\t<c path=\"m3.observable.FilteredSet.T\"/>\n\t<c path=\"String\"/>\n</f></f></identifier>\n\t<iterator public=\"1\" set=\"method\" line=\"334\" override=\"1\"><f a=\"\"><t path=\"Iterator\"><c path=\"m3.observable.FilteredSet.T\"/></t></f></iterator>\n\t<new public=\"1\" set=\"method\" line=\"284\"><f a=\"source:filter\">\n\t<c path=\"m3.observable.OSet\"><c path=\"m3.observable.FilteredSet.T\"/></c>\n\t<f a=\"\">\n\t\t<c path=\"m3.observable.FilteredSet.T\"/>\n\t\t<x path=\"Bool\"/>\n\t</f>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
m3.observable.GroupedSet.__rtti = "<class path=\"m3.observable.GroupedSet\" params=\"T\" module=\"m3.observable.OSet\">\n\t<extends path=\"m3.observable.AbstractSet\"><c path=\"m3.observable.OSet\"><c path=\"m3.observable.GroupedSet.T\"/></c></extends>\n\t<_source><c path=\"m3.observable.OSet\"><c path=\"m3.observable.GroupedSet.T\"/></c></_source>\n\t<_groupingFn><f a=\"\">\n\t<c path=\"m3.observable.GroupedSet.T\"/>\n\t<c path=\"String\"/>\n</f></_groupingFn>\n\t<_groupedSets><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"m3.observable.ObservableSet\"><c path=\"m3.observable.GroupedSet.T\"/></c>\n</x></_groupedSets>\n\t<_identityToGrouping><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"String\"/>\n</x></_identityToGrouping>\n\t<delete set=\"method\" line=\"367\"><f a=\"t\">\n\t<c path=\"m3.observable.GroupedSet.T\"/>\n\t<x path=\"Void\"/>\n</f></delete>\n\t<add set=\"method\" line=\"389\"><f a=\"t\">\n\t<c path=\"m3.observable.GroupedSet.T\"/>\n\t<x path=\"Void\"/>\n</f></add>\n\t<identifier public=\"1\" set=\"method\" line=\"410\" override=\"1\"><f a=\"\"><f a=\"\">\n\t<c path=\"m3.observable.OSet\"><c path=\"m3.observable.GroupedSet.T\"/></c>\n\t<c path=\"String\"/>\n</f></f></identifier>\n\t<identify set=\"method\" line=\"414\"><f a=\"set\">\n\t<c path=\"m3.observable.OSet\"><c path=\"m3.observable.GroupedSet.T\"/></c>\n\t<c path=\"String\"/>\n</f></identify>\n\t<iterator public=\"1\" set=\"method\" line=\"425\" override=\"1\"><f a=\"\"><t path=\"Iterator\"><c path=\"m3.observable.OSet\"><c path=\"m3.observable.GroupedSet.T\"/></c></t></f></iterator>\n\t<delegate public=\"1\" set=\"method\" line=\"429\" override=\"1\"><f a=\"\"><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"m3.observable.OSet\"><c path=\"m3.observable.GroupedSet.T\"/></c>\n</x></f></delegate>\n\t<new public=\"1\" set=\"method\" line=\"346\"><f a=\"source:groupingFn\">\n\t<c path=\"m3.observable.OSet\"><c path=\"m3.observable.GroupedSet.T\"/></c>\n\t<f a=\"\">\n\t\t<c path=\"m3.observable.GroupedSet.T\"/>\n\t\t<c path=\"String\"/>\n\t</f>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
m3.observable.SortedSet.__rtti = "<class path=\"m3.observable.SortedSet\" params=\"T\" module=\"m3.observable.OSet\">\n\t<extends path=\"m3.observable.AbstractSet\"><c path=\"m3.observable.SortedSet.T\"/></extends>\n\t<_source><c path=\"m3.observable.OSet\"><c path=\"m3.observable.SortedSet.T\"/></c></_source>\n\t<_sortByFn><f a=\"\">\n\t<c path=\"m3.observable.SortedSet.T\"/>\n\t<c path=\"String\"/>\n</f></_sortByFn>\n\t<_sorted><c path=\"Array\"><c path=\"m3.observable.SortedSet.T\"/></c></_sorted>\n\t<_dirty><x path=\"Bool\"/></_dirty>\n\t<_comparisonFn><f a=\":\">\n\t<c path=\"m3.observable.SortedSet.T\"/>\n\t<c path=\"m3.observable.SortedSet.T\"/>\n\t<x path=\"Int\"/>\n</f></_comparisonFn>\n\t<sorted set=\"method\" line=\"481\"><f a=\"\"><c path=\"Array\"><c path=\"m3.observable.SortedSet.T\"/></c></f></sorted>\n\t<indexOf set=\"method\" line=\"489\"><f a=\"t\">\n\t<c path=\"m3.observable.SortedSet.T\"/>\n\t<x path=\"Int\"/>\n</f></indexOf>\n\t<binarySearch set=\"method\" line=\"494\"><f a=\"value:sortBy:startIndex:endIndex\">\n\t<c path=\"m3.observable.SortedSet.T\"/>\n\t<c path=\"String\"/>\n\t<x path=\"Int\"/>\n\t<x path=\"Int\"/>\n\t<x path=\"Int\"/>\n</f></binarySearch>\n\t<delete set=\"method\" line=\"512\"><f a=\"t\">\n\t<c path=\"m3.observable.SortedSet.T\"/>\n\t<x path=\"Void\"/>\n</f></delete>\n\t<add set=\"method\" line=\"516\"><f a=\"t\">\n\t<c path=\"m3.observable.SortedSet.T\"/>\n\t<x path=\"Void\"/>\n</f></add>\n\t<identifier public=\"1\" set=\"method\" line=\"522\" override=\"1\"><f a=\"\"><f a=\"\">\n\t<c path=\"m3.observable.SortedSet.T\"/>\n\t<c path=\"String\"/>\n</f></f></identifier>\n\t<iterator public=\"1\" set=\"method\" line=\"526\" override=\"1\"><f a=\"\"><t path=\"Iterator\"><c path=\"m3.observable.SortedSet.T\"/></t></f></iterator>\n\t<delegate public=\"1\" set=\"method\" line=\"530\" override=\"1\"><f a=\"\"><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"m3.observable.SortedSet.T\"/>\n</x></f></delegate>\n\t<new public=\"1\" set=\"method\" line=\"442\"><f a=\"source:?sortByFn\">\n\t<c path=\"m3.observable.OSet\"><c path=\"m3.observable.SortedSet.T\"/></c>\n\t<f a=\"\">\n\t\t<c path=\"m3.observable.SortedSet.T\"/>\n\t\t<c path=\"String\"/>\n\t</f>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
m3.util.ColorProvider._INDEX = 0;
m3.util.UidGenerator.chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabsdefghijklmnopqrstuvwxyz0123456789";
m3.util.UidGenerator.nums = "0123456789";
ui.AgentUi.DEMO = false;
ui.AgentUi.URL = "";
ui.api.ProtocolMessage.__rtti = "<class path=\"ui.api.ProtocolMessage\" params=\"T\">\n\t<msgType public=\"1\" set=\"null\"><e path=\"ui.api.MsgType\"/></msgType>\n\t<content>\n\t\t<d/>\n\t\t<meta><m n=\":isVar\"/></meta>\n\t</content>\n\t<contentImpl public=\"1\">\n\t\t<c path=\"ui.api.ProtocolMessage.T\"/>\n\t\t<meta><m n=\":transient\"/></meta>\n\t</contentImpl>\n\t<type>\n\t\t<x path=\"Class\"><c path=\"ui.api.ProtocolMessage.T\"/></x>\n\t\t<meta><m n=\":transient\"/></meta>\n\t</type>\n\t<readResolve set=\"method\" line=\"30\"><f a=\"\"><x path=\"Void\"/></f></readResolve>\n\t<writeResolve set=\"method\" line=\"34\"><f a=\"\"><x path=\"Void\"/></f></writeResolve>\n\t<new public=\"1\" set=\"method\" line=\"24\"><f a=\"msgType:type\">\n\t<e path=\"ui.api.MsgType\"/>\n\t<x path=\"Class\"><c path=\"ui.api.ProtocolMessage.T\"/></x>\n\t<x path=\"Void\"/>\n</f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
ui.api.Payload.__rtti = "<class path=\"ui.api.Payload\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<new public=\"1\" set=\"method\" line=\"41\"><f a=\"\"><x path=\"Void\"/></f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
ui.api.PayloadWithSessionURI.__rtti = "<class path=\"ui.api.PayloadWithSessionURI\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.Payload\"/>\n\t<sessionURI public=\"1\"><c path=\"String\"/></sessionURI>\n\t<new public=\"1\" set=\"method\" line=\"47\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.PayloadWithReason.__rtti = "<class path=\"ui.api.PayloadWithReason\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.Payload\"/>\n\t<reason public=\"1\"><c path=\"String\"/></reason>\n\t<new public=\"1\" set=\"method\" line=\"55\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.ErrorPayload.__rtti = "<class path=\"ui.api.ErrorPayload\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.PayloadWithSessionURI\"/>\n\t<reason public=\"1\"><c path=\"String\"/></reason>\n\t<new public=\"1\" set=\"method\" line=\"59\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.CreateUserRequest.__rtti = "<class path=\"ui.api.CreateUserRequest\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.UserRequestData\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"67\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.UserRequestData.__rtti = "<class path=\"ui.api.UserRequestData\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.Payload\"/>\n\t<email public=\"1\"><c path=\"String\"/></email>\n\t<password public=\"1\"><c path=\"String\"/></password>\n\t<jsonBlob public=\"1\"><d/></jsonBlob>\n\t<new public=\"1\" set=\"method\" line=\"72\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.CreateUserError.__rtti = "<class path=\"ui.api.CreateUserError\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.PayloadWithReason\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"79\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.CreateUserWaiting.__rtti = "<class path=\"ui.api.CreateUserWaiting\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.Payload\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"86\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.ConfirmUserToken.__rtti = "<class path=\"ui.api.ConfirmUserToken\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.ConfirmUserTokenData\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"92\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.ConfirmUserTokenData.__rtti = "<class path=\"ui.api.ConfirmUserTokenData\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.Payload\"/>\n\t<token public=\"1\"><c path=\"String\"/></token>\n\t<new public=\"1\" set=\"method\" line=\"97\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.CreateUserResponse.__rtti = "<class path=\"ui.api.CreateUserResponse\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.CreateUserResponseData\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"102\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.CreateUserResponseData.__rtti = "<class path=\"ui.api.CreateUserResponseData\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.Payload\"/>\n\t<agentURI public=\"1\"><c path=\"String\"/></agentURI>\n\t<new public=\"1\" set=\"method\" line=\"107\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.UpdateUserRequest.__rtti = "<class path=\"ui.api.UpdateUserRequest\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.UpdateUserRequestData\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"112\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.UpdateUserRequestData.__rtti = "<class path=\"ui.api.UpdateUserRequestData\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.PayloadWithSessionURI\"/>\n\t<jsonBlob public=\"1\"><d/></jsonBlob>\n\t<new public=\"1\" set=\"method\" line=\"117\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.InitializeSessionRequest.__rtti = "<class path=\"ui.api.InitializeSessionRequest\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.InitializeSessionRequestData\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"126\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.InitializeSessionRequestData.__rtti = "<class path=\"ui.api.InitializeSessionRequestData\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.Payload\"/>\n\t<agentURI public=\"1\"><c path=\"String\"/></agentURI>\n\t<new public=\"1\" set=\"method\" line=\"131\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.InitializeSessionResponse.__rtti = "<class path=\"ui.api.InitializeSessionResponse\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.InitializeSessionResponseData\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"136\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.InitializeSessionResponseData.__rtti = "<class path=\"ui.api.InitializeSessionResponseData\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.Payload\"/>\n\t<sessionURI public=\"1\"><c path=\"String\"/></sessionURI>\n\t<listOfAliases public=\"1\"><c path=\"Array\"><c path=\"String\"/></c></listOfAliases>\n\t<defaultAlias public=\"1\"><c path=\"String\"/></defaultAlias>\n\t<listOfCnxns public=\"1\"><c path=\"Array\"><c path=\"ui.model.Connection\"/></c></listOfCnxns>\n\t<lastActiveLabel public=\"1\"><c path=\"String\"/></lastActiveLabel>\n\t<jsonBlob public=\"1\"><c path=\"ui.model.UserData\"/></jsonBlob>\n\t<listOfLabels><c path=\"Array\"><c path=\"String\"/></c></listOfLabels>\n\t<labels public=\"1\" get=\"accessor\" set=\"null\">\n\t\t<c path=\"Array\"><c path=\"ui.model.Label\"/></c>\n\t\t<meta><m n=\":transient\"/></meta>\n\t</labels>\n\t<get_labels set=\"method\" line=\"151\"><f a=\"\"><c path=\"Array\"><c path=\"ui.model.Label\"/></c></f></get_labels>\n\t<new public=\"1\" set=\"method\" line=\"141\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.InitializeSessionError.__rtti = "<class path=\"ui.api.InitializeSessionError\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.PayloadWithReason\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"165\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.SessionPingRequest.__rtti = "<class path=\"ui.api.SessionPingRequest\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.PayloadWithSessionURI\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"174\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.SessionPongResponse.__rtti = "<class path=\"ui.api.SessionPongResponse\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.PayloadWithSessionURI\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"180\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.CloseSessionRequest.__rtti = "<class path=\"ui.api.CloseSessionRequest\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.PayloadWithSessionURI\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"190\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.CloseSessionResponse.__rtti = "<class path=\"ui.api.CloseSessionResponse\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.PayloadWithSessionURI\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"196\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.EvalSubscribeRequest.__rtti = "<class path=\"ui.api.EvalSubscribeRequest\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.EvalRequestData\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"205\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.EvalRequestData.__rtti = "<class path=\"ui.api.EvalRequestData\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.PayloadWithSessionURI\"/>\n\t<expression public=\"1\"><c path=\"ui.api.ProtocolMessage\"><d/></c></expression>\n\t<new public=\"1\" set=\"method\" line=\"210\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.EvalNextPageRequest.__rtti = "<class path=\"ui.api.EvalNextPageRequest\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.EvalNextPageRequestData\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"215\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.EvalNextPageRequestData.__rtti = "<class path=\"ui.api.EvalNextPageRequestData\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.PayloadWithSessionURI\"/>\n\t<nextPage public=\"1\"><c path=\"String\"/></nextPage>\n\t<new public=\"1\" set=\"method\" line=\"220\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.EvalResponse.__rtti = "<class path=\"ui.api.EvalResponse\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.EvalResponseData\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"225\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.EvalComplete.__rtti = "<class path=\"ui.api.EvalComplete\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.EvalResponseData\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"231\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.EvalResponseData.__rtti = "<class path=\"ui.api.EvalResponseData\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.PayloadWithSessionURI\"/>\n\t<pageOfPosts public=\"1\"><c path=\"Array\"><c path=\"ui.model.Content\"/></c></pageOfPosts>\n\t<new public=\"1\" set=\"method\" line=\"236\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.EvalError.__rtti = "<class path=\"ui.api.EvalError\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.EvalErrorData\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"241\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.EvalErrorData.__rtti = "<class path=\"ui.api.EvalErrorData\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.PayloadWithSessionURI\"/>\n\t<errorMsg public=\"1\"><c path=\"String\"/></errorMsg>\n\t<new public=\"1\" set=\"method\" line=\"246\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.FeedExpr.__rtti = "<class path=\"ui.api.FeedExpr\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.FeedExprData\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"251\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.FeedExprData.__rtti = "<class path=\"ui.api.FeedExprData\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.Payload\"/>\n\t<cnxns public=\"1\"><c path=\"Array\"><c path=\"ui.model.Connection\"/></c></cnxns>\n\t<label public=\"1\"><c path=\"String\"/></label>\n\t<new public=\"1\" set=\"method\" line=\"256\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.StopEvalRequest.__rtti = "<class path=\"ui.api.StopEvalRequest\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.PayloadWithSessionURI\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"265\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.StopEvalResponse.__rtti = "<class path=\"ui.api.StopEvalResponse\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.PayloadWithSessionURI\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"271\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.BaseAgentAliasRequest.__rtti = "<class path=\"ui.api.BaseAgentAliasRequest\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.AgentAliasesRequestData\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"280\"><f a=\"msgType\">\n\t<e path=\"ui.api.MsgType\"/>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
ui.api.AgentAliasesRequestData.__rtti = "<class path=\"ui.api.AgentAliasesRequestData\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.PayloadWithSessionURI\"/>\n\t<aliases public=\"1\"><c path=\"Array\"><c path=\"String\"/></c></aliases>\n\t<new public=\"1\" set=\"method\" line=\"285\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.AddAgentAliasesResponse.__rtti = "<class path=\"ui.api.AddAgentAliasesResponse\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.PayloadWithSessionURI\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"290\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.AddAgentAliasesError.__rtti = "<class path=\"ui.api.AddAgentAliasesError\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.ErrorPayload\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"296\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.RemoveAgentAliasesResponse.__rtti = "<class path=\"ui.api.RemoveAgentAliasesResponse\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.PayloadWithSessionURI\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"302\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.RemoveAgentAliasesError.__rtti = "<class path=\"ui.api.RemoveAgentAliasesError\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.ErrorPayload\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"308\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.SetDefaultAliasResponse.__rtti = "<class path=\"ui.api.SetDefaultAliasResponse\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.PayloadWithSessionURI\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"314\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.SetDefaultAliasError.__rtti = "<class path=\"ui.api.SetDefaultAliasError\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.ErrorPayload\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"320\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.GetAliasConnectionsResponse.__rtti = "<class path=\"ui.api.GetAliasConnectionsResponse\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.AliasConnectionsRequestData\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"326\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.AliasConnectionsRequestData.__rtti = "<class path=\"ui.api.AliasConnectionsRequestData\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.PayloadWithSessionURI\"/>\n\t<cnxns public=\"1\"><c path=\"Array\"><c path=\"ui.model.Connection\"/></c></cnxns>\n\t<new public=\"1\" set=\"method\" line=\"331\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.GetAliasLabelsResponse.__rtti = "<class path=\"ui.api.GetAliasLabelsResponse\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.AliasLabelsRequestData\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"336\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.AliasLabelsRequestData.__rtti = "<class path=\"ui.api.AliasLabelsRequestData\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.PayloadWithSessionURI\"/>\n\t<labels public=\"1\"><c path=\"Array\"><c path=\"String\"/></c></labels>\n\t<new public=\"1\" set=\"method\" line=\"341\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.AddAliasLabelsRequest.__rtti = "<class path=\"ui.api.AddAliasLabelsRequest\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.AddAliasLabelsRequestData\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"346\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.AddAliasLabelsRequestData.__rtti = "<class path=\"ui.api.AddAliasLabelsRequestData\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.PayloadWithSessionURI\"/>\n\t<labels public=\"1\"><c path=\"Array\"><c path=\"String\"/></c></labels>\n\t<alias public=\"1\"><c path=\"String\"/></alias>\n\t<new public=\"1\" set=\"method\" line=\"351\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.AddAliasLabelsResponse.__rtti = "<class path=\"ui.api.AddAliasLabelsResponse\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.PayloadWithSessionURI\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"357\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.InsertContent.__rtti = "<class path=\"ui.api.InsertContent\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.InsertContentData\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"364\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.InsertContentData.__rtti = "<class path=\"ui.api.InsertContentData\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.Payload\"/>\n\t<cnxns public=\"1\"><c path=\"Array\"><c path=\"ui.model.Connection\"/></c></cnxns>\n\t<label public=\"1\"><c path=\"String\"/></label>\n\t<value public=\"1\"><c path=\"String\"/></value>\n\t<new public=\"1\" set=\"method\" line=\"368\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.BeginIntroductionRequest.__rtti = "<class path=\"ui.api.BeginIntroductionRequest\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.BeginIntroductionRequestData\"/></extends>\n\t<new public=\"1\" set=\"method\" line=\"376\"><f a=\"alias:from:to:fromMessage:toMessage\">\n\t<c path=\"String\"/>\n\t<c path=\"ui.model.Connection\"/>\n\t<c path=\"ui.model.Connection\"/>\n\t<c path=\"String\"/>\n\t<c path=\"String\"/>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
ui.api.BeginIntroductionRequestData.__rtti = "<class path=\"ui.api.BeginIntroductionRequestData\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.PayloadWithSessionURI\"/>\n\t<alias public=\"1\"><c path=\"String\"/></alias>\n\t<aBiConnection public=\"1\"><c path=\"ui.model.BiConnection\"/></aBiConnection>\n\t<bBiConnection public=\"1\"><c path=\"ui.model.BiConnection\"/></bBiConnection>\n\t<aMessage public=\"1\">\n\t\t<c path=\"String\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</aMessage>\n\t<bMessage public=\"1\">\n\t\t<c path=\"String\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</bMessage>\n\t<new public=\"1\" set=\"method\" line=\"387\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.TestDao.initialized = false;
ui.api.TestDao._lastRandom = 0;
ui.model.ModelObj.__rtti = "<class path=\"ui.model.ModelObj\" params=\"T\">\n\t<identifier public=\"1\" params=\"T\" set=\"method\" line=\"21\" static=\"1\"><f a=\"t\">\n\t<a><uid><c path=\"String\"/></uid></a>\n\t<c path=\"String\"/>\n</f></identifier>\n\t<uid public=\"1\">\n\t\t<c path=\"String\"/>\n\t\t<meta><m n=\":transient\"/></meta>\n\t</uid>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
ui.model.Login.__rtti = "<class path=\"ui.model.Login\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.ModelObj\"><c path=\"ui.model.Login\"/></extends>\n\t<password public=\"1\"><c path=\"String\"/></password>\n\t<getUri public=\"1\" set=\"method\" line=\"30\"><f a=\"\"><c path=\"String\"/></f></getUri>\n\t<new public=\"1\" set=\"method\" line=\"27\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.model.LoginByUn.__rtti = "<class path=\"ui.model.LoginByUn\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.Login\"/>\n\t<email public=\"1\"><c path=\"String\"/></email>\n\t<getUri public=\"1\" set=\"method\" line=\"39\" override=\"1\"><f a=\"\"><c path=\"String\"/></f></getUri>\n\t<new public=\"1\" set=\"method\" line=\"35\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.model.LoginById.__rtti = "<class path=\"ui.model.LoginById\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.Login\"/>\n\t<uuid public=\"1\"><c path=\"String\"/></uuid>\n\t<getUri public=\"1\" set=\"method\" line=\"48\" override=\"1\"><f a=\"\"><c path=\"String\"/></f></getUri>\n\t<new public=\"1\" set=\"method\" line=\"45\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.model.NewUser.__rtti = "<class path=\"ui.model.NewUser\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.ModelObj\"><c path=\"ui.model.NewUser\"/></extends>\n\t<name public=\"1\"><c path=\"String\"/></name>\n\t<userName public=\"1\"><c path=\"String\"/></userName>\n\t<email public=\"1\"><c path=\"String\"/></email>\n\t<pwd public=\"1\"><c path=\"String\"/></pwd>\n\t<new public=\"1\" set=\"method\" line=\"59\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.model.User.__rtti = "<class path=\"ui.model.User\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.ModelObj\"><c path=\"ui.model.User\"/></extends>\n\t<sessionURI public=\"1\"><c path=\"String\"/></sessionURI>\n\t<userData public=\"1\"><c path=\"ui.model.UserData\"/></userData>\n\t<aliasSet public=\"1\">\n\t\t<c path=\"m3.observable.ObservableSet\"><c path=\"ui.model.Alias\"/></c>\n\t\t<meta><m n=\":transient\"/></meta>\n\t</aliasSet>\n\t<aliases><c path=\"Array\"><c path=\"ui.model.Alias\"/></c></aliases>\n\t<currentAlias public=\"1\" get=\"accessor\" set=\"accessor\">\n\t\t<c path=\"ui.model.Alias\"/>\n\t\t<meta><m n=\":isVar\"/></meta>\n\t</currentAlias>\n\t<get_currentAlias set=\"method\" line=\"72\"><f a=\"\"><c path=\"ui.model.Alias\"/></f></get_currentAlias>\n\t<set_currentAlias set=\"method\" line=\"82\"><f a=\"alias\">\n\t<c path=\"ui.model.Alias\"/>\n\t<c path=\"ui.model.Alias\"/>\n</f></set_currentAlias>\n\t<hasValidSession public=\"1\" set=\"method\" line=\"87\"><f a=\"\"><x path=\"Bool\"/></f></hasValidSession>\n\t<readResolve set=\"method\" line=\"93\"><f a=\"\"><x path=\"Void\"/></f></readResolve>\n\t<writeResolve set=\"method\" line=\"97\"><f a=\"\"><x path=\"Void\"/></f></writeResolve>\n\t<getSelfConnection public=\"1\" set=\"method\" line=\"101\"><f a=\"\"><c path=\"ui.model.Connection\"/></f></getSelfConnection>\n\t<new public=\"1\" set=\"method\" line=\"70\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.model.UserData.__rtti = "<class path=\"ui.model.UserData\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.ModelObj\"><c path=\"ui.model.UserData\"/></extends>\n\t<name public=\"1\"><c path=\"String\"/></name>\n\t<imgSrc public=\"1\">\n\t\t<c path=\"String\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</imgSrc>\n\t<new public=\"1\" set=\"method\" line=\"114\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.model.Alias.__rtti = "<class path=\"ui.model.Alias\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.ModelObj\"><c path=\"ui.model.Alias\"/></extends>\n\t<imgSrc public=\"1\">\n\t\t<c path=\"String\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</imgSrc>\n\t<label public=\"1\"><c path=\"String\"/></label>\n\t<labelSet public=\"1\">\n\t\t<c path=\"m3.observable.ObservableSet\"><c path=\"ui.model.Label\"/></c>\n\t\t<meta><m n=\":transient\"/></meta>\n\t</labelSet>\n\t<labels><c path=\"Array\"><c path=\"ui.model.Label\"/></c></labels>\n\t<connectionSet public=\"1\">\n\t\t<c path=\"m3.observable.ObservableSet\"><c path=\"ui.model.Connection\"/></c>\n\t\t<meta><m n=\":transient\"/></meta>\n\t</connectionSet>\n\t<connections><c path=\"Array\"><c path=\"ui.model.Connection\"/></c></connections>\n\t<loadedFromDb line=\"125\">\n\t\t<x path=\"Bool\"/>\n\t\t<meta><m n=\":transient\"/></meta>\n\t</loadedFromDb>\n\t<readResolve set=\"method\" line=\"130\"><f a=\"\"><x path=\"Void\"/></f></readResolve>\n\t<writeResolve set=\"method\" line=\"135\"><f a=\"\"><x path=\"Void\"/></f></writeResolve>\n\t<new public=\"1\" set=\"method\" line=\"128\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.model.Label.__rtti = "<class path=\"ui.model.Label\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.ModelObj\"><c path=\"ui.model.Label\"/></extends>\n\t<implements path=\"ui.model.Filterable\"/>\n\t<text public=\"1\"><c path=\"String\"/></text>\n\t<parentUid public=\"1\">\n\t\t<c path=\"String\"/>\n\t\t<meta><m n=\":transient\"/></meta>\n\t</parentUid>\n\t<color public=\"1\">\n\t\t<c path=\"String\"/>\n\t\t<meta><m n=\":transient\"/></meta>\n\t</color>\n\t<new public=\"1\" set=\"method\" line=\"151\"><f a=\"?text\">\n\t<c path=\"String\"/>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
ui.model.Connection.__rtti = "<class path=\"ui.model.Connection\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.ModelObj\"><c path=\"ui.model.Connection\"/></extends>\n\t<implements path=\"ui.model.Filterable\"/>\n\t<fname public=\"1\">\n\t\t<c path=\"String\"/>\n\t\t<meta><m n=\":transient\"/></meta>\n\t</fname>\n\t<lname public=\"1\">\n\t\t<c path=\"String\"/>\n\t\t<meta><m n=\":transient\"/></meta>\n\t</lname>\n\t<imgSrc public=\"1\">\n\t\t<c path=\"String\"/>\n\t\t<meta><m n=\":transient\"/></meta>\n\t</imgSrc>\n\t<src public=\"1\"><c path=\"String\"/></src>\n\t<tgt public=\"1\"><c path=\"String\"/></tgt>\n\t<label public=\"1\"><c path=\"String\"/></label>\n\t<name public=\"1\" set=\"method\" line=\"172\"><f a=\"\"><c path=\"String\"/></f></name>\n\t<new public=\"1\" set=\"method\" line=\"166\"><f a=\"?fname:?lname:?imgSrc\">\n\t<c path=\"String\"/>\n\t<c path=\"String\"/>\n\t<c path=\"String\"/>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
ui.model.BiConnection.__rtti = "<class path=\"ui.model.BiConnection\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.ModelObj\"><c path=\"ui.model.BiConnection\"/></extends>\n\t<implements path=\"ui.model.Filterable\"/>\n\t<readConnection public=\"1\"><c path=\"ui.model.Connection\"/></readConnection>\n\t<writeConnection public=\"1\"><c path=\"ui.model.Connection\"/></writeConnection>\n\t<new public=\"1\" set=\"method\" line=\"181\"><f a=\"readConnection:writeConnection\">\n\t<c path=\"ui.model.Connection\"/>\n\t<c path=\"ui.model.Connection\"/>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
ui.model.Content.__rtti = "<class path=\"ui.model.Content\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.ModelObj\"><c path=\"ui.model.Content\"/></extends>\n\t<type public=\"1\"><e path=\"ui.model.ContentType\"/></type>\n\t<labelSet public=\"1\">\n\t\t<c path=\"m3.observable.ObservableSet\"><c path=\"ui.model.Label\"/></c>\n\t\t<meta><m n=\":transient\"/></meta>\n\t</labelSet>\n\t<connectionSet public=\"1\">\n\t\t<c path=\"m3.observable.ObservableSet\"><c path=\"ui.model.Connection\"/></c>\n\t\t<meta><m n=\":transient\"/></meta>\n\t</connectionSet>\n\t<labels>\n\t\t<c path=\"Array\"><c path=\"String\"/></c>\n\t\t<meta><m n=\":transient\"/></meta>\n\t</labels>\n\t<connections>\n\t\t<c path=\"Array\"><c path=\"String\"/></c>\n\t\t<meta><m n=\":transient\"/></meta>\n\t</connections>\n\t<creator public=\"1\"><c path=\"String\"/></creator>\n\t<readResolve set=\"method\" line=\"204\"><f a=\"\"><x path=\"Void\"/></f></readResolve>\n\t<writeResolve set=\"method\" line=\"209\"><f a=\"\"><x path=\"Void\"/></f></writeResolve>\n</class>";
ui.model.ImageContent.__rtti = "<class path=\"ui.model.ImageContent\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.Content\"/>\n\t<imgSrc public=\"1\"><c path=\"String\"/></imgSrc>\n\t<caption public=\"1\"><c path=\"String\"/></caption>\n\t<new public=\"1\" set=\"method\" line=\"219\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.model.AudioContent.__rtti = "<class path=\"ui.model.AudioContent\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.Content\"/>\n\t<audioSrc public=\"1\"><c path=\"String\"/></audioSrc>\n\t<audioType public=\"1\"><c path=\"String\"/></audioType>\n\t<title public=\"1\"><c path=\"String\"/></title>\n\t<new public=\"1\" set=\"method\" line=\"227\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.model.MessageContent.__rtti = "<class path=\"ui.model.MessageContent\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.Content\"/>\n\t<text public=\"1\"><c path=\"String\"/></text>\n\t<new public=\"1\" set=\"method\" line=\"233\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.model.UrlContent.__rtti = "<class path=\"ui.model.UrlContent\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.MessageContent\"/>\n\t<url public=\"1\"><c path=\"String\"/></url>\n\t<new public=\"1\" set=\"method\" line=\"236\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
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
