<p align="center">
  <a href="#readme">
    <img width="400" src="./images/logo.png" alt="Flyweight DOM">
  </a>
  <br>
  <br>
  <a href="https://github.com/smikhalevski/flyweight-dom/actions/workflows/master.yml">
    <img src="https://github.com/smikhalevski/flyweight-dom/actions/workflows/master.yml/badge.svg?branch=master&event=push" alt="build">
  </a>
</p>

The extremely fast DOM implementation.

- Zero dependencies;
- [Just 3 kB gzipped;](https://bundlephobia.com/package/flyweight-dom)
- DOM can be extended with custom nodes;
- Low memory consumption.

```sh
npm install --save-prod flyweight-dom
```

# Usage

🔎 [You can find the full API documentation here.](https://smikhalevski.github.io/flyweight-dom/modules.html)

The implementation provides classes for all DOM nodes:

```ts
import { Element } from 'flyweight-dom';

const element = new Element('div').append(
  'Hello, ',
  new Element('strong').append('world!')
);

element.classList.add('red');

element.getAttribute('class');
// ⮕ 'red'
```

You can create custom nodes by extending [`Node`](https://smikhalevski.github.io/flyweight-dom/interfaces/Node.html)
class or its subclasses:

```ts
import { Element, Node } from 'flyweight-dom';

class MyNode extends Node {}

new Element('div').appendChild(new MyNode());
```

Or extend your already existing classes using a declaration merging:

```ts
// Your existing class
class MyClass {}

// Merge declarations
interface MyClass extends Node {}

// Extend the prototype
Node.extend(MyClass);

new Element('div').append(new MyClass());
```

You can extend classes with any `Node` subclass:

```ts
Element.extend(MyClass);

new MyClass().setAttribute('title', 'Okay');
```

There are [`ChildNode`](https://smikhalevski.github.io/flyweight-dom/interfaces/ChildNode.html) and
[`ParentNode`](https://smikhalevski.github.io/flyweight-dom/interfaces/ParentNode.html) interfaces that you can use to
create a custom node containers or child nodes:

```ts
import { extendParentNode, Node, ParentNode } from 'flyweight-dom';

class MyClass extends Node {}

interface MyClass extends ParentNode {}

extendParentNode(MyClass.prototype);

new MyClass().append('Hello');
```
