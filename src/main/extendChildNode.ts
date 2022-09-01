import { Node } from './Node';
import { Element } from './Element';
import { uncheckedRemoveAndAppendChild } from './uncheckedRemoveAndAppendChild';
import { uncheckedRemoveAndInsertBefore } from './uncheckedRemoveAndInsertBefore';
import { coerceInsertableNodes, NodeLike } from './coerceInsertableNodes';
import { uncheckedRemoveChild } from './uncheckedRemoveChild';

export interface ChildNode extends Node {
  // public readonly
  nextElementSibling: Element | null;
  previousElementSibling: Element | null;

  after(...nodes: NodeLike[]): this;

  before(...nodes: NodeLike[]): this;

  remove(): this;

  replaceWith(...nodes: NodeLike[]): this;
}

export function extendChildNode(prototype: ChildNode): void {
  prototype.after = after;
  prototype.before = before;
  prototype.remove = remove;
  prototype.replaceWith = replaceWith;

  prototype.nextElementSibling = prototype.previousElementSibling = null;
}

function after(this: ChildNode, ...nodes: NodeLike[]) {
  const { parentNode } = this;

  if (parentNode != null) {
    coerceInsertableNodes(parentNode, nodes);

    for (const node of nodes) {
      uncheckedRemoveAndAppendChild(parentNode, node);
    }
  }
  return this;
}

function before(this: ChildNode, ...nodes: NodeLike[]) {
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

function replaceWith(this: ChildNode, ...nodes: NodeLike[]) {
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
