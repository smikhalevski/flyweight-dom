import { ChildNode } from './ChildNode';
import { ParentNode } from './ParentNode';
import { CHILD_NODES, CHILDREN, isElement } from './utils';

export function uncheckedRemoveChild(parent: ParentNode, child: ChildNode): void {
  const childNodes = parent[CHILD_NODES];
  const children = parent[CHILDREN];

  const { previousSibling, nextSibling } = child;

  childNodes?.splice(childNodes.indexOf(child), 1);

  if (isElement(child)) {
    children?.splice(children.indexOf(child), 1);
  }

  child.parentNode = null;

  if (previousSibling != null) {
    previousSibling.nextSibling = nextSibling;
    child.previousSibling = null;
  } else {
    parent.firstChild = nextSibling;
  }

  if (nextSibling != null) {
    nextSibling.previousSibling = previousSibling;
    child.nextSibling = null;
  } else {
    parent.lastChild = previousSibling;
  }
}
