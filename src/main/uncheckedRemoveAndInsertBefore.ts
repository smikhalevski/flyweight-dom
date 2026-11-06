import type { ChildNode } from './ChildNode.ts';
import type { ParentNode } from './ParentNode.ts';
import { uncheckedInsertBefore } from './uncheckedInsertBefore.ts';
import { uncheckedRemoveChild } from './uncheckedRemoveChild.ts';
import type { InsertableNode } from './uncheckedToInsertableNode.ts';
import { isDocumentFragment } from './utils.ts';

export function uncheckedRemoveAndInsertBefore(
  parent: ParentNode,
  node: InsertableNode,
  referenceChild: ChildNode
): void {
  if (isDocumentFragment(node)) {
    node['_notifyChildrenChanged']();

    let fragmentChild = node.firstChild;

    while (fragmentChild !== null) {
      const { nextSibling } = fragmentChild;

      uncheckedInsertBefore(parent, fragmentChild, referenceChild);
      fragmentChild = nextSibling;
    }

    node.firstChild = node.lastChild = null;
    return;
  }

  const { parentNode } = node;

  if (parentNode !== null) {
    uncheckedRemoveChild(parentNode, node);
  }

  uncheckedInsertBefore(parent, node, referenceChild);
}
