import { ChildNode } from './ChildNode.js';
import type { Element } from './Element.js';
import { Node } from './Node.js';
import { NodeList } from './NodeList.js';
import { uncheckedInsertNodes } from './uncheckedInsertNodes.js';
import { uncheckedRemoveAndAppendChild } from './uncheckedRemoveAndAppendChild.js';
import { uncheckedRemoveAndInsertBefore } from './uncheckedRemoveAndInsertBefore.js';
import { uncheckedRemoveChild } from './uncheckedRemoveChild.js';
import { assertInsertable, assertInsertableNode } from './uncheckedToInsertableNode.js';
import {
  ELEMENT_NODE,
  getNextSiblingOrSelf,
  getPreviousSiblingOrSelf,
  getViableNextSibling,
  isElement,
} from './utils.js';

/**
 * The node that can be a parent of another node.
 *
 * @see [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) on MDN
 * @group Nodes
 */
export interface ParentNode extends Node, Iterable<ChildNode> {
  /**
   * @see [Element.children](https://developer.mozilla.org/en-US/docs/Web/API/Element/children) on MDN
   */
  readonly children: NodeList<Element>;

  /**
   * @see [Element.childElementCount](https://developer.mozilla.org/en-US/docs/Web/API/Element/childElementCount) on MDN
   */
  readonly childElementCount: number;

  /**
   * @see [Element.firstElementChild](https://developer.mozilla.org/en-US/docs/Web/API/Element/firstElementChild) on MDN
   */
  readonly firstElementChild: Element | null;

  /**
   * @see [Element.lastElementChild](https://developer.mozilla.org/en-US/docs/Web/API/Element/lastElementChild) on MDN
   */
  readonly lastElementChild: Element | null;

  /**
   * @see [Element.append](https://developer.mozilla.org/en-US/docs/Web/API/Element/append) on MDN
   */
  append(...nodes: Array<Node | string>): this;

  /**
   * @see [Element.prepend](https://developer.mozilla.org/en-US/docs/Web/API/Element/prepend) on MDN
   */
  prepend(...nodes: Array<Node | string>): this;

  /**
   * @see [Element.replaceChildren](https://developer.mozilla.org/en-US/docs/Web/API/Element/replaceChildren) on MDN
   */
  replaceChildren(...nodes: Array<Node | string>): this;

  cloneNode(deep?: boolean): ParentNode;
}

const parentConstructorCache = new WeakMap();

/**
 * The mixin that can extend the constructor prototype with properties and methods of the {@link ParentNode}.
 *
 * @group Nodes
 */
export function ParentNode(): new () => ParentNode;

/**
 * The mixin that can extend the constructor prototype with properties and methods of the {@link ParentNode}.
 *
 * @param constructor The base node constructor.
 * @template T The base node.
 * @group Nodes
 */
export function ParentNode<T extends Node>(constructor: new () => T): new () => T & ParentNode;

export function ParentNode(constructor: new () => Node = Node) {
  let parentConstructor = parentConstructorCache.get(constructor);

  if (parentConstructor !== undefined) {
    return parentConstructor;
  }

  parentConstructor = class extends constructor implements ParentNode {
    declare readonly nodeType: number;
    declare readonly nodeName: string;

    /**
     * Initialized by classes that extend the mixin, since an initializer here would add a constructor to the mixin,
     * which V8 can't skip during instantiation. Classes that don't initialize it get the property on first access.
     */
    declare private _children: NodeList<Element> | undefined;

    get children(): NodeList<Element> {
      if (this._children === undefined) {
        this._children = new NodeList(this, isElement);
      }
      return this._children;
    }

    get childElementCount(): number {
      let count = 0;

      for (let child = this.firstChild; child !== null; child = child.nextSibling) {
        if (isElement(child)) {
          ++count;
        }
      }
      return count;
    }

    get firstElementChild(): Element | null {
      return getNextSiblingOrSelf(this.firstChild, ELEMENT_NODE) as Element | null;
    }

    get lastElementChild(): Element | null {
      return getPreviousSiblingOrSelf(this.lastChild, ELEMENT_NODE) as Element | null;
    }

    appendChild<T extends Node>(node: T): T {
      assertInsertableNode(this, node);
      uncheckedRemoveAndAppendChild(this, node);
      return node;
    }

    insertBefore<T extends Node>(node: T, child: Node | null | undefined): T {
      assertInsertableNode(this, node);

      if (child === null || child === undefined) {
        uncheckedRemoveAndAppendChild(this, node);
        return node;
      }

      if (child.parentNode !== this) {
        throw new Error('The node before which the new node is to be inserted is not a child of this node');
      }

      // Inserting a node before itself is the same as inserting it before its next sibling
      const referenceChild = child === node ? node.nextSibling : (child as ChildNode);

      if (referenceChild !== null) {
        uncheckedRemoveAndInsertBefore(this, node, referenceChild);
      } else {
        uncheckedRemoveAndAppendChild(this, node);
      }
      return node;
    }

    removeChild<T extends Node>(child: T): T {
      if (child.parentNode !== this) {
        throw new Error('The node to be removed is not a child of this node');
      }

      uncheckedRemoveChild(child.parentNode, child as Node as ChildNode);
      return child;
    }

    replaceChild<T extends Node>(node: Node, child: T): T {
      assertInsertableNode(this, node);

      if (child.parentNode !== this) {
        throw new Error('The node to be replaced is not a child of this node');
      }

      let { nextSibling } = child;

      if (nextSibling === node) {
        nextSibling = node.nextSibling;
      }

      uncheckedRemoveChild(this, child as Node as ChildNode);

      if (nextSibling !== null) {
        uncheckedRemoveAndInsertBefore(this, node, nextSibling);
      } else {
        uncheckedRemoveAndAppendChild(this, node);
      }
      return child;
    }

    append(/*...nodes: Array<Node | string>*/) {
      for (let i = 0; i < arguments.length; ++i) {
        assertInsertable(this, arguments[i]);
      }

      uncheckedInsertNodes(this, arguments, null);
      return this;
    }

    prepend(/*...nodes: Array<Node | string>*/) {
      for (let i = 0; i < arguments.length; ++i) {
        assertInsertable(this, arguments[i]);
      }

      uncheckedInsertNodes(this, arguments, getViableNextSibling(this.firstChild, arguments));
      return this;
    }

    replaceChildren(/*...nodes: Array<Node | string>*/) {
      for (let i = 0; i < arguments.length; ++i) {
        assertInsertable(this, arguments[i]);
      }

      for (let child = this.firstChild; child !== null;) {
        const { nextSibling } = child;

        child.parentNode = child.previousSibling = child.nextSibling = null;
        child = nextSibling;
      }

      this.firstChild = this.lastChild = null;

      uncheckedInsertNodes(this, arguments, null);
      return this;
    }

    cloneNode(deep?: boolean): ParentNode {
      return super.cloneNode(deep) as ParentNode;
    }

    *[Symbol.iterator](): Iterator<ChildNode> {
      for (let child = this.firstChild; child !== null; child = child.nextSibling) {
        yield child;
      }
    }
  };

  parentConstructorCache.set(constructor, parentConstructor);

  return parentConstructor;
}
