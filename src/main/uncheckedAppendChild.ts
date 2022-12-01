import { ParentNode } from './extendParentNode';
import { ChildNode } from './extendChildNode';

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
