<p align="center">
  <a href="#readme"><picture>
    <source media="(prefers-color-scheme: dark)" srcset="./assets/logo-dark.png" />
    <source media="(prefers-color-scheme: light)" srcset="./assets/logo-light.png" />
    <img alt="Flyweight DOM" src="./assets/logo-light.png" width="400" />
  </picture></a>
</p>

<br>

```sh
npm install --save-prod flyweight-dom
```

The extremely fast DOM implementation.

- DOM can be extended with custom nodes;
- Low memory consumption;
- Zero dependencies;
- [4 kB gzipped.](https://bundlephobia.com/package/flyweight-dom)

# Usage

🔎 [API documentation is available here.](https://smikhalevski.github.io/flyweight-dom/)

The implementation provides classes for all DOM nodes:

```ts
import { Element } from 'flyweight-dom';

const element = new Element('div').append('Hello, ', new Element('strong').append('world!'));

element.classList.add('red');

element.getAttribute('class');
// ⮕ 'red'
```

Use DSL to streamlines DOM authoring:

```ts
import dsl from 'flyweight-dom/dsl';

const element = dsl.div({ class: 'red' }, 'Hello, ', dsl.strong('world!'));

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
[`ChildNode`](https://smikhalevski.github.io/flyweight-dom/interfaces/flyweight_dom.ChildNode.html) and
[`ParenNode`](https://smikhalevski.github.io/flyweight-dom/interfaces/flyweight_dom.ParenNode.html):

```ts
import { Node, ChildNode, ParentNode } from 'flyweight-dom';

class MyNode extends ChildNode(ParentNode()) {
  readonly nodeName = '#my-node';
  readonly nodeType = 100;
}

new MyNode() instanceof ParentNode();
// ✅ true

new MyNode() instanceof ChildNode(ParentNode());
// ✅ true

new MyNode() instanceof ChildNode();
// ❌ false
```

# Performance considerations

For better performance, prefer `nextSibling` and `previousSibling` over `childNodes` and `children` whenever possible.

```ts
for (let child = node.firstChild; child !== null; child = child.nextSibling) {
  // Process the child
}
```

When you read the `childNodes` or `children` properties for the first time an array of nodes is created and then stored
on the node instance. Later when you modify child nodes using `appendChild`, `removeChild` or any other method, these
arrays are updated which may introduce a performance impact.
