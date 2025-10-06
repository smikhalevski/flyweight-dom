import type { ParentNode } from './ParentNode.js';
import type { ChildNode } from './ChildNode.js';

export function uncheckedInsertBefore(parent: ParentNode, node: ChildNode, child: ChildNode): void {
  const { previousSibling } = child;

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
