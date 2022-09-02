import { ParentNode } from './extendParentNode';
import { ChildNode } from './extendChildNode';
import { isElement } from './utils';

export function uncheckedAppendChild(parent: ParentNode, node: ChildNode): void {
  const { lastChild, _childNodes: childNodes, _children: children } = parent;

  childNodes?.push(node);

  node.parentNode = parent;
  parent.lastChild = node;

  if (lastChild !== null) {
    lastChild.nextSibling = node;
    node.previousSibling = lastChild;
  } else {
    parent.firstChild = node;
  }
  if (children !== undefined && isElement(node)) {
    children.push(node);
  }
}
