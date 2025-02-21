import { Node } from './Node';
import { ParentNode } from './ParentNode';
import { Text } from './Text';
import { die, MutableChildNode, MutableDocumentFragment } from './utils';
import { uncheckedContains } from './uncheckedContains';

export type InsertableNode = MutableDocumentFragment | MutableChildNode;

export function assertInsertableNode(parent: ParentNode, node: Node): asserts node is InsertableNode {
  const { nodeType } = node;

  if (nodeType === Node.DOCUMENT_NODE || nodeType === Node.ATTRIBUTE_NODE) {
    die('Node cannot be a child');
  }
  if (uncheckedContains(node, parent)) {
    die('The new child element contains the parent');
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
