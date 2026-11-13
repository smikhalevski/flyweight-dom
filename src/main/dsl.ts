/**
 * The DSL that streamlines DOM authoring.
 *
 * ```ts
 * import { h } from 'flyweight-dom/dsl';
 *
 * const element = h('div', { class: 'red' }, 'Hello, ', h('strong', 'world!'));
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

import { CDATASection } from './CDATASection.ts';
import { Comment } from './Comment.ts';
import { Document } from './Document.ts';
import { DocumentFragment } from './DocumentFragment.ts';
import { DocumentType } from './DocumentType.ts';
import { Element } from './Element.ts';
import { Node } from './Node.ts';
import type { ParentNode } from './ParentNode.ts';
import { ProcessingInstruction } from './ProcessingInstruction.ts';
import { Text } from './Text.ts';
import { assertInsertable } from './uncheckedToInsertableNode.ts';

/**
 * A child of a node created by the DSL. Strings, numbers and bigints become text nodes, while `null`, `undefined` and
 * booleans are skipped, so a child can be conditional: `h('ul', isEmpty && h('li', 'Empty'))`.
 *
 * @group DSL
 */
export type Child = Node | string | number | boolean | bigint | null | undefined;

/**
 * Creates an element with the given tag name, optional attributes, and children.
 *
 * @group DSL
 */
export interface ElementFactory {
  (tagName: string, attributes: Record<string, string>, ...children: Child[]): Element;

  (tagName: string, ...children: Child[]): Element;
}

/**
 * Factories of nodes that aren't elements. These nodes have no namespace, so the factories are available on {@link h}
 * only.
 *
 * @group DSL
 */
export interface NodeFactories {
  /**
   * Creates a document with the given children.
   */
  document(...children: Child[]): Document;

  /**
   * Creates a document type.
   */
  doctype(name: string, publicId?: string, systemId?: string): DocumentType;

  /**
   * Creates a document fragment with the given children.
   */
  fragment(...children: Child[]): DocumentFragment;

  /**
   * Creates a processing instruction.
   */
  processingInstruction(target: string, data?: string): ProcessingInstruction;

  /**
   * Creates a CDATA section.
   */
  cdata(data?: string): CDATASection;

  /**
   * Creates a comment.
   */
  comment(data?: string): Comment;
}

/**
 * Creates a factory of elements that have the given namespace.
 *
 * ```ts
 * const s = createElementFactory('http://www.w3.org/2000/svg');
 *
 * s('svg', s('circle', { r: '10' })).firstElementChild.namespaceURI;
 * // ⮕ 'http://www.w3.org/2000/svg'
 * ```
 *
 * @param namespaceURI The namespace of created elements.
 * @group DSL
 */
export function createElementFactory(namespaceURI: string | null): ElementFactory {
  return (tagName: string, ...args: unknown[]) => {
    const attributes = args[0];

    // The argument after the tag name holds attributes if it's an object that isn't a node, otherwise it's a child
    if (typeof attributes !== 'object' || attributes === null || attributes instanceof Node) {
      return appendChildren(new Element(tagName, undefined, namespaceURI), args);
    }

    // Element owns its attributes object, so copy the caller's object, which may be reused or frozen
    return appendChildren(new Element(tagName, { ...attributes }, namespaceURI), args, 1);
  };
}

/**
 * Creates an element that has no namespace, and has factories of other nodes as its properties. Other nodes aren't
 * separate exports, so their full names, like `document`, don't shadow globals in the importing module.
 *
 * ```ts
 * h.document(h.documentType('html'), h('html', h.comment('Hello')));
 * ```
 *
 * @group DSL
 */
export const h = Object.assign<ElementFactory, NodeFactories>(createElementFactory(null), {
  document(...children) {
    return appendChildren(new Document(), children);
  },

  doctype(name, publicId, systemId) {
    return new DocumentType(name, publicId, systemId);
  },

  fragment(...children) {
    return appendChildren(new DocumentFragment(), children);
  },

  processingInstruction(target, data) {
    return new ProcessingInstruction(target, data);
  },

  cdata(data) {
    return new CDATASection(data);
  },

  comment(data) {
    return new Comment(data);
  },
});

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
