import type { ChildNode } from './ChildNode.js';
import type { DocumentFragment } from './DocumentFragment.js';
import { Node } from './Node.js';
import type { ParentNode } from './ParentNode.js';
import { Text } from './Text.js';
import { uncheckedContains } from './uncheckedContains.js';
import { ATTRIBUTE_NODE, coerceToString, DOCUMENT_NODE } from './utils.js';

export type InsertableNode = DocumentFragment | ChildNode;

export function assertInsertableNode(parent: ParentNode, node: Node): asserts node is InsertableNode {
  const { nodeType } = node;

  if (nodeType === DOCUMENT_NODE || nodeType === ATTRIBUTE_NODE) {
    throw new Error('Node cannot be a child');
  }

  if (uncheckedContains(node, parent)) {
    throw new Error('The new child element contains the parent');
  }
}

export function assertInsertable(parent: ParentNode, value: unknown): void {
  if (value instanceof Node) {
    assertInsertableNode(parent, value);
  }
}

/**
 * Returns the node, or a text node with the stringified value, or `null` if the value is `null` or `undefined`, so it
 * is skipped.
 */
export function uncheckedToInsertableNode(value: unknown): InsertableNode | null {
  if (value instanceof Node) {
    return value as InsertableNode;
  }
  return value === null || value === undefined ? null : new Text(coerceToString(value));
}
