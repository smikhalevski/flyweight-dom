import { Node } from './Node.js';
import { ParentNode } from './ParentNode.js';
import { Text } from './Text.js';
import { ChildNode } from './ChildNode.js';
import { DocumentFragment } from './DocumentFragment.js';
import { uncheckedContains } from './uncheckedContains.js';

export type InsertableNode = DocumentFragment | ChildNode;

export function assertInsertableNode(parent: ParentNode, node: Node): asserts node is InsertableNode {
  const { nodeType } = node;

  if (nodeType === Node.DOCUMENT_NODE || nodeType === Node.ATTRIBUTE_NODE) {
    throw new Error('Node cannot be a child');
  }

  if (uncheckedContains(node, parent)) {
    throw new Error('The new child element contains the parent');
  }
}

export function assertInsertable(parent: ParentNode, node: Node | string): asserts node is InsertableNode | string {
  if (typeof node !== 'string') {
    assertInsertableNode(parent, node);
  }
}

export function uncheckedToInsertableNode(node: Node | string): InsertableNode {
  return typeof node === 'string' ? new Text(node) : (node as InsertableNode);
}
