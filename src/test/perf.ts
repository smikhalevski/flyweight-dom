import * as domhandler from 'domhandler';
import * as domutils from 'domutils';
import { describe, measure, test } from 'toofast';
// @ts-ignore
import { f } from '../main/dsl.ts';
// @ts-ignore
import * as flyweightDom from '../main/index.ts';
import { collectGarbage } from './test-utils.ts';

/**
 * The number of children that are created before each batch of a measure that changes them. Fewer children make
 * batches too short to time precisely.
 */
const CHILD_COUNT = 100_000;

/**
 * Creates nodes of a DOM implementation, so tests build the same trees with each of them.
 */
interface TestFactory<TElement, TText> {
  createElement(tagName: string, attributes: Record<string, string>): TElement;

  createText(data: string): TText;

  appendChild(parent: TElement, child: TElement | TText): void;
}

const flyweightFactory: TestFactory<flyweightDom.Element, flyweightDom.Text> = {
  createElement(tagName, attributes) {
    return new flyweightDom.Element(tagName, attributes);
  },

  createText(data) {
    return new flyweightDom.Text(data);
  },

  appendChild(parent, child) {
    parent.appendChild(child);
  },
};

const domhandlerFactory: TestFactory<domhandler.Element, domhandler.Text> = {
  createElement(tagName, attributes) {
    return new domhandler.Element(tagName, attributes);
  },

  createText(data) {
    return new domhandler.Text(data);
  },

  appendChild(parent, child) {
    domutils.appendChild(parent, child);
  },
};

/**
 * Returns a new jsdom window and a factory of its nodes. jsdom is imported by tests that use it, so processes of other
 * tests don't load it.
 */
async function makeTestJsdom() {
  const { JSDOM } = await import('jsdom');
  const { window } = new JSDOM('');
  const { document } = window;

  const factory: TestFactory<any, any> = {
    createElement(tagName, attributes) {
      const element = document.createElement(tagName);

      for (const name in attributes) {
        element.setAttribute(name, attributes[name]);
      }
      return element;
    },

    createText(data) {
      return document.createTextNode(data);
    },

    appendChild(parent, child) {
      parent.appendChild(child);
    },
  };

  return { window, document, factory };
}

/**
 * Returns a div with children that are span elements and texts in turns.
 */
function makeTestParent<TElement, TText>(factory: TestFactory<TElement, TText>, childCount: number): TElement {
  const parent = factory.createElement('div', {});

  for (let i = 0; i < childCount; ++i) {
    factory.appendChild(parent, i % 2 === 0 ? factory.createElement('span', {}) : factory.createText('aaa'));
  }
  return parent;
}

/**
 * Returns a tree of 341 elements and 340 texts. Each element above the 4th level has 4 child elements, and each child
 * element follows a text. Elements are div and span in turns, and have IDs from id0 to id340 in document order. Every
 * third element has the class "aaa bbb" and the name "ccc", and other elements have the class "ddd".
 */
function makeTestTree<TElement, TText>(factory: TestFactory<TElement, TText>): TElement {
  let elementCount = 0;

  function createElement(depth: number): TElement {
    const index = elementCount++;

    const element = factory.createElement(
      index % 2 === 0 ? 'div' : 'span',
      index % 3 === 0 ? { id: 'id' + index, class: 'aaa bbb', name: 'ccc' } : { id: 'id' + index, class: 'ddd' }
    );

    if (depth < 4) {
      for (let i = 0; i < 4; ++i) {
        factory.appendChild(element, factory.createText('aaa'));
        factory.appendChild(element, createElement(depth + 1));
      }
    }
    return element;
  }

  return createElement(0);
}

/**
 * Measures the callback with a new child for each call. Before each batch, a new div gets {@link CHILD_COUNT} children,
 * which are passed to the callback from the last to the first one, so removing a child is cheap in all libraries.
 *
 * Garbage is collected after children are created, so the collector doesn't run during the batch, and children are in
 * the old generation, the same as nodes of a document that lives for a while.
 */
