# String.prototype.matchAll( *regexp* )</h1>

*matchAll* does not visibly mutate the provided *regexp* in any way.

When the *matchAll* method is called, the following steps are taken:
  1. Let *O* be ? [RequireObjectCoercible][require-object-coercible](**this** value).
  1. Let _isRegExp_ be ? [IsRegExp](isregexp)(_regexp_).
  1. If _isRegExp_ is not **true**, throw a *TypeError* exception.
  1. Let *S* be ? [ToString][to-string](**O**).
  1. Let *flags* be ? [ToString][to-string](? [Get][get](regexp, **"flags"**)).
  1. If *flags* does not contain the character **"g"**, let *flags* be the String concatenation of the String **"g"** and *flags*.
  1. Let *rx* be ? [RegExpCreate][regexo-create](*regexp*, *flags*).
  1. Let *lastIndex* be ? [ToLength][to-length](? [Get][get](regexp, **"lastIndex"**)).
  1. Perform ? [Set][set](*rx*, **"lastIndex"**, *lastIndex*, **true**).
  1. Return ? [CreateRegExpStringIterator](#createregexpstringiterator-abstract-operation)(*rx*, *S*)

Note: The *rx* regular expression value is created solely to ensure that no visible mutation happens on *regexp* - it should never be exposed to the environment.

## CreateRegExpStringIterator( *R*, *S* )

The abstract operation *CreateRegExpStringIterator* is used to create such iterator objects. It performs the following steps:
  1. Assert: [Type][type](*string*) is String.
  1. If ? [IsRegExp][isregexp] is not **true**, throw a *TypeError* exception.
  1. Let *global* be ? [ToBoolean][to-boolean](? [Get][get](*R*, **"global"**));
  1. If *global* is not **true**, throw a *TypeError* exception.
  1. Let *iterator* be [ObjectCreate](object-create](<emu-xref href="#%RegExpStringIteratorPrototype%">%RegExpStringIteratorPrototype%</emu-xref>, « [[IteratedString]], [[IteratingRegExp]] »).
  1. Set *iterator*.[[IteratingRegExp]] to *R*.
  1. Set *iterator*.[[IteratedString]] to *S*.
  1. Return *iterator*.

### The %RegExpStringIteratorPrototype% Object

All RegExp String Iterator Objects inherit properties from the [%RegExpStringIteratorPrototype%](#the-regexpstringiteratorprototype-object) intrinsic object. The %RegExpStringIteratorPrototype% object is an ordinary object and its [[Prototype]] [internal slot][internal-slot] is the [%IteratorPrototype%][iterator-prototype] intrinsic object</a>. In addition, %RegExpStringIteratorPrototype% has the following properties:

#### %RegExpStringIteratorPrototype%.next( )
  1. Let O be the **this** value.
  1. If [Type][type](O) is not Object, throw a **TypeError** exception.
  1. If O does not have all of the internal slots of a RegExp String Iterator Object Instance (see [here](#PropertiesOfRegExpStringIteratorInstances)), throw a **TypeError** exception.
  1. Let _R_ be _O_.[[IteratingRegExp]].
  1. Let _S_ be _O_.[[IteratedString]].
  1. Let _match_ be ? [RegExpExec][regexp-exec](_R_, _S_).
  1. If _match_ is **null**, then
      1. return ! [CreateIterResultObject][create-iter-result-object](**null**, **true**).
  1. Else,
      1. return ! [CreateIterResultObject][create-iter-result-object](_match_, **false**).

The _length_ property of the _next_ method is **0**.

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
        <td>[[IteratedObject]]</td>
        <td>The object whose array elements are being iterated.</td>
      </tr>
      <tr>
        <td>[[ArrayIteratorNextIndex]]</td>
        <td>The integer index of the next integer index to be examined by this iteration.</td>
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

[to-boolean]: https://tc39.github.io/ecma262/#sec-toboolean
[to-length]: https://tc39.github.io/ecma262/#sec-tolength
[to-string]: https://tc39.github.io/ecma262/#sec-tostring
[get]: https://tc39.github.io/ecma262/#sec-get-o-p
[set]: https://tc39.github.io/ecma262/#sec-set-o-p-v-throw
[regexp-create]: https://tc39.github.io/ecma262/#sec-regexpcreate
[regexp-exec]: https://tc39.github.io/ecma262/#sec-regexpexec
[require-object-coercible]: https://tc39.github.io/ecma262/#sec-requireobjectcoercible
[internal-slot]: https://tc39.github.io/ecma262/#sec-object-internal-methods-and-internal-slots
[type]: https://tc39.github.io/ecma262/#sec-ecmascript-data-types-and-values
[iterator-prototype]: https://tc39.github.io/ecma262/#sec-%iteratorprototype%-object
[create-iter-result-object]: https://tc39.github.io/ecma262/#sec-createiterresultobject
[isregexp]: https://tc39.github.io/ecma262/#sec-isregexp
[object-create]: https://tc39.github.io/ecma262/#sec-objectcreate
