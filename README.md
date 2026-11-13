<p align="center">
  <a href="#readme"><picture>
    <source media="(prefers-color-scheme: dark)" srcset="./assets/logo-dark.png" />
    <source media="(prefers-color-scheme: light)" srcset="./assets/logo-light.png" />
    <img alt="Flyweight DOM" src="./assets/logo-light.png" width="400" />
  </picture></a>
</p>

The extremely fast DOM implementation.

- The DOM API you know from browsers: nodes, tree changes, lookups and traversal.
- [XML namespaces.](#namespaces)
- [DSL for DOM authoring.](#dsl)
- [Custom nodes.](#custom-nodes)
- Low memory consumption, minimal amount of allocations.
- Zero dependencies.
- [6 kB gzipped.](https://bundlephobia.com/package/flyweight-dom)

<br>

```sh
npm install --save-prod flyweight-dom
```

<br>

- [Nodes](#nodes)
- [Attributes](#attributes)
- [Lookups](#lookups)
- [Traversal](#traversal)
- [Namespaces](#namespaces)
- [DSL](#dsl)
- [Custom nodes](#custom-nodes)
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
