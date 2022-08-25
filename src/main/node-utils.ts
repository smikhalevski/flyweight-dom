import { die } from './utils';
import { Node } from './Node';

declare class MutableNode {
  parentNode: MutableNode | null;
  parentElement: MutableElement | null;
  previousSibling: MutableNode | null;
  nextSibling: MutableNode | null;
  firstChild: MutableNode | null;
  lastChild: MutableNode | null;
  childNodes: readonly Node[];

  cloneNode(deep?: boolean): MutableNode;
}

declare class MutableElement extends MutableNode {
  // protected _index: number;
  // protected _attributes: { [name: string]: string } | null;
}

export type Mutable<T> = { -readonly [P in keyof T]: T[P] };

export function assertNode(node: any, message?: string): asserts node is Node {
  if (node instanceof Node) {
    return;
  }
  die(message || 'Node expected');
}

export function assertParent(parent: Node, child: Node, message: string): void {
  if (child.parentNode === parent) {
    return;
  }
  die(message);
}

export function assertNoCyclicReference(parent: Node, node: Node, message?: string): void {
  if (!node.firstChild || node.parentNode === parent) {
    return;
  }
  for (let parentNode: Node | null = parent; parentNode; parentNode = parentNode.parentNode) {
    if (parentNode === node) {
      die(message || 'The new child element contains the parent');
    }
  }
}

export function uncheckedPrependChild(parent: MutableNode, node: MutableNode): void {
  const { firstChild } = parent;

  if (firstChild) {
    firstChild.previousSibling = node;
    node.nextSibling = firstChild;
  } else {
    parent.firstChild = parent.lastChild = node;
  }
  parent.firstChild = node;
  node.parentNode = parent;
}

export function uncheckedAppendChild(parent: MutableNode, node: MutableNode): void {
  const { lastChild } = parent;

  if (lastChild) {
    lastChild.nextSibling = node;
    node.previousSibling = lastChild;
  } else {
    parent.firstChild = parent.lastChild = node;
  }
  parent.lastChild = node;
  node.parentNode = parent;
}

export function uncheckedInsertBefore(parent: MutableNode, node: MutableNode, child: MutableNode): void {
  const { previousSibling } = child;

  if (previousSibling) {
    previousSibling.nextSibling = node;
    node.previousSibling = previousSibling;
  } else {
    parent.firstChild = node;
  }
  child.previousSibling = node;
  node.nextSibling = child;
  node.parentNode = parent;
}

export function uncheckedRemove(child: MutableNode): void {
  const { parentNode, previousSibling, nextSibling } = child;

  if (!parentNode) {
    return;
  }
  if (previousSibling) {
    previousSibling.nextSibling = nextSibling;
  } else {
    parentNode.firstChild = nextSibling;
  }
  if (nextSibling) {
    nextSibling.previousSibling = previousSibling;
  } else {
    parentNode.lastChild = previousSibling;
  }
  child.parentNode = child.parentElement = child.previousSibling = child.nextSibling = null;
}

export function uncheckedCloneChildNodes(parent: MutableNode, node: MutableNode): void {
  for (let child = parent.firstChild; child; child = child.nextSibling) {
    uncheckedAppendChild(node, child.cloneNode(true));
  }
}

export function managesChildNodes(node: Node): node is Node & { childNodes: Node[] } {
  return node.hasOwnProperty('childNodes');
}

export function uncheckedAppend(parent: Node, nodes: Node[]): void {
  for (const node of nodes) {
    uncheckedAppendChild(parent, node);
  }
  if (managesChildNodes(parent)) {
    parent.childNodes.push(...nodes);
  }
}