function measureEachChild<TElement, TText, TChild extends TElement | TText>(
  factory: TestFactory<TElement, TText>,
  createChild: () => TChild,
  callback: (child: TChild, parent: TElement) => unknown
): void {
  const children: TChild[] = [];

  let parent: TElement;
  let index = 0;

  measure(
    {
      maxBatchIterationCount: CHILD_COUNT,

      async beforeBatch() {
        parent = factory.createElement('div', {});

        for (let i = 0; i < CHILD_COUNT; ++i) {
          const child = createChild();

          factory.appendChild(parent, child);
          children[i] = child;
        }
        index = CHILD_COUNT;

        await collectGarbage();
      },
    },
    () => callback(children[--index], parent)
  );
}

/**
 * Reads each node of the list by index, and returns the last one.
 */
function readByIndex<T>(list: ArrayLike<T>): T | undefined {
  let node;
  for (let i = 0; i < list.length; ++i) {
    node = list[i];
  }
  return node;
}

/**
 * Reads each node with an iterator, and returns the last one.
 */
function readByIterator<T>(iterable: Iterable<T>): T | undefined {
  let node;
  for (const value of iterable) {
    node = value;
  }
  return node;
}

/**
 * Reads the node and its following siblings, and returns the last one.
 */
function readSiblings<T extends { readonly nextSibling: T | null }>(node: T | null): T | null {
  let lastNode = node;
  for (; node !== null; node = node.nextSibling) {
    lastNode = node;
  }
  return lastNode;
}

/**
 * Returns the number of nodes that the tree walker visits.
 */
function countNodes(treeWalker: { nextNode(): unknown }): number {
  let nodeCount = 0;
  while (treeWalker.nextNode() !== null) {
    ++nodeCount;
  }
  return nodeCount;
}

/**
 * Accepts elements and skips other nodes. Shared by tests, so all libraries are measured with the same filter.
 */
function acceptElement(node: { readonly nodeType: number }): number {
  return node.nodeType === /* ELEMENT_NODE */ 1 ? /* FILTER_ACCEPT */ 1 : /* FILTER_SKIP */ 3;
}

const bbbClassPattern = /(?:^|\s)bbb(?:\s|$)/;

/**
 * Returns `true` if the class has the "bbb" token. domutils compares the whole attribute to a string, so a predicate
 * matches tokens the same way getElementsByClassName does.
 */
function hasBbbClass(className: string): boolean {
  return bbbClassPattern.test(className);
}

describe('new Element', () => {
  test('flyweight-dom', () => {
    measure(() => new flyweightDom.Element('div'));
  });

  test('domhandler', () => {
    measure(() => new domhandler.Element('div', {}));
  });

  test('jsdom', async () => {
    const { document } = await makeTestJsdom();

    measure(() => document.createElement('div'));
  });
});

describe('new Element with attributes', () => {
  test('flyweight-dom', () => {
    measure(() => new flyweightDom.Element('div', { id: 'aaa', class: 'bbb' }));
  });

  test('domhandler', () => {
    measure(() => new domhandler.Element('div', { id: 'aaa', class: 'bbb' }));
  });

  test('jsdom', async () => {
    const { factory } = await makeTestJsdom();

    measure(() => factory.createElement('div', { id: 'aaa', class: 'bbb' }));
  });
});

describe('new Text', () => {
  test('flyweight-dom', () => {
    measure(() => new flyweightDom.Text('aaa'));
  });

  test('domhandler', () => {
    measure(() => new domhandler.Text('aaa'));
  });

  test('jsdom', async () => {
    const { document } = await makeTestJsdom();

    measure(() => document.createTextNode('aaa'));
  });
});

describe('new Comment', () => {
  test('flyweight-dom', () => {
    measure(() => new flyweightDom.Comment('aaa'));
  });

  test('domhandler', () => {
    measure(() => new domhandler.Comment('aaa'));
  });

  test('jsdom', async () => {
    const { document } = await makeTestJsdom();

    measure(() => document.createComment('aaa'));
  });
});

