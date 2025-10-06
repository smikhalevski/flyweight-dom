/**
 * The DSL that streamlines DOM authoring.
 *
 * ```ts
 * import { f } from 'flyweight-dom/dsl';
 *
 * const element = f.div({ class: 'red' }, 'Hello, ', f.strong('world!'));
 *
 * element.className;
 * // ⮕ 'red'
 *
 * element.textContent;
 * // ⮕ 'Hello, world!'
 * ```
 *
 * @module dsl
 */

import { Node } from './Node.js';
import { Text } from './Text.js';
import { Element } from './Element.js';
import { ParentNode } from './ParentNode.js';
import { Document } from './Document.js';
import { DocumentType } from './DocumentType.js';
import { DocumentFragment } from './DocumentFragment.js';
import { ProcessingInstruction } from './ProcessingInstruction.js';
import { Comment } from './Comment.js';
import { CDATASection } from './CDATASection.js';

/**
 * @group DSL
 */
export type DSL = NodeFactories & ElementFactories;

/**
 * @group DSL
 */
export type Child = Node | string | number | boolean | bigint | null | undefined;

/**
 * @group DSL
 */
export interface NodeFactories {
  doc(...children: Child[]): Document;

  doctype(name: string, publicId?: string, systemId?: string): DocumentType;

  f(...children: Child[]): DocumentFragment;

  pi(target: string, data?: string): ProcessingInstruction;

  cdata(data?: string): CDATASection;

  comment(data?: string): Comment;
}

/**
 * @group DSL
 */
export interface ElementFactory {
  (attributes: Record<string, string>, ...children: Child[]): Element;

  (...children: Child[]): Element;
}

/**
 * @group DSL
 */
export interface ElementFactories {
  [tagName: string]: ElementFactory;
}

const nodeFactories: NodeFactories = {
  doc() {
    const node = new Document();

    for (let i = 0; i < arguments.length; ++i) {
      appendChild(node, arguments[i]);
    }

    return node;
  },

  doctype(name, publicId, systemId) {
    return new DocumentType(name, publicId, systemId);
  },

  f() {
    const node = new DocumentFragment();

    for (let i = 0; i < arguments.length; ++i) {
      appendChild(node, arguments[i]);
    }

    return node;
  },

  pi(target, data) {
    return new ProcessingInstruction(target, data);
  },

  cdata(data) {
    return new CDATASection(data);
  },

  comment(data) {
    return new Comment(data);
  },
};

const proxyHandler: ProxyHandler<any> = {
  get(target, key, _receiver) {
    if (typeof key === 'string' && !target.hasOwnProperty(key)) {
      target[key] = createElementFactory(key);
    }

    return target[key];
  },
};

function createElementFactory(tagName: string): ElementFactory {
  return function () {
    if (arguments.length === 0) {
      return new Element(tagName);
    }

    const arg = arguments[0];

    let element;

    if (arg === null || typeof arg !== 'object' || arg instanceof Node) {
      element = new Element(tagName);
      appendChild(element, arg);
    } else {
      element = new Element(tagName, arg);
    }

    for (let i = 1; i < arguments.length; ++i) {
      appendChild(element, arguments[i]);
    }

    return element;
  };
}

function appendChild(parent: ParentNode, child: Child): void {
  if (child === null || child === undefined || typeof child === 'boolean') {
    return;
  }

  if (typeof child === 'string' || typeof child === 'number' || typeof child === 'bigint') {
    parent.appendChild(new Text(child.toString()));
    return;
  }

  if (child instanceof Node) {
    parent.appendChild(child);
    return;
  }

  throw new Error('Cannot append a child');
}

/**
 * @group DSL
 */
export const f: DSL = new Proxy(nodeFactories, proxyHandler);
