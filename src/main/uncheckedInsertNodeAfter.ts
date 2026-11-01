import type { ChildNode } from './ChildNode.js';
import type { ParentNode } from './ParentNode.js';
import { uncheckedRemoveAndAppendChild } from './uncheckedRemoveAndAppendChild.js';
import { uncheckedRemoveAndInsertBefore } from './uncheckedRemoveAndInsertBefore.js';
import { uncheckedToInsertableNode } from './uncheckedToInsertableNode.js';
import { isDocumentFragment } from './utils.js';

/**
 * Inserts the value after the anchor, or as the first child if the anchor is `null`, and returns the anchor for the
 * next value. Skips `null` and `undefined`, and inserts other values that aren't nodes as text.
 *
 * Inserting each value after the previous one keeps values in order without checking which siblings are among the
 * inserted values. If the anchor is itself among the values, it is moved when its turn comes, and values inserted
 * before that end up in front of it. So the result is the same as inserting a fragment of all values, see
 * [converting nodes into a node](https://dom.spec.whatwg.org/#converting-nodes-into-a-node).
 */
export function uncheckedInsertNodeAfter(
  parent: ParentNode,
  value: unknown,
  anchor: ChildNode | null
): ChildNode | null {
  const node = uncheckedToInsertableNode(value);

  if (node === null) {
    return anchor;
  }

  const child = anchor !== null ? anchor.nextSibling : parent.firstChild;

  if (child === node) {
    // Already in place, and inserting a node before itself would break sibling links
    return node;
  }

  // A fragment is replaced by its children, so the next value goes after its last child
  const nextAnchor = isDocumentFragment(node) ? (node.lastChild !== null ? node.lastChild : anchor) : node;

  if (child !== null) {
    uncheckedRemoveAndInsertBefore(parent, node, child);
  } else {
    uncheckedRemoveAndAppendChild(parent, node);
  }
  return nextAnchor;
}
