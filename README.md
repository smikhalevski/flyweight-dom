<p align="center">
  <a href="#readme"><picture>
    <source media="(prefers-color-scheme: dark)" srcset="./assets/logo-dark.png" />
    <source media="(prefers-color-scheme: light)" srcset="./assets/logo-light.png" />
    <img alt="Flyweight DOM" src="./assets/logo-light.png" width="400" />
  </picture></a>
</p>

The extremely fast DOM implementation.

- DOM can be extended with custom nodes.
- Low memory consumption, minimal amount of allocations.
- Zero dependencies.
- [4 kB gzipped.](https://bundlephobia.com/package/flyweight-dom)

<br>

```sh
npm install --save-prod flyweight-dom
```

# Usage

🔰 [API documentation is available here.](https://smikhalevski.github.io/flyweight-dom/)

The implementation provides classes for all DOM nodes:

```ts
import { Element } from 'flyweight-dom';

const element = new Element('div').append('Hello, ', new Element('strong').append('world!'));

element.classList.add('red');

element.getAttribute('class');
// ⮕ 'red'
```

Use DSL streamline DOM authoring:

```ts
import { h } from 'flyweight-dom/dsl';

const element = h('div', { class: 'red' }, 'Hello, ', h('strong', 'world!'));

element.className;
// ⮕ 'red'

element.textContent;
// ⮕ 'Hello, world!'
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
[`previousSibling`](https://smikhalevski.github.io/flyweight-dom/classes/flyweight-dom.Element.html#previoussiblingg)
over [`childNodes`](https://smikhalevski.github.io/flyweight-dom/classes/flyweight-dom.Element.html#childnodesg) and
[`children`](https://smikhalevski.github.io/flyweight-dom/classes/flyweight-dom.Element.html#children):

```ts
for (let child = parent.firstChild; child !== null; child = child.nextSibling) {
  // Process the child
}
```

Or use the iterator:

```ts
for (const child of parent) {
  // Process the child
}
```

The iterator, `childNodes` and `children` are live and read children by index, the same as
[`NodeList`](https://developer.mozilla.org/en-US/docs/Web/API/NodeList) in browsers. If children change during
iteration, it continues from the next index: removing the current child skips the one after it, and inserting a node
before the current child returns the current child again, so this loop never ends:

```ts
for (const child of parent) {
  child.before(new Text(' '));
}
```

Iterate over a copy if the loop changes children:

```ts
for (const child of Array.from(parent)) {
  child.before(new Text(' '));
}
```

When the `childNodes` or `children` properties are accessed for the first time, a
[`NodeList`](https://smikhalevski.github.io/flyweight-dom/classes/flyweight-dom.NodeList.html) is created and then
stored on the node instance.
