import { ChildNode } from './ChildNode.js';
import type { Element } from './Element.js';
import { Node } from './Node.js';
import { ChildNodeIterator, ChildNodeList, type NodeList } from './NodeList.js';
import { uncheckedInsertNodeAfter } from './uncheckedInsertNodeAfter.js';
import { uncheckedRemoveAndAppendChild } from './uncheckedRemoveAndAppendChild.js';
import { uncheckedRemoveAndInsertBefore } from './uncheckedRemoveAndInsertBefore.js';
import { uncheckedRemoveChild } from './uncheckedRemoveChild.js';
import { assertInsertable, assertInsertableNode, uncheckedToInsertableNode } from './uncheckedToInsertableNode.js';
import { ELEMENT_NODE, getNextSiblingOrSelf, getPreviousSiblingOrSelf, isElement } from './utils.js';

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

  /**
   * Returns a live iterator over children.
   *
   * **Note:** Children are read by index, the same as when iterating over a
   * [NodeList](https://developer.mozilla.org/en-US/docs/Web/API/NodeList) in browsers. If children change during
   * iteration, it continues from the next index: removing the current child skips the one after it, and inserting a
   * node before the current child returns the current child again. Iterate over a copy, like `Array.from(parent)`, if
   * the loop changes children.
   */
  [Symbol.iterator](): IterableIterator<ChildNode>;
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

    get childNodes(): NodeList {
      if (this._childNodes === undefined) {
        this._childNodes = new ChildNodeList(this);
      }
      return this._childNodes;
    }

    get children(): NodeList<Element> {
      if (this._children === undefined) {
        this._children = new ChildNodeList(this, isElement);
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

      // Replacing a child with itself doesn't move it, and inserting a node before itself would break sibling links
      if (node === (child as Node)) {
        return child;
      }

      // The node is inserted before the child is removed, so a failed insertion leaves the child in place
      uncheckedRemoveAndInsertBefore(this, node, child as Node as ChildNode);
      uncheckedRemoveChild(this, child as Node as ChildNode);
      return child;
    }

    append(/*...nodes: Array<Node | string>*/) {
      for (let i = 0; i < arguments.length; ++i) {
        assertInsertable(this, arguments[i]);
      }

      // Appending each value in turn moves a value that occurs several times to the end, so the result is the same as
      // appending a fragment of all values, see https://dom.spec.whatwg.org/#converting-nodes-into-a-node
      for (let i = 0; i < arguments.length; ++i) {
        const node = uncheckedToInsertableNode(arguments[i]);

        if (node !== null) {
          uncheckedRemoveAndAppendChild(this, node);
        }
      }
      return this;
    }

    prepend(/*...nodes: Array<Node | string>*/) {
      for (let i = 0; i < arguments.length; ++i) {
        assertInsertable(this, arguments[i]);
      }

      for (let i = 0, anchor: ChildNode | null = null; i < arguments.length; ++i) {
        anchor = uncheckedInsertNodeAfter(this, arguments[i], anchor);
      }
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
      this._notifyChildrenChanged();

      // Same as append
      for (let i = 0; i < arguments.length; ++i) {
        const node = uncheckedToInsertableNode(arguments[i]);

        if (node !== null) {
          uncheckedRemoveAndAppendChild(this, node);
        }
      }
      return this;
    }

    cloneNode(deep?: boolean): ParentNode {
      return super.cloneNode(deep) as ParentNode;
    }

    [Symbol.iterator](): IterableIterator<ChildNode> {
      return new ChildNodeIterator(this, undefined);
    }
  };

  // Tells the Node constructor to initialize parent node fields
  Object.defineProperty(parentConstructor.prototype, '_isParentNode', { value: true });

  parentConstructorCache.set(constructor, parentConstructor);

  return parentConstructor;
}
