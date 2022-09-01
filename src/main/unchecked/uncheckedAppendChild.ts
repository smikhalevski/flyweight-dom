import { ParentNode } from '../constructParentNode';
import { ChildNode } from '../constructChildNode';
import { isElement } from './utils';

/**
 * Appends a node as the last child to the parent.
 */
export function uncheckedAppendChild(parent: ParentNode, node: ChildNode): void {
  const { lastChild, lastElementChild, _childNodes: childNodes, _children: children } = parent;

  childNodes?.push(node);

  node.parentNode = parent;
  node.parentElement = isElement(parent) ? parent : parent.parentElement;
  parent.lastChild = node;

  if (lastChild == null) {
    // The parent has no children
    parent.firstChild = node;

    if (!isElement(node)) {
      return;
    }
    ++parent.childElementCount;

    children?.push(node);

    parent.firstElementChild = parent.lastElementChild = node;
    return;
  }

  lastChild.nextSibling = node;
  node.previousSibling = lastChild;
  node.previousElementSibling = lastElementChild;

  if (!isElement(node)) {
    return;
  }
  ++parent.childElementCount;

  children?.push(node);

  lastChild.nextElementSibling = node;
  parent.lastElementChild = node;

  if (lastElementChild != null) {
    lastElementChild.nextElementSibling = node;
  } else {
    parent.firstElementChild = node;
  }
}
