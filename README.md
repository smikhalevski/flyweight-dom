# Flyweight DOM

```sh
npm install --save-prod flyweight-dom
```

The extremely fast DOM implementation.

- DOM can be extended with custom nodes;
- Low memory consumption;
- Zero dependencies;
- [4 kB gzipped.](https://bundlephobia.com/package/flyweight-dom)

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

## Performance considerations

For better performance, prefer `nextSibling` and `previousSibling` over `childNodes` and `children` whenever possible.

```ts
for (let child = node.firstChild; child !== null; child = child.nextSibling) {
  // Process the child 
}
```

When you read the `childNodes` or `children` properties for the first time an array of nodes is created and then stored
on the node instance. Later when you modify child nodes using `appendChild`, `removeChild` or any other method, these
arrays are updated which may introduce a performance impact.
