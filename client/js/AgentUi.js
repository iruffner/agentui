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
var ui = {}
ui.AgentUi = function() { }
$hxClasses["ui.AgentUi"] = ui.AgentUi;
$hxExpose(ui.AgentUi, "ui.AgentUi");
ui.AgentUi.__name__ = ["ui","AgentUi"];
ui.AgentUi.main = function() {
	ui.AgentUi.LOGGER = new ui.log.Logga(ui.log.LogLevel.DEBUG);
	ui.AgentUi.CONTENT = new ui.observable.ObservableSet(ui.model.ModelObj.identifier);
	ui.AgentUi.PROTOCOL = new ui.api.ProtocolHandler();
	ui.AgentUi.SERIALIZER = new ui.serialization.Serializer();
	ui.AgentUi.HOT_KEY_ACTIONS = new Array();
}
ui.AgentUi.start = function() {
	var urlVars = ui.util.HtmlUtil.getUrlVars();
	if(ui.helper.StringHelper.isNotBlank(urlVars.demo) && (urlVars.demo == "no" || urlVars.demo == "false")) ui.AgentUi.DEMO = false;
	new $("body").keyup(function(evt) {
		if(ui.helper.ArrayHelper.hasValues(ui.AgentUi.HOT_KEY_ACTIONS)) {
			var _g1 = 0, _g = ui.AgentUi.HOT_KEY_ACTIONS.length;
			while(_g1 < _g) {
				var action_ = _g1++;
				ui.AgentUi.HOT_KEY_ACTIONS[action_](evt);
			}
		}
	});
	new $("#middleContainer #content #tabs").tabs();
	new ui.widget.MessagingComp("#sideRight #chat").messagingComp();
	new ui.widget.ConnectionsList("#connections").connectionsList({ });
	new ui.widget.LabelsList("#labelsList").labelsList();
	new ui.widget.FilterComp("#filter").filterComp(null);
	new ui.widget.ContentFeed("#feed").contentFeed({ content : ui.AgentUi.CONTENT});
	new ui.widget.UserComp("#userId").userComp();
	new ui.widget.PostComp("#postInput").postComp();
	new ui.widget.InviteComp("#sideRight #sideRightInvite").inviteComp();
	var fitWindowListener = new ui.model.EventListener(function(n) {
		fitWindow();
	});
	var fireFitWindow = new ui.model.EventListener(function(n) {
		ui.model.EventModel.change(ui.model.ModelEvents.FitWindow);
	});
	ui.model.EventModel.addListener(ui.model.ModelEvents.MoreContent,fireFitWindow);
	ui.model.EventModel.addListener(ui.model.ModelEvents.USER_LOGIN,fireFitWindow);
	ui.model.EventModel.addListener(ui.model.ModelEvents.USER_CREATE,fireFitWindow);
	ui.model.EventModel.addListener(ui.model.ModelEvents.USER,new ui.model.EventListener(function(user) {
		ui.AgentUi.USER = user;
		ui.model.EventModel.change(ui.model.ModelEvents.AliasLoaded,user.get_currentAlias());
	}));
	ui.model.EventModel.addListener(ui.model.ModelEvents.AliasLoaded,new ui.model.EventListener(function(alias) {
		ui.AgentUi.USER.set_currentAlias(alias);
	}));
	ui.model.EventModel.addListener(ui.model.ModelEvents.FitWindow,fitWindowListener);
	new $("body").click(function(evt) {
		new $(".nonmodalPopup").hide();
	});
	if(ui.helper.StringHelper.isNotBlank(urlVars.agentURI)) ui.AgentUi.agentURI = urlVars.agentURI;
	ui.AgentUi.showLogin();
}
ui.AgentUi.showLogin = function() {
	var loginComp = new ui.widget.LoginComp(".loginComp");
	if(loginComp.exists()) loginComp.loginComp("open"); else {
		loginComp = new ui.widget.LoginComp("<div></div>");
		loginComp.appendTo(new $("body"));
		loginComp.loginComp();
		loginComp.loginComp("open");
	}
}
ui.AgentUi.showNewUser = function() {
	var newUserComp = new ui.widget.NewUserComp(".newUserComp");
	if(newUserComp.exists()) newUserComp.newUserComp("open"); else {
		newUserComp = new ui.widget.NewUserComp("<div></div>");
		newUserComp.appendTo(new $("body"));
		newUserComp.newUserComp();
		newUserComp.newUserComp("open");
	}
}
ui.CrossMojo = function() { }
$hxClasses["ui.CrossMojo"] = ui.CrossMojo;
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
ui.api = {}
ui.api.ProtocolHandler = function() {
	this.filterIsRunning = false;
	var _g = this;
	ui.model.EventModel.addListener(ui.model.ModelEvents.FILTER_RUN,new ui.model.EventListener(function(filter) {
		if(_g.filterIsRunning) try {
			var stopEval = new ui.api.StopEvalRequest();
			var stopData = new ui.api.StopMsgData();
			stopData.sessionURI = ui.AgentUi.USER.sessionURI;
			stopEval.content = stopData;
			new ui.api.StandardRequest(stopEval,function(data,textStatus,jqXHR) {
				ui.AgentUi.LOGGER.debug("stopEval successfully submitted");
				_g.filter(filter);
			}).start();
		} catch( err ) {
			var exc = ui.log.Logga.getExceptionInst(err);
			ui.AgentUi.LOGGER.error("Error executing stop evaluation request",exc);
			_g.filter(filter);
		} else _g.filter(filter);
		_g.filterIsRunning = true;
	}));
	ui.model.EventModel.addListener(ui.model.ModelEvents.EndOfContent,new ui.model.EventListener(function(nextPageURI) {
		_g.filterIsRunning = false;
	}));
	ui.model.EventModel.addListener(ui.model.ModelEvents.NextContent,new ui.model.EventListener(function(nextPageURI) {
		_g.nextPage(nextPageURI);
	}));
	ui.model.EventModel.addListener(ui.model.ModelEvents.LoadAlias,new ui.model.EventListener(function(uid) {
		var alias = _g.getAlias(uid);
		ui.model.EventModel.change(ui.model.ModelEvents.AliasLoaded,alias);
	}));
	ui.model.EventModel.addListener(ui.model.ModelEvents.USER_LOGIN,new ui.model.EventListener(function(login) {
		_g.getUser(login);
	}));
	ui.model.EventModel.addListener(ui.model.ModelEvents.USER_CREATE,new ui.model.EventListener(function(user) {
		_g.createUser(user);
	}));
	ui.model.EventModel.addListener(ui.model.ModelEvents.USER_UPDATE,new ui.model.EventListener(function(user) {
		_g.updateUser(user);
	}));
	ui.model.EventModel.addListener(ui.model.ModelEvents.NewContentCreated,new ui.model.EventListener(function(content) {
		_g.post(content);
	}));
	ui.model.EventModel.addListener(ui.model.ModelEvents.CreateLabel,new ui.model.EventListener(function(label) {
		_g.createLabel(label);
	}));
	this.processHash = new haxe.ds.StringMap();
	this.processHash.set(Std.string(ui.api.MsgType.evalResponse),function(data) {
		var evalResponse = ui.AgentUi.SERIALIZER.fromJsonX(data,ui.api.EvalResponse);
		ui.model.EventModel.change(ui.model.ModelEvents.MoreContent,evalResponse.content.pageOfPosts);
	});
	this.processHash.set(Std.string(ui.api.MsgType.evalComplete),function(data) {
		var evalComplete = ui.AgentUi.SERIALIZER.fromJsonX(data,ui.api.EvalComplete);
		ui.model.EventModel.change(ui.model.ModelEvents.EndOfContent,evalComplete.content.pageOfPosts);
	});
	this.processHash.set(Std.string(ui.api.MsgType.sessionPong),function(data) {
	});
};
$hxClasses["ui.api.ProtocolHandler"] = ui.api.ProtocolHandler;
ui.api.ProtocolHandler.__name__ = ["ui","api","ProtocolHandler"];
ui.api.ProtocolHandler.prototype = {
	createLabel: function(label) {
		var evalRequest = new ui.api.EvalRequest();
		var data = new ui.api.EvalRequestData();
		evalRequest.content = data;
		data.sessionURI = ui.AgentUi.USER.sessionURI;
		data.expression = label.uid;
		try {
			new ui.api.StandardRequest(evalRequest,function(data1,textStatus,jqXHR) {
				ui.AgentUi.LOGGER.debug("label successfully submitted");
				ui.AgentUi.USER.get_currentAlias().labelSet.add(label);
			}).start();
		} catch( err ) {
			var ex = ui.log.Logga.getExceptionInst(err);
			ui.AgentUi.LOGGER.error("Error executing label post",ex);
		}
	}
	,post: function(content) {
		var evalRequest = new ui.api.EvalRequest();
		var data = new ui.api.EvalRequestData();
		evalRequest.content = data;
		data.sessionURI = ui.AgentUi.USER.sessionURI;
		data.expression = content.toInsertExpression();
		try {
			new ui.api.StandardRequest(evalRequest,function(data1,textStatus,jqXHR) {
				ui.AgentUi.LOGGER.debug("content successfully submitted");
			}).start();
		} catch( err ) {
			var ex = ui.log.Logga.getExceptionInst(err);
			ui.AgentUi.LOGGER.error("Error executing content post",ex);
		}
	}
	,updateUser: function(newUser) {
		var _g = this;
		var request = new ui.api.UpdateUserRequest();
		var data = new ui.api.UpdateUserRequestData();
		request.content = data;
		data.email = newUser.email;
		data.password = newUser.pwd;
		try {
			new ui.api.StandardRequest(request,function(data1,textStatus,jqXHR) {
				if(data1.msgType == ui.api.MsgType.initializeSessionResponse) try {
					var response = ui.AgentUi.SERIALIZER.fromJsonX(data1,ui.api.InitializeSessionResponse,false);
					var user = new ui.model.User();
					user.set_currentAlias(response.content.defaultAlias);
					user.sessionURI = response.content.sessionURI;
					user.get_currentAlias().connectionSet = new ui.observable.ObservableSet(ui.model.ModelObj.identifier,response.content.listOfCnxns);
					user.get_currentAlias().labelSet = new ui.observable.ObservableSet(ui.model.ModelObj.identifier,response.content.listOfLabels);
					user.aliasSet = new ui.observable.ObservableSet(ui.model.ModelObj.identifier,response.content.listOfAliases);
					_g._startPolling(user.sessionURI);
					ui.AgentUi.LOGGER.error("Enable firing new user event");
				} catch( e ) {
					if( js.Boot.__instanceof(e,ui.serialization.JsonException) ) {
						ui.AgentUi.LOGGER.error("Serialization error",e);
					} else throw(e);
				} else if(data1.msgType == ui.api.MsgType.initializeSessionError) {
					var error = ui.AgentUi.SERIALIZER.fromJsonX(data1,ui.api.InitializeSessionError);
					throw new ui.exception.InitializeSessionException(error,"Login error");
				} else throw new ui.exception.Exception("Unknown login error");
			}).start();
		} catch( err ) {
			var ex = ui.log.Logga.getExceptionInst(err);
			ui.AgentUi.LOGGER.error("Error executing user creation",ex);
		}
	}
	,createUser: function(newUser) {
		var request = new ui.api.CreateUserRequest();
		var data = new ui.api.UserRequestData();
		request.content = data;
		data.email = newUser.email;
		data.password = newUser.pwd;
		data.jsonBlob = { };
		data.jsonBlob.name = newUser.name;
		try {
			new ui.api.StandardRequest(request,function(data1,textStatus,jqXHR) {
				if(data1.msgType == ui.api.MsgType.createUserResponse) try {
					var response = ui.AgentUi.SERIALIZER.fromJsonX(data1,ui.api.CreateUserResponse,false);
					ui.AgentUi.agentURI = response.content.agentURI;
					ui.model.EventModel.change(ui.model.ModelEvents.USER_SIGNUP);
				} catch( e ) {
					if( js.Boot.__instanceof(e,ui.serialization.JsonException) ) {
						ui.AgentUi.LOGGER.error("Serialization error",e);
					} else throw(e);
				} else {
					ui.AgentUi.LOGGER.error("Unknown user creation error | " + Std.string(data1));
					js.Lib.alert("There was an unexpected error creating your agent. Please try again.");
				}
			}).start();
		} catch( err ) {
			var ex = ui.log.Logga.getExceptionInst(err);
			ui.AgentUi.LOGGER.error("Error executing user creation",ex);
		}
	}
	,_startPolling: function(sessionURI) {
		var _g = this;
		var ping = new ui.api.SessionPingRequest();
		ping.content = new ui.api.SessionPingRequestData();
		ping.content.sessionURI = sessionURI;
		this.listeningChannel = new ui.api.LongPollingRequest(ping,function(data,textStatus,jqXHR) {
			var processor = (function($this) {
				var $r;
				var key = data.msgType;
				$r = _g.processHash.get(key);
				return $r;
			}(this));
			if(processor == null) {
				ui.AgentUi.LOGGER.info("long poll response was empty");
				return;
			} else {
				ui.AgentUi.LOGGER.debug("received " + Std.string(data.msgType));
				processor(data);
			}
		});
		this.listeningChannel.start();
	}
	,getAlias: function(uid) {
		return ui.api.TestDao.getAlias(uid);
	}
	,nextPage: function(nextPageURI) {
		var nextPageRequest = new ui.api.EvalNextPageRequest();
		var nextPageRequestData = new ui.api.EvalNextPageRequestData();
		nextPageRequestData.nextPage = nextPageURI;
		nextPageRequestData.sessionURI = ui.AgentUi.USER.sessionURI;
		nextPageRequest.content = nextPageRequestData;
		try {
			new ui.api.StandardRequest(nextPageRequest,function(data,textStatus,jqXHR) {
				ui.AgentUi.LOGGER.debug("next page request successfully submitted");
			}).start();
		} catch( err ) {
			var ex = ui.log.Logga.getExceptionInst(err);
			ui.AgentUi.LOGGER.error("Error executing next page request",ex);
		}
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
			evalRequestData.sessionURI = ui.AgentUi.USER.sessionURI;
			evalRequest.content = evalRequestData;
			try {
				new ui.api.StandardRequest(evalRequest,function(data,textStatus,jqXHR) {
					ui.AgentUi.LOGGER.debug("filter successfully submitted");
				}).start();
			} catch( err ) {
				var ex = ui.log.Logga.getExceptionInst(err);
				ui.AgentUi.LOGGER.error("Error executing filter request",ex);
			}
		}
	}
	,getUser: function(login) {
		var _g = this;
		if(ui.AgentUi.DEMO) ui.model.EventModel.change(ui.model.ModelEvents.USER,ui.api.TestDao.getUser(null));
		var request = new ui.api.InitializeSessionRequest();
		var requestData = new ui.api.InitializeSessionRequestData();
		request.content = requestData;
		requestData.agentURI = login.getUri();
		try {
			var loginRequest = new ui.api.StandardRequest(request,function(data,textStatus,jqXHR) {
				if(data.msgType == ui.api.MsgType.initializeSessionResponse) try {
					var response = ui.AgentUi.SERIALIZER.fromJsonX(data,ui.api.InitializeSessionResponse,false);
					var user = new ui.model.User();
					user.set_currentAlias(response.content.defaultAlias);
					user.sessionURI = response.content.sessionURI;
					user.get_currentAlias().connectionSet = new ui.observable.ObservableSet(ui.model.ModelObj.identifier,response.content.listOfCnxns);
					user.get_currentAlias().labelSet = new ui.observable.ObservableSet(ui.model.ModelObj.identifier,response.content.listOfLabels);
					user.aliasSet = new ui.observable.ObservableSet(ui.model.ModelObj.identifier,response.content.listOfAliases);
					_g._startPolling(user.sessionURI);
					if(!ui.AgentUi.DEMO) ui.model.EventModel.change(ui.model.ModelEvents.USER,user); else ui.AgentUi.LOGGER.error("Enable firing new user event");
				} catch( e ) {
					if( js.Boot.__instanceof(e,ui.serialization.JsonException) ) {
						ui.AgentUi.LOGGER.error("Serialization error",e);
					} else throw(e);
				} else if(data.msgType == ui.api.MsgType.initializeSessionError) {
					var error = ui.AgentUi.SERIALIZER.fromJsonX(data,ui.api.InitializeSessionError);
					throw new ui.exception.InitializeSessionException(error,"Login error");
				} else {
					ui.AgentUi.LOGGER.error("Unknown user login error | " + Std.string(data));
					js.Lib.alert("There was an unexpected error attempting to login. Please try again.");
				}
			});
			loginRequest.start();
		} catch( $e0 ) {
			if( js.Boot.__instanceof($e0,ui.exception.InitializeSessionException) ) {
				var err = $e0;
				js.Lib.alert("Login error");
			} else {
			var err = $e0;
			js.Lib.alert(err);
			}
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
ui.api.ProtocolMessage = function() { }
$hxClasses["ui.api.ProtocolMessage"] = ui.api.ProtocolMessage;
ui.api.ProtocolMessage.__name__ = ["ui","api","ProtocolMessage"];
ui.api.ProtocolMessage.__interfaces__ = [ui.api.HasContent];
ui.api.ProtocolMessage.prototype = {
	getContent: function() {
		return (function($this) {
			var $r;
			throw new ui.exception.Exception("don't call me");
			return $r;
		}(this));
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
ui.api.CreateUserRequest = function() {
	this.msgType = ui.api.MsgType.createUserRequest;
};
$hxClasses["ui.api.CreateUserRequest"] = ui.api.CreateUserRequest;
ui.api.CreateUserRequest.__name__ = ["ui","api","CreateUserRequest"];
ui.api.CreateUserRequest.__super__ = ui.api.ProtocolMessage;
ui.api.CreateUserRequest.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	getContent: function() {
		return this.content;
	}
	,__class__: ui.api.CreateUserRequest
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
ui.api.CreateUserResponse = function() {
	this.msgType = ui.api.MsgType.createUserResponse;
};
$hxClasses["ui.api.CreateUserResponse"] = ui.api.CreateUserResponse;
ui.api.CreateUserResponse.__name__ = ["ui","api","CreateUserResponse"];
ui.api.CreateUserResponse.__super__ = ui.api.ProtocolMessage;
ui.api.CreateUserResponse.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	getContent: function() {
		return this.content;
	}
	,__class__: ui.api.CreateUserResponse
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
	this.msgType = ui.api.MsgType.updateUserRequest;
};
$hxClasses["ui.api.UpdateUserRequest"] = ui.api.UpdateUserRequest;
ui.api.UpdateUserRequest.__name__ = ["ui","api","UpdateUserRequest"];
ui.api.UpdateUserRequest.__super__ = ui.api.ProtocolMessage;
ui.api.UpdateUserRequest.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	getContent: function() {
		return this.content;
	}
	,__class__: ui.api.UpdateUserRequest
});
ui.api.UpdateUserRequestData = function() {
	ui.api.UserRequestData.call(this);
};
$hxClasses["ui.api.UpdateUserRequestData"] = ui.api.UpdateUserRequestData;
ui.api.UpdateUserRequestData.__name__ = ["ui","api","UpdateUserRequestData"];
ui.api.UpdateUserRequestData.__super__ = ui.api.UserRequestData;
ui.api.UpdateUserRequestData.prototype = $extend(ui.api.UserRequestData.prototype,{
	__class__: ui.api.UpdateUserRequestData
});
ui.api.InitializeSessionRequest = function() {
	this.msgType = ui.api.MsgType.initializeSessionRequest;
};
$hxClasses["ui.api.InitializeSessionRequest"] = ui.api.InitializeSessionRequest;
ui.api.InitializeSessionRequest.__name__ = ["ui","api","InitializeSessionRequest"];
ui.api.InitializeSessionRequest.__super__ = ui.api.ProtocolMessage;
ui.api.InitializeSessionRequest.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	getContent: function() {
		return this.content;
	}
	,__class__: ui.api.InitializeSessionRequest
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
	this.msgType = ui.api.MsgType.initializeSessionResponse;
};
$hxClasses["ui.api.InitializeSessionResponse"] = ui.api.InitializeSessionResponse;
ui.api.InitializeSessionResponse.__name__ = ["ui","api","InitializeSessionResponse"];
ui.api.InitializeSessionResponse.__super__ = ui.api.ProtocolMessage;
ui.api.InitializeSessionResponse.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	getContent: function() {
		return this.content;
	}
	,__class__: ui.api.InitializeSessionResponse
});
ui.api.InitializeSessionResponseData = function() {
	ui.api.Payload.call(this);
};
$hxClasses["ui.api.InitializeSessionResponseData"] = ui.api.InitializeSessionResponseData;
ui.api.InitializeSessionResponseData.__name__ = ["ui","api","InitializeSessionResponseData"];
ui.api.InitializeSessionResponseData.__super__ = ui.api.Payload;
ui.api.InitializeSessionResponseData.prototype = $extend(ui.api.Payload.prototype,{
	__class__: ui.api.InitializeSessionResponseData
});
ui.api.InitializeSessionError = function() {
	this.msgType = ui.api.MsgType.initializeSessionError;
};
$hxClasses["ui.api.InitializeSessionError"] = ui.api.InitializeSessionError;
ui.api.InitializeSessionError.__name__ = ["ui","api","InitializeSessionError"];
ui.api.InitializeSessionError.__super__ = ui.api.ProtocolMessage;
ui.api.InitializeSessionError.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	getContent: function() {
		return this.content;
	}
	,__class__: ui.api.InitializeSessionError
});
ui.api.InitializeSessionErrorData = function() {
	ui.api.Payload.call(this);
};
$hxClasses["ui.api.InitializeSessionErrorData"] = ui.api.InitializeSessionErrorData;
ui.api.InitializeSessionErrorData.__name__ = ["ui","api","InitializeSessionErrorData"];
ui.api.InitializeSessionErrorData.__super__ = ui.api.Payload;
ui.api.InitializeSessionErrorData.prototype = $extend(ui.api.Payload.prototype,{
	__class__: ui.api.InitializeSessionErrorData
});
ui.api.SessionPingRequest = function() {
	this.msgType = ui.api.MsgType.sessionPing;
};
$hxClasses["ui.api.SessionPingRequest"] = ui.api.SessionPingRequest;
ui.api.SessionPingRequest.__name__ = ["ui","api","SessionPingRequest"];
ui.api.SessionPingRequest.__super__ = ui.api.ProtocolMessage;
ui.api.SessionPingRequest.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	getContent: function() {
		return this.content;
	}
	,__class__: ui.api.SessionPingRequest
});
ui.api.SessionPingRequestData = function() {
	ui.api.Payload.call(this);
};
$hxClasses["ui.api.SessionPingRequestData"] = ui.api.SessionPingRequestData;
ui.api.SessionPingRequestData.__name__ = ["ui","api","SessionPingRequestData"];
ui.api.SessionPingRequestData.__super__ = ui.api.Payload;
ui.api.SessionPingRequestData.prototype = $extend(ui.api.Payload.prototype,{
	__class__: ui.api.SessionPingRequestData
});
ui.api.SessionPongResponse = function() {
	this.msgType = ui.api.MsgType.sessionPong;
};
$hxClasses["ui.api.SessionPongResponse"] = ui.api.SessionPongResponse;
ui.api.SessionPongResponse.__name__ = ["ui","api","SessionPongResponse"];
ui.api.SessionPongResponse.__super__ = ui.api.ProtocolMessage;
ui.api.SessionPongResponse.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	getContent: function() {
		return this.content;
	}
	,__class__: ui.api.SessionPongResponse
});
ui.api.SessionPongResponseData = function() {
	ui.api.Payload.call(this);
};
$hxClasses["ui.api.SessionPongResponseData"] = ui.api.SessionPongResponseData;
ui.api.SessionPongResponseData.__name__ = ["ui","api","SessionPongResponseData"];
ui.api.SessionPongResponseData.__super__ = ui.api.Payload;
ui.api.SessionPongResponseData.prototype = $extend(ui.api.Payload.prototype,{
	__class__: ui.api.SessionPongResponseData
});
ui.api.CloseSessionRequest = function() {
	this.msgType = ui.api.MsgType.closeSessionRequest;
};
$hxClasses["ui.api.CloseSessionRequest"] = ui.api.CloseSessionRequest;
ui.api.CloseSessionRequest.__name__ = ["ui","api","CloseSessionRequest"];
ui.api.CloseSessionRequest.__super__ = ui.api.ProtocolMessage;
ui.api.CloseSessionRequest.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	getContent: function() {
		return this.content;
	}
	,__class__: ui.api.CloseSessionRequest
});
ui.api.CloseSessionResponse = function() {
	this.msgType = ui.api.MsgType.closeSessionResponse;
};
$hxClasses["ui.api.CloseSessionResponse"] = ui.api.CloseSessionResponse;
ui.api.CloseSessionResponse.__name__ = ["ui","api","CloseSessionResponse"];
ui.api.CloseSessionResponse.__super__ = ui.api.ProtocolMessage;
ui.api.CloseSessionResponse.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	getContent: function() {
		return this.content;
	}
	,__class__: ui.api.CloseSessionResponse
});
ui.api.CloseSessionData = function() {
	ui.api.Payload.call(this);
};
$hxClasses["ui.api.CloseSessionData"] = ui.api.CloseSessionData;
ui.api.CloseSessionData.__name__ = ["ui","api","CloseSessionData"];
ui.api.CloseSessionData.__super__ = ui.api.Payload;
ui.api.CloseSessionData.prototype = $extend(ui.api.Payload.prototype,{
	__class__: ui.api.CloseSessionData
});
ui.api.EvalRequest = function() {
	this.msgType = ui.api.MsgType.evalSubscribeRequest;
};
$hxClasses["ui.api.EvalRequest"] = ui.api.EvalRequest;
ui.api.EvalRequest.__name__ = ["ui","api","EvalRequest"];
ui.api.EvalRequest.__super__ = ui.api.ProtocolMessage;
ui.api.EvalRequest.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	getContent: function() {
		return this.content;
	}
	,__class__: ui.api.EvalRequest
});
ui.api.EvalRequestData = function() {
	ui.api.Payload.call(this);
};
$hxClasses["ui.api.EvalRequestData"] = ui.api.EvalRequestData;
ui.api.EvalRequestData.__name__ = ["ui","api","EvalRequestData"];
ui.api.EvalRequestData.__super__ = ui.api.Payload;
ui.api.EvalRequestData.prototype = $extend(ui.api.Payload.prototype,{
	__class__: ui.api.EvalRequestData
});
ui.api.EvalNextPageRequest = function() {
	this.msgType = ui.api.MsgType.evalSubscribeRequest;
};
$hxClasses["ui.api.EvalNextPageRequest"] = ui.api.EvalNextPageRequest;
ui.api.EvalNextPageRequest.__name__ = ["ui","api","EvalNextPageRequest"];
ui.api.EvalNextPageRequest.__super__ = ui.api.ProtocolMessage;
ui.api.EvalNextPageRequest.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	getContent: function() {
		return this.content;
	}
	,__class__: ui.api.EvalNextPageRequest
});
ui.api.EvalNextPageRequestData = function() {
	ui.api.Payload.call(this);
};
$hxClasses["ui.api.EvalNextPageRequestData"] = ui.api.EvalNextPageRequestData;
ui.api.EvalNextPageRequestData.__name__ = ["ui","api","EvalNextPageRequestData"];
ui.api.EvalNextPageRequestData.__super__ = ui.api.Payload;
ui.api.EvalNextPageRequestData.prototype = $extend(ui.api.Payload.prototype,{
	__class__: ui.api.EvalNextPageRequestData
});
ui.api.EvalResponse = function() {
	this.msgType = ui.api.MsgType.evalResponse;
};
$hxClasses["ui.api.EvalResponse"] = ui.api.EvalResponse;
ui.api.EvalResponse.__name__ = ["ui","api","EvalResponse"];
ui.api.EvalResponse.__super__ = ui.api.ProtocolMessage;
ui.api.EvalResponse.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	getContent: function() {
		return this.content;
	}
	,__class__: ui.api.EvalResponse
});
ui.api.EvalComplete = function() {
	this.msgType = ui.api.MsgType.evalComplete;
};
$hxClasses["ui.api.EvalComplete"] = ui.api.EvalComplete;
ui.api.EvalComplete.__name__ = ["ui","api","EvalComplete"];
ui.api.EvalComplete.__super__ = ui.api.ProtocolMessage;
ui.api.EvalComplete.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	getContent: function() {
		return this.content;
	}
	,__class__: ui.api.EvalComplete
});
ui.api.EvalResponseData = function() {
	ui.api.Payload.call(this);
};
$hxClasses["ui.api.EvalResponseData"] = ui.api.EvalResponseData;
ui.api.EvalResponseData.__name__ = ["ui","api","EvalResponseData"];
ui.api.EvalResponseData.__super__ = ui.api.Payload;
ui.api.EvalResponseData.prototype = $extend(ui.api.Payload.prototype,{
	__class__: ui.api.EvalResponseData
});
ui.api.EvalError = function() {
	this.msgType = ui.api.MsgType.evalError;
};
$hxClasses["ui.api.EvalError"] = ui.api.EvalError;
ui.api.EvalError.__name__ = ["ui","api","EvalError"];
ui.api.EvalError.__super__ = ui.api.ProtocolMessage;
ui.api.EvalError.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	getContent: function() {
		return this.content;
	}
	,__class__: ui.api.EvalError
});
ui.api.EvalErrorData = function() {
	ui.api.Payload.call(this);
};
$hxClasses["ui.api.EvalErrorData"] = ui.api.EvalErrorData;
ui.api.EvalErrorData.__name__ = ["ui","api","EvalErrorData"];
ui.api.EvalErrorData.__super__ = ui.api.Payload;
ui.api.EvalErrorData.prototype = $extend(ui.api.Payload.prototype,{
	__class__: ui.api.EvalErrorData
});
ui.api.StopEvalRequest = function() {
	this.msgType = ui.api.MsgType.stopEvalRequest;
};
$hxClasses["ui.api.StopEvalRequest"] = ui.api.StopEvalRequest;
ui.api.StopEvalRequest.__name__ = ["ui","api","StopEvalRequest"];
ui.api.StopEvalRequest.__super__ = ui.api.ProtocolMessage;
ui.api.StopEvalRequest.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	getContent: function() {
		return this.content;
	}
	,__class__: ui.api.StopEvalRequest
});
ui.api.StopEvalResponse = function() {
	this.msgType = ui.api.MsgType.stopEvalResponse;
};
$hxClasses["ui.api.StopEvalResponse"] = ui.api.StopEvalResponse;
ui.api.StopEvalResponse.__name__ = ["ui","api","StopEvalResponse"];
ui.api.StopEvalResponse.__super__ = ui.api.ProtocolMessage;
ui.api.StopEvalResponse.prototype = $extend(ui.api.ProtocolMessage.prototype,{
	getContent: function() {
		return this.content;
	}
	,__class__: ui.api.StopEvalResponse
});
ui.api.StopMsgData = function() {
	ui.api.Payload.call(this);
};
$hxClasses["ui.api.StopMsgData"] = ui.api.StopMsgData;
ui.api.StopMsgData.__name__ = ["ui","api","StopMsgData"];
ui.api.StopMsgData.__super__ = ui.api.Payload;
ui.api.StopMsgData.prototype = $extend(ui.api.Payload.prototype,{
	__class__: ui.api.StopMsgData
});
ui.api.MsgType = $hxClasses["ui.api.MsgType"] = { __ename__ : ["ui","api","MsgType"], __constructs__ : ["initializeSessionRequest","initializeSessionResponse","initializeSessionError","sessionPing","sessionPong","closeSessionRequest","closeSessionResponse","evalSubscribeRequest","evalResponse","evalComplete","evalError","stopEvalRequest","stopEvalResponse","createUserRequest","createUserResponse","updateUserRequest","createUserError"] }
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
ui.api.MsgType.createUserResponse = ["createUserResponse",14];
ui.api.MsgType.createUserResponse.toString = $estr;
ui.api.MsgType.createUserResponse.__enum__ = ui.api.MsgType;
ui.api.MsgType.updateUserRequest = ["updateUserRequest",15];
ui.api.MsgType.updateUserRequest.toString = $estr;
ui.api.MsgType.updateUserRequest.__enum__ = ui.api.MsgType;
ui.api.MsgType.createUserError = ["createUserError",16];
ui.api.MsgType.createUserError.toString = $estr;
ui.api.MsgType.createUserError.__enum__ = ui.api.MsgType;
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
	,start: function() {
		ui.AgentUi.LOGGER.debug("send " + Std.string(this.request.msgType));
		$.ajax({ async : true, url : ui.AgentUi.URL + "/api", data : ui.AgentUi.SERIALIZER.toJsonString(this.request), type : "POST", success : this.successFcn, error : function(jqXHR,textStatus,errorThrown) {
			throw new ui.exception.Exception("Error executing ajax call | Response Code: " + jqXHR.status + " | " + jqXHR.message);
		}});
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
			var ajaxOpts = { url : ui.AgentUi.URL + "/api", data : this.requestJson, type : "POST", success : function(data,textStatus,jqXHR) {
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
	,start: function() {
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
	alias.imgSrc = "media/default_avatar.jpg";
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
	audioContent.connectionSet = new ui.observable.ObservableSet(ui.helper.OSetHelper.strIdentifier);
	audioContent.labelSet = new ui.observable.ObservableSet(ui.helper.OSetHelper.strIdentifier);
	if(ui.helper.ArrayHelper.hasValues(availableConnections)) audioContent.creator = ui.api.TestDao.getRandomFromArray(availableConnections).uid; else audioContent.creator = ui.AgentUi.USER.get_currentAlias().uid;
	if(ui.helper.ArrayHelper.hasValues(availableConnections)) ui.api.TestDao.addConnections(availableConnections,audioContent,2);
	if(ui.helper.ArrayHelper.hasValues(availableLabels)) ui.api.TestDao.addLabels(availableLabels,audioContent,2);
	audioContent.title = "Hello Newman Compilation";
	content.push(audioContent);
	var img = new ui.model.ImageContent();
	img.uid = ui.util.UidGenerator.create();
	img.type = "IMAGE";
	img.imgSrc = "media/test/soupkitchen.jpg";
	img.caption = "Soup Kitchen";
	img.connectionSet = new ui.observable.ObservableSet(ui.helper.OSetHelper.strIdentifier);
	img.labelSet = new ui.observable.ObservableSet(ui.helper.OSetHelper.strIdentifier);
	if(ui.helper.ArrayHelper.hasValues(availableConnections)) img.creator = ui.api.TestDao.getRandomFromArray(availableConnections).uid; else img.creator = ui.AgentUi.USER.get_currentAlias().uid;
	if(ui.helper.ArrayHelper.hasValues(availableConnections)) ui.api.TestDao.addConnections(availableConnections,img,1);
	if(ui.helper.ArrayHelper.hasValues(availableLabels)) ui.api.TestDao.addLabels(availableLabels,img,2);
	content.push(img);
	img = new ui.model.ImageContent();
	img.uid = ui.util.UidGenerator.create();
	img.type = "IMAGE";
	img.imgSrc = "media/test/apt.jpg";
	img.caption = "Apartment";
	img.connectionSet = new ui.observable.ObservableSet(ui.helper.OSetHelper.strIdentifier);
	img.labelSet = new ui.observable.ObservableSet(ui.helper.OSetHelper.strIdentifier);
	if(ui.helper.ArrayHelper.hasValues(availableConnections)) img.creator = ui.api.TestDao.getRandomFromArray(availableConnections).uid; else img.creator = ui.AgentUi.USER.get_currentAlias().uid;
	if(ui.helper.ArrayHelper.hasValues(availableConnections)) ui.api.TestDao.addConnections(availableConnections,img,1);
	if(ui.helper.ArrayHelper.hasValues(availableLabels)) ui.api.TestDao.addLabels(availableLabels,img,1);
	content.push(img);
	img = new ui.model.ImageContent();
	img.uid = ui.util.UidGenerator.create();
	img.type = "IMAGE";
	img.imgSrc = "media/test/jrmint.jpg";
	img.caption = "The Junior Mint!";
	img.connectionSet = new ui.observable.ObservableSet(ui.helper.OSetHelper.strIdentifier);
	img.labelSet = new ui.observable.ObservableSet(ui.helper.OSetHelper.strIdentifier);
	if(ui.helper.ArrayHelper.hasValues(availableConnections)) img.creator = ui.api.TestDao.getRandomFromArray(availableConnections).uid; else img.creator = ui.AgentUi.USER.get_currentAlias().uid;
	if(ui.helper.ArrayHelper.hasValues(availableConnections)) ui.api.TestDao.addConnections(availableConnections,img,3);
	if(ui.helper.ArrayHelper.hasValues(availableLabels)) ui.api.TestDao.addLabels(availableLabels,img,2);
	content.push(img);
	img = new ui.model.ImageContent();
	img.uid = ui.util.UidGenerator.create();
	img.type = "IMAGE";
	img.imgSrc = "media/test/oldschool.jpg";
	img.caption = "Retro";
	img.connectionSet = new ui.observable.ObservableSet(ui.helper.OSetHelper.strIdentifier);
	img.labelSet = new ui.observable.ObservableSet(ui.helper.OSetHelper.strIdentifier);
	if(ui.helper.ArrayHelper.hasValues(availableConnections)) img.creator = ui.api.TestDao.getRandomFromArray(availableConnections).uid; else img.creator = ui.AgentUi.USER.get_currentAlias().uid;
	if(ui.helper.ArrayHelper.hasValues(availableConnections)) ui.api.TestDao.addConnections(availableConnections,img,3);
	if(ui.helper.ArrayHelper.hasValues(availableLabels)) ui.api.TestDao.addLabels(availableLabels,img,1);
	content.push(img);
	img = new ui.model.ImageContent();
	img.uid = ui.util.UidGenerator.create();
	img.type = "IMAGE";
	img.imgSrc = "media/test/mailman.jpg";
	img.caption = "Jerry Delivering the mail";
	img.connectionSet = new ui.observable.ObservableSet(ui.helper.OSetHelper.strIdentifier);
	img.labelSet = new ui.observable.ObservableSet(ui.helper.OSetHelper.strIdentifier);
	if(ui.helper.ArrayHelper.hasValues(availableConnections)) img.creator = ui.api.TestDao.getRandomFromArray(availableConnections).uid; else img.creator = ui.AgentUi.USER.get_currentAlias().uid;
	if(ui.helper.ArrayHelper.hasValues(availableConnections)) ui.api.TestDao.addConnections(availableConnections,img,1);
	if(ui.helper.ArrayHelper.hasValues(availableLabels)) ui.api.TestDao.addLabels(availableLabels,img,1);
	content.push(img);
	img = new ui.model.ImageContent();
	img.uid = ui.util.UidGenerator.create();
	img.type = "IMAGE";
	img.imgSrc = "media/test/closet.jpg";
	img.caption = "Stuck in the closet!";
	img.connectionSet = new ui.observable.ObservableSet(ui.helper.OSetHelper.strIdentifier);
	img.labelSet = new ui.observable.ObservableSet(ui.helper.OSetHelper.strIdentifier);
	if(ui.helper.ArrayHelper.hasValues(availableConnections)) img.creator = ui.api.TestDao.getRandomFromArray(availableConnections).uid; else img.creator = ui.AgentUi.USER.get_currentAlias().uid;
	if(ui.helper.ArrayHelper.hasValues(availableConnections)) ui.api.TestDao.addConnections(availableConnections,img,1);
	if(ui.helper.ArrayHelper.hasValues(availableLabels)) ui.api.TestDao.addLabels(availableLabels,img,2);
	content.push(img);
	var urlContent = new ui.model.UrlContent();
	urlContent.uid = ui.util.UidGenerator.create();
	urlContent.type = "URL";
	urlContent.connectionSet = new ui.observable.ObservableSet(ui.helper.OSetHelper.strIdentifier);
	urlContent.labelSet = new ui.observable.ObservableSet(ui.helper.OSetHelper.strIdentifier);
	urlContent.text = "Check out this link";
	urlContent.url = "http://www.bing.com";
	if(ui.helper.ArrayHelper.hasValues(availableConnections)) urlContent.creator = ui.api.TestDao.getRandomFromArray(availableConnections).uid; else urlContent.creator = ui.AgentUi.USER.get_currentAlias().uid;
	if(ui.helper.ArrayHelper.hasValues(availableConnections)) ui.api.TestDao.addConnections(availableConnections,urlContent,1);
	if(ui.helper.ArrayHelper.hasValues(availableLabels)) ui.api.TestDao.addLabels(availableLabels,urlContent,2);
	content.push(urlContent);
	return content;
}
ui.api.TestDao.addConnections = function(availableConnections,content,numToAdd) {
	if(ui.helper.ArrayHelper.hasValues(availableConnections)) {
		if(numToAdd == 1) ui.api.TestDao.addOne(availableConnections,content.connectionSet); else if(numToAdd == 2) ui.api.TestDao.addTwo(availableConnections,content.connectionSet); else ui.api.TestDao.addAll(availableConnections,content.connectionSet);
	}
}
ui.api.TestDao.addLabels = function(availableConnections,content,numToAdd) {
	if(ui.helper.ArrayHelper.hasValues(availableConnections)) {
		if(numToAdd == 1) ui.api.TestDao.addOne(availableConnections,content.labelSet); else if(numToAdd == 2) ui.api.TestDao.addTwo(availableConnections,content.labelSet); else ui.api.TestDao.addAll(availableConnections,content.labelSet);
	}
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
	user.sessionURI = "agent-session://ArtVandelay@session1";
	user.fname = "Jerry";
	user.lname = "Seinfeld";
	user.uid = ui.util.UidGenerator.create();
	user.imgSrc = "media/test/jerry_default.jpg";
	user.aliasSet = new ui.observable.ObservableSet(ui.model.ModelObj.identifier);
	user.aliasSet.addAll(ui.api.TestDao.aliases);
	var alias = ui.api.TestDao.aliases[0];
	alias.connectionSet = new ui.observable.ObservableSet(ui.model.ModelObj.identifier,ui.api.TestDao.connections);
	alias.labelSet = new ui.observable.ObservableSet(ui.model.ModelObj.identifier,ui.api.TestDao.labels);
	user.set_currentAlias(alias);
	return user;
}
ui.api.TestDao.getAlias = function(uid) {
	if(!ui.api.TestDao.initialized) ui.api.TestDao.initialize();
	var alias = ui.helper.ArrayHelper.getElementComplex(ui.api.TestDao.aliases,uid,"uid");
	alias.connectionSet = new ui.observable.ObservableSet(ui.model.ModelObj.identifier,ui.api.TestDao.connections);
	alias.labelSet = new ui.observable.ObservableSet(ui.model.ModelObj.identifier,ui.api.TestDao.labels);
	return alias;
}
ui.exception = {}
ui.exception.Exception = function(message,cause) {
	this.message = message;
	this.cause = cause;
	this.callStack = haxe.CallStack.callStack();
};
$hxClasses["ui.exception.Exception"] = ui.exception.Exception;
ui.exception.Exception.__name__ = ["ui","exception","Exception"];
ui.exception.Exception.prototype = {
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
	,__class__: ui.exception.Exception
}
ui.exception.AjaxException = function(message,cause) {
	ui.exception.Exception.call(this,message,cause);
};
$hxClasses["ui.exception.AjaxException"] = ui.exception.AjaxException;
ui.exception.AjaxException.__name__ = ["ui","exception","AjaxException"];
ui.exception.AjaxException.__super__ = ui.exception.Exception;
ui.exception.AjaxException.prototype = $extend(ui.exception.Exception.prototype,{
	__class__: ui.exception.AjaxException
});
ui.exception.InitializeSessionException = function(error,message,cause) {
	ui.exception.Exception.call(this,message,cause);
	this.error = error;
};
$hxClasses["ui.exception.InitializeSessionException"] = ui.exception.InitializeSessionException;
ui.exception.InitializeSessionException.__name__ = ["ui","exception","InitializeSessionException"];
ui.exception.InitializeSessionException.__super__ = ui.exception.Exception;
ui.exception.InitializeSessionException.prototype = $extend(ui.exception.Exception.prototype,{
	__class__: ui.exception.InitializeSessionException
});
ui.helper = {}
ui.helper.ArrayHelper = function() { }
$hxClasses["ui.helper.ArrayHelper"] = ui.helper.ArrayHelper;
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
ui.helper.OSetHelper = function() { }
$hxClasses["ui.helper.OSetHelper"] = ui.helper.OSetHelper;
ui.helper.OSetHelper.__name__ = ["ui","helper","OSetHelper"];
ui.helper.OSetHelper.getElementComplex = function(oset,value,propOrFcn,startingIndex) {
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
ui.helper.OSetHelper.hasValues = function(oset) {
	return oset != null && oset.iterator().hasNext();
}
ui.helper.OSetHelper.joinX = function(oset,sep,getString) {
	if(getString == null) getString = oset.identifier();
	var s = "";
	var iter = oset.iterator();
	var index = 0;
	while(iter.hasNext()) {
		var t = iter.next();
		var tmp = getString(t);
		if(ui.helper.StringHelper.isNotBlank(tmp)) tmp = StringTools.trim(tmp);
		if(ui.helper.StringHelper.isNotBlank(tmp) && index > 0 && s.length > 0) s += sep;
		s += getString(t);
		index++;
	}
	return s;
}
ui.helper.OSetHelper.strIdentifier = function(str) {
	return str;
}
ui.helper.StringHelper = function() { }
$hxClasses["ui.helper.StringHelper"] = ui.helper.StringHelper;
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
	return str == null || $.trim(str) == "";
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
ui.log = {}
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
ui.log.Logga = function(logLevel) {
	this.initialized = false;
	this.loggerLevel = logLevel;
};
$hxClasses["ui.log.Logga"] = ui.log.Logga;
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
			if((Type.enumEq(level,ui.log.LogLevel.TRACE) || Type.enumEq(level,ui.log.LogLevel.DEBUG)) && this.console.debug != null) this.console.debug(statement); else if(Type.enumEq(level,ui.log.LogLevel.INFO) && this.console.info != null) this.console.info(statement); else if(Type.enumEq(level,ui.log.LogLevel.WARN) && this.console.warn != null) this.console.warn(statement); else if(Type.enumEq(level,ui.log.LogLevel.ERROR) && this.console.error != null) {
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
	,_getLogger: function() {
		this.console = window.console;
		this.initialized = true;
	}
	,__class__: ui.log.Logga
}
ui.model = {}
ui.model.EventModel = function() { }
$hxClasses["ui.model.EventModel"] = ui.model.EventModel;
ui.model.EventModel.__name__ = ["ui","model","EventModel"];
ui.model.EventModel.addListener = function(id,listener) {
	var arr = ui.model.EventModel.hash.get(Std.string(id));
	if(arr == null) {
		arr = new Array();
		ui.model.EventModel.hash.set(Std.string(id),arr);
	}
	arr.push(listener);
}
ui.model.EventModel.change = function(id,t) {
	ui.AgentUi.LOGGER.debug("EVENTMODEL: Change to " + Std.string(id));
	var arr = ui.model.EventModel.hash.get(Std.string(id));
	if(ui.helper.ArrayHelper.hasValues(arr)) {
		var _g1 = 0, _g = arr.length;
		while(_g1 < _g) {
			var l_ = _g1++;
			arr[l_].change(t);
		}
	}
}
ui.model.EventListener = function(fcn) {
	this.fcn = fcn;
	this.uid = ui.util.UidGenerator.create(10);
};
$hxClasses["ui.model.EventListener"] = ui.model.EventListener;
ui.model.EventListener.__name__ = ["ui","model","EventListener"];
ui.model.EventListener.prototype = {
	change: function(t) {
		this.fcn(t);
	}
	,__class__: ui.model.EventListener
}
ui.model.Filter = function(node) {
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
$hxClasses["ui.model.Filter"] = ui.model.Filter;
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
	,__class__: ui.model.Filter
}
ui.model.ModelEvents = $hxClasses["ui.model.ModelEvents"] = { __ename__ : ["ui","model","ModelEvents"], __constructs__ : ["FILTER_RUN","FILTER_CHANGE","MoreContent","NextContent","EndOfContent","NewContentCreated","LoadAlias","AliasLoaded","USER_LOGIN","USER_CREATE","USER_UPDATE","USER_SIGNUP","USER","FitWindow","CreateLabel"] }
ui.model.ModelEvents.FILTER_RUN = ["FILTER_RUN",0];
ui.model.ModelEvents.FILTER_RUN.toString = $estr;
ui.model.ModelEvents.FILTER_RUN.__enum__ = ui.model.ModelEvents;
ui.model.ModelEvents.FILTER_CHANGE = ["FILTER_CHANGE",1];
ui.model.ModelEvents.FILTER_CHANGE.toString = $estr;
ui.model.ModelEvents.FILTER_CHANGE.__enum__ = ui.model.ModelEvents;
ui.model.ModelEvents.MoreContent = ["MoreContent",2];
ui.model.ModelEvents.MoreContent.toString = $estr;
ui.model.ModelEvents.MoreContent.__enum__ = ui.model.ModelEvents;
ui.model.ModelEvents.NextContent = ["NextContent",3];
ui.model.ModelEvents.NextContent.toString = $estr;
ui.model.ModelEvents.NextContent.__enum__ = ui.model.ModelEvents;
ui.model.ModelEvents.EndOfContent = ["EndOfContent",4];
ui.model.ModelEvents.EndOfContent.toString = $estr;
ui.model.ModelEvents.EndOfContent.__enum__ = ui.model.ModelEvents;
ui.model.ModelEvents.NewContentCreated = ["NewContentCreated",5];
ui.model.ModelEvents.NewContentCreated.toString = $estr;
ui.model.ModelEvents.NewContentCreated.__enum__ = ui.model.ModelEvents;
ui.model.ModelEvents.LoadAlias = ["LoadAlias",6];
ui.model.ModelEvents.LoadAlias.toString = $estr;
ui.model.ModelEvents.LoadAlias.__enum__ = ui.model.ModelEvents;
ui.model.ModelEvents.AliasLoaded = ["AliasLoaded",7];
ui.model.ModelEvents.AliasLoaded.toString = $estr;
ui.model.ModelEvents.AliasLoaded.__enum__ = ui.model.ModelEvents;
ui.model.ModelEvents.USER_LOGIN = ["USER_LOGIN",8];
ui.model.ModelEvents.USER_LOGIN.toString = $estr;
ui.model.ModelEvents.USER_LOGIN.__enum__ = ui.model.ModelEvents;
ui.model.ModelEvents.USER_CREATE = ["USER_CREATE",9];
ui.model.ModelEvents.USER_CREATE.toString = $estr;
ui.model.ModelEvents.USER_CREATE.__enum__ = ui.model.ModelEvents;
ui.model.ModelEvents.USER_UPDATE = ["USER_UPDATE",10];
ui.model.ModelEvents.USER_UPDATE.toString = $estr;
ui.model.ModelEvents.USER_UPDATE.__enum__ = ui.model.ModelEvents;
ui.model.ModelEvents.USER_SIGNUP = ["USER_SIGNUP",11];
ui.model.ModelEvents.USER_SIGNUP.toString = $estr;
ui.model.ModelEvents.USER_SIGNUP.__enum__ = ui.model.ModelEvents;
ui.model.ModelEvents.USER = ["USER",12];
ui.model.ModelEvents.USER.toString = $estr;
ui.model.ModelEvents.USER.__enum__ = ui.model.ModelEvents;
ui.model.ModelEvents.FitWindow = ["FitWindow",13];
ui.model.ModelEvents.FitWindow.toString = $estr;
ui.model.ModelEvents.FitWindow.__enum__ = ui.model.ModelEvents;
ui.model.ModelEvents.CreateLabel = ["CreateLabel",14];
ui.model.ModelEvents.CreateLabel.toString = $estr;
ui.model.ModelEvents.CreateLabel.__enum__ = ui.model.ModelEvents;
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
			throw new ui.exception.Exception("don't call me!");
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
	writeResolve: function() {
		this.aliases = this.aliasSet.asArray();
	}
	,readResolve: function() {
		this.aliasSet = new ui.observable.ObservableSet(ui.model.ModelObj.identifier,this.aliases);
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
ui.model.Alias = function() {
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
		this.labelSet = new ui.observable.ObservableSet(ui.model.ModelObj.identifier,this.labels);
		this.connectionSet = new ui.observable.ObservableSet(ui.model.ModelObj.identifier,this.connections);
	}
	,__class__: ui.model.Alias
});
ui.model.Filterable = function() { }
$hxClasses["ui.model.Filterable"] = ui.model.Filterable;
ui.model.Filterable.__name__ = ["ui","model","Filterable"];
ui.model.Label = function(text) {
	this.text = text;
	this.color = ui.util.ColorProvider.getNextColor();
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
	__class__: ui.model.Connection
});
ui.model.Content = function() { }
$hxClasses["ui.model.Content"] = ui.model.Content;
ui.model.Content.__name__ = ["ui","model","Content"];
ui.model.Content.__super__ = ui.model.ModelObj;
ui.model.Content.prototype = $extend(ui.model.ModelObj.prototype,{
	toInsertExpression: function() {
		var str = "InsertContent(";
		var labels = ui.helper.OSetHelper.joinX(this.labelSet,",");
		if(ui.helper.StringHelper.isNotBlank(labels)) {
			if(ui.helper.StringHelper.contains(labels,",")) str += "any(" + labels + ")"; else str += labels;
		} else str += "_";
		str += ",";
		var conns = ui.helper.OSetHelper.joinX(this.connectionSet,",");
		if(ui.helper.StringHelper.isNotBlank(conns)) {
			if(ui.helper.StringHelper.contains(conns,",")) str += "any(" + conns + "," + ui.AgentUi.USER.uid + ")"; else str += conns + "," + ui.AgentUi.USER.uid;
		} else str += ui.AgentUi.USER.uid;
		str += ",";
		str += ui.AgentUi.SERIALIZER.toJsonString(this);
		return str + ")";
	}
	,writeResolve: function() {
		this.labels = this.labelSet.asArray();
		this.connections = this.connectionSet.asArray();
	}
	,readResolve: function() {
		this.labelSet = new ui.observable.ObservableSet(ui.helper.OSetHelper.strIdentifier,this.labels);
		this.connectionSet = new ui.observable.ObservableSet(ui.helper.OSetHelper.strIdentifier,this.connections);
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
ui.model.Node = function() {
	this.type = "ROOT";
};
$hxClasses["ui.model.Node"] = ui.model.Node;
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
	,__class__: ui.model.Node
}
ui.model.And = function() {
	this.nodes = new Array();
};
$hxClasses["ui.model.And"] = ui.model.And;
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
ui.model.Or = function() {
	this.nodes = new Array();
};
$hxClasses["ui.model.Or"] = ui.model.Or;
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
ui.model.ContentNode = function() {
};
$hxClasses["ui.model.ContentNode"] = ui.model.ContentNode;
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
	,__class__: ui.model.ContentNode
});
ui.observable = {}
ui.observable.OSet = function() { }
$hxClasses["ui.observable.OSet"] = ui.observable.OSet;
ui.observable.OSet.__name__ = ["ui","observable","OSet"];
ui.observable.OSet.prototype = {
	__class__: ui.observable.OSet
}
ui.observable.EventManager = function(set) {
	this._set = set;
	this._listeners = [];
};
$hxClasses["ui.observable.EventManager"] = ui.observable.EventManager;
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
	,__class__: ui.observable.EventManager
}
ui.observable.EventType = function(name,add,update) {
	this._name = name;
	this._add = add;
	this._update = update;
};
$hxClasses["ui.observable.EventType"] = ui.observable.EventType;
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
	,__class__: ui.observable.EventType
}
ui.observable.AbstractSet = function() {
	this._eventManager = new ui.observable.EventManager(this);
};
$hxClasses["ui.observable.AbstractSet"] = ui.observable.AbstractSet;
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
	,__class__: ui.observable.AbstractSet
}
ui.observable.ObservableSet = function(identifier,tArr) {
	ui.observable.AbstractSet.call(this);
	this._identifier = identifier;
	this._delegate = new ui.util.SizedMap();
	if(tArr != null) this.addAll(tArr);
};
$hxClasses["ui.observable.ObservableSet"] = ui.observable.ObservableSet;
ui.observable.ObservableSet.__name__ = ["ui","observable","ObservableSet"];
ui.observable.ObservableSet.__super__ = ui.observable.AbstractSet;
ui.observable.ObservableSet.prototype = $extend(ui.observable.AbstractSet.prototype,{
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
	,__class__: ui.observable.ObservableSet
});
ui.observable.MappedSet = function(source,mapper) {
	var _g = this;
	ui.observable.AbstractSet.call(this);
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
$hxClasses["ui.observable.MappedSet"] = ui.observable.MappedSet;
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
	,__class__: ui.observable.MappedSet
});
ui.observable.FilteredSet = function(source,filter) {
	var _g = this;
	ui.observable.AbstractSet.call(this);
	this._filteredSet = new haxe.ds.StringMap();
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
$hxClasses["ui.observable.FilteredSet"] = ui.observable.FilteredSet;
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
	,__class__: ui.observable.FilteredSet
});
ui.observable.GroupedSet = function(source,groupingFn) {
	var _g = this;
	ui.observable.AbstractSet.call(this);
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
$hxClasses["ui.observable.GroupedSet"] = ui.observable.GroupedSet;
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
	,__class__: ui.observable.GroupedSet
});
ui.observable.SortedSet = function(source,sortByFn) {
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
$hxClasses["ui.observable.SortedSet"] = ui.observable.SortedSet;
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
	,__class__: ui.observable.SortedSet
});
ui.serialization = {}
ui.serialization.Serializer = function() {
	this._handlersMap = new haxe.ds.StringMap();
	this.addHandlerViaName("Array<Dynamic>",new ui.serialization.DynamicArrayHandler());
};
$hxClasses["ui.serialization.Serializer"] = ui.serialization.Serializer;
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
			case 7:
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
	,__class__: ui.serialization.Serializer
}
ui.serialization.TypeHandler = function() { }
$hxClasses["ui.serialization.TypeHandler"] = ui.serialization.TypeHandler;
ui.serialization.TypeHandler.__name__ = ["ui","serialization","TypeHandler"];
ui.serialization.TypeHandler.prototype = {
	__class__: ui.serialization.TypeHandler
}
ui.serialization.ArrayHandler = function(parms,serializer) {
	this._parms = parms;
	this._serializer = serializer;
	this._elementHandler = this._serializer.getHandler(this._parms.first());
};
$hxClasses["ui.serialization.ArrayHandler"] = ui.serialization.ArrayHandler;
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
	,__class__: ui.serialization.ArrayHandler
}
ui.serialization.EnumHandler = function(enumName,parms) {
	this._enumName = enumName;
	this._parms = parms;
	this._enum = Type.resolveEnum(this._enumName);
	if(this._enum == null) throw new ui.serialization.JsonException("no enum named " + this._enumName + " found");
	this._enumValues = Type.allEnums(this._enum);
};
$hxClasses["ui.serialization.EnumHandler"] = ui.serialization.EnumHandler;
ui.serialization.EnumHandler.__name__ = ["ui","serialization","EnumHandler"];
ui.serialization.EnumHandler.__interfaces__ = [ui.serialization.TypeHandler];
ui.serialization.EnumHandler.prototype = {
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
	,__class__: ui.serialization.EnumHandler
}
ui.serialization.ValueTypeHandler = function(valueType) {
	this._valueType = valueType;
};
$hxClasses["ui.serialization.ValueTypeHandler"] = ui.serialization.ValueTypeHandler;
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
	,__class__: ui.serialization.ValueTypeHandler
}
ui.serialization.DynamicArrayHandler = function() {
};
$hxClasses["ui.serialization.DynamicArrayHandler"] = ui.serialization.DynamicArrayHandler;
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
ui.serialization.DynamicHandler = function() {
};
$hxClasses["ui.serialization.DynamicHandler"] = ui.serialization.DynamicHandler;
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
ui.serialization.IntHandler = function() {
	ui.serialization.ValueTypeHandler.call(this,ValueType.TInt);
};
$hxClasses["ui.serialization.IntHandler"] = ui.serialization.IntHandler;
ui.serialization.IntHandler.__name__ = ["ui","serialization","IntHandler"];
ui.serialization.IntHandler.__super__ = ui.serialization.ValueTypeHandler;
ui.serialization.IntHandler.prototype = $extend(ui.serialization.ValueTypeHandler.prototype,{
	__class__: ui.serialization.IntHandler
});
ui.serialization.FloatHandler = function() {
	ui.serialization.ValueTypeHandler.call(this,ValueType.TFloat);
};
$hxClasses["ui.serialization.FloatHandler"] = ui.serialization.FloatHandler;
ui.serialization.FloatHandler.__name__ = ["ui","serialization","FloatHandler"];
ui.serialization.FloatHandler.__super__ = ui.serialization.ValueTypeHandler;
ui.serialization.FloatHandler.prototype = $extend(ui.serialization.ValueTypeHandler.prototype,{
	__class__: ui.serialization.FloatHandler
});
ui.serialization.BoolHandler = function() {
	ui.serialization.ValueTypeHandler.call(this,ValueType.TBool);
};
$hxClasses["ui.serialization.BoolHandler"] = ui.serialization.BoolHandler;
ui.serialization.BoolHandler.__name__ = ["ui","serialization","BoolHandler"];
ui.serialization.BoolHandler.__super__ = ui.serialization.ValueTypeHandler;
ui.serialization.BoolHandler.prototype = $extend(ui.serialization.ValueTypeHandler.prototype,{
	__class__: ui.serialization.BoolHandler
});
ui.serialization.StringHandler = function() {
};
$hxClasses["ui.serialization.StringHandler"] = ui.serialization.StringHandler;
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
ui.serialization.FunctionHandler = function() {
};
$hxClasses["ui.serialization.FunctionHandler"] = ui.serialization.FunctionHandler;
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
ui.serialization.Field = function() {
	this.required = true;
};
$hxClasses["ui.serialization.Field"] = ui.serialization.Field;
ui.serialization.Field.__name__ = ["ui","serialization","Field"];
ui.serialization.Field.prototype = {
	__class__: ui.serialization.Field
}
ui.serialization.ClassHandler = function(clazz,typename,serializer) {
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
$hxClasses["ui.serialization.ClassHandler"] = ui.serialization.ClassHandler;
ui.serialization.ClassHandler.__name__ = ["ui","serialization","ClassHandler"];
ui.serialization.ClassHandler.__interfaces__ = [ui.serialization.TypeHandler];
ui.serialization.ClassHandler.prototype = {
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
		if(instance.readResolve != null && Reflect.isFunction(instance.readResolve)) instance.readResolve();
		return instance;
	}
	,createInstance: function() {
		return Type.createInstance(this._clazz,[]);
	}
	,__class__: ui.serialization.ClassHandler
}
ui.serialization.JsonException = function(msg,cause) {
	ui.exception.Exception.call(this,msg,cause);
};
$hxClasses["ui.serialization.JsonException"] = ui.serialization.JsonException;
ui.serialization.JsonException.__name__ = ["ui","serialization","JsonException"];
ui.serialization.JsonException.__super__ = ui.exception.Exception;
ui.serialization.JsonException.prototype = $extend(ui.exception.Exception.prototype,{
	__class__: ui.serialization.JsonException
});
ui.serialization.JsonReader = function(serializer,strict) {
	this._serializer = serializer;
	this.stack = new Array();
	this.warnings = new Array();
	this.strict = strict;
};
$hxClasses["ui.serialization.JsonReader"] = ui.serialization.JsonReader;
ui.serialization.JsonReader.__name__ = ["ui","serialization","JsonReader"];
ui.serialization.JsonReader.prototype = {
	error: function(msg,cause) {
		if(this.strict) throw new ui.serialization.JsonException(msg,cause); else return null;
	}
	,read: function(fromJson,clazz,instance) {
		var handler = this._serializer.getHandlerViaClass(clazz);
		this.instance = handler.read(fromJson,this,instance);
	}
	,__class__: ui.serialization.JsonReader
}
ui.serialization.JsonWriter = function(serializer) {
	this._serializer = serializer;
};
$hxClasses["ui.serialization.JsonWriter"] = ui.serialization.JsonWriter;
ui.serialization.JsonWriter.__name__ = ["ui","serialization","JsonWriter"];
ui.serialization.JsonWriter.prototype = {
	write: function(value) {
		var clazz = ui.serialization.TypeTools.clazz(value);
		var handler = this._serializer.getHandlerViaClass(clazz);
		return handler.write(value,this);
	}
	,__class__: ui.serialization.JsonWriter
}
ui.serialization.TypeTools = function() { }
$hxClasses["ui.serialization.TypeTools"] = ui.serialization.TypeTools;
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
ui.serialization.CTypeTools = function() { }
$hxClasses["ui.serialization.CTypeTools"] = ui.serialization.CTypeTools;
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
		case 7:
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
ui.serialization.ValueTypeTools = function() { }
$hxClasses["ui.serialization.ValueTypeTools"] = ui.serialization.ValueTypeTools;
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
		}
		return $r;
	}(this));
}
ui.util = {}
ui.util.FixedSizeArray = function(maxSize) {
	this._maxSize = maxSize;
	this._delegate = new Array();
};
$hxClasses["ui.util.FixedSizeArray"] = ui.util.FixedSizeArray;
ui.util.FixedSizeArray.__name__ = ["ui","util","FixedSizeArray"];
ui.util.FixedSizeArray.prototype = {
	contains: function(t) {
		return ui.helper.ArrayHelper.contains(this._delegate,t);
	}
	,push: function(t) {
		if(this._delegate.length >= this._maxSize) this._delegate.shift();
		this._delegate.push(t);
	}
	,__class__: ui.util.FixedSizeArray
}
ui.util.ColorProvider = function() { }
$hxClasses["ui.util.ColorProvider"] = ui.util.ColorProvider;
ui.util.ColorProvider.__name__ = ["ui","util","ColorProvider"];
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
ui.util.HtmlUtil = function() { }
$hxClasses["ui.util.HtmlUtil"] = ui.util.HtmlUtil;
ui.util.HtmlUtil.__name__ = ["ui","util","HtmlUtil"];
ui.util.HtmlUtil.readCookie = function(name) {
	return js.Cookie.get(name);
}
ui.util.HtmlUtil.setCookie = function(name,value) {
	js.Cookie.set(name,value);
}
ui.util.HtmlUtil.getUrlVars = function() {
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
ui.util.M = function() { }
$hxClasses["ui.util.M"] = ui.util.M;
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
ui.util.SizedMap = function() {
	haxe.ds.StringMap.call(this);
	this.size = 0;
};
$hxClasses["ui.util.SizedMap"] = ui.util.SizedMap;
ui.util.SizedMap.__name__ = ["ui","util","SizedMap"];
ui.util.SizedMap.__super__ = haxe.ds.StringMap;
ui.util.SizedMap.prototype = $extend(haxe.ds.StringMap.prototype,{
	remove: function(key) {
		if(this.exists(key)) this.size--;
		return haxe.ds.StringMap.prototype.remove.call(this,key);
	}
	,set: function(key,val) {
		if(!this.exists(key)) this.size++;
		haxe.ds.StringMap.prototype.set.call(this,key,val);
	}
	,__class__: ui.util.SizedMap
});
ui.util.UidGenerator = function() { }
$hxClasses["ui.util.UidGenerator"] = ui.util.UidGenerator;
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
ui.widget = {}
ui.widget.Widgets = function() { }
$hxClasses["ui.widget.Widgets"] = ui.widget.Widgets;
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
ui.widget.ChatOrientation = $hxClasses["ui.widget.ChatOrientation"] = { __ename__ : ["ui","widget","ChatOrientation"], __constructs__ : ["chatRight","chatLeft"] }
ui.widget.ChatOrientation.chatRight = ["chatRight",0];
ui.widget.ChatOrientation.chatRight.toString = $estr;
ui.widget.ChatOrientation.chatRight.__enum__ = ui.widget.ChatOrientation;
ui.widget.ChatOrientation.chatLeft = ["chatLeft",1];
ui.widget.ChatOrientation.chatLeft.toString = $estr;
ui.widget.ChatOrientation.chatLeft.__enum__ = ui.widget.ChatOrientation;
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
ui.jq = function() {}
$.fn.exists = function() {
	return $(this).length > 0;
};
$.fn.isVisible = function() {
	return $(this).css("display") != "none";
};
$.fn.hasAttr = function(name) {
	return $(this).attr(name) != undefined;
};
ui.jq.JDialog = window.jQuery;
var defineWidget = function() {
	return { options : { autoOpen : true, height : 320, width : 320, modal : true, buttons : { }, showHelp : false}, _create : function() {
		this._super("create");
		var self = this;
		var selfElement = this.element;
		if(self.options.showHelp) {
			if(!Reflect.isFunction(self.options.buildHelp)) ui.AgentUi.LOGGER.error("Supposed to show help but buildHelp is not a function"); else {
				var helpIconWrapper = new $("<a href='#' class='ui-dialog-titlebar-close ui-corner-all' style='right: 1.5em;' role='button'>");
				var helpIcon = new $("<span class='ui-icon ui-icon-help'>close</span>");
				helpIconWrapper.hover(function(evt) {
					$(this).addClass("ui-state-hover");
				},function(evt) {
					$(this).removeClass("ui-state-hover");
				});
				helpIconWrapper.append(helpIcon);
				selfElement.prev().find(".ui-dialog-titlebar-close").before(helpIconWrapper);
				helpIconWrapper.click(function(evt) {
					self.options.buildHelp();
				});
			}
		}
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.jdialog",$.ui.dialog,defineWidget());
ui.jq.JQSortable = window.jQuery;
ui.jq.JQDraggable = window.jQuery;
ui.jq.JQDroppable = window.jQuery;
ui.jq.JQTooltip = window.jQuery;
ui.model.EventModel.hash = new haxe.ds.StringMap();
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
		var filter = js.Boot.__cast(selfElement.closest("#filter") , ui.widget.FilterComp);
		filter.filterComp("fireFilter");
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.andOrToggle",defineWidget());
ui.widget.ChatMessageComp = window.jQuery;
var defineWidget = function() {
	return { options : { message : null, orientation : null}, _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new ui.exception.Exception("Root of ChatMessageComp must be a div element");
		selfElement.addClass("chatMessageComp ui-helper-clearfix " + Std.string(self.options.orientation) + ui.widget.Widgets.getWidgetClasses());
		new $("<div>" + self.options.message.text + "</div>").appendTo(selfElement);
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.chatMessageComp",defineWidget());
ui.widget.ChatComp = window.jQuery;
var defineWidget = function() {
	return { options : { connection : null, messages : null}, _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new ui.exception.Exception("Root of ChatComp must be a div element");
		selfElement.addClass("chatComp " + ui.widget.Widgets.getWidgetClasses());
		var chatMsgs = new $("<div class='chatMsgs'></div>").appendTo(selfElement);
		var chatInput = new $("<div class='chatInput'></div>").appendTo(selfElement);
		var input = new $("<input class='ui-corner-all ui-widget-content boxsizingBorder' />").appendTo(chatInput);
		self.chatMessages = new ui.observable.MappedSet(self.options.messages,function(msg) {
			return new ui.widget.ChatMessageComp("<div></div>").chatMessageComp({ message : msg, orientation : ui.widget.ChatOrientation.chatRight});
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
			return (js.Boot.__cast(fc , $)).attr("id");
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
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.filterCombination",defineWidget());
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
		var img = new $("<img src='" + self.options.connection.imgSrc + "' class='shadow'/>");
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
				clone.addClass("filterTrashable " + Std.string(_ui.draggable.data("dropTargetClass")));
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
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.connectionAvatar",defineWidget());
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
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.connectionComp",defineWidget());
ui.widget.ConnectionsList = window.jQuery;
var defineWidget = function() {
	return { options : { itemsClass : null}, _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new ui.exception.Exception("Root of ConnectionsList must be a div element");
		selfElement.addClass(ui.widget.Widgets.getWidgetClasses());
		ui.model.EventModel.addListener(ui.model.ModelEvents.AliasLoaded,new ui.model.EventListener(function(alias) {
			self._setConnections(alias.connectionSet);
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
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.connectionsList",defineWidget());
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
ui.widget.ContentComp = window.jQuery;
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new ui.exception.Exception("Root of ContentComp must be a div element");
		selfElement.addClass("post container shadow " + ui.widget.Widgets.getWidgetClasses());
		var postWr = new $("<section class='postWr'></section>");
		selfElement.append(postWr);
		var postContentWr = new $("<div class='postContentWr'></div>");
		postWr.append(postContentWr);
		var postContent = new $("<div class='postContent'></div>");
		postContentWr.append(postContent);
		if(self.options.content.type == "AUDIO") {
			var audio = js.Boot.__cast(self.options.content , ui.model.AudioContent);
			postContent.append(audio.title + "<br/>");
			var audioControls = new $("<audio controls></audio>");
			postContent.append(audioControls);
			audioControls.append("<source src='" + audio.audioSrc + "' type='" + audio.audioType + "'>Your browser does not support the audio element.");
		} else if(self.options.content.type == "IMAGE") {
			var img = js.Boot.__cast(self.options.content , ui.model.ImageContent);
			postContent.append("<img alt='" + img.caption + "' src='" + img.imgSrc + "'/>");
		} else if(self.options.content.type == "URL") {
			var urlContent = js.Boot.__cast(self.options.content , ui.model.UrlContent);
			postContent.append("<img alt='preview' src='http://api.thumbalizr.com/?api_key=2e63db21c89b06a54fd2eac5fd96e488&url=" + urlContent.url + "'/>");
		} else ui.AgentUi.LOGGER.error("Dont know how to handle " + self.options.content.type);
		var postCreator = new $("<aside class='postCreator'></aside>").appendTo(postWr);
		var connection = ui.helper.OSetHelper.getElementComplex(ui.AgentUi.USER.get_currentAlias().connectionSet,self.options.content.creator);
		if(connection == null) connection = ui.helper.ModelHelper.asConnection(ui.AgentUi.USER.get_currentAlias());
		new ui.widget.ConnectionAvatar("<div></div>").connectionAvatar({ dndEnabled : false, connection : connection}).appendTo(postCreator);
		var postLabels = new $("<aside class='postLabels'></div>");
		postWr.append(postLabels);
		var labelIter = self.options.content.labelSet.iterator();
		while(labelIter.hasNext()) {
			var label = ui.helper.OSetHelper.getElementComplex(ui.AgentUi.USER.get_currentAlias().labelSet,labelIter.next());
			new ui.widget.LabelComp("<div class='small'></div>").labelComp({ dndEnabled : false, label : label}).appendTo(postLabels);
		}
		var postConnections = new $("<aside class='postConnections'></aside>").appendTo(postWr);
		var connIter = self.options.content.connectionSet.iterator();
		while(connIter.hasNext()) {
			var connection1 = ui.helper.OSetHelper.getElementComplex(ui.AgentUi.USER.get_currentAlias().connectionSet,connIter.next());
			new ui.widget.ConnectionAvatar("<div></div>").connectionAvatar({ dndEnabled : false, connection : connection1}).appendTo(postConnections);
		}
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.contentComp",defineWidget());
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
			if(evt.isAdd()) new $("#postInput").after(contentComp); else if(evt.isUpdate()) contentComp.contentComp("update"); else if(evt.isDelete()) contentComp.remove();
		});
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.contentFeed",defineWidget());
ui.widget.LiveBuildToggle = window.jQuery;
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new ui.exception.Exception("Root of LiveBuildToggle must be a div element");
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
		var filter = js.Boot.__cast(selfElement.closest("#filter") , ui.widget.FilterComp);
		filter.filterComp("fireFilter");
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.liveBuildToggle",defineWidget());
ui.widget.FilterComp = window.jQuery;
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new ui.exception.Exception("Root of FilterComp must be a div element");
		selfElement.addClass("connectionDT labelDT dropCombiner " + ui.widget.Widgets.getWidgetClasses());
		var toggle = new ui.widget.AndOrToggle("<div class='rootToggle andOrToggle'></div>").andOrToggle();
		selfElement.append(toggle);
		var liveToggle = new ui.widget.LiveBuildToggle("<div class='liveBuildToggle'></div>").liveBuildToggle();
		selfElement.append(liveToggle);
		(js.Boot.__cast(selfElement , ui.jq.JQDroppable)).droppable({ accept : function(d) {
			return d["is"](".filterable");
		}, activeClass : "ui-state-hover", hoverClass : "ui-state-active", drop : function(event,_ui) {
			var clone = (_ui.draggable.data("clone"))(_ui.draggable,false,"#filter");
			var cloneOffset = clone.offset();
			clone.addClass("filterTrashable " + Std.string(_ui.draggable.data("dropTargetClass")));
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
		var liveToggle = js.Boot.__cast(selfElement.children(".liveBuildToggle") , ui.widget.LiveBuildToggle);
		var root = (selfElement.children(".rootToggle").data("getNode"))();
		root.type = "ROOT";
		var filterables = selfElement.children(".filterable");
		filterables.each(function(idx,el) {
			var filterable = new ui.widget.FilterableComponent(el);
			var node = (filterable.data("getNode"))();
			root.addNode(node);
		});
		if(!js.Boot.__cast(liveToggle.liveBuildToggle("isLive") , Bool)) ui.model.EventModel.change(ui.model.ModelEvents.FILTER_CHANGE,new ui.model.Filter(root)); else ui.model.EventModel.change(ui.model.ModelEvents.FILTER_RUN,new ui.model.Filter(root));
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.filterComp",defineWidget());
ui.widget.InviteComp = window.jQuery;
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new ui.exception.Exception("Root of InviteComp must be a div element");
		selfElement.addClass("inviteComp ui-helper-clearfix " + ui.widget.Widgets.getWidgetClasses());
		var input = new $("<input id=\"sideRightInviteInput\" style=\"display: none;\" class=\"ui-widget-content boxsizingBorder textInput\"/>");
		var input_placeHolder = new $("<input id=\"sideRightInviteInput_PH\" class=\"placeholder ui-widget-content boxsizingBorder textInput\" value=\"Enter Email Address\"/>");
		var btn = new $("<button class='fright'>Invite</button>").button();
		selfElement.append(input).append(input_placeHolder).append(btn);
		input_placeHolder.focus(function(evt) {
			input_placeHolder.hide();
			input.show().focus();
		});
		input.blur(function(evt) {
			if(ui.helper.StringHelper.isBlank(input.val())) {
				input_placeHolder.show();
				input.hide();
			}
		});
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.inviteComp",defineWidget());
ui.widget.LabelTreeBranch = window.jQuery;
var defineWidget = function() {
	return { options : { label : null, children : null, classes : null}, _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new ui.exception.Exception("Root of LabelTreeBranch must be a div element");
		selfElement.addClass("labelTreeBranch ");
		var expander = new $("<div class='labelTreeExpander' style='visibility:hidden;'>+</div>");
		selfElement.append(expander);
		var label = new ui.widget.LabelComp("<div></div>").labelComp({ label : self.options.label, isDragByHelper : true, containment : false});
		selfElement.append(label);
		selfElement.hover(function() {
			if(self.options.children.iterator().hasNext()) expander.css("visibility","visible");
		},function() {
			expander.css("visibility","hidden");
		});
		if(self.options.children != null) {
			var labelChildren = new ui.widget.LabelTree("<div class='labelChildren' style='display: none;'></div>");
			labelChildren.labelTree({ labels : self.options.children});
			selfElement.append(labelChildren);
			label.add(expander).click(function(evt) {
				labelChildren.toggle();
				ui.model.EventModel.change(ui.model.ModelEvents.FitWindow);
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
ui.widget.LabelTree = window.jQuery;
var defineWidget = function() {
	return { options : { labels : null, itemsClass : null}, _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new ui.exception.Exception("Root of LabelTree must be a div element");
		selfElement.addClass("labelTree " + ui.widget.Widgets.getWidgetClasses());
		self.labels = new ui.observable.MappedSet(self.options.labels,function(label) {
			return new ui.widget.LabelTreeBranch("<div></div>").labelTreeBranch({ label : label, children : new ui.observable.FilteredSet(ui.AgentUi.USER.get_currentAlias().labelSet,function(child) {
				return child.parentUid == label.uid;
			})});
		});
		self.labels.listen(function(labelTreeBranch,evt) {
			if(evt.isAdd()) selfElement.append(labelTreeBranch); else if(evt.isUpdate()) labelTreeBranch.labelTreeBranch("update"); else if(evt.isDelete()) labelTreeBranch.remove();
		});
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.labelTree",defineWidget());
ui.widget.Popup = window.jQuery;
var defineWidget = function() {
	return { options : { createFcn : null, modal : false, positionalElement : null}, _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new ui.exception.Exception("Root of Popup must be a div element");
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
ui.widget.LabelsList = window.jQuery;
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new ui.exception.Exception("Root of LabelsList must be a div element");
		selfElement.addClass("icontainer labelsList " + ui.widget.Widgets.getWidgetClasses());
		ui.model.EventModel.addListener(ui.model.ModelEvents.AliasLoaded,new ui.model.EventListener(function(alias) {
			self._setLabels(alias.labelSet);
		}));
		var newLabelButton = new $("<button class='newLabelButton'>New Label</button>");
		selfElement.append(newLabelButton).append("<div class='clear'></div>");
		newLabelButton.button().click(function(evt) {
			evt.stopPropagation();
			var popup = new ui.widget.Popup("<div style='position: absolute;width:300px;'></div>");
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
				var parent = new $("<select id='labelParent' class='ui-corner-left ui-widget-content' style='width: 191px;'><option>No Parent</option></select>").appendTo(container);
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
					label.uid = ui.util.UidGenerator.create();
					ui.model.EventModel.change(ui.model.ModelEvents.CreateLabel,label);
					new $("body").click();
				};
			}, positionalElement : newLabelButton});
		});
	}, _setLabels : function(labels) {
		var self = this;
		var selfElement = this.element;
		selfElement.children(".labelTree").remove();
		var labelTree = new ui.widget.LabelTree("<div id='labels' class='labelDT'></div>").labelTree({ labels : new ui.observable.FilteredSet(labels,function(label) {
			return ui.helper.StringHelper.isBlank(label.parentUid);
		})});
		selfElement.prepend(labelTree);
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.labelsList",defineWidget());
ui.widget.NewUserComp = window.jQuery;
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new ui.exception.Exception("Root of NewUserComp must be a div element");
		self._cancelled = false;
		selfElement.addClass("newUserComp").hide();
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
			if(ui.helper.StringHelper.isBlank(self.input_n.val())) {
				self.placeholder_n.show();
				self.input_n.hide();
			}
		});
		self.placeholder_pw.focus(function(evt) {
			self.placeholder_pw.hide();
			self.input_pw.show().focus();
		});
		self.input_pw.blur(function(evt) {
			if(ui.helper.StringHelper.isBlank(self.input_pw.val())) {
				self.placeholder_pw.show();
				self.input_pw.hide();
			}
		});
		self.placeholder_em.focus(function(evt) {
			self.placeholder_em.hide();
			self.input_em.show().focus();
		});
		self.input_em.blur(function(evt) {
			if(ui.helper.StringHelper.isBlank(self.input_em.val())) {
				self.placeholder_em.show();
				self.input_em.hide();
			}
		});
		ui.model.EventModel.addListener(ui.model.ModelEvents.USER,new ui.model.EventListener(function(user) {
			self._setUser(user);
		}));
	}, initialized : false, _createNewUser : function() {
		var self = this;
		var selfElement1 = this.element;
		var valid = true;
		var newUser = new ui.model.NewUser();
		newUser.pwd = self.input_pw.val();
		if(ui.helper.StringHelper.isBlank(newUser.pwd)) {
			self.placeholder_pw.addClass("ui-state-error");
			valid = false;
		}
		newUser.email = self.input_em.val();
		if(ui.helper.StringHelper.isBlank(newUser.email)) {
			self.placeholder_em.addClass("ui-state-error");
			valid = false;
		}
		newUser.name = self.input_n.val();
		if(ui.helper.StringHelper.isBlank(newUser.name)) {
			self.placeholder_n.addClass("ui-state-error");
			valid = false;
		}
		if(!valid) return;
		selfElement1.find(".ui-state-error").removeClass("ui-state-error");
		ui.model.EventModel.change(ui.model.ModelEvents.USER_CREATE,newUser);
		ui.model.EventModel.addListener(ui.model.ModelEvents.USER_SIGNUP,new ui.model.EventListener(function(n) {
			selfElement1.jdialog("close");
		}));
	}, _buildDialog : function() {
		var self1 = this;
		var selfElement2 = this.element;
		self1.initialized = true;
		var dlgOptions = { autoOpen : false, title : "Create New Agent", height : 320, width : 400, buttons : { 'Create my Agent' : function() {
			self1._createNewUser();
		}, Cancel : function() {
			self1._cancelled = true;
			$(this).jdialog("close");
		}}, close : function(evt,ui1) {
			selfElement2.find(".placeholder").removeClass("ui-state-error");
			if(self1.user == null || !self1.user.hasValidSession()) ui.AgentUi.showLogin();
		}};
		selfElement2.jdialog(dlgOptions);
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
		selfElement.jdialog("open");
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.newUserComp",defineWidget());
ui.widget.LoginComp = window.jQuery;
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new ui.exception.Exception("Root of LoginComp must be a div element");
		self._newUser = false;
		selfElement.addClass("loginComp").hide();
		var labels = new $("<div class='fleft'></div>").appendTo(selfElement);
		var inputs = new $("<div class='fleft'></div>").appendTo(selfElement);
		if(ui.helper.StringHelper.isBlank(ui.AgentUi.agentURI)) labels.append("<div class='labelDiv'><label id='un_label' for='login_un'>Email</label></div>");
		labels.append("<div class='labelDiv'><label for='login_pw'>Password</label></div>");
		if(ui.helper.StringHelper.isBlank(ui.AgentUi.agentURI)) {
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
		if(ui.helper.StringHelper.isBlank(ui.AgentUi.agentURI)) {
			self.placeholder_un.focus(function(evt) {
				self.placeholder_un.hide();
				self.input_un.show().focus();
			});
			self.input_un.blur(function(evt) {
				if(ui.helper.StringHelper.isBlank(self.input_un.val())) {
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
			if(ui.helper.StringHelper.isBlank(self.input_pw.val())) {
				self.placeholder_pw.show();
				self.input_pw.hide();
			}
		});
		ui.model.EventModel.addListener(ui.model.ModelEvents.USER,new ui.model.EventListener(function(user) {
			self._setUser(user);
			if(user == null) self.open();
		}));
	}, initialized : false, _login : function() {
		var self = this;
		var selfElement1 = this.element;
		var valid = true;
		var login;
		if(ui.helper.StringHelper.isNotBlank(ui.AgentUi.agentURI)) {
			login = new ui.model.LoginById();
			(js.Boot.__cast(login , ui.model.LoginById)).uuid = ui.AgentUi.agentURI;
		} else {
			login = new ui.model.LoginByUn();
			var l = js.Boot.__cast(login , ui.model.LoginByUn);
			l.email = self.input_un.val();
			if(ui.helper.StringHelper.isBlank(l.email) && ui.helper.StringHelper.isBlank(ui.AgentUi.agentURI)) {
				self.placeholder_un.addClass("ui-state-error");
				valid = false;
			}
		}
		login.password = self.input_pw.val();
		if(ui.helper.StringHelper.isBlank(login.password)) {
			self.placeholder_pw.addClass("ui-state-error");
			valid = false;
		}
		if(!valid) return;
		selfElement1.find(".ui-state-error").removeClass("ui-state-error");
		ui.model.EventModel.change(ui.model.ModelEvents.USER_LOGIN,login);
		ui.model.EventModel.addListener(ui.model.ModelEvents.USER,new ui.model.EventListener(function(n) {
			selfElement1.jdialog("close");
		}));
	}, _buildDialog : function() {
		var self1 = this;
		var selfElement = this.element;
		self1.initialized = true;
		var dlgOptions = { autoOpen : false, title : "Login", height : 280, width : 400, buttons : { Login : function() {
			self1._login();
		}, 'I\'m New' : function() {
			self1._newUser = true;
			$(this).jdialog("close");
			ui.AgentUi.showNewUser();
		}}, beforeClose : function(evt,ui1) {
			if(!self1._newUser && (self1.user == null || !self1.user.hasValidSession())) {
				js.Lib.alert("A valid user is required to use the app");
				return false;
			}
			return true;
		}};
		selfElement.jdialog(dlgOptions);
	}, _setUser : function(user) {
		var self = this;
		self.user = user;
	}, open : function() {
		var self = this;
		var selfElement = this.element;
		self._newUser = false;
		if(!self.initialized) self._buildDialog();
		selfElement.children("#un_label").focus();
		if(ui.helper.StringHelper.isBlank(ui.AgentUi.agentURI)) self.input_un.blur();
		selfElement.jdialog("open");
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.loginComp",defineWidget());
ui.widget.MessagingComp = window.jQuery;
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new ui.exception.Exception("Root of MessagingComp must be a div element");
		selfElement.tabs({ activate : function(evt,ui1) {
			ui1.newPanel.find(".chatMsgs").each(function() {
				$(this).scrollTop($(this).height());
			});
		}}).find(".ui-tabs-nav").sortable({ axis : "x", stop : function() {
			selfElement.tabs("refresh");
		}});
		selfElement.addClass("messagingComp icontainer " + ui.widget.Widgets.getWidgetClasses());
		var ul = new $("<ul></ul>").appendTo(selfElement);
		(js.Boot.__cast(selfElement , ui.jq.JQDroppable)).droppable({ accept : function(d) {
			return d["is"](".connectionAvatar");
		}, activeClass : "ui-state-hover", hoverClass : "ui-state-active", greedy : true, drop : function(event,_ui) {
			var connection = (js.Boot.__cast(_ui.draggable , ui.widget.ConnectionAvatar)).connectionAvatar("option","connection");
			var id = "chat-" + connection.uid;
			var li = new $("<li><a href='#" + id + "'><img src='" + connection.imgSrc + "'></a></li>").appendTo(ul);
			var chatComp = new ui.widget.ChatComp("<div id='" + id + "'></div>").chatComp({ connection : connection, messages : new ui.observable.ObservableSet(ui.model.ModelObj.identifier)});
			chatComp.appendTo(selfElement);
			selfElement.tabs("refresh");
		}, tolerance : "pointer"});
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.messagingComp",defineWidget());
ui.widget.UrlComp = window.jQuery;
var defineWidget = function() {
	return { _create : function() {
		ui.widget.UrlComp.API_KEY = "2e63db21c89b06a54fd2eac5fd96e488";
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new ui.exception.Exception("Root of UrlComp must be a div element");
		selfElement.addClass("urlComp container " + ui.widget.Widgets.getWidgetClasses());
		new $("<label class='fleft ui-helper-clearfix' style='margin-left: 5px;'>Enter URL</label>").appendTo(selfElement);
		self.urlInput = new $("<input id='' class='clear textInput boxsizingBorder' style='float: left;margin-top: 5px;'/>").appendTo(selfElement);
	}, _post : function() {
		var self = this;
		var selfElement = this.element;
		ui.AgentUi.LOGGER.debug("post " + self.urlInput.val());
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.urlComp",defineWidget());
ui.widget.UploadComp = window.jQuery;
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new ui.exception.Exception("Root of UploadComp must be a div element");
		selfElement.addClass("uploadComp container " + ui.widget.Widgets.getWidgetClasses());
		var filesUpload = new $("<input id='files-upload' type='file' multiple style='float: left;margin-top: 25px;margin-left: 25px;'/>").appendTo(selfElement);
		filesUpload.change(function(evt) {
			self._traverseFiles(this.files);
		});
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
	}, _uploadFile : function(file) {
		var self = this;
		var selfElement = this.element;
		ui.AgentUi.LOGGER.debug("upload " + Std.string(file.name));
		if(typeof FileReader !== 'undefined' && new EReg("image","i").match(file.type)) {
			var img = new $("<img style='max-height: 90px;'/>").appendTo(selfElement);
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
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.uploadComp",defineWidget());
ui.widget.PostComp = window.jQuery;
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new ui.exception.Exception("Root of PostComp must be a div element");
		selfElement.addClass("postComp container shadow " + ui.widget.Widgets.getWidgetClasses());
		var section = new $("<section id='postSection'></section>").appendTo(selfElement);
		var addConnectionsAndLabels = null;
		var textInput = new $("<div class='postContainer'></div>").appendTo(section);
		var ta = new $("<textarea class='boxsizingBorder container' style='resize: none;'></textarea>").appendTo(textInput).keypress(function(evt) {
			if(!(evt.altKey || evt.shiftKey || evt.ctrlKey) && evt.charCode == 13) {
				ui.AgentUi.LOGGER.debug("Post new text content");
				evt.preventDefault();
				var msg = new ui.model.MessageContent();
				msg.text = $(this).val();
				msg.connectionSet = new ui.observable.ObservableSet(ui.helper.OSetHelper.strIdentifier);
				msg.labelSet = new ui.observable.ObservableSet(ui.helper.OSetHelper.strIdentifier);
				addConnectionsAndLabels(msg);
				msg.type = "TEXT";
				msg.uid = ui.util.UidGenerator.create();
				ui.model.EventModel.change(ui.model.ModelEvents.NewContentCreated,msg);
				$(this).val("");
			}
		});
		var urlInput = new ui.widget.UrlComp("<div class='postContainer boxsizingBorder'></div>").urlComp();
		urlInput.appendTo(section);
		var mediaInput = new ui.widget.UploadComp("<div class='postContainer boxsizingBorder'></div>").uploadComp();
		mediaInput.appendTo(section);
		var label = new $("<aside class='label'><span>Post:</span></aside>").appendTo(section);
		var tabs = new $("<aside class='tabs'></aside>").appendTo(section);
		var fcn = function(evt) {
			tabs.children(".active").removeClass("active");
			$(this).addClass("active");
		};
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
		var tags = new ui.jq.JQDroppable("<aside class='tags container boxsizingBorder'></aside>");
		tags.appendTo(section);
		tags.droppable({ accept : function(d) {
			return d["is"](".filterable");
		}, activeClass : "ui-state-hover", hoverClass : "ui-state-active", drop : function(event,_ui) {
			var clone = (_ui.draggable.data("clone"))(_ui.draggable,false,".tags");
			clone.addClass("small");
			var cloneOffset = clone.offset();
			$(this).append(clone);
			clone.css({ position : "absolute"});
			if(cloneOffset.top != 0) clone.offset(cloneOffset); else clone.position({ my : "left top", at : "left top", of : _ui.helper, collision : "flipfit", within : ".tags"});
		}});
		addConnectionsAndLabels = function(content) {
			tags.children(".label").each(function(i,dom) {
				var label1 = new ui.widget.LabelComp(dom);
				content.labelSet.add((js.Boot.__cast(label1.labelComp("option","label") , ui.model.Label)).uid);
			});
			tags.children(".connectionAvatar").each(function(i,dom) {
				var conn = new ui.widget.ConnectionAvatar(dom);
				content.connectionSet.add((js.Boot.__cast(conn.connectionAvatar("option","connection") , ui.model.Connection)).uid);
			});
		};
	}, destroy : function() {
		$.Widget.prototype.destroy.call(this);
	}};
};
$.widget("ui.postComp",defineWidget());
ui.widget.UserComp = window.jQuery;
var defineWidget = function() {
	return { _create : function() {
		var self = this;
		var selfElement = this.element;
		if(!selfElement["is"]("div")) throw new ui.exception.Exception("Root of UserComp must be a div element");
		selfElement.addClass("ocontainer shadow ");
		selfElement.append(new $("<div class='container'></div>"));
		self._setUser();
		ui.model.EventModel.addListener(ui.model.ModelEvents.USER,new ui.model.EventListener(function(user) {
			self.user = user;
			self._setUser();
		}));
		ui.model.EventModel.addListener(ui.model.ModelEvents.LoadAlias,new ui.model.EventListener(function(alias) {
			self._setUser();
		}));
	}, _setUser : function() {
		var self = this;
		var selfElement = this.element;
		var user = self.user;
		var container = selfElement.children(".container").empty();
		var imgSrc = "";
		if(user != null && user.get_currentAlias() != null) {
			if(ui.helper.StringHelper.isNotBlank(user.get_currentAlias().imgSrc)) imgSrc = user.get_currentAlias().imgSrc; else imgSrc = user.imgSrc;
		}
		if(ui.helper.StringHelper.isBlank(imgSrc)) imgSrc = "media/default_avatar.jpg";
		var img = new $("<img alt='user' src='" + imgSrc + "' class='shadow'/>");
		container.append(img);
		var userIdTxt = new $("<div class='userIdTxt'></div>");
		container.append(userIdTxt);
		var name = (function($this) {
			var $r;
			try {
				$r = user.fname;
			} catch( __e ) {
				$r = "";
			}
			return $r;
		}(this)) + " " + (function($this) {
			var $r;
			try {
				$r = user.lname;
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
		userIdTxt.append("<strong>" + name + "</strong>").append("<br/>").append("<font style='font-size:12px'>" + aliasLabel + "</font>");
		var changeDiv = new $("<div class='ui-helper-clearfix'></div>");
		var change = new $("<a class='aliasToggle'>Change Alias</a>");
		changeDiv.append(change);
		container.append(changeDiv);
		var aliases = new $("<div class='aliases ocontainer nonmodalPopup' style='position: absolute;'></div>");
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
					ui.model.EventModel.change(ui.model.ModelEvents.LoadAlias,alias1[0].uid);
				};
			})(alias1));
		}
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
ui.AgentUi.DEMO = true;
ui.AgentUi.URL = "";
ui.api.ProtocolMessage.__rtti = "<class path=\"ui.api.ProtocolMessage\" params=\"T\">\n\t<implements path=\"ui.api.HasContent\"><c path=\"ui.api.ProtocolMessage.T\"/></implements>\n\t<msgType public=\"1\" set=\"null\"><e path=\"ui.api.MsgType\"/></msgType>\n\t<getContent public=\"1\" set=\"method\" line=\"15\"><f a=\"\"><c path=\"ui.api.ProtocolMessage.T\"/></f></getContent>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
ui.api.Payload.__rtti = "<class path=\"ui.api.Payload\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<new public=\"1\" set=\"method\" line=\"22\"><f a=\"\"><x path=\"Void\"/></f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
ui.api.CreateUserRequest.__rtti = "<class path=\"ui.api.CreateUserRequest\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.UserRequestData\"/></extends>\n\t<content public=\"1\"><c path=\"ui.api.UserRequestData\"/></content>\n\t<getContent public=\"1\" set=\"method\" line=\"35\" override=\"1\"><f a=\"\"><c path=\"ui.api.UserRequestData\"/></f></getContent>\n\t<new public=\"1\" set=\"method\" line=\"31\"><f a=\"\"><x path=\"Void\"/></f></new>\n\t<haxe_doc>Create User Request/Response</haxe_doc>\n</class>";
ui.api.UserRequestData.__rtti = "<class path=\"ui.api.UserRequestData\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.Payload\"/>\n\t<email public=\"1\"><c path=\"String\"/></email>\n\t<password public=\"1\"><c path=\"String\"/></password>\n\t<jsonBlob public=\"1\"><d/></jsonBlob>\n\t<new public=\"1\" set=\"method\" line=\"40\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.CreateUserResponse.__rtti = "<class path=\"ui.api.CreateUserResponse\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.CreateUserResponseData\"/></extends>\n\t<content public=\"1\"><c path=\"ui.api.CreateUserResponseData\"/></content>\n\t<getContent public=\"1\" set=\"method\" line=\"53\" override=\"1\"><f a=\"\"><c path=\"ui.api.CreateUserResponseData\"/></f></getContent>\n\t<new public=\"1\" set=\"method\" line=\"49\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.CreateUserResponseData.__rtti = "<class path=\"ui.api.CreateUserResponseData\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.Payload\"/>\n\t<agentURI public=\"1\"><c path=\"String\"/></agentURI>\n\t<new public=\"1\" set=\"method\" line=\"58\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.UpdateUserRequest.__rtti = "<class path=\"ui.api.UpdateUserRequest\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.UpdateUserRequestData\"/></extends>\n\t<content public=\"1\"><c path=\"ui.api.UpdateUserRequestData\"/></content>\n\t<getContent public=\"1\" set=\"method\" line=\"69\" override=\"1\"><f a=\"\"><c path=\"ui.api.UpdateUserRequestData\"/></f></getContent>\n\t<new public=\"1\" set=\"method\" line=\"65\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.UpdateUserRequestData.__rtti = "<class path=\"ui.api.UpdateUserRequestData\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.UserRequestData\"/>\n\t<sessionId public=\"1\"><c path=\"String\"/></sessionId>\n\t<new public=\"1\" set=\"method\" line=\"74\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.InitializeSessionRequest.__rtti = "<class path=\"ui.api.InitializeSessionRequest\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.InitializeSessionRequestData\"/></extends>\n\t<content public=\"1\"><c path=\"ui.api.InitializeSessionRequestData\"/></content>\n\t<getContent public=\"1\" set=\"method\" line=\"89\" override=\"1\"><f a=\"\"><c path=\"ui.api.InitializeSessionRequestData\"/></f></getContent>\n\t<new public=\"1\" set=\"method\" line=\"85\"><f a=\"\"><x path=\"Void\"/></f></new>\n\t<haxe_doc>Initialize Session Request/Response</haxe_doc>\n</class>";
ui.api.InitializeSessionRequestData.__rtti = "<class path=\"ui.api.InitializeSessionRequestData\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.Payload\"/>\n\t<agentURI public=\"1\"><c path=\"String\"/></agentURI>\n\t<new public=\"1\" set=\"method\" line=\"94\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.InitializeSessionResponse.__rtti = "<class path=\"ui.api.InitializeSessionResponse\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.InitializeSessionResponseData\"/></extends>\n\t<content public=\"1\"><c path=\"ui.api.InitializeSessionResponseData\"/></content>\n\t<getContent public=\"1\" set=\"method\" line=\"105\" override=\"1\"><f a=\"\"><c path=\"ui.api.InitializeSessionResponseData\"/></f></getContent>\n\t<new public=\"1\" set=\"method\" line=\"101\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.InitializeSessionResponseData.__rtti = "<class path=\"ui.api.InitializeSessionResponseData\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.Payload\"/>\n\t<sessionURI public=\"1\"><c path=\"String\"/></sessionURI>\n\t<listOfAliases public=\"1\"><c path=\"Array\"><c path=\"ui.model.Alias\"/></c></listOfAliases>\n\t<defaultAlias public=\"1\"><c path=\"ui.model.Alias\"/></defaultAlias>\n\t<listOfLabels public=\"1\"><c path=\"Array\"><c path=\"ui.model.Label\"/></c></listOfLabels>\n\t<listOfCnxns public=\"1\"><c path=\"Array\"><c path=\"ui.model.Connection\"/></c></listOfCnxns>\n\t<lastActiveFilter public=\"1\"><c path=\"String\"/></lastActiveFilter>\n\t<new public=\"1\" set=\"method\" line=\"110\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.InitializeSessionError.__rtti = "<class path=\"ui.api.InitializeSessionError\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.InitializeSessionErrorData\"/></extends>\n\t<content public=\"1\"><c path=\"ui.api.InitializeSessionErrorData\"/></content>\n\t<getContent public=\"1\" set=\"method\" line=\"126\" override=\"1\"><f a=\"\"><c path=\"ui.api.InitializeSessionErrorData\"/></f></getContent>\n\t<new public=\"1\" set=\"method\" line=\"122\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.InitializeSessionErrorData.__rtti = "<class path=\"ui.api.InitializeSessionErrorData\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.Payload\"/>\n\t<agentURI public=\"1\"><c path=\"String\"/></agentURI>\n\t<reason public=\"1\"><c path=\"String\"/></reason>\n\t<new public=\"1\" set=\"method\" line=\"131\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.SessionPingRequest.__rtti = "<class path=\"ui.api.SessionPingRequest\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.SessionPingRequestData\"/></extends>\n\t<content public=\"1\"><c path=\"ui.api.SessionPingRequestData\"/></content>\n\t<getContent public=\"1\" set=\"method\" line=\"146\" override=\"1\"><f a=\"\"><c path=\"ui.api.SessionPingRequestData\"/></f></getContent>\n\t<new public=\"1\" set=\"method\" line=\"142\"><f a=\"\"><x path=\"Void\"/></f></new>\n\t<haxe_doc>Ping/pop Request/Response</haxe_doc>\n</class>";
ui.api.SessionPingRequestData.__rtti = "<class path=\"ui.api.SessionPingRequestData\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.Payload\"/>\n\t<sessionURI public=\"1\"><c path=\"String\"/></sessionURI>\n\t<new public=\"1\" set=\"method\" line=\"151\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.SessionPongResponse.__rtti = "<class path=\"ui.api.SessionPongResponse\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.SessionPongResponseData\"/></extends>\n\t<content public=\"1\"><c path=\"ui.api.SessionPongResponseData\"/></content>\n\t<getContent public=\"1\" set=\"method\" line=\"162\" override=\"1\"><f a=\"\"><c path=\"ui.api.SessionPongResponseData\"/></f></getContent>\n\t<new public=\"1\" set=\"method\" line=\"158\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.SessionPongResponseData.__rtti = "<class path=\"ui.api.SessionPongResponseData\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.Payload\"/>\n\t<sessionURI public=\"1\"><c path=\"String\"/></sessionURI>\n\t<new public=\"1\" set=\"method\" line=\"167\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.CloseSessionRequest.__rtti = "<class path=\"ui.api.CloseSessionRequest\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.CloseSessionData\"/></extends>\n\t<content public=\"1\"><c path=\"ui.api.CloseSessionData\"/></content>\n\t<getContent public=\"1\" set=\"method\" line=\"181\" override=\"1\"><f a=\"\"><c path=\"ui.api.CloseSessionData\"/></f></getContent>\n\t<new public=\"1\" set=\"method\" line=\"177\"><f a=\"\"><x path=\"Void\"/></f></new>\n\t<haxe_doc>Close Session Request/Response</haxe_doc>\n</class>";
ui.api.CloseSessionResponse.__rtti = "<class path=\"ui.api.CloseSessionResponse\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.CloseSessionData\"/></extends>\n\t<content public=\"1\"><c path=\"ui.api.CloseSessionData\"/></content>\n\t<getContent public=\"1\" set=\"method\" line=\"193\" override=\"1\"><f a=\"\"><c path=\"ui.api.CloseSessionData\"/></f></getContent>\n\t<new public=\"1\" set=\"method\" line=\"189\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.CloseSessionData.__rtti = "<class path=\"ui.api.CloseSessionData\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.Payload\"/>\n\t<sessionURI public=\"1\"><c path=\"String\"/></sessionURI>\n\t<new public=\"1\" set=\"method\" line=\"198\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.EvalRequest.__rtti = "<class path=\"ui.api.EvalRequest\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.EvalRequestData\"/></extends>\n\t<content public=\"1\"><c path=\"ui.api.EvalRequestData\"/></content>\n\t<getContent public=\"1\" set=\"method\" line=\"212\" override=\"1\"><f a=\"\"><c path=\"ui.api.EvalRequestData\"/></f></getContent>\n\t<new public=\"1\" set=\"method\" line=\"208\"><f a=\"\"><x path=\"Void\"/></f></new>\n\t<haxe_doc>Evaluate Request/Response</haxe_doc>\n</class>";
ui.api.EvalRequestData.__rtti = "<class path=\"ui.api.EvalRequestData\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.Payload\"/>\n\t<sessionURI public=\"1\"><c path=\"String\"/></sessionURI>\n\t<expression public=\"1\"><d/></expression>\n\t<new public=\"1\" set=\"method\" line=\"217\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.EvalNextPageRequest.__rtti = "<class path=\"ui.api.EvalNextPageRequest\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.EvalNextPageRequestData\"/></extends>\n\t<content public=\"1\"><c path=\"ui.api.EvalNextPageRequestData\"/></content>\n\t<getContent public=\"1\" set=\"method\" line=\"229\" override=\"1\"><f a=\"\"><c path=\"ui.api.EvalNextPageRequestData\"/></f></getContent>\n\t<new public=\"1\" set=\"method\" line=\"225\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.EvalNextPageRequestData.__rtti = "<class path=\"ui.api.EvalNextPageRequestData\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.Payload\"/>\n\t<sessionURI public=\"1\"><c path=\"String\"/></sessionURI>\n\t<nextPage public=\"1\"><c path=\"String\"/></nextPage>\n\t<new public=\"1\" set=\"method\" line=\"234\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.EvalResponse.__rtti = "<class path=\"ui.api.EvalResponse\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.EvalResponseData\"/></extends>\n\t<content public=\"1\"><c path=\"ui.api.EvalResponseData\"/></content>\n\t<getContent public=\"1\" set=\"method\" line=\"246\" override=\"1\"><f a=\"\"><c path=\"ui.api.EvalResponseData\"/></f></getContent>\n\t<new public=\"1\" set=\"method\" line=\"242\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.EvalComplete.__rtti = "<class path=\"ui.api.EvalComplete\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.EvalResponseData\"/></extends>\n\t<content public=\"1\"><c path=\"ui.api.EvalResponseData\"/></content>\n\t<getContent public=\"1\" set=\"method\" line=\"258\" override=\"1\"><f a=\"\"><c path=\"ui.api.EvalResponseData\"/></f></getContent>\n\t<new public=\"1\" set=\"method\" line=\"254\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.EvalResponseData.__rtti = "<class path=\"ui.api.EvalResponseData\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.Payload\"/>\n\t<sessionURI public=\"1\"><c path=\"String\"/></sessionURI>\n\t<pageOfPosts public=\"1\"><c path=\"Array\"><c path=\"ui.model.Content\"/></c></pageOfPosts>\n\t<new public=\"1\" set=\"method\" line=\"263\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.EvalError.__rtti = "<class path=\"ui.api.EvalError\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.EvalErrorData\"/></extends>\n\t<content public=\"1\"><c path=\"ui.api.EvalErrorData\"/></content>\n\t<getContent public=\"1\" set=\"method\" line=\"275\" override=\"1\"><f a=\"\"><c path=\"ui.api.EvalErrorData\"/></f></getContent>\n\t<new public=\"1\" set=\"method\" line=\"271\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.EvalErrorData.__rtti = "<class path=\"ui.api.EvalErrorData\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.Payload\"/>\n\t<sessionURI public=\"1\"><c path=\"String\"/></sessionURI>\n\t<errorMsg public=\"1\"><c path=\"String\"/></errorMsg>\n\t<new public=\"1\" set=\"method\" line=\"280\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.StopEvalRequest.__rtti = "<class path=\"ui.api.StopEvalRequest\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.StopMsgData\"/></extends>\n\t<content public=\"1\"><c path=\"ui.api.StopMsgData\"/></content>\n\t<getContent public=\"1\" set=\"method\" line=\"295\" override=\"1\"><f a=\"\"><c path=\"ui.api.StopMsgData\"/></f></getContent>\n\t<new public=\"1\" set=\"method\" line=\"291\"><f a=\"\"><x path=\"Void\"/></f></new>\n\t<haxe_doc>Stop Evaluation Request/Response</haxe_doc>\n</class>";
ui.api.StopEvalResponse.__rtti = "<class path=\"ui.api.StopEvalResponse\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.ProtocolMessage\"><c path=\"ui.api.StopMsgData\"/></extends>\n\t<content public=\"1\"><c path=\"ui.api.StopMsgData\"/></content>\n\t<getContent public=\"1\" set=\"method\" line=\"307\" override=\"1\"><f a=\"\"><c path=\"ui.api.StopMsgData\"/></f></getContent>\n\t<new public=\"1\" set=\"method\" line=\"303\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.StopMsgData.__rtti = "<class path=\"ui.api.StopMsgData\" params=\"\" module=\"ui.api.ProtocolMessage\">\n\t<extends path=\"ui.api.Payload\"/>\n\t<sessionURI public=\"1\"><c path=\"String\"/></sessionURI>\n\t<new public=\"1\" set=\"method\" line=\"312\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.api.TestDao.initialized = false;
ui.api.TestDao._lastRandom = 0;
ui.model.ModelObj.__rtti = "<class path=\"ui.model.ModelObj\" params=\"T\">\n\t<identifier public=\"1\" params=\"T\" set=\"method\" line=\"15\" static=\"1\"><f a=\"t\">\n\t<a><uid><c path=\"String\"/></uid></a>\n\t<c path=\"String\"/>\n</f></identifier>\n\t<uid public=\"1\"><c path=\"String\"/></uid>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
ui.model.Login.__rtti = "<class path=\"ui.model.Login\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.ModelObj\"><c path=\"ui.model.Login\"/></extends>\n\t<password public=\"1\"><c path=\"String\"/></password>\n\t<getUri public=\"1\" set=\"method\" line=\"24\"><f a=\"\"><c path=\"String\"/></f></getUri>\n\t<new public=\"1\" set=\"method\" line=\"21\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.model.LoginByUn.__rtti = "<class path=\"ui.model.LoginByUn\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.Login\"/>\n\t<email public=\"1\"><c path=\"String\"/></email>\n\t<getUri public=\"1\" set=\"method\" line=\"33\" override=\"1\"><f a=\"\"><c path=\"String\"/></f></getUri>\n\t<new public=\"1\" set=\"method\" line=\"29\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.model.LoginById.__rtti = "<class path=\"ui.model.LoginById\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.Login\"/>\n\t<uuid public=\"1\"><c path=\"String\"/></uuid>\n\t<getUri public=\"1\" set=\"method\" line=\"42\" override=\"1\"><f a=\"\"><c path=\"String\"/></f></getUri>\n\t<new public=\"1\" set=\"method\" line=\"39\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.model.NewUser.__rtti = "<class path=\"ui.model.NewUser\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.ModelObj\"><c path=\"ui.model.NewUser\"/></extends>\n\t<name public=\"1\"><c path=\"String\"/></name>\n\t<userName public=\"1\"><c path=\"String\"/></userName>\n\t<email public=\"1\"><c path=\"String\"/></email>\n\t<pwd public=\"1\"><c path=\"String\"/></pwd>\n\t<new public=\"1\" set=\"method\" line=\"53\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.model.User.__rtti = "<class path=\"ui.model.User\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.ModelObj\"><c path=\"ui.model.User\"/></extends>\n\t<sessionURI public=\"1\"><c path=\"String\"/></sessionURI>\n\t<fname public=\"1\"><c path=\"String\"/></fname>\n\t<lname public=\"1\"><c path=\"String\"/></lname>\n\t<imgSrc public=\"1\">\n\t\t<c path=\"String\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</imgSrc>\n\t<aliasSet public=\"1\">\n\t\t<c path=\"ui.observable.ObservableSet\"><c path=\"ui.model.Alias\"/></c>\n\t\t<meta><m n=\":transient\"/></meta>\n\t</aliasSet>\n\t<aliases><c path=\"Array\"><c path=\"ui.model.Alias\"/></c></aliases>\n\t<currentAlias public=\"1\" get=\"accessor\" set=\"accessor\">\n\t\t<c path=\"ui.model.Alias\"/>\n\t\t<meta><m n=\":isVar\"/></meta>\n\t</currentAlias>\n\t<get_currentAlias set=\"method\" line=\"67\"><f a=\"\"><c path=\"ui.model.Alias\"/></f></get_currentAlias>\n\t<set_currentAlias set=\"method\" line=\"77\"><f a=\"alias\">\n\t<c path=\"ui.model.Alias\"/>\n\t<c path=\"ui.model.Alias\"/>\n</f></set_currentAlias>\n\t<hasValidSession public=\"1\" set=\"method\" line=\"82\"><f a=\"\"><x path=\"Bool\"/></f></hasValidSession>\n\t<readResolve set=\"method\" line=\"88\"><f a=\"\"><x path=\"Void\"/></f></readResolve>\n\t<writeResolve set=\"method\" line=\"92\"><f a=\"\"><x path=\"Void\"/></f></writeResolve>\n\t<new public=\"1\" set=\"method\" line=\"65\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.model.Alias.__rtti = "<class path=\"ui.model.Alias\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.ModelObj\"><c path=\"ui.model.Alias\"/></extends>\n\t<imgSrc public=\"1\">\n\t\t<c path=\"String\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</imgSrc>\n\t<label public=\"1\"><c path=\"String\"/></label>\n\t<labelSet public=\"1\">\n\t\t<c path=\"ui.observable.ObservableSet\"><c path=\"ui.model.Label\"/></c>\n\t\t<meta><m n=\":transient\"/></meta>\n\t</labelSet>\n\t<labels><c path=\"Array\"><c path=\"ui.model.Label\"/></c></labels>\n\t<connectionSet public=\"1\">\n\t\t<c path=\"ui.observable.ObservableSet\"><c path=\"ui.model.Connection\"/></c>\n\t\t<meta><m n=\":transient\"/></meta>\n\t</connectionSet>\n\t<connections><c path=\"Array\"><c path=\"ui.model.Connection\"/></c></connections>\n\t<readResolve set=\"method\" line=\"108\"><f a=\"\"><x path=\"Void\"/></f></readResolve>\n\t<writeResolve set=\"method\" line=\"113\"><f a=\"\"><x path=\"Void\"/></f></writeResolve>\n\t<new public=\"1\" set=\"method\" line=\"106\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.model.Label.__rtti = "<class path=\"ui.model.Label\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.ModelObj\"><c path=\"ui.model.Connection\"/></extends>\n\t<implements path=\"ui.model.Filterable\"/>\n\t<text public=\"1\"><c path=\"String\"/></text>\n\t<parentUid public=\"1\">\n\t\t<c path=\"String\"/>\n\t\t<meta><m n=\":optional\"/></meta>\n\t</parentUid>\n\t<color public=\"1\">\n\t\t<c path=\"String\"/>\n\t\t<meta><m n=\":transient\"/></meta>\n\t</color>\n\t<new public=\"1\" set=\"method\" line=\"129\"><f a=\"?text\">\n\t<c path=\"String\"/>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
ui.model.Connection.__rtti = "<class path=\"ui.model.Connection\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.ModelObj\"><c path=\"ui.model.Connection\"/></extends>\n\t<implements path=\"ui.model.Filterable\"/>\n\t<fname public=\"1\"><c path=\"String\"/></fname>\n\t<lname public=\"1\"><c path=\"String\"/></lname>\n\t<imgSrc public=\"1\"><c path=\"String\"/></imgSrc>\n\t<new public=\"1\" set=\"method\" line=\"140\"><f a=\"?fname:?lname:?imgSrc\">\n\t<c path=\"String\"/>\n\t<c path=\"String\"/>\n\t<c path=\"String\"/>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
ui.model.Content.__rtti = "<class path=\"ui.model.Content\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.ModelObj\"><c path=\"ui.model.Content\"/></extends>\n\t<type public=\"1\"><c path=\"String\"/></type>\n\t<labelSet public=\"1\">\n\t\t<c path=\"ui.observable.ObservableSet\"><c path=\"String\"/></c>\n\t\t<meta><m n=\":transient\"/></meta>\n\t</labelSet>\n\t<labels><c path=\"Array\"><c path=\"String\"/></c></labels>\n\t<connectionSet public=\"1\">\n\t\t<c path=\"ui.observable.ObservableSet\"><c path=\"String\"/></c>\n\t\t<meta><m n=\":transient\"/></meta>\n\t</connectionSet>\n\t<connections><c path=\"Array\"><c path=\"String\"/></c></connections>\n\t<creator public=\"1\"><c path=\"String\"/></creator>\n\t<readResolve set=\"method\" line=\"155\"><f a=\"\"><x path=\"Void\"/></f></readResolve>\n\t<writeResolve set=\"method\" line=\"160\"><f a=\"\"><x path=\"Void\"/></f></writeResolve>\n\t<toInsertExpression public=\"1\" set=\"method\" line=\"165\"><f a=\"\"><c path=\"String\"/></f></toInsertExpression>\n</class>";
ui.model.ImageContent.__rtti = "<class path=\"ui.model.ImageContent\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.Content\"/>\n\t<imgSrc public=\"1\"><c path=\"String\"/></imgSrc>\n\t<caption public=\"1\"><c path=\"String\"/></caption>\n\t<new public=\"1\" set=\"method\" line=\"201\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.model.AudioContent.__rtti = "<class path=\"ui.model.AudioContent\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.Content\"/>\n\t<audioSrc public=\"1\"><c path=\"String\"/></audioSrc>\n\t<audioType public=\"1\"><c path=\"String\"/></audioType>\n\t<title public=\"1\"><c path=\"String\"/></title>\n\t<new public=\"1\" set=\"method\" line=\"209\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.model.MessageContent.__rtti = "<class path=\"ui.model.MessageContent\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.Content\"/>\n\t<text public=\"1\"><c path=\"String\"/></text>\n\t<new public=\"1\" set=\"method\" line=\"215\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.model.UrlContent.__rtti = "<class path=\"ui.model.UrlContent\" params=\"\" module=\"ui.model.ModelObj\">\n\t<extends path=\"ui.model.MessageContent\"/>\n\t<url public=\"1\"><c path=\"String\"/></url>\n\t<new public=\"1\" set=\"method\" line=\"218\"><f a=\"\"><x path=\"Void\"/></f></new>\n</class>";
ui.observable.OSet.__rtti = "<class path=\"ui.observable.OSet\" params=\"T\" interface=\"1\">\n\t<identifier public=\"1\" set=\"method\"><f a=\"\"><f a=\"\">\n\t<c path=\"ui.observable.OSet.T\"/>\n\t<c path=\"String\"/>\n</f></f></identifier>\n\t<listen public=\"1\" set=\"method\"><f a=\"l\">\n\t<f a=\":\">\n\t\t<c path=\"ui.observable.OSet.T\"/>\n\t\t<c path=\"ui.observable.EventType\"/>\n\t\t<x path=\"Void\"/>\n\t</f>\n\t<x path=\"Void\"/>\n</f></listen>\n\t<iterator public=\"1\" set=\"method\"><f a=\"\"><t path=\"Iterator\"><c path=\"ui.observable.OSet.T\"/></t></f></iterator>\n\t<delegate public=\"1\" set=\"method\"><f a=\"\"><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"ui.observable.OSet.T\"/>\n</x></f></delegate>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
ui.observable.EventManager.__rtti = "<class path=\"ui.observable.EventManager\" params=\"T\" module=\"ui.observable.OSet\">\n\t<_listeners><c path=\"Array\"><f a=\":\">\n\t<c path=\"ui.observable.EventManager.T\"/>\n\t<c path=\"ui.observable.EventType\"/>\n\t<x path=\"Void\"/>\n</f></c></_listeners>\n\t<_set><c path=\"ui.observable.OSet\"><c path=\"ui.observable.EventManager.T\"/></c></_set>\n\t<add public=\"1\" set=\"method\" line=\"43\"><f a=\"l\">\n\t<f a=\":\">\n\t\t<c path=\"ui.observable.EventManager.T\"/>\n\t\t<c path=\"ui.observable.EventType\"/>\n\t\t<x path=\"Void\"/>\n\t</f>\n\t<x path=\"Void\"/>\n</f></add>\n\t<fire public=\"1\" set=\"method\" line=\"51\"><f a=\"t:type\">\n\t<c path=\"ui.observable.EventManager.T\"/>\n\t<c path=\"ui.observable.EventType\"/>\n\t<x path=\"Void\"/>\n</f></fire>\n\t<new public=\"1\" set=\"method\" line=\"39\"><f a=\"set\">\n\t<c path=\"ui.observable.OSet\"><c path=\"ui.observable.EventManager.T\"/></c>\n\t<x path=\"Void\"/>\n</f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
ui.observable.EventType.Add = new ui.observable.EventType("Add",true,false);
ui.observable.EventType.Update = new ui.observable.EventType("Update",false,true);
ui.observable.EventType.Delete = new ui.observable.EventType("Delete",false,false);
ui.observable.AbstractSet.__rtti = "<class path=\"ui.observable.AbstractSet\" params=\"T\" module=\"ui.observable.OSet\">\n\t<implements path=\"ui.observable.OSet\"><c path=\"ui.observable.AbstractSet.T\"/></implements>\n\t<_eventManager><c path=\"ui.observable.EventManager\"><c path=\"ui.observable.AbstractSet.T\"/></c></_eventManager>\n\t<listen public=\"1\" set=\"method\" line=\"106\"><f a=\"l\">\n\t<f a=\":\">\n\t\t<c path=\"ui.observable.AbstractSet.T\"/>\n\t\t<c path=\"ui.observable.EventType\"/>\n\t\t<x path=\"Void\"/>\n\t</f>\n\t<x path=\"Void\"/>\n</f></listen>\n\t<filter public=\"1\" set=\"method\" line=\"110\"><f a=\"f\">\n\t<f a=\"\">\n\t\t<c path=\"ui.observable.AbstractSet.T\"/>\n\t\t<x path=\"Bool\"/>\n\t</f>\n\t<c path=\"ui.observable.OSet\"><c path=\"ui.observable.AbstractSet.T\"/></c>\n</f></filter>\n\t<map public=\"1\" params=\"U\" set=\"method\" line=\"114\"><f a=\"f\">\n\t<f a=\"\">\n\t\t<c path=\"ui.observable.AbstractSet.T\"/>\n\t\t<c path=\"map.U\"/>\n\t</f>\n\t<c path=\"ui.observable.OSet\"><c path=\"map.U\"/></c>\n</f></map>\n\t<fire set=\"method\" line=\"118\"><f a=\"t:type\">\n\t<c path=\"ui.observable.AbstractSet.T\"/>\n\t<c path=\"ui.observable.EventType\"/>\n\t<x path=\"Void\"/>\n</f></fire>\n\t<identifier public=\"1\" set=\"method\" line=\"122\"><f a=\"\"><f a=\"\">\n\t<c path=\"ui.observable.AbstractSet.T\"/>\n\t<c path=\"String\"/>\n</f></f></identifier>\n\t<iterator public=\"1\" set=\"method\" line=\"126\"><f a=\"\"><t path=\"Iterator\"><c path=\"ui.observable.AbstractSet.T\"/></t></f></iterator>\n\t<delegate public=\"1\" set=\"method\" line=\"130\"><f a=\"\"><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"ui.observable.AbstractSet.T\"/>\n</x></f></delegate>\n\t<new public=\"1\" set=\"method\" line=\"102\"><f a=\"\"><x path=\"Void\"/></f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
ui.observable.ObservableSet.__rtti = "<class path=\"ui.observable.ObservableSet\" params=\"T\" module=\"ui.observable.OSet\">\n\t<extends path=\"ui.observable.AbstractSet\"><c path=\"ui.observable.ObservableSet.T\"/></extends>\n\t<_delegate><c path=\"ui.util.SizedMap\"><c path=\"ui.observable.ObservableSet.T\"/></c></_delegate>\n\t<_identifier><f a=\"\">\n\t<c path=\"ui.observable.ObservableSet.T\"/>\n\t<c path=\"String\"/>\n</f></_identifier>\n\t<add public=\"1\" set=\"method\" line=\"150\"><f a=\"t\">\n\t<c path=\"ui.observable.ObservableSet.T\"/>\n\t<x path=\"Void\"/>\n</f></add>\n\t<addAll public=\"1\" set=\"method\" line=\"154\"><f a=\"tArr\">\n\t<c path=\"Array\"><c path=\"ui.observable.ObservableSet.T\"/></c>\n\t<x path=\"Void\"/>\n</f></addAll>\n\t<iterator public=\"1\" set=\"method\" line=\"162\" override=\"1\"><f a=\"\"><t path=\"Iterator\"><c path=\"ui.observable.ObservableSet.T\"/></t></f></iterator>\n\t<isEmpty public=\"1\" set=\"method\" line=\"166\"><f a=\"\"><x path=\"Bool\"/></f></isEmpty>\n\t<addOrUpdate public=\"1\" set=\"method\" line=\"170\"><f a=\"t\">\n\t<c path=\"ui.observable.ObservableSet.T\"/>\n\t<x path=\"Void\"/>\n</f></addOrUpdate>\n\t<delegate public=\"1\" set=\"method\" line=\"182\" override=\"1\"><f a=\"\"><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"ui.observable.ObservableSet.T\"/>\n</x></f></delegate>\n\t<update public=\"1\" set=\"method\" line=\"186\"><f a=\"t\">\n\t<c path=\"ui.observable.ObservableSet.T\"/>\n\t<x path=\"Void\"/>\n</f></update>\n\t<delete public=\"1\" set=\"method\" line=\"190\"><f a=\"t\">\n\t<c path=\"ui.observable.ObservableSet.T\"/>\n\t<x path=\"Void\"/>\n</f></delete>\n\t<identifier public=\"1\" set=\"method\" line=\"198\" override=\"1\"><f a=\"\"><f a=\"\">\n\t<c path=\"ui.observable.ObservableSet.T\"/>\n\t<c path=\"String\"/>\n</f></f></identifier>\n\t<clear public=\"1\" set=\"method\" line=\"202\"><f a=\"\"><x path=\"Void\"/></f></clear>\n\t<size public=\"1\" set=\"method\" line=\"209\"><f a=\"\"><x path=\"Int\"/></f></size>\n\t<asArray public=\"1\" set=\"method\" line=\"213\"><f a=\"\"><c path=\"Array\"><c path=\"ui.observable.ObservableSet.T\"/></c></f></asArray>\n\t<new public=\"1\" set=\"method\" line=\"141\"><f a=\"identifier:?tArr\">\n\t<f a=\"\">\n\t\t<c path=\"ui.observable.ObservableSet.T\"/>\n\t\t<c path=\"String\"/>\n\t</f>\n\t<c path=\"Array\"><c path=\"ui.observable.ObservableSet.T\"/></c>\n\t<x path=\"Void\"/>\n</f></new>\n\t<meta><m n=\":rtti\"/></meta>\n</class>";
ui.observable.MappedSet.__rtti = "<class path=\"ui.observable.MappedSet\" params=\"T:U\" module=\"ui.observable.OSet\">\n\t<extends path=\"ui.observable.AbstractSet\"><c path=\"ui.observable.MappedSet.U\"/></extends>\n\t<_source><c path=\"ui.observable.OSet\"><c path=\"ui.observable.MappedSet.T\"/></c></_source>\n\t<_mapper><f a=\"\">\n\t<c path=\"ui.observable.MappedSet.T\"/>\n\t<c path=\"ui.observable.MappedSet.U\"/>\n</f></_mapper>\n\t<_mappedSet><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"ui.observable.MappedSet.U\"/>\n</x></_mappedSet>\n\t<identifier public=\"1\" set=\"method\" line=\"247\" override=\"1\"><f a=\"\"><f a=\"\">\n\t<c path=\"ui.observable.MappedSet.U\"/>\n\t<c path=\"String\"/>\n</f></f></identifier>\n\t<delegate public=\"1\" set=\"method\" line=\"251\" override=\"1\"><f a=\"\"><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"ui.observable.MappedSet.U\"/>\n</x></f></delegate>\n\t<identify set=\"method\" line=\"255\"><f a=\"u\">\n\t<c path=\"ui.observable.MappedSet.U\"/>\n\t<c path=\"String\"/>\n</f></identify>\n\t<iterator public=\"1\" set=\"method\" line=\"266\" override=\"1\"><f a=\"\"><t path=\"Iterator\"><c path=\"ui.observable.MappedSet.U\"/></t></f></iterator>\n\t<new public=\"1\" set=\"method\" line=\"229\"><f a=\"source:mapper\">\n\t<c path=\"ui.observable.OSet\"><c path=\"ui.observable.MappedSet.T\"/></c>\n\t<f a=\"\">\n\t\t<c path=\"ui.observable.MappedSet.T\"/>\n\t\t<c path=\"ui.observable.MappedSet.U\"/>\n\t</f>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
ui.observable.FilteredSet.__rtti = "<class path=\"ui.observable.FilteredSet\" params=\"T\" module=\"ui.observable.OSet\">\n\t<extends path=\"ui.observable.AbstractSet\"><c path=\"ui.observable.FilteredSet.T\"/></extends>\n\t<_filteredSet><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"ui.observable.FilteredSet.T\"/>\n</x></_filteredSet>\n\t<_source><c path=\"ui.observable.OSet\"><c path=\"ui.observable.FilteredSet.T\"/></c></_source>\n\t<_filter><f a=\"\">\n\t<c path=\"ui.observable.FilteredSet.T\"/>\n\t<x path=\"Bool\"/>\n</f></_filter>\n\t<_identifier><f a=\"\">\n\t<c path=\"ui.observable.FilteredSet.T\"/>\n\t<c path=\"String\"/>\n</f></_identifier>\n\t<delegate public=\"1\" set=\"method\" line=\"299\" override=\"1\"><f a=\"\"><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"ui.observable.FilteredSet.T\"/>\n</x></f></delegate>\n\t<apply set=\"method\" line=\"303\"><f a=\"t\">\n\t<c path=\"ui.observable.FilteredSet.T\"/>\n\t<x path=\"Void\"/>\n</f></apply>\n\t<refilter public=\"1\" set=\"method\" line=\"320\"><f a=\"\"><x path=\"Void\"/></f></refilter>\n\t<identifier public=\"1\" set=\"method\" line=\"324\" override=\"1\"><f a=\"\"><f a=\"\">\n\t<c path=\"ui.observable.FilteredSet.T\"/>\n\t<c path=\"String\"/>\n</f></f></identifier>\n\t<iterator public=\"1\" set=\"method\" line=\"328\" override=\"1\"><f a=\"\"><t path=\"Iterator\"><c path=\"ui.observable.FilteredSet.T\"/></t></f></iterator>\n\t<new public=\"1\" set=\"method\" line=\"278\"><f a=\"source:filter\">\n\t<c path=\"ui.observable.OSet\"><c path=\"ui.observable.FilteredSet.T\"/></c>\n\t<f a=\"\">\n\t\t<c path=\"ui.observable.FilteredSet.T\"/>\n\t\t<x path=\"Bool\"/>\n\t</f>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
ui.observable.GroupedSet.__rtti = "<class path=\"ui.observable.GroupedSet\" params=\"T\" module=\"ui.observable.OSet\">\n\t<extends path=\"ui.observable.AbstractSet\"><c path=\"ui.observable.OSet\"><c path=\"ui.observable.GroupedSet.T\"/></c></extends>\n\t<_source><c path=\"ui.observable.OSet\"><c path=\"ui.observable.GroupedSet.T\"/></c></_source>\n\t<_groupingFn><f a=\"\">\n\t<c path=\"ui.observable.GroupedSet.T\"/>\n\t<c path=\"String\"/>\n</f></_groupingFn>\n\t<_groupedSets><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"ui.observable.ObservableSet\"><c path=\"ui.observable.GroupedSet.T\"/></c>\n</x></_groupedSets>\n\t<_identityToGrouping><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"String\"/>\n</x></_identityToGrouping>\n\t<delete set=\"method\" line=\"361\"><f a=\"t\">\n\t<c path=\"ui.observable.GroupedSet.T\"/>\n\t<x path=\"Void\"/>\n</f></delete>\n\t<add set=\"method\" line=\"383\"><f a=\"t\">\n\t<c path=\"ui.observable.GroupedSet.T\"/>\n\t<x path=\"Void\"/>\n</f></add>\n\t<identifier public=\"1\" set=\"method\" line=\"403\" override=\"1\"><f a=\"\"><f a=\"\">\n\t<c path=\"ui.observable.OSet\"><c path=\"ui.observable.GroupedSet.T\"/></c>\n\t<c path=\"String\"/>\n</f></f></identifier>\n\t<identify set=\"method\" line=\"407\"><f a=\"set\">\n\t<c path=\"ui.observable.OSet\"><c path=\"ui.observable.GroupedSet.T\"/></c>\n\t<c path=\"String\"/>\n</f></identify>\n\t<iterator public=\"1\" set=\"method\" line=\"418\" override=\"1\"><f a=\"\"><t path=\"Iterator\"><c path=\"ui.observable.OSet\"><c path=\"ui.observable.GroupedSet.T\"/></c></t></f></iterator>\n\t<delegate public=\"1\" set=\"method\" line=\"422\" override=\"1\"><f a=\"\"><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"ui.observable.OSet\"><c path=\"ui.observable.GroupedSet.T\"/></c>\n</x></f></delegate>\n\t<new public=\"1\" set=\"method\" line=\"340\"><f a=\"source:groupingFn\">\n\t<c path=\"ui.observable.OSet\"><c path=\"ui.observable.GroupedSet.T\"/></c>\n\t<f a=\"\">\n\t\t<c path=\"ui.observable.GroupedSet.T\"/>\n\t\t<c path=\"String\"/>\n\t</f>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
ui.observable.SortedSet.__rtti = "<class path=\"ui.observable.SortedSet\" params=\"T\" module=\"ui.observable.OSet\">\n\t<extends path=\"ui.observable.AbstractSet\"><c path=\"ui.observable.SortedSet.T\"/></extends>\n\t<_source><c path=\"ui.observable.OSet\"><c path=\"ui.observable.SortedSet.T\"/></c></_source>\n\t<_sortByFn><f a=\"\">\n\t<c path=\"ui.observable.SortedSet.T\"/>\n\t<c path=\"String\"/>\n</f></_sortByFn>\n\t<_sorted><c path=\"Array\"><c path=\"ui.observable.SortedSet.T\"/></c></_sorted>\n\t<_dirty><x path=\"Bool\"/></_dirty>\n\t<_comparisonFn><f a=\":\">\n\t<c path=\"ui.observable.SortedSet.T\"/>\n\t<c path=\"ui.observable.SortedSet.T\"/>\n\t<x path=\"Int\"/>\n</f></_comparisonFn>\n\t<sorted set=\"method\" line=\"474\"><f a=\"\"><c path=\"Array\"><c path=\"ui.observable.SortedSet.T\"/></c></f></sorted>\n\t<indexOf set=\"method\" line=\"482\"><f a=\"t\">\n\t<c path=\"ui.observable.SortedSet.T\"/>\n\t<x path=\"Int\"/>\n</f></indexOf>\n\t<binarySearch set=\"method\" line=\"487\"><f a=\"value:sortBy:startIndex:endIndex\">\n\t<c path=\"ui.observable.SortedSet.T\"/>\n\t<c path=\"String\"/>\n\t<x path=\"Int\"/>\n\t<x path=\"Int\"/>\n\t<x path=\"Int\"/>\n</f></binarySearch>\n\t<delete set=\"method\" line=\"505\"><f a=\"t\">\n\t<c path=\"ui.observable.SortedSet.T\"/>\n\t<x path=\"Void\"/>\n</f></delete>\n\t<add set=\"method\" line=\"509\"><f a=\"t\">\n\t<c path=\"ui.observable.SortedSet.T\"/>\n\t<x path=\"Void\"/>\n</f></add>\n\t<identifier public=\"1\" set=\"method\" line=\"515\" override=\"1\"><f a=\"\"><f a=\"\">\n\t<c path=\"ui.observable.SortedSet.T\"/>\n\t<c path=\"String\"/>\n</f></f></identifier>\n\t<iterator public=\"1\" set=\"method\" line=\"519\" override=\"1\"><f a=\"\"><t path=\"Iterator\"><c path=\"ui.observable.SortedSet.T\"/></t></f></iterator>\n\t<delegate public=\"1\" set=\"method\" line=\"523\" override=\"1\"><f a=\"\"><x path=\"Map\">\n\t<c path=\"String\"/>\n\t<c path=\"ui.observable.SortedSet.T\"/>\n</x></f></delegate>\n\t<new public=\"1\" set=\"method\" line=\"435\"><f a=\"source:?sortByFn\">\n\t<c path=\"ui.observable.OSet\"><c path=\"ui.observable.SortedSet.T\"/></c>\n\t<f a=\"\">\n\t\t<c path=\"ui.observable.SortedSet.T\"/>\n\t\t<c path=\"String\"/>\n\t</f>\n\t<x path=\"Void\"/>\n</f></new>\n</class>";
ui.util.ColorProvider._INDEX = 0;
ui.util.UidGenerator.chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabsdefghijklmnopqrstuvwxyz0123456789";
ui.util.UidGenerator.nums = "0123456789";
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

//@ sourceMappingURL=AgentUi.js.map