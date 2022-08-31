import { Node } from './Node';
import { Element } from './Element';
import {
  coerceInsertableNodes,
  NodeLike,
  uncheckedRemove,
  uncheckedRemoveAndAppendChild,
  uncheckedRemoveAndInsertBefore,
} from './unchecked';

export interface ChildNode extends Node {
  /*readonly*/ nextElementSibling: Element | null;
  /*readonly*/ previousElementSibling: Element | null;

  after(...nodes: NodeLike[]): void;

  before(...nodes: NodeLike[]): void;

  remove(): void;

  replaceWith(...nodes: NodeLike[]): void;
}

export function constructChildNode(node: ChildNode): void {
  node.nextElementSibling = node.previousElementSibling = null;
}

export function extendsChildNode(node: ChildNode): void {
  node.after = after;
  node.before = before;
  node.remove = remove;
  node.replaceWith = replaceWith;
}

function after(this: ChildNode, ...nodes: NodeLike[]): void {
  const { parentNode } = this;

  if (!parentNode) {
    return;
  }

  coerceInsertableNodes(parentNode, nodes);

  for (const node of nodes) {
    uncheckedRemoveAndAppendChild(parentNode, node);
  }
}

function before(this: ChildNode, ...nodes: NodeLike[]): void {
  const { parentNode } = this;

  if (!parentNode) {
    return;
  }

  coerceInsertableNodes(parentNode, nodes);

  for (const node of nodes) {
    uncheckedRemoveAndInsertBefore(parentNode, node, this);
  }
}

function remove(this: ChildNode): void {
  const { parentNode } = this;

  if (parentNode) {
    parentNode.removeChild(this);
  }
}

function replaceWith(this: ChildNode, ...nodes: NodeLike[]): void {
  const { parentNode } = this;

  if (!parentNode) {
    return;
  }

  coerceInsertableNodes(parentNode, nodes);

  for (const node of nodes) {
    uncheckedRemoveAndInsertBefore(parentNode, node, this);
  }
  uncheckedRemove(this);
}
