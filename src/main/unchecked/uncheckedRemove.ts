import { ChildNode } from '../extendsChildNode';
import { isElement } from './utils';

/**
 * Removes a child from its parent, or no-op if child has no parent.
 */
export function uncheckedRemove(child: ChildNode): void {
  const { parentNode, previousSibling, nextSibling, previousElementSibling, nextElementSibling } = child;

  if (!parentNode) {
    return;
  }

  const { _childNodes: childNodes, _children: children } = parentNode;

  childNodes?.splice(childNodes.indexOf(child), 1);

  if (previousSibling) {
    previousSibling.nextSibling = nextSibling;
    previousSibling.nextElementSibling = nextElementSibling;
  } else {
    parentNode.firstChild = nextSibling;
  }

  if (nextSibling) {
    nextSibling.previousSibling = previousSibling;
    nextSibling.previousElementSibling = previousElementSibling;
  } else {
    parentNode.lastChild = previousSibling;
  }

  child.parentNode =
    child.parentElement =
    child.previousSibling =
    child.nextSibling =
    child.previousElementSibling =
    child.nextElementSibling =
      null;

  if (!isElement(child)) {
    return;
  }
  --parentNode.childElementCount;

  children?.splice(children.indexOf(child), 1);

  if (previousElementSibling) {
    previousElementSibling.nextElementSibling = nextElementSibling;
  } else {
    parentNode.firstElementChild = nextElementSibling;
  }

  if (nextElementSibling) {
    nextElementSibling.previousElementSibling = previousElementSibling;
  } else {
    parentNode.lastElementChild = previousElementSibling;
  }
}
