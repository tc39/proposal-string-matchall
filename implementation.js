'use strict';

var ES = require('es-abstract/es7');
var define = require('define-properties');
var flagsGetter = require('regexp.prototype.flags');

var hidden = require('./hidden')();

var RegExpStringIterator = function RegExpStringIterator(regexp, string) {
	hidden.set(this, 'regexp', regexp);
	hidden.set(this, 'string', string);
};

define(RegExpStringIterator.prototype, {
	next: function next() {
		var O = ES.RequireObjectCoercible(this);
		if (!(this instanceof RegExpStringIterator) || !hidden.has(O, 'regexp') || !hidden.has(O, 'string')) {
			throw new TypeError('"this" value must be a RegExpStringIterator instance');
		}
		var regexp = hidden.get(this, 'regexp');
		var string = hidden.get(this, 'string');
		var match = regexp.exec(string);
		return { value: match, done: match === null };
	}
});
if (typeof Symbol === 'function' && Symbol.toStringTag) {
	RegExpStringIterator.prototype[Symbol.toStringTag] = 'RegExp String Iterator';
}

module.exports = function matchAll(regexp) {
	var O = ES.RequireObjectCoercible(this);
	if (!ES.IsRegExp(regexp)) {
		throw new TypeError('Invalid regular expression.');
	}
	var S = String(O);
	var flags = regexp.flags || flagsGetter(regexp);
	if (flags.indexOf('g') === -1) {
		flags = 'g' + flags;
	}
	var rx = new RegExp(regexp.source, flags);
	rx.lastIndex = ES.ToLength(regexp.lastIndex);
	return new RegExpStringIterator(rx, S);
};
