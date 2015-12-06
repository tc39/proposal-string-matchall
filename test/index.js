'use strict';

var matchAllShim = require('../');
var test = require('tape');

var runTests = require('./tests');

test('as a function', function (t) {
	runTests(matchAllShim, t);

	t.end();
});
