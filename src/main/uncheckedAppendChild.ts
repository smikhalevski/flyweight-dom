import { ParentNode } from './ParentNode';
import { ChildNode } from './ChildNode';
import { CHILD_NODES, CHILDREN, isElement } from './utils';

export function uncheckedAppendChild(parent: ParentNode, node: ChildNode): void {
  const childNodes = parent[CHILD_NODES];
  const children = parent[CHILDREN];

  const { lastChild } = parent;

  childNodes?.push(node);

  if (isElement(node)) {
    children?.push(node);
  }

  node.parentNode = parent;
  parent.lastChild = node;

  if (lastChild != null) {
    lastChild.nextSibling = node;
    node.previousSibling = lastChild;
  } else {
    parent.firstChild = node;
  }
}