describe('new CDATASection', () => {
  test('flyweight-dom', () => {
    measure(() => new flyweightDom.CDATASection('aaa'));
  });

  test('domhandler', () => {
    // domhandler stores the data of a CDATA section in a child text
    measure(() => new domhandler.CDATA([new domhandler.Text('aaa')]));
  });

  test('jsdom', async () => {
    const { document } = await makeTestJsdom();

    // HTML documents can't create CDATA sections
    const xmlDocument = document.implementation.createDocument(null, null);

    measure(() => xmlDocument.createCDATASection('aaa'));
  });
});

describe('new ProcessingInstruction', () => {
  test('flyweight-dom', () => {
    measure(() => new flyweightDom.ProcessingInstruction('aaa', 'bbb'));
  });

  test('domhandler', () => {
    measure(() => new domhandler.ProcessingInstruction('aaa', 'bbb'));
  });

  test('jsdom', async () => {
    const { document } = await makeTestJsdom();

    measure(() => document.createProcessingInstruction('aaa', 'bbb'));
  });
});

describe('new DocumentType', () => {
  test('flyweight-dom', () => {
    measure(() => new flyweightDom.DocumentType('html'));
  });

  test('domhandler', () => {
    // domhandler represents a doctype as a directive
    measure(() => new domhandler.ProcessingInstruction('!doctype', '!DOCTYPE html'));
  });

  test('jsdom', async () => {
    const { document } = await makeTestJsdom();

    measure(() => document.implementation.createDocumentType('html', '', ''));
  });
});

describe('new DocumentFragment', () => {
  test('flyweight-dom', () => {
    measure(() => new flyweightDom.DocumentFragment());
  });

  test('jsdom', async () => {
    const { document } = await makeTestJsdom();

    measure(() => document.createDocumentFragment());
  });
});

describe('new Document', () => {
  test('flyweight-dom', () => {
    measure(() => new flyweightDom.Document());
  });

  test('domhandler', () => {
    measure(() => new domhandler.Document([]));
  });

  test('jsdom', async () => {
    const { window } = await makeTestJsdom();

    measure(() => new window.Document());
  });
});

describe('f.div', () => {
  test('flyweight-dom', () => {
    measure(() => f.div({ class: 'aaa' }, 'bbb', f.span('ccc')));
  });
});

describe('Element.childNodes on first read', () => {
  test('flyweight-dom', () => {
    measureEachChild(
      flyweightFactory,
      () => new flyweightDom.Element('span'),
      child => child.childNodes.length
    );
  });

  test('domhandler', () => {
    measureEachChild(
      domhandlerFactory,
      () => new domhandler.Element('span', {}),
      child => child.childNodes.length
    );
  });

  test('jsdom', async () => {
    const { document, factory } = await makeTestJsdom();

    measureEachChild(
      factory,
      () => document.createElement('span'),
      child => child.childNodes.length
    );
  });
});

describe('Element.childNodes', () => {
  test('flyweight-dom', () => {
    const parent = makeTestParent(flyweightFactory, 100);

    measure(() => readByIndex(parent.childNodes));
  });

  test('domhandler', () => {
    const parent = makeTestParent(domhandlerFactory, 100);

    measure(() => readByIndex(parent.childNodes));
  });

  test('jsdom', async () => {
    const { factory } = await makeTestJsdom();
    const parent = makeTestParent(factory, 100);

    measure(() => readByIndex(parent.childNodes));
  });
});

describe('Element.children', () => {
  test('flyweight-dom', () => {
    const parent = makeTestParent(flyweightFactory, 100);

    measure(() => readByIndex(parent.children));
  });

  test('jsdom', async () => {
    const { factory } = await makeTestJsdom();
    const parent = makeTestParent(factory, 100);

    measure(() => readByIndex(parent.children));
  });
});

