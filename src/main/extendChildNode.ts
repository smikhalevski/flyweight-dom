import { Node } from './Node';
import { Element } from './Element';
import { uncheckedRemoveAndAppendChild } from './uncheckedRemoveAndAppendChild';
import { uncheckedRemoveAndInsertBefore } from './uncheckedRemoveAndInsertBefore';
import { assertInsertable, uncheckedToInsertableNode } from './uncheckedToInsertableNode';
import { uncheckedRemoveChild } from './uncheckedRemoveChild';
import { getNextElementSibling, getPreviousElementSibling } from './utils';

export interface ChildNode extends Node {
  // public readonly
  previousElementSibling: Element | null;
  nextElementSibling: Element | null;

  after(...nodes: Array<Node | string>): this;

  before(...nodes: Array<Node | string>): this;

  remove(): this;

  replaceWith(...nodes: Array<Node | string>): this;
}

export function extendChildNode(prototype: ChildNode): void {
  Object.defineProperties(prototype, {
    previousElementSibling: {
      get(this: ChildNode) {
        return getPreviousElementSibling(this.previousSibling);
      },
    },
    nextElementSibling: {
      get(this: ChildNode) {
        return getNextElementSibling(this.nextSibling);
      },
    },
  });

  prototype.after = after;
  prototype.before = before;
  prototype.remove = remove;
  prototype.replaceWith = replaceWith;
}

function after(this: ChildNode /*, ...nodes: Array<Node | string>*/) {
  const nodesLength = arguments.length;

  const { parentNode } = this;

  if (parentNode != null) {
    for (let i = 0; i < nodesLength; ++i) {
      assertInsertable(parentNode, arguments[i]);
    }
    for (let i = 0; i < nodesLength; ++i) {
      uncheckedRemoveAndAppendChild(parentNode, uncheckedToInsertableNode(parentNode, arguments[i]));
    }
  }
  return this;
}

function before(this: ChildNode /*, ...nodes: Array<Node | string>*/) {
  const nodesLength = arguments.length;

  const { parentNode } = this;

  if (parentNode != null) {
    for (let i = 0; i < nodesLength; ++i) {
      assertInsertable(parentNode, arguments[i]);
    }
    for (let i = 0; i < nodesLength; ++i) {
      uncheckedRemoveAndInsertBefore(parentNode, uncheckedToInsertableNode(parentNode, arguments[i]), this);
    }
  }
  return this;
}

function remove(this: ChildNode) {
  const { parentNode } = this;

  if (parentNode != null) {
    parentNode.removeChild(this);
  }
  return this;
}

function replaceWith(this: ChildNode /*, ...nodes: Array<Node | string>*/) {
  const nodesLength = arguments.length;

  const { parentNode } = this;

  if (parentNode != null) {
    for (let i = 0; i < nodesLength; ++i) {
      assertInsertable(parentNode, arguments[i]);
    }
    for (let i = 0; i < nodesLength; ++i) {
      uncheckedRemoveAndInsertBefore(parentNode, uncheckedToInsertableNode(parentNode, arguments[i]), this);
    }
    uncheckedRemoveChild(parentNode, this);
  }
  return this;
}
