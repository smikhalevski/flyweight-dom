import * as domhandler from 'domhandler';
import * as domutils from 'domutils';
// @ts-ignore
import * as flyweightDom from '../../lib/index.js';

/**
 * Creates nodes of a DOM implementation, so tests build the same trees with each of them.
 */
export interface TestFactory<TElement, TText> {
  createElement(tagName: string, attributes: Record<string, string>): TElement;

  createText(data: string): TText;

  appendChild(parent: TElement, child: TElement | TText): void;
}

export const flyweightFactory: TestFactory<flyweightDom.Element, flyweightDom.Text> = {
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

/**
 * The namespace of elements that namespace factories create with the "xxx" prefix.
 */
export const ELEMENT_NAMESPACE = 'urn:aaa';

/**
 * The namespace that tests bind to the "yyy" prefix of attributes.
 */
export const ATTRIBUTE_NAMESPACE = 'urn:bbb';

export const flyweightNamespaceFactory: TestFactory<flyweightDom.Element, flyweightDom.Text> = {
  createElement(tagName, attributes) {
    return new flyweightDom.Element('xxx:' + tagName, attributes, ELEMENT_NAMESPACE);
  },

  createText: flyweightFactory.createText,
  appendChild: flyweightFactory.appendChild,
};

export const domhandlerFactory: TestFactory<domhandler.Element, domhandler.Text> = {
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
export async function makeTestJsdom() {
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

  const namespaceFactory: TestFactory<any, any> = {
    createElement(tagName, attributes) {
      const element = document.createElementNS(ELEMENT_NAMESPACE, 'xxx:' + tagName);

      for (const name in attributes) {
        element.setAttribute(name, attributes[name]);
      }
      return element;
    },

    createText: factory.createText,
    appendChild: factory.appendChild,
  };

  return { window, document, factory, namespaceFactory };
}

/**
 * Returns a div with children that are span elements and texts in turns.
 */
export function makeTestParent<TElement, TText>(factory: TestFactory<TElement, TText>, childCount: number): TElement {
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
export function makeTestTree<TElement, TText>(factory: TestFactory<TElement, TText>): TElement {
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
