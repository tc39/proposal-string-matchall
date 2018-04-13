# String.prototype.matchAll ( *regexp* )</h1>

Performs a regular expression match of the String representing the **this** value against *regexp* and returns an iterator. Each iteration result’s value is an Array object containing the results of the match, or **null** if the String did not match.

When the `matchAll` method is called, the following steps are taken:
  1. Let *O* be ? [RequireObjectCoercible][require-object-coercible](**this** value).
  1. If *regexp* is neither **undefined** nor **null**, then
    1. Let *matcher* be ? [GetMethod][getmethod](*regexp*, @@matchAll).
    1. If *matcher* is not **undefined**, then
      1. Return ? [Call](call)(*matcher*, *regexp*, &laquo; *O* &raquo;).
  1. Return ? [MatchAllIterator](#matchalliterator)(*regexp*, *O*).

Note 1: The `matchAll` function is intentionally generic, it does not require that its *this* value be a String object. Therefore, it can be transferred to other kinds of objects for use as a method.
Note 2: Similarly to `String.prototype.split`, `String.prototype.matchAll` is designed to typically act without mutating its inputs.

# RegExp.prototype[ @@matchAll ] ( *string* )

When the `@@matchAll` method is called with argument *string*, the following steps are taken:
  1. Let *R* be the **this** value.
  1. If [Type][type](_R_) is not Object, throw a **TypeError** exception.
  1. Return ? [MatchAllIterator](#matchalliterator)(*R*, *string*).

The value of the name property of this function is "[Symbol.matchAll]".

# MatchAllIterator ( *R*, *O* )

The abstract operation *MatchAllIterator* performs the following steps:
  1. Let *S* be ? [ToString][to-string](*O*).
  1. If ? [IsRegExp][isregexp](*R*) is **true**, then
    1. Let *C* be ? [SpeciesConstructor][species-constructor](*R*, %RegExp%).
    1. Let *flags* be ? [ToString][tostring](? [Get][get](*R*, `"flags"`)).
    1. Let *matcher* be ? [Construct][construct](*C*, « *R*, *flags* »).
    1. Let *global* be ? [ToBoolean][to-boolean](? [Get][get](*matcher*, `"global"`)).
    1. Let *fullUnicode* be ? [ToBoolean][to-boolean](? [Get][get](*matcher*, `"unicode"`)).
    1. Let *lastIndex* be ? [ToLength][tolength](? [Get][get](*R*, `"lastIndex"`)).
    1. Perform ? [Set][set](*matcher*, **"lastIndex"**, *lastIndex*, **true**).
  1. Else,
    1. Let *matcher* be [RegExpCreate][regexp-create](*R*, `"g"`).
    1. Let *global* be **true**.
    1. Let *fullUnicode* be **false**.
    1. Assert: ! [Get][get](*matcher*, `"lastIndex"`) is `0`.
  1. Return ! [CreateRegExpStringIterator](#createregexpstringiterator-abstract-operation)(*matcher*, *S*, *global*, *fullUnicode*).

## CreateRegExpStringIterator( *R*, *S*, *global*, *fullUnicode* )

The abstract operation *CreateRegExpStringIterator* is used to create such iterator objects. It performs the following steps:
  1. Assert: [Type][type](*S*) is String.
  1. Assert: [Type][type](*global*) is Boolean.
  1. Assert: [Type][type](*unicode*) is Boolean.
  1. Let *iterator* be ObjectCreate(<emu-xref href="#%RegExpStringIteratorPrototype%">%RegExpStringIteratorPrototype%</emu-xref>, « [[IteratedString]], [[IteratingRegExp]], [[Global]], [[Unicode]], [[Done]] »).
  1. Set *iterator*.[[IteratingRegExp]] to *R*.
  1. Set *iterator*.[[IteratedString]] to *S*.
  1. Set *iterator*.[[Global]] to *global*.
  1. Set *iterator*.[[Unicode]] to *fullUnicode*.
  1. Set *iterator*.[[Done]] to **true**.
  1. Return *iterator*.

### The %RegExpStringIteratorPrototype% Object

All RegExp String Iterator Objects inherit properties from the [%RegExpStringIteratorPrototype%](#the-regexpstringiteratorprototype-object) intrinsic object. The %RegExpStringIteratorPrototype% object is an ordinary object and its [[Prototype]] [internal slot][internal-slot] is the [%IteratorPrototype%][iterator-prototype] intrinsic object</a>. In addition, %RegExpStringIteratorPrototype% has the following properties:

#### %RegExpStringIteratorPrototype%.next ( )
  1. Let O be the **this** value.
  1. If [Type][type](O) is not Object, throw a **TypeError** exception.
  1. If O does not have all of the internal slots of a RegExp String Iterator Object Instance (see [here](#PropertiesOfRegExpStringIteratorInstances)), throw a **TypeError** exception.
  1. If *O*.[[Done]] is **true**, then
    1. Return ! [CreateIterResultObject][create-iter-result-object](**undefined**, **true**).
  1. Let *R* be *O*.[[IteratingRegExp]].
  1. Let *S* be *O*.[[IteratedString]].
  1. Let *global* be *O*.[[Global]].
  1. Let *fullUnicode* be *O*.[[Unicode]].
  1. Let *match* be ? [RegExpExec][regexp-exec](*R*, *S*).
  1. If *match* is **null**, then
    1. Set *O*.[[Done]] to **true**.
    1. Return ! [CreateIterResultObject][create-iter-result-object](**undefined**, **true**).
  1. Else,
    1. If *global* is **true**,
      1. Let *matchStr* be ? [ToString][to-string](? [Get][get](*match*, **"0"**)).
      1. If *matchStr* is the empty string,
        1. Let *thisIndex* be ? [ToLength][tolength](? [Get][get](*R*, **"lastIndex"**).
        1. Let *nextIndex* be ! AdvanceStringIndex(*S*, *thisIndex*, *fullUnicode*).
        1. Perform ? [Set][set](*R*, **"lastIndex"**, *nextIndex*, **true**).
      1. Return ! [CreateIterResultObject][create-iter-result-object](*match*, **false**).
    1. Else,
      1. Set *O*.[[Done]] to **true**.
      1. Return ! [CreateIterResultObject][create-iter-result-object](_match_, **false**).

#### %RegExpStringIteratorPrototype%[ @@toStringTag ]

The initial value of the _@@toStringTag_ property is the String value **"RegExp String Iterator"**.</p>
This property has the attributes { [[Writable]]: **false**, [[Enumerable]]: **false**, [[Configurable]]: **true** }.</p>

#### Properties of RegExp String Iterator Instances</h1>

RegExp String Iterator instances are ordinary objects that inherit properties from the [%RegExpStringIteratorPrototype%](#%RegExpStringIteratorPrototype%) intrinsic object. RegExp String Iterator instances are initially created with the internal slots listed in <a href="#table-1">Table 1</a>.</p>

<figure>
  <figcaption><span id="table-1">Table 1</span> — Internal Slots of RegExp String Iterator Instances</figcaption>
  <table class="real-table">
    <tbody>
      <tr>
        <th>Internal Slot</th>
        <th>Description</th>
      </tr>
      <tr>
        <td>[[IteratingRegExp]]</td>
        <td>The regular expression used for iteration. [IsRegExp][isregexp]([[IteratingRegExp]]) is always initially true.</td>
      </tr>
      <tr>
        <td>[[IteratedString]]</td>
        <td>The String value being iterated upon.</td>
      </tr>
      <tr>
        <td>[[Global]]</td>
        <td>A Boolean value to indicate whether the [[IteratingRegExp]] is global or not.</td>
      </tr>
      <tr>
        <td>[[Unicode]]</td>
        <td>A Boolean value to indicate whether the [[IteratingRegExp]] is in Unicode mode or not.</td>
      </tr>
      <tr>
        <td>[[Done]]</td>
        <td>A Boolean value to indicate whether the iteration is complete or not.</td>
      </tr>
    </tbody>
  </table>
</figure>

# Symbol.matchAll

The initial value of *Symbol.matchAll* is the well-known symbol @@matchAll

This property has the attributes { [[Writable]]: **false**, [[Enumerable]]: **false**, [[Configurable]]: **false** }.

# Well-Known Symbols

<figure>
  <figcaption>Table 1: Well-known Symbols</figcaption>
  <table>
    <thead>
      <tr>
        <th>Specification Name</th>
        <th>[[Description]]</th>
        <th>Value and Purpose</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td colspan="3">insert after @@match</td>
      </tr>
      <tr>
        <td>@@matchAll</td>
        <td><code>"Symbol.matchAll"</code></td>
        <td>A regular expression method that returns an iterator, that yields matches of the regular expression against a string. Called by the <code>String.prototype.matchAll</code> method.</td>
      </tr>
      <tr>
        <td colspan="3">insert before @@replace</td>
      </tr>
    </tbody>
  </table>
</figure>

[to-string]: https://tc39.github.io/ecma262/#sec-tostring
[regexp-create]: https://tc39.github.io/ecma262/#sec-regexpcreate
[regexp-exec]: https://tc39.github.io/ecma262/#sec-regexpexec
[require-object-coercible]: https://tc39.github.io/ecma262/#sec-requireobjectcoercible
[internal-slot]: https://tc39.github.io/ecma262/#sec-object-internal-methods-and-internal-slots
[type]: https://tc39.github.io/ecma262/#sec-ecmascript-data-types-and-values
[iterator-prototype]: https://tc39.github.io/ecma262/#sec-%iteratorprototype%-object
[create-iter-result-object]: https://tc39.github.io/ecma262/#sec-createiterresultobject
[isregexp]: https://tc39.github.io/ecma262/#sec-isregexp
[object-create]: https://tc39.github.io/ecma262/#sec-objectcreate
[call]: https://tc39.github.io/ecma262/#sec-call
[species-constructor]: https://tc39.github.io/ecma262/#sec-speciesconstructor
[construct]: https://tc39.github.io/ecma262/#sec-construct
[tolength]: https://tc39.github.io/ecma262/#sec-tolength
[set]: https://tc39.github.io/ecma262/#sec-set-o-p-v-throw
[to-boolean]: https://tc39.github.io/ecma262/#sec-toboolean
