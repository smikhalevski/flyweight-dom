import { ParentNode } from './ParentNode.js';
import { ChildNode } from './ChildNode.js';

export function uncheckedAppendChild(parent: ParentNode, node: ChildNode): void {
  const { lastChild } = parent;

  node.parentNode = parent;
  parent.lastChild = node;

  if (lastChild !== null) {
    lastChild.nextSibling = node;
    node.previousSibling = lastChild;
  } else {
    parent.firstChild = node;
  }
}
