'use strict';

var define = require('define-properties');
var getPolyfill = require('./polyfill');

module.exports = function shimMatchAll() {
	var polyfill = getPolyfill();
	define(
		String.prototype,
		{ matchAll: polyfill },
		{ matchAll: function () { return String.prototype.matchAll !== polyfill; } }
	);
	return polyfill;
};
