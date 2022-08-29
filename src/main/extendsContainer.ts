import { Node } from './Node';
import { ParentNode } from './extendsParentNode';
import {
  assertChildNode,
  assertNode,
  assertNotContains,
  assertParent,
  uncheckedAppendChild,
  uncheckedContains,
  uncheckedInsertBefore,
  uncheckedRemove,
} from './unchecked';

/**
 * @internal
 */
export function extendsContainer(prototype: Node): void {
  prototype.hasChildNodes = hasChildNodes;
  prototype.appendChild = appendChild;
  prototype.insertBefore = insertBefore;
  prototype.contains = contains;
  prototype.removeChild = removeChild;
  prototype.replaceChild = replaceChild;
}

function hasChildNodes(this: Node): boolean {
  return this.firstChild !== null;
}

function appendChild<T extends Node>(this: ParentNode, node: T): T {
  assertChildNode(node);
  assertNotContains(node, this);

  uncheckedRemove(node);
  uncheckedAppendChild(this, node);
  return node;
}

function insertBefore<T extends Node>(this: ParentNode, node: T, child: Node | null): T {
  assertChildNode(node);
  assertNotContains(node, this);

  if (child != null) {
    assertNode(child);
    assertParent(this, child, 'The node before which the new node is to be inserted is not a child of this node');
  }

  uncheckedRemove(node);
  uncheckedInsertBefore(this, node, child);
  return node;
}

function contains(this: ParentNode, node: Node | null): boolean {
  if (node != null) {
    assertNode(node);

    return uncheckedContains(this, node);
  }
  return false;
}

function removeChild<T extends Node>(this: Node, child: T): T {
  assertChildNode(child);
  assertParent(this, child, 'The node to be removed is not a child of this node');

  uncheckedRemove(child);
  return child;
}

function replaceChild<T extends Node>(this: ParentNode, node: Node, child: T): T {
  assertChildNode(node);
  assertNode(child);
  assertParent(this, child, 'The node to be replaced is not a child of this node');

  uncheckedRemove(node);
  uncheckedInsertBefore(this, node, child);
  uncheckedRemove(child);
  return child;
}
