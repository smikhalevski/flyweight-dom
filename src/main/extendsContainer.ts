import { Node } from './Node';
import { ParentNode } from './extendsParentNode';
import { ChildNode } from './extendsChildNode';
import {
  assertChildNode,
  assertInsertableNode,
  assertNode,
  assertParent,
  uncheckedContains,
  uncheckedRemove,
  uncheckedRemoveAndAppendChild,
  uncheckedRemoveAndInsertBefore,
} from './unchecked';

/**
 * Enables child nodes manipulation methods for {@link Node} subclasses.
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
  return this.firstChild != null;
}

function appendChild<T extends Node>(this: ParentNode, node: T): T {
  assertInsertableNode(this, node);
  uncheckedRemoveAndAppendChild(this, node);
  return node;
}

function insertBefore<T extends Node>(this: ParentNode, node: T, child: Node | null): T {
  unboundInsertBefore(
    this,
    node,
    child,
    'The node before which the new node is to be inserted is not a child of this node'
  );
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
  unboundInsertBefore(this, node, child, 'The node to be replaced is not a child of this node');
  uncheckedRemove(child);
  return child;
}

function unboundInsertBefore(
  parent: ParentNode,
  node: Node,
  child: Node | null,
  message: string
): asserts child is ChildNode {
  if (child != null) {
    assertNode(child);
    assertParent(parent, child, message);
  }
  assertInsertableNode(parent, node);
  uncheckedRemoveAndInsertBefore(parent, node, child);
}
