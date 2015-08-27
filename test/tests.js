'use strict';

var forEach = require('foreach');
var has = Object.prototype.hasOwnProperty;
var assign = require('object.assign');

var testResults = function (t, iterator, expectedResults) {
	forEach(expectedResults, function (expected) {
		var result = iterator.next();
		t.equal(result.done, expected.done, 'result is ' + (expected.done ? '' : 'not ') + ' done');
		if (result.done) {
			t.equal(result.value, null, 'result value is null');
		} else {
			t.equal(Array.isArray(result.value), true, 'result value is an array');
			t.deepEqual(result.value, expected.value, 'result value is expected value');
		}
	});
};

module.exports = function (matchAll, t) {
	t.test('exceptions', function (st) {
		var notRegexes = [null, undefined, '', NaN, 42, new Date(), {}, []];
		forEach(notRegexes, function (notRegex) {
			st.throws(function () { matchAll(notRegex); }, TypeError, notRegex + ' (' + Object.prototype.toString.call(notRegex).slice(8, -1) + ') is not a regex');
		});
		st.end();
	});

	t.test('returns an iterator', function (st) {
		var str = 'aabc';
		var iterator = matchAll(str, /[ac]/g);
		st.ok(iterator, 'iterator is truthy');
		st.equal(has.call(iterator, 'next'), false, 'iterator does not have own property "next"');
		for (var key in iterator) {
			st.fail('iterator has enumerable properties: ' + key);
		}
		var expectedResults = [
			{ value: assign(['a'], { input: str, index: 0 }), done: false },
			{ value: assign(['a'], { input: str, index: 1 }), done: false },
			{ value: assign(['c'], { input: str, index: 3 }), done: false },
			{ value: null, done: true }
		];
		testResults(st, iterator, expectedResults);
		st.end();
	});
};
