import { Node } from './Node';
import { Element } from './Element';
import {
  coerceInsertableNodes,
  NodeLike,
  uncheckedRemoveChild,
  uncheckedRemoveAndAppendChild,
  uncheckedRemoveAndInsertBefore,
} from './unchecked';

export interface ChildNode extends Node {
  /*readonly*/ nextElementSibling: Element | null;
  /*readonly*/ previousElementSibling: Element | null;

  after(...nodes: NodeLike[]): this;

  before(...nodes: NodeLike[]): this;

  remove(): this;

  replaceWith(...nodes: NodeLike[]): this;
}

export function constructChildNode(node: ChildNode): void {
  node.nextElementSibling = node.previousElementSibling = null;
}

export function extendChildNode(node: ChildNode): void {
  node.after = after;
  node.before = before;
  node.remove = remove;
  node.replaceWith = replaceWith;
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
