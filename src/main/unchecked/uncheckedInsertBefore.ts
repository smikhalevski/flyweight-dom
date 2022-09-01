import { ParentNode } from '../constructParentNode';
import { ChildNode } from '../constructChildNode';
import { isElement } from './utils';

/**
 * Inserts the node before the child in parent.
 */
export function uncheckedInsertBefore(parent: ParentNode, node: ChildNode, child: ChildNode | null): void {
  const { _childNodes: childNodes, _children: children } = parent;

  node.parentNode = parent;
  node.parentElement = isElement(parent) ? parent : parent.parentElement;

  child ||= parent.firstChild;

  if (child == null) {
    // The parent has no children
    parent.firstChild = parent.lastChild = node;

    childNodes?.push(node);

    if (!isElement(node)) {
      return;
    }
    ++parent.childElementCount;

    children?.push(node);

    parent.firstElementChild = parent.lastElementChild = node;
    return;
  }

  const { previousSibling, previousElementSibling } = child;
  const nextElementSibling = isElement(child) ? child : child.nextElementSibling;

  node.nextSibling = child;
  node.nextElementSibling = nextElementSibling;
  child.previousSibling = node;

  if (previousSibling != null) {
    previousSibling.nextSibling = node;
    node.previousSibling = previousSibling;
    node.previousElementSibling = previousElementSibling;

    childNodes?.splice(childNodes.indexOf(child), 0, node);
  } else {
    parent.firstChild = node;

    childNodes?.unshift(node);
  }

  if (!isElement(node)) {
    return;
  }
  ++parent.childElementCount;

  child.previousElementSibling = node;

  if (nextElementSibling == null) {
    parent.lastElementChild = node;

    if (previousElementSibling != null) {
      previousElementSibling.nextElementSibling = node;
    } else {
      parent.firstElementChild = node;
    }

    children?.push(node);
    return;
  }

  nextElementSibling.previousElementSibling = node;
  node.nextElementSibling = nextElementSibling;

  if (previousElementSibling == null) {
    parent.firstElementChild = node;

    children?.unshift(node);
    return;
  }

  previousElementSibling.nextElementSibling = node;
  node.previousElementSibling = previousElementSibling;

  children?.splice(children.indexOf(nextElementSibling), 0, node);
}
