import { Node } from './Node.js';
import { Element } from './Element.js';
import { uncheckedRemoveAndAppendChild } from './uncheckedRemoveAndAppendChild.js';
import { uncheckedRemoveAndInsertBefore } from './uncheckedRemoveAndInsertBefore.js';
import { assertInsertable, uncheckedToInsertableNode } from './uncheckedToInsertableNode.js';
import { uncheckedRemoveChild } from './uncheckedRemoveChild.js';
import { AbstractConstructor, Constructor, getNextSiblingOrSelf, getPreviousSiblingOrSelf } from './utils.js';

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

/**
 * The mixin that can extend the constructor prototype with properties and methods of the {@link ChildNode}.
 *
 * @group Nodes
 */
export const ChildNode = {
  /**
   * Extends the constructor prototype with properties and methods of the {@link ChildNode}.
   */
  extend: extendChildNode,
};

export function extendChildNode(constructor: Constructor<ChildNode> | AbstractConstructor<ChildNode>): void {
  const prototype = constructor.prototype;

  Object.defineProperties(prototype, {
    previousElementSibling: {
      get(this: ChildNode) {
        return getPreviousSiblingOrSelf(this.previousSibling, Node.ELEMENT_NODE);
      },
    },

    nextElementSibling: {
      get(this: ChildNode) {
        return getNextSiblingOrSelf(this.nextSibling, Node.ELEMENT_NODE);
      },
    },
  });

  prototype.after = after;
  prototype.before = before;
  prototype.remove = remove;
  prototype.replaceWith = replaceWith;
}

function after(this: ChildNode /*...nodes: Array<Node | string>*/) {
  const argumentsLength = arguments.length;

  const { parentNode, nextSibling } = this;

  if (parentNode === null) {
    return this;
  }
  for (let i = 0; i < argumentsLength; ++i) {
    assertInsertable(parentNode, arguments[i]);
  }
  if (nextSibling !== null) {
    for (let i = 0; i < argumentsLength; ++i) {
      uncheckedRemoveAndInsertBefore(parentNode, uncheckedToInsertableNode(arguments[i]), nextSibling);
    }
  } else {
    for (let i = 0; i < argumentsLength; ++i) {
      uncheckedRemoveAndAppendChild(parentNode, uncheckedToInsertableNode(arguments[i]));
    }
  }
  return this;
}

function before(this: ChildNode /*...nodes: Array<Node | string>*/) {
  const argumentsLength = arguments.length;

  const { parentNode } = this;

  if (parentNode === null) {
    return this;
  }
  for (let i = 0; i < argumentsLength; ++i) {
    assertInsertable(parentNode, arguments[i]);
  }
  for (let i = 0; i < argumentsLength; ++i) {
    uncheckedRemoveAndInsertBefore(parentNode, uncheckedToInsertableNode(arguments[i]), this);
  }
  return this;
}

function remove(this: ChildNode) {
  const { parentNode } = this;

  if (parentNode !== null) {
    parentNode.removeChild(this);
  }
  return this;
}

function replaceWith(this: ChildNode /*...nodes: Array<Node | string>*/) {
  const argumentsLength = arguments.length;

  const { parentNode } = this;

  if (parentNode === null) {
    return this;
  }
  for (let i = 0; i < argumentsLength; ++i) {
    assertInsertable(parentNode, arguments[i]);
  }
  for (let i = 0; i < argumentsLength; ++i) {
    uncheckedRemoveAndInsertBefore(parentNode, uncheckedToInsertableNode(arguments[i]), this);
  }
  uncheckedRemoveChild(parentNode, this);
  return this;
}
