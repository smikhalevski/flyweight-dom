import { Node } from './Node';
import { Element } from './Element';
import { uncheckedRemoveAndAppendChild } from './uncheckedRemoveAndAppendChild';
import { uncheckedRemoveAndInsertBefore } from './uncheckedRemoveAndInsertBefore';
import { assertInsertable, uncheckedToInsertableNode } from './uncheckedToInsertableNode';
import { uncheckedRemoveChild } from './uncheckedRemoveChild';
import {
  AbstractConstructor,
  Constructor,
  getNextSiblingOrSelf,
  getPreviousSiblingOrSelf,
  NodeConstants,
} from './utils';

export interface ChildNode extends Node {
  /**
   * **See** {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Element/previousElementSibling Element.previousElementSibling} on MDN
   */
  readonly previousElementSibling: Element | null;

  /**
   * **See** {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Element/nextElementSibling Element.nextElementSibling} on MDN
   */
  readonly nextElementSibling: Element | null;

  /**
   * **See** {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Element/after Element.after} on MDN
   */
  after(...nodes: Array<Node | string>): this;

  /**
   * **See** {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Element/before Element.before} on MDN
   */
  before(...nodes: Array<Node | string>): this;

  /**
   * **See** {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Element/remove Element.remove} on MDN
   */
  remove(): this;

  /**
   * **See** {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Element/replaceWith Element.replaceWith} on MDN
   */
  replaceWith(...nodes: Array<Node | string>): this;

  cloneNode(deep?: boolean): ChildNode;
}

/**
 * The mixin that can extend the constructor prototype with properties and methods of the {@linkcode ChildNode}.
 */
export const ChildNode = {
  /**
   * Extends the constructor prototype with properties and methods of the {@linkcode ChildNode}.
   */
  extend: extendChildNode,
};

export function extendChildNode(constructor: Constructor<ChildNode> | AbstractConstructor<ChildNode>): void {
  const prototype = constructor.prototype;

  Object.defineProperties(prototype, {
    previousElementSibling: {
      get(this: ChildNode) {
        return getPreviousSiblingOrSelf(this.previousSibling, NodeConstants.ELEMENT_NODE);
      },
    },

    nextElementSibling: {
      get(this: ChildNode) {
        return getNextSiblingOrSelf(this.nextSibling, NodeConstants.ELEMENT_NODE);
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
