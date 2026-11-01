import type { ChildNode } from './ChildNode.js';
import type { ParentNode } from './ParentNode.js';
import { uncheckedRemoveAndAppendChild } from './uncheckedRemoveAndAppendChild.js';
import { uncheckedRemoveAndInsertBefore } from './uncheckedRemoveAndInsertBefore.js';
import { uncheckedToInsertableNode } from './uncheckedToInsertableNode.js';

/**
 * Inserts nodes before the child, or appends them if the child is `null`. Skips `null` and `undefined`, and inserts
 * other values that aren't nodes as text.
 *
 * The child must not be one of the inserted nodes, otherwise sibling links become cyclic.
 */
export function uncheckedInsertNodes(parent: ParentNode, nodes: ArrayLike<unknown>, child: ChildNode | null): void {
  for (let i = 0; i < nodes.length; ++i) {
    const node = uncheckedToInsertableNode(nodes[i]);

    if (node === null) {
      continue;
    }

    if (child !== null) {
      uncheckedRemoveAndInsertBefore(parent, node, child);
    } else {
      uncheckedRemoveAndAppendChild(parent, node);
    }
  }
}
