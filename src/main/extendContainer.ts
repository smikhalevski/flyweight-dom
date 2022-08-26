import { Node } from './Node';
import {
  assertNoCyclicReference,
  assertNode,
  assertParent,
  managesChildNodes,
  uncheckedAppendChild,
  uncheckedInsertBefore,
  uncheckedPrependChild,
  uncheckedRemove,
} from './node-utils';

export function extendContainer(prototype: Node): void {
  prototype.hasChildNodes = hasChildNodes;
  prototype.appendChild = appendChild;
  prototype.insertBefore = insertBefore;
  prototype.removeChild = removeChild;
  prototype.replaceChild = replaceChild;
}

function hasChildNodes(this: Node): boolean {
  return this.firstChild !== null;
}

function appendChild<T extends Node>(this: Node, node: T): T {
  assertNode(node);
  assertNoCyclicReference(this, node);

  uncheckedRemove(node);
  uncheckedAppendChild(this, node);

  if (managesChildNodes(this)) {
    this.childNodes.push(node);
  }
  return node;
}

function insertBefore<T extends Node>(this: Node, node: T, child: Node | null): T {
  assertNode(node);
  assertNoCyclicReference(this, node);

  if (child != null) {
    assertNode(child);
    assertParent(this, child, 'The node before which the new node is to be inserted is not a child of this node');

    uncheckedRemove(node);
    uncheckedInsertBefore(this, node, child);

    if (managesChildNodes(this)) {
      const { childNodes } = this;

      childNodes.splice(childNodes.indexOf(child), 0, node);
    }
  } else {
    uncheckedRemove(node);
    uncheckedPrependChild(this, node);

    if (managesChildNodes(this)) {
      this.childNodes.unshift(node);
    }
  }
  return node;
}

function removeChild<T extends Node>(this: Node, child: T): T {
  assertNode(child);
  assertParent(this, child, 'The node to be removed is not a child of this node');

  if (managesChildNodes(this)) {
    const { childNodes } = this;

    childNodes.splice(childNodes.indexOf(child), 1);
  }
  uncheckedRemove(child);
  return child;
}

function replaceChild<T extends Node>(this: Node, node: Node, child: T): T {
  assertNode(node);
  assertNode(child);
  assertParent(this, child, 'The node to be replaced is not a child of this node');

  // if (managesChildNodes(this)) {
  //   const { _childNodes } = this;
  //
  //   _childNodes[_childNodes.indexOf(child)] = node;
  // }
  uncheckedRemove(node);
  uncheckedInsertBefore(this, node, child);
  uncheckedRemove(child);
  return child;
}
