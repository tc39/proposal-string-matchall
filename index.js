var ES = require('es-abstract/es7');
var bind = require('function-bind');
var define = require('define-properties');
var flagsGetter = require('regexp.prototype.flags');

var cache = {};
var makeHiddenKey = function (prop) {
	if (cache['$' + prop]) {
		return cache['$' + prop];
	}
	if (typeof Symbol === 'function') {
		cache['$' + prop] = Symbol(prop);
		return cache['$' + prop];
	}
	return '___ ' + prop + ' ___';
};
var setHidden = function (obj, prop, value) {
	var key = makeHiddenKey(prop);
	if (define.supportsDescriptors) {
		Object.defineProperty(obj, key, {
			value: value,
			configurable: false,
			enumerable: false,
			writable: false
		});
	} else {
		obj[key] = value;
	}
};
var getHidden = function (obj, prop) {
	return obj[makeHiddenKey(prop)];
};
var hasHidden = function (obj, prop) {
	return makeHiddenKey(prop) in obj;
};

var RegExpStringIterator = function RegExpStringIterator(regexp, string) {
	setHidden(this, 'regexp', regexp);
	setHidden(this, 'string', string);
};

var has = bind.call(Function.call, Object.prototype.hasOwnProperty);

define(RegExpStringIterator.prototype, {
	next: function next() {
		var O = ES.RequireObjectCoercible(this);
		if (!(this instanceof RegExpStringIterator) || !hasHidden(O, 'regexp') || !hasHidden(O, 'string')) {
			throw new TypeError('"this" value must be a RegExpStringIterator instance');
		}
		var regexp = getHidden(this, 'regexp');
		var string = getHidden(this, 'string');
		var match = regexp.exec(string);
		return { value: match, done: match === null };
	}
});
if (typeof Symbol === 'function' && Symbol.toStringTag) {
	RegExpStringIterator.prototype[Symbol.toStringTag] = 'RegExp String Iterator';
}

var exec = bind.call(Function.call, RegExp.prototype.exec);

var matchAll = function matchAll(regexp) {
	var O = ES.RequireObjectCoercible(this);
	exec(regexp); // will throw if not actually a RegExp
	var S = String(O);
	var flags = (regexp.flags || flagsGetter(regexp));
	if (flags.indexOf('g') === -1) {
		flags = 'g' + flags;
	}
	var rx = new RegExp(regexp.source, flags);
	rx.lastIndex = ES.ToLength(regexp.lastIndex);
	return new RegExpStringIterator(rx, S);
};
var boundMatchAll = bind.call(Function.call, matchAll);

module.exports = boundMatchAll;

boundMatchAll.shim = function shim() {
	if (!String.prototype.matchAll) {
		define(String.prototype, { matchAll: matchAll });
	}
	return String.prototype.matchAll;
};
