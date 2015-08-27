'use strict';

var define = require('define-properties');

module.exports = function getHiddenKeyManager() {
	var symbolCache = {};
	var makeKey = function key(prop) {
		if (symbolCache['$' + prop]) {
			return symbolCache['$' + prop];
		}
		if (typeof Symbol === 'function') {
			symbolCache['$' + prop] = Symbol(prop);
			return symbolCache['$' + prop];
		}
		return '___ ' + prop + ' ___';
	};
	return {
		set: function set(obj, prop, value) {
			var key = makeKey(prop);
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
		},
		get: function get(obj, prop) {
			return obj[makeKey(prop)];
		},
		has: function has(obj, prop) {
			return makeKey(prop) in obj;
		}
	};
};
