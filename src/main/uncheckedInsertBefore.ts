import type { ChildNode } from './ChildNode.ts';
import type { ParentNode } from './ParentNode.ts';

export function uncheckedInsertBefore(parent: ParentNode, node: ChildNode, referenceChild: ChildNode): void {
  const { previousSibling } = referenceChild;

  parent['_notifyChildrenChanged']();

  node.parentNode = parent;

  node.nextSibling = referenceChild;
  referenceChild.previousSibling = node;

  if (previousSibling !== null) {
    previousSibling.nextSibling = node;
    node.previousSibling = previousSibling;
  } else {
    parent.firstChild = node;
  }
}
