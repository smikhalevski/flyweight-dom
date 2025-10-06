import type { Element } from './Element.js';
import { Node } from './Node.js';
import { uncheckedRemoveAndAppendChild } from './uncheckedRemoveAndAppendChild.js';
import { uncheckedRemoveAndInsertBefore } from './uncheckedRemoveAndInsertBefore.js';
import { assertInsertable, uncheckedToInsertableNode } from './uncheckedToInsertableNode.js';
import { uncheckedRemoveChild } from './uncheckedRemoveChild.js';
import { ELEMENT_NODE, getNextSiblingOrSelf, getPreviousSiblingOrSelf } from './utils.js';

/**
 * The node that can be a child of another node.
 *
 * @see [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) on MDN
 * @group Nodes
 */
export interface ChildNode extends Node {
  /**
   * @see [Element.previousElementSibling](https://developer.mozilla.org/en-US/docs/Web/API/Element/previousElementSibling) on MDN
   */
  readonly previousElementSibling: Element | null;

  /**
   * @see [Element.nextElementSibling](https://developer.mozilla.org/en-US/docs/Web/API/Element/nextElementSibling) on MDN
   */
  readonly nextElementSibling: Element | null;

  /**
   * @see [Element.after](https://developer.mozilla.org/en-US/docs/Web/API/Element/after) on MDN
   */
  after(...nodes: Array<Node | string>): this;

  /**
   * @see [Element.before](https://developer.mozilla.org/en-US/docs/Web/API/Element/before) on MDN
   */
  before(...nodes: Array<Node | string>): this;

  /**
   * @see [Element.remove](https://developer.mozilla.org/en-US/docs/Web/API/Element/remove) on MDN
   */
  remove(): this;

  /**
   * @see [Element.replaceWith](https://developer.mozilla.org/en-US/docs/Web/API/Element/replaceWith) on MDN
   */
  replaceWith(...nodes: Array<Node | string>): this;

  cloneNode(deep?: boolean): ChildNode;
}

const childConstructorCache = new WeakMap();

/**
 * The mixin that can extend the constructor prototype with properties and methods of the {@link ChildNode}.
 *
 * @group Nodes
 */
export function ChildNode(): new () => ChildNode;

/**
 * The mixin that can extend the constructor prototype with properties and methods of the {@link ChildNode}.
 *
 * @param constructor The base node constructor.
 * @template T The base node.
 * @group Nodes
 */
export function ChildNode<T extends Node>(constructor: new () => T): new () => T & ChildNode;

export function ChildNode(constructor: new () => Node = Node) {
  let childConstructor = childConstructorCache.get(constructor);

  if (childConstructor !== undefined) {
    return childConstructor;
  }

  childConstructor = class extends constructor implements ChildNode {
    declare readonly nodeType: number;
    declare readonly nodeName: string;

    get previousElementSibling(): Element | null {
      return getPreviousSiblingOrSelf(this.previousSibling, ELEMENT_NODE) as Element | null;
    }

    get nextElementSibling(): Element | null {
      return getNextSiblingOrSelf(this.nextSibling, ELEMENT_NODE) as Element | null;
    }

    after(/*...nodes: Array<Node | string>*/) {
      const { parentNode, nextSibling } = this;

      if (parentNode === null) {
        return this;
      }

      for (let i = 0; i < arguments.length; ++i) {
        assertInsertable(parentNode, arguments[i]);
      }

      if (nextSibling !== null) {
        for (let i = 0; i < arguments.length; ++i) {
          uncheckedRemoveAndInsertBefore(parentNode, uncheckedToInsertableNode(arguments[i]), nextSibling);
        }
      } else {
        for (let i = 0; i < arguments.length; ++i) {
          uncheckedRemoveAndAppendChild(parentNode, uncheckedToInsertableNode(arguments[i]));
        }
      }

      return this;
    }

    before(/*...nodes: Array<Node | string>*/) {
      const { parentNode } = this;

      if (parentNode === null) {
        return this;
      }

      for (let i = 0; i < arguments.length; ++i) {
        assertInsertable(parentNode, arguments[i]);
      }

      for (let i = 0; i < arguments.length; ++i) {
        uncheckedRemoveAndInsertBefore(parentNode, uncheckedToInsertableNode(arguments[i]), this);
      }

      return this;
    }

    remove(): this {
      const { parentNode } = this;

      if (parentNode !== null) {
        parentNode.removeChild(this);
      }
      return this;
    }

    replaceWith(/*...nodes: Array<Node | string>*/) {
      const { parentNode } = this;

      if (parentNode === null) {
        return this;
      }

      for (let i = 0; i < arguments.length; ++i) {
        assertInsertable(parentNode, arguments[i]);
      }

      for (let i = 0; i < arguments.length; ++i) {
        uncheckedRemoveAndInsertBefore(parentNode, uncheckedToInsertableNode(arguments[i]), this);
      }

      uncheckedRemoveChild(parentNode, this);
      return this;
    }

    cloneNode(deep?: boolean): ChildNode {
      return super.cloneNode(deep) as ChildNode;
    }
  };

  childConstructorCache.set(constructor, childConstructor);

  return childConstructor;
}
