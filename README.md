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

The extremely fast DOM implementation in [just 3 kB gzipped.](https://bundlephobia.com/package/flyweight-dom)

```sh
npm install --save-prod flyweight-dom
```

🔎 [You can find the full API documentation here.](https://smikhalevski.github.io/flyweight-dom/modules.html)

```ts
import { Element } from 'flyweight-dom';

const element = new Element('div').append(
  'Hello, ',
  new Element('strong').append('world!')
);

element.classList.add('red');

element.getAttribute('class');
// → 'red'
```
