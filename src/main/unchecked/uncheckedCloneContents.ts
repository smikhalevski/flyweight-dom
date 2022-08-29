import { ParentNode } from '../extendsParentNode';
import { isElement } from './utils';
import { ChildNode } from '../extendsChildNode';

/**
 * @internal
 * Appends cloned child nodes from the origin to the parent.
 */
export function uncheckedCloneContents(origin: ParentNode, parent: ParentNode): void {
  const { firstChild } = origin;

  if (!firstChild) {
    // The parent has no children
    return;
  }

  let { lastChild, lastElementChild } = parent;

  const parentElement = isElement(parent) ? parent : parent.parentElement;

  for (let child: ChildNode | null = firstChild; child; child = child.nextSibling) {
    const node = child.cloneNode(true);

    node.parentNode = parent;
    node.parentElement = parentElement;

    node.previousSibling = lastChild;
    node.previousElementSibling = lastElementChild;

    if (lastChild) {
      lastChild.nextSibling = node;
    }
    lastChild = node;

    if (!isElement(node)) {
      continue;
    }

    if (lastElementChild) {
      lastElementChild.nextElementSibling = node;
    }
    lastElementChild = node;
  }

  parent.lastChild = lastChild;
  parent.lastElementChild = lastElementChild;
}
