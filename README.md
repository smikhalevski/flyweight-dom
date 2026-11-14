<p align="center">
  <a href="#readme"><picture>
    <source media="(prefers-color-scheme: dark)" srcset="./assets/logo-dark.png" />
    <source media="(prefers-color-scheme: light)" srcset="./assets/logo-light.png" />
    <img alt="Flyweight DOM" src="./assets/logo-light.png" width="400" />
  </picture></a>
</p>

[The fastest](#benchmarks) DOM implementation.

- The DOM API you know from browsers: nodes, tree changes, lookups and traversal.
- [XML namespaces.](#namespaces)
- [jQuery-style queries.](#queries)
- [DSL for DOM authoring.](#dsl)
- [Custom nodes.](#custom-nodes)
- Low memory consumption, minimal amount of allocations.
- Zero dependencies.
- [7&#8239;kB gzipped.](https://bundlephobia.com/package/flyweight-dom)

<br>

```sh
npm install --save-prod flyweight-dom
```

<br>

- [Nodes](#nodes)
- [Attributes](#attributes)
- [Lookups](#lookups)
- [Queries](#queries)
- [Traversal](#traversal)
- [Namespaces](#namespaces)
- [DSL](#dsl)
- [Custom nodes](#custom-nodes)
- [Benchmarks](#benchmarks)
- [Performance considerations](#performance-considerations)

# Nodes

There are classes for all DOM nodes:
[`Document`](https://smikhalevski.github.io/flyweight-dom/classes/flyweight-dom.Document.html),
[`DocumentType`](https://smikhalevski.github.io/flyweight-dom/classes/flyweight-dom.DocumentType.html),
[`DocumentFragment`](https://smikhalevski.github.io/flyweight-dom/classes/flyweight-dom.DocumentFragment.html),
[`Element`](https://smikhalevski.github.io/flyweight-dom/classes/flyweight-dom.Element.html),
[`Text`](https://smikhalevski.github.io/flyweight-dom/classes/flyweight-dom.Text.html),
[`CDATASection`](https://smikhalevski.github.io/flyweight-dom/classes/flyweight-dom.CDATASection.html),
[`Comment`](https://smikhalevski.github.io/flyweight-dom/classes/flyweight-dom.Comment.html) and
[`ProcessingInstruction`](https://smikhalevski.github.io/flyweight-dom/classes/flyweight-dom.ProcessingInstruction.html).
Create nodes with constructors:

```ts
import { Element } from 'flyweight-dom';

const element = new Element('div').append('Hello, ', new Element('strong').append('world!'));

element.textContent;
// ⮕ 'Hello, world!'
```

Change the tree with the standard methods:

```ts
const list = new Element('ul');
const item = new Element('li');

list.append(item);

item.before(new Element('li'));
item.replaceWith('Hello');

list.childNodes.length;
// ⮕ 2
```

Nodes can be cloned and compared:

```ts
list.cloneNode(true).isEqualNode(list);
// ⮕ true
```

# Attributes

Attributes are stored in a plain object:

```ts
const element = new Element('a', { href: '#' });

element.setAttribute('title', 'Home');

element.attributes;
// ⮕ { href: '#', title: 'Home' }
```

The element doesn't copy the object passed to the constructor, so don't share it between elements.

[`id`](https://smikhalevski.github.io/flyweight-dom/classes/flyweight-dom.Element.html#id),
[`className`](https://smikhalevski.github.io/flyweight-dom/classes/flyweight-dom.Element.html#classname) and
[`classList`](https://smikhalevski.github.io/flyweight-dom/classes/flyweight-dom.Element.html#classlist) read and write
the corresponding attributes:

```ts
element.classList.add('red');

element.getAttribute('class');
// ⮕ 'red'
```

# Lookups

```ts
import { h } from 'flyweight-dom/dsl';

const document = h.document(h('ul', h('li', { id: 'first', class: 'item' }), h('li', { class: 'item' })));

document.getElementById('first');
// ⮕ The first <li> element

document.getElementsByClassName('item').length;
// ⮕ 2
```

Lookup methods return arrays, not live collections.

# Queries

Use [`$`](https://smikhalevski.github.io/flyweight-dom/functions/flyweight-dom_query._.html) to query a tree in a jQuery
style. Each method returns a new
[`NodeQuery`](https://smikhalevski.github.io/flyweight-dom/classes/flyweight-dom_query.NodeQuery.html), so queries can
be chained and reused:

```ts
import { $ } from 'flyweight-dom/query';

const $items = $(document).descendants('ul').children('li');

$items.hasClass('done').nodes.length;
// ⮕ 2
```

## Selecting elements

These methods move from the selected nodes to other elements:

| Method                                                                                                                                                                                                                             | Selects                                          | CSS     |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------- | :------ |
| [`children`](https://smikhalevski.github.io/flyweight-dom/classes/flyweight-dom_query.NodeQuery.html#children)                                                                                                                     | Child elements                                   | `A > B` |
| [`descendants`](https://smikhalevski.github.io/flyweight-dom/classes/flyweight-dom_query.NodeQuery.html#descendants)                                                                                                               | Descendant elements                              | `A B`   |
| [`parent`](https://smikhalevski.github.io/flyweight-dom/classes/flyweight-dom_query.NodeQuery.html#parent)                                                                                                                         | Parent elements                                  |         |
| [`ancestors`](https://smikhalevski.github.io/flyweight-dom/classes/flyweight-dom_query.NodeQuery.html#ancestors)                                                                                                                   | Ancestor elements, closest first                 |         |
| [`closest`](https://smikhalevski.github.io/flyweight-dom/classes/flyweight-dom_query.NodeQuery.html#closest)                                                                                                                       | The node itself or its closest matching ancestor |         |
| [`siblings`](https://smikhalevski.github.io/flyweight-dom/classes/flyweight-dom_query.NodeQuery.html#siblings)                                                                                                                     | Sibling elements                                 |         |
| [`next`](https://smikhalevski.github.io/flyweight-dom/classes/flyweight-dom_query.NodeQuery.html#next), [`previous`](https://smikhalevski.github.io/flyweight-dom/classes/flyweight-dom_query.NodeQuery.html#previous)             | The adjacent sibling element                     | `A + B` |
| [`following`](https://smikhalevski.github.io/flyweight-dom/classes/flyweight-dom_query.NodeQuery.html#following), [`preceding`](https://smikhalevski.github.io/flyweight-dom/classes/flyweight-dom_query.NodeQuery.html#preceding) | All following or preceding sibling elements      | `A ~ B` |

They take a local name and a namespace. Both are `*` by default, which matches anything, and the `null` namespace
matches elements without one:

```ts
const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

// <circle> elements in the SVG namespace
$(document).descendants('circle', SVG_NAMESPACE);

// All elements in the SVG namespace
$(document).descendants('*', SVG_NAMESPACE);

// The closest <section> of each <h2>
$(document).descendants('h2').closest('section');
```

Each element is selected once, even if several nodes lead to it.

## Filtering

These methods keep only some of the selected nodes:

| Method                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Keeps                               | CSS                    |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------- | :--------------------- |
| [`hasAttribute`](https://smikhalevski.github.io/flyweight-dom/classes/flyweight-dom_query.NodeQuery.html#hasattribute), [`hasAttributeNS`](https://smikhalevski.github.io/flyweight-dom/classes/flyweight-dom_query.NodeQuery.html#hasattributens)                                                                                                                                                                                                                     | Elements with the attribute         | `[name]`, `[ns\|name]` |
| [`hasClass`](https://smikhalevski.github.io/flyweight-dom/classes/flyweight-dom_query.NodeQuery.html#hasclass)                                                                                                                                                                                                                                                                                                                                                         | Elements with all given classes     | `.a.b`                 |
| [`hasText`](https://smikhalevski.github.io/flyweight-dom/classes/flyweight-dom_query.NodeQuery.html#hastext)                                                                                                                                                                                                                                                                                                                                                           | Nodes by their text content         |                        |
| [`has`](https://smikhalevski.github.io/flyweight-dom/classes/flyweight-dom_query.NodeQuery.html#has)                                                                                                                                                                                                                                                                                                                                                                   | Nodes with a matching descendant    | `:has(B)`              |
| [`nthChild`](https://smikhalevski.github.io/flyweight-dom/classes/flyweight-dom_query.NodeQuery.html#nthchild), [`firstChild`](https://smikhalevski.github.io/flyweight-dom/classes/flyweight-dom_query.NodeQuery.html#firstchild), [`lastChild`](https://smikhalevski.github.io/flyweight-dom/classes/flyweight-dom_query.NodeQuery.html#lastchild), [`onlyChild`](https://smikhalevski.github.io/flyweight-dom/classes/flyweight-dom_query.NodeQuery.html#onlychild) | Elements by position among siblings | `:nth-child()`         |
| [`hasNoContent`](https://smikhalevski.github.io/flyweight-dom/classes/flyweight-dom_query.NodeQuery.html#hasnocontent)                                                                                                                                                                                                                                                                                                                                                 | Nodes without elements and text     | `:empty`               |
| [`filter`](https://smikhalevski.github.io/flyweight-dom/classes/flyweight-dom_query.NodeQuery.html#filter), [`not`](https://smikhalevski.github.io/flyweight-dom/classes/flyweight-dom_query.NodeQuery.html#not)                                                                                                                                                                                                                                                       | Nodes that pass a predicate         | `:not()`               |

Attribute values and text are checked with a string, a regular expression or a callback:

```ts
$(document)
  .descendants('a')
  .hasAttribute('href', /^https:/);

$(document)
  .descendants('p')
  .hasText(text => text.length > 100);

// Attributes in any namespace, the same as [*|href]
$(document).descendants().hasAttributeNS('*', 'href');
```

`nthChild` counts from 0, and a negative index counts from the last child:

```ts
// The second item of each list
$(document).descendants('ul').children('li').nthChild(1);
```

A predicate of `filter` and `not` can return a query, which passes if it isn't empty:

```ts
// Paragraphs outside of <aside> elements
$(document)
  .descendants('p')
  .not(element => $(element).ancestors('aside'));
```

## Reading results

```ts
const $links = $(document).descendants('a');

// The selected nodes
$links.nodes;

// The first node, or null if there are no nodes
$links.node;

// The number of selected nodes
$links.length;

// Queries are iterable
for (const link of $links) {
  // Process the link
}

// The attribute of the first node
$links.getAttribute('href');

// The text content of all nodes
$links.text;

// Narrow down to one node
$links.first().closest('nav');
```

Use [`queries`](https://smikhalevski.github.io/flyweight-dom/classes/flyweight-dom_query.NodeQuery.html#queries) to
iterate over queries that hold one node each:

```ts
for (const $item of $(document).descendants('item').queries()) {
  $item.children('title').text;
}
```

Use [`at`](https://smikhalevski.github.io/flyweight-dom/classes/flyweight-dom_query.NodeQuery.html#at),
[`first`](https://smikhalevski.github.io/flyweight-dom/classes/flyweight-dom_query.NodeQuery.html#first) and
[`last`](https://smikhalevski.github.io/flyweight-dom/classes/flyweight-dom_query.NodeQuery.html#last) to pick a node by
its index, [`union`](https://smikhalevski.github.io/flyweight-dom/classes/flyweight-dom_query.NodeQuery.html#union) to
merge queries, and
[`remove`](https://smikhalevski.github.io/flyweight-dom/classes/flyweight-dom_query.NodeQuery.html#remove) to remove
nodes from their parents.

# Traversal

Iterate over children of a node:

```ts
for (const child of parent) {
  // Process the child
}
```

Or use a [`TreeWalker`](https://smikhalevski.github.io/flyweight-dom/classes/flyweight-dom.TreeWalker.html) to visit
descendants:

```ts
import { NodeFilter, TreeWalker } from 'flyweight-dom';

const treeWalker = new TreeWalker(document, NodeFilter.SHOW_ELEMENT);

for (let node; (node = treeWalker.nextNode()) !== null;) {
  // Process the element
}
```

# Namespaces

Pass the namespace of an element to the constructor:

```ts
const element = new Element('svg:circle', {}, 'http://www.w3.org/2000/svg');

element.namespaceURI;
// ⮕ 'http://www.w3.org/2000/svg'

element.prefix;
// ⮕ 'svg'

element.localName;
// ⮕ 'circle'
```

The namespace is never read from `xmlns` attributes of the element. An element without a namespace has no prefix, and
its local name is the whole tag name.

Namespaces of attributes aren't stored. An attribute has the namespace that its prefix is bound to by the closest
`xmlns:*` attribute, and an attribute without a prefix has no namespace:

```ts
const element = new Element('a', {
  'xmlns:xlink': 'http://www.w3.org/1999/xlink',
  'xlink:href': '#',
});

element.getAttributeNS('http://www.w3.org/1999/xlink', 'href');
// ⮕ '#'

element.lookupNamespaceURI('xlink');
// ⮕ 'http://www.w3.org/1999/xlink'

element.lookupPrefix('http://www.w3.org/1999/xlink');
// ⮕ 'xlink'
```

[`setAttributeNS`](https://smikhalevski.github.io/flyweight-dom/classes/flyweight-dom.Element.html#setattributens)
declares the prefix on the element if the prefix isn't bound yet:

```ts
const element = new Element('a');

element.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#');

element.attributes;
// ⮕ { 'xmlns:xlink': 'http://www.w3.org/1999/xlink', 'xlink:href': '#' }
```

# DSL

Use [`h`](https://smikhalevski.github.io/flyweight-dom/variables/flyweight-dom_dsl.h.html) to create elements.
Attributes are optional:

```ts
import { h } from 'flyweight-dom/dsl';

const element = h('div', { class: 'red' }, 'Hello, ', h('strong', 'world!'));

element.className;
// ⮕ 'red'

element.textContent;
// ⮕ 'Hello, world!'
```

Strings, numbers and bigints become text nodes. `null`, `undefined` and booleans are skipped, so children can be
conditional:

```ts
h('ul', isEmpty && h('li', 'Empty'));
```

Other nodes are created by methods of `h`:

```ts
h.document(h.doctype('html'), h('html', h.comment('Hello')));

h.fragment(h('p'), h.cdata('Hello'), h.processingInstruction('xml', 'version="1.0"'));
```

Create elements that have a namespace:

```ts
import { createElementFactory } from 'flyweight-dom/dsl';

const svgFactory = createElementFactory('http://www.w3.org/2000/svg');

svgFactory('svg', svgFactory('circle', { r: '10' }));
```

# Custom nodes

Create custom nodes:

```ts
import { Node } from 'flyweight-dom';

class MyNode extends Node {
  readonly nodeName = '#my-node';
  readonly nodeType = 100;
}

const myNode = new MyNode();
const element = new Element('div');

element.appendChild(myNode);

element.firstChild;
// ⮕ myNode
```

Custom nodes can extend
[`ChildNode`](https://smikhalevski.github.io/flyweight-dom/interfaces/flyweight-dom.ChildNode.html) and
[`ParentNode`](https://smikhalevski.github.io/flyweight-dom/interfaces/flyweight-dom.ParentNode.html):

```ts
import { Node, ChildNode, ParentNode } from 'flyweight-dom';

class MyNode extends ParentNode(ChildNode()) {
  readonly nodeName = '#my-node';
  readonly nodeType = 100;
}

new MyNode() instanceof ChildNode();
// ✅ true

new MyNode() instanceof ParentNode(ChildNode());
// ✅ true

new MyNode() instanceof ParentNode();
// ❌ false
```

# Benchmarks

Flyweight DOM is 4–70× faster than domhandler and jsdom on common operations, and takes the least memory per element:

|                        |     flyweight-dom | [domhandler](https://github.com/fb55/domhandler)@6.0.1 | [jsdom](https://github.com/jsdom/jsdom)@31.0.0 |
| :--------------------- | ----------------: | -----------------------------------------------------: | ---------------------------------------------: |
| `new Element`          | **150&#8239;MHz** |                                           33&#8239;MHz |                                  2.8&#8239;MHz |
| `appendChild`          | **134&#8239;MHz** |                                           23&#8239;MHz |                                  2.0&#8239;MHz |
| `cloneNode(true)`      | **125&#8239;kHz** |                                           29&#8239;kHz |                                  1.9&#8239;kHz |
| `getElementsByTagName` | **413&#8239;kHz** |                                           58&#8239;kHz |                                   57&#8239;kHz |
| `textContent`          | **216&#8239;kHz** |                                           44&#8239;kHz |                                   58&#8239;kHz |
| Memory per element     |   **175&#8239;B** |                                            204&#8239;B |                                  1.07&#8239;kB |

Speed is the number of operations per second, higher is better. Memory is the heap that an element takes, lower is
better. Run `npm run perf` to reproduce, see [`perf.ts`](./src/test/perf.ts) for all benchmarks.

# Performance considerations

For better performance, prefer
[`nextSibling`](https://smikhalevski.github.io/flyweight-dom/classes/flyweight-dom.Element.html#nextsibling) and
[`previousSibling`](https://smikhalevski.github.io/flyweight-dom/classes/flyweight-dom.Element.html#previoussibling)
over [`childNodes`](https://smikhalevski.github.io/flyweight-dom/classes/flyweight-dom.Element.html#childnodes) and
[`children`](https://smikhalevski.github.io/flyweight-dom/classes/flyweight-dom.Element.html#children):

```ts
for (let child = parent.firstChild; child !== null; child = child.nextSibling) {
  // Process the child
}
```

The iterator, `childNodes` and `children` are live and read children by index, the same as
[`NodeList`](https://developer.mozilla.org/en-US/docs/Web/API/NodeList) in browsers. If children change during
iteration, it continues from the next index: removing the current child skips the one after it, and inserting a node
before the current child returns the current child again, so this loop never ends:

```ts
for (const child of parent) {
  child.before(new Text('Hello'));
}
```

Iterate over a copy if the loop changes children:

```ts
for (const child of Array.from(parent)) {
  child.before(new Text('Hello'));
}
```

When the `childNodes` or `children` properties are accessed for the first time, a
[`NodeList`](https://smikhalevski.github.io/flyweight-dom/classes/flyweight-dom.NodeList.html) is created and then
stored on the node instance.
