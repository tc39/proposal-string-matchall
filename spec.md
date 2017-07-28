# String.prototype.matchAll( *regexp* )</h1>

*matchAll* does not visibly mutate the provided *regexp* in any way.

When the *matchAll* method is called, the following steps are taken:
  1. Let *O* be [RequireObjectCoercible][require-object-coercible](**this** value).
  1. If *regexp* does not have a [[RegExpMatcher]] [internal slot][internal-slot], throw a **TypeError** exception.
  1. Let *S* be [ToString][to-string](**O**).
  1. [ReturnIfAbrupt][return-if-abrupt](*S*).
  1. Let *flags* be [ToString][to-string]([Get][get](regexp, **"flags"**)).
  1. [ReturnIfAbrupt][return-if-abrupt](*flags*).
  1. If *flags* does not contain the character **"g"**, let *flags* be the String concatenation of the String **"g"** and *flags*.
  1. Let *rx* be [RegExpCreate][regexo-create](*regexp*, *flags*).
  1. Let *lastIndex* be [ToLength][to-length]([Get][get](regexp, **"lastIndex"**)).
  1. [ReturnIfAbrupt][return-if-abrupt](*lastIndex*).
  1. Let *setStatus* be [Set][set](*rx*, **"lastIndex"**, *lastIndex*, **true**).
  1. [ReturnIfAbrupt][return-if-abrupt](*setStatus*).
  1. Return [CreateRegExpStringIterator](#createregexpstringiterator-abstract-operation)(*rx*, *S*)

The *length* property of the *matchAll* method is **1**.

Note: The *rx* regular expression value is created solely to ensure that no visible mutation happens on *regexp* - it should never be exposed to the environment.

## CreateRegExpStringIterator Abstract Operation

The abstract operation CreateRegExpStringIterator with arguments *regexp* and *string* is used to create such iterator objects. It performs the following steps:
  1. Assert: [Type][type](*R*) is Object.
  1. Assert: *R* has a [[RegExpMatcher]] [internal slot][internal-slot].
  1. Assert: [ToBoolean][to-boolean]([Get][get](*R*, **"global"**)) is **true**.
  1. Assert: [Type][type](*S*) is String.
  1. Let *iterator* be ObjectCreate(<emu-xref href="#%RegExpStringIteratorPrototype%">%RegExpStringIteratorPrototype%</emu-xref>, «[[IteratedString]], [[IteratingRegExp]]»).
  1. Set *iterator's* [[IteratingRegExp]] [internal slot][internal-slot] to *R*.
  1. Set *iterator's* [[IteratedString]] [internal slot][internal-slot] to *S*.
  1. Return *iterator*.

### The %RegExpStringIteratorPrototype% Object

All RegExp String Iterator Objects inherit properties from the [%RegExpStringIteratorPrototype%](#the-regexpstringiteratorprototype-object) intrinsic object. The %RegExpStringIteratorPrototype% object is an ordinary object and its [[Prototype]] [internal slot][internal-slot] is the [%IteratorPrototype%][iterator-prototype] intrinsic object</a>. In addition, %RegExpStringIteratorPrototype% has the following properties:

#### %RegExpStringIteratorPrototype%.next()
  1. Let O be the **this** value.
  1. If [Type][type](O) is not Object, throw a **TypeError** exception.
  1. If O does not have all of the internal slots of a RegExp String Iterator Object Instance (see [here](#PropertiesOfRegExpStringIteratorInstances)), throw a **TypeError** exception.
  1. Let _regexp_ be the value of the [[IteratingRegExp]] [internal slot][internal-slot] of _O_.
  1. Let _string_ be the value of the [[IteratedString]] [internal slot][internal-slot] of _O_.
  1. Let _match_ be [RegExpExec][regexp-exec](_regexp_, _string_)
  1. If _match_ is **null**, then
    1. return [CreateIterResultObject][create-iter-result-object](**null**, **true**).
  1. Else,
    1. return [CreateIterResultObject][create-iter-result-object](_match_, **false**).

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

[return-if-abrupt]: http://www.ecma-international.org/ecma-262/6.0/index.html#sec-returnifabrupt
[to-boolean]: http://www.ecma-international.org/ecma-262/6.0/index.html#sec-toboolean
[to-length]: http://www.ecma-international.org/ecma-262/6.0/index.html#sec-tolength
[to-string]: http://www.ecma-international.org/ecma-262/6.0/index.html#sec-tostring
[get]: http://www.ecma-international.org/ecma-262/6.0/index.html#sec-get-o-p
[set]: http://www.ecma-international.org/ecma-262/6.0/index.html#sec-set-o-p-v-throw
[regexp-create]: http://www.ecma-international.org/ecma-262/6.0/index.html#sec-regexpcreate
[regexp-exec]: http://www.ecma-international.org/ecma-262/6.0/index.html#sec-regexpexec
[require-object-coercible]: http://www.ecma-international.org/ecma-262/6.0/index.html#sec-requireobjectcoercible
[internal-slot]: http://www.ecma-international.org/ecma-262/6.0/#sec-object-internal-methods-and-internal-slots
[type]: http://www.ecma-international.org/ecma-262/6.0/#sec-ecmascript-data-types-and-values
[iterator-prototype]: http://www.ecma-international.org/ecma-262/6.0/#sec-%iteratorprototype%-object
[create-iter-result-object]: http://www.ecma-international.org/ecma-262/6.0/index.html#sec-createiterresultobject
