'use strict';

var forEach = require('foreach');
var has = Object.prototype.hasOwnProperty;
var assign = require('object.assign');
var define = require('define-properties');

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

	t.test('ToString-able objects', function (st) {
		var str = 'aabc';
		var strObj = { toString: function () { return str; } };
		var regex = /[ac]/;
		var expectedResults = [
			{ value: assign(['a'], { input: str, index: 0 }), done: false },
			{ value: assign(['a'], { input: str, index: 1 }), done: false },
			{ value: assign(['c'], { input: str, index: 3 }), done: false },
			{ value: null, done: true }
		];
		testResults(st, matchAll(strObj, regex), expectedResults);
		st.end();
	});

	t.test('#flags', function (st) {
		st.test('without a flags property', function (s2t) {
			var str = 'aabc';
			var regex = /[ac]/;
			if (define.supportsDescriptors) {
				Object.defineProperty(regex, 'flags', { value: undefined });
			}
			s2t.equal(regex.flags, undefined, 'regex has an undefined "flags" property');
			var expectedResults = [
				{ value: assign(['a'], { input: str, index: 0 }), done: false },
				{ value: assign(['a'], { input: str, index: 1 }), done: false },
				{ value: assign(['c'], { input: str, index: 3 }), done: false },
				{ value: null, done: true }
			];
			testResults(s2t, matchAll(str, regex), expectedResults);
			s2t.end();
		});

		st.test('with a static flags property', function (s2t) {
			var str = 'AaBC';
			var regex = /[ac]/;
			define(regex, { flags: 'i' }, { flags: function () { return true; } });
			s2t.equal(regex.flags, 'i');
			var expectedResults = [
				{ value: assign(['A'], { input: str, index: 0 }), done: false },
				{ value: assign(['a'], { input: str, index: 1 }), done: false },
				{ value: assign(['C'], { input: str, index: 3 }), done: false },
				{ value: null, done: true }
			];
			testResults(s2t, matchAll(str, regex), expectedResults);
			s2t.end();
		});

		st.test('respects flags', function (s2t) {
			var str = 'A\na\nb\nC';
			var regex = /^[ac]/im;
			var expectedResults = [
				{ value: assign(['A'], { input: str, index: 0 }), done: false },
				{ value: assign(['a'], { input: str, index: 2 }), done: false },
				{ value: assign(['C'], { input: str, index: 6 }), done: false },
				{ value: null, done: true }
			];
			testResults(s2t, matchAll(str, regex), expectedResults);
			s2t.end();
		});
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

	t.test('ignores the "g" flag', function (st) {
		var str = 'aabc';
		var iterator = matchAll(str, /[ac]/);
		var iteratorGlobal = matchAll(str, /[ac]/g);
		var result = {}, globalResult = {};
		st.plan(4);
		while (!result.done && !globalResult.done) {
			result = iterator.next();
			globalResult = iteratorGlobal.next();
			st.deepEqual(result, globalResult, 'results do not differ: ' + JSON.stringify(result) + ', ' + JSON.stringify(globalResult));
		}
		st.end();
	});
};
