import { ParentNode } from './ParentNode.js';
import { ChildNode } from './ChildNode.js';

export function uncheckedRemoveChild(parent: ParentNode, child: ChildNode): void {
  const { previousSibling, nextSibling } = child;

  child.parentNode = null;

  if (previousSibling !== null) {
    previousSibling.nextSibling = nextSibling;
    child.previousSibling = null;
  } else {
    parent.firstChild = nextSibling;
  }

  if (nextSibling !== null) {
    nextSibling.previousSibling = previousSibling;
    child.nextSibling = null;
  } else {
    parent.lastChild = previousSibling;
  }
}
