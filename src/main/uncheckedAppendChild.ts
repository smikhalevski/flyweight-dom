import { ParentNode } from './ParentNode';
import { ChildNode } from './ChildNode';
import { isElement } from './utils';

export function uncheckedAppendChild(parent: ParentNode, node: ChildNode): void {
  const { _childNodes, _children, lastChild } = parent;

  _childNodes?.push(node);

  if (isElement(node)) {
    _children?.push(node);
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
