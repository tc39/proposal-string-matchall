if (!String.prototype.matchAll) {
	const RequireObjectCoercible = O => {
		if (O === null || typeof O === 'undefined') {
			throw new TypeError('"this" value must not be null or undefined');
		}
		return O;
	};

	const IteratorPrototype = Object.getPrototypeOf(Object.getPrototypeOf([].values()));
	const iteratingRegExpSlots = new WeakMap();
	const iteratedStringSlots = new WeakMap();
	class RegExpStringIterator extends IteratorPrototype {
		constructor(regexp, string) {
			iteratingRegExpSlots[this] = regexp;
			iteratedStringSlots[this] = string;
		}

		next() {
			const O = RequireObjectCoercible(this);
			if (!iteratingRegExpSlots.has(O) || !iteratedStringSlots.has(O)) {
				throw new TypeError('"this" value must be a RegExpStringIterator instance');
			}
			const regexp = iteratingRegExpSlots[O];
			const string = iteratedStringSlots[O];
			const match = regexp.exec(string);
			if (match === null) {
				return { value: null, done: true };
			}
			return { value: match, done: false };
		}
	};
	RegExpStringIterator.prototype[Symbol.toStringTag] = 'RegExp String Iterator';

	const exec = Function.call.bind(RegExp.prototype.exec);

	const matchAll = function matchAll(regexp) {
		const O = RequireObjectCoercible(this);
		exec(regexp); // will throw if not actually a RegExp
		const S = String(O);
		let flags = regexp.flags;
		if (!flags.includes('g')) {
			flags = 'g' + flags;
		}
		const rx = new RegExp(regexp, flags);
		rx.lastIndex = ES.ToLength(regexp.lastIndex);
		return new RegExpStringIterator(rx, S);
	};
	Object.defineProperty(String.prototype, 'matchAll', {
		enumerable: false,
		configurable: true,
		writable: true,
		value: matchAll
	});
}
