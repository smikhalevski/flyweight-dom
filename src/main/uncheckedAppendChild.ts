import type { ChildNode } from './ChildNode.js';
import type { ParentNode } from './ParentNode.js';

export function uncheckedAppendChild(parent: ParentNode, node: ChildNode): void {
  const { lastChild } = parent;

  parent['_notifyChildrenChanged']();

  node.parentNode = parent;
  parent.lastChild = node;

  if (lastChild !== null) {
    lastChild.nextSibling = node;
    node.previousSibling = lastChild;
  } else {
    parent.firstChild = node;
  }
}