describe('Element[Symbol.iterator]', () => {
  test('flyweight-dom', () => {
    const parent = makeTestParent(flyweightFactory, 100);

    measure(() => readByIterator(parent));
  });

  test('domhandler', () => {
    const parent = makeTestParent(domhandlerFactory, 100);

    // domhandler elements aren't iterable, but their children are an array
    measure(() => readByIterator(parent.children));
  });

  test('jsdom', async () => {
    const { factory } = await makeTestJsdom();
    const parent = makeTestParent(factory, 100);

    // jsdom elements aren't iterable
    measure(() => readByIterator(parent.childNodes));
  });
});

describe('Node.nextSibling', () => {
  test('flyweight-dom', () => {
    const parent = makeTestParent(flyweightFactory, 100);

    measure(() => readSiblings(parent.firstChild));
  });

  test('domhandler', () => {
    const parent = makeTestParent(domhandlerFactory, 100);

    measure(() => readSiblings(parent.firstChild));
  });

  test('jsdom', async () => {
    const { factory } = await makeTestJsdom();
    const parent = makeTestParent(factory, 100);

    measure(() => readSiblings(parent.firstChild));
  });
});

// Moves the first child to the end, so the parent keeps its children
describe('Element.appendChild', () => {
  test('flyweight-dom', () => {
    const parent = makeTestParent(flyweightFactory, 3);

    measure(() => parent.appendChild(parent.firstChild!));
  });

  test('domhandler', () => {
    const parent = makeTestParent(domhandlerFactory, 3);

    measure(() => domutils.appendChild(parent, parent.children[0]));
  });

  test('jsdom', async () => {
    const { factory } = await makeTestJsdom();
    const parent = makeTestParent(factory, 3);

    measure(() => parent.appendChild(parent.firstChild));
  });
});

// Moves the first and the last child to the end, so the parent keeps its children
describe('Element.append', () => {
  test('flyweight-dom', () => {
    const parent = makeTestParent(flyweightFactory, 3);

    measure(() => parent.append(parent.firstChild!, parent.lastChild!));
  });

  test('domhandler', () => {
    const parent = makeTestParent(domhandlerFactory, 3);
    const { children } = parent;

    measure(() => {
      const firstChild = children[0];
      const lastChild = children[children.length - 1];

      domutils.appendChild(parent, firstChild);
      domutils.appendChild(parent, lastChild);
    });
  });

  test('jsdom', async () => {
    const { factory } = await makeTestJsdom();
    const parent = makeTestParent(factory, 3);

    measure(() => parent.append(parent.firstChild, parent.lastChild));
  });
});

// Moves the last child to the start, so the parent keeps its children
describe('Element.prepend', () => {
  test('flyweight-dom', () => {
    const parent = makeTestParent(flyweightFactory, 3);

    measure(() => parent.prepend(parent.lastChild!));
  });

  test('domhandler', () => {
    const parent = makeTestParent(domhandlerFactory, 3);
    const { children } = parent;

    measure(() => domutils.prependChild(parent, children[children.length - 1]));
  });

  test('jsdom', async () => {
    const { factory } = await makeTestJsdom();
    const parent = makeTestParent(factory, 3);

    measure(() => parent.prepend(parent.lastChild));
  });
});

// Moves the last child to the start, so the parent keeps its children
describe('Element.insertBefore', () => {
  test('flyweight-dom', () => {
    const parent = makeTestParent(flyweightFactory, 3);

    measure(() => parent.insertBefore(parent.lastChild!, parent.firstChild));
  });

  test('domhandler', () => {
    const parent = makeTestParent(domhandlerFactory, 3);
    const { children } = parent;

    measure(() => domutils.prepend(children[0], children[children.length - 1]));
  });

  test('jsdom', async () => {
    const { factory } = await makeTestJsdom();
    const parent = makeTestParent(factory, 3);

    measure(() => parent.insertBefore(parent.lastChild, parent.firstChild));
  });
});

