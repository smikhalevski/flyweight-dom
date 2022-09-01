import { Node } from './Node';
import { ParentNode } from './extendParentNode';
import { ChildNode } from './extendChildNode';
import { die } from './utils';
import { uncheckedRemoveAndAppendChild } from './uncheckedRemoveAndAppendChild';
import { assertInsertableNode } from './coerceInsertableNodes';
import { uncheckedContains } from './uncheckedContains';
import { uncheckedRemoveAndInsertBefore } from './uncheckedRemoveAndInsertBefore';
import { uncheckedRemoveChild } from './uncheckedRemoveChild';

export function extendNode(prototype: Node): void {
  prototype.hasChildNodes = hasChildNodes;
  prototype.appendChild = appendChild;
  prototype.insertBefore = insertBefore;
  prototype.contains = contains;
  prototype.removeChild = removeChild;
  prototype.replaceChild = replaceChild;
}

function hasChildNodes(this: Node): boolean {
  return this.firstChild != null;
}

function appendChild<T extends Node>(this: ParentNode, node: T): T {
  assertInsertableNode(this, node);
  uncheckedRemoveAndAppendChild(this, node);
  return node;
}

function insertBefore<T extends Node>(this: ParentNode, node: T, child: Node | null | undefined): T {
  unboundInsertBefore(
    this,
    node,
    child,
    'The node before which the new node is to be inserted is not a child of this node'
  );
  return node;
}

function contains(this: ParentNode, node: Node | null | undefined): boolean {
  return node != null ? uncheckedContains(this, node) : false;
}

function removeChild<T extends Node>(this: Node, child: T): T {
  if (child.parentNode == null) {
    return child;
  }
  if (child.parentNode !== this) {
    die('The node to be removed is not a child of this node');
  }

  uncheckedRemoveChild(child.parentNode, child as Node as ChildNode);
  return child;
}

function replaceChild<T extends Node>(this: ParentNode, node: Node, child: T): T {
  unboundInsertBefore(this, node, child, 'The node to be replaced is not a child of this node');
  if (child.parentNode != null) {
    uncheckedRemoveChild(child.parentNode, child);
  }
  return child;
}

function unboundInsertBefore(
  parent: ParentNode,
  node: Node,
  child: Node | null | undefined,
  message: string
): asserts child is ChildNode {
  if (child != null && child.parentNode !== parent) {
    die(message);
  }
  assertInsertableNode(parent, node);
  uncheckedRemoveAndInsertBefore(parent, node, child as ChildNode);
}
