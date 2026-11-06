import type { ChildNode } from './ChildNode.ts';
import type { ParentNode } from './ParentNode.ts';

export function uncheckedInsertBefore(parent: ParentNode, node: ChildNode, child: ChildNode): void {
  const { previousSibling } = child;

  parent['_notifyChildrenChanged']();

  node.parentNode = parent;

  node.nextSibling = child;
  child.previousSibling = node;

  if (previousSibling !== null) {
    previousSibling.nextSibling = node;
    node.previousSibling = previousSibling;
  } else {
    parent.firstChild = node;
  }
}
