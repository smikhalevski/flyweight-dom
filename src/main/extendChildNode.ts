import { Node } from './Node';
import { Element } from './Element';
import { uncheckedRemoveAndAppendChild } from './uncheckedRemoveAndAppendChild';
import { uncheckedRemoveAndInsertBefore } from './uncheckedRemoveAndInsertBefore';
import { coerceInsertableNodes } from './coerceInsertableNodes';
import { uncheckedRemoveChild } from './uncheckedRemoveChild';
import { defineProperty, getNextElementSibling, getPreviousElementSibling, PropertyDescriptor } from './utils';

export interface ChildNode extends Node {
  readonly previousElementSibling: Element | null;
  readonly nextElementSibling: Element | null;

  after(...nodes: Array<Node | string>): this;

  before(...nodes: Array<Node | string>): this;

  remove(): this;

  replaceWith(...nodes: Array<Node | string>): this;
}

export function extendChildNode(prototype: ChildNode): void {
  defineProperty(prototype, 'previousElementSibling', previousElementSiblingDescriptor);
  defineProperty(prototype, 'nextElementSibling', nextElementSiblingDescriptor);

  prototype.after = after;
  prototype.before = before;
  prototype.remove = remove;
  prototype.replaceWith = replaceWith;
}

const nextElementSiblingDescriptor: PropertyDescriptor<ChildNode, Element | null> = {
  get() {
    return getNextElementSibling(this.nextSibling);
  },
};

const previousElementSiblingDescriptor: PropertyDescriptor<ChildNode, Element | null> = {
  get() {
    return getPreviousElementSibling(this.previousSibling);
  },
};

function after(this: ChildNode, ...nodes: Array<Node | string>) {
  const { parentNode } = this;

  if (parentNode != null) {
    coerceInsertableNodes(parentNode, nodes);

    for (const node of nodes) {
      uncheckedRemoveAndAppendChild(parentNode, node);
    }
  }
  return this;
}

function before(this: ChildNode, ...nodes: Array<Node | string>) {
  const { parentNode } = this;

  if (parentNode != null) {
    coerceInsertableNodes(parentNode, nodes);

    for (const node of nodes) {
      uncheckedRemoveAndInsertBefore(parentNode, node, this);
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

function replaceWith(this: ChildNode, ...nodes: Array<Node | string>) {
  const { parentNode } = this;

  if (parentNode != null) {
    coerceInsertableNodes(parentNode, nodes);

    for (const node of nodes) {
      uncheckedRemoveAndInsertBefore(parentNode, node, this);
    }
    uncheckedRemoveChild(parentNode, this);
  }
  return this;
}
