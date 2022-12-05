import { Node } from './Node';
import { ParentNode } from './extendParentNode';
import { ChildNode } from './extendChildNode';
import { die } from './utils';
import { uncheckedRemoveAndAppendChild } from './uncheckedRemoveAndAppendChild';
import { uncheckedRemoveAndInsertBefore } from './uncheckedRemoveAndInsertBefore';
import { uncheckedRemoveChild } from './uncheckedRemoveChild';
import { assertInsertableNode } from './uncheckedToInsertableNode';

export function extendNode(prototype: Node): void {
  prototype.hasChildNodes = hasChildNodes;
  prototype.appendChild = appendChild;
  prototype.insertBefore = insertBefore;
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
  assertInsertableNode(this, node);

  if (child != null) {
    if (child.parentNode !== this) {
      die('The node before which the new node is to be inserted is not a child of this node');
    }
  } else {
    child = this.firstChild;
  }
  if (child != null) {
    uncheckedRemoveAndInsertBefore(this, node, child as ChildNode);
  } else {
    uncheckedRemoveAndAppendChild(this, node);
  }
  return node;
}

function removeChild<T extends Node>(this: Node, child: T): T {
  if (child.parentNode !== this) {
    die('The node to be removed is not a child of this node');
  }
  uncheckedRemoveChild(child.parentNode, child as Node as ChildNode);
  return child;
}

function replaceChild<T extends Node>(this: ParentNode, node: Node, child: T): T {
  assertInsertableNode(this, node);

  if (child.parentNode !== this) {
    die('The node to be replaced is not a child of this node');
  }
  uncheckedRemoveAndInsertBefore(this, node, child as Node as ChildNode);
  uncheckedRemoveChild(this, child as Node as ChildNode);
  return child;
}
