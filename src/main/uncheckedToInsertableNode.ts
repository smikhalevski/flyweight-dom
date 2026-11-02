import type { ChildNode } from './ChildNode.js';
import type { DocumentFragment } from './DocumentFragment.js';
import type { Node } from './Node.js';
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

/**
 * Throws if the value can't be inserted into the parent. Primitives can be inserted, since they are converted to text.
 */
export function assertInsertable(parent: ParentNode, value: unknown): void {
  if (typeof value === 'function') {
    throw new Error('The value must be a Node or a primitive');
  }

  if (typeof value !== 'object' || value === null) {
    return;
  }

  if (typeof (value as Node).nodeType !== 'number') {
    throw new Error('The value must be a Node or a primitive');
  }

  assertInsertableNode(parent, value as Node);
}

/**
 * Returns the node, or a text node with the stringified value, or `null` if the value is `null` or `undefined`, so it
 * is skipped.
 *
 * **Note:** The value must be checked by {@link assertInsertable}, so an object is always a node.
 */
export function uncheckedToInsertableNode(value: unknown): InsertableNode | null {
  if (typeof value === 'object' && value !== null) {
    return value as InsertableNode;
  }
  return value === null || value === undefined ? null : new Text(coerceToString(value));
}
