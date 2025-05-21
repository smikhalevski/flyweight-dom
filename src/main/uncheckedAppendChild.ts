import { isElement } from './utils.js';
import { ParentNode } from './ParentNode.js';
import { ChildNode } from './ChildNode.js';

export function uncheckedAppendChild(parent: ParentNode, node: ChildNode): void {
  const childNodes = parent['_childNodes'];
  const children = parent['_children'];

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
