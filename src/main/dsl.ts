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
 * @module flyweight-dom/dsl
 */

import { CDATASection } from './CDATASection.js';
import { Comment } from './Comment.js';
import { Document } from './Document.js';
import { DocumentFragment } from './DocumentFragment.js';
import { DocumentType } from './DocumentType.js';
import { Element } from './Element.js';
import { Node } from './Node.js';
import type { ParentNode } from './ParentNode.js';
import { ProcessingInstruction } from './ProcessingInstruction.js';
import { Text } from './Text.js';
import { assertInsertable } from './uncheckedToInsertableNode.js';
import { hasOwnProperty } from './utils.js';

/**
 * A child of a node created by the DSL. Strings, numbers and bigints become text nodes, while `null`, `undefined` and
 * booleans are skipped, so a child can be conditional: `f.ul(isEmpty && f.li('Empty'))`.
 *
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
  doc(...children) {
    return appendChildren(new Document(), children);
  },

  doctype(name, publicId, systemId) {
    return new DocumentType(name, publicId, systemId);
  },

  f(...children) {
    return appendChildren(new DocumentFragment(), children);
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

const elementFactoryMap = new Map<string, ElementFactory>();

function getElementFactory(tagName: string): ElementFactory {
  let elementFactory = elementFactoryMap.get(tagName);

  if (elementFactory === undefined) {
    elementFactory = createElementFactory(tagName);
    elementFactoryMap.set(tagName, elementFactory);
  }
  return elementFactory;
}

function createElementFactory(tagName: string): ElementFactory {
  return (...args: unknown[]) => {
    const attributes = args[0];

    // The first argument holds attributes if it's an object that isn't a node, otherwise it's a child
    if (typeof attributes !== 'object' || attributes === null || attributes instanceof Node) {
      return appendChildren(new Element(tagName), args);
    }

    // Element owns its attributes object, so copy the caller's object, which may be reused or frozen
    return appendChildren(new Element(tagName, { ...attributes }), args, 1);
  };
}

/**
 * Appends children to the parent and returns the parent.
 *
 * **Note:** All children are checked before any is appended, so a child that can't be appended doesn't leave other
 * children moved out of their parents.
 *
 * @param parent The parent to append children to.
 * @param children The children to append.
 * @param startIndex The index of the first child in children, so attributes that precede children are skipped
 * without copying the array.
 */
function appendChildren<T extends ParentNode>(parent: T, children: unknown[], startIndex = 0): T {
  for (let i = startIndex; i < children.length; ++i) {
    assertInsertable(parent, children[i]);
  }

  for (let i = startIndex; i < children.length; ++i) {
    // Checked by assertInsertable, so an object is a node
    const child = children[i] as Child;

    if (child === null || child === undefined || typeof child === 'boolean') {
      continue;
    }

    parent.appendChild(typeof child === 'object' ? child : new Text(String(child)));
  }
  return parent;
}

/**
 * Node factories, and element factories for all other tag names.
 *
 * @group DSL
 */
export const f = new Proxy(nodeFactories, {
  get(nodeFactories, key) {
    if (typeof key === 'string' && !hasOwnProperty(nodeFactories, key)) {
      return getElementFactory(key);
    }
    return Reflect.get(nodeFactories, key);
  },
}) as NodeFactories & ElementFactories;
