import { ParentNode } from '../extendsParentNode';
import { ChildNode } from '../extendsChildNode';
import { isElement } from './utils';

/**
 * @internal
 * Updates the parent and the node, so node is the last child of the parent.
 */
export function uncheckedAppendChild(parent: ParentNode, node: ChildNode): void {
  const { lastChild, lastElementChild, _childNodes: childNodes, _children: children } = parent;

  if (childNodes) {
    childNodes.push(node);
  }

  node.parentNode = parent;
  node.parentElement = isElement(parent) ? parent : parent.parentElement;
  parent.lastChild = node;

  if (!lastChild) {
    // The parent has no children
    parent.firstChild = node;

    if (!isElement(node)) {
      return;
    }
    if (children) {
      children.push(node);
    }
    parent.firstElementChild = parent.lastElementChild = node;
    return;
  }

  lastChild.nextSibling = node;
  node.previousSibling = lastChild;
  node.previousElementSibling = lastElementChild;

  if (!isElement(node)) {
    return;
  }
  if (children) {
    children.push(node);
  }

  lastChild.nextElementSibling = node;
  parent.lastElementChild = node;

  if (lastElementChild) {
    lastElementChild.nextElementSibling = node;
  } else {
    parent.firstElementChild = node;
  }
}