// Moves the first child before the last one, so the parent keeps its children
describe('Element.before', () => {
  test('flyweight-dom', () => {
    const parent = makeTestParent(flyweightFactory, 3);

    measure(() => parent.lastChild!.before(parent.firstChild!));
  });

  test('domhandler', () => {
    const parent = makeTestParent(domhandlerFactory, 3);
    const { children } = parent;

    measure(() => domutils.prepend(children[children.length - 1], children[0]));
  });

  test('jsdom', async () => {
    const { factory } = await makeTestJsdom();
    const parent = makeTestParent(factory, 3);

    measure(() => parent.lastChild.before(parent.firstChild));
  });
});

// Moves the last child after the first one, so the parent keeps its children
describe('Element.after', () => {
  test('flyweight-dom', () => {
    const parent = makeTestParent(flyweightFactory, 3);

    measure(() => parent.firstChild!.after(parent.lastChild!));
  });

  test('domhandler', () => {
    const parent = makeTestParent(domhandlerFactory, 3);
    const { children } = parent;

    measure(() => domutils.append(children[0], children[children.length - 1]));
  });

  test('jsdom', async () => {
    const { factory } = await makeTestJsdom();
    const parent = makeTestParent(factory, 3);

    measure(() => parent.firstChild.after(parent.lastChild));
  });
});

// Replaces the last child with a node, and puts the child back on the next call
describe('Element.replaceChild', () => {
  test('flyweight-dom', () => {
    const parent = makeTestParent(flyweightFactory, 3);

    let child: flyweightDom.ChildNode = parent.lastChild!;
    let node: flyweightDom.ChildNode = new flyweightDom.Element('div');

    measure(() => {
      parent.replaceChild(node, child);

      const replacedChild = child;
      child = node;
      node = replacedChild;
    });
  });

  test('domhandler', () => {
    const parent = makeTestParent(domhandlerFactory, 3);

    let child: domhandler.ChildNode = parent.children[2];
    let node: domhandler.ChildNode = new domhandler.Element('div', {});

    measure(() => {
      domutils.replaceElement(child, node);

      const replacedChild = child;
      child = node;
      node = replacedChild;
    });
  });

  test('jsdom', async () => {
    const { document, factory } = await makeTestJsdom();
    const parent = makeTestParent(factory, 3);

    let child = parent.lastChild;
    let node = document.createElement('div');

    measure(() => {
      parent.replaceChild(node, child);

      const replacedChild = child;
      child = node;
      node = replacedChild;
    });
  });
});

// Replaces the last child with a node, and puts the child back on the next call
describe('Element.replaceWith', () => {
  test('flyweight-dom', () => {
    const parent = makeTestParent(flyweightFactory, 3);

    let child: flyweightDom.ChildNode = parent.lastChild!;
    let node: flyweightDom.ChildNode = new flyweightDom.Element('div');

    measure(() => {
      child.replaceWith(node);

      const replacedChild = child;
      child = node;
      node = replacedChild;
    });
  });

  test('domhandler', () => {
    const parent = makeTestParent(domhandlerFactory, 3);

    let child: domhandler.ChildNode = parent.children[2];
    let node: domhandler.ChildNode = new domhandler.Element('div', {});

    measure(() => {
      domutils.replaceElement(child, node);

      const replacedChild = child;
      child = node;
      node = replacedChild;
    });
  });

  test('jsdom', async () => {
    const { document, factory } = await makeTestJsdom();
    const parent = makeTestParent(factory, 3);

    let child = parent.lastChild;
    let node = document.createElement('div');

    measure(() => {
      child.replaceWith(node);

      const replacedChild = child;
      child = node;
      node = replacedChild;
    });
  });
});

// Replaces the only child with a node, and puts the child back on the next call
describe('Element.replaceChildren', () => {
  test('flyweight-dom', () => {
    const parent = makeTestParent(flyweightFactory, 1);

    let node: flyweightDom.ChildNode = new flyweightDom.Element('div');

    measure(() => {
      const replacedChild = parent.firstChild!;

      parent.replaceChildren(node);
      node = replacedChild;
    });
  });

  test('jsdom', async () => {
    const { document, factory } = await makeTestJsdom();
    const parent = makeTestParent(factory, 1);

    let node = document.createElement('div');

    measure(() => {
      const replacedChild = parent.firstChild;

      parent.replaceChildren(node);
      node = replacedChild;
    });
  });
});

