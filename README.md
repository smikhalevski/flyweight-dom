# Flyweight DOM&ensp;🍃&ensp;[![build](https://github.com/smikhalevski/flyweight-dom/actions/workflows/test.yml/badge.svg?branch=master&event=push)](https://github.com/smikhalevski/flyweight-dom/actions/workflows/test.yml)

The extremely fast DOM implementation.

- Zero dependencies;
- [Just 3 kB gzipped;](https://bundlephobia.com/package/flyweight-dom)
- DOM can be extended with custom nodes;
- Low memory consumption.

```sh
npm install --save-prod flyweight-dom
```

# Usage

🔎 [API documentation is available here.](https://smikhalevski.github.io/flyweight-dom/modules.html)

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

## Performance considerations

For better performance, prefer `nextSibling` and `previousSibling` over `childNodes` and `children` whenever possible.

```ts
for (let child = node.firstChild; child !== null; child = child.nextSibling) {
  // Process the child 
}
```

When you read the `childNodes` or `children` properties for the first time an array of nodes is created and then stored
on the node instance. Later when you modify child nodes using `appendChild`, `removeChild` or any other method, these
arrays are updated.
