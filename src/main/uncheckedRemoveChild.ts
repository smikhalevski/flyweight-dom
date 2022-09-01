import { ChildNode } from './extendChildNode';
import { ParentNode } from './extendParentNode';
import { isElement } from './utils';

/**
 * Removes a child from its parent.
 */
export function uncheckedRemoveChild(parent: ParentNode, child: ChildNode): void {
  const { previousSibling, nextSibling, previousElementSibling, nextElementSibling } = child;
  const { _childNodes: childNodes, _children: children } = parent;

  childNodes?.splice(childNodes.indexOf(child), 1);

  child.parentNode = child.parentElement = null;

  if (previousSibling != null) {
    previousSibling.nextSibling = nextSibling;
    previousSibling.nextElementSibling = nextElementSibling;
    child.previousSibling = child.previousElementSibling = null;
  } else {
    parent.firstChild = nextSibling;
  }

  if (nextSibling != null) {
    nextSibling.previousSibling = previousSibling;
    nextSibling.previousElementSibling = previousElementSibling;
    child.nextSibling = child.nextElementSibling = null;
  } else {
    parent.lastChild = previousSibling;
  }

  if (!isElement(child)) {
    return;
  }

  children?.splice(children.indexOf(child), 1);

  --parent.childElementCount;

  if (previousElementSibling != null) {
    previousElementSibling.nextElementSibling = nextElementSibling;
  } else {
    parent.firstElementChild = nextElementSibling;
  }

  if (nextElementSibling != null) {
    nextElementSibling.previousElementSibling = previousElementSibling;
  } else {
    parent.lastElementChild = previousElementSibling;
  }
}
