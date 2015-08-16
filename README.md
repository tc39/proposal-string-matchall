# String.prototype.matchAll
Proposal, specs, tests, reference implementation, and polyfill/shim for String.prototype.matchAll

## Spec
You can view the spec in [markdown format](spec.md) or rendered as [HTML](https://ljharb.github.io/String.prototype.matchAll/).

## Rationale
If I have a string, and either a sticky or a global regular expression which has multiple capturing groups, I often want to iterate through all of the matches.
Currently, my options are the following:
```js
	var regex = /t(e)(st(\d?))/g;
	var string = 'test1test2';

	regex.match(string); // gives ['test1', 'test2'] - how do i get the capturing groups?

	var matches = [];
	var match;
	while (match = regex.exec(string)) {
		matches.push(match);
		// example: ['test1', 'e', 'st1', '1'] with properties `index` and `input`
	}
	matches; /* gives exactly what i want, but uses a loop,
		  * and mutates the regex's `lastIndex` property */

	var matches = [];
	string.replace(regex, function () {
		var match = Array.prototype.slice.call(arguments, 0, -2);
		match.input = arguments[arguments.length - 1];
		match.index = arguments[arguments.length - 2];
		matches.push(match);
		// example: ['test1', 'e', 'st1', '1'] with properties `index` and `input`
	});
	matches; /* gives exactly what i want, but abuses `replace`,
		  * mutates the regex's `lastIndex` property,
		  * and requires manual construction of `match` */
```

The first example does not provide the capturing groups, so isn’t an option. The latter two examples both visibly mutate `lastIndex` - this is not a huge issue (beyond ideological) with built-in `RegExp`s, however, with subclassable `RegExp`s in ES6/ES2015, this is a bit of a messy way to obtain the desired information on all matches.

Thus, `String#matchAll` would solve this use case by both providing access to all of the capturing groups, and not visibly mutating the regular expression object in question.

## Iterator versus Array
Many use cases may want an array of matches - however, clearly not all will. Particularly large numbers of capturing groups, or large strings, might have performance implications to always gather all of them into an array. By returning an iterator, it can trivially be collected into an array with the spread operator or `Array.from` if the caller wishes to, but it need not.

## Previous discussions
  - http://blog.stevenlevithan.com/archives/fixing-javascript-regexp
  - https://esdiscuss.org/topic/letting-regexp-method-return-something-iterable
  - http://stackoverflow.com/questions/844001/javascript-regular-expressions-and-sub-matches
  - http://stackoverflow.com/questions/432493/how-do-you-access-the-matched-groups-in-a-javascript-regular-expression
  - http://stackoverflow.com/questions/19913667/javascript-regex-global-match-groups
  - http://blog.getify.com/to-capture-or-not/

## Naming
The name `matchAll` was selected to correspond with `match`, and to connote that *all* matches would be returned, not just a single match. This includes the connotation that the provided regex will be used with a global flag, to locate all matches in the string. An alternate name has been suggested, `matches` - this follows the precedent set by `keys`/`values`/`entries`, which is that a plural noun indicates that it returns an iterator. However, `includes` returns a boolean. When the word is not unambiguously a noun or a verb, "plural noun" doesn't seem as obvious a convention to follow.
