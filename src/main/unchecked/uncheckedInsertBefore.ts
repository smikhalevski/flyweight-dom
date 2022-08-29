import { ParentNode } from '../extendsParentNode';
import { ChildNode } from '../extendsChildNode';
import { isElement } from './utils';

/**
 * Inserts the node before the child in parent.
 */
export function uncheckedInsertBefore(parent: ParentNode, node: ChildNode, child: ChildNode | null): void {
  const { _childNodes: childNodes, _children: children } = parent;

  node.parentNode = parent;
  node.parentElement = isElement(parent) ? parent : parent.parentElement;

  child ||= parent.firstChild;

  if (!child) {
    parent.firstChild = parent.lastChild = node;

    if (childNodes) {
      childNodes.push(node);
    }
    if (!isElement(node)) {
      return;
    }
    if (children) {
      children.push(node);
    }
    parent.firstElementChild = parent.lastElementChild = node;
    return;
  }

  const { previousSibling, previousElementSibling } = child;
  const nextElementSibling = isElement(child) ? child : child.nextElementSibling;

  node.nextSibling = child;
  node.nextElementSibling = nextElementSibling;
  child.previousSibling = node;

  if (previousSibling) {
    previousSibling.nextSibling = node;
    node.previousSibling = previousSibling;
    node.previousElementSibling = previousElementSibling;

    if (childNodes) {
      childNodes.splice(childNodes.indexOf(child), 0, node);
    }
  } else {
    parent.firstChild = node;

    if (childNodes) {
      childNodes.unshift(node);
    }
  }

  if (!isElement(node)) {
    return;
  }

  child.previousElementSibling = node;

  if (!nextElementSibling) {
    parent.lastElementChild = node;

    if (previousElementSibling) {
      previousElementSibling.nextElementSibling = node;
    } else {
      parent.firstElementChild = node;
    }

    if (children) {
      children.push(node);
    }
    return;
  }

  nextElementSibling.previousElementSibling = node;
  node.nextElementSibling = nextElementSibling;

  if (!previousElementSibling) {
    parent.firstElementChild = node;

    if (children) {
      children.unshift(node);
    }
    return;
  }

  previousElementSibling.nextElementSibling = node;
  node.previousElementSibling = previousElementSibling;

  if (children) {
    children.splice(children.indexOf(nextElementSibling), 0, node);
  }
}
