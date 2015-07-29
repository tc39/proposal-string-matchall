'use strict';

require('es5-shim');
require('es6-shim');
var matchAllShim = require('../');
matchAllShim.shim();

var test = require('tape');
var defineProperties = require('define-properties');
var bind = require('function-bind');
var isEnumerable = Object.prototype.propertyIsEnumerable;
var functionsHaveNames = function f() {}.name === 'f';

test('shimmed', function (t) {
	t.equal(String.prototype.matchAll.length, 1, 'String#matchAll has a length of 1');
	t.test('Function name', { skip: !functionsHaveNames }, function (st) {
		st.equal(String.prototype.matchAll.name, 'matchAll', 'String#matchAll has name "matchAll"');
		st.end();
	});

	t.test('enumerability', { skip: !defineProperties.supportsDescriptors }, function (et) {
		et.equal(false, isEnumerable.call(String.prototype, 'matchAll'), 'String#matchAll is not enumerable');
		et.end();
	});

	require('./tests')(bind.call(Function.call, String.prototype.matchAll), t);

	t.end();
});
