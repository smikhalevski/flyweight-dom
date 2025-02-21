import { InternalChildNode, InternalParentNode, isElement } from './utils';

export function uncheckedRemoveChild(parent: InternalParentNode, child: InternalChildNode): void {
  const childNodes = parent._childNodes;
  const children = parent._children;

  const { previousSibling, nextSibling } = child;

  childNodes?.splice(childNodes.indexOf(child), 1);

  if (isElement(child)) {
    children?.splice(children.indexOf(child), 1);
  }

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