describe('Element.removeChild', () => {
  test('flyweight-dom', () => {
    measureEachChild(
      flyweightFactory,
      () => new flyweightDom.Text('aaa'),
      (child, parent) => parent.removeChild(child)
    );
  });

  test('domhandler', () => {
    measureEachChild(
      domhandlerFactory,
      () => new domhandler.Text('aaa'),
      child => domutils.removeElement(child)
    );
  });

  test('jsdom', async () => {
    const { document, factory } = await makeTestJsdom();

    measureEachChild(
      factory,
      () => document.createTextNode('aaa'),
      (child, parent) => parent.removeChild(child)
    );
  });
});

describe('Text.remove', () => {
  test('flyweight-dom', () => {
    measureEachChild(
      flyweightFactory,
      () => new flyweightDom.Text('aaa'),
      child => child.remove()
    );
  });

  test('domhandler', () => {
    measureEachChild(
      domhandlerFactory,
      () => new domhandler.Text('aaa'),
      child => domutils.removeElement(child)
    );
  });

  test('jsdom', async () => {
    const { document, factory } = await makeTestJsdom();

    measureEachChild(
      factory,
      () => document.createTextNode('aaa'),
      child => child.remove()
    );
  });
});

describe('Text.splitText', () => {
  test('flyweight-dom', () => {
    measureEachChild(
      flyweightFactory,
      () => new flyweightDom.Text('aaa'),
      child => child.splitText(1)
    );
  });

  test('jsdom', async () => {
    const { document, factory } = await makeTestJsdom();

    measureEachChild(
      factory,
      () => document.createTextNode('aaa'),
      child => child.splitText(1)
    );
  });
});

describe('Element.textContent', () => {
  test('flyweight-dom', () => {
    const tree = makeTestTree(flyweightFactory);

    measure(() => tree.textContent);
  });

  test('domhandler', () => {
    const tree = makeTestTree(domhandlerFactory);

    measure(() => domutils.textContent(tree));
  });

  test('jsdom', async () => {
    const { factory } = await makeTestJsdom();
    const tree = makeTestTree(factory);

    measure(() => tree.textContent);
  });
});

// Replaces children with a text, so after the first call each call replaces a text
describe('Element.textContent setter', () => {
  test('flyweight-dom', () => {
    const parent = makeTestParent(flyweightFactory, 3);

    measure(() => {
      parent.textContent = 'bbb';
    });
  });

  test('jsdom', async () => {
    const { factory } = await makeTestJsdom();
    const parent = makeTestParent(factory, 3);

    measure(() => {
      parent.textContent = 'bbb';
    });
  });
});

describe('Element.getAttribute', () => {
  test('flyweight-dom', () => {
    const element = flyweightFactory.createElement('div', { id: 'aaa', class: 'bbb' });

    measure(() => element.getAttribute('class'));
  });

  test('domhandler', () => {
    const element = domhandlerFactory.createElement('div', { id: 'aaa', class: 'bbb' });

    measure(() => domutils.getAttributeValue(element, 'class'));
  });

  test('jsdom', async () => {
    const { factory } = await makeTestJsdom();
    const element = factory.createElement('div', { id: 'aaa', class: 'bbb' });

    measure(() => element.getAttribute('class'));
  });
});

describe('Element.setAttribute', () => {
  test('flyweight-dom', () => {
    const element = flyweightFactory.createElement('div', { id: 'aaa', class: 'bbb' });

    measure(() => element.setAttribute('class', 'ccc'));
  });

  test('domhandler', () => {
    const element = domhandlerFactory.createElement('div', { id: 'aaa', class: 'bbb' });

    // domhandler has no attribute methods
    measure(() => {
      element.attribs.class = 'ccc';
    });
  });

  test('jsdom', async () => {
    const { factory } = await makeTestJsdom();
    const element = factory.createElement('div', { id: 'aaa', class: 'bbb' });

    measure(() => element.setAttribute('class', 'ccc'));
  });
});

