import { ParentNode } from './extendParentNode';
import { ChildNode } from './extendChildNode';
import { isElement } from './utils';

/**
 * Appends cloned child nodes from the origin to the parent.
 */
export function uncheckedCloneContents(origin: ParentNode, parent: ParentNode): void {
  const { firstChild } = origin;

  if (firstChild == null) {
    // The parent has no children
    return;
  }

  let { lastChild, lastElementChild } = parent;

  const parentElement = isElement(parent) ? parent : parent.parentElement;

  for (let child: ChildNode | null = firstChild; child != null; child = child.nextSibling) {
    const node = child.cloneNode(true);

    node.parentNode = parent;
    node.parentElement = parentElement;

    node.previousSibling = lastChild;
    node.previousElementSibling = lastElementChild;

    if (lastChild != null) {
      lastChild.nextSibling = node;
    }
    lastChild = node;

    if (!isElement(node)) {
      continue;
    }

    if (lastElementChild != null) {
      lastElementChild.nextElementSibling = node;
    }
    lastElementChild = node;
  }

  parent.lastChild = lastChild;
  parent.lastElementChild = lastElementChild;
}
