import { Node } from './Node';
import { ParentNode } from './constructParentNode';
import { ChildNode } from './constructChildNode';
import {
  assertChildNode,
  assertInsertableNode,
  assertParent,
  uncheckedContains,
  uncheckedRemoveAndAppendChild,
  uncheckedRemoveAndInsertBefore,
  uncheckedRemoveChild,
} from './unchecked';

export function constructNode(node: Node, nodeType: number, nodeName: string): void {
  node.nodeType = nodeType;
  node.nodeName = nodeName;

  node.startIndex = node.endIndex = -1;

  node.parentNode =
    node.parentElement =
    node.previousSibling =
    node.nextSibling =
    node.firstChild =
    node.lastChild =
    node.nodeValue =
    node.textContent =
    node._childNodes =
      null;
}

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
  // uncheckedAppendChild(this, node as any);

  // if (node.parentNode != null) {
  //   uncheckedRemove(node.parentNode, node as any);
  // }
  // uncheckedAppendChild(this, node as any);

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
  return node != null ? uncheckedContains(this, node) : false;
}

function removeChild<T extends Node>(this: Node, child: T): T {
  assertChildNode(child);

  if (child.parentNode != null) {
    assertParent(this, child, 'The node to be removed is not a child of this node');
    uncheckedRemoveChild(child.parentNode, child);
  }
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
  child: Node | null,
  message: string
): asserts child is ChildNode {
  if (child != null) {
    assertParent(parent, child, message);
  }
  assertInsertableNode(parent, node);
  uncheckedRemoveAndInsertBefore(parent, node, child);
}
