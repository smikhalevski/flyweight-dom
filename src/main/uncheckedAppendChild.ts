import { isElement, MutableChildNode, MutableParentNode } from './utils';

export function uncheckedAppendChild(parent: MutableParentNode, node: MutableChildNode): void {
  const childNodes = parent._childNodes;
  const children = parent._children;

  const { lastChild } = parent;

  childNodes?.push(node);

  if (isElement(node)) {
    children?.push(node);
  }

  node.parentNode = parent;
  parent.lastChild = node;

  if (lastChild !== null) {
    lastChild.nextSibling = node;
    node.previousSibling = lastChild;
  } else {
    parent.firstChild = node;
  }
}