describe('Element.classList.add', () => {
  test('flyweight-dom', () => {
    measureEachChild(
      flyweightFactory,
      () => new flyweightDom.Element('span'),
      child => child.classList.add('aaa', 'bbb')
    );
  });

  test('jsdom', async () => {
    const { document, factory } = await makeTestJsdom();

    measureEachChild(
      factory,
      () => document.createElement('span'),
      child => child.classList.add('aaa', 'bbb')
    );
  });
});

describe('Element.classList.toggle', () => {
  test('flyweight-dom', () => {
    const element = flyweightFactory.createElement('div', { class: 'aaa bbb' });

    measure(() => element.classList.toggle('ccc'));
  });

  test('jsdom', async () => {
    const { factory } = await makeTestJsdom();
    const element = factory.createElement('div', { class: 'aaa bbb' });

    measure(() => element.classList.toggle('ccc'));
  });
});

describe('Element.classList.contains', () => {
  test('flyweight-dom', () => {
    const element = flyweightFactory.createElement('div', { class: 'aaa bbb ccc' });

    measure(() => element.classList.contains('ccc'));
  });

  test('jsdom', async () => {
    const { factory } = await makeTestJsdom();
    const element = factory.createElement('div', { class: 'aaa bbb ccc' });

    measure(() => element.classList.contains('ccc'));
  });
});

describe('Element.cloneNode', () => {
  test('flyweight-dom', () => {
    const element = flyweightFactory.createElement('div', { id: 'aaa', class: 'bbb' });

    measure(() => element.cloneNode());
  });

  test('domhandler', () => {
    const element = domhandlerFactory.createElement('div', { id: 'aaa', class: 'bbb' });

    measure(() => element.cloneNode());
  });

  test('jsdom', async () => {
    const { factory } = await makeTestJsdom();
    const element = factory.createElement('div', { id: 'aaa', class: 'bbb' });

    measure(() => element.cloneNode());
  });
});

describe('Element.cloneNode(true)', () => {
  test('flyweight-dom', () => {
    const tree = makeTestTree(flyweightFactory);

    measure(() => tree.cloneNode(true));
  });

  test('domhandler', () => {
    const tree = makeTestTree(domhandlerFactory);

    measure(() => tree.cloneNode(true));
  });

  test('jsdom', async () => {
    const { factory } = await makeTestJsdom();
    const tree = makeTestTree(factory);

    measure(() => tree.cloneNode(true));
  });
});

describe('Element.isEqualNode', () => {
  test('flyweight-dom', () => {
    const tree = makeTestTree(flyweightFactory);
    const otherTree = makeTestTree(flyweightFactory);

    measure(() => tree.isEqualNode(otherTree));
  });

  test('jsdom', async () => {
    const { factory } = await makeTestJsdom();
    const tree = makeTestTree(factory);
    const otherTree = makeTestTree(factory);

    measure(() => tree.isEqualNode(otherTree));
  });
});

describe('Element.contains', () => {
  test('flyweight-dom', () => {
    const tree = makeTestTree(flyweightFactory);
    const element = flyweightDom.getElementById(tree, 'id340');

    measure(() => tree.contains(element));
  });

  test('jsdom', async () => {
    const { document, factory } = await makeTestJsdom();
    const tree = makeTestTree(factory);
    const fragment = document.createDocumentFragment();

    fragment.append(tree);

    const element = fragment.getElementById('id340');

    measure(() => tree.contains(element));
  });
});

describe('TreeWalker.nextNode', () => {
  test('flyweight-dom', () => {
    const tree = makeTestTree(flyweightFactory);

    measure(() => countNodes(new flyweightDom.TreeWalker(tree)));
  });

  test('jsdom', async () => {
    const { document, factory } = await makeTestJsdom();
    const tree = makeTestTree(factory);

    measure(() => countNodes(document.createTreeWalker(tree)));
  });
});

