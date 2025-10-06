import type { ParentNode } from './ParentNode.js';
import type { ChildNode } from './ChildNode.js';
import type { InsertableNode } from './uncheckedToInsertableNode.js';
import { uncheckedRemoveChild } from './uncheckedRemoveChild.js';
import { uncheckedInsertBefore } from './uncheckedInsertBefore.js';
import { isDocumentFragment } from './utils.js';

export function uncheckedRemoveAndInsertBefore(parent: ParentNode, node: InsertableNode, child: ChildNode): void {
  if (isDocumentFragment(node)) {
    let nodeChild = node.firstChild;

    while (nodeChild !== null) {
      const { nextSibling } = nodeChild;

      uncheckedInsertBefore(parent, nodeChild, child);
      nodeChild = nextSibling;
    }

    node.firstChild = node.lastChild = null;
    return;
  }

  const { parentNode } = node;

  if (parentNode !== null) {
    uncheckedRemoveChild(parentNode, node);
  }

  uncheckedInsertBefore(parent, node, child);
}
