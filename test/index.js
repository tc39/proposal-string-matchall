'use strict';

var matchAllShim = require('../');
var test = require('tape');

test('as a function', function (t) {
	require('./tests')(matchAllShim, t);

	t.end();
});