describe('TreeWalker.nextNode with whatToShow', () => {
  test('flyweight-dom', () => {
    const tree = makeTestTree(flyweightFactory);

    measure(() => countNodes(new flyweightDom.TreeWalker(tree, flyweightDom.NodeFilter.SHOW_ELEMENT)));
  });

  test('jsdom', async () => {
    const { window, document, factory } = await makeTestJsdom();
    const tree = makeTestTree(factory);

    measure(() => countNodes(document.createTreeWalker(tree, window.NodeFilter.SHOW_ELEMENT)));
  });
});

describe('TreeWalker.nextNode with filter', () => {
  test('flyweight-dom', () => {
    const tree = makeTestTree(flyweightFactory);

    measure(() => countNodes(new flyweightDom.TreeWalker(tree, flyweightDom.NodeFilter.SHOW_ALL, acceptElement)));
  });

  test('jsdom', async () => {
    const { window, document, factory } = await makeTestJsdom();
    const tree = makeTestTree(factory);

    measure(() => countNodes(document.createTreeWalker(tree, window.NodeFilter.SHOW_ALL, acceptElement)));
  });
});

describe('getElementById', () => {
  test('flyweight-dom', () => {
    const tree = makeTestTree(flyweightFactory);

    measure(() => flyweightDom.getElementById(tree, 'id340'));
  });

  test('domhandler', () => {
    const tree = makeTestTree(domhandlerFactory);

    measure(() => domutils.getElementById('id340', tree.children));
  });

  test('jsdom', async () => {
    const { document, factory } = await makeTestJsdom();
    const fragment = document.createDocumentFragment();

    // Unlike a document, a fragment doesn't cache elements by ID, so the lookup walks the tree
    fragment.append(makeTestTree(factory));

    measure(() => fragment.getElementById('id340'));
  });
});

describe('getElementsByTagName', () => {
  test('flyweight-dom', () => {
    const tree = makeTestTree(flyweightFactory);

    measure(() => flyweightDom.getElementsByTagName(tree, 'span'));
  });

  test('domhandler', () => {
    const tree = makeTestTree(domhandlerFactory);

    measure(() => domutils.getElementsByTagName('span', tree.children));
  });

  test('jsdom', async () => {
    const { factory } = await makeTestJsdom();
    const tree = makeTestTree(factory);

    measure(
      {
        // jsdom caches live collections until the tree changes, so the tree is changed before each call
        beforeIteration() {
          tree.toggleAttribute('aaa');
        },
      },
      () => tree.getElementsByTagName('span').length
    );
  });
});

describe('getElementsByClassName', () => {
  test('flyweight-dom', () => {
    const tree = makeTestTree(flyweightFactory);

    measure(() => flyweightDom.getElementsByClassName(tree, 'bbb'));
  });

  test('domhandler', () => {
    const tree = makeTestTree(domhandlerFactory);

    measure(() => domutils.getElementsByClassName(hasBbbClass, tree.children));
  });

  test('jsdom', async () => {
    const { factory } = await makeTestJsdom();
    const tree = makeTestTree(factory);

    measure(
      {
        // jsdom caches live collections until the tree changes, so the tree is changed before each call
        beforeIteration() {
          tree.toggleAttribute('aaa');
        },
      },
      () => tree.getElementsByClassName('bbb').length
    );
  });
});

describe('getElementsByName', () => {
  test('flyweight-dom', () => {
    const tree = makeTestTree(flyweightFactory);

    measure(() => flyweightDom.getElementsByName(tree, 'ccc'));
  });

  test('domhandler', () => {
    const tree = makeTestTree(domhandlerFactory);

    measure(() => domutils.getElements({ name: 'ccc' }, tree.children, true));
  });

  test('jsdom', async () => {
    const { document, factory } = await makeTestJsdom();

    // Only documents have getElementsByName
    document.body.append(makeTestTree(factory));

    measure(() => document.getElementsByName('ccc').length);
  });
});
